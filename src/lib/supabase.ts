import { createClient } from '@supabase/supabase-js';
import { Provincia, Zona, Categoria, Proveedor } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock Dataset for Offline/Zero-config execution with Provincias & Ciudades
export const MOCK_PROVINCIAS: Provincia[] = [
  { id: 'prov-1', nombre: 'Santa Fe', slug: 'santa-fe' },
  { id: 'prov-2', nombre: 'Buenos Aires', slug: 'buenos-aires' },
  { id: 'prov-3', nombre: 'Córdoba', slug: 'cordoba' },
];

export const MOCK_ZONAS: Zona[] = [
  { id: 'zona-1', nombre: 'Rosario (Centro)', slug: 'rosario-centro', provincia_id: 'prov-1', provincia: MOCK_PROVINCIAS[0] },
  { id: 'zona-2', nombre: 'Rosario (Alberdi / Norte)', slug: 'rosario-norte', provincia_id: 'prov-1', provincia: MOCK_PROVINCIAS[0] },
  { id: 'zona-3', nombre: 'Rosario (Fisherton)', slug: 'rosario-fisherton', provincia_id: 'prov-1', provincia: MOCK_PROVINCIAS[0] },
  { id: 'zona-4', nombre: 'Funes', slug: 'funes', provincia_id: 'prov-1', provincia: MOCK_PROVINCIAS[0] },
  { id: 'zona-5', nombre: 'Roldán', slug: 'roldan', provincia_id: 'prov-1', provincia: MOCK_PROVINCIAS[0] },
  { id: 'zona-6', nombre: 'Granadero Baigorria', slug: 'granadero-baigorria', provincia_id: 'prov-1', provincia: MOCK_PROVINCIAS[0] },
  { id: 'zona-7', nombre: 'San Nicolás de los Arroyos', slug: 'san-nicolas', provincia_id: 'prov-2', provincia: MOCK_PROVINCIAS[1] },
  { id: 'zona-8', nombre: 'Pergamino', slug: 'pergamino', provincia_id: 'prov-2', provincia: MOCK_PROVINCIAS[1] },
  { id: 'zona-9', nombre: 'Córdoba Capital', slug: 'cordoba-capital', provincia_id: 'prov-3', provincia: MOCK_PROVINCIAS[2] },
];

export const MOCK_CATEGORIAS: Categoria[] = [
  { id: 'cat-1', nombre: 'Jardinería', slug: 'jardineria', icono: 'Trees' },
  { id: 'cat-2', nombre: 'Fletes y Mudanzas', slug: 'fletes', icono: 'Truck' },
  { id: 'cat-3', nombre: 'Electricidad', slug: 'electricidad', icono: 'Zap' },
  { id: 'cat-4', nombre: 'Plomería y Gas', slug: 'plomeria', icono: 'Droplet' },
  { id: 'cat-5', nombre: 'Climatización (Aire Acond.)', slug: 'climatizacion', icono: 'Wind' },
  { id: 'cat-6', nombre: 'Pintura', slug: 'pintura', icono: 'Paintbrush' },
  { id: 'cat-7', nombre: 'Limpieza Integral', slug: 'limpieza', icono: 'Sparkles' },
];

export const MOCK_PROVEEDORES: Proveedor[] = [
  {
    id: 'prov-1',
    nombre: 'Jardines del Aire — Carlos Ruiz',
    categoria_id: 'cat-1',
    zona_id: 'zona-4',
    telefono: '5493415123456',
    descripcion: 'Mantenimiento integral de parques, poda en altura, sistemas de riego automatizado y paisajismo en Funes y Roldán.',
    foto_url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80',
    destacado: true,
    activo: true,
    categoria: MOCK_CATEGORIAS[0],
    zona: MOCK_ZONAS[3],
  },
  {
    id: 'prov-2',
    nombre: 'Electromecánica Rosario — Ing. Mateo Silva',
    categoria_id: 'cat-3',
    zona_id: 'zona-1',
    telefono: '5493416987654',
    descripcion: 'Electricista matriculado. Instalaciones domiciliarias e industriales, tableros eléctricos, certificación de obra y urgencias 24hs.',
    foto_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    destacado: true,
    activo: true,
    categoria: MOCK_CATEGORIAS[2],
    zona: MOCK_ZONAS[0],
  },
  {
    id: 'prov-3',
    nombre: 'Fletes La Sombra — Transportes Roldán',
    categoria_id: 'cat-2',
    zona_id: 'zona-5',
    telefono: '5493414112233',
    descripcion: 'Mudanzas locales y a todo el país. Camionetas con peones para carga/descarga, embalaje de muebles y traslado de objetos pesados.',
    foto_url: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=800&q=80',
    destacado: true,
    activo: true,
    categoria: MOCK_CATEGORIAS[1],
    zona: MOCK_ZONAS[4],
  },
  {
    id: 'prov-4',
    nombre: 'Plomería Express Rosario — Roberto & Hijos',
    categoria_id: 'cat-4',
    zona_id: 'zona-3',
    telefono: '5493413344556',
    descripcion: 'Destapaciones con máquina, reparación de fugas de agua y gas matriculado, termofusión e instalación de sanitarios en Fisherton.',
    foto_url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    destacado: false,
    activo: true,
    categoria: MOCK_CATEGORIAS[3],
    zona: MOCK_ZONAS[2],
  },
  {
    id: 'prov-5',
    nombre: 'ClimaSur — Aire Acondicionado Funes',
    categoria_id: 'cat-5',
    zona_id: 'zona-4',
    telefono: '5493418877665',
    descripcion: 'Instalación de acondicionadores Split e Inverter en Funes y Fisherton. Carga de gas refrigerante y mantenimiento preventivo.',
    foto_url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    destacado: true,
    activo: true,
    categoria: MOCK_CATEGORIAS[4],
    zona: MOCK_ZONAS[3],
  },
  {
    id: 'prov-6',
    nombre: 'Electro San Nicolás — Servicios Eléctricos',
    categoria_id: 'cat-3',
    zona_id: 'zona-7',
    telefono: '5493364123456',
    descripcion: 'Instalaciones y cableados en San Nicolás y zona norte de Buenos Aires. Reparaciones en el día y presupuesto sin cargo.',
    foto_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    destacado: true,
    activo: true,
    categoria: MOCK_CATEGORIAS[2],
    zona: MOCK_ZONAS[6],
  }
];
