'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chronosStore } from '@/lib/chronosStore';

export function TemporalLensGhost() {
  const lens = chronosStore.temporalLens;
  const ghostRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const { hologramMat, ringMat } = useMemo(() => {
    return {
      hologramMat: new THREE.MeshBasicMaterial({
        color: '#00F0FF',
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      }),
      ringMat: new THREE.MeshBasicMaterial({
        color: '#00F0FF',
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      hologramMat.dispose();
      ringMat.dispose();
    };
  }, [hologramMat, ringMat]);

  useFrame((state, delta) => {
    if (!lens.active) return;
    if (chronosStore.isTimeFrozen) return;

    const t = state.clock.getElapsedTime();
    hologramMat.opacity = 0.55 + Math.sin(t * 3.5) * 0.2;

    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.8;
      ringRef.current.rotation.x = Math.sin(t * 1.5) * 0.2;
    }
  });

  if (!lens.active || !lens.landmarkId) return null;

  const previewEra = lens.previewEra;

  return (
    <group ref={ghostRef} name="TemporalLens_GhostOverlay">
      {/* 1. LENS INSPECTION FOR PLAZA TOWER */}
      {lens.landmarkId === 'plaza-tower' && (
        <group position={[0, 0, -124]}>
          {/* Holographic chronal focus ring */}
          <mesh ref={ringRef} position={[0, 16, 0]} material={ringMat}>
            <torusGeometry args={[14, 0.4, 8, 32]} />
          </mesh>

          {previewEra === 'the-origin' && (
            <group position={[0, 0, 0]}>
              <mesh position={[0, 8, 0]} material={hologramMat}>
                <cylinderGeometry args={[2.5, 4.5, 16, 8]} />
              </mesh>
              <mesh position={[0, 18, 0]} material={hologramMat}>
                <coneGeometry args={[4, 6, 8]} />
              </mesh>
            </group>
          )}

          {previewEra === 'the-kingdom' && (
            <group position={[0, 0, 0]}>
              <mesh position={[0, 15, 0]} material={hologramMat}>
                <boxGeometry args={[10, 30, 10]} />
              </mesh>
              <mesh position={[0, 36, 0]} material={hologramMat}>
                <coneGeometry args={[6, 16, 8]} />
              </mesh>
            </group>
          )}

          {previewEra === 'the-machine' && (
            <group position={[0, 0, 0]}>
              <mesh position={[0, 18, 0]} material={hologramMat}>
                <boxGeometry args={[9, 36, 9]} />
              </mesh>
              <mesh position={[0, 40, 0]} material={hologramMat}>
                <cylinderGeometry args={[4, 5, 8, 8]} />
              </mesh>
            </group>
          )}

          {previewEra === 'the-present' && (
            <group position={[0, 0, 0]}>
              <mesh position={[0, 19, 0]} material={hologramMat}>
                <boxGeometry args={[11, 38, 11]} />
              </mesh>
              <mesh position={[0, 42, 0]} material={hologramMat}>
                <sphereGeometry args={[5, 12, 12]} />
              </mesh>
            </group>
          )}

          {previewEra === 'the-next-age' && (
            <group position={[0, 0, 0]}>
              <mesh position={[0, 24, 0]} material={hologramMat}>
                <cylinderGeometry args={[1.5, 5, 48, 8]} />
              </mesh>
              <mesh position={[0, 52, 0]} material={hologramMat}>
                <octahedronGeometry args={[5]} />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* 2. LENS INSPECTION FOR RIVER BRIDGE */}
      {lens.landmarkId === 'river-bridge' && (
        <group position={[85, 0, -135]}>
          <mesh ref={ringRef} position={[0, 8, 0]} material={ringMat}>
            <torusGeometry args={[20, 0.5, 8, 32]} />
          </mesh>

          {previewEra === 'the-origin' && (
            <mesh position={[0, 1.5, 0]} material={hologramMat}>
              <boxGeometry args={[110, 2, 8]} />
            </mesh>
          )}

          {previewEra === 'the-kingdom' && (
            <group position={[0, 0, 0]}>
              <mesh position={[0, 4.5, 0]} material={hologramMat}>
                <boxGeometry args={[115, 5, 9]} />
              </mesh>
              <mesh position={[-45, 10, 0]} material={hologramMat}>
                <boxGeometry args={[8, 16, 10]} />
              </mesh>
              <mesh position={[45, 10, 0]} material={hologramMat}>
                <boxGeometry args={[8, 16, 10]} />
              </mesh>
            </group>
          )}

          {previewEra === 'the-machine' && (
            <mesh position={[0, 7.5, 0]} material={hologramMat}>
              <boxGeometry args={[118, 9, 8]} />
            </mesh>
          )}

          {(previewEra === 'the-present' || previewEra === 'the-next-age') && (
            <group position={[0, 0, 0]}>
              <mesh position={[0, 5, 0]} material={hologramMat}>
                <boxGeometry args={[118, 4, 11]} />
              </mesh>
              {previewEra === 'the-next-age' && (
                <mesh position={[0, 14, 0]} material={hologramMat}>
                  <cylinderGeometry args={[4, 4, 120, 12]} />
                </mesh>
              )}
            </group>
          )}
        </group>
      )}

      {/* 3. LENS INSPECTION FOR THE OBSERVATORY */}
      {lens.landmarkId === 'observatory-dome' && (
        <group position={[40, 32, -230]}>
          <mesh ref={ringRef} position={[0, 8, 0]} material={ringMat}>
            <torusGeometry args={[16, 0.5, 8, 32]} />
          </mesh>

          {previewEra === 'the-origin' && (
            <mesh position={[0, 5, 0]} material={hologramMat}>
              <cylinderGeometry args={[8, 9, 8, 6]} />
            </mesh>
          )}

          {(previewEra === 'the-kingdom' || previewEra === 'the-machine') && (
            <mesh position={[0, 8, 0]} material={hologramMat}>
              <cylinderGeometry args={[6, 8, 12, 12]} />
            </mesh>
          )}

          {previewEra === 'the-present' && (
            <mesh position={[0, 9, 0]} material={hologramMat}>
              <sphereGeometry args={[9, 16, 16]} />
            </mesh>
          )}

          {previewEra === 'the-next-age' && (
            <group position={[0, 10, 0]}>
              <mesh position={[0, 4, 0]} material={hologramMat}>
                <torusGeometry args={[12, 1.2, 8, 24]} />
              </mesh>
              <mesh position={[0, 12, 0]} material={hologramMat}>
                <octahedronGeometry args={[4]} />
              </mesh>
            </group>
          )}
        </group>
      )}
    </group>
  );
}
