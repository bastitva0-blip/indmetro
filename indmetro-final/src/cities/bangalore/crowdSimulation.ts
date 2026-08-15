/**
 * Bangalore Metro — Crowd Simulation
 *
 * Key patterns:
 *  - MG Road, Majestic, Cubbon Park: heavy all-day (tourists + commuters)
 *  - ITPL, Whitefield, Electronic City: extreme morning + evening IT peak
 *  - Baiyappanahalli: heavy (rly interchange)
 *  - Yeshwanthpur: heavy (rly interchange)
 *  - Yellow Line: mostly IT commuter — extreme 8-10am, 6-9pm
 *  - Green Line north (Peenya, Nagasandra): moderate industrial commuter
 */

import { getISTDate } from "@/lib/utils";

export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

const H: number[] = [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]; // placeholder

const CROWD_MATRIX: Record<string, number[]> = {
  //                              0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23
  whitefield:                 [  5,  5,  5,  5,  5,  8, 15, 65, 85, 70, 55, 45, 48, 44, 48, 52, 62, 88, 82, 65, 42, 22, 12,  5],
  itpl:                       [  5,  5,  5,  5,  5,  8, 15, 65, 88, 72, 58, 48, 50, 46, 50, 54, 65, 90, 85, 68, 44, 22, 12,  5],
  baiyappanahalli:            [  5,  5,  5,  5,  5, 10, 18, 55, 72, 60, 52, 48, 52, 48, 50, 52, 58, 70, 68, 55, 38, 20, 10,  5],
  indiranagar:                [  5,  5,  5,  5,  5,  8, 15, 52, 70, 58, 55, 58, 65, 62, 60, 60, 62, 72, 70, 58, 42, 25, 14,  5],
  mg_road:                    [  5,  5,  5,  5,  5, 10, 18, 50, 68, 65, 72, 78, 82, 78, 75, 72, 68, 72, 70, 60, 45, 28, 15,  5],
  cubbon_park:                [  5,  5,  5,  5,  5,  8, 15, 48, 65, 62, 68, 72, 78, 74, 70, 68, 62, 68, 65, 56, 40, 24, 12,  5],
  majestic:                   [  5,  5,  5,  5,  5, 12, 22, 58, 78, 70, 68, 72, 78, 74, 72, 72, 70, 80, 78, 65, 50, 30, 18,  5],
  city_railway_station:       [  5,  5,  5,  5,  5, 12, 20, 55, 72, 65, 62, 65, 70, 66, 65, 65, 65, 75, 72, 60, 45, 28, 15,  5],
  mysore_road:                [  5,  5,  5,  5,  5,  8, 15, 50, 68, 55, 48, 44, 48, 44, 45, 48, 55, 68, 65, 50, 35, 18,  9,  5],
  kengeri:                    [  5,  5,  5,  5,  5,  8, 14, 45, 62, 50, 42, 38, 42, 38, 38, 42, 50, 65, 62, 48, 30, 15,  7,  5],
  challaghatta:               [  5,  5,  5,  5,  5,  8, 13, 40, 55, 44, 36, 32, 36, 32, 32, 36, 44, 58, 55, 40, 25, 12,  6,  5],
  madavara:                   [  5,  5,  5,  5,  5,  8, 13, 40, 58, 46, 38, 34, 38, 34, 34, 38, 46, 60, 56, 42, 26, 13,  6,  5],
  nagasandra:                 [  5,  5,  5,  5,  5,  8, 14, 45, 62, 50, 44, 40, 44, 40, 40, 44, 52, 65, 62, 48, 30, 15,  7,  5],
  peenya:                     [  5,  5,  5,  5,  5,  8, 14, 48, 68, 55, 48, 44, 48, 44, 44, 48, 55, 70, 68, 52, 34, 16,  8,  5],
  yeshwanthpur:               [  5,  5,  5,  5,  5, 10, 18, 52, 70, 60, 55, 52, 55, 52, 52, 55, 60, 72, 70, 55, 38, 20, 10,  5],
  rajajinagar:                [  5,  5,  5,  5,  5,  8, 15, 48, 65, 55, 50, 48, 52, 48, 48, 50, 56, 68, 65, 50, 34, 17,  8,  5],
  lalbagh:                    [  5,  5,  5,  5,  5,  8, 14, 44, 60, 55, 60, 68, 72, 68, 65, 62, 58, 65, 60, 50, 36, 20, 10,  5],
  jayanagar:                  [  5,  5,  5,  5,  5,  8, 14, 44, 62, 55, 52, 56, 62, 58, 55, 55, 56, 68, 65, 52, 36, 20, 10,  5],
  rv_road:                    [  5,  5,  5,  5,  5,  8, 14, 50, 70, 60, 55, 52, 56, 52, 52, 55, 60, 75, 72, 58, 40, 22, 11,  5],
  electronic_city:            [  5,  5,  5,  5,  5,  8, 16, 70, 92, 78, 62, 52, 54, 50, 55, 60, 72, 95, 90, 72, 46, 24, 12,  5],
  central_silk_board:         [  5,  5,  5,  5,  5,  8, 15, 65, 88, 72, 58, 48, 50, 46, 50, 55, 68, 90, 88, 70, 46, 22, 11,  5],
  jayadeva_hospital:          [  5,  5,  5,  5,  5, 10, 18, 55, 72, 65, 62, 60, 65, 60, 60, 62, 65, 75, 72, 58, 42, 22, 11,  5],
  btm_layout:                 [  5,  5,  5,  5,  5,  8, 14, 58, 78, 65, 55, 50, 54, 50, 52, 55, 62, 80, 78, 62, 42, 20, 10,  5],
  bommasandra:                [  5,  5,  5,  5,  5,  8, 14, 62, 85, 70, 55, 45, 46, 42, 46, 50, 65, 88, 85, 68, 42, 20, 10,  5],
};

const DEFAULT: number[] = [5,5,5,5,5,8,14,48,65,55,50,48,52,48,48,50,56,68,65,50,34,17,8,5];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const hour = getISTDate().getHours();
  const pct  = (CROWD_MATRIX[stationId] ?? DEFAULT)[hour] ?? 20;
  const level: CrowdLevel = pct < 25 ? "low" : pct < 55 ? "moderate" : pct < 78 ? "high" : "very-high";
  const labels: Record<CrowdLevel, string> = {
    low:       "Quiet — plenty of seats",
    moderate:  "Moderate — some seats available",
    high:      "Busy — standing room",
    "very-high": "Very crowded — peak rush",
  };
  return { level, percentage: pct, label: labels[level] };
};
