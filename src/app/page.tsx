'use client';

import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from '@/lib/gsap';
import { CINEMATIC_SHOTS, type CinematicShotId } from '@/lib/constants';
import {
  chronosStore,
  type ActivationState,
  type QualityPreset,
  type WorldMode,
} from '@/lib/chronosStore';
import {
  type CinematicSegmentId,
  CINEMATIC_SEGMENTS,
} from '@/types/phase04';
import { CinematicUI } from '@/components/ui/CinematicUI';
import { CityUI } from '@/components/ui/CityUI';
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

export default function ChronosPage() {
  // Sync discrete states with chronosStore
  const worldMode = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.worldMode,
    () => 'chamber' as WorldMode
  );

  const currentSegment = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.currentSegment,
    () => 'grand-arrival' as CinematicSegmentId
  );

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

    // Deep-linking URL query params for testing, QA, and automated verification
    const params = new URLSearchParams(window.location.search);
    const urlWorld = params.get('world');
    const urlSegment = params.get('segment') as CinematicSegmentId;

    if (urlWorld === 'city') {
      chronosStore.setWorldMode('city');
      chronosStore.setActivationProgress(1.0);
      chronosStore.setActivationState('active');

      if (urlSegment && CINEMATIC_SEGMENTS.some((s) => s.id === urlSegment)) {
        chronosStore.setCurrentSegment(urlSegment);
        const prog = chronosStore.getProgressFromSegment(urlSegment);
        chronosStore.setJourneyProgress(prog);
      }
    }

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

  // Return from Aeternum to the ancient Chamber
  const handleReturnToChamber = useCallback(() => {
    if (activeTimeline.current) {
      activeTimeline.current.kill();
    }

    chronosStore.setWorldMode('transitioning_to_chamber');
    const proxy = { val: 1.0 };

    const tl = gsap.timeline({
      onComplete: () => {
        chronosStore.setWorldMode('chamber');
        chronosStore.setActivationState('idle');
        chronosStore.setActivationProgress(0);
        chronosStore.setPortalProgress(0);
        chronosStore.setJourneyProgress(0);
        chronosStore.setCurrentShot('shot-01');
        chronosStore.setCurrentSegment('grand-arrival');
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      },
    });
    activeTimeline.current = tl;

    tl.to(proxy, {
      val: 0,
      duration: reducedMotion ? 0.2 : 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        chronosStore.setPortalProgress(proxy.val);
      },
    });
  }, [reducedMotion]);

  // Cinematic Chamber-to-City Transition Sequence
  const handleActivate = useCallback(() => {
    if (activationState === 'activating' || activationState === 'deactivating') {
      return;
    }

    if (activeTimeline.current) {
      activeTimeline.current.kill();
    }

    if (worldMode === 'city') {
      // If already in city, toggle back to chamber
      handleReturnToChamber();
      return;
    }

    // 1. Initiate Core Activation
    chronosStore.setActivationState('activating');
    const duration = reducedMotion ? 0.3 : 2.4;

    const proxy = { actProgress: chronosStore.activationProgress, portalProgress: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        chronosStore.setActivationProgress(1.0);
        chronosStore.setPortalProgress(0);
        chronosStore.setActivationState('active');
        chronosStore.setWorldMode('city');
        chronosStore.setCurrentSegment('grand-arrival');
        chronosStore.setJourneyProgress(0);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      },
    });
    activeTimeline.current = tl;

    // Step A: Charge Chronos Core & approach Portal Archway
    tl.to(proxy, {
      actProgress: 1.0,
      duration: duration * 0.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        chronosStore.setActivationProgress(proxy.actProgress);
      },
    });

    // Step B: Engage Temporal Tunnel Vortex & Traverse into Aeternum
    tl.call(() => {
      chronosStore.setWorldMode('transitioning_to_city');
    });

    tl.to(proxy, {
      portalProgress: 1.0,
      duration: duration * 0.5,
      ease: 'power3.inOut',
      onUpdate: () => {
        chronosStore.setPortalProgress(proxy.portalProgress);
      },
    });
  }, [activationState, worldMode, reducedMotion, handleReturnToChamber]);

  // Synchronized shot navigation for Chamber scroll
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

  // Synchronized segment chapter navigation for City flight scroll
  const handleSelectSegment = useCallback((segmentId: CinematicSegmentId) => {
    const targetProgress = chronosStore.getProgressFromSegment(segmentId);
    chronosStore.setCurrentSegment(segmentId);
    chronosStore.setJourneyProgress(targetProgress);

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      isProgrammaticScroll.current = true;
      const targetY = targetProgress * maxScroll;
      window.scrollTo({ top: targetY, behavior: 'smooth' });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000);
    }
  }, []);

  // Bi-directional window scroll listener for Chamber and City modes
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      if (worldMode === 'chamber') {
        chronosStore.setTimelineProgress(progress);
        const targetShot = chronosStore.getShotFromProgress(progress);
        chronosStore.setCurrentShot(targetShot);
      } else if (worldMode === 'city') {
        chronosStore.setJourneyProgress(progress);
        const targetSegment = chronosStore.getSegmentFromProgress(progress);
        chronosStore.setCurrentSegment(targetSegment.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [worldMode]);

  const isCityActive = worldMode === 'city';

  return (
    <main
      className={`relative ${
        isCityActive ? 'min-h-[500vh] overflow-x-hidden' : 'min-h-[300vh] overflow-x-hidden'
      } bg-[#08090D] text-[#F5F3ED] selection:bg-[#D4AF37]/30 selection:text-[#FFE8B5]`}
    >
      {/* 1. Atmospheric Ambient Vignette and Particles */}
      {!isCityActive && <AtmosphereOverlay />}

      {/* 2. Fullscreen Interactive 3D WebGL Canvas */}
      <div className="fixed inset-0 z-10 pointer-events-auto">
        <Scene
          currentShot={currentShot}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* 3. Foreground Cinematic UI: Chamber Interface vs City Interface */}
      <div className="fixed inset-0 z-30 pointer-events-none">
        {isCityActive ? (
          <CityUI
            onSelectSegment={handleSelectSegment}
            onReturnToChamber={handleReturnToChamber}
          />
        ) : (
          <CinematicUI
            activationState={activationState}
            currentShot={currentShot}
            onActivate={handleActivate}
            onSelectShot={handleSelectShot}
          />
        )}
      </div>

      {/* 4. Development Status & Quality Console */}
      <DebugPanel
        currentShot={currentShot}
        activationState={activationState}
        qualityPreset={qualityPreset}
        worldMode={worldMode}
        cityView={currentSegment}
        onSelectShot={handleSelectShot}
        onToggleActive={handleActivate}
        onSetQuality={(q) => chronosStore.setQualityPreset(q)}
        onToggleWorld={() =>
          chronosStore.setWorldMode(worldMode === 'city' ? 'chamber' : 'city')
        }
      />
    </main>
  );
}
