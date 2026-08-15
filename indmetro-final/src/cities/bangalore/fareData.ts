/**
 * Bangalore Metro Fare System (BMRCL / Namma Metro)
 *
 * Distance-based slabs. Unified across Purple, Green, and Yellow Lines.
 * Fare revised August 2025 (same structure, max extended to ₹90 for long cross-line journeys).
 * Minimum: ₹10 | Maximum: ₹90
 *
 * Namma Metro Card:
 *   - 5% discount during peak hours
 *   - 10% discount during off-peak + weekends
 *   - NCMC compatible
 *
 * Source: BMRCL, bengalurumetrolines.in (Aug 2026)
 */

export interface FareSlab {
  minKm: number;
  maxKm: number;
  fare: number;
}

export const FARE_SLABS: FareSlab[] = [
  { minKm: 0,   maxKm: 2,   fare: 10 },
  { minKm: 2,   maxKm: 4,   fare: 20 },
  { minKm: 4,   maxKm: 6,   fare: 25 },
  { minKm: 6,   maxKm: 10,  fare: 30 },
  { minKm: 10,  maxKm: 14,  fare: 40 },
  { minKm: 14,  maxKm: 18,  fare: 50 },
  { minKm: 18,  maxKm: 22,  fare: 60 },
  { minKm: 22,  maxKm: 28,  fare: 70 },
  { minKm: 28,  maxKm: 32,  fare: 80 },
  { minKm: 32,  maxKm: Infinity, fare: 90 },
];

// For compatibility with CityConfig type (station-count based)
export const FARE_SLABS_BY_STATION = [
  { minStations: 1,  maxStations: 2,        fare: 10 },
  { minStations: 3,  maxStations: 4,        fare: 20 },
  { minStations: 5,  maxStations: 6,        fare: 25 },
  { minStations: 7,  maxStations: 10,       fare: 30 },
  { minStations: 11, maxStations: 14,       fare: 40 },
  { minStations: 15, maxStations: 18,       fare: 50 },
  { minStations: 19, maxStations: 22,       fare: 60 },
  { minStations: 23, maxStations: 28,       fare: 70 },
  { minStations: 29, maxStations: 34,       fare: 80 },
  { minStations: 35, maxStations: Infinity, fare: 90 },
];

export const NAMMA_METRO_CARD = {
  name: "Namma Metro Card",
  peakDiscountPercent: 5,
  offPeakDiscountPercent: 10,
  depositRupees: 100,
  ncmcCompatible: true,
};

const isPeakHour = (date: Date): boolean => {
  const hour = date.getHours();
  const day  = date.getDay();
  return day >= 1 && day <= 5 && ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 21));
};

export const getSmartCardDiscount = (date = new Date()): number => {
  const day = date.getDay();
  if (day === 0 || day === 6) return 0.10; // weekend
  return isPeakHour(date) ? 0.05 : 0.10;
};

export const calculateBaseFare = (stationCount: number): number => {
  const slab = FARE_SLABS_BY_STATION.find(
    (s) => stationCount >= s.minStations && stationCount <= s.maxStations
  );
  return slab?.fare ?? 90;
};

export const calculateFare = (
  stationCount: number,
  hasSmartCard = false,
  date = new Date()
): number => {
  const base = calculateBaseFare(stationCount);
  if (!hasSmartCard) return base;
  const discount = getSmartCardDiscount(date);
  return Math.round(base * (1 - discount));
};
