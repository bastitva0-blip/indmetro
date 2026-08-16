/**
 * Jaipur Metro Fare System (JMRC)
 *
 * Revised fare structure effective 30 January 2025.
 * Unlike UPMRC's slab system, JMRC uses a full 11×11 station-pair matrix.
 *
 * Off-peak fares (token, throughout the business day):
 *   MSOR NAMT VKVR SMNR RMNR CLJP MRSN SICP CDPE CTCP BICP
 *  [ 10,  10,  10,  15,  15,  15,  25,  25,  25,  30,  30 ]  ← from MSOR
 *  [ 10,  10,  10,  10,  15,  15,  15,  25,  25,  25,  30 ]  ← from NAMT
 *  ...etc (symmetric matrix)
 *
 * Smart Card (JMRC Smart Card SV-1):
 *   - fare < ₹10  → nil discount
 *   - fare ₹10–₹19 → 10% off
 *   - fare ≥ ₹20  → 15% off
 *
 * Tourist Cards:
 *   - 1-day: ₹100 + ₹50 deposit
 *   - 3-day: ₹200 + ₹50 deposit
 *
 * Source: JMRC official fare matrix (trainhelp.in / JMRC 2025)
 */

// Station index order matches LINE_STATIONS.pink
const STATION_ORDER = [
  "mansarovar",      // 0 MSOR
  "new_aatish_market", // 1 NAMT
  "vivek_vihar",     // 2 VKVR
  "shyam_nagar",     // 3 SMNR
  "ram_nagar",       // 4 RMNR
  "civil_lines",     // 5 CLJP
  "railway_station", // 6 MRSN
  "sindhi_camp",     // 7 SICP
  "chandpole",       // 8 CDPE
  "chhoti_chaupar",  // 9 CTCP
  "badi_chaupar",    // 10 BICP
] as const;

// Full 11×11 fare matrix (₹). Row = origin index, Col = destination index.
const FARE_MATRIX: number[][] = [
  //MSOR NAMT VKVR SMNR RMNR CLJP MRSN SICP CDPE CTCP BICP
  [ 10,  10,  10,  15,  15,  15,  25,  25,  25,  30,  30 ], // MSOR
  [ 10,  10,  10,  10,  15,  15,  15,  25,  25,  25,  30 ], // NAMT
  [ 10,  10,  10,  10,  10,  15,  15,  15,  25,  25,  25 ], // VKVR
  [ 15,  10,  10,  10,  10,  10,  15,  15,  15,  25,  25 ], // SMNR
  [ 15,  15,  10,  10,  10,  10,  10,  15,  15,  15,  25 ], // RMNR
  [ 15,  15,  15,  10,  10,  10,  10,  10,  15,  15,  15 ], // CLJP
  [ 25,  15,  15,  15,  10,  10,  10,  10,  10,  15,  15 ], // MRSN
  [ 25,  25,  15,  15,  15,  10,  10,  10,  10,  10,  15 ], // SICP
  [ 25,  25,  25,  15,  15,  15,  10,  10,  10,  10,  10 ], // CDPE
  [ 30,  25,  25,  25,  15,  15,  15,  10,  10,  10,  10 ], // CTCP
  [ 30,  30,  25,  25,  25,  15,  15,  15,  10,  10,  10 ], // BICP
];

// Build O(1) lookup map: "fromId:toId" → fare
const FARE_MAP = new Map<string, number>();
STATION_ORDER.forEach((from, fi) => {
  STATION_ORDER.forEach((to, ti) => {
    FARE_MAP.set(`${from}:${to}`, FARE_MATRIX[fi][ti]);
  });
});

export const JMRC_SMART_CARD = {
  name: "JMRC Smart Card",
  depositRupees: 100, // ₹50 security + ₹50 initial add-value
  website: "www.jaipurmetrosmartcard.in",
};

export const TOURIST_CARDS = {
  oneDayRupees: 100,
  threeDayRupees: 200,
  depositRupees: 50,
};

export const calculateBaseFare = (fromId: string, toId: string): number => {
  if (fromId === toId) return 0;
  return FARE_MAP.get(`${fromId}:${toId}`) ?? 30; // fallback to max
};

/** Tiered JMRC smart card discount */
export const applySmartCardDiscount = (fare: number): number => {
  if (fare < 10) return fare;          // nil discount
  if (fare < 20) return Math.round(fare * 0.90); // 10% off
  return Math.round(fare * 0.85);      // 15% off
};

export const calculateFare = (
  fromId: string,
  toId: string,
  hasSmartCard = false
): number => {
  const base = calculateBaseFare(fromId, toId);
  return hasSmartCard ? applySmartCardDiscount(base) : base;
};

/** Convenience: get fare by station-hop count (for display / route planner) */
export const calculateFareByStops = (stopCount: number, hasSmartCard = false): number => {
  let base: number;
  if (stopCount <= 2) base = 10;
  else if (stopCount <= 5) base = 15;
  else if (stopCount <= 8) base = 25;
  else base = 30;
  return hasSmartCard ? applySmartCardDiscount(base) : base;
};

/** Approximate FARE_SLABS for CityApp compatibility (derived from JMRC fare matrix by stop distance) */
export const FARE_SLABS = [
  { minKm: 0,  maxKm: 3,  fare: 10 },
  { minKm: 3,  maxKm: 6,  fare: 15 },
  { minKm: 6,  maxKm: 10, fare: 25 },
  { minKm: 10, maxKm: Infinity, fare: 30 },
];
