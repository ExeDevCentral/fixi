import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, MOCK_PROVEEDORES } from '../lib/supabase';
import { Proveedor } from '../types/database.types';

interface ProviderFilters {
  provinciaId?: string;
  zoneId?: string;
  categoryId?: string;
  searchQuery?: string;
  onlyFeatured?: boolean;
}

export function useProviders(filters: ProviderFilters) {
  const [providers, setProviders] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { provinciaId, zoneId, categoryId, searchQuery, onlyFeatured } = filters;

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured || !supabase) {
        let result = [...MOCK_PROVEEDORES];

        if (provinciaId) {
          result = result.filter((p) => p.zona?.provincia_id === provinciaId);
        }
        if (zoneId) {
          result = result.filter((p) => p.zona_id === zoneId);
        }
        if (categoryId) {
          result = result.filter((p) => p.categoria_id === categoryId);
        }
        if (onlyFeatured) {
          result = result.filter((p) => p.destacado);
        }
        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          result = result.filter(
            (p) =>
              p.nombre.toLowerCase().includes(q) ||
              p.descripcion.toLowerCase().includes(q) ||
              p.categoria?.nombre.toLowerCase().includes(q) ||
              p.zona?.nombre.toLowerCase().includes(q) ||
              p.zona?.provincia?.nombre.toLowerCase().includes(q)
          );
        }

        setProviders(result);
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('proveedores')
          .select(`
            *,
            categoria:categorias(*),
            zona:zonas(*, provincia:provincias(*))
          `)
          .eq('activo', true);

        if (zoneId) {
          query = query.eq('zona_id', zoneId);
        }
        if (categoryId) {
          query = query.eq('categoria_id', categoryId);
        }
        if (onlyFeatured) {
          query = query.eq('destacado', true);
        }

        const { data, error: queryErr } = await query
          .order('destacado', { ascending: false })
          .order('created_at', { ascending: false });

        if (queryErr) throw queryErr;

        let result = (data as Proveedor[]) || [];

        // Apply client-side province & keyword filtering if required
        if (provinciaId) {
          result = result.filter((p) => p.zona?.provincia_id === provinciaId);
        }

        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          result = result.filter(
            (p) =>
              p.nombre.toLowerCase().includes(q) ||
              p.descripcion.toLowerCase().includes(q) ||
              p.categoria?.nombre.toLowerCase().includes(q) ||
              p.zona?.nombre.toLowerCase().includes(q) ||
              p.zona?.provincia?.nombre.toLowerCase().includes(q)
          );
        }

        setProviders(result);
      } catch (err: any) {
        console.warn('Fallback a MOCK por error en Supabase:', err.message);
        let result = [...MOCK_PROVEEDORES];
        if (provinciaId) result = result.filter((p) => p.zona?.provincia_id === provinciaId);
        if (zoneId) result = result.filter((p) => p.zona_id === zoneId);
        if (categoryId) result = result.filter((p) => p.categoria_id === categoryId);
        setProviders(result);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, [provinciaId, zoneId, categoryId, searchQuery, onlyFeatured]);

  return { providers, loading, error };
}
