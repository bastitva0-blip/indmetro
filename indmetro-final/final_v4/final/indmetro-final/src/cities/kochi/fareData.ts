/**
 * Kochi Metro Fare System (KMRL)
 * Distance-based fare zones F1–F6. Fixed by KMRL in Nov 2016.
 * Minimum: ₹10 (≤2 km), Maximum: ₹60 (>20 km)
 *
 * Smart Card: Kochi Metro Card (Kochi1 Card — Axis Bank). 10% discount.
 * WhatsApp ticketing (+91 90486 90486): 10% discount.
 * Non-peak hours via WhatsApp: up to 50% discount.
 * Ticket valid 90 minutes from issue.
 *
 * Sources: KMRL official, themetrorailguy.com, kochi.metroroute.co.in (Aug 2026)
 */
import { stations, LINE_STATIONS } from "./metroData";

export interface FareZone {
  zone: string;
  minKm: number;
  maxKm: number;
  fare: number;
}

export const FARE_ZONES: FareZone[] = [
  { zone: "F1", minKm: 0,  maxKm: 2,  fare: 10 },
  { zone: "F2", minKm: 2,  maxKm: 5,  fare: 20 },
  { zone: "F3", minKm: 5,  maxKm: 10, fare: 30 },
  { zone: "F4", minKm: 10, maxKm: 15, fare: 40 },
  { zone: "F5", minKm: 15, maxKm: 20, fare: 50 },
  { zone: "F6", minKm: 20, maxKm: Infinity, fare: 60 },
];

export const SMART_CARD = {
  name: "Kochi Metro Card",
  alias: "Kochi1 Card (Axis Bank)",
  discountPercent: 10,
  depositRupees: 50,
};

/** Get chainage-based distance between two stations (km). */
export const getDistanceKm = (fromId: string, toId: string): number => {
  const f = stations[fromId], t = stations[toId];
  if (!f || !t) return 0;
  return Math.abs(f.chainageKm - t.chainageKm);
};

export const getFareZone = (distKm: number): FareZone =>
  FARE_ZONES.find(z => distKm > z.minKm && distKm <= z.maxKm) ??
  FARE_ZONES.find(z => distKm <= z.maxKm) ??
  FARE_ZONES[FARE_ZONES.length - 1];

export const calculateBaseFare = (distKm: number): number =>
  getFareZone(Math.max(0.01, distKm)).fare;

export const calculateFare = (distKm: number, hasCard = false): number => {
  const base = calculateBaseFare(distKm);
  return hasCard ? Math.round(base * 0.9) : base;
};

/** Convenience: fare between two station IDs */
export const fareBetween = (fromId: string, toId: string, hasCard = false): number =>
  calculateFare(getDistanceKm(fromId, toId), hasCard);

/** Pre-computed fare matrix for the 25-station Blue Line (symmetric). */
export const buildFareMatrix = (): Record<string, Record<string, number>> => {
  const matrix: Record<string, Record<string, number>> = {};
  const ids = LINE_STATIONS.blue;
  for (const a of ids) {
    matrix[a] = {};
    for (const b of ids) matrix[a][b] = a === b ? 0 : calculateBaseFare(getDistanceKm(a, b));
  }
  return matrix;
};
