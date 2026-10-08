'use client';

import Image from 'next/image';

interface CinematicLoadingScreenProps {
  statusMessage?: string;
}

export function CinematicLoadingScreen({
  statusMessage = 'SYNCHRONIZING TEMPORAL MATRIX...',
}: CinematicLoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090D] select-none pointer-events-auto"
    >
      {/* Background ambient radial glow */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Central Emblem & Pulsing Ring */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
        <div className="absolute h-28 w-28 rounded-full border border-cyan-400/20 border-b-cyan-400 animate-spin [animation-duration:3s]" />
        <div className="relative h-14 w-14">
          <Image
            src="/chronos/chronos-core-emblem.svg"
            alt="Chronos Core Emblem"
            fill
            className="object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
            priority
          />
        </div>
      </div>

      {/* Cinematic Brand Typography */}
      <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.3em] text-[#F5F3ED] mb-2 text-center">
        CHRONOS <span className="text-[#D4AF37]">&bull;</span> AETERNUM
      </h1>

      <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-[#FFE8B5]/80 uppercase">
        {statusMessage}
      </span>
    </div>
  );
}
