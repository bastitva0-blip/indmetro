/**
 * Chennai Metro — Segment Timings
 *
 * BLUE LINE: Wimco Nagar Depot → Chennai Airport (32.65 km, 26 stations)
 *   End-to-end: ~40 min | Avg speed: ~85 km/h
 *
 * GREEN LINE: Chennai Central → St. Thomas Mount (22 km, 13 operational stations)
 *   End-to-end: ~25 min | Avg speed: ~85 km/h
 *
 * Hours: 05:00 – 23:00 | Peak headway: 5 min | Off-peak: 8 min
 */
import { LINE_STATIONS } from "./metroData";

// Blue Line cumulative from Wimco Nagar Depot
export const BLUE_CUMULATIVE: number[] = [
  0, 1.5, 3.2, 4.8, 6.3, 7.8, 9.3, 10.9, 12.5, 14.1,
  15.6, 17.0, 18.5, 20.0, 21.4, 22.8, 24.1, 25.4, 26.7, 27.9,
  29.1, 30.2, 31.3, 32.3, 33.4, 35.0,
  // WIP extension from Airport
  36.5, 37.9, 39.2, 40.5, 41.8, 43.0, 44.1, 45.2, 46.2, 47.2, 48.2,
];

// Green Line cumulative from Chennai Central
export const GREEN_CUMULATIVE: number[] = [
  0, 1.8, 3.4, 5.0, 6.6, 9.2, 10.8, 12.2, 13.6, 15.0,
  17.0, 19.5, 22.5,
];

export const PEAK_HEADWAY = 5;
export const OFF_PEAK_HEADWAY = 8;

export interface LineTiming { stations: string[]; cumulativeMinutes: number[]; totalMinutes: number; }

export const LINE_TIMINGS: Record<"blue" | "green", LineTiming> = {
  blue:  { stations: LINE_STATIONS.blue,  cumulativeMinutes: BLUE_CUMULATIVE,  totalMinutes: 35 },
  green: { stations: LINE_STATIONS.green, cumulativeMinutes: GREEN_CUMULATIVE, totalMinutes: 22.5 },
};

export const getTravelTimeMinutes = (line: "blue" | "green", fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const getHeadwayMinutes = (_line: "blue" | "green", date: Date): number => {
  const h = date.getHours(), d = date.getDay();
  return d >= 1 && d <= 5 && ((h >= 7 && h < 11) || (h >= 17 && h < 21))
    ? PEAK_HEADWAY : OFF_PEAK_HEADWAY;
};
