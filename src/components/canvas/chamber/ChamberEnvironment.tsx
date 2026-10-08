'use client';

import { StoneColumns } from './StoneColumns';
import { GrandArches } from './GrandArches';
import { ChamberFloor } from './ChamberFloor';
import { Braziers } from './Braziers';
import { WandererSilhouette } from './WandererSilhouette';

export function ChamberEnvironment() {
  return (
    <group>
      {/* Ancient Tiered Dais & Stairs */}
      <ChamberFloor />

      {/* Monumental Stone Colonnades */}
      <StoneColumns />

      {/* Grand Archways and Background Crypt */}
      <GrandArches />

      {/* Flanking Fire Braziers */}
      <Braziers />

      {/* Observer / Wanderer Silhouette */}
      <WandererSilhouette />
    </group>
  );
}
