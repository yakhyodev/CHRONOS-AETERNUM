'use client';

import Image from 'next/image';
import { CITY_VIEWS, type CityViewId } from '@/types/phase03';

interface CityUIProps {
  currentView: CityViewId;
  onSelectView: (view: CityViewId) => void;
  onReturnToChamber: () => void;
}

export function CityUI({
  currentView,
  onSelectView,
  onReturnToChamber,
}: CityUIProps) {
  const activeConfig = CITY_VIEWS[currentView];

  return (
    <div className="relative h-full w-full pointer-events-none select-none">
      {/* 1. TOP HEADER BAR: Branding & Return CTA */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
        {/* Brand & Era Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8">
            <Image
              src="/chronos/chronos-core-emblem.svg"
              alt="Chronos Emblem"
              fill
              className="object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.25em] text-[#F5F3ED]">
              AETERNUM
            </h1>
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase">
              THE PRESENT &mdash; 2026
            </span>
          </div>
        </div>

        {/* Return to Chamber Button */}
        <button
          type="button"
          onClick={onReturnToChamber}
          className="group relative flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#08090D]/80 px-4 py-2 font-cinzel text-xs font-semibold tracking-[0.2em] text-[#F5F3ED] shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
            &larr;
          </span>
          <span>RETURN TO CHAMBER</span>
        </button>
      </header>

      {/* 2. BOTTOM CENTERED VIEW SELECTOR & TELEMETRY */}
      <footer className="absolute bottom-6 left-6 right-6 flex flex-col items-center gap-3 pointer-events-auto">
        {/* Active View Subtitle Description */}
        <div className="text-center">
          <div className="font-mono text-[11px] tracking-[0.25em] text-[#EAB774]">
            [{activeConfig.number}] {activeConfig.subtitle}
          </div>
          <div className="mt-0.5 text-[10px] text-zinc-400 font-mono tracking-wider max-w-md mx-auto hidden sm:block">
            {activeConfig.description}
          </div>
        </div>

        {/* Three View Selector Pills */}
        <nav
          aria-label="City View Selection"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-[#08090D]/90 p-1.5 shadow-2xl backdrop-blur-lg"
        >
          {(['grand-arrival', 'city-panorama', 'observatory-distance'] as CityViewId[]).map((vId) => {
            const config = CITY_VIEWS[vId];
            const isActive = currentView === vId;

            return (
              <button
                key={vId}
                type="button"
                onClick={() => onSelectView(vId)}
                className={`relative rounded-full px-4 py-1.5 font-cinzel text-xs tracking-[0.15em] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] ${
                  isActive
                    ? 'border border-[#D4AF37] bg-[#D4AF37]/25 font-bold text-[#FFE8B5] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-[#F5F3ED]'
                }`}
              >
                <span>{config.number} {config.name.toUpperCase()}</span>
              </button>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
