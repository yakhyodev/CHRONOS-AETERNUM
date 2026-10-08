'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';
import { getTemporalMorphState } from '@/types/phase06';

export function OldDistrict() {
  const originRef = useRef<THREE.Group>(null);
  const kingdomRef = useRef<THREE.Group>(null);
  const machineRef = useRef<THREE.Group>(null);
  const presentRef = useRef<THREE.Group>(null);
  const nextAgeRef = useRef<THREE.Group>(null);

  const {
    foundationMat,
    thatchMat,
    mudBrickMat,
    timberMat,
    medievalPlasterMat,
    clayShingleMat,
    victorianBrickMat,
    slateRoofMat,
    ironMat,
    modernStuccoMat,
    terracottaRoofMat,
    hologramMat,
    skywalkGlassMat,
    warmWindowMat,
    brazierGlowMat,
  } = useMemo(() => {
    return {
      foundationMat: new THREE.MeshStandardMaterial({
        color: '#34383D',
        roughness: 0.88,
        metalness: 0.15,
      }),
      thatchMat: new THREE.MeshStandardMaterial({
        color: '#8C7449',
        roughness: 0.95,
        metalness: 0.05,
      }),
      mudBrickMat: new THREE.MeshStandardMaterial({
        color: '#826B54',
        roughness: 0.9,
        metalness: 0.05,
      }),
      timberMat: new THREE.MeshStandardMaterial({
        color: '#422B18',
        roughness: 0.82,
        metalness: 0.1,
      }),
      medievalPlasterMat: new THREE.MeshStandardMaterial({
        color: '#E0D2BC',
        roughness: 0.8,
        metalness: 0.1,
      }),
      clayShingleMat: new THREE.MeshStandardMaterial({
        color: '#9C4E38',
        roughness: 0.7,
        metalness: 0.15,
      }),
      victorianBrickMat: new THREE.MeshStandardMaterial({
        color: '#6E3224',
        roughness: 0.82,
        metalness: 0.12,
      }),
      slateRoofMat: new THREE.MeshStandardMaterial({
        color: '#28323E',
        roughness: 0.55,
        metalness: 0.35,
      }),
      ironMat: new THREE.MeshStandardMaterial({
        color: '#1E2226',
        roughness: 0.6,
        metalness: 0.85,
      }),
      modernStuccoMat: new THREE.MeshStandardMaterial({
        color: '#D8C9B5',
        roughness: 0.75,
        metalness: 0.1,
      }),
      terracottaRoofMat: new THREE.MeshStandardMaterial({
        color: '#B8583B',
        roughness: 0.62,
        metalness: 0.15,
      }),
      hologramMat: new THREE.MeshBasicMaterial({
        color: '#00F0FF',
        transparent: true,
        opacity: 0.65,
        wireframe: true,
      }),
      skywalkGlassMat: new THREE.MeshStandardMaterial({
        color: '#0A3B5C',
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7,
      }),
      warmWindowMat: new THREE.MeshBasicMaterial({
        color: '#FFB84D',
      }),
      brazierGlowMat: new THREE.MeshBasicMaterial({
        color: '#FF6200',
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      foundationMat.dispose();
      thatchMat.dispose();
      mudBrickMat.dispose();
      timberMat.dispose();
      medievalPlasterMat.dispose();
      clayShingleMat.dispose();
      victorianBrickMat.dispose();
      slateRoofMat.dispose();
      ironMat.dispose();
      modernStuccoMat.dispose();
      terracottaRoofMat.dispose();
      hologramMat.dispose();
      skywalkGlassMat.dispose();
      warmWindowMat.dispose();
      brazierGlowMat.dispose();
    };
  }, [
    foundationMat,
    thatchMat,
    mudBrickMat,
    timberMat,
    medievalPlasterMat,
    clayShingleMat,
    victorianBrickMat,
    slateRoofMat,
    ironMat,
    modernStuccoMat,
    terracottaRoofMat,
    hologramMat,
    skywalkGlassMat,
    warmWindowMat,
    brazierGlowMat,
  ]);

  useFrame(() => {
    const pos = chronosStore.timelinePosition;
    const { eraA, eraB, blendFactor } = getTemporalMorphState(pos);

    const eraDistrictRefs = {
      'the-origin': originRef.current,
      'the-kingdom': kingdomRef.current,
      'the-machine': machineRef.current,
      'the-present': presentRef.current,
      'the-next-age': nextAgeRef.current,
    };

    Object.entries(eraDistrictRefs).forEach(([eraKey, group]) => {
      if (!group) return;

      if (eraKey === eraA) {
        group.visible = blendFactor < 0.98;
        const s = 1.0 - blendFactor * 0.18;
        group.scale.set(1, s, 1);
      } else if (eraKey === eraB) {
        group.visible = blendFactor > 0.02;
        const s = 0.82 + blendFactor * 0.18;
        group.scale.set(1, s, 1);
      } else {
        group.visible = false;
      }
    });
  });

  return (
    <group position={[0, 0, 0]} name="OldDistrict_MorphSystem">
      {/* ================================================================== */}
      {/* PERMANENT GEOGRAPHY: Hillside Terraces & Stone Retaining Foundations */}
      {/* ================================================================== */}
      <mesh position={[-75, 1, -135]} receiveShadow material={foundationMat}>
        <boxGeometry args={[80, 2, 70]} />
      </mesh>
      {/* Stone terrace ramps */}
      <mesh position={[-60, 2.5, -120]} receiveShadow material={foundationMat}>
        <boxGeometry args={[45, 1.5, 30]} />
      </mesh>

      {/* ================================================================== */}
      {/* ERA 1: THE ORIGIN (1200 BCE) — Primitive Roundhouses & Stone Mounds */}
      {/* ================================================================== */}
      <group ref={originRef} name="OldDistrict_TheOrigin">
        {/* Hillside Settlement Roundhouses */}
        {[
          { x: -55, z: -115, r: 6, h: 5 },
          { x: -70, z: -115, r: 7, h: 6 },
          { x: -55, z: -135, r: 5.5, h: 5 },
          { x: -72, z: -138, r: 8, h: 6.5 },
          { x: -90, z: -125, r: 6.5, h: 5.5 },
          { x: -92, z: -145, r: 7.5, h: 6 },
          { x: -108, z: -132, r: 5, h: 4.8 },
        ].map((h, i) => (
          <group key={`origin-roundhouse-${i}`} position={[h.x, 2, h.z]}>
            {/* Mud-stone base cylinder */}
            <mesh position={[0, h.h * 0.5, 0]} castShadow receiveShadow material={mudBrickMat}>
              <cylinderGeometry args={[h.r, h.r + 0.3, h.h, 12]} />
            </mesh>
            {/* Conical thatch roof */}
            <mesh position={[0, h.h + h.r * 0.5, 0]} castShadow material={thatchMat}>
              <coneGeometry args={[h.r + 1.2, h.r, 12]} />
            </mesh>
            {/* Hearth fire opening */}
            <mesh position={[0, 1.2, h.r - 0.2]} material={brazierGlowMat}>
              <planeGeometry args={[1.6, 2.2]} />
            </mesh>
          </group>
        ))}

        {/* Central Ancient Hilltop Stone Cairn / Dolmen */}
        <group position={[-92, 4, -135]}>
          <mesh position={[-3, 4, 0]} castShadow material={mudBrickMat}>
            <boxGeometry args={[2.5, 8, 2.5]} />
          </mesh>
          <mesh position={[3, 4, 0]} castShadow material={mudBrickMat}>
            <boxGeometry args={[2.5, 8, 2.5]} />
          </mesh>
          <mesh position={[0, 8.5, 0]} castShadow material={mudBrickMat}>
            <boxGeometry args={[10, 1.8, 4.5]} />
          </mesh>
          <mesh position={[0, 1, 0]} material={brazierGlowMat}>
            <cylinderGeometry args={[1.5, 1.8, 1, 8]} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* ERA 2: THE KINGDOM (1450 CE) — Half-Timbered Medieval Townhouses */}
      {/* ================================================================== */}
      <group ref={kingdomRef} name="OldDistrict_TheKingdom">
        {[
          { x: -52, z: -115, w: 10, d: 14, h: 14 },
          { x: -54, z: -132, w: 12, d: 12, h: 15 },
          { x: -52, z: -148, w: 10, d: 12, h: 13 },
          { x: -70, z: -112, w: 13, d: 11, h: 15 },
          { x: -72, z: -130, w: 13, d: 14, h: 16 },
          { x: -72, z: -150, w: 12, d: 15, h: 14 },
          { x: -90, z: -110, w: 11, d: 13, h: 13 },
          { x: -92, z: -158, w: 13, d: 12, h: 14 },
          { x: -110, z: -125, w: 12, d: 15, h: 12 },
        ].map((b, i) => (
          <group key={`kingdom-bldg-${i}`} position={[b.x, 2, b.z]}>
            {/* Ground stone base */}
            <mesh position={[0, b.h * 0.25, 0]} castShadow material={foundationMat}>
              <boxGeometry args={[b.w, b.h * 0.5, b.d]} />
            </mesh>
            {/* Overhanging timber Jetty upper floor */}
            <mesh position={[0, b.h * 0.7, 0]} castShadow material={medievalPlasterMat}>
              <boxGeometry args={[b.w + 0.8, b.h * 0.5, b.d + 0.8]} />
            </mesh>
            {/* Timber framing corner posts */}
            <mesh position={[0, b.h * 0.7, 0]} castShadow material={timberMat}>
              <boxGeometry args={[b.w + 1.0, 0.6, b.d + 1.0]} />
            </mesh>
            {/* Steep high-gabled clay roof */}
            <mesh
              position={[0, b.h + b.w * 0.35, 0]}
              rotation={[0, Math.PI / 4, 0]}
              castShadow
              material={clayShingleMat}
            >
              <coneGeometry args={[Math.max(b.w, b.d) * 0.72, b.w * 0.7, 4]} />
            </mesh>
            {/* Small candle-lit lattice window */}
            <mesh position={[0, b.h * 0.65, b.d * 0.5 + 0.45]} material={warmWindowMat}>
              <planeGeometry args={[b.w * 0.4, 1.4]} />
            </mesh>
          </group>
        ))}

        {/* Medieval Parish Church with Wood Belfry */}
        <group position={[-92, 2, -135]}>
          <mesh position={[0, 10, 0]} castShadow material={foundationMat}>
            <boxGeometry args={[18, 20, 24]} />
          </mesh>
          <mesh position={[0, 23, 0]} castShadow material={timberMat}>
            <boxGeometry args={[8, 12, 8]} />
          </mesh>
          <mesh position={[0, 33, 0]} castShadow material={clayShingleMat}>
            <coneGeometry args={[4.5, 12, 8]} />
          </mesh>
          <mesh position={[0, 10, 12.1]} material={warmWindowMat}>
            <planeGeometry args={[5, 10]} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* ERA 3: THE MACHINE (1890 CE) — Victorian Brick Tenements & Iron Railings */}
      {/* ================================================================== */}
      <group ref={machineRef} name="OldDistrict_TheMachine">
        {[
          { x: -52, z: -115, w: 11, d: 15, h: 17 },
          { x: -54, z: -132, w: 13, d: 13, h: 19 },
          { x: -52, z: -148, w: 11, d: 13, h: 16 },
          { x: -70, z: -112, w: 14, d: 12, h: 18 },
          { x: -72, z: -130, w: 14, d: 15, h: 20 },
          { x: -72, z: -150, w: 13, d: 16, h: 17 },
          { x: -90, z: -110, w: 12, d: 14, h: 16 },
          { x: -92, z: -158, w: 14, d: 13, h: 17 },
          { x: -110, z: -125, w: 13, d: 16, h: 15 },
        ].map((b, i) => (
          <group key={`machine-bldg-${i}`} position={[b.x, 2, b.z]}>
            {/* Red Brick Masonry Tenement Body */}
            <mesh position={[0, b.h * 0.5, 0]} castShadow material={victorianBrickMat}>
              <boxGeometry args={[b.w, b.h, b.d]} />
            </mesh>
            {/* Slate Mansard Roof */}
            <mesh
              position={[0, b.h + 2.5, 0]}
              rotation={[0, Math.PI / 4, 0]}
              castShadow
              material={slateRoofMat}
            >
              <coneGeometry args={[Math.max(b.w, b.d) * 0.68, 5, 4]} />
            </mesh>
            {/* Cast Iron Balconies & Fire Escapes */}
            <mesh position={[0, b.h * 0.5, b.d * 0.5 + 0.4]} material={ironMat}>
              <boxGeometry args={[b.w * 0.7, 0.4, 0.8]} />
            </mesh>
            <mesh position={[0, b.h * 0.75, b.d * 0.5 + 0.4]} material={ironMat}>
              <boxGeometry args={[b.w * 0.7, 0.4, 0.8]} />
            </mesh>
            {/* Smokestack Chimney */}
            <mesh position={[b.w * 0.3, b.h + 4.5, 0]} castShadow material={victorianBrickMat}>
              <boxGeometry args={[1.5, 4.5, 1.5]} />
            </mesh>
            {/* Gaslit Multi-pane Windows */}
            <mesh position={[0, b.h * 0.4, b.d * 0.5 + 0.05]} material={warmWindowMat}>
              <planeGeometry args={[b.w * 0.6, 2.2]} />
            </mesh>
            <mesh position={[0, b.h * 0.7, b.d * 0.5 + 0.05]} material={warmWindowMat}>
              <planeGeometry args={[b.w * 0.6, 2.2]} />
            </mesh>
          </group>
        ))}

        {/* Industrial Neo-Gothic Clock Basilica */}
        <group position={[-92, 2, -135]}>
          <mesh position={[0, 11, 0]} castShadow material={victorianBrickMat}>
            <boxGeometry args={[18, 22, 26]} />
          </mesh>
          <mesh position={[0, 24, 0]} castShadow material={ironMat}>
            <boxGeometry args={[7, 14, 7]} />
          </mesh>
          <mesh position={[0, 34, 0]} castShadow material={slateRoofMat}>
            <coneGeometry args={[4, 12, 8]} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* ERA 4: THE PRESENT (2026 CE) — Restored Heritage Architecture */}
      {/* ================================================================== */}
      <group ref={presentRef} name="OldDistrict_ThePresent">
        {[
          { x: -52, z: -115, w: 10, d: 14, h: 14, roof: 'terracotta' },
          { x: -54, z: -132, w: 12, d: 12, h: 16, roof: 'slate' },
          { x: -52, z: -148, w: 10, d: 12, h: 12, roof: 'terracotta' },
          { x: -70, z: -112, w: 14, d: 11, h: 15, roof: 'terracotta' },
          { x: -72, z: -130, w: 13, d: 14, h: 17, roof: 'terracotta' },
          { x: -72, z: -150, w: 12, d: 15, h: 14, roof: 'slate' },
          { x: -90, z: -110, w: 11, d: 13, h: 13, roof: 'terracotta' },
          { x: -92, z: -158, w: 13, d: 12, h: 14, roof: 'terracotta' },
          { x: -110, z: -125, w: 12, d: 15, h: 12, roof: 'slate' },
          { x: -112, z: -145, w: 10, d: 14, h: 11, roof: 'terracotta' },
        ].map((b, i) => (
          <group key={`present-bldg-${i}`} position={[b.x, 2, b.z]}>
            <mesh position={[0, b.h * 0.2, 0]} castShadow material={foundationMat}>
              <boxGeometry args={[b.w, b.h * 0.4, b.d]} />
            </mesh>
            <mesh position={[0, b.h * 0.7, 0]} castShadow material={modernStuccoMat}>
              <boxGeometry args={[b.w - 0.2, b.h * 0.6, b.d - 0.2]} />
            </mesh>
            <mesh
              position={[0, b.h + b.w * 0.25, 0]}
              rotation={[0, Math.PI / 4, 0]}
              castShadow
              material={b.roof === 'terracotta' ? terracottaRoofMat : slateRoofMat}
            >
              <coneGeometry args={[Math.max(b.w, b.d) * 0.65, b.w * 0.5, 4]} />
            </mesh>
            <mesh position={[0, b.h * 0.65, b.d * 0.5 + 0.05]} material={warmWindowMat}>
              <planeGeometry args={[b.w * 0.6, 1.8]} />
            </mesh>
          </group>
        ))}

        {/* Grand Restored Basilica with Spire */}
        <group position={[-92, 2, -135]}>
          <mesh position={[0, 11, 0]} castShadow material={foundationMat}>
            <boxGeometry args={[18, 22, 26]} />
          </mesh>
          <mesh position={[0, 24, 0]} castShadow material={foundationMat}>
            <boxGeometry args={[8, 16, 8]} />
          </mesh>
          <mesh position={[0, 36, 0]} castShadow material={slateRoofMat}>
            <coneGeometry args={[4.5, 14, 8]} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* ERA 5: THE NEXT AGE (2200 CE) — Cyber-Preserved Stasis Heritage */}
      {/* ================================================================== */}
      <group ref={nextAgeRef} name="OldDistrict_TheNextAge">
        {/* Preserved Masonry Covered in Luminous Shield Fields */}
        {[
          { x: -52, z: -115, w: 12, d: 16, h: 18 },
          { x: -54, z: -132, w: 14, d: 14, h: 20 },
          { x: -70, z: -112, w: 15, d: 13, h: 19 },
          { x: -72, z: -130, w: 15, d: 16, h: 22 },
          { x: -90, z: -110, w: 13, d: 15, h: 17 },
          { x: -110, z: -125, w: 14, d: 17, h: 16 },
        ].map((b, i) => (
          <group key={`nextage-heritage-${i}`} position={[b.x, 2, b.z]}>
            {/* Preserved stone core */}
            <mesh position={[0, b.h * 0.5, 0]} material={foundationMat}>
              <boxGeometry args={[b.w - 1, b.h - 1, b.d - 1]} />
            </mesh>
            {/* Holographic Stasis Containment Shell */}
            <mesh position={[0, b.h * 0.5, 0]} material={hologramMat}>
              <boxGeometry args={[b.w, b.h, b.d]} />
            </mesh>
          </group>
        ))}

        {/* Translucent Aerial Skywalks linking district heights */}
        <mesh position={[-62, 14, -122]} material={skywalkGlassMat}>
          <boxGeometry args={[14, 1.5, 3.5]} />
        </mesh>
        <mesh position={[-81, 16, -135]} material={skywalkGlassMat}>
          <boxGeometry args={[12, 1.5, 3.5]} />
        </mesh>

        {/* Basilica Converted to Quantum Harmonic Beacon */}
        <group position={[-92, 2, -135]}>
          <mesh position={[0, 11, 0]} material={foundationMat}>
            <boxGeometry args={[18, 22, 26]} />
          </mesh>
          <mesh position={[0, 11, 0]} material={hologramMat}>
            <boxGeometry args={[19, 23, 27]} />
          </mesh>
          {/* Radiant Tachyon Emitter Spire */}
          <mesh position={[0, 32, 0]} material={skywalkGlassMat}>
            <cylinderGeometry args={[1.5, 3.5, 20, 8]} />
          </mesh>
          <mesh position={[0, 44, 0]} material={hologramMat}>
            <octahedronGeometry args={[3]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

