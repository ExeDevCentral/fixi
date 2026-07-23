import React, { useState } from 'react';
import { X, User, Star, HelpCircle, LogOut, Clock, PlusCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserProfile, TicketSoporte, Proveedor } from '../types/database.types';

interface ClientDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  tickets: TicketSoporte[];
  onOpenCreateTicket: () => void;
  onOpenRating: (provider: Proveedor) => void;
  contactedProviders: Proveedor[];
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  tickets,
  onOpenCreateTicket,
  onOpenRating,
  contactedProviders,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'tickets'>('history');

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative bg-[#0f172a] text-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user.nombre}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
            />
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {user.nombre}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Google Auth
                </span>
              </h3>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 my-6 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Historial de Trabajos</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'tickets'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Soporte & Tickets ({tickets.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'history' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Servicios Contactados Recientemente
              </h4>
            </div>

            {contactedProviders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-900/40 rounded-2xl p-6 border border-slate-800">
                <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                Aún no has contactado profesionales en esta sesión.
              </div>
            ) : (
              <div className="space-y-3">
                {contactedProviders.map((p) => (
                  <div
                    key={p.id}
                    className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.foto_url}
                        alt={p.nombre}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-white">{p.nombre}</p>
                        <p className="text-xs text-slate-400">{p.categoria?.nombre} • {p.zona?.nombre}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenRating(p)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>Calificar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tus Tickets de Soporte
              </h4>
              <button
                onClick={onOpenCreateTicket}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nuevo Ticket</span>
              </button>
            </div>

            {tickets.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-900/40 rounded-2xl p-6 border border-slate-800">
                <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                No tenés tickets de soporte abiertos.
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">{t.categoria}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {t.estado}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">{t.asunto}</p>
                    <p className="text-xs text-slate-300">{t.mensaje}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
