/**
 * CHRONOS — Aeternum: Phase 08 Narrative Specifications
 * 
 * "The City Remembers" — Observer 07, Temporal Echoes & Cinematic Narrative
 */
import { type HistoricalEraId } from './phase03';
import { type ExploreDistrictId, type TemporalEchoId } from './phase07';

export type NarrativeChapterId =
  | 'ch-01-awakening'
  | 'ch-02-first-memory'
  | 'ch-03-pattern'
  | 'ch-04-experiment'
  | 'ch-05-revelation'
  | 'ch-06-warning';

export interface NarrativeChapterConfig {
  id: NarrativeChapterId;
  number: string;
  title: string;
  subtitle: string;
  district: ExploreDistrictId | 'chamber';
  districtLabel: string;
  eraId?: HistoricalEraId;
  yearLabel: string;
  requiredEchoId?: TemporalEchoId;
  synopsis: string;
  transmissionLines: string[];
  revelationText: string;
}

export const NARRATIVE_CHAPTERS: Record<NarrativeChapterId, NarrativeChapterConfig> = {
  'ch-01-awakening': {
    id: 'ch-01-awakening',
    number: 'CHAPTER 01',
    title: 'THE AWAKENING',
    subtitle: 'THE PULSE BENEATH THE FOUNDATION',
    district: 'chamber',
    districtLabel: 'CHRONOS CHAMBER',
    yearLabel: 'UNKNOWN ERA',
    synopsis: 'Deep in the subterranean monumental vault, the dormant Chronos Core stirs. Observer 07 is awakened by a harmonic resonance carrier wave.',
    transmissionLines: [
      'TRANSMISSION // DESIGNATION: OBSERVER 07',
      'CARRIER WAVE DETECTED. THE CHRONOS CORE HAS STIRRED.',
      'TEMPORAL FRACTURES REPORTED ACROSS FIVE DISTRICTS.',
      'FOLLOW THE ECHOES. RECONSTRUCT WHAT HAS BEEN FORGOTTEN.',
    ],
    revelationText: 'The Core is not a static archaeological artifact. It is an active receiver awaiting alignment.',
  },
  'ch-02-first-memory': {
    id: 'ch-02-first-memory',
    number: 'CHAPTER 02',
    title: 'THE FIRST MEMORY',
    subtitle: 'PETROGLYPHS OF THE FIRST FOUNDATION',
    district: 'plaza',
    districtLabel: 'CHRONOS PLAZA',
    eraId: 'the-origin',
    yearLabel: '1200 BCE',
    requiredEchoId: 'echo-01-mark',
    synopsis: 'The Primeval Sundial Petroglyph reveals ancient bedrock carvings of the Chronos Ouroboros millennia before modern foundation stones were laid.',
    transmissionLines: [
      'OBSERVER 07 // ARCHIVAL DECODE: 1200 BCE',
      'PRIMEVAL CARVINGS MATCH 2026 MATHEMATICAL TOLERANCES.',
      'THE FIRST SETTLERS DID NOT CONSTRUCT THE MECHANISM.',
      'THEY BUILT THEIR SHRINE AROUND SOMETHING ALREADY BURIED.',
    ],
    revelationText: 'The symbol of the Chronos Core was revered long before written chronicles began.',
  },
  'ch-03-pattern': {
    id: 'ch-03-pattern',
    number: 'CHAPTER 03',
    title: 'THE RECURRING PATTERN',
    subtitle: 'THE IMPOSSIBLE METALLURGY & THE GUILD',
    district: 'river',
    districtLabel: 'OLD DISTRICT & RIVER CROSSING',
    eraId: 'the-machine',
    yearLabel: '1450 & 1890 CE',
    requiredEchoId: 'echo-03-metal',
    synopsis: 'Master guild ledgers and an unoxidized metallic fragment dredged beneath the river bridge show identical atomic structures spanning centuries.',
    transmissionLines: [
      'OBSERVER 07 // CORRELATION LOG: 1450–1890 CE',
      'CHRONITE FRAGMENT 7-B RETRIEVED FROM RIVER BEDROCK.',
      'ZERO ATOMIC OXIDATION. ISOTOPE HALF-LIFE INVERTED.',
      'A SINGLE GEOMETRIC CYPHER REPEATS ACROSS SIX GENERATIONS.',
    ],
    revelationText: 'The metallic alloy cannot be forged by 19th-century steam metallurgy. It possesses quantum lattice properties.',
  },
  'ch-04-experiment': {
    id: 'ch-04-experiment',
    number: 'CHAPTER 04',
    title: 'THE EXPERIMENT',
    subtitle: 'THE UNCONTROLLED RESONANCE TEST',
    district: 'industry',
    districtLabel: 'INDUSTRIAL QUARTER',
    eraId: 'the-present',
    yearLabel: '2026 CE',
    requiredEchoId: 'echo-04-blueprint',
    synopsis: 'Classified engineering records from the 2026 municipal excavation prove scientists forced artificial harmonic resonance into the Core.',
    transmissionLines: [
      'OBSERVER 07 // MUNICIPAL INCIDENT LOG: 2026 CE',
      'RESEARCH TEAM INJECTED HIGH-FREQUENCY HARMONICS.',
      'THE CORE DID NOT ABSORB ENERGY — IT TRANSMITTED.',
      'TEMPORAL REFLECTION SPREAD RADIALLY THROUGH THE GROUND.',
    ],
    revelationText: 'The 2026 activation did not power the device. It triggered a localized temporal fracture across the city.',
  },
  'ch-05-revelation': {
    id: 'ch-05-revelation',
    number: 'CHAPTER 05',
    title: 'THE REVELATION',
    subtitle: 'THE BEACON FROM 2200 CE',
    district: 'observatory',
    districtLabel: 'THE OBSERVATORY',
    eraId: 'the-next-age',
    yearLabel: '2200 CE',
    requiredEchoId: 'echo-05-signal',
    synopsis: 'The Tachyon signal decoded at the mountain observatory dome reveals the Core was sent backward in time from 2200 CE to warn Aeternum of an impending collapse.',
    transmissionLines: [
      'OBSERVER 07 // TACHYON DECODE: 2200 CE',
      'ORIGIN VECTOR CONFIRMED: THE CORE IS NOT ANCIENT.',
      'IT WAS SENT BACKWARD FROM THE FUTURE.',
      'A BEACON CREATED IN 2200 TO WARN AETERNUM BEFORE THE FALL.',
    ],
    revelationText: 'The Chronos Core was dispatched upstream against the flow of time. It is a lifeboat of memory from an era that did not survive.',
  },
  'ch-06-warning': {
    id: 'ch-06-warning',
    number: 'CHAPTER 06',
    title: 'THE WARNING',
    subtitle: 'THE HARMONIC ALIGNMENT',
    district: 'plaza',
    districtLabel: 'CHRONOS PLAZA',
    yearLabel: 'CONVERGENCE',
    synopsis: 'With all five Echoes assembled, the timeline stabilizes momentarily. An unresolved terminal message echoes from the center of the mechanism.',
    transmissionLines: [
      'OBSERVER 07 // CONVERGENCE REACHED',
      'ALL FIVE TEMPORAL VECTORS ALIGNED IN REGISTER.',
      'THE REALITY FRACTURE IS GROWING AT THE SEAMS.',
      '"THE PAST REMEMBERS. THE FUTURE IS WAITING."',
    ],
    revelationText: 'The fragments are whole, but the true test approaches. The city stands on the threshold of temporal collapse.',
  },
};

