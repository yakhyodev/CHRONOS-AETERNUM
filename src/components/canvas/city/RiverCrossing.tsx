'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';
import { getTemporalMorphState } from '@/types/phase06';

export function RiverCrossing() {
  const waterRef = useRef<THREE.Mesh>(null);

  // Era-specific bridge variant refs
  const originBridgeRef = useRef<THREE.Group>(null);
  const kingdomBridgeRef = useRef<THREE.Group>(null);
  const machineBridgeRef = useRef<THREE.Group>(null);
  const presentBridgeRef = useRef<THREE.Group>(null);
  const nextAgeBridgeRef = useRef<THREE.Group>(null);

  const {
    bridgeStoneMat,
    darkStoneMat,
    quaysideMat,
    waterMat,
    buildingMat,
    terracottaMat,
    lampMat,
    statueMat,
    timberMat,
    ironMat,
    brickMat,
    cyanEnergyMat,
  } = useMemo(() => {
    return {
      bridgeStoneMat: new THREE.MeshStandardMaterial({
        color: '#C4B19A',
        roughness: 0.75,
        metalness: 0.15,
      }),
      darkStoneMat: new THREE.MeshStandardMaterial({
        color: '#282E33',
        roughness: 0.85,
        metalness: 0.15,
      }),
      quaysideMat: new THREE.MeshStandardMaterial({
        color: '#363C42',
        roughness: 0.8,
        metalness: 0.2,
      }),
      waterMat: new THREE.MeshStandardMaterial({
        color: '#163342',
        roughness: 0.12,
        metalness: 0.72,
        flatShading: false,
      }),
      buildingMat: new THREE.MeshStandardMaterial({
        color: '#B5A695',
        roughness: 0.8,
        metalness: 0.1,
      }),
      terracottaMat: new THREE.MeshStandardMaterial({
        color: '#9C4C36',
        roughness: 0.65,
        metalness: 0.15,
      }),
      lampMat: new THREE.MeshBasicMaterial({
        color: '#FFAE42',
      }),
      statueMat: new THREE.MeshStandardMaterial({
        color: '#2D3436',
        roughness: 0.7,
        metalness: 0.3,
      }),
      timberMat: new THREE.MeshStandardMaterial({
        color: '#4A3320',
        roughness: 0.85,
        metalness: 0.08,
      }),
      ironMat: new THREE.MeshStandardMaterial({
        color: '#22252A',
        roughness: 0.6,
        metalness: 0.85,
      }),
      brickMat: new THREE.MeshStandardMaterial({
        color: '#7D3628',
        roughness: 0.85,
        metalness: 0.1,
      }),
      cyanEnergyMat: new THREE.MeshBasicMaterial({
        color: '#00F0FF',
        transparent: true,
        opacity: 0.85,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      bridgeStoneMat.dispose();
      darkStoneMat.dispose();
      quaysideMat.dispose();
      waterMat.dispose();
      buildingMat.dispose();
      terracottaMat.dispose();
      lampMat.dispose();
      statueMat.dispose();
      timberMat.dispose();
      ironMat.dispose();
      brickMat.dispose();
      cyanEnergyMat.dispose();
    };
  }, [
    bridgeStoneMat,
    darkStoneMat,
    quaysideMat,
    waterMat,
    buildingMat,
    terracottaMat,
    lampMat,
    statueMat,
    timberMat,
    ironMat,
    brickMat,
    cyanEnergyMat,
  ]);

  useFrame((state) => {
    if (waterRef.current && !chronosStore.isTimeFrozen) {
      const t = state.clock.getElapsedTime();
      waterRef.current.position.y = -1.5 + Math.sin(t * 1.2) * 0.05;
    }

    const pos = chronosStore.timelinePosition;
    const { eraA, eraB, blendFactor } = getTemporalMorphState(pos);

    const eraBridgeRefs = {
      'the-origin': originBridgeRef.current,
      'the-kingdom': kingdomBridgeRef.current,
      'the-machine': machineBridgeRef.current,
      'the-present': presentBridgeRef.current,
      'the-next-age': nextAgeBridgeRef.current,
    };

    Object.entries(eraBridgeRefs).forEach(([eraKey, group]) => {
      if (!group) return;

      if (eraKey === eraA) {
        group.visible = blendFactor < 0.98;
        const s = 1.0 - blendFactor * 0.2;
        group.scale.set(1, s, 1);
      } else if (eraKey === eraB) {
        group.visible = blendFactor > 0.02;
        const s = 0.8 + blendFactor * 0.2;
        group.scale.set(1, s, 1);
      } else {
        group.visible = false;
      }
    });
  });

  return (
    <group position={[0, 0, 0]} name="RiverCrossing_MorphSystem">
      {/* ================================================================== */}
      {/* 1. ANIMATED RIVER WATER SURFACE & EMBANKMENTS (Permanent Geography) */}
      {/* ================================================================== */}
      <mesh
        ref={waterRef}
        position={[85, -1.5, -135]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={waterMat}
      >
        <planeGeometry args={[72, 210, 16, 32]} />
      </mesh>

      {/* West Embankment Promenade */}
      <mesh position={[49, -0.1, -135]} receiveShadow material={quaysideMat}>
        <boxGeometry args={[6, 1.8, 210]} />
      </mesh>
      <mesh position={[51.8, 0.9, -135]} receiveShadow material={darkStoneMat}>
        <boxGeometry args={[0.4, 0.8, 210]} />
      </mesh>

      {/* East Embankment Promenade */}
      <mesh position={[119, -0.1, -135]} receiveShadow material={quaysideMat}>
        <boxGeometry args={[6, 1.8, 210]} />
      </mesh>
      <mesh position={[116.2, 0.9, -135]} receiveShadow material={darkStoneMat}>
        <boxGeometry args={[0.4, 0.8, 210]} />
      </mesh>

      {/* Permanent Core Bridge Roadway Span (X: 46 to 122) */}
      <mesh position={[84, 4.2, -120]} castShadow receiveShadow material={bridgeStoneMat}>
        <boxGeometry args={[76, 1.4, 12]} />
      </mesh>
      <mesh position={[84, 5.2, -125.6]} castShadow material={darkStoneMat}>
        <boxGeometry args={[76, 0.8, 0.4]} />
      </mesh>
      <mesh position={[84, 5.2, -114.4]} castShadow material={darkStoneMat}>
        <boxGeometry args={[76, 0.8, 0.4]} />
      </mesh>

      {/* ================================================================== */}
      {/* ERA 01: 1200 BCE — PRIMITIVE TIMBER & STONE CAUSEWAY               */}
      {/* ================================================================== */}
      <group ref={originBridgeRef} visible={false}>
        {[60, 75, 90, 105].map((x) => (
          <mesh key={`origin-pile-${x}`} position={[x, 1, -120]} castShadow material={timberMat}>
            <cylinderGeometry args={[1.5, 1.8, 6, 8]} />
          </mesh>
        ))}
      </group>

      {/* ================================================================== */}
      {/* ERA 02: 1450 CE — MEDIEVAL STONE ARCHES & FORTRESS GATEHOUSES      */}
      {/* ================================================================== */}
      <group ref={kingdomBridgeRef} visible={false}>
        {[64, 84, 104].map((archX) => (
          <group key={`k-arch-${archX}`} position={[archX, 0, -120]}>
            <mesh castShadow material={bridgeStoneMat}>
              <torusGeometry args={[8.5, 1.6, 10, 24, Math.PI]} />
            </mesh>
            <mesh position={[-7.5, 0.5, 0]} castShadow material={darkStoneMat}>
              <cylinderGeometry args={[1.8, 2.2, 4.5, 8]} />
            </mesh>
          </group>
        ))}
        {/* Gatehouses */}
        <group position={[48, 0, -120]}>
          <mesh position={[0, 8, -6]} castShadow material={bridgeStoneMat}>
            <boxGeometry args={[6, 16, 5]} />
          </mesh>
          <mesh position={[0, 8, 6]} castShadow material={bridgeStoneMat}>
            <boxGeometry args={[6, 16, 5]} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* ERA 03: 1890 CE — INDUSTRIAL IRON TRUSS & RIVETED SUPERSTRUCTURE   */}
      {/* ================================================================== */}
      <group ref={machineBridgeRef} visible={false}>
        {/* Heavy Iron Overhead Trusses across the bridge */}
        <mesh position={[84, 10, -125.6]} castShadow material={ironMat}>
          <boxGeometry args={[76, 3, 0.8]} />
        </mesh>
        <mesh position={[84, 10, -114.4]} castShadow material={ironMat}>
          <boxGeometry args={[76, 3, 0.8]} />
        </mesh>
        {[60, 72, 84, 96, 108].map((tx) => (
          <mesh key={`iron-truss-post-${tx}`} position={[tx, 7.5, -120]} castShadow material={ironMat}>
            <boxGeometry args={[1.2, 8, 12]} />
          </mesh>
        ))}
        {/* Brick Support Piers in River */}
        {[64, 84, 104].map((archX) => (
          <mesh key={`m-pier-${archX}`} position={[archX, 0.5, -120]} castShadow material={brickMat}>
            <cylinderGeometry args={[2.5, 3.0, 5, 8]} />
          </mesh>
        ))}
      </group>

      {/* ================================================================== */}
      {/* ERA 04: 2026 CE — CLASSICAL CHARLES BRIDGE & MONUMENT STATUES       */}
      {/* ================================================================== */}
      <group ref={presentBridgeRef} visible={true}>
        {[64, 84, 104].map((archX) => (
          <group key={`p-arch-${archX}`} position={[archX, 0, -120]}>
            <mesh castShadow material={bridgeStoneMat}>
              <torusGeometry args={[8.5, 1.6, 10, 24, Math.PI]} />
            </mesh>
            <mesh position={[-7.5, 0.5, 0]} castShadow material={darkStoneMat}>
              <cylinderGeometry args={[1.8, 2.2, 4.5, 8]} />
            </mesh>
          </group>
        ))}
        {/* Bridge Gatehouse Towers */}
        <group position={[48, 0, -120]}>
          <mesh position={[0, 7.5, -6]} castShadow material={bridgeStoneMat}>
            <boxGeometry args={[6, 15, 5]} />
          </mesh>
          <mesh position={[0, 16.5, -6]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
            <coneGeometry args={[4.2, 5, 4]} />
          </mesh>
          <mesh position={[0, 7.5, 6]} castShadow material={bridgeStoneMat}>
            <boxGeometry args={[6, 15, 5]} />
          </mesh>
          <mesh position={[0, 16.5, 6]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
            <coneGeometry args={[4.2, 5, 4]} />
          </mesh>
        </group>
        {/* Balustrade Statues */}
        {[64, 76, 92, 104].map((statueX) => (
          <group key={`p-statue-${statueX}`} position={[statueX, 5.6, -125.6]}>
            <mesh position={[0, 0.4, 0]} castShadow material={darkStoneMat}>
              <boxGeometry args={[0.9, 0.8, 0.7]} />
            </mesh>
            <mesh position={[0, 1.3, 0]} castShadow material={statueMat}>
              <cylinderGeometry args={[0.25, 0.35, 1.2, 6]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================================================================== */}
      {/* ERA 05: 2200 CE — QUANTUM SKYWAY CONDUIT & LEVITATING TRANSIT      */}
      {/* ================================================================== */}
      <group ref={nextAgeBridgeRef} visible={false}>
        {/* Glowing Cyan Maglev Guideway Railing above bridge */}
        <mesh position={[84, 7.2, -125.6]} material={cyanEnergyMat}>
          <boxGeometry args={[76, 0.6, 0.6]} />
        </mesh>
        <mesh position={[84, 7.2, -114.4]} material={cyanEnergyMat}>
          <boxGeometry args={[76, 0.6, 0.6]} />
        </mesh>
        {/* Elevated Transparent Energy Skyway Span */}
        <mesh position={[84, 12, -120]} material={cyanEnergyMat}>
          <boxGeometry args={[76, 0.4, 6]} />
        </mesh>
        {[55, 84, 115].map((px) => (
          <mesh key={`future-pylon-${px}`} position={[px, 9, -120]} castShadow material={darkStoneMat}>
            <cylinderGeometry args={[0.6, 1.2, 10, 8]} />
          </mesh>
        ))}
      </group>

      {/* East Bank Riverside Buildings (Geography Anchor) */}
      <group position={[132, 0, -135]}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[14, 12, 28]} />
        </mesh>
        <mesh position={[0, 13.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[10, 5, 4]} />
        </mesh>
        <mesh position={[0, 5, 24]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[12, 10, 16]} />
        </mesh>
      </group>
    </group>
  );
}
