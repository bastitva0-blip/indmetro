/**
 * Bangalore Metro — Segment Timings
 *
 * PURPLE LINE: Whitefield → Challaghatta, 37 stations, ~65 min end-to-end
 * GREEN LINE:  Madavara → Silk Institute, 29 stations, ~48 min end-to-end
 * YELLOW LINE: RV Road → Bommasandra, 16 stations, ~35 min end-to-end
 *
 * Underground stations (Purple: MG Road, Cubbon Park, Vidhana Soudha, Sir MV, Majestic)
 * run slightly slower due to grade changes.
 *
 * Source: BMRCL official timetable, bengalurumetrolines.in (Aug 2026)
 */

import { LINE_STATIONS } from "./metroData";

// Purple Line: Whitefield (E) → Challaghatta (W)
export const PURPLE_LINE_CUMULATIVE_MINUTES: number[] = [
  0,    // Whitefield (Kadugodi)
  2.0,  // Sri Sathya Sai Hospital
  4.0,  // Hopefarm Channasandra
  6.0,  // Kadugodi Tree Park
  8.0,  // Pattandur Agrahara
  10.0, // Nallurhalli
  12.0, // Seetharampalya
  14.0, // Kundalahalli
  16.0, // Brookefield
  18.0, // ITPL Main
  20.0, // Graphite India
  22.0, // KR Puram
  24.0, // Tin Factory
  25.5, // Baiyappanahalli
  28.0, // Swami Vivekananda Road
  30.0, // Indiranagar
  32.0, // Halasuru
  34.0, // Trinity
  36.0, // MG Road (underground, slightly slower)
  38.5, // Cubbon Park
  40.5, // Vidhana Soudha
  42.5, // Sir M. Visveswaraya
  44.5, // Majestic / Nadaprabhu Kempegowda (interchange)
  46.5, // Krantivira Sangolli Rayanna (City Rly Station)
  48.5, // Magadi Road
  51.0, // Hosahalli
  53.0, // Vijayanagar
  55.0, // Attiguppe
  57.0, // Deepanjali Nagar
  59.0, // Mysore Road
  61.0, // Pantharapalya
  63.0, // Nayandahalli
  65.0, // Rajarajeshwari Nagar
  67.0, // Jnana Bharathi
  68.5, // Kengeri Bus Terminal
  70.0, // Kengeri
  72.0, // Challaghatta
];

// Green Line: Madavara (N) → Silk Institute (S)
export const GREEN_LINE_CUMULATIVE_MINUTES: number[] = [
  0,    // Madavara
  2.0,  // Chikkabidarakallu
  4.0,  // Manjunathanagar
  6.0,  // Nagasandra
  8.0,  // Dasarahalli
  10.0, // Jalahalli
  12.0, // Peenya Industry
  14.0, // Peenya
  16.0, // Goraguntepalya
  18.0, // Yeshwanthpur
  20.0, // Sandal Soap Factory
  22.0, // Mahalakshmi
  24.0, // Rajajinagar
  26.0, // Mahakavi Kuvempu Road
  28.0, // Srirampura
  30.0, // Majestic / Nadaprabhu Kempegowda (underground, interchange)
  32.5, // Chickpete
  34.5, // KR Market
  36.5, // National College
  38.5, // Lalbagh
  40.5, // South End Circle
  42.5, // Jayanagar
  44.5, // RV Road (interchange)
  46.5, // Yelachenahalli
  48.5, // Banashankari
  50.5, // JP Nagar
  52.5, // Puttenahalli
  54.5, // Hulimavu
  56.5, // Silk Institute
];

// Yellow Line: RV Road (N) → Bommasandra (S)
export const YELLOW_LINE_CUMULATIVE_MINUTES: number[] = [
  0,    // RV Road (interchange)
  2.5,  // Ragigudda
  4.5,  // Jayadeva Hospital
  6.5,  // BTM Layout
  8.5,  // Central Silk Board
  10.5, // Bommanahalli
  12.5, // Hongasandra
  14.5, // Kudlu Gate
  16.5, // Singasandra
  18.5, // Hosa Road
  20.5, // Beratena Agrahara
  22.5, // Electronic City
  24.5, // Infosys Agrahara
  26.5, // Huskur Road
  28.5, // Biocon Hebbagodi
  30.5, // Delta Electronics Bommasandra
];

export const PEAK_HEADWAY_MINUTES    = { purple: 5, green: 5, yellow: 7  };
export const OFF_PEAK_HEADWAY_MINUTES = { purple: 10, green: 10, yellow: 12 };

export interface LineTiming {
  stations: string[];
  cumulativeMinutes: number[];
  totalMinutes: number;
}

export const LINE_TIMINGS: Record<"purple" | "green" | "yellow", LineTiming> = {
  purple: { stations: LINE_STATIONS.purple, cumulativeMinutes: PURPLE_LINE_CUMULATIVE_MINUTES, totalMinutes: 72 },
  green:  { stations: LINE_STATIONS.green,  cumulativeMinutes: GREEN_LINE_CUMULATIVE_MINUTES,  totalMinutes: 56.5 },
  yellow: { stations: LINE_STATIONS.yellow, cumulativeMinutes: YELLOW_LINE_CUMULATIVE_MINUTES, totalMinutes: 30.5 },
};

export const getTravelTimeMinutes = (
  line: "purple" | "green" | "yellow",
  fromId: string,
  toId: string
): number | null => {
  const t  = LINE_TIMINGS[line];
  const fi = t.stations.indexOf(fromId);
  const ti = t.stations.indexOf(toId);
  if (fi === -1 || ti === -1) return null;
  return Math.abs(t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]);
};

export const getStationIndexOnLine = (line: "purple" | "green" | "yellow", stationId: string): number =>
  LINE_TIMINGS[line].stations.indexOf(stationId);

export const getHeadwayMinutes = (line: "purple" | "green" | "yellow", date: Date): number => {
  const hour = date.getHours();
  const day  = date.getDay();
  const isPeak = day >= 1 && day <= 5 && ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 21));
  return isPeak ? PEAK_HEADWAY_MINUTES[line] : OFF_PEAK_HEADWAY_MINUTES[line];
};

export const INTERCHANGE_TRANSFER_MINUTES = 5; // platform walk time
