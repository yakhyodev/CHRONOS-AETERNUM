'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Provides physically based Image-Based Lighting (IBL) via a real HDRI environment map
 * (/textures/venice_sunset_1k.hdr) with an instant synchronous RoomEnvironment PMREM fallback.
 */
export function HDREnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    let disposed = false;
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    // 1. Synchronous frame-0 PMREM fallback so metallic/glossy surfaces never reflect black
    const fallbackRoom = new RoomEnvironment();
    const fallbackTarget = pmremGenerator.fromScene(fallbackRoom, 0.04);
    scene.environment = fallbackTarget.texture;
    if ('environmentIntensity' in scene) {
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity = 1.25;
    }
    fallbackRoom.dispose();

    // 2. Load real Venice Sunset 1K HDRI for photorealistic golden-hour specular reflections
    let hdrTarget: THREE.WebGLRenderTarget | null = null;
    const loader = new RGBELoader();
    loader.load(
      '/textures/venice_sunset_1k.hdr',
      (hdrTexture) => {
        if (disposed) {
          hdrTexture.dispose();
          return;
        }
        hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
        hdrTarget = pmremGenerator.fromEquirectangular(hdrTexture);
        scene.environment = hdrTarget.texture;
        hdrTexture.dispose();
      },
      undefined,
      () => {
        // Keep RoomEnvironment fallback if offline or blocked
      }
    );

    return () => {
      disposed = true;
      pmremGenerator.dispose();
      fallbackTarget.dispose();
      if (hdrTarget) {
        hdrTarget.dispose();
      }
    };
  }, [gl, scene]);

  return null;
}
