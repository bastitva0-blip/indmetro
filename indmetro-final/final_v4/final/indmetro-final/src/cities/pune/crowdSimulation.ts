/**
 * Pune Metro — Crowd Simulation
 *
 * Heavy IT/office commuter load on Aqua Line (Ruby Hall → Nagar Road).
 * Purple Line: strong north Pune commuter traffic (PCMC industrial area → city).
 * Swargate and Shivajinagar: highest ridership (city centre + ISBT).
 * Pune Railway Station: heavy all-day through-traffic.
 * Deccan/Nal Stop: student + shopper peak at midday.
 */

import { getISTDate } from "@/lib/utils";

export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

const CROWD_MATRIX: Record<string, number[]> = {
  //                     0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23
  pcmc_bhavan:        [  5,  5,  5,  5,  5,  8, 15, 55, 75, 48, 38, 35, 40, 36, 35, 38, 50, 72, 68, 48, 30, 16,  8,  5],
  sant_tukaram_nagar: [  5,  5,  5,  5,  5,  8, 14, 50, 68, 45, 36, 32, 38, 34, 32, 35, 46, 65, 60, 44, 28, 14,  7,  5],
  bhosari:            [  5,  5,  5,  5,  5,  8, 14, 48, 65, 44, 35, 30, 36, 32, 30, 33, 44, 62, 58, 42, 26, 13,  7,  5],
  kasarwadi:          [  5,  5,  5,  5,  5,  8, 13, 45, 62, 42, 33, 28, 34, 30, 28, 31, 42, 60, 55, 40, 25, 12,  6,  5],
  phugewadi:          [  5,  5,  5,  5,  5,  8, 13, 42, 60, 40, 32, 28, 33, 29, 28, 30, 40, 58, 52, 38, 24, 12,  6,  5],
  dapodi:             [  5,  5,  5,  5,  5,  8, 14, 44, 62, 42, 34, 30, 35, 31, 30, 32, 42, 60, 55, 40, 26, 13,  6,  5],
  bopodi:             [  5,  5,  5,  5,  5,  8, 14, 44, 62, 42, 34, 30, 35, 31, 30, 32, 42, 60, 55, 40, 26, 13,  6,  5],
  khadki:             [  5,  5,  5,  5,  5,  8, 14, 44, 62, 42, 34, 30, 35, 31, 30, 32, 42, 60, 55, 40, 26, 13,  6,  5],
  range_hills:        [  5,  5,  5,  5,  5,  8, 14, 44, 62, 42, 34, 30, 35, 31, 30, 32, 42, 60, 55, 40, 26, 13,  6,  5],
  shivajinagar:       [  5,  5,  5,  5,  5, 10, 18, 52, 72, 60, 55, 58, 62, 58, 55, 56, 58, 72, 68, 54, 38, 22, 12,  5],
  civil_court:        [  5,  5,  5,  5,  5, 10, 16, 48, 65, 55, 50, 52, 58, 52, 50, 52, 54, 68, 62, 48, 34, 18, 10,  5],
  budhwar_peth:       [  5,  5,  5,  5,  5,  8, 15, 45, 62, 52, 55, 60, 65, 62, 58, 58, 55, 66, 60, 46, 32, 18,  9,  5],
  mandai:             [  5,  5,  5,  5,  5,  8, 15, 44, 60, 52, 58, 65, 70, 68, 64, 62, 58, 65, 60, 48, 34, 20, 10,  5],
  swargate:           [  5,  5,  5,  5,  5, 10, 18, 50, 68, 62, 60, 65, 70, 68, 65, 64, 62, 75, 70, 56, 40, 24, 12,  5],
  vanaz:              [  5,  5,  5,  5,  5,  8, 14, 40, 58, 42, 36, 34, 40, 36, 35, 38, 48, 62, 58, 44, 28, 14,  7,  5],
  anand_nagar:        [  5,  5,  5,  5,  5,  8, 14, 42, 60, 44, 38, 36, 42, 38, 36, 40, 50, 64, 60, 46, 30, 15,  7,  5],
  ideal_colony:       [  5,  5,  5,  5,  5,  8, 14, 42, 60, 44, 38, 36, 42, 38, 36, 40, 50, 64, 60, 46, 30, 15,  7,  5],
  nal_stop:           [  5,  5,  5,  5,  5,  8, 15, 44, 62, 50, 52, 58, 65, 60, 55, 55, 54, 66, 62, 50, 35, 18,  9,  5],
  garware_college:    [  5,  5,  5,  5,  5,  8, 14, 40, 58, 48, 50, 58, 65, 62, 58, 56, 52, 62, 58, 46, 32, 16,  8,  5],
  deccan_gymkhana:    [  5,  5,  5,  5,  5,  8, 15, 45, 62, 55, 60, 68, 72, 68, 64, 62, 58, 68, 64, 52, 38, 20, 10,  5],
  chhatrapati_sambhaji_chowk: [5,5,5,5,5,8,14,42,60,50,52,58,65,62,58,56,54,65,60,48,34,18,9,5],
  pmc:                [  5,  5,  5,  5,  5,  8, 15, 45, 65, 55, 52, 55, 62, 58, 55, 55, 56, 68, 65, 52, 36, 20, 10,  5],
  mangalwar_peth:     [  5,  5,  5,  5,  5,  8, 14, 44, 62, 52, 50, 52, 60, 56, 52, 52, 54, 65, 62, 48, 34, 18,  9,  5],
  pune_railway_station:[5,  5,  5,  5,  5, 12, 20, 55, 72, 65, 60, 60, 64, 60, 60, 62, 65, 76, 72, 58, 42, 25, 14,  5],
  ruby_hall_clinic:   [  5,  5,  5,  5,  5, 10, 18, 48, 65, 58, 55, 55, 60, 55, 55, 56, 58, 68, 65, 50, 36, 20, 10,  5],
  bund_garden:        [  5,  5,  5,  5,  5,  8, 15, 44, 62, 52, 50, 52, 60, 55, 52, 52, 54, 65, 60, 48, 34, 18,  9,  5],
  yerawada:           [  5,  5,  5,  5,  5,  8, 14, 42, 60, 48, 44, 46, 54, 50, 46, 46, 50, 62, 58, 44, 30, 16,  8,  5],
  nagar_road:         [  5,  5,  5,  5,  5,  8, 15, 45, 65, 55, 50, 48, 55, 52, 50, 52, 58, 72, 70, 55, 38, 20, 10,  5],
  bopkhel:            [  5,  5,  5,  5,  5,  8, 14, 42, 62, 50, 44, 42, 48, 44, 42, 44, 52, 65, 62, 48, 32, 16,  8,  5],
  ramwadi:            [  5,  5,  5,  5,  5,  8, 14, 40, 58, 46, 40, 38, 44, 40, 38, 40, 50, 62, 58, 44, 28, 14,  7,  5],
};

const DEFAULT: number[] = [5,5,5,5,5,8,14,44,62,50,46,44,52,48,44,46,52,65,60,46,30,16,8,5];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const hour = getISTDate().getHours();
  const pct  = (CROWD_MATRIX[stationId] ?? DEFAULT)[hour] ?? 20;
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 75 ? "high" : "very-high";
  const labels: Record<CrowdLevel, string> = {
    low: "Quiet — plenty of seats",
    moderate: "Moderate — some seats available",
    high: "Busy — standing room",
    "very-high": "Very crowded — peak rush",
  };
  return { level, percentage: pct, label: labels[level] };
};
