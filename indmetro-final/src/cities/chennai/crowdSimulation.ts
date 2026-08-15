import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

const CROWD: Record<string, number[]> = {
  central:           [5,5,5,5,5,12,28,72,88,65,52,46,58,52,46,52,65,85,82,62,40,22,10,5],
  chennai_central:   [5,5,5,5,5,12,28,72,88,65,52,46,58,52,46,52,65,85,82,62,40,22,10,5],
  chennai_airport:   [5,5,5,5,8,18,35,62,75,68,62,58,65,62,58,62,68,75,72,62,52,40,22,8],
  koyambedu:         [5,5,5,5,5,10,22,65,80,60,50,44,55,50,44,50,60,78,75,58,38,20, 9,5],
  alandur:           [5,5,5,5,5,10,22,65,80,60,50,44,55,50,44,50,60,78,75,58,38,20, 9,5],
  alandur_green:     [5,5,5,5,5,10,22,65,80,60,50,44,55,50,44,50,60,78,75,58,38,20, 9,5],
  guindy:            [5,5,5,5,5,10,20,60,75,58,48,42,52,48,42,48,58,74,70,54,35,18, 8,5],
  washermanpet:      [5,5,5,5,5, 8,18,55,68,52,44,40,50,44,40,44,55,68,65,48,30,15, 7,5],
  vadapalani:        [5,5,5,5,5, 8,18,55,70,52,44,40,50,44,40,44,55,70,66,50,32,16, 7,5],
};
const DEFAULT = [5,5,5,5,5,8,18,55,70,52,44,40,50,44,40,44,55,70,66,50,32,16,7,5];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 75 ? "high" : "very-high";
  const labels = { low: "Quiet", moderate: "Moderate — some seats", high: "Busy — standing room", "very-high": "Very crowded" };
  return { level, percentage: pct, label: labels[level] };
};
