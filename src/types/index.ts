import type { CinematicShotId } from '@/lib/constants';

export interface CoreAnimationState {
  isActive: boolean;
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
  pixelRatio: number;
  enableShadows: boolean;
  reducedMotion: boolean;
}
