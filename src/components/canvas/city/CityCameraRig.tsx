'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  CAMERA_JOURNEY_WAYPOINTS,
  CAMERA_LOOKAT_WAYPOINTS,
} from '@/types/phase04';
import { chronosStore } from '@/lib/chronosStore';
import type { CityViewId } from '@/types/phase03';

interface CityCameraRigProps {
  currentView?: CityViewId;
  reducedMotion?: boolean;
}

export function CityCameraRig({
  reducedMotion = false,
}: CityCameraRigProps) {
  const { camera } = useThree();

  // 1. Build smooth continuous 3D Catmull-Rom splines for position & lookAt target
  const positionSpline = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      CAMERA_JOURNEY_WAYPOINTS,
      false, // non-closed loop
      'catmullrom',
      0.5 // tension
    );
  }, []);

  const targetSpline = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      CAMERA_LOOKAT_WAYPOINTS,
      false,
      'catmullrom',
      0.5
    );
  }, []);

  // Temporary vectors for per-frame allocations-free sampling
  const sampledPos = useMemo(() => new THREE.Vector3(), []);
  const sampledTarget = useMemo(() => new THREE.Vector3(), []);
  const currentLookAt = useRef(new THREE.Vector3(0, 26, -126));

  // Damped progress tracking for cinematic smoothness
  const smoothedProgress = useRef(0);

  // Pointer parallax coordinates
  const pointerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      pointerPos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerPos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  useFrame((state, delta) => {
    // 2. Read continuous journeyProgress from store (driven by scroll or chapter jump)
    const targetProgress = chronosStore.journeyProgress;

    // Smooth damp towards the target progress
    const progressLerp = reducedMotion ? 1.0 : Math.min(delta * 3.5, 0.25);
    smoothedProgress.current +=
      (targetProgress - smoothedProgress.current) * progressLerp;

    const clampedProgress = Math.max(
      0.0001,
      Math.min(0.9999, smoothedProgress.current)
    );

    // 3. Sample 3D position and lookAt along the splines with arc-length parametrization
    positionSpline.getPointAt(clampedProgress, sampledPos);
    targetSpline.getPointAt(clampedProgress, sampledTarget);

    // 4. Subtle, bounded breathing & mouse parallax (strictly non-cumulative)
    const time = state.clock.getElapsedTime();
    const motionMultiplier = reducedMotion ? 0.05 : 1.0;

    const swayX = Math.sin(time * 0.35) * 0.35 * motionMultiplier;
    const swayY = Math.cos(time * 0.45) * 0.22 * motionMultiplier;
    const parallaxX = pointerPos.current.x * 1.8 * motionMultiplier;
    const parallaxY = pointerPos.current.y * 1.2 * motionMultiplier;

    // Set absolute camera position directly (eliminating any cumulative drift)
    camera.position.set(
      sampledPos.x + swayX + parallaxX,
      sampledPos.y + swayY + parallaxY,
      sampledPos.z
    );

    // 5. Smooth camera lookAt interpolation
    currentLookAt.current.lerp(
      new THREE.Vector3(
        sampledTarget.x + parallaxX * 0.25,
        sampledTarget.y + parallaxY * 0.2,
        sampledTarget.z
      ),
      Math.min(delta * 4.0, 0.3)
    );
    camera.lookAt(currentLookAt.current);

    // 6. Dynamic cinematic FOV adjustment along the flight path
    // Wider FOV (56) on grand reveals & river, tighter (50) in old district streets
    const baseFov =
      clampedProgress > 0.12 && clampedProgress < 0.35
        ? 50.0 // Narrower focal length in intimate medieval street
        : clampedProgress >= 0.35 && clampedProgress < 0.6
        ? 56.0 // Expansive wide angle for river crossing
        : 53.0; // Standard cinematic framing

    if ('fov' in camera && Math.abs(camera.fov - baseFov) > 0.05) {
      camera.fov += (baseFov - camera.fov) * Math.min(delta * 2.0, 0.1);
      camera.updateProjectionMatrix();
    }

    // 7. Synchronize active segment in store if crossing boundaries
    const activeSeg = chronosStore.getSegmentFromProgress(clampedProgress);
    if (activeSeg.id !== chronosStore.currentSegment) {
      chronosStore.setCurrentSegment(activeSeg.id);
    }
  });

  return null;
}
