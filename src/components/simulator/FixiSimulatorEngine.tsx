import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Wrench,
  Key,
  Trees,
  Wind,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  Radar,
  Smartphone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Play,
  PlayCircle,
  FileCheck,
  UserCheck,
  Layers,
} from 'lucide-react';

import {
  SimulatorStage,
  FixiOrder,
  SpecialistProfile,
  ServiceCategoryOption,
} from '../../types/simulator.types';
import { SERVICE_CATEGORIES, MOCK_SPECIALISTS } from '../../lib/mockSpecialists';
import { EmailNotificationPreview } from './EmailNotificationPreview';
import { PaymentGatewaySimulator } from './PaymentGatewaySimulator';
import { CompletedReviewCard } from './CompletedReviewCard';

interface FixiSimulatorEngineProps {
  onViewDirectory: () => void;
}

export const FixiSimulatorEngine: React.FC<FixiSimulatorEngineProps> = ({
  onViewDirectory,
}) => {
  // Current Simulator State
  const [stage, setStage] = useState<SimulatorStage>('CONFIGURING');

  // Order Configuration State
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryOption>(
    SERVICE_CATEGORIES[0]
  );
  const [selectedProblem, setSelectedProblem] = useState<string>(
    SERVICE_CATEGORIES[0].commonProblems[0]
  );
  const [selectedZone, setSelectedZone] = useState<string>('Rosario (Centro)');
  const [urgency, setUrgency] = useState<'Urgente 30 min' | 'Hoy Mismo' | 'Coordinar Horario'>('Urgente 30 min');

  // Tracking Dual-View state ('APP' vs 'EMAIL')
  const [trackingView, setTrackingView] = useState<'APP' | 'EMAIL'>('APP');

  // Work in progress timer simulation
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Active Specialist & Order
  const activeSpecialist: SpecialistProfile =
    MOCK_SPECIALISTS[selectedCategory.id] || MOCK_SPECIALISTS['electricidad'];

  const [currentOrder, setCurrentOrder] = useState<FixiOrder>({
    id: 'ord-8129',
    categoriaId: selectedCategory.id,
    categoriaNombre: selectedCategory.name,
    problemaSeleccionado: selectedProblem,
    zona: selectedZone,
    urgencia: urgency,
    precioEstimado: selectedCategory.defaultPrice,
    pinSeguridad: '7482',
    createdAt: new Date().toISOString(),
  });

  // When category changes, update problem default
  const handleSelectCategory = (cat: ServiceCategoryOption) => {
    setSelectedCategory(cat);
    setSelectedProblem(cat.commonProblems[0]);
  };

  // Launch Request (Start Matching)
  const handleStartRequest = () => {
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: FixiOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      categoriaId: selectedCategory.id,
      categoriaNombre: selectedCategory.name,
      problemaSeleccionado: selectedProblem,
      zona: selectedZone,
      urgencia: urgency,
      precioEstimado: selectedCategory.defaultPrice,
      pinSeguridad: generatedPin,
      createdAt: new Date().toISOString(),
    };
    setCurrentOrder(newOrder);
    setStage('DISPATCHING');
  };

  // Auto transition from radar to tracking
  useEffect(() => {
    if (stage === 'DISPATCHING') {
      const timer = setTimeout(() => {
        setStage('DISPATCHED_TRACKING');
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Stopwatch for in-progress work
  useEffect(() => {
    let interval: any;
    if (stage === 'IN_PROGRESS') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const handleRestart = () => {
    setStage('CONFIGURING');
    setTrackingView('APP');
    setElapsedSeconds(0);
  };

  // Icon mapper helper
  const renderIcon = (name: string, className = 'w-5 h-5') => {
    switch (name) {
      case 'Zap':
        return <Zap className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      case 'Key':
        return <Key className={className} />;
      case 'Trees':
        return <Trees className={className} />;
      case 'Wind':
        return <Wind className={className} />;
      case 'Truck':
        return <Truck className={className} />;
      default:
        return <Wrench className={className} />;
    }
  };

  // Formatted price helper
  const formatARS = (val: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-8">
      {/* Top Breadcrumb Milestones Bar */}
      <div className="mb-6 sm:mb-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between overflow-x-auto gap-2 no-scrollbar">
          {[
            { id: 'CONFIGURING', step: '1', title: '1. Pedir FIXI' },
            { id: 'DISPATCHED_TRACKING', step: '2', title: '2. Asignación & Seguridad' },
            { id: 'IN_PROGRESS', step: '3', title: '3. Trabajo en Vivo' },
            { id: 'PAYMENT_GATEWAY', step: '4', title: '4. Pago Multicanal' },
            { id: 'COMPLETED_REVIEW', step: '5', title: '5. Calificación' },
          ].map((item, idx) => {
            const isCurrent =
              stage === item.id || (stage === 'DISPATCHING' && item.id === 'CONFIGURING');
            const isPassed =
              (item.id === 'CONFIGURING' && stage !== 'CONFIGURING') ||
              (item.id === 'DISPATCHED_TRACKING' &&
                ['IN_PROGRESS', 'PAYMENT_GATEWAY', 'COMPLETED_REVIEW'].includes(stage)) ||
              (item.id === 'IN_PROGRESS' &&
                ['PAYMENT_GATEWAY', 'COMPLETED_REVIEW'].includes(stage)) ||
              (item.id === 'PAYMENT_GATEWAY' && stage === 'COMPLETED_REVIEW');

            return (
              <div key={item.id} className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-950/40 text-slate-400 border border-slate-800/60'
                  }`}
                >
                  <span>{item.title}</span>
                </div>
                {idx < 4 && <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* STAGE CONTAINER WITH ANIMATED TRANSITIONS */}
      <AnimatePresence mode="wait">
        {/* 1. STAGE: CONFIGURING */}
        {stage === 'CONFIGURING' && (
          <motion.div
            key="configuring"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            {/* Background ambient light */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Headline and hook */}
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold mb-3">
                <PlayCircle className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Simulador en Tiempo Real de la Experiencia FIXI</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                ¿Qué necesitas solucionar en tu casa hoy?
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Seleccioná el tipo de servicio para ver cómo FIXI asigna automáticamente al profesional verificado más cercano, te avisa por correo y gestiona el cobro seguro.
              </p>
            </div>

            {/* Category selection grid */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                1. Seleccioná el oficio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-b from-emerald-500/20 to-slate-900 border-emerald-500 text-white shadow-xl shadow-emerald-500/10 scale-[1.02]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr ${cat.color} text-slate-950 shadow-md`}
                      >
                        {renderIcon(cat.iconName, 'w-5 h-5')}
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{cat.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Base {formatARS(cat.defaultPrice)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Problem chips selection */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                2. Diagnóstico rápido del problema
              </label>
              <div className="flex flex-wrap gap-2.5">
                {selectedCategory.commonProblems.map((prob) => {
                  const isSelected = selectedProblem === prob;
                  return (
                    <button
                      key={prob}
                      onClick={() => setSelectedProblem(prob)}
                      className={`text-xs px-4 py-2.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {prob}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone and urgency selector row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  3. Tu Zona en Rosario y Región
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-emerald-500 outline-none appearance-none"
                  >
                    <option value="Rosario (Centro)">Rosario (Centro y Microcentro)</option>
                    <option value="Rosario (Pichincha)">Rosario (Pichincha / Echesortu)</option>
                    <option value="Rosario (Fisherton)">Rosario (Fisherton / Aldea)</option>
                    <option value="Funes">Funes (Garita 1 a 18 / Zona Comercial)</option>
                    <option value="Roldán">Roldán (Tierra de Sueños)</option>
                    <option value="Granadero Baigorria">Granadero Baigorria</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  4. Nivel de Urgencia
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Urgente 30 min', 'Hoy Mismo', 'Coordinar Horario'] as const).map((urg) => (
                    <button
                      key={urg}
                      onClick={() => setUrgency(urg)}
                      className={`text-xs py-3 px-2 rounded-xl border text-center transition-all ${
                        urgency === urg
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Asignación con verificación de matrícula y antecedentes.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onViewDirectory}
                  className="px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 transition-all"
                >
                  Ver Directorio
                </button>

                <button
                  onClick={handleStartRequest}
                  className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all active:scale-95"
                >
                  <span>Pedir mi FIXI Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. STAGE: DISPATCHING (RADAR MATCHING) */}
        {stage === 'DISPATCHING' && (
          <motion.div
            key="dispatching"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-14 text-center shadow-2xl backdrop-blur-xl max-w-xl mx-auto space-y-6"
          >
            {/* Animated Radar Visual */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping" />
              <div className="absolute inset-4 rounded-full border border-emerald-500/40 animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <Radar className="w-10 h-10 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Algoritmo de Asignación en Vivo
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-3">
                Buscando el mejor FIXI-Pro en {selectedZone}...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Filtrando especialistas certificados en {selectedCategory.name} con calificación mínima de 4.8 estrellas y cercanía inmediata.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-400 max-w-xs mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Geolocalizando profesionales a menos de 5 km</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verificando matrícula oficial y antecedentes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Generando PIN de seguridad para apertura</span>
              </div>
            </div>

            <button
              onClick={() => setStage('DISPATCHED_TRACKING')}
              className="text-xs text-slate-500 hover:text-slate-300 underline pt-2"
            >
              Saltar animación e ir directo al seguimiento
            </button>
          </motion.div>
        )}

        {/* 3. STAGE: DISPATCHED TRACKING (DUAL APP & EMAIL PREVIEW) */}
        {stage === 'DISPATCHED_TRACKING' && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* View Switcher Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-3xl gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    ¡Especialista Asignado! {activeSpecialist.nombre} va en camino
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cambia de vista para comprobar la pantalla de la app o el correo de seguridad recibido.
                  </p>
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setTrackingView('APP')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    trackingView === 'APP'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Vista App Móvil</span>
                </button>

                <button
                  onClick={() => setTrackingView('EMAIL')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    trackingView === 'EMAIL'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email de Seguridad Recibido</span>
                </button>
              </div>
            </div>

            {/* Sub-view 1: Native Mobile Tracker View */}
            {trackingView === 'APP' && (
              <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <img
                    src={activeSpecialist.foto}
                    alt={activeSpecialist.nombre}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-xl"
                  />
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-xl font-black text-white">{activeSpecialist.nombre}</h3>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Matrícula Verificada
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{activeSpecialist.titulo}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
                      <span>DNI: <strong className="text-white">{activeSpecialist.dniEnmascarado}</strong></span>
                      <span>•</span>
                      <span>Movilidad: <strong className="text-white">{activeSpecialist.vehiculo} ({activeSpecialist.patente})</strong></span>
                    </div>
                  </div>

                  {/* Arrival ETA Badge */}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center shrink-0">
                    <div className="text-[11px] text-emerald-400 font-bold uppercase">Llegada Estimada</div>
                    <div className="text-3xl font-black text-white font-mono my-0.5">
                      {activeSpecialist.tiempoLlegadaMinutos} min
                    </div>
                    <div className="text-[10px] text-slate-400">En viaje hacia {currentOrder.zona}</div>
                  </div>
                </div>

                {/* Key Metrics and Safety Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                    <div className="text-slate-400 mb-1">Duración estimada del trabajo</div>
                    <div className="text-base font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" /> ~{activeSpecialist.tiempoEstimadoTrabajoMinutos} minutos
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                    <div className="text-slate-400 mb-1">Presupuesto de referencia</div>
                    <div className="text-base font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" /> {formatARS(currentOrder.precioEstimado)}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <div className="text-amber-300 font-bold mb-1">Código PIN de Validación</div>
                    <div className="text-base font-black text-white font-mono tracking-widest">
                      {currentOrder.pinSeguridad}
                    </div>
                  </div>
                </div>

                {/* Action button to proceed to Arrival */}
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setStage('IN_PROGRESS')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <span>Simular que el Profesional Llegó a tu Casa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Sub-view 2: Email Notification Preview */}
            {trackingView === 'EMAIL' && (
              <div className="space-y-4">
                <EmailNotificationPreview specialist={activeSpecialist} order={currentOrder} />
                <div className="flex justify-center">
                  <button
                    onClick={() => setStage('IN_PROGRESS')}
                    className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <span>Continuar Simulación (Profesional en Domicilio)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 4. STAGE: IN_PROGRESS (LIVE STOPWATCH & WORK CHECKLIST) */}
        {stage === 'IN_PROGRESS' && (
          <motion.div
            key="inprogress"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8"
          >
            {/* Header with live timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 animate-spin" /> Trabajo en Ejecución
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white">
                  {activeSpecialist.nombre} está realizando la reparación
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentOrder.categoriaNombre} • {currentOrder.problemaSeleccionado} en {currentOrder.zona}
                </p>
              </div>

              {/* Stopwatch Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
                <div className="text-[11px] text-slate-400">Tiempo de trabajo transcurrido:</div>
                <div className="font-mono text-3xl font-black text-emerald-400">
                  {Math.floor(elapsedSeconds / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(elapsedSeconds % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Estimado: ~{activeSpecialist.tiempoEstimadoTrabajoMinutos} min</div>
              </div>
            </div>

            {/* Checklist of steps in the house */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Bitácora de servicio en tu domicilio:
              </div>
              <div className="space-y-2.5">
                {[
                  { title: 'Validación de identidad en puerta con PIN seguro', done: true },
                  { title: 'Inspección técnica preliminar y confirmación de presupuesto', done: true },
                  { title: 'Reparación / reemplazo de materiales con repuestos certificados', done: elapsedSeconds >= 3 },
                  { title: 'Prueba de funcionamiento final y limpieza del área', done: elapsedSeconds >= 6 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      item.done
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-xs font-medium">
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase">
                      {item.done ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button to finish work and pay */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Al finalizar, no abones hasta que el especialista te muestre la prueba completa del arreglo.
              </div>
              <button
                onClick={() => setStage('PAYMENT_GATEWAY')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <span>Trabajo Terminado • Ir a Cobro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* 5. STAGE: PAYMENT_GATEWAY */}
        {stage === 'PAYMENT_GATEWAY' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <PaymentGatewaySimulator
              order={currentOrder}
              onPaymentSuccess={() => setStage('COMPLETED_REVIEW')}
            />
          </motion.div>
        )}

        {/* 6. STAGE: COMPLETED_REVIEW */}
        {stage === 'COMPLETED_REVIEW' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <CompletedReviewCard
              specialist={activeSpecialist}
              order={currentOrder}
              onRestart={handleRestart}
              onViewDirectory={onViewDirectory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
