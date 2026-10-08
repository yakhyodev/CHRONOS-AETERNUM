'use client';

import { useState, useSyncExternalStore } from 'react';
import { chronosStore } from '@/lib/chronosStore';
import { ENDINGS_CONFIG, type ParadoxEnding, type ParadoxState } from '@/types/phase09';

export function EpilogueOverlay() {
  const [dismissed, setDismissed] = useState(false);

  const paradoxState = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.paradoxState,
    () => 'inactive' as ParadoxState
  );

  const isFinaleCompleted = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.isFinaleCompleted,
    () => false
  );

  const selectedEnding = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.selectedEnding,
    () => null as ParadoxEnding | null
  );

  // Overlay is visible when completed and not dismissed
  const isVisible =
    isFinaleCompleted &&
    paradoxState === 'completed' &&
    selectedEnding !== null &&
    !dismissed;

  if (!isVisible || !selectedEnding) return null;

  const endingConfig = ENDINGS_CONFIG[selectedEnding];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Epilogue — Paradox Resolution"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl pointer-events-auto select-none"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-[#08090D]/95 p-6 sm:p-10 text-center shadow-2xl backdrop-blur-2xl">
        {/* Ambient radial glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[90px] pointer-events-none"
          style={{
            backgroundColor: selectedEnding === 'restore_time' ? 'rgba(212,175,55,0.22)' : 'rgba(0,240,255,0.22)',
          }}
        />

        {/* Emblems & Epilogue Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase">
            PARADOX RESOLUTION LOG // OBSERVER 07
          </span>
        </div>

        {/* Canonical Ending Concluding Text */}
        <h1
          className={`font-cinzel text-3xl sm:text-4xl font-bold tracking-[0.25em] mb-2 ${
            selectedEnding === 'restore_time' ? 'text-[#FFE8B5]' : 'text-cyan-200'
          }`}
        >
          {endingConfig.bannerHeadline}
        </h1>

        <p className="font-cinzel text-base sm:text-lg tracking-[0.2em] text-[#D4AF37] mb-6">
          {endingConfig.bannerSubline}
        </p>

        <p className="text-xs sm:text-sm text-zinc-300 font-mono tracking-wider max-w-lg mx-auto mb-8 leading-relaxed">
          {selectedEnding === 'restore_time'
            ? 'The five temporal fissures across Aeternum have converged and sealed. The historical continuum returns to equilibrium. The monument stands eternal.'
            : 'The Chronos Core stabilizes in quantum resonance. The bridges between eras remain open to those with the courage to seek them. Your exploration is limitless.'}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              if (selectedEnding === 'explore_unknown') {
                chronosStore.setExperienceMode('explore');
              }
            }}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-cinzel text-xs font-bold tracking-widest transition shadow-lg ${
              selectedEnding === 'restore_time'
                ? 'bg-[#D4AF37] text-black hover:bg-[#FFE8B5]'
                : 'bg-cyan-400 text-black hover:bg-cyan-300'
            }`}
          >
            {selectedEnding === 'restore_time'
              ? 'CONTINUE EXPLORING 2026'
              : 'ENTER UNRESTRICTED EXPLORATION'}
          </button>

          <button
            type="button"
            onClick={() => {
              setDismissed(false);
              chronosStore.resetFinale();
              chronosStore.startParadoxFinale();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-zinc-300 font-cinzel text-xs tracking-wider transition"
          >
            REPLAY FINALE
          </button>

          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              chronosStore.setWorldMode('chamber');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-white/10 text-zinc-400 hover:text-white font-cinzel text-xs tracking-wider transition"
          >
            RETURN TO CHAMBER
          </button>
        </div>
      </div>
    </div>
  );
}
