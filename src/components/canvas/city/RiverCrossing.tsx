'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';
import { getTemporalMorphState } from '@/types/phase06';
import {
  loadFileTexture,
  getRealBrickPBR,
  getRealWoodPBR,
  getRealRockPBR,
  getRealMetalPBR,
  getBuildingFacadePBR,
  getRoofTilePBR,
  getRoadPBR,
} from '@/lib/pbrTextures';

export function RiverCrossing() {
  const waterRef = useRef<THREE.Mesh>(null);

  // Era-specific bridge variant refs
  const originBridgeRef = useRef<THREE.Group>(null);
  const kingdomBridgeRef = useRef<THREE.Group>(null);
  const machineBridgeRef = useRef<THREE.Group>(null);
  const presentBridgeRef = useRef<THREE.Group>(null);
  const nextAgeBridgeRef = useRef<THREE.Group>(null);

  const {
    waterNormal1,
    waterNormal2,
    bridgeStoneMat,
    bridgeRoadMat,
    darkStoneMat,
    quaysideMat,
    waterMat,
    foamMat,
    buildingMat,
    terracottaMat,
    lampMat,
    statueMat,
    timberMat,
    ironMat,
    brickMat,
    cyanEnergyMat,
  } = useMemo(() => {
    const wNorm1 = loadFileTexture('/textures/waternormals.jpg', 6, 18, false);
    const wNorm2 = loadFileTexture('/textures/water_normal_2.jpg', 8, 22, false);
    const rock = getRealRockPBR(4, 4);
    const brick = getRealBrickPBR(3, 3);
    const wood = getRealWoodPBR(2, 2);
    const metal = getRealMetalPBR(2, 2);
    const road = getRoadPBR(1, 6);
    const heritageFacade = getBuildingFacadePBR('heritage', 3, 2);
    const roofTerra = getRoofTilePBR('#9C4C36', 4, 4);

    return {
      waterNormal1: wNorm1,
      waterNormal2: wNorm2,
      bridgeStoneMat: new THREE.MeshStandardMaterial({
        color: '#C8B59E',
        normalMap: rock.normalMap,
        roughnessMap: rock.roughnessMap,
        roughness: 0.62,
        metalness: 0.2,
      }),
      bridgeRoadMat: new THREE.MeshStandardMaterial({
        color: '#62666c',
        map: road.map,
        normalMap: road.normalMap,
        roughnessMap: road.roughnessMap,
        roughness: 0.48,
        metalness: 0.35,
      }),
      darkStoneMat: new THREE.MeshStandardMaterial({
        color: '#2A3036',
        normalMap: rock.normalMap,
        roughnessMap: rock.roughnessMap,
        roughness: 0.68,
        metalness: 0.25,
      }),
      quaysideMat: new THREE.MeshStandardMaterial({
        color: '#3A4047',
        normalMap: rock.normalMap,
        roughnessMap: rock.roughnessMap,
        roughness: 0.62,
        metalness: 0.28,
      }),
      waterMat: new THREE.MeshPhysicalMaterial({
        color: '#12364a',
        normalMap: wNorm1,
        normalScale: new THREE.Vector2(0.85, 0.85),
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        clearcoatNormalMap: wNorm2,
        clearcoatNormalScale: new THREE.Vector2(0.6, 0.6),
        roughness: 0.08,
        metalness: 0.86,
        reflectivity: 0.95,
      }),
      foamMat: new THREE.MeshBasicMaterial({
        color: '#d8ecff',
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      buildingMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: heritageFacade.map,
        normalMap: heritageFacade.normalMap,
        roughnessMap: heritageFacade.roughnessMap,
        emissive: '#ffae42',
        emissiveMap: heritageFacade.emissiveMap,
        emissiveIntensity: 0.55,
        roughness: 0.72,
        metalness: 0.2,
      }),
      terracottaMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: roofTerra.map,
        normalMap: roofTerra.normalMap,
        roughness: 0.58,
        metalness: 0.18,
      }),
      lampMat: new THREE.MeshBasicMaterial({
        color: '#FFD07A',
      }),
      statueMat: new THREE.MeshStandardMaterial({
        color: '#3B4446',
        normalMap: metal.normalMap,
        roughness: 0.35,
        metalness: 0.78,
      }),
      timberMat: new THREE.MeshStandardMaterial({
        color: '#7A5638',
        map: wood.map,
        bumpMap: wood.bumpMap,
        bumpScale: 0.08,
        roughnessMap: wood.roughnessMap,
        roughness: 0.78,
        metalness: 0.08,
      }),
      ironMat: new THREE.MeshStandardMaterial({
        color: '#262B30',
        normalMap: metal.normalMap,
        roughness: 0.38,
        metalness: 0.9,
      }),
      brickMat: new THREE.MeshStandardMaterial({
        color: '#B85A46',
        map: brick.map,
        bumpMap: brick.bumpMap,
        bumpScale: 0.12,
        roughnessMap: brick.roughnessMap,
        roughness: 0.78,
        metalness: 0.12,
      }),
      cyanEnergyMat: new THREE.MeshBasicMaterial({
        color: '#00F0FF',
        transparent: true,
        opacity: 0.88,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      bridgeStoneMat.dispose();
      bridgeRoadMat.dispose();
      darkStoneMat.dispose();
      quaysideMat.dispose();
      waterMat.dispose();
      foamMat.dispose();
      buildingMat.dispose();
      terracottaMat.dispose();
      lampMat.dispose();
      statueMat.dispose();
      timberMat.dispose();
      ironMat.dispose();
      brickMat.dispose();
      cyanEnergyMat.dispose();
    };
  }, [
    bridgeStoneMat,
    bridgeRoadMat,
    darkStoneMat,
    quaysideMat,
    waterMat,
    foamMat,
    buildingMat,
    terracottaMat,
    lampMat,
    statueMat,
    timberMat,
    ironMat,
    brickMat,
    cyanEnergyMat,
  ]);

  useFrame((state, delta) => {
    if (!chronosStore.isTimeFrozen) {
      const t = state.clock.getElapsedTime();
      if (waterRef.current) {
        waterRef.current.position.y = -1.5 + Math.sin(t * 1.2) * 0.04;
      }
      // Dual counter-scrolling normal maps for realistic river ripples & sun glints
      if (waterNormal1) {
        waterNormal1.offset.y -= delta * 0.18;
        waterNormal1.offset.x += Math.sin(t * 0.4) * delta * 0.04;
      }
      if (waterNormal2) {
        waterNormal2.offset.y -= delta * 0.28;
        waterNormal2.offset.x -= Math.cos(t * 0.5) * delta * 0.05;
      }
    }

    const pos = chronosStore.timelinePosition;
    const { eraA, eraB, blendFactor } = getTemporalMorphState(pos);

    const eraBridgeRefs = {
      'the-origin': originBridgeRef.current,
      'the-kingdom': kingdomBridgeRef.current,
      'the-machine': machineBridgeRef.current,
      'the-present': presentBridgeRef.current,
      'the-next-age': nextAgeBridgeRef.current,
    };

    Object.entries(eraBridgeRefs).forEach(([eraKey, group]) => {
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
    <group position={[0, 0, 0]} name="RiverCrossing_MorphSystem">
      {/* ================================================================== */}
      {/* 1. REALISTIC PBR DUAL-NORMAL ANIMATED RIVER WATER & EMBANKMENTS    */}
      {/* ================================================================== */}
      <mesh
        ref={waterRef}
        position={[85, -1.5, -135]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={waterMat}
      >
        <planeGeometry args={[72, 210, 32, 64]} />
      </mesh>

      {/* River Pier Foam Wakes & Weir Cascade */}
      {[64, 84, 104].map((px) => (
        <mesh
          key={`pier-foam-${px}`}
          position={[px - 7.5, -1.42, -119]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={foamMat}
        >
          <ringGeometry args={[2.0, 3.6, 24]} />
        </mesh>
      ))}

      {/* Northern Secondary Stone Bridge & Waterfall Weir (Art Direction Reference) */}
      <group position={[84, 0, -168]}>
        <mesh position={[0, 3.2, 0]} castShadow receiveShadow material={bridgeStoneMat}>
          <boxGeometry args={[74, 1.2, 8]} />
        </mesh>
        {[64, 84, 104].map((ax) => (
          <mesh key={`north-arch-${ax}`} position={[ax - 84, 0, 0]} castShadow material={bridgeStoneMat}>
            <torusGeometry args={[7.5, 1.2, 10, 24, Math.PI]} />
          </mesh>
        ))}
        {/* White water weir foam strip below northern bridge */}
        <mesh position={[0, -1.4, 4.5]} rotation={[-Math.PI / 2, 0, 0]} material={foamMat}>
          <planeGeometry args={[64, 4.5]} />
        </mesh>
      </group>

      {/* West Embankment Promenade */}
      <mesh position={[49, -0.1, -135]} receiveShadow material={quaysideMat}>
        <boxGeometry args={[6, 1.8, 210]} />
      </mesh>
      <mesh position={[51.8, 0.9, -135]} receiveShadow material={darkStoneMat}>
        <boxGeometry args={[0.4, 0.8, 210]} />
      </mesh>

      {/* East Embankment Promenade */}
      <mesh position={[119, -0.1, -135]} receiveShadow material={quaysideMat}>
        <boxGeometry args={[6, 1.8, 210]} />
      </mesh>
      <mesh position={[116.2, 0.9, -135]} receiveShadow material={darkStoneMat}>
        <boxGeometry args={[0.4, 0.8, 210]} />
      </mesh>

      {/* Permanent Core Bridge Roadway Span (X: 46 to 122) with Wet Cobblestone/Asphalt */}
      <mesh position={[84, 4.2, -120]} castShadow receiveShadow material={bridgeRoadMat}>
        <boxGeometry args={[76, 1.4, 12]} />
      </mesh>
      <mesh position={[84, 5.2, -125.6]} castShadow material={darkStoneMat}>
        <boxGeometry args={[76, 0.8, 0.4]} />
      </mesh>
      <mesh position={[84, 5.2, -114.4]} castShadow material={darkStoneMat}>
        <boxGeometry args={[76, 0.8, 0.4]} />
      </mesh>

      {/* Bridge Street Lamps */}
      {[56, 70, 84, 98, 112].map((lx) => (
        <group key={`bridge-lamp-${lx}`} position={[lx, 5.6, -114.4]}>
          <mesh position={[0, 1.2, 0]} material={ironMat}>
            <cylinderGeometry args={[0.07, 0.1, 2.4, 8]} />
          </mesh>
          <mesh position={[0, 2.5, 0]} material={lampMat}>
            <sphereGeometry args={[0.24, 10, 10]} />
          </mesh>
          <mesh position={[0, 1.2, -11.2]} material={ironMat}>
            <cylinderGeometry args={[0.07, 0.1, 2.4, 8]} />
          </mesh>
          <mesh position={[0, 2.5, -11.2]} material={lampMat}>
            <sphereGeometry args={[0.24, 10, 10]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================== */}
      {/* ERA 01: 1200 BCE — PRIMITIVE TIMBER & STONE CAUSEWAY               */}
      {/* ================================================================== */}
      <group ref={originBridgeRef} visible={false}>
        {[60, 75, 90, 105].map((x) => (
          <mesh key={`origin-pile-${x}`} position={[x, 1, -120]} castShadow material={timberMat}>
            <cylinderGeometry args={[1.5, 1.8, 6, 12]} />
          </mesh>
        ))}
      </group>

      {/* ================================================================== */}
      {/* ERA 02: 1450 CE — MEDIEVAL STONE ARCHES & FORTRESS GATEHOUSES      */}
      {/* ================================================================== */}
      <group ref={kingdomBridgeRef} visible={false}>
        {[64, 84, 104].map((archX) => (
          <group key={`k-arch-${archX}`} position={[archX, 0, -120]}>
            <mesh castShadow material={bridgeStoneMat}>
              <torusGeometry args={[8.5, 1.6, 12, 28, Math.PI]} />
            </mesh>
            <mesh position={[-7.5, 0.5, 0]} castShadow material={darkStoneMat}>
              <cylinderGeometry args={[1.8, 2.2, 4.5, 12]} />
            </mesh>
          </group>
        ))}
        {/* Gatehouses */}
        <group position={[48, 0, -120]}>
          <mesh position={[0, 8, -6]} castShadow material={bridgeStoneMat}>
            <boxGeometry args={[6, 16, 5]} />
          </mesh>
          <mesh position={[0, 8, 6]} castShadow material={bridgeStoneMat}>
            <boxGeometry args={[6, 16, 5]} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* ERA 03: 1890 CE — INDUSTRIAL IRON TRUSS & RIVETED SUPERSTRUCTURE   */}
      {/* ================================================================== */}
      <group ref={machineBridgeRef} visible={false}>
        <mesh position={[84, 10, -125.6]} castShadow material={ironMat}>
          <boxGeometry args={[76, 3, 0.8]} />
        </mesh>
        <mesh position={[84, 10, -114.4]} castShadow material={ironMat}>
          <boxGeometry args={[76, 3, 0.8]} />
        </mesh>
        {[60, 72, 84, 96, 108].map((tx) => (
          <mesh key={`iron-truss-post-${tx}`} position={[tx, 7.5, -120]} castShadow material={ironMat}>
            <boxGeometry args={[1.2, 8, 12]} />
          </mesh>
        ))}
        {[64, 84, 104].map((archX) => (
          <mesh key={`m-pier-${archX}`} position={[archX, 0.5, -120]} castShadow material={brickMat}>
            <cylinderGeometry args={[2.5, 3.0, 5, 12]} />
          </mesh>
        ))}
      </group>

      {/* ================================================================== */}
      {/* ERA 04: 2026 CE — CLASSICAL CHARLES BRIDGE & MONUMENT STATUES       */}
      {/* ================================================================== */}
      <group ref={presentBridgeRef} visible={true}>
        {[64, 84, 104].map((archX) => (
          <group key={`p-arch-${archX}`} position={[archX, 0, -120]}>
            <mesh castShadow material={bridgeStoneMat}>
              <torusGeometry args={[8.5, 1.6, 14, 32, Math.PI]} />
            </mesh>
            <mesh position={[-7.5, 0.5, 0]} castShadow material={darkStoneMat}>
              <cylinderGeometry args={[1.8, 2.2, 4.5, 14]} />
            </mesh>
          </group>
        ))}
        {/* Bridge Gatehouse Towers */}
        <group position={[48, 0, -120]}>
          <mesh position={[0, 7.5, -6]} castShadow material={buildingMat}>
            <boxGeometry args={[6, 15, 5]} />
          </mesh>
          <mesh position={[0, 16.5, -6]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
            <coneGeometry args={[4.4, 5.5, 4]} />
          </mesh>
          <mesh position={[0, 7.5, 6]} castShadow material={buildingMat}>
            <boxGeometry args={[6, 15, 5]} />
          </mesh>
          <mesh position={[0, 16.5, 6]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
            <coneGeometry args={[4.4, 5.5, 4]} />
          </mesh>
        </group>
        {/* Balustrade Statues */}
        {[64, 76, 92, 104].map((statueX) => (
          <group key={`p-statue-${statueX}`} position={[statueX, 5.6, -125.6]}>
            <mesh position={[0, 0.4, 0]} castShadow material={darkStoneMat}>
              <boxGeometry args={[0.9, 0.8, 0.7]} />
            </mesh>
            <mesh position={[0, 1.3, 0]} castShadow material={statueMat}>
              <cylinderGeometry args={[0.25, 0.35, 1.2, 12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================================================================== */}
      {/* ERA 05: 2200 CE — QUANTUM SKYWAY CONDUIT & LEVITATING TRANSIT      */}
      {/* ================================================================== */}
      <group ref={nextAgeBridgeRef} visible={false}>
        <mesh position={[84, 7.2, -125.6]} material={cyanEnergyMat}>
          <boxGeometry args={[76, 0.6, 0.6]} />
        </mesh>
        <mesh position={[84, 7.2, -114.4]} material={cyanEnergyMat}>
          <boxGeometry args={[76, 0.6, 0.6]} />
        </mesh>
        <mesh position={[84, 12, -120]} material={cyanEnergyMat}>
          <boxGeometry args={[76, 0.4, 6]} />
        </mesh>
        {[55, 84, 115].map((px) => (
          <mesh key={`future-pylon-${px}`} position={[px, 9, -120]} castShadow material={darkStoneMat}>
            <cylinderGeometry args={[0.6, 1.2, 10, 12]} />
          </mesh>
        ))}
      </group>

      {/* East Bank Riverside Buildings (Detailed Multi-Story Heritage Palaces) */}
      <group position={[132, 0, -135]}>
        <mesh position={[0, 7, 0]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[15, 14, 28]} />
        </mesh>
        <mesh position={[0, 15.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[11, 5.5, 4]} />
        </mesh>
        <mesh position={[0, 6, 24]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[13, 12, 16]} />
        </mesh>
        <mesh position={[0, 13.8, 24]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[9.5, 4.8, 4]} />
        </mesh>
        <mesh position={[0, 6.5, -24]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[14, 13, 18]} />
        </mesh>
        <mesh position={[0, 14.8, -24]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[10, 5.0, 4]} />
        </mesh>
      </group>
    </group>
  );
}
