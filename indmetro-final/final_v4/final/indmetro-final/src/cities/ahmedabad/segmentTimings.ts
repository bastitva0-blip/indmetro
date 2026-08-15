/**
 * Ahmedabad Metro — Segment Timings
 * Blue Line: 20.7 km · 21 stations · ~38 min end-to-end
 * Red Line:  18.5 km · 18 stations · ~36 min end-to-end (incl. 2 WIP)
 * Headway: 10 min peak | 15 min off-peak
 * Timings: 6:00–22:00 daily
 */
import { LINE_STATIONS } from "./metroData";

export const BLUE_CUMULATIVE: number[] = [
  0, 2, 4, 6, 7.5, 9, 10.5, 11.5, 12,
  13.5, 15, 16.5, 18, 20, 22, 23.5, 25, 26,
  30, 34, 38,
];

export const RED_CUMULATIVE: number[] = [
  0, 2, 4, 7, 9, 10.5, 12, 13.5, 15, 16,
  18.5, 21, 23, 25.5, 27, 30,
  33, 36,  // WIP: Chandkheda, Ranip
];

export const PEAK_HEADWAY     = { blue: 10, red: 10 };
export const OFF_PEAK_HEADWAY = { blue: 15, red: 15 };

export interface LineTiming {
  stations: string[]; cumulativeMinutes: number[]; totalMinutes: number;
}

export const LINE_TIMINGS: Record<"blue" | "red", LineTiming> = {
  blue: { stations: LINE_STATIONS.blue, cumulativeMinutes: BLUE_CUMULATIVE, totalMinutes: 38 },
  red:  { stations: LINE_STATIONS.red,  cumulativeMinutes: RED_CUMULATIVE,  totalMinutes: 36 },
};

export const getTravelTimeMinutes = (line: "blue" | "red", fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const isPeakHour = (d: Date): boolean => {
  const h = d.getHours();
  return (h >= 7 && h <= 10) || (h >= 17 && h <= 20);
};

export const getHeadwayMinutes = (line: "blue" | "red", d: Date): number =>
  isPeakHour(d) ? PEAK_HEADWAY[line] : OFF_PEAK_HEADWAY[line];
