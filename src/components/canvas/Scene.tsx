'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FoundationMesh } from './FoundationMesh';

interface SceneProps {
  className?: string;
}

export function Scene({ className = '' }: SceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-[#05050a] ${className}`}>
        <div className="w-8 h-8 rounded-full border border-amber-400/30 border-t-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#05050a']} />
        
        {/* Cinematic Ambient and Key Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#fff7d6" />
        <pointLight position={[-5, -3, -4]} intensity={2.0} color="#00f2fe" />
        <pointLight position={[0, 4, 2]} intensity={1.2} color="#d4af37" />

        <Suspense fallback={null}>
          <FoundationMesh />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
