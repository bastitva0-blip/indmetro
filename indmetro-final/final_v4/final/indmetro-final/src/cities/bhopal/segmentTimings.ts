/**
 * Bhopal Metro — Segment Timings
 *
 * ORANGE LINE Priority Corridor: AIIMS → Subhash Nagar (8 stations, 6.22 km)
 *   Average speed: 32 km/h. Estimated total: ~14 min.
 *   (Full line when complete: 14.99 km, ~28 min)
 *
 * BLUE LINE: All WIP — estimated ~26 min end-to-end at similar speed.
 *
 * Note: As of early 2026, only 1 train runs → ~75 min actual wait.
 * IndMetro shows theoretical scheduled headway (10/15 min peak/off-peak)
 * for when the second train is deployed.
 */

import { LINE_STATIONS } from "./metroData";

// Full Orange Line: Karond Chauraha → AIIMS (north to south = low index to high)
export const ORANGE_LINE_CUMULATIVE_MINUTES: number[] = [
  0,    // Karond Chauraha (WIP)
  2.5,  // Krishi Upaj Mandi (WIP)
  5.0,  // DIG Bungalow (WIP)
  7.5,  // Sindhi Colony (WIP)
  9.5,  // Nadra Bus Stand (WIP, underground)
  11.5, // Bhopal Junction (WIP, underground)
  13.5, // Aishbagh (WIP)
  15.5, // Pul Bogda (WIP, interchange)
  17.5, // Subhash Nagar ← operational corridor starts
  19.5, // Kendriya Vidyalaya
  21.0, // Board Office Chauraha
  22.5, // MP Nagar
  24.0, // Rani Kamalapati Railway Station
  25.5, // DRM Office
  27.0, // Alkapuri
  28.5, // AIIMS ← operational corridor ends
];

export const BLUE_LINE_CUMULATIVE_MINUTES: number[] = [
  0,    // Bhadbhada Chauraha (WIP)
  2.5,  // Depot Chauraha
  4.5,  // Jawahar Chowk
  6.5,  // Roshanpura Chauraha
  8.0,  // Minto Hall
  10.0, // Lily Talkies
  12.5, // Pul Bogda (interchange with Orange)
  14.5, // Prabhat Chauraha
  16.5, // Govindpura
  18.5, // J.K. Road
  20.5, // Indrapuri
  22.5, // Piplani
  25.0, // Ratnagiri Tiraha
];

export const PEAK_HEADWAY_MINUTES    = { orange: 10, blue: 15 };
export const OFF_PEAK_HEADWAY_MINUTES = { orange: 15, blue: 20 };

export interface LineTiming {
  stations: string[];
  cumulativeMinutes: number[];
  totalMinutes: number;
}

export const LINE_TIMINGS: Record<"orange" | "blue", LineTiming> = {
  orange: {
    stations: LINE_STATIONS.orange,
    cumulativeMinutes: ORANGE_LINE_CUMULATIVE_MINUTES,
    totalMinutes: 28.5,
  },
  blue: {
    stations: LINE_STATIONS.blue,
    cumulativeMinutes: BLUE_LINE_CUMULATIVE_MINUTES,
    totalMinutes: 25,
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

export const getHeadwayMinutes = (
  line: "orange" | "blue",
  date: Date
): number => {
  const hour = date.getHours();
  const day  = date.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isPeak =
    isWeekday && ((hour >= 8 && hour < 11) || (hour >= 17 && hour < 20));
  return isPeak ? PEAK_HEADWAY_MINUTES[line] : OFF_PEAK_HEADWAY_MINUTES[line];
};
