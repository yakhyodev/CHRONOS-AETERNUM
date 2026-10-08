'use client';

export function AtmosphereOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 mix-blend-screen opacity-70"
      style={{
        backgroundImage: 'url(/chronos/atmosphere-overlay.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
