'use client';

import { useSyncExternalStore } from 'react';
import type { QualityPreset } from '@/lib/chronosStore';
import { chronosStore } from '@/lib/chronosStore';
import { TEMPORAL_ERAS } from '@/types/phase05';
import type { HistoricalEraId } from '@/types/phase03';

interface WorldLightingProps {
  qualityPreset?: QualityPreset;
}

export function WorldLighting({ qualityPreset = 'high' }: WorldLightingProps) {
  const activeEra = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.activeEra,
    () => 'the-present' as HistoricalEraId
  );

  const eraConfig = TEMPORAL_ERAS[activeEra] || TEMPORAL_ERAS['the-present'];
  const atmosphere = eraConfig.atmosphere;

  const isHigh = qualityPreset === 'high';
  const shadowMapSize = isHigh ? 2048 : qualityPreset === 'medium' ? 1024 : 512;
  const enableShadows = qualityPreset !== 'low';

  // Era-specific sun position & directional vectors
  const sunPosition: [number, number, number] =
    activeEra === 'the-origin'
      ? [-140, 45, 60] // Low ancient dawn angle
      : activeEra === 'the-kingdom'
      ? [-100, 95, 30] // Medieval morning sun
      : activeEra === 'the-machine'
      ? [-130, 50, 50] // Industrial low twilight sun
      : activeEra === 'the-next-age'
      ? [-90, 85, -100] // High cyber zenith luminary
      : [-120, 75, 40]; // 2026 Golden hour sunset

  return (
    <group name={`WorldLighting_${activeEra}`}>
      {/* 1. Atmospheric Ambient Fill adapted to historical era */}
      <ambientLight color={atmosphere.ambientColor} intensity={atmosphere.ambientIntensity} />

      {/* 2. Hemisphere Light: Sky color bouncing from terrain */}
      <hemisphereLight
        color={atmosphere.sunColor}
        groundColor={atmosphere.skyColor}
        intensity={0.65}
      />

      {/* 3. Primary Directional Celestial Sun/Luminary */}
      <directionalLight
        position={sunPosition}
        intensity={atmosphere.sunIntensity}
        color={atmosphere.sunColor}
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
        position={[90, 80, -280]}
        intensity={0.7}
        color={activeEra === 'the-next-age' ? '#00D4FF' : '#8EB1D4'}
      />

      {/* 5. Central Chronos Plaza Ambient Uplight with Era Accent Color */}
      <pointLight
        position={[0, 14, -120]}
        intensity={3.4}
        distance={75}
        color={atmosphere.accentColor}
        decay={2}
      />

      {/* 6. Dynamic Atmospheric Fog for era aerial perspective */}
      <fogExp2 attach="fog" args={[atmosphere.fogColor, atmosphere.fogDensity]} />
    </group>
  );
}
