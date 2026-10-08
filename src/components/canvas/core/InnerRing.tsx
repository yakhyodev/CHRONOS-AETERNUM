'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { AncientEngravings } from './AncientEngravings';

interface InnerRingProps {
  activationProgress?: number;
}

export function InnerRing({ activationProgress = 0 }: InnerRingProps) {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const ring4Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Base speed + smooth acceleration on activation
    const speedMult = 1.0 + activationProgress * 3.5;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.y += delta * 0.12 * speedMult;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.18 * speedMult;
      ring2Ref.current.rotation.z += delta * 0.05 * speedMult;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.22 * speedMult;
      ring3Ref.current.rotation.y += delta * 0.1 * speedMult;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.y -= delta * 0.3 * speedMult;
      ring4Ref.current.rotation.x += delta * 0.15 * speedMult;
    }
  });

  const bronzeMaterial = new THREE.MeshStandardMaterial({
    color: CHRONOS_PALETTE.antiqueBronze,
    roughness: 0.32,
    metalness: 0.9,
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: CHRONOS_PALETTE.warmGold,
    roughness: 0.25,
    metalness: 0.94,
  });

  return (
    <group>
      {/* 1. Primary Meridian Ring (Radius 3.3) */}
      <group ref={ring1Ref}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[3.3, 0.13, 16, 80]} />
          <primitive object={bronzeMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <torusGeometry args={[3.45, 0.04, 12, 80]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <AncientEngravings
          radius={3.28}
          count={56}
          majorInterval={4}
          color={CHRONOS_PALETTE.warmGold}
          depth={0.12}
        />
        {/* Gimbal Axis Pivot Pins */}
        <mesh position={[0, 3.3, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -3.3, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
      </group>

      {/* 2. Solstitial Colure Ring (Radius 2.65, inclined) */}
      <group ref={ring2Ref} rotation={[0.4, 0, 0.3]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[2.65, 0.11, 16, 72]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0, -0.03]}>
          <torusGeometry args={[2.78, 0.035, 12, 72]} />
          <primitive object={bronzeMaterial} attach="material" />
        </mesh>
        <AncientEngravings
          radius={2.62}
          count={48}
          majorInterval={4}
          color={CHRONOS_PALETTE.goldLight}
          depth={0.1}
        />
        {/* Axis Brackets */}
        <mesh position={[2.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.25, 16]} />
          <primitive object={bronzeMaterial} attach="material" />
        </mesh>
        <mesh position={[-2.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.25, 16]} />
          <primitive object={bronzeMaterial} attach="material" />
        </mesh>
      </group>

      {/* 3. Ecliptic / Zodiacal Oblique Ring (Radius 2.05, inclined 23.5 deg) */}
      <group ref={ring3Ref} rotation={[0.41, 0.2, -0.4]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[2.05, 0.09, 14, 64]} />
          <primitive object={bronzeMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <torusGeometry args={[2.16, 0.03, 10, 64]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <AncientEngravings
          radius={2.02}
          count={36}
          majorInterval={3}
          color={CHRONOS_PALETTE.warmGold}
          depth={0.08}
        />
      </group>

      {/* 4. Core Horary Ring (Radius 1.45) */}
      <group ref={ring4Ref} rotation={[-0.2, 0.5, 0.1]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.45, 0.075, 12, 54]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <AncientEngravings
          radius={1.42}
          count={24}
          majorInterval={2}
          color={CHRONOS_PALETTE.goldLight}
          depth={0.06}
        />
      </group>
    </group>
  );
}
