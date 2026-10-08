/**
 * CHRONOS — Aeternum: Phase 06 Time Morph Specifications
 * 
 * Continuous, reversible time morphing across all five eras and five districts.
 */
import * as THREE from 'three';
import { type HistoricalEraId } from './phase03';
import { TEMPORAL_ERAS } from './phase05';

export interface TemporalMorphInterval {
  eraA: HistoricalEraId;
  eraB: HistoricalEraId;
  stopA: number;
  stopB: number;
  blendFactor: number; // 0.0 (fully eraA) to 1.0 (fully eraB)
  yearA: number;
  yearB: number;
  interpolatedYear: number;
  yearDisplay: string;
}

export interface InterpolatedAtmosphere {
  skyColor: string;
  fogColor: string;
  fogDensity: number;
  sunColor: string;
  sunIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  accentColor: string;
  sunPosition: [number, number, number];
}

const colorCacheA = new THREE.Color();
const colorCacheB = new THREE.Color();

/**
 * Blend two hex colors using linear sRGB interpolation
 */
export function blendHexColors(colorA: string, colorB: string, alpha: number): string {
  colorCacheA.set(colorA);
  colorCacheB.set(colorB);
  colorCacheA.lerp(colorCacheB, Math.max(0, Math.min(1, alpha)));
  return '#' + colorCacheA.getHexString();
}

/**
 * Compute the continuous temporal morph interval from a normalized timeline position (0.0 to 1.0)
 */
export function getTemporalMorphState(pos: number): TemporalMorphInterval {
  const clamped = Math.max(0, Math.min(1, pos));

  let eraA: HistoricalEraId;
  let eraB: HistoricalEraId;
  let stopA: number;
  let stopB: number;

  if (clamped < 0.25) {
    eraA = 'the-origin';
    eraB = 'the-kingdom';
    stopA = 0.0;
    stopB = 0.25;
  } else if (clamped < 0.50) {
    eraA = 'the-kingdom';
    eraB = 'the-machine';
    stopA = 0.25;
    stopB = 0.50;
  } else if (clamped < 0.75) {
    eraA = 'the-machine';
    eraB = 'the-present';
    stopA = 0.50;
    stopB = 0.75;
  } else {
    eraA = 'the-present';
    eraB = 'the-next-age';
    stopA = 0.75;
    stopB = 1.0;
  }

  const range = stopB - stopA;
  const blendFactor = range > 0 ? Math.max(0, Math.min(1, (clamped - stopA) / range)) : 0;

  const yearA = TEMPORAL_ERAS[eraA].year;
  const yearB = TEMPORAL_ERAS[eraB].year;
  const interpolatedYear = Math.round(yearA + (yearB - yearA) * blendFactor);

  const yearDisplay =
    interpolatedYear < 0
      ? `${Math.abs(interpolatedYear)} BCE`
      : `${interpolatedYear} CE`;

  return {
    eraA,
    eraB,
    stopA,
    stopB,
    blendFactor,
    yearA,
    yearB,
    interpolatedYear,
    yearDisplay,
  };
}

/**
 * Sun vector coordinates for each era anchor
 */
export const ERA_SUN_POSITIONS: Record<HistoricalEraId, [number, number, number]> = {
  'the-origin': [-140, 45, 60],
  'the-kingdom': [-100, 95, 30],
  'the-machine': [-130, 50, 50],
  'the-present': [-120, 75, 40],
  'the-next-age': [-90, 85, -100],
};

/**
 * Smoothly interpolate atmosphere parameters across continuous timeline position
 */
export function getInterpolatedAtmosphere(pos: number): InterpolatedAtmosphere {
  const { eraA, eraB, blendFactor } = getTemporalMorphState(pos);
  const atmA = TEMPORAL_ERAS[eraA].atmosphere;
  const atmB = TEMPORAL_ERAS[eraB].atmosphere;

  const skyColor = blendHexColors(atmA.skyColor, atmB.skyColor, blendFactor);
  const fogColor = blendHexColors(atmA.fogColor, atmB.fogColor, blendFactor);
  const sunColor = blendHexColors(atmA.sunColor, atmB.sunColor, blendFactor);
  const ambientColor = blendHexColors(atmA.ambientColor, atmB.ambientColor, blendFactor);
  const accentColor = blendHexColors(atmA.accentColor, atmB.accentColor, blendFactor);

  const fogDensity = atmA.fogDensity + (atmB.fogDensity - atmA.fogDensity) * blendFactor;
  const sunIntensity = atmA.sunIntensity + (atmB.sunIntensity - atmA.sunIntensity) * blendFactor;
  const ambientIntensity =
    atmA.ambientIntensity + (atmB.ambientIntensity - atmA.ambientIntensity) * blendFactor;

  const sunPosA = ERA_SUN_POSITIONS[eraA];
  const sunPosB = ERA_SUN_POSITIONS[eraB];

  const sunPosition: [number, number, number] = [
    sunPosA[0] + (sunPosB[0] - sunPosA[0]) * blendFactor,
    sunPosA[1] + (sunPosB[1] - sunPosA[1]) * blendFactor,
    sunPosA[2] + (sunPosB[2] - sunPosA[2]) * blendFactor,
  ];

  return {
    skyColor,
    fogColor,
    fogDensity,
    sunColor,
    sunIntensity,
    ambientColor,
    ambientIntensity,
    accentColor,
    sunPosition,
  };
}
