import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

// Agra is tourist-heavy — Taj Mahal/Agra Fort stations peak on weekends too
const CROWD: Record<string, number[]> = {
  taj_east_gate:     [5,5,5,5,5,8,20,55,75,65,60,55,65,60,55,60,65,70,65,50,35,20,10,5],
  taj_mahal:         [5,5,5,5,5,8,20,60,80,70,65,60,70,65,60,65,70,75,70,55,40,25,12,5],
  dr_ambedkar_chowk: [5,5,5,5,5,8,18,50,70,60,55,50,60,55,50,55,60,70,65,48,32,18,8,5],
  mankameshwar:      [5,5,5,5,5,8,15,45,65,55,48,45,52,48,45,48,55,65,60,44,30,16,7,5],
  fatehabad_road:    [5,5,5,5,5,8,15,40,60,50,45,40,48,44,40,44,50,60,55,40,27,14,6,5],
  basai:             [5,5,5,5,5,7,12,35,55,45,38,35,42,38,35,38,45,55,50,36,24,12,5,5],
};
const DEFAULT = [5,5,5,5,5,8,15,40,60,50,42,38,45,42,38,42,50,60,55,40,27,14,6,5];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 75 ? "high" : "very-high";
  const labels = { low: "Quiet — plenty of seats", moderate: "Moderate — some seats", high: "Busy — standing room", "very-high": "Very crowded" };
  return { level, percentage: pct, label: labels[level] };
};
