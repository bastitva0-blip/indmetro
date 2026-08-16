/**
 * Mumbai Metro — Fare Systems
 *
 * Line 1 (Blue): Station-count based — ₹10/20/30/40
 * Lines 2A/7/9: Distance-based — ₹10–₹50 (same MMRDA slab)
 * Line 3 (Aqua): Distance-based — ₹10–₹60 (MMRC slab, slightly higher)
 *
 * Unified smart card: Mumbai Metro NCMC Card | 10% discount
 */
import { stations, LINE_STATIONS } from "./metroData";

export const SMART_CARD = { name: "Mumbai Metro NCMC Card", discountPercent: 10, depositRupees: 50 };

// Line 1 — station count based
export const LINE1_SLABS = [
  { min: 1, max: 4,  fare: 10 },
  { min: 5, max: 8,  fare: 20 },
  { min: 9, max: 12, fare: 30 },
];

// Lines 2A / 7 / 9 — distance based (MMRDA)
export const MMRDA_ZONES = [
  { minKm: 0,  maxKm: 3,  fare: 10 },
  { minKm: 3,  maxKm: 12, fare: 20 },
  { minKm: 12, maxKm: 18, fare: 30 },
  { minKm: 18, maxKm: 24, fare: 40 },
  { minKm: 24, maxKm: Infinity, fare: 50 },
];

// Line 3 (Aqua) — distance based (MMRC)
export const AQUA_ZONES = [
  { minKm: 0,  maxKm: 3,  fare: 10 },
  { minKm: 3,  maxKm: 6,  fare: 20 },
  { minKm: 6,  maxKm: 10, fare: 30 },
  { minKm: 10, maxKm: 18, fare: 40 },
  { minKm: 18, maxKm: 25, fare: 50 },
  { minKm: 25, maxKm: Infinity, fare: 60 },
];

const haversine = ([la1,lo1]: [number,number], [la2,lo2]: [number,number]): number => {
  const R = 6371, dLat = (la2-la1)*Math.PI/180, dLon = (lo2-lo1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

export const getDistanceKm = (fromId: string, toId: string, line: "line1"|"line2a"|"line3"|"line7"|"line9"): number => {
  const arr = LINE_STATIONS[line];
  const fi = arr.indexOf(fromId), ti = arr.indexOf(toId);
  if (fi === -1 || ti === -1) return 0;
  const [a, b] = fi < ti ? [fi, ti] : [ti, fi];
  let d = 0;
  for (let i = a; i < b; i++) {
    const sa = stations[arr[i]], sb = stations[arr[i+1]];
    if (sa && sb) d += haversine(sa.coordinates, sb.coordinates);
  }
  return Math.round(d * 10) / 10;
};

export const calculateFare = (
  fromId: string, toId: string,
  line: "line1"|"line2a"|"line3"|"line7"|"line9",
  stops: number, hasCard = false
): number => {
  let base = 10;
  if (line === "line1") {
    base = LINE1_SLABS.find(s => stops >= s.min && stops <= s.max)?.fare ?? 40;
  } else {
    const dist = getDistanceKm(fromId, toId, line);
    const zones = line === "line3" ? AQUA_ZONES : MMRDA_ZONES;
    base = zones.find(z => dist >= z.minKm && dist < z.maxKm)?.fare ?? zones[zones.length-1].fare;
  }
  return hasCard ? Math.round(base * 0.9) : base;
};

/** Alias for CityApp compatibility — uses MMRDA (Line 2A/7/9) distance slabs as reference */
export const FARE_SLABS = MMRDA_ZONES.map(z => ({ minKm: z.minKm, maxKm: z.maxKm, fare: z.fare }));
