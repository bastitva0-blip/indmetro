/**
 * Kochi Metro Timetable (KMRL Blue Line)
 * Weekday / Saturday: First train 6:00 AM, Last train 10:30 PM
 * Sunday: First train 7:30 AM, Last train 10:30 PM
 * Peak headway: 8 min · Off-peak: 15 min
 * Festival extensions to 11 PM – 1:30 AM possible (special notice basis).
 */
import { LINE_STATIONS } from "./metroData";
import { LINE_TIMINGS, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface TrainSchedule {
  id: string;
  direction: "forward" | "backward";
  startTime: string;   // "HH:MM"
  stations: string[];
  stationTimes: number[]; // cumulative minutes from startTime
}

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmtMin = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;

const isSunday = (d: Date) => d.getDay() === 0;

let _cache: TrainSchedule[] | null = null;
export const getAllSchedules = (): TrainSchedule[] => {
  if (_cache) return _cache;
  const now = getISTDate();
  const firstTrain = isSunday(now) ? "07:30" : "06:00";
  const lastTrain = "22:30"; // last departure ≤ 22:30 so train can complete ~56 min run by ~23:26
  const schedules: TrainSchedule[] = [];
  const t = LINE_TIMINGS.blue;

  for (const dir of ["forward", "backward"] as const) {
    const stIds = dir === "forward" ? t.stations : [...t.stations].reverse();
    const cum =
      dir === "forward"
        ? t.cumulativeMinutes
        : [...t.cumulativeMinutes].reverse().map(m => t.totalMinutes - m);

    let time = toMin(firstTrain), seq = 0;
    const mockDate = new Date(now); // for headway
    while (time <= toMin(lastTrain)) {
      mockDate.setHours(Math.floor(time / 60), time % 60);
      const hw = getHeadwayMinutes(mockDate);
      schedules.push({
        id: `BL-${dir === "forward" ? "F" : "B"}-${seq}`,
        direction: dir, startTime: fmtMin(time),
        stations: stIds, stationTimes: cum,
      });
      time += hw; seq++;
    }
  }
  return (_cache = schedules);
};

export const getNextTrainsAtStation = (
  stationId: string,
  direction: "forward" | "backward",
  count = 4
) => {
  const now = getISTDate();
  const curr = now.getHours() * 60 + now.getMinutes();
  const results: { schedule: TrainSchedule; arrivalTime: string; minutesAway: number }[] = [];
  for (const s of getAllSchedules().filter(s => s.direction === direction)) {
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
