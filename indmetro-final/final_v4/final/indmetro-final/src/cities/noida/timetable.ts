import { LINE_STATIONS } from "./metroData";
import { LINE_TIMINGS, PEAK_HEADWAY, OFF_PEAK_HEADWAY } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";
export interface TrainSchedule { id: string; line: "aqua"; direction: "forward"|"backward"; startTime: string; stations: string[]; stationTimes: number[]; }
export const OPERATING_HOURS = { firstTrain: "06:00", lastTrain: "22:45" };
const toMin = (t: string) => { const [h,m] = t.split(":").map(Number); return h*60+m; };
const fmtMin = (m: number) => `${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(Math.round(m%60)).padStart(2,"0")}`;
let _cache: TrainSchedule[] | null = null;
export const getAllSchedules = (): TrainSchedule[] => {
  if (_cache) return _cache;
  const schedules: TrainSchedule[] = [];
  const now = getISTDate();
  const t = LINE_TIMINGS.aqua;
  for (const dir of ["forward","backward"] as const) {
    const stIds = dir==="forward" ? t.stations : [...t.stations].reverse();
    const cum = dir==="forward" ? t.cumulativeMinutes : [...t.cumulativeMinutes].reverse().map(m => t.totalMinutes-m);
    let time = toMin(OPERATING_HOURS.firstTrain), seq = 0;
    while (time <= toMin(OPERATING_HOURS.lastTrain)) {
      const h = Math.floor(time/60), d = now.getDay();
      const peak = d>=1&&d<=5&&((h>=8&&h<11)||(h>=17&&h<20));
      schedules.push({ id:`AQUA-${dir==="forward"?"F":"B"}-${seq}`, line:"aqua", direction:dir, startTime:fmtMin(time), stations:stIds, stationTimes:cum });
      time += peak ? PEAK_HEADWAY : OFF_PEAK_HEADWAY; seq++;
    }
  }
  return (_cache = schedules);
};
export const getNextTrainsAtStation = (stationId: string, direction: "forward"|"backward", count=4) => {
  const now = getISTDate();
  const curr = now.getHours()*60+now.getMinutes();
  const results: { schedule: TrainSchedule; arrivalTime: string; minutesAway: number }[] = [];
  for (const s of getAllSchedules().filter(s=>s.direction===direction)) {
    const idx = s.stations.indexOf(stationId); if (idx===-1) continue;
    const arr = toMin(s.startTime)+s.stationTimes[idx], away = arr-curr;
    if (away>=-1&&away<=120) results.push({schedule:s,arrivalTime:fmtMin(arr),minutesAway:Math.max(0,away)});
    if (results.length>=count) break;
  }
  return results;
};
