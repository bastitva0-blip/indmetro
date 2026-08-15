/**
 * Kanpur Metro — Crowd Simulation
 * Based on UPMRC Phase 1 ridership patterns (Kanpur less busy than Lucknow initially)
 */

import { getISTDate } from "@/lib/utils";

export type CrowdLevel = "low" | "moderate" | "high" | "very-high";

export interface CrowdEstimate {
  level: CrowdLevel;
  percentage: number;
  label: string;
}

const CROWD_MATRIX: Record<string, number[]> = {
  //                 0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23
  iit_kanpur:      [ 5,  5,  5,  5,  5,  8, 15, 45, 75, 55, 40, 35, 45, 40, 35, 40, 55, 80, 70, 50, 35, 20, 10,  5],
  kalyanpur:       [ 5,  5,  5,  5,  5,  8, 18, 40, 60, 50, 40, 35, 40, 38, 35, 38, 50, 65, 60, 45, 30, 18,  8,  5],
  spm_hospital:    [ 5,  5,  5,  5,  5, 10, 20, 45, 65, 55, 50, 50, 55, 50, 50, 50, 55, 65, 60, 45, 30, 18,  8,  5],
  vishwavidyalaya: [ 5,  5,  5,  5,  5, 10, 20, 50, 70, 60, 55, 45, 55, 45, 40, 45, 55, 70, 65, 50, 35, 20,  8,  5],
  gurudev_chauraha:[ 5,  5,  5,  5,  5,  8, 15, 40, 60, 50, 40, 38, 42, 38, 35, 38, 48, 62, 58, 42, 28, 15,  7,  5],
  geeta_nagar:     [ 5,  5,  5,  5,  5,  8, 15, 38, 55, 45, 38, 35, 40, 36, 32, 36, 45, 60, 55, 40, 25, 13,  6,  5],
  rawatpur:        [ 5,  5,  5,  5,  5, 10, 20, 45, 65, 55, 45, 40, 50, 42, 38, 40, 50, 70, 65, 48, 32, 18,  8,  5],
};

const DEFAULT_PATTERN: number[] = [5, 5, 5, 5, 5, 8, 15, 35, 55, 45, 38, 35, 42, 38, 35, 38, 48, 62, 58, 42, 28, 15, 7, 5];

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
