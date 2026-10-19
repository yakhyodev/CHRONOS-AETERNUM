'use client';

import { useMemo, useRef, useEffect, useSyncExternalStore } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';
import { chronosStore } from '@/lib/chronosStore';
import { loadFileTexture, getRealMetalPBR } from '@/lib/pbrTextures';

export function EnergySphere() {
  const effectiveQuality = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.effectiveQuality,
    () => 'high' as const
  );
  const enableShadows = effectiveQuality !== 'low';

  const coreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const ringArcRef1 = useRef<THREE.Mesh>(null);
  const ringArcRef2 = useRef<THREE.Mesh>(null);
  const pulseWaveRef = useRef<THREE.Mesh>(null);
  const flareSpriteRef = useRef<THREE.Sprite>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const ambientGlowRef = useRef<THREE.PointLight>(null);

  const {
    plasmaTex,
    coreMat,
    coronaMat,
    arcGoldMat,
    arcEmberMat,
    waveMat,
    flareMat,
  } = useMemo(() => {
    const pTex = loadFileTexture('/textures/plasma_core.jpg', 2, 2, true);
    const flareTex = loadFileTexture('/textures/lensflare0.png', 1, 1, true);
    const metal = getRealMetalPBR(2, 1);

    return {
      plasmaTex: pTex,
      coreMat: new THREE.MeshStandardMaterial({
        color: '#FFF4D4',
        map: pTex,
        emissive: '#FF9E2C',
        emissiveMap: pTex,
        emissiveIntensity: 3.4,
        roughness: 0.15,
        metalness: 0.1,
      }),
      coronaMat: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.emberLight,
        map: pTex,
        emissive: CHRONOS_PALETTE.emberGlow,
        emissiveMap: pTex,
        emissiveIntensity: 2.8,
        transparent: true,
        opacity: 0.62,
        roughness: 0.1,
        metalness: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      arcGoldMat: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.goldLight,
        normalMap: metal.normalMap,
        emissive: CHRONOS_PALETTE.warmGold,
        emissiveIntensity: 1.5,
        roughness: 0.18,
        metalness: 0.95,
      }),
      arcEmberMat: new THREE.MeshStandardMaterial({
        color: CHRONOS_PALETTE.emberLight,
        normalMap: metal.normalMap,
        emissive: CHRONOS_PALETTE.emberGlow,
        emissiveIntensity: 1.8,
        roughness: 0.2,
        metalness: 0.92,
      }),
      waveMat: new THREE.MeshBasicMaterial({
        color: CHRONOS_PALETTE.goldLight,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      flareMat: new THREE.SpriteMaterial({
        map: flareTex,
        color: '#ffbe66',
        transparent: true,
        opacity: 0.78,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      coreMat.dispose();
      coronaMat.dispose();
      arcGoldMat.dispose();
      arcEmberMat.dispose();
      waveMat.dispose();
      flareMat.dispose();
    };
  }, [coreMat, coronaMat, arcGoldMat, arcEmberMat, waveMat, flareMat]);

  useFrame((state, delta) => {
    const actProgress = chronosStore.activationProgress;
    const isUnstable =
      chronosStore.paradoxState === 'unstable' ||
      chronosStore.paradoxState === 'revelation' ||
      chronosStore.paradoxState === 'converging';
    const paradoxMultiplier = isUnstable ? 2.5 : 1.0;

    const t = state.clock.getElapsedTime();
    const pulseSpeed = (2.5 + actProgress * 5.0) * paradoxMultiplier;
    const basePulse = Math.sin(t * pulseSpeed) * (isUnstable ? 0.12 : 0.05);
    const scale = (1.0 + basePulse) * (1.0 + actProgress * 0.3 + (isUnstable ? 0.2 : 0));

    if (plasmaTex) {
      plasmaTex.offset.x += delta * 0.08 * paradoxMultiplier;
      plasmaTex.offset.y += delta * 0.05 * paradoxMultiplier;
    }

    if (coreRef.current) {
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.rotation.y += delta * 0.35;
    }

    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.6 * paradoxMultiplier;
      coronaRef.current.rotation.z += delta * 0.45 * paradoxMultiplier;
      const coronaScale = scale * 1.38;
      coronaRef.current.scale.set(coronaScale, coronaScale, coronaScale);
    }

    if (flareSpriteRef.current) {
      const flareScale = scale * (3.6 + actProgress * 1.4);
      flareSpriteRef.current.scale.set(flareScale, flareScale, 1);
    }

    if (ringArcRef1.current) {
      ringArcRef1.current.rotation.x += delta * (0.9 + actProgress * 2.2) * paradoxMultiplier;
      ringArcRef1.current.rotation.y += delta * 0.7 * paradoxMultiplier;
    }

    if (ringArcRef2.current) {
      ringArcRef2.current.rotation.y -= delta * (1.1 + actProgress * 2.5) * paradoxMultiplier;
      ringArcRef2.current.rotation.z += delta * 0.55 * paradoxMultiplier;
    }

    if (pulseWaveRef.current) {
      const shockwaveSpeed = isUnstable ? 3.5 : 1.2 + actProgress * 2.8;
      const wavePhase = (t * shockwaveSpeed) % 1;
      const waveScale = 1.0 + wavePhase * (isUnstable ? 6.5 : 4.2);
      pulseWaveRef.current.scale.set(waveScale, waveScale, waveScale);
      waveMat.opacity = (1 - wavePhase) * (0.25 + actProgress * 0.65 + (isUnstable ? 0.4 : 0));
    }

    if (coreLightRef.current) {
      const baseLight = (8.5 + Math.sin(t * 3.5) * 0.8) * (1.0 + actProgress * 2.2);
      coreLightRef.current.intensity = isUnstable ? baseLight * 1.8 : baseLight;
    }
    if (ambientGlowRef.current) {
      const baseAmb = (4.2 + Math.cos(t * 2.0) * 0.5) * (1.0 + actProgress * 1.5);
      ambientGlowRef.current.intensity = isUnstable ? baseAmb * 1.5 : baseAmb;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Central Radiant Golden Solar Fusion Core with Boiling Plasma Texture */}
      <mesh ref={coreRef} material={coreMat}>
        <sphereGeometry args={[0.58, 48, 48]} />
      </mesh>

      {/* 2. Concentric Volumetric Amber Plasma Corona */}
      <mesh ref={coronaRef} material={coronaMat}>
        <sphereGeometry args={[0.76, 36, 36]} />
      </mesh>

      {/* 2b. Optical Solar Lensflare Corona Sprite */}
      <sprite ref={flareSpriteRef} material={flareMat} scale={[3.6, 3.6, 1]} />

      {/* 3. Orbiting Energy Arc 1 */}
      <mesh ref={ringArcRef1} material={arcGoldMat}>
        <torusGeometry args={[0.92, 0.025, 14, 72]} />
      </mesh>

      {/* 4. Orbiting Energy Arc 2 (inclined) */}
      <mesh ref={ringArcRef2} rotation={[Math.PI / 3, Math.PI / 6, 0]} material={arcEmberMat}>
        <torusGeometry args={[1.04, 0.02, 14, 72]} />
      </mesh>

      {/* 5. Concentric Shockwave Ring */}
      <mesh ref={pulseWaveRef} rotation={[Math.PI / 2, 0, 0]} material={waveMat}>
        <ringGeometry args={[0.7, 0.84, 64]} />
      </mesh>

      {/* Primary High-Intensity Amber Point Light casting shadows */}
      <pointLight
        ref={coreLightRef}
        color={CHRONOS_PALETTE.emberLight}
        intensity={8.5}
        distance={36}
        decay={1.6}
        castShadow={enableShadows}
        shadow-mapSize={enableShadows ? [1024, 1024] : [256, 256]}
        shadow-bias={-0.0003}
      />

      {/* Secondary Soft Warm Glow */}
      <pointLight
        ref={ambientGlowRef}
        color={CHRONOS_PALETTE.warmGold}
        intensity={4.2}
        distance={22}
        decay={2}
      />
    </group>
  );
}
