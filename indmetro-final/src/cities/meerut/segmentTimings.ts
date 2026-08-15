import { LINE_STATIONS } from "./metroData";
// Meerut South → Modipuram: ~18 min, 12 stations (ex depot)
export const METRO_CUMULATIVE: number[] = [0,1.5,3,5,6.5,8.5,10,11.5,13,14.5,16,18,19.5];
export const PEAK_HEADWAY = 10;
export const OFF_PEAK_HEADWAY = 15;
export interface LineTiming { stations: string[]; cumulativeMinutes: number[]; totalMinutes: number; }
export const LINE_TIMINGS: Record<"metro", LineTiming> = {
  metro: { stations: LINE_STATIONS.metro, cumulativeMinutes: METRO_CUMULATIVE, totalMinutes: 18 },
};
export const getTravelTimeMinutes = (_line: "metro", fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS.metro;
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};
export const getHeadwayMinutes = (_line: "metro", date: Date): number => {
  const h = date.getHours(), d = date.getDay();
  return d >= 1 && d <= 5 && ((h >= 8 && h < 11) || (h >= 17 && h < 20)) ? PEAK_HEADWAY : OFF_PEAK_HEADWAY;
};
