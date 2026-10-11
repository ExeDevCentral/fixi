import React, { useState } from 'react';
import { ShieldCheck, Mail, Copy, Check, Clock, Car, Wrench, AlertCircle, KeyRound } from 'lucide-react';
import { SpecialistProfile, FixiOrder } from '../../types/simulator.types';

interface EmailNotificationPreviewProps {
  specialist: SpecialistProfile;
  order: FixiOrder;
}

export const EmailNotificationPreview: React.FC<EmailNotificationPreviewProps> = ({
  specialist,
  order,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(order.pinSeguridad);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
      {/* Simulation Browser/Inbox Top Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">Bandeja de Entrada • Correo Oficial</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-emerald-500/20">
          <Mail className="w-3 h-3" />
          <span>Verificado por DKIM / SPF</span>
        </div>
      </div>

      {/* Email Header Metadata */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/40 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold w-14">De:</span>
          <span className="text-white font-medium">FIXI Seguridad Residencial &lt;seguridad@fixi.com.ar&gt;</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold w-14">Para:</span>
          <span className="text-slate-300">Vos (Titular del Servicio en {order.zona})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold w-14">Asunto:</span>
          <span className="text-emerald-400 font-bold">
            🛡️ Ficha de Seguridad: {specialist.nombre} está en camino a tu domicilio
          </span>
        </div>
      </div>

      {/* Email Body Content */}
      <div className="p-6 sm:p-8 space-y-6 text-slate-200">
        {/* Banner with Brand & Alert */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Protocolo de Seguridad en Hogar FIXI
              </h4>
              <p className="text-xs text-slate-400">
                Verificá la identidad y el código de seguridad antes de permitir el ingreso.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            PEDIDO #{order.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Security PIN Alert Box */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <KeyRound className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Código PIN de Validación de Puerta
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Exigile al profesional que te repita este código verbalmente en la puerta antes de abrir:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="font-mono text-2xl font-black tracking-widest text-white bg-slate-950 px-4 py-2 rounded-xl border border-amber-500/40">
              {order.pinSeguridad}
            </span>
            <button
              onClick={handleCopyPin}
              title="Copiar código"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Specialist Profile Card */}
        <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-start gap-4">
            <img
              src={specialist.foto}
              alt={specialist.nombre}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {specialist.nombre}
                </h3>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verificado
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{specialist.titulo}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
                <span>DNI: <strong className="text-slate-200">{specialist.dniEnmascarado}</strong></span>
                <span>•</span>
                <span>Matrícula: <strong className="text-slate-200">{specialist.matricula}</strong></span>
              </div>
            </div>
          </div>

          {/* Time & Vehicle Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Tiempo de arribo estimado</div>
                <div className="text-white font-bold">{specialist.tiempoLlegadaMinutos} minutos (en viaje)</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Tiempo estimado de trabajo</div>
                <div className="text-white font-bold">~{specialist.tiempoEstimadoTrabajoMinutos} minutos</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Car className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Vehículo / Movilidad</div>
                <div className="text-white font-medium">{specialist.vehiculo} • <span className="font-mono">{specialist.patente}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Wrench className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Herramientas y Equipo</div>
                <div className="text-slate-300 font-medium truncate">{specialist.herramientas.slice(0, 2).join(', ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Footer note */}
        <div className="flex items-start gap-2.5 text-[11px] text-slate-400 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Este servicio cuenta con <strong>Garantía de Satisfacción FIXI de 90 días</strong> y seguro de responsabilidad civil contratado. Si necesitas cancelar o reprogramar, podés hacerlo sin costo antes del arribo.
          </p>
        </div>
      </div>
    </div>
  );
};
