'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

export function FoundationMesh() {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.2;
      outerRingRef.current.rotation.y += delta * 0.15;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.25;
      innerRingRef.current.rotation.z += delta * 0.18;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.3;
      coreRef.current.rotation.z -= delta * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Chronos Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.4, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.2}
          metalness={0.9}
          wireframe={true}
        />
      </mesh>

      {/* Inner Temporal Axis Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.8, 0.025, 16, 80]} />
        <meshStandardMaterial
          color="#00f2fe"
          roughness={0.3}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>

      {/* Central Chronos Monolith / Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.1}
          metalness={0.95}
          wireframe={false}
        />
      </mesh>

      {/* Orbiting wireframe envelope */}
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          opacity={0.15}
          transparent={true}
          wireframe={true}
        />
      </mesh>
    </group>
  );
}
