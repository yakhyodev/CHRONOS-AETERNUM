'use client';

import { useMemo, useEffect, useSyncExternalStore } from 'react';
import * as THREE from 'three';
import { EraLandmark } from './EraLandmark';
import { chronosStore } from '@/lib/chronosStore';
import { TEMPORAL_ERAS } from '@/types/phase05';
import type { HistoricalEraId } from '@/types/phase03';

export function ChronosPlaza() {
  const activeEra = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.activeEra,
    () => 'the-present' as HistoricalEraId
  );

  const eraConfig = TEMPORAL_ERAS[activeEra] || TEMPORAL_ERAS['the-present'];

  const {
    sandstoneMat,
    darkStoneMat,
    roofTerracottaMat,
    roofSlateMat,
    goldOrnamentMat,
    lampGlowMat,
    foliageMat,
  } = useMemo(() => {
    return {
      sandstoneMat: new THREE.MeshStandardMaterial({
        color: '#D4C2A8',
        roughness: 0.72,
        metalness: 0.18,
      }),
      darkStoneMat: new THREE.MeshStandardMaterial({
        color: '#2A3035',
        roughness: 0.82,
        metalness: 0.15,
      }),
      roofTerracottaMat: new THREE.MeshStandardMaterial({
        color: '#A8523A',
        roughness: 0.65,
        metalness: 0.12,
      }),
      roofSlateMat: new THREE.MeshStandardMaterial({
        color: '#2F3842',
        roughness: 0.55,
        metalness: 0.35,
      }),
      goldOrnamentMat: new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        roughness: 0.3,
        metalness: 0.85,
      }),
      lampGlowMat: new THREE.MeshBasicMaterial({
        color: eraConfig.atmosphere.accentColor,
      }),
      foliageMat: new THREE.MeshStandardMaterial({
        color: '#2F482F',
        roughness: 0.9,
        metalness: 0.05,
      }),
    };
  }, [eraConfig.atmosphere.accentColor]);

  useEffect(() => {
    return () => {
      sandstoneMat.dispose();
      darkStoneMat.dispose();
      roofTerracottaMat.dispose();
      roofSlateMat.dispose();
      goldOrnamentMat.dispose();
      lampGlowMat.dispose();
      foliageMat.dispose();
    };
  }, [
    sandstoneMat,
    darkStoneMat,
    roofTerracottaMat,
    roofSlateMat,
    goldOrnamentMat,
    lampGlowMat,
    foliageMat,
  ]);

  // Plaza street lamp positions
  const lampPositions: [number, number, number][] = useMemo(() => {
    const pos: [number, number, number][] = [];
    const count = 10;
    const radius = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos.push([Math.cos(angle) * radius, 0, -120 + Math.sin(angle) * radius]);
    }
    return pos;
  }, []);

  // Ornamental plaza cypress trees
  const treePositions: [number, number, number][] = useMemo(() => {
    const pos: [number, number, number][] = [];
    const count = 12;
    const radius = 30;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos.push([Math.cos(angle) * radius, 0, -120 + Math.sin(angle) * radius]);
    }
    return pos;
  }, []);

  return (
    <group name="ChronosPlaza">
      {/* ================================================================== */}
      {/* 1. CIRCULAR CIVIC PLAZA PAVING TIERS */}
      {/* ================================================================== */}
      {/* Central Plaza Outer Ring */}
      <mesh position={[0, 0.05, -120]} receiveShadow material={sandstoneMat}>
        <cylinderGeometry args={[34, 35, 0.25, 48]} />
      </mesh>
      {/* Concentric Step Ring Tier 2 */}
      <mesh position={[0, 0.2, -120]} receiveShadow material={darkStoneMat}>
        <cylinderGeometry args={[26, 27, 0.2, 48]} />
      </mesh>
      {/* Inner Dais Floor */}
      <mesh position={[0, 0.35, -120]} receiveShadow material={sandstoneMat}>
        <cylinderGeometry args={[18, 19, 0.2, 48]} />
      </mesh>

      {/* Decorative Radial Inlay Rings */}
      <mesh position={[0, 0.46, -120]} rotation={[-Math.PI / 2, 0, 0]} material={goldOrnamentMat}>
        <ringGeometry args={[12, 12.6, 48]} />
      </mesh>
      <mesh position={[0, 0.46, -120]} rotation={[-Math.PI / 2, 0, 0]} material={goldOrnamentMat}>
        <ringGeometry args={[17.2, 17.6, 48]} />
      </mesh>

      {/* Central Plaza Bronze Fountain Monument (Hidden in 1200 BCE, adapted in others) */}
      {activeEra !== 'the-origin' && (
        <group position={[0, 0.4, -106]}>
          <mesh position={[0, 0.6, 0]} receiveShadow castShadow material={sandstoneMat}>
            <cylinderGeometry args={[3.8, 4.2, 1.2, 24]} />
          </mesh>
          <mesh position={[0, 2.2, 0]} receiveShadow castShadow material={darkStoneMat}>
            <cylinderGeometry args={[1.2, 1.5, 2.0, 16]} />
          </mesh>
          <mesh position={[0, 4.0, 0]} castShadow material={goldOrnamentMat}>
            <sphereGeometry args={[0.9, 16, 16]} />
          </mesh>
        </group>
      )}

      {/* ================================================================== */}
      {/* 2. THE ERA-SPECIFIC MONUMENTAL LANDMARK */}
      {/* Dynamically swaps between 1200 BCE Sundial, 1450 Belfry, */}
      {/* 1890 Steam Clock, 2026 Restored Tower, and 2200 Quantum Spire */}
      {/* ================================================================== */}
      <EraLandmark />

      {/* ================================================================== */}
      {/* 3. FLANKING CIVIC PALACES (EAST & WEST) */}
      {/* ================================================================== */}
      {/* West Civic Hall (Connecting to Old District) */}
      <group position={[-28, 0, -122]}>
        <mesh position={[0, 7.5, 0]} castShadow receiveShadow material={sandstoneMat}>
          <boxGeometry args={[16, 15, 28]} />
        </mesh>
        <mesh position={[0, 18, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={roofTerracottaMat}>
          <coneGeometry args={[12, 7, 4]} />
        </mesh>
        <mesh position={[6.5, 3, 0]} castShadow material={darkStoneMat}>
          <boxGeometry args={[2.5, 6, 26]} />
        </mesh>
      </group>

      {/* East Civic Hall (Connecting to River Crossing) */}
      <group position={[28, 0, -122]}>
        <mesh position={[0, 7.5, 0]} castShadow receiveShadow material={sandstoneMat}>
          <boxGeometry args={[16, 15, 28]} />
        </mesh>
        <mesh position={[0, 18, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={roofSlateMat}>
          <coneGeometry args={[12, 7, 4]} />
        </mesh>
        <mesh position={[-6.5, 3, 0]} castShadow material={darkStoneMat}>
          <boxGeometry args={[2.5, 6, 26]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 4. PLAZA STREET LAMPS & CYPRESS TREES */}
      {/* ================================================================== */}
      {lampPositions.map(([x, y, z], idx) => (
        <group key={`plaza-lamp-${idx}`} position={[x, y + 0.3, z]}>
          <mesh position={[0, 1.8, 0]} castShadow material={darkStoneMat}>
            <cylinderGeometry args={[0.08, 0.12, 3.6, 8]} />
          </mesh>
          <mesh position={[0, 3.8, 0]} material={lampGlowMat}>
            <sphereGeometry args={[0.28, 8, 8]} />
          </mesh>
        </group>
      ))}

      {/* Trees (shown for eras with vegetation) */}
      {activeEra !== 'the-machine' &&
        treePositions.map(([x, y, z], idx) => (
          <group key={`plaza-tree-${idx}`} position={[x, y + 0.3, z]}>
            <mesh position={[0, 1.2, 0]} material={darkStoneMat}>
              <cylinderGeometry args={[0.2, 0.3, 2.4, 8]} />
            </mesh>
            <mesh position={[0, 4.5, 0]} castShadow material={foliageMat}>
              <coneGeometry args={[1.5, 5.5, 7]} />
            </mesh>
          </group>
        ))}
    </group>
  );
}
