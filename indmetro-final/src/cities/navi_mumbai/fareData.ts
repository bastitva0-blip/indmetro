/**
 * Navi Mumbai Metro — Fare System (CIDCO)
 * Station-count based (not distance-based).
 * ₹10 / ₹20 / ₹30 across 3 slabs.
 * CIDCO Metro Card (NCMC compatible): 10% discount.
 */
export interface FareSlab { minStations: number; maxStations: number; fare: number; }

export const FARE_SLABS: FareSlab[] = [
  { minStations: 1, maxStations: 3,  fare: 10 },
  { minStations: 4, maxStations: 7,  fare: 20 },
  { minStations: 8, maxStations: 11, fare: 30 },
];

export const SMART_CARD = {
  name: "CIDCO Metro Card",
  alias: "NCMC Compatible",
  discountPercent: 10,
  depositRupees: 50,
};

export const calculateBaseFare = (stops: number): number =>
  FARE_SLABS.find(s => stops >= s.minStations && stops <= s.maxStations)?.fare ?? 30;

export const calculateFare = (stops: number, hasCard = false): number => {
  const base = calculateBaseFare(Math.max(1, stops));
  return hasCard ? Math.round(base * 0.9) : base;
};
