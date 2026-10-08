'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { chronosStore } from '@/lib/chronosStore';
import { TEMPORAL_ECHOES } from '@/types/phase07';
import { audioManager } from '@/lib/audioManager';

export function CinematicMemoryModal() {
  const activeMemory = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.activeEchoMemory,
    () => null
  );

  const activeEcho = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.activeEchoModal,
    () => null
  );

  useEffect(() => {
    if (activeMemory && activeEcho) {
      audioManager.playEcho();
    }
  }, [activeMemory, activeEcho]);

  if (!activeMemory || !activeEcho) return null;

  const echoConfig = TEMPORAL_ECHOES[activeMemory.echoId] || activeEcho;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md pointer-events-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#D4AF37]/50 bg-[#06080C]/95 p-6 sm:p-8 shadow-[0_0_60px_rgba(212,175,55,0.25)] text-left">
        {/* Top Header telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-cyan-400 font-bold uppercase">
              OBSERVER 07 // TEMPORAL MEMORY REVEAL
            </span>
          </div>

          <span className="rounded border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#FFE8B5]">
            {activeMemory.historicalPeriod}
          </span>
        </div>

        {/* Artifact Title & Classification */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              [{echoConfig.number}] &bull; {echoConfig.districtLabel}
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="font-mono text-[10px] tracking-widest text-[#D4AF37] uppercase">
              {activeMemory.artifactClassification}
            </span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#FFE8B5]">
            {echoConfig.name}
          </h2>
          <p className="font-cinzel text-xs sm:text-sm text-cyan-200/90 font-medium tracking-wider">
            {echoConfig.artifactName}
          </p>
        </div>

        {/* Archival Memory Narrative */}
        <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-3">
          <div>
            <h3 className="font-mono text-[9px] tracking-[0.2em] text-zinc-400 uppercase">
              ARCHIVAL TRANSMISSION DECODE:
            </h3>
            <p className="mt-1 font-serif text-sm sm:text-base leading-relaxed text-[#F5F3ED]/90 italic">
              {activeMemory.archivalMemory}
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-mono text-[9px] tracking-[0.2em] text-cyan-400/80 uppercase">
              OBSERVER 07 HISTORICAL INSIGHT:
            </h3>
            <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-zinc-300">
              {activeMemory.observerInsight}
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <p className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider text-[#D4AF37] text-center">
              {activeMemory.revelationQuote}
            </p>
          </div>
        </div>

        {/* Discovery Clue context */}
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>LOCATION: {activeMemory.discoveredLocation}</span>
          <span className="text-cyan-400">STATUS: RECORDED IN ARCHIVE</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onMouseEnter={() => audioManager.playHover()}
            onClick={() => {
              audioManager.playConfirm();
              chronosStore.closeEchoMemory();
              chronosStore.setActiveEchoModal(null);
              chronosStore.setIsJournalOpen(true);
            }}
            className="rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-4 py-2 font-mono text-xs font-bold tracking-wider text-[#FFE8B5] transition hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]"
          >
            OPEN NARRATIVE ARCHIVE
          </button>
          <button
            onMouseEnter={() => audioManager.playHover()}
            onClick={() => {
              audioManager.playConfirm();
              chronosStore.closeEchoMemory();
              chronosStore.setActiveEchoModal(null);
            }}
            className="rounded-lg border border-white/20 bg-white/5 px-5 py-2 font-mono text-xs font-bold tracking-wider text-white transition hover:bg-white/15"
          >
            RESUME EXPLORATION
          </button>
        </div>
      </div>
    </div>
  );
}
