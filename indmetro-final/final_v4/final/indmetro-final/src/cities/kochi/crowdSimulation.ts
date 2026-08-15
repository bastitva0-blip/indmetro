import { getISTDate } from "@/lib/utils";

export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

// Kochi Metro: 100,000+ daily riders. Heavy peaks at commuter stations.
// Ernakulam South, MG Road, Aluva, Edapally, Palarivattom are busiest.
const CROWD: Record<string, number[]> = {
  aluva:          [3,3,3,3,3,5,30,70,65,45,30,28,30,28,25,30,40,65,60,35,20,10,5,3],
  ernakulam_south:[3,3,3,3,3,5,35,75,80,55,40,35,42,38,35,40,55,80,75,50,30,15,7,3],
  mg_road:        [3,3,3,3,3,5,30,70,75,55,40,38,45,42,38,42,55,75,70,48,28,12,6,3],
  jln_stadium:    [3,3,3,3,3,5,20,60,65,45,35,32,38,35,32,35,50,65,60,42,25,10,5,3],
  edapally:       [3,3,3,3,3,5,25,65,70,50,35,30,35,32,28,35,45,68,62,40,22,10,5,3],
  palarivattom:   [3,3,3,3,3,5,20,60,65,45,30,28,30,28,25,30,40,62,58,38,20,10,5,3],
  vyttila:        [3,3,3,3,3,4,15,55,60,40,28,25,30,28,25,28,38,58,52,35,18,8,4,3],
  kalamassery:    [3,3,3,3,3,4,25,60,62,40,28,25,28,25,22,28,38,58,55,35,18,8,4,3],
  maharajas_college:[3,3,3,3,3,4,15,55,58,40,28,25,32,30,28,30,42,58,52,35,18,8,4,3],
  thrippunithura_terminal:[3,3,3,3,3,4,10,45,50,35,22,20,25,22,20,22,30,48,45,28,15,7,4,3],
};
const DEFAULT = [3,3,3,3,3,4,15,55,60,40,28,25,28,25,22,28,38,55,50,32,18,8,4,3];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 70 ? "high" : "very-high";
  const labels = {
    low: "Quiet — plenty of seats",
    moderate: "Moderate — some seats",
    high: "Busy — standing room",
    "very-high": "Very crowded — wait for next train",
  };
  return { level, percentage: pct, label: labels[level] };
};
