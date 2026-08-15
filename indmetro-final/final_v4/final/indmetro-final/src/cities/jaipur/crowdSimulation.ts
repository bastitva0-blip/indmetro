/**
 * Jaipur Metro — Crowd Simulation
 *
 * Modelled on JMRC ridership patterns. Tourist-heavy stations
 * (Badi Chaupar / Chhoti Chaupar — Hawa Mahal, City Palace area)
 * see higher daytime crowds than commuter stations.
 * Daily ridership: ~55,000 (July 2024, Wikipedia).
 */

import { getISTDate } from "@/lib/utils";

export type CrowdLevel = "low" | "moderate" | "high" | "very-high";

export interface CrowdEstimate {
  level: CrowdLevel;
  percentage: number;
  label: string;
}

// Hourly crowd percentage per station (0–23h)
const CROWD_MATRIX: Record<string, number[]> = {
  //                        0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23
  mansarovar:            [  5,  5,  5,  5,  5,  8, 15, 50, 75, 55, 40, 35, 45, 40, 38, 42, 55, 80, 72, 52, 35, 18, 10,  5],
  new_aatish_market:     [  5,  5,  5,  5,  5,  8, 15, 42, 62, 48, 38, 32, 40, 36, 32, 36, 48, 65, 58, 42, 28, 15,  8,  5],
  vivek_vihar:           [  5,  5,  5,  5,  5,  8, 15, 40, 60, 46, 36, 30, 38, 34, 30, 34, 46, 62, 55, 40, 26, 14,  7,  5],
  shyam_nagar:           [  5,  5,  5,  5,  5,  8, 15, 40, 60, 46, 36, 30, 38, 34, 30, 34, 46, 62, 55, 40, 26, 14,  7,  5],
  ram_nagar:             [  5,  5,  5,  5,  5,  8, 15, 38, 58, 44, 34, 28, 36, 32, 28, 32, 44, 60, 52, 38, 25, 13,  6,  5],
  civil_lines:           [  5,  5,  5,  5,  5, 10, 18, 48, 70, 58, 52, 48, 55, 50, 48, 50, 58, 72, 65, 48, 32, 18,  8,  5],
  railway_station:       [  5,  5,  5,  5,  5, 12, 22, 55, 72, 62, 55, 52, 58, 54, 52, 55, 62, 75, 70, 55, 40, 22, 12,  5],
  sindhi_camp:           [  5,  5,  5,  5,  5, 12, 20, 50, 68, 58, 52, 48, 55, 50, 48, 50, 58, 70, 65, 50, 36, 20, 10,  5],
  chandpole:             [  5,  5,  5,  5,  5, 10, 18, 42, 60, 52, 50, 55, 62, 58, 55, 55, 52, 65, 60, 48, 35, 20, 10,  5],
  chhoti_chaupar:        [  5,  5,  5,  5,  5,  8, 15, 35, 55, 60, 65, 70, 72, 68, 65, 62, 58, 65, 62, 52, 40, 22, 12,  5],
  badi_chaupar:          [  5,  5,  5,  5,  5,  8, 15, 32, 52, 65, 72, 78, 80, 76, 72, 70, 65, 68, 65, 55, 42, 25, 12,  5],
};

const DEFAULT_PATTERN: number[] = [5, 5, 5, 5, 5, 8, 15, 40, 60, 50, 45, 42, 50, 46, 42, 44, 52, 65, 60, 45, 30, 16, 8, 5];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const now = getISTDate();
  const hour = now.getHours();
  const pattern = CROWD_MATRIX[stationId] ?? DEFAULT_PATTERN;
  const percentage = pattern[hour] ?? 20;

  let level: CrowdLevel;
  if (percentage < 25) level = "low";
  else if (percentage < 50) level = "moderate";
  else if (percentage < 75) level = "high";
  else level = "very-high";

  const labels: Record<CrowdLevel, string> = {
    low: "Quiet — plenty of seats",
    moderate: "Moderate — some seats available",
    high: "Busy — standing room",
    "very-high": "Very crowded — peak rush",
  };

  return { level, percentage, label: labels[level] };
};
