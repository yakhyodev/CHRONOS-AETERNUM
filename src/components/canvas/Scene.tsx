'use client';

import { Suspense, useState, useEffect, useSyncExternalStore } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHRONOS_PALETTE, type CinematicShotId } from '@/lib/constants';
import {
  chronosStore,
  QUALITY_PRESETS,
  type QualityPreset,
  type WorldMode,
} from '@/lib/chronosStore';
import type { CityViewId, HistoricalEraId } from '@/types/phase03';
import { TEMPORAL_ERAS } from '@/types/phase05';
import { isWebGLAvailable } from '@/lib/webglDetect';
import { ChamberEnvironment } from './chamber/ChamberEnvironment';
import { ChronosCore } from './core/ChronosCore';
import { CoreLighting } from './CoreLighting';
import { EnvironmentalParticles } from './EnvironmentalParticles';
import { CinematicCameraRig } from './CinematicCameraRig';
import { AeternumWorld } from './city/AeternumWorld';
import { CityCameraRig } from './city/CityCameraRig';
import { TemporalTunnel } from './transition/TemporalTunnel';
import { WebGLFallback } from '../ui/WebGLFallback';

interface SceneProps {
  currentShot?: CinematicShotId;
  reducedMotion?: boolean;
  className?: string;
}

/**
 * Lightweight per-frame observer evaluating frame rendering latency
 * Feeds store rolling average to automatically throttle quality on struggling devices
 */
function PerformanceOptimizer() {
  useFrame((_, delta) => {
    chronosStore.recordFrameTime(delta);
  });
  return null;
}

export function Scene({
  currentShot = 'shot-01',
  reducedMotion = false,
  className = '',
}: SceneProps) {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

  // Sync with store state changes without forcing frame-level React reconciliations
  const qualityPreset = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.qualityPreset,
    () => 'auto' as QualityPreset
  );

  const effectiveQuality = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.effectiveQuality,
    () => 'high' as const
  );

  const worldMode = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.worldMode,
    () => 'chamber' as WorldMode
  );

  const cityView = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.cityView,
    () => 'grand-arrival' as CityViewId
  );

  const activeEra = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.activeEra,
    () => 'the-present' as HistoricalEraId
  );

  useEffect(() => {
    setMounted(true);
    setWebglSupported(isWebGLAvailable());

    const handleVisibility = () => {
      setIsPageVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-[#08090D] ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-500/30 border-t-amber-400 animate-spin" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-amber-300/70 uppercase">
            CALIBRATING CHRONOS CORE...
          </span>
        </div>
      </div>
    );
  }

  // WebGL Fallback for devices without hardware WebGL support
  if (!webglSupported) {
    return <WebGLFallback onRetry={() => setWebglSupported(isWebGLAvailable())} />;
  }

  const activeQualityKey = qualityPreset === 'auto' ? effectiveQuality : qualityPreset;
  const qualityConfig = QUALITY_PRESETS[activeQualityKey] || QUALITY_PRESETS.high;
  const isCityActive = worldMode === 'city';
  const isTransitioning =
    worldMode === 'transitioning_to_city' ||
    worldMode === 'transitioning_to_chamber';

  const eraConfig = TEMPORAL_ERAS[activeEra] || TEMPORAL_ERAS['the-present'];

  const handleCreated = ({ gl }: { gl: THREE.WebGLRenderer }) => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('[CHRONOS] WebGL context lost. Rendering fallback UI.');
      setWebglSupported(false);
    };
    const handleContextRestored = () => {
      console.info('[CHRONOS] WebGL context restored.');
      setWebglSupported(true);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 2.5, 26], fov: 54, near: 0.1, far: 500 }}
        frameloop={isPageVisible ? 'always' : 'never'}
        onCreated={handleCreated}
        gl={{
          antialias: activeQualityKey !== 'low',
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={qualityConfig.dpr}
        shadows={qualityConfig.shadows}
      >
        <PerformanceOptimizer />

        {/* Dynamic Background: Void Black in chamber, Era Sky in city */}
        <color
          attach="background"
          args={[isCityActive ? eraConfig.atmosphere.skyColor : CHRONOS_PALETTE.voidBlack]}
        />

        {/* Dynamic Camera Rig: Chamber Timeline vs Aeternum City Views */}
        {isCityActive ? (
          <CityCameraRig
            currentView={cityView}
            reducedMotion={reducedMotion}
          />
        ) : (
          <CinematicCameraRig
            currentShot={currentShot}
            reducedMotion={reducedMotion}
          />
        )}

        <Suspense fallback={null}>
          {/* ============================================================== */}
          {/* 1. CHAMBER SCENE (Active in Chamber mode & during transitions) */}
          {/* ============================================================== */}
          {(!isCityActive || isTransitioning) && (
            <group name="ChamberScene">
              {/* Chamber Lights */}
              <CoreLighting
                shadowMapSize={qualityConfig.shadowMapSize}
                enableShadows={qualityConfig.shadows}
              />

              {/* Monumental Underground Chamber Architecture */}
              <ChamberEnvironment />

              {/* Real 3D Astronomical Chronos Core */}
              <ChronosCore />

              {/* Floating Chamber Dust & Embers */}
              <EnvironmentalParticles count={qualityConfig.particleCount} />
            </group>
          )}

          {/* ============================================================== */}
          {/* 2. TEMPORAL TUNNEL VORTEX (Active during warp transition) */}
          {/* ============================================================== */}
          {isTransitioning && <TemporalTunnel />}

          {/* ============================================================== */}
          {/* 3. AETERNUM CITY WORLD (Active in City mode & transitions) */}
          {/* ============================================================== */}
          {(isCityActive || isTransitioning) && (
            <AeternumWorld qualityPreset={activeQualityKey} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
