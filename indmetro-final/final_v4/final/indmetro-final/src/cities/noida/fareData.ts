/**
 * Noida Metro (NMRC) Fare — Aqua Line
 * GoSmart Card (CITY1 Metro Card) — 10% discount
 * DMRC smart cards NOT accepted.
 */
export interface FareSlab { minStations: number; maxStations: number; fare: number; }
export const FARE_SLABS: FareSlab[] = [
  { minStations: 1,  maxStations: 3,  fare: 10 },
  { minStations: 4,  maxStations: 7,  fare: 20 },
  { minStations: 8,  maxStations: 12, fare: 30 },
  { minStations: 13, maxStations: 17, fare: 40 },
  { minStations: 18, maxStations: 21, fare: 50 },
];
export const SMART_CARD = { name: "GoSmart Card (CITY1)", discountPercent: 10, depositRupees: 50 };
export const calculateBaseFare = (n: number): number => {
  const slab = FARE_SLABS.find(s => n >= s.minStations && n <= s.maxStations);
  return slab ? slab.fare : 50;
};
export const calculateFare = (n: number, hasCard = false): number => {
  const base = calculateBaseFare(Math.max(1, n));
  return hasCard ? Math.round(base * 0.9) : base;
};
