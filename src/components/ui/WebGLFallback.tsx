'use client';

import Image from 'next/image';
import { PROJECT_STRINGS } from '@/lib/constants';

interface WebGLFallbackProps {
  onRetry?: () => void;
}

export function WebGLFallback({ onRetry }: WebGLFallbackProps) {
  return (
    <div
      role="region"
      aria-label="Chronos Chamber Static Experience"
      className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-[#08090D] px-6 text-center text-[#F5F3ED]"
      style={{
        backgroundImage: 'url(/chronos/intro-chamber-backdrop.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark chamber contrast tint */}
      <div className="absolute inset-0 bg-[#08090D]/85 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-lg space-y-6">
        {/* Glowing 2D Emblem Core */}
        <div className="relative mx-auto h-32 w-32 animate-pulse">
          <Image
            src="/chronos/chronos-core-emblem.svg"
            alt="Chronos Core Astrolabe Emblem"
            fill
            className="object-contain filter drop-shadow-[0_0_25px_rgba(234,183,116,0.6)]"
            priority
          />
        </div>

        <div className="space-y-2">
          <h2 className="font-cinzel text-3xl font-bold tracking-[0.2em] text-[#F5F3ED]">
            {PROJECT_STRINGS.title}
          </h2>
          <p className="font-syne text-sm font-semibold tracking-[0.3em] text-[#D4AF37] uppercase">
            {PROJECT_STRINGS.subtitle}
          </p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-[#192025]/80 p-4 font-mono text-xs text-zinc-300 backdrop-blur-md">
          <div className="text-[#EAB774] font-semibold uppercase tracking-wider mb-1">
            WebGL Acceleration Offline
          </div>
          <p className="text-zinc-400 leading-relaxed text-[11px]">
            3D hardware acceleration is currently disabled or unsupported on this device.
            The archival static chamber mode has been activated for full accessibility.
          </p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/15 px-6 py-2.5 font-mono text-xs tracking-widest text-[#F5F3ED] uppercase hover:bg-[#D4AF37]/25 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            Retry WebGL Context
          </button>
        )}
      </div>
    </div>
  );
}
