# Fixi — Marketplace de Servicios Locales (Rosario y Región)

Plataforma web (SPA) que conecta **clientes** con **profesionales de servicios** (jardineros, fletes, electricistas, plomeros, climatización, pintura, limpieza) en Rosario, Funes, Roldán y alrededores. Contacto directo por **WhatsApp**, **mensajería interna**, **bolsa de trabajos** con alertas por email y **reseñas verificadas**.

---

## 🧠 Visión General

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 18 + TypeScript + Vite 6 |
| **Estilos** | Tailwind CSS 3 + Framer Motion + Lucide icons |
| **3D / Visual** | React Three Fiber + drei + Three.js |
| **Backend / BaaS** | Supabase (PostgreSQL + Auth Google OAuth + RLS) |
| **Emails transaccionales** | Resend API |
| **Geolocalización** | Geolocation API nativa (navegador) |
| **Deploy** | Vercel (SPA estático, build time) |

> **Arquitectura sin servidor propio:** no existe backend Node propio. Toda la persistencia se hace contra **Supabase** directamente desde el cliente, con **Row Level Security (RLS)** para proteger los datos. El envío de emails se hace en el cliente apuntando a la **REST API de Resend**. Toda API sensible debe protegerse / moverse a Edge Functions para producción (ver [Seguridad](#-seguridad-y-producción)).

---

## 📁 Estructura del Proyecto

```
.
├── public/                    # Assets estáticos (favicon, manifest PWA)
├── src/
│   ├── components/            # UI y modales (Auth, Chat, Dashboard, modals...)
│   │   └── shared/            # Componentes reutilizables (firma, etc.)
│   ├── hooks/
│   │   ├── useProviders.ts        # Fetch de proveedores (Supabase / mock fallback)
│   │   ├── useCategoriesAndZones.ts# Provincias, categorías y zonas
│   │   └── useGeolocation.ts      # Geolocalización + distancia (Haversine)
│   ├── lib/
│   │   ├── supabase.ts            # Cliente Supabase + datasets MOCK
│   │   └── resend.ts              # Helpers de envío de email (Resend)
│   ├── pages/
│   │   └── Home.tsx               # Única página (SPA single-view)
│   ├── types/
│   │   └── database.types.ts      # Tipos TypeScript del dominio
│   ├── App.tsx
│   └── main.tsx                   # Entry point
├── supabase/
│   └── schema.sql                 # Migración del esquema + RLS + vistas
├── index.html                     # SEO + Google Fonts + PWA meta
├── tailwind.config.js
├── vite.config.ts                 # Alias '@' → './src'
└── package.json
```

> La app es **single-view**: `App.tsx` renderiza `Home`, que orquesta todos los modales (Auth, Chat, Dashboard, Soporte, Reseña, Solicitud de Trabajo, Alta de Proveedor) y la grilla de resultados.

---

## 🚀 Puesta en Marcha (Local)

Requisitos: **Node 18+** y **npm**.

```bash
# 1) Instalar dependencias
npm install

# 2) Configurar variables de entorno
# Copiá .env.example → .env.local y completá los valores reales
cp .env.example .env.local

# 3) Levantar dev server (HMR)
npm run dev
```

### Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Dev server con HMR (Vite) |
| `npm run build` | **Typecheck (`tsc`) + build de producción** |
| `npm run preview` | Previsualizar el build de producción |
| `npm run lint` | Linter ESLint |

---

## 🔌 Integración con APIs

### 1️⃣ Supabase (Backend como Servicio)

**Cómo se conecta** — `src/lib/supabase.ts`

```ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
```

**Comportamiento clave:** si las variables **no** están configuradas (o apuntan al placeholder `your-project`), `isSupabaseConfigured` es `false` y la app entra en **modo demo** usando datasets MOCK (`MOCK_PROVEEDORES`, `MOCK_CATEGORIAS`, etc.). Esto permite correr y desplegar el proyecto sin backend real.

**Tablas usadas** (`supabase/schema.sql`):

| Tabla | Uso |
|-------|-----|
| `provincias` / `zonas` | Áreas geográficas de cobertura |
| `categorias` | Rubros de servicio (icono asociado) |
| `proveedores` | Profesionales (datos legales DNI/email en interno) |
| `proveedores_publicos` | **Vista segura** que excluye DNI y email |
| `resenas` | Calificaciones 1–5 con comentario |
| `tickets_soporte` | Tickets de soporte del usuario |
| `mensajes` | Mensajería interna entre usuarios/proveedores |
| `solicitudes_trabajo` | Bolsa de trabajos publicada por clientes |

La app consulta: `proveedores_publicos` (con joins a `categorias`, `zonas`, `provincias`), `provincias`, `categorias`, `zonas`, `solicitudes_trabajo` y `mensajes`. Ver `src/hooks/useProviders.ts`, `src/hooks/useCategoriesAndZones.ts` y `src/pages/Home.tsx`.

**Auth — Google OAuth** — `src/components/AuthModal.tsx`

```ts
await supabase.auth.signInWithOAuth({ provider: 'google' });
```

Requiere configurar el provider **Google** en la consola de Supabase (Authentication → Providers) y agregar las **URLs de redirect** del dominio (local + producción Vercel) en la sección **Auth → URL Configuration**.

---

### 2️⃣ Resend (Emails transaccionales)

**Cómo se conecta** — `src/lib/resend.ts`

Envía emails llamando directamente a la REST API de Resend:

```ts
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${resendApiKey}`,
  },
  body: JSON.stringify({ from, to, subject, html }),
});
```

**Emails que envía la app:**

| Función | Cuándo se dispara |
|---------|-------------------|
| `sendProviderRegistrationEmail` | Alta de un proveedor |
| `sendSupportTicketEmail` | Confirmación de ticket de soporte |
| `sendNewMessageNotificationEmail` | Notifica nuevo mensaje interno |
| `sendJobAlertBroadcastEmail` | **Alerta de trabajo** a profesionales por zona/rubro |

> ⚠️ **Nota de seguridad:** la `VITE_RESEND_API_KEY` se expone en el bundle del cliente. Para producción hay que llamar a Resend desde un **backend / Supabase Edge Function** (ver [Seguridad](#-seguridad-y-producción)).

---

### 3️⃣ WhatsApp (Deep Link — sin API key)

El "contacto directo por WhatsApp" usa **enlaces profundos** `https://wa.me/<teléfono>?text=<mensaje>` en `src/components/ProviderCard.tsx` y `src/components/JobBoard.tsx`. No requiere clave ni backend; abre la conversación en la app de WhatsApp del usuario con un mensaje pre-llenado.

