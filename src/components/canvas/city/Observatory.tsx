'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

export function Observatory() {
  const {
    cliffMat,
    stoneWallMat,
    copperDomeMat,
    whiteMarbleMat,
    bronzeMat,
    warmInteriorMat,
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
        color: '#557A68', // Aged patinated copper
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
      warmInteriorMat: new THREE.MeshBasicMaterial({
        color: '#FFDE8A',
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
      warmInteriorMat.dispose();
    };
  }, [
    cliffMat,
    stoneWallMat,
    copperDomeMat,
    whiteMarbleMat,
    bronzeMat,
    warmInteriorMat,
  ]);

  return (
    <group position={[40, 32, -230]}>
      {/* ================================================================== */}
      {/* 1. ELEVATED CLIFF & TERRACE RETAINING WALLS */}
      {/* ================================================================== */}
      {/* Massive Cliff Base */}
      <mesh position={[0, -14, 0]} receiveShadow material={cliffMat}>
        <cylinderGeometry args={[26, 38, 28, 12]} />
      </mesh>

      {/* Main Observatory Stone Terrace Platform */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow material={stoneWallMat}>
        <cylinderGeometry args={[22, 24, 2.5, 32]} />
      </mesh>

      {/* Terrace Stone Balustrade */}
      <mesh position={[0, 1.6, 0]} material={whiteMarbleMat}>
        <cylinderGeometry args={[21.8, 21.8, 0.8, 32, 1, true]} />
      </mesh>

      {/* ================================================================== */}
      {/* 2. THE MONUMENTAL OBSERVATORY DOME */}
      {/* ================================================================== */}
      <group position={[0, 1.2, -3]}>
        {/* Cylindrical Rotunda Base */}
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={whiteMarbleMat}>
          <cylinderGeometry args={[11, 11.5, 12, 32]} />
        </mesh>

        {/* Decorative Classical Cornice Collar */}
        <mesh position={[0, 12.2, 0]} castShadow material={stoneWallMat}>
          <cylinderGeometry args={[12, 12, 0.8, 32]} />
        </mesh>

        {/* Hemispherical Patinated Copper Dome */}
        <mesh position={[0, 12.6, 0]} castShadow material={copperDomeMat}>
          <sphereGeometry args={[11.2, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        {/* Dome Slit Aperture Opening */}
        <mesh position={[0, 19, 5]} rotation={[-0.4, 0, 0]} material={warmInteriorMat}>
          <boxGeometry args={[3.2, 9, 0.5]} />
        </mesh>

        {/* Telescope Barrel Assembly sticking out */}
        <mesh position={[0, 19.5, 6]} rotation={[-0.5, 0, 0]} castShadow material={bronzeMat}>
          <cylinderGeometry args={[0.9, 1.1, 7, 16]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 3. SECONDARY EAST ROTUNDA & CELESTIAL PAVILION */}
      {/* ================================================================== */}
      <group position={[14, 1.2, 6]}>
        <mesh position={[0, 4, 0]} castShadow receiveShadow material={whiteMarbleMat}>
          <cylinderGeometry args={[4.5, 4.8, 8, 24]} />
        </mesh>
        <mesh position={[0, 8.2, 0]} castShadow material={copperDomeMat}>
          <sphereGeometry args={[4.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </group>

      {/* Celestial Armillary Sphere Monument on Terrace */}
      <group position={[-10, 2.2, 6]}>
        <mesh position={[0, 0.8, 0]} material={stoneWallMat}>
          <cylinderGeometry args={[1.5, 1.8, 1.6, 16]} />
        </mesh>
        <mesh position={[0, 2.6, 0]} material={bronzeMat}>
          <torusGeometry args={[1.4, 0.12, 8, 24]} />
        </mesh>
        <mesh position={[0, 2.6, 0]} rotation={[0, Math.PI / 3, 0]} material={bronzeMat}>
          <torusGeometry args={[1.4, 0.12, 8, 24]} />
        </mesh>
        <mesh position={[0, 2.6, 0]} rotation={[Math.PI / 3, 0, 0]} material={bronzeMat}>
          <torusGeometry args={[1.4, 0.12, 8, 24]} />
        </mesh>
      </group>
    </group>
  );
}
