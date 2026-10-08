'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

export function IndustrialQuarter() {
  const {
    brickMat,
    darkIronMat,
    roofMetalMat,
    warmFurnaceMat,
    rustSteelMat,
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
      rustSteelMat: new THREE.MeshStandardMaterial({
        color: '#7D4835',
        roughness: 0.7,
        metalness: 0.4,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      brickMat.dispose();
      darkIronMat.dispose();
      roofMetalMat.dispose();
      warmFurnaceMat.dispose();
      rustSteelMat.dispose();
    };
  }, [
    brickMat,
    darkIronMat,
    roofMetalMat,
    warmFurnaceMat,
    rustSteelMat,
  ]);

  // Smokestacks / Chimneys
  const chimneys = [
    { x: -50, z: -85, height: 38, radius: 1.8 },
    { x: -75, z: -70, height: 42, radius: 2.2 },
    { x: -85, z: -92, height: 34, radius: 1.6 },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================================================================== */}
      {/* 1. MAIN WAREHOUSE / FACTORY HALL 1 (SAW-TOOTH ROOF) */}
      {/* ================================================================== */}
      <group position={[-58, 0, -70]}>
        {/* Main Brick Body */}
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={brickMat}>
          <boxGeometry args={[22, 12, 18]} />
        </mesh>
        {/* Saw-tooth Roof Ridges */}
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
        {/* Illuminated Factory Windows */}
        <mesh position={[0, 7, 9.1]} material={warmFurnaceMat}>
          <planeGeometry args={[16, 2.8]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 2. FACTORY COMPLEX 2 (LARGE HEAVY FORGE) */}
      {/* ================================================================== */}
      <group position={[-78, 0, -82]}>
        <mesh position={[0, 8, 0]} castShadow receiveShadow material={brickMat}>
          <boxGeometry args={[26, 16, 22]} />
        </mesh>
        {/* Slanted Iron Hip Roof */}
        <mesh position={[0, 18.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={roofMetalMat}>
          <coneGeometry args={[16, 5.5, 4]} />
        </mesh>
        {/* Large Factory Doors */}
        <mesh position={[0, 4, 11.1]} material={darkIronMat}>
          <boxGeometry args={[7, 7, 0.4]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 3. TALL FACTORY CHIMNEYS / SMOKESTACKS */}
      {/* ================================================================== */}
      {chimneys.map((c, idx) => (
        <group key={`chimney-${idx}`} position={[c.x, 0, c.z]}>
          {/* Base Plinth */}
          <mesh position={[0, 3, 0]} castShadow receiveShadow material={brickMat}>
            <boxGeometry args={[c.radius * 2.8, 6, c.radius * 2.8]} />
          </mesh>
          {/* Tapered Brick Chimney Shaft */}
          <mesh position={[0, c.height * 0.5, 0]} castShadow receiveShadow material={brickMat}>
            <cylinderGeometry args={[c.radius * 0.7, c.radius, c.height, 16]} />
          </mesh>
          {/* Iron Crown Collar */}
          <mesh position={[0, c.height - 0.5, 0]} material={darkIronMat}>
            <cylinderGeometry args={[c.radius * 0.85, c.radius * 0.85, 1.2, 16]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================== */}
      {/* 4. OVERHEAD INDUSTRIAL PIPELINES & STRUCTURAL STEEL TRUSSES */}
      {/* ================================================================== */}
      {/* Pipe Line from Complex 1 to Complex 2 */}
      <mesh position={[-68, 10, -76]} rotation={[0, 0, Math.PI / 2]} material={darkIronMat}>
        <cylinderGeometry args={[0.7, 0.7, 18, 12]} />
      </mesh>
      {/* Pipe Support Columns */}
      <mesh position={[-68, 5, -76]} material={rustSteelMat}>
        <boxGeometry args={[0.8, 10, 0.8]} />
      </mesh>

      {/* Elevated Conveyor Gantry Bridge */}
      <group position={[-52, 6, -60]}>
        <mesh position={[0, 0, 0]} castShadow material={rustSteelMat}>
          <boxGeometry args={[14, 2.2, 3.2]} />
        </mesh>
        <mesh position={[-5, -3, 0]} material={darkIronMat}>
          <boxGeometry args={[0.6, 6, 0.6]} />
        </mesh>
        <mesh position={[5, -3, 0]} material={darkIronMat}>
          <boxGeometry args={[0.6, 6, 0.6]} />
        </mesh>
      </group>
    </group>
  );
}
