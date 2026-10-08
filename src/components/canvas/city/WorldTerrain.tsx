'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

export function WorldTerrain() {
  const { groundMat, rockMat, roadMat, waterBedMat } = useMemo(() => {
    return {
      groundMat: new THREE.MeshStandardMaterial({
        color: '#282C2E',
        roughness: 0.88,
        metalness: 0.12,
      }),
      rockMat: new THREE.MeshStandardMaterial({
        color: '#22252A',
        roughness: 0.92,
        metalness: 0.08,
      }),
      roadMat: new THREE.MeshStandardMaterial({
        color: '#34383C',
        roughness: 0.75,
        metalness: 0.25,
      }),
      waterBedMat: new THREE.MeshStandardMaterial({
        color: '#151D22',
        roughness: 0.95,
        metalness: 0.05,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      groundMat.dispose();
      rockMat.dispose();
      roadMat.dispose();
      waterBedMat.dispose();
    };
  }, [groundMat, rockMat, roadMat, waterBedMat]);

  return (
    <group>
      {/* 1. Main City Foundation Plateau (Under Central Plaza, Old District, & Industrial) */}
      <mesh position={[-25, -0.6, -125]} receiveShadow material={groundMat}>
        <boxGeometry args={[180, 1.2, 170]} />
      </mesh>

      {/* 2. South Approach & Portal Transition Terrace (from Chamber threshold) */}
      <mesh position={[0, -0.6, -55]} receiveShadow material={roadMat}>
        <boxGeometry args={[65, 1.2, 50]} />
      </mesh>

      {/* 3. Eastern River Basin Depression */}
      <mesh position={[85, -2.4, -135]} receiveShadow material={waterBedMat}>
        <boxGeometry args={[75, 2.4, 190]} />
      </mesh>

      {/* River Embankment Stone Retaining Walls */}
      <mesh position={[48, -0.2, -135]} receiveShadow castShadow material={rockMat}>
        <boxGeometry args={[4, 2.2, 190]} />
      </mesh>
      <mesh position={[118, -0.2, -135]} receiveShadow castShadow material={rockMat}>
        <boxGeometry args={[4, 2.2, 190]} />
      </mesh>

      {/* 4. Northern Mountain Slopes & Observatory Foothills */}
      <mesh position={[40, 14, -245]} receiveShadow castShadow material={rockMat}>
        <coneGeometry args={[68, 36, 10]} />
      </mesh>
      <mesh position={[-25, 12, -265]} receiveShadow castShadow material={rockMat}>
        <coneGeometry args={[75, 32, 8]} />
      </mesh>
      <mesh position={[95, 16, -260]} receiveShadow castShadow material={rockMat}>
        <coneGeometry args={[65, 40, 8]} />
      </mesh>

      {/* Distant Backdrop Mountain Silhouettes */}
      <mesh position={[0, 35, -340]} receiveShadow material={rockMat}>
        <boxGeometry args={[380, 85, 25]} />
      </mesh>
      <mesh position={[-160, 25, -200]} receiveShadow material={rockMat}>
        <boxGeometry args={[45, 60, 240]} />
      </mesh>

      {/* 5. Radial Main Avenues connecting Chronos Plaza to Districts */}
      {/* West Avenue (Plaza -> Old District) */}
      <mesh position={[-38, 0.05, -120]} receiveShadow material={roadMat}>
        <boxGeometry args={[45, 0.1, 14]} />
      </mesh>
      {/* East Avenue (Plaza -> River Crossing Bridge) */}
      <mesh position={[35, 0.05, -120]} receiveShadow material={roadMat}>
        <boxGeometry args={[40, 0.1, 14]} />
      </mesh>
      {/* South-West Avenue (Plaza -> Industrial Quarter) */}
      <mesh position={[-35, 0.05, -95]} rotation={[0, Math.PI / 4, 0]} receiveShadow material={roadMat}>
        <boxGeometry args={[45, 0.1, 12]} />
      </mesh>
      {/* North Highway (Plaza -> Mountain Foothills) */}
      <mesh position={[12, 0.05, -170]} rotation={[0, -0.2, 0]} receiveShadow material={roadMat}>
        <boxGeometry args={[14, 0.1, 75]} />
      </mesh>
    </group>
  );
}
