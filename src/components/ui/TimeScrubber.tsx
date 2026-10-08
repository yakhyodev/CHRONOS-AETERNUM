'use client';

import { useRef, useCallback, useSyncExternalStore } from 'react';
import {
  ORDERED_ERAS,
  TEMPORAL_ERAS,
  getEraFromTimelinePosition,
  getTimelineStopFromEra,
  type HistoricalEraId,
} from '@/types/phase05';
import { chronosStore } from '@/lib/chronosStore';

export function TimeScrubber() {
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

  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const eraConfig = TEMPORAL_ERAS[activeEra] || TEMPORAL_ERAS['the-present'];

  // Handle pointer down and scrub tracking
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    const updatePosition = (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      chronosStore.setTimelinePosition(progress);
    };

    updatePosition(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDragging.current) return;
      updatePosition(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      // Snap cleanly to nearest era stop upon release
      const currentPos = chronosStore.timelinePosition;
      const nearestEra = getEraFromTimelinePosition(currentPos);
      chronosStore.setActiveEra(nearestEra);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, []);

  // Keyboard navigation for full accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      chronosStore.navigateEra('next');
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      chronosStore.navigateEra('prev');
    } else if (e.key === 'Home') {
      e.preventDefault();
      chronosStore.setActiveEra('the-origin');
    } else if (e.key === 'End') {
      e.preventDefault();
      chronosStore.setActiveEra('the-next-age');
    }
  }, []);

  return (
    <div
      role="region"
      aria-label="Temporal Era Navigation"
      className="flex flex-col items-center gap-2 pointer-events-auto select-none"
    >
      {/* 1. Header Display: Era Name & Historical Year Indicator */}
      <div className="flex items-center gap-3">
        <span className="font-cinzel text-xs font-bold tracking-[0.25em] text-[#FFE8B5]">
          {eraConfig.epochName}
        </span>
        <span className="font-mono text-xs font-bold tracking-widest text-[#D4AF37] border-l border-white/20 pl-3">
          {eraConfig.yearLabel}
        </span>
      </div>

      {/* 2. Precision Timeline Instrument Slider Track */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Time Scrubber"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={eraConfig.timelineIndex}
        aria-valuetext={`${eraConfig.epochName} (${eraConfig.yearLabel})`}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className="relative w-72 sm:w-96 md:w-[460px] h-9 flex items-center cursor-pointer group focus:outline-none"
      >
        {/* Outer Background Rail */}
        <div className="absolute inset-x-0 h-1 rounded-full bg-zinc-800/80 border border-white/10" />

        {/* Illuminated Progress Fill Rail */}
        <div
          className="absolute left-0 h-1 rounded-full bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-300 transition-all duration-75"
          style={{ width: `${timelinePosition * 100}%` }}
        />

        {/* Five Discrete Historical Era Stops */}
        {ORDERED_ERAS.map((eId) => {
          const cfg = TEMPORAL_ERAS[eId];
          const isStopActive = activeEra === eId;
          const stopPercent = cfg.timelineStop * 100;

          return (
            <button
              key={eId}
              type="button"
              onClick={(evt) => {
                evt.stopPropagation();
                chronosStore.setActiveEra(eId);
              }}
              className="absolute -translate-x-1/2 flex flex-col items-center focus:outline-none"
              style={{ left: `${stopPercent}%` }}
              title={`${cfg.epochName} (${cfg.yearLabel})`}
            >
              {/* Vertical Tick Notch */}
              <div
                className={`w-1.5 h-3.5 rounded-full transition-all duration-300 ${
                  isStopActive
                    ? 'bg-[#FFE8B5] ring-2 ring-[#D4AF37] scale-125'
                    : 'bg-zinc-600 hover:bg-zinc-400'
                }`}
              />

              {/* Year Label below notch */}
              <span
                className={`mt-2 font-mono text-[9px] tracking-wider transition-colors duration-200 ${
                  isStopActive
                    ? 'text-[#FFE8B5] font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cfg.year === -1200 ? '1200 BCE' : cfg.year}
              </span>
            </button>
          );
        })}

        {/* Luminous Draggable Scrubber Thumb */}
        <div
          className="absolute -translate-x-1/2 h-5 w-5 rounded-full border-2 border-[#FFE8B5] bg-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.8)] pointer-events-none transition-transform duration-75 group-hover:scale-110 group-focus:ring-2 group-focus:ring-[#D4AF37]"
          style={{ left: `${timelinePosition * 100}%` }}
        >
          <div className="absolute inset-1 rounded-full bg-[#08090D]" />
        </div>
      </div>
    </div>
  );
}
