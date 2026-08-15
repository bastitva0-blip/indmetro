/**
 * Patna Metro Fare System (PMRC)
 * Fare range: ₹10 – ₹50
 * Operational corridor (3 stations) charges ₹10–₹20.
 * Smart card: PMRC Smart Card — 10% discount.
 */
export interface FareSlab { minStations: number; maxStations: number; fare: number; }

export const FARE_SLABS: FareSlab[] = [
  { minStations: 1, maxStations: 1, fare: 10 },
  { minStations: 2, maxStations: 3, fare: 15 },
  { minStations: 4, maxStations: 6, fare: 20 },
  { minStations: 7, maxStations: 9, fare: 30 },
  { minStations: 10, maxStations: 12, fare: 40 },
  { minStations: 13, maxStations: Infinity, fare: 50 },
];

export const SMART_CARD = { name: "PMRC Smart Card", discountPercent: 10, depositRupees: 50 };

export const calculateBaseFare = (n: number): number => {
  const slab = FARE_SLABS.find(s => n >= s.minStations && n <= s.maxStations);
  return slab ? slab.fare : FARE_SLABS[FARE_SLABS.length - 1].fare;
};
export const calculateFare = (n: number, hasCard = false): number => {
  const base = calculateBaseFare(Math.max(1, n));
  return hasCard ? Math.round(base * 0.9) : base;
};
