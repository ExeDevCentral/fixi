import React, { useEffect, useState } from 'react';
import { ProviderCard } from './ProviderCard';
import { Pagination } from './Pagination';
import { Proveedor } from '../types/database.types';
import { SearchX, Navigation } from 'lucide-react';

const PAGE_SIZE = 9;

interface ProviderGridProps {
  providers: Proveedor[];
  loading: boolean;
  onResetFilters: () => void;
  onContactClick?: (provider: Proveedor) => void;
  onRatingClick?: (provider: Proveedor) => void;
  onOpenChat?: (provider: Proveedor) => void;
  sortByDistance?: boolean;
  canSortByDistance?: boolean;
  onToggleSortByDistance?: () => void;
}

export const ProviderGrid: React.FC<ProviderGridProps> = ({
  providers,
  loading,
  onResetFilters,
  onContactClick,
  onRatingClick,
  onOpenChat,
  sortByDistance = false,
  canSortByDistance = false,
  onToggleSortByDistance,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [providers]);

  if (loading) {
    return (
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="glass-card rounded-3xl h-96 animate-pulse bg-slate-900/50 p-6 flex flex-col justify-between border-slate-800"
            >
              <div className="w-full h-40 bg-slate-800/60 rounded-2xl mb-4" />
              <div className="h-6 bg-slate-800/80 rounded-lg w-3/4 mb-3" />
              <div className="h-4 bg-slate-800/40 rounded-lg w-full mb-2" />
              <div className="h-12 bg-slate-800/80 rounded-2xl w-full mt-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="glass-card p-8 rounded-3xl border border-slate-800 flex flex-col items-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No encontramos proveedores</h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6">
            No hay profesionales activos en esta localidad o categoría todavía. Intentá buscar en ciudades cercanas.
          </p>
          <button
            onClick={onResetFilters}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            Ver todos los servicios disponibles
          </button>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(providers.length / PAGE_SIZE);
  const pageProviders = providers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(providers.length, currentPage * PAGE_SIZE);

  return (
    <section className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 font-sans">
            Profesionales Disponibles
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {providers.length}
            </span>
          </h2>
          {providers.length > 0 && (
            <span className="text-[11px] text-slate-500 hidden sm:block">
              Mostrando {rangeStart}–{rangeEnd} de {providers.length}
            </span>
          )}
        </div>

        {onToggleSortByDistance && (
          <button
            onClick={onToggleSortByDistance}
            disabled={!canSortByDistance}
            title={
              canSortByDistance
                ? 'Los más cercanos a tu posición primero'
                : 'Activá tu GPS para ordenar por cercanía'
            }
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              sortByDistance
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Navigation className={`w-3.5 h-3.5 ${sortByDistance && canSortByDistance ? 'animate-pulse' : ''}`} />
            Más cercanos
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageProviders.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onContactClick={onContactClick}
            onRatingClick={onRatingClick}
            onOpenChat={onOpenChat}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};