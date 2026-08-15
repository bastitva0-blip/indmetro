/**
 * Chennai Metro Fare (CMRL)
 * Distance-based slab system. Fare chart from CMRL official (Feb 2019).
 * Min: ₹10 | Max: ₹50
 * CMRL Smart Card: stored value (no % discount — same fares as token)
 * Smart card gives convenience benefit: no queue at token machines.
 */
export interface FareSlab { minStations: number; maxStations: number; fare: number; }

export const FARE_SLABS: FareSlab[] = [
  { minStations: 1,  maxStations: 2,        fare: 10 },
  { minStations: 3,  maxStations: 6,        fare: 20 },
  { minStations: 7,  maxStations: 10,       fare: 30 },
  { minStations: 11, maxStations: 14,       fare: 40 },
  { minStations: 15, maxStations: Infinity, fare: 50 },
];

export const SMART_CARD = {
  name: "CMRL Smart Card",
  discountPercent: 0, // stored value, no % discount
  depositRupees: 50,
};

export const calculateBaseFare = (n: number): number => {
  const slab = FARE_SLABS.find(s => n >= s.minStations && n <= s.maxStations);
  return slab ? slab.fare : 50;
};

export const calculateFare = (n: number, _hasCard = false): number =>
  calculateBaseFare(Math.max(1, n));
