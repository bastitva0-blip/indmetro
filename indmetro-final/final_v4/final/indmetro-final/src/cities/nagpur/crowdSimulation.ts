import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low"|"moderate"|"high"|"very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

const CROWD: Record<string, number[]> = {
  sitabuldi:       [3,3,3,3,3,8,38,72,68,48,32,28,38,35,30,35,50,70,65,44,26,12,6,3],
  rly_station_ngp: [3,3,3,3,3,7,32,65,62,42,28,24,32,30,26,32,44,65,60,40,22,10,5,3],
  automotive_square:[3,3,3,3,3,5,22,52,48,32,20,16,22,20,16,22,32,52,48,28,15,7,4,3],
  khapri:          [3,3,3,3,3,4,15,38,35,22,14,12,16,14,12,16,22,38,35,20,10,5,3,3],
  airport_nagpur:  [3,3,3,3,3,5,25,55,52,35,22,18,25,22,18,25,35,55,52,32,18,8,4,3],
  laxmi_nagar:     [3,3,3,3,3,5,20,50,48,30,18,15,20,18,15,20,30,50,46,28,15,7,4,3],
  hingna_mount_view:[3,3,3,3,3,4,12,35,32,20,12,10,14,12,10,14,20,35,32,18,9,4,3,3],
};
const DEFAULT = [3,3,3,3,3,5,18,45,42,28,16,13,18,16,13,18,28,45,42,25,13,6,3,3];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 45 ? "moderate" : pct < 65 ? "high" : "very-high";
  const labels = { low:"Quiet — plenty of seats", moderate:"Moderate — some seats", high:"Busy — standing room", "very-high":"Very crowded" };
  return { level, percentage: pct, label: labels[level] };
};
