/**
 * Indore Metro Fare (MPMRCL)
 * Official fare structure NOT yet published as of Aug 2026.
 * MPMRCL ran priority corridor free/promotional Jun–Jul 2025.
 * Estimates based on comparable UPMRC/MPMRCL systems (₹10–40 range).
 * Update when MPMRCL officially publishes fares.
 */
export interface FareSlab { minStations: number; maxStations: number; fare: number; }

export const FARE_SLABS: FareSlab[] = [
  { minStations: 1,  maxStations: 2,        fare: 10 },
  { minStations: 3,  maxStations: 5,        fare: 15 },
  { minStations: 6,  maxStations: 10,       fare: 20 },
  { minStations: 11, maxStations: 15,       fare: 30 },
  { minStations: 16, maxStations: Infinity, fare: 40 },
];

export const SMART_CARD = {
  name: "MPMRCL Smart Card",
  discountPercent: 10,
  depositRupees: 50,
};

export const FARE_NOTE = "Fares are estimates — official MPMRCL structure not yet published.";

export const calculateBaseFare = (n: number): number => {
  const slab = FARE_SLABS.find(s => n >= s.minStations && n <= s.maxStations);
  return slab ? slab.fare : 40;
};

export const calculateFare = (n: number, hasCard = false): number => {
  const base = calculateBaseFare(Math.max(1, n));
  return hasCard ? Math.round(base * 0.9) : base;
};
