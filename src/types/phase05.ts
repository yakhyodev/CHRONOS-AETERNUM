/**
 * CHRONOS — Aeternum: Phase 05 Temporal Engine Specifications
 * 
 * Defines historical era configurations, timeline mapping, and temporal transition state.
 */
import { type HistoricalEraId, HISTORICAL_ERAS } from './phase03';

export type { HistoricalEraId };

export interface EraTemporalConfig {
  id: HistoricalEraId;
  year: number;
  yearLabel: string;
  epochName: string;
  tagline: string;
  timelineIndex: number; // 0 to 4
  timelineStop: number;  // 0.0, 0.25, 0.50, 0.75, 1.0
  atmosphere: {
    skyColor: string;
    fogColor: string;
    fogDensity: number;
    sunColor: string;
    sunIntensity: number;
    ambientColor: string;
    ambientIntensity: number;
    accentColor: string;
  };
  landmarkTitle: string;
  landmarkDescription: string;
}

export const TEMPORAL_ERAS: Record<HistoricalEraId, EraTemporalConfig> = {
  'the-origin': {
    id: 'the-origin',
    year: -1200,
    yearLabel: '1200 BCE',
    epochName: 'THE ORIGIN',
    tagline: 'PRIMEVAL FORUM & ANCIENT SUN ARCHITECTURE',
    timelineIndex: 0,
    timelineStop: 0.0,
    atmosphere: {
      skyColor: '#1A1410',
      fogColor: '#2A1F16',
      fogDensity: 0.012,
      sunColor: '#E6A85C',
      sunIntensity: 2.2,
      ambientColor: '#8C6842',
      ambientIntensity: 0.5,
      accentColor: '#D97706', // Warm bronze
    },
    landmarkTitle: 'THE PRIMORDIAL SUNDIAL',
    landmarkDescription: 'Colossal bronze gnomon aligned with the solstices, encircled by monolithic limestone pillars.',
  },
  'the-kingdom': {
    id: 'the-kingdom',
    year: 1450,
    yearLabel: '1450 CE',
    epochName: 'THE KINGDOM',
    tagline: 'MEDIEVAL WALLED CITADEL & BELFRY MECHANISM',
    timelineIndex: 1,
    timelineStop: 0.25,
    atmosphere: {
      skyColor: '#181C24',
      fogColor: '#202632',
      fogDensity: 0.010,
      sunColor: '#F5D0A9',
      sunIntensity: 2.4,
      ambientColor: '#6B7A90',
      ambientIntensity: 0.55,
      accentColor: '#D4AF37', // Gold Leaf
    },
    landmarkTitle: 'THE KINGDOM CLOCK TOWER',
    landmarkDescription: 'Gothic stone belfry with copper finials, timber hoardings, and early mechanical escapement dials.',
  },
  'the-machine': {
    id: 'the-machine',
    year: 1890,
    yearLabel: '1890 CE',
    epochName: 'THE MACHINE',
    tagline: 'VICTORIAN INDUSTRIAL STEAM & RIVETED IRON',
    timelineIndex: 2,
    timelineStop: 0.50,
    atmosphere: {
      skyColor: '#141210',
      fogColor: '#221C18',
      fogDensity: 0.014,
      sunColor: '#FF8A48',
      sunIntensity: 2.0,
      ambientColor: '#5C4436',
      ambientIntensity: 0.6,
      accentColor: '#F97316', // Industrial flame
    },
    landmarkTitle: 'THE STEAM CHRONOMETER',
    landmarkDescription: 'Heavy riveted iron lattice tower with exposed brass counterweights, gas lanterns, and pressure manifolds.',
  },
  'the-present': {
    id: 'the-present',
    year: 2026,
    yearLabel: '2026 CE',
    epochName: 'THE PRESENT',
    tagline: 'CIVIC HERITAGE & MODERN ARCHITECTURAL RESTORATION',
    timelineIndex: 3,
    timelineStop: 0.75,
    atmosphere: {
      skyColor: '#211A16',
      fogColor: '#2E231C',
      fogDensity: 0.009,
      sunColor: '#FFAE5C',
      sunIntensity: 2.8,
      ambientColor: '#806856',
      ambientIntensity: 0.65,
      accentColor: '#EAB774', // Warm civic gold
    },
    landmarkTitle: 'THE CENTURY CLOCK TOWER',
    landmarkDescription: 'Preserved civic landmark combining historic stone foundations with precision astronomical horology.',
  },
  'the-next-age': {
    id: 'the-next-age',
    year: 2200,
    yearLabel: '2200 CE',
    epochName: 'THE NEXT AGE',
    tagline: 'CHRONO-RESONANT ENERGY & LEVITATING ARCHITECTURE',
    timelineIndex: 4,
    timelineStop: 1.0,
    atmosphere: {
      skyColor: '#0A101A',
      fogColor: '#101B28',
      fogDensity: 0.011,
      sunColor: '#00E5FF',
      sunIntensity: 2.5,
      ambientColor: '#1E3A5F',
      ambientIntensity: 0.7,
      accentColor: '#00F0FF', // Holographic cyan
    },
    landmarkTitle: 'THE QUANTUM CHRONOS SPIRE',
    landmarkDescription: 'Hyper-advanced harmonic spire with floating tachyon containment rings and crystalline energy channels.',
  },
};

export const ORDERED_ERAS: HistoricalEraId[] = [
  'the-origin',
  'the-kingdom',
  'the-machine',
  'the-present',
  'the-next-age',
];

/**
 * Get era from continuous timeline position (0.0 to 1.0)
 */
export function getEraFromTimelinePosition(pos: number): HistoricalEraId {
  const clamped = Math.max(0, Math.min(1, pos));
  if (clamped < 0.125) return 'the-origin';
  if (clamped < 0.375) return 'the-kingdom';
  if (clamped < 0.625) return 'the-machine';
  if (clamped < 0.875) return 'the-present';
  return 'the-next-age';
}

/**
 * Get normalized timeline stop for an era id
 */
export function getTimelineStopFromEra(eraId: HistoricalEraId): number {
  return TEMPORAL_ERAS[eraId]?.timelineStop ?? 0.75;
}
