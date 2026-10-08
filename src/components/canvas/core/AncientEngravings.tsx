'use client';

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CHRONOS_PALETTE } from '@/lib/constants';

interface AncientEngravingsProps {
  radius: number;
  count?: number;
  majorInterval?: number;
  color?: string;
  depth?: number;
}

export function AncientEngravings({
  radius,
  count = 48,
  majorInterval = 4,
  color = CHRONOS_PALETTE.warmGold,
  depth = 0.25,
}: AncientEngravingsProps) {
  const frontMeshRef = useRef<THREE.InstancedMesh>(null);
  const backMeshRef = useRef<THREE.InstancedMesh>(null);

  const sharedMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.25,
      metalness: 0.9,
    });
  }, [color]);

  const sharedGeometry = useMemo(() => {
    return new THREE.BoxGeometry(0.03, 0.16, 0.015);
  }, []);

  useEffect(() => {
    return () => {
      sharedMaterial.dispose();
      sharedGeometry.dispose();
    };
  }, [sharedMaterial, sharedGeometry]);

  // Set instance matrices once on mount
  useEffect(() => {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const isMajor = i % majorInterval === 0;
      const scaleY = isMajor ? 1.4 : 0.8;
      const scaleX = isMajor ? 1.3 : 0.9;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Front face
      dummy.position.set(x, y, depth / 2 + 0.005);
      dummy.rotation.set(0, 0, angle + Math.PI / 2);
      dummy.scale.set(scaleX, scaleY, 1);
      dummy.updateMatrix();
      frontMeshRef.current?.setMatrixAt(i, dummy.matrix);

      // Back face
      dummy.position.set(x, y, -depth / 2 - 0.005);
      dummy.updateMatrix();
      backMeshRef.current?.setMatrixAt(i, dummy.matrix);
    }

    if (frontMeshRef.current) frontMeshRef.current.instanceMatrix.needsUpdate = true;
    if (backMeshRef.current) backMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [radius, count, majorInterval, depth]);

  return (
    <group>
      <instancedMesh
        ref={frontMeshRef}
        args={[sharedGeometry, sharedMaterial, count]}
      />
      <instancedMesh
        ref={backMeshRef}
        args={[sharedGeometry, sharedMaterial, count]}
      />
    </group>
  );
}
