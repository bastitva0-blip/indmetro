import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

// Kalupur busiest (railway + both lines). APMC, Vastral, Gurukul busy.
// Sabarmati Rly busy due to railway interchange.
const CROWD: Record<string, number[]> = {
  kalupur:         [3,3,3,3,3,8,40,75,78,55,40,35,45,42,38,42,55,75,72,50,30,15,7,3],
  apmc:            [3,3,3,3,3,6,30,65,62,42,28,24,32,30,26,32,45,65,60,40,22,10,5,3],
  vastral_gam:     [3,3,3,3,3,6,28,60,58,40,26,22,30,28,24,30,42,60,56,38,20,9,4,3],
  sabarmati_rly:   [3,3,3,3,3,6,32,65,62,42,28,24,32,30,26,32,45,65,60,40,22,10,5,3],
  gurukul_road:    [3,3,3,3,3,5,22,55,52,35,22,18,25,22,18,25,35,55,50,32,18,8,4,3],
  gujarat_university:[3,3,3,3,3,5,20,52,50,33,20,16,22,20,16,22,32,52,48,30,16,7,4,3],
  motera:          [3,3,3,3,3,4,15,45,42,28,16,12,18,16,12,16,25,45,42,26,14,6,3,3],
  lal_darwaja:     [3,3,3,3,3,5,25,58,55,38,24,20,28,25,20,28,38,58,55,35,18,8,4,3],
  paldi:           [3,3,3,3,3,5,20,50,48,32,20,16,22,20,16,22,32,50,46,28,15,7,4,3],
};
const DEFAULT = [3,3,3,3,3,5,18,48,45,30,18,14,20,18,14,20,30,48,44,28,14,6,3,3];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 70 ? "high" : "very-high";
  const labels = { low: "Quiet — plenty of seats", moderate: "Moderate — some seats", high: "Busy — standing room", "very-high": "Very crowded" };
  return { level, percentage: pct, label: labels[level] };
};
