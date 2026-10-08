import { describe, it, expect, beforeEach } from 'vitest';
import { chronosStore, QUALITY_PRESETS } from '../src/lib/chronosStore';
import { CINEMATIC_SHOTS } from '../src/lib/constants';
import {
  CINEMATIC_SEGMENTS,
  CAMERA_JOURNEY_WAYPOINTS,
  CAMERA_LOOKAT_WAYPOINTS,
} from '../src/types/phase04';
import {
  TEMPORAL_ERAS,
  ORDERED_ERAS,
  getEraFromTimelinePosition,
  getTimelineStopFromEra,
} from '../src/types/phase05';
import { isWebGLAvailable } from '../src/lib/webglDetect';
import { getChapter06Content } from '../src/types/phase08';
import { PARADOX_SEQUENCES, ENDINGS_CONFIG } from '../src/types/phase09';

describe('CHRONOS — Aeternum State & Timeline Engine', () => {
  beforeEach(() => {
    chronosStore.setActivationProgress(0);
    chronosStore.setTimelineProgress(0);
    chronosStore.setJourneyProgress(0);
    chronosStore.setActivationState('idle');
    chronosStore.setCurrentShot('shot-01');
    chronosStore.setCurrentSegment('grand-arrival');
    chronosStore.setActiveEra('the-present');
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
      expect(chronosStore.getSegmentFromProgress(0.0).id).toBe('grand-arrival');
      expect(chronosStore.getSegmentFromProgress(0.20).id).toBe('old-district');
      expect(chronosStore.getSegmentFromProgress(0.35).id).toBe('river-reveal');
      expect(chronosStore.getSegmentFromProgress(0.50).id).toBe('above-water');
      expect(chronosStore.getSegmentFromProgress(0.65).id).toBe('machine-district');
      expect(chronosStore.getSegmentFromProgress(0.75).id).toBe('ascent-observatory');
      expect(chronosStore.getSegmentFromProgress(0.88).id).toBe('the-observatory');
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

  describe('Phase 05 — Temporal Engine & Five Historical Eras', () => {
    it('defines all 5 official historical eras with canonical years and atmosphere', () => {
      expect(ORDERED_ERAS.length).toBe(5);
      expect(ORDERED_ERAS).toEqual([
        'the-origin',
        'the-kingdom',
        'the-machine',
        'the-present',
        'the-next-age',
      ]);

      expect(TEMPORAL_ERAS['the-origin'].year).toBe(-1200);
      expect(TEMPORAL_ERAS['the-kingdom'].year).toBe(1450);
      expect(TEMPORAL_ERAS['the-machine'].year).toBe(1890);
      expect(TEMPORAL_ERAS['the-present'].year).toBe(2026);
      expect(TEMPORAL_ERAS['the-next-age'].year).toBe(2200);

      ORDERED_ERAS.forEach((eId) => {
        const config = TEMPORAL_ERAS[eId];
        expect(config.landmarkTitle).toBeTruthy();
        expect(config.landmarkDescription).toBeTruthy();
        expect(config.atmosphere.skyColor).toBeTruthy();
        expect(config.atmosphere.sunColor).toBeTruthy();
        expect(config.atmosphere.fogColor).toBeTruthy();
        expect(config.atmosphere.fogDensity).toBeGreaterThan(0);
      });
    });

    it('verifies normalized timeline stops are evenly spaced from 0.0 to 1.0', () => {
      expect(getTimelineStopFromEra('the-origin')).toBe(0.0);
      expect(getTimelineStopFromEra('the-kingdom')).toBe(0.25);
      expect(getTimelineStopFromEra('the-machine')).toBe(0.50);
      expect(getTimelineStopFromEra('the-present')).toBe(0.75);
      expect(getTimelineStopFromEra('the-next-age')).toBe(1.0);
    });

    it('correctly maps continuous timeline positions to closest historical era', () => {
      expect(getEraFromTimelinePosition(0.0)).toBe('the-origin');
      expect(getEraFromTimelinePosition(0.10)).toBe('the-origin');
      expect(getEraFromTimelinePosition(0.25)).toBe('the-kingdom');
      expect(getEraFromTimelinePosition(0.50)).toBe('the-machine');
      expect(getEraFromTimelinePosition(0.75)).toBe('the-present');
      expect(getEraFromTimelinePosition(0.95)).toBe('the-next-age');
      expect(getEraFromTimelinePosition(1.0)).toBe('the-next-age');
    });

    it('supports direct era selection and timeline position synchronization', () => {
      chronosStore.setActiveEra('the-kingdom');
      expect(chronosStore.activeEra).toBe('the-kingdom');
      expect(chronosStore.timelinePosition).toBe(0.25);

      chronosStore.setActiveEra('the-origin');
      expect(chronosStore.activeEra).toBe('the-origin');
      expect(chronosStore.timelinePosition).toBe(0.0);

      chronosStore.setActiveEra('the-next-age');
      expect(chronosStore.activeEra).toBe('the-next-age');
      expect(chronosStore.timelinePosition).toBe(1.0);
    });

    it('supports forward and reverse era navigation stepping', () => {
      chronosStore.setActiveEra('the-origin');
      chronosStore.navigateEra('next');
      expect(chronosStore.activeEra).toBe('the-kingdom');

      chronosStore.navigateEra('next');
      expect(chronosStore.activeEra).toBe('the-machine');

      chronosStore.navigateEra('next');
      expect(chronosStore.activeEra).toBe('the-present');

      chronosStore.navigateEra('next');
      expect(chronosStore.activeEra).toBe('the-next-age');

      // Clamped at end
      chronosStore.navigateEra('next');
      expect(chronosStore.activeEra).toBe('the-next-age');

      // Reverse navigation
      chronosStore.navigateEra('prev');
      expect(chronosStore.activeEra).toBe('the-present');

      chronosStore.navigateEra('prev');
      expect(chronosStore.activeEra).toBe('the-machine');
    });

    it('preserves camera journey progress independently when era changes', () => {
      // Simulate user at 65% through the city flight in 2026
      chronosStore.setJourneyProgress(0.65);
      chronosStore.setCurrentSegment('machine-district');
      expect(chronosStore.journeyProgress).toBe(0.65);

      // Travel back to 1450 CE
      chronosStore.setActiveEra('the-kingdom');
      expect(chronosStore.activeEra).toBe('the-kingdom');
      // Verify camera flight position is completely undisturbed
      expect(chronosStore.journeyProgress).toBe(0.65);
      expect(chronosStore.currentSegment).toBe('machine-district');

      // Travel to 1200 BCE
      chronosStore.setActiveEra('the-origin');
      expect(chronosStore.activeEra).toBe('the-origin');
      expect(chronosStore.journeyProgress).toBe(0.65);
    });

    it('handles rapid repeated era transitions stably without corruption', () => {
      for (let i = 0; i < 40; i++) {
        const era = ORDERED_ERAS[i % 5];
        chronosStore.setActiveEra(era);
      }
      chronosStore.setActiveEra('the-present');
      expect(chronosStore.activeEra).toBe('the-present');
      expect(chronosStore.timelinePosition).toBe(0.75);
    });
  });

  describe('Phase 06 — Time Morph & Continuous Environment Evolution', () => {
    it('calculates exact era intervals and blend factors across continuous timeline', async () => {
      const { getTemporalMorphState } = await import('../src/types/phase06');

      // Test Origin Anchor (t = 0.0)
      const originState = getTemporalMorphState(0.0);
      expect(originState.eraA).toBe('the-origin');
      expect(originState.eraB).toBe('the-kingdom');
      expect(originState.blendFactor).toBe(0.0);
      expect(originState.yearDisplay).toBe('1200 BCE');
      expect(originState.interpolatedYear).toBe(-1200);

      // Test midpoint between 1200 BCE and 1450 CE (t = 0.125)
      const bronzeMedievalState = getTemporalMorphState(0.125);
      expect(bronzeMedievalState.eraA).toBe('the-origin');
      expect(bronzeMedievalState.eraB).toBe('the-kingdom');
      expect(bronzeMedievalState.blendFactor).toBeCloseTo(0.5, 3);
      expect(bronzeMedievalState.interpolatedYear).toBe(125); // -1200 + 0.5 * 2650 = 125 CE
      expect(bronzeMedievalState.yearDisplay).toBe('125 CE');

      // Test Kingdom Anchor (t = 0.25)
      const kingdomState = getTemporalMorphState(0.25);
      expect(kingdomState.eraA).toBe('the-kingdom');
      expect(kingdomState.blendFactor).toBe(0.0);
      expect(kingdomState.yearDisplay).toBe('1450 CE');
      expect(kingdomState.interpolatedYear).toBe(1450);

      // Test midpoint between 1450 CE and 1890 CE (t = 0.375)
      const renaissanceVictorianState = getTemporalMorphState(0.375);
      expect(renaissanceVictorianState.eraA).toBe('the-kingdom');
      expect(renaissanceVictorianState.eraB).toBe('the-machine');
      expect(renaissanceVictorianState.blendFactor).toBeCloseTo(0.5, 3);
      expect(renaissanceVictorianState.interpolatedYear).toBe(1670); // 1450 + 0.5 * 440 = 1670 CE
      expect(renaissanceVictorianState.yearDisplay).toBe('1670 CE');

      // Test Machine Anchor (t = 0.50)
      const machineState = getTemporalMorphState(0.50);
      expect(machineState.eraA).toBe('the-machine');
      expect(machineState.blendFactor).toBe(0.0);
      expect(machineState.yearDisplay).toBe('1890 CE');
      expect(machineState.interpolatedYear).toBe(1890);

      // Test Present Anchor (t = 0.75)
      const presentState = getTemporalMorphState(0.75);
      expect(presentState.eraA).toBe('the-present');
      expect(presentState.blendFactor).toBe(0.0);
      expect(presentState.yearDisplay).toBe('2026 CE');
      expect(presentState.interpolatedYear).toBe(2026);

      // Test midpoint between 2026 CE and 2200 CE (t = 0.875)
      const futureTransitionState = getTemporalMorphState(0.875);
      expect(futureTransitionState.eraA).toBe('the-present');
      expect(futureTransitionState.eraB).toBe('the-next-age');
      expect(futureTransitionState.blendFactor).toBeCloseTo(0.5, 3);
      expect(futureTransitionState.interpolatedYear).toBe(2113); // 2026 + 0.5 * 174 = 2113 CE
      expect(futureTransitionState.yearDisplay).toBe('2113 CE');

      // Test Next Age Anchor (t = 1.0)
      const nextAgeState = getTemporalMorphState(1.0);
      expect(nextAgeState.eraA).toBe('the-present');
      expect(nextAgeState.eraB).toBe('the-next-age');
      expect(nextAgeState.blendFactor).toBe(1.0);
      expect(nextAgeState.yearDisplay).toBe('2200 CE');
      expect(nextAgeState.interpolatedYear).toBe(2200);
    });

    it('smoothly interpolates atmosphere across historical timeline', async () => {
      const { getInterpolatedAtmosphere } = await import('../src/types/phase06');

      // Check t = 0.0 (The Origin)
      const originAtmo = getInterpolatedAtmosphere(0.0);
      expect(originAtmo.skyColor.toLowerCase()).toBe('#1a1410');
      expect(originAtmo.fogDensity).toBeCloseTo(0.012, 3);

      // Check t = 0.75 (The Present)
      const presentAtmo = getInterpolatedAtmosphere(0.75);
      expect(presentAtmo.skyColor.toLowerCase()).toBe('#211a16');
      expect(presentAtmo.fogDensity).toBeCloseTo(0.009, 3);

      // Check midpoint t = 0.375
      const midAtmo = getInterpolatedAtmosphere(0.375);
      expect(midAtmo.skyColor).toBeTruthy();
      expect(midAtmo.fogColor).toBeTruthy();
      expect(midAtmo.sunIntensity).toBeGreaterThan(0);
      expect(midAtmo.sunPosition).toHaveLength(3);
    });

    it('supports continuous scrubbing in store while preserving spatial stability', () => {
      chronosStore.setJourneyProgress(0.5); // Fixed camera at river
      chronosStore.setTimelinePosition(0.38);

      expect(chronosStore.timelinePosition).toBe(0.38);
      // Camera journey progress remains completely untouched
      expect(chronosStore.journeyProgress).toBe(0.5);

      const morph = chronosStore.getMorphState();
      expect(morph.eraA).toBe('the-kingdom');
      expect(morph.eraB).toBe('the-machine');
      expect(morph.yearDisplay).toContain('CE');
    });
  });

  describe('Phase 07 — Exploration, Temporal Lens & Echoes', () => {
    it('switches between Story Mode and Explore Mode cleanly without corrupting journey progress', () => {
      chronosStore.setJourneyProgress(0.65);
      chronosStore.setCurrentSegment('machine-district');

      // Enter explore mode
      chronosStore.setExperienceMode('explore');
      expect(chronosStore.experienceMode).toBe('explore');
      expect(chronosStore.cameraController).toBe('exploring');
      expect(chronosStore.lastStoryProgress).toBe(0.65);

      // Explore district change
      chronosStore.setExploreDistrict('observatory');
      expect(chronosStore.exploreDistrict).toBe('observatory');
      expect(chronosStore.cameraController).toBe('transitioning');

      // Return to story mode
      chronosStore.setExperienceMode('story');
      expect(chronosStore.experienceMode).toBe('story');
      expect(chronosStore.cameraController).toBe('cinematic');
      expect(chronosStore.journeyProgress).toBe(0.65);
      expect(chronosStore.currentSegment).toBe('machine-district');
    });

    it('verifies all 5 district explore anchors have valid bounded constraints', async () => {
      const { DISTRICT_EXPLORE_ANCHORS } = await import('../src/types/phase07');
      const districts = ['plaza', 'old-district', 'river', 'industry', 'observatory'] as const;

      districts.forEach((dId) => {
        const anchor = DISTRICT_EXPLORE_ANCHORS[dId];
        expect(anchor.id).toBe(dId);
        expect(anchor.name).toBeTruthy();
        expect(anchor.cameraPosition).toHaveLength(3);
        expect(anchor.targetPosition).toHaveLength(3);
        expect(anchor.minDistance).toBeGreaterThan(0);
        expect(anchor.maxDistance).toBeGreaterThan(anchor.minDistance);
        expect(anchor.minPolarAngle).toBeGreaterThan(0);
        expect(anchor.maxPolarAngle).toBeGreaterThan(anchor.minPolarAngle);
      });
    });

    it('manages Time Freeze state reversibly without affecting time position', () => {
      expect(chronosStore.isTimeFrozen).toBe(false);

      chronosStore.toggleTimeFreeze();
      expect(chronosStore.isTimeFrozen).toBe(true);

      chronosStore.toggleTimeFreeze();
      expect(chronosStore.isTimeFrozen).toBe(false);

      chronosStore.setIsTimeFrozen(true);
      expect(chronosStore.isTimeFrozen).toBe(true);
      chronosStore.setIsTimeFrozen(false);
      expect(chronosStore.isTimeFrozen).toBe(false);
    });

    it('activates and closes Temporal Lens without altering global activeEra', () => {
      chronosStore.setActiveEra('the-present');
      expect(chronosStore.activeEra).toBe('the-present');

      // Open lens on plaza tower previewing 1450 CE
      chronosStore.openTemporalLens('plaza-tower', 'the-kingdom');
      expect(chronosStore.temporalLens.active).toBe(true);
      expect(chronosStore.temporalLens.landmarkId).toBe('plaza-tower');
      expect(chronosStore.temporalLens.previewEra).toBe('the-kingdom');
      expect(chronosStore.cameraController).toBe('inspecting');

      // Crucial: Global activeEra must remain the-present
      expect(chronosStore.activeEra).toBe('the-present');

      // Switch preview era inside lens
      chronosStore.setTemporalLensPreviewEra('the-origin');
      expect(chronosStore.temporalLens.previewEra).toBe('the-origin');
      expect(chronosStore.activeEra).toBe('the-present');

      // Close lens
      chronosStore.closeTemporalLens();
      expect(chronosStore.temporalLens.active).toBe(false);
      expect(chronosStore.temporalLens.landmarkId).toBeNull();
      expect(chronosStore.activeEra).toBe('the-present');
    });

    it('verifies all 5 Temporal Echoes are configured across 5 districts and eras', async () => {
      const { TEMPORAL_ECHOES, ORDERED_ECHO_IDS } = await import('../src/types/phase07');
      expect(ORDERED_ECHO_IDS).toHaveLength(5);

      ORDERED_ECHO_IDS.forEach((id) => {
        const echo = TEMPORAL_ECHOES[id];
        expect(echo.id).toBe(id);
        expect(echo.name).toBeTruthy();
        expect(echo.artifactName).toBeTruthy();
        expect(echo.clue).toBeTruthy();
        expect(echo.position).toHaveLength(3);
        expect(echo.color).toBeTruthy();
      });
    });

    it('enforces that Temporal Echoes are only discoverable in their configured primaryEra', () => {
      chronosStore.clearDiscoveredEchoes();
      chronosStore.setActiveEra('the-present');
      expect(chronosStore.getDiscoveredEchoesCount()).toBe(0);

      // Attempting to discover Echo 01 (primaryEra: the-origin) while in the-present must fail
      chronosStore.discoverEcho('echo-01-mark');
      expect(chronosStore.getDiscoveredEchoesCount()).toBe(0);

      // Switch to the-origin (1200 BCE)
      chronosStore.setActiveEra('the-origin');
      chronosStore.discoverEcho('echo-01-mark');
      expect(chronosStore.getDiscoveredEchoesCount()).toBe(1);
      expect(chronosStore.activeEchoModal?.id).toBe('echo-01-mark');

      // Changing era must preserve already collected artifacts
      chronosStore.setActiveEra('the-kingdom');
      expect(chronosStore.getDiscoveredEchoesCount()).toBe(1);
      expect(chronosStore.discoveredEchoes.has('echo-01-mark')).toBe(true);

      // Discover Echo 02 in the-kingdom
      chronosStore.discoverEcho('echo-02-record');
      expect(chronosStore.getDiscoveredEchoesCount()).toBe(2);

      // Re-inspecting collected artifact in any era still opens the clue modal
      chronosStore.setActiveEra('the-next-age');
      chronosStore.discoverEcho('echo-01-mark');
      expect(chronosStore.activeEchoModal?.id).toBe('echo-01-mark');
      expect(chronosStore.getDiscoveredEchoesCount()).toBe(2);
    });

    it('validates coordinate consistency between anchors, landmarks, and echo positions', async () => {
      const { DISTRICT_EXPLORE_ANCHORS, TEMPORAL_LENS_LANDMARKS, TEMPORAL_ECHOES } = await import('../src/types/phase07');

      // Observatory consistency
      expect(DISTRICT_EXPLORE_ANCHORS.observatory.targetPosition[0]).toBe(40);
      expect(DISTRICT_EXPLORE_ANCHORS.observatory.targetPosition[2]).toBe(-230);
      expect(TEMPORAL_LENS_LANDMARKS['observatory-dome'].center[0]).toBe(40);
      expect(TEMPORAL_LENS_LANDMARKS['observatory-dome'].center[2]).toBe(-230);
      expect(TEMPORAL_ECHOES['echo-05-signal'].position[0]).toBe(40);
      expect(TEMPORAL_ECHOES['echo-05-signal'].position[2]).toBe(-220);

      // Industry consistency
      expect(DISTRICT_EXPLORE_ANCHORS.industry.targetPosition[0]).toBe(-70);
      expect(DISTRICT_EXPLORE_ANCHORS.industry.targetPosition[2]).toBe(-75);
      expect(TEMPORAL_ECHOES['echo-04-blueprint'].position[0]).toBe(-68);
      expect(TEMPORAL_ECHOES['echo-04-blueprint'].position[2]).toBe(-72);

      // Plaza consistency
      expect(TEMPORAL_LENS_LANDMARKS['plaza-tower'].center[0]).toBe(0);
      expect(TEMPORAL_LENS_LANDMARKS['plaza-tower'].center[2]).toBe(-124);
      expect(TEMPORAL_ECHOES['echo-01-mark'].position[0]).toBe(0);
      expect(TEMPORAL_ECHOES['echo-01-mark'].position[2]).toBe(-106);
    });

    it('verifies historical era and story progress remain stable when toggling explore mode', () => {
      chronosStore.setActiveEra('the-machine');
      chronosStore.setJourneyProgress(0.68);
      expect(chronosStore.activeEra).toBe('the-machine');
      expect(chronosStore.journeyProgress).toBe(0.68);

      // Enter explore mode
      chronosStore.setExperienceMode('explore');
      expect(chronosStore.experienceMode).toBe('explore');
      // Era must remain stable
      expect(chronosStore.activeEra).toBe('the-machine');

      // Return to story mode
      chronosStore.setExperienceMode('story');
      expect(chronosStore.experienceMode).toBe('story');
      expect(chronosStore.activeEra).toBe('the-machine');
      expect(chronosStore.journeyProgress).toBe(0.68);
    });
  });

  describe('Phase 08 — Observer 07, Narrative Chapters & Temporal Memories', () => {
    it('defines all 6 narrative chapters with locations, years, and transmissions', async () => {
      const { NARRATIVE_CHAPTERS, ORDERED_CHAPTER_IDS } = await import('../src/types/phase08');
      expect(ORDERED_CHAPTER_IDS).toHaveLength(6);
      expect(ORDERED_CHAPTER_IDS).toEqual([
        'ch-01-awakening',
        'ch-02-first-memory',
        'ch-03-pattern',
        'ch-04-experiment',
        'ch-05-revelation',
        'ch-06-warning',
      ]);

      ORDERED_CHAPTER_IDS.forEach((chapId) => {
        const chap = NARRATIVE_CHAPTERS[chapId];
        expect(chap.id).toBe(chapId);
        expect(chap.title).toBeTruthy();
        expect(chap.subtitle).toBeTruthy();
        expect(chap.district).toBeTruthy();
        expect(chap.districtLabel).toBeTruthy();
        expect(chap.yearLabel).toBeTruthy();
        expect(chap.synopsis).toBeTruthy();
        expect(chap.transmissionLines.length).toBeGreaterThan(0);
        expect(chap.revelationText).toBeTruthy();
      });
    });

    it('defines narrative memory overlays for all 5 Temporal Echoes', async () => {
      const { ECHO_NARRATIVE_MEMORIES } = await import('../src/types/phase08');
      const { ORDERED_ECHO_IDS } = await import('../src/types/phase07');

      ORDERED_ECHO_IDS.forEach((echoId) => {
        const mem = ECHO_NARRATIVE_MEMORIES[echoId];
        expect(mem).toBeDefined();
        expect(mem.echoId).toBe(echoId);
        expect(mem.chapterId).toBeTruthy();
        expect(mem.artifactClassification).toBeTruthy();
        expect(mem.archivalMemory).toBeTruthy();
        expect(mem.observerInsight).toBeTruthy();
        expect(mem.revelationQuote).toBeTruthy();
      });
    });

    it('tracks Observer 07 identity and default chapter unlock', () => {
      expect(chronosStore.observerId).toBe('OBSERVER 07');
      expect(chronosStore.unlockedChapters.has('ch-01-awakening')).toBe(true);
    });

    it('progressively unlocks chapters and reveals Chapter 05 & Chapter 06 based on recovered Echoes', () => {
      chronosStore.clearDiscoveredEchoes();
      expect(chronosStore.unlockedChaptersList).toEqual(['ch-01-awakening']);

      // Discover Echo 01 in the-origin -> Unlocks Chapter 02
      chronosStore.setActiveEra('the-origin');
      chronosStore.discoverEcho('echo-01-mark');
      expect(chronosStore.unlockedChapters.has('ch-02-first-memory')).toBe(true);
      expect(chronosStore.activeEchoMemory?.echoId).toBe('echo-01-mark');

      // Discover Echo 02 in the-kingdom -> Unlocks Chapter 03
      chronosStore.setActiveEra('the-kingdom');
      chronosStore.discoverEcho('echo-02-record');
      expect(chronosStore.unlockedChapters.has('ch-03-pattern')).toBe(true);

      // Discover Echo 04 in the-present -> Unlocks Chapter 04
      chronosStore.setActiveEra('the-present');
      chronosStore.discoverEcho('echo-04-blueprint');
      expect(chronosStore.unlockedChapters.has('ch-04-experiment')).toBe(true);

      // Discover Echo 05 in the-next-age -> Unlocks Chapter 05 (The Revelation)
      chronosStore.setActiveEra('the-next-age');
      chronosStore.discoverEcho('echo-05-signal');
      expect(chronosStore.unlockedChapters.has('ch-05-revelation')).toBe(true);
      // Chapter 06 is also accessible with shortened revelation for players without all 5 echoes
      expect(chronosStore.unlockedChapters.has('ch-06-warning')).toBe(true);

      // Discover Echo 03 in the-machine -> All 5 echoes discovered
      chronosStore.setActiveEra('the-machine');
      chronosStore.discoverEcho('echo-03-metal');
      expect(chronosStore.getDiscoveredEchoesCount()).toBe(5);
      expect(chronosStore.unlockedChapters.has('ch-06-warning')).toBe(true);
      expect(chronosStore.unlockedChaptersList).toHaveLength(6);

      // Reconstructed warning for 5/5 echoes vs shortened revelation for <5
      expect(getChapter06Content(5).isComplete).toBe(true);
      expect(getChapter06Content(5).revelationText).toContain('Complete reconstructed warning');
      expect(getChapter06Content(3).isComplete).toBe(false);
      expect(getChapter06Content(3).revelationText).toContain('Shortened revelation');
    });

    it('triggers and dismisses Observer 07 transmissions', () => {
      chronosStore.dismissTransmission();
      expect(chronosStore.activeTransmission).toBeNull();

      chronosStore.triggerTransmission('OBSERVER 07', ['TEST SIGNAL LINE 1', 'TEST SIGNAL LINE 2']);
      expect(chronosStore.activeTransmission).not.toBeNull();
      expect(chronosStore.activeTransmission?.sender).toBe('OBSERVER 07');
      expect(chronosStore.activeTransmission?.lines).toHaveLength(2);

      chronosStore.dismissTransmission();
      expect(chronosStore.activeTransmission).toBeNull();
    });

    it('opens and closes cinematic echo memory overlay', () => {
      chronosStore.openEchoMemory('echo-05-signal');
      expect(chronosStore.activeEchoMemory?.echoId).toBe('echo-05-signal');
      expect(chronosStore.activeEchoMemory?.revelationQuote).toContain('We sent the Core to the origin');

      chronosStore.closeEchoMemory();
      expect(chronosStore.activeEchoMemory).toBeNull();
    });
  });

  describe('Phase 09 — The Paradox Finale & Ending Choices', () => {
    beforeEach(() => {
      chronosStore.resetFinale();
    });

    it('initializes Paradox Engine in inactive state', () => {
      expect(chronosStore.paradoxState).toBe('inactive');
      expect(chronosStore.selectedEnding).toBeNull();
      expect(chronosStore.isFinaleCompleted).toBe(false);
      expect(chronosStore.paradoxSequenceIndex).toBe(0);
    });

    it('starts Paradox Finale at Sequence 01 (The Fracture Begins) in Chronos Plaza', () => {
      chronosStore.startParadoxFinale();
      expect(chronosStore.paradoxState).toBe('awakening');
      expect(chronosStore.paradoxSequenceIndex).toBe(0);
      expect(chronosStore.worldMode).toBe('city');
      expect(chronosStore.currentSegment).toBe('grand-arrival');
      expect(chronosStore.activeTransmission?.sender).toBe('OBSERVER 07');
      expect(chronosStore.unlockedChapters.has('ch-06-warning')).toBe(true);
    });

    it('advances through all 5 sequences deterministically', () => {
      chronosStore.startParadoxFinale();

      // Sequence 02: The Core Unstable in Chamber
      chronosStore.nextParadoxSequence();
      expect(chronosStore.paradoxSequenceIndex).toBe(1);
      expect(chronosStore.paradoxState).toBe('unstable');
      expect(chronosStore.worldMode).toBe('chamber');

      // Sequence 03: Five Eras Collide in City
      chronosStore.nextParadoxSequence();
      expect(chronosStore.paradoxSequenceIndex).toBe(2);
      expect(chronosStore.paradoxState).toBe('converging');
      expect(chronosStore.worldMode).toBe('city');

      // Sequence 04: The Revelation in Chamber
      chronosStore.nextParadoxSequence();
      expect(chronosStore.paradoxSequenceIndex).toBe(3);
      expect(chronosStore.paradoxState).toBe('revelation');
      expect(chronosStore.worldMode).toBe('chamber');

      // Sequence 05: The Final Choice
      chronosStore.nextParadoxSequence();
      expect(chronosStore.paradoxSequenceIndex).toBe(4);
      expect(chronosStore.paradoxState).toBe('awaiting-choice');
    });

    it('executes RESTORE TIME ending and stabilizes timeline', async () => {
      chronosStore.startParadoxFinale();
      chronosStore.setParadoxSequenceIndex(4);
      chronosStore.selectEnding('restore_time');
      expect(chronosStore.selectedEnding).toBe('restore_time');

      chronosStore.confirmEnding();
      expect(chronosStore.paradoxState).toBe('resolving');

      // Wait for resolution transition
      await new Promise((r) => setTimeout(r, 1300));
      expect(chronosStore.paradoxState).toBe('completed');
      expect(chronosStore.isFinaleCompleted).toBe(true);
      expect(chronosStore.activeEra).toBe('the-present');
      expect(chronosStore.worldMode).toBe('city');
    });

    it('executes EXPLORE THE UNKNOWN ending and unlocks free exploration', async () => {
      chronosStore.startParadoxFinale();
      chronosStore.setParadoxSequenceIndex(4);
      chronosStore.selectEnding('explore_unknown');
      expect(chronosStore.selectedEnding).toBe('explore_unknown');

      chronosStore.confirmEnding();
      expect(chronosStore.paradoxState).toBe('resolving');

      // Wait for resolution transition
      await new Promise((r) => setTimeout(r, 1300));
      expect(chronosStore.paradoxState).toBe('completed');
      expect(chronosStore.isFinaleCompleted).toBe(true);
      expect(chronosStore.experienceMode).toBe('explore');
      expect(chronosStore.worldMode).toBe('city');
    });

    it('cancels and resets finale state cleanly without timeline corruption', () => {
      chronosStore.startParadoxFinale();
      chronosStore.nextParadoxSequence();
      expect(chronosStore.paradoxState).toBe('unstable');

      chronosStore.cancelParadoxFinale();
      expect(chronosStore.paradoxState).toBe('inactive');
      expect(chronosStore.paradoxSequenceIndex).toBe(0);

      chronosStore.resetFinale();
      expect(chronosStore.selectedEnding).toBeNull();
      expect(chronosStore.isFinaleCompleted).toBe(false);
    });

    it('defines exactly two approved canonical endings', () => {
      expect(Object.keys(ENDINGS_CONFIG)).toEqual(['restore_time', 'explore_unknown']);
      expect(ENDINGS_CONFIG.restore_time.title).toBe('RESTORE TIME');
      expect(ENDINGS_CONFIG.explore_unknown.title).toBe('EXPLORE THE UNKNOWN');
    });
  });
});


