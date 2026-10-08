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
          <div className="mt-2.5 pt-2 border-t border-white/10 flex gap-1">
            <button
              type="button"
              onClick={onToggleActive}
              className="flex-1 rounded border border-[#D4AF37]/40 bg-[#D4AF37]/10 py-1 text-center text-[9px] text-[#F5F3ED]"
            >
              Toggle Activation
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
