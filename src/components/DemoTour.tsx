import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, MessageCircle, Briefcase, Star, Sparkles,
  ChevronRight, PlayCircle, MousePointerClick, Bot, ShieldCheck,
} from 'lucide-react';

interface DemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStepAction?: (stepId: string) => void;
}

interface TourStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  demoNote?: string;
}

const STEPS: TourStep[] = [
  {
    id: 'search',
    icon: <Search className="w-6 h-6" />,
    title: '1 · Buscá el servicio que necesitás',
    description:
      'Filtrá por rubro (jardinería, electricidad, fletes…), localidad o palabra clave. Con el GPS activo podés ordenar los resultados por cercanía real.',
    ctaLabel: 'Probar búsqueda',
    demoNote: 'En el demo ya hay 6 profesionales cargados esperando tu filtro.',
  },
  {
    id: 'contact',
    icon: <MessageCircle className="w-6 h-6" />,
    title: '2 · Contactá directo, sin intermediarios',
    description:
      'Cada tarjeta tiene dos caminos: WhatsApp con mensaje pre-armado, o el mensaje interno de Fixi. Probalo: el profesional te responde al momento (simulado).',
    ctaLabel: 'Abrir un chat demo',
    demoNote: 'Mandá un mensaje y mirá el indicador "Escribiendo…".',
  },
  {
    id: 'request',
    icon: <Briefcase className="w-6 h-6" />,
    title: '3 · Publicá lo que necesitás',
    description:
      '¿No encontrás a nadie? Publicá tu solicitud en la Bolsa de Trabajos: los profesionales de tu zona reciben la alerta y se postulan.',
    ctaLabel: 'Publicar solicitud demo',
    demoNote: 'Los proveedores "se interesan" automáticamente en el modo demo.',
  },
  {
    id: 'rate',
    icon: <Star className="w-6 h-6" />,
    title: '4 · Calificá la experiencia',
    description:
      'Después del trabajo, dejá tu reseña con estrellas. Las calificaciones construyen la reputación del profesional y ayudan al resto de la comunidad.',
    ctaLabel: 'Ver calificación demo',
    demoNote: 'Tu reseña suma al promedio visible en cada tarjeta.',
  },
];

export const DemoTour: React.FC<DemoTourProps> = ({ isOpen, onClose, onStepAction }) => {
  const [stepIndex, setStepIndex] = useState(0);
  if (!isOpen) return null;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const handleClose = () => {
    setStepIndex(0);
    onClose();
  };

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="gradient-border w-full max-w-lg rounded-3xl shadow-2xl relative text-white overflow-hidden">

        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
          aria-label="Cerrar tour"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold">
              <PlayCircle className="w-3.5 h-3.5" />
              TOUR DEMO INTERACTIVO
            </span>
          </div>

          {/* Animated step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25 shrink-0">
                  {step.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {step.title}
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {step.description}
              </p>

              {step.demoNote && (
                <div className="mb-6 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Bot className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step.demoNote}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Interactive CTA */}
          {onStepAction && step.ctaLabel && (
            <button
              onClick={() => onStepAction(step.id)}
              className="w-full mb-3 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <MousePointerClick className="w-4 h-4" />
              {step.ctaLabel}
            </button>
          )}

          {/* Progress + navigation */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              {STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === stepIndex
                      ? 'w-6 bg-emerald-400'
                      : i < stepIndex
                      ? 'w-1.5 bg-emerald-500/60'
                      : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all btn-shine"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              {isLast ? '¡Empezar a usar Fixi!' : 'Siguiente'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-slate-500 mt-4 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Todos los datos en este tour son de demostración — nada se envía a un profesional real.
          </p>
        </div>
      </div>
    </div>
  );
};
