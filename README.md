# CHRONOS — Aeternum

A cinematic, scroll-driven time exploration experience featuring a fictional city across five historical eras.

## Phase 02: Cinematic Intro & Chronos Core Inside Ancient Chamber

Phase 02 transforms the foundation into an immersive cinematic prologue featuring the astronomical **Chronos Core** mechanism situated inside a monumental subterranean stone chamber.

### Key Features
- **Real 3D Chronos Core:**
  - Monumental external astronomical ring with aged bronze & warm gold stepped graduations.
  - Independently rotating nested gimbal rings (Meridian, Solstice, Ecliptic, Horary).
  - Suspended luminous central fusion energy core with corona and orbiting plasma filaments.
  - Interlocking celestial mechanisms, astrolabe retes, gears, and procedural rune engravings.
  - Interactive activation timeline accelerating rotation and emitting temporal energy pulses.
- **Monumental Ancient Chamber:**
  - Colossal stone colonnades and transverse nave arches.
  - Deep perspective with vaulted crypt and distant chasm backdrops.
  - Tiered dais with engraved concentric calendar inlays reflecting the amber core light.
  - Ancient stone stairs lined with warm flickering ember braziers.
  - Solitary cloaked wanderer silhouette providing human scale and awe.
- **Cinematic Camera Sequence (Storyboard 01–06):**
  - **Shot 01:** Wide Establishing (Chamber Entrance)
  - **Shot 02:** Slow Dolly In (Chamber Approach)
  - **Shot 03:** Orbital Move (Axial Orbit)
  - **Shot 04:** Close-Up (Mechanism Details)
  - **Shot 05:** Activation (Temporal Pulse)
  - **Shot 06:** Transition (Horizon Portal)
- **Cinematic Interface:**
  - Left-aligned title block with Ivory and Warm Gold typography.
  - Interactive `INITIALIZE CHRONOS` CTA with core emblem mark.
  - Interactive storyboard shot switcher.
  - Responsive layout for desktop and mobile viewports.
  - Keyboard activation (`Enter` / `Space`) & prefers-reduced-motion support.

### Tech Stack
- **Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Phase 02 Palette: Void Black `#08090D`, Dark Stone `#192025`, Antique Bronze `#735536`, Warm Gold `#D4AF37`, Ember Light `#EAB774`, Ivory `#F5F3ED`)
- **3D Graphics:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animation:** GSAP (orchestrated camera transitions & activation timelines)

---

### Project Structure
```
src/
├── app/
│   ├── layout.tsx                     # Metadata, dark theme, cinematic Google Fonts
│   ├── page.tsx                       # Phase 02 master controller & state
│   └── globals.css                    # Palette and scrollbar tokens
├── components/
│   ├── canvas/
│   │   ├── Scene.tsx                  # Master R3F canvas, soft shadows, fog
│   │   ├── CinematicCameraRig.tsx     # GSAP camera sequence & organic sway
│   │   ├── CoreLighting.tsx           # Amber core point light, fill, and cool rim
│   │   ├── EnvironmentalParticles.tsx # Volumetric dust motes and embers
│   │   ├── chamber/
│   │   │   ├── ChamberEnvironment.tsx # Chamber composite
│   │   │   ├── StoneColumns.tsx       # Monumental fluted columns
│   │   │   ├── GrandArches.tsx        # High vaulted arches
│   │   │   ├── ChamberFloor.tsx       # Tiered dais, calendar inlays, steps
│   │   │   ├── Braziers.tsx           # Stone braziers with flickering ember flame
│   │   │   └── WandererSilhouette.tsx # Cloaked wanderer silhouette
│   │   └── core/
│   │       ├── ChronosCore.tsx        # Master core assembly
│   │       ├── OuterRing.tsx          # Astronomical outer ring & pedestals
│   │       ├── InnerRing.tsx          # Nested gimbal rings
│   │       ├── CelestialMechanism.tsx # Astrolabe retes, gears, axis
│   │       ├── EnergySphere.tsx       # Luminous central fusion core & pulse
│   │       └── AncientEngravings.tsx  # 3D tick marks & runes
│   └── ui/
│       ├── CinematicUI.tsx            # Left-aligned hero, CTA, status
│       ├── ShotNavigator.tsx          # Storyboard shot switcher (01-06)
│       ├── AtmosphereOverlay.tsx      # SVG vignette and dust overlay
│       └── DebugPanel.tsx             # Dev-only minimal debug console
├── lib/
│   ├── constants.ts                   # Palette, shot configs, strings
│   └── gsap.ts                        # GSAP registration
└── types/
    └── index.ts                       # State & camera types
```

---

### Verification
```bash
npm run dev     # Starts local server on http://localhost:3000
npm run build   # Verifies production compilation
```
