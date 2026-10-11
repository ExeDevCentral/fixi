import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HandHeart, X } from 'lucide-react';
import { Proveedor } from '../types/database.types';

interface ProviderInterestToastProps {
  /** Stack of providers currently "interested" (demo simulation) */
  interested: Proveedor[];
  onDismiss: (id: string) => void;
  onOpenChat?: (provider: Proveedor) => void;
}

/**
 * Demo simulation toasts: when a client publishes a job request,
 * providers "raise their hand" showing interest — like real-time leads.
 */
export const ProviderInterestToast: React.FC<ProviderInterestToastProps> = ({
  interested,
  onDismiss,
  onOpenChat,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 max-w-xs sm:max-w-sm pointer-events-none">
      <AnimatePresence>
        {interested.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="toast-in pointer-events-auto gradient-border rounded-2xl p-3.5 shadow-2xl text-white"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/40 shrink-0">
                <img
                  src={p.foto_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=100&q=80'}
                  alt={p.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1">
                  <HandHeart className="w-3.5 h-3.5" />
                  ¡Le interesa tu solicitud!
                </p>
                <p className="text-xs font-bold text-white truncate mt-0.5">{p.nombre}</p>
                <p className="text-[10px] text-slate-400 truncate">
                  {p.categoria?.nombre} · {p.zona?.nombre}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {onOpenChat && (
                    <button
                      onClick={() => onOpenChat(p)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-extrabold transition-all active:scale-95"
                    >
                      Responder
                    </button>
                  )}
                  <span className="text-[9px] text-slate-500">hace instantes</span>
                </div>
              </div>
              <button
                onClick={() => onDismiss(p.id)}
                className="p-1 rounded-lg text-slate-500 hover:text-white transition-colors shrink-0"
                aria-label="Descartar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
