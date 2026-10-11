import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Clock, Car, Wrench, AlertCircle, KeyRound, CheckCircle } from 'lucide-react';
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
    void navigator.clipboard?.writeText(order.pinSeguridad);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl obsidian-card overflow-hidden shadow-2xl">
      {/* Simulation Browser/Inbox Top Bar */}
      <div className="bg-black/50 border-b border-white/[0.08] px-5 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span className="ml-3 font-mono text-[11px] text-slate-400">bandeja_entrada / fixi_seguridad_notif.eml</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono">
          <CheckCircle className="w-3 h-3" />
          <span>FIRMADO DIGITALMENTE (FIXI-ID)</span>
        </div>
      </div>

      {/* Email Header Metadata */}
      <div className="px-6 py-4 border-b border-white/[0.06] bg-black/20 text-xs text-slate-300 space-y-1.5 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 w-16">Remitente:</span>
          <span className="text-white">FIXI Security Dispatch &lt;seguridad@fixi.com.ar&gt;</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 w-16">Destinatario:</span>
          <span className="text-slate-300">Titular del Inmueble en {order.zona}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 w-16">Asunto:</span>
          <span className="text-slate-100 font-semibold font-sans text-xs">
            Aviso Oficial: {specialist.nombre} está en tránsito a tu domicilio
          </span>
        </div>
      </div>

      {/* Email Body Content */}
      <div className="p-6 sm:p-8 space-y-6 text-slate-200">
        {/* Top Corporate Assurance Pill */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white tracking-tight">
                Protocolo de Custodia en Domicilio
              </div>
              <div className="text-[11px] text-slate-400">
                Verificación biométrica y chequeo de antecedentes judiciales completado.
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-white/[0.05] px-2.5 py-1 rounded-md border border-white/[0.08]">
            REF #{order.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Security PIN Alert Box */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <KeyRound className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                PIN de Apertura de Puerta
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                El profesional debe recitarte este código en la puerta antes de ingresar:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold tracking-[0.2em] text-white bg-black/60 px-4 py-2 rounded-xl border border-white/[0.15]">
              {order.pinSeguridad}
            </span>
            <button
              onClick={handleCopyPin}
              title="Copiar código"
              className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-all border border-white/[0.08]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Specialist Digital Badge Card */}
        <div className="bg-black/30 rounded-2xl p-5 border border-white/[0.07] space-y-4">
          <div className="flex items-start gap-4">
            <img
              src={specialist.foto}
              alt={specialist.nombre}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-white/[0.15] shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {specialist.nombre}
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verificado
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{specialist.titulo}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1.5">
                <span>DNI: <strong className="text-slate-300">{specialist.dniEnmascarado}</strong></span>
                <span>•</span>
                <span>Matrícula: <strong className="text-slate-300">{specialist.matricula}</strong></span>
              </div>
            </div>
          </div>

          {/* Time & Vehicle Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-white/[0.06] text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[10px] font-mono">TIEMPO ESTIMADO DE ARRIBO</div>
                <div className="text-white font-semibold">{specialist.tiempoLlegadaMinutos} minutos (en tránsito)</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[10px] font-mono">DURACIÓN ESTIMADA DEL TRABAJO</div>
                <div className="text-white font-semibold">~{specialist.tiempoEstimadoTrabajoMinutos} minutos</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <Car className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[10px] font-mono">VEHÍCULO Y PATENTE</div>
                <div className="text-white font-medium">{specialist.vehiculo} • <span className="font-mono">{specialist.patente}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[10px] font-mono">EQUIPO DECLARADO</div>
                <div className="text-slate-300 font-medium truncate">{specialist.herramientas.slice(0, 2).join(', ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Footer note */}
        <div className="flex items-start gap-2.5 text-[11px] text-slate-400 bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.06] leading-relaxed">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Servicio resguardado por la <strong>Garantía Oficial FIXI de 90 días</strong> con cobertura civil contra daños. Podés cancelar o reprogramar sin penalidad antes de la llegada del profesional.
          </p>
        </div>
      </div>
    </div>
  );
};
