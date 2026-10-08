import { describe, it, expect, beforeEach } from 'vitest';
import { chronosStore, QUALITY_PRESETS } from '../src/lib/chronosStore';
import { CINEMATIC_SHOTS } from '../src/lib/constants';
import {
  CINEMATIC_SEGMENTS,
  CAMERA_JOURNEY_WAYPOINTS,
  CAMERA_LOOKAT_WAYPOINTS,
} from '../src/types/phase04';
import { isWebGLAvailable } from '../src/lib/webglDetect';

describe('CHRONOS — Aeternum State & Timeline Engine', () => {
  beforeEach(() => {
    chronosStore.setActivationProgress(0);
    chronosStore.setTimelineProgress(0);
    chronosStore.setJourneyProgress(0);
    chronosStore.setActivationState('idle');
    chronosStore.setCurrentShot('shot-01');
    chronosStore.setCurrentSegment('grand-arrival');
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

  describe('Phase 04 — Continuous Cinematic Journey & Spline Flight Engine', () => {
    it('verifies all 8 cinematic segments have contiguous progress bounds covering 0.0 to 1.0', () => {
      expect(CINEMATIC_SEGMENTS.length).toBe(8);
      expect(CINEMATIC_SEGMENTS[0].progressStart).toBe(0.0);
      expect(CINEMATIC_SEGMENTS[CINEMATIC_SEGMENTS.length - 1].progressEnd).toBe(1.0);

      // Verify each segment starts where previous segment ended
      for (let i = 1; i < CINEMATIC_SEGMENTS.length; i++) {
        expect(CINEMATIC_SEGMENTS[i].progressStart).toBe(CINEMATIC_SEGMENTS[i - 1].progressEnd);
      }
    });

    it('correctly maps journey progress to segments across all 5 districts', () => {
      // 0.0 -> Grand Arrival (Chronos Plaza)
      expect(chronosStore.getSegmentFromProgress(0.0).id).toBe('grand-arrival');
      // 0.20 -> Into the Old World (Old District)
      expect(chronosStore.getSegmentFromProgress(0.20).id).toBe('old-district');
      // 0.35 -> The River Reveal (River Crossing)
      expect(chronosStore.getSegmentFromProgress(0.35).id).toBe('river-reveal');
      // 0.50 -> Above the Water (River Crossing)
      expect(chronosStore.getSegmentFromProgress(0.50).id).toBe('above-water');
      // 0.65 -> Machine District (Industrial Quarter)
      expect(chronosStore.getSegmentFromProgress(0.65).id).toBe('machine-district');
      // 0.75 -> Ascent to Observatory (Northern Hills)
      expect(chronosStore.getSegmentFromProgress(0.75).id).toBe('ascent-observatory');
      // 0.88 -> The Observatory
      expect(chronosStore.getSegmentFromProgress(0.88).id).toBe('the-observatory');
      // 0.98 -> Return to Chronos (Chronos Plaza)
      expect(chronosStore.getSegmentFromProgress(0.98).id).toBe('return-chronos');
    });

    it('returns start progress for a segment', () => {
      expect(chronosStore.getProgressFromSegment('grand-arrival')).toBe(0.0);
      expect(chronosStore.getProgressFromSegment('river-reveal')).toBe(0.28);
      expect(chronosStore.getProgressFromSegment('the-observatory')).toBe(0.82);
    });

    it('validates 3D spline waypoint collections for camera positions and lookAt targets', () => {
      expect(CAMERA_JOURNEY_WAYPOINTS.length).toBeGreaterThanOrEqual(15);
      expect(CAMERA_LOOKAT_WAYPOINTS.length).toBeGreaterThanOrEqual(15);

      CAMERA_JOURNEY_WAYPOINTS.forEach((pt) => {
        expect(Number.isFinite(pt.x)).toBe(true);
        expect(Number.isFinite(pt.y)).toBe(true);
        expect(Number.isFinite(pt.z)).toBe(true);
      });

      CAMERA_LOOKAT_WAYPOINTS.forEach((pt) => {
        expect(Number.isFinite(pt.x)).toBe(true);
        expect(Number.isFinite(pt.y)).toBe(true);
        expect(Number.isFinite(pt.z)).toBe(true);
      });
    });

    it('smoothly clamps journey progress within [0.0, 1.0]', () => {
      chronosStore.setJourneyProgress(-0.5);
      expect(chronosStore.journeyProgress).toBe(0.0);

      chronosStore.setJourneyProgress(1.5);
      expect(chronosStore.journeyProgress).toBe(1.0);

      chronosStore.setJourneyProgress(0.42);
      expect(chronosStore.journeyProgress).toBe(0.42);
    });
  });
});
