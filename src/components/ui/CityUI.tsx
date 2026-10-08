'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import {
  type CinematicSegmentId,
  CINEMATIC_SEGMENTS,
} from '@/types/phase04';
import { chronosStore } from '@/lib/chronosStore';

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

  const activeSegmentConfig =
    CINEMATIC_SEGMENTS.find((s) => s.id === currentSegment) ||
    CINEMATIC_SEGMENTS[0];

  // Key navigation chapter anchors
  const CHAPTER_STATIONS: { id: CinematicSegmentId; label: string; number: string }[] = [
    { id: 'grand-arrival', label: 'PLAZA', number: '01' },
    { id: 'old-district', label: 'OLD DISTRICT', number: '02' },
    { id: 'river-reveal', label: 'RIVER', number: '03' },
    { id: 'machine-district', label: 'INDUSTRY', number: '04' },
    { id: 'the-observatory', label: 'OBSERVATORY', number: '05' },
    { id: 'return-chronos', label: 'RETURN', number: '06' },
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
              <span className="rounded border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-[#FFE8B5]">
                2026
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-[0.28em] text-[#D4AF37] uppercase">
              CINEMATIC CITY JOURNEY &bull; {activeSegmentConfig.district}
            </span>
          </div>
        </div>

        {/* Telemetry Flight Gauge (Desktop) */}
        <div className="hidden md:flex items-center gap-4 rounded-full border border-white/10 bg-[#08090D]/80 px-4 py-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-300">
              SPLINE TRAJECTORY
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-600">|</span>
          <span className="font-mono text-[10px] tracking-widest text-[#EAB774]">
            SEG {activeSegmentConfig.number}/08
          </span>
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
      <aside aria-label="City Navigation HUD" className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 pointer-events-auto">
        <div className="flex flex-col gap-1 border-l-2 border-[#D4AF37]/60 pl-3">
          <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase">
            DISTRICT
          </span>
          <span className="font-cinzel text-xs font-semibold tracking-wider text-[#F5F3ED]">
            {activeSegmentConfig.district}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-l-2 border-[#D4AF37]/30 pl-3">
          <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase">
            VECTOR ALTITUDE
          </span>
          <span className="font-mono text-[10px] text-[#EAB774]">
            {activeSegmentConfig.id.includes('observatory')
              ? '48.0M [PEAK]'
              : activeSegmentConfig.id.includes('water')
              ? '7.5M [CANAL]'
              : '16.0M [SKYLINE]'}
          </span>
        </div>
      </aside>

      {/* ================================================================== */}
      {/* 3. BOTTOM CINEMATIC JOURNEY CONTROLS & CHAPTER STATION SELECTOR */}
      {/* ================================================================== */}
      <footer className="absolute bottom-6 left-6 right-6 flex flex-col items-center gap-3 pointer-events-auto">
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
          <p className="mt-1 text-[11px] text-zinc-400 font-mono tracking-wider line-clamp-2">
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
      </footer>
    </div>
  );
}
