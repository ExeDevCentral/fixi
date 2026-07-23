import React from 'react';
import { ArrowLeft, Tag } from 'lucide-react';
import { ProviderGrid } from '../components/ProviderGrid';
import { useProviders } from '../hooks/useProviders';
import { Categoria } from '../types/database.types';

interface CategoryResultsProps {
  category: Categoria;
  onBack: () => void;
}

export const CategoryResults: React.FC<CategoryResultsProps> = ({ category, onBack }) => {
  const { providers, loading } = useProviders({
    categoryId: category.id,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back Button & Category Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a todas las categorías
          </button>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Tag className="w-6 h-6" />
            </span>
            {category.nombre}
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-slate-400">
          Servicios verificados de {category.nombre} en Rosario y zona.
        </p>
      </div>

      {/* Provider List */}
      <ProviderGrid
        providers={providers}
        loading={loading}
        onResetFilters={onBack}
      />

    </div>
  );
};
