'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import {
  loadFileTexture,
  getRealRockPBR,
  getRoadPBR,
} from '@/lib/pbrTextures';

export function WorldTerrain() {
  const {
    groundMat,
    rockMat,
    hillMat,
    roadMat,
    waterBedMat,
    cliffMat,
    foliageMat,
    trunkMat,
  } = useMemo(() => {
    const grassDiff = loadFileTexture('/textures/grass_diffuse.jpg', 12, 12, true);
    const floorDiff = loadFileTexture('/textures/floor_diffuse.jpg', 18, 18, true);
    const floorNorm = loadFileTexture('/textures/floor_normal.jpg', 18, 18, false);
    const rock = getRealRockPBR(6, 4);
    const road = getRoadPBR(1, 8);

    return {
      groundMat: new THREE.MeshStandardMaterial({
        color: '#34383d',
        map: floorDiff,
        normalMap: floorNorm,
        roughnessMap: rock.roughnessMap,
        roughness: 0.62,
        metalness: 0.22,
      }),
      rockMat: new THREE.MeshStandardMaterial({
        color: '#383d44',
        normalMap: rock.normalMap,
        roughnessMap: rock.roughnessMap,
        roughness: 0.78,
        metalness: 0.16,
      }),
      hillMat: new THREE.MeshStandardMaterial({
        color: '#4e6348',
        map: grassDiff,
        normalMap: rock.normalMap,
        roughnessMap: rock.roughnessMap,
        roughness: 0.86,
        metalness: 0.06,
      }),
      cliffMat: new THREE.MeshStandardMaterial({
        color: '#2a2f37',
        normalMap: rock.normalMap,
        roughnessMap: rock.roughnessMap,
        roughness: 0.74,
        metalness: 0.2,
      }),
      roadMat: new THREE.MeshStandardMaterial({
        color: '#585e66',
        map: road.map,
        normalMap: road.normalMap,
        roughnessMap: road.roughnessMap,
        roughness: 0.55,
        metalness: 0.38,
      }),
      waterBedMat: new THREE.MeshStandardMaterial({
        color: '#0e1b24',
        normalMap: rock.normalMap,
        roughness: 0.85,
        metalness: 0.1,
      }),
      foliageMat: new THREE.MeshStandardMaterial({
        color: '#2d4c2b',
        map: grassDiff,
        roughness: 0.82,
        metalness: 0.05,
      }),
      trunkMat: new THREE.MeshStandardMaterial({
        color: '#3b2818',
        roughness: 0.9,
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
      foliageMat.dispose();
      trunkMat.dispose();
    };
  }, [
    groundMat,
    rockMat,
    hillMat,
    cliffMat,
    roadMat,
    waterBedMat,
    foliageMat,
    trunkMat,
  ]);

  // Sculpted 3D Alpine Mountain Range Geometry (organic multi-octave ridge displacement)
  const { northMountainGeo, westMountainGeo } = useMemo(() => {
    const createMountainRange = (width: number, depth: number, segW: number, segD: number, maxH: number, seed: number) => {
      const geo = new THREE.PlaneGeometry(width, depth, segW, segD);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vz = pos.getZ(i);
        // Normalized coordinates [-1, 1]
        const nx = vx / (width * 0.5);
        const nz = vz / (depth * 0.5);
        // Envelope so edges taper smoothly to ground
        const envZ = Math.max(0, 1 - nz * nz);
        const envX = Math.max(0, 1 - Math.pow(Math.abs(nx), 3.2));
        // Multi-octave ridged multifractal displacement
        const r1 = 1.0 - Math.abs(Math.sin(vx * 0.022 + seed) * Math.cos(vz * 0.028 - seed * 0.5));
        const r2 = 1.0 - Math.abs(Math.sin(vx * 0.055 - vz * 0.045 + seed * 1.7));
        const r3 = 1.0 - Math.abs(Math.cos(vx * 0.11 + vz * 0.09 - seed * 2.3));
        const valleyCarve = 0.65 + 0.35 * Math.cos(vx * 0.016 - 0.4);
        const height =
          (Math.pow(r1, 1.6) * 0.58 + Math.pow(r2, 1.8) * 0.28 + r3 * 0.14) *
          maxH *
          envZ *
          envX *
          valleyCarve;
        pos.setY(i, height - 3);
      }
      geo.computeVertexNormals();
      return geo;
    };

    return {
      northMountainGeo: createMountainRange(540, 180, 96, 36, 155, 1.2),
      westMountainGeo: createMountainRange(240, 130, 48, 24, 92, 3.7),
    };
  }, []);

  useEffect(() => {
    return () => {
      northMountainGeo.dispose();
      westMountainGeo.dispose();
    };
  }, [northMountainGeo, westMountainGeo]);

  // Hillside & Embankment Forest Tree Clusters
  const hillsideTrees = useMemo(
    () => [
      [18, 9, -172, 1.2],
      [25, 11, -176, 1.4],
      [48, 10, -175, 1.1],
      [54, 12, -182, 1.3],
      [16, 18, -192, 1.3],
      [62, 19, -196, 1.2],
      [-32, 3, -162, 1.4],
      [-42, 4, -168, 1.2],
      [-18, 2, -158, 1.1],
      [43, 0.5, -95, 1.2],
      [43, 0.5, -108, 1.1],
      [43, 0.5, -142, 1.3],
      [43, 0.5, -156, 1.15],
      [123, 0.5, -102, 1.25],
      [123, 0.5, -148, 1.2],
    ],
    []
  );

  return (
    <group name="AeternumWorldTerrain">
      {/* 1. Main City Foundation Plateau (Under Central Plaza, Old District, & Industrial) */}
      <mesh position={[-25, -0.6, -125]} receiveShadow material={groundMat}>
        <boxGeometry args={[185, 1.2, 175]} />
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
      {/* 4. NORTHERN HILLS & OBSERVATORY PROMONTORY (PBR Cliff & Grass) */}
      {/* ================================================================== */}
      {/* Primary Observatory Foundation Plateau (Elevation Y=34 to 36) */}
      <mesh position={[40, 18, -230]} receiveShadow castShadow material={rockMat}>
        <cylinderGeometry args={[38, 54, 36, 24]} />
      </mesh>

      {/* Lush Grassy & Mossy Stepped Terraces leading up the Observatory Hillside */}
      <mesh
        position={[38, 26, -212]}
        rotation={[0.05, 0.2, -0.05]}
        receiveShadow
        castShadow
        material={hillMat}
      >
        <cylinderGeometry args={[28, 36, 16, 18]} />
      </mesh>
      <mesh
        position={[42, 17, -195]}
        rotation={[0.08, -0.15, 0.04]}
        receiveShadow
        castShadow
        material={hillMat}
      >
        <cylinderGeometry args={[34, 44, 18, 18]} />
      </mesh>
      <mesh
        position={[35, 8, -178]}
        rotation={[0.06, 0.1, 0]}
        receiveShadow
        castShadow
        material={hillMat}
      >
        <cylinderGeometry args={[40, 50, 14, 18]} />
      </mesh>

      {/* Rugged Granite Rock Outcrops & Escarpments (West & East Ridges) */}
      <mesh
        position={[-20, 16, -245]}
        rotation={[0.08, 0.4, -0.05]}
        receiveShadow
        castShadow
        material={cliffMat}
      >
        <cylinderGeometry args={[22, 42, 34, 12]} />
      </mesh>
      <mesh
        position={[-55, 12, -225]}
        rotation={[-0.05, -0.3, 0.06]}
        receiveShadow
        castShadow
        material={hillMat}
      >
        <cylinderGeometry args={[24, 38, 26, 12]} />
      </mesh>
      <mesh
        position={[95, 18, -235]}
        rotation={[-0.08, -0.35, 0.08]}
        receiveShadow
        castShadow
        material={cliffMat}
      >
        <cylinderGeometry args={[20, 38, 36, 12]} />
      </mesh>
      <mesh
        position={[120, 14, -210]}
        rotation={[0.06, 0.2, -0.04]}
        receiveShadow
        castShadow
        material={hillMat}
      >
        <cylinderGeometry args={[22, 35, 28, 12]} />
      </mesh>

      {/* ================================================================== */}
      {/* 5. SCULPTED 3D ALPINE MOUNTAIN RANGE MESHES (Ridged Multifractal) */}
      {/* ================================================================== */}
      <mesh
        position={[10, 0, -335]}
        geometry={northMountainGeo}
        material={rockMat}
        receiveShadow
        castShadow
      />
      <mesh
        position={[-165, 0, -195]}
        rotation={[0, Math.PI / 2.2, 0]}
        geometry={westMountainGeo}
        material={cliffMat}
        receiveShadow
        castShadow
      />

      {/* ================================================================== */}
      {/* 6. RADIAL MAIN AVENUES & WET ASPHALT / COBBLESTONE BOULEVARDS */}
      {/* ================================================================== */}
      {/* West Avenue (Plaza -> Old District) */}
      <mesh position={[-38, 0.06, -120]} receiveShadow material={roadMat}>
        <boxGeometry args={[46, 0.12, 14]} />
      </mesh>
      {/* East Avenue (Plaza -> River Crossing Bridge) */}
      <mesh position={[35, 0.06, -120]} receiveShadow material={roadMat}>
        <boxGeometry args={[42, 0.12, 14]} />
      </mesh>
      {/* South-West Avenue (Plaza -> Industrial Quarter) */}
      <mesh
        position={[-35, 0.06, -95]}
        rotation={[0, Math.PI / 4, 0]}
        receiveShadow
        material={roadMat}
      >
        <boxGeometry args={[46, 0.12, 12]} />
      </mesh>
      {/* North Highway (Plaza -> Mountain Foothills & Observatory Ascent) */}
      <mesh
        position={[14, 0.06, -165]}
        rotation={[0, -0.18, 0]}
        receiveShadow
        material={roadMat}
      >
        <boxGeometry args={[14, 0.12, 85]} />
      </mesh>
      {/* Terraced road climbing the foothills toward Observatory */}
      <mesh
        position={[24, 7, -195]}
        rotation={[-0.22, -0.32, 0.08]}
        receiveShadow
        material={roadMat}
      >
        <boxGeometry args={[10, 0.22, 55]} />
      </mesh>

      {/* ================================================================== */}
      {/* 7. HILLSIDE & PROMENADE LUSH FOLIAGE CLUSTERS */}
      {/* ================================================================== */}
      {hillsideTrees.map(([tx, ty, tz, s], idx) => (
        <group key={`terrain-tree-${idx}`} position={[tx, ty, tz]} scale={[s, s, s]}>
          <mesh position={[0, 1.4, 0]} castShadow material={trunkMat}>
            <cylinderGeometry args={[0.22, 0.35, 2.8, 8]} />
          </mesh>
          <mesh position={[0, 3.8, 0]} castShadow material={foliageMat}>
            <coneGeometry args={[2.1, 4.2, 9]} />
          </mesh>
          <mesh position={[0, 5.6, 0]} castShadow material={foliageMat}>
            <coneGeometry args={[1.5, 3.4, 9]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
