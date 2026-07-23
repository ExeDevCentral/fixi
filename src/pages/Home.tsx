import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { ProviderGrid } from '../components/ProviderGrid';
import { JobBoard } from '../components/JobBoard';
import { GpsAlertBanner } from '../components/GpsAlertBanner';
import { AuthModal } from '../components/AuthModal';
import { ClientDashboard } from '../components/ClientDashboard';
import { RatingModal } from '../components/RatingModal';
import { SupportModal } from '../components/SupportModal';
import { ChatModal } from '../components/ChatModal';
import { RequestJobModal } from '../components/RequestJobModal';
import { Footer } from '../components/Footer';

import { useCategoriesAndZones } from '../hooks/useCategoriesAndZones';
import { useProviders } from '../hooks/useProviders';
import { UserProfile, Proveedor, TicketSoporte, Mensaje, SolicitudTrabajo } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const Home: React.FC = () => {
  const { provincias, categories, zones, loading: loadingCatZone } = useCategoriesAndZones();
  
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isRequestJobOpen, setIsRequestJobOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<Proveedor | null>(null);
  const [chatTarget, setChatTarget] = useState<Proveedor | null>(null);

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
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Navbar with Auth & Support Controls */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenRequestJob={() => setIsRequestJobOpen(true)}
      />

      {/* Hero Header */}
      <Hero totalProviders={providers.length} />

      {/* GPS Geolocation Live Alert Banner */}
      <GpsAlertBanner />

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
            />

            {/* Public Job Request Board */}
            <JobBoard
              solicitudes={solicitudes}
              onOpenCreateRequest={() => setIsRequestJobOpen(true)}
            />
          </div>

        </div>
      </div>

      {/* Modals */}
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

      {/* Footer */}
      <Footer />

    </div>
  );
};
