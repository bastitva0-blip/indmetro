/**
 * Nagpur Metro — Segment Timings
 * Orange: 19.66 km · 18 stations · ~34 min end-to-end
 * Aqua:   18.56 km · 20 stations · ~34 min end-to-end
 * Headway: 3 min peak | 7 min off-peak
 */
import { LINE_STATIONS } from "./metroData";

export const ORANGE_CUMULATIVE: number[] = [
  0, 2, 4, 5.5, 7, 8.5, 10.5, 12, 14, 16, 18.5, 20.5, 22, 23, 24, 25, 26, 27,
];

export const AQUA_CUMULATIVE: number[] = [
  0, 2, 3.5, 5, 6.5, 8, 9.5, 11, 12.5, 14, 15.5, 17, 18.5, 20, 21.5, 22.5, 24, 25.5, 27, 29, 31, 34,
];

export const PEAK_HEADWAY     = { orange: 3,  aqua: 3  };
export const OFF_PEAK_HEADWAY = { orange: 7,  aqua: 7  };

export interface LineTiming { stations: string[]; cumulativeMinutes: number[]; totalMinutes: number; }

export const LINE_TIMINGS: Record<"orange"|"aqua", LineTiming> = {
  orange: { stations: LINE_STATIONS.orange, cumulativeMinutes: ORANGE_CUMULATIVE, totalMinutes: 27 },
  aqua:   { stations: LINE_STATIONS.aqua,   cumulativeMinutes: AQUA_CUMULATIVE,   totalMinutes: 34 },
};

export const getTravelTimeMinutes = (line: "orange"|"aqua", fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const isPeakHour = (d: Date): boolean => {
  const h = d.getHours();
  return (h >= 7 && h <= 10) || (h >= 17 && h <= 20);
};

export const getHeadwayMinutes = (line: "orange"|"aqua", d: Date): number =>
  isPeakHour(d) ? PEAK_HEADWAY[line] : OFF_PEAK_HEADWAY[line];
