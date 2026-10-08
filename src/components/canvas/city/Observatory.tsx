'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';
import { getTemporalMorphState } from '@/types/phase06';

export function Observatory() {
  const originRef = useRef<THREE.Group>(null);
  const kingdomRef = useRef<THREE.Group>(null);
  const machineRef = useRef<THREE.Group>(null);
  const presentRef = useRef<THREE.Group>(null);
  const nextAgeRef = useRef<THREE.Group>(null);

  // Rotating future array & telescope
  const futureRingsRef = useRef<THREE.Group>(null);
  const telescopeRef = useRef<THREE.Group>(null);

  const {
    cliffMat,
    stoneWallMat,
    copperDomeMat,
    whiteMarbleMat,
    bronzeMat,
    ironMat,
    brickMat,
    hologramCyanMat,
    chroniteMat,
  } = useMemo(() => {
    return {
      cliffMat: new THREE.MeshStandardMaterial({
        color: '#282B30',
        roughness: 0.95,
        metalness: 0.05,
      }),
      stoneWallMat: new THREE.MeshStandardMaterial({
        color: '#BDB09E',
        roughness: 0.75,
        metalness: 0.15,
      }),
      copperDomeMat: new THREE.MeshStandardMaterial({
        color: '#557A68', // Patinated copper
        roughness: 0.45,
        metalness: 0.65,
      }),
      whiteMarbleMat: new THREE.MeshStandardMaterial({
        color: '#E6E1D8',
        roughness: 0.5,
        metalness: 0.2,
      }),
      bronzeMat: new THREE.MeshStandardMaterial({
        color: '#9E743A',
        roughness: 0.35,
        metalness: 0.8,
      }),
      ironMat: new THREE.MeshStandardMaterial({
        color: '#2A2E33',
        roughness: 0.6,
        metalness: 0.8,
      }),
      brickMat: new THREE.MeshStandardMaterial({
        color: '#7A3525',
        roughness: 0.85,
        metalness: 0.1,
      }),
      hologramCyanMat: new THREE.MeshBasicMaterial({
        color: '#00F0FF',
        transparent: true,
        opacity: 0.85,
        wireframe: true,
      }),
      chroniteMat: new THREE.MeshStandardMaterial({
        color: '#0A1828',
        emissive: '#00D4FF',
        emissiveIntensity: 1.6,
        roughness: 0.2,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      cliffMat.dispose();
      stoneWallMat.dispose();
      copperDomeMat.dispose();
      whiteMarbleMat.dispose();
      bronzeMat.dispose();
      ironMat.dispose();
      brickMat.dispose();
      hologramCyanMat.dispose();
      chroniteMat.dispose();
    };
  }, [
    cliffMat,
    stoneWallMat,
    copperDomeMat,
    whiteMarbleMat,
    bronzeMat,
    ironMat,
    brickMat,
    hologramCyanMat,
    chroniteMat,
  ]);

  useFrame((state, delta) => {
    const pos = chronosStore.timelinePosition;
    const { eraA, eraB, blendFactor } = getTemporalMorphState(pos);

    const eraRefs = {
      'the-origin': originRef.current,
      'the-kingdom': kingdomRef.current,
      'the-machine': machineRef.current,
      'the-present': presentRef.current,
      'the-next-age': nextAgeRef.current,
    };

    Object.entries(eraRefs).forEach(([eraKey, group]) => {
      if (!group) return;

      if (eraKey === eraA) {
        group.visible = blendFactor < 0.98;
        const s = 1.0 - blendFactor * 0.25;
        group.scale.set(s, s, s);
      } else if (eraKey === eraB) {
        group.visible = blendFactor > 0.02;
        const s = 0.75 + blendFactor * 0.25;
        group.scale.set(s, s, s);
      } else {
        group.visible = false;
      }
    });

    if (futureRingsRef.current) {
      futureRingsRef.current.rotation.y += delta * 1.5;
    }
    if (telescopeRef.current) {
      telescopeRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3;
    }
  });

  return (
    <group position={[40, 32, -230]} name="Observatory_MorphSystem">
      {/* ================================================================== */}
      {/* 1. PERMANENT ELEVATED CLIFF & TERRACE RETAINING WALLS (Geography Fixed) */}
      {/* ================================================================== */}
      <mesh position={[0, -14, 0]} receiveShadow material={cliffMat}>
        <cylinderGeometry args={[26, 38, 28, 12]} />
      </mesh>
      <mesh position={[0, 0, 0]} receiveShadow castShadow material={stoneWallMat}>
        <cylinderGeometry args={[22, 24, 2.5, 32]} />
      </mesh>
      <mesh position={[0, 1.6, 0]} material={whiteMarbleMat}>
        <cylinderGeometry args={[21.8, 21.8, 0.8, 32, 1, true]} />
      </mesh>

      {/* ================================================================== */}
      {/* ERA 01: 1200 BCE — MEGALITHIC SOLAR ALIGNMENT STONE CIRCLE          */}
      {/* ================================================================== */}
      <group ref={originRef} position={[0, 1.2, -3]} visible={false}>
        <mesh position={[0, 8, 0]} castShadow material={cliffMat}>
          <boxGeometry args={[3, 16, 2.5]} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const r = 11;
          return (
            <mesh
              key={`obs-stone-${i}`}
              position={[Math.cos(angle) * r, 5, Math.sin(angle) * r]}
              castShadow
              material={cliffMat}
            >
              <boxGeometry args={[2.2, 10, 1.8]} />
            </mesh>
          );
        })}
      </group>

      {/* ================================================================== */}
      {/* ERA 02: 1450 CE — MEDIEVAL ASTROLABE WATCHTOWER & BELFRY            */}
      {/* ================================================================== */}
      <group ref={kingdomRef} position={[0, 1.2, -3]} visible={false}>
        <mesh position={[0, 9, 0]} castShadow receiveShadow material={stoneWallMat}>
          <boxGeometry args={[12, 18, 12]} />
        </mesh>
        <mesh position={[0, 21, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={copperDomeMat}>
          <coneGeometry args={[8.5, 12, 4]} />
        </mesh>
        <mesh position={[0, 13, 6.2]} material={bronzeMat}>
          <ringGeometry args={[1.8, 2.4, 24]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* ERA 03: 1890 CE — VICTORIAN IRON & BRICK TELESCOPE DOME             */}
      {/* ================================================================== */}
      <group ref={machineRef} position={[0, 1.2, -3]} visible={false}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={brickMat}>
          <cylinderGeometry args={[11, 11.5, 12, 24]} />
        </mesh>
        <mesh position={[0, 14, 0]} castShadow material={ironMat}>
          <sphereGeometry args={[10.5, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
        <group ref={telescopeRef} position={[0, 14, 0]}>
          <mesh position={[3, 4, 0]} rotation={[0, 0, Math.PI / 4]} material={bronzeMat}>
            <cylinderGeometry args={[0.8, 1.2, 12, 16]} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* ERA 04: 2026 CE — CLASSICAL RESEARCH OBSERVATORY DOME (Baseline)    */}
      {/* ================================================================== */}
      <group ref={presentRef} position={[0, 1.2, -3]} visible={true}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={whiteMarbleMat}>
          <cylinderGeometry args={[11, 11.5, 12, 32]} />
        </mesh>
        <mesh position={[0, 12.2, 0]} castShadow material={stoneWallMat}>
          <cylinderGeometry args={[12, 12, 0.8, 32]} />
        </mesh>
        <mesh position={[0, 12.6, 0]} castShadow material={copperDomeMat}>
          <sphereGeometry args={[10.8, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
        <mesh position={[0, 23.8, 0]} castShadow material={bronzeMat}>
          <sphereGeometry args={[1.1, 16, 16]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* ERA 05: 2200 CE — QUANTUM CELESTIAL TACHYON ARRAY & ENERGY DOME     */}
      {/* ================================================================== */}
      <group ref={nextAgeRef} position={[0, 1.2, -3]} visible={false}>
        <mesh position={[0, 8, 0]} castShadow receiveShadow material={chroniteMat}>
          <cylinderGeometry args={[11, 13, 16, 8]} />
        </mesh>
        <mesh position={[0, 18, 0]} castShadow material={whiteMarbleMat}>
          <sphereGeometry args={[9.5, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
        {/* Floating Tachyon Array Rings */}
        <group ref={futureRingsRef} position={[0, 22, 0]}>
          <mesh material={hologramCyanMat}>
            <torusGeometry args={[14, 0.35, 8, 36]} />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]} material={hologramCyanMat}>
            <torusGeometry args={[11, 0.25, 8, 32]} />
          </mesh>
        </group>
        <mesh position={[0, 28, 0]} material={hologramCyanMat}>
          <octahedronGeometry args={[2.5, 0]} />
        </mesh>
      </group>
    </group>
  );
}
