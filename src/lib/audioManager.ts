'use client';

/**
 * CHRONOS — Aeternum: Cinematic Audio Manager (Phase 10)
 * 
 * Reusable audio controller providing:
 * - Ambient crossfading (Chamber, City, Loading)
 * - Contextual one-shot SFX (Whoosh, Chime, Swell, Hover, Confirm)
 * - Autoplay unlocking after first user gesture
 * - Rate-limited / throttled microinteraction cues
 * - Master, Ambience, and SFX volume controls with mute toggling
 * - Safe localStorage persistence
 */

export type AmbientTrackId = 'chamber' | 'city' | 'loading' | 'none';
export type SfxCueId =
  | 'whoosh'
  | 'echo'
  | 'swell'
  | 'hover'
  | 'confirm'
  | 'loading_hum';

export interface AudioSettings {
  masterVolume: number;
  ambienceVolume: number;
  sfxVolume: number;
  isMuted: boolean;
}

type AudioListener = () => void;

class AudioManager {
  private readonly STORAGE_KEY = 'chronos_audio_settings';

  public isUnlocked = false;
  public isMuted = false;
  public masterVolume = 0.8;
  public ambienceVolume = 0.7;
  public sfxVolume = 0.85;

  private currentAmbientTrack: AmbientTrackId = 'none';
  private targetAmbientTrack: AmbientTrackId = 'none';

  // Ambient Audio Elements
  private chamberAudio: HTMLAudioElement | null = null;
  private cityAudio: HTMLAudioElement | null = null;
  private loadingAudio: HTMLAudioElement | null = null;

  // Cached SFX Audio Elements pools for zero-latency concurrent playback
  private sfxPool: Map<SfxCueId, HTMLAudioElement[]> = new Map();

  // Codec support & background state
  private canPlayOggOpus = false;
  private pausedDueToBackground: AmbientTrackId = 'none';

  // Throttling timestamps
  private lastHoverTime = 0;
  private lastWhooshTime = 0;
  private crossfadeInterval: NodeJS.Timeout | null = null;

