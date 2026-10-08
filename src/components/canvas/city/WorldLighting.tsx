'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { QualityPreset } from '@/lib/chronosStore';
import { chronosStore } from '@/lib/chronosStore';
import { getInterpolatedAtmosphere } from '@/types/phase06';

interface WorldLightingProps {
  qualityPreset?: QualityPreset;
}

export function WorldLighting({ qualityPreset = 'high' }: WorldLightingProps) {
  const { scene } = useThree();

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);
  const plazaPointRef = useRef<THREE.PointLight>(null);

  const isHigh = qualityPreset === 'high';
  const shadowMapSize = isHigh ? 2048 : qualityPreset === 'medium' ? 1024 : 512;
  const enableShadows = qualityPreset !== 'low';

  useFrame(() => {
    // Continuous 60fps atmospheric interpolation driven by timelinePosition
    const pos = chronosStore.timelinePosition;
    const atm = getInterpolatedAtmosphere(pos);

    if (ambientRef.current) {
      ambientRef.current.color.set(atm.ambientColor);
      ambientRef.current.intensity = atm.ambientIntensity;
    }

    if (hemiRef.current) {
      hemiRef.current.color.set(atm.sunColor);
      hemiRef.current.groundColor.set(atm.skyColor);
    }

    if (sunRef.current) {
      sunRef.current.color.set(atm.sunColor);
      sunRef.current.intensity = atm.sunIntensity;
      sunRef.current.position.set(atm.sunPosition[0], atm.sunPosition[1], atm.sunPosition[2]);
    }

    if (plazaPointRef.current) {
      plazaPointRef.current.color.set(atm.accentColor);
    }

    // Dynamic scene background and fog color sync
    if (scene.background && 'set' in scene.background) {
      (scene.background as THREE.Color).set(atm.skyColor);
    }

    if (scene.fog && 'color' in scene.fog) {
      scene.fog.color.set(atm.fogColor);
      (scene.fog as THREE.FogExp2).density = atm.fogDensity;
    }
  });

  return (
    <group name="AeternumWorldLighting">
      {/* 1. Atmospheric Ambient Fill */}
      <ambientLight ref={ambientRef} color="#4A3B32" intensity={0.65} />

      {/* 2. Hemisphere Light: Sky/Ground bounce */}
      <hemisphereLight
        ref={hemiRef}
        color="#FFAE73"
        groundColor="#1D2A3A"
        intensity={0.65}
      />

      {/* 3. Primary Directional Celestial Sun/Luminary */}
      <directionalLight
        ref={sunRef}
        position={[-120, 75, 40]}
        intensity={2.8}
        color="#FFB366"
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={10}
        shadow-camera-far={450}
        shadow-camera-left={-160}
        shadow-camera-right={160}
        shadow-camera-top={160}
        shadow-camera-bottom={-160}
        shadow-bias={-0.0003}
      />

      {/* 4. Cool Mountain Rim Light (from Northeast) */}
      <directionalLight
        ref={rimRef}
        position={[90, 80, -280]}
        intensity={0.7}
        color="#8EB1D4"
      />

      {/* 5. Central Chronos Plaza Ambient Uplight with Era Accent Color */}
      <pointLight
        ref={plazaPointRef}
        position={[0, 14, -120]}
        intensity={3.4}
        distance={75}
        color="#FFA845"
        decay={2}
      />

      {/* 6. Dynamic Atmospheric Fog for era aerial perspective */}
      <fogExp2 attach="fog" args={['#2A211D', 0.009]} />
    </group>
  );
}
