'use client';

import { CINEMATIC_SHOTS, type CinematicShotId } from '@/lib/constants';

interface ShotNavigatorProps {
  currentShot: CinematicShotId;
  onSelectShot: (shotId: CinematicShotId) => void;
  disabled?: boolean;
}

export function ShotNavigator({
  currentShot,
  onSelectShot,
  disabled = false,
}: ShotNavigatorProps) {
  return (
    <nav
      aria-label="Cinematic Camera Sequence"
      className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-[#08090D]/80 px-3 py-2 backdrop-blur-md shadow-2xl"
    >
      <span className="hidden md:inline mr-2 font-mono text-[10px] tracking-widest text-[#EAB774]/70 uppercase">
        Camera Sequence:
      </span>
      {CINEMATIC_SHOTS.map((shot) => {
        const isSelected = shot.id === currentShot;
        return (
          <button
            key={shot.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectShot(shot.id)}
            aria-label={`Select shot ${shot.number}: ${shot.name}`}
            aria-pressed={isSelected}
            className={`group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono transition-all duration-300 disabled:opacity-40 ${
              isSelected
                ? 'border border-[#D4AF37]/50 bg-[#D4AF37]/15 text-[#F5F3ED] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                : 'border border-transparent text-zinc-400 hover:border-white/10 hover:text-zinc-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                isSelected
                  ? 'bg-[#EAB774] shadow-[0_0_6px_#EAB774]'
                  : 'bg-zinc-600 group-hover:bg-zinc-400'
              }`}
            />
            <span className="text-[11px] font-semibold">{shot.number}</span>
            <span className="hidden lg:inline text-[10px] uppercase tracking-wider text-zinc-400">
              {shot.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
