'use client';

import { OuterRing } from './OuterRing';
import { InnerRing } from './InnerRing';
import { CelestialMechanism } from './CelestialMechanism';
import { EnergySphere } from './EnergySphere';

interface ChronosCoreProps {
  activationProgress?: number;
}

export function ChronosCore({ activationProgress = 0 }: ChronosCoreProps) {
  return (
    <group position={[0, 3.5, 0]}>
      {/* 1. Large External Astronomical Ring with Mounting Pedestals */}
      <OuterRing activationProgress={activationProgress} />

      {/* 2. Multiple Independently Rotating Internal Rings */}
      <InnerRing activationProgress={activationProgress} />

      {/* 3. Celestial Mechanical Shafts, Spokes, and Gears */}
      <CelestialMechanism activationProgress={activationProgress} />

      {/* 4. Suspended Luminous Central Energy Core */}
      <EnergySphere activationProgress={activationProgress} />
    </group>
  );
}
