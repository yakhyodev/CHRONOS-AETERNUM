'use client';

import type { QualityPreset } from '@/lib/chronosStore';

interface WorldLightingProps {
  qualityPreset?: QualityPreset;
}

export function WorldLighting({ qualityPreset = 'high' }: WorldLightingProps) {
  const isHigh = qualityPreset === 'high';
  const shadowMapSize = isHigh ? 2048 : qualityPreset === 'medium' ? 1024 : 512;
  const enableShadows = qualityPreset !== 'low';

  return (
    <group>
      {/* 1. Atmospheric Sunset Ambient Fill */}
      <ambientLight color="#4A3B32" intensity={0.65} />

      {/* 2. Hemisphere Light: Warm golden sky light bouncing from cool terrain shadows */}
      <hemisphereLight
        color="#FFAE73"
        groundColor="#1D2A3A"
        intensity={0.7}
      />

      {/* 3. Primary Golden-Hour Sun (Low-angle directional light from West/Southwest) */}
      <directionalLight
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
        position={[90, 80, -280]}
        intensity={0.8}
        color="#8EB1D4"
      />

      {/* 5. Central Chronos Plaza Ambient Uplight */}
      <pointLight
        position={[0, 12, -120]}
        intensity={3.2}
        distance={70}
        color="#FFA845"
        decay={2}
      />

      {/* 6. Atmospheric Sunset Fog for rich depth and aerial perspective */}
      <fogExp2 attach="fog" args={['#2A211D', 0.0055]} />
    </group>
  );
}
