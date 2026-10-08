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
    description: 'The monumental civic epicenter housing the grand clock tower, concentric forum, and radial avenues.',
    boundary: {
      center: [0, 0, -120],
      radius: 65,
      heightLimits: [0, 55],
    },
    architecturalStyle: 'Neo-Classical Monolithic & Gothic Revival',
    primaryLightColor: '#D4AF37',
    ambientAudioTrackId: 'audio-plaza-bells',
    eraVariations: ['the-origin', 'the-kingdom', 'the-machine', 'the-present', 'the-next-age'],
  },
  'old-district': {
    id: 'old-district',
    name: 'Old District',
    codename: 'VETUS_QUARTER',
    description: 'Dense historical stone fabric, terracotta roofs, narrow cobblestone streets, and arches.',
    boundary: {
      center: [-75, 2, -135],
      radius: 55,
      heightLimits: [0, 32],
    },
    architecturalStyle: 'Medieval Stone Masonry & Terracotta Framing',
    primaryLightColor: '#EAB774',
    ambientAudioTrackId: 'audio-old-quarter-echoes',
    eraVariations: ['the-origin', 'the-kingdom', 'the-machine', 'the-present', 'the-next-age'],
  },
  'river-crossing': {
    id: 'river-crossing',
    name: 'River Crossing',
    codename: 'AETERNUM_RIVER',
    description: 'Winding river, monumental multi-arch stone bridge, promenades, and river embankments.',
    boundary: {
      center: [70, -2, -130],
      radius: 70,
      heightLimits: [-6, 35],
    },
    architecturalStyle: 'Arched Stone Aqueducts & Embankments',
    primaryLightColor: '#7AA2B8',
    ambientAudioTrackId: 'audio-river-currents',
    eraVariations: ['the-origin', 'the-kingdom', 'the-machine', 'the-present', 'the-next-age'],
  },
  'industrial-quarter': {
    id: 'industrial-quarter',
    name: 'Industrial Quarter',
    codename: 'IRON_HEARTH',
    description: 'Brick factories, towering smokestacks, iron trusses, saw-tooth roofs, and workshops.',
    boundary: {
      center: [-65, 0, -75],
      radius: 65,
      heightLimits: [0, 48],
    },
    architecturalStyle: '19th-Century Industrial Brick Masonry & Cast Iron',
    primaryLightColor: '#FF6F3D',
    ambientAudioTrackId: 'audio-furnace-steam',
    eraVariations: ['the-origin', 'the-kingdom', 'the-machine', 'the-present', 'the-next-age'],
  },
  'the-observatory': {
    id: 'the-observatory',
    name: 'The Observatory',
    codename: 'ZENITH_PEAK',
    description: 'Elevated northern rocky hill, winding mountain road, and monumental celestial dome overlooking Aeternum.',
    boundary: {
      center: [40, 36, -230],
      radius: 50,
      heightLimits: [20, 85],
    },
    architecturalStyle: 'High Celestial Dome & Mountain Terraces',
    primaryLightColor: '#A78BFA',
    ambientAudioTrackId: 'audio-observatory-celestial',
    eraVariations: ['the-origin', 'the-kingdom', 'the-machine', 'the-present', 'the-next-age'],
  },
};

// ============================================================================
// 3. HISTORICAL ERAS (TEMPORAL MORPHING SPECIFICATION)
// ============================================================================

export type HistoricalEraId =
  | 'the-origin'
  | 'the-kingdom'
  | 'the-machine'
  | 'the-present'
  | 'the-next-age';

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
  'the-origin': {
    id: 'the-origin',
    yearDisplay: 'ERA 01 — 1200 BCE',
    epochName: 'The Origin',
    paletteTheme: {
      skyColor: '#070a0f',
      fogDensity: 0.015,
      fogColor: '#121921',
      ambientIntensity: 0.25,
      keyLightColor: '#EAB774',
    },
    dominantMaterials: ['rough_chiseled_sandstone', 'dark_monolithic_basalt', 'crude_bronze'],
  },
  'the-kingdom': {
    id: 'the-kingdom',
    yearDisplay: 'ERA 02 — 1450 CE',
    epochName: 'The Kingdom',
    paletteTheme: {
      skyColor: '#0b1019',
      fogDensity: 0.012,
      fogColor: '#182430',
      ambientIntensity: 0.4,
      keyLightColor: '#FFE8B5',
    },
    dominantMaterials: ['polished_white_marble', 'aged_terracotta', 'carved_oak', 'leaf_gold'],
  },
  'the-machine': {
    id: 'the-machine',
    yearDisplay: 'ERA 03 — 1890 CE',
    epochName: 'The Machine',
    paletteTheme: {
      skyColor: '#0d0d10',
      fogDensity: 0.025,
      fogColor: '#1a1614',
      ambientIntensity: 0.35,
      keyLightColor: '#FF7A38',
    },
    dominantMaterials: ['riveted_wrought_iron', 'red_kiln_brick', 'tarnished_brass', 'soot_slate'],
  },
  'the-present': {
    id: 'the-present',
    yearDisplay: 'ERA 04 — 2026 CE',
    epochName: 'The Present',
    paletteTheme: {
      skyColor: '#0b1320',
      fogDensity: 0.012,
      fogColor: '#2b231c',
      ambientIntensity: 0.55,
      keyLightColor: '#FFAE5C',
    },
    dominantMaterials: ['weathered_sandstone', 'warm_terracotta', 'dark_slate', 'reflective_water', 'patinated_bronze'],
  },
  'the-next-age': {
    id: 'the-next-age',
    yearDisplay: 'ERA 05 — 2200 CE',
    epochName: 'The Next Age',
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
// 3.1 CITY CAMERA VIEWS (PHASE 03 SPECIFICATION)
// ============================================================================

export type CityViewId = 'grand-arrival' | 'city-panorama' | 'observatory-distance';

export interface CityViewConfig {
  id: CityViewId;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  fov: number;
}

export const CITY_VIEWS: Record<CityViewId, CityViewConfig> = {
  'grand-arrival': {
    id: 'grand-arrival',
    number: '01',
    name: 'Grand Arrival',
    subtitle: 'CHRONOS PLAZA & CLOCK TOWER',
    description: 'Ground-level perspective of the monumental clock tower and concentric civic forum.',
    cameraPosition: [0, 8, -85],
    targetPosition: [0, 22, -125],
    fov: 52,
  },
  'city-panorama': {
    id: 'city-panorama',
    number: '02',
    name: 'City Panorama',
    subtitle: 'THE FIVE DISTRICTS OF AETERNUM',
    description: 'Elevated panoramic vista sweeping across all five districts, the river bridge, and mountains.',
    cameraPosition: [35, 75, -35],
    targetPosition: [-5, 14, -145],
    fov: 55,
  },
  'observatory-distance': {
    id: 'observatory-distance',
    number: '03',
    name: 'Observatory Distance',
    subtitle: 'THE NORTHERN CELESTIAL DOME',
    description: 'Elevated viewpoint framing the northern hilltop observatory towering over the city.',
    cameraPosition: [-25, 42, -100],
    targetPosition: [42, 46, -235],
    fov: 44,
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
