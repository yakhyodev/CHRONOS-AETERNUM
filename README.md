# CHRONOS — AETERNUM (v1.0.0)

> **Time Remembers Everything.**  
> A cinematic, scroll-driven interactive exploration of the lost city of Aeternum across five historical eras, powered by Next.js, Three.js, React Three Fiber, and GSAP.

---

## 🏛️ Project Overview

**CHRONOS — Aeternum** is a production-grade 3D creative web experience where visitors take on the role of **Observer 07**. Traversing from an ancient underground subterranean chamber containing the monumental **Chronos Core**, travelers cross a spatial temporal threshold into the living city of **Aeternum**, witnessing its continuous evolution across 3,400 years of architectural history.

### Experience Structure
1. **Prologue — The Chronos Chamber**: Subterranean cathedral with stone colonnades, flickering ember braziers, and the real 3D astronomical gimbal mechanism.
2. **The City of Aeternum (5 Districts)**:
   - **Chronos Plaza**: The monumental Century Clock Tower and central civil forum.
   - **The Old District**: Medieval half-timbered merchant streets and cathedral spires.
   - **The River Crossing**: Arch bridges, aqueducts, and flowing waterways.
   - **The Industrial Quarter**: Victorian brickwork, iron trusses, and clockwork gear assemblies.
   - **The High Observatory**: Clifftop astronomical dome overlooking the canyon.
3. **The Five Eras (3,400-Year Timeline)**:
   - `1200 BCE` — *The Primordial Origin* (Sundial & megaliths)
   - `1450 CE` — *The High Kingdom* (Ashlar stonework, cathedral bells)
   - `1890 CE` — *The Iron & Steam Revolution* (Riveted iron, gas lanterns, machinery)
   - `2026 CE` — *The Present Era* (Polished granite, gold cupola, modern civic order)
   - `2200 CE` — *The Next Age* (Levitating chronal rings, fusion energy spire)
4. **Interactive Modes**:
   - **Story Mode**: Continuous 8-segment Catmull-Rom spline camera flight driven by scroll or scrubber.
   - **Explore Mode**: Orbit rotation, pinch-zoom, and district-by-district free investigation.
   - **Temporal Lens**: Holographic architectural ghost inspection revealing past and future forms.
   - **Time Freeze**: Halts ambient physical movement while maintaining real-time camera controls.
   - **Five Temporal Echoes & Narrative Journal**: Collect hidden memory crystals to decode Observer 07 transmissions.
5. **The Paradox Finale**: Sequence of realities fracturing, culminating in two canonical endings:
   - **Restore Time**: Stabilizes chronological flow and preserves the timeline.
   - **Explore the Unknown**: Unlocks perpetual free exploration across fractured temporal planes.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Runtime**: React 19 / React DOM 19
- **3D Graphics Engine**: Three.js (`three`), React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animation Orchestration**: GSAP 3
- **Audio Architecture**: Custom `AudioManager` supporting Ogg Opus with WAV fallback and background-tab lifecycle handling
- **Typography & UI**: Tailwind CSS 4, Lucide React, Google Fonts (*Cinzel*, *Space Mono*, *Syne*, *Plus Jakarta Sans*)
- **Code Quality & Testing**: TypeScript 6, Vitest, Oxlint

---

## 🚀 Quick Start & Commands

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later

### Installation
```bash
git clone https://github.com/yakhyodev/CHRONOS-AETERNUM.git
cd CHRONOS-AETERNUM
npm ci
```

### Development Server
```bash
npm run dev
# Starts local development server on http://localhost:3000
```

### Production Build & Verification
```bash
npm run build      # Creates optimized production build with Turbopack
npm run start      # Runs production server on http://localhost:3000
npm run typecheck  # Validates TypeScript types (0 errors)
npm run lint       # Runs Oxlint static code analysis (0 warnings)
npm run test       # Executes complete Vitest unit test suite (64 tests)
npm run e2e        # Runs E2E smoke and asset validation tests
```

---

## 🎮 Controls & Navigation

| Action | Desktop Interaction | Mobile / Touch Interaction |
| :--- | :--- | :--- |
| **Cinematic Flight** | Mouse Wheel / Vertical Scroll | Vertical Touch Swipe |
| **Timeline Scrub** | Click / Drag Timeline Instrument | Touch & Drag Timeline Instrument (`touch-none`) |
| **Era Stepping** | Left / Right Arrow Keys | Tap Era Milestone Stops |
| **Explore Orbit** | Click + Drag on Canvas | 1-Finger Touch Drag |
| **Explore Zoom** | Mouse Scroll Wheel | 2-Finger Pinch In / Out |
| **Temporal Lens** | Hover & Click Landmark Markers | Tap Landmark Markers |
| **Time Freeze** | `F` Key / HUD Pill Toggle | Tap Freeze Button |
| **Chamber Activation** | Click CTA / `Space` / `Enter` | Tap `INITIALIZE CHRONOS` |

---

## ⚙️ Adaptive Quality Presets

CHRONOS features an adaptive graphics ladder configured via `chronosStore`:
- **AUTO**: Evaluates client hardware hints (CPU cores $\le 4$, mobile UA, reduced motion) and monitors rolling frame latency. If sustained average FPS drops below 28, it gracefully steps down quality with a 10s hysteresis cooldown.
- **HIGH**: Full dynamic shadow maps (1024/2048), DPR clamped to $[1, 2]$, 360 chamber embers.
- **MEDIUM**: Balanced shadow mapping (512/1024), DPR clamped to $[1, 1.5]$, 220 chamber embers.
- **LOW**: Maximum performance, shadow maps bypassed on omnidirectional point lights, DPR clamped to $[1, 1]$, 120 chamber embers.

User quality selection persists across sessions via `localStorage`.

---

## 🎵 Audio System

- **Autoplay Compliance**: Muted until first user gesture (`pointerdown`, `keydown`, `touchstart`).
- **Codec Optimization**: Automatically detects browser Ogg Opus capability, serving high-efficiency Phase 11 audio (`.ogg`) with graceful WAV (`.wav`) fallback.
- **Power Efficiency**: Listens to `visibilitychange` to automatically pause ambient loops when the tab is backgrounded.
- **Mixer Controls**: Independent master volume, ambient crossfading, and SFX levels with persistence.

---

## 🌐 Deployment to Vercel

The application is pre-configured for Vercel deployment with `vercel.json`:
1. Push repository to GitHub (`main` branch).
2. Import project into [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset: **Next.js** (automatically detected).
4. Build Command: `next build`
5. Output Directory: `.next`

---

## 📱 Browser Compatibility

- **Desktop**: Chrome 100+, Edge 100+, Safari 16+, Firefox 110+.
- **Mobile**: iOS Safari 16+, Chrome for Android 110+.
- **Fallback**: Graceful static archival mode is activated automatically if hardware WebGL is unavailable or fails context creation.

---

## 📄 License

MIT License © 2026 Yakhyo Nematov. Built with Antigravity.
