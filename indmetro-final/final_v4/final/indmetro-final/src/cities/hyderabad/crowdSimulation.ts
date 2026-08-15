import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low"|"moderate"|"high"|"very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

const CROWD: Record<string, number[]> = {
  ameerpet:          [3,3,3,3,4,8,42,78,75,52,38,32,42,38,32,38,52,78,75,52,32,16,8,4],
  mg_bus_station:    [3,3,3,3,4,8,40,76,72,50,36,30,40,36,30,36,50,76,72,50,30,15,7,4],
  parade_ground:     [3,3,3,3,4,7,38,72,68,48,34,28,38,34,28,34,48,72,68,48,28,14,7,3],
  miyapur:           [3,3,3,3,3,6,30,62,58,40,26,22,28,26,22,26,40,62,58,38,22,10,5,3],
  lb_nagar:          [3,3,3,3,3,6,28,60,56,38,24,20,26,24,20,24,38,60,56,36,20,10,5,3],
  nagole:            [3,3,3,3,3,5,25,55,52,35,22,18,24,22,18,22,35,55,52,34,18,8,4,3],
  raidurg:           [3,3,3,3,3,5,28,58,55,36,24,20,26,24,20,24,36,58,55,35,20,9,5,3],
  nampally:          [3,3,3,3,4,7,36,70,68,46,32,28,36,32,28,32,46,70,68,46,28,14,7,3],
  secunderabad_east: [3,3,3,3,4,7,38,72,68,48,34,28,36,34,28,34,48,72,68,48,28,14,7,4],
  jbs_parade_ground: [3,3,3,3,3,6,30,62,58,40,26,22,28,26,22,26,40,62,58,38,22,10,5,3],
};
const DEFAULT = [3,3,3,3,3,5,20,50,48,32,20,16,22,20,16,20,32,50,48,30,18,8,4,3];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 70 ? "high" : "very-high";
  const labels = { low:"Quiet — plenty of seats", moderate:"Moderate — some seats", high:"Busy — standing room", "very-high":"Very crowded" };
  return { level, percentage:pct, label:labels[level] };
};
