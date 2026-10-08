/**
 * CHRONOS — Aeternum: Phase 09 Specifications
 * 
 * "The Paradox Finale" — Five Eras. One Fractured Reality. The Final Choice.
 */
export type ParadoxState =
  | 'inactive'
  | 'awakening'
  | 'unstable'
  | 'converging'
  | 'revelation'
  | 'awaiting-choice'
  | 'resolving'
  | 'completed';

export type ParadoxEnding = 'restore_time' | 'explore_unknown';

export interface ParadoxSequenceConfig {
  id: string;
  sequenceNumber: '01' | '02' | '03' | '04' | '05';
  title: string;
  subtitle: string;
  locationLabel: string;
  targetWorld: 'city' | 'chamber';
  cameraShot: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  durationSeconds: number;
  synopsis: string;
  transmissionLines: string[];
}

export const PARADOX_SEQUENCES: Record<number, ParadoxSequenceConfig> = {
  0: {
    id: 'seq-01-fracture-begins',
    sequenceNumber: '01',
    title: 'THE FRACTURE BEGINS',
    subtitle: 'TEMPORAL ENERGY ANOMALY AT CHRONOS PLAZA',
    locationLabel: 'CHRONOS PLAZA',
    targetWorld: 'city',
    cameraShot: {
      position: [0, 24, -75],
      target: [0, 22, -120],
      fov: 52,
    },
    durationSeconds: 12,
    synopsis:
      'The monumental clock tower resonates across multiple historical frequencies. Dual gold and cyan energy rings circulate above the plaza as architectural fragments dissolve between eras.',
    transmissionLines: [
      'OBSERVER 07 // ALERT: HARMONIC RUNAWAY AT CHRONOS PLAZA',
      'CLOCK TOWER OSCILLATION MEASURING NON-LINEAR TIME VECTORS.',
      'TEMPORAL ENERGY RINGS FORMING IN LOW STRATOSPHERE.',
      'REALITY IS SHEARING AT THE MUNICIPAL BEDROCK.',
    ],
  },
  1: {
    id: 'seq-02-core-unstable',
    sequenceNumber: '02',
    title: 'THE CORE UNSTABLE',
    subtitle: 'RESONANCE OVERLOAD IN MONUMENTAL CHAMBER',
    locationLabel: 'CHRONOS CORE CHAMBER',
    targetWorld: 'chamber',
    cameraShot: {
      position: [0, 3.8, 8.5],
      target: [0, 3.5, 0],
      fov: 48,
    },
    durationSeconds: 12,
    synopsis:
      'Returning to the subterranean vault, the astronomical rings of the Chronos Core spin out of sync. High-energy shockwaves pulse outward as the core exceeds safety tolerances.',
    transmissionLines: [
      'OBSERVER 07 // SUBTERRANEAN SENSORS CRITICAL',
      'CORE MECHANISM ACCELERATING PAST EQUILIBRIUM.',
      'ASTRONOMICAL RINGS ROTATING AT ASYNCHRONOUS SPEEDS.',
      'TEMPORAL SHOCKWAVES PROPAGATING THROUGH VAULT ARCHES.',
    ],
  },
  2: {
    id: 'seq-03-five-eras-collide',
    sequenceNumber: '03',
    title: 'FIVE ERAS COLLIDE',
    subtitle: 'CONVERGENCE OVER AETERNUM SKYLINE',
    locationLabel: 'AETERNUM SKYLINE',
    targetWorld: 'city',
    cameraShot: {
      position: [28, 36, -85],
      target: [0, 20, -120],
      fov: 56,
    },
    durationSeconds: 14,
    synopsis:
      'Ancient sandstone monoliths, medieval cathedral arches, Victorian iron trusses, modern high-rises, and futuristic energy spires manifest simultaneously in an art-directed fracture.',
    transmissionLines: [
      'OBSERVER 07 // MASS COLLISION DETECTED',
      'ALL FIVE ERAS OCCUPYING THE SAME SPATIAL CO-ORDINATES.',
      'ANCIENT BEDROCK INTERLOCKING WITH 2200 CE ENERGY SPIRES.',
      'THE CONTINUOUS TIMELINE IS COLLAPSING INTO A SINGULARITY.',
    ],
  },
  3: {
    id: 'seq-04-the-revelation',
    sequenceNumber: '04',
    title: 'THE REVELATION',
    subtitle: 'THE 2200 CE EMERGENCY BEACON',
    locationLabel: 'CHRONOS CORE VAULT',
    targetWorld: 'chamber',
    cameraShot: {
      position: [0, 3.4, 5.0],
      target: [0, 3.5, 0],
      fov: 44,
    },
    durationSeconds: 14,
    synopsis:
      'The recovered memories decrypt the terminal message: the Chronos Core was built in 2200 CE and dispatched backward through time to halt the paradox that would erase Aeternum.',
    transmissionLines: [
      'OBSERVER 07 // ARCHIVAL TRUTH DECODED',
      'THE CHRONOS CORE WAS BORN IN 2200 CE.',
      'DISPATCHED BACKWARD AS AN ANCHOR AGAINST ENTROPIC COLLAPSE.',
      'THE CRITICAL MOMENT HAS ARRIVED: YOU MUST CHOOSE.',
    ],
  },
  4: {
    id: 'seq-05-final-choice',
    sequenceNumber: '05',
    title: 'THE FINAL CHOICE',
    subtitle: 'RESTORE TIME OR EXPLORE THE UNKNOWN',
    locationLabel: 'THE THRESHOLD',
    targetWorld: 'chamber',
    cameraShot: {
      position: [0, 3.5, 6.2],
      target: [0, 3.5, 0],
      fov: 46,
    },
    durationSeconds: 0, // Pauses for user input
    synopsis:
      'The timeline pauses on the edge of oblivion. Observer 07 must decide whether to seal the temporal fractures and restore stable history, or keep the pathways open to explore alternate futures.',
    transmissionLines: [
      'OBSERVER 07 // AWAITING FINAL DIRECTIVE',
      'STABILIZE THE PRIMARY RECORD OR PRESERVE TEMPORAL PATHWAYS.',
      'AETERNUM AWAITS YOUR DECISION.',
    ],
  },
};

