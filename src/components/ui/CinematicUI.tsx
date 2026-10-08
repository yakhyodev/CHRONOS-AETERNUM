'use client';

import Image from 'next/image';
import { PROJECT_STRINGS, type CinematicShotId, CINEMATIC_SHOTS } from '@/lib/constants';
import type { ActivationState } from '@/lib/chronosStore';
import { ShotNavigator } from './ShotNavigator';
import { AudioControlsHUD } from './AudioControlsHUD';
import { QualityControlHUD } from './QualityControlHUD';
import { audioManager } from '@/lib/audioManager';

interface CinematicUIProps {
  activationState: ActivationState;
  currentShot: CinematicShotId;
  onActivate: () => void;
  onSelectShot: (shotId: CinematicShotId) => void;
}

export function CinematicUI({
  activationState,
  currentShot,
  onActivate,
  onSelectShot,
}: CinematicUIProps) {
  const currentShotConfig = CINEMATIC_SHOTS.find((s) => s.id === currentShot) || CINEMATIC_SHOTS[0];
  const isBusy = activationState === 'activating' || activationState === 'deactivating';
  const isActive = activationState === 'active' || activationState === 'activating';

  const getButtonText = () => {
    switch (activationState) {
      case 'activating':
        return 'INITIALIZING...';
      case 'active':
        return PROJECT_STRINGS.ctaActive;
      case 'deactivating':
        return 'DEACTIVATING...';
      case 'idle':
      default:
        return PROJECT_STRINGS.ctaPrimary;
    }
  };

  return (
    <div className="pointer-events-none relative z-30 flex min-h-screen flex-col justify-between p-4 sm:p-10 md:p-14">
      {/* Top Bar with Minimal Chronos Brand and Telemetry */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-6 w-6">
            <Image
              src="/chronos/chronos-core-emblem.svg"
              alt="Chronos Core Emblem"
              fill
              className="object-contain filter drop-shadow-[0_0_8px_rgba(234,183,116,0.6)]"
              priority
            />
          </div>
          <span className="font-cinzel text-sm sm:text-base font-bold tracking-[0.25em] text-[#F5F3ED]">
            CHRONOS
          </span>
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37]/80 uppercase">
            Aeternum
          </span>
        </div>

        {/* Minimal telemetry / Shot status, Audio HUD & Quality HUD */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-[11px] tracking-widest text-zinc-400">
          <AudioControlsHUD />
          <QualityControlHUD />
          <div className="hidden sm:flex items-center gap-2 rounded border border-white/10 bg-[#08090D]/60 px-3 py-1 backdrop-blur-sm">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? 'bg-[#EAB774] animate-ping' : 'bg-emerald-400'
              }`}
            />
            <span className="text-[10px] uppercase text-[#F5F3ED]">
              {isActive ? 'CORE ACTIVE // 4.5X ROTATION' : 'CHAMBER IDLE // RESTING'}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Content — Left Aligned Matching Art Direction Board */}
      <div className="my-auto max-w-xl py-8">
        <div className="space-y-3">
          {/* Main Title: CHRONOS */}
          <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl font-bold tracking-[0.16em] text-[#F5F3ED] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            {PROJECT_STRINGS.title}
          </h1>

          {/* Subtitle: AETERNUM */}
          <div className="font-syne text-xl sm:text-2xl md:text-3xl font-semibold tracking-[0.38em] text-[#D4AF37] uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {PROJECT_STRINGS.subtitle}
          </div>

          {/* Tagline: TIME REMEMBERS EVERYTHING. */}
          <p className="pt-2 font-mono text-xs sm:text-sm tracking-[0.28em] text-[#F5F3ED]/80 uppercase">
            {PROJECT_STRINGS.tagline}
          </p>
        </div>

        {/* Primary Interactive CTA: INITIALIZE CHRONOS */}
        <div className="mt-8 sm:mt-10">
          <button
            type="button"
            disabled={isBusy}
            onMouseEnter={() => audioManager.playHover()}
            onClick={() => {
              audioManager.playConfirm();
              onActivate();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                audioManager.playConfirm();
                onActivate();
              }
            }}
            aria-label={isActive ? 'Chronos Core is Active (Click to Deactivate)' : 'Initialize Chronos Core'}
            className={`pointer-events-auto group relative inline-flex items-center gap-3.5 rounded-full border px-7 py-3.5 text-xs sm:text-sm font-mono tracking-[0.24em] uppercase transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#08090D] disabled:opacity-60 disabled:cursor-wait ${
              isActive
                ? 'border-[#EAB774] bg-[#EAB774]/20 text-[#FFE8B5] shadow-[0_0_30px_rgba(234,183,116,0.4)]'
                : 'border-[#D4AF37]/60 bg-[#08090D]/80 text-[#F5F3ED] hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]'
            }`}
          >
            {/* Core Icon Indicator */}
            <div className="relative h-4 w-4">
              <Image
                src="/chronos/chronos-core-emblem.svg"
                alt=""
                fill
                className={`object-contain transition-transform duration-700 ${
                  isActive ? 'rotate-180 scale-110' : 'group-hover:rotate-45'
                }`}
              />
            </div>

            <span className="font-semibold">{getButtonText()}</span>

            {/* Glowing Accent Pill */}
            <div
              className={`h-2 w-2 rounded-full transition-all duration-500 ${
                isActive
                  ? 'bg-[#FFE8B5] shadow-[0_0_10px_#FFE8B5] animate-pulse'
                  : 'bg-[#D4AF37]/50 group-hover:bg-[#EAB774]'
              }`}
            />
          </button>
        </div>

        {/* Current Shot Description Feedback */}
        <div className="mt-6 font-mono text-[11px] tracking-wider text-zinc-400">
          <span className="text-[#EAB774]">[{currentShotConfig.number}] {currentShotConfig.name}</span>
          <span className="mx-2 text-zinc-600">&bull;</span>
          <span className="text-zinc-500">{currentShotConfig.description}</span>
        </div>
      </div>

      {/* Bottom Bar: Scroll Indicator (Left) & Shot Navigator (Center/Right) */}
      <footer className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-t border-white/5 pt-6">
        {/* Scroll Prompt matching concept art */}
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-[#D4AF37]/80 uppercase">
          <div className="flex flex-col items-center gap-1">
            <span className="h-4 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent animate-pulse" />
          </div>
          <span>{PROJECT_STRINGS.scrollPrompt}</span>
        </div>

        {/* Storyboard Shot Navigator */}
        <ShotNavigator
          currentShot={currentShot}
          onSelectShot={onSelectShot}
          disabled={isBusy}
        />
      </footer>
    </div>
  );
}
