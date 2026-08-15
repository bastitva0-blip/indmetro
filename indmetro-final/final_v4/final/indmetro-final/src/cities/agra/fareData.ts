/**
 * Agra Metro Fare System (UPMRC)
 * Same slab structure as Lucknow/Kanpur — UPMRC operates all three.
 * Smart card: NCMC RuPay On-The-Go (not GoSmart — Agra uses national NCMC)
 * Discount: 10% (UPMRC standard)
 */
export interface FareSlab { minStations: number; maxStations: number; fare: number; }

export const FARE_SLABS: FareSlab[] = [
  { minStations: 1, maxStations: 1, fare: 10 },
  { minStations: 2, maxStations: 2, fare: 15 },
  { minStations: 3, maxStations: 6, fare: 20 },
  { minStations: 7, maxStations: 9, fare: 30 },
  { minStations: 10, maxStations: 13, fare: 40 },
  { minStations: 14, maxStations: 17, fare: 50 },
  { minStations: 18, maxStations: Infinity, fare: 60 },
];

export const SMART_CARD = { name: "NCMC Card", discountPercent: 10, depositRupees: 50 };

export const calculateBaseFare = (n: number): number => {
  const slab = FARE_SLABS.find(s => n >= s.minStations && n <= s.maxStations);
  return slab ? slab.fare : FARE_SLABS[FARE_SLABS.length - 1].fare;
};
export const calculateFare = (n: number, hasCard = false): number => {
  const base = calculateBaseFare(Math.max(1, n));
  return hasCard ? Math.round(base * 0.9) : base;
};
