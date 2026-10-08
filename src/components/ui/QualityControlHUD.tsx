'use client';

import { useState, useSyncExternalStore, useRef, useEffect } from 'react';
import { chronosStore, type QualityPreset } from '@/lib/chronosStore';
import { audioManager } from '@/lib/audioManager';

export function QualityControlHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const qualityPreset = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.qualityPreset,
    () => 'auto' as QualityPreset
  );

  const effectiveQuality = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.effectiveQuality,
    () => 'high' as const
  );

  // Close dropdown on outside click or Escape
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

  const presets: { id: QualityPreset; label: string; desc: string; badge: string }[] = [
    {
      id: 'auto',
      label: 'AUTO',
      desc: 'Adaptive hardware & FPS detection',
      badge: `DPR 1.0–1.5 (${effectiveQuality.toUpperCase()})`,
    },
    {
      id: 'high',
      label: 'HIGH',
      desc: 'Full fidelity, DPR 2.0, dynamic shadows',
      badge: '360 Embers · 1024 Shadows',
    },
    {
      id: 'medium',
      label: 'MEDIUM',
      desc: 'Balanced performance, DPR 1.5, soft lighting',
      badge: '200 Embers · 512 Shadows',
    },
    {
      id: 'low',
      label: 'LOW',
      desc: 'Maximum frame rate, DPR 1.0, battery saver',
      badge: '80 Embers · Unshadowed',
    },
  ];

  const getPillLabel = () => {
    if (qualityPreset === 'auto') {
      return `AUTO (${effectiveQuality.slice(0, 3).toUpperCase()})`;
    }
    return qualityPreset.toUpperCase();
  };

  const getDotColor = () => {
    const eff = qualityPreset === 'auto' ? effectiveQuality : qualityPreset;
    switch (eff) {
      case 'high':
        return 'bg-amber-400 shadow-[0_0_8px_#D4AF37]';
      case 'medium':
        return 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]';
      case 'low':
      default:
        return 'bg-emerald-400 shadow-[0_0_8px_#10B981]';
    }
  };

  return (
    <div className="relative inline-block pointer-events-auto select-none" ref={panelRef}>
      {/* Quality Trigger Pill */}
      <div className="flex items-center rounded-full border border-white/15 bg-[#08090D]/85 p-1 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            audioManager.playConfirm();
          }}
          onMouseEnter={() => audioManager.playHover()}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-zinc-300 hover:text-white transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          title="Graphics Quality Settings (Click)"
          aria-expanded={isOpen}
          aria-label={`Graphics Quality: ${getPillLabel()}. Click to change.`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${getDotColor()} animate-pulse`} />
          <span className="font-mono text-[9px] font-bold tracking-wider">
            {getPillLabel()}
          </span>
          <span className="text-[9px] text-zinc-500">{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Floating Quality Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/20 bg-[#0C0E14]/95 p-3.5 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <span className="font-cinzel text-xs font-bold tracking-wider text-[#F5F3ED]">
              GRAPHICS QUALITY
            </span>
            <span className="font-mono text-[9px] text-[#D4AF37] uppercase">
              {effectiveQuality} ACTIVE
            </span>
          </div>

          <div className="space-y-1.5">
            {presets.map((p) => {
              const isSelected = qualityPreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onMouseEnter={() => audioManager.playHover()}
                  onClick={() => {
                    audioManager.playConfirm();
                    chronosStore.setQualityPreset(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left rounded-xl p-2 transition-all flex flex-col gap-0.5 border ${
                    isSelected
                      ? 'border-[#D4AF37]/80 bg-[#D4AF37]/15 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                      : 'border-transparent bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-xs font-bold tracking-wider text-[#F5F3ED]">
                      {p.label}
                    </span>
                    {isSelected && (
                      <span className="font-mono text-[9px] text-[#FFE8B5] font-bold">
                        ACTIVE ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono leading-tight">
                    {p.desc}
                  </p>
                  <span className="text-[9px] text-[#D4AF37]/80 font-mono mt-0.5">
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
