'use client';

import { useMemo, useRef, useEffect, useSyncExternalStore } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore, type QualityPreset } from '@/lib/chronosStore';
import type { ParadoxState, ParadoxEnding } from '@/types/phase09';

interface TemporalFractureProps {
  qualityPreset?: QualityPreset;
}

export function TemporalFracture({ qualityPreset = 'high' }: TemporalFractureProps) {
  const paradoxState = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.paradoxState,
    () => 'inactive' as ParadoxState
  );

  const selectedEnding = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.selectedEnding,
    () => null as ParadoxEnding | null
  );

  const isFinaleCompleted = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.isFinaleCompleted,
    () => false
  );

  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const fragmentsGroupRef = useRef<THREE.Group>(null);
  const fractureLightRef = useRef<THREE.PointLight>(null);

  // Fracture visibility rule:
  // Active during any paradox sequence, or if completed under explore_unknown.
  // Fades/hides if restore_time was chosen or if paradox is inactive.
  const isFractureActive =
    paradoxState !== 'inactive' ||
    (isFinaleCompleted && selectedEnding === 'explore_unknown');

  const {
    goldRingMat,
    cyanRingMat,
    coreAuraMat,
    ancientSandstoneMat,
    medievalStoneMat,
    industrialIronMat,
    modernGlassMat,
    futureCrystalMat,
  } = useMemo(() => {
    return {
      goldRingMat: new THREE.MeshBasicMaterial({
        color: '#D4AF37',
        transparent: true,
        opacity: 0.65,
        wireframe: qualityPreset === 'low',
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
      cyanRingMat: new THREE.MeshBasicMaterial({
        color: '#00F0FF',
        transparent: true,
        opacity: 0.7,
        wireframe: qualityPreset === 'low',
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
      coreAuraMat: new THREE.MeshBasicMaterial({
        color: '#E6C280',
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      }),
      ancientSandstoneMat: new THREE.MeshStandardMaterial({
        color: '#CDB99C',
        roughness: 0.85,
        metalness: 0.1,
      }),
      medievalStoneMat: new THREE.MeshStandardMaterial({
        color: '#4B525B',
        roughness: 0.75,
        metalness: 0.2,
      }),
      industrialIronMat: new THREE.MeshStandardMaterial({
        color: '#32373D',
        roughness: 0.45,
        metalness: 0.8,
      }),
      modernGlassMat: new THREE.MeshStandardMaterial({
        color: '#7692A8',
        roughness: 0.2,
        metalness: 0.6,
        transparent: true,
        opacity: 0.8,
      }),
      futureCrystalMat: new THREE.MeshStandardMaterial({
        color: '#00E5FF',
        emissive: '#00B0FF',
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.4,
        transparent: true,
        opacity: 0.85,
      }),
    };
  }, [qualityPreset]);

  useEffect(() => {
    return () => {
      goldRingMat.dispose();
      cyanRingMat.dispose();
      coreAuraMat.dispose();
      ancientSandstoneMat.dispose();
      medievalStoneMat.dispose();
      industrialIronMat.dispose();
      modernGlassMat.dispose();
      futureCrystalMat.dispose();
    };
  }, [
    goldRingMat,
    cyanRingMat,
    coreAuraMat,
    ancientSandstoneMat,
    medievalStoneMat,
    industrialIronMat,
    modernGlassMat,
    futureCrystalMat,
  ]);

  useFrame((state, delta) => {
    if (!groupRef.current || !isFractureActive) return;
    if (chronosStore.isTimeFrozen) return;

    const t = state.clock.getElapsedTime();

    // Rotate concentric energy rings at distinct speeds
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.45;
      ring1Ref.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.65;
      ring2Ref.current.rotation.y = Math.cos(t * 0.4) * 0.25;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.3;
      ring3Ref.current.rotation.x = Math.cos(t * 0.6) * 0.15;
    }

    // Slowly orbit and bob floating historical fragments
    if (fragmentsGroupRef.current) {
      fragmentsGroupRef.current.rotation.y += delta * 0.2;
      fragmentsGroupRef.current.position.y = 22 + Math.sin(t * 0.8) * 0.8;
    }

    // Temporal lighting pulse
    if (fractureLightRef.current) {
      fractureLightRef.current.intensity =
        paradoxState === 'converging' || paradoxState === 'unstable'
          ? 4.5 + Math.sin(t * 5.0) * 2.0
          : 2.5 + Math.sin(t * 2.0) * 0.8;
    }
  });

  if (!isFractureActive) return null;

  return (
    <group ref={groupRef} position={[0, 0, -120]} name="TemporalFracture_Plaza">
      {/* 1. Pulsing Temporal Point Light (Alternating Gold & Cyan) */}
      <pointLight
        ref={fractureLightRef}
        position={[0, 24, 0]}
        color={paradoxState === 'converging' ? '#00F0FF' : '#D4AF37'}
        distance={90}
        intensity={3.0}
      />

      {/* 2. Concentric Temporal Energy Rings hovering above the Plaza Tower */}
      <group position={[0, 24, 0]}>
        {/* Ring 1: Outer Gold Ring */}
        <mesh ref={ring1Ref} material={goldRingMat} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[14, 0.22, 12, 48]} />
        </mesh>

        {/* Ring 2: Intermediate Cyan Counter-Rotating Ring */}
        <mesh ref={ring2Ref} material={cyanRingMat} rotation={[Math.PI / 2 + 0.2, 0, 0.4]}>
          <torusGeometry args={[10.5, 0.18, 12, 40]} />
        </mesh>

        {/* Ring 3: Inner Harmonic Ring */}
        <mesh ref={ring3Ref} material={goldRingMat} rotation={[Math.PI / 2 - 0.2, 0.3, 0]}>
          <torusGeometry args={[7, 0.15, 10, 36]} />
        </mesh>

        {/* Central Luminous Energy Sphere */}
        <mesh material={coreAuraMat}>
          <sphereGeometry args={[2.2, 16, 16]} />
        </mesh>
      </group>

      {/* 3. Five-Era Floating Architectural Fragments */}
      <group ref={fragmentsGroupRef} position={[0, 22, 0]}>
        {/* Era 1: Ancient Sandstone Monolith Ruin (North-East) */}
        <group position={[12, 2.5, 6]} rotation={[0.2, 0.4, -0.3]}>
          <mesh material={ancientSandstoneMat} castShadow>
            <boxGeometry args={[1.8, 4.2, 1.8]} />
          </mesh>
        </group>

        {/* Era 2: Medieval Gothic Arch Proxy (North-West) */}
        <group position={[-11, -1.8, 8]} rotation={[-0.3, -0.5, 0.2]}>
          <mesh material={medievalStoneMat} castShadow>
            <boxGeometry args={[1.6, 5.0, 1.4]} />
          </mesh>
          <mesh position={[0, 2.8, 0]} material={medievalStoneMat}>
            <cylinderGeometry args={[0.9, 0.9, 1.4, 8]} />
          </mesh>
        </group>

        {/* Era 3: Victorian Industrial Iron Truss Proxy (South-East) */}
        <group position={[9, -2.5, -10]} rotation={[0.4, 0.8, 0.5]}>
          <mesh material={industrialIronMat} castShadow>
            <boxGeometry args={[0.5, 6.0, 0.5]} />
          </mesh>
          <mesh position={[1.2, 0, 0]} material={industrialIronMat}>
            <boxGeometry args={[0.5, 6.0, 0.5]} />
          </mesh>
          <mesh position={[0.6, 1.2, 0]} rotation={[0, 0, 0.7]} material={industrialIronMat}>
            <boxGeometry args={[0.3, 3.0, 0.3]} />
          </mesh>
        </group>

        {/* Era 4: Modern Civic Concrete & Glass Slab (South-West) */}
        <group position={[-9, 3.2, -8]} rotation={[-0.4, 0.3, -0.6]}>
          <mesh material={modernGlassMat} castShadow>
            <boxGeometry args={[3.2, 4.5, 0.6]} />
          </mesh>
        </group>

        {/* Era 5: Futuristic Quantum Energy Spire (Zenith) */}
        <group position={[0, 7.5, 0]} rotation={[0, 0.8, 0]}>
          <mesh material={futureCrystalMat}>
            <octahedronGeometry args={[2.0, 0]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
