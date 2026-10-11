import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle, Star, ShieldCheck, Tag, ExternalLink, Navigation, Timer } from 'lucide-react';
import { Proveedor } from '../types/database.types';

interface ProviderCardProps {
  provider: Proveedor;
  onContactClick?: (provider: Proveedor) => void;
  onRatingClick?: (provider: Proveedor) => void;
  onOpenChat?: (provider: Proveedor) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onContactClick,
  onRatingClick,
  onOpenChat,
}) => {
  const rawPhone = provider.telefono.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(`Hola, te encontré en Fixi`);
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodedMsg}`;

  const imageUrl = provider.foto_url || `https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80`;

  const locationLabel = provider.zona
    ? `${provider.zona.nombre}${provider.zona.provincia ? `, ${provider.zona.provincia.nombre}` : ''}`
    : 'Rosario y alrededores';

  const handleWhatsAppClick = () => {
    if (onContactClick) {
      onContactClick(provider);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="gradient-border rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-emerald-950/60 hover:-translate-y-1"
    >
      <div>
        {/* Header Photo */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={imageUrl}
            alt={provider.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {provider.destacado && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black shadow-md uppercase tracking-wider">
                <Star className="w-3 h-3 fill-slate-950 stroke-none" /> Destacado
              </span>
            )}
            {provider.verificado && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                <ShieldCheck className="w-3 h-3" /> Verificado por Fixi
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">

          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {provider.categoria && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                  <Tag className="w-3 h-3 text-emerald-400" />
                  {provider.categoria.nombre}
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-200 border border-slate-700">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {locationLabel}
              </span>

              {provider.distancia_km != null && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/20">
                  <Navigation className="w-3 h-3 text-emerald-400" />
                  {provider.distancia_km < 1
                    ? 'A menos de 1 km'
                    : `A ${provider.distancia_km} km`}
                </span>
              )}
            </div>

            {onRatingClick && (
              <button
                onClick={() => onRatingClick(provider)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                title="Calificar trabajo"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Calificar</span>
              </button>
            )}
          </div>

          {/* Rating + response time strip */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {provider.rating_promedio != null ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {provider.rating_promedio.toFixed(1)}
                <span className="text-[11px] font-medium text-slate-400">
                  ({provider.cantidad_resenas} reseñas)
                </span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Sin reseñas aún</span>
            )}
            {provider.tiempo_respuesta && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <Timer className="w-3 h-3" />
                {provider.tiempo_respuesta}
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors mb-2 line-clamp-1">
            {provider.nombre}
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 font-normal">
            {provider.descripcion || 'Servicio profesional directo en tu zona.'}
          </p>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-5 pt-0 mt-auto space-y-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all btn-whatsapp-glow"
        >
          <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
          <span>Contactar por WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
        </a>

        {onOpenChat && (
          <button
            onClick={() => onOpenChat(provider)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Mensaje Interno en Fixi</span>
          </button>
        )}
      </div>
    </motion.article>
  );
};
