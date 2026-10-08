'use client';

import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';

export function ChamberFloor() {
  const steps = [
    { y: -0.3, z: 8.5, width: 14, depth: 2.2 },
    { y: -0.7, z: 10.7, width: 15, depth: 2.2 },
    { y: -1.1, z: 12.9, width: 16, depth: 2.2 },
    { y: -1.5, z: 15.1, width: 17, depth: 2.2 },
    { y: -1.9, z: 17.3, width: 18, depth: 2.2 },
  ];

  return (
    <group>
      {/* Central Circular Altar / Dais Platform directly below the Chronos Core */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[6.8, 7.4, 0.6, 64]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.darkStone}
          roughness={0.62}
          metalness={0.38}
        />
      </mesh>

      {/* Outer Dais Tier */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[9.6, 10.2, 0.4, 64]} />
        <meshStandardMaterial
          color="#11161b"
          roughness={0.68}
          metalness={0.32}
        />
      </mesh>

      {/* Engraved Concentric Astronomical Calendar Inlays on Altar Floor */}
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.65, 64]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.antiqueBronze}
          roughness={0.25}
          metalness={0.88}
        />
      </mesh>
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.1, 4.38, 64]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.warmGold}
          roughness={0.22}
          metalness={0.92}
        />
      </mesh>
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.7, 5.95, 64]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.antiqueBronze}
          roughness={0.28}
          metalness={0.85}
        />
      </mesh>

      {/* Radiating Zodiac Spokes on the Altar Floor */}
      {[0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4].map((angle, idx) => (
        <mesh
          key={`spoke-floor-${idx}`}
          position={[0, 0.208, 0]}
          rotation={[-Math.PI / 2, 0, angle]}
        >
          <planeGeometry args={[0.08, 11.6]} />
          <meshStandardMaterial
            color={CHRONOS_PALETTE.warmGold}
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>
      ))}

      {/* Main Sanctuary Floor (Under Dais) */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <boxGeometry args={[32, 0.8, 18]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.darkStone}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Ancient Tiered Stone Stairs */}
      {steps.map((step, idx) => (
        <mesh
          key={`step-${idx}`}
          position={[0, step.y, step.z]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[step.width, 0.4, step.depth]} />
          <meshStandardMaterial
            color={CHRONOS_PALETTE.darkStone}
            roughness={0.68}
            metalness={0.28}
          />
        </mesh>
      ))}

      {/* Lower Entrance Terrace Floor */}
      <mesh position={[0, -2.4, 25]} receiveShadow>
        <boxGeometry args={[34, 0.8, 16]} />
        <meshStandardMaterial
          color="#0e1216"
          roughness={0.75}
          metalness={0.25}
        />
      </mesh>
    </group>
  );
}
