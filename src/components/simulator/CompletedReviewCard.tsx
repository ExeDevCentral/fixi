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
  '⏱️ Puntualidad estricta',
  '✨ Prolijidad y limpieza',
  '💡 Explicación técnica clara',
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
  const [selectedTags, setSelectedTags] = useState<string[]>(['⏱️ Puntualidad estricta', '⭐ 100% Recomendable']);
  const [tip, setTip] = useState<number>(1000);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    try {
      void confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#ffffff', '#38bdf8', '#f59e0b'],
      });
    } catch {
      //
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
    <div className="w-full max-w-2xl mx-auto rounded-3xl obsidian-card p-6 sm:p-10 shadow-2xl text-center space-y-6">
      {/* Celebration Header */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-emerald-400 flex items-center justify-center shadow-inner mb-4">
          <Award className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
          SERVICIO FINALIZADO • EXPEDIENTE CERRADO
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
          Calificación del Servicio
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
          Tu devolución califica el historial oficial de {specialist.nombre} en la red FIXI.
        </p>
      </div>

      {/* Specialist Summary Pill */}
      <div className="flex items-center justify-center gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.08] max-w-sm mx-auto">
        <img
          src={specialist.foto}
          alt={specialist.nombre}
          className="w-10 h-10 rounded-xl object-cover border border-white/[0.15]"
        />
        <div className="text-left">
          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
            {specialist.nombre}
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400">{specialist.titulo}</div>
        </div>
      </div>

      {/* Interactive 5-Star Rating */}
      <div className="space-y-2 pt-2">
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
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                    active ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]' : 'text-slate-700'
                  }`}
                />
              </button>
            );
          })}
        </div>
        <div className="text-xs font-medium text-amber-300">
          {rating === 5 && 'Sobresaliente • Cumplimiento total'}
          {rating === 4 && 'Muy satisfactorio • Excelente atención'}
          {rating === 3 && 'Aceptable • Cumplió lo solicitado'}
          {rating <= 2 && 'Observaciones sobre el servicio'}
        </div>
      </div>

      {/* Quality Tags Selector */}
      <div className="space-y-2.5 pt-2">
        <div className="text-[11px] text-slate-400 font-medium">
          Seleccioná los puntos fuertes observados:
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {QUALITY_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-white text-slate-950 font-semibold border-white shadow-sm'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:text-white hover:border-white/[0.15]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Tip Selector */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-left space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-pink-400" /> Gratificación voluntaria al especialista
          </span>
          <span className="text-emerald-400 font-semibold font-mono">+${tip}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          {[0, 500, 1000, 2000].map((amount) => (
            <button
              key={amount}
              onClick={() => setTip(amount)}
              className={`py-2 rounded-xl border transition-all ${
                tip === amount
                  ? 'bg-white text-slate-950 font-semibold border-white shadow-sm'
                  : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-slate-200'
              }`}
            >
              {amount === 0 ? 'Sin propina' : `$${amount}`}
            </button>
          ))}
        </div>
      </div>

      {/* Digital Receipt Summary Box */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] flex items-center justify-between text-xs text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] text-slate-300 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-white font-medium flex items-center gap-2">
              Comprobante Digital #{order.id.slice(0, 8).toUpperCase()}
              <span className="text-[9px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                PAGADO
              </span>
            </div>
            <div className="text-slate-400 text-[10px] font-mono">
              Garantía activa hasta {new Date(Date.now() + 90 * 86400000).toLocaleDateString('es-AR')}
            </div>
          </div>
        </div>
        <div className="text-right font-mono">
          <div className="text-[9px] text-slate-400 uppercase">Total Liquidado</div>
          <div className="text-sm font-semibold text-white">{formattedPrice}</div>
        </div>
      </div>

      {/* Submit review action */}
      {!isSubmitted ? (
        <button
          onClick={handleSendFeedback}
          className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Enviar Evaluación y Finalizar</span>
        </button>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Evaluación registrada exitosamente. Gracias por confiar en FIXI.</span>
        </div>
      )}

      {/* Action Restart / Directory Footer */}
      <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] flex items-center justify-center gap-2 font-medium transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simular otro requerimiento</span>
        </button>

        <button
          onClick={onViewDirectory}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-white/[0.06] flex items-center justify-center gap-2 font-medium transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>Explorar Directorio Completo</span>
        </button>
      </div>
    </div>
  );
};
