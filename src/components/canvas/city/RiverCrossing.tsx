'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RiverCrossing() {
  const waterRef = useRef<THREE.Mesh>(null);

  const {
    bridgeStoneMat,
    darkStoneMat,
    quaysideMat,
    waterMat,
    buildingMat,
    terracottaMat,
    lampMat,
    statueMat,
  } = useMemo(() => {
    return {
      bridgeStoneMat: new THREE.MeshStandardMaterial({
        color: '#C4B19A',
        roughness: 0.75,
        metalness: 0.15,
      }),
      darkStoneMat: new THREE.MeshStandardMaterial({
        color: '#282E33',
        roughness: 0.85,
        metalness: 0.15,
      }),
      quaysideMat: new THREE.MeshStandardMaterial({
        color: '#363C42',
        roughness: 0.8,
        metalness: 0.2,
      }),
      waterMat: new THREE.MeshStandardMaterial({
        color: '#163342',
        roughness: 0.12,
        metalness: 0.72,
        flatShading: false,
      }),
      buildingMat: new THREE.MeshStandardMaterial({
        color: '#B5A695',
        roughness: 0.8,
        metalness: 0.1,
      }),
      terracottaMat: new THREE.MeshStandardMaterial({
        color: '#9C4C36',
        roughness: 0.65,
        metalness: 0.15,
      }),
      lampMat: new THREE.MeshBasicMaterial({
        color: '#FFAE42',
      }),
      statueMat: new THREE.MeshStandardMaterial({
        color: '#2D3436', // Patinated bronze/dark stone for bridge statues
        roughness: 0.7,
        metalness: 0.3,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      bridgeStoneMat.dispose();
      darkStoneMat.dispose();
      quaysideMat.dispose();
      waterMat.dispose();
      buildingMat.dispose();
      terracottaMat.dispose();
      lampMat.dispose();
      statueMat.dispose();
    };
  }, [
    bridgeStoneMat,
    darkStoneMat,
    quaysideMat,
    waterMat,
    buildingMat,
    terracottaMat,
    lampMat,
    statueMat,
  ]);

  useFrame((state) => {
    if (waterRef.current) {
      // Gentle subtle water undulation
      const t = state.clock.getElapsedTime();
      waterRef.current.position.y = -1.5 + Math.sin(t * 1.2) * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ================================================================== */}
      {/* 1. ANIMATED RIVER WATER SURFACE */}
      {/* ================================================================== */}
      <mesh
        ref={waterRef}
        position={[85, -1.5, -135]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={waterMat}
      >
        <planeGeometry args={[72, 210, 16, 32]} />
      </mesh>

      {/* West Embankment Promenade (River Quayside) */}
      <mesh position={[49, -0.1, -135]} receiveShadow material={quaysideMat}>
        <boxGeometry args={[6, 1.8, 210]} />
      </mesh>
      {/* West Promenade Balustrade */}
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

      {/* ================================================================== */}
      {/* 2. THE MONUMENTAL ARCHED STONE BRIDGE */}
      {/* Based on real references 03-river-reveal-bridge & 04-bridge-detail */}
      {/* ================================================================== */}
      {/* Main Bridge Roadway (Span: X 46 to 122) */}
      <mesh position={[84, 4.2, -120]} castShadow receiveShadow material={bridgeStoneMat}>
        <boxGeometry args={[76, 1.4, 12]} />
      </mesh>

      {/* Bridge Parapets / Balustrades */}
      <mesh position={[84, 5.2, -125.6]} castShadow material={darkStoneMat}>
        <boxGeometry args={[76, 0.8, 0.4]} />
      </mesh>
      <mesh position={[84, 5.2, -114.4]} castShadow material={darkStoneMat}>
        <boxGeometry args={[76, 0.8, 0.4]} />
      </mesh>

      {/* Three Monumental Stone Arches */}
      {[64, 84, 104].map((archX) => (
        <group key={`bridge-arch-${archX}`} position={[archX, 0, -120]}>
          {/* Main Curved Arch */}
          <mesh castShadow material={bridgeStoneMat}>
            <torusGeometry args={[8.5, 1.6, 10, 24, Math.PI]} />
          </mesh>
          {/* Arch Pier Cutwaters in River */}
          <mesh position={[-7.5, 0.5, 0]} castShadow receiveShadow material={darkStoneMat}>
            <cylinderGeometry args={[1.8, 2.2, 4.5, 8]} />
          </mesh>
          <mesh position={[7.5, 0.5, 0]} castShadow receiveShadow material={darkStoneMat}>
            <cylinderGeometry args={[1.8, 2.2, 4.5, 8]} />
          </mesh>
        </group>
      ))}

      {/* Western Bridge Gatehouse Towers (Plaza Side) */}
      <group position={[48, 0, -120]}>
        <mesh position={[0, 7.5, -6]} castShadow material={bridgeStoneMat}>
          <boxGeometry args={[6, 15, 5]} />
        </mesh>
        <mesh position={[0, 16.5, -6]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[4.2, 5, 4]} />
        </mesh>
        <mesh position={[0, 7.5, 6]} castShadow material={bridgeStoneMat}>
          <boxGeometry args={[6, 15, 5]} />
        </mesh>
        <mesh position={[0, 16.5, 6]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[4.2, 5, 4]} />
        </mesh>
        {/* Gate Arch Portal between towers */}
        <mesh position={[0, 10.5, 0]} castShadow material={bridgeStoneMat}>
          <boxGeometry args={[5.8, 2.5, 7]} />
        </mesh>
      </group>

      {/* Eastern Bridge Gatehouse Towers (East Bank Side) */}
      <group position={[118, 0, -120]}>
        <mesh position={[0, 7.5, -6]} castShadow material={bridgeStoneMat}>
          <boxGeometry args={[6, 15, 5]} />
        </mesh>
        <mesh position={[0, 16.5, -6]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[4.2, 5, 4]} />
        </mesh>
        <mesh position={[0, 7.5, 6]} castShadow material={bridgeStoneMat}>
          <boxGeometry args={[6, 15, 5]} />
        </mesh>
        <mesh position={[0, 16.5, 6]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[4.2, 5, 4]} />
        </mesh>
        {/* Gate Arch Portal between towers */}
        <mesh position={[0, 10.5, 0]} castShadow material={bridgeStoneMat}>
          <boxGeometry args={[5.8, 2.5, 7]} />
        </mesh>
      </group>

      {/* Bridge Balustrade Statues (Iconic Charles Bridge silhouettes from ref 04) */}
      {[64, 76, 92, 104].map((statueX) => (
        <group key={`bridge-statue-n-${statueX}`} position={[statueX, 5.6, -125.6]}>
          <mesh position={[0, 0.4, 0]} castShadow material={darkStoneMat}>
            <boxGeometry args={[0.9, 0.8, 0.7]} />
          </mesh>
          <mesh position={[0, 1.3, 0]} castShadow material={statueMat}>
            <cylinderGeometry args={[0.25, 0.35, 1.2, 6]} />
          </mesh>
        </group>
      ))}
      {[64, 76, 92, 104].map((statueX) => (
        <group key={`bridge-statue-s-${statueX}`} position={[statueX, 5.6, -114.4]}>
          <mesh position={[0, 0.4, 0]} castShadow material={darkStoneMat}>
            <boxGeometry args={[0.9, 0.8, 0.7]} />
          </mesh>
          <mesh position={[0, 1.3, 0]} castShadow material={statueMat}>
            <cylinderGeometry args={[0.25, 0.35, 1.2, 6]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================== */}
      {/* 3. EAST BANK RIVERSIDE BUILDINGS */}
      {/* ================================================================== */}
      <group position={[132, 0, -135]}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[14, 12, 28]} />
        </mesh>
        <mesh position={[0, 13.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[10, 5, 4]} />
        </mesh>
        <mesh position={[0, 5, 24]} castShadow receiveShadow material={buildingMat}>
          <boxGeometry args={[12, 10, 16]} />
        </mesh>
        <mesh position={[0, 11.5, 24]} rotation={[0, Math.PI / 4, 0]} castShadow material={terracottaMat}>
          <coneGeometry args={[8.5, 4.5, 4]} />
        </mesh>
      </group>

      {/* Bridge Decorative Lanterns on Both Parapets */}
      {[56, 70, 84, 98, 112].map((lx) => (
        <group key={`bridge-lamp-s-${lx}`} position={[lx, 5.6, -114.4]}>
          <mesh position={[0, 1.0, 0]} material={darkStoneMat}>
            <cylinderGeometry args={[0.06, 0.08, 2.0, 6]} />
          </mesh>
          <mesh position={[0, 2.1, 0]} material={lampMat}>
            <sphereGeometry args={[0.22, 6, 6]} />
          </mesh>
        </group>
      ))}
      {[56, 70, 84, 98, 112].map((lx) => (
        <group key={`bridge-lamp-n-${lx}`} position={[lx, 5.6, -125.6]}>
          <mesh position={[0, 1.0, 0]} material={darkStoneMat}>
            <cylinderGeometry args={[0.06, 0.08, 2.0, 6]} />
          </mesh>
          <mesh position={[0, 2.1, 0]} material={lampMat}>
            <sphereGeometry args={[0.22, 6, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
