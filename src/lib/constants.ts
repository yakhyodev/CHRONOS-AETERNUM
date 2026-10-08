export const CHRONOS_PALETTE = {
  voidBlack: '#08090D',
  darkStone: '#192025',
  stoneHighlight: '#2A343D',
  antiqueBronze: '#735536',
  bronzeDark: '#4A3520',
  warmGold: '#D4AF37',
  goldLight: '#FFE8B5',
  emberLight: '#EAB774',
  emberGlow: '#FF9E3D',
  ivoryText: '#F5F3ED',
} as const;

export type CinematicShotId = 'shot-01' | 'shot-02' | 'shot-03' | 'shot-04' | 'shot-05' | 'shot-06';

export interface CinematicShotConfig {
  id: CinematicShotId;
  number: string;
  name: string;
  label: string;
  description: string;
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  fov: number;
}

export const CINEMATIC_SHOTS: CinematicShotConfig[] = [
  {
    id: 'shot-01',
    number: '01',
    name: 'Wide Establishing',
    label: 'Chamber Entrance',
    description: 'Wide-angle view reveals the monumental ancient chamber and distant glowing core.',
    cameraPosition: [-1.5, 2.5, 25],
    targetPosition: [0.8, 3.3, 0],
    fov: 54,
  },
  {
    id: 'shot-02',
    number: '02',
    name: 'Slow Dolly In',
    label: 'Chamber Approach',
    description: 'Camera slowly advances toward the Chronos Core as foreground stone pillars emphasize depth.',
    cameraPosition: [-1.2, 2.2, 14],
    targetPosition: [0.8, 3.4, 0],
    fov: 48,
  },
  {
    id: 'shot-03',
    number: '03',
    name: 'Orbital Move',
    label: 'Axial Orbit',
    description: 'Controlled orbital movement around the mechanism revealing its 3D nested construction.',
    cameraPosition: [7.2, 3.8, 9.5],
    targetPosition: [0, 3.4, 0],
    fov: 44,
  },
  {
    id: 'shot-04',
    number: '04',
    name: 'Close-Up',
    label: 'Mechanism Details',
    description: 'Detailed view of the central luminous energy sphere and ancient engraved symbols.',
    cameraPosition: [2.8, 3.6, 5.2],
    targetPosition: [0, 3.5, 0],
    fov: 42,
  },
  {
    id: 'shot-05',
    number: '05',
    name: 'Activation',
    label: 'Temporal Pulse',
    description: 'Rings accelerate, the core blazes intensely, and an energy pulse resonates through the hall.',
    cameraPosition: [-1.6, 3.3, 6.8],
    targetPosition: [0.6, 3.5, 0],
    fov: 46,
  },
  {
    id: 'shot-06',
    number: '06',
    name: 'Transition',
    label: 'Horizon Portal',
    description: 'Camera glides into the center of the activated mechanism in a transition-ready state.',
    cameraPosition: [0, 3.5, 1.8],
    targetPosition: [0, 3.5, 0],
    fov: 52,
  },
];

export const PROJECT_STRINGS = {
  title: 'CHRONOS',
  subtitle: 'AETERNUM',
  tagline: 'TIME REMEMBERS EVERYTHING.',
  ctaPrimary: 'INITIALIZE CHRONOS',
  ctaActive: 'CHRONOS ACTIVE',
  scrollPrompt: 'SCROLL TO EXPLORE',
} as const;
