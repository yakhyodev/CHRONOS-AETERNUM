'use client';

import { useMemo } from 'react';
import { CHRONOS_PALETTE } from '@/lib/constants';

export function StoneColumns() {
  const columnPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const zOffsets = [-8, -1, 6, 13, 20, 27];
    zOffsets.forEach((z) => {
      // Inner colonnade
      positions.push([-8.5, 7, z]);
      positions.push([8.5, 7, z]);
      // Outer colonnade for deep parallax
      positions.push([-14.5, 8, z + 2]);
      positions.push([14.5, 8, z + 2]);
    });
    return positions;
  }, []);

  return (
    <group>
      {columnPositions.map(([x, y, z], index) => {
        const isOuter = Math.abs(x) > 10;
        const width = isOuter ? 1.8 : 1.5;
        const height = isOuter ? 22 : 20;

        return (
          <group key={`col-${index}`} position={[x, y, z]}>
            {/* Column Base */}
            <mesh position={[0, -height / 2 + 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.8, 1.2, width + 0.8]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.darkStone}
                roughness={0.85}
                metalness={0.15}
              />
            </mesh>

            {/* Main Column Shaft with fluted segments */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[width / 2, width / 2 + 0.1, height, 12]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.darkStone}
                roughness={0.8}
                metalness={0.2}
              />
            </mesh>

            {/* Column Capital */}
            <mesh position={[0, height / 2 - 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.9, 1.2, width + 0.9]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.darkStone}
                roughness={0.85}
                metalness={0.15}
              />
            </mesh>

            {/* Ancient Bronze Collar Trim */}
            <mesh position={[0, height / 2 - 1.4, 0]}>
              <cylinderGeometry args={[width / 2 + 0.08, width / 2 + 0.08, 0.4, 16]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.antiqueBronze}
                roughness={0.4}
                metalness={0.8}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
