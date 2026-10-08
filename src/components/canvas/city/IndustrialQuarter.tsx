'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';
import { getTemporalMorphState } from '@/types/phase06';

export function IndustrialQuarter() {
  const originRef = useRef<THREE.Group>(null);
  const kingdomRef = useRef<THREE.Group>(null);
  const machineRef = useRef<THREE.Group>(null);
  const presentRef = useRef<THREE.Group>(null);
  const nextAgeRef = useRef<THREE.Group>(null);

  const {
    brickMat,
    darkIronMat,
    roofMetalMat,
    warmFurnaceMat,
    stoneMat,
    timberMat,
    cyanEnergyMat,
  } = useMemo(() => {
    return {
      brickMat: new THREE.MeshStandardMaterial({
        color: '#6E3426',
        roughness: 0.85,
        metalness: 0.1,
      }),
      darkIronMat: new THREE.MeshStandardMaterial({
        color: '#26292D',
        roughness: 0.6,
        metalness: 0.7,
      }),
      roofMetalMat: new THREE.MeshStandardMaterial({
        color: '#363D45',
        roughness: 0.5,
        metalness: 0.5,
      }),
      warmFurnaceMat: new THREE.MeshStandardMaterial({
        color: '#FFA852',
        emissive: '#FF6B26',
        emissiveIntensity: 1.6,
        roughness: 0.2,
      }),
      stoneMat: new THREE.MeshStandardMaterial({
        color: '#423D38',
        roughness: 0.9,
        metalness: 0.05,
      }),
      timberMat: new THREE.MeshStandardMaterial({
        color: '#523A26',
        roughness: 0.8,
        metalness: 0.08,
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
      brickMat.dispose();
      darkIronMat.dispose();
      roofMetalMat.dispose();
      warmFurnaceMat.dispose();
      stoneMat.dispose();
      timberMat.dispose();
      cyanEnergyMat.dispose();
    };
  }, [
    brickMat,
    darkIronMat,
    roofMetalMat,
    warmFurnaceMat,
    stoneMat,
    timberMat,
    cyanEnergyMat,
  ]);

  useFrame(() => {
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
    <group position={[0, 0, 0]} name="IndustrialQuarter_MorphSystem">
      {/* Permanent Anchor Factory Core Building */}
      <group position={[-58, 0, -70]}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={brickMat}>
          <boxGeometry args={[22, 12, 18]} />
        </mesh>
        {[-6, 0, 6].map((offsetZ) => (
          <mesh
            key={`sawtooth-1-${offsetZ}`}
            position={[0, 13.5, offsetZ]}
            rotation={[0, 0, Math.PI / 8]}
            castShadow
            material={roofMetalMat}
          >
            <boxGeometry args={[22.5, 3.2, 5.5]} />
          </mesh>
        ))}
      </group>

      {/* ================================================================== */}
      {/* ERA 01: 1200 BCE — PRIMITIVE CLAY & BRONZE HEARTHS                */}
      {/* ================================================================== */}
      <group ref={originRef} visible={false}>
        {[-50, -75, -85].map((x, i) => (
          <mesh key={`orig-hearth-${i}`} position={[x, 3, -80]} castShadow material={stoneMat}>
            <cylinderGeometry args={[2.5, 3.5, 6, 8]} />
          </mesh>
        ))}
      </group>

      {/* ================================================================== */}
      {/* ERA 02: 1450 CE — MEDIEVAL GUILD SMITHIES & TIMBER WATERMILLS      */}
      {/* ================================================================== */}
      <group ref={kingdomRef} visible={false}>
        <mesh position={[-75, 5, -75]} castShadow material={timberMat}>
          <boxGeometry args={[14, 10, 16]} />
        </mesh>
        {/* Waterwheel mechanism */}
        <mesh position={[-75, 4, -66]} rotation={[0, 0, Math.PI / 4]} material={timberMat}>
          <cylinderGeometry args={[4, 4, 1.2, 12]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* ERA 03: 1890 CE — TOWERING VICTORIAN BRICK SMOKESTACKS & IRON      */}
      {/* ================================================================== */}
      <group ref={machineRef} visible={false}>
        {[
          { x: -50, z: -85, h: 42, r: 2.0 },
          { x: -75, z: -70, h: 46, r: 2.4 },
          { x: -85, z: -92, h: 38, r: 1.8 },
        ].map((c, idx) => (
          <group key={`m-chimney-${idx}`} position={[c.x, 0, c.z]}>
            <mesh position={[0, c.h / 2, 0]} castShadow material={brickMat}>
              <cylinderGeometry args={[c.r * 0.75, c.r, c.h, 16]} />
            </mesh>
            <mesh position={[0, c.h - 1, 0]} material={darkIronMat}>
              <cylinderGeometry args={[c.r * 0.9, c.r * 0.8, 2, 16]} />
            </mesh>
          </group>
        ))}
        {/* Glowing Foundry Furnaces */}
        <mesh position={[-58, 6, -60.8]} material={warmFurnaceMat}>
          <planeGeometry args={[12, 3.2]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* ERA 04: 2026 CE — RESTORED REDEVELOPED CIVIC BRICK LOFTS (Baseline)*/}
      {/* ================================================================== */}
      <group ref={presentRef} visible={true}>
        {[
          { x: -50, z: -85, h: 36, r: 1.8 },
          { x: -75, z: -70, h: 40, r: 2.0 },
        ].map((c, idx) => (
          <mesh key={`p-chimney-${idx}`} position={[c.x, c.h / 2, c.z]} castShadow material={brickMat}>
            <cylinderGeometry args={[c.r * 0.8, c.r, c.h, 16]} />
          </mesh>
        ))}
      </group>

      {/* ================================================================== */}
      {/* ERA 05: 2200 CE — VERTICAL FUSION PYLONS & TACHYON ENERGY MATRIX   */}
      {/* ================================================================== */}
      <group ref={nextAgeRef} visible={false}>
        {[-50, -75, -88].map((x, i) => (
          <group key={`future-pylon-${i}`} position={[x, 0, -80]}>
            <mesh position={[0, 24, 0]} castShadow material={darkIronMat}>
              <cylinderGeometry args={[1.2, 2.5, 48, 8]} />
            </mesh>
            <mesh position={[0, 48, 0]} material={cyanEnergyMat}>
              <sphereGeometry args={[2.0, 16, 16]} />
            </mesh>
            <mesh position={[0, 24, 0]} material={cyanEnergyMat}>
              <torusGeometry args={[3.2, 0.2, 8, 24]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
