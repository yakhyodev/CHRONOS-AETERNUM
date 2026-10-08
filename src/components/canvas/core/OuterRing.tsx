'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';
import { AncientEngravings } from './AncientEngravings';

export function OuterRing() {
  const slowPrecessionRef = useRef<THREE.Group>(null);

  // Memoized shared materials with cleanup
  const { bronzeMaterial, goldAccentMaterial, darkStoneMaterial } = useMemo(() => {
    return {
      bronzeMaterial: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.antiqueBronze,
        roughness: 0.35,
        metalness: 0.88,
      }),
      goldAccentMaterial: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.warmGold,
        roughness: 0.28,
        metalness: 0.92,
      }),
      darkStoneMaterial: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.darkStone,
        roughness: 0.8,
        metalness: 0.2,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      bronzeMaterial.dispose();
      goldAccentMaterial.dispose();
      darkStoneMaterial.dispose();
    };
  }, [bronzeMaterial, goldAccentMaterial, darkStoneMaterial]);

  useFrame((_, delta) => {
    if (slowPrecessionRef.current) {
      const actProgress = chronosStore.activationProgress;
      slowPrecessionRef.current.rotation.z += delta * (0.02 + actProgress * 0.08);
    }
  });

  return (
    <group rotation={[0.45, 0.25, -0.15]}>
      {/* Stone & Bronze Mounting Pedestals anchoring outer ring to the dais */}
      <group position={[0, -3.8, 0]}>
        {/* Left Pedestal Arm */}
        <mesh position={[-3.6, 1.2, 0]} rotation={[0, 0, -0.35]} castShadow material={bronzeMaterial}>
          <boxGeometry args={[0.5, 3.2, 0.6]} />
        </mesh>
        {/* Right Pedestal Arm */}
        <mesh position={[3.6, 1.2, 0]} rotation={[0, 0, 0.35]} castShadow material={bronzeMaterial}>
          <boxGeometry args={[0.5, 3.2, 0.6]} />
        </mesh>
        {/* Base Pillar Mountings */}
        <mesh position={[-4.1, 0, 0]} castShadow receiveShadow material={darkStoneMaterial}>
          <boxGeometry args={[1.2, 0.8, 1.2]} />
        </mesh>
        <mesh position={[4.1, 0, 0]} castShadow receiveShadow material={darkStoneMaterial}>
          <boxGeometry args={[1.2, 0.8, 1.2]} />
        </mesh>
      </group>

      {/* Rotating Astronomical Equatorial Ring */}
      <group ref={slowPrecessionRef}>
        {/* Main outer bronze rim */}
        <mesh castShadow receiveShadow material={bronzeMaterial}>
          <torusGeometry args={[4.0, 0.18, 16, 96]} />
        </mesh>

        {/* Outer concentric stepped gold band */}
        <mesh position={[0, 0, 0.05]} material={goldAccentMaterial}>
          <torusGeometry args={[4.22, 0.06, 12, 96]} />
        </mesh>
        <mesh position={[0, 0, -0.05]} material={goldAccentMaterial}>
          <torusGeometry args={[4.22, 0.06, 12, 96]} />
        </mesh>

        {/* Inner concentric stepped gold track */}
        <mesh material={goldAccentMaterial}>
          <torusGeometry args={[3.78, 0.07, 12, 96]} />
        </mesh>

        {/* Celestial Engravings on the outer ring */}
        <AncientEngravings
          radius={3.98}
          count={72}
          majorInterval={6}
          color={CHRONOS_PALETTE.warmGold}
          depth={0.16}
        />

        {/* Cardinal Meridian Bearing Blocks */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
          <group
            key={`bearing-${i}`}
            position={[Math.cos(angle) * 4.0, Math.sin(angle) * 4.0, 0]}
            rotation={[0, 0, angle]}
          >
            <mesh castShadow material={goldAccentMaterial}>
              <boxGeometry args={[0.3, 0.5, 0.45]} />
            </mesh>
            <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]} material={bronzeMaterial}>
              <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
