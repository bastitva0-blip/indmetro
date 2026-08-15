import { LINE_STATIONS } from "./metroData";
import { CUMULATIVE, getHeadway, FIRST_TRAIN, LAST_TRAIN } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface TrainSchedule {
  id:string; line:string; direction:"forward"|"backward"; startTime:string; stations:string[]; stationTimes:number[];
}

const toMin=(t:string)=>{const[h,m]=t.split(":").map(Number);return h*60+m;};
const fmtMin=(m:number)=>`${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(Math.round(m%60)).padStart(2,"0")}`;

let _cache:TrainSchedule[]|null=null;
export const getAllSchedules=():TrainSchedule[]=>{
  if(_cache) return _cache;
  const now=getISTDate(),schedules:TrainSchedule[]=[];
  for(const line of["blue","green","orange","purple"] as const){
    const stArr=LINE_STATIONS[line],cum=CUMULATIVE[line],total=cum[cum.length-1]??0;
    for(const dir of["forward","backward"] as const){
      const stIds=dir==="forward"?stArr:[...stArr].reverse();
      const times=dir==="forward"?cum:[...cum].reverse().map(m=>total-m);
      let time=toMin(FIRST_TRAIN[line]),seq=0;
      const mock=new Date(now);
      while(time<=toMin(LAST_TRAIN[line])){
        mock.setHours(Math.floor(time/60),time%60);
        schedules.push({id:`${line[0].toUpperCase()}L-${dir==="forward"?"F":"B"}-${seq}`,line,direction:dir,startTime:fmtMin(time),stations:stIds,stationTimes:times});
        time+=getHeadway(line,mock);seq++;
      }
    }
  }
  return(_cache=schedules);
};

export const getNextTrainsAtStation=(stationId:string,line:string,direction:"forward"|"backward",count=3)=>{
  const now=getISTDate(),curr=now.getHours()*60+now.getMinutes();
  const results:{schedule:TrainSchedule;arrivalTime:string;minutesAway:number}[]=[];
  for(const s of getAllSchedules().filter(s=>s.line===line&&s.direction===direction)){
    const idx=s.stations.indexOf(stationId);if(idx===-1) continue;
    const arr=toMin(s.startTime)+s.stationTimes[idx],away=arr-curr;
    if(away>=-1&&away<=90) results.push({schedule:s,arrivalTime:fmtMin(arr),minutesAway:Math.max(0,away)});
    if(results.length>=count) break;
  }
  return results;
};
