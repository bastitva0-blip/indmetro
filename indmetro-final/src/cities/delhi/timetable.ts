import { LINE_STATIONS, DelhiLine } from "./metroData";
import { LINE_TIMINGS, PEAK_HEADWAY, OFF_PEAK_HEADWAY } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface TrainSchedule {
  id: string;
  line: DelhiLine;
  direction: "forward" | "backward";
  startTime: string;
  stations: string[];
  stationTimes: number[];
}

export const OPERATING_HOURS: Record<DelhiLine, { first: string; last: string }> = {
  red:     { first: "06:00", last: "23:00" },
  yellow:  { first: "05:30", last: "23:00" },
  blue:    { first: "05:30", last: "23:00" },
  blue_b:  { first: "05:30", last: "23:00" },
  green:   { first: "06:00", last: "23:00" },
  violet:  { first: "06:00", last: "23:00" },
  orange:  { first: "04:45", last: "23:30" },
  pink:    { first: "06:00", last: "23:00" },
  magenta: { first: "06:00", last: "23:00" },
  grey:    { first: "06:00", last: "22:00" },
};

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmtMin = (m: number) => {
  const h = Math.floor(m / 60) % 24;
  const min = Math.round(m % 60);
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};
const isPeak = (min: number, date: Date): boolean => {
  const h = Math.floor(min / 60); const day = date.getDay();
  return day >= 1 && day <= 5 && ((h >= 8 && h < 11) || (h >= 17 && h < 20));
};

const generateSchedules = (): TrainSchedule[] => {
  const schedules: TrainSchedule[] = [];
  const now = getISTDate();
  for (const line of Object.keys(LINE_STATIONS) as DelhiLine[]) {
    const timing = LINE_TIMINGS[line];
    const { first, last } = OPERATING_HOURS[line];
    const firstMin = toMin(first); const lastMin = toMin(last);
    for (const direction of ["forward", "backward"] as const) {
      const stIds = direction === "forward" ? timing.stations : [...timing.stations].reverse();
      const cumMins = direction === "forward"
        ? timing.cumulativeMinutes
        : [...timing.cumulativeMinutes].reverse().map(m => timing.totalMinutes - m);
      let t = firstMin; let seq = 0;
      while (t <= lastMin) {
        const hw = isPeak(t, now) ? PEAK_HEADWAY[line] : OFF_PEAK_HEADWAY[line];
        schedules.push({ id: `${line.toUpperCase()}-${direction[0].toUpperCase()}-${seq}`, line, direction, startTime: fmtMin(t), stations: stIds, stationTimes: cumMins });
        t += hw; seq++;
      }
    }
  }
  return schedules;
};

let _cached: TrainSchedule[] | null = null;
export const getAllSchedules = (): TrainSchedule[] => { if (!_cached) _cached = generateSchedules(); return _cached; };

export const getNextTrainsAtStation = (
  stationId: string, line: DelhiLine, direction: "forward" | "backward", count = 3
): { schedule: TrainSchedule; arrivalTime: string; minutesAway: number }[] => {
  const now = getISTDate();
  const cur = now.getHours() * 60 + now.getMinutes();
  const results: { schedule: TrainSchedule; arrivalTime: string; minutesAway: number }[] = [];
  for (const s of getAllSchedules().filter(s => s.line === line && s.direction === direction)) {
    const si = s.stations.indexOf(stationId);
    if (si === -1) continue;
    const arr = toMin(s.startTime) + s.stationTimes[si];
    const away = arr - cur;
    if (away >= -1 && away <= 90) results.push({ schedule: s, arrivalTime: fmtMin(arr), minutesAway: Math.max(0, away) });
    if (results.length >= count) break;
  }
  return results;
};
