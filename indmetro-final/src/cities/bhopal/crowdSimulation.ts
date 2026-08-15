/**
 * Bhopal Metro — Crowd Simulation
 * Very new system (Dec 2025). Low base ridership, high at AIIMS and RKMP.
 * AIIMS sees heavy hospital traffic through the day.
 * Subhash Nagar is the depot terminus — lower crowds.
 */

import { getISTDate } from "@/lib/utils";

export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate {
  level: CrowdLevel;
  percentage: number;
  label: string;
}

const CROWD_MATRIX: Record<string, number[]> = {
  //                      0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23
  aiims:               [  5,  5,  5,  5,  5, 10, 18, 45, 65, 60, 58, 55, 50, 52, 55, 58, 55, 65, 60, 48, 35, 20, 10,  5],
  alkapuri:            [  5,  5,  5,  5,  5,  8, 15, 38, 55, 48, 42, 38, 40, 38, 40, 42, 48, 60, 55, 42, 28, 15,  7,  5],
  drm_office:          [  5,  5,  5,  5,  5,  8, 15, 42, 60, 52, 45, 42, 44, 42, 42, 44, 50, 62, 58, 44, 30, 16,  8,  5],
  rani_kamalapati:     [  5,  5,  5,  5,  5, 12, 20, 50, 68, 60, 55, 52, 55, 52, 52, 55, 58, 70, 65, 52, 38, 22, 12,  5],
  mp_nagar:            [  5,  5,  5,  5,  5,  8, 15, 42, 62, 55, 50, 48, 52, 48, 48, 50, 55, 65, 62, 48, 32, 18,  8,  5],
  board_office_chauraha:[5,  5,  5,  5,  5,  8, 15, 40, 58, 50, 45, 42, 46, 42, 42, 45, 50, 62, 58, 44, 30, 16,  7,  5],
  kendriya_vidyalaya:  [  5,  5,  5,  5,  5,  8, 15, 38, 55, 48, 42, 38, 42, 38, 38, 42, 48, 58, 55, 42, 28, 15,  7,  5],
  subhash_nagar:       [  5,  5,  5,  5,  5,  8, 15, 35, 50, 42, 38, 35, 38, 35, 35, 38, 44, 55, 50, 38, 25, 13,  6,  5],
};

const DEFAULT_PATTERN: number[] = [5, 5, 5, 5, 5, 8, 15, 38, 55, 48, 44, 42, 44, 42, 42, 44, 50, 62, 56, 42, 28, 15, 7, 5];

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
    "low":       "Quiet — plenty of seats",
    "moderate":  "Moderate — some seats available",
    "high":      "Busy — standing room",
    "very-high": "Very crowded — peak rush",
  };

  return { level, percentage, label: labels[level] };
};
