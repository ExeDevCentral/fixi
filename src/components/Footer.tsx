import React from 'react';
import { Wrench, ShieldCheck, Lock, ArrowUp, Activity } from 'lucide-react';
import { CraftedBySignature } from './shared/CraftedBySignature';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#04060a] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.06] text-xs">
          
          {/* Column 1: Brand & Enterprise Statement */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.12] shadow-inner">
                <Wrench className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                FIXI
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                ENTERPRISE v2
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plataforma tecnológica de despacho y custodia para servicios de mantenimiento en el hogar. Red de especialistas matriculados con cobertura de responsabilidad civil en Rosario, Funes y Roldán.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Matrículas Certificadas
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-300" />
                Pagos Custodiados
              </span>
              <span className="flex items-center gap-1.5">
                <span className="status-dot-live"></span>
                Despacho Activo
              </span>
            </div>
          </div>

          {/* Column 2: Servicios & Cobertura */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              COBERTURA & OFICIOS
            </div>
            <ul className="space-y-2 text-slate-400">
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Electricistas Matriculados</span></li>
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Plomeros y Gasistas Habilitados</span></li>
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Cerrajería de Precisión 24hs</span></li>
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Jardinería y Poda de Parques</span></li>
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Rosario Centro • Pichincha • Funes</span></li>
            </ul>
          </div>

          {/* Column 3: Garantía y Seguridad */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              SEGURIDAD & CUSTODIA
            </div>
            <ul className="space-y-2 text-slate-400">
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Protocolo de Puerta con PIN</span></li>
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Garantía Escrow de 90 Días</span></li>
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Seguro de Responsabilidad Civil</span></li>
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Términos de Liquidación</span></li>
              <li><span className="text-slate-300 hover:text-white transition-colors cursor-pointer">Centro de Mediación y Soporte</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>© {new Date().getFullYear()} FIXI SERVICIOS DIGITALES S.A.S.</span>
            <span>•</span>
            <span>CUIT 30-71829384-9</span>
            <span>•</span>
            <span>Rosario, Santa Fe, Argentina</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] text-[11px] font-mono transition-all"
            >
              <span>Subir</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ExePaginasWeb Signature */}
        <div className="pt-6">
          <CraftedBySignature variant="dark" showBar className="mt-4" />
        </div>

      </div>
    </footer>
  );
};
