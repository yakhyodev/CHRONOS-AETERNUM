'use client';

import { OuterRing } from './OuterRing';
import { InnerRing } from './InnerRing';
import { CelestialMechanism } from './CelestialMechanism';
import { EnergySphere } from './EnergySphere';

export function ChronosCore() {
  return (
    <group position={[0, 3.5, 0]}>
      {/* 1. Large External Astronomical Ring with Mounting Pedestals */}
      <OuterRing />

      {/* 2. Multiple Independently Rotating Internal Rings */}
      <InnerRing />

      {/* 3. Celestial Mechanical Shafts, Spokes, and Gears */}
      <CelestialMechanism />

      {/* 4. Suspended Luminous Central Energy Core */}
      <EnergySphere />
    </group>
  );
}
