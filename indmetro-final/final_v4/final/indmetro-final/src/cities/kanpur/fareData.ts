/**
 * Kanpur Metro Fare System (UPMRC)
 *
 * Same slab structure as Lucknow Metro — UPMRC operates both.
 * Official slabs (single journey token):
 *   1 station   → ₹10
 *   2 stations  → ₹15
 *   3–6         → ₹20
 *   7–9         → ₹30
 *   10–13       → ₹40
 *   14–17       → ₹50
 *   18+         → ₹60
 */

export interface FareSlab {
  minStations: number;
  maxStations: number;
  fare: number;
}

export const FARE_SLABS: FareSlab[] = [
  { minStations: 1, maxStations: 1, fare: 10 },
  { minStations: 2, maxStations: 2, fare: 15 },
  { minStations: 3, maxStations: 6, fare: 20 },
  { minStations: 7, maxStations: 9, fare: 30 },
  { minStations: 10, maxStations: 13, fare: 40 },
  { minStations: 14, maxStations: 17, fare: 50 },
  { minStations: 18, maxStations: Infinity, fare: 60 },
];

export const GOSMART_CARD = {
  discountPercent: 10,
  depositRupees: 100,
};

export const calculateBaseFare = (stationCount: number): number => {
  const n = Math.max(1, stationCount);
  const slab = FARE_SLABS.find((s) => n >= s.minStations && n <= s.maxStations);
  return slab ? slab.fare : FARE_SLABS[FARE_SLABS.length - 1].fare;
};

export const applyGoSmartDiscount = (fare: number): number =>
  Math.round(fare * (1 - GOSMART_CARD.discountPercent / 100));

export const calculateFare = (stationCount: number, hasGoSmartCard = false): number => {
  const base = calculateBaseFare(stationCount);
  return hasGoSmartCard ? applyGoSmartDiscount(base) : base;
};
