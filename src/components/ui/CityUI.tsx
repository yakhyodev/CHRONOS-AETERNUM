'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import {
  type CinematicSegmentId,
  CINEMATIC_SEGMENTS,
} from '@/types/phase04';
import { TEMPORAL_ERAS, type HistoricalEraId } from '@/types/phase05';
import { getTemporalMorphState } from '@/types/phase06';
import {
  DISTRICT_EXPLORE_ANCHORS,
  type ExploreDistrictId,
  type TemporalLensLandmarkId,
} from '@/types/phase07';
import { chronosStore } from '@/lib/chronosStore';
import { TimeScrubber } from './TimeScrubber';
import { DiscoveryJournal } from './DiscoveryJournal';
import { TemporalLensHUD } from './TemporalLensHUD';
import { CinematicMemoryModal } from './CinematicMemoryModal';
import { ObserverTransmissionHUD } from './ObserverTransmissionHUD';

interface CityUIProps {
  onSelectSegment: (segmentId: CinematicSegmentId) => void;
  onReturnToChamber: () => void;
}

export function CityUI({
  onSelectSegment,
  onReturnToChamber,
}: CityUIProps) {
  // Sync continuous journey state with store
  const currentSegment = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.currentSegment,
    () => 'grand-arrival' as CinematicSegmentId
  );

  const activeEra = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.activeEra,
    () => 'the-present' as HistoricalEraId
  );

  const timelinePosition = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.timelinePosition,
    () => 0.75
  );

  // Phase 07 Exploration & Interaction Subscriptions
  const experienceMode = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.experienceMode,
    () => 'story' as const
  );

  const exploreDistrict = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.exploreDistrict,
    () => 'plaza' as ExploreDistrictId
  );

  const isTimeFrozen = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.isTimeFrozen,
    () => false
  );

  const discoveredEchoesCount = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.discoveredEchoes.size,
    () => 0
  );

  const activeSegmentConfig =
    CINEMATIC_SEGMENTS.find((s) => s.id === currentSegment) ||
    CINEMATIC_SEGMENTS[0];

  const eraConfig = TEMPORAL_ERAS[activeEra] || TEMPORAL_ERAS['the-present'];
  const morphState = getTemporalMorphState(timelinePosition);
  const isMorphing = morphState.blendFactor > 0.02 && morphState.blendFactor < 0.98;

  // Key navigation chapter anchors
  const CHAPTER_STATIONS: { id: CinematicSegmentId; label: string; number: string }[] = [
    { id: 'grand-arrival', label: 'PLAZA', number: '01' },
    { id: 'old-district', label: 'OLD DISTRICT', number: '02' },
    { id: 'river-reveal', label: 'RIVER', number: '03' },
    { id: 'machine-district', label: 'INDUSTRY', number: '04' },
    { id: 'the-observatory', label: 'OBSERVATORY', number: '05' },
    { id: 'return-chronos', label: 'RETURN', number: '06' },
  ];

  // Explore district list
  const EXPLORE_DISTRICTS: { id: ExploreDistrictId; label: string; landmarkId: TemporalLensLandmarkId }[] = [
    { id: 'plaza', label: 'PLAZA', landmarkId: 'plaza-tower' },
    { id: 'old-district', label: 'OLD DISTRICT', landmarkId: 'plaza-tower' },
    { id: 'river', label: 'RIVER', landmarkId: 'river-bridge' },
    { id: 'industry', label: 'INDUSTRY', landmarkId: 'river-bridge' },
    { id: 'observatory', label: 'OBSERVATORY', landmarkId: 'observatory-dome' },
  ];

  return (
    <div className="relative h-full w-full pointer-events-none select-none">
      {/* ================================================================== */}
      {/* 1. TOP HEADER BAR: Branding, Coordinates & Return to Chamber */}
      {/* ================================================================== */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
        {/* Brand & Era Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <Image
              src="/chronos/chronos-core-emblem.svg"
              alt="Chronos Emblem"
              fill
              className="object-contain filter drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.25em] text-[#F5F3ED]">
                AETERNUM
              </h1>
              <span className={`rounded border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest ${
                isMorphing
                  ? 'border-cyan-400/50 bg-cyan-950/40 text-cyan-300 animate-pulse'
                  : 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#FFE8B5]'
              }`}>
                {morphState.yearDisplay}
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-[0.28em] text-[#D4AF37] uppercase">
              {isMorphing ? `MORPHING (${Math.round(morphState.blendFactor * 100)}%)` : eraConfig.epochName} &bull; {activeSegmentConfig.district}
            </span>
          </div>
        </div>

        {/* Telemetry Flight & Temporal Gauge (Desktop) */}
        <div className="hidden md:flex items-center gap-4 rounded-full border border-white/10 bg-[#08090D]/80 px-4 py-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isMorphing ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-300">
              {isMorphing ? 'TIME MORPH ACTIVE' : 'TEMPORAL ENGINE'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-600">|</span>
          <span className="font-mono text-[10px] tracking-widest text-[#EAB774]">
            {morphState.yearDisplay}
          </span>
          <span className="font-mono text-[10px] text-zinc-600">|</span>
          <span className="font-mono text-[10px] tracking-widest text-zinc-400">
            SEG {activeSegmentConfig.number}/08
          </span>
        </div>

        {/* Center Header Controls: Mode Switcher & Echo Journal Pill */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-[#08090D]/85 p-1 shadow-lg backdrop-blur-md">
            <button
              type="button"
              onClick={() => chronosStore.setExperienceMode('story')}
              className={`rounded-full px-3 py-1 font-cinzel text-[10px] font-semibold tracking-wider transition ${
                experienceMode === 'story'
                  ? 'border border-[#D4AF37] bg-[#D4AF37]/25 text-[#FFE8B5] shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              STORY
            </button>
            <button
              type="button"
              onClick={() => chronosStore.setExperienceMode('explore')}
              className={`rounded-full px-3 py-1 font-cinzel text-[10px] font-semibold tracking-wider transition ${
                experienceMode === 'explore'
                  ? 'border border-cyan-400 bg-cyan-500/25 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              EXPLORE
            </button>
          </div>

          {/* Temporal Echoes Archive Pill */}
          <button
            type="button"
            onClick={() => chronosStore.setIsJournalOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 px-3.5 py-1.5 backdrop-blur-md transition shadow-[0_0_12px_rgba(0,240,255,0.2)] focus:outline-none"
            title="Open Temporal Echo Archives"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-wider text-cyan-300">
              ECHOES {discoveredEchoesCount}/5
            </span>
          </button>
        </div>

        {/* Return to Chamber Button */}
        <button
          type="button"
          onClick={onReturnToChamber}
          className="group relative flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#08090D]/80 px-4 py-2 font-cinzel text-xs font-semibold tracking-[0.2em] text-[#F5F3ED] shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
            &larr;
          </span>
          <span>CHAMBER</span>
        </button>
      </header>

      {/* ================================================================== */}
      {/* 2. SIDE HUD COMPASS / FLIGHT GAUGES (Left Screen Edge) */}
      {/* ================================================================== */}
      <aside
        aria-label="City Navigation HUD"
        className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 pointer-events-auto"
      >
        <div className="flex flex-col gap-1 border-l-2 border-[#D4AF37]/60 pl-3">
          <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase">
            ACTIVE ERA
          </span>
          <span className="font-cinzel text-xs font-semibold tracking-wider text-[#F5F3ED]">
            {eraConfig.epochName} ({eraConfig.yearLabel})
          </span>
        </div>
        <div className="flex flex-col gap-1 border-l-2 border-[#D4AF37]/40 pl-3">
          <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase">
            MODE &bull; DISTRICT
          </span>
          <span className="font-cinzel text-xs font-semibold tracking-wider text-[#F5F3ED]">
            {experienceMode === 'explore'
              ? `EXPLORE: ${DISTRICT_EXPLORE_ANCHORS[exploreDistrict]?.name}`
              : activeSegmentConfig.district}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-l-2 border-[#D4AF37]/30 pl-3">
          <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase">
            LANDMARK
          </span>
          <span className="font-mono text-[10px] text-[#EAB774]">
            {eraConfig.landmarkTitle}
          </span>
        </div>
      </aside>

      {/* ================================================================== */}
      {/* 3. TEMPORAL LENS HUD (when active) */}
      {/* ================================================================== */}
      <TemporalLensHUD />

      {/* ================================================================== */}
      {/* 4. DISCOVERY JOURNAL & CINEMATIC MEMORY MODALS */}
      {/* ================================================================== */}
      <ObserverTransmissionHUD />
      <CinematicMemoryModal />
      <DiscoveryJournal />

      {/* ================================================================== */}
      {/* 5. BOTTOM CONTROLS: TIME SCRUBBER & MODE-SPECIFIC NAVIGATION */}
      {/* ================================================================== */}
      <footer className="absolute bottom-6 left-6 right-6 flex flex-col items-center gap-3 pointer-events-auto">
        {/* CINEMATIC TIME SCRUBBER INSTRUMENT */}
        <div className="rounded-2xl border border-white/10 bg-[#08090D]/85 px-4 sm:px-6 py-2.5 shadow-2xl backdrop-blur-md">
          <TimeScrubber />
        </div>

        {experienceMode === 'story' ? (
          <>
            {/* Active Segment Title & Description */}
            <div className="text-center px-4 max-w-xl">
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-[#D4AF37]">
                  [{activeSegmentConfig.number}]
                </span>
                <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-[#FFE8B5]">
                  {activeSegmentConfig.title}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] sm:text-[11px] text-zinc-400 font-mono tracking-wider line-clamp-1">
                {activeSegmentConfig.description}
              </p>
            </div>

            {/* Chapter Station Navigation Pills */}
            <nav
              aria-label="Aeternum Journey Stations"
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-[#08090D]/90 p-1.5 shadow-2xl backdrop-blur-lg overflow-x-auto max-w-full"
            >
              {CHAPTER_STATIONS.map((station) => {
                const isActive =
                  currentSegment === station.id ||
                  (station.id === 'river-reveal' && currentSegment === 'above-water') ||
                  (station.id === 'the-observatory' && currentSegment === 'ascent-observatory');

                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => onSelectSegment(station.id)}
                    className={`relative whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 font-cinzel text-[10px] sm:text-xs tracking-[0.15em] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] ${
                      isActive
                        ? 'border border-[#D4AF37] bg-[#D4AF37]/25 font-bold text-[#FFE8B5] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-[#F5F3ED]'
                    }`}
                  >
                    <span className="font-mono text-[9px] text-[#D4AF37]/80 mr-1.5">
                      {station.number}
                    </span>
                    <span>{station.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Scroll Instruction Hint */}
            <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] tracking-[0.25em] uppercase">
              <span className="animate-bounce inline-block">&darr;</span>
              <span>SCROLL TO GLIDE THROUGH AETERNUM</span>
              <span className="animate-bounce inline-block">&darr;</span>
            </div>
          </>
        ) : (
          <>
            {/* Explore District Heading */}
            <div className="text-center px-4 max-w-xl">
              <div className="flex items-center justify-center gap-2">
                <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-cyan-200">
                  {DISTRICT_EXPLORE_ANCHORS[exploreDistrict]?.name}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-zinc-400 font-mono tracking-wider line-clamp-1">
                {DISTRICT_EXPLORE_ANCHORS[exploreDistrict]?.tagline}
              </p>
            </div>

            {/* Explore District Navigation Pills */}
            <nav
              aria-label="Aeternum Exploration Districts"
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-[#08090D]/90 p-1.5 shadow-2xl backdrop-blur-lg overflow-x-auto max-w-full"
            >
              {EXPLORE_DISTRICTS.map((d) => {
                const isActive = exploreDistrict === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => chronosStore.setExploreDistrict(d.id)}
                    className={`relative whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 font-cinzel text-[10px] sm:text-xs tracking-[0.15em] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                      isActive
                        ? 'border border-cyan-400 bg-cyan-500/25 font-bold text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Explore Mode Tool Actions: Freeze Time & Temporal Lens */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => chronosStore.toggleTimeFreeze()}
                className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-cinzel text-[10px] sm:text-[11px] tracking-wider transition ${
                  isTimeFrozen
                    ? 'border-cyan-300 bg-cyan-500/35 text-cyan-100 shadow-[0_0_15px_rgba(0,240,255,0.6)] animate-pulse font-bold'
                    : 'border-white/20 bg-[#08090D]/80 text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{isTimeFrozen ? '❄ TIME FROZEN' : '⏸ FREEZE TIME'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const currentDistrictConfig = EXPLORE_DISTRICTS.find((d) => d.id === exploreDistrict);
                  if (currentDistrictConfig) {
                    chronosStore.openTemporalLens(currentDistrictConfig.landmarkId);
                  }
                }}
                className="flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#08090D]/80 hover:bg-[#D4AF37]/20 px-4 py-1.5 font-cinzel text-[10px] sm:text-[11px] tracking-wider text-[#FFE8B5] transition shadow-[0_0_12px_rgba(212,175,55,0.25)]"
              >
                <span>👁 TEMPORAL LENS</span>
              </button>
            </div>

            {/* Orbit / Zoom Navigation Hint */}
            <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] tracking-[0.2em] uppercase">
              <span>DRAG TO ROTATE &bull; SCROLL TO ZOOM &bull; CLICK CRYSTALS TO DISCOVER ECHOES</span>
            </div>
          </>
        )}
      </footer>
    </div>
  );
}
