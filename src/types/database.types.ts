export interface Provincia {
  id: string;
  nombre: string;
  slug: string;
}

export interface Zona {
  id: string;
  nombre: string;
  slug: string;
  provincia_id: string;
  provincia?: Provincia;
  latitud?: number;
  longitud?: number;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  icono?: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  categoria_id: string;
  zona_id: string;
  telefono: string;
  descripcion: string;
  foto_url?: string;
  destacado?: boolean;
  verificado?: boolean;
  activo?: boolean;
  latitud?: number;
  longitud?: number;
  dni?: string;
  email?: string;
  acepto_terminos?: boolean;
  fecha_aceptacion_terminos?: string;
  created_at?: string;
  categoria?: Categoria;
  zona?: Zona;
}

export interface Resena {
  id: string;
  proveedor_id: string;
  usuario_email?: string;
  puntaje: number;
  comentario: string;
  created_at?: string;
}

export interface TicketSoporte {
  id: string;
  usuario_email: string;
  asunto: string;
  categoria: string;
  mensaje: string;
  estado: 'Abierto' | 'En Revisión' | 'Resuelto';
  created_at: string;
}

export interface UserProfile {
  email: string;
  nombre: string;
  foto?: string;
}

export interface Mensaje {
  id: string;
  emisor_email: string;
  receptor_email: string;
  proveedor_id?: string;
  contenido: string;
  leido?: boolean;
  created_at: string;
  proveedor?: Proveedor;
}

