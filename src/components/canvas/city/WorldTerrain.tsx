'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

export function WorldTerrain() {
  const { groundMat, rockMat, hillMat, roadMat, waterBedMat, cliffMat } = useMemo(() => {
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
        flatShading: true,
      }),
      hillMat: new THREE.MeshStandardMaterial({
        color: '#2A302B', // Muted historic moss/grass slope
        roughness: 0.95,
        metalness: 0.05,
        flatShading: true,
      }),
      cliffMat: new THREE.MeshStandardMaterial({
        color: '#1C1F24', // Dark granite outcrop
        roughness: 0.85,
        metalness: 0.15,
        flatShading: true,
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
      hillMat.dispose();
      cliffMat.dispose();
      roadMat.dispose();
      waterBedMat.dispose();
    };
  }, [groundMat, rockMat, hillMat, cliffMat, roadMat, waterBedMat]);

  return (
    <group name="AeternumWorldTerrain">
      {/* 1. Main City Foundation Plateau (Under Central Plaza, Old District, & Industrial) */}
      <mesh position={[-25, -0.6, -125]} receiveShadow material={groundMat}>
        <boxGeometry args={[180, 1.2, 170]} />
      </mesh>

      {/* 2. South Approach & Portal Transition Terrace (from Chamber threshold) */}
      <mesh position={[0, -0.6, -55]} receiveShadow material={roadMat}>
        <boxGeometry args={[65, 1.2, 50]} />
      </mesh>

      {/* 3. Eastern River Basin Depression with Tiered Embankment Shelves */}
      <mesh position={[85, -2.4, -135]} receiveShadow material={waterBedMat}>
        <boxGeometry args={[75, 2.4, 210]} />
      </mesh>

      {/* River Embankment Stone Retaining Walls & Lower Promenade Shelf */}
      <mesh position={[48, -0.2, -135]} receiveShadow castShadow material={rockMat}>
        <boxGeometry args={[4, 2.2, 210]} />
      </mesh>
      <mesh position={[118, -0.2, -135]} receiveShadow castShadow material={rockMat}>
        <boxGeometry args={[4, 2.2, 210]} />
      </mesh>
      {/* Lower water-level stone riprap shelves */}
      <mesh position={[50.5, -1.2, -135]} receiveShadow material={rockMat}>
        <boxGeometry args={[3, 1.0, 210]} />
      </mesh>
      <mesh position={[115.5, -1.2, -135]} receiveShadow material={rockMat}>
        <boxGeometry args={[3, 1.0, 210]} />
      </mesh>

      {/* ================================================================== */}
      {/* 4. NORTHERN HILLS & OBSERVATORY PROMONTORY (Organic Tiered Cliffs) */}
      {/* Replaces artificial geometric cones with terraced architectural crags */}
      {/* ================================================================== */}
      {/* Primary Observatory Foundation Plateau (Elevation Y=34 to 36) */}
      <mesh position={[40, 18, -230]} receiveShadow castShadow material={rockMat}>
        <cylinderGeometry args={[38, 52, 36, 12]} />
      </mesh>

      {/* Stepped Terraces leading up the Observatory Hillside */}
      <mesh position={[38, 28, -215]} rotation={[0.05, 0.2, -0.05]} receiveShadow castShadow material={hillMat}>
        <boxGeometry args={[56, 16, 42]} />
      </mesh>
      <mesh position={[42, 20, -195]} rotation={[0.1, -0.15, 0.05]} receiveShadow castShadow material={hillMat}>
        <boxGeometry args={[68, 18, 48]} />
      </mesh>
      <mesh position={[35, 10, -178]} rotation={[0.08, 0.1, 0]} receiveShadow castShadow material={hillMat}>
        <boxGeometry args={[78, 14, 40]} />
      </mesh>

      {/* Rugged Granite Rock Outcrops & Escarpments (West Ridge) */}
      <mesh position={[-20, 16, -245]} rotation={[0.1, 0.4, -0.08]} receiveShadow castShadow material={cliffMat}>
        <boxGeometry args={[70, 32, 60]} />
      </mesh>
      <mesh position={[-55, 12, -225]} rotation={[-0.05, -0.3, 0.1]} receiveShadow castShadow material={cliffMat}>
        <boxGeometry args={[65, 24, 55]} />
      </mesh>
      <mesh position={[-15, 25, -270]} rotation={[0.15, 0.25, 0]} receiveShadow castShadow material={rockMat}>
        <boxGeometry args={[85, 45, 65]} />
      </mesh>

      {/* Rugged Granite Rock Outcrops & Escarpments (East Ridge overlooking River Gorge) */}
      <mesh position={[95, 18, -235]} rotation={[-0.1, -0.35, 0.12]} receiveShadow castShadow material={cliffMat}>
        <boxGeometry args={[60, 34, 65]} />
      </mesh>
      <mesh position={[120, 14, -210]} rotation={[0.08, 0.2, -0.05]} receiveShadow castShadow material={rockMat}>
        <boxGeometry args={[55, 28, 60]} />
      </mesh>
      <mesh position={[105, 26, -265]} rotation={[-0.12, 0.3, 0.05]} receiveShadow castShadow material={cliffMat}>
        <boxGeometry args={[75, 48, 70]} />
      </mesh>

      {/* ================================================================== */}
      {/* 5. DISTANT BACKDROP MOUNTAIN RIDGE SILHOUETTES */}
      {/* Tiered alpine horizon providing cinematic depth behind Observatory */}
      {/* ================================================================== */}
      <mesh position={[0, 48, -330]} receiveShadow material={rockMat}>
        <boxGeometry args={[420, 95, 30]} />
      </mesh>
      <mesh position={[60, 62, -350]} rotation={[0, 0.1, 0.02]} receiveShadow material={cliffMat}>
        <boxGeometry args={[260, 110, 25]} />
      </mesh>
      <mesh position={[-110, 55, -345]} rotation={[0, -0.15, -0.03]} receiveShadow material={rockMat}>
        <boxGeometry args={[220, 100, 25]} />
      </mesh>
      {/* Western Horizon Mountain Barrier */}
      <mesh position={[-165, 30, -190]} rotation={[0, 0.08, 0]} receiveShadow material={rockMat}>
        <boxGeometry args={[50, 70, 250]} />
      </mesh>

      {/* ================================================================== */}
      {/* 6. RADIAL MAIN AVENUES & HISTORIC STREET FOUNDATIONS */}
      {/* Connecting Chronos Plaza to Districts */}
      {/* ================================================================== */}
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
      {/* North Highway (Plaza -> Mountain Foothills & Observatory Ascent) */}
      <mesh position={[14, 0.05, -165]} rotation={[0, -0.18, 0]} receiveShadow material={roadMat}>
        <boxGeometry args={[14, 0.1, 85]} />
      </mesh>
      {/* Terraced road climbing the foothills toward Observatory */}
      <mesh position={[24, 7, -195]} rotation={[-0.22, -0.32, 0.08]} receiveShadow material={roadMat}>
        <boxGeometry args={[10, 0.2, 55]} />
      </mesh>
    </group>
  );
}
