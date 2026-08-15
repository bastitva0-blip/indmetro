/**
 * Jaipur Metro — Segment Timings
 *
 * PINK LINE: Mansarovar → Badi Chaupar (11 stations, 11.97 km)
 *   Official total runtime: ~26 minutes end-to-end
 *   Average speed: 32 km/h (incl. dwell)
 *   Underground stretch (Chandpole → Badi Chaupar) runs slightly slower.
 *
 * Source: JMRC official timetable; trainhelp.in; Wikipedia (Aug 2026)
 */

import { LINE_STATIONS } from "./metroData";

export const PINK_LINE_CUMULATIVE_MINUTES: number[] = [
  0,    // Mansarovar
  3.0,  // New Aatish Market     (1.4 km, elevated)
  5.0,  // Vivek Vihar           (0.5 km, elevated)
  7.0,  // Shyam Nagar           (0.5 km, elevated)
  9.0,  // Ram Nagar             (0.5 km, elevated)
  12.0, // Civil Lines           (0.8 km, elevated)
  15.0, // Railway Station       (0.9 km, elevated)
  18.0, // Sindhi Camp           (1.1 km, elevated)
  21.0, // Chandpole             (0.9 km, → underground transition)
  23.5, // Chhoti Chaupar        (1.1 km, underground)
  26.0, // Badi Chaupar          (0.9 km, underground, terminal)
];

export const PEAK_HEADWAY_MINUTES = { pink: 10 };
export const OFF_PEAK_HEADWAY_MINUTES = { pink: 15 };

export interface LineTiming {
  stations: string[];
  cumulativeMinutes: number[];
  totalMinutes: number;
}

export const LINE_TIMINGS: Record<"pink", LineTiming> = {
  pink: {
    stations: LINE_STATIONS.pink,
    cumulativeMinutes: PINK_LINE_CUMULATIVE_MINUTES,
    totalMinutes: 26,
  },
};

export const getTravelTimeMinutes = (
  line: "pink",
  fromId: string,
  toId: string
): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId);
  const ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const getStationCount = (
  line: "pink",
  fromId: string,
  toId: string
): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId);
  const ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(ti - fi);
};

export const getHeadwayMinutes = (line: "pink", date: Date): number => {
  const hour = date.getHours();
  const day = date.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isPeak =
    isWeekday && ((hour >= 8 && hour < 11) || (hour >= 17 && hour < 20));
  return isPeak ? PEAK_HEADWAY_MINUTES[line] : OFF_PEAK_HEADWAY_MINUTES[line];
};
