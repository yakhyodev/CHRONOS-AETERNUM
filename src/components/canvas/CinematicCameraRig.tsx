'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';
import { CINEMATIC_SHOTS, type CinematicShotId } from '@/lib/constants';

interface CinematicCameraRigProps {
  currentShot: CinematicShotId;
  activationProgress?: number;
  reducedMotion?: boolean;
}

export function CinematicCameraRig({
  currentShot,
  activationProgress = 0,
  reducedMotion = false,
}: CinematicCameraRigProps) {
  const { camera, size } = useThree();
  const targetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.2, 0));
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstRender = useRef(true);

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Responsive camera adjustments for portrait/mobile aspect ratios
  useEffect(() => {
    const isMobile = size.width < 768;
    const config = CINEMATIC_SHOTS.find((s) => s.id === currentShot) || CINEMATIC_SHOTS[0];

    // Kill any active running camera tween
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
    }

    const duration = reducedMotion ? 0.1 : 2.2;
    const targetPos = new THREE.Vector3(...config.targetPosition);

    // On mobile, back up slightly along Z to preserve monumental framing
    const camZMultiplier = isMobile ? 1.25 : 1.0;
    const camXMultiplier = isMobile ? 0.7 : 1.0;
    const endPos = {
      x: config.cameraPosition[0] * camXMultiplier,
      y: config.cameraPosition[1],
      z: config.cameraPosition[2] * camZMultiplier,
    };

    const targetFov = isMobile ? config.fov + 8 : config.fov;

    // First render immediate snap
    if (isFirstRender.current) {
      isFirstRender.current = false;
      camera.position.set(endPos.x, endPos.y, endPos.z);
      targetRef.current.copy(targetPos);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
      return;
    }

    const tl = gsap.timeline();
    activeTimelineRef.current = tl;

    tl.to(camera.position, {
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      duration,
      ease: 'power2.inOut',
    });

    tl.to(
      targetRef.current,
      {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration,
        ease: 'power2.inOut',
      },
      0
    );

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isMobile ? config.fov + 8 : config.fov;
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

  // Subtle continuous cinematic sway and lookAt
  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.lookAt(targetRef.current);
      return;
    }

    const t = state.clock.getElapsedTime();
    // Gentle handheld camera breathing
    const swayX = Math.sin(t * 0.4) * 0.05 + mouseRef.current.x * 0.25;
    const swayY = Math.cos(t * 0.3) * 0.04 + mouseRef.current.y * 0.15;

    // Temporal pulse vibration during activation
    const jitter = activationProgress > 0.05 ? (Math.random() - 0.5) * 0.025 * activationProgress : 0;

    camera.position.x += (swayX + jitter) * delta * 2.0;
    camera.position.y += (swayY + jitter) * delta * 2.0;

    camera.lookAt(targetRef.current);
  });

  return null;
}
