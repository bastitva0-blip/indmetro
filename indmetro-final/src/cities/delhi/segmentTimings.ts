/**
 * Delhi Metro — Segment Timings
 * Cumulative minutes from terminal for each line.
 * Average speed: ~32–35 km/h including dwell.
 * Airport Express: ~18 min end-to-end at 100 km/h.
 */

import { LINE_STATIONS, DelhiLine } from "./metroData";

export const PEAK_HEADWAY: Record<DelhiLine, number> = {
  red: 4, yellow: 3, blue: 3, blue_b: 5,
  green: 7, violet: 4, orange: 10,
  pink: 5, magenta: 5, grey: 15,
};
export const OFF_PEAK_HEADWAY: Record<DelhiLine, number> = {
  red: 7, yellow: 5, blue: 5, blue_b: 8,
  green: 10, violet: 7, orange: 20,
  pink: 7, magenta: 7, grey: 20,
};

export const INTERCHANGE_TRANSFER_MINUTES = 4;

// Cumulative minutes from the first station in LINE_STATIONS
// Red: 29 stations, ~52 min total
const RED_CUM = [0,2.5,5,7.5,10,12.5,15,17,19,21,23,24.5,26,28,30,33,35,37,39,41,43,45,47,49,51,52.5,54,55.5,57];
// Yellow: 36 stations, ~72 min total
const YELLOW_CUM = [0,2,4,6,8,10,12,14,16,18,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,72];
// Blue: 49 stations, ~88 min total
const BLUE_CUM = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,87,88,89,90,91];
// Blue_B: 8 stations, ~14 min total
const BLUE_B_CUM = [0,2,4,6,8,10,12,14];
// Green: 22 stations, ~38 min total
const GREEN_CUM = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,39,40];
// Violet: 33 stations, ~67 min total
const VIOLET_CUM = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,65];
// Orange: 6 stations, ~18 min total
const ORANGE_CUM = [0,3,6,12,15,18];
// Pink: 48 stations, ~85 min total
const PINK_CUM = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,85,86,87,88];
// Magenta: 28 stations, ~55 min total
const MAGENTA_CUM = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,55];
// Grey: 4 stations, ~12 min total
const GREY_CUM = [0,4,8,12];

export interface LineTiming {
  stations: string[];
  cumulativeMinutes: number[];
  totalMinutes: number;
}

function buildTiming(line: DelhiLine, cum: number[]): LineTiming {
  const stns = LINE_STATIONS[line];
  // Pad or trim cumulative to match actual station count
  const padded = stns.map((_, i) =>
    cum[i] !== undefined ? cum[i] : cum[cum.length - 1] + (i - cum.length + 1) * 2
  );
  return { stations: stns, cumulativeMinutes: padded, totalMinutes: padded[padded.length - 1] };
}

export const LINE_TIMINGS: Record<DelhiLine, LineTiming> = {
  red:     buildTiming("red",     RED_CUM),
  yellow:  buildTiming("yellow",  YELLOW_CUM),
  blue:    buildTiming("blue",    BLUE_CUM),
  blue_b:  buildTiming("blue_b",  BLUE_B_CUM),
  green:   buildTiming("green",   GREEN_CUM),
  violet:  buildTiming("violet",  VIOLET_CUM),
  orange:  buildTiming("orange",  ORANGE_CUM),
  pink:    buildTiming("pink",    PINK_CUM),
  magenta: buildTiming("magenta", MAGENTA_CUM),
  grey:    buildTiming("grey",    GREY_CUM),
};

export const getTravelTimeMinutes = (
  line: DelhiLine, fromId: string, toId: string
): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId);
  const ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const getHeadwayMinutes = (line: DelhiLine, date: Date): number => {
  const h = date.getHours();
  const day = date.getDay();
  const isPeak = day >= 1 && day <= 5 && ((h >= 8 && h < 11) || (h >= 17 && h < 20));
  return isPeak ? PEAK_HEADWAY[line] : OFF_PEAK_HEADWAY[line];
};
