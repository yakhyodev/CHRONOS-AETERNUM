'use client';

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { QualityPreset } from '@/lib/chronosStore';
import { chronosStore } from '@/lib/chronosStore';

const GtaFilmicGradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uVignette: { value: 0.28 },
    uChromatic: { value: 0.0012 },
    uContrast: { value: 1.08 },
    uSaturation: { value: 1.16 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uVignette;
    uniform float uChromatic;
    uniform float uContrast;
    uniform float uSaturation;
    varying vec2 vUv;

    void main() {
      vec2 centered = vUv - 0.5;
      float dist = length(centered);

      // Subtle optical edge chromatic dispersion
      vec2 offset = centered * dist * uChromatic;
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      vec3 col = vec3(r, g, b);

      // GTA VI style golden-hour shadow/highlight split-toning
      float luma = dot(col, vec3(0.299, 0.587, 0.114));
      vec3 shadowTint = vec3(0.95, 0.97, 1.04);
      vec3 highlightTint = vec3(1.05, 1.01, 0.94);
      col *= mix(shadowTint, highlightTint, smoothstep(0.15, 0.85, luma));

      // Saturation boost
      col = mix(vec3(luma), col, uSaturation);

      // S-curve filmic contrast
      col = (col - 0.5) * uContrast + 0.5;
      col = clamp(col, 0.0, 1.0);

      // Smooth optical lens vignette
      float vig = smoothstep(0.82, 0.25, dist * uVignette * 2.2);
      col *= mix(0.76, 1.0, vig);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

interface CinematicPostProcessingProps {
  qualityPreset?: QualityPreset;
}

export function CinematicPostProcessing({
  qualityPreset = 'high',
}: CinematicPostProcessingProps) {
  const { gl, scene, camera, size } = useThree();
  const isLow = qualityPreset === 'low';

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.02;
  }, [gl]);

  const { composer, bloomPass, gradePass } = useMemo(() => {
    if (isLow) {
      return { composer: null, bloomPass: null, gradePass: null };
    }

    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      type: THREE.HalfFloatType,
      samples: qualityPreset === 'high' ? 4 : 0,
    });

    const comp = new EffectComposer(gl, renderTarget);
    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    // Physically tuned HDR Bloom for core plasma, streetlights, headlights, and sunset horizon
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      qualityPreset === 'high' ? 0.28 : 0.2, // strength
      0.55, // radius
      0.88  // threshold
    );
    comp.addPass(bloom);

    const grade = new ShaderPass(GtaFilmicGradeShader);
    comp.addPass(grade);

    const outputPass = new OutputPass();
    comp.addPass(outputPass);

    return { composer: comp, bloomPass: bloom, gradePass: grade };
  }, [gl, scene, camera, isLow, qualityPreset]);

  useEffect(() => {
    if (!composer || !bloomPass) return;
    composer.setSize(size.width, size.height);
    bloomPass.resolution.set(size.width, size.height);
  }, [composer, bloomPass, size.width, size.height]);

  useEffect(() => {
    return () => {
      if (composer) {
        composer.dispose();
      }
    };
  }, [composer]);

  useFrame((state) => {
    if (!composer) return;

    if (gradePass) {
      gradePass.uniforms.uTime.value = state.clock.getElapsedTime();
      const isParadox =
        chronosStore.paradoxState === 'unstable' ||
        chronosStore.paradoxState === 'converging';
      gradePass.uniforms.uChromatic.value = isParadox ? 0.0045 : 0.0012;
    }

    composer.render();
  }, 1);

  return null;
}
