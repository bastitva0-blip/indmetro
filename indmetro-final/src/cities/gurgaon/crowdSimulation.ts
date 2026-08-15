import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

// Gurgaon — heavy corporate crowd, Mon–Fri peak very heavy, wkend light
const CROWD: Record<string, number[]> = {
  sikanderpur:      [5,5,5,5,5,10,25,75,90,60,45,40,50,45,40,48,65,85,80,55,35,20,10,5],
  cyber_city:       [5,5,5,5,5,10,20,70,85,65,50,45,55,50,45,52,65,82,78,52,32,18, 8,5],
  dlf_phase_2:      [5,5,5,5,5, 8,18,65,80,60,48,42,52,48,42,50,62,78,75,50,30,15, 7,5],
  dlf_phase_3:      [5,5,5,5,5, 8,18,62,78,58,46,40,50,46,40,48,60,76,72,48,28,14, 6,5],
  moulsari_avenue:  [5,5,5,5,5, 8,16,60,75,55,44,38,48,44,38,46,58,74,70,46,26,13, 6,5],
  sector_55_56:     [5,5,5,5,5, 8,15,45,65,50,38,35,42,38,35,40,50,65,62,44,26,12, 5,5],
};
const DEFAULT = [5,5,5,5,5,8,18,55,70,52,42,38,48,42,38,46,58,72,68,48,28,14,6,5];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 75 ? "high" : "very-high";
  const labels = { low: "Quiet", moderate: "Moderate — some seats", high: "Busy — standing room", "very-high": "Very crowded" };
  return { level, percentage: pct, label: labels[level] };
};
