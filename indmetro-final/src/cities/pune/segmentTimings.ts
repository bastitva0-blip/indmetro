/**
 * Pune Metro — Segment Timings
 *
 * PURPLE LINE: PCMC Bhavan → Swargate (14 stations, 14.97 km, ~27 min)
 * AQUA LINE:   Vanaz → Ramwadi (16 stations, 16.59 km, ~28 min)
 *
 * Underground section (Purple Line: Shivajinagar → Swargate) runs slightly slower.
 * Source: MahaMetro timetable estimates (Aug 2026)
 */

import { LINE_STATIONS } from "./metroData";

export const PURPLE_LINE_CUMULATIVE_MINUTES: number[] = [
  0,    // PCMC Bhavan
  2.5,  // Sant Tukaram Nagar
  4.5,  // Bhosari
  6.5,  // Kasarwadi
  8.5,  // Phugewadi
  10.5, // Dapodi
  12.5, // Bopodi
  14.5, // Khadki
  16.5, // Range Hills
  19.0, // Shivajinagar  (underground, slightly slower)
  21.5, // Civil Court
  23.5, // Budhwar Peth
  25.0, // Mandai
  27.0, // Swargate
];

export const AQUA_LINE_CUMULATIVE_MINUTES: number[] = [
  0,    // Vanaz
  2.0,  // Anand Nagar
  4.0,  // Ideal Colony
  6.0,  // Nal Stop
  8.0,  // Garware College
  10.0, // Deccan Gymkhana
  12.0, // Chhatrapati Sambhaji Chowk
  14.0, // PMC
  16.0, // Mangalwar Peth
  18.0, // Pune Railway Station
  20.0, // Ruby Hall Clinic
  22.0, // Bund Garden
  24.0, // Yerawada
  25.5, // Nagar Road
  27.0, // Bopkhel
  28.5, // Ramwadi
];

export const PEAK_HEADWAY_MINUTES    = { purple: 7,  aqua: 7  };
export const OFF_PEAK_HEADWAY_MINUTES = { purple: 12, aqua: 12 };

export interface LineTiming {
  stations: string[];
  cumulativeMinutes: number[];
  totalMinutes: number;
}

export const LINE_TIMINGS: Record<"purple" | "aqua", LineTiming> = {
  purple: {
    stations: LINE_STATIONS.purple,
    cumulativeMinutes: PURPLE_LINE_CUMULATIVE_MINUTES,
    totalMinutes: 27,
  },
  aqua: {
    stations: LINE_STATIONS.aqua,
    cumulativeMinutes: AQUA_LINE_CUMULATIVE_MINUTES,
    totalMinutes: 28.5,
  },
};

export const getTravelTimeMinutes = (
  line: "purple" | "aqua",
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
  line: "purple" | "aqua",
  fromId: string,
  toId: string
): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId);
  const ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(ti - fi);
};

export const getHeadwayMinutes = (line: "purple" | "aqua", date: Date): number => {
  const hour = date.getHours();
  const day  = date.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isPeak = isWeekday && ((hour >= 8 && hour < 11) || (hour >= 17 && hour < 21));
  return isPeak ? PEAK_HEADWAY_MINUTES[line] : OFF_PEAK_HEADWAY_MINUTES[line];
};
