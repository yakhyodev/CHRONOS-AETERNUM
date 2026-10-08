/**
 * CHRONOS — Aeternum: Phase 07 Exploration & Temporal Echoes Specifications
 * 
 * Interactive exploration, bounded orbit camera, Temporal Lens previews,
 * Time Freeze controls, and five discoverable Temporal Echo artifacts.
 */

import { type HistoricalEraId } from './phase03';

export type ExperienceMode = 'story' | 'explore';

export type CameraControllerMode = 'cinematic' | 'exploring' | 'inspecting' | 'transitioning';

export type ExploreDistrictId =
  | 'plaza'
  | 'old-district'
  | 'river'
  | 'industry'
  | 'observatory';

export interface DistrictExploreAnchor {
  id: ExploreDistrictId;
  name: string;
  districtLabel: string;
  tagline: string;
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
}

export const DISTRICT_EXPLORE_ANCHORS: Record<ExploreDistrictId, DistrictExploreAnchor> = {
  plaza: {
    id: 'plaza',
    name: 'Chronos Plaza',
    districtLabel: 'CHRONOS PLAZA',
    tagline: 'THE MONUMENTAL CIVIC FORUM & TIMEPIECE',
    cameraPosition: [0, 18, -75],
    targetPosition: [0, 14, -125],
    minDistance: 25,
    maxDistance: 110,
    minPolarAngle: Math.PI / 6,
    maxPolarAngle: Math.PI / 2.05,
  },
  'old-district': {
    id: 'old-district',
    name: 'Old District',
    districtLabel: 'OLD DISTRICT',
    tagline: 'WESTERN HILLSIDE TERRACES & HISTORIC MASONRY',
    cameraPosition: [-48, 22, -102],
    targetPosition: [-75, 8, -135],
    minDistance: 20,
    maxDistance: 95,
    minPolarAngle: Math.PI / 6,
    maxPolarAngle: Math.PI / 2.05,
  },
  river: {
    id: 'river',
    name: 'River Crossing',
    districtLabel: 'RIVER CROSSING',
    tagline: 'EASTERN QUAY ARCHES & EMBANKMENT PASSAGE',
    cameraPosition: [52, 18, -98],
    targetPosition: [85, 6, -135],
    minDistance: 20,
    maxDistance: 100,
    minPolarAngle: Math.PI / 6,
    maxPolarAngle: Math.PI / 2.05,
  },
  industry: {
    id: 'industry',
    name: 'Industrial Quarter',
    districtLabel: 'INDUSTRIAL QUARTER',
    tagline: 'SOUTHWESTERN CANAL FOUNDRIES & MACHINE LOFTS',
    cameraPosition: [-82, 24, 78],
    targetPosition: [-120, 10, 40],
    minDistance: 25,
    maxDistance: 115,
    minPolarAngle: Math.PI / 6,
    maxPolarAngle: Math.PI / 2.05,
  },
  observatory: {
    id: 'observatory',
    name: 'The Observatory',
    districtLabel: 'THE OBSERVATORY',
    tagline: 'NORTHERN CLIFF CELESTIAL DOME & HORIZON GAZE',
    cameraPosition: [0, 52, -275],
    targetPosition: [0, 36, -345],
    minDistance: 35,
    maxDistance: 140,
    minPolarAngle: Math.PI / 8,
    maxPolarAngle: Math.PI / 2.1,
  },
};

export type TemporalLensLandmarkId = 'plaza-tower' | 'river-bridge' | 'observatory-dome';

export interface TemporalLensConfig {
  id: TemporalLensLandmarkId;
  name: string;
  district: ExploreDistrictId;
  description: string;
  center: [number, number, number];
}

export const TEMPORAL_LENS_LANDMARKS: Record<TemporalLensLandmarkId, TemporalLensConfig> = {
  'plaza-tower': {
    id: 'plaza-tower',
    name: 'Monumental Timepiece',
    district: 'plaza',
    description: 'Inspect alternate temporal incarnations of the Central Chronos Tower.',
    center: [0, 14, -125],
  },
  'river-bridge': {
    id: 'river-bridge',
    name: 'Grand River Span',
    district: 'river',
    description: 'Observe structural evolution from primeval causeway to maglev conduit.',
    center: [85, 6, -135],
  },
  'observatory-dome': {
    id: 'observatory-dome',
    name: 'Northern Observatory',
    district: 'observatory',
    description: 'Preview celestial instruments from ancient megaliths to tachyon arrays.',
    center: [0, 36, -345],
  },
};

