'use client';

import * as THREE from 'three';

export interface PBRMaterialMaps {
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  bumpMap?: THREE.Texture;
  emissiveMap?: THREE.Texture;
}

export type FacadeStyle = 'heritage' | 'victorian' | 'medieval' | 'cyber';

const textureCache = new Map<string, THREE.Texture>();
const pbrSetCache = new Map<string, PBRMaterialMaps>();

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Loads an external image texture from /public/textures with tiling, filtering, and SSR guard
 */
export function loadFileTexture(
  path: string,
  repeatX = 1,
  repeatY = 1,
  isSRGB = true
): THREE.Texture | undefined {
  if (!isBrowser()) return undefined;

  const cacheKey = `${path}:${repeatX}:${repeatY}:${isSRGB}`;
  const existing = textureCache.get(cacheKey);
  if (existing) return existing;

  const loader = new THREE.TextureLoader();
  const tex = loader.load(path);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
  tex.anisotropy = 8;
  textureCache.set(cacheKey, tex);
  return tex;
}

/**
 * Generates a soft vertical & horizontal falloff alpha map for volumetric god-rays and light cones
 * Eliminates any hard geometric cylinder/cone edges
 */
export function getSoftBeamAlphaTexture(): THREE.Texture | undefined {
  if (!isBrowser()) return undefined;
  const key = 'soft-beam-alpha';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const imgData = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    const v = y / (size - 1); // 0 at top, 1 at bottom
    // Smooth vertical fade at both top and bottom ends
    const vFade = Math.sin(v * Math.PI) * Math.pow(1.0 - v * 0.65, 1.2);
    for (let x = 0; x < size; x++) {
      const u = x / (size - 1);
      // Soft streak variation around circumference
      const streak = 0.7 + 0.3 * Math.sin(u * Math.PI * 6);
      const val = Math.max(0, Math.min(255, Math.floor(vFade * streak * 255)));
      const idx = (y * size + x) * 4;
      imgData.data[idx] = val;
      imgData.data[idx + 1] = val;
      imgData.data[idx + 2] = val;
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generates an ornate Prague/Aeternum Astronomical Clock Dial texture with Roman numerals & gold hands
 */
export function getClockDialTexture(): THREE.Texture | undefined {
  if (!isBrowser()) return undefined;
  const key = 'clock-dial-texture';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  // Deep obsidian-navy clock face background
  const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 240);
  bgGrad.addColorStop(0, '#1e2836');
  bgGrad.addColorStop(0.7, '#0f141d');
  bgGrad.addColorStop(1, '#080b10');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Concentric gold astronomical rings
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 236, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#f3d27a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 192, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 128, 0, Math.PI * 2);
  ctx.stroke();

  // 12 Hour radial spokes & Roman numeral markers
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
    ctx.lineWidth = i % 3 === 0 ? 5 : 2.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 128, cy + Math.sin(angle) * 128);
    ctx.lineTo(cx + Math.cos(angle) * 232, cy + Math.sin(angle) * 232);
    ctx.stroke();

    // Glowing gold hour cabochons
    ctx.fillStyle = '#ffe596';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * 212, cy + Math.sin(angle) * 212, i % 3 === 0 ? 10 : 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Clock hands (pointing to 10:10)
  ctx.strokeStyle = '#ffd86b';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - 85, cy - 55);
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 115, cy - 75);
  ctx.stroke();

  // Central sun medallion
  ctx.fillStyle = '#ffd86b';
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generates carved European Ashlar Stone Masonry PBR textures (no windows)
 * Used for monumental clock tower shafts, civic plinths, bridge piers, and fortress walls
 */
