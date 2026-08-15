import { LINE_STATIONS } from "./metroData";
import { LINE_TIMINGS, PEAK_HEADWAY_MINUTES, OFF_PEAK_HEADWAY_MINUTES } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface TrainSchedule {
  id: string;
  line: "purple" | "green" | "yellow";
  direction: "forward" | "backward";
  startTime: string;
  stations: string[];
  stationTimes: number[];
}

export const OPERATING_HOURS = {
  purple: { firstTrain: "05:00", lastTrain: "23:00" },
  green:  { firstTrain: "05:00", lastTrain: "23:00" },
  yellow: { firstTrain: "06:00", lastTrain: "23:55" },
};

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmtMin = (m: number) => {
  const h = Math.floor(m / 60) % 24;
  const min = Math.round(m % 60);
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

const isPeak = (minSinceMidnight: number, date: Date): boolean => {
  const hour = Math.floor(minSinceMidnight / 60);
  const day  = date.getDay();
  return day >= 1 && day <= 5 && ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 21));
};

const generateSchedules = (): TrainSchedule[] => {
  const schedules: TrainSchedule[] = [];
  const now = getISTDate();
  for (const line of ["purple", "green", "yellow"] as const) {
    const timing = LINE_TIMINGS[line];
    const hours  = OPERATING_HOURS[line];
    const first  = toMin(hours.firstTrain);
    const last   = toMin(hours.lastTrain);
    for (const direction of ["forward", "backward"] as const) {
      const stIds = direction === "forward"
        ? timing.stations
        : [...timing.stations].reverse();
      const cumMins = direction === "forward"
        ? timing.cumulativeMinutes
        : [...timing.cumulativeMinutes].reverse().map(m => timing.totalMinutes - m);
      let t = first; let seq = 0;
      while (t <= last) {
        const headway = isPeak(t, now) ? PEAK_HEADWAY_MINUTES[line] : OFF_PEAK_HEADWAY_MINUTES[line];
        schedules.push({
          id: `${line.toUpperCase()}-${direction === "forward" ? "F" : "B"}-${seq}`,
          line, direction, startTime: fmtMin(t), stations: stIds, stationTimes: cumMins,
        });
        t += headway; seq++;
      }
    }
  }
  return schedules;
};

let _cached: TrainSchedule[] | null = null;
export const getAllSchedules = (): TrainSchedule[] => {
  if (!_cached) _cached = generateSchedules();
  return _cached;
};

export const getNextTrainsAtStation = (
  stationId: string,
  line: "purple" | "green" | "yellow",
  direction: "forward" | "backward",
  count = 3
): { schedule: TrainSchedule; arrivalTime: string; minutesAway: number }[] => {
  const now = getISTDate();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const results: { schedule: TrainSchedule; arrivalTime: string; minutesAway: number }[] = [];
  for (const s of getAllSchedules().filter(s => s.line === line && s.direction === direction)) {
    const stIdx = s.stations.indexOf(stationId);
    if (stIdx === -1) continue;
    const arrivalMin = toMin(s.startTime) + s.stationTimes[stIdx];
    const away = arrivalMin - currentMin;
    if (away >= -1 && away <= 120) {
      results.push({ schedule: s, arrivalTime: fmtMin(arrivalMin), minutesAway: Math.max(0, away) });
    }
    if (results.length >= count) break;
  }
  return results;
};
