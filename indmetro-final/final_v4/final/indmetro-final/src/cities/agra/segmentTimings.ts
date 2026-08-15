/**
 * Agra Metro — Segment Timings
 * Yellow Line operational corridor: Taj East Gate → Mankameshwar (6 stations, 6.5 km)
 * Official runtime ~14 min end-to-end (avg speed ~34 km/h)
 * WIP stations extrapolated at same speed.
 */
import { LINE_STATIONS } from "./metroData";

// Cumulative from Sikandra (index 0)
export const YELLOW_CUMULATIVE: number[] = [
  0,     // Sikandra
  2.8,   // Guru Ka Taal
  5.2,   // ISBT
  7.5,   // RBS College
  9.6,   // Raja Ki Mandi
  11.4,  // Agra College (interchange)
  13.0,  // Medical College
  15.2,  // Mankameshwar  ← end of priority corridor (reversed = 0 from Taj East Gate)
  17.1,  // Dr. Ambedkar Chowk
  18.9,  // Taj Mahal
  21.3,  // Fatehabad Road
  23.5,  // Basai
  25.8,  // Taj East Gate
];

// Blue line: all WIP, rough estimates
export const BLUE_CUMULATIVE: number[] = [
  0, 2.4, 4.6, 6.7, 8.6, 10.3, 11.9, 13.3,
  14.8, 16.4, 18.0, 19.6, 21.2, 22.9,
];

export const PEAK_HEADWAY = { yellow: 7, blue: 10 };
export const OFF_PEAK_HEADWAY = { yellow: 12, blue: 15 };

export interface LineTiming {
  stations: string[]; cumulativeMinutes: number[]; totalMinutes: number;
}
export const LINE_TIMINGS: Record<"yellow" | "blue", LineTiming> = {
  yellow: { stations: LINE_STATIONS.yellow, cumulativeMinutes: YELLOW_CUMULATIVE, totalMinutes: 25.8 },
  blue: { stations: LINE_STATIONS.blue, cumulativeMinutes: BLUE_CUMULATIVE, totalMinutes: 22.9 },
};

export const getTravelTimeMinutes = (line: "yellow" | "blue", fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const getHeadwayMinutes = (line: "yellow" | "blue", date: Date): number => {
  const h = date.getHours(), d = date.getDay();
  const isPeak = d >= 1 && d <= 5 && ((h >= 8 && h < 11) || (h >= 17 && h < 20));
  return isPeak ? PEAK_HEADWAY[line] : OFF_PEAK_HEADWAY[line];
};
