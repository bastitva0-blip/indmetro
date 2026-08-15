/**
 * Patna Metro — Segment Timings
 * Blue Line: 14.56 km, 12 stations, avg speed ~30 km/h → ~29 min end-to-end
 *   Operational corridor (Bhootnath → New ISBT, 3.6 km): ~7.2 min
 *   Each operational segment ~3.5–3.7 min at elevated speed
 * Red Line: 16.86 km, 14 stations (all WIP) → ~34 min est.
 * Headway: 20 min (current operational frequency)
 */
import { LINE_STATIONS } from "./metroData";

// Blue Line cumulative minutes from Patna Junction (index 0)
// Underground section slower (~28 km/h), elevated faster (~35 km/h)
export const BLUE_CUMULATIVE: number[] = [
  0,     // Patna Junction
  2.3,   // Akashvani
  4.8,   // Gandhi Maidan
  6.9,   // PMCH
  8.7,   // University
  11.2,  // Moin-ul-Haq Stadium
  13.4,  // Rajendra Nagar
  15.8,  // Malahi Pakri
  18.0,  // Khemnichak
  20.5,  // Bhootnath      ← start of operational section
  23.9,  // Zero Mile
  27.2,  // Patliputra Bus Terminal (New ISBT)
];

// Red Line cumulative minutes from Danapur Cantonment (index 0)
export const RED_CUMULATIVE: number[] = [
  0,     // Danapur Cantonment
  2.8,   // Saguna Mor
  5.4,   // RPS Mor
  7.8,   // Patliputra
  10.0,  // Rukanpura
  12.0,  // Raja Bazar
  13.8,  // Patna Zoo
  15.5,  // Vikas Bhawan
  17.1,  // Vidyut Bhawan
  19.0,  // Patna Junction (interchange)
  21.3,  // Mithapur
  23.4,  // Ramkrishna Nagar
  25.3,  // Jaganpura
  27.2,  // Khemnichak (interchange)
];

export const PEAK_HEADWAY = { blue: 20, red: 20 };
export const OFF_PEAK_HEADWAY = { blue: 20, red: 20 };

export interface LineTiming {
  stations: string[]; cumulativeMinutes: number[]; totalMinutes: number;
}
export const LINE_TIMINGS: Record<"blue" | "red", LineTiming> = {
  blue: { stations: LINE_STATIONS.blue, cumulativeMinutes: BLUE_CUMULATIVE, totalMinutes: 27.2 },
  red:  { stations: LINE_STATIONS.red,  cumulativeMinutes: RED_CUMULATIVE,  totalMinutes: 27.2 },
};

export const getTravelTimeMinutes = (line: "blue" | "red", fromId: string, toId: string): number | null => {
  const t = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId), ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const getHeadwayMinutes = (line: "blue" | "red", _date: Date): number => {
  // Currently fixed at 20 min; will update when more trains added
  return PEAK_HEADWAY[line];
};
