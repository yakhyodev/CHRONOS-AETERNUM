'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { QualityPreset } from '@/lib/chronosStore';
import { chronosStore } from '@/lib/chronosStore';
import { getInterpolatedAtmosphere } from '@/types/phase06';
import { getSoftBeamAlphaTexture, loadFileTexture } from '@/lib/pbrTextures';

interface WorldLightingProps {
  qualityPreset?: QualityPreset;
}

export function WorldLighting({ qualityPreset = 'high' }: WorldLightingProps) {
  const { scene } = useThree();

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);
  const plazaPointRef = useRef<THREE.PointLight>(null);
  const sunGroupRef = useRef<THREE.Group>(null);

  const isHigh = qualityPreset === 'high';
  const shadowMapSize = isHigh ? 2048 : qualityPreset === 'medium' ? 1024 : 512;
  const enableShadows = qualityPreset !== 'low';

  const {
    skyShaderMat,
    sunDiscMat,
    sunFlareMat,
    godRayMat,
  } = useMemo(() => {
    const flareTex = loadFileTexture('/textures/lensflare0.png', 1, 1, true);
    const beamAlpha = getSoftBeamAlphaTexture();

    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uZenithColor: { value: new THREE.Color('#0c1322') },
        uHorizonColor: { value: new THREE.Color('#ff8c42') },
        uSunColor: { value: new THREE.Color('#ffd280') },
        uSunDir: { value: new THREE.Vector3(-0.6, 0.32, -0.7).normalize() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uZenithColor;
        uniform vec3 uHorizonColor;
        uniform vec3 uSunColor;
        uniform vec3 uSunDir;
        varying vec3 vWorldPos;

        // Lightweight procedural FBM clouds in sky shader
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        float fbm(vec2 p) {
          float v = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 4; i++) {
            v += amp * noise(p);
            p *= 2.03;
            amp *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 dir = normalize(vWorldPos);
          float elev = clamp(dir.y, 0.0, 1.0);

          // Rayleigh & horizon sunset gradient
          vec3 midColor = mix(uHorizonColor, uZenithColor, pow(elev, 0.45));
          vec3 sky = mix(uHorizonColor * 1.1, midColor, smoothstep(0.0, 0.28, elev));

          // Mie solar scattering halo
          float sunDot = max(dot(dir, normalize(uSunDir)), 0.0);
          sky += uSunColor * pow(sunDot, 7.0) * 0.35;
          sky += vec3(1.0, 0.92, 0.78) * pow(sunDot, 64.0) * 0.85;

          // Procedural volumetric sunset clouds backlit by solar angle
          if (dir.y > 0.03) {
            vec2 cloudUv = dir.xz / (dir.y + 0.18) * 1.6 + vec2(uTime * 0.012, -uTime * 0.006);
            float c = fbm(cloudUv);
            float cloudMask = smoothstep(0.42, 0.76, c) * smoothstep(0.03, 0.18, dir.y) * smoothstep(0.85, 0.25, dir.y);
            vec3 cloudDark = mix(uZenithColor * 0.7, uHorizonColor * 0.45, 0.5);
            vec3 cloudLit = mix(uHorizonColor * 1.25, uSunColor * 1.35, pow(sunDot, 2.0));
            float rim = smoothstep(0.45, 0.7, fbm(cloudUv + normalize(uSunDir.xz) * 0.08));
            vec3 cloudCol = mix(cloudDark, cloudLit, rim * 0.85 + 0.15);
            sky = mix(sky, cloudCol, cloudMask * 0.75);
          }

          gl_FragColor = vec4(sky, 1.0);
        }
      `,
    });

    const sDisc = new THREE.MeshBasicMaterial({
      color: '#fff4d2',
      fog: false,
    });

    const sFlare = new THREE.SpriteMaterial({
      map: flareTex,
      color: '#ffae52',
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });

    const gRay = new THREE.MeshBasicMaterial({
      color: '#ffbe6b',
      alphaMap: beamAlpha,
      transparent: true,
      opacity: 0.075,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: false,
    });

    return {
      skyShaderMat: skyMat,
      sunDiscMat: sDisc,
      sunFlareMat: sFlare,
      godRayMat: gRay,
    };
  }, []);

  useEffect(() => {
    return () => {
      skyShaderMat.dispose();
      sunDiscMat.dispose();
      sunFlareMat.dispose();
      godRayMat.dispose();
    };
  }, [skyShaderMat, sunDiscMat, sunFlareMat, godRayMat]);

  useFrame((state) => {
    const pos = chronosStore.timelinePosition;
    const atm = getInterpolatedAtmosphere(pos);
    const t = state.clock.getElapsedTime();

    if (ambientRef.current) {
      ambientRef.current.color.set(atm.ambientColor);
      ambientRef.current.intensity = atm.ambientIntensity * 0.92;
    }

    if (hemiRef.current) {
      hemiRef.current.color.set(atm.sunColor);
      hemiRef.current.groundColor.set(atm.skyColor);
      hemiRef.current.intensity = 0.68;
    }

    if (sunRef.current) {
      sunRef.current.color.set(atm.sunColor);
      sunRef.current.intensity = atm.sunIntensity * 0.98;
      sunRef.current.position.set(atm.sunPosition[0], atm.sunPosition[1], atm.sunPosition[2]);
    }

    if (sunGroupRef.current) {
      sunGroupRef.current.position.set(
        atm.sunPosition[0] * 1.8,
        Math.max(46, atm.sunPosition[1] * 1.25),
        -350
      );
    }

    if (plazaPointRef.current) {
      plazaPointRef.current.color.set(atm.accentColor);
    }

    // Update volumetric sky shader uniforms
    skyShaderMat.uniforms.uTime.value = t;
    skyShaderMat.uniforms.uHorizonColor.value.set(atm.sunColor).multiplyScalar(0.76);
    skyShaderMat.uniforms.uZenithColor.value.set(atm.skyColor).multiplyScalar(0.92);
    skyShaderMat.uniforms.uSunColor.value.set(atm.accentColor);
    skyShaderMat.uniforms.uSunDir.value
      .set(atm.sunPosition[0], Math.max(25, atm.sunPosition[1]), -240)
      .normalize();

    sunFlareMat.color.set(atm.sunColor);
    godRayMat.color.set(atm.sunColor);

    if (scene.background && 'set' in scene.background) {
      (scene.background as THREE.Color).set(atm.skyColor);
    }

    if (scene.fog && 'color' in scene.fog) {
      scene.fog.color.set(atm.fogColor);
      // Balanced atmospheric aerial perspective
      (scene.fog as THREE.FogExp2).density = atm.fogDensity * 0.48;
    }
  });

  return (
    <group name="AeternumWorldLighting">
      {/* 0. Volumetric Atmospheric Sunset & Cloud Sky Dome */}
      <mesh position={[0, 0, -120]} material={skyShaderMat}>
        <sphereGeometry args={[430, 48, 32]} />
      </mesh>

      {/* 0b. Horizon Solar Disc, Lensflare Corona & Crepuscular God-Ray Shafts */}
      <group ref={sunGroupRef} position={[110, 72, -350]}>
        <mesh material={sunDiscMat}>
          <sphereGeometry args={[9, 24, 24]} />
        </mesh>
        <sprite material={sunFlareMat} scale={[56, 56, 1]} />
        {/* Slanted Volumetric Golden-Hour God Rays across the Observatory & City */}
        <mesh position={[-35, -28, 70]} rotation={[0.45, -0.25, 0.55]} material={godRayMat}>
          <cylinderGeometry args={[8, 42, 180, 24, 1, true]} />
        </mesh>
        <mesh position={[-65, -34, 95]} rotation={[0.5, -0.35, 0.65]} material={godRayMat}>
          <cylinderGeometry args={[6, 32, 190, 24, 1, true]} />
        </mesh>
      </group>

      {/* 1. Atmospheric Ambient Fill */}
      <ambientLight ref={ambientRef} color="#4A3B32" intensity={0.75} />

      {/* 2. Hemisphere Light: Sky/Ground bounce */}
      <hemisphereLight
        ref={hemiRef}
        color="#FFAE73"
        groundColor="#1D2A3A"
        intensity={0.85}
      />

      {/* 3. Primary Directional Celestial Sun/Luminary */}
      <directionalLight
        ref={sunRef}
        position={[-120, 75, 40]}
        intensity={3.4}
        color="#FFB366"
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={10}
        shadow-camera-far={450}
        shadow-camera-left={-160}
        shadow-camera-right={160}
        shadow-camera-top={160}
        shadow-camera-bottom={-160}
        shadow-bias={-0.0003}
      />

      {/* 4. Cool Mountain Rim Light (from Northeast) */}
      <directionalLight
        ref={rimRef}
        position={[90, 80, -280]}
        intensity={0.95}
        color="#8EB1D4"
      />

      {/* 5. Central Chronos Plaza Ambient Uplight with Era Accent Color */}
      <pointLight
        ref={plazaPointRef}
        position={[0, 14, -120]}
        intensity={4.2}
        distance={85}
        color="#FFA845"
        decay={2}
      />

      {/* 6. Dynamic Atmospheric Fog for era aerial perspective */}
      <fogExp2 attach="fog" args={['#2A211D', 0.0048]} />
    </group>
  );
}
