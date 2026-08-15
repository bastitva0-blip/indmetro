/**
 * Delhi Metro Fare System (DMRC)
 *
 * Revised Aug 25, 2025 (first revision in 8 years).
 * Distance-based, 6 slabs. Same slabs across all lines EXCEPT Airport Express.
 *
 * Main Network:
 *   0–2 km   → ₹11
 *   2–5 km   → ₹22
 *   5–12 km  → ₹33
 *   12–21 km → ₹43
 *   21–32 km → ₹54
 *   32+ km   → ₹64
 *
 * Airport Express (Orange Line, SEPARATE ticketing — DMRC card NOT valid):
 *   New Delhi → Shivaji Stadium → Dhaula Kuan → IGI T3 → Aerocity → Dwarka Sec 21
 *   Fares: ₹11–₹75 by station pair
 *
 * Smart Card (DMC Smart Card):
 *   - 10% discount on every journey (main network)
 *   - Additional 10% off-peak = 20% total during:
 *     before 8:00 AM | 12:00 PM–5:00 PM | after 9:00 PM (Mon–Sat)
 *     All day Sunday = 10% only (not extra off-peak)
 *
 * Sundays / National Holidays: ₹11–₹54 (max ₹54 instead of ₹64)
 *
 * Source: DMRC official statement Aug 25, 2025 (Aug 2026)
 */

import { DelhiLine } from "./metroData";

export interface FareSlab {
  minStations: number;
  maxStations: number;
  fare: number;
}

// Station-count approximation of the km-based slabs
// (Delhi Metro ~1 km/station average; cross-line journeys average longer)
export const FARE_SLABS: FareSlab[] = [
  { minStations: 1,  maxStations: 2,        fare: 11 },
  { minStations: 3,  maxStations: 5,        fare: 22 },
  { minStations: 6,  maxStations: 12,       fare: 33 },
  { minStations: 13, maxStations: 21,       fare: 43 },
  { minStations: 22, maxStations: 32,       fare: 54 },
  { minStations: 33, maxStations: Infinity, fare: 64 },
];

// Airport Express fixed fares (New Delhi = 0)
export const AIRPORT_EXPRESS_FARES: Record<string, number> = {
  "new_delhi:shivaji_stadium": 11,
  "new_delhi:dhaula_kuan":     22,
  "new_delhi:igi_t3":          60,
  "new_delhi:aerocity":        60,
  "new_delhi:dwarka_sec_21":   75,
  "shivaji_stadium:dhaula_kuan": 11,
  "shivaji_stadium:igi_t3":    55,
  "shivaji_stadium:aerocity":  55,
  "shivaji_stadium:dwarka_sec_21": 70,
  "dhaula_kuan:igi_t3":        45,
  "dhaula_kuan:aerocity":      45,
  "dhaula_kuan:dwarka_sec_21": 60,
  "igi_t3:aerocity":           11,
  "igi_t3:dwarka_sec_21":      22,
  "aerocity:dwarka_sec_21":    11,
};

export const DMC_SMART_CARD = {
  name: "Delhi Metro Smart Card",
  baseDiscountPercent: 10,
  offPeakDiscountPercent: 10, // additional, = 20% total
  cardCostRs: 150,
  depositRs: 50, // refundable
  minimumRechargeRs: 200,
};

const isOffPeak = (date: Date): boolean => {
  const h = date.getHours();
  const day = date.getDay();
  if (day === 0) return false; // Sunday: only base 10%
  if (day === 6) return false; // Saturday: only base 10%
  return h < 8 || (h >= 12 && h < 17) || h >= 21;
};

const isSundayOrHoliday = (date: Date): boolean => date.getDay() === 0;

export const getSmartCardDiscount = (date = new Date()): number =>
  isOffPeak(date) ? 0.20 : 0.10;

export const calculateBaseFare = (stationCount: number, line?: DelhiLine): number => {
  // Airport Express uses separate fare — caller handles via AIRPORT_EXPRESS_FARES
  if (line === "orange") return 60; // default if not using pair lookup
  const slab = FARE_SLABS.find(
    (s) => stationCount >= s.minStations && stationCount <= s.maxStations
  );
  let base = slab?.fare ?? 64;
  return base;
};

export const calculateFare = (
  stationCount: number,
  hasSmartCard = false,
  date = new Date(),
  line?: DelhiLine
): number => {
  const base = calculateBaseFare(stationCount, line);
  if (!hasSmartCard) return base;
  const discount = getSmartCardDiscount(date);
  return Math.round(base * (1 - discount));
};

export const getAirportExpressFare = (fromId: string, toId: string): number => {
  const key = `${fromId}:${toId}`;
  const revKey = `${toId}:${fromId}`;
  return AIRPORT_EXPRESS_FARES[key] ?? AIRPORT_EXPRESS_FARES[revKey] ?? 60;
};
