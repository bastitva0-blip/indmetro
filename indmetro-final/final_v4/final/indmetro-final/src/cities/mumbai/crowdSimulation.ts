import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low"|"moderate"|"high"|"very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

// Line 1: 460K daily. Andheri, Ghatkopar busiest.
// Line 3: 160K daily. BKC, Marol Naka, Dadar, CSMT busiest.
// Lines 2A/7: 260K combined. Dahisar East, Goregaon, Borivali busy.
const CROWD: Record<string, number[]> = {
  andheri_l1:    [3,3,3,3,4,8,45,80,78,55,38,32,40,38,34,38,52,80,78,55,35,18,9,4],
  ghatkopar:     [3,3,3,3,4,8,42,78,76,52,36,30,38,36,32,36,50,78,75,52,32,16,8,4],
  versova:        [3,3,3,3,3,5,28,60,58,38,24,20,26,24,20,26,38,60,58,38,22,10,5,3],
  marol_naka:    [3,3,3,3,4,7,38,72,70,50,34,28,36,34,30,34,48,72,70,50,30,15,7,4],
  bkc:           [3,3,3,3,4,6,35,70,72,58,45,40,48,45,40,45,58,72,70,52,32,16,8,4],
  dadar_l3:      [3,3,3,3,4,8,40,75,78,58,42,36,45,42,36,42,56,76,78,58,38,18,9,4],
  csmt_l3:       [3,3,3,3,4,7,38,72,70,52,38,32,42,38,32,38,52,72,70,52,34,16,8,4],
  churchgate_l3: [3,3,3,3,4,7,35,68,66,48,35,30,38,35,30,35,48,68,66,48,30,14,7,4],
  aarey_jvlr:    [3,3,3,3,3,4,18,45,42,28,18,14,20,18,14,18,28,45,42,28,16,8,4,3],
  cuffe_parade:  [3,3,3,3,3,4,22,50,48,32,20,16,22,20,16,20,30,50,48,32,18,9,5,3],
  dahisar_east:  [3,3,3,3,4,7,38,72,68,48,32,28,36,32,28,32,45,70,68,48,28,14,7,3],
  borivali_east: [3,3,3,3,4,8,42,76,72,50,34,28,38,34,28,34,48,75,72,50,30,15,7,4],
  goregaon_east_l7:[3,3,3,3,4,7,38,70,68,46,30,26,34,30,26,30,44,70,68,46,28,14,7,3],
  gundavali:     [3,3,3,3,4,7,36,68,65,44,30,26,32,30,26,30,42,68,65,44,26,12,6,3],
};
const DEFAULT = [3,3,3,3,3,5,22,52,50,34,22,18,24,22,18,22,32,52,50,34,20,10,5,3];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 70 ? "high" : "very-high";
  const labels = { low:"Quiet — plenty of seats", moderate:"Moderate — some seats", high:"Busy — standing room", "very-high":"Very crowded — wait for next" };
  return { level, percentage: pct, label: labels[level] };
};
