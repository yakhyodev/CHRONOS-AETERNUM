'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';

interface AncientEngravingsProps {
  radius: number;
  count?: number;
  majorInterval?: number;
  color?: string;
  depth?: number;
}

export function AncientEngravings({
  radius,
  count = 48,
  majorInterval = 4,
  color = CHRONOS_PALETTE.warmGold,
  depth = 0.25,
}: AncientEngravingsProps) {
  // Generate procedural tick marks and celestial glyphs along the circular face
  const tickData = useMemo(() => {
    const ticks: {
      angle: number;
      isMajor: boolean;
      width: number;
      length: number;
    }[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const isMajor = i % majorInterval === 0;
      ticks.push({
        angle,
        isMajor,
        width: isMajor ? 0.04 : 0.02,
        length: isMajor ? 0.22 : 0.12,
      });
    }

    return ticks;
  }, [count, majorInterval]);

  return (
    <group>
      {tickData.map((tick, i) => {
        const x = Math.cos(tick.angle) * radius;
        const y = Math.sin(tick.angle) * radius;

        return (
          <group
            key={`tick-${i}`}
            position={[x, y, depth / 2 + 0.005]}
            rotation={[0, 0, tick.angle + Math.PI / 2]}
          >
            <mesh>
              <boxGeometry args={[tick.width, tick.length, 0.015]} />
              <meshStandardMaterial
                color={tick.isMajor ? color : CHRONOS_PALETTE.antiqueBronze}
                roughness={0.25}
                metalness={0.9}
              />
            </mesh>

            {/* Symmetrical back face engraving */}
            <mesh position={[0, 0, -depth - 0.01]}>
              <boxGeometry args={[tick.width, tick.length, 0.015]} />
              <meshStandardMaterial
                color={tick.isMajor ? color : CHRONOS_PALETTE.antiqueBronze}
                roughness={0.25}
                metalness={0.9}
              />
            </mesh>

            {/* Ancient celestial diamond notch on major cardinal points */}
            {tick.isMajor && i % (majorInterval * 3) === 0 && (
              <mesh position={[0, tick.length / 2 + 0.06, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.07, 0.07, 0.02]} />
                <meshStandardMaterial
                  color={CHRONOS_PALETTE.goldLight}
                  roughness={0.2}
                  metalness={0.95}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
