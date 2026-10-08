'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import {
  TEMPORAL_ECHOES,
  ORDERED_ECHO_IDS,
  type TemporalEchoId,
} from '@/types/phase07';
import {
  NARRATIVE_CHAPTERS,
  ORDERED_CHAPTER_IDS,
  type NarrativeChapterId,
  getChapter06Content,
} from '@/types/phase08';
import { chronosStore } from '@/lib/chronosStore';

export function DiscoveryJournal() {
  const [activeTab, setActiveTab] = useState<'echoes' | 'chapters'>('echoes');

  useEffect(() => {
    chronosStore.loadDiscoveredEchoes();
    chronosStore.loadNarrativeProgress();
  }, []);

  const isJournalOpen = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.isJournalOpen,
    () => false
  );

  const discoveredEchoes = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.discoveredEchoesList,
    () => [] as TemporalEchoId[]
  );

  const unlockedChapters = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.unlockedChaptersList,
    () => ['ch-01-awakening'] as NarrativeChapterId[]
  );

  const discoveredCount = discoveredEchoes.length;
  const isObservatoryUnlocked = unlockedChapters.includes('ch-05-revelation');
  const isConvergenceReached = unlockedChapters.includes('ch-06-warning');

  if (!isJournalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md pointer-events-auto animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-[#D4AF37]/40 bg-[#07090E]/95 p-5 sm:p-7 shadow-[0_0_60px_rgba(212,175,55,0.2)]">
        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-400 font-bold uppercase">
                OBSERVER 07 // ARCHIVAL DOSSIER
              </span>
            </div>
            <h2 className="mt-1 font-cinzel text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#FFE8B5]">
              THE CITY REMEMBERS
            </h2>
          </div>

          <button
            type="button"
            onClick={() => chronosStore.setIsJournalOpen(false)}
            className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('echoes')}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold tracking-wider transition ${
                activeTab === 'echoes'
                  ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#FFE8B5]'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              TEMPORAL ECHOES ({discoveredCount}/5)
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold tracking-wider transition ${
                activeTab === 'chapters'
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              NARRATIVE LOG ({unlockedChapters.length}/6)
            </button>
          </div>

          <span className="hidden sm:inline font-mono text-[10px] text-zinc-400">
            OBSERVER ID: <span className="text-white font-bold">07</span>
          </span>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: TEMPORAL ECHOES LIST                                   */}
        {/* ============================================================== */}
        {activeTab === 'echoes' && (
          <div className="mt-4 space-y-3 overflow-y-auto pr-1">
            {ORDERED_ECHO_IDS.map((echoId) => {
              const config = TEMPORAL_ECHOES[echoId];
              const isFound = discoveredEchoes.includes(echoId);

              return (
                <div
                  key={echoId}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    isFound
                      ? 'border-[#D4AF37]/40 bg-[#0C0F17] shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                      : 'border-white/5 bg-zinc-950/40 opacity-55'
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
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#EAB774]">
                          ARTIFACT: {config.artifactName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            chronosStore.openEchoMemory(echoId);
                            chronosStore.setActiveEchoModal(config);
                          }}
                          className="rounded border border-cyan-400/40 bg-cyan-950/30 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-300 transition hover:bg-cyan-500/20"
                        >
                          REPLAY MEMORY &rarr;
                        </button>
                      </div>
                      <p className="font-mono text-[11px] leading-relaxed text-zinc-300 border-l-2 border-[#D4AF37]/50 pl-2.5">
                        {config.clue}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 font-mono text-[10px] text-zinc-600 italic">
                      Explore {config.districtLabel} in {config.yearLabel} ({config.primaryEra}) to discover this temporal echo.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: NARRATIVE CHAPTERS                                     */}
        {/* ============================================================== */}
        {activeTab === 'chapters' && (
          <div className="mt-4 space-y-3 overflow-y-auto pr-1">
            {/* The Special Observatory Revelation Banner if Chapter 5 unlocked */}
            {isObservatoryUnlocked && (
              <div className="rounded-xl border border-cyan-400/60 bg-cyan-950/20 p-4 shadow-[0_0_25px_rgba(0,240,255,0.15)] text-left">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.2em] font-bold text-cyan-300 uppercase">
                    CENTRAL CHRONOS PARADOX REVEALED
                  </span>
                </div>
                <p className="mt-1.5 font-cinzel text-xs sm:text-sm font-semibold text-[#FFE8B5]">
                  "THE CORE DID NOT ORIGINATE IN THE PAST. IT WAS SENT BACKWARD FROM 2200 CE TO WARN AETERNUM BEFORE THE COLLAPSE."
                </p>
              </div>
            )}

            {/* The Final Warning / Paradox Gateway Banner if Chapter 6 unlocked */}
            {unlockedChapters.includes('ch-06-warning') && (
              <div className="rounded-xl border border-[#D4AF37]/70 bg-[#D4AF37]/10 p-4 shadow-[0_0_25px_rgba(212,175,55,0.2)] text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] tracking-[0.2em] font-bold text-[#FFE8B5] uppercase">
                    CHAPTER 06 // {isConvergenceReached ? 'FULL CONVERGENCE (5/5)' : `PARTIAL CONVERGENCE (${discoveredEchoes.length}/5)`}
                  </span>
                  <span className="font-mono text-[9px] text-[#D4AF37]">
                    {isConvergenceReached ? 'COMPLETE RECONSTRUCTED WARNING' : 'SHORTENED REVELATION'}
                  </span>
                </div>
                <p className="mt-1 font-cinzel text-sm sm:text-base font-bold text-[#FFE8B5]">
                  {isConvergenceReached
                    ? '"THE PAST REMEMBERS. THE FUTURE IS WAITING."'
                    : '"THE TIMELINE FRACTURE THREATENS RUNAWAY COLLAPSE."'}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-zinc-300">
                  {isConvergenceReached
                    ? 'All five chronological anomalies reconciled. The boundary between historical eras is ready for alignment.'
                    : `Partial archival record recovered (${discoveredEchoes.length}/5 Echoes). The Chronos Core is ready to initiate the primary finale.`}
                </p>

                <div className="mt-3 pt-2 border-t border-[#D4AF37]/30 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      chronosStore.setIsJournalOpen(false);
                      chronosStore.startParadoxFinale();
                    }}
                    className="px-4 py-1.5 rounded-full border border-[#D4AF37] bg-[#D4AF37]/25 hover:bg-[#D4AF37]/45 text-[#FFE8B5] font-cinzel text-[11px] font-bold tracking-widest transition shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  >
                    ⚡ INITIATE PARADOX FINALE &rarr;
                  </button>
                </div>
              </div>
            )}

            {ORDERED_CHAPTER_IDS.map((chapterId) => {
              const chapter = NARRATIVE_CHAPTERS[chapterId];
              const isUnlocked = unlockedChapters.includes(chapterId);

              // Use dynamic content for Chapter 06 to support shortened revelation
              const dynamicContent =
                chapterId === 'ch-06-warning'
                  ? getChapter06Content(discoveredEchoes.length)
                  : null;

              const transmissionLines =
                dynamicContent ? dynamicContent.transmissionLines : chapter.transmissionLines;
              const revelationText =
                dynamicContent ? dynamicContent.revelationText : chapter.revelationText;

              return (
                <div
                  key={chapterId}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    isUnlocked
                      ? 'border-cyan-500/30 bg-[#0A0D14]'
                      : 'border-white/5 bg-zinc-950/40 opacity-45'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-cyan-400">
                        {chapter.number}
                      </span>
                      <h3 className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider text-[#F5F3ED]">
                        {isUnlocked ? chapter.title : 'ENCRYPTED TIMELINE NODE'}
                      </h3>
                    </div>
                    <span className="font-mono text-[9px] text-zinc-400">
                      {chapter.districtLabel} &bull; {chapter.yearLabel}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <div className="mt-2.5 space-y-2">
                      <p className="font-serif text-xs sm:text-sm leading-relaxed text-zinc-300 italic">
                        {chapter.synopsis}
                      </p>
                      <div className="rounded border border-cyan-400/20 bg-black/40 p-2.5 font-mono text-[10px] sm:text-[11px] text-cyan-200 space-y-1">
                        {transmissionLines.map((line, idx) => (
                          <p key={`chap-line-${idx}`}>{line}</p>
                        ))}
                      </div>
                      <p className="font-mono text-[10px] text-[#EAB774]">
                        INSIGHT: {revelationText}
                      </p>

                      {chapterId === 'ch-06-warning' && (
                        <div className="mt-2 pt-2 border-t border-cyan-500/20 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              chronosStore.setIsJournalOpen(false);
                              chronosStore.startParadoxFinale();
                            }}
                            className="px-3.5 py-1 rounded-full border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-200 font-cinzel text-[10px] font-semibold tracking-wider transition"
                          >
                            LAUNCH PARADOX FINALE &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 font-mono text-[10px] text-zinc-600 italic">
                      Collect the corresponding temporal echo to decode this historical chapter.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-400">
            STATUS: REAL-TIME ARCHIVE SYNCHRONIZED
          </span>
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
  );
}
