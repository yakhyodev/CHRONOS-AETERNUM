'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { QualityPreset } from '@/lib/chronosStore';
import { WorldLighting } from './WorldLighting';
import { WorldTerrain } from './WorldTerrain';
import { ChronosPlaza } from './ChronosPlaza';
import { OldDistrict } from './OldDistrict';
import { RiverCrossing } from './RiverCrossing';
import { IndustrialQuarter } from './IndustrialQuarter';
import { Observatory } from './Observatory';
import { TemporalEchoesLayer } from './TemporalEchoesLayer';
import { TemporalLensGhost } from './TemporalLensGhost';
import { TemporalFracture } from './TemporalFracture';
import { chronosStore } from '@/lib/chronosStore';

interface AeternumWorldProps {
  qualityPreset?: QualityPreset;
}

export function AeternumWorld({ qualityPreset = 'high' }: AeternumWorldProps) {
  const hazePointsRef = useRef<THREE.Points>(null);

  // Atmospheric sunset ember / haze particles
  const particleCount = qualityPreset === 'high' ? 240 : qualityPreset === 'medium' ? 140 : 60;

  const { positions, hazeMaterial } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 220;
      pos[i * 3 + 1] = Math.random() * 45 + 2;
      pos[i * 3 + 2] = -50 - Math.random() * 200;
    }

    const mat = new THREE.PointsMaterial({
      size: 0.65,
      color: '#FFA85C',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { positions: pos, hazeMaterial: mat };
  }, [particleCount]);

  useEffect(() => {
    return () => {
      hazeMaterial.dispose();
    };
  }, [hazeMaterial]);

  useFrame((state, delta) => {
    if (chronosStore.isTimeFrozen) return;

    if (hazePointsRef.current) {
      hazePointsRef.current.rotation.y += delta * 0.015;
      const t = state.clock.getElapsedTime();
      hazeMaterial.opacity = 0.45 + Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <group name="AeternumWorld_2026">
      {/* 1. Cinematic Sunset Sky and Directional Lighting */}
      <WorldLighting qualityPreset={qualityPreset} />

      {/* 2. World Topography, Plateau, Terraces and Roads */}
      <WorldTerrain />

      {/* 3. District 01: Chronos Plaza & Monumental Clock Tower */}
      <ChronosPlaza />

      {/* 4. District 02: Old District (Western Quarter) */}
      <OldDistrict />

      {/* 5. District 03: River Crossing (Eastern Quarter) */}
      <RiverCrossing />

      {/* 6. District 04: Industrial Quarter (Southwestern District) */}
      <IndustrialQuarter />

      {/* 7. District 05: The Observatory (Northern Elevated Hill) */}
      <Observatory />

      {/* 8. Phase 07: Discoverable Temporal Echoes in Districts */}
      <TemporalEchoesLayer />

      {/* 9. Phase 07: Temporal Lens Holographic Alternate-Era Preview */}
      <TemporalLensGhost />

      {/* 10. Phase 09: Paradox Finale Temporal Fracture (Five Eras Collision) */}
      <TemporalFracture qualityPreset={qualityPreset} />

      {/* 11. Atmospheric Sunset Floating Embers */}
      <points ref={hazePointsRef} material={hazeMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
      </points>
    </group>
  );
}
