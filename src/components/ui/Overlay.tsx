'use client';

import { PROJECT_CONFIG } from '@/lib/constants';

interface OverlayProps {
  scrollY: number;
}

export function Overlay({ scrollY }: OverlayProps) {
  return (
    <div className="pointer-events-none relative z-10 flex min-h-screen flex-col justify-between px-6 pt-24 pb-12 sm:px-12">
      {/* Top telemetry */}
      <div className="flex justify-between items-start font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
        <div>
          <div>SECTOR: TEMPORAL_NEXUS</div>
          <div className="text-zinc-600">CANVAS: WEBGL_ACTIVE (THREE.JS + R3F)</div>
        </div>
        <div className="text-right">
          <div>SCROLL_OFFSET: {Math.round(scrollY)}PX</div>
          <div className="text-amber-400/80">CORE: FOUNDATION_ONLINE</div>
        </div>
      </div>

      {/* Center Cinematic Hero Typography */}
      <div className="my-auto py-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-amber-500/20 bg-amber-500/5 text-[11px] tracking-[0.3em] font-mono text-amber-300 uppercase">
          Phase 01 &bull; System Foundation
        </div>

        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.2em] text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.15)] uppercase">
          CHRONOS
        </h1>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent my-4" />
        <h2 className="font-syne text-lg sm:text-2xl font-medium tracking-[0.4em] text-zinc-300 uppercase">
          Aeternum
        </h2>

        <p className="mt-6 max-w-lg text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
          {PROJECT_CONFIG.subtitle}
        </p>

        <div className="mt-8 flex items-center gap-2 text-xs font-mono text-zinc-500 tracking-wider">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>DRAG TO ROTATE 3D CORE &bull; SCROLL TO EXPLORE FOUNDATION</span>
        </div>
      </div>

      {/* Bottom Footer Telemetry */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5 pt-6 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
        <div className="flex items-center gap-4">
          <span>COORDINATES: [00.000, 00.000, +06.000]</span>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <span className="hidden sm:inline">ENGINE: NEXT.JS + GSAP</span>
        </div>
        <div>
          <span>AWAITING PHASE 02 SPECIFICATION</span>
        </div>
      </div>
    </div>
  );
}
