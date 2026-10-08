'use client';

import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from '@/lib/gsap';
import { CINEMATIC_SHOTS, type CinematicShotId } from '@/lib/constants';
import {
  chronosStore,
  type ActivationState,
  type QualityPreset,
} from '@/lib/chronosStore';
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
  // Sync discrete states with chronosStore
  const currentShot = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.currentShot,
    () => 'shot-01' as CinematicShotId
  );

  const activationState = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.activationState,
    () => 'idle' as ActivationState
  );

  const qualityPreset = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.qualityPreset,
    () => 'high' as QualityPreset
  );

  const reducedMotion = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.reducedMotion,
    () => false
  );

  const activeTimeline = useRef<gsap.core.Timeline | null>(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect user's reduced-motion preference and process query parameters on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    chronosStore.setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      chronosStore.setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // Deep-linking URL query params for testing (e.g. ?shot=shot-03&active=1&quality=medium)
    const params = new URLSearchParams(window.location.search);
    const urlShot = params.get('shot') as CinematicShotId;
    if (urlShot && CINEMATIC_SHOTS.some((s) => s.id === urlShot)) {
      chronosStore.setCurrentShot(urlShot);
      const shotIdx = CINEMATIC_SHOTS.findIndex((s) => s.id === urlShot);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && shotIdx >= 0) {
        const targetScroll = (shotIdx / (CINEMATIC_SHOTS.length - 1)) * maxScroll;
        window.scrollTo({ top: targetScroll, behavior: 'instant' as ScrollBehavior });
      }
    }

    if (params.get('active') === 'true' || params.get('active') === '1') {
      chronosStore.setActivationProgress(1.0);
      chronosStore.setActivationState('active');
    }

    const urlQuality = params.get('quality') as QualityPreset;
    if (urlQuality && ['high', 'medium', 'low'].includes(urlQuality)) {
      chronosStore.setQualityPreset(urlQuality);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Unified Activation Sequence (discrete React states + zero-rerender continuous 3D tween)
  const handleActivate = useCallback(() => {
    if (activationState === 'activating' || activationState === 'deactivating') {
      return; // Prevent overlapping transitions
    }

    if (activeTimeline.current) {
      activeTimeline.current.kill();
    }

    const isEngaging = activationState === 'idle';
    const targetState: ActivationState = isEngaging ? 'active' : 'idle';
    const intermediateState: ActivationState = isEngaging ? 'activating' : 'deactivating';
    const targetProgress = isEngaging ? 1.0 : 0.0;
    const duration = reducedMotion ? 0.15 : 2.2;

    chronosStore.setActivationState(intermediateState);

    // Context-safe animation
    const proxy = { value: chronosStore.activationProgress };
    const tl = gsap.timeline({
      onComplete: () => {
        chronosStore.setActivationProgress(targetProgress);
        chronosStore.setActivationState(targetState);
      },
    });
    activeTimeline.current = tl;

    // Camera moves to activation shot when engaging
    if (isEngaging) {
      chronosStore.setCurrentShot('shot-05');
      // Synchronize scroll position smoothly
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const shotIdx = CINEMATIC_SHOTS.findIndex((s) => s.id === 'shot-05');
      if (maxScroll > 0 && shotIdx >= 0) {
        isProgrammaticScroll.current = true;
        const targetY = (shotIdx / (CINEMATIC_SHOTS.length - 1)) * maxScroll;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 1200);
      }
    }

    tl.to(proxy, {
      value: targetProgress,
      duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        // Direct mutation into store without triggering React re-render!
        chronosStore.setActivationProgress(proxy.value);
      },
    });
  }, [activationState, reducedMotion]);

  // Synchronized shot navigation (updates both camera shot and window scroll position)
  const handleSelectShot = useCallback((shotId: CinematicShotId) => {
    const shotIdx = CINEMATIC_SHOTS.findIndex((s) => s.id === shotId);
    if (shotIdx === -1) return;

    chronosStore.setCurrentShot(shotId);

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      isProgrammaticScroll.current = true;
      const targetY = (shotIdx / (CINEMATIC_SHOTS.length - 1)) * maxScroll;
      window.scrollTo({ top: targetY, behavior: 'smooth' });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000);
    }
  }, []);

  // Bi-directional window scroll listener (seamless forward & reverse scrolling)
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      chronosStore.setTimelineProgress(progress);

      const targetShot = chronosStore.getShotFromProgress(progress);
      chronosStore.setCurrentShot(targetShot);
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
          reducedMotion={reducedMotion}
        />
      </div>

      {/* 3. Foreground Cinematic Interface (Hero Title, CTAs, Telemetry, Shot Navigator) */}
      <div className="fixed inset-0 z-30 pointer-events-none">
        <CinematicUI
          activationState={activationState}
          currentShot={currentShot}
          onActivate={handleActivate}
          onSelectShot={handleSelectShot}
        />
      </div>

      {/* 4. Development-only Minimal Status Panel */}
      <DebugPanel
        currentShot={currentShot}
        activationState={activationState}
        qualityPreset={qualityPreset}
        onSelectShot={handleSelectShot}
        onToggleActive={handleActivate}
        onSetQuality={(q) => chronosStore.setQualityPreset(q)}
      />
    </main>
  );
}
