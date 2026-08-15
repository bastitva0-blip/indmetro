import { getISTDate } from "@/lib/utils";
export type CrowdLevel="low"|"moderate"|"high"|"very-high";
export interface CrowdEstimate{level:CrowdLevel;percentage:number;label:string;}

const CROWD:Record<string,number[]>={
  esplanade:      [3,3,3,3,4,7,40,75,72,50,35,30,40,38,32,38,52,75,72,50,32,15,7,4],
  park_street:    [3,3,3,3,4,6,35,68,65,45,30,26,35,32,28,32,45,68,65,45,28,12,6,3],
  central_kol:    [3,3,3,3,4,6,35,70,68,46,32,28,36,34,30,34,46,70,68,46,30,13,6,3],
  dum_dum:        [3,3,3,3,4,7,38,72,68,48,34,28,36,34,30,34,48,72,68,48,30,14,7,4],
  dakshineswar:   [3,3,3,3,3,5,25,55,52,35,22,18,24,22,18,22,35,55,52,34,20,9,5,3],
  kavi_subhash:   [3,3,3,3,3,5,28,58,55,36,24,20,26,24,20,24,36,58,55,35,20,10,5,3],
  howrah_maidan:  [3,3,3,3,4,7,38,72,70,48,34,28,36,34,28,34,48,72,70,48,28,14,7,4],
  howrah:         [3,3,3,3,4,8,42,76,74,52,36,30,38,36,30,36,52,76,74,52,32,15,7,4],
  sealdah:        [3,3,3,3,4,7,40,74,72,50,35,30,38,36,30,36,50,74,72,50,30,14,7,4],
  joka:           [3,3,3,3,3,4,15,40,38,25,15,12,16,14,12,14,22,40,38,24,14,6,3,3],
};
const DEFAULT=[3,3,3,3,3,5,20,50,48,32,20,16,22,20,16,20,32,50,48,30,18,8,4,3];

export const getCrowdEstimate=(stationId:string):CrowdEstimate=>{
  const h=getISTDate().getHours();
  const pct=(CROWD[stationId]??DEFAULT)[h];
  const level:CrowdLevel=pct<25?"low":pct<50?"moderate":pct<70?"high":"very-high";
  const labels={low:"Quiet — plenty of seats",moderate:"Moderate — some seats",high:"Busy — standing room","very-high":"Very crowded"};
  return{level,percentage:pct,label:labels[level]};
};