export interface EndingConfig {
  id: ParadoxEnding;
  title: string;
  tagline: string;
  accentColor: string;
  glowColor: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  consequences: string[];
  bannerHeadline: string;
  bannerSubline: string;
  cameraEndShot: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
}

export const ENDINGS_CONFIG: Record<ParadoxEnding, EndingConfig> = {
  restore_time: {
    id: 'restore_time',
    title: 'RESTORE TIME',
    tagline: 'Repair the Chronos Core and stabilize the historical timeline',
    accentColor: '#D4AF37',
    glowColor: 'rgba(212, 175, 55, 0.45)',
    borderClass: 'border-[#D4AF37]',
    bgClass: 'bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25',
    textClass: 'text-[#FFE8B5]',
    consequences: [
      'Re-aligns the astronomical rings to canonical 2026 equilibrium.',
      'Closes active temporal fissures across all five city districts.',
      'Preserves the authentic architectural memory of each distinct era.',
      'Restores peaceful civic harmony to Aeternum.',
    ],
    bannerHeadline: 'TIME IS WHOLE AGAIN.',
    bannerSubline: 'AETERNUM REMEMBERS.',
    cameraEndShot: {
      position: [0, 34, -45],
      target: [0, 18, -125],
      fov: 52,
    },
  },
  explore_unknown: {
    id: 'explore_unknown',
    title: 'EXPLORE THE UNKNOWN',
    tagline: 'Leave controlled temporal pathways open and explore possible futures',
    accentColor: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.45)',
    borderClass: 'border-cyan-400',
    bgClass: 'bg-cyan-500/15 hover:bg-cyan-500/25',
    textClass: 'text-cyan-200',
    consequences: [
      'Stabilizes the Core into a dual harmonic quantum beacon.',
      'Maintains open cross-era bridges and localized temporal portals.',
      'Unlocks permanent unrestricted historical scrubbing and exploration.',
      'Empowers Observer 07 to discover uncharted temporal trajectories.',
    ],
    bannerHeadline: 'THE FUTURE IS UNWRITTEN.',
    bannerSubline: 'YOUR JOURNEY CONTINUES.',
    cameraEndShot: {
      position: [12, 40, -55],
      target: [0, 22, -135],
      fov: 54,
    },
  },
};
