import { CINEMATIC_SHOTS, type CinematicShotId } from './constants';
import { type CityViewId, CITY_VIEWS } from '../types/phase03';
import {
  type CinematicSegmentId,
  CINEMATIC_SEGMENTS,
  type CinematicSegmentConfig,
} from '../types/phase04';

export type WorldMode =
  | 'chamber'
  | 'transitioning_to_city'
  | 'city-journey'
  | 'city'
  | 'transitioning_to_chamber';
export type ActivationState = 'idle' | 'activating' | 'active' | 'deactivating';
export type QualityPreset = 'high' | 'medium' | 'low';

export interface QualityConfig {
  dpr: [number, number];
  shadows: boolean;
  particleCount: number;
  shadowMapSize: number;
}

export const QUALITY_PRESETS: Record<QualityPreset, QualityConfig> = {
  high: {
    dpr: [1, 2],
    shadows: true,
    particleCount: 360,
    shadowMapSize: 1024,
  },
  medium: {
    dpr: [1, 1.5],
    shadows: true,
    particleCount: 220,
    shadowMapSize: 512,
  },
  low: {
    dpr: [1, 1],
    shadows: false,
    particleCount: 120,
    shadowMapSize: 256,
  },
};

type Listener = () => void;

class ChronosStore {
  // Continuous 3D animation values (read by Three.js render loop without React re-renders)
  public activationProgress = 0; // 0.0 to 1.0
  public timelineProgress = 0;   // 0.0 to 1.0 for chamber scroll
  public portalProgress = 0;     // 0.0 to 1.0 for temporal vortex warp
  public journeyProgress = 0;    // 0.0 to 1.0 continuous spline progression for Aeternum flight
  
  // Discrete state (notified to React UI on state change)
  public worldMode: WorldMode = 'chamber';
  public cityView: CityViewId = 'grand-arrival';
  public currentSegment: CinematicSegmentId = 'grand-arrival';
  public activationState: ActivationState = 'idle';
  public currentShot: CinematicShotId = 'shot-01';
  public qualityPreset: QualityPreset = 'high';
  public reducedMotion = false;
  public isTransitioning = false;

  private listeners = new Set<Listener>();

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  public setActivationProgress(val: number): void {
    this.activationProgress = Math.max(0, Math.min(1, val));
  }

  public setTimelineProgress(val: number): void {
    this.timelineProgress = Math.max(0, Math.min(1, val));
  }

  public setPortalProgress(val: number): void {
    this.portalProgress = Math.max(0, Math.min(1, val));
  }

  public setWorldMode(mode: WorldMode): void {
    if (this.worldMode !== mode) {
      this.worldMode = mode;
      this.notify();
    }
  }

  public setCityView(view: CityViewId): void {
    if (this.cityView !== view) {
      this.cityView = view;
      this.notify();
    }
  }

  public setActivationState(state: ActivationState): void {
    if (this.activationState !== state) {
      this.activationState = state;
      this.notify();
    }
  }

  public setCurrentShot(shotId: CinematicShotId): void {
    if (this.currentShot !== shotId) {
      this.currentShot = shotId;
      this.notify();
    }
  }

  public setQualityPreset(preset: QualityPreset): void {
    if (this.qualityPreset !== preset) {
      this.qualityPreset = preset;
      this.notify();
    }
  }

  public setReducedMotion(reduced: boolean): void {
    if (this.reducedMotion !== reduced) {
      this.reducedMotion = reduced;
      this.notify();
    }
  }

  public setIsTransitioning(transitioning: boolean): void {
    if (this.isTransitioning !== transitioning) {
      this.isTransitioning = transitioning;
      this.notify();
    }
  }

  /**
   * Calculate shot index and id from a normalized timeline progress (0.0 - 1.0)
   */
  public getShotFromProgress(progress: number): CinematicShotId {
    const clamped = Math.max(0, Math.min(progress, 0.9999));
    const index = Math.floor(clamped * CINEMATIC_SHOTS.length);
    return CINEMATIC_SHOTS[index]?.id || 'shot-01';
  }

  /**
   * Calculate normalized timeline progress (0.0 - 1.0) from a shot id
   */
  public getProgressFromShot(shotId: CinematicShotId): number {
    const index = CINEMATIC_SHOTS.findIndex((s) => s.id === shotId);
    if (index === -1) return 0;
    // Position at the start of that shot's interval
    return index / CINEMATIC_SHOTS.length;
  }

  /**
   * Get configuration for a specific city view
   */
  public getCityViewConfig(viewId?: CityViewId) {
    return CITY_VIEWS[viewId || this.cityView];
  }

  public setJourneyProgress(val: number): void {
    this.journeyProgress = Math.max(0, Math.min(1, val));
  }

  public setCurrentSegment(segmentId: CinematicSegmentId): void {
    if (this.currentSegment !== segmentId) {
      this.currentSegment = segmentId;
      this.notify();
    }
  }

  /**
   * Derive current active segment configuration from continuous journey progress
   */
  public getSegmentFromProgress(progress: number): CinematicSegmentConfig {
    const clamped = Math.max(0, Math.min(progress, 0.9999));
    const found = CINEMATIC_SEGMENTS.find(
      (s) => clamped >= s.progressStart && clamped < s.progressEnd
    );
    return found || CINEMATIC_SEGMENTS[0];
  }

  /**
   * Get start progress for a segment
   */
  public getProgressFromSegment(segmentId: CinematicSegmentId): number {
    const seg = CINEMATIC_SEGMENTS.find((s) => s.id === segmentId);
    return seg ? seg.progressStart : 0;
  }
}

export const chronosStore = new ChronosStore();
