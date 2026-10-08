'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';

export function TemporalTunnel() {
  const ringsGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const { ringMat, particleMat } = useMemo(() => {
    return {
      ringMat: new THREE.MeshBasicMaterial({
        color: '#FFAE42',
        transparent: true,
        opacity: 0.8,
        wireframe: true,
      }),
      particleMat: new THREE.PointsMaterial({
        size: 0.9,
        color: '#FFE8A3',
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      ringMat.dispose();
      particleMat.dispose();
    };
  }, [ringMat, particleMat]);

  // Warp tunnel particles
  const particlePositions = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 6 + Math.sin(angle) * radius;
      pos[i * 3 + 2] = -15 - Math.random() * 60;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    const progress = chronosStore.portalProgress;
    const isWarping = progress > 0.01 && progress < 0.99;

    if (ringsGroupRef.current) {
      ringsGroupRef.current.visible = isWarping;
      ringsGroupRef.current.rotation.z += delta * 4.0;
    }

    if (particlesRef.current) {
      particlesRef.current.visible = isWarping;
      // High-speed vortex rotation and pulsation
      particlesRef.current.rotation.z += delta * 6.0;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Concentric Warp Rings in Corridor */}
      <group ref={ringsGroupRef}>
        {[-20, -32, -44, -56, -68].map((z, idx) => (
          <mesh key={`warp-ring-${idx}`} position={[0, 7.5, z]}>
            <torusGeometry args={[7.5 - idx * 0.4, 0.25, 8, 32]} />
            <primitive object={ringMat} attach="material" />
          </mesh>
        ))}
      </group>

      {/* 2. Streaking Warp Particles */}
      <points ref={particlesRef} material={particleMat}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
      </points>
    </group>
  );
}
