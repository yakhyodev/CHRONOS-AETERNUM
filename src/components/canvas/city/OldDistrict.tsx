'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

export function OldDistrict() {
  const {
    stuccoMat,
    stoneBaseMat,
    terracottaRoofMat,
    slateRoofMat,
    timberTrimMat,
    warmWindowMat,
  } = useMemo(() => {
    return {
      stuccoMat: new THREE.MeshStandardMaterial({
        color: '#D1BEA8',
        roughness: 0.85,
        metalness: 0.1,
      }),
      stoneBaseMat: new THREE.MeshStandardMaterial({
        color: '#32373D',
        roughness: 0.8,
        metalness: 0.2,
      }),
      terracottaRoofMat: new THREE.MeshStandardMaterial({
        color: '#B0563C',
        roughness: 0.65,
        metalness: 0.12,
      }),
      slateRoofMat: new THREE.MeshStandardMaterial({
        color: '#28323E',
        roughness: 0.55,
        metalness: 0.35,
      }),
      timberTrimMat: new THREE.MeshStandardMaterial({
        color: '#4A3322',
        roughness: 0.75,
        metalness: 0.15,
      }),
      warmWindowMat: new THREE.MeshStandardMaterial({
        color: '#FFDE99',
        emissive: '#FF9E33',
        emissiveIntensity: 1.5,
        roughness: 0.3,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      stuccoMat.dispose();
      stoneBaseMat.dispose();
      terracottaRoofMat.dispose();
      slateRoofMat.dispose();
      timberTrimMat.dispose();
      warmWindowMat.dispose();
    };
  }, [
    stuccoMat,
    stoneBaseMat,
    terracottaRoofMat,
    slateRoofMat,
    timberTrimMat,
    warmWindowMat,
  ]);

  // Procedural building blocks with authored layout
  const buildings = useMemo(() => {
    return [
      // Street Block 1: Facing Central Avenue
      { x: -52, z: -115, w: 10, d: 14, h: 14, roof: 'terracotta', spire: false },
      { x: -54, z: -132, w: 12, d: 12, h: 16, roof: 'slate', spire: false },
      { x: -52, z: -148, w: 10, d: 12, h: 12, roof: 'terracotta', spire: false },

      // Street Block 2: Middle Quarter & Cathedral square
      { x: -70, z: -112, w: 14, d: 11, h: 15, roof: 'terracotta', spire: false },
      { x: -72, z: -130, w: 13, d: 14, h: 17, roof: 'terracotta', spire: false },
      { x: -72, z: -150, w: 12, d: 15, h: 14, roof: 'slate', spire: false },

      // Cathedral / Grand Basilica of Old District
      { x: -92, z: -135, w: 18, d: 26, h: 22, roof: 'slate', spire: true },

      // Street Block 3: Western Hillside Terraces
      { x: -90, z: -110, w: 11, d: 13, h: 13, roof: 'terracotta', spire: false },
      { x: -92, z: -158, w: 13, d: 12, h: 14, roof: 'terracotta', spire: false },
      { x: -110, z: -125, w: 12, d: 15, h: 12, roof: 'slate', spire: false },
      { x: -112, z: -145, w: 10, d: 14, h: 11, roof: 'terracotta', spire: false },
    ];
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Building Clusters */}
      {buildings.map((b, idx) => (
        <group key={`old-bldg-${idx}`} position={[b.x, 0, b.z]}>
          {/* Stone Foundation Base */}
          <mesh position={[0, b.h * 0.2, 0]} castShadow receiveShadow material={stoneBaseMat}>
            <boxGeometry args={[b.w, b.h * 0.4, b.d]} />
          </mesh>

          {/* Upper Stucco / Plaster Facade */}
          <mesh position={[0, b.h * 0.7, 0]} castShadow receiveShadow material={stuccoMat}>
            <boxGeometry args={[b.w - 0.2, b.h * 0.6, b.d - 0.2]} />
          </mesh>

          {/* Roof (Pitched Gable or Hip) */}
          <mesh
            position={[0, b.h + (b.w * 0.25), 0]}
            rotation={[0, Math.PI / 4, 0]}
            castShadow
            material={b.roof === 'terracotta' ? terracottaRoofMat : slateRoofMat}
          >
            <coneGeometry args={[Math.max(b.w, b.d) * 0.65, b.w * 0.5, 4]} />
          </mesh>

          {/* Chimney */}
          <mesh position={[b.w * 0.25, b.h + b.w * 0.4, 0]} castShadow material={stoneBaseMat}>
            <boxGeometry args={[1.2, 3.2, 1.2]} />
          </mesh>

          {/* Illuminated Historic Windows */}
          <mesh position={[0, b.h * 0.65, b.d * 0.5 + 0.05]} material={warmWindowMat}>
            <planeGeometry args={[b.w * 0.6, 1.8]} />
          </mesh>
          <mesh position={[0, b.h * 0.65, -b.d * 0.5 - 0.05]} rotation={[0, Math.PI, 0]} material={warmWindowMat}>
            <planeGeometry args={[b.w * 0.6, 1.8]} />
          </mesh>

          {/* Cathedral Spire */}
          {b.spire && (
            <group position={[0, b.h, 0]}>
              {/* Cathedral Belfry */}
              <mesh position={[0, 8, 0]} castShadow material={stoneBaseMat}>
                <boxGeometry args={[8, 16, 8]} />
              </mesh>
              {/* Steep Spire */}
              <mesh position={[0, 22, 0]} castShadow material={slateRoofMat}>
                <coneGeometry args={[4.5, 14, 8]} />
              </mesh>
              {/* Cross Finial */}
              <mesh position={[0, 30, 0]} material={timberTrimMat}>
                <boxGeometry args={[0.3, 2.5, 0.3]} />
              </mesh>
              <mesh position={[0, 29.5, 0]} material={timberTrimMat}>
                <boxGeometry args={[1.6, 0.3, 0.3]} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* 2. Overhead Street Bridge Arches Connecting Buildings */}
      <mesh position={[-62, 5.5, -122]} castShadow material={stoneBaseMat}>
        <boxGeometry args={[12, 3, 4]} />
      </mesh>
      <mesh position={[-81, 6, -135]} castShadow material={stoneBaseMat}>
        <boxGeometry args={[10, 3.2, 4]} />
      </mesh>
    </group>
  );
}
