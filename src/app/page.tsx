'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/components/ui/Header';
import { Overlay } from '@/components/ui/Overlay';
import { useScrollPosition } from '@/hooks/useScrollPosition';

// Dynamically import Scene with SSR disabled to guarantee smooth WebGL canvas initialization
const Scene = dynamic(
  () => import('@/components/canvas/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#05050a]">
        <div className="w-8 h-8 rounded-full border border-amber-400/30 border-t-amber-400 animate-spin" />
      </div>
    ),
  }
);

export default function HomePage() {
  const scrollY = useScrollPosition();

  return (
    <main className="relative min-h-[160vh] bg-[#05050a] text-slate-100 overflow-x-hidden">
      {/* Cinematic Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.06),transparent_60%)]" />

      {/* Persistent Top Navigation Bar */}
      <Header />

      {/* Fixed Fullscreen 3D WebGL Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Scene />
      </div>

      {/* Scroll-aware Foreground Cinematic Overlay */}
      <div className="relative z-10">
        <Overlay scrollY={scrollY} />

        {/* Foundation Verification Panel */}
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 sm:px-12">
          <div className="rounded-xl border border-white/10 bg-[#070710]/80 p-8 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <h3 className="font-cinzel text-lg font-bold tracking-wider text-white">
                  FOUNDATION VERIFICATION
                </h3>
              </div>
              <span className="font-mono text-xs text-zinc-400">PHASE 01 COMPLIANT</span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 font-mono text-xs">
                <div className="text-zinc-500 uppercase">3D Engine</div>
                <div className="mt-1 text-sm font-semibold text-amber-300">Three.js + R3F + Drei</div>
                <div className="mt-1 text-[11px] text-zinc-400">WebGL canvas active with rotating temporal rings</div>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 font-mono text-xs">
                <div className="text-zinc-500 uppercase">Animation Core</div>
                <div className="mt-1 text-sm font-semibold text-cyan-300">GSAP + ScrollTrigger</div>
                <div className="mt-1 text-[11px] text-zinc-400">Registered and ready for scroll-driven timelines</div>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 font-mono text-xs">
                <div className="text-zinc-500 uppercase">Application Framework</div>
                <div className="mt-1 text-sm font-semibold text-white">Next.js App Router</div>
                <div className="mt-1 text-[11px] text-zinc-400">TypeScript + Tailwind CSS dark foundation</div>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 font-mono text-xs">
                <div className="text-zinc-500 uppercase">Next Milestone</div>
                <div className="mt-1 text-sm font-semibold text-zinc-300">Phase 02 Architecture</div>
                <div className="mt-1 text-[11px] text-zinc-400">Awaiting historical era specifications</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
