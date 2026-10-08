'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';

interface EnergySphereProps {
  activationProgress?: number;
}

export function EnergySphere({ activationProgress = 0 }: EnergySphereProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const ringArcRef1 = useRef<THREE.Mesh>(null);
  const ringArcRef2 = useRef<THREE.Mesh>(null);
  const pulseWaveRef = useRef<THREE.Mesh>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const ambientGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const pulseSpeed = 2.5 + activationProgress * 5.0;
    const basePulse = Math.sin(t * pulseSpeed) * 0.05;
    const scale = (1.0 + basePulse) * (1.0 + activationProgress * 0.3);

    if (coreRef.current) {
      coreRef.current.scale.set(scale, scale, scale);
    }

    if (coronaRef.current) {
      coronaRef.current.rotation.y += delta * 0.6;
      coronaRef.current.rotation.z += delta * 0.45;
      const coronaScale = scale * 1.35;
      coronaRef.current.scale.set(coronaScale, coronaScale, coronaScale);
    }

    if (ringArcRef1.current) {
      ringArcRef1.current.rotation.x += delta * (0.9 + activationProgress * 2.2);
      ringArcRef1.current.rotation.y += delta * 0.7;
    }

    if (ringArcRef2.current) {
      ringArcRef2.current.rotation.y -= delta * (1.1 + activationProgress * 2.5);
      ringArcRef2.current.rotation.z += delta * 0.55;
    }

    // Expanding temporal energy shockwave ring during activation
    if (pulseWaveRef.current) {
      const wavePhase = (t * (1.2 + activationProgress * 2.8)) % 1;
      const waveScale = 1.0 + wavePhase * 4.2;
      pulseWaveRef.current.scale.set(waveScale, waveScale, waveScale);
      const waveMat = pulseWaveRef.current.material as THREE.MeshBasicMaterial;
      if (waveMat) {
        waveMat.opacity = (1 - wavePhase) * (0.25 + activationProgress * 0.65);
      }
    }

    if (coreLightRef.current) {
      coreLightRef.current.intensity = (7.5 + Math.sin(t * 3.5) * 0.8) * (1.0 + activationProgress * 2.2);
    }
    if (ambientGlowRef.current) {
      ambientGlowRef.current.intensity = (3.5 + Math.cos(t * 2.0) * 0.5) * (1.0 + activationProgress * 1.5);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Central Radiant Golden Fusion Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#FFF1CC" />
      </mesh>

      {/* 2. Concentric Volumetric Amber Plasma Corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[0.74, 24, 24]} />
        <meshStandardMaterial
          color={CHRONOS_PALETTE.emberLight}
          emissive={CHRONOS_PALETTE.emberGlow}
          emissiveIntensity={2.8}
          transparent={true}
          opacity={0.55}
          roughness={0.1}
          metalness={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Orbiting Energy Arc 1 */}
      <mesh ref={ringArcRef1}>
        <torusGeometry args={[0.92, 0.022, 10, 64]} />
        <meshBasicMaterial color={CHRONOS_PALETTE.goldLight} />
      </mesh>

      {/* 4. Orbiting Energy Arc 2 (inclined) */}
      <mesh ref={ringArcRef2} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[1.02, 0.018, 10, 64]} />
        <meshBasicMaterial color={CHRONOS_PALETTE.emberLight} />
      </mesh>

      {/* 5. Concentric Shockwave Ring */}
      <mesh ref={pulseWaveRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.82, 48]} />
        <meshBasicMaterial
          color={CHRONOS_PALETTE.goldLight}
          transparent={true}
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Primary High-Intensity Amber Point Light casting shadows */}
      <pointLight
        ref={coreLightRef}
        color={CHRONOS_PALETTE.emberLight}
        intensity={8.0}
        distance={34}
        decay={1.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0003}
      />

      {/* Secondary Soft Warm Glow */}
      <pointLight
        ref={ambientGlowRef}
        color={CHRONOS_PALETTE.warmGold}
        intensity={3.5}
        distance={18}
        decay={2}
      />
    </group>
  );
}
