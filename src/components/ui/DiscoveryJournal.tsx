'use client';

import { useEffect, useSyncExternalStore } from 'react';
import {
  TEMPORAL_ECHOES,
  ORDERED_ECHO_IDS,
  type TemporalEchoId,
} from '@/types/phase07';
import { chronosStore } from '@/lib/chronosStore';

export function DiscoveryJournal() {
  useEffect(() => {
    chronosStore.loadDiscoveredEchoes();
  }, []);

  const isJournalOpen = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.isJournalOpen,
    () => false
  );

  const activeEchoModal = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.activeEchoModal,
    () => null
  );

  const discoveredEchoes = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.discoveredEchoesList,
    () => [] as TemporalEchoId[]
  );

  const discoveredCount = discoveredEchoes.length;

  return (
    <>
      {/* ============================================================== */}
      {/* 1. ECHO REVEAL CARD MODAL (Pops up upon collecting an echo)     */}
      {/* ============================================================== */}
      {activeEchoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md pointer-events-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#D4AF37]/50 bg-[#08090D]/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-400 uppercase font-bold">
                  TEMPORAL ECHO REVEALED
                </span>
              </div>
              <span className="rounded border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-2 py-0.5 font-mono text-[9px] font-bold text-[#FFE8B5]">
                {activeEchoModal.yearLabel}
              </span>
            </div>

            {/* Echo Info */}
            <div className="mt-5 space-y-3">
              <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                [{activeEchoModal.number}] &bull; {activeEchoModal.districtLabel}
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#FFE8B5]">
                {activeEchoModal.name}
              </h2>
              <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-3.5 py-2">
                <span className="font-mono text-[11px] font-semibold tracking-wider text-[#EAB774]">
                  ARTIFACT: {activeEchoModal.artifactName}
                </span>
              </div>
              <p className="mt-2 font-mono text-xs sm:text-[13px] leading-relaxed text-zinc-300 border-l-2 border-[#D4AF37]/60 pl-3.5 py-1">
                "{activeEchoModal.clue}"
              </p>
            </div>

            {/* Actions */}
            <div className="mt-7 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => chronosStore.setActiveEchoModal(null)}
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2 font-cinzel text-xs font-semibold tracking-[0.2em] text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                DISMISS
              </button>
              <button
                type="button"
                onClick={() => {
                  chronosStore.setActiveEchoModal(null);
                  chronosStore.setIsJournalOpen(true);
                }}
                className="rounded-full border border-[#D4AF37] bg-[#D4AF37]/20 px-5 py-2 font-cinzel text-xs font-semibold tracking-[0.2em] text-[#FFE8B5] transition hover:bg-[#D4AF37]/35 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                OPEN JOURNAL ({discoveredCount}/5)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DISCOVERY JOURNAL MODAL (Inspect all collected clues)        */}
      {/* ============================================================== */}
      {isJournalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/15 bg-[#08090D]/95 p-6 sm:p-7 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.25em] text-[#FFE8B5]">
                  TEMPORAL ECHO ARCHIVES
                </h2>
                <span className="font-mono text-[10px] tracking-widest text-[#D4AF37] uppercase">
                  DISCOVERED CLUES: {discoveredCount} / 5
                </span>
              </div>
              <button
                type="button"
                onClick={() => chronosStore.setIsJournalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition"
              >
                ✕
              </button>
            </div>

            {/* Echoes List */}
            <div className="mt-5 space-y-3.5 overflow-y-auto pr-1">
              {ORDERED_ECHO_IDS.map((echoId) => {
                const config = TEMPORAL_ECHOES[echoId];
                const isFound = discoveredEchoes.includes(echoId);

                return (
                  <div
                    key={echoId}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      isFound
                        ? 'border-[#D4AF37]/40 bg-[#0F1117] shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                        : 'border-white/5 bg-zinc-950/40 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#D4AF37]">
                          [{config.number}]
                        </span>
                        <h3 className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider text-[#F5F3ED]">
                          {isFound ? config.name : 'UNRESOLVED CHRONAL RESONANCE'}
                        </h3>
                      </div>
                      <span className="font-mono text-[9px] tracking-wider text-zinc-400">
                        {config.districtLabel} &bull; {config.yearLabel}
                      </span>
                    </div>

                    {isFound ? (
                      <div className="mt-2.5 space-y-1.5">
                        <span className="font-mono text-[10px] text-[#EAB774] block">
                          ARTIFACT: {config.artifactName}
                        </span>
                        <p className="font-mono text-[11px] leading-relaxed text-zinc-300">
                          {config.clue}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 font-mono text-[10px] text-zinc-600 italic">
                        Explore {config.districtLabel} around {config.yearLabel} to discover this temporal echo.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => chronosStore.setIsJournalOpen(false)}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-2 font-cinzel text-xs font-semibold tracking-[0.2em] text-[#FFE8B5] hover:bg-white/10"
              >
                CLOSE ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
