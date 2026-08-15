/**
 * Navi Mumbai Metro — Segment Timings (Line 1)
 * 11.1 km · 11 stations · All elevated
 * End-to-end: ~22 min · Headway: 15 min (all day, no peak/off-peak difference)
 * Timings: 6:00–22:00 daily
 */
import { LINE_STATIONS } from "./metroData";

// Cumulative minutes from CBD Belapur (skill data)
export const LINE1_CUMULATIVE: number[] = [0, 2.5, 5, 7.5, 9, 10.5, 12, 14, 16, 19, 22];

export const HEADWAY = { line1: 15 }; // flat all day

export interface LineTiming {
  stations: string[]; cumulativeMinutes: number[]; totalMinutes: number;
}

export const LINE_TIMINGS: Record<"line1", LineTiming> = {
  line1: {
    stations: LINE_STATIONS.line1,
    cumulativeMinutes: LINE1_CUMULATIVE,
    totalMinutes: 22,
  },
};

export const getTravelTimeMinutes = (fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS.line1;
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const getHeadwayMinutes = (): number => HEADWAY.line1;
