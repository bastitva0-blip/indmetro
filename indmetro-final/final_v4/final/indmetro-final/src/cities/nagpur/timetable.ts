import { LINE_STATIONS } from "./metroData";
import { LINE_TIMINGS, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface TrainSchedule {
  id: string; line: "orange"|"aqua"; direction: "forward"|"backward";
  startTime: string; stations: string[]; stationTimes: number[];
}

const toMin = (t: string) => { const [h,m] = t.split(":").map(Number); return h*60+m; };
const fmtMin = (m: number) =>
  `${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(Math.round(m%60)).padStart(2,"0")}`;

let _cache: TrainSchedule[] | null = null;
export const getAllSchedules = (): TrainSchedule[] => {
  if (_cache) return _cache;
  const now = getISTDate();
  const schedules: TrainSchedule[] = [];
  for (const line of ["orange","aqua"] as const) {
    const t = LINE_TIMINGS[line];
    for (const dir of ["forward","backward"] as const) {
      const stIds = dir === "forward" ? t.stations : [...t.stations].reverse();
      const cum = dir === "forward"
        ? t.cumulativeMinutes
        : [...t.cumulativeMinutes].reverse().map(m => t.totalMinutes - m);
      let time = toMin("06:00"), seq = 0;
      const mock = new Date(now);
      while (time <= toMin("22:00")) {
        mock.setHours(Math.floor(time/60), time%60);
        schedules.push({ id:`${line[0].toUpperCase()}L-${dir==="forward"?"F":"B"}-${seq}`, line, direction:dir, startTime:fmtMin(time), stations:stIds, stationTimes:cum });
        time += getHeadwayMinutes(line, mock); seq++;
      }
    }
  }
  return (_cache = schedules);
};

export const getNextTrainsAtStation = (
  stationId: string, line: "orange"|"aqua", direction: "forward"|"backward", count = 4
) => {
  const now = getISTDate();
  const curr = now.getHours()*60 + now.getMinutes();
  const results: { schedule: TrainSchedule; arrivalTime: string; minutesAway: number }[] = [];
  for (const s of getAllSchedules().filter(s => s.line === line && s.direction === direction)) {
    const idx = s.stations.indexOf(stationId);
    if (idx === -1) continue;
    const arr = toMin(s.startTime) + s.stationTimes[idx];
    const away = arr - curr;
    if (away >= -1 && away <= 90)
      results.push({ schedule: s, arrivalTime: fmtMin(arr), minutesAway: Math.max(0, away) });
    if (results.length >= count) break;
  }
  return results;
};
