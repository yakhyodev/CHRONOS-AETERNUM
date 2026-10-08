'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';

interface CoreLightingProps {
  shadowMapSize?: number;
  enableShadows?: boolean;
}

export function CoreLighting({
  shadowMapSize = 1024,
  enableShadows = true,
}: CoreLightingProps) {
  const topLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const actProgress = chronosStore.activationProgress;
    const t = state.clock.getElapsedTime();
    if (fillLightRef.current) {
      // Atmospheric ambient breathing
      fillLightRef.current.intensity = (1.2 + Math.sin(t * 1.5) * 0.15) * (1 + actProgress * 0.8);
    }
    if (topLightRef.current) {
      topLightRef.current.intensity = 1.2 + actProgress * 0.5;
    }
  });

  return (
    <group>
      {/* 1. Deep atmospheric base fill (controlled low intensity to maintain high contrast) */}
      <ambientLight color="#10151a" intensity={0.45} />

      {/* 2. Monumental high overhead skylight / directional shaft */}
      <directionalLight
        ref={topLightRef}
        position={[3, 22, 8]}
        color="#fff4db"
        intensity={1.2}
        castShadow={enableShadows}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0003}
      />

      {/* 3. Cool rim light from rear cavern creating column silhouettes */}
      <directionalLight
        position={[-6, 14, -18]}
        color="#223342"
        intensity={0.95}
      />

      {/* 4. Secondary warm fill light in nave */}
      <pointLight
        ref={fillLightRef}
        position={[0, 7, 10]}
        color={CHRONOS_PALETTE.emberLight}
        intensity={1.2}
        distance={26}
        decay={2}
      />
    </group>
  );
}
