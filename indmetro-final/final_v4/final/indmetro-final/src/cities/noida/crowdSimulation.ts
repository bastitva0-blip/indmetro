import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low"|"moderate"|"high"|"very-high";
export interface CrowdEstimate { level:CrowdLevel; percentage:number; label:string; }
const CROWD: Record<string,number[]> = {
  sector_51:   [5,5,5,5,5,10,22,68,82,60,48,42,52,46,42,48,62,80,76,54,35,18,8,5],
  pari_chowk:  [5,5,5,5,5, 8,18,55,70,52,44,40,48,44,40,46,56,70,66,48,30,15,7,5],
  nsez:        [5,5,5,5,5, 8,16,60,78,58,48,44,52,48,44,50,60,76,72,52,32,16,7,5],
  sector_137:  [5,5,5,5,5, 8,15,50,65,50,42,38,46,42,38,44,54,68,64,46,28,13,6,5],
  knowledge_park_2:[5,5,5,5,5,7,14,45,60,46,38,35,42,38,35,40,50,62,58,42,25,12,5,5],
};
const DEFAULT=[5,5,5,5,5,8,16,55,70,52,44,40,48,44,40,46,56,70,66,48,30,14,7,5];
export const getCrowdEstimate = (stationId:string): CrowdEstimate => {
  const h=getISTDate().getHours(), pct=(CROWD[stationId]??DEFAULT)[h];
  const level:CrowdLevel=pct<25?"low":pct<50?"moderate":pct<75?"high":"very-high";
  const labels={low:"Quiet",moderate:"Moderate — some seats",high:"Busy — standing room","very-high":"Very crowded"};
  return {level,percentage:pct,label:labels[level]};
};
