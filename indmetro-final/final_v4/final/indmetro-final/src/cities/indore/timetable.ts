/**
 * Indore Metro Timetable
 * Timings: 06:00–22:00 daily (confirmed MPMRCL)
 * Headway: ~10 min peak, ~15 min off-peak (estimated)
 * Ring line — trains run continuously in both directions.
 */
import { LINE_STATIONS } from "./metroData";
import { LINE_TIMINGS, TOTAL_RING_MINUTES, PEAK_HEADWAY, OFF_PEAK_HEADWAY } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface TrainSchedule {
  id: string; line: "yellow"; direction: "clockwise" | "anticlockwise";
  startTime: string; stations: string[]; stationTimes: number[];
}

export const OPERATING_HOURS = { firstTrain: "06:00", lastTrain: "22:00" };

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmtMin = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;

let _cache: TrainSchedule[] | null = null;
export const getAllSchedules = (): TrainSchedule[] => {
  if (_cache) return _cache;
  const schedules: TrainSchedule[] = [];
  const now = getISTDate();
  const t = LINE_TIMINGS.yellow;

  for (const dir of ["clockwise", "anticlockwise"] as const) {
    const stIds = dir === "clockwise" ? t.stations : [...t.stations].reverse();
    const cum = dir === "clockwise"
      ? t.cumulativeMinutes
      : [...t.cumulativeMinutes].reverse().map(m => TOTAL_RING_MINUTES - m);

    let time = toMin(OPERATING_HOURS.firstTrain), seq = 0;
    while (time <= toMin(OPERATING_HOURS.lastTrain)) {
      const h = Math.floor(time / 60), d = now.getDay();
      const peak = d >= 1 && d <= 5 && ((h >= 8 && h < 11) || (h >= 17 && h < 20));
      schedules.push({
        id: `YELLOW-${dir === "clockwise" ? "CW" : "ACW"}-${seq}`,
        line: "yellow", direction: dir,
        startTime: fmtMin(time), stations: stIds, stationTimes: cum,
      });
      time += peak ? PEAK_HEADWAY : OFF_PEAK_HEADWAY;
      seq++;
    }
  }
  return (_cache = schedules);
};

export const getNextTrainsAtStation = (
  stationId: string,
  direction: "clockwise" | "anticlockwise",
  count = 4
): { schedule: TrainSchedule; arrivalTime: string; minutesAway: number }[] => {
  const now = getISTDate();
  const curr = now.getHours() * 60 + now.getMinutes();
  const results: { schedule: TrainSchedule; arrivalTime: string; minutesAway: number }[] = [];
  for (const s of getAllSchedules().filter(s => s.direction === direction)) {
    const idx = s.stations.indexOf(stationId);
    if (idx === -1) continue;
    const arr = toMin(s.startTime) + s.stationTimes[idx];
    const away = arr - curr;
    if (away >= -1 && away <= 120)
      results.push({ schedule: s, arrivalTime: fmtMin(arr), minutesAway: Math.max(0, away) });
    if (results.length >= count) break;
  }
  return results;
};
