/**
 * Nagpur Metro (MahaMetro) — Fare System
 * Distance-based. ₹5–₹40.
 * Maha Metro Card: 10% discount.
 */
import { stations, LINE_STATIONS } from "./metroData";

export interface FareZone { zone: string; minKm: number; maxKm: number; fare: number; }

export const FARE_ZONES: FareZone[] = [
  { zone: "F1", minKm: 0,  maxKm: 2,  fare: 5  },
  { zone: "F2", minKm: 2,  maxKm: 4,  fare: 10 },
  { zone: "F3", minKm: 4,  maxKm: 7,  fare: 15 },
  { zone: "F4", minKm: 7,  maxKm: 10, fare: 20 },
  { zone: "F5", minKm: 10, maxKm: 14, fare: 25 },
  { zone: "F6", minKm: 14, maxKm: 18, fare: 30 },
  { zone: "F7", minKm: 18, maxKm: Infinity, fare: 40 },
];

export const SMART_CARD = { name: "Maha Metro Card", discountPercent: 10, depositRupees: 50 };

const haversine = ([la1,lo1]: [number,number], [la2,lo2]: [number,number]): number => {
  const R = 6371, dLat = (la2-la1)*Math.PI/180, dLon = (lo2-lo1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

export const getDistanceKm = (fromId: string, toId: string, line: "orange"|"aqua"): number => {
  const arr = LINE_STATIONS[line];
  const fi = arr.indexOf(fromId), ti = arr.indexOf(toId);
  if (fi === -1 || ti === -1) return 0;
  const [a, b] = fi < ti ? [fi, ti] : [ti, fi];
  let d = 0;
  for (let i = a; i < b; i++) d += haversine(stations[arr[i]].coordinates, stations[arr[i+1]].coordinates);
  return Math.round(d * 10) / 10;
};

export const getFare = (distKm: number): number =>
  (FARE_ZONES.find(z => distKm >= z.minKm && distKm < z.maxKm) ?? FARE_ZONES[FARE_ZONES.length-1]).fare;

export const calculateFare = (distKm: number, hasCard = false): number => {
  const base = getFare(Math.max(0.01, distKm));
  return hasCard ? Math.round(base * 0.9) : base;
};
