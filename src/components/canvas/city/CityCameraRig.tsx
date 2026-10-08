'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CITY_VIEWS, type CityViewId } from '@/types/phase03';

interface CityCameraRigProps {
  currentView: CityViewId;
  reducedMotion?: boolean;
}

export function CityCameraRig({
  currentView = 'grand-arrival',
  reducedMotion = false,
}: CityCameraRigProps) {
  const { camera } = useThree();

  // Stable authored baselines
  const baseCameraPos = useRef(new THREE.Vector3(0, 8, -85));
  const baseTargetPos = useRef(new THREE.Vector3(0, 22, -125));
  const currentLookAt = useRef(new THREE.Vector3(0, 22, -125));

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
    const viewConfig = CITY_VIEWS[currentView] || CITY_VIEWS['grand-arrival'];
    const targetCamera = viewConfig.cameraPosition;
    const targetLook = viewConfig.targetPosition;

    // 1. Smooth, deterministic lerp toward authored shot positions
    const lerpSpeed = Math.min(delta * 2.5, 0.15);
    baseCameraPos.current.x += (targetCamera[0] - baseCameraPos.current.x) * lerpSpeed;
    baseCameraPos.current.y += (targetCamera[1] - baseCameraPos.current.y) * lerpSpeed;
    baseCameraPos.current.z += (targetCamera[2] - baseCameraPos.current.z) * lerpSpeed;

    baseTargetPos.current.x += (targetLook[0] - baseTargetPos.current.x) * lerpSpeed;
    baseTargetPos.current.y += (targetLook[1] - baseTargetPos.current.y) * lerpSpeed;
    baseTargetPos.current.z += (targetLook[2] - baseTargetPos.current.z) * lerpSpeed;

    // 2. Subtle, bounded breathing & mouse parallax (strictly non-cumulative)
    const time = state.clock.getElapsedTime();
    const motionMultiplier = reducedMotion ? 0.1 : 1.0;

    const swayX = Math.sin(time * 0.4) * 0.4 * motionMultiplier;
    const swayY = Math.cos(time * 0.5) * 0.25 * motionMultiplier;
    const parallaxX = pointerPos.current.x * 2.2 * motionMultiplier;
    const parallaxY = pointerPos.current.y * 1.5 * motionMultiplier;

    // Set absolute camera position directly (eliminating drift)
    camera.position.set(
      baseCameraPos.current.x + swayX + parallaxX,
      baseCameraPos.current.y + swayY + parallaxY,
      baseCameraPos.current.z
    );

    // 3. Smooth camera lookAt interpolation
    currentLookAt.current.lerp(baseTargetPos.current, lerpSpeed * 1.5);
    camera.lookAt(currentLookAt.current);

    // Update FOV if perspective camera
    if ('fov' in camera && Math.abs(camera.fov - viewConfig.fov) > 0.05) {
      camera.fov += (viewConfig.fov - camera.fov) * lerpSpeed;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
