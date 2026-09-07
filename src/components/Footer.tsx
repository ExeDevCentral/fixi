import React from 'react';
import { Wrench } from 'lucide-react';
import { CraftedBySignature } from './shared/CraftedBySignature';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#070a11] py-8 sm:py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        {/* Left info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600">
            <Wrench className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white font-sans">FIXI</span>
            <p className="text-xs text-slate-400">Marketplace de servicios locales en Rosario, Funes y Roldán.</p>
          </div>
        </div>

        {/* Center Tagline */}
        <div className="text-xs text-slate-500">
          <span>Contacto directo por WhatsApp — Sin intermediarios ni comisiones</span>
        </div>

        {/* Right Links */}
        <div className="text-xs text-slate-400">
          <a href="#top" className="hover:text-emerald-400 transition-colors">Volver arriba ↑</a>
        </div>

      </div>

      {/* ExePaginasWeb Signature */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CraftedBySignature variant="dark" showBar className="mt-10" />
      </div>
    </footer>
  );
};