---

### 4️⃣ Geolocalización (API del navegador)

`src/hooks/useGeolocation.ts` usa `navigator.geolocation` para obtener la ubicación y calcula distancia (kilómetros) entre proveedores y el usuario mediante la **fórmula de Haversine**. El banner `GpsAlertBanner.tsx` informa la zona detectada / permisos denegados.

---

## 🗄️ Base de Datos (Supabase)

La migración está en **`supabase/schema.sql`**. Aplicarla en un proyecto Supabase nuevo (SQL Editor) u otra instancia.

**Puntos importantes:**
- **View `proveedores_publicos`:** filtrada con `activo = true` y **excluye** columnas sensibles (`dni`, `email`).
- **RLS (Row Level Security) habilitado** en todas las tablas: lectura pública de servicios/reseñas/solicitudes, inserción pública, y solo lectura de datos propios para `tickets_soporte` y `mensajes`.
- Para producción, **personalizar las policies de `mensajes`** para que un usuario solo lea/inserte conversaciones donde es emisor o receptor (las actuales permiten acceso público, ver [Seguridad](#-seguridad-y-producción)).

---

## ☁️ Deploy en Vercel

El proyecto es una **SPA estática de Vite**. Vercel lo detecta automáticamente (framework preset **Vite**).

### Pasos

1. Conectá el repo `ExeDevCentral/fixi` en Vercel → **New Project → Import**.
2. Verificá que el **Build Command** sea `npm run build` y el **Output** `dist` (valores por defecto de Vite).
3. Configurá las **Environment Variables** (Project → Settings → Environment Variables):

   | Variable | Descripción | Requerida |
   |----------|-------------|-----------|
   | `VITE_SUPABASE_URL` | URL del proyecto Supabase | Lo recomendado (si no, modo demo) |
   | `VITE_SUPABASE_ANON_KEY` | Anon key pública de Supabase | Lo recomendado (si no, modo demo) |
   | `VITE_RESEND_API_KEY` | Clave de la API de Resend | Opcional (si no, los emails se logean) |

   > Las variables `.env` / `.env.local` están en `.gitignore` y **no se suben al repo**; hay que configurarlas manualmente en el dashboard de Vercel. Sin Supabase, el sitio **igual despliega** y corre en modo demo con datos MOCK.

4. Configurá en Supabase las **URLs de redirect** para el dominio de producción (Auth → URL Configuration) y el provider **Google**.

---

## 📌 Lo que falta / Próximos pasos

- [ ] **Paginación / virtualización** de la grilla de proveedores (el bundle JS actual supera el límite de 500 kB; conviene *code-splitting* con `React.lazy` y `manualChunks`).
- [ ] **Endpoints de backend**: mover **Resend** y cualquier lógica con clave secreta a una **Supabase Edge Function** (evita exponer `VITE_RESEND_API_KEY`).
- [ ] **Policies RLS de `mensajes`** más estrictas (solo emisor/receptor pueden leer & insertar).
- [ ] **Registro de usuario por email + contraseña** (hoy solo Google OAuth).
- [ ] **Persistencia real de "proveedores contactados"** por usuario (hoy estado en memoria).
- [ ] **Panel del proveedor**: recibir/responder solicitudes y ver alertas de trabajo (hoy las alertas se envían por email y la bolsa es pública).
- [ ] **Búsqueda por ubicación real** (ordenar proveedores por distancia usando lat/long de `useGeolocation` + datos de latitud/longitud).
- [ ] **Tests automatizados** (unitarios de hooks, e2e del flujo de contacto) — actualmente no hay framework de testing configurado.
- [ ] **PWA completo** (hay `manifest.json` y meta tags; falta Service Worker + offline).
- [ ] **Seguridad de la vista `proveedores_publicos`**: confirmar grants y revocar acceso no deseado.

---

## 🔒 Seguridad y Producción

- **Clave de Resend pública:** `VITE_*` se inyecta en el bundle. Usar una Edge Function con la clave en Server Environment para producción.
- **Anon key de Supabase:** es pública por diseño en RLS; la seguridad depende de **policies correctas**, no de ocultar la key.
- **No commitear** `.env`, `.env.local` ni claves reales. Están en `.gitignore`.
- Revisar periódicamente las **policies RLS** y el **Schema Exposed API** de Supabase.

---

## 🧑‍💻 Cadena de herramientas

- **Lenguaje:** TypeScript (strict mode)
- **Estado:** localStorage + estado React local (sin Redux/Zustand)
- **Qualidad de build:** `tsc && vite build` valida tipos antes de empaquetar
