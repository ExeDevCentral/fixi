import React, { useState, useMemo } from 'react';
import { Search, MapPin, Grid, X, SlidersHorizontal, Compass } from 'lucide-react';
import { Provincia, Categoria, Zona } from '../types/database.types';

interface SearchBarProps {
  provincias: Provincia[];
  categories: Categoria[];
  zones: Zona[];
  selectedProvincia: string;
  selectedZone: string;
  selectedCategory: string;
  searchQuery: string;
  onSelectProvincia: (id: string) => void;
  onSelectZone: (id: string) => void;
  onSelectCategory: (id: string) => void;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  isSidebarDesktop?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  provincias,
  categories,
  zones,
  selectedProvincia,
  selectedZone,
  selectedCategory,
  searchQuery,
  onSelectProvincia,
  onSelectZone,
  onSelectCategory,
  onSearchChange,
  onResetFilters,
  isSidebarDesktop = false,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const hasActiveFilters = Boolean(selectedProvincia || selectedZone || selectedCategory || searchQuery);

  // Cascading Filter: Filter cities/zones based on selected provincia
  const filteredZones = useMemo(() => {
    if (!selectedProvincia) return zones;
    return zones.filter((z) => z.provincia_id === selectedProvincia);
  }, [zones, selectedProvincia]);

  const handleProvinciaChange = (provId: string) => {
    onSelectProvincia(provId);
    // Reset city selection if selected city is not in the new province
    if (selectedZone) {
      const zoneInNewProv = zones.find((z) => z.id === selectedZone && z.provincia_id === provId);
      if (!zoneInNewProv) {
        onSelectZone('');
      }
    }
  };

  // If rendered as Desktop Sidebar Filter
  if (isSidebarDesktop) {
    return (
      <aside className="w-full glass-card p-6 rounded-3xl border border-slate-800 bg-[#0d1322]/95 space-y-6 sticky top-24 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-sans">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            Filtros Geográficos
          </h3>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            Buscador General
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ej: Jardín, Flete, Gasista..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* 1. Provincia Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            1. Provincia
          </label>
          <div className="relative">
            <Compass className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedProvincia}
              onChange={(e) => handleProvinciaChange(e.target.value)}
              className="w-full pl-10 pr-6 py-2.5 rounded-xl glass-input text-xs text-white bg-[#0f172a] appearance-none cursor-pointer"
            >
              <option value="">Todas las Provincias</option>
              {provincias.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Ciudad / Pueblo / Localidad Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            2. Ciudad / Pueblo
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedZone}
              onChange={(e) => onSelectZone(e.target.value)}
              className="w-full pl-10 pr-6 py-2.5 rounded-xl glass-input text-xs text-white bg-[#0f172a] appearance-none cursor-pointer"
            >
              <option value="">
                {selectedProvincia ? 'Todas las ciudades' : 'Todas las zonas'}
              </option>
              {filteredZones.map((z) => (
                <option key={z.id} value={z.id}>{z.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Categorías */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
            3. Categorías
          </label>
          <div className="space-y-1 max-h-72 overflow-y-auto pr-1 no-scrollbar">
            <button
              onClick={() => onSelectCategory('')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                !selectedCategory
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              Todas las categorías
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

      </aside>
    );
  }

  // Mobile Top Bar & Horizontal Quick Filters
  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-6">
      
      {/* Search Input + Mobile Filter Drawer Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="¿Qué servicio buscás en tu ciudad?"
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className={`p-3 rounded-2xl border transition-all flex items-center gap-1.5 shrink-0 ${
            hasActiveFilters
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
              : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-xs font-bold hidden xs:inline">Filtros</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          )}
        </button>
      </div>

      {/* Quick Category Scroll Pills */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => onSelectCategory('')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            !selectedCategory
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Todos
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Mobile Drawer / Bottom Sheet */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-md sm:hidden">
          <div className="glass-card bg-[#0d1322] rounded-t-3xl p-6 border-t border-slate-700 space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                Filtros de Ubicación y Rubro
              </h3>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provincia Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">
                1. Seleccionar Provincia
              </label>
              <select
                value={selectedProvincia}
                onChange={(e) => handleProvinciaChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-[#0f172a]"
              >
                <option value="">Todas las Provincias</option>
                {provincias.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            {/* Ciudad / Pueblo Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">
                2. Seleccionar Ciudad / Pueblo
              </label>
              <select
                value={selectedZone}
                onChange={(e) => onSelectZone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-[#0f172a]"
              >
                <option value="">Todas las Ciudades</option>
                {filteredZones.map((z) => (
                  <option key={z.id} value={z.id}>{z.nombre}</option>
                ))}
              </select>
            </div>

            {/* Categoría Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">
                3. Rubro o Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-[#0f172a]"
              >
                <option value="">Todas las Categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            {/* Apply / Reset Actions */}
            <div className="flex items-center gap-3 pt-3">
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    onResetFilters();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-1/3 py-3 rounded-xl border border-rose-500/40 text-rose-400 font-semibold text-sm"
                >
                  Limpiar
                </button>
              )}
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex-grow py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20"
              >
                Ver Resultados
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
