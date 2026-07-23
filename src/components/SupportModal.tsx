import React, { useState } from 'react';
import { X, HelpCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { TicketSoporte } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onTicketCreated: (ticket: TicketSoporte) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onTicketCreated,
}) => {
  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('Problema con un servicio');
  const [mensaje, setMensaje] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asunto || !mensaje) return;

    setSubmitting(true);

    const payload = {
      usuario_email: userEmail,
      asunto,
      categoria,
      mensaje,
      estado: 'Abierto' as const,
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('tickets_soporte')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        if (data) onTicketCreated(data as TicketSoporte);
      } else {
        const localCreated: TicketSoporte = {
          id: `ticket-${Date.now()}`,
          ...payload,
          created_at: new Date().toISOString(),
        };
        onTicketCreated(localCreated);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAsunto('');
        setMensaje('');
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
      <div className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative bg-[#0f172a] text-white">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle className="w-14 h-14 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-1">¡Ticket Creado con Éxito!</h3>
            <p className="text-xs text-slate-300">Te responderemos a la brevedad en tu panel de control.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Centro de Soporte</h3>
                <p className="text-xs text-slate-400">¿Dudas o inconvenientes con un servicio? Creá un ticket.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Categoría del Reclamo</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white bg-[#090d16]"
                >
                  <option value="Problema con un servicio">Problema con un servicio</option>
                  <option value="Reportar contenido o abuso">Reportar contenido o abuso</option>
                  <option value="Sugerencia de mejora">Sugerencia de mejora</option>
                  <option value="Consulta general">Consulta general</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Asunto *</label>
                <input
                  type="text"
                  required
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  placeholder="Ej: Inconveniente con presupuesto flete"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Mensaje / Detalle *</label>
                <textarea
                  rows={4}
                  required
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Detallá la situación para que el equipo de soporte pueda asistirte..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                {submitting ? 'Enviando...' : 'Enviar Ticket de Soporte'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
