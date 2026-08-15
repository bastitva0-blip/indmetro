/**
 * Kanpur Metro — Segment Timings
 *
 * ORANGE LINE: IIT Kanpur → Naubasta (22 stations, 23.785 km)
 *   Phase 1A (9 stations) opened Dec 2021. Phase 1B (5 more) May 2025.
 *   Official runtime IIT Kanpur → Kanpur Central: ~24 min (14 operational stations)
 *   Average speed: ~33 km/h incl. dwell.
 *
 * BLUE LINE: Agriculture University → Barra-8 (8 stations, 8.6 km)
 *   Under construction — estimated ~18 min end-to-end at similar speed.
 */

import { LINE_STATIONS } from "./metroData";

export const ORANGE_LINE_CUMULATIVE_MINUTES: number[] = [
  0,     // IIT Kanpur
  2.6,   // Kalyanpur
  4.8,   // SPM Hospital
  7.2,   // Vishwavidyalaya
  9.4,   // Gurudev Chauraha
  11.8,  // Geeta Nagar
  14.7,  // Rawatpur
  17.0,  // LLR Hospital
  18.7,  // Moti Jheel
  20.5,  // Chunniganj (underground)
  22.1,  // Naveen Market
  23.6,  // Bada Chauraha
  25.0,  // Nayaganj
  26.8,  // Kanpur Central  ← 14 operational stations end
  29.0,  // Jhakarkati (WIP)
  31.2,  // Transport Nagar
  33.4,  // Bara Devi
  35.5,  // Kidwai Nagar
  37.6,  // Vasant Vihar
  39.6,  // Dada Nagar
  41.5,  // Mandhana
  44.0,  // Naubasta
];

export const BLUE_LINE_CUMULATIVE_MINUTES: number[] = [
  0,     // Agriculture University
  4.2,   // Rawatpur (interchange)
  6.8,   // Kakadeo
  9.1,   // Double Pulia
  11.4,  // Vijay Nagar Chauraha
  13.6,  // Shastri Chowk
  15.8,  // Barra-7
  18.0,  // Barra-8
];

export const PEAK_HEADWAY_MINUTES = { orange: 6, blue: 10 };
export const OFF_PEAK_HEADWAY_MINUTES = { orange: 10, blue: 15 };

export interface LineTiming {
  stations: string[];
  cumulativeMinutes: number[];
  totalMinutes: number;
}

export const LINE_TIMINGS: Record<"orange" | "blue", LineTiming> = {
  orange: {
    stations: LINE_STATIONS.orange,
    cumulativeMinutes: ORANGE_LINE_CUMULATIVE_MINUTES,
    totalMinutes: 44,
  },
  blue: {
    stations: LINE_STATIONS.blue,
    cumulativeMinutes: BLUE_LINE_CUMULATIVE_MINUTES,
    totalMinutes: 18,
  },
};

export const getTravelTimeMinutes = (
  line: "orange" | "blue",
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
  line: "orange" | "blue",
  fromId: string,
  toId: string
): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId);
  const ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(ti - fi);
};

export const getHeadwayMinutes = (line: "orange" | "blue", date: Date): number => {
  const hour = date.getHours();
  const day = date.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isPeak = isWeekday && ((hour >= 8 && hour < 11) || (hour >= 17 && hour < 20));
  return isPeak ? PEAK_HEADWAY_MINUTES[line] : OFF_PEAK_HEADWAY_MINUTES[line];
};
