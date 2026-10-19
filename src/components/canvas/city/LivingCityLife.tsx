'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';
import {
  getBuildingFacadePBR,
  getRoofTilePBR,
  getRealMetalPBR,
} from '@/lib/pbrTextures';

interface TrafficCarConfig {
  laneZ: number;
  dir: 1 | -1;
  speed: number;
  startX: number;
  minX: number;
  maxX: number;
  y: number;
  color: string;
}

export function LivingCityLife() {
  const carRefs = useRef<THREE.Group[]>([]);
  const boatRefs = useRef<THREE.Group[]>([]);
  const aerialSpinnerRefs = useRef<THREE.Group[]>([]);

  const {
    carPaintMats,
    carGlassMat,
    wheelMat,
    headlightMat,
    headlightBeamMat,
    taillightMat,
    cyberPodMat,
    boatHullMat,
    boatCabinMat,
    wakeMat,
    bgHeritageMat,
    bgRoofTerraMat,
    bgRoofSlateMat,
    lampPoleMat,
    lampBulbMat,
    lampConeMat,
  } = useMemo(() => {
    const metal = getRealMetalPBR(2, 2);
    const heritage = getBuildingFacadePBR('heritage', 3, 3);
    const terraRoof = getRoofTilePBR('#A64E36', 4, 4);
    const slateRoof = getRoofTilePBR('#2B3540', 4, 4);

    const paintColors = ['#c81d25', '#1b263b', '#e0e1dd', '#d4a338', '#22577a', '#141619'];
    const paints = paintColors.map(
      (c) =>
        new THREE.MeshPhysicalMaterial({
          color: c,
          normalMap: metal.normalMap,
          normalScale: new THREE.Vector2(0.15, 0.15),
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          roughness: 0.14,
          metalness: 0.86,
        })
    );

    return {
      carPaintMats: paints,
      carGlassMat: new THREE.MeshPhysicalMaterial({
        color: '#0b1520',
        clearcoat: 1.0,
        roughness: 0.05,
        metalness: 0.9,
      }),
      wheelMat: new THREE.MeshStandardMaterial({
        color: '#121417',
        roughness: 0.7,
        metalness: 0.3,
      }),
      headlightMat: new THREE.MeshBasicMaterial({
        color: '#fff6d6',
      }),
      headlightBeamMat: new THREE.MeshBasicMaterial({
        color: '#ffe8b0',
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      taillightMat: new THREE.MeshBasicMaterial({
        color: '#ff1e26',
      }),
      cyberPodMat: new THREE.MeshBasicMaterial({
        color: '#00f0ff',
      }),
      boatHullMat: new THREE.MeshPhysicalMaterial({
        color: '#f0ece1',
        clearcoat: 0.85,
        roughness: 0.2,
        metalness: 0.3,
      }),
      boatCabinMat: new THREE.MeshStandardMaterial({
        color: '#ffe299',
        emissive: '#ff9d2e',
        emissiveIntensity: 2.0,
        roughness: 0.15,
      }),
      wakeMat: new THREE.MeshBasicMaterial({
        color: '#d8f0ff',
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      bgHeritageMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: heritage.map,
        normalMap: heritage.normalMap,
        roughnessMap: heritage.roughnessMap,
        emissive: '#ffb347',
        emissiveMap: heritage.emissiveMap,
        emissiveIntensity: 0.55,
        roughness: 0.68,
        metalness: 0.22,
      }),
      bgRoofTerraMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: terraRoof.map,
        normalMap: terraRoof.normalMap,
        roughness: 0.56,
        metalness: 0.18,
      }),
      bgRoofSlateMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: slateRoof.map,
        normalMap: slateRoof.normalMap,
        roughness: 0.48,
        metalness: 0.36,
      }),
      lampPoleMat: new THREE.MeshStandardMaterial({
        color: '#24292e',
        roughness: 0.4,
        metalness: 0.85,
      }),
      lampBulbMat: new THREE.MeshBasicMaterial({
        color: '#ffd280',
      }),
      lampConeMat: new THREE.MeshBasicMaterial({
        color: '#ffbe66',
        transparent: true,
        opacity: 0.065,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      carPaintMats.forEach((m) => m.dispose());
      carGlassMat.dispose();
      wheelMat.dispose();
      headlightMat.dispose();
      headlightBeamMat.dispose();
      taillightMat.dispose();
      cyberPodMat.dispose();
      boatHullMat.dispose();
      boatCabinMat.dispose();
      wakeMat.dispose();
      bgHeritageMat.dispose();
      bgRoofTerraMat.dispose();
      bgRoofSlateMat.dispose();
      lampPoleMat.dispose();
      lampBulbMat.dispose();
      lampConeMat.dispose();
    };
  }, [
    carPaintMats,
    carGlassMat,
    wheelMat,
    headlightMat,
    headlightBeamMat,
    taillightMat,
    cyberPodMat,
    boatHullMat,
    boatCabinMat,
    wakeMat,
    bgHeritageMat,
    bgRoofTerraMat,
    bgRoofSlateMat,
    lampPoleMat,
    lampBulbMat,
    lampConeMat,
  ]);

  // Moving vehicle traffic across West Avenue, East Avenue, and River Crossing Bridge
  const trafficCars: TrafficCarConfig[] = useMemo(
    () => [
      // Bridge traffic (Y = 4.95 on bridge deck, X = 48..118)
      { laneZ: -117.6, dir: 1, speed: 9.5, startX: 55, minX: 48, maxX: 118, y: 4.95, color: '#c81d25' },
      { laneZ: -117.6, dir: 1, speed: 9.5, startX: 88, minX: 48, maxX: 118, y: 4.95, color: '#e0e1dd' },
      { laneZ: -122.4, dir: -1, speed: 8.8, startX: 108, minX: 48, maxX: 118, y: 4.95, color: '#1b263b' },
      { laneZ: -122.4, dir: -1, speed: 8.8, startX: 74, minX: 48, maxX: 118, y: 4.95, color: '#d4a338' },
      // West & East Boulevard traffic (Y = 0.15, X = -58..-18 and 18..45)
      { laneZ: -117.5, dir: 1, speed: 7.5, startX: -52, minX: -58, maxX: -20, y: 0.15, color: '#22577a' },
      { laneZ: -122.5, dir: -1, speed: 7.2, startX: -24, minX: -58, maxX: -20, y: 0.15, color: '#141619' },
      { laneZ: -117.5, dir: 1, speed: 7.0, startX: 22, minX: 18, maxX: 45, y: 0.15, color: '#c81d25' },
      { laneZ: -122.5, dir: -1, speed: 7.4, startX: 40, minX: 18, maxX: 45, y: 0.15, color: '#e0e1dd' },
    ],
    []
  );

  // River cruisers / ferries navigating the eastern river channel
  const riverBoats = useMemo(
    () => [
      { x: 74, dir: 1, speed: 3.8, startZ: -185, minZ: -210, maxZ: -55 },
      { x: 94, dir: -1, speed: 3.4, startZ: -80, minZ: -210, maxZ: -55 },
      { x: 84, dir: 1, speed: 4.2, startZ: -140, minZ: -210, maxZ: -55 },
    ],
    []
  );

  // Background skyline architecture filling the northern & mid-city horizon (matches 01-city-panorama.png)
  const skylineBuildings = useMemo(
    () => [
      { x: -34, z: -156, w: 14, d: 14, h: 18, spire: true },
      { x: -16, z: -164, w: 16, d: 13, h: 16, spire: false },
      { x: 2, z: -168, w: 15, d: 15, h: 20, spire: true },
      { x: 26, z: -158, w: 14, d: 14, h: 16, spire: false },
      { x: -46, z: -176, w: 18, d: 16, h: 22, spire: true },
      { x: -24, z: -184, w: 15, d: 14, h: 17, spire: false },
      { x: -4, z: -190, w: 18, d: 16, h: 24, spire: true },
      { x: -28, z: -92, w: 13, d: 13, h: 14, spire: false },
      { x: 28, z: -92, w: 14, d: 13, h: 15, spire: true },
    ],
    []
  );

  // Boulevard streetlamps with volumetric light cones
  const avenueLamps = useMemo(
    () => [
      [-48, 0, -112],
      [-34, 0, -112],
      [-48, 0, -128],
      [-34, 0, -128],
      [24, 0, -112],
      [38, 0, -112],
      [24, 0, -128],
      [38, 0, -128],
      [-12, 0, -78],
      [12, 0, -78],
      [-12, 0, -60],
      [12, 0, -60],
    ],
    []
  );

  useFrame((state) => {
    if (chronosStore.isTimeFrozen) return;
    const t = state.clock.getElapsedTime();
    const pos = chronosStore.timelinePosition;
    // Traffic is visible in modern/industrial/future eras (pos >= 0.4)
    const showRoadTraffic = pos >= 0.38;
    const isFuture = pos >= 0.88;

    carRefs.current.forEach((group, i) => {
      if (!group) return;
      group.visible = showRoadTraffic;
      const cfg = trafficCars[i];
      const span = cfg.maxX - cfg.minX;
      const dist = ((cfg.startX - cfg.minX + t * cfg.speed * cfg.dir) % span + span) % span;
      group.position.x = cfg.minX + dist;
      group.position.y = isFuture ? cfg.y + 1.8 + Math.sin(t * 3 + i) * 0.25 : cfg.y;
    });

    boatRefs.current.forEach((group, i) => {
      if (!group) return;
      const cfg = riverBoats[i];
      const span = cfg.maxZ - cfg.minZ;
      const dist = ((cfg.startZ - cfg.minZ + t * cfg.speed * cfg.dir) % span + span) % span;
      group.position.z = cfg.minZ + dist;
      group.position.y = -1.35 + Math.sin(t * 2.2 + i) * 0.06;
    });

    aerialSpinnerRefs.current.forEach((group, i) => {
      if (!group) return;
      group.visible = pos >= 0.82;
      const angle = t * (0.28 + i * 0.08) + i * 2.1;
      const radius = 52 + i * 16;
      group.position.x = Math.cos(angle) * radius;
      group.position.z = -125 + Math.sin(angle) * radius * 0.7;
      group.position.y = 26 + i * 6 + Math.sin(t * 2 + i) * 1.2;
      group.rotation.y = -angle + Math.PI / 2;
    });
  });

  return (
    <group name="AeternumLivingCity">
      {/* ================================================================== */}
      {/* 1. MOVING GTA-STYLE CLEARCOAT CARS & HEADLIGHT/TAILLIGHT STREAKS   */}
      {/* ================================================================== */}
      {trafficCars.map((cfg, idx) => (
        <group
          key={`traffic-car-${idx}`}
          ref={(el) => {
            if (el) carRefs.current[idx] = el;
          }}
          position={[cfg.startX, cfg.y, cfg.laneZ]}
          rotation={[0, cfg.dir === 1 ? 0 : Math.PI, 0]}
        >
          {/* Lower Sculpted Chassis */}
          <mesh
            position={[0, 0.35, 0]}
            castShadow
            material={carPaintMats[idx % carPaintMats.length]}
          >
            <boxGeometry args={[2.5, 0.42, 1.18]} />
          </mesh>
          {/* Aerodynamic Cabin & Greenhouse */}
          <mesh position={[-0.1, 0.68, 0]} castShadow material={carGlassMat}>
            <boxGeometry args={[1.35, 0.34, 1.02]} />
          </mesh>
          {/* 4 Wheels */}
          {[
            [-0.78, 0.2, 0.58],
            [0.78, 0.2, 0.58],
            [-0.78, 0.2, -0.58],
            [0.78, 0.2, -0.58],
          ].map(([wx, wy, wz], wIdx) => (
            <mesh
              key={`wheel-${wIdx}`}
              position={[wx, wy, wz]}
              rotation={[Math.PI / 2, 0, 0]}
              material={wheelMat}
            >
              <cylinderGeometry args={[0.2, 0.2, 0.14, 12]} />
            </mesh>
          ))}
          {/* Dual Xenon Headlights */}
          <mesh position={[1.26, 0.38, 0.38]} material={headlightMat}>
            <boxGeometry args={[0.06, 0.12, 0.22]} />
          </mesh>
          <mesh position={[1.26, 0.38, -0.38]} material={headlightMat}>
            <boxGeometry args={[0.06, 0.12, 0.22]} />
          </mesh>
          {/* Volumetric Headlight Road Beams */}
          <mesh
            position={[2.9, 0.22, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            material={headlightBeamMat}
          >
            <coneGeometry args={[0.95, 3.4, 12, 1, true]} />
          </mesh>
          {/* Glowing Red LED Taillight Bar */}
          <mesh position={[-1.26, 0.4, 0]} material={taillightMat}>
            <boxGeometry args={[0.06, 0.12, 0.96]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================== */}
      {/* 2. ANIMATED RIVER CRUISERS & ILLUMINATED VESSELS WITH FOAM WAKES   */}
      {/* ================================================================== */}
      {riverBoats.map((b, idx) => (
        <group
          key={`river-boat-${idx}`}
          ref={(el) => {
            if (el) boatRefs.current[idx] = el;
          }}
          position={[b.x, -1.35, b.startZ]}
          rotation={[0, b.dir === 1 ? 0 : Math.PI, 0]}
        >
          {/* Sleek River Vessel Hull */}
          <mesh position={[0, 0.35, 0]} castShadow material={boatHullMat}>
            <boxGeometry args={[2.6, 0.7, 7.5]} />
          </mesh>
          {/* Warm Illuminated Glass Passenger Deck */}
          <mesh position={[0, 0.9, -0.3]} material={boatCabinMat}>
            <boxGeometry args={[2.1, 0.65, 4.8]} />
          </mesh>
          {/* Trailing White Water Foam Wake */}
          <mesh position={[0, 0.02, -5.2]} rotation={[-Math.PI / 2, 0, 0]} material={wakeMat}>
            <planeGeometry args={[2.8, 5.5]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================== */}
      {/* 3. AERIAL CYBER-SPINNERS FOR 2200 CE (THE NEXT AGE)                */}
      {/* ================================================================== */}
      {[0, 1, 2].map((idx) => (
        <group
          key={`aerial-spinner-${idx}`}
          ref={(el) => {
            if (el) aerialSpinnerRefs.current[idx] = el;
          }}
          visible={false}
        >
          <mesh material={carGlassMat}>
            <octahedronGeometry args={[1.4, 1]} />
          </mesh>
          <mesh position={[-1.5, 0, 0]} material={cyberPodMat}>
            <sphereGeometry args={[0.35, 8, 8]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================== */}
      {/* 4. DENSE MID-GROUND & HORIZON EUROPEAN SKYLINE ARCHITECTURE        */}
      {/* ================================================================== */}
      <group name="AeternumHorizonSkyline">
        {skylineBuildings.map((b, idx) => (
          <group key={`skyline-bldg-${idx}`} position={[b.x, 0, b.z]}>
            <mesh position={[0, b.h * 0.5, 0]} castShadow receiveShadow material={bgHeritageMat}>
              <boxGeometry args={[b.w, b.h, b.d]} />
            </mesh>
            <mesh
              position={[0, b.h + 2.8, 0]}
              rotation={[0, Math.PI / 4, 0]}
              castShadow
              material={idx % 2 === 0 ? bgRoofTerraMat : bgRoofSlateMat}
            >
              <coneGeometry args={[Math.max(b.w, b.d) * 0.68, 5.6, 4]} />
            </mesh>
            {b.spire && (
              <group position={[0, b.h + 4, 0]}>
                <mesh position={[0, 3, 0]} castShadow material={bgHeritageMat}>
                  <cylinderGeometry args={[2.2, 2.6, 6, 12]} />
                </mesh>
                <mesh position={[0, 8.5, 0]} castShadow material={bgRoofSlateMat}>
                  <coneGeometry args={[2.5, 6.5, 12]} />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>

      {/* ================================================================== */}
      {/* 5. BOULEVARD STREETLIGHTS WITH VOLUMETRIC GOLDEN LIGHT CONES       */}
      {/* ================================================================== */}
      {avenueLamps.map(([lx, ly, lz], idx) => (
        <group key={`avenue-lamp-${idx}`} position={[lx, ly, lz]}>
          <mesh position={[0, 2.2, 0]} castShadow material={lampPoleMat}>
            <cylinderGeometry args={[0.09, 0.15, 4.4, 8]} />
          </mesh>
          <mesh position={[0, 4.5, 0]} material={lampBulbMat}>
            <sphereGeometry args={[0.32, 10, 10]} />
          </mesh>
          <mesh position={[0, 2.2, 0]} material={lampConeMat}>
            <coneGeometry args={[1.8, 4.4, 14, 1, true]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
