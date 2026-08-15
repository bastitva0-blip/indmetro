import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

// Patna Metro — 20-min headway → crowd builds between trains
// Bhootnath, Zero Mile, New ISBT (operational). Rush at commute hours.
const CROWD: Record<string, number[]> = {
  bhootnath:              [3,3,3,3,3,5,12,55,70,55,45,40,50,48,42,45,55,65,58,40,25,12,6,3],
  zero_mile:             [3,3,3,3,3,5,15,60,75,60,50,45,55,52,46,50,60,70,62,45,28,14,7,3],
  patliputra_bus_terminal:[3,3,3,3,3,6,18,65,80,65,55,50,60,56,50,55,65,75,68,50,32,16,8,3],
};
const DEFAULT = [3,3,3,3,3,5,12,55,70,55,45,40,50,48,42,45,55,65,58,40,25,12,6,3];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 75 ? "high" : "very-high";
  const labels = {
    low: "Quiet — plenty of seats",
    moderate: "Moderate — some seats",
    high: "Busy — standing room",
    "very-high": "Very crowded",
  };
  return { level, percentage: pct, label: labels[level] };
};
