import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, MOCK_PROVEEDORES } from '../lib/supabase';
import { Proveedor } from '../types/database.types';
import { providerDistanceKm } from '../lib/geo';

interface ProviderFilters {
  provinciaId?: string;
  zoneId?: string;
  categoryId?: string;
  searchQuery?: string;
  onlyFeatured?: boolean;
  userLatitude?: number;
  userLongitude?: number;
  sortByDistance?: boolean;
}

function applyDistances(
  providers: Proveedor[],
  lat?: number,
  lng?: number,
  sortByDistance = false
): Proveedor[] {
  if (lat == null || lng == null) return providers;

  const withDistance: Proveedor[] = providers.map((p) => ({
    ...p,
    distancia_km: providerDistanceKm(p, lat, lng) ?? undefined,
  }));

  if (sortByDistance) {
    withDistance.sort((a, b) => {
      const da = a.distancia_km ?? Infinity;
      const db = b.distancia_km ?? Infinity;
      return da - db;
    });
  }

  return withDistance;
}

export function useProviders(filters: ProviderFilters) {
  const [providers, setProviders] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    provinciaId,
    zoneId,
    categoryId,
    searchQuery,
    onlyFeatured,
    userLatitude,
    userLongitude,
    sortByDistance,
  } = filters;

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

        setProviders(applyDistances(result, userLatitude, userLongitude, sortByDistance));
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('proveedores_publicos')
          .select(`
            *,
            categoria:categorias(*),
            zona:zonas(*, provincia:provincias(*))
          `);

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

        setProviders(applyDistances(result, userLatitude, userLongitude, sortByDistance));
      } catch (err: any) {
        console.warn('Fallback a MOCK por error en Supabase:', err.message);
        let result = [...MOCK_PROVEEDORES];
        if (provinciaId) result = result.filter((p) => p.zona?.provincia_id === provinciaId);
        if (zoneId) result = result.filter((p) => p.zona_id === zoneId);
        if (categoryId) result = result.filter((p) => p.categoria_id === categoryId);
        setProviders(applyDistances(result, userLatitude, userLongitude, sortByDistance));
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, [
    provinciaId,
    zoneId,
    categoryId,
    searchQuery,
    onlyFeatured,
    userLatitude,
    userLongitude,
    sortByDistance,
  ]);

  return { providers, loading, error };
}
