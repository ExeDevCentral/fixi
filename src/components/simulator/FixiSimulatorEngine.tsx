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
  UserCheck,
  Check,
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
  const [stage, setStage] = useState<SimulatorStage>('CONFIGURING');

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryOption>(
    SERVICE_CATEGORIES[0]
  );
  const [selectedProblem, setSelectedProblem] = useState<string>(
    SERVICE_CATEGORIES[0].commonProblems[0]
  );
  const [selectedZone, setSelectedZone] = useState<string>('Rosario (Centro)');
  const [urgency, setUrgency] = useState<'Urgente 30 min' | 'Hoy Mismo' | 'Coordinar Horario'>('Urgente 30 min');

  const [trackingView, setTrackingView] = useState<'APP' | 'EMAIL'>('APP');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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

  const handleSelectCategory = (cat: ServiceCategoryOption) => {
    setSelectedCategory(cat);
    setSelectedProblem(cat.commonProblems[0]);
  };

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

  useEffect(() => {
    if (stage === 'DISPATCHING') {
      const timer = setTimeout(() => {
        setStage('DISPATCHED_TRACKING');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [stage]);

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

  const renderIcon = (name: string, className = 'w-4 h-4') => {
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

  const formatARS = (val: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Breadcrumb Milestones Bar (Enterprise Segmented Timeline) */}
      <div className="mb-8 p-1.5 rounded-2xl glass-pill-container max-w-3xl mx-auto">
        <div className="flex items-center justify-between overflow-x-auto gap-1 no-scrollbar">
          {[
            { id: 'CONFIGURING', title: '1. Diagnóstico' },
            { id: 'DISPATCHED_TRACKING', title: '2. Asignación' },
            { id: 'IN_PROGRESS', title: '3. En Domicilio' },
            { id: 'PAYMENT_GATEWAY', title: '4. Liquidación' },
            { id: 'COMPLETED_REVIEW', title: '5. Cierre' },
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
              <div key={item.id} className="flex items-center gap-1 shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    isCurrent
                      ? 'bg-white text-slate-950 font-semibold shadow-sm'
                      : isPassed
                      ? 'text-emerald-400 font-medium'
                      : 'text-slate-500'
                  }`}
                >
                  {isPassed ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{item.title}</span>
                </div>
                {idx < 4 && <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl obsidian-card p-6 sm:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Header info */}
            <div className="max-w-2xl mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-[11px] font-mono uppercase tracking-wider mb-3">
                <span className="status-dot-live"></span>
                <span>DESPACHO INTELIGENTE EN TIEMPO REAL</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12] font-display">
                Pedí un especialista con garantía y trazabilidad.
              </h1>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Seleccioná el requerimiento técnico para visualizar la asignación geolocalizada, la cédula de seguridad con PIN de puerta y la pasarela de pago custodiada.
              </p>
            </div>

            {/* Category selection grid */}
            <div className="mb-8">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                CATEGORÍA DEL SERVICIO
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className={`p-4 rounded-2xl text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-white text-slate-950 font-semibold shadow-lg scale-[1.02]'
                          : 'obsidian-card-interactive text-slate-300 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-slate-950 text-white'
                            : 'bg-white/[0.05] border border-white/[0.08] text-slate-300'
                        }`}
                      >
                        {renderIcon(cat.iconName, 'w-4 h-4')}
                      </div>
                      <div>
                        <div className="text-xs font-semibold leading-tight">{cat.name}</div>
                        <div
                          className={`text-[10px] mt-0.5 font-mono ${
                            isSelected ? 'text-slate-600' : 'text-slate-400'
                          }`}
                        >
                          Desde {formatARS(cat.defaultPrice)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Problem chips selection */}
            <div className="mb-8">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                DIAGNÓSTICO O MOTIVO PRINCIPAL
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedCategory.commonProblems.map((prob) => {
                  const isSelected = selectedProblem === prob;
                  return (
                    <button
                      key={prob}
                      onClick={() => setSelectedProblem(prob)}
                      className={`text-xs px-3.5 py-2 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-white text-slate-950 font-semibold shadow-sm'
                          : 'bg-white/[0.03] text-slate-300 border border-white/[0.07] hover:border-white/[0.15]'
                      }`}
                    >
                      {prob}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone and urgency selector row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  UBICACIÓN EN ROSARIO & REGIÓN
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.09] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-white/30 outline-none appearance-none font-medium"
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
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  PLAZO DE ATENCIÓN
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Urgente 30 min', 'Hoy Mismo', 'Coordinar Horario'] as const).map((urg) => (
                    <button
                      key={urg}
                      onClick={() => setUrgency(urg)}
                      className={`text-xs py-3 px-2 rounded-xl text-center transition-all ${
                        urgency === urg
                          ? 'bg-white text-slate-950 font-semibold shadow-sm'
                          : 'bg-black/30 border border-white/[0.07] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Especialistas matriculados con cobertura de responsabilidad civil contratada.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onViewDirectory}
                  className="px-5 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 text-xs font-medium border border-white/[0.08] transition-all"
                >
                  Directorio Clásico
                </button>

                <button
                  onClick={handleStartRequest}
                  className="flex-1 sm:flex-initial px-7 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                >
                  <span>Iniciar Despacho en Vivo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. STAGE: DISPATCHING (RADAR MATCHING - FLIGHT/RADAR INTERFACE) */}
        {stage === 'DISPATCHING' && (
          <motion.div
            key="dispatching"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-3xl obsidian-card p-8 sm:p-14 text-center shadow-2xl max-w-lg mx-auto space-y-6"
          >
            {/* Precision Radar Visual */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/[0.08] animate-ping" />
              <div className="absolute inset-3 rounded-full border border-white/[0.12]" />
              <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.2] flex items-center justify-center shadow-2xl">
                <Radar className="w-8 h-8 text-emerald-400 animate-spin" style={{ animationDuration: '2.5s' }} />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                PROCESAMIENTO DE DESPACHO
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-3 tracking-tight font-display">
                Localizando especialista en {selectedZone}...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Asignando el profesional más cercano habilitado en {selectedCategory.name} con calificación verificada mayor a 4.8.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-400 max-w-xs mx-auto font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Geolocalización en radio de 5 km</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verificación de matrícula al día</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generación de PIN de custodia</span>
              </div>
            </div>

            <button
              onClick={() => setStage('DISPATCHED_TRACKING')}
              className="text-[11px] text-slate-500 hover:text-slate-300 underline pt-1 font-mono"
            >
              Omitir espera e ir directo
            </button>
          </motion.div>
        )}

        {/* 3. STAGE: DISPATCHED TRACKING (DUAL APP & EMAIL PREVIEW) */}
        {stage === 'DISPATCHED_TRACKING' && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* View Switcher Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between obsidian-card p-4 rounded-3xl gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    Especialista Asignado: {activeSpecialist.nombre} en viaje
                  </h3>
                  <p className="text-xs text-slate-400">
                    Inspeccioná la vista de la app móvil o conmutá al correo corporativo recibido.
                  </p>
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="flex items-center glass-pill-container p-1 rounded-2xl">
                <button
                  onClick={() => setTrackingView('APP')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    trackingView === 'APP'
                      ? 'bg-white text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Terminal App</span>
                </button>

                <button
                  onClick={() => setTrackingView('EMAIL')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    trackingView === 'EMAIL'
                      ? 'bg-white text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Oficial Recibido</span>
                </button>
              </div>
            </div>

            {/* Sub-view 1: Native Mobile Tracker View */}
            {trackingView === 'APP' && (
              <div className="rounded-3xl obsidian-card p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-black/40 border border-white/[0.08]">
                  <img
                    src={activeSpecialist.foto}
                    alt={activeSpecialist.nombre}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/[0.15] shadow-lg"
                  />
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">{activeSpecialist.nombre}</h3>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Habilitado
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{activeSpecialist.titulo}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 font-mono text-[11px]">
                      <span>DNI: <strong className="text-slate-200">{activeSpecialist.dniEnmascarado}</strong></span>
                      <span>•</span>
                      <span>Vehículo: <strong className="text-slate-200">{activeSpecialist.vehiculo} ({activeSpecialist.patente})</strong></span>
                    </div>
                  </div>

                  {/* Arrival ETA Badge */}
                  <div className="bg-white/[0.03] border border-white/[0.09] p-4 rounded-2xl text-center shrink-0">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">TIEMPO ESTIMADO</div>
                    <div className="text-3xl font-bold text-white font-mono tracking-tight my-0.5">
                      {activeSpecialist.tiempoLlegadaMinutos} min
                    </div>
                    <div className="text-[11px] text-slate-400">En ruta hacia {currentOrder.zona}</div>
                  </div>
                </div>

                {/* Key Metrics and Safety Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-slate-400 text-[11px] mb-1 font-mono">DURACIÓN TRABAJO</div>
                    <div className="text-base font-semibold text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" /> ~{activeSpecialist.tiempoEstimadoTrabajoMinutos} minutos
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-slate-400 text-[11px] mb-1 font-mono">PRESUPUESTO ESTIMADO</div>
                    <div className="text-base font-semibold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" /> {formatARS(currentOrder.precioEstimado)}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="text-amber-300 font-mono text-[11px] font-semibold mb-1">PIN DE PUERTA</div>
                    <div className="text-base font-bold text-white font-mono tracking-widest">
                      {currentOrder.pinSeguridad}
                    </div>
                  </div>
                </div>

                {/* Action button to proceed to Arrival */}
                <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                  <button
                    onClick={() => setStage('IN_PROGRESS')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
                  >
                    <span>Simular Arribo del Profesional al Domicilio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
                    className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-sm active:scale-[0.98] transition-all"
                  >
                    <span>Continuar Simulación (Profesional en Puerta)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl obsidian-card p-6 sm:p-10 shadow-2xl space-y-8"
          >
            {/* Header with live timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1.5 mb-2 font-semibold">
                  <Clock className="w-3 h-3 animate-spin" /> SERVICIO EN EJECUCIÓN
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                  {activeSpecialist.nombre} está realizando la reparación
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentOrder.categoriaNombre} • {currentOrder.problemaSeleccionado} en {currentOrder.zona}
                </p>
              </div>

              {/* Stopwatch Box */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.08] text-right">
                <div className="text-[10px] font-mono uppercase text-slate-400">CRONÓMETRO ACTIVO</div>
                <div className="font-mono text-3xl font-bold text-white my-0.5 tracking-tight">
                  {Math.floor(elapsedSeconds / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(elapsedSeconds % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Estimación: ~{activeSpecialist.tiempoEstimadoTrabajoMinutos} min</div>
              </div>
            </div>

            {/* Checklist of steps in the house */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                BITÁCORA EN TIEMPO REAL
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Validación en puerta mediante PIN recitado', done: true },
                  { title: 'Diagnóstico preliminar e inspección de seguridad', done: true },
                  { title: 'Reparación técnica con repuestos certificados', done: elapsedSeconds >= 2 },
                  { title: 'Prueba de carga, verificación funcional y limpieza', done: elapsedSeconds >= 4 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      item.done
                        ? 'bg-white/[0.03] border-white/[0.1] text-white'
                        : 'bg-black/20 border-white/[0.05] text-slate-500'
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
                    <span className="text-[10px] font-mono uppercase font-semibold">
                      {item.done ? 'Completado' : 'En proceso'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button to finish work and pay */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Abonás únicamente luego de verificar personalmente el correcto funcionamiento.
              </div>
              <button
                onClick={() => setStage('PAYMENT_GATEWAY')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
              >
                <span>Trabajo Verificado • Pasar a Liquidación</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* 5. STAGE: PAYMENT_GATEWAY */}
        {stage === 'PAYMENT_GATEWAY' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
