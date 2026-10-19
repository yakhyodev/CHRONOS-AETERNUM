'use client';

import { useMemo, useEffect, useRef, useSyncExternalStore } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EraLandmark } from './EraLandmark';
import { chronosStore } from '@/lib/chronosStore';
import { TEMPORAL_ERAS } from '@/types/phase05';
import { getTemporalMorphState } from '@/types/phase06';
import type { HistoricalEraId } from '@/types/phase03';
import {
  loadFileTexture,
  getRealRockPBR,
  getRealMetalPBR,
  getBuildingFacadePBR,
  getRoofTilePBR,
} from '@/lib/pbrTextures';

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
    palaceFacadeMat,
    roofTerracottaMat,
    roofSlateMat,
    goldOrnamentMat,
    fountainWaterMat,
    lampGlowMat,
    foliageMat,
  } = useMemo(() => {
    const floorDiff = loadFileTexture('/textures/floor_diffuse.jpg', 8, 8, true);
    const floorNorm = loadFileTexture('/textures/floor_normal.jpg', 8, 8, false);
    const grassDiff = loadFileTexture('/textures/grass_diffuse.jpg', 3, 3, true);
    const waterNorm = loadFileTexture('/textures/waternormals.jpg', 2, 2, false);
    const rock = getRealRockPBR(4, 4);
    const metal = getRealMetalPBR(3, 3);
    const facade = getBuildingFacadePBR('heritage', 3, 2);
    const terraRoof = getRoofTilePBR('#A8523A', 5, 5);
    const slateRoof = getRoofTilePBR('#2F3842', 5, 5);

    return {
      sandstoneMat: new THREE.MeshStandardMaterial({
        color: '#D8C7AE',
        map: floorDiff,
        normalMap: floorNorm,
        roughness: 0.42,
        metalness: 0.28,
      }),
      darkStoneMat: new THREE.MeshStandardMaterial({
        color: '#2A3035',
        normalMap: rock.normalMap,
        roughnessMap: rock.roughnessMap,
        roughness: 0.52,
        metalness: 0.32,
      }),
      palaceFacadeMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: facade.map,
        normalMap: facade.normalMap,
        roughnessMap: facade.roughnessMap,
        emissive: '#ffb84d',
        emissiveMap: facade.emissiveMap,
        emissiveIntensity: 0.55,
        roughness: 0.68,
        metalness: 0.22,
      }),
      roofTerracottaMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: terraRoof.map,
        normalMap: terraRoof.normalMap,
        roughness: 0.55,
        metalness: 0.18,
      }),
      roofSlateMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: slateRoof.map,
        normalMap: slateRoof.normalMap,
        roughness: 0.46,
        metalness: 0.38,
      }),
      goldOrnamentMat: new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        normalMap: metal.normalMap,
        emissive: '#4d3008',
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.94,
      }),
      fountainWaterMat: new THREE.MeshPhysicalMaterial({
        color: '#1b6485',
        emissive: '#0c3b52',
        emissiveIntensity: 0.5,
        normalMap: waterNorm,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        roughness: 0.1,
        metalness: 0.8,
      }),
      lampGlowMat: new THREE.MeshBasicMaterial({
        color: eraConfig.atmosphere.accentColor,
      }),
      foliageMat: new THREE.MeshStandardMaterial({
        color: '#345834',
        map: grassDiff,
        roughness: 0.82,
        metalness: 0.05,
      }),
    };
  }, [eraConfig.atmosphere.accentColor]);

  useEffect(() => {
    return () => {
      sandstoneMat.dispose();
      darkStoneMat.dispose();
      palaceFacadeMat.dispose();
      roofTerracottaMat.dispose();
      roofSlateMat.dispose();
      goldOrnamentMat.dispose();
      fountainWaterMat.dispose();
      lampGlowMat.dispose();
      foliageMat.dispose();
    };
  }, [
    sandstoneMat,
    darkStoneMat,
    palaceFacadeMat,
    roofTerracottaMat,
    roofSlateMat,
    goldOrnamentMat,
    fountainWaterMat,
    lampGlowMat,
    foliageMat,
  ]);

  // Plaza street lamp positions
  const lampPositions: [number, number, number][] = useMemo(() => {
    const pos: [number, number, number][] = [];
    const count = 12;
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
    const count = 14;
    const radius = 30.5;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos.push([Math.cos(angle) * radius, 0, -120 + Math.sin(angle) * radius]);
    }
    return pos;
  }, []);

  const fountainRef = useRef<THREE.Group>(null);
  const treesGroupRef = useRef<THREE.Group>(null);

  // Smooth Time Morph: continuous interpolation across all five eras
  useFrame(() => {
    const pos = chronosStore.timelinePosition;
    const { eraA, eraB, blendFactor } = getTemporalMorphState(pos);

    if (fountainRef.current) {
      if (eraA === 'the-origin' && eraB === 'the-kingdom') {
        const s = Math.max(0, Math.min(1, blendFactor));
        fountainRef.current.visible = s > 0.02;
        fountainRef.current.scale.set(s, s, s);
      } else if (eraA === 'the-origin') {
        fountainRef.current.visible = false;
      } else {
        fountainRef.current.visible = true;
        fountainRef.current.scale.set(1, 1, 1);
      }
    }

    if (treesGroupRef.current) {
      if (eraA === 'the-kingdom' && eraB === 'the-machine') {
        const s = Math.max(0.05, 1.0 - blendFactor * 0.95);
        treesGroupRef.current.visible = s > 0.05;
        treesGroupRef.current.scale.set(s, s, s);
      } else if (eraA === 'the-machine' && eraB === 'the-present') {
        const s = Math.min(1.0, 0.05 + blendFactor * 0.95);
        treesGroupRef.current.visible = s > 0.05;
        treesGroupRef.current.scale.set(s, s, s);
      } else if (eraA === 'the-machine') {
        treesGroupRef.current.visible = false;
      } else {
        treesGroupRef.current.visible = true;
        treesGroupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group name="ChronosPlaza">
      {/* ================================================================== */}
      {/* 1. CIRCULAR CIVIC PLAZA PAVING TIERS (Polished Marble & Gold)      */}
      {/* ================================================================== */}
      <mesh position={[0, 0.05, -120]} receiveShadow material={sandstoneMat}>
        <cylinderGeometry args={[34, 35, 0.25, 64]} />
      </mesh>
      <mesh position={[0, 0.2, -120]} receiveShadow material={darkStoneMat}>
        <cylinderGeometry args={[26, 27, 0.2, 64]} />
      </mesh>
      <mesh position={[0, 0.35, -120]} receiveShadow material={sandstoneMat}>
        <cylinderGeometry args={[18, 19, 0.2, 64]} />
      </mesh>

      {/* Decorative Radial Gold Inlay Rings & Compass Rose */}
      <mesh position={[0, 0.46, -120]} rotation={[-Math.PI / 2, 0, 0]} material={goldOrnamentMat}>
        <ringGeometry args={[12, 12.6, 64]} />
      </mesh>
      <mesh position={[0, 0.46, -120]} rotation={[-Math.PI / 2, 0, 0]} material={goldOrnamentMat}>
        <ringGeometry args={[17.2, 17.7, 64]} />
      </mesh>
      <mesh position={[0, 0.26, -120]} rotation={[-Math.PI / 2, 0, 0]} material={goldOrnamentMat}>
        <ringGeometry args={[25.2, 25.7, 64]} />
      </mesh>

      {/* Central Plaza Bronze & Water Fountain Monument */}
      <group ref={fountainRef} position={[0, 0.4, -106]}>
        <mesh position={[0, 0.6, 0]} receiveShadow castShadow material={sandstoneMat}>
          <cylinderGeometry args={[4.2, 4.6, 1.2, 32]} />
        </mesh>
        {/* Reflective Fountain Water Basin */}
        <mesh position={[0, 1.18, 0]} rotation={[-Math.PI / 2, 0, 0]} material={fountainWaterMat}>
          <circleGeometry args={[3.9, 32]} />
        </mesh>
        <mesh position={[0, 2.2, 0]} receiveShadow castShadow material={darkStoneMat}>
          <cylinderGeometry args={[1.2, 1.6, 2.0, 24]} />
        </mesh>
        <mesh position={[0, 3.1, 0]} receiveShadow castShadow material={goldOrnamentMat}>
          <cylinderGeometry args={[2.2, 1.0, 0.45, 24]} />
        </mesh>
        <mesh position={[0, 4.2, 0]} castShadow material={goldOrnamentMat}>
          <sphereGeometry args={[0.95, 24, 24]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 2. THE ERA-SPECIFIC MONUMENTAL LANDMARK                            */}
      {/* ================================================================== */}
      <EraLandmark />

      {/* ================================================================== */}
      {/* 3. FLANKING CIVIC PALACES (EAST & WEST) WITH PBR ILLUMINATED FACADES*/}
      {/* ================================================================== */}
      {/* West Civic Hall (Connecting to Old District) */}
      <group position={[-28, 0, -122]}>
        <mesh position={[0, 7.5, 0]} castShadow receiveShadow material={palaceFacadeMat}>
          <boxGeometry args={[16, 15, 28]} />
        </mesh>
        <mesh
          position={[0, 18, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
          material={roofTerracottaMat}
        >
          <coneGeometry args={[12.5, 7.5, 4]} />
        </mesh>
        {/* Corner Cupola Towers */}
        <mesh position={[6.5, 9, 12]} castShadow material={palaceFacadeMat}>
          <cylinderGeometry args={[2.4, 2.6, 18, 16]} />
        </mesh>
        <mesh position={[6.5, 19.5, 12]} castShadow material={roofSlateMat}>
          <sphereGeometry args={[2.5, 16, 12]} />
        </mesh>
        <mesh position={[6.5, 3, 0]} castShadow material={darkStoneMat}>
          <boxGeometry args={[2.5, 6, 26]} />
        </mesh>
      </group>

      {/* East Civic Hall (Connecting to River Crossing) */}
      <group position={[28, 0, -122]}>
        <mesh position={[0, 7.5, 0]} castShadow receiveShadow material={palaceFacadeMat}>
          <boxGeometry args={[16, 15, 28]} />
        </mesh>
        <mesh
          position={[0, 18, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
          material={roofSlateMat}
        >
          <coneGeometry args={[12.5, 7.5, 4]} />
        </mesh>
        {/* Corner Cupola Tower */}
        <mesh position={[-6.5, 9, 12]} castShadow material={palaceFacadeMat}>
          <cylinderGeometry args={[2.4, 2.6, 18, 16]} />
        </mesh>
        <mesh position={[-6.5, 19.5, 12]} castShadow material={roofSlateMat}>
          <sphereGeometry args={[2.5, 16, 12]} />
        </mesh>
        <mesh position={[-6.5, 3, 0]} castShadow material={darkStoneMat}>
          <boxGeometry args={[2.5, 6, 26]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 4. PLAZA STREET LAMPS & MULTI-CANOPY CYPRESS TREES                 */}
      {/* ================================================================== */}
      {lampPositions.map(([x, y, z], idx) => (
        <group key={`plaza-lamp-${idx}`} position={[x, y + 0.3, z]}>
          <mesh position={[0, 1.9, 0]} castShadow material={darkStoneMat}>
            <cylinderGeometry args={[0.08, 0.14, 3.8, 10]} />
          </mesh>
          <mesh position={[0, 3.9, 0]} material={goldOrnamentMat}>
            <cylinderGeometry args={[0.22, 0.1, 0.25, 10]} />
          </mesh>
          <mesh position={[0, 4.15, 0]} material={lampGlowMat}>
            <sphereGeometry args={[0.3, 12, 12]} />
          </mesh>
        </group>
      ))}

      <group ref={treesGroupRef}>
        {treePositions.map(([x, y, z], idx) => (
          <group key={`plaza-tree-${idx}`} position={[x, y + 0.3, z]}>
            <mesh position={[0, 1.2, 0]} material={darkStoneMat}>
              <cylinderGeometry args={[0.2, 0.32, 2.4, 10]} />
            </mesh>
            <mesh position={[0, 3.8, 0]} castShadow material={foliageMat}>
              <coneGeometry args={[1.65, 4.2, 10]} />
            </mesh>
            <mesh position={[0, 5.6, 0]} castShadow material={foliageMat}>
              <coneGeometry args={[1.2, 3.4, 10]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
