'use client';

import { useSyncExternalStore } from 'react';
import { chronosStore } from '@/lib/chronosStore';
import { PARADOX_SEQUENCES, type ParadoxState } from '@/types/phase09';

export function ParadoxSequenceHUD() {
  const paradoxState = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.paradoxState,
    () => 'inactive' as ParadoxState
  );

  const sequenceIndex = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.paradoxSequenceIndex,
    () => 0
  );

  // HUD is active during sequences 01 to 04 (before the full choice modal is shown)
  const isCinematicSequence =
    paradoxState === 'awakening' ||
    paradoxState === 'unstable' ||
    paradoxState === 'converging' ||
    paradoxState === 'revelation';

  if (!isCinematicSequence) return null;

  const currentSeq = PARADOX_SEQUENCES[sequenceIndex] || PARADOX_SEQUENCES[0];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-auto select-none">
      <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-[#08090D]/90 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
        {/* Top Status & Sequence Steps */}
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-bold">
              PARADOX FINALE &bull; BEAT {currentSeq.sequenceNumber}/05
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-400">
            {[0, 1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  step === sequenceIndex
                    ? 'bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                    : step < sequenceIndex
                    ? 'bg-amber-600/50'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Headline & Location */}
        <div className="flex items-baseline justify-between mb-1.5">
          <h2 className="font-cinzel text-base sm:text-lg font-bold tracking-[0.18em] text-[#FFE8B5]">
            {currentSeq.title}
          </h2>
          <span className="font-mono text-[9px] sm:text-[10px] text-cyan-300 tracking-widest uppercase">
            {currentSeq.locationLabel}
          </span>
        </div>

        <p className="text-[11px] sm:text-xs text-zinc-300 font-mono tracking-wider mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">
          {currentSeq.synopsis}
        </p>

        {/* Navigation & Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => chronosStore.cancelParadoxFinale()}
            className="text-zinc-500 hover:text-zinc-300 font-mono text-[9px] tracking-wider uppercase transition"
          >
            &times; EXIT FINALE
          </button>

          <div className="flex items-center gap-2">
            {sequenceIndex > 0 && (
              <button
                type="button"
                onClick={() => chronosStore.prevParadoxSequence()}
                className="px-3 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-300 font-cinzel text-[10px] tracking-wider transition"
              >
                &larr; PREV
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (sequenceIndex < 4) {
                  chronosStore.nextParadoxSequence();
                }
              }}
              className="px-4 py-1 rounded-full border border-[#D4AF37] bg-[#D4AF37]/25 hover:bg-[#D4AF37]/40 text-[#FFE8B5] font-cinzel text-[10px] font-bold tracking-widest transition shadow-[0_0_12px_rgba(212,175,55,0.3)]"
            >
              {sequenceIndex === 3 ? 'PROCEED TO FINAL CHOICE &rarr;' : 'NEXT SEQUENCE &rarr;'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
