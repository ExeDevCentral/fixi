import React from 'react';
import { Navigation, MapPin, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

interface GpsAlertBannerProps {
  onLocationDetected?: (lat: number, lng: number) => void;
}

export const GpsAlertBanner: React.FC<GpsAlertBannerProps> = ({ onLocationDetected }) => {
  const { latitude, longitude, loading, error, requestLocation } = useGeolocation();

  React.useEffect(() => {
    if (latitude && longitude && onLocationDetected) {
      onLocationDetected(latitude, longitude);
    }
  }, [latitude, longitude, onLocationDetected]);

  return (
    <div className="max-w-5xl mx-auto px-4 mb-6">
      <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
              Alertas por GPS & Trabajos Cercanos
              {latitude && (
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  GPS Activo
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300">
              {latitude
                ? `Ubicación detectada: Lat ${latitude.toFixed(2)}, Lng ${longitude?.toFixed(2)}. Mostrando profesionales a tu alrededor.`
                : 'Activá tu GPS para ordenar los profesionales más cercanos a tu posición actual.'}
            </p>
          </div>
        </div>

        <button
          onClick={requestLocation}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shrink-0 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Detectando GPS...</span>
            </>
          ) : latitude ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Actualizar GPS</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              <span>Activar GPS</span>
            </>
          )}
        </button>

      </div>

      {error && (
        <div className="mt-2 text-xs text-amber-400 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}. Podés seleccionar tu ciudad manualmente en los filtros.</span>
        </div>
      )}
    </div>
  );
};
