import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

const CROWD: Record<string, number[]> = {
  devi_ahilya_terminal:    [5,5,5,5,5,8,20,55,70,55,48,42,50,46,42,46,55,70,65,48,32,18,8,5],
  maharani_lakshmi_bai:    [5,5,5,5,5,8,18,50,65,52,44,40,48,44,40,44,52,65,62,46,30,16,7,5],
  rani_avanti_bai_lodhi:   [5,5,5,5,5,8,18,48,62,50,42,38,46,42,38,42,50,62,60,44,28,14,6,5],
  rani_durgavati:          [5,5,5,5,5,8,18,50,65,52,44,40,48,44,40,44,52,65,62,46,30,16,7,5],
  veerangana_jhalkari_bai: [5,5,5,5,5,8,20,52,68,54,46,42,50,46,42,46,54,68,64,48,32,18,8,5],
};
const DEFAULT = [5,5,5,5,5,8,18,50,65,50,42,38,46,42,38,42,50,65,60,44,28,14,7,5];
export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const h = getISTDate().getHours();
  const pct = (CROWD[stationId] ?? DEFAULT)[h];
  const level: CrowdLevel = pct < 25 ? "low" : pct < 50 ? "moderate" : pct < 75 ? "high" : "very-high";
  const labels = { low:"Quiet", moderate:"Moderate — some seats", high:"Busy — standing room", "very-high":"Very crowded" };
  return { level, percentage: pct, label: labels[level] };
};
