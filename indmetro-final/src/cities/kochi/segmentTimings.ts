/**
 * Kochi Metro — Segment Timings (Blue Line)
 * 27.96 km, 25 stations, all elevated. Operating speed: 80 km/h.
 * End-to-end journey time: ~55 min (incl. dwell time at each station ~30s).
 * Average commercial speed: ~30 km/h (accounting for stops + acceleration/braking).
 * Headway: 8 min (peak), 15 min (off-peak / early morning / late night).
 * First train 6:00 AM, last train 10:30 PM.
 * Sunday first train: 7:30 AM.
 *
 * Cumulative minutes derived from Wikipedia chainage data (km/30 km/h × 60).
 */
import { LINE_STATIONS } from "./metroData";

// Cumulative minutes from Aluva (station 1)
// Calculated: (chainageKm[n] - chainageKm[0]) / 30 km/h * 60 min
// Rounded to match realistic dwell-time-adjusted journey.
export const BLUE_CUMULATIVE: number[] = [
  0.0,   // Aluva
  3.5,   // Pulinchodu        (+3.5)
  5.5,   // Companypady       (+2.0)
  7.5,   // Ambattukavu       (+2.0)
  9.4,   // Muttom            (+1.9)
  13.5,  // Kalamassery       (+4.1)  ← 2km gap
  16.3,  // Cochin University (+2.8)
  18.8,  // Pathadipalam      (+2.5)
  21.6,  // Edapally          (+2.8)
  24.2,  // Changampuzha Park (+2.6)
  26.2,  // Palarivattom      (+2.0)
  28.4,  // JLN Stadium       (+2.2)
  30.5,  // Kaloor            (+2.1)
  31.4,  // Town Hall         (+0.9)  ← short 0.47km segment
  33.8,  // MG Road           (+2.4)
  36.2,  // Maharaja's College(+2.4)
  38.0,  // Ernakulam South   (+1.8)
  40.4,  // Kadavanthra       (+2.4)
  42.7,  // Elamkulam         (+2.3)
  45.6,  // Vyttila           (+2.9)
  47.6,  // Thaikoodam        (+2.0)
  50.0,  // Pettah            (+2.4)
  52.3,  // Vadakkekotta      (+2.3)
  54.1,  // SN Junction       (+1.8)
  55.9,  // Thrippunithura Terminal (+1.8)
];

export const PEAK_HEADWAY    = { blue: 8 };   // minutes
export const OFF_PEAK_HEADWAY = { blue: 15 };

export interface LineTiming {
  stations: string[];
  cumulativeMinutes: number[];
  totalMinutes: number;
}

export const LINE_TIMINGS: Record<"blue", LineTiming> = {
  blue: {
    stations: LINE_STATIONS.blue,
    cumulativeMinutes: BLUE_CUMULATIVE,
    totalMinutes: 55.9,
  },
};

export const getTravelTimeMinutes = (fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS.blue;
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const isPeakHour = (date: Date): boolean => {
  const h = date.getHours();
  return (h >= 7 && h <= 10) || (h >= 17 && h <= 20);
};

export const getHeadwayMinutes = (date: Date): number =>
  isPeakHour(date) ? PEAK_HEADWAY.blue : OFF_PEAK_HEADWAY.blue;
