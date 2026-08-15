/**
 * Bhopal Metro Fare System (MPMRCL / Bhoj Metro)
 *
 * Effective from January 2026 (post free-week inauguration Dec 21–27, 2025).
 * Slab-based on station count. Minimum fare ₹20 (higher than UPMRC).
 *
 * Slabs:
 *   1–3  stations → ₹20
 *   4–6  stations → ₹30
 *   7–10 stations → ₹40
 *   11–13 stations → ₹50
 *   14–17 stations → ₹60
 *   18+  stations → ₹80
 *
 * Smart Card: 10% discount (MPMRCL AFC system, DMRC-supported).
 * QR ticketing also available.
 *
 * Sources: yometro.com, bhopal.metroroute.co.in (Aug 2026)
 */

export interface FareSlab {
  minStations: number;
  maxStations: number;
  fare: number;
}

export const FARE_SLABS: FareSlab[] = [
  { minStations: 1,  maxStations: 3,        fare: 20 },
  { minStations: 4,  maxStations: 6,        fare: 30 },
  { minStations: 7,  maxStations: 10,       fare: 40 },
  { minStations: 11, maxStations: 13,       fare: 50 },
  { minStations: 14, maxStations: 17,       fare: 60 },
  { minStations: 18, maxStations: Infinity, fare: 80 },
];

export const MPMRCL_SMART_CARD = {
  name: "Bhoj Metro Smart Card",
  discountPercent: 10,
  depositRupees: 100,
};

export const calculateBaseFare = (stationCount: number): number => {
  const n = Math.max(1, stationCount);
  const slab = FARE_SLABS.find((s) => n >= s.minStations && n <= s.maxStations);
  return slab ? slab.fare : FARE_SLABS[FARE_SLABS.length - 1].fare;
};

export const applySmartCardDiscount = (fare: number): number =>
  Math.round(fare * (1 - MPMRCL_SMART_CARD.discountPercent / 100));

export const calculateFare = (
  stationCount: number,
  hasSmartCard = false
): number => {
  const base = calculateBaseFare(stationCount);
  return hasSmartCard ? applySmartCardDiscount(base) : base;
};
