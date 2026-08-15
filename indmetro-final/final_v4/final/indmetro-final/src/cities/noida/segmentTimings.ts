import { LINE_STATIONS } from "./metroData";
export const AQUA_CUMULATIVE: number[] = [0,2.5,5,7.5,10,12,14,17,20,23,26,29,32,35,37,39,41,42,43,44,45];
export const PEAK_HEADWAY = 7.5;
export const OFF_PEAK_HEADWAY = 10;
export interface LineTiming { stations: string[]; cumulativeMinutes: number[]; totalMinutes: number; }
export const LINE_TIMINGS: Record<"aqua", LineTiming> = {
  aqua: { stations: LINE_STATIONS.aqua, cumulativeMinutes: AQUA_CUMULATIVE, totalMinutes: 45 },
};
export const getTravelTimeMinutes = (_line: "aqua", fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS.aqua;
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};
export const getHeadwayMinutes = (_line: "aqua", date: Date): number => {
  const h = date.getHours(), d = date.getDay();
  return d >= 1 && d <= 5 && ((h >= 8 && h < 11) || (h >= 17 && h < 20)) ? PEAK_HEADWAY : OFF_PEAK_HEADWAY;
};
