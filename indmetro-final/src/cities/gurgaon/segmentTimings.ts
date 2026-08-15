/**
 * Gurgaon Rapid Metro — Segment Timings
 * Sector 55-56 → DLF Phase 3: ~19 min total, 12.85 km
 * Headway: 4 min (very frequent, 12 trains)
 */
import { LINE_STATIONS } from "./metroData";

export const RAPID_CUMULATIVE: number[] = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 19];
export const PEAK_HEADWAY = 4;
export const OFF_PEAK_HEADWAY = 6;

export interface LineTiming { stations: string[]; cumulativeMinutes: number[]; totalMinutes: number; }
export const LINE_TIMINGS: Record<"rapid", LineTiming> = {
  rapid: { stations: LINE_STATIONS.rapid, cumulativeMinutes: RAPID_CUMULATIVE, totalMinutes: 19 },
};

export const getTravelTimeMinutes = (_line: "rapid", fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS.rapid;
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const getHeadwayMinutes = (_line: "rapid", date: Date): number => {
  const h = date.getHours(), d = date.getDay();
  return d >= 1 && d <= 5 && ((h >= 8 && h < 11) || (h >= 17 && h < 20))
    ? PEAK_HEADWAY : OFF_PEAK_HEADWAY;
};
