/**
 * Gurgaon Rapid Metro Fare
 * Flat fare system — no station-count slabs.
 * ₹20 within Phase 1 OR within Phase 2
 * ₹35 if journey crosses Phase 1 ↔ Phase 2 boundary (via Sikanderpur)
 * Smart card: Rapid Metro Card / Delhi Metro Smart Card accepted
 * No percentage discount — tap-in/out flat fare.
 *
 * Phase 1: Sikanderpur → DLF Phase 3 (indices 5–10)
 * Phase 2: Sector 55-56 → Sikanderpur (indices 0–5)
 * Boundary station: Sikanderpur (index 5)
 */

export interface FareSlab { minStations: number; maxStations: number; fare: number; }

// Kept for CityConfig compatibility — not used by calculateFare
export const FARE_SLABS: FareSlab[] = [
  { minStations: 1, maxStations: 5, fare: 20 },
  { minStations: 6, maxStations: 10, fare: 35 },
];

export const SMART_CARD = {
  name: "Rapid Metro Card",
  discountPercent: 0, // flat fare, no % discount
  depositRupees: 50,
};

const PHASE_1_IDS = new Set([
  "sikanderpur", "dlf_phase_2", "belvedere_towers",
  "cyber_city", "moulsari_avenue", "dlf_phase_3",
]);
const PHASE_2_IDS = new Set([
  "sector_55_56", "sector_54_chowk", "sector_53_54",
  "sector_42_43", "dlf_phase_1", "sikanderpur",
]);

export const calculateFare = (originId: string, destinationId: string): number => {
  const originPhase1 = PHASE_1_IDS.has(originId);
  const destPhase1 = PHASE_1_IDS.has(destinationId);
  const originPhase2 = PHASE_2_IDS.has(originId);
  const destPhase2 = PHASE_2_IDS.has(destinationId);

  // Cross-phase journey
  if ((originPhase1 && destPhase2 && destinationId !== "sikanderpur") ||
      (originPhase2 && destPhase1 && originId !== "sikanderpur")) {
    return 35;
  }
  return 20;
};

// Alias for compatibility with components expecting (n, hasCard)
export const calculateFareByStations = (_n: number, _hasCard = false): number => 20;
