import React, { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, MapPin, Star } from 'lucide-react';

const HeroScene3D = lazy(() => import('./HeroScene3D'));

function SceneBackground() {
  const [renderScene, setRenderScene] = useState(false);

  useEffect(() => {
    // Defer the three.js chunk until after the initial paint
    let id: number | ReturnType<typeof setTimeout>;
    const hasIdle = typeof (window as any).requestIdleCallback === 'function';
    if (hasIdle) {
      id = (window as any).requestIdleCallback(() => setRenderScene(true), { timeout: 1200 });
    } else {
      id = window.setTimeout(() => setRenderScene(true), 400);
    }
    return () => {
      if (hasIdle) {
        (window as any).cancelIdleCallback(id);
      } else {
        window.clearTimeout(id);
      }
    };
  }, []);

  if (!renderScene) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 hidden sm:block">
      <Suspense fallback={null}>
        <HeroScene3D />
      </Suspense>
    </div>
  );
}

interface HeroProps {
  totalProviders: number;
  onOpenRequestJob?: () => void;
  onOpenAddProvider?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalProviders,
  onOpenRequestJob,
  onOpenAddProvider,
}) => {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden py-10 sm:py-16 px-4 bg-app-glow">
      
      {/* 3D Canvas Background (Desktop/Tablet, deferred) */}
      <SceneBackground />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-extrabold mb-4 shadow-md backdrop-blur-md"
        >
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/30 shrink-0 animate-pulse" />
          <span>Plataforma Inteligente de Servicios — Rosario y Región</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] mb-4 font-sans"
        >
          Conectá con Especialistas y Pedí Presupuesto en <span className="text-gradient">FIXI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8"
        >
          La red profesional de jardinería, electricidad, fletes, plomería y construcción. Contacto directo por WhatsApp y sistema de alertas en tiempo real.
        </motion.p>

        {/* Hero App Quick Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8 w-full max-w-md"
        >
          {onOpenRequestJob && (
            <button
              onClick={onOpenRequestJob}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all"
            >
              <span>Pedir Presupuesto / Alerta</span>
            </button>
          )}

          {onOpenAddProvider && (
            <button
              onClick={onOpenAddProvider}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Publicar mi Servicio</span>
            </button>
          )}
        </motion.div>

        {/* Badges strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300"
        >
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Contacto Directo WhatsApp</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Rosario, Funes, Roldán, Baigorria</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span>{totalProviders} Profesionales Activos</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