export const ORDERED_CHAPTER_IDS: NarrativeChapterId[] = [
  'ch-01-awakening',
  'ch-02-first-memory',
  'ch-03-pattern',
  'ch-04-experiment',
  'ch-05-revelation',
  'ch-06-warning',
];

export function getChapter06Content(echoesCount: number): {
  transmissionLines: string[];
  revelationText: string;
  isComplete: boolean;
} {
  if (echoesCount >= 5) {
    return {
      isComplete: true,
      transmissionLines: [
        'OBSERVER 07 // COMPLETE CONVERGENCE (5/5 ECHOES)',
        'ALL FIVE TEMPORAL VECTORS ALIGNED IN REGISTER.',
        'THE REALITY FRACTURE IS GROWING AT THE SEAMS.',
        '"THE PAST REMEMBERS. THE FUTURE IS WAITING."',
      ],
      revelationText:
        'Complete reconstructed warning: The Chronos Core was engineered in 2200 CE to prevent total entropy collapse. All five temporal vectors confirm the timeline fracture must now be resolved.',
    };
  }

  return {
    isComplete: false,
    transmissionLines: [
      `OBSERVER 07 // PARTIAL CONVERGENCE (${echoesCount}/5 ECHOES)`,
      'TEMPORAL ARCHIVE INCOMPLETE, BUT HARMONIC CASCADE DETECTED.',
      'THE TIMELINE FRACTURE THREATENS RUNAWAY COLLAPSE.',
      '"THE CORE CANNOT SUSTAIN THIS FRACTURE WITHOUT A RESOLUTION."',
    ],
    revelationText:
      `Shortened revelation: With ${echoesCount}/5 Echoes recovered, the archival record is partial. Yet the Chronos Core has reached critical instability. You may initiate the primary finale immediately.`,
  };
}