export type TemporalEchoId =
  | 'echo-01-mark'
  | 'echo-02-record'
  | 'echo-03-metal'
  | 'echo-04-blueprint'
  | 'echo-05-signal';

export interface TemporalEchoConfig {
  id: TemporalEchoId;
  number: string;
  name: string;
  district: ExploreDistrictId;
  districtLabel: string;
  primaryEra: HistoricalEraId;
  yearLabel: string;
  artifactName: string;
  clue: string;
  position: [number, number, number];
  color: string;
}

export const TEMPORAL_ECHOES: Record<TemporalEchoId, TemporalEchoConfig> = {
  'echo-01-mark': {
    id: 'echo-01-mark',
    number: '01',
    name: 'THE FIRST MARK',
    district: 'plaza',
    districtLabel: 'CHRONOS PLAZA',
    primaryEra: 'the-origin',
    yearLabel: '1200 BCE',
    artifactName: 'Primeval Sundial Petroglyph',
    clue: 'The Chronos mechanism has roots millennia older than the modern city. An astronomical solstice alignment was carved into bedrock by ancient settlers.',
    position: [0, 1.8, -106],
    color: '#E6A85C',
  },
  'echo-02-record': {
    id: 'echo-02-record',
    number: '02',
    name: 'THE FAMILY RECORD',
    district: 'old-district',
    districtLabel: 'OLD DISTRICT',
    primaryEra: 'the-kingdom',
    yearLabel: '1450 CE',
    artifactName: 'Master Guild Ledger',
    clue: 'A mysterious recurring ouroboros emblem appears across six generations of guild master architects, hidden within the cathedral parish archives.',
    position: [-70, 4.2, -126],
    color: '#D4AF37',
  },
  'echo-03-metal': {
    id: 'echo-03-metal',
    number: '03',
    name: 'THE IMPOSSIBLE METAL',
    district: 'river',
    districtLabel: 'RIVER CROSSING',
    primaryEra: 'the-machine',
    yearLabel: '1890 CE',
    artifactName: 'Chronite Fragment 7-B',
    clue: 'An unoxidized metallic shard discovered beneath the central stone pier. Spectrometry reveals atomic density and quantum resonance impossible for 19th-century metallurgy.',
    position: [85, 2.8, -126],
    color: '#F97316',
  },
  'echo-04-blueprint': {
    id: 'echo-04-blueprint',
    number: '04',
    name: 'THE LOST BLUEPRINT',
    district: 'industry',
    districtLabel: 'INDUSTRIAL QUARTER',
    primaryEra: 'the-present',
    yearLabel: '2026 CE',
    artifactName: 'Declassified Harmonic Schematic',
    clue: 'Archived municipal municipal records prove early mechanical engineers accidentally stimulated localized temporal ripples in the machine district as early as 1890.',
    position: [-108, 4.0, 44],
    color: '#38BDF8',
  },
  'echo-05-signal': {
    id: 'echo-05-signal',
    number: '05',
    name: 'THE CELESTIAL SIGNAL',
    district: 'observatory',
    districtLabel: 'THE OBSERVATORY',
    primaryEra: 'the-next-age',
    yearLabel: '2200 CE',
    artifactName: 'Tachyon Harmonic Vector',
    clue: 'Decoded astronomical coordinates broadcasting along an inverted time carrier wave. All five historical anomalies converge on a single coordinate in spacetime.',
    position: [0, 34.2, -322],
    color: '#00F0FF',
  },
};

export const ORDERED_ECHO_IDS: TemporalEchoId[] = [
  'echo-01-mark',
  'echo-02-record',
  'echo-03-metal',
  'echo-04-blueprint',
  'echo-05-signal',
];
