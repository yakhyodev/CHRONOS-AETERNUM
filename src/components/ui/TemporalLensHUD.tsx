'use client';

import { useSyncExternalStore } from 'react';
import {
  ORDERED_ERAS,
  TEMPORAL_ERAS,
  type HistoricalEraId,
} from '@/types/phase05';
import { TEMPORAL_LENS_LANDMARKS } from '@/types/phase07';
import { chronosStore } from '@/lib/chronosStore';

export function TemporalLensHUD() {
  const temporalLens = useSyncExternalStore(
    (cb) => chronosStore.subscribe(cb),
    () => chronosStore.temporalLens,
    () => ({ active: false, landmarkId: null, previewEra: 'the-kingdom' as HistoricalEraId })
  );

  if (!temporalLens.active || !temporalLens.landmarkId) return null;

  const landmarkConfig = TEMPORAL_LENS_LANDMARKS[temporalLens.landmarkId];
  const eraConfig = TEMPORAL_ERAS[temporalLens.previewEra] || TEMPORAL_ERAS['the-kingdom'];

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-auto">
      <div className="flex flex-col items-center rounded-2xl border border-cyan-400/50 bg-[#08090D]/90 px-6 py-3.5 shadow-[0_0_30px_rgba(0,240,255,0.25)] backdrop-blur-md max-w-lg text-center">
        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-300 font-bold uppercase">
            TEMPORAL LENS ACTIVE
          </span>
        </div>

        {/* Landmark & Target Era info */}
        <div className="mt-1 flex items-center gap-2">
          <h2 className="font-cinzel text-sm sm:text-base font-bold tracking-[0.15em] text-[#F5F3ED]">
            {landmarkConfig?.name || 'Landmark'}
          </h2>
          <span className="text-zinc-500">&bull;</span>
          <span className="font-mono text-xs font-bold text-cyan-400">
            {eraConfig.epochName} ({eraConfig.yearLabel})
          </span>
        </div>

        <p className="mt-0.5 font-mono text-[10px] text-zinc-400 max-w-sm">
          {landmarkConfig?.description}
        </p>

        {/* Era selector pills */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap justify-center">
          {ORDERED_ERAS.map((eraId) => {
            const cfg = TEMPORAL_ERAS[eraId];
            const isSelected = temporalLens.previewEra === eraId;

            return (
              <button
                key={eraId}
                type="button"
                onClick={() => chronosStore.setTemporalLensPreviewEra(eraId)}
                className={`rounded-full px-2.5 py-1 font-mono text-[9px] font-bold tracking-wider transition ${
                  isSelected
                    ? 'border border-cyan-300 bg-cyan-500/25 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                {cfg.year === -1200 ? '1200 BCE' : cfg.year}
              </button>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => chronosStore.closeTemporalLens()}
          className="mt-3 rounded-full border border-white/20 bg-white/5 px-4 py-1 font-cinzel text-[10px] font-semibold tracking-widest text-zinc-300 hover:bg-white/10 hover:text-white transition"
        >
          CLOSE LENS
        </button>
      </div>
    </div>
  );
}
