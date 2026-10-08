'use client';

import { useMemo } from 'react';
import { CHRONOS_PALETTE } from '@/lib/constants';

export function GrandArches() {
  const archZPositions = useMemo(() => [-6, 6, 18], []);

  return (
    <group>
      {/* Transverse monumental nave arches */}
      {archZPositions.map((z, idx) => (
        <group key={`arch-${idx}`} position={[0, 16, z]}>
          {/* Main arch curve */}
          <mesh castShadow receiveShadow>
            <torusGeometry args={[8.6, 0.9, 12, 32, Math.PI]} />
            <meshStandardMaterial
              color={CHRONOS_PALETTE.darkStone}
              roughness={0.85}
              metalness={0.15}
            />
          </mesh>

          {/* Keystone / Central Arch Ornament */}
          <mesh position={[0, 8.6, 0]} castShadow>
            <boxGeometry args={[1.4, 2.0, 1.8]} />
            <meshStandardMaterial
              color={CHRONOS_PALETTE.antiqueBronze}
              roughness={0.45}
              metalness={0.75}
            />
          </mesh>
        </group>
      ))}

      {/* Distant background chamber wall & monumental archway */}
      <group position={[0, 8, -16]}>
        {/* Massive back wall */}
        <mesh position={[0, 6, 0]} receiveShadow>
          <boxGeometry args={[44, 34, 2]} />
          <meshStandardMaterial
            color={CHRONOS_PALETTE.darkStone}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Portal arch opening relief */}
        <mesh position={[0, 0, 1.1]}>
          <torusGeometry args={[6.5, 1.2, 12, 28, Math.PI]} />
          <meshStandardMaterial
            color={CHRONOS_PALETTE.darkStone}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Distant waterfall / mystic chasm backdrop */}
        <mesh position={[0, 2, 1.2]}>
          <planeGeometry args={[11, 14]} />
          <meshBasicMaterial color="#0b1116" />
        </mesh>
      </group>

      {/* High vaulted ceiling ribs */}
      <mesh position={[0, 24, 6]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 48]} />
        <meshStandardMaterial
          color="#06070a"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
