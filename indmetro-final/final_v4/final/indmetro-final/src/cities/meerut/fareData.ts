/**
 * Meerut Metro Fare (NCRTC)
 * Distance-based, tap-in/tap-out via NCRTC Smart Card (Namo Bharat Connect App)
 * No flat % smart card discount — fare is distance-calculated at exit.
 */
export interface FareSlab { minStations: number; maxStations: number; fare: number; distanceKm?: number; }

// Station-count approximation for routing UI (actual is distance-based)
export const FARE_SLABS: FareSlab[] = [
  { minStations: 1,  maxStations: 2,  fare: 20 },
  { minStations: 3,  maxStations: 5,  fare: 30 },
  { minStations: 6,  maxStations: 8,  fare: 40 },
  { minStations: 9,  maxStations: 10, fare: 50 },
  { minStations: 11, maxStations: 12, fare: 60 },
];

export const SMART_CARD = {
  name: "NCRTC Smart Card (Namo Bharat)",
  discountPercent: 0, // distance-based tap-in/tap-out
  depositRupees: 100,
};
export const FARE_NOTE = "Fare is distance-based (tap-in/tap-out). Shown fare is an estimate.";

export const calculateBaseFare = (n: number): number => {
  const slab = FARE_SLABS.find(s => n >= s.minStations && n <= s.maxStations);
  return slab ? slab.fare : 60;
};
export const calculateFare = (n: number, _hasCard = false): number => calculateBaseFare(Math.max(1, n));
