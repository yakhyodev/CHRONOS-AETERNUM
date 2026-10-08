'use client';

import { useState } from 'react';
import type { CinematicShotId } from '@/lib/constants';
import type { ActivationState, QualityPreset } from '@/lib/chronosStore';
import { chronosStore } from '@/lib/chronosStore';

interface DebugPanelProps {
  currentShot: CinematicShotId;
  activationState: ActivationState;
  qualityPreset: QualityPreset;
  worldMode?: string;
  cityView?: string;
  onSelectShot: (shot: CinematicShotId) => void;
  onToggleActive: () => void;
  onSetQuality: (quality: QualityPreset) => void;
  onToggleWorld?: () => void;
}

export function DebugPanel({
  currentShot,
  activationState,
  qualityPreset,
  worldMode = 'chamber',
  cityView = 'grand-arrival',
  onSelectShot,
  onToggleActive,
  onSetQuality,
  onToggleWorld,
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // In production builds, this entire component renders nothing
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <aside
      aria-label="Development Debug Console"
      className="pointer-events-auto fixed bottom-3 right-3 z-50 font-mono text-[10px]"
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded border border-white/10 bg-[#08090D]/80 px-2 py-1 text-zinc-400 hover:text-white"
        >
          [DEBUG]
        </button>
      ) : (
        <div className="w-64 rounded border border-white/15 bg-[#08090D]/95 p-3 text-zinc-300 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-bold text-[#EAB774]">
            <span>PHASE 03 DEBUG</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white"
            >
              &times;
            </button>
          </div>
          <div className="mt-2 space-y-1 text-zinc-400">
            <div className="flex items-center justify-between">
              <span>World: <strong className="text-white uppercase">{worldMode}</strong></span>
              {onToggleWorld && (
                <button
                  type="button"
                  onClick={onToggleWorld}
                  className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] hover:text-white"
                >
                  Switch
                </button>
              )}
            </div>
            {worldMode === 'city' ? (
              <div>City View: <span className="text-[#FFE8B5]">{cityView}</span></div>
            ) : (
              <div className="flex items-center gap-1">
                <span>Shot:</span>
                {(['shot-01', 'shot-02', 'shot-03', 'shot-04', 'shot-05'] as const).map((s, idx) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onSelectShot(s)}
                    className={`px-1 py-0.5 rounded text-[9px] ${
                      currentShot === s
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-white/10 text-zinc-300 hover:text-white'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            )}
            <div>State: <span className="text-amber-300">{activationState.toUpperCase()}</span></div>
            <div>Continuous Progress: <span className="text-white">{(chronosStore.activationProgress * 100).toFixed(0)}%</span></div>
            <div className="flex items-center gap-1 pt-1">
              <span>Quality:</span>
              {(['high', 'medium', 'low'] as QualityPreset[]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onSetQuality(q)}
                  className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${
                    qualityPreset === q
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-white/10 text-zinc-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={onToggleActive}
              className="w-full rounded border border-[#D4AF37]/40 bg-[#D4AF37]/10 py-1 text-center text-[9px] text-[#F5F3ED]"
            >
              Toggle Activation
            </button>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => chronosStore.startParadoxFinale()}
                className="flex-1 rounded border border-amber-500/50 bg-amber-500/20 py-1 text-center text-[9px] text-amber-200"
              >
                Finale Beat 1
              </button>
              <button
                type="button"
                onClick={() => {
                  chronosStore.startParadoxFinale();
                  chronosStore.setParadoxSequenceIndex(2);
                }}
                className="flex-1 rounded border border-cyan-500/50 bg-cyan-500/20 py-1 text-center text-[9px] text-cyan-200"
              >
                Eras Collide
              </button>
              <button
                type="button"
                onClick={() => {
                  chronosStore.startParadoxFinale();
                  chronosStore.setParadoxSequenceIndex(4);
                }}
                className="flex-1 rounded border border-purple-500/50 bg-purple-500/20 py-1 text-center text-[9px] text-purple-200"
              >
                Choice
              </button>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  chronosStore.selectEnding('restore_time');
                  chronosStore.confirmEnding();
                }}
                className="flex-1 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/50 py-0.5 text-[8px] text-[#FFE8B5]"
              >
                Restore Time
              </button>
              <button
                type="button"
                onClick={() => {
                  chronosStore.selectEnding('explore_unknown');
                  chronosStore.confirmEnding();
                }}
                className="flex-1 rounded bg-cyan-500/20 border border-cyan-400/50 py-0.5 text-[8px] text-cyan-200"
              >
                Explore Future
              </button>
              <button
                type="button"
                onClick={() => chronosStore.resetFinale()}
                className="rounded bg-white/10 px-1 py-0.5 text-[8px] text-zinc-400"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
