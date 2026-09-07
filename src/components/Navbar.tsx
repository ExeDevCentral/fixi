import React from 'react';
import { Wrench, ShieldCheck, User, HelpCircle, LogIn, PlusCircle, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserProfile } from '../types/database.types';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenSupport: () => void;
  onOpenRequestJob?: () => void;
  onOpenAddProvider?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenDashboard,
  onOpenSupport,
  onOpenRequestJob,
  onOpenAddProvider,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#060911]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & App Status Indicator */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300">
            <Wrench className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                FIXI
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="status-dot-live"></span> PRO WEB APP
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Marketplace con GPS & Alertas
            </span>
          </div>
        </motion.div>

        {/* User Auth & Web App Action Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {onOpenAddProvider && (
            <button
              onClick={onOpenAddProvider}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Sumar mi Servicio</span>
            </button>
          )}

          {onOpenRequestJob && (
            <button
              onClick={onOpenRequestJob}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span className="hidden sm:inline">Pedir Presupuesto</span>
              <span className="sm:hidden">Pedir</span>
            </button>
          )}

          <button
            onClick={onOpenSupport}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Centro de Soporte"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden md:inline">Soporte</span>
          </button>

          {user ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-slate-800 transition-all shadow-md shadow-emerald-950/50"
            >
              <img
                src={user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user.nombre}
                className="w-6 h-6 rounded-full object-cover border border-emerald-400"
              />
              <span className="hidden sm:inline max-w-[120px] truncate">{user.nombre}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Ingresar</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
