'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';
import { AncientEngravings } from './AncientEngravings';

export function InnerRing() {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const ring4Ref = useRef<THREE.Group>(null);

  // Memoized shared materials
  const { bronzeMaterial, goldMaterial } = useMemo(() => {
    return {
      bronzeMaterial: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.antiqueBronze,
        roughness: 0.32,
        metalness: 0.9,
      }),
      goldMaterial: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.warmGold,
        roughness: 0.25,
        metalness: 0.94,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      bronzeMaterial.dispose();
      goldMaterial.dispose();
    };
  }, [bronzeMaterial, goldMaterial]);

  useFrame((_, delta) => {
    // Read from store directly (0 React reconciliations)
    const speedMult = 1.0 + chronosStore.activationProgress * 3.5;

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

  return (
    <group>
      {/* 1. Primary Meridian Ring (Radius 3.3) */}
      <group ref={ring1Ref}>
        <mesh castShadow receiveShadow material={bronzeMaterial}>
          <torusGeometry args={[3.3, 0.13, 16, 80]} />
        </mesh>
        <mesh position={[0, 0, 0.04]} material={goldMaterial}>
          <torusGeometry args={[3.45, 0.04, 12, 80]} />
        </mesh>
        <AncientEngravings
          radius={3.28}
          count={56}
          majorInterval={4}
          color={CHRONOS_PALETTE.warmGold}
          depth={0.12}
        />
        {/* Gimbal Axis Pivot Pins */}
        <mesh position={[0, 3.3, 0]} material={goldMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        </mesh>
        <mesh position={[0, -3.3, 0]} material={goldMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        </mesh>
      </group>

      {/* 2. Solstitial Colure Ring (Radius 2.65, inclined) */}
      <group ref={ring2Ref} rotation={[0.4, 0, 0.3]}>
        <mesh castShadow receiveShadow material={goldMaterial}>
          <torusGeometry args={[2.65, 0.11, 16, 72]} />
        </mesh>
        <mesh position={[0, 0, -0.03]} material={bronzeMaterial}>
          <torusGeometry args={[2.78, 0.035, 12, 72]} />
        </mesh>
        <AncientEngravings
          radius={2.62}
          count={48}
          majorInterval={4}
          color={CHRONOS_PALETTE.goldLight}
          depth={0.1}
        />
        {/* Axis Brackets */}
        <mesh position={[2.65, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={bronzeMaterial}>
          <cylinderGeometry args={[0.07, 0.07, 0.25, 16]} />
        </mesh>
        <mesh position={[-2.65, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={bronzeMaterial}>
          <cylinderGeometry args={[0.07, 0.07, 0.25, 16]} />
        </mesh>
      </group>

      {/* 3. Ecliptic / Zodiacal Oblique Ring (Radius 2.05, inclined 23.5 deg) */}
      <group ref={ring3Ref} rotation={[0.41, 0.2, -0.4]}>
        <mesh castShadow receiveShadow material={bronzeMaterial}>
          <torusGeometry args={[2.05, 0.09, 14, 64]} />
        </mesh>
        <mesh position={[0, 0, 0.025]} material={goldMaterial}>
          <torusGeometry args={[2.16, 0.03, 10, 64]} />
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
        <mesh castShadow receiveShadow material={goldMaterial}>
          <torusGeometry args={[1.45, 0.075, 12, 54]} />
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
