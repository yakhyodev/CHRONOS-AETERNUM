'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';
import { getRealRockPBR, getRealMetalPBR, loadFileTexture } from '@/lib/pbrTextures';

export function Braziers() {
  const lightRefs = useRef<THREE.PointLight[]>([]);
  const flameRefs = useRef<THREE.Group[]>([]);

  const brazierPositions: [number, number, number][] = useMemo(
    () => [
      [-6.5, -0.6, 9],
      [6.5, -0.6, 9],
      [-7.5, -1.4, 14],
      [7.5, -1.4, 14],
      [-8.5, -2.1, 19],
      [8.5, -2.1, 19],
    ],
    []
  );

  const { stoneMat, bronzeMat, coalMat, flameCoreMat, flameOuterMat } = useMemo(() => {
    const rock = getRealRockPBR(1, 2);
    const metal = getRealMetalPBR(1, 1);
    const plasmaTex = loadFileTexture('/textures/plasma_core.jpg', 1, 1, true);

    return {
      stoneMat: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.darkStone,
        normalMap: rock.normalMap,
        roughnessMap: rock.roughnessMap,
        roughness: 0.68,
        metalness: 0.28,
      }),
      bronzeMat: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.antiqueBronze,
        normalMap: metal.normalMap,
        roughness: 0.3,
        metalness: 0.88,
      }),
      coalMat: new THREE.MeshStandardMaterial({
        color: '#2a1205',
        emissive: '#ff5100',
        emissiveMap: plasmaTex,
        emissiveIntensity: 2.2,
        roughness: 0.8,
      }),
      flameCoreMat: new THREE.MeshBasicMaterial({
        color: '#fff2bd',
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      flameOuterMat: new THREE.MeshBasicMaterial({
        color: '#ff6a14',
        map: plasmaTex,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      stoneMat.dispose();
      bronzeMat.dispose();
      coalMat.dispose();
      flameCoreMat.dispose();
      flameOuterMat.dispose();
    };
  }, [stoneMat, bronzeMat, coalMat, flameCoreMat, flameOuterMat]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const actProgress = chronosStore.activationProgress;

    lightRefs.current.forEach((light, i) => {
      if (light) {
        const flicker = Math.sin(t * 4.2 + i * 1.7) * 0.18 + Math.cos(t * 8.3 + i) * 0.1;
        light.intensity = (1.1 + flicker) * (1 + actProgress * 0.55);
      }
    });

    flameRefs.current.forEach((fg, i) => {
      if (fg) {
        const sx = 1.0 + Math.sin(t * 6.5 + i * 2.1) * 0.12;
        const sy = 1.0 + Math.cos(t * 8.2 + i * 1.3) * 0.22 + actProgress * 0.25;
        fg.scale.set(sx, sy, sx);
        fg.rotation.y = t * 1.8 + i;
      }
    });
  });

  return (
    <group>
      {brazierPositions.map(([x, y, z], idx) => (
        <group key={`brazier-${idx}`} position={[x, y, z]}>
          {/* Ornate Stone Pedestal */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow material={stoneMat}>
            <cylinderGeometry args={[0.35, 0.48, 0.8, 16]} />
          </mesh>

          {/* Bronze Tripod Fire Bowl */}
          <mesh position={[0, 0.9, 0]} castShadow material={bronzeMat}>
            <cylinderGeometry args={[0.55, 0.26, 0.38, 24]} />
          </mesh>
          <mesh position={[0, 1.06, 0]} material={bronzeMat}>
            <torusGeometry args={[0.55, 0.045, 12, 24]} />
          </mesh>

          {/* Glowing Ember Bed */}
          <mesh position={[0, 1.04, 0]} rotation={[-Math.PI / 2, 0, 0]} material={coalMat}>
            <circleGeometry args={[0.48, 20]} />
          </mesh>

          {/* Animated Volumetric Multi-Layer Flame Plume */}
          <group
            ref={(el) => {
              if (el) flameRefs.current[idx] = el;
            }}
            position={[0, 1.28, 0]}
          >
            <mesh material={flameOuterMat}>
              <coneGeometry args={[0.32, 0.72, 14]} />
            </mesh>
            <mesh position={[0, -0.06, 0]} material={flameCoreMat}>
              <coneGeometry args={[0.17, 0.48, 12]} />
            </mesh>
          </group>

          {/* Localized warm firelight */}
          <pointLight
            ref={(el) => {
              if (el) lightRefs.current[idx] = el;
            }}
            position={[0, 1.45, 0]}
            color={CHRONOS_PALETTE.emberGlow}
            intensity={1.1}
            distance={11}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}
