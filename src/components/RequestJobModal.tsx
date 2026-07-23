import React, { useState } from 'react';
import { X, Briefcase, CheckCircle, ShieldAlert, Zap } from 'lucide-react';
import { Categoria, Zona, SolicitudTrabajo } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendJobAlertBroadcastEmail } from '../lib/resend';
import confetti from 'canvas-confetti';

interface RequestJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Categoria[];
  zones: Zona[];
  userEmail?: string;
  userName?: string;
  onRequestCreated: (solicitud: SolicitudTrabajo) => void;
}

export const RequestJobModal: React.FC<RequestJobModalProps> = ({
  isOpen,
  onClose,
  categories,
  zones,
  userEmail = '',
  userName = '',
  onRequestCreated,
}) => {
  const [nombre, setNombre] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [telefono, setTelefono] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [zonaId, setZonaId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [urgencia, setUrgencia] = useState<'Urgente 24hs' | 'Esta Semana' | 'Programado' | 'Normal'>('Normal');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !telefono || !categoriaId || !zonaId || !titulo || !descripcion) {
      setErrorMsg('Por favor completá los campos obligatorios (*)');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const selectedCat = categories.find((c) => c.id === categoriaId);
    const selectedZona = zones.find((z) => z.id === zonaId);

    const payload = {
      cliente_nombre: nombre,
      cliente_email: email,
      cliente_telefono: telefono,
      categoria_id: categoriaId,
      zona_id: zonaId,
      titulo,
      descripcion,
      presupuesto_estimado: presupuesto || 'A convenir',
      urgencia,
      estado: 'Abierta' as const,
    };

    try {
      let createdRequest: SolicitudTrabajo;

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('solicitudes_trabajo')
          .insert([payload])
          .select(`*, categoria:categorias(*), zona:zonas(*)`)
          .single();

        if (error) throw error;
        createdRequest = data as SolicitudTrabajo;
      } else {
        createdRequest = {
          id: `sol-${Date.now()}`,
          ...payload,
          categoria: selectedCat,
          zona: selectedZona,
          created_at: new Date().toISOString(),
        };
      }

      onRequestCreated(createdRequest);

      // Broadcast alert emails to providers in this category & zone using Resend API
      if (isSupabaseConfigured && supabase) {
        const { data: matchedProviders } = await supabase
          .from('proveedores')
          .select('email')
          .eq('categoria_id', categoriaId)
          .eq('zona_id', zonaId)
          .not('email', 'is', null);

        if (matchedProviders && matchedProviders.length > 0) {
          matchedProviders.forEach((p) => {
            if (p.email) {
              sendJobAlertBroadcastEmail({
                to: p.email,
                titulo,
                descripcion,
                categoria: selectedCat?.nombre,
                zona: selectedZona?.nombre,
                urgencia,
                presupuesto,
              }).catch(console.error);
            }
          });
        }
      }

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitulo('');
        setDescripcion('');
        setPresupuesto('');
        setUrgencia('Normal');
        onClose();
      }, 1800);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al publicar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative bg-[#0f172a] text-white max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-12 text-center flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-amber-400 mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Publicada!</h3>
            <p className="text-slate-300 text-sm">
              Notificamos a los profesionales de tu zona. Te contactarán a la brevedad.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Briefcase className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Publicá tu Necesidad / Pedí Presupuesto</h3>
                <p className="text-xs text-slate-400">Alertamos a los especialistas verificados de tu rubro.</p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tu Nombre *</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Laura Rossi"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp de Contacto *</label>
                  <input
                    type="text"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej: 3415123456"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuemail@ejemplo.com"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rubro / Categoría *</label>
                  <select
                    required
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-[#090d16]"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Zona / Barrio *</label>
                  <select
                    required
                    value={zonaId}
                    onChange={(e) => setZonaId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-[#090d16]"
                  >
                    <option value="">Seleccionar...</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>{z.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Trabajo / Problema *</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Cambio de termotanque y pérdida en cocina"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Urgencia *</label>
                  <select
                    value={urgencia}
                    onChange={(e: any) => setUrgencia(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-[#090d16]"
                  >
                    <option value="Normal">Normal (Sin apuro)</option>
                    <option value="Esta Semana">Esta Semana</option>
                    <option value="Urgente 24hs">⚡ Urgente 24hs</option>
                    <option value="Programado">Programado a futuro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Presupuesto Estimado (Opcional)</label>
                  <input
                    type="text"
                    value={presupuesto}
                    onChange={(e) => setPresupuesto(e.target.value)}
                    placeholder="Ej: $45.000 / A convenir"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detalle del Requerimiento *</label>
                <textarea
                  rows={3}
                  required
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detallá marcas, medidas, accesibilidad o cualquier info útil..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{submitting ? 'Enviando Alertas...' : 'Publicar Solicitud y Alertar Profesionales'}</span>
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
