'use client';

import { useMemo } from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { loadFileTexture, getRealMetalPBR, getRealRockPBR } from '@/lib/pbrTextures';

export function ChamberFloor() {
  const steps = [
    { y: -0.3, z: 8.5, width: 14, depth: 2.2 },
    { y: -0.7, z: 10.7, width: 15, depth: 2.2 },
    { y: -1.1, z: 12.9, width: 16, depth: 2.2 },
    { y: -1.5, z: 15.1, width: 17, depth: 2.2 },
    { y: -1.9, z: 17.3, width: 18, depth: 2.2 },
  ];

  const { floorNormal, floorDiffuse, metalPBR, rockPBR } = useMemo(() => {
    return {
      floorNormal: loadFileTexture('/textures/floor_normal.jpg', 6, 6, false),
      floorDiffuse: loadFileTexture('/textures/floor_diffuse.jpg', 6, 6, true),
      metalPBR: getRealMetalPBR(3, 3),
      rockPBR: getRealRockPBR(4, 2),
    };
  }, []);

  return (
    <group>
      {/* Reflective Mirror-Polished Obsidian Sanctuary Floor */}
      <mesh position={[0, -0.39, 3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[34, 28]} />
        <MeshReflectorMaterial
          blur={[300, 90]}
          resolution={512}
          mixBlur={0.85}
          mixStrength={2.2}
          roughness={0.35}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#121820"
          metalness={0.68}
          normalMap={floorNormal}
          mirror={0.65}
        />
      </mesh>

      {/* Central Circular Altar / Dais Platform directly below the Chronos Core */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[6.8, 7.4, 0.6, 64]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.darkStone}
          map={floorDiffuse}
          normalMap={floorNormal}
          roughness={0.34}
          metalness={0.55}
        />
      </mesh>

      {/* Outer Dais Tier */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[9.6, 10.2, 0.4, 64]} />
        <meshStandardMaterial
          color="#131920"
          normalMap={rockPBR.normalMap}
          roughnessMap={rockPBR.roughnessMap}
          roughness={0.45}
          metalness={0.42}
        />
      </mesh>

      {/* Engraved Concentric Astronomical Calendar Inlays on Altar Floor */}
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.68, 64]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.antiqueBronze}
          normalMap={metalPBR.normalMap}
          emissive="#4a2c0a"
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.92}
        />
      </mesh>
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.1, 4.42, 64]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.warmGold}
          normalMap={metalPBR.normalMap}
          emissive="#5c380e"
          emissiveIntensity={0.45}
          roughness={0.18}
          metalness={0.95}
        />
      </mesh>
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.7, 6.02, 64]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.antiqueBronze}
          normalMap={metalPBR.normalMap}
          emissive="#3d2208"
          emissiveIntensity={0.3}
          roughness={0.22}
          metalness={0.9}
        />
      </mesh>

      {/* Radiating Zodiac Spokes on the Altar Floor */}
      {[0, Math.PI / 6, Math.PI / 3, Math.PI / 2, (Math.PI * 2) / 3, (Math.PI * 5) / 6].map(
        (angle, idx) => (
          <mesh
            key={`spoke-floor-${idx}`}
            position={[0, 0.208, 0]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[0.09, 12.0]} />
            <meshStandardMaterial
              color={CHRONOS_PALETTE.warmGold}
              normalMap={metalPBR.normalMap}
              emissive="#4d2e08"
              emissiveIntensity={0.35}
              roughness={0.22}
              metalness={0.92}
            />
          </mesh>
        )
      )}

      {/* Main Sanctuary Sub-Foundation (Under Dais) */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <boxGeometry args={[34, 0.8, 20]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.darkStone}
          normalMap={rockPBR.normalMap}
          roughnessMap={rockPBR.roughnessMap}
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>

      {/* Ancient Tiered Stone Stairs with Gold Trim Risers */}
      {steps.map((step, idx) => (
        <group key={`step-${idx}`} position={[0, step.y, step.z]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[step.width, 0.4, step.depth]} />
            <meshStandardMaterial
              color={CHRONOS_PALETTE.darkStone}
              normalMap={rockPBR.normalMap}
              roughnessMap={rockPBR.roughnessMap}
              roughness={0.42}
              metalness={0.38}
            />
          </mesh>
          {/* Subtle bronze stair nosing inlay */}
          <mesh position={[0, 0.19, step.depth * 0.5 - 0.05]}>
            <boxGeometry args={[step.width - 0.4, 0.04, 0.08]} />
            <meshStandardMaterial
              color={CHRONOS_PALETTE.antiqueBronze}
              roughness={0.25}
              metalness={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* Lower Entrance Terrace Floor */}
      <mesh position={[0, -2.4, 25]} receiveShadow>
        <boxGeometry args={[36, 0.8, 16]} />
        <meshStandardMaterial
          color="#0e1216"
          normalMap={floorNormal}
          roughness={0.45}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}
