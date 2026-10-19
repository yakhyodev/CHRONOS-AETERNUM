'use client';

import { useMemo } from 'react';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { getRealRockPBR, getRealMetalPBR } from '@/lib/pbrTextures';

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

  const { rockPBR, metalPBR } = useMemo(() => {
    return {
      rockPBR: getRealRockPBR(2, 6),
      metalPBR: getRealMetalPBR(2, 1),
    };
  }, []);

  return (
    <group>
      {columnPositions.map(([x, y, z], index) => {
        const isOuter = Math.abs(x) > 10;
        const width = isOuter ? 1.8 : 1.5;
        const height = isOuter ? 22 : 20;
        const hasSentinel = !isOuter && (z === -1 || z === 6);

        return (
          <group key={`col-${index}`} position={[x, y, z]}>
            {/* Stepped Column Plinth & Base */}
            <mesh position={[0, -height / 2 + 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[width + 1.1, 0.8, width + 1.1]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.darkStone}
                normalMap={rockPBR.normalMap}
                roughnessMap={rockPBR.roughnessMap}
                roughness={0.68}
                metalness={0.28}
              />
            </mesh>
            <mesh position={[0, -height / 2 + 1.0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.58, width * 0.68, 0.6, 24]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.antiqueBronze}
                normalMap={metalPBR.normalMap}
                roughness={0.32}
                metalness={0.85}
              />
            </mesh>

            {/* Main Column Shaft with high-poly fluted segments & PBR rock normal map */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[width / 2, width / 2 + 0.12, height, 24]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.darkStone}
                normalMap={rockPBR.normalMap}
                roughnessMap={rockPBR.roughnessMap}
                roughness={0.62}
                metalness={0.32}
              />
            </mesh>

            {/* Mid-Shaft Engraved Bronze & Gold Astral Bands */}
            <mesh position={[0, -2.5, 0]}>
              <cylinderGeometry args={[width / 2 + 0.09, width / 2 + 0.09, 0.45, 24]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.antiqueBronze}
                normalMap={metalPBR.normalMap}
                roughness={0.28}
                metalness={0.88}
              />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[width / 2 + 0.07, width / 2 + 0.07, 0.35, 24]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.warmGold}
                normalMap={metalPBR.normalMap}
                emissive="#4a2c08"
                emissiveIntensity={0.4}
                roughness={0.24}
                metalness={0.92}
              />
            </mesh>

            {/* Column Capital */}
            <mesh position={[0, height / 2 - 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[width + 1.0, 1.2, width + 1.0]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.darkStone}
                normalMap={rockPBR.normalMap}
                roughnessMap={rockPBR.roughnessMap}
                roughness={0.68}
                metalness={0.25}
              />
            </mesh>

            {/* Ancient Bronze Collar Trim */}
            <mesh position={[0, height / 2 - 1.4, 0]}>
              <cylinderGeometry args={[width / 2 + 0.08, width / 2 + 0.08, 0.4, 24]} />
              <meshStandardMaterial
                color={CHRONOS_PALETTE.antiqueBronze}
                normalMap={metalPBR.normalMap}
                roughness={0.3}
                metalness={0.88}
              />
            </mesh>

            {/* Monumental Hooded Sentinel Statue on Inner Nave Plinths (Art Direction Reference) */}
            {hasSentinel && (
              <group
                position={[x < 0 ? 1.35 : -1.35, -height / 2 + 0.8, 0]}
                rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
              >
                {/* Pedestal */}
                <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.4, 1.8, 1.4]} />
                  <meshStandardMaterial
                    color="#14191f"
                    normalMap={rockPBR.normalMap}
                    roughness={0.6}
                    metalness={0.35}
                  />
                </mesh>
                {/* Draped Guardian Robes */}
                <mesh position={[0, 3.2, 0]} castShadow>
                  <cylinderGeometry args={[0.45, 0.72, 2.8, 16]} />
                  <meshStandardMaterial
                    color="#1c2229"
                    normalMap={rockPBR.normalMap}
                    roughness={0.5}
                    metalness={0.45}
                  />
                </mesh>
                {/* Sculpted Shoulders & Cowl */}
                <mesh position={[0, 4.7, 0]} castShadow>
                  <cylinderGeometry args={[0.55, 0.48, 0.8, 16]} />
                  <meshStandardMaterial
                    color="#1f252d"
                    normalMap={rockPBR.normalMap}
                    roughness={0.48}
                    metalness={0.48}
                  />
                </mesh>
                <mesh position={[0, 5.35, 0.05]} castShadow>
                  <sphereGeometry args={[0.38, 16, 16]} />
                  <meshStandardMaterial
                    color="#181d24"
                    normalMap={rockPBR.normalMap}
                    roughness={0.45}
                    metalness={0.5}
                  />
                </mesh>
                {/* Golden Staff of Time held by Sentinel */}
                <mesh position={[0, 3.6, 0.55]} castShadow>
                  <cylinderGeometry args={[0.035, 0.04, 3.8, 12]} />
                  <meshStandardMaterial
                    color={CHRONOS_PALETTE.warmGold}
                    metalness={0.95}
                    roughness={0.2}
                  />
                </mesh>
                <mesh position={[0, 5.55, 0.55]}>
                  <torusGeometry args={[0.18, 0.03, 10, 24]} />
                  <meshStandardMaterial
                    color={CHRONOS_PALETTE.warmGold}
                    emissive="#ff9d2e"
                    emissiveIntensity={1.2}
                    metalness={0.95}
                    roughness={0.15}
                  />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
