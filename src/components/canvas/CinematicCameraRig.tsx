'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';
import { CINEMATIC_SHOTS, type CinematicShotId } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';
import { PARADOX_SEQUENCES } from '@/types/phase09';

interface CinematicCameraRigProps {
  currentShot: CinematicShotId;
  reducedMotion?: boolean;
}

export function CinematicCameraRig({
  currentShot,
  reducedMotion = false,
}: CinematicCameraRigProps) {
  const { camera, size } = useThree();

  // Stable authored base positions (GSAP modifies these; procedural effects add to them without drift)
  const baseCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 26));
  const baseTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.2, 0));
  
  // Reusable vector for lookAt calculations to avoid GC allocations in useFrame
  const tempLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.2, 0));

  // Damped mouse parallax
  const mouseTarget = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseDamped = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstRender = useRef(true);

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Authored shot transitions via GSAP tweening base positions
  useEffect(() => {
    const isMobile = size.width < 768;
    const config = CINEMATIC_SHOTS.find((s) => s.id === currentShot) || CINEMATIC_SHOTS[0];

    // Cancel existing active camera timeline
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
    }

    const duration = reducedMotion ? 0.05 : 2.0;

    // Mobile aspect ratio compensation (backs up along Z and reduces X width)
    const camZMultiplier = isMobile ? 1.25 : 1.0;
    const camXMultiplier = isMobile ? 0.7 : 1.0;
    let targetCamPos = {
      x: config.cameraPosition[0] * camXMultiplier,
      y: config.cameraPosition[1],
      z: config.cameraPosition[2] * camZMultiplier,
    };
    let targetLookAtPos = {
      x: config.targetPosition[0],
      y: config.targetPosition[1],
      z: config.targetPosition[2],
    };
    let targetFov = isMobile ? config.fov + 8 : config.fov;

    // Check for active Paradox finale chamber sequence
    if (chronosStore.paradoxState !== 'inactive') {
      const seqCfg = PARADOX_SEQUENCES[chronosStore.paradoxSequenceIndex];
      if (seqCfg && seqCfg.targetWorld === 'chamber') {
        targetCamPos = {
          x: seqCfg.cameraShot.position[0] * camXMultiplier,
          y: seqCfg.cameraShot.position[1],
          z: seqCfg.cameraShot.position[2] * camZMultiplier,
        };
        targetLookAtPos = {
          x: seqCfg.cameraShot.target[0],
          y: seqCfg.cameraShot.target[1],
          z: seqCfg.cameraShot.target[2],
        };
        targetFov = isMobile ? seqCfg.cameraShot.fov + 6 : seqCfg.cameraShot.fov;
      }
    }

    // First render immediate placement without tween delay
    if (isFirstRender.current) {
      isFirstRender.current = false;
      baseCameraPos.current.set(targetCamPos.x, targetCamPos.y, targetCamPos.z);
      baseTargetPos.current.set(targetLookAtPos.x, targetLookAtPos.y, targetLookAtPos.z);
      camera.position.copy(baseCameraPos.current);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
      return;
    }

    // Context-safe GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        chronosStore.setIsTransitioning(false);
      },
    });
    activeTimelineRef.current = tl;
    chronosStore.setIsTransitioning(true);

    tl.to(
      baseCameraPos.current,
      {
        x: targetCamPos.x,
        y: targetCamPos.y,
        z: targetCamPos.z,
        duration,
        ease: 'power2.inOut',
      },
      0
    );

    tl.to(
      baseTargetPos.current,
      {
        x: targetLookAtPos.x,
        y: targetLookAtPos.y,
        z: targetLookAtPos.z,
        duration,
        ease: 'power2.inOut',
      },
      0
    );

    if (camera instanceof THREE.PerspectiveCamera) {
      tl.to(
        camera,
        {
          fov: targetFov,
          duration,
          ease: 'power2.inOut',
          onUpdate: () => camera.updateProjectionMatrix(),
        },
        0
      );
    }

    return () => {
      tl.kill();
    };
  }, [currentShot, camera, size.width, reducedMotion]);

  // Frame loop: computes non-cumulative procedural offsets relative to base positions
  useFrame((state, delta) => {
    const isReduced = reducedMotion || chronosStore.reducedMotion;

    if (isReduced) {
      camera.position.copy(baseCameraPos.current);
      camera.lookAt(baseTargetPos.current);
      return;
    }

    const t = state.clock.getElapsedTime();
    const actProgress = chronosStore.activationProgress;

    // Damped mouse tracking (low-pass filter)
    mouseDamped.current.x += (mouseTarget.current.x - mouseDamped.current.x) * Math.min(delta * 4.0, 1.0);
    mouseDamped.current.y += (mouseTarget.current.y - mouseDamped.current.y) * Math.min(delta * 4.0, 1.0);

    // Subtle bounded organic breathing
    const swayX = Math.sin(t * 0.4) * 0.06 + mouseDamped.current.x * 0.28;
    const swayY = Math.cos(t * 0.3) * 0.05 + mouseDamped.current.y * 0.16;

    // Bounded deterministic high-frequency harmonics during activation (NO Math.random() drift)
    const shakeX = actProgress > 0.02 ? Math.sin(t * 43.7) * Math.cos(t * 19.3) * 0.02 * actProgress : 0;
    const shakeY = actProgress > 0.02 ? Math.cos(t * 37.1) * Math.sin(t * 23.9) * 0.015 * actProgress : 0;
    const shakeZ = actProgress > 0.02 ? Math.sin(t * 31.4) * 0.012 * actProgress : 0;

    // Set absolute position relative to authored base (ZERO cumulative drift)
    camera.position.set(
      baseCameraPos.current.x + swayX + shakeX,
      baseCameraPos.current.y + swayY + shakeY,
      baseCameraPos.current.z + shakeZ
    );

    // Compute lookAt target with subtle parallax lead
    tempLookAt.current.set(
      baseTargetPos.current.x + mouseDamped.current.x * 0.08,
      baseTargetPos.current.y + mouseDamped.current.y * 0.06,
      baseTargetPos.current.z
    );

    camera.lookAt(tempLookAt.current);
  });

  return null;
}
