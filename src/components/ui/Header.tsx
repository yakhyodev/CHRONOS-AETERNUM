'use client';

import { PROJECT_CONFIG } from '@/lib/constants';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between border-b border-white/5 bg-[#05050a]/60 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.8)] animate-pulse" />
        <span className="font-cinzel text-lg font-bold tracking-[0.25em] text-white">
          CHRONOS
        </span>
        <span className="text-xs uppercase tracking-[0.3em] text-amber-400/80 font-mono">
          Aeternum
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] uppercase tracking-wider text-zinc-300">
            {PROJECT_CONFIG.status}
          </span>
        </div>
        <span className="text-zinc-500">v{PROJECT_CONFIG.version}</span>
      </div>
    </header>
  );
}
