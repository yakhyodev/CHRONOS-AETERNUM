/**
 * CHRONOS — Aeternum: Phase 04 Specifications
 * 
 * Continuous 8-Segment Cinematic Journey across the 5 Districts of Aeternum.
 */
import * as THREE from 'three';

export type CinematicSegmentId =
  | 'grand-arrival'
  | 'old-district'
  | 'river-reveal'
  | 'above-water'
  | 'machine-district'
  | 'ascent-observatory'
  | 'the-observatory'
  | 'return-chronos';

export interface CinematicSegmentConfig {
  id: CinematicSegmentId;
  number: string;
  title: string;
  district: string;
  progressStart: number;
  progressEnd: number;
  description: string;
}

export const CINEMATIC_SEGMENTS: CinematicSegmentConfig[] = [
  {
    id: 'grand-arrival',
    number: '01',
    title: 'GRAND ARRIVAL',
    district: 'CHRONOS PLAZA',
    progressStart: 0.0,
    progressEnd: 0.12,
    description: 'Establishing wide view over the central plaza and monumental clock tower.',
  },
  {
    id: 'old-district',
    number: '02',
    title: 'INTO THE OLD WORLD',
    district: 'OLD DISTRICT',
    progressStart: 0.12,
    progressEnd: 0.28,
    description: 'Descending between historic stone facades, timber balconies, and cathedral spires.',
  },
  {
    id: 'river-reveal',
    number: '03',
    title: 'THE RIVER REVEAL',
    district: 'RIVER CROSSING',
    progressStart: 0.28,
    progressEnd: 0.42,
    description: 'Rising above historic rooftops to reveal the winding river and monumental bridge.',
  },
  {
    id: 'above-water',
    number: '04',
    title: 'ABOVE THE WATER',
    district: 'RIVER CROSSING',
    progressStart: 0.42,
    progressEnd: 0.56,
    description: 'Low glide alongside the stone arches and reflecting waters toward the south.',
  },
  {
    id: 'machine-district',
    number: '05',
    title: 'THE MACHINE DISTRICT',
    district: 'INDUSTRIAL QUARTER',
    progressStart: 0.56,
    progressEnd: 0.70,
    description: 'Passing historic brick factories, towering chimneys, and structural ironwork.',
  },
  {
    id: 'ascent-observatory',
    number: '06',
    title: 'ASCENT TO THE OBSERVATORY',
    district: 'NORTHERN HILLS',
    progressStart: 0.70,
    progressEnd: 0.82,
    description: 'Rising above the city skyline toward the elevated northern mountain peak.',
  },
  {
    id: 'the-observatory',
    number: '07',
    title: 'THE OBSERVATORY',
    district: 'THE OBSERVATORY',
    progressStart: 0.82,
    progressEnd: 0.92,
    description: 'Orbiting the astronomical dome and mountain terrace overlooking Aeternum.',
  },
  {
    id: 'return-chronos',
    number: '08',
    title: 'RETURN TO CHRONOS',
    district: 'CHRONOS PLAZA',
    progressStart: 0.92,
    progressEnd: 1.0,
    description: 'Sweeping descent back to Chronos Plaza for the final heroic composition.',
  },
];

/**
 * Authored continuous 3D Spline Path for the Camera Position
 */
export const CAMERA_JOURNEY_WAYPOINTS: THREE.Vector3[] = [
  // Segment 01: Grand Arrival (Plaza)
  new THREE.Vector3(0, 16, -72),
  new THREE.Vector3(0, 10, -92),

  // Segment 02: Into the Old World (Old District)
  new THREE.Vector3(-32, 9, -108),
  new THREE.Vector3(-66, 6, -126),
  new THREE.Vector3(-82, 7, -142),

  // Segment 03: The River Reveal
  new THREE.Vector3(-55, 24, -132),
  new THREE.Vector3(15, 26, -112),
  new THREE.Vector3(56, 18, -106),

  // Segment 04: Above the Water (Bridge Flyover)
  new THREE.Vector3(72, 8, -102),
  new THREE.Vector3(86, 7, -122),
  new THREE.Vector3(88, 11, -145),

  // Segment 05: The Machine District (Industrial Quarter)
  new THREE.Vector3(30, 18, -112),
  new THREE.Vector3(-36, 15, -74),
  new THREE.Vector3(-68, 12, -64),

  // Segment 06: Ascent to the Observatory
  new THREE.Vector3(-40, 28, -112),
  new THREE.Vector3(-10, 42, -165),
  new THREE.Vector3(16, 48, -206),

  // Segment 07: The Observatory Orbit
  new THREE.Vector3(26, 46, -216),
  new THREE.Vector3(56, 48, -226),
  new THREE.Vector3(50, 44, -246),

  // Segment 08: Return to Chronos
  new THREE.Vector3(25, 36, -182),
  new THREE.Vector3(0, 20, -140),
  new THREE.Vector3(-14, 12, -98),
  new THREE.Vector3(0, 8.5, -86),
];

/**
 * Authored continuous 3D Spline Path for the Camera LookAt Target
 */
export const CAMERA_LOOKAT_WAYPOINTS: THREE.Vector3[] = [
  // Segment 01: Grand Arrival
  new THREE.Vector3(0, 26, -126),
  new THREE.Vector3(0, 24, -126),

  // Segment 02: Into the Old World
  new THREE.Vector3(-52, 12, -125),
  new THREE.Vector3(-82, 14, -145),
  new THREE.Vector3(-88, 20, -140),

  // Segment 03: The River Reveal
  new THREE.Vector3(0, 16, -125),
  new THREE.Vector3(76, 6, -125),
  new THREE.Vector3(86, 3, -135),

  // Segment 04: Above the Water
  new THREE.Vector3(86, 4, -122),
  new THREE.Vector3(96, 3, -140),
  new THREE.Vector3(-20, 16, -110),

  // Segment 05: The Machine District
  new THREE.Vector3(-56, 12, -76),
  new THREE.Vector3(-76, 16, -82),
  new THREE.Vector3(-70, 8, -86),

  // Segment 06: Ascent to the Observatory
  new THREE.Vector3(36, 36, -226),
  new THREE.Vector3(40, 38, -230),
  new THREE.Vector3(40, 36, -230),

  // Segment 07: The Observatory Orbit
  new THREE.Vector3(40, 36, -230),
  new THREE.Vector3(40, 36, -230),
  new THREE.Vector3(40, 34, -230),

  // Segment 08: Return to Chronos
  new THREE.Vector3(0, 26, -125),
  new THREE.Vector3(0, 24, -125),
  new THREE.Vector3(0, 22, -125),
  new THREE.Vector3(0, 20, -125),
];
