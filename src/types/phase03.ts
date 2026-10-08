/**
 * CHRONOS — Aeternum: Phase 03 Architectural Specifications & Contracts
 * 
 * Defines extension interfaces, district models, coordinate space conventions,
 * and transition state contracts for the upcoming Aeternum City expansion.
 * 
 * STRICT COMPLIANCE:
 * - This file establishes TYPE DEFINITIONS AND CONTRACTS ONLY.
 * - No geometry or city meshes are instantiated in Phase 2.2.
 */

// ============================================================================
// 1. WORLD COORDINATE SYSTEM CONVENTIONS
// ============================================================================

/**
 * Metric Scale Unit Convention:
 * 1 Three.js World Unit = 1.0 Meter in physical space.
 * 
 * Handedness & Axes:
 * - Y-Up: [0, 1, 0] (Altitude / Vertical height)
 * - X-Right: [1, 0, 0] (Lateral / East-West axis)
 * - Z-Forward: [0, 0, 1] (Depth / North-South axis, negative is forward into scene)
 */
export interface WorldVector3 {
  x: number;
  y: number;
  z: number;
}

export const WORLD_SPATIAL_ANCHORS = {
  /** Chamber Sanctuary Center (Origin of Phase 02) */
  chamberOrigin: [0, 0, 0] as const,
  /** Chronos Core Floating Pivot */
  chronosCoreCenter: [0, 3.8, 0] as const,
  /** Chamber Portal Arch Threshold */
  portalThreshold: [0, 8.0, -16.0] as const,
  /** Transitional Chrono-Vortex Corridor */
  vortexCorridorStart: [0, 8.0, -25.0] as const,
  vortexCorridorEnd: [0, 15.0, -90.0] as const,
  /** Aeternum City Grand Arrival Threshold */
  cityWorldOrigin: [0, 0, -120.0] as const,
} as const;

// ============================================================================
// 2. FICTIONAL CITY DISTRICTS
// ============================================================================

export type CityDistrictId =
  | 'chronos-plaza'
  | 'old-district'
  | 'river-crossing'
  | 'industrial-quarter'
  | 'the-observatory';

export interface DistrictBoundary {
  center: [number, number, number];
  radius: number; // In meters
  heightLimits: [number, number]; // [minY, maxY]
}

export interface CityDistrictConfig {
  id: CityDistrictId;
  name: string;
  codename: string;
  description: string;
  boundary: DistrictBoundary;
  architecturalStyle: string;
  primaryLightColor: string;
  ambientAudioTrackId: string;
  eraVariations: HistoricalEraId[];
}

export const CITY_DISTRICTS: Record<CityDistrictId, CityDistrictConfig> = {
  'chronos-plaza': {
    id: 'chronos-plaza',
    name: 'Chronos Plaza',
    codename: 'PLAZA_PRIME',
    description: 'The monumental civic epicenter housing the grand sundial forum and celestial towers.',
    boundary: {
      center: [0, 0, -120],
      radius: 65,
      heightLimits: [0, 48],
    },
    architecturalStyle: 'Neo-Classical Monolithic with Gold Inlays',
    primaryLightColor: '#D4AF37',
    ambientAudioTrackId: 'audio-plaza-sundial',
    eraVariations: ['ancient-foundations', 'classical-renaissance', 'industrial-epoch', 'electric-zenith', 'aeternum-timeless'],
  },
  'old-district': {
    id: 'old-district',
    name: 'Old District',
    codename: 'VETUS_QUARTER',
    description: 'Narrow cobblestone labyrinths, timber-framed facades, and medieval trade arcades.',
    boundary: {
      center: [-85, 2, -140],
      radius: 55,
      heightLimits: [0, 28],
    },
    architecturalStyle: 'Medieval Stone Masonry & Timber Framing',
    primaryLightColor: '#EAB774',
    ambientAudioTrackId: 'audio-old-quarter-echoes',
    eraVariations: ['ancient-foundations', 'classical-renaissance', 'industrial-epoch', 'electric-zenith', 'aeternum-timeless'],
  },
  'river-crossing': {
    id: 'river-crossing',
    name: 'River Crossing',
    codename: 'AETERNUM_RIVER',
    description: 'Grand vaulted aqueduct bridges and watermills spanning the mystic Chronos River.',
    boundary: {
      center: [75, -6, -155],
      radius: 70,
      heightLimits: [-12, 35],
    },
    architecturalStyle: 'Romanesque Aqueducts & Waterway Locks',
    primaryLightColor: '#7AA2B8',
    ambientAudioTrackId: 'audio-river-currents',
    eraVariations: ['ancient-foundations', 'classical-renaissance', 'industrial-epoch', 'electric-zenith', 'aeternum-timeless'],
  },
  'industrial-quarter': {
    id: 'industrial-quarter',
    name: 'Industrial Quarter',
    codename: 'IRON_HEARTH',
    description: 'Soot-blackened iron furnaces, steam conduits, brass clocktowers, and mechanical lifts.',
    boundary: {
      center: [-60, -2, -220],
      radius: 80,
      heightLimits: [-4, 62],
    },
    architecturalStyle: 'Steampunk Victorian Cast-Iron & Brick Furnaces',
    primaryLightColor: '#FF6F3D',
    ambientAudioTrackId: 'audio-furnace-steam',
    eraVariations: ['ancient-foundations', 'classical-renaissance', 'industrial-epoch', 'electric-zenith', 'aeternum-timeless'],
  },
  'the-observatory': {
    id: 'the-observatory',
    name: 'The Observatory',
    codename: 'ZENITH_PEAK',
    description: 'Elevated mountain citadel dome equipped with titanic astrolabes scanning temporal rifts.',
    boundary: {
      center: [55, 38, -260],
      radius: 50,
      heightLimits: [25, 95],
    },
    architecturalStyle: 'High Celestial Dome with Rotating Armillary Rings',
    primaryLightColor: '#A78BFA',
    ambientAudioTrackId: 'audio-observatory-celestial',
    eraVariations: ['ancient-foundations', 'classical-renaissance', 'industrial-epoch', 'electric-zenith', 'aeternum-timeless'],
  },
};

