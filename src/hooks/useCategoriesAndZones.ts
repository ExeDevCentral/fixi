import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, MOCK_PROVINCIAS, MOCK_CATEGORIAS, MOCK_ZONAS } from '../lib/supabase';
import { Provincia, Categoria, Zona } from '../types/database.types';

export function useCategoriesAndZones() {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [zones, setZones] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured || !supabase) {
        setProvincias(MOCK_PROVINCIAS);
        setCategories(MOCK_CATEGORIAS);
        setZones(MOCK_ZONAS);
        setLoading(false);
        return;
      }

      try {
        const [provRes, catRes, zoneRes] = await Promise.all([
          supabase.from('provincias').select('*').order('nombre'),
          supabase.from('categorias').select('*').order('nombre'),
          supabase.from('zonas').select('*, provincia:provincias(*)').order('nombre'),
        ]);

        if (provRes.error) throw provRes.error;
        if (catRes.error) throw catRes.error;
        if (zoneRes.error) throw zoneRes.error;

        setProvincias(provRes.data.length > 0 ? provRes.data : MOCK_PROVINCIAS);
        setCategories(catRes.data.length > 0 ? catRes.data : MOCK_CATEGORIAS);
        setZones(zoneRes.data.length > 0 ? zoneRes.data : MOCK_ZONAS);
      } catch (err: any) {
        console.warn('Fallback a mock local:', err.message);
        setProvincias(MOCK_PROVINCIAS);
        setCategories(MOCK_CATEGORIAS);
        setZones(MOCK_ZONAS);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { provincias, categories, zones, loading, error };
}
