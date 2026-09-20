import { Proveedor } from '../types/database.types';

const EARTH_RADIUS_KM = 6371;

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
}

export function providerDistanceKm(
  provider: Proveedor,
  lat: number,
  lng: number
): number | null {
  const lat2 = provider.latitud ?? provider.zona?.latitud;
  const lng2 = provider.longitud ?? provider.zona?.longitud;
  if (lat2 == null || lng2 == null || lat == null || lng == null) return null;
  return calculateDistanceKm(lat, lng, lat2, lng2);
}