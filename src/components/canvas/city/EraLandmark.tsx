'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';
import { getTemporalMorphState } from '@/types/phase06';

export function EraLandmark() {
  // References for all 5 landmark era variant groups
  const originGroupRef = useRef<THREE.Group>(null);
  const kingdomGroupRef = useRef<THREE.Group>(null);
  const machineGroupRef = useRef<THREE.Group>(null);
  const presentGroupRef = useRef<THREE.Group>(null);
  const nextAgeGroupRef = useRef<THREE.Group>(null);

  // Moving mechanism refs
  const gearsRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const energyCoreRef = useRef<THREE.Mesh>(null);

  // Materials palette for all 5 historical eras
  const materials = useMemo(() => {
    return {
      // 1200 BCE materials
      primevalSandstone: new THREE.MeshStandardMaterial({
        color: '#C2A378',
        roughness: 0.9,
        metalness: 0.08,
      }),
      crudeBronze: new THREE.MeshStandardMaterial({
        color: '#A87034',
        roughness: 0.65,
        metalness: 0.75,
      }),
      fireGlow: new THREE.MeshBasicMaterial({
        color: '#FF6B1A',
      }),

      // 1450 CE materials
      medievalAshlar: new THREE.MeshStandardMaterial({
        color: '#A09686',
        roughness: 0.85,
        metalness: 0.1,
      }),
      timberHoarding: new THREE.MeshStandardMaterial({
        color: '#5C4028',
        roughness: 0.75,
        metalness: 0.05,
      }),
      agedCopperRoof: new THREE.MeshStandardMaterial({
        color: '#4B7B68',
        roughness: 0.6,
        metalness: 0.45,
      }),
      bellBronze: new THREE.MeshStandardMaterial({
        color: '#B08836',
        roughness: 0.4,
        metalness: 0.8,
      }),

      // 1890 CE materials
      victorianBrick: new THREE.MeshStandardMaterial({
        color: '#823828',
        roughness: 0.85,
        metalness: 0.12,
      }),
      rivetedIron: new THREE.MeshStandardMaterial({
        color: '#282C30',
        roughness: 0.6,
        metalness: 0.85,
      }),
      brassMachinery: new THREE.MeshStandardMaterial({
        color: '#D4A045',
        roughness: 0.35,
        metalness: 0.88,
      }),
      gasFlame: new THREE.MeshBasicMaterial({
        color: '#FF8A24',
      }),

      // 2026 CE materials
      civicSandstone: new THREE.MeshStandardMaterial({
        color: '#D4C2A8',
        roughness: 0.72,
        metalness: 0.18,
      }),
      darkGranite: new THREE.MeshStandardMaterial({
        color: '#2A3035',
        roughness: 0.82,
        metalness: 0.15,
      }),
      goldCupola: new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        roughness: 0.3,
        metalness: 0.85,
      }),
      clockDialLuminous: new THREE.MeshStandardMaterial({
        color: '#FFF2D6',
        emissive: '#FFB84D',
        emissiveIntensity: 1.8,
        roughness: 0.2,
      }),

      // 2200 CE materials
      darkObsidian: new THREE.MeshStandardMaterial({
        color: '#0E1318',
        roughness: 0.2,
        metalness: 0.95,
      }),
      hologramCyan: new THREE.MeshBasicMaterial({
        color: '#00F0FF',
        transparent: true,
        opacity: 0.85,
        wireframe: true,
      }),
      chroniteCrystal: new THREE.MeshStandardMaterial({
        color: '#104A68',
        emissive: '#00D4FF',
        emissiveIntensity: 1.5,
        roughness: 0.15,
        metalness: 0.8,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  // Frame animation: continuous temporal morphing between active pair
  useFrame((state, delta) => {
    const pos = chronosStore.timelinePosition;
    const { eraA, eraB, blendFactor } = getTemporalMorphState(pos);

    // Update visibility and scale morph for each era group without per-frame object allocations
    const updateEraGroup = (group: THREE.Group | null, eraKey: string) => {
      if (!group) return;
      if (eraKey === eraA) {
        group.visible = blendFactor < 0.98;
        const scaleVal = 1.0 - blendFactor * 0.25;
        group.scale.set(scaleVal, scaleVal, scaleVal);
        group.position.y = -blendFactor * 1.5;
      } else if (eraKey === eraB) {
        group.visible = blendFactor > 0.02;
        const scaleVal = 0.75 + blendFactor * 0.25;
        group.scale.set(scaleVal, scaleVal, scaleVal);
        group.position.y = (1.0 - blendFactor) * -1.5;
      } else {
        group.visible = false;
      }
    };

    updateEraGroup(originGroupRef.current, 'the-origin');
    updateEraGroup(kingdomGroupRef.current, 'the-kingdom');
    updateEraGroup(machineGroupRef.current, 'the-machine');
    updateEraGroup(presentGroupRef.current, 'the-present');
    updateEraGroup(nextAgeGroupRef.current, 'the-next-age');

    // 1890 Mechanical gears rotation
    if (gearsRef.current && !chronosStore.isTimeFrozen) {
      gearsRef.current.rotation.z += delta * 0.8;
    }

    // 2200 Levitating rings and pulsing energy core
    if (ringsRef.current && !chronosStore.isTimeFrozen) {
      ringsRef.current.rotation.y += delta * 1.2;
      ringsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
    }
    if (energyCoreRef.current && !chronosStore.isTimeFrozen) {
      const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.15;
      energyCoreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 0, -124]} name="EraLandmark_MorphSystem">
      {/* ================================================================== */}
      {/* ERA 01: 1200 BCE — THE PRIMORDIAL SUNDIAL & MONOLITH RING         */}
      {/* ================================================================== */}
      <group ref={originGroupRef} name="Era01_Sundial" visible={false}>
        {/* Stepped Earth & Sandstone Monolith Dais */}
        <mesh position={[0, 1.5, 0]} receiveShadow material={materials.primevalSandstone}>
          <cylinderGeometry args={[14, 16, 3, 16]} />
        </mesh>
        <mesh position={[0, 3.5, 0]} receiveShadow material={materials.primevalSandstone}>
          <cylinderGeometry args={[10, 12, 1.5, 16]} />
        </mesh>

        {/* Colossal Inclined Bronze Gnomon (Ancient Sun Pointer) */}
        <mesh
          position={[0, 14, 2]}
          rotation={[-Math.PI / 6, 0, 0]}
          castShadow
          material={materials.crudeBronze}
        >
          <cylinderGeometry args={[0.4, 2.8, 28, 8]} />
        </mesh>

        {/* Gnomon Base Monolith Anchor */}
        <mesh position={[0, 5, 0]} castShadow material={materials.primevalSandstone}>
          <boxGeometry args={[5, 4, 6]} />
        </mesh>

        {/* Concentric Ring of 12 Megalithic Standing Stones */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 13.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const height = 6 + (i % 3) * 1.5;
          return (
            <group key={`megalith-${i}`} position={[x, 0, z]} rotation={[0, -angle, 0]}>
              <mesh position={[0, height / 2 + 1, 0]} castShadow material={materials.primevalSandstone}>
                <boxGeometry args={[1.8, height, 1.2]} />
              </mesh>
              {i % 3 === 0 && (
                <mesh position={[0, height + 1.4, 0]} material={materials.crudeBronze}>
                  <coneGeometry args={[1.1, 1.5, 4]} />
                </mesh>
              )}
            </group>
          );
        })}

        {/* Central Bronze Fire Brazier Basin */}
        <mesh position={[0, 4.5, -4]} material={materials.crudeBronze}>
          <cylinderGeometry args={[1.8, 1.2, 1.4, 12]} />
        </mesh>
        <mesh position={[0, 5.4, -4]} material={materials.fireGlow}>
          <sphereGeometry args={[0.8, 8, 8]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* ERA 02: 1450 CE — THE KINGDOM CLOCK TOWER & MEDIEVAL BELFRY        */}
      {/* ================================================================== */}
      <group ref={kingdomGroupRef} name="Era02_Belfry" visible={false}>
        {/* Fortress Ashlar Stone Base (0 to 14m) */}
        <mesh position={[0, 7, 0]} castShadow receiveShadow material={materials.medievalAshlar}>
          <boxGeometry args={[12, 14, 12]} />
        </mesh>
        {/* Timber Machicolation Overhang (14 to 22m) */}
        <mesh position={[0, 18, 0]} castShadow receiveShadow material={materials.timberHoarding}>
          <boxGeometry args={[13.5, 8, 13.5]} />
        </mesh>
        {/* Belfry Tower Shaft (22 to 34m) */}
        <mesh position={[0, 28, 0]} castShadow receiveShadow material={materials.medievalAshlar}>
          <boxGeometry args={[10, 12, 10]} />
        </mesh>
        {/* Open Belfry Bell Chamber (34 to 42m) */}
        <mesh position={[0, 38, 0]} castShadow material={materials.timberHoarding}>
          <boxGeometry args={[11, 8, 11]} />
        </mesh>
        {/* Medieval Bronze Great Bell in chamber */}
        <mesh position={[0, 38, 0]} castShadow material={materials.bellBronze}>
          <cylinderGeometry args={[1.4, 2.4, 3.2, 16]} />
        </mesh>
        {/* Historic Copper Conical Spire (42 to 54m) */}
        <mesh position={[0, 48, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={materials.agedCopperRoof}>
          <coneGeometry args={[7.5, 14, 4]} />
        </mesh>
        {/* Corner Turret Finials */}
        {[-5.5, 5.5].map((x) =>
          [-5.5, 5.5].map((z) => (
            <mesh key={`turret-${x}-${z}`} position={[x, 43, z]} rotation={[0, Math.PI / 4, 0]} material={materials.agedCopperRoof}>
              <coneGeometry args={[1.6, 5, 4]} />
            </mesh>
          ))
        )}
        {/* Early Escapement Clock Face (South) */}
        <mesh position={[0, 31, 5.1]} rotation={[0, 0, 0]} material={materials.bellBronze}>
          <cylinderGeometry args={[2.8, 2.8, 0.3, 24]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* ERA 03: 1890 CE — THE STEAM CHRONOMETER & IRON LATTICE TOWER       */}
      {/* ================================================================== */}
      <group ref={machineGroupRef} name="Era03_SteamClock" visible={false}>
        {/* Red Kiln Brick Industrial Base (0 to 14m) */}
        <mesh position={[0, 7, 0]} castShadow receiveShadow material={materials.victorianBrick}>
          <boxGeometry args={[13, 14, 13]} />
        </mesh>
        {/* Riveted Iron Corner Piers */}
        {[-6.6, 6.6].map((x) =>
          [-6.6, 6.6].map((z) => (
            <mesh key={`iron-pier-${x}-${z}`} position={[x, 7, z]} castShadow material={materials.rivetedIron}>
              <boxGeometry args={[1.8, 14, 1.8]} />
            </mesh>
          ))
        )}
        {/* Heavy Iron Lattice Framework Shaft (14 to 34m) */}
        <mesh position={[0, 24, 0]} castShadow material={materials.rivetedIron}>
          <boxGeometry args={[9, 20, 9]} />
        </mesh>
        {/* Open Machinery Room with Rotating Brass Gears */}
        <group ref={gearsRef} position={[0, 24, 4.6]}>
          <mesh material={materials.brassMachinery}>
            <cylinderGeometry args={[2.4, 2.4, 0.4, 16]} />
          </mesh>
          <mesh position={[2.8, 1.2, 0]} material={materials.brassMachinery}>
            <cylinderGeometry args={[1.6, 1.6, 0.4, 12]} />
          </mesh>
        </group>
        {/* Cast-Iron Observation Balustrade (34 to 37m) */}
        <mesh position={[0, 35.5, 0]} castShadow material={materials.rivetedIron}>
          <boxGeometry args={[12, 3, 12]} />
        </mesh>
        {/* Dial Housing and Victorian Bell Tower (37 to 46m) */}
        <mesh position={[0, 41.5, 0]} castShadow material={materials.victorianBrick}>
          <boxGeometry args={[10, 9, 10]} />
        </mesh>
        {/* Black & Brass Clock Dials */}
        <mesh position={[0, 41.5, 5.1]} rotation={[Math.PI / 2, 0, 0]} material={materials.brassMachinery}>
          <cylinderGeometry args={[3.2, 3.2, 0.3, 24]} />
        </mesh>
        <mesh position={[0, 41.5, 5.3]} rotation={[Math.PI / 2, 0, 0]} material={materials.gasFlame}>
          <cylinderGeometry args={[2.5, 2.5, 0.1, 24]} />
        </mesh>
        {/* Twin Steam Vents & Smoke Exhaust Chimneys */}
        <mesh position={[-3, 49, -3]} material={materials.rivetedIron}>
          <cylinderGeometry args={[0.5, 0.6, 8, 12]} />
        </mesh>
        <mesh position={[3, 49, -3]} material={materials.rivetedIron}>
          <cylinderGeometry args={[0.5, 0.6, 8, 12]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* ERA 04: 2026 CE — THE RESTORED CENTURY CLOCK TOWER                 */}
      {/* ================================================================== */}
      <group ref={presentGroupRef} name="Era04_RestoredClock" visible={true}>
        {/* Plinth and Entrance Base (0 to 12m) */}
        <mesh position={[0, 6, 0]} castShadow receiveShadow material={materials.civicSandstone}>
          <boxGeometry args={[13, 12, 13]} />
        </mesh>
        {/* Portico Buttresses */}
        {[-7, 7].map((x) =>
          [-7, 7].map((z) => (
            <mesh key={`pres-buttress-${x}-${z}`} position={[x, 5.5, z]} castShadow material={materials.darkGranite}>
              <boxGeometry args={[2.5, 11, 2.5]} />
            </mesh>
          ))
        )}
        {/* Tower Shaft with Gothic Pilasters (12 to 34m) */}
        <mesh position={[0, 23, 0]} castShadow receiveShadow material={materials.civicSandstone}>
          <boxGeometry args={[10, 22, 10]} />
        </mesh>
        {/* Shaft Fluted Corner Buttresses */}
        {[-5.4, 5.4].map((x) =>
          [-5.4, 5.4].map((z) => (
            <mesh key={`pres-shaft-corner-${x}-${z}`} position={[x, 23, z]} castShadow material={materials.darkGranite}>
              <boxGeometry args={[1.6, 22, 1.6]} />
            </mesh>
          ))
        )}
        {/* Clock Chamber (34 to 42m) */}
        <mesh position={[0, 38, 0]} castShadow receiveShadow material={materials.civicSandstone}>
          <boxGeometry args={[11.2, 8, 11.2]} />
        </mesh>
        {/* Luminous Clock Dials on 4 Faces */}
        <mesh position={[0, 38, 5.7]} rotation={[Math.PI / 2, 0, 0]} material={materials.clockDialLuminous}>
          <cylinderGeometry args={[3.2, 3.2, 0.25, 32]} />
        </mesh>
        <mesh position={[0, 38, -5.7]} rotation={[Math.PI / 2, 0, 0]} material={materials.clockDialLuminous}>
          <cylinderGeometry args={[3.2, 3.2, 0.25, 32]} />
        </mesh>
        <mesh position={[5.7, 38, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.clockDialLuminous}>
          <cylinderGeometry args={[3.2, 3.2, 0.25, 32]} />
        </mesh>
        <mesh position={[-5.7, 38, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.clockDialLuminous}>
          <cylinderGeometry args={[3.2, 3.2, 0.25, 32]} />
        </mesh>
        {/* Copper Mansard Roof & Gold Spire Cupola (42 to 52m) */}
        <mesh position={[0, 45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={materials.darkGranite}>
          <coneGeometry args={[7.8, 8, 4]} />
        </mesh>
        <mesh position={[0, 50.5, 0]} castShadow material={materials.goldCupola}>
          <sphereGeometry args={[1.2, 16, 16]} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* ERA 05: 2200 CE — THE QUANTUM CHRONOS SPIRE & LEVITATING RINGS     */}
      {/* ================================================================== */}
      <group ref={nextAgeGroupRef} name="Era05_QuantumSpire" visible={false}>
        {/* Monolithic Obsidian Base & Energy Foundation (0 to 16m) */}
        <mesh position={[0, 8, 0]} castShadow receiveShadow material={materials.darkObsidian}>
          <cylinderGeometry args={[9, 12, 16, 6]} />
        </mesh>
        {/* Luminous Cyan Energy Conduits in Base */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x = Math.cos(angle) * 9.2;
          const z = Math.sin(angle) * 9.2;
          return (
            <mesh key={`cyan-strip-${i}`} position={[x, 8, z]} material={materials.chroniteCrystal}>
              <boxGeometry args={[0.4, 15, 0.4]} />
            </mesh>
          );
        })}

        {/* Hexagonal Ascending Spire (16 to 48m) */}
        <mesh position={[0, 32, 0]} castShadow material={materials.darkObsidian}>
          <cylinderGeometry args={[4.5, 8.5, 32, 6]} />
        </mesh>

        {/* Central Levitating Tachyon Energy Core */}
        <mesh ref={energyCoreRef} position={[0, 36, 0]} material={materials.chroniteCrystal}>
          <octahedronGeometry args={[3.2, 1]} />
        </mesh>

        {/* Levitating Concentric Holographic Cyan Containment Rings */}
        <group ref={ringsRef} position={[0, 36, 0]}>
          <mesh material={materials.hologramCyan}>
            <torusGeometry args={[8.5, 0.35, 8, 36]} />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]} material={materials.hologramCyan}>
            <torusGeometry args={[6.8, 0.25, 8, 32]} />
          </mesh>
          <mesh rotation={[-Math.PI / 4, 0, 0]} material={materials.hologramCyan}>
            <torusGeometry args={[5.2, 0.2, 8, 28]} />
          </mesh>
        </group>

        {/* Hyper-Sleek Spire Needle Apex (48 to 62m) */}
        <mesh position={[0, 54, 0]} castShadow material={materials.darkObsidian}>
          <coneGeometry args={[3.8, 14, 6]} />
        </mesh>
        {/* Luminous Zenith Emitter Sphere */}
        <mesh position={[0, 61.5, 0]} material={materials.chroniteCrystal}>
          <sphereGeometry args={[1.1, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}
