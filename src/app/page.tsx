'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from '@/lib/gsap';
import { CINEMATIC_SHOTS, type CinematicShotId } from '@/lib/constants';
import { CinematicUI } from '@/components/ui/CinematicUI';
import { AtmosphereOverlay } from '@/components/ui/AtmosphereOverlay';
import { DebugPanel } from '@/components/ui/DebugPanel';

// Dynamically import Scene to eliminate SSR hydration discrepancies with WebGL Canvas
const Scene = dynamic(
  () => import('@/components/canvas/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-[#08090D] z-0">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-amber-500/30 border-t-amber-400 animate-spin" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-amber-300/70 uppercase">
            CALIBRATING CHRONOS CORE...
          </span>
        </div>
      </div>
    ),
  }
);

export default function ChronosPhase02Page() {
  const [currentShot, setCurrentShot] = useState<CinematicShotId>('shot-01');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activationProgress, setActivationProgress] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Mutable progress proxy for GSAP tweening
  const progressProxy = useRef<{ value: number }>({ value: 0 });
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);

  // Check user prefers-reduced-motion system preference and optional URL query parameters for automated testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);

      // URL search params support for testing & deep linking shots
      const params = new URLSearchParams(window.location.search);
      const urlShot = params.get('shot') as CinematicShotId;
      if (urlShot && CINEMATIC_SHOTS.some((s) => s.id === urlShot)) {
        setCurrentShot(urlShot);
      }
      if (params.get('active') === 'true' || params.get('active') === '1') {
        setIsActive(true);
        progressProxy.current.value = 1.0;
        setActivationProgress(1.0);
      }

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Activation sequence orchestrator
  const handleActivate = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    if (activeTimeline.current) {
      activeTimeline.current.kill();
    }

    const targetActive = !isActive;
    const endProgress = targetActive ? 1.0 : 0.0;
    const duration = reducedMotion ? 0.3 : 2.5;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsActive(targetActive);
        setIsTransitioning(false);
      },
    });
    activeTimeline.current = tl;

    // Transition camera to Shot 05 (Activation) when engaging
    if (targetActive) {
      setCurrentShot('shot-05');
    }

    tl.to(progressProxy.current, {
      value: endProgress,
      duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        setActivationProgress(progressProxy.current.value);
      },
    });
  }, [isActive, isTransitioning, reducedMotion]);

  // Shot switcher handler
  const handleSelectShot = useCallback((shotId: CinematicShotId) => {
    setCurrentShot(shotId);
  }, []);

  // Scroll listener for optional story progression through the 6 cinematic shots
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const shotIndex = Math.min(
        Math.floor(progress * CINEMATIC_SHOTS.length),
        CINEMATIC_SHOTS.length - 1
      );
      const targetShot = CINEMATIC_SHOTS[shotIndex].id;

      setCurrentShot((prev) => (prev !== targetShot ? targetShot : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative min-h-[300vh] bg-[#08090D] text-[#F5F3ED] overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#FFE8B5]">
      {/* 1. Atmospheric Ambient Vignette and Particles */}
      <AtmosphereOverlay />

      {/* 2. Fullscreen Interactive 3D WebGL Canvas */}
      <div className="fixed inset-0 z-10 pointer-events-auto">
        <Scene
          currentShot={currentShot}
          activationProgress={activationProgress}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* 3. Foreground Cinematic Interface (Hero Title, CTAs, Telemetry, Shot Navigator) */}
      <div className="fixed inset-0 z-30 pointer-events-none">
        <CinematicUI
          isActive={isActive}
          activationProgress={activationProgress}
          currentShot={currentShot}
          onActivate={handleActivate}
          onSelectShot={handleSelectShot}
          isTransitioning={isTransitioning}
        />
      </div>

      {/* 4. Development-only Minimal Status Panel */}
      <DebugPanel
        currentShot={currentShot}
        isActive={isActive}
        activationProgress={activationProgress}
        onSelectShot={handleSelectShot}
        onToggleActive={handleActivate}
      />
    </main>
  );
}
