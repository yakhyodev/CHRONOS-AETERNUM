'use client';

import { StoneColumns } from './StoneColumns';
import { GrandArches } from './GrandArches';
import { ChamberFloor } from './ChamberFloor';
import { Braziers } from './Braziers';
import { WandererSilhouette } from './WandererSilhouette';

interface ChamberEnvironmentProps {
  activationProgress?: number;
}

export function ChamberEnvironment({ activationProgress = 0 }: ChamberEnvironmentProps) {
  return (
    <group>
      {/* Ancient Tiered Dais & Stairs */}
      <ChamberFloor />

      {/* Monumental Stone Colonnades */}
      <StoneColumns />

      {/* Grand Archways and Background Crypt */}
      <GrandArches />

      {/* Flanking Fire Braziers */}
      <Braziers activationProgress={activationProgress} />

      {/* Observer / Wanderer Silhouette */}
      <WandererSilhouette />
    </group>
  );
}
