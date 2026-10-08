'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { chronosStore } from '@/lib/chronosStore';
import { ENDINGS_CONFIG, type ParadoxEnding, type ParadoxState } from '@/types/phase09';

export function FinalChoiceModal() {
  const paradoxState = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.paradoxState,
    () => 'inactive' as ParadoxState
  );

  const selectedEnding = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.selectedEnding,
    () => null as ParadoxEnding | null
  );

  const [focusedChoice, setFocusedChoice] = useState<ParadoxEnding>('restore_time');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Modal is visible when in 'awaiting-choice' or 'resolving' state
  const isOpen = paradoxState === 'awaiting-choice' || paradoxState === 'resolving';

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedChoice('restore_time');
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedChoice('explore_unknown');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (showConfirmation) {
          chronosStore.selectEnding(focusedChoice);
          chronosStore.confirmEnding();
        } else {
          chronosStore.selectEnding(focusedChoice);
          setShowConfirmation(true);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (showConfirmation) {
          setShowConfirmation(false);
        } else {
          chronosStore.cancelParadoxFinale();
        }
      }
    },
    [isOpen, showConfirmation, focusedChoice]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const currentConfig = ENDINGS_CONFIG[focusedChoice];
  const isResolving = paradoxState === 'resolving';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Final Choice — Paradox Resolution"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#08090D]/85 backdrop-blur-xl pointer-events-auto select-none"
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#0C0E14]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-700"
          style={{
            backgroundColor: focusedChoice === 'restore_time' ? 'rgba(212,175,55,0.18)' : 'rgba(0,240,255,0.18)',
          }}
        />

        {/* Header telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase">
              SEQUENCE 05 // THE FINAL DIRECTIVE
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-widest text-zinc-500">
            OBSERVER 07 PROTOCOL
          </span>
        </div>

        {/* Modal Title */}
        <div className="text-center mb-8">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#F5F3ED]">
            THE FINAL CHOICE
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-mono tracking-wider max-w-xl mx-auto">
            The timeline stands at the threshold of singular collapse. As Observer 07, your directive dictates the fate of Aeternum across all five eras.
          </p>
        </div>

        {/* Confirmation State vs Dual Choice State */}
        {showConfirmation ? (
          <div className="flex flex-col items-center text-center py-4 max-w-xl mx-auto">
            <div
              className={`rounded-full px-4 py-1 font-mono text-[11px] font-bold tracking-widest border mb-4 ${
                focusedChoice === 'restore_time'
                  ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#FFE8B5]'
                  : 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
              }`}
            >
              CONFIRM RESOLUTION: {currentConfig.title}
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#F5F3ED] mb-3">
              {currentConfig.tagline}
            </h3>

            <div className="w-full text-left bg-black/40 border border-white/10 rounded-xl p-4 sm:p-5 mb-6 space-y-2">
              <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase block mb-1">
                OPERATIONAL IMPACT:
              </span>
              {currentConfig.consequences.map((c, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                  <span className={focusedChoice === 'restore_time' ? 'text-[#D4AF37]' : 'text-cyan-400'}>
                    &bull;
                  </span>
                  <span>{c}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full justify-center">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={isResolving}
                className="px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-zinc-300 font-cinzel text-xs tracking-wider transition"
              >
                &larr; BACK
              </button>

              <button
                type="button"
                onClick={() => {
                  chronosStore.selectEnding(focusedChoice);
                  chronosStore.confirmEnding();
                }}
                disabled={isResolving}
                className={`px-8 py-2.5 rounded-full font-cinzel text-xs font-bold tracking-[0.2em] transition shadow-lg ${
                  isResolving
                    ? 'opacity-60 cursor-wait bg-zinc-600 text-zinc-300'
                    : focusedChoice === 'restore_time'
                    ? 'bg-[#D4AF37] text-black hover:bg-[#FFE8B5] shadow-[0_0_20px_rgba(212,175,55,0.5)]'
                    : 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.5)]'
                }`}
              >
                {isResolving ? 'SEALING TIMELINE...' : 'EXECUTE DIRECTIVE'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* OPTION 1: RESTORE TIME */}
            <div
              onClick={() => {
                setFocusedChoice('restore_time');
                chronosStore.selectEnding('restore_time');
                setShowConfirmation(true);
              }}
              onMouseEnter={() => setFocusedChoice('restore_time')}
              className={`cursor-pointer rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                focusedChoice === 'restore_time'
                  ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_30px_rgba(212,175,55,0.3)] scale-[1.02]'
                  : 'border-white/10 bg-white/[0.03] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase">
                    DIRECTIVE // ALPHA
                  </span>
                  <span className="h-6 w-6 rounded-full border border-[#D4AF37]/60 flex items-center justify-center font-mono text-xs text-[#FFE8B5]">
                    1
                  </span>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#FFE8B5] mb-2">
                  RESTORE TIME
                </h3>

                <p className="text-xs text-zinc-300 font-mono tracking-wider mb-5">
                  Repair the Chronos Core mechanism and seal the fractures, returning Aeternum to singular, peaceful 2026 equilibrium.
                </p>

                <div className="space-y-1.5 border-t border-[#D4AF37]/20 pt-4">
                  {ENDINGS_CONFIG.restore_time.consequences.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-400 font-mono">
                      <span className="text-[#D4AF37]">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest">
                  STABILIZE HISTORY
                </span>
                <span className="font-cinzel text-xs font-bold text-[#FFE8B5] flex items-center gap-1">
                  SELECT &rarr;
                </span>
              </div>
            </div>

            {/* OPTION 2: EXPLORE THE UNKNOWN */}
            <div
              onClick={() => {
                setFocusedChoice('explore_unknown');
                chronosStore.selectEnding('explore_unknown');
                setShowConfirmation(true);
              }}
              onMouseEnter={() => setFocusedChoice('explore_unknown')}
              className={`cursor-pointer rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                focusedChoice === 'explore_unknown'
                  ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_30px_rgba(0,240,255,0.3)] scale-[1.02]'
                  : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/50 hover:bg-cyan-500/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-300 uppercase">
                    DIRECTIVE // OMEGA
                  </span>
                  <span className="h-6 w-6 rounded-full border border-cyan-400/60 flex items-center justify-center font-mono text-xs text-cyan-200">
                    2
                  </span>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-cyan-200 mb-2">
                  EXPLORE THE UNKNOWN
                </h3>

                <p className="text-xs text-zinc-300 font-mono tracking-wider mb-5">
                  Keep controlled temporal pathways open, empowering Observer 07 with unrestricted cross-era navigation into uncharted futures.
                </p>

                <div className="space-y-1.5 border-t border-cyan-400/20 pt-4">
                  {ENDINGS_CONFIG.explore_unknown.consequences.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-400 font-mono">
                      <span className="text-cyan-400">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-cyan-400/20 flex items-center justify-between">
                <span className="font-mono text-[10px] text-cyan-300 tracking-widest">
                  UNLOCK ALL ERAS
                </span>
                <span className="font-cinzel text-xs font-bold text-cyan-200 flex items-center gap-1">
                  SELECT &rarr;
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer controls & accessibility hint */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-zinc-500 font-mono text-[9px] tracking-wider">
          <span>&larr; &rarr; ARROW KEYS OR CLICK TO CHOOSE &bull; ENTER TO CONFIRM</span>
          <button
            type="button"
            onClick={() => chronosStore.cancelParadoxFinale()}
            className="hover:text-zinc-300 text-zinc-500 underline uppercase"
          >
            DISMISS FINALE
          </button>
        </div>
      </div>
    </div>
  );
}
