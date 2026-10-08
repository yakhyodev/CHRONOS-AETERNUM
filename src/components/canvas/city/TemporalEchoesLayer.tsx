'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  TEMPORAL_ECHOES,
  ORDERED_ECHO_IDS,
  type TemporalEchoConfig,
} from '@/types/phase07';
import { chronosStore } from '@/lib/chronosStore';

function SingleEchoMesh({
  config,
  isDiscovered,
  onSelect,
}: {
  config: TemporalEchoConfig;
  isDiscovered: boolean;
  onSelect: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { crystalMat, ringMat, beaconMat } = useMemo(() => {
    return {
      crystalMat: new THREE.MeshStandardMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: isDiscovered ? 1.2 : 2.5,
        roughness: 0.15,
        metalness: 0.85,
        wireframe: false,
      }),
      ringMat: new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: isDiscovered ? 0.35 : 0.75,
        wireframe: true,
      }),
      beaconMat: new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: isDiscovered ? 0.15 : 0.45,
        blending: THREE.AdditiveBlending,
      }),
    };
  }, [config.color, isDiscovered]);

  useEffect(() => {
    return () => {
      crystalMat.dispose();
      ringMat.dispose();
      beaconMat.dispose();
    };
  }, [crystalMat, ringMat, beaconMat]);

  useFrame((state, delta) => {
    if (chronosStore.isTimeFrozen) return;

    const t = state.clock.getElapsedTime();

    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 1.2;
      crystalRef.current.rotation.x = Math.sin(t * 1.5) * 0.2;
      crystalRef.current.position.y = Math.sin(t * 2.0) * 0.25;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.8;
      ringRef.current.rotation.x = Math.cos(t * 1.2) * 0.3;
    }

    if (beaconRef.current) {
      beaconRef.current.rotation.y += delta * 0.3;
      const pulse = Math.sin(t * 3.0) * 0.15 + 0.35;
      beaconMat.opacity = isDiscovered ? 0.15 : pulse;
    }
  });

  return (
    <group
      ref={groupRef}
      position={config.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Floating Octahedron Chronite Crystal */}
      <mesh
        ref={crystalRef}
        material={crystalMat}
        scale={hovered ? 1.3 : 1.0}
        castShadow
      >
        <octahedronGeometry args={[1.2, 0]} />
      </mesh>

      {/* 2. Gyroscopic Orbital Ring */}
      <mesh ref={ringRef} material={ringMat} scale={hovered ? 1.4 : 1.1}>
        <torusGeometry args={[1.8, 0.08, 8, 24]} />
      </mesh>

      {/* 3. Resonant Ground Light Well / Beacon */}
      <mesh
        ref={beaconRef}
        position={[0, 4.0, 0]}
        material={beaconMat}
      >
        <cylinderGeometry args={[0.3, 1.6, 8, 12, 1, true]} />
      </mesh>

      {/* 4. Ground Glyphic Contact Ring */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} material={ringMat}>
        <ringGeometry args={[1.4, 1.8, 24]} />
      </mesh>
    </group>
  );
}

export function TemporalEchoesLayer() {
  const discoveredSet = chronosStore.discoveredEchoes;

  return (
    <group name="TemporalEchoes_Layer">
      {ORDERED_ECHO_IDS.map((echoId) => {
        const config = TEMPORAL_ECHOES[echoId];
        const isDiscovered = discoveredSet.has(echoId);

        return (
          <SingleEchoMesh
            key={echoId}
            config={config}
            isDiscovered={isDiscovered}
            onSelect={() => {
              chronosStore.discoverEcho(echoId);
            }}
          />
        );
      })}
    </group>
  );
}
