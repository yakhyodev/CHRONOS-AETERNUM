'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CHRONOS_PALETTE, type CinematicShotId } from '@/lib/constants';
import { ChamberEnvironment } from './chamber/ChamberEnvironment';
import { ChronosCore } from './core/ChronosCore';
import { CoreLighting } from './CoreLighting';
import { EnvironmentalParticles } from './EnvironmentalParticles';
import { CinematicCameraRig } from './CinematicCameraRig';

interface SceneProps {
  currentShot?: CinematicShotId;
  activationProgress?: number;
  reducedMotion?: boolean;
  className?: string;
}

export function Scene({
  currentShot = 'shot-01',
  activationProgress = 0,
  reducedMotion = false,
  className = '',
}: SceneProps) {
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState<number[]>([1, 1.5]);

  useEffect(() => {
    setMounted(true);
    // Device-aware pixel ratio capping for high-performance 60fps rendering
    if (typeof window !== 'undefined') {
      const ratio = window.devicePixelRatio || 1;
      setDpr([1, Math.min(ratio, 2)]);
    }
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

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 2.5, 26], fov: 54, near: 0.1, far: 90 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={dpr as [number, number]}
        shadows={true}
      >
        {/* Void Black Chamber Background */}
        <color attach="background" args={[CHRONOS_PALETTE.voidBlack]} />

        {/* Volumetric Atmospheric Depth Fog */}
        <fog attach="fog" args={[CHRONOS_PALETTE.voidBlack, 14, 58]} />

        {/* Chamber Lights (Amber Core, Overhead Shaft, Cool Rim) */}
        <CoreLighting activationProgress={activationProgress} />

        {/* Dynamic Camera Choreography Rig */}
        <CinematicCameraRig
          currentShot={currentShot}
          activationProgress={activationProgress}
          reducedMotion={reducedMotion}
        />

        <Suspense fallback={null}>
          {/* Monumental Underground Chamber Architecture */}
          <ChamberEnvironment activationProgress={activationProgress} />

          {/* Real 3D Astronomical Chronos Core */}
          <ChronosCore activationProgress={activationProgress} />

          {/* Floating Chamber Dust & Embers */}
          <EnvironmentalParticles
            count={360}
            activationProgress={activationProgress}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
