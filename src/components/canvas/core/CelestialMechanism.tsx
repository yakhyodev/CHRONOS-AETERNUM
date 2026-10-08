'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';

export function CelestialMechanism() {
  const gearsRef = useRef<THREE.Group>(null);
  const astrolabeSpokesRef = useRef<THREE.Group>(null);

  // Memoized shared materials
  const { bronzeMat, goldMat } = useMemo(() => {
    return {
      bronzeMat: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.antiqueBronze,
        roughness: 0.35,
        metalness: 0.88,
      }),
      goldMat: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.warmGold,
        roughness: 0.25,
        metalness: 0.94,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      bronzeMat.dispose();
      goldMat.dispose();
    };
  }, [bronzeMat, goldMat]);

  useFrame((_, delta) => {
    const speedMult = 1.0 + chronosStore.activationProgress * 4.0;
    if (gearsRef.current) {
      gearsRef.current.rotation.z += delta * 0.25 * speedMult;
    }
    if (astrolabeSpokesRef.current) {
      astrolabeSpokesRef.current.rotation.y -= delta * 0.15 * speedMult;
    }
  });

  return (
    <group>
      {/* Central Celestial Axis Spindle */}
      <mesh rotation={[Math.PI / 4, 0, 0]} castShadow material={goldMat}>
        <cylinderGeometry args={[0.06, 0.06, 3.8, 16]} />
      </mesh>

      {/* Rotating Astrolabe Rete / Radial Spokes */}
      <group ref={astrolabeSpokesRef}>
        {[0, Math.PI / 3, (Math.PI * 2) / 3, Math.PI, (Math.PI * 4) / 3, (Math.PI * 5) / 3].map(
          (angle, idx) => (
            <group key={`spoke-${idx}`} rotation={[0, 0, angle]}>
              {/* Radial Spoke Arm */}
              <mesh position={[0, 0.9, 0]} castShadow material={goldMat}>
                <boxGeometry args={[0.04, 1.2, 0.05]} />
              </mesh>
              {/* Ancient astrolabe pointer tip */}
              <mesh position={[0, 1.55, 0]} rotation={[0, 0, Math.PI / 4]} material={bronzeMat}>
                <boxGeometry args={[0.08, 0.08, 0.04]} />
              </mesh>
            </group>
          )
        )}
      </group>

      {/* Interlocking Celestial Gear Ring */}
      <group ref={gearsRef} position={[0, 0, 0]}>
        <mesh material={bronzeMat}>
          <ringGeometry args={[1.05, 1.2, 36]} />
        </mesh>
        {/* 24 Gear Teeth around perimeter */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <mesh
              key={`tooth-${i}`}
              position={[Math.cos(a) * 1.22, Math.sin(a) * 1.22, 0]}
              rotation={[0, 0, a]}
              material={goldMat}
            >
              <boxGeometry args={[0.05, 0.09, 0.04]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
