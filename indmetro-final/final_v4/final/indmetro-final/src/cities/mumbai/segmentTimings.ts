/**
 * Mumbai Metro — Segment Timings
 * Line 1:  11.4 km, 12 stations, ~21 min E2E, peak 3 min, off-peak 5 min, 5:30–23:50
 * Line 2A: 18.6 km, 17 stations, ~32 min E2E, peak 4 min, off-peak 6 min, 6:00–22:30
 * Line 3:  33.5 km, 27 stations, ~55 min E2E, peak 4 min, off-peak 8 min, 6:30–22:30
 * Line 7:  16.5 km, 13 stations, ~26 min E2E, peak 4 min, off-peak 6 min, 6:00–22:30
 * Line 9:  3.1 km,   4 stations,  ~7 min E2E, flat 8 min, 6:00–22:00 (new line)
 */
import { LINE_STATIONS } from "./metroData";

export const CUMULATIVE: Record<string, number[]> = {
  line1:  [0, 2, 3.5, 5, 7, 9, 11, 13, 15, 17, 19, 21],
  line2a: [0, 2, 3.5, 5.5, 7, 8.5, 10, 11.5, 13, 14, 15, 16, 17, 18, 19, 20.5, 22, 24, 26, 28, 30, 32],
  line3:  [0, 4.5, 7, 9.5, 11.5, 13, 15, 17.5, 22, 24, 26, 27.5, 29.5, 31, 33.5, 35.5, 37.5, 39, 40.5, 42, 44, 46, 48, 49.5, 51, 52.5, 55],
  line7:  [0, 2, 3.5, 5, 6.5, 8, 9.5, 11, 12.5, 14, 15, 15.8, 16.8, 18, 20, 22, 24, 26],
  line9:  [0, 2, 4.5, 7],
};

// Trim to actual station count
for (const line of Object.keys(CUMULATIVE) as (keyof typeof CUMULATIVE)[]) {
  const n = LINE_STATIONS[line as keyof typeof LINE_STATIONS].length;
  CUMULATIVE[line] = CUMULATIVE[line].slice(0, n);
}

export const PEAK_HEADWAY    = { line1: 3, line2a: 4, line3: 4, line7: 4, line9: 8 };
export const OFF_PEAK_HEADWAY = { line1: 5, line2a: 6, line3: 8, line7: 6, line9: 8 };

export const FIRST_TRAIN = { line1: "05:30", line2a: "06:00", line3: "06:30", line7: "06:00", line9: "06:00" };
export const LAST_TRAIN  = { line1: "23:30", line2a: "22:00", line3: "22:00", line7: "22:00", line9: "21:30" };

export const getTravelTime = (line: string, fromId: string, toId: string): number | null => {
  const arr = LINE_STATIONS[line as keyof typeof LINE_STATIONS];
  const cum = CUMULATIVE[line];
  if (!arr || !cum) return null;
  const fi = arr.indexOf(fromId), ti = arr.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(cum[ti] - cum[fi]);
};

export const isPeakHour = (d: Date): boolean => {
  const h = d.getHours(); return (h >= 7 && h <= 10) || (h >= 17 && h <= 20);
};

export const getHeadway = (line: string, d: Date): number =>
  isPeakHour(d)
    ? PEAK_HEADWAY[line as keyof typeof PEAK_HEADWAY]
    : OFF_PEAK_HEADWAY[line as keyof typeof OFF_PEAK_HEADWAY];

export const getTravelTimeMinutes = (line: string, fromId: string, toId: string): number | null => {
  const { LINE_STATIONS } = require("./metroData");
  const arr = (LINE_STATIONS as Record<string, string[]>)[line];
  if (!arr) return null;
  const fi = arr.indexOf(fromId), ti = arr.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  const cum = (CUMULATIVE as Record<string, number[]>)[line];
  if (!cum) return null;
  return Math.abs((cum[ti] ?? 0) - (cum[fi] ?? 0));
};