// ============================================================================
// 3. HISTORICAL ERAS (TEMPORAL MORPHING SPECIFICATION)
// ============================================================================

export type HistoricalEraId =
  | 'ancient-foundations'
  | 'classical-renaissance'
  | 'industrial-epoch'
  | 'electric-zenith'
  | 'aeternum-timeless';

export interface HistoricalEraConfig {
  id: HistoricalEraId;
  yearDisplay: string;
  epochName: string;
  paletteTheme: {
    skyColor: string;
    fogDensity: number;
    fogColor: string;
    ambientIntensity: number;
    keyLightColor: string;
  };
  dominantMaterials: string[];
}

export const HISTORICAL_ERAS: Record<HistoricalEraId, HistoricalEraConfig> = {
  'ancient-foundations': {
    id: 'ancient-foundations',
    yearDisplay: 'ERA 01 — 320 BCE',
    epochName: 'Ancient Foundations',
    paletteTheme: {
      skyColor: '#070a0f',
      fogDensity: 0.015,
      fogColor: '#121921',
      ambientIntensity: 0.25,
      keyLightColor: '#EAB774',
    },
    dominantMaterials: ['rough_chiseled_sandstone', 'dark_monolithic_basalt', 'crude_bronze'],
  },
  'classical-renaissance': {
    id: 'classical-renaissance',
    yearDisplay: 'ERA 02 — 1512 CE',
    epochName: 'Classical Renaissance',
    paletteTheme: {
      skyColor: '#0b1019',
      fogDensity: 0.012,
      fogColor: '#182430',
      ambientIntensity: 0.4,
      keyLightColor: '#FFE8B5',
    },
    dominantMaterials: ['polished_white_marble', 'aged_terracotta', 'carved_oak', 'leaf_gold'],
  },
  'industrial-epoch': {
    id: 'industrial-epoch',
    yearDisplay: 'ERA 03 — 1888 CE',
    epochName: 'Industrial Epoch',
    paletteTheme: {
      skyColor: '#0d0d10',
      fogDensity: 0.025,
      fogColor: '#1a1614',
      ambientIntensity: 0.35,
      keyLightColor: '#FF7A38',
    },
    dominantMaterials: ['riveted_wrought_iron', 'red_kiln_brick', 'tarnished_brass', 'soot_slate'],
  },
  'electric-zenith': {
    id: 'electric-zenith',
    yearDisplay: 'ERA 04 — 1968 CE',
    epochName: 'Electric Zenith',
    paletteTheme: {
      skyColor: '#080c14',
      fogDensity: 0.014,
      fogColor: '#101e2c',
      ambientIntensity: 0.45,
      keyLightColor: '#60A5FA',
    },
    dominantMaterials: ['brushed_aluminum', 'reinforced_concrete', 'neon_luminescence', 'tinted_glass'],
  },
  'aeternum-timeless': {
    id: 'aeternum-timeless',
    yearDisplay: 'ERA 05 — THE INFINITE',
    epochName: 'Aeternum Timeless',
    paletteTheme: {
      skyColor: '#05070a',
      fogDensity: 0.018,
      fogColor: '#0e1722',
      ambientIntensity: 0.5,
      keyLightColor: '#D4AF37',
    },
    dominantMaterials: ['crystallized_chronite', 'dark_obsidian_void', 'levitating_gold_glyphs'],
  },
};

// ============================================================================
// 4. TRANSITION STATE & TIMELINE HANDOFF
// ============================================================================

export type ChamberToCityTransitionState =
  | 'chamber_dormant'
  | 'core_overcharged'
  | 'vortex_portal_traverse'
  | 'city_establishing'
  | 'city_exploration';

export interface PhaseTransitionPayload {
  state: ChamberToCityTransitionState;
  /** Transition progress 0.0 (inside chamber) to 1.0 (emerged in city) */
  progress: number;
  activeDistrict: CityDistrictId;
  activeEra: HistoricalEraId;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

// ============================================================================
// 5. ASSET BUDGETS & PERFORMANCE BOUNDARIES (PHASE 03 TARGETS)
// ============================================================================

export interface PerformanceBudgetConfig {
  maxTrianglesLOD0: number;
  maxTrianglesLOD1: number;
  maxTrianglesLOD2: number;
  maxDrawCalls: number;
  maxTextureMemoryMB: number;
  targetFPSDesktop: number;
  targetFPSMobile: number;
}

export const PHASE_03_PERFORMANCE_BUDGET: PerformanceBudgetConfig = {
  maxTrianglesLOD0: 120_000,
  maxTrianglesLOD1: 45_000,
  maxTrianglesLOD2: 12_000,
  maxDrawCalls: 85,
  maxTextureMemoryMB: 60,
  targetFPSDesktop: 60,
  targetFPSMobile: 45,
};
