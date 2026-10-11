import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ShieldCheck, Heart, ThumbsUp, RefreshCw, FileText, CheckCircle2, Award, ExternalLink } from 'lucide-react';
import { SpecialistProfile, FixiOrder } from '../../types/simulator.types';

interface CompletedReviewCardProps {
  specialist: SpecialistProfile;
  order: FixiOrder;
  onRestart: () => void;
  onViewDirectory: () => void;
}

const QUALITY_TAGS = [
  '⏱️ Llegó a horario',
  '✨ Dejó todo impecable',
  '💡 Explicó la reparación',
  '💰 Precio transparente',
  '🔒 Máxima seguridad',
  '⭐ 100% Recomendable',
];

export const CompletedReviewCard: React.FC<CompletedReviewCardProps> = ({
  specialist,
  order,
  onRestart,
  onViewDirectory,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(['⏱️ Llegó a horario', '⭐ 100% Recomendable']);
  const [tip, setTip] = useState<number>(1000);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    // Fire celebration confetti when entering completion
    try {
      void confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });
    } catch {
      // Ignore if in test env
    }
  }, []);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSendFeedback = () => {
    setIsSubmitted(true);
    try {
      void confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      //
    }
  };

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(order.precioEstimado + tip);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/95 border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
      {/* Celebration Header */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/25 mb-4 animate-bounce">
          <Award className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-1">
          ¡Trabajo Finalizado con Éxito!
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          ¿Cómo estuvo el servicio de {specialist.nombre}?
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          Tu reseña impulsa la reputación del profesional y mantiene segura a la comunidad FIXI en tu barrio.
        </p>
      </div>

      {/* Specialist Summary Pill */}
      <div className="flex items-center justify-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 max-w-sm mx-auto">
        <img
          src={specialist.foto}
          alt={specialist.nombre}
          className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40"
        />
        <div className="text-left">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            {specialist.nombre}
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400">{specialist.titulo}</div>
        </div>
      </div>

      {/* Interactive 5-Star Rating */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-slate-700 hover:scale-125 transition-transform"
              >
                <Star
                  className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors ${
                    active ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-slate-700'
                  }`}
                />
              </button>
            );
          })}
        </div>
        <div className="text-xs font-bold text-amber-300">
          {rating === 5 && '¡Excelente! Trabajo impecable y recomendado'}
          {rating === 4 && 'Muy bueno, quedé satisfecho'}
          {rating === 3 && 'Correcto, cumplió con lo pactado'}
          {rating <= 2 && 'Tuvo observaciones o detalles'}
        </div>
      </div>

      {/* Quality Tags Selector */}
      <div className="space-y-2 pt-2">
        <div className="text-xs text-slate-400 font-medium">
          ¿Qué destacarías de este profesional?
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {QUALITY_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Tip Selector */}
      <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-left space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-400" /> Propina voluntaria para el especialista
          </span>
          <span className="text-emerald-400 font-bold font-mono">+${tip}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          {[0, 500, 1000, 2000].map((amount) => (
            <button
              key={amount}
              onClick={() => setTip(amount)}
              className={`py-2 rounded-xl border transition-all ${
                tip === amount
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {amount === 0 ? 'Sin propina' : `$${amount}`}
            </button>
          ))}
        </div>
      </div>

      {/* Digital Receipt Summary Box */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-white font-bold flex items-center gap-1.5">
              Comprobante Oficial FIXI #{order.id.slice(0, 8).toUpperCase()}
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                PAGADO
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Garantía activa hasta {new Date(Date.now() + 90 * 86400000).toLocaleDateString('es-AR')}
            </div>
          </div>
        </div>
        <div className="text-right font-mono">
          <div className="text-[10px] text-slate-400">Total Facturado</div>
          <div className="text-sm font-bold text-white">{formattedPrice}</div>
        </div>
      </div>

      {/* Submit review action */}
      {!isSubmitted ? (
        <button
          onClick={handleSendFeedback}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Enviar Calificación y Cerrar Servicio</span>
        </button>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>¡Calificación enviada! Gracias por construir una comunidad confiable.</span>
        </div>
      )}

      {/* Action Restart / Directory Footer */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 font-semibold transition-all"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Simular otro pedido</span>
        </button>

        <button
          onClick={onViewDirectory}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center gap-2 font-semibold transition-all"
        >
          <ExternalLink className="w-4 h-4 text-slate-400" />
          <span>Ver Directorio Completo de Profesionales</span>
        </button>
      </div>
    </div>
  );
};