  private listeners = new Set<AudioListener>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.canPlayOggOpus = this.checkOggSupport();
      this.loadSettings();
      this.setupGlobalUnlockListener();
      this.setupVisibilityListener();
    }
  }

  private checkOggSupport(): boolean {
    if (typeof Audio === 'undefined') return false;
    try {
      const a = new Audio();
      const can = a.canPlayType('audio/ogg; codecs="opus"');
      return can === 'probably' || can === 'maybe';
    } catch {
      return false;
    }
  }

  private setupVisibilityListener(): void {
    if (typeof document === 'undefined') return;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (this.currentAmbientTrack !== 'none') {
          this.pausedDueToBackground = this.currentAmbientTrack;
          if (this.chamberAudio) this.chamberAudio.pause();
          if (this.cityAudio) this.cityAudio.pause();
          if (this.loadingAudio) this.loadingAudio.pause();
        }
      } else if (document.visibilityState === 'visible') {
        if (this.pausedDueToBackground !== 'none' && this.isUnlocked && !this.isMuted) {
          const track = this.pausedDueToBackground;
          this.pausedDueToBackground = 'none';
          const audio =
            track === 'chamber'
              ? this.chamberAudio
              : track === 'city'
              ? this.cityAudio
              : track === 'loading'
              ? this.loadingAudio
              : null;
          if (audio) {
            audio.volume = this.getEffectiveAmbienceVolume();
            audio.play().catch(() => {});
          }
        }
      }
    });
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  private loadSettings(): void {
    try {
      const raw = window.localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.masterVolume === 'number') {
        this.masterVolume = Math.max(0, Math.min(1, parsed.masterVolume));
      }
      if (typeof parsed.ambienceVolume === 'number') {
        this.ambienceVolume = Math.max(0, Math.min(1, parsed.ambienceVolume));
      }
      if (typeof parsed.sfxVolume === 'number') {
        this.sfxVolume = Math.max(0, Math.min(1, parsed.sfxVolume));
      }
      if (typeof parsed.isMuted === 'boolean') {
        this.isMuted = parsed.isMuted;
      }
    } catch {
      // Safe fallback
    }
  }

  public saveSettings(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({
          masterVolume: this.masterVolume,
          ambienceVolume: this.ambienceVolume,
          sfxVolume: this.sfxVolume,
          isMuted: this.isMuted,
        })
      );
    } catch {
      // Safe fallback
    }
  }

  private setupGlobalUnlockListener(): void {
    const unlock = () => {
      if (this.isUnlocked) return;
      this.isUnlocked = true;
      this.initAudioElements();
      if (this.targetAmbientTrack !== 'none') {
        this.playAmbient(this.targetAmbientTrack, 1500);
      }
      this.notify();

      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
  }

  public unlockNow(): void {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    this.initAudioElements();
    if (this.targetAmbientTrack !== 'none') {
      this.playAmbient(this.targetAmbientTrack, 1000);
    }
    this.notify();
  }

  private getAudioSourceUrl(filenameNoExt: string): string {
    if (this.canPlayOggOpus) {
      return `/chronos/phase11/audio/${filenameNoExt}.ogg`;
    }
    return `/chronos/phase10/audio/${filenameNoExt}.wav`;
  }

  private createAudioElement(filenameNoExt: string, loop: boolean = false): HTMLAudioElement {
    const primaryUrl = this.getAudioSourceUrl(filenameNoExt);
    const audio = new Audio(primaryUrl);
    audio.loop = loop;
    audio.preload = 'auto';

    if (this.canPlayOggOpus) {
      audio.addEventListener(
        'error',
        () => {
          const fallbackUrl = `/chronos/phase10/audio/${filenameNoExt}.wav`;
          if (audio.src !== fallbackUrl) {
            audio.src = fallbackUrl;
            if (loop && !audio.paused) {
              audio.play().catch(() => {});
            }
          }
        },
        { once: true }
      );
    }

    return audio;
  }

  private initAudioElements(): void {
    if (typeof window === 'undefined') return;

    if (!this.chamberAudio) {
      this.chamberAudio = this.createAudioElement('01-chamber-drone', true);
    }
    if (!this.cityAudio) {
      this.cityAudio = this.createAudioElement('02-aeternum-city-ambience', true);
    }
    if (!this.loadingAudio) {
      this.loadingAudio = this.createAudioElement('08-loading-hum', true);
    }

    // Pre-populate SFX pool
    const sfxFiles: Record<SfxCueId, string> = {
      whoosh: '03-temporal-whoosh',
      echo: '04-echo-chime',
      swell: '05-finale-swell',
      hover: '06-ui-hover',
      confirm: '07-button-confirm',
      loading_hum: '08-loading-hum',
    };

    (Object.keys(sfxFiles) as SfxCueId[]).forEach((key) => {
      if (!this.sfxPool.has(key)) {
        const pool: HTMLAudioElement[] = [];
        for (let i = 0; i < 3; i++) {
          const a = this.createAudioElement(sfxFiles[key], false);
          pool.push(a);
        }
        this.sfxPool.set(key, pool);
      }
    });

    this.applyVolumes();
  }

  private getEffectiveAmbienceVolume(): number {
    return this.isMuted ? 0 : this.masterVolume * this.ambienceVolume;
  }

  private getEffectiveSfxVolume(): number {
    return this.isMuted ? 0 : this.masterVolume * this.sfxVolume;
  }

  public applyVolumes(): void {
    const ambVol = this.getEffectiveAmbienceVolume();

    if (this.chamberAudio) {
      this.chamberAudio.volume = this.currentAmbientTrack === 'chamber' ? ambVol : 0;
    }
    if (this.cityAudio) {
      this.cityAudio.volume = this.currentAmbientTrack === 'city' ? ambVol : 0;
    }
    if (this.loadingAudio) {
      this.loadingAudio.volume = this.currentAmbientTrack === 'loading' ? ambVol : 0;
    }
  }

  // =========================================================================
  // Ambient Sound Controller (Crossfade)
  // =========================================================================
  public playAmbient(track: AmbientTrackId, durationMs = 1200): void {
    this.targetAmbientTrack = track;
    if (!this.isUnlocked) return;

    if (this.currentAmbientTrack === track) return;

    if (this.crossfadeInterval) {
      clearInterval(this.crossfadeInterval);
      this.crossfadeInterval = null;
    }

    const previousTrack = this.currentAmbientTrack;
    this.currentAmbientTrack = track;

    const fromAudio =
      previousTrack === 'chamber'
        ? this.chamberAudio
        : previousTrack === 'city'
        ? this.cityAudio
        : previousTrack === 'loading'
        ? this.loadingAudio
        : null;

    const toAudio =
      track === 'chamber'
        ? this.chamberAudio
        : track === 'city'
        ? this.cityAudio
        : track === 'loading'
        ? this.loadingAudio
        : null;

    if (toAudio) {
      try {
        if (toAudio.paused) {
          toAudio.currentTime = 0;
          toAudio.play().catch(() => {});
        }
      } catch {}
    }

    const maxVol = this.getEffectiveAmbienceVolume();
    const steps = 15;
    const stepDuration = durationMs / steps;
    let step = 0;

    this.crossfadeInterval = setInterval(() => {
      step++;
      const progress = step / steps;

      if (fromAudio) {
        fromAudio.volume = Math.max(0, maxVol * (1 - progress));
      }
      if (toAudio) {
        toAudio.volume = Math.min(maxVol, maxVol * progress);
      }

      if (step >= steps) {
        if (this.crossfadeInterval) {
          clearInterval(this.crossfadeInterval);
          this.crossfadeInterval = null;
        }
        if (fromAudio) {
          fromAudio.volume = 0;
          fromAudio.pause();
        }
        if (toAudio) {
          toAudio.volume = maxVol;
        }
      }
    }, stepDuration);

    this.notify();
  }

  // =========================================================================
  // Context-Sensitive SFX Cues
  // =========================================================================
  public playSfx(cue: SfxCueId, volumeScale = 1.0): void {
    if (!this.isUnlocked || this.isMuted) return;

    const pool = this.sfxPool.get(cue);
    if (!pool || pool.length === 0) return;

    // Pick an idle or earliest audio element
    let el = pool.find((a) => a.paused);
    if (!el) {
      el = pool[0];
    }

    try {
      el.currentTime = 0;
      el.volume = Math.max(0, Math.min(1, this.getEffectiveSfxVolume() * volumeScale));
      el.play().catch(() => {});
    } catch {}
  }

  public playHover(): void {
    const now = Date.now();
    if (now - this.lastHoverTime < 120) return; // Rate-limit rapid hovers
    this.lastHoverTime = now;
    this.playSfx('hover', 0.45);
  }

  public playConfirm(): void {
    this.playSfx('confirm', 0.85);
  }

  public playWhoosh(): void {
    const now = Date.now();
    if (now - this.lastWhooshTime < 350) return; // Rate-limit continuous scrub sweeps
    this.lastWhooshTime = now;
    this.playSfx('whoosh', 0.75);
  }

  public playEcho(): void {
    this.playSfx('echo', 0.9);
  }

  public playFinaleSwell(): void {
    this.playSfx('swell', 1.0);
  }

  // =========================================================================
  // Volume & Mute Controls
  // =========================================================================
  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (!this.isUnlocked) {
      this.unlockNow();
    }
    this.applyVolumes();
    this.saveSettings();
    this.notify();
  }

  public setMasterVolume(val: number): void {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterVolume > 0 && this.isMuted) {
      this.isMuted = false;
    }
    this.applyVolumes();
    this.saveSettings();
    this.notify();
  }

  public setAmbienceVolume(val: number): void {
    this.ambienceVolume = Math.max(0, Math.min(1, val));
    this.applyVolumes();
    this.saveSettings();
    this.notify();
  }

  public setSfxVolume(val: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    this.saveSettings();
    this.notify();
  }

  public getCurrentTrack(): AmbientTrackId {
    return this.currentAmbientTrack;
  }
}

export const audioManager = new AudioManager();
