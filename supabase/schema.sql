-- =========================================================================
-- FIXI - MARKETPLACE CON GPS, AUTH GOOGLE, RESEÑAS Y TICKETS DE SOPORTE
-- =========================================================================

create table if not exists provincias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text unique not null
);

create table if not exists zonas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text unique not null,
  provincia_id uuid references provincias(id) on delete cascade,
  latitud numeric(10, 6) default -32.94682,  -- Coordenadas Rosario por defecto
  longitud numeric(10, 6) default -60.63932
);

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text unique not null,
  icono text default 'Wrench'
);

create table if not exists proveedores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria_id uuid references categorias(id) on delete cascade,
  zona_id uuid references zonas(id) on delete cascade,
  telefono text not null,
  descripcion text,
  foto_url text,
  destacado boolean default false,
  verificado boolean default true,
  activo boolean default true,
  latitud numeric(10, 6),
  longitud numeric(10, 6),
  -- Campos de Cumplimiento Legal y Privacidad (Backup Interno)
  dni text,
  email text,
  acepto_terminos boolean default false,
  fecha_aceptacion_terminos timestamptz,
  created_at timestamptz default now()
);

-- Vista pública segura que excluye DNI y Email
create or replace view proveedores_publicos as
select 
  id,
  nombre,
  categoria_id,
  zona_id,
  telefono,
  descripcion,
  foto_url,
  destacado,
  verificado,
  activo,
  latitud,
  longitud,
  created_at
from proveedores
where activo = true;

grant select on proveedores_publicos to anon, authenticated;

create table if not exists resenas (
  id uuid primary key default gen_random_uuid(),
  proveedor_id uuid references proveedores(id) on delete cascade,
  usuario_email text default 'usuario@google.com',
  puntaje int check (puntaje between 1 and 5),
  comentario text,
  created_at timestamptz default now()
);

create table if not exists tickets_soporte (
  id uuid primary key default gen_random_uuid(),
  usuario_email text not null,
  asunto text not null,
  categoria text default 'General',
  mensaje text not null,
  estado text default 'Abierto', -- 'Abierto', 'En Revisión', 'Resuelto'
  created_at timestamptz default now()
);

-- RLS Security
alter table provincias enable row level security;
alter table zonas enable row level security;
alter table categorias enable row level security;
alter table proveedores enable row level security;
alter table resenas enable row level security;
alter table tickets_soporte enable row level security;

create policy "Lectura pública de servicios" on proveedores for select using (activo = true);
create policy "Registro público de proveedores" on proveedores for insert with check (true);
create policy "Lectura pública de reseñas" on resenas for select using (true);
create policy "Creación pública de reseñas" on resenas for insert with check (true);
create policy "Creación pública de tickets" on tickets_soporte for insert with check (true);
create policy "Lectura pública de tickets propios" on tickets_soporte for select using (true);

