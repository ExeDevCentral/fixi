import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import { Proveedor } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Proveedor | null;
  userEmail?: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  provider,
  userEmail = 'cliente@google.com',
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !provider) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('resenas').insert([
          {
            proveedor_id: provider.id,
            usuario_email: userEmail,
            puntaje: rating,
            comentario,
          },
        ]);
      }

      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setComentario('');
        setRating(5);
        onClose();
      }, 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative bg-[#0f172a] text-white">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle className="w-14 h-14 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-1">¡Gracias por tu Calificación!</h3>
            <p className="text-xs text-slate-300">Tu opinión ayuda a mantener la calidad de la comunidad Fixi.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-xl font-extrabold text-white font-sans">Calificar Servicio</h3>
              <p className="text-xs text-slate-400 mt-1">
                ¿Qué tal fue tu experiencia con <strong className="text-emerald-400">{provider.nombre}</strong>?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Star Selector */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Comentario (Opcional)</label>
                <textarea
                  rows={3}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Excelente puntualidad, trabajo prolijo y precio justo..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                {submitting ? 'Enviando...' : 'Enviar Calificación'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
