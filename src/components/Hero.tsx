import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, MapPin, Star } from 'lucide-react';

function FloatingScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.x -= delta * 0.1;
      mesh2Ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#22c55e" />
      
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={meshRef} position={[2.5, 0.5, -2]}>
          <icosahedronGeometry args={[1.5, 2]} />
          <MeshDistortMaterial
            color="#22c55e"
            roughness={0.2}
            metalness={0.8}
            distort={0.35}
            speed={1.5}
            wireframe
          />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={1} floatIntensity={1.2}>
        <mesh ref={mesh2Ref} position={[-2.8, -0.8, -3]}>
          <torusGeometry args={[1.1, 0.25, 16, 32]} />
          <meshStandardMaterial color="#10b981" roughness={0.1} metalness={0.9} wireframe />
        </mesh>
      </Float>
    </>
  );
}

interface HeroProps {
  totalProviders: number;
}

export const Hero: React.FC<HeroProps> = ({ totalProviders }) => {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden py-10 sm:py-16 px-4 bg-hero-glow">
      
      {/* 3D Canvas Background (Desktop/Tablet) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 hidden sm:block">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <FloatingScene />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-semibold mb-4 shadow-md"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 shrink-0" />
          <span>Servicios Locales en Rosario, Funes y Roldán</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] mb-4"
        >
          Encontrá el servicio que necesitas en <span className="text-gradient">Chambea</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mb-6"
        >
          Jardinería, fletes, electricidad, plomería y más. Contacto directo por WhatsApp sin comisiones ni registros.
        </motion.p>

        {/* Badges strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300"
        >
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Un clic a WhatsApp</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Rosario, Funes, Roldán</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Star className="w-4 h-4 text-emerald-400" />
            <span>{totalProviders} Profesionales</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
