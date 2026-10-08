'use client';

import { useState } from 'react';
import type { CinematicShotId } from '@/lib/constants';

interface DebugPanelProps {
  currentShot: CinematicShotId;
  isActive: boolean;
  activationProgress: number;
  onSelectShot: (shot: CinematicShotId) => void;
  onToggleActive: () => void;
}

export function DebugPanel({
  currentShot,
  isActive,
  activationProgress,
  onSelectShot,
  onToggleActive,
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
        <div className="w-56 rounded border border-white/15 bg-[#08090D]/95 p-3 text-zinc-300 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-bold text-[#EAB774]">
            <span>PHASE 02 DEBUG</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white"
            >
              &times;
            </button>
          </div>
          <div className="mt-2 space-y-1 text-zinc-400">
            <div>Shot: <span className="text-white">{currentShot}</span></div>
            <div>Active: <span className="text-white">{isActive ? 'TRUE' : 'FALSE'}</span></div>
            <div>Progress: <span className="text-white">{(activationProgress * 100).toFixed(0)}%</span></div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/10 flex gap-1">
            <button
              type="button"
              onClick={onToggleActive}
              className="flex-1 rounded border border-[#D4AF37]/40 bg-[#D4AF37]/10 py-1 text-center text-[9px] text-[#F5F3ED]"
            >
              Toggle Active
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
