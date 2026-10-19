'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';
import { getRealRockPBR, getRealMetalPBR, getSoftBeamAlphaTexture, loadFileTexture } from '@/lib/pbrTextures';

export function GrandArches() {
  const archZPositions = useMemo(() => [-6, 6, 18], []);
  const waterfallRef = useRef<THREE.Mesh>(null);
  const godRayMainRef = useRef<THREE.Mesh>(null);
  const godRaySecRef = useRef<THREE.Mesh>(null);

  const { rockPBR, metalPBR, waterTex, godRayMat1, godRayMat2, waterfallMat } = useMemo(() => {
    const wTex = loadFileTexture('/textures/water_normal_1.jpg', 2, 4, false);
    const beamAlpha = getSoftBeamAlphaTexture();
    const grMat1 = new THREE.MeshBasicMaterial({
      color: '#ffe3a8',
      alphaMap: beamAlpha,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const grMat2 = new THREE.MeshBasicMaterial({
      color: '#ffb454',
      alphaMap: beamAlpha,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const wfMat = new THREE.MeshStandardMaterial({
      color: '#4f7c9c',
      emissive: '#17344a',
      emissiveIntensity: 0.65,
      normalMap: wTex,
      roughness: 0.18,
      metalness: 0.65,
      transparent: true,
      opacity: 0.78,
    });

    return {
      rockPBR: getRealRockPBR(4, 2),
      metalPBR: getRealMetalPBR(2, 2),
      waterTex: wTex,
      godRayMat1: grMat1,
      godRayMat2: grMat2,
      waterfallMat: wfMat,
    };
  }, []);

  useEffect(() => {
    return () => {
      godRayMat1.dispose();
      godRayMat2.dispose();
      waterfallMat.dispose();
    };
  }, [godRayMat1, godRayMat2, waterfallMat]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const actProgress = chronosStore.activationProgress;

    if (waterTex) {
      waterTex.offset.y += delta * 0.65;
    }

    if (godRayMainRef.current) {
      godRayMat1.opacity = (0.14 + Math.sin(t * 1.1) * 0.02) * (1 + actProgress * 0.5);
    }
    if (godRaySecRef.current) {
      godRayMat2.opacity = (0.09 + Math.cos(t * 0.85) * 0.015) * (1 + actProgress * 0.6);
    }
  });

  return (
    <group>
      {/* Transverse monumental nave arches */}
      {archZPositions.map((z, idx) => (
        <group key={`arch-${idx}`} position={[0, 16, z]}>
          {/* Main arch curve */}
          <mesh castShadow receiveShadow>
            <torusGeometry args={[8.6, 0.92, 16, 48, Math.PI]} />
            <meshStandardMaterial
              color={CHRONOS_PALETTE.darkStone}
              normalMap={rockPBR.normalMap}
              roughnessMap={rockPBR.roughnessMap}
              roughness={0.68}
              metalness={0.28}
            />
          </mesh>

          {/* Engraved Gold Arch Intrados Trim */}
          <mesh>
            <torusGeometry args={[7.72, 0.14, 12, 48, Math.PI]} />
            <meshStandardMaterial
              color={CHRONOS_PALETTE.antiqueBronze}
              normalMap={metalPBR.normalMap}
              roughness={0.28}
              metalness={0.88}
            />
          </mesh>

          {/* Keystone / Central Arch Ornament */}
          <mesh position={[0, 8.6, 0]} castShadow>
            <boxGeometry args={[1.4, 2.0, 1.8]} />
            <meshStandardMaterial
              color={CHRONOS_PALETTE.antiqueBronze}
              normalMap={metalPBR.normalMap}
              roughness={0.32}
              metalness={0.85}
            />
          </mesh>
        </group>
      ))}

      {/* Volumetric Ceiling Oculus God-Ray Light Shafts (Art Direction Reference) */}
      <group position={[1.4, 12.5, 1.5]} rotation={[0.14, 0, -0.1]}>
        <mesh ref={godRayMainRef} material={godRayMat1}>
          <cylinderGeometry args={[2.2, 7.8, 25, 32, 1, true]} />
        </mesh>
        <mesh ref={godRaySecRef} position={[-0.8, 0, 1.8]} material={godRayMat2}>
          <cylinderGeometry args={[1.4, 5.2, 25, 24, 1, true]} />
        </mesh>
      </group>

      {/* Distant background chamber wall & monumental archway */}
      <group position={[0, 8, -16]}>
        {/* Massive back wall with PBR stone relief */}
        <mesh position={[0, 6, 0]} receiveShadow>
          <boxGeometry args={[44, 34, 2]} />
          <meshStandardMaterial
            color={CHRONOS_PALETTE.darkStone}
            normalMap={rockPBR.normalMap}
            roughnessMap={rockPBR.roughnessMap}
            roughness={0.78}
            metalness={0.22}
          />
        </mesh>

        {/* Portal arch opening relief */}
        <mesh position={[0, 0, 1.1]}>
          <torusGeometry args={[6.5, 1.2, 16, 40, Math.PI]} />
          <meshStandardMaterial
            color={CHRONOS_PALETTE.darkStone}
            normalMap={rockPBR.normalMap}
            roughness={0.68}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 1.2]}>
          <torusGeometry args={[5.4, 0.16, 12, 40, Math.PI]} />
          <meshStandardMaterial
            color={CHRONOS_PALETTE.warmGold}
            normalMap={metalPBR.normalMap}
            emissive="#4a2c08"
            emissiveIntensity={0.45}
            roughness={0.22}
            metalness={0.92}
          />
        </mesh>

        {/* Distant mystic chasm & animated subterranean waterfall */}
        <mesh position={[0, 2, 1.05]}>
          <planeGeometry args={[12, 15]} />
          <meshBasicMaterial color="#09131c" />
        </mesh>
        <mesh ref={waterfallRef} position={[0, 2, 1.12]} material={waterfallMat}>
          <planeGeometry args={[4.6, 14, 8, 16]} />
        </mesh>
        {/* Subterranean chasm backlight */}
        <pointLight position={[0, 3, 2.5]} color="#3a7ca5" intensity={2.2} distance={18} decay={2} />
      </group>

      {/* High vaulted ceiling with Oculus opening */}
      <mesh position={[0, 24, 6]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 26, 32]} />
        <meshStandardMaterial
          color="#06080c"
          normalMap={rockPBR.normalMap}
          roughness={0.85}
          metalness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
