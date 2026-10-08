'use client';
export function WandererSilhouette() {
  return (
    <group position={[0, -0.7, 13.5]} rotation={[0, Math.PI, 0]}>
      {/* Hood / Cowl */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial
          color="#0c0e12"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Shoulders & Upper Robes */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.38, 0.55, 12]} />
        <meshStandardMaterial
          color="#0b0d10"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Draped Cloak / Lower Robes */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <coneGeometry args={[0.55, 1.05, 14]} />
        <meshStandardMaterial
          color="#08090b"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle back cape fold */}
      <mesh position={[0, 0.65, -0.12]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.42, 0.95, 0.1]} />
        <meshStandardMaterial
          color="#060709"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
