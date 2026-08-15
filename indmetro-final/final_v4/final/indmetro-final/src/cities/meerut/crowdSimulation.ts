import { getISTDate } from "@/lib/utils";
export type CrowdLevel="low"|"moderate"|"high"|"very-high";
export interface CrowdEstimate{level:CrowdLevel;percentage:number;label:string;}
const CROWD: Record<string,number[]> = {
  meerut_south:  [5,5,5,5,5,8,18,55,68,50,42,38,46,42,38,44,52,65,62,44,28,14,6,5],
  meerut_central:[5,5,5,5,5,8,20,60,72,52,44,40,50,46,40,48,56,70,66,48,30,16,7,5],
  begum_pul:     [5,5,5,5,5,8,18,52,65,48,40,36,46,40,36,42,52,65,60,44,28,13,6,5],
  modipuram:     [5,5,5,5,5,7,15,45,58,44,36,32,40,36,32,38,46,58,54,38,24,11,5,5],
};
const DEFAULT=[5,5,5,5,5,8,16,50,65,48,40,36,44,40,36,42,50,62,58,42,26,12,6,5];
export const getCrowdEstimate=(stationId:string):CrowdEstimate=>{
  const h=getISTDate().getHours(),pct=(CROWD[stationId]??DEFAULT)[h];
  const level:CrowdLevel=pct<25?"low":pct<50?"moderate":pct<75?"high":"very-high";
  const labels={low:"Quiet",moderate:"Moderate",high:"Busy — standing room","very-high":"Very crowded"};
  return{level,percentage:pct,label:labels[level]};
};
