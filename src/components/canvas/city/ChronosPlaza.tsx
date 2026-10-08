'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

export function ChronosPlaza() {
  const {
    sandstoneMat,
    darkStoneMat,
    roofTerracottaMat,
    roofSlateMat,
    goldOrnamentMat,
    clockDialMat,
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
      clockDialMat: new THREE.MeshStandardMaterial({
        color: '#FFF2D6',
        emissive: '#FFB84D',
        emissiveIntensity: 1.8,
        roughness: 0.2,
      }),
      lampGlowMat: new THREE.MeshBasicMaterial({
        color: '#FFAA33',
      }),
      foliageMat: new THREE.MeshStandardMaterial({
        color: '#2F482F',
        roughness: 0.9,
        metalness: 0.05,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      sandstoneMat.dispose();
      darkStoneMat.dispose();
      roofTerracottaMat.dispose();
      roofSlateMat.dispose();
      goldOrnamentMat.dispose();
      clockDialMat.dispose();
      lampGlowMat.dispose();
      foliageMat.dispose();
    };
  }, [
    sandstoneMat,
    darkStoneMat,
    roofTerracottaMat,
    roofSlateMat,
    goldOrnamentMat,
    clockDialMat,
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
    <group>
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

      {/* Central Plaza Bronze Fountain Monument */}
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

      {/* ================================================================== */}
      {/* 2. THE MONUMENTAL CHRONOS CLOCK TOWER */}
      {/* ================================================================== */}
      <group position={[0, 0, -124]}>
        {/* Tier 1: Plinth and Entrance Base (Height: 0 to 12m) */}
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={sandstoneMat}>
          <boxGeometry args={[13, 12, 13]} />
        </mesh>
        {/* Tier 1 Portico Buttresses */}
        {[-7, 7].map((x) =>
          [-7, 7].map((z) => (
            <mesh key={`buttress-${x}-${z}`} position={[x, 5.5, z]} castShadow material={darkStoneMat}>
              <boxGeometry args={[2.5, 11, 2.5]} />
            </mesh>
          ))
        )}

        {/* Tier 2: Tower Shaft with Gothic Pilasters (Height: 12 to 34m) */}
        <mesh position={[0, 23, 0]} castShadow receiveShadow material={sandstoneMat}>
          <boxGeometry args={[10, 22, 10]} />
        </mesh>
        {/* Shaft Fluted Corner Buttresses */}
        {[-5.4, 5.4].map((x) =>
          [-5.4, 5.4].map((z) => (
            <mesh key={`shaft-corner-${x}-${z}`} position={[x, 23, z]} castShadow material={darkStoneMat}>
              <boxGeometry args={[1.6, 22, 1.6]} />
            </mesh>
          ))
        )}

        {/* Tier 3: Clock Chamber (Height: 34 to 42m) */}
        <mesh position={[0, 38, 0]} castShadow receiveShadow material={sandstoneMat}>
          <boxGeometry args={[11.2, 8, 11.2]} />
        </mesh>
        {/* Clock Dials on 4 Faces */}
        {/* South Dial (Facing Plaza Entrance) */}
        <mesh position={[0, 38, 5.65]} rotation={[Math.PI / 2, 0, 0]} material={clockDialMat}>
          <cylinderGeometry args={[3.2, 3.2, 0.15, 32]} />
        </mesh>
        <mesh position={[0, 38, 5.75]} material={darkStoneMat}>
          <boxGeometry args={[0.2, 2.8, 0.1]} />
        </mesh>
        <mesh position={[0, 38, 5.75]} material={darkStoneMat}>
          <boxGeometry args={[2.0, 0.2, 0.1]} />
        </mesh>

        {/* North Dial */}
        <mesh position={[0, 38, -5.65]} rotation={[Math.PI / 2, 0, 0]} material={clockDialMat}>
          <cylinderGeometry args={[3.2, 3.2, 0.15, 32]} />
        </mesh>
        {/* East Dial */}
        <mesh position={[5.65, 38, 0]} rotation={[0, 0, Math.PI / 2]} material={clockDialMat}>
          <cylinderGeometry args={[3.2, 3.2, 0.15, 32]} />
        </mesh>
        {/* West Dial */}
        <mesh position={[-5.65, 38, 0]} rotation={[0, 0, Math.PI / 2]} material={clockDialMat}>
          <cylinderGeometry args={[3.2, 3.2, 0.15, 32]} />
        </mesh>

        {/* Tier 4: Belfry Arcade with Arched Colonnade (Height: 42 to 49m) */}
        <mesh position={[0, 45.5, 0]} castShadow material={sandstoneMat}>
          <boxGeometry args={[9.5, 7, 9.5]} />
        </mesh>
        <mesh position={[0, 46, 0]} material={goldOrnamentMat}>
          <cylinderGeometry args={[1.5, 1.8, 2.5, 16]} />
        </mesh>

        {/* Tier 5: Steep Gothic Spire & Balustrade (Height: 49 to 64m) */}
        <mesh position={[0, 56.5, 0]} castShadow material={roofSlateMat}>
          <coneGeometry args={[5.2, 15, 8]} />
        </mesh>
        {/* Golden Finial Orb & Spire Tip */}
        <mesh position={[0, 64.5, 0]} material={goldOrnamentMat}>
          <sphereGeometry args={[0.8, 16, 16]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 3. FLANKING CIVIC PALACES (EAST & WEST) */}
      {/* ================================================================== */}
      {/* West Civic Hall (Connecting to Old District) */}
      <group position={[-28, 0, -122]}>
        <mesh position={[0, 7.5, 0]} castShadow receiveShadow material={sandstoneMat}>
          <boxGeometry args={[16, 15, 28]} />
        </mesh>
        {/* Mansard Hip Roof */}
        <mesh position={[0, 18, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={roofTerracottaMat}>
          <coneGeometry args={[12, 7, 4]} />
        </mesh>
        {/* Columned Arcade Loggia */}
        <mesh position={[6.5, 3, 0]} castShadow material={darkStoneMat}>
          <boxGeometry args={[2.5, 6, 26]} />
        </mesh>
      </group>

      {/* East Civic Hall (Connecting to River Crossing) */}
      <group position={[28, 0, -122]}>
        <mesh position={[0, 7.5, 0]} castShadow receiveShadow material={sandstoneMat}>
          <boxGeometry args={[16, 15, 28]} />
        </mesh>
        {/* Mansard Hip Roof */}
        <mesh position={[0, 18, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={roofSlateMat}>
          <coneGeometry args={[12, 7, 4]} />
        </mesh>
        {/* Columned Arcade Loggia */}
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

      {treePositions.map(([x, y, z], idx) => (
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
