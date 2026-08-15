/**
 * Pune Metro Fare System (MahaMetro)
 *
 * Distance-based fare slabs. Same slabs across both Purple and Aqua lines.
 * Minimum fare: ₹10 | Maximum fare: ₹40
 *
 * Maha Metro Smart Card:
 *   - Weekday discount: 10%
 *   - Weekend discount: 30%
 *   - NCMC compatible (National Common Mobility Card)
 *
 * Sources: MahaMetro official, trainhelp.in (Aug 2026)
 */

export interface FareSlab {
  minStations: number;
  maxStations: number;
  fare: number;
}

export const FARE_SLABS: FareSlab[] = [
  { minStations: 1,  maxStations: 2,        fare: 10 },
  { minStations: 3,  maxStations: 5,        fare: 20 },
  { minStations: 6,  maxStations: 9,        fare: 30 },
  { minStations: 10, maxStations: 13,       fare: 35 },
  { minStations: 14, maxStations: Infinity, fare: 40 },
];

export const MAHA_METRO_CARD = {
  name: "Maha Metro Card",
  weekdayDiscountPercent:  10,
  weekendDiscountPercent:  30,
  depositRupees: 100,
  ncmcCompatible: true,
};

export const calculateBaseFare = (stationCount: number): number => {
  const n = Math.max(1, stationCount);
  const slab = FARE_SLABS.find((s) => n >= s.minStations && n <= s.maxStations);
  return slab?.fare ?? FARE_SLABS[FARE_SLABS.length - 1].fare;
};

/** Returns discount percent (0–1) based on day of week */
export const getSmartCardDiscount = (date: Date): number => {
  const day = date.getDay(); // 0=Sun, 6=Sat
  return day === 0 || day === 6 ? 0.30 : 0.10;
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
