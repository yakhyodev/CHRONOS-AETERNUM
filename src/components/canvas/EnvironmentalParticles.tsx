'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';

interface EnvironmentalParticlesProps {
  count?: number;
}

export function EnvironmentalParticles({ count = 350 }: EnvironmentalParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distributed across the chamber volume
      pos[i * 3 + 0] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = Math.random() * 16;
      pos[i * 3 + 2] = (Math.random() - 0.3) * 36;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = 0.01 + Math.random() * 0.03;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return [pos, vel];
  }, [count]);

  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.07,
      color: CHRONOS_PALETTE.emberLight,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      particleMaterial.dispose();
    };
  }, [particleMaterial]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const actProgress = chronosStore.activationProgress;
    const speedMult = 1.0 + actProgress * 3.5;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      array[idx + 1] += velocities[idx + 1] * delta * 20 * speedMult;
      array[idx + 0] += velocities[idx + 0] * delta * 20 * speedMult;

      // Wrap around within chamber volume
      if (array[idx + 1] > 18) {
        array[idx + 1] = 0.2;
        array[idx + 0] = (Math.random() - 0.5) * 22;
        array[idx + 2] = (Math.random() - 0.3) * 32;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} material={particleMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
    </points>
  );
}
