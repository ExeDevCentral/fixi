import React from 'react';
import { Wrench, HelpCircle, LogIn, PlusCircle, Sparkles, LayoutGrid } from 'lucide-react';
import { UserProfile } from '../types/database.types';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenSupport: () => void;
  onOpenRequestJob?: () => void;
  onOpenAddProvider?: () => void;
  activeViewMode?: 'APP_FIRST' | 'DIRECTORY';
  onChangeViewMode?: (mode: 'APP_FIRST' | 'DIRECTORY') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenDashboard,
  onOpenSupport,
  onOpenRequestJob,
  onOpenAddProvider,
  activeViewMode = 'APP_FIRST',
  onChangeViewMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#06080d]/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Minimalist Corporate Monogram */}
        <div 
          onClick={() => onChangeViewMode?.('APP_FIRST')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] border border-white/[0.15] shadow-inner group-hover:border-emerald-500/50 transition-all duration-300">
            <Wrench className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
                FIXI
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                <span className="status-dot-live"></span>
                <span>SYSTEM v2</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400 tracking-tight font-medium hidden sm:inline">
              Infraestructura de Servicios Domiciliarios
            </span>
          </div>
        </div>

        {/* Center Mode Switcher Capsule (Linear & Apple Style) */}
        {onChangeViewMode && (
          <div className="hidden md:flex items-center glass-pill-container p-1 rounded-2xl">
            <button
              onClick={() => onChangeViewMode('APP_FIRST')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeViewMode === 'APP_FIRST'
                  ? 'bg-white text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeViewMode === 'APP_FIRST' ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>Simulador en Vivo</span>
            </button>

            <button
              onClick={() => onChangeViewMode('DIRECTORY')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeViewMode === 'DIRECTORY'
                  ? 'bg-white text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Directorio Profesional</span>
            </button>
          </div>
        )}

        {/* Actions Suite */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {onOpenAddProvider && (
            <button
              onClick={onOpenAddProvider}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] text-xs font-medium transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sumar mi Empresa</span>
            </button>
          )}

          <button
            onClick={onOpenSupport}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 border border-white/[0.07] text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Soporte y Garantías"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden md:inline">Garantía FIXI</span>
          </button>

          {user ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-slate-200 text-xs font-medium hover:bg-white/[0.09] transition-all"
            >
              <img
                src={user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user.nombre}
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
              />
              <span className="hidden sm:inline max-w-[120px] truncate">{user.nombre}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white text-slate-950 font-semibold text-xs shadow-sm hover:bg-slate-100 active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Acceso</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
