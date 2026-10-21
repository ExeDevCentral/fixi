<div align="center">

# Fixi • Services & Trade Infrastructure
### *Decentralized On-Demand Labor Marketplace, Geodesic Proximity Engine & WebGL Spatial Interface*

[![Vite 6](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F_Spatial-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline_Precache-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>A fault-tolerant service dispatch and tradesperson discovery platform engineering Haversine spherical geodesic sorting, WebGL 3D interface rendering, and Progressive Web App service worker offline survivability.</b>
</p>

---

</div>

## 1. Abstract & System Architecture

Localized service marketplaces frequently encounter severe structural frictions: high latency in geo-spatial sorting, privacy leakage of technician credentials, and client disconnection in mobile edge networks.

**Fixi** engineers a performant, privacy-preserving trade and technical labor routing network:
- **Haversine Geodesic Sorting:** Calculates exact great-circle spherical distances between service requesters and verified tradespeople on client hardware with sub-millisecond complexity.
- **Privacy-Preserving Database Projection:** Enforces zero-exposure views (`proveedores_publicos`) in PostgreSQL, cryptographically segregating national identity numbers and direct contact vectors from client query access.
- **Three.js Spatial Viewports:** Incorporates React Three Fiber (`@react-three/fiber`, `@react-three/drei`) for 3D tactile interface paradigms.
- **Progressive Web App Offline Resilience:** Pre-caches application bundles and mock datasets via `vite-plugin-pwa` service workers, sustaining application uptime during complete signal degradation.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT GEOLOCATION & TRIAGE                     │
│  [W3C Geolocation Vector] ──► [Haversine Spherical Distance Engine]    │
│  [Trade Category Taxonomy] ──► [Dynamic Radius Matrix]                 │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 DATA PRIVACY & ROW-LEVEL SECURITY                      │
│       • Sanitized Public View Projection: `proveedores_publicos`       │
│       • Encrypted Legal Identification Storage (DNI/Tax PII)           │
│       • Dynamic Resilient Fallback to In-Memory Deterministic Mock Data│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│   DEEP LINK DISPATCH & PWA CACHE │        │      WEBGL 3D SPATIAL INTERACTION│
│  Instant WhatsApp Deep Relays    │        │   Three.js Interactive Viewport  │
│  Full ServiceWorker Precache     │        │   Framer Motion Micro-Dynamics   │
└──────────────────────────────────┘        └──────────────────────────────────┘
```

---

## 2. Mathematical Geodesic Formulation

Spatial sorting across regional clusters (Rosario, Santa Fe, Córdoba, Buenos Aires) uses the **Haversine Great-Circle Metric**, resolving spherical earth curvature without heavy GIS backend queries:

$$\Delta \sigma = 2 \arcsin \sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1) \cos(\phi_2) \sin^2\left(\frac{\Delta \lambda}{2}\right)}$$
$$d = R \cdot \Delta \sigma \quad \text{where } R \approx 6\,371.0 \text{ km}$$

Executing directly inside the client execution context (`useGeolocation.ts`), enabling instant localized sorting of nearby electricians, plumbers, gas technicians, and hardware specialists.

---

## 3. Technology Stack & Multi-Tier Topology

| Layer | Technology | Architectural Specification |
| :--- | :--- | :--- |
| **Build & Bundler** | Vite 6.1 | Tree-shaken production output with optimized chunk splitting |
| **UI Framework** | React 18.3 | Concurrent rendering with functional hooks architecture |
| **3D Rendering** | Three.js + R3F | Hardware-accelerated canvas graphics (`@react-three/drei`) |
| **Database & Auth** | Supabase (PostgreSQL) | RLS policies, Google OAuth, and secure view projections |
| **Offline Engine** | Vite PWA Plugin | Cache-first Service Worker with background auto-update |
| **Styling** | Tailwind CSS 3.4 | Utility-first responsive design tokens |

---

## 4. Systems Directory Hierarchy

```text
Fixi/
├── public/                 # PWA icons, manifest files & vector assets
├── src/
│   ├── components/         # Atomic UI modules, 3D Canvas & Provider cards
│   ├── hooks/              # `useGeolocation`, `useProviders`, `useCategories`
│   ├── lib/                # Supabase client, Resend REST relay & Haversine math
│   ├── pages/              # Landing view, Job Board, Profile & Service views
│   └── types/              # Domain interfaces & TypeScript schemas
├── supabase/
│   └── schema.sql          # Hardened DDL: RLS, views & category tables
└── vite.config.ts          # Rollup chunking & PWA service worker config
```

---

## 5. Deployment & Development Lifecycle

### Prerequisites
- **Node.js**: $\ge 18.x$ LTS
- **Package Manager**: `npm` $\ge 9.x$

### Installation & Initialization
```bash
# Clone the repository
git clone https://github.com/ExeDevCentral/fixi.git
cd fixi

# Install dependencies deterministically
npm install

# Launch development server with HMR
npm run dev
```

### Environment Configuration (`.env.local`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RESEND_API_KEY=re_your_api_key
```
*Note: If environment variables are omitted, Fixi seamlessly engages deterministic demo mode via mock datasets (`isSupabaseConfigured = false`), enabling instant preview and staging.*

### Production Build & Type Validation
```bash
# Verify static types and compile bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 6. License

Distributed under the **MIT License**. Engineered for regional labor connectivity and decentralized trade logistics.

<div align="center">
  <sub>Engineered by <a href="https://github.com/ExeDevCentral">ExeDevCentral</a>.</sub>
</div>
