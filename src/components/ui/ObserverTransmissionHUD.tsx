'use client';

import { useSyncExternalStore, useEffect } from 'react';
import { chronosStore } from '@/lib/chronosStore';
import { NARRATIVE_CHAPTERS } from '@/types/phase08';

export function ObserverTransmissionHUD() {
  const activeTransmission = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.activeTransmission,
    () => null
  );

  const worldMode = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.worldMode,
    () => 'chamber'
  );

  const hasSeenAwakening = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.hasSeenAwakening,
    () => false
  );

  // Auto-trigger Chapter 01 Awakening transmission in chamber on initial mount if not seen yet
  useEffect(() => {
    if (worldMode === 'chamber' && !hasSeenAwakening) {
      const ch01 = NARRATIVE_CHAPTERS['ch-01-awakening'];
      const timer = setTimeout(() => {
        chronosStore.triggerTransmission(
          'OBSERVER 07 // CORE COMM-LINK',
          ch01.transmissionLines,
          'ch-01-awakening'
        );
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [worldMode, hasSeenAwakening]);

  if (!activeTransmission) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 pointer-events-auto animate-fade-in">
      <div className="rounded-xl border border-cyan-400/50 bg-[#06080C]/90 p-4 sm:p-5 shadow-[0_0_35px_rgba(0,240,255,0.2)] backdrop-blur-md">
        {/* Header telemetry badge */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-cyan-300 font-bold uppercase">
              {activeTransmission.sender}
            </span>
          </div>

          <button
            onClick={() => {
              if (activeTransmission.chapterId === 'ch-01-awakening') {
                chronosStore.markAwakeningSeen();
              }
              chronosStore.dismissTransmission();
            }}
            className="rounded border border-cyan-400/30 px-2 py-0.5 font-mono text-[9px] text-cyan-200 transition hover:bg-cyan-500/20"
          >
            DISMISS [ESC]
          </button>
        </div>

        {/* Transmission dialogue lines */}
        <div className="mt-3 space-y-1.5 font-mono text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
          {activeTransmission.lines.map((line, idx) => (
            <p key={`trans-line-${idx}`} className="tracking-wide">
              {line}
            </p>
          ))}
        </div>

        {/* Bottom prompt */}
        <div className="mt-3 flex items-center justify-between border-t border-cyan-500/10 pt-2 text-[10px] font-mono text-zinc-400">
          <span>STATUS: REAL-TIME TIMELINE LINK</span>
          <button
            onClick={() => {
              if (activeTransmission.chapterId === 'ch-01-awakening') {
                chronosStore.markAwakeningSeen();
              }
              chronosStore.dismissTransmission();
              chronosStore.setIsJournalOpen(true);
            }}
            className="text-[#FFE8B5] hover:underline"
          >
            VIEW IN ARCHIVE &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
