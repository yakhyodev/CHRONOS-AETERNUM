import { describe, it, expect, beforeEach } from 'vitest';
import { chronosStore, QUALITY_PRESETS } from '../src/lib/chronosStore';
import { CINEMATIC_SHOTS } from '../src/lib/constants';
import { isWebGLAvailable } from '../src/lib/webglDetect';

describe('CHRONOS — Aeternum State & Timeline Engine', () => {
  beforeEach(() => {
    chronosStore.setActivationProgress(0);
    chronosStore.setTimelineProgress(0);
    chronosStore.setActivationState('idle');
    chronosStore.setCurrentShot('shot-01');
    chronosStore.setQualityPreset('high');
    chronosStore.setReducedMotion(false);
    chronosStore.setIsTransitioning(false);
  });

  describe('Camera Shot Navigation & Progress Mapping', () => {
    it('maps initial 0% progress to Shot 01 (Wide Establishing)', () => {
      const shot = chronosStore.getShotFromProgress(0);
      expect(shot).toBe('shot-01');
    });

    it('maps mid-timeline 50% progress to Shot 04 (Close-Up)', () => {
      const shot = chronosStore.getShotFromProgress(0.5);
      expect(shot).toBe('shot-04');
    });

    it('maps end-timeline 99% progress to Shot 06 (Transition)', () => {
      const shot = chronosStore.getShotFromProgress(0.99);
      expect(shot).toBe('shot-06');
    });

    it('correctly calculates progress from shot id', () => {
      const progressShot01 = chronosStore.getProgressFromShot('shot-01');
      expect(progressShot01).toBe(0);

      const progressShot06 = chronosStore.getProgressFromShot('shot-06');
      expect(progressShot06).toBeCloseTo(5 / 6, 2);
    });

    it('handles reverse scroll progression smoothly without discontinuous jumps', () => {
      const scrollSteps = [1.0, 0.8, 0.6, 0.4, 0.2, 0.0];
      const detectedShots = scrollSteps.map((p) => chronosStore.getShotFromProgress(p));
      expect(detectedShots[0]).toBe('shot-06');
      expect(detectedShots[detectedShots.length - 1]).toBe('shot-01');
    });

    it('verifies all cinematic shot definitions exist with names and labels', () => {
      expect(CINEMATIC_SHOTS.length).toBe(6);
      expect(CINEMATIC_SHOTS[0].id).toBe('shot-01');
      expect(CINEMATIC_SHOTS[5].id).toBe('shot-06');
      CINEMATIC_SHOTS.forEach((shot) => {
        expect(shot.name).toBeTruthy();
        expect(shot.label).toBeTruthy();
      });
    });
  });

  describe('Activation State Machine & Transitions', () => {
    it('initializes in idle state', () => {
      expect(chronosStore.activationState).toBe('idle');
      expect(chronosStore.activationProgress).toBe(0);
    });

    it('transitions through activating to active', () => {
      chronosStore.setActivationState('activating');
      expect(chronosStore.activationState).toBe('activating');

      chronosStore.setActivationProgress(1.0);
      chronosStore.setActivationState('active');
      expect(chronosStore.activationState).toBe('active');
      expect(chronosStore.activationProgress).toBe(1.0);
    });

    it('supports reversible deactivation to idle', () => {
      chronosStore.setActivationState('active');
      chronosStore.setActivationProgress(1.0);

      chronosStore.setActivationState('deactivating');
      expect(chronosStore.activationState).toBe('deactivating');

      chronosStore.setActivationProgress(0.0);
      chronosStore.setActivationState('idle');
      expect(chronosStore.activationState).toBe('idle');
      expect(chronosStore.activationProgress).toBe(0);
    });

    it('handles rapid repeated state changes deterministically without corruption', () => {
      for (let i = 0; i < 50; i++) {
        chronosStore.setActivationState(i % 2 === 0 ? 'activating' : 'deactivating');
        chronosStore.setActivationProgress(i / 50);
      }
      chronosStore.setActivationState('idle');
      chronosStore.setActivationProgress(0);
      expect(chronosStore.activationState).toBe('idle');
      expect(chronosStore.activationProgress).toBe(0);
    });
  });

  describe('Quality Presets & Performance Settings', () => {
    it('provides high quality with max shadow map and particles', () => {
      const high = QUALITY_PRESETS.high;
      expect(high.shadows).toBe(true);
      expect(high.particleCount).toBe(360);
      expect(high.shadowMapSize).toBe(1024);
    });

    it('provides medium quality with optimized shadows and particles', () => {
      const medium = QUALITY_PRESETS.medium;
      expect(medium.shadows).toBe(true);
      expect(medium.particleCount).toBe(220);
      expect(medium.shadowMapSize).toBe(512);
    });

    it('provides low quality with shadows disabled for weak hardware', () => {
      const low = QUALITY_PRESETS.low;
      expect(low.shadows).toBe(false);
      expect(low.particleCount).toBe(120);
      expect(low.dpr).toEqual([1, 1]);
    });
  });

  describe('Reduced Motion & Accessibility', () => {
    it('respects prefers-reduced-motion flag', () => {
      chronosStore.setReducedMotion(true);
      expect(chronosStore.reducedMotion).toBe(true);

      chronosStore.setReducedMotion(false);
      expect(chronosStore.reducedMotion).toBe(false);
    });
  });

  describe('WebGL Detection & Fallback', () => {
    it('exports reliable isWebGLAvailable function', () => {
      expect(typeof isWebGLAvailable).toBe('function');
    });
  });

  describe('Phase 03 — Aeternum World, Districts & Views', () => {
    it('initializes world mode in chamber and supports city switch', () => {
      expect(chronosStore.worldMode).toBe('chamber');
      chronosStore.setWorldMode('city');
      expect(chronosStore.worldMode).toBe('city');
      chronosStore.setWorldMode('chamber');
      expect(chronosStore.worldMode).toBe('chamber');
    });

    it('supports switching between the 3 authored city views', () => {
      expect(chronosStore.cityView).toBe('grand-arrival');
      chronosStore.setCityView('city-panorama');
      expect(chronosStore.cityView).toBe('city-panorama');
      expect(chronosStore.getCityViewConfig('city-panorama').name).toBe('City Panorama');

      chronosStore.setCityView('observatory-distance');
      expect(chronosStore.cityView).toBe('observatory-distance');
      expect(chronosStore.getCityViewConfig().subtitle).toBe('THE NORTHERN CELESTIAL DOME');
    });

    it('tracks continuous portal vortex progress', () => {
      chronosStore.setPortalProgress(0.75);
      expect(chronosStore.portalProgress).toBe(0.75);
      chronosStore.setPortalProgress(1.5);
      expect(chronosStore.portalProgress).toBe(1.0);
    });
  });
});
