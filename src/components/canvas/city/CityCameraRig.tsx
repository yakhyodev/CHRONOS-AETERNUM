'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  CAMERA_JOURNEY_WAYPOINTS,
  CAMERA_LOOKAT_WAYPOINTS,
} from '@/types/phase04';
import {
  DISTRICT_EXPLORE_ANCHORS,
  TEMPORAL_LENS_LANDMARKS,
  type ExploreDistrictId,
} from '@/types/phase07';
import { chronosStore } from '@/lib/chronosStore';
import type { CityViewId } from '@/types/phase03';
import { PARADOX_SEQUENCES, ENDINGS_CONFIG } from '@/types/phase09';

interface CityCameraRigProps {
  currentView?: CityViewId;
  reducedMotion?: boolean;
}

export function CityCameraRig({
  reducedMotion = false,
}: CityCameraRigProps) {
  const { camera } = useThree();

  // 1. Build smooth continuous 3D Catmull-Rom splines for Story Mode flight
  const positionSpline = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      CAMERA_JOURNEY_WAYPOINTS,
      false,
      'catmullrom',
      0.5
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
  const sampledStoryPos = useMemo(() => new THREE.Vector3(), []);
  const sampledStoryTarget = useMemo(() => new THREE.Vector3(), []);
  const exploreTargetPos = useMemo(() => new THREE.Vector3(), []);
  const exploreCamPos = useMemo(() => new THREE.Vector3(), []);
  const blendedCamPos = useMemo(() => new THREE.Vector3(), []);
  const blendedTargetPos = useMemo(() => new THREE.Vector3(), []);

  const currentLookAt = useRef(new THREE.Vector3(0, 26, -126));
  const smoothedProgress = useRef(chronosStore.journeyProgress);

  // Mode blend factor: 0.0 (Story Mode) -> 1.0 (Explore Mode)
  const modeBlend = useRef(chronosStore.experienceMode === 'explore' ? 1.0 : 0.0);

  // Pointer parallax coordinates
  const pointerPos = useRef({ x: 0, y: 0 });

  // Explore Mode orbit state
  const isOrbitDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const orbitAngles = useRef({ azimuth: 0, polar: Math.PI / 3, distance: 60 });
  const targetOrbitAngles = useRef({ azimuth: 0, polar: Math.PI / 3, distance: 60 });
  const activeDistrictRef = useRef<ExploreDistrictId>('plaza');

  // Initialize orbit from district anchor
  const syncDistrictAnchor = useCallback((districtId: ExploreDistrictId) => {
    const anchor = DISTRICT_EXPLORE_ANCHORS[districtId] || DISTRICT_EXPLORE_ANCHORS.plaza;
    const dx = anchor.cameraPosition[0] - anchor.targetPosition[0];
    const dy = anchor.cameraPosition[1] - anchor.targetPosition[1];
    const dz = anchor.cameraPosition[2] - anchor.targetPosition[2];

    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const polar = Math.acos(Math.max(-1, Math.min(1, dy / (dist || 1))));
    const azimuth = Math.atan2(dx, dz);

    targetOrbitAngles.current = {
      azimuth,
      polar: Math.max(anchor.minPolarAngle, Math.min(anchor.maxPolarAngle, polar)),
      distance: Math.max(anchor.minDistance, Math.min(anchor.maxDistance, dist)),
    };
    activeDistrictRef.current = districtId;
  }, []);

  // Listen to pointer for parallax and explore orbit
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      pointerPos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerPos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isOrbitDragging.current && chronosStore.experienceMode === 'explore') {
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;
        dragStart.current = { x: e.clientX, y: e.clientY };

        const anchor = DISTRICT_EXPLORE_ANCHORS[chronosStore.exploreDistrict] || DISTRICT_EXPLORE_ANCHORS.plaza;

        targetOrbitAngles.current.azimuth -= deltaX * 0.006;
        targetOrbitAngles.current.polar = Math.max(
          anchor.minPolarAngle,
          Math.min(anchor.maxPolarAngle, targetOrbitAngles.current.polar + deltaY * 0.005)
        );
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      // Only drag if left click and not clicking UI overlays
      if (e.button === 0 && chronosStore.experienceMode === 'explore') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'CANVAS' || target.closest('[data-explore-canvas]')) {
          isOrbitDragging.current = true;
          dragStart.current = { x: e.clientX, y: e.clientY };
        }
      }
    };

    const handlePointerUp = () => {
      isOrbitDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (chronosStore.experienceMode === 'explore') {
        const anchor = DISTRICT_EXPLORE_ANCHORS[chronosStore.exploreDistrict] || DISTRICT_EXPLORE_ANCHORS.plaza;
        const zoomDelta = e.deltaY * 0.06;
        targetOrbitAngles.current.distance = Math.max(
          anchor.minDistance,
          Math.min(anchor.maxDistance, targetOrbitAngles.current.distance + zoomDelta)
        );
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useFrame((state, delta) => {
    const isExplore = chronosStore.experienceMode === 'explore';
    const targetModeBlend = isExplore ? 1.0 : 0.0;
    const blendSpeed = Math.min(delta * 3.5, 0.3);

    modeBlend.current += (targetModeBlend - modeBlend.current) * blendSpeed;

    // 1. STORY MODE SPLINE CALCULATION
    const targetProgress = chronosStore.journeyProgress;
    const progressLerp = reducedMotion ? 1.0 : Math.min(delta * 3.5, 0.25);
    smoothedProgress.current += (targetProgress - smoothedProgress.current) * progressLerp;

    const clampedProgress = Math.max(0.0001, Math.min(0.9999, smoothedProgress.current));
    positionSpline.getPointAt(clampedProgress, sampledStoryPos);
    targetSpline.getPointAt(clampedProgress, sampledStoryTarget);

    // 2. EXPLORE MODE ORBIT CALCULATION
    if (activeDistrictRef.current !== chronosStore.exploreDistrict) {
      syncDistrictAnchor(chronosStore.exploreDistrict);
    }

    const anchor = DISTRICT_EXPLORE_ANCHORS[chronosStore.exploreDistrict] || DISTRICT_EXPLORE_ANCHORS.plaza;

    // Smooth orbit dampening
    const orbitDamp = Math.min(delta * 8.0, 0.4);
    orbitAngles.current.azimuth += (targetOrbitAngles.current.azimuth - orbitAngles.current.azimuth) * orbitDamp;
    orbitAngles.current.polar += (targetOrbitAngles.current.polar - orbitAngles.current.polar) * orbitDamp;
    orbitAngles.current.distance += (targetOrbitAngles.current.distance - orbitAngles.current.distance) * orbitDamp;

    // Determine target center (either landmark if Temporal Lens is inspecting, or district center)
    let targetCenter: [number, number, number] = anchor.targetPosition;
    if (chronosStore.temporalLens.active && chronosStore.temporalLens.landmarkId) {
      const landmarkCfg = TEMPORAL_LENS_LANDMARKS[chronosStore.temporalLens.landmarkId];
      if (landmarkCfg) {
        targetCenter = landmarkCfg.center;
      }
    }

    exploreTargetPos.set(targetCenter[0], targetCenter[1], targetCenter[2]);

    const sinP = Math.sin(orbitAngles.current.polar);
    const cosP = Math.cos(orbitAngles.current.polar);
    const sinA = Math.sin(orbitAngles.current.azimuth);
    const cosA = Math.cos(orbitAngles.current.azimuth);
    const dist = orbitAngles.current.distance;

    exploreCamPos.set(
      targetCenter[0] + dist * sinP * sinA,
      targetCenter[1] + dist * cosP,
      targetCenter[2] + dist * sinP * cosA
    );

    // 3. SEAMLESS BLEND BETWEEN STORY SPLINE AND EXPLORE ORBIT
    const t = modeBlend.current;
    blendedCamPos.lerpVectors(sampledStoryPos, exploreCamPos, t);
    blendedTargetPos.lerpVectors(sampledStoryTarget, exploreTargetPos, t);

    // 3.5 PARADOX FINALE & ENDINGS CAMERA DIRECTING
    let targetFov = isExplore ? 50.0 : clampedProgress > 0.35 && clampedProgress < 0.6 ? 56.0 : 53.0;

    if (chronosStore.paradoxState !== 'inactive') {
      const seqCfg = PARADOX_SEQUENCES[chronosStore.paradoxSequenceIndex];
      if (seqCfg && seqCfg.targetWorld === 'city') {
        const shot = seqCfg.cameraShot;
        blendedCamPos.set(shot.position[0], shot.position[1], shot.position[2]);
        blendedTargetPos.set(shot.target[0], shot.target[1], shot.target[2]);
        targetFov = shot.fov;
      }
    } else if (chronosStore.isFinaleCompleted && chronosStore.selectedEnding) {
      const endCfg = ENDINGS_CONFIG[chronosStore.selectedEnding];
      if (endCfg) {
        const shot = endCfg.cameraEndShot;
        blendedCamPos.set(shot.position[0], shot.position[1], shot.position[2]);
        blendedTargetPos.set(shot.target[0], shot.target[1], shot.target[2]);
        targetFov = shot.fov;
      }
    }

    // 4. Subtle, bounded breathing & mouse parallax (non-cumulative)
    const time = state.clock.getElapsedTime();
    const motionMultiplier = reducedMotion ? 0.05 : 1.0;
    const swayX = Math.sin(time * 0.35) * 0.25 * motionMultiplier * (1 - t * 0.5);
    const swayY = Math.cos(time * 0.45) * 0.18 * motionMultiplier * (1 - t * 0.5);
    const parallaxX = pointerPos.current.x * 1.5 * motionMultiplier * (1 - t * 0.6);
    const parallaxY = pointerPos.current.y * 1.0 * motionMultiplier * (1 - t * 0.6);

    camera.position.set(
      blendedCamPos.x + swayX + parallaxX,
      blendedCamPos.y + swayY + parallaxY,
      blendedCamPos.z
    );

    // 5. LookAt target interpolation
    currentLookAt.current.lerp(blendedTargetPos, Math.min(delta * 6.0, 0.4));
    camera.lookAt(currentLookAt.current);

    // 6. Dynamic FOV
    if ('fov' in camera && Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov += (targetFov - camera.fov) * Math.min(delta * 3.0, 0.15);
      camera.updateProjectionMatrix();
    }

    // 7. Update cameraController status in store during transition
    if (t > 0.02 && t < 0.98) {
      if (chronosStore.cameraController !== 'transitioning') {
        chronosStore.setCameraController('transitioning');
      }
    } else if (isExplore) {
      const desiredCtrl = chronosStore.temporalLens.active ? 'inspecting' : 'exploring';
      if (chronosStore.cameraController !== desiredCtrl) {
        chronosStore.setCameraController(desiredCtrl);
      }
    } else {
      if (chronosStore.cameraController !== 'cinematic') {
        chronosStore.setCameraController('cinematic');
      }
    }

    // 8. Synchronize active segment in story mode
    if (!isExplore) {
      const activeSeg = chronosStore.getSegmentFromProgress(clampedProgress);
      if (activeSeg.id !== chronosStore.currentSegment) {
        chronosStore.setCurrentSegment(activeSeg.id);
      }
    }
  });

  return null;
}

