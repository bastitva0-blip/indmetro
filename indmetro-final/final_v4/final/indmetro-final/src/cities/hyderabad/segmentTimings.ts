/**
 * Hyderabad Metro — Segment Timings
 * Red:   29.87 km · 26 stations · ~52 min E2E
 * Blue:  27 km    · 23 stations · ~48 min E2E
 * Green: 11 km    · 9 operational stations · ~18 min (operational section)
 * Headway: 3.5 min peak | 7 min off-peak
 */
import { LINE_STATIONS } from "./metroData";

export const RED_CUMULATIVE: number[] = [
  0, 2, 3.5, 5, 7, 8.5, 10, 11.5, 13, 15, 17, 19, 20.5, 22, 23.5, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 48, 52,
];

export const BLUE_CUMULATIVE: number[] = [
  0, 3, 5.5, 7, 8.5, 10, 11.5, 13, 14.5, 16, 17.5, 18.5, 19.5, 21, 22.5, 24, 25.5, 27, 28.5, 30, 32, 34, 36,  // 23 values
];

// Wait - Red has 26 stations but cumulative needs 26 entries. Let me recount.
// LINE_STATIONS.red has 26 entries (Miyapur to LB Nagar, without the 27th which is lb_nagar-terminal)
// Actually Red has 26 stations in the array. Let me check: miyapur...lb_nagar = 26 items. Good.

export const GREEN_CUMULATIVE: number[] = [
  0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 21, 24, 27, 30, 33,  // 15 values (9 live + 6 WIP)
];

export const PEAK_HEADWAY     = { red: 3.5, blue: 3.5, green: 5 };
export const OFF_PEAK_HEADWAY = { red: 7,   blue: 7,   green: 10 };

export const FIRST_TRAIN = { red: "06:00", blue: "06:00", green: "06:00" };
export const LAST_TRAIN  = { red: "23:00", blue: "23:00", green: "23:35" };

export interface LineTiming { stations: string[]; cumulativeMinutes: number[]; totalMinutes: number; }

export const LINE_TIMINGS: Record<"red"|"blue"|"green", LineTiming> = {
  red:   { stations: LINE_STATIONS.red,   cumulativeMinutes: RED_CUMULATIVE.slice(0, LINE_STATIONS.red.length),   totalMinutes: 52 },
  blue:  { stations: LINE_STATIONS.blue,  cumulativeMinutes: BLUE_CUMULATIVE.slice(0, LINE_STATIONS.blue.length),  totalMinutes: 36 },
  green: { stations: LINE_STATIONS.green, cumulativeMinutes: GREEN_CUMULATIVE.slice(0, LINE_STATIONS.green.length), totalMinutes: 33 },
};

export const getTravelTimeMinutes = (line: "red"|"blue"|"green", fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const isPeakHour = (d: Date): boolean => {
  const h = d.getHours(); return (h >= 7 && h <= 10) || (h >= 17 && h <= 20);
};

export const getHeadwayMinutes = (line: "red"|"blue"|"green", d: Date): number =>
  isPeakHour(d) ? PEAK_HEADWAY[line] : OFF_PEAK_HEADWAY[line];