export interface EchoNarrativeMemory {
  echoId: TemporalEchoId;
  chapterId: NarrativeChapterId;
  artifactClassification: string;
  discoveredLocation: string;
  historicalPeriod: string;
  archivalMemory: string;
  observerInsight: string;
  revelationQuote: string;
}

export const ECHO_NARRATIVE_MEMORIES: Record<TemporalEchoId, EchoNarrativeMemory> = {
  'echo-01-mark': {
    echoId: 'echo-01-mark',
    chapterId: 'ch-02-first-memory',
    artifactClassification: 'PRIMITIVE MEGALITHIC PETROGLYPH',
    discoveredLocation: 'Central Civic Forum Bedrock',
    historicalPeriod: '1200 BCE (The Origin)',
    archivalMemory:
      'Solstice sunlight passes through carved stone notches, casting a shadow that forms the exact concentric geometry of the Chronos Core.',
    observerInsight:
      'Settlers of the bronze age regarded the subterranean hum as the heartbeat of the earth. They knew the symbol, but not the science.',
    revelationQuote: '"They knelt before what had not yet been built."',
  },
  'echo-02-record': {
    echoId: 'echo-02-record',
    chapterId: 'ch-03-pattern',
    artifactClassification: 'ILLUMINATED GUILD ARCHIVE LEDGER',
    discoveredLocation: 'Western Quarter Parish Crypt',
    historicalPeriod: '1450 CE (The Kingdom)',
    archivalMemory:
      'A ledger kept by master masons records anomalous vibrations in the foundation trenches. The master builder drew the ouroboros seal in the margin with the note: "It pulses when the bells toll."',
    observerInsight:
      'The guild architects were unknowingly guided by the harmonic resonance beneath the city soil.',
    revelationQuote: '"Generations pass, but the pattern remains unbroken."',
  },
  'echo-03-metal': {
    echoId: 'echo-03-metal',
    chapterId: 'ch-03-pattern',
    artifactClassification: 'QUANTUM CHRONITE ALLOY 7-B',
    discoveredLocation: 'Eastern River Quay Embankment Pier',
    historicalPeriod: '1890 CE (The Machine)',
    archivalMemory:
      'Dredged during the construction of the Victorian railway bridge. Metallurgists could not melt or scratch the fragment, noting its temperature remained precisely 4 degrees Celsius under intense flame.',
    observerInsight:
      'A manufactured alloy with molecular crystallization impossible without quantum zero-gravity forging techniques.',
    revelationQuote: '"A metal from tomorrow buried under yesterday."',
  },
  'echo-04-blueprint': {
    echoId: 'echo-04-blueprint',
    chapterId: 'ch-04-experiment',
    artifactClassification: 'DECLASSIFIED HARMONIC SCHEMATIC',
    discoveredLocation: 'Southwestern Loft Substation Vault',
    historicalPeriod: '2026 CE (The Present)',
    archivalMemory:
      'Diagrams and wave-propagation plots from the municipal physics team. Handwritten notes in red ink indicate panic: "Phase shift non-linear. The machine is drawing time, not electricity."',
    observerInsight:
      'The 2026 experiment attempted to force the Core awake, inadvertently shattering temporal cohesion and leaving five eras overlapping.',
    revelationQuote: '"They believed they were inventors. They were merely detonators."',
  },
  'echo-05-signal': {
    echoId: 'echo-05-signal',
    chapterId: 'ch-05-revelation',
    artifactClassification: 'TACHYON POLARIZATION VECTOR RECORD',
    discoveredLocation: 'High Terrace Astrolabe Promontory',
    historicalPeriod: '2200 CE (The Next Age)',
    archivalMemory:
      'High-energy particle telemetry decoded at the northern celestial dome. The message is an encrypted dispatch from survivors in 2200 CE, confirming the deployment of the Chronos Core backward through time.',
    observerInsight:
      'The Chronos Core was not created in the past. It is an emergency warning device sent from the future to avert the catastrophic collapse of Aeternum.',
    revelationQuote: '"We sent the Core to the origin so you would find it before the end."',
  },
};
