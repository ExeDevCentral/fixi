import { useState, useEffect } from 'react';
import { calculateDistanceKm } from '../lib/geo';

interface GeoLocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoLocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    permissionDenied: false,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocalización no soportada por el navegador',
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
          permissionDenied: false,
        });
      },
      (err) => {
        let msg = 'Error al obtener ubicación GPS';
        let denied = false;
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Permiso de ubicación denegado por el usuario';
          denied = true;
        }
        setState({
          latitude: null,
          longitude: null,
          error: msg,
          loading: false,
          permissionDenied: denied,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return { ...state, requestLocation, calculateDistanceKm };
}
