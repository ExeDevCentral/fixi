import React from 'react';
import { motion } from 'framer-motion';
import { SolicitudTrabajo } from '../types/database.types';
import { Briefcase, Clock, MapPin, Tag, MessageCircle, AlertTriangle } from 'lucide-react';

interface JobBoardProps {
  solicitudes: SolicitudTrabajo[];
  onRequestContact?: (solicitud: SolicitudTrabajo) => void;
  onOpenCreateRequest: () => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({
  solicitudes,
  onRequestContact,
  onOpenCreateRequest,
}) => {
  return (
    <section className="py-8 border-t border-slate-800/80 my-8">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 font-sans">
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Briefcase className="w-4 h-4" />
            </span>
            Bolsa de Trabajos Solicitados
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              {solicitudes.length} Alertas
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Clientes de la región buscando profesionales. Trabajadores pueden postularse directamente.
          </p>
        </div>

        <button
          onClick={onOpenCreateRequest}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Briefcase className="w-4 h-4" />
          <span>Publicar mi Necesidad Gratis</span>
        </button>
      </div>

      {solicitudes.length === 0 ? (
        <div className="glass-card p-8 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No hay solicitudes abiertas en este momento</h3>
          <p className="text-xs text-slate-400 mb-4">
            ¿Necesitás reparar algo o pedir un presupuesto? Publicá tu necesidad para que los especialistas de tu zona te contacten.
          </p>
          <button
            onClick={onOpenCreateRequest}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Pedir Presupuesto Ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solicitudes.map((sol) => {
            const rawPhone = sol.cliente_telefono.replace(/\D/g, '');
            const whatsappMsg = encodeURIComponent(`Hola ${sol.cliente_nombre}, vi tu pedido de trabajo "${sol.titulo}" en Fixi y quiero ofrecerte presupuesto.`);
            const whatsappUrl = `https://wa.me/${rawPhone}?text=${whatsappMsg}`;

            const isUrgente = sol.urgencia === 'Urgente 24hs';

            return (
              <motion.article
                key={sol.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-5 rounded-2xl sm:rounded-3xl border flex flex-col justify-between relative overflow-hidden ${
                  isUrgente ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Urgency & Category Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      <Tag className="w-3 h-3 text-amber-400" />
                      {sol.categoria?.nombre || 'General'}
                    </span>

                    {isUrgente ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> Urgente 24hs
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {sol.urgencia}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                    {sol.titulo}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                    {sol.descripcion}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{sol.zona?.nombre || 'Rosario y zona'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="font-semibold text-amber-400">Presupuesto est.:</span>
                      <span>{sol.presupuesto_estimado || 'A convenir'}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Cliente: {sol.cliente_nombre}
                    </div>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onRequestContact && onRequestContact(sol)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-95 mt-auto"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                  <span>Responder Solicitud por WhatsApp</span>
                </a>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
};
