import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, CheckCircle, ShieldAlert } from 'lucide-react';
import { Proveedor, Mensaje, UserProfile } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendNewMessageNotificationEmail } from '../lib/resend';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Proveedor | null;
  currentUser: UserProfile | null;
  onMessageSent?: (mensaje: Mensaje) => void;
  onProviderReply?: (mensaje: Mensaje) => void;
}

/**
 * Demo simulation: generates a realistic provider reply so the client
 * can experience the full conversation flow (message → typing → reply).
 */
function buildDemoReply(provider: Proveedor, isFirstReply: boolean): string {
  const cat = provider.categoria?.nombre || 'servicio';
  if (isFirstReply) {
    return `¡Hola! Gracias por escribir a ${provider.nombre} 👋. Trabajamos ${cat.toLowerCase()} en ${provider.zona?.nombre || 'la zona'}. Contame un poco más del trabajo (medidas, urgencia, dirección) y te paso presupuesto hoy mismo.`;
  }
  const followUps = [
    'Perfecto, lo anoto. ¿Podés pasarme una foto o más detalles? Así te cierro el precio exacto.',
    'Ten disponibilidad esta semana. Te dejo presupuesto estimado y coordinamos visita sin cargo.',
    '¡Bárbaro! Quedo a la espera del detalle y te confirmo horario. Trabajo con garantía y factura.',
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  provider,
  currentUser,
  onMessageSent,
  onProviderReply,
}) => {
  const [contenido, setContenido] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [providerTyping, setProviderTyping] = useState(false);
  const [replyCount, setReplyCount] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup simulated timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!isOpen || !provider) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim()) return;

    if (!currentUser) {
      setErrorMsg('Debés iniciar sesión con tu cuenta para enviar mensajes.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const targetEmail = provider.email || `proveedor-${provider.id}@fixi.app`;

    const payload = {
      emisor_email: currentUser.email,
      receptor_email: targetEmail,
      proveedor_id: provider.id,
      contenido: contenido.trim(),
      leido: false,
    };

    try {
      let createdMessage: Mensaje;

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('mensajes')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        createdMessage = data as Mensaje;
      } else {
        createdMessage = {
          id: `msg-${Date.now()}`,
          ...payload,
          created_at: new Date().toISOString(),
          proveedor: provider,
        };
      }

      if (onMessageSent) {
        onMessageSent(createdMessage);
      }

      // Try sending email alert via Resend if provider has an email
      if (provider.email) {
        sendNewMessageNotificationEmail({
          receptor_email: provider.email,
          emisor_nombre: currentUser.nombre,
          contenido: contenido.trim(),
        }).catch(console.error);
      }

      setContenido('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1200);

      // ===== DEMO: simulate provider reply with typing indicator =====
      if (!isSupabaseConfigured) {
        const t1 = setTimeout(() => setProviderTyping(true), 900);
        const t2 = setTimeout(() => {
          setProviderTyping(false);
          const reply = buildDemoReply(provider, replyCount === 0);
          const replyMsg: Mensaje = {
            id: `msg-${Date.now()}-reply`,
            emisor_email: targetEmail,
            receptor_email: currentUser.email,
            proveedor_id: provider.id,
            contenido: reply,
            leido: true,
            created_at: new Date().toISOString(),
            proveedor: provider,
          };
          setReplyCount((c) => c + 1);
          onProviderReply?.(replyMsg);
        }, 3200);
        timersRef.current.push(t1, t2);
        return;
      }
      // ===== end demo simulation =====

    } catch (err: any) {
      console.error('Error enviando mensaje:', err);
      setErrorMsg(err.message || 'No se pudo enviar el mensaje.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="gradient-border w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle className="w-14 h-14 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-1">¡Mensaje Enviado!</h3>
            <p className="text-xs text-slate-300">
              Podés continuar el chat desde la pestaña <strong>Mensajes</strong> en tu Panel.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-700 shrink-0">
                <img
                  src={provider.foto_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=200&q=80'}
                  alt={provider.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-snug">{provider.nombre}</h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  {providerTyping ? (
                    <>
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="ml-1 text-emerald-300">Escribiendo…</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-3.5 h-3.5" />
                      Mensaje directo privado
                    </>
                  )}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tu Mensaje</label>
                <textarea
                  rows={4}
                  required
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  placeholder={`Hola ${provider.nombre}, me interesan tus servicios de ${provider.categoria?.nombre || 'trabajo'}...`}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all btn-shine"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Enviando...' : 'Enviar Mensaje Directo'}</span>
              </button>
            </form>

            {!isSupabaseConfigured && (
              <p className="text-[10px] text-center text-slate-500 mt-3">
                💡 Modo demo: el profesional te responderá automáticamente en unos segundos.
              </p>
            )}
          </>
        )}

      </div>
    </div>
  );
};
