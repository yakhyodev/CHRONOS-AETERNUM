'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';

export function Braziers() {
  const lightRefs = useRef<THREE.PointLight[]>([]);

  const brazierPositions: [number, number, number][] = useMemo(
    () => [
      [-6.5, -0.6, 9],
      [6.5, -0.6, 9],
      [-7.5, -1.4, 14],
      [7.5, -1.4, 14],
      [-8.5, -2.1, 19],
      [8.5, -2.1, 19],
    ],
    []
  );

  const { stoneMat, bronzeMat, flameMat } = useMemo(() => {
    return {
      stoneMat: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.darkStone,
        roughness: 0.85,
        metalness: 0.2,
      }),
      bronzeMat: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.antiqueBronze,
        roughness: 0.4,
        metalness: 0.8,
      }),
      flameMat: new THREE.MeshBasicMaterial({ color: CHRONOS_PALETTE.emberLight }),
    };
  }, []);

  useEffect(() => {
    return () => {
      stoneMat.dispose();
      bronzeMat.dispose();
      flameMat.dispose();
    };
  }, [stoneMat, bronzeMat, flameMat]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const actProgress = chronosStore.activationProgress;
    lightRefs.current.forEach((light, i) => {
      if (light) {
        // Organic flicker
        const flicker = Math.sin(t * 3.5 + i * 1.7) * 0.15 + Math.cos(t * 7.1 + i) * 0.08;
        light.intensity = (0.7 + flicker) * (1 + actProgress * 0.5);
      }
    });
  });

  return (
    <group>
      {brazierPositions.map(([x, y, z], idx) => (
        <group key={`brazier-${idx}`} position={[x, y, z]}>
          {/* Stone Pedestal */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow material={stoneMat}>
            <cylinderGeometry args={[0.35, 0.45, 0.8, 12]} />
          </mesh>

          {/* Bronze Fire Bowl */}
          <mesh position={[0, 0.9, 0]} castShadow material={bronzeMat}>
            <cylinderGeometry args={[0.5, 0.25, 0.35, 16]} />
          </mesh>

          {/* Glowing Ember Flame Core */}
          <mesh position={[0, 1.15, 0]} material={flameMat}>
            <octahedronGeometry args={[0.22, 1]} />
          </mesh>

          {/* Localized warm light */}
          <pointLight
            ref={(el) => {
              if (el) lightRefs.current[idx] = el;
            }}
            position={[0, 1.25, 0]}
            color={CHRONOS_PALETTE.emberGlow}
            intensity={0.8}
            distance={8}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}
