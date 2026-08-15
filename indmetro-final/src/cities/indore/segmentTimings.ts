/**
 * Indore Metro — Yellow Line Ring, segment timings
 *
 * Operational: stations 0–4 (5.9 km, ~8 min end-to-end)
 * Full ring: 33.53 km, estimated ~46 min full loop at avg 44 km/h
 *
 * Cumulative minutes from index 0 (Devi Ahilya Bai Holkar Terminal) clockwise.
 */
import { LINE_STATIONS } from "./metroData";

export const YELLOW_CUMULATIVE: number[] = [
  0,     // Devi Ahilya Bai Holkar Terminal
  2.0,   // Maharani Lakshmi Bai
  4.1,   // Rani Avanti Bai Lodhi
  6.2,   // Rani Durgavati
  8.2,   // Veerangana Jhalkari Bai  ← end of operational corridor
  10.1,  // Super Corridor-2 (WIP)
  12.0,  // Super Corridor-1
  13.8,  // Bhawarsala Square
  15.5,  // MR-10 Road
  17.2,  // ISBT / MR-10 Flyover
  18.9,  // Chandragupta Square
  20.5,  // Hira Nagar
  22.1,  // Bapat Square
  23.6,  // Meghdoot Garden
  25.0,  // Vijay Nagar Square
  26.4,  // Radisson Square
  27.7,  // Mumtaj Bag Colony
  28.9,  // Khajrana Square
  30.1,  // Bengali Square
  31.2,  // Patrakar Colony
  32.3,  // Palasia Square
  33.4,  // High Court
  34.5,  // Indore Railway Station
  35.6,  // Rajwada
  36.6,  // Chota Ganpati
  37.6,  // Bada Ganpati
  38.6,  // Ramchandra Nagar
  40.1,  // BSF / Kalani Nagar
  42.2,  // Airport
  // Ring: Airport back to Devi Ahilya Bai Terminal is ~46 min total
];

export const TOTAL_RING_MINUTES = 46.0;
export const PEAK_HEADWAY = 10;
export const OFF_PEAK_HEADWAY = 15;

export interface LineTiming {
  stations: string[];
  cumulativeMinutes: number[];
  totalMinutes: number;
  isRing: boolean;
}

export const LINE_TIMINGS: Record<"yellow", LineTiming> = {
  yellow: {
    stations: LINE_STATIONS.yellow,
    cumulativeMinutes: YELLOW_CUMULATIVE,
    totalMinutes: TOTAL_RING_MINUTES,
    isRing: true,
  },
};

/**
 * Ring-aware travel time — finds the shorter arc.
 */
export const getTravelTimeMinutes = (
  _line: "yellow",
  fromId: string,
  toId: string
): number | null => {
  const t = LINE_TIMINGS.yellow;
  const fi = t.stations.indexOf(fromId);
  const ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;

  const clockwise = ti >= fi
    ? t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]
    : TOTAL_RING_MINUTES - t.cumulativeMinutes[fi] + t.cumulativeMinutes[ti];

  const anticlockwise = TOTAL_RING_MINUTES - clockwise;
  return Math.min(clockwise, anticlockwise);
};

export const getClockwiseStops = (fromId: string, toId: string): number => {
  const arr = LINE_TIMINGS.yellow.stations;
  const fi = arr.indexOf(fromId), ti = arr.indexOf(toId);
  if (fi === -1 || ti === -1) return 0;
  return ti >= fi ? ti - fi : arr.length - fi + ti;
};

export const getHeadwayMinutes = (_line: "yellow", date: Date): number => {
  const h = date.getHours(), d = date.getDay();
  return d >= 1 && d <= 5 && ((h >= 8 && h < 11) || (h >= 17 && h < 20))
    ? PEAK_HEADWAY : OFF_PEAK_HEADWAY;
};
