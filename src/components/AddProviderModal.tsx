import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Categoria, Zona, Proveedor } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Categoria[];
  zones: Zona[];
  onProviderAdded: (provider: Proveedor) => void;
}

export const AddProviderModal: React.FC<AddProviderModalProps> = ({
  isOpen,
  onClose,
  categories,
  zones,
  onProviderAdded,
}) => {
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [zonaId, setZonaId] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !categoriaId || !zonaId || !telefono || !dni || !email) {
      setErrorMsg('Por favor completá todos los campos obligatorios (*)');
      return;
    }

    if (!aceptoTerminos) {
      setErrorMsg('Debés aceptar los términos y condiciones de cumplimiento legal para continuar.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    // Clean phone number (add 549341 prefix if only 7 digits provided)
    let cleanPhone = telefono.replace(/\D/g, '');
    if (cleanPhone.length === 7 || cleanPhone.length === 8) {
      cleanPhone = `549341${cleanPhone}`;
    } else if (!cleanPhone.startsWith('54')) {
      cleanPhone = `549${cleanPhone}`;
    }

    const selectedCat = categories.find((c) => c.id === categoriaId);
    const selectedZona = zones.find((z) => z.id === zonaId);

    const nowIso = new Date().toISOString();

    const newProviderPayload = {
      nombre,
      categoria_id: categoriaId,
      zona_id: zonaId,
      telefono: cleanPhone,
      descripcion,
      foto_url: fotoUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      activo: true,
      destacado: false,
      dni,
      email,
      acepto_terminos: aceptoTerminos,
      fecha_aceptacion_terminos: nowIso,
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('proveedores')
          .insert([newProviderPayload])
          .select(`*, categoria:categorias(*), zona:zonas(*)`)
          .single();

        if (error) throw error;
        if (data) {
          onProviderAdded(data as Proveedor);
        }
      } else {
        // Local state addition
        const mockCreated: Proveedor = {
          id: `local-${Date.now()}`,
          ...newProviderPayload,
          categoria: selectedCat,
          zona: selectedZona,
          created_at: nowIso,
        };
        onProviderAdded(mockCreated);
      }

      // Celebrate success with confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNombre('');
        setTelefono('');
        setDni('');
        setEmail('');
        setDescripcion('');
        setFotoUrl('');
        setAceptoTerminos(false);
        onClose();
      }, 1800);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al guardar el proveedor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative bg-[#0f172a] text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-12 text-center flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-white mb-2">¡Servicio Registrado!</h3>
            <p className="text-slate-300 text-sm">Tu perfil ya está visible para clientes de la región.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <PlusCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sumá tu Servicio a Fixi</h3>
                <p className="text-xs text-slate-400">Recibí mensajes de clientes directo a tu WhatsApp.</p>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre o Empresa *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Jardines Carlos / Electromecánica Silva"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                />
              </div>

              {/* Legal Compliance identity fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">DNI (Identificación Privada) *</label>
                  <input
                    type="text"
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ej: 38123456"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Uso exclusivo legal (no público)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email de Contacto *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tuemail@ejemplo.com"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Para notificaciones y verificación</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría *</label>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Zona Principal *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej: 3415123456"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">URL de Foto / Logo (Opcional)</label>
                  <input
                    type="url"
                    value={fotoUrl}
                    onChange={(e) => setFotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción del Servicio</label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detallá qué trabajos hacés, experiencia, si emitís factura, urgencias 24hs..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                />
              </div>

              {/* Legal Terms Checkbox */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="aceptoTerminos"
                  required
                  checked={aceptoTerminos}
                  onChange={(e) => setAceptoTerminos(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950 cursor-pointer"
                />
                <label htmlFor="aceptoTerminos" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                  Confirmo que los datos son míos y acepto que Fixi actúa solo como intermediario de contacto entre usuarios y prestadores independientes.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  {submitting ? 'Guardando...' : 'Publicar mi Servicio Gratis'}
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