export function getAshlarStonePBR(repeatX = 2, repeatY = 4): PBRMaterialMaps {
  if (!isBrowser()) return {};
  const key = `ashlar:${repeatX}:${repeatY}`;
  if (pbrSetCache.has(key)) return pbrSetCache.get(key)!;

  const size = 512;
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = size;
  diffCanvas.height = size;
  const dCtx = diffCanvas.getContext('2d')!;

  const normCanvas = document.createElement('canvas');
  normCanvas.width = size;
  normCanvas.height = size;
  const nCtx = normCanvas.getContext('2d')!;

  dCtx.fillStyle = '#8b7965';
  dCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = 'rgb(128, 128, 255)';
  nCtx.fillRect(0, 0, size, size);

  const rows = 8;
  const cols = 4;
  const rowH = size / rows;
  const colW = size / cols;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const offset = r % 2 === 0 ? 0 : colW / 2;
    for (let c = -1; c <= cols; c++) {
      const x = c * colW + offset;
      const shade = 122 + ((r * 13 + c * 29) % 24) - 12;
      dCtx.fillStyle = `rgb(${shade + 14}, ${shade + 4}, ${shade - 10})`;
      dCtx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);

      // Mortar bevel normal
      nCtx.fillStyle = 'rgb(128, 95, 235)';
      nCtx.fillRect(x, y, colW, 3);
      nCtx.fillStyle = 'rgb(95, 128, 235)';
      nCtx.fillRect(x, y, 3, rowH);
    }
  }

  const map = new THREE.CanvasTexture(diffCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const normalMap = new THREE.CanvasTexture(normCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(repeatX, repeatY);
  normalMap.colorSpace = THREE.LinearSRGBColorSpace;
  normalMap.anisotropy = 8;

  const roughnessMap = loadFileTexture('/textures/rock_roughness.jpg', repeatX, repeatY, false);

  const result = { map, normalMap, roughnessMap };
  pbrSetCache.set(key, result);
  return result;
}

/**
 * Generates a high-resolution procedural Wet Asphalt & Cobblestone Street PBR texture set
 */
export function getRoadPBR(repeatX = 1, repeatY = 4): PBRMaterialMaps {
  if (!isBrowser()) return {};
  const key = `road:${repeatX}:${repeatY}`;
  if (pbrSetCache.has(key)) return pbrSetCache.get(key)!;

  const size = 512;

  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = size;
  diffCanvas.height = size;
  const dCtx = diffCanvas.getContext('2d')!;

  dCtx.fillStyle = '#181b20';
  dCtx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 16) {
    for (let x = 0; x < size; x += 32) {
      const offset = (y / 16) % 2 === 0 ? 0 : 16;
      const shade = 22 + ((x * 7 + y * 13) % 12);
      dCtx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 5})`;
      dCtx.fillRect((x + offset) % size, y, 30, 14);
    }
  }

  // Sidewalk stone curbs on left/right edges
  dCtx.fillStyle = '#484c52';
  dCtx.fillRect(0, 0, 28, size);
  dCtx.fillRect(size - 28, 0, 28, size);

  // Subtle road center lane dashes & edge lines
  dCtx.fillStyle = 'rgba(218, 175, 95, 0.55)';
  dCtx.fillRect(36, 0, 4, size);
  dCtx.fillRect(size - 40, 0, 4, size);
  for (let y = 16; y < size; y += 64) {
    dCtx.fillRect(size / 2 - 4, y, 8, 36);
  }

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = 'rgb(185, 185, 185)';
  rCtx.fillRect(0, 0, size, size);

  const puddles = [
    { x: 140, y: 120, r: 75 },
    { x: 360, y: 260, r: 90 },
    { x: 210, y: 410, r: 80 },
    { x: 390, y: 90, r: 60 },
    { x: 120, y: 310, r: 65 },
  ];
  puddles.forEach((p) => {
    const grad = rCtx.createRadialGradient(p.x, p.y, p.r * 0.15, p.x, p.y, p.r);
    grad.addColorStop(0, 'rgb(14, 14, 14)');
    grad.addColorStop(0.65, 'rgb(32, 32, 32)');
    grad.addColorStop(1, 'rgba(185, 185, 185, 0)');
    rCtx.fillStyle = grad;
    rCtx.beginPath();
    rCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    rCtx.fill();
  });

  const map = new THREE.CanvasTexture(diffCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(repeatX, repeatY);
  roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  roughnessMap.anisotropy = 8;

  const normalMap = loadFileTexture('/textures/floor_normal.jpg', repeatX * 2, repeatY * 2, false);

  const result: PBRMaterialMaps = { map, roughnessMap, normalMap };
  pbrSetCache.set(key, result);
  return result;
}

/**
 * Generates multi-story architectural building facade PBR textures
 * Balanced dark weathered European masonry & selective warm evening windows
 */
export function getBuildingFacadePBR(
  style: FacadeStyle,
  repeatX = 2,
  repeatY = 2
): PBRMaterialMaps {
  if (!isBrowser()) return {};
  const key = `facade:${style}:${repeatX}:${repeatY}`;
  if (pbrSetCache.has(key)) return pbrSetCache.get(key)!;

  const size = 512;
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = size;
  diffCanvas.height = size;
  const dCtx = diffCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;

  const emisCanvas = document.createElement('canvas');
  emisCanvas.width = size;
  emisCanvas.height = size;
  const eCtx = emisCanvas.getContext('2d')!;

  const normCanvas = document.createElement('canvas');
  normCanvas.width = size;
  normCanvas.height = size;
  const nCtx = normCanvas.getContext('2d')!;

  const palettes: Record<
    FacadeStyle,
    { wall: string; trim: string; frame: string; rough: number }
  > = {
    heritage: { wall: '#786654', trim: '#54473b', frame: '#1e2226', rough: 210 },
    victorian: { wall: '#5e291e', trim: '#362d28', frame: '#181b1e', rough: 218 },
    medieval: { wall: '#8c7d68', trim: '#3b2514', frame: '#24170c', rough: 225 },
    cyber: { wall: '#0a121c', trim: '#142438', frame: '#00d8ff', rough: 65 },
  };
  const pal = palettes[style];

  dCtx.fillStyle = pal.wall;
  dCtx.fillRect(0, 0, size, size);

  rCtx.fillStyle = `rgb(${pal.rough},${pal.rough},${pal.rough})`;
  rCtx.fillRect(0, 0, size, size);

  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = 'rgb(128, 128, 255)';
  nCtx.fillRect(0, 0, size, size);

  const rows = 4;
  const cols = 4;
  const cellW = size / cols;
  const cellH = size / rows;

  // Stone ashlar / brick course lines
  for (let y = 0; y < size; y += 16) {
    dCtx.fillStyle = 'rgba(0,0,0,0.16)';
    dCtx.fillRect(0, y, size, 2);
    nCtx.fillStyle = 'rgb(128, 102, 245)';
    nCtx.fillRect(0, y, size, 2);
  }

  for (let r = 0; r < rows; r++) {
    const floorY = r * cellH;
    dCtx.fillStyle = pal.trim;
    dCtx.fillRect(0, floorY, size, 12);
    nCtx.fillStyle = 'rgb(128, 165, 245)';
    nCtx.fillRect(0, floorY, size, 6);
    nCtx.fillStyle = 'rgb(128, 90, 245)';
    nCtx.fillRect(0, floorY + 6, size, 6);

    if (style === 'medieval') {
      dCtx.strokeStyle = pal.trim;
      dCtx.lineWidth = 8;
      for (let c = 0; c < cols; c++) {
        const cx = c * cellW;
        dCtx.strokeRect(cx + 4, floorY + 6, cellW - 8, cellH - 12);
      }
    }

    for (let c = 0; c < cols; c++) {
      // Vertical stone pilaster between windows
      dCtx.fillStyle = 'rgba(0,0,0,0.12)';
      dCtx.fillRect(c * cellW, floorY, 6, cellH);

      const wx = c * cellW + cellW * 0.24;
      const wy = floorY + cellH * 0.24;
      const ww = cellW * 0.52;
      const wh = cellH * 0.58;

      dCtx.fillStyle = pal.trim;
      dCtx.fillRect(wx - 5, wy - 6, ww + 10, wh + 12);

      nCtx.fillStyle = 'rgb(92, 128, 235)';
      nCtx.fillRect(wx - 3, wy, 4, wh);
      nCtx.fillStyle = 'rgb(162, 128, 235)';
      nCtx.fillRect(wx + ww - 1, wy, 4, wh);
      nCtx.fillStyle = 'rgb(128, 92, 235)';
      nCtx.fillRect(wx, wy - 3, ww, 4);

      // Glossy glass pane
      rCtx.fillStyle = 'rgb(20, 20, 20)';
      rCtx.fillRect(wx, wy, ww, wh);

      // Only ~35% of windows warmly lit so buildings look realistic & grounded
      const seed = (r * 19 + c * 37 + (style === 'cyber' ? 5 : 2)) % 10;
      const isLit = seed < 4;

      if (style === 'cyber') {
        dCtx.fillStyle = isLit ? '#096b8a' : '#06121e';
        dCtx.fillRect(wx, wy, ww, wh);
        if (isLit) {
          eCtx.fillStyle = seed % 2 === 0 ? '#00c8ff' : '#ff8c2e';
          eCtx.fillRect(wx + 3, wy + 3, ww - 6, wh - 6);
        }
      } else {
        const grad = dCtx.createLinearGradient(wx, wy, wx, wy + wh);
        if (isLit) {
          grad.addColorStop(0, '#d49448');
          grad.addColorStop(1, '#4a2810');
        } else {
          grad.addColorStop(0, '#161e29');
          grad.addColorStop(1, '#090d12');
        }
        dCtx.fillStyle = grad;
        dCtx.fillRect(wx, wy, ww, wh);

        if (isLit) {
          const eGrad = eCtx.createLinearGradient(wx, wy, wx, wy + wh);
          eGrad.addColorStop(0, '#ff9d3b');
          eGrad.addColorStop(1, '#261104');
          eCtx.fillStyle = eGrad;
          eCtx.fillRect(wx + 3, wy + 3, ww - 6, wh - 6);
        }
      }

      // Window mullions
      dCtx.fillStyle = pal.frame;
      dCtx.fillRect(wx + ww / 2 - 2, wy, 4, wh);
      dCtx.fillRect(wx, wy + wh * 0.45, ww, 4);
      eCtx.fillStyle = '#000000';
      dCtx.fillRect(wx + ww / 2 - 2, wy, 4, wh);
      eCtx.fillRect(wx, wy + wh * 0.45, ww, 4);
    }
  }

  const wrap = (canvas: HTMLCanvasElement, isSRGB: boolean) => {
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeatX, repeatY);
    t.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };

  const result: PBRMaterialMaps = {
    map: wrap(diffCanvas, true),
    roughnessMap: wrap(roughCanvas, false),
    emissiveMap: wrap(emisCanvas, true),
    normalMap: wrap(normCanvas, false),
  };
  pbrSetCache.set(key, result);
  return result;
}

/**
 * Generates roof shingle / terracotta tile normal & diffuse maps
 */
export function getRoofTilePBR(
  colorHex: string,
  repeatX = 4,
  repeatY = 4
): PBRMaterialMaps {
  if (!isBrowser()) return {};
  const key = `roof:${colorHex}:${repeatX}:${repeatY}`;
  if (pbrSetCache.has(key)) return pbrSetCache.get(key)!;

  const size = 256;
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = size;
  diffCanvas.height = size;
  const dCtx = diffCanvas.getContext('2d')!;

  const normCanvas = document.createElement('canvas');
  normCanvas.width = size;
  normCanvas.height = size;
  const nCtx = normCanvas.getContext('2d')!;

  const baseColor = new THREE.Color(colorHex);
  dCtx.fillStyle = `#${baseColor.getHexString()}`;
  dCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = 'rgb(128, 128, 255)';
  nCtx.fillRect(0, 0, size, size);

  const tileW = 32;
  const tileH = 32;
  for (let y = 0; y < size; y += tileH) {
    for (let x = 0; x < size; x += tileW) {
      const vary = (((x * 11 + y * 23) % 10) - 5) * 0.012;
      const c = baseColor.clone().offsetHSL(0, 0, vary);
      dCtx.fillStyle = `#${c.getHexString()}`;
      dCtx.fillRect(x + 1, y + 1, tileW - 2, tileH - 2);

      dCtx.fillStyle = 'rgba(0,0,0,0.28)';
      dCtx.fillRect(x, y + tileH - 4, tileW, 4);
      dCtx.fillRect(x + tileW - 3, y, 3, tileH);

      nCtx.fillStyle = 'rgb(155, 128, 240)';
      nCtx.fillRect(x + 2, y, tileW / 2 - 2, tileH - 3);
      nCtx.fillStyle = 'rgb(100, 128, 240)';
      nCtx.fillRect(x + tileW / 2, y, tileW / 2 - 2, tileH - 3);
      nCtx.fillStyle = 'rgb(128, 90, 225)';
      nCtx.fillRect(x, y + tileH - 4, tileW, 4);
    }
  }

  const map = new THREE.CanvasTexture(diffCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const normalMap = new THREE.CanvasTexture(normCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(repeatX, repeatY);
  normalMap.colorSpace = THREE.LinearSRGBColorSpace;
  normalMap.anisotropy = 8;

  const result = { map, normalMap };
  pbrSetCache.set(key, result);
  return result;
}

export function getRealBrickPBR(repeatX = 3, repeatY = 3): PBRMaterialMaps {
  return {
    map: loadFileTexture('/textures/brick_diffuse.jpg', repeatX, repeatY, true),
    bumpMap: loadFileTexture('/textures/brick_bump.jpg', repeatX, repeatY, false),
    roughnessMap: loadFileTexture('/textures/brick_roughness.jpg', repeatX, repeatY, false),
  };
}

export function getRealWoodPBR(repeatX = 2, repeatY = 2): PBRMaterialMaps {
  return {
    map: loadFileTexture('/textures/wood_diffuse.jpg', repeatX, repeatY, true),
    bumpMap: loadFileTexture('/textures/wood_bump.jpg', repeatX, repeatY, false),
    roughnessMap: loadFileTexture('/textures/wood_roughness.jpg', repeatX, repeatY, false),
  };
}

export function getRealRockPBR(repeatX = 4, repeatY = 4): PBRMaterialMaps {
  return {
    normalMap: loadFileTexture('/textures/rock_normal.jpg', repeatX, repeatY, false),
    roughnessMap: loadFileTexture('/textures/rock_roughness.jpg', repeatX, repeatY, false),
  };
}

export function getRealMetalPBR(repeatX = 2, repeatY = 2): PBRMaterialMaps {
  return {
    normalMap: loadFileTexture('/textures/gold_normal.png', repeatX, repeatY, false),
  };
}
