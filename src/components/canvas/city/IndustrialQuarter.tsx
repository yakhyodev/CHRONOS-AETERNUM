'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';
import { getTemporalMorphState } from '@/types/phase06';
import {
  getRealBrickPBR,
  getRealWoodPBR,
  getRealRockPBR,
  getRealMetalPBR,
  getBuildingFacadePBR,
  loadFileTexture,
} from '@/lib/pbrTextures';

export function IndustrialQuarter() {
  const originRef = useRef<THREE.Group>(null);
  const kingdomRef = useRef<THREE.Group>(null);
  const machineRef = useRef<THREE.Group>(null);
  const presentRef = useRef<THREE.Group>(null);
  const nextAgeRef = useRef<THREE.Group>(null);
  const smokeGroupRef = useRef<THREE.Group>(null);

  const {
    factoryFacadeMat,
    brickMat,
    darkIronMat,
    roofMetalMat,
    warmFurnaceMat,
    stoneMat,
    timberMat,
    cyanEnergyMat,
    smokeMat,
  } = useMemo(() => {
    const victorianFacade = getBuildingFacadePBR('victorian', 3, 2);
    const brick = getRealBrickPBR(2, 6);
    const wood = getRealWoodPBR(2, 2);
    const rock = getRealRockPBR(3, 3);
    const metal = getRealMetalPBR(2, 2);
    const plasmaTex = loadFileTexture('/textures/plasma_core.jpg', 2, 1, true);
    const noiseTex = loadFileTexture('/textures/noise.png', 1, 1, false);

    return {
      factoryFacadeMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: victorianFacade.map,
        normalMap: victorianFacade.normalMap,
        roughnessMap: victorianFacade.roughnessMap,
        emissive: '#ff9436',
        emissiveMap: victorianFacade.emissiveMap,
        emissiveIntensity: 0.55,
        roughness: 0.72,
        metalness: 0.22,
      }),
      brickMat: new THREE.MeshStandardMaterial({
        color: '#AD4E3A',
        map: brick.map,
        bumpMap: brick.bumpMap,
        bumpScale: 0.14,
        roughnessMap: brick.roughnessMap,
        roughness: 0.78,
        metalness: 0.12,
      }),
      darkIronMat: new THREE.MeshStandardMaterial({
        color: '#262A30',
        normalMap: metal.normalMap,
        roughness: 0.36,
        metalness: 0.88,
      }),
      roofMetalMat: new THREE.MeshStandardMaterial({
        color: '#3A424C',
        normalMap: metal.normalMap,
        roughness: 0.4,
        metalness: 0.68,
      }),
      warmFurnaceMat: new THREE.MeshStandardMaterial({
        color: '#FFC278',
        map: plasmaTex,
        emissive: '#FF5E14',
        emissiveMap: plasmaTex,
        emissiveIntensity: 2.8,
        roughness: 0.2,
      }),
      stoneMat: new THREE.MeshStandardMaterial({
        color: '#4E4842',
        normalMap: rock.normalMap,
        roughnessMap: rock.roughnessMap,
        roughness: 0.82,
        metalness: 0.1,
      }),
      timberMat: new THREE.MeshStandardMaterial({
        color: '#78563A',
        map: wood.map,
        bumpMap: wood.bumpMap,
        bumpScale: 0.08,
        roughnessMap: wood.roughnessMap,
        roughness: 0.76,
        metalness: 0.08,
      }),
      cyanEnergyMat: new THREE.MeshBasicMaterial({
        color: '#00F0FF',
        transparent: true,
        opacity: 0.88,
      }),
      smokeMat: new THREE.MeshBasicMaterial({
        color: '#d4b89e',
        alphaMap: noiseTex,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      factoryFacadeMat.dispose();
      brickMat.dispose();
      darkIronMat.dispose();
      roofMetalMat.dispose();
      warmFurnaceMat.dispose();
      stoneMat.dispose();
      timberMat.dispose();
      cyanEnergyMat.dispose();
      smokeMat.dispose();
    };
  }, [
    factoryFacadeMat,
    brickMat,
    darkIronMat,
    roofMetalMat,
    warmFurnaceMat,
    stoneMat,
    timberMat,
    cyanEnergyMat,
    smokeMat,
  ]);

  useFrame((state) => {
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

    if (smokeGroupRef.current && !chronosStore.isTimeFrozen) {
      const t = state.clock.getElapsedTime();
      smokeGroupRef.current.children.forEach((child, idx) => {
        child.position.y = 40 + ((t * 3.5 + idx * 4.2) % 16);
        const s = 1.0 + ((t * 3.5 + idx * 4.2) % 16) * 0.22;
        child.scale.set(s, s * 0.7, s);
      });
    }
  });

  return (
    <group position={[0, 0, 0]} name="IndustrialQuarter_MorphSystem">
      {/* Permanent Anchor Factory Complex & Sawtooth Foundry Halls */}
      <group position={[-58, 0, -70]}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={factoryFacadeMat}>
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

        {/* Secondary Adjacent Brick Foundry Hall & Arched Viaduct */}
        <mesh position={[-22, 5.5, -14]} castShadow receiveShadow material={factoryFacadeMat}>
          <boxGeometry args={[18, 11, 20]} />
        </mesh>
        <mesh position={[-22, 12.2, -14]} rotation={[0, Math.PI / 4, 0]} castShadow material={roofMetalMat}>
          <coneGeometry args={[14, 5, 4]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* ERA 01: 1200 BCE — PRIMITIVE CLAY & BRONZE HEARTHS                */}
      {/* ================================================================== */}
      <group ref={originRef} visible={false}>
        {[-50, -75, -85].map((x, i) => (
          <mesh key={`orig-hearth-${i}`} position={[x, 3, -80]} castShadow material={stoneMat}>
            <cylinderGeometry args={[2.5, 3.5, 6, 12]} />
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
        <mesh position={[-75, 4, -66]} rotation={[0, 0, Math.PI / 4]} material={timberMat}>
          <cylinderGeometry args={[4, 4, 1.2, 16]} />
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
              <cylinderGeometry args={[c.r * 0.75, c.r, c.h, 24]} />
            </mesh>
            <mesh position={[0, c.h - 1, 0]} material={darkIronMat}>
              <cylinderGeometry args={[c.r * 0.9, c.r * 0.8, 2, 24]} />
            </mesh>
          </group>
        ))}
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
          { x: -64, z: -88, h: 34, r: 1.7 },
        ].map((c, idx) => (
          <group key={`p-chimney-${idx}`} position={[c.x, 0, c.z]}>
            <mesh position={[0, c.h / 2, 0]} castShadow material={brickMat}>
              <cylinderGeometry args={[c.r * 0.78, c.r, c.h, 24]} />
            </mesh>
            <mesh position={[0, c.h - 0.8, 0]} material={darkIronMat}>
              <cylinderGeometry args={[c.r * 0.92, c.r * 0.82, 1.6, 24]} />
            </mesh>
          </group>
        ))}
        {/* Rising Volumetric Steam/Smoke Puffs above Industrial Chimneys */}
        <group ref={smokeGroupRef}>
          <mesh position={[-50, 40, -85]} material={smokeMat}>
            <sphereGeometry args={[2.6, 12, 12]} />
          </mesh>
          <mesh position={[-75, 42, -70]} material={smokeMat}>
            <sphereGeometry args={[3.0, 12, 12]} />
          </mesh>
          <mesh position={[-64, 38, -88]} material={smokeMat}>
            <sphereGeometry args={[2.4, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* ERA 05: 2200 CE — VERTICAL FUSION PYLONS & TACHYON ENERGY MATRIX   */}
      {/* ================================================================== */}
      <group ref={nextAgeRef} visible={false}>
        {[-50, -75, -88].map((x, i) => (
          <group key={`future-pylon-${i}`} position={[x, 0, -80]}>
            <mesh position={[0, 24, 0]} castShadow material={darkIronMat}>
              <cylinderGeometry args={[1.2, 2.5, 48, 12]} />
            </mesh>
            <mesh position={[0, 48, 0]} material={cyanEnergyMat}>
              <sphereGeometry args={[2.0, 16, 16]} />
            </mesh>
            <mesh position={[0, 24, 0]} material={cyanEnergyMat}>
              <torusGeometry args={[3.2, 0.2, 10, 28]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
