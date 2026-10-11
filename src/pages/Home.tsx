import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { ProviderGrid } from '../components/ProviderGrid';
import { JobBoard } from '../components/JobBoard';
import { GpsAlertBanner } from '../components/GpsAlertBanner';
import { DemoTour } from '../components/DemoTour';
import { ProviderInterestToast } from '../components/ProviderInterestToast';
import { PlayCircle, Sparkles } from 'lucide-react';
import { Footer } from '../components/Footer';
import { FixiSimulatorEngine } from '../components/simulator/FixiSimulatorEngine';
import { TopographicBackground } from '../components/TopographicBackground';

import { useCategoriesAndZones } from '../hooks/useCategoriesAndZones';
import { useProviders } from '../hooks/useProviders';
import { UserProfile, Proveedor, TicketSoporte, Mensaje, SolicitudTrabajo } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthModal = lazy(() =>
  import('../components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const ClientDashboard = lazy(() =>
  import('../components/ClientDashboard').then((m) => ({ default: m.ClientDashboard }))
);
const ChatModal = lazy(() =>
  import('../components/ChatModal').then((m) => ({ default: m.ChatModal }))
);
const RequestJobModal = lazy(() =>
  import('../components/RequestJobModal').then((m) => ({ default: m.RequestJobModal }))
);
const AddProviderModal = lazy(() =>
  import('../components/AddProviderModal').then((m) => ({ default: m.AddProviderModal }))
);
const RatingModal = lazy(() =>
  import('../components/RatingModal').then((m) => ({ default: m.RatingModal }))
);
const SupportModal = lazy(() =>
  import('../components/SupportModal').then((m) => ({ default: m.SupportModal }))
);

export const Home: React.FC = () => {
  const { provincias, categories, zones, loading: loadingCatZone } = useCategoriesAndZones();

  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'APP_FIRST' | 'DIRECTORY'>('APP_FIRST');

  // Modals & State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isRequestJobOpen, setIsRequestJobOpen] = useState(false);
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<Proveedor | null>(null);
  const [chatTarget, setChatTarget] = useState<Proveedor | null>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [interestedProviders, setInterestedProviders] = useState<Proveedor[]>([]);

  // User activity history, messages, job requests & support tickets
  const [contactedProviders, setContactedProviders] = useState<Proveedor[]>([]);
  const [tickets, setTickets] = useState<TicketSoporte[]>([]);
  const [messages, setMessages] = useState<Mensaje[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudTrabajo[]>([
    {
      id: 'mock-sol-1',
      cliente_nombre: 'Mariana Gomez',
      cliente_email: 'mariana@ejemplo.com',
      cliente_telefono: '3415998877',
      categoria_id: 'cat-3',
      zona_id: 'zona-1',
      titulo: 'Instalación de tablero eléctrico monofásico y disyuntor',
      descripcion: 'Necesito electricista matriculado para adaptar tablero principal en depto centro de Rosario. Trabajo simple.',
      presupuesto_estimado: '$55.000',
      urgencia: 'Urgente 24hs',
      estado: 'Abierta',
      created_at: new Date().toISOString(),
      categoria: { id: 'cat-3', nombre: 'Electricidad', slug: 'electricidad' },
      zona: { id: 'zona-1', nombre: 'Rosario (Centro)', slug: 'rosario-centro', provincia_id: 'prov-1' },
    },
    {
      id: 'mock-sol-2',
      cliente_nombre: 'Santiago Rossi',
      cliente_email: 'santiago@ejemplo.com',
      cliente_telefono: '3414123890',
      categoria_id: 'cat-1',
      zona_id: 'zona-4',
      titulo: 'Mantenimiento de parque y poda de cerco vivo en Funes',
      descripcion: 'Buscamos jardinero para cortar césped y nivelar cerco de ligustrina de 25 metros en Funes.',
      presupuesto_estimado: '$40.000',
      urgencia: 'Esta Semana',
      estado: 'Abierta',
      created_at: new Date().toISOString(),
      categoria: { id: 'cat-1', nombre: 'Jardinería', slug: 'jardineria' },
      zona: { id: 'zona-4', nombre: 'Funes', slug: 'funes', provincia_id: 'prov-1' },
    }
  ]);

  const { providers, loading: loadingProviders } = useProviders({
    provinciaId: selectedProvincia,
    zoneId: selectedZone,
    categoryId: selectedCategory,
    searchQuery: searchQuery,
    userLatitude: userLocation?.latitude,
    userLongitude: userLocation?.longitude,
    sortByDistance,
  });

  // Fetch live requests from Supabase if configured
  useEffect(() => {
    async function fetchRequests() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('solicitudes_trabajo')
            .select(`*, categoria:categorias(*), zona:zonas(*)`)
            .eq('estado', 'Abierta')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            setSolicitudes(data as SolicitudTrabajo[]);
          }
        } catch (err) {
          console.warn('Fallback a solicitudes mock:', err);
        }
      }
    }
    fetchRequests();
  }, []);

  const handleResetFilters = () => {
    setSelectedProvincia('');
    setSelectedZone('');
    setSelectedCategory('');
    setSearchQuery('');
  };

  const handleContactProvider = (provider: Proveedor) => {
    setContactedProviders((prev) => {
      if (prev.find((p) => p.id === provider.id)) return prev;
      return [provider, ...prev];
    });
  };

  const handleOpenChat = (provider: Proveedor) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setChatTarget(provider);
  };

  const handleMessageSent = (newMsg: Mensaje) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSendMessageReply = async (receptorEmail: string, contenido: string, proveedorId?: string) => {
    if (!user) return;

    const payload = {
      emisor_email: user.email,
      receptor_email: receptorEmail,
      proveedor_id: proveedorId,
      contenido,
      leido: false,
    };

    let newMsg: Mensaje;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('mensajes')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      newMsg = data as Mensaje;
    } else {
      newMsg = {
        id: `msg-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
      };
    }

    setMessages((prev) => [...prev, newMsg]);
  };

  const handleTicketCreated = (newTicket: TicketSoporte) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleRequestCreated = (newReq: SolicitudTrabajo) => {
    setSolicitudes((prev) => [newReq, ...prev]);

    // ===== DEMO: simulate providers showing interest in the new request =====
    if (!isSupabaseConfigured && providers.length > 0) {
      const shuffled = [...providers].sort(() => Math.random() - 0.5).slice(0, 2);
      shuffled.forEach((p, i) => {
        setTimeout(() => {
          setInterestedProviders((prev2) =>
            prev2.some((x) => x.id === p.id) ? prev2 : [...prev2, p]
          );
          // Auto-dismiss after 12s
          setTimeout(() => {
            setInterestedProviders((prev2) => prev2.filter((x) => x.id !== p.id));
          }, 12000);
        }, 2500 + i * 4500);
      });
    }
    // ===== end demo simulation =====
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06080d] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black relative">

      {/* Topographic organic relief lines with traveling pulse waves */}
      <TopographicBackground />

      {/* Floating demo tour launcher */}
      <button
        onClick={() => setIsTourOpen(true)}
        className="fixed bottom-4 left-4 z-40 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-sky-500/25 active:scale-95 transition-all"
      >
        <PlayCircle className="w-4 h-4" />
        <span>Ver cómo funciona</span>
      </button>

      {/* Navbar with Auth & Support Controls and Mode Switcher */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenRequestJob={() => setIsRequestJobOpen(true)}
        onOpenAddProvider={() => setIsAddProviderOpen(true)}
        activeViewMode={activeViewMode}
        onChangeViewMode={setActiveViewMode}
      />

      {/* Conditional View: App-First Engine vs Full Directory */}
      {activeViewMode === 'APP_FIRST' ? (
        <main className="flex-grow w-full py-4 sm:py-6">
          <FixiSimulatorEngine onViewDirectory={() => setActiveViewMode('DIRECTORY')} />
        </main>
      ) : (
        <>
          {/* Header Switch Back Banner */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="p-4 rounded-2xl obsidian-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-xs tracking-tight">Estás en el Directorio Abierto de Profesionales</div>
                  <div className="text-slate-400 text-[11px]">Podés consultar los perfiles manualmente o ingresar al flujo guiado en tiempo real.</div>
                </div>
              </div>
              <button
                onClick={() => setActiveViewMode('APP_FIRST')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs transition-all shadow-sm active:scale-95"
              >
                Volver a la Experiencia en Vivo
              </button>
            </div>
          </div>

          {/* Hero Header */}
          <Hero
            totalProviders={providers.length}
            onOpenRequestJob={() => setIsRequestJobOpen(true)}
            onOpenAddProvider={() => setIsAddProviderOpen(true)}
          />

          {/* GPS Geolocation Live Alert Banner */}
          <GpsAlertBanner
            onLocationDetected={(latitude, longitude) =>
              setUserLocation({ latitude, longitude })
            }
          />

          {/* Main Content Layout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow py-4">

            {/* Mobile View Top Filters */}
            <div className="block lg:hidden">
              <SearchBar
                provincias={provincias}
                categories={categories}
                zones={zones}
                selectedProvincia={selectedProvincia}
                selectedZone={selectedZone}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onSelectProvincia={setSelectedProvincia}
                onSelectZone={setSelectedZone}
                onSelectCategory={setSelectedCategory}
                onSearchChange={setSearchQuery}
                onResetFilters={handleResetFilters}
              />
            </div>

            {/* Desktop View Layout (Sticky Sidebar + Results Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Desktop Left Sticky Sidebar Filter */}
              <div className="hidden lg:block lg:col-span-3">
                <SearchBar
                  provincias={provincias}
                  categories={categories}
                  zones={zones}
                  selectedProvincia={selectedProvincia}
                  selectedZone={selectedZone}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  onSelectProvincia={setSelectedProvincia}
                  onSelectZone={setSelectedZone}
                  onSelectCategory={setSelectedCategory}
                  onSearchChange={setSearchQuery}
                  onResetFilters={handleResetFilters}
                  isSidebarDesktop
                />
              </div>

              {/* Provider Results Grid & Job Board */}
              <div className="col-span-1 lg:col-span-9 space-y-8">
                <ProviderGrid
                  providers={providers}
                  loading={loadingProviders || loadingCatZone}
                  onResetFilters={handleResetFilters}
                  onContactClick={handleContactProvider}
                  onRatingClick={(p) => setRatingTarget(p)}
                  onOpenChat={handleOpenChat}
                  sortByDistance={sortByDistance}
                  canSortByDistance={Boolean(userLocation)}
                  onToggleSortByDistance={() => setSortByDistance((s) => !s)}
                />

                {/* Public Job Request Board */}
                <JobBoard
                  solicitudes={solicitudes}
                  onOpenCreateRequest={() => setIsRequestJobOpen(true)}
                />
              </div>

            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <Suspense fallback={null}>
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(loggedUser) => setUser(loggedUser)}
        />

        <ClientDashboard
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          user={user}
          onLogout={() => setUser(null)}
          tickets={tickets}
          messages={messages}
          onSendMessage={handleSendMessageReply}
          onOpenCreateTicket={() => {
            setIsDashboardOpen(false);
            setIsSupportOpen(true);
          }}
          onOpenRating={(p) => setRatingTarget(p)}
          contactedProviders={contactedProviders}
        />

        <ChatModal
          isOpen={Boolean(chatTarget)}
          onClose={() => setChatTarget(null)}
          provider={chatTarget}
          currentUser={user}
          onMessageSent={handleMessageSent}
          onProviderReply={handleMessageSent}
        />

        <RequestJobModal
          isOpen={isRequestJobOpen}
          onClose={() => setIsRequestJobOpen(false)}
          categories={categories}
          zones={zones}
          userEmail={user?.email}
          userName={user?.nombre}
          onRequestCreated={handleRequestCreated}
        />

        <AddProviderModal
          isOpen={isAddProviderOpen}
          onClose={() => setIsAddProviderOpen(false)}
          categories={categories}
          zones={zones}
          onProviderAdded={(newProvider) => {
            // Handled gracefully via state / refetch
          }}
        />

        <RatingModal
          isOpen={Boolean(ratingTarget)}
          onClose={() => setRatingTarget(null)}
          provider={ratingTarget}
          userEmail={user?.email}
        />

        <SupportModal
          isOpen={isSupportOpen}
          onClose={() => setIsSupportOpen(false)}
          userEmail={user?.email || 'invitado@gmail.com'}
          onTicketCreated={handleTicketCreated}
        />

        {/* Interactive guided demo tour */}
        <DemoTour
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          onStepAction={(stepId) => {
            if (stepId === 'contact' && providers.length > 0) {
              const target = user ? providers[0] : providers[0];
              setIsTourOpen(false);
              if (!user) {
                // log in demo user silently for the tour flow
                setUser({ email: 'usuario.cliente@gmail.com', nombre: 'Matías Rossi', foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' });
              }
              setChatTarget(target);
            } else if (stepId === 'request') {
              setIsTourOpen(false);
              setIsRequestJobOpen(true);
            } else if (stepId === 'rate' && providers.length > 0) {
              setIsTourOpen(false);
              if (!user) {
                setUser({ email: 'usuario.cliente@gmail.com', nombre: 'Matías Rossi', foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' });
              }
              setRatingTarget(providers[0]);
            }
          }}
        />

        {/* Demo: providers "interested" toasts after publishing a request */}
        <ProviderInterestToast
          interested={interestedProviders}
          onDismiss={(id) => setInterestedProviders((prev) => prev.filter((p) => p.id !== id))}
          onOpenChat={(p) => {
            if (!user) {
              setUser({ email: 'usuario.cliente@gmail.com', nombre: 'Matías Rossi', foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' });
            }
            setInterestedProviders((prev) => prev.filter((x) => x.id !== p.id));
            setChatTarget(p);
          }}
        />
      </Suspense>

      {/* Footer */}
      <Footer />

    </div>
  );
};