# CHRONOS — Aeternum

A cinematic, scroll-driven time exploration experience featuring a fictional city across five historical eras.

## Tech Stack (Foundation)
- **Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animation & Scroll:** GSAP, ScrollTrigger

## Project Architecture
```
src/
├── app/
│   ├── layout.tsx         # Root layout with fonts, metadata, dark theme
│   ├── page.tsx           # Minimal working homepage with dark cinematic foundation
│   └── globals.css        # Tailwind and dark cinematic styles
├── components/
│   ├── canvas/
│   │   ├── Scene.tsx      # R3F Canvas container with responsive sizing & lighting
│   │   └── FoundationMesh.tsx # Functioning 3D canvas element (rotating temporal geometry)
│   ├── ui/
│   │   ├── Header.tsx     # Cinematic header (status, branding)
│   │   └── Overlay.tsx    # Cinematic UI overlay (telemetry, coordinates, typography)
├── hooks/
│   └── useScrollPosition.ts # Scroll position tracking hook
├── lib/
│   ├── gsap.ts            # GSAP & ScrollTrigger client registration
│   └── constants.ts       # Core project constants
└── types/
    └── index.ts           # Type definitions
```

## Getting Started
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build
```bash
npm run build
npm run start
```
