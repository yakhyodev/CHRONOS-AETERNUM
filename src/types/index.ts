import type { CinematicShotId } from '@/lib/constants';
import type { ActivationState, QualityPreset } from '@/lib/chronosStore';

export type { ActivationState, QualityPreset };

export interface CoreAnimationState {
  isActive: boolean;
  activationState: ActivationState;
  activationProgress: number; // 0 (idle) to 1 (fully active)
  pulseTime: number;
  rotationSpeedMultiplier: number;
  coreIntensity: number;
}

export interface CinematicCameraState {
  currentShot: CinematicShotId;
  transitionProgress: number;
  isTransitioning: boolean;
}

export interface PerformanceSettings {
  qualityPreset: QualityPreset;
  pixelRatio: number;
  enableShadows: boolean;
  reducedMotion: boolean;
}
