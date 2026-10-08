import { CINEMATIC_SHOTS, type CinematicShotId } from './constants';
import { type CityViewId, CITY_VIEWS, type HistoricalEraId } from '../types/phase03';
import {
  type CinematicSegmentId,
  CINEMATIC_SEGMENTS,
  type CinematicSegmentConfig,
} from '../types/phase04';
import {
  ORDERED_ERAS,
  TEMPORAL_ERAS,
  getEraFromTimelinePosition,
  getTimelineStopFromEra,
  type EraTemporalConfig,
} from '../types/phase05';
import {
  getTemporalMorphState,
  type TemporalMorphInterval,
} from '../types/phase06';
import type {
  ExperienceMode,
  CameraControllerMode,
  ExploreDistrictId,
  TemporalLensLandmarkId,
  TemporalEchoId,
  TemporalEchoConfig,
} from '../types/phase07';
import { TEMPORAL_ECHOES, ORDERED_ECHO_IDS } from '../types/phase07';
import {
  type NarrativeChapterId,
  type EchoNarrativeMemory,
  NARRATIVE_CHAPTERS,
  ORDERED_CHAPTER_IDS,
  ECHO_NARRATIVE_MEMORIES,
  getChapter06Content,
} from '../types/phase08';
import {
  type ParadoxState,
  type ParadoxEnding,
  PARADOX_SEQUENCES,
  ENDINGS_CONFIG,
} from '../types/phase09';

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
  public activationProgress = 0;   // 0.0 to 1.0
  public timelineProgress = 0;     // 0.0 to 1.0 for chamber scroll
  public portalProgress = 0;       // 0.0 to 1.0 for temporal vortex warp
  public journeyProgress = 0;      // 0.0 to 1.0 continuous spline progression for Aeternum flight
  public transitionProgress = 0;   // 0.0 to 1.0 continuous era blend factor
  
  // Discrete state (notified to React UI on state change)
  public worldMode: WorldMode = 'chamber';
  public cityView: CityViewId = 'grand-arrival';
  public currentSegment: CinematicSegmentId = 'grand-arrival';
  public activationState: ActivationState = 'idle';
  public currentShot: CinematicShotId = 'shot-01';
  public qualityPreset: QualityPreset = 'high';
  public reducedMotion = false;
  public isTransitioning = false;

  // Phase 05 Temporal Engine Core State
  public activeEra: HistoricalEraId = 'the-present';
  public targetEra: HistoricalEraId = 'the-present';
  public isTimeTransitioning = false;
  public timelinePosition = 0.75; // Default 2026 CE (timelineStop: 0.75)
  public timeTravelEnabled = true;

  // Phase 07 Exploration, Temporal Lens & Echoes State
  public experienceMode: ExperienceMode = 'story';
  public cameraController: CameraControllerMode = 'cinematic';
  public exploreDistrict: ExploreDistrictId = 'plaza';
  public isTimeFrozen = false;
  public temporalLens: {
    active: boolean;
    landmarkId: TemporalLensLandmarkId | null;
    previewEra: HistoricalEraId;
  } = {
    active: false,
    landmarkId: null,
    previewEra: 'the-kingdom',
  };
  public discoveredEchoes = new Set<TemporalEchoId>();
  public discoveredEchoesList: TemporalEchoId[] = [];
  public activeEchoModal: TemporalEchoConfig | null = null;
  public isJournalOpen = false;
  public lastStoryProgress = 0;

  // Phase 08 Observer 07 & Narrative Architecture
  public readonly observerId = 'OBSERVER 07';
  public hasSeenAwakening = false;
  public unlockedChapters = new Set<NarrativeChapterId>(['ch-01-awakening']);
  public unlockedChaptersList: NarrativeChapterId[] = ['ch-01-awakening'];
  public activeEchoMemory: EchoNarrativeMemory | null = null;
  public activeTransmission: {
    sender: string;
    lines: string[];
    chapterId?: NarrativeChapterId;
  } | null = null;

  // Phase 09 The Paradox Finale
  public paradoxState: ParadoxState = 'inactive';
  public selectedEnding: ParadoxEnding | null = null;
  public isFinaleCompleted = false;
  public paradoxSequenceIndex = 0;

  private readonly ECHOES_STORAGE_KEY = 'chronos_discovered_echoes';
  private readonly NARRATIVE_STORAGE_KEY = 'chronos_narrative_progress';
  private readonly PARADOX_STORAGE_KEY = 'chronos_paradox_progress';

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadDiscoveredEchoes();
      this.loadNarrativeProgress();
      this.loadParadoxProgress();
    }
  }

  public loadParadoxProgress(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(this.PARADOX_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (parsed.selectedEnding === 'restore_time' || parsed.selectedEnding === 'explore_unknown') {
          this.selectedEnding = parsed.selectedEnding;
        }
        if (typeof parsed.isFinaleCompleted === 'boolean') {
          this.isFinaleCompleted = parsed.isFinaleCompleted;
        }
        this.notify();
      }
    } catch {
      // Safe fallback
    }
  }

  public saveParadoxProgress(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        this.PARADOX_STORAGE_KEY,
        JSON.stringify({
          selectedEnding: this.selectedEnding,
          isFinaleCompleted: this.isFinaleCompleted,
        })
      );
    } catch {
      // Safe fallback
    }
  }

  public loadDiscoveredEchoes(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(this.ECHOES_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const validSet = new Set<string>(ORDERED_ECHO_IDS);
        const validated = parsed.filter(
          (id): id is TemporalEchoId => typeof id === 'string' && validSet.has(id)
        );
        this.discoveredEchoes = new Set(validated);
        this.discoveredEchoesList = validated;
        this.checkNarrativeProgression();
        this.notify();
      }
    } catch {
      // Safe fallback if localStorage is disabled or corrupt
    }
  }

  public saveDiscoveredEchoes(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        this.ECHOES_STORAGE_KEY,
        JSON.stringify(this.discoveredEchoesList)
      );
    } catch {
      // Safe fallback if quota exceeded
    }
  }

  public loadNarrativeProgress(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(this.NARRATIVE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (typeof parsed.hasSeenAwakening === 'boolean') {
          this.hasSeenAwakening = parsed.hasSeenAwakening;
        }
        if (Array.isArray(parsed.unlockedChapters)) {
          const validSet = new Set<string>(ORDERED_CHAPTER_IDS);
          const validated = parsed.unlockedChapters.filter(
            (id: unknown): id is NarrativeChapterId => typeof id === 'string' && validSet.has(id)
          );
          if (validated.length > 0) {
            this.unlockedChapters = new Set(validated);
            this.unlockedChaptersList = validated;
          }
        }
        this.notify();
      }
    } catch {
      // Safe fallback
    }
  }

  public saveNarrativeProgress(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        this.NARRATIVE_STORAGE_KEY,
        JSON.stringify({
          hasSeenAwakening: this.hasSeenAwakening,
          unlockedChapters: this.unlockedChaptersList,
        })
      );
    } catch {
      // Safe fallback
    }
  }

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

  // ==========================================================================
  // Phase 05 Temporal Engine Methods
  // ==========================================================================

  public setActiveEra(era: HistoricalEraId): void {
    if (this.activeEra !== era) {
      this.activeEra = era;
      this.targetEra = era;
      this.timelinePosition = getTimelineStopFromEra(era);
      this.notify();
    }
  }

  public setTargetEra(era: HistoricalEraId): void {
    if (this.targetEra !== era) {
      this.targetEra = era;
      this.notify();
    }
  }

  public setTransitionProgress(val: number): void {
    this.transitionProgress = Math.max(0, Math.min(1, val));
  }

  public setIsTimeTransitioning(val: boolean): void {
    if (this.isTimeTransitioning !== val) {
      this.isTimeTransitioning = val;
      this.notify();
    }
  }

  public setTimelinePosition(val: number): void {
    const clamped = Math.max(0, Math.min(1, val));
    this.timelinePosition = clamped;
    const derivedEra = getEraFromTimelinePosition(clamped);
    if (this.activeEra !== derivedEra && !this.isTimeTransitioning) {
      this.activeEra = derivedEra;
      this.targetEra = derivedEra;
    }
    this.notify();
  }

  public getMorphState(): TemporalMorphInterval {
    return getTemporalMorphState(this.timelinePosition);
  }

  public setTimeTravelEnabled(enabled: boolean): void {
    if (this.timeTravelEnabled !== enabled) {
      this.timeTravelEnabled = enabled;
      this.notify();
    }
  }

  public getActiveEraConfig(): EraTemporalConfig {
    return TEMPORAL_ERAS[this.activeEra] || TEMPORAL_ERAS['the-present'];
  }

  public getTargetEraConfig(): EraTemporalConfig {
    return TEMPORAL_ERAS[this.targetEra] || TEMPORAL_ERAS['the-present'];
  }

  public navigateEra(direction: 'next' | 'prev'): void {
    const currentIndex = ORDERED_ERAS.indexOf(this.activeEra);
    if (direction === 'next' && currentIndex < ORDERED_ERAS.length - 1) {
      this.setActiveEra(ORDERED_ERAS[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      this.setActiveEra(ORDERED_ERAS[currentIndex - 1]);
    }
  }

  // ==========================================================================
  // Phase 07 Exploration, Temporal Lens & Echoes Methods
  // ==========================================================================

  public setExperienceMode(mode: ExperienceMode): void {
    if (this.experienceMode !== mode) {
      if (mode === 'explore') {
        this.lastStoryProgress = this.journeyProgress;
        this.cameraController = 'exploring';
      } else {
        this.journeyProgress = this.lastStoryProgress;
        this.cameraController = 'cinematic';
        this.closeTemporalLens();
      }
      this.experienceMode = mode;
      this.notify();
    }
  }

  public setExploreDistrict(district: ExploreDistrictId): void {
    if (this.exploreDistrict !== district) {
      this.exploreDistrict = district;
      this.cameraController = 'transitioning';
      this.notify();
    }
  }

  public setCameraController(controller: CameraControllerMode): void {
    if (this.cameraController !== controller) {
      this.cameraController = controller;
      this.notify();
    }
  }

  public setIsTimeFrozen(val: boolean): void {
    if (this.isTimeFrozen !== val) {
      this.isTimeFrozen = val;
      this.notify();
    }
  }

  public toggleTimeFreeze(): void {
    this.isTimeFrozen = !this.isTimeFrozen;
    this.notify();
  }

  public openTemporalLens(landmarkId: TemporalLensLandmarkId, previewEra?: HistoricalEraId): void {
    const era = previewEra || (this.activeEra === 'the-kingdom' ? 'the-machine' : 'the-kingdom');
    this.temporalLens = {
      active: true,
      landmarkId,
      previewEra: era,
    };
    this.cameraController = 'inspecting';
    this.notify();
  }

  public closeTemporalLens(): void {
    if (this.temporalLens.active) {
      this.temporalLens = {
        active: false,
        landmarkId: null,
        previewEra: 'the-kingdom',
      };
      if (this.experienceMode === 'explore') {
        this.cameraController = 'exploring';
      } else {
        this.cameraController = 'cinematic';
      }
      this.notify();
    }
  }

  public setTemporalLensPreviewEra(era: HistoricalEraId): void {
    if (this.temporalLens.previewEra !== era) {
      this.temporalLens.previewEra = era;
      this.notify();
    }
  }

  public discoverEcho(echoId: TemporalEchoId): void {
    const config = TEMPORAL_ECHOES[echoId];
    if (!config) return;

    if (!this.discoveredEchoes.has(echoId)) {
      // Requirement 1: Temporal Echoes must only be discoverable in their configured primaryEra
      if (this.activeEra !== config.primaryEra) {
        return;
      }
      this.discoveredEchoes.add(echoId);
      this.discoveredEchoesList = Array.from(this.discoveredEchoes);
      this.saveDiscoveredEchoes();
      this.checkNarrativeProgression();
      this.activeEchoModal = config;
      this.openEchoMemory(echoId);
      this.notify();
    } else {
      this.activeEchoModal = config;
      this.openEchoMemory(echoId);
      this.notify();
    }
  }

  public clearDiscoveredEchoes(): void {
    this.discoveredEchoes.clear();
    this.discoveredEchoesList = [];
    this.activeEchoModal = null;
    this.activeEchoMemory = null;
    this.saveDiscoveredEchoes();
    this.checkNarrativeProgression();
    this.notify();
  }

  public checkNarrativeProgression(): void {
    const chapters = new Set<NarrativeChapterId>(['ch-01-awakening']);

    if (this.discoveredEchoes.has('echo-01-mark')) {
      chapters.add('ch-02-first-memory');
    }
    if (this.discoveredEchoes.has('echo-02-record') || this.discoveredEchoes.has('echo-03-metal')) {
      chapters.add('ch-03-pattern');
    }
    if (this.discoveredEchoes.has('echo-04-blueprint')) {
      chapters.add('ch-04-experiment');
    }
    if (this.discoveredEchoes.has('echo-05-signal')) {
      chapters.add('ch-05-revelation');
    }
    // Fixed final-warning progression:
    // Players with all five Echoes receive the complete reconstructed warning.
    // Players without all five Echoes can still access the primary finale with a shortened revelation.
    if (
      this.discoveredEchoes.size > 0 ||
      this.paradoxState !== 'inactive' ||
      this.isFinaleCompleted
    ) {
      chapters.add('ch-06-warning');
    }

    this.unlockedChapters = chapters;
    this.unlockedChaptersList = Array.from(chapters);
    this.saveNarrativeProgress();
  }

  public openEchoMemory(echoId: TemporalEchoId): void {
    this.activeEchoMemory = ECHO_NARRATIVE_MEMORIES[echoId] || null;
    this.notify();
  }

  public closeEchoMemory(): void {
    this.activeEchoMemory = null;
    this.notify();
  }

  public triggerTransmission(
    sender: string,
    lines: string[],
    chapterId?: NarrativeChapterId
  ): void {
    this.activeTransmission = { sender, lines, chapterId };
    this.notify();
  }

  public dismissTransmission(): void {
    this.activeTransmission = null;
    this.notify();
  }

  public markAwakeningSeen(): void {
    this.hasSeenAwakening = true;
    this.saveNarrativeProgress();
    this.notify();
  }

  public setActiveEchoModal(echo: TemporalEchoConfig | null): void {
    this.activeEchoModal = echo;
    this.notify();
  }

  public setIsJournalOpen(open: boolean): void {
    if (this.isJournalOpen !== open) {
      this.isJournalOpen = open;
      this.notify();
    }
  }

  public getDiscoveredEchoesCount(): number {
    return this.discoveredEchoes.size;
  }

  // =========================================================================
  // Phase 09: The Paradox Finale Engine
  // =========================================================================
  public setParadoxState(state: ParadoxState): void {
    if (this.paradoxState !== state) {
      this.paradoxState = state;
      this.checkNarrativeProgression();
      this.notify();
    }
  }

  public startParadoxFinale(): void {
    this.paradoxState = 'awakening';
    this.paradoxSequenceIndex = 0;
    this.isJournalOpen = false;
    this.activeEchoModal = null;
    this.activeEchoMemory = null;
    this.experienceMode = 'story';

    // Sequence 01 begins in City at Chronos Plaza
    this.worldMode = 'city';
    this.currentSegment = 'grand-arrival';
    this.setJourneyProgress(0.0);

    const seq = PARADOX_SEQUENCES[0];
    if (seq) {
      this.triggerTransmission('OBSERVER 07', seq.transmissionLines, 'ch-06-warning');
    }
    this.checkNarrativeProgression();
    this.notify();
  }

  public setParadoxSequenceIndex(idx: number): void {
    const clamped = Math.max(0, Math.min(4, idx));
    this.paradoxSequenceIndex = clamped;

    const states: ParadoxState[] = [
      'awakening',
      'unstable',
      'converging',
      'revelation',
      'awaiting-choice',
    ];
    this.paradoxState = states[clamped];

    const seq = PARADOX_SEQUENCES[clamped];
    if (seq) {
      if (seq.targetWorld === 'chamber') {
        this.worldMode = 'chamber';
      } else if (seq.targetWorld === 'city') {
        this.worldMode = 'city';
      }
      this.triggerTransmission('OBSERVER 07', seq.transmissionLines, 'ch-06-warning');
    }
    this.checkNarrativeProgression();
    this.notify();
  }

  public nextParadoxSequence(): void {
    if (this.paradoxSequenceIndex < 4) {
      this.setParadoxSequenceIndex(this.paradoxSequenceIndex + 1);
    }
  }

  public prevParadoxSequence(): void {
    if (this.paradoxSequenceIndex > 0) {
      this.setParadoxSequenceIndex(this.paradoxSequenceIndex - 1);
    }
  }

  public selectEnding(ending: ParadoxEnding): void {
    this.selectedEnding = ending;
    this.notify();
  }

  public confirmEnding(): void {
    if (!this.selectedEnding) return;
    this.paradoxState = 'resolving';
    this.notify();

    setTimeout(() => {
      this.paradoxState = 'completed';
      this.isFinaleCompleted = true;
      this.saveParadoxProgress();

      if (this.selectedEnding === 'restore_time') {
        // Stabilize timeline to 2026 present
        this.setActiveEra('the-present');
        this.setTimelinePosition(0.75);
        this.worldMode = 'city';
        this.triggerTransmission('OBSERVER 07', [
          'CHRONOS CORE HARMONIC DRIFT TERMINATED.',
          'THE FIVE TEMPORAL FRACTURES HAVE BEEN SEALED.',
          'TIME IS WHOLE AGAIN. AETERNUM REMEMBERS.',
        ]);
      } else {
        // Explore the unknown: free exploration across eras
        this.worldMode = 'city';
        this.experienceMode = 'explore';
        this.triggerTransmission('OBSERVER 07', [
          'QUANTUM BEACON ONLINE. TEMPORAL BRIDGES REMAIN OPEN.',
          'UNRESTRICTED CROSS-ERA NAVIGATION INITIALIZED.',
          'THE FUTURE IS UNWRITTEN. YOUR JOURNEY CONTINUES.',
        ]);
      }
      this.notify();
    }, 1200);
  }

  public cancelParadoxFinale(): void {
    this.paradoxState = 'inactive';
    this.paradoxSequenceIndex = 0;
    this.dismissTransmission();
    this.notify();
  }

  public resetFinale(): void {
    this.paradoxState = 'inactive';
    this.selectedEnding = null;
    this.isFinaleCompleted = false;
    this.paradoxSequenceIndex = 0;
    this.saveParadoxProgress();
    this.dismissTransmission();
    this.notify();
  }
}

export const chronosStore = new ChronosStore();
