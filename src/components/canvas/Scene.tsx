'use client';

import { Suspense, useState, useEffect, useSyncExternalStore } from 'react';
import { Canvas } from '@react-three/fiber';
import { CHRONOS_PALETTE, type CinematicShotId } from '@/lib/constants';
import { chronosStore, QUALITY_PRESETS, type QualityPreset } from '@/lib/chronosStore';
import { isWebGLAvailable } from '@/lib/webglDetect';
import { ChamberEnvironment } from './chamber/ChamberEnvironment';
import { ChronosCore } from './core/ChronosCore';
import { CoreLighting } from './CoreLighting';
import { EnvironmentalParticles } from './EnvironmentalParticles';
import { CinematicCameraRig } from './CinematicCameraRig';
import { WebGLFallback } from '../ui/WebGLFallback';

interface SceneProps {
  currentShot?: CinematicShotId;
  reducedMotion?: boolean;
  className?: string;
}

export function Scene({
  currentShot = 'shot-01',
  reducedMotion = false,
  className = '',
}: SceneProps) {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Sync with store state changes without forcing frame-level React reconciliations
  const qualityPreset = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.qualityPreset,
    () => 'high' as QualityPreset
  );

  useEffect(() => {
    setMounted(true);
    setWebglSupported(isWebGLAvailable());
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

  const qualityConfig = QUALITY_PRESETS[qualityPreset] || QUALITY_PRESETS.high;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 2.5, 26], fov: 54, near: 0.1, far: 90 }}
        gl={{
          antialias: qualityPreset !== 'low',
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={qualityConfig.dpr}
        shadows={qualityConfig.shadows}
      >
        {/* Void Black Chamber Background */}
        <color attach="background" args={[CHRONOS_PALETTE.voidBlack]} />

        {/* Volumetric Atmospheric Depth Fog */}
        <fog attach="fog" args={[CHRONOS_PALETTE.voidBlack, 14, 58]} />

        {/* Chamber Lights (Amber Core, Overhead Shaft, Cool Rim) */}
        <CoreLighting
          shadowMapSize={qualityConfig.shadowMapSize}
          enableShadows={qualityConfig.shadows}
        />

        {/* Dynamic Camera Choreography Rig */}
        <CinematicCameraRig
          currentShot={currentShot}
          reducedMotion={reducedMotion}
        />

        <Suspense fallback={null}>
          {/* Monumental Underground Chamber Architecture */}
          <ChamberEnvironment />

          {/* Real 3D Astronomical Chronos Core */}
          <ChronosCore />

          {/* Floating Chamber Dust & Embers */}
          <EnvironmentalParticles count={qualityConfig.particleCount} />
        </Suspense>
      </Canvas>
    </div>
  );
}
