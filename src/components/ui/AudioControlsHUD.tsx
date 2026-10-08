'use client';

import { useState, useSyncExternalStore, useRef, useEffect } from 'react';
import { audioManager } from '@/lib/audioManager';

export function AudioControlsHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isMuted = useSyncExternalStore(
    (cb) => audioManager.subscribe(cb),
    () => audioManager.isMuted,
    () => false
  );

  const masterVolume = useSyncExternalStore(
    (cb) => audioManager.subscribe(cb),
    () => audioManager.masterVolume,
    () => 0.8
  );

  const ambienceVolume = useSyncExternalStore(
    (cb) => audioManager.subscribe(cb),
    () => audioManager.ambienceVolume,
    () => 0.7
  );

  const sfxVolume = useSyncExternalStore(
    (cb) => audioManager.subscribe(cb),
    () => audioManager.sfxVolume,
    () => 0.85
  );

  const isUnlocked = useSyncExternalStore(
    (cb) => audioManager.subscribe(cb),
    () => audioManager.isUnlocked,
    () => false
  );

  // Close panel on outside click or escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const volumePct = Math.round(isMuted ? 0 : masterVolume * 100);

  return (
    <div className="relative inline-block pointer-events-auto select-none" ref={panelRef}>
      {/* Audio Toggle / Status Trigger Pill */}
      <div className="flex items-center rounded-full border border-white/15 bg-[#08090D]/85 p-1 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            audioManager.toggleMute();
            audioManager.playConfirm();
          }}
          onMouseEnter={() => audioManager.playHover()}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] ${
            isMuted
              ? 'text-zinc-500 hover:text-zinc-300'
              : 'text-[#FFE8B5] hover:text-white'
          }`}
          title={isMuted ? 'Unmute Audio (Click)' : 'Mute Audio (Click)'}
          aria-label={isMuted ? 'Audio Muted. Click to Unmute.' : 'Audio Active. Click to Mute.'}
        >
          {/* Animated sound wave bars */}
          <div className="flex items-end gap-0.5 h-3 w-3">
            <span
              className={`w-0.5 rounded-full transition-all duration-300 ${
                isMuted || !isUnlocked
                  ? 'h-1 bg-zinc-600'
                  : 'h-3 bg-[#D4AF37] animate-pulse'
              }`}
            />
            <span
              className={`w-0.5 rounded-full transition-all duration-300 ${
                isMuted || !isUnlocked
                  ? 'h-1.5 bg-zinc-600'
                  : 'h-2 bg-[#D4AF37] animate-ping'
              }`}
            />
            <span
              className={`w-0.5 rounded-full transition-all duration-300 ${
                isMuted || !isUnlocked
                  ? 'h-1 bg-zinc-600'
                  : 'h-2.5 bg-[#D4AF37] animate-pulse'
              }`}
            />
          </div>

          <span className="font-mono text-[9px] font-bold tracking-wider">
            {isMuted ? 'MUTED' : `${volumePct}%`}
          </span>
        </button>

        {/* Settings Expander Caret */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            audioManager.playConfirm();
          }}
          onMouseEnter={() => audioManager.playHover()}
          className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-[9px] transition"
          title="Audio Mixer Settings"
          aria-expanded={isOpen}
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {/* Floating Audio Mixer Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/20 bg-[#0C0E14]/95 p-4 shadow-2xl backdrop-blur-2xl z-50">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="font-cinzel text-xs font-bold tracking-wider text-[#F5F3ED]">
              CINEMATIC AUDIO
            </span>
            <span className="font-mono text-[9px] text-zinc-500 uppercase">
              {isUnlocked ? 'ONLINE' : 'PENDING GESTURE'}
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Master Volume */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 mb-1">
                <span>MASTER</span>
                <span className="text-[#D4AF37]">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => audioManager.setMasterVolume(parseFloat(e.target.value))}
                className="w-full accent-[#D4AF37] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                aria-label="Master Volume"
              />
            </div>

            {/* Ambience Volume */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 mb-1">
                <span>AMBIENCE</span>
                <span className="text-cyan-300">{Math.round(ambienceVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambienceVolume}
                onChange={(e) => audioManager.setAmbienceVolume(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                aria-label="Ambience Volume"
              />
            </div>

            {/* SFX / Interaction Volume */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 mb-1">
                <span>SFX & CUES</span>
                <span className="text-amber-300">{Math.round(sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => audioManager.setSfxVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                aria-label="SFX Volume"
              />
            </div>
          </div>

          {/* Quick Mute Toggle Button */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                audioManager.toggleMute();
                audioManager.playConfirm();
              }}
              className={`w-full py-1.5 rounded-lg font-cinzel text-[10px] font-semibold tracking-wider transition ${
                isMuted
                  ? 'border border-[#D4AF37] bg-[#D4AF37]/20 text-[#FFE8B5]'
                  : 'border border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isMuted ? 'ENABLE AUDIO' : 'MUTE ALL'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
