import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

// Navi Mumbai Metro serves CIDCO sectors — CBD Belapur busiest (railway interchange).
// Kharghar stations busy for college + residential; Taloja/Pendhar lighter.
const CROWD: Record<string, number[]> = {
  cbd_belapur:          [3,3,3,3,3,8,40,72,65,45,30,28,35,32,28,35,50,70,65,42,25,12,6,3],
  central_park_kharghar:[3,3,3,3,3,5,25,55,50,35,22,20,28,25,22,28,38,55,50,32,18,8,4,3],
  kharghar_village:     [3,3,3,3,3,5,22,50,45,32,20,18,25,22,20,25,35,50,45,28,15,7,4,3],
  utsav_chowk:          [3,3,3,3,3,5,18,45,40,28,18,16,22,20,18,22,30,45,40,25,13,6,3,3],
  pethali_taloja:       [3,3,3,3,3,4,12,38,35,22,14,12,16,14,12,16,22,38,35,20,10,5,3,3],
  pendhar:              [3,3,3,3,3,4,10,32,28,18,12,10,14,12,10,14,18,32,28,16,8,4,3,3],
};
const DEFAULT = [3,3,3,3,3,5,18,45,40,28,18,16,22,20,18,22,30,45,40,25,13,6,3,3];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 45 ? "moderate" : pct < 65 ? "high" : "very-high";
  const labels = { low: "Quiet — plenty of seats", moderate: "Moderate — some seats", high: "Busy — limited seats", "very-high": "Very crowded" };
  return { level, percentage: pct, label: labels[level] };
};
