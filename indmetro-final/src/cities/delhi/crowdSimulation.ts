import { getISTDate } from "@/lib/utils";
export type CrowdLevel = "low" | "moderate" | "high" | "very-high";
export interface CrowdEstimate { level: CrowdLevel; percentage: number; label: string; }

// Key station hourly patterns (0-23h). Others use DEFAULT.
const P: Record<string, number[]> = {
  //                            0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23
  rajiv_chowk:             [   5,  5,  5,  5,  5,  8, 15, 55, 80, 75, 72, 70, 72, 68, 65, 68, 72, 85, 88, 78, 62, 42, 25, 10],
  kashmere_gate:           [   5,  5,  5,  5,  5,  8, 15, 52, 75, 68, 62, 58, 62, 58, 55, 58, 62, 78, 80, 70, 55, 36, 20,  8],
  new_delhi:               [   5,  5,  5,  5,  5, 10, 18, 58, 78, 72, 68, 65, 68, 65, 62, 65, 68, 80, 82, 72, 58, 40, 22, 10],
  chandni_chowk:           [   5,  5,  5,  5,  5,  8, 14, 48, 68, 65, 65, 70, 72, 68, 65, 65, 65, 72, 72, 62, 50, 32, 18,  8],
  central_secretariat:     [   5,  5,  5,  5,  5,  8, 14, 50, 72, 68, 65, 62, 65, 62, 60, 62, 65, 75, 75, 65, 52, 34, 18,  8],
  hauz_khas:               [   5,  5,  5,  5,  5,  8, 14, 48, 70, 65, 60, 58, 62, 58, 55, 58, 62, 75, 75, 62, 50, 32, 18,  7],
  botanical_garden:        [   5,  5,  5,  5,  5,  8, 14, 52, 72, 65, 58, 55, 58, 55, 52, 55, 60, 75, 78, 65, 50, 32, 18,  7],
  dwarka_sec_21:           [   5,  5,  5,  5,  5,  8, 15, 60, 80, 68, 55, 48, 52, 48, 48, 52, 62, 82, 80, 65, 46, 26, 14,  6],
  noida_electronic_city:   [   5,  5,  5,  5,  5,  8, 15, 65, 85, 72, 60, 50, 52, 50, 52, 55, 68, 88, 85, 68, 48, 26, 12,  5],
  mandi_house:             [   5,  5,  5,  5,  5,  8, 14, 50, 70, 65, 62, 60, 62, 58, 55, 58, 62, 72, 72, 62, 50, 32, 18,  7],
  lajpat_nagar:            [   5,  5,  5,  5,  5,  8, 14, 48, 68, 62, 58, 55, 60, 56, 52, 55, 60, 72, 70, 60, 46, 28, 16,  7],
  igi_t3:                  [   5,  5,  5,  8, 12, 18, 28, 48, 58, 52, 50, 52, 55, 52, 50, 52, 55, 60, 65, 58, 50, 42, 30, 15],
  netaji_subhash_place:    [   5,  5,  5,  5,  5,  8, 14, 50, 70, 62, 55, 50, 55, 50, 48, 52, 58, 72, 72, 60, 46, 28, 15,  6],
  welcome:                 [   5,  5,  5,  5,  5,  8, 14, 48, 68, 60, 52, 48, 52, 48, 45, 48, 55, 68, 68, 58, 42, 25, 13,  5],
  majlis_park:             [   5,  5,  5,  5,  5,  8, 13, 42, 62, 55, 48, 44, 48, 44, 42, 45, 52, 65, 65, 52, 38, 22, 12,  5],
  vaishali:                [   5,  5,  5,  5,  5,  8, 14, 52, 72, 62, 52, 46, 50, 46, 44, 48, 56, 72, 72, 60, 42, 24, 12,  5],
  samaypur_badli:          [   5,  5,  5,  5,  5,  8, 13, 45, 65, 55, 46, 40, 44, 40, 38, 42, 50, 65, 65, 52, 36, 20, 10,  5],
  millennium_city_centre:  [   5,  5,  5,  5,  5,  8, 14, 50, 70, 62, 55, 50, 55, 50, 48, 52, 60, 75, 75, 62, 46, 26, 13,  5],
  rithala:                 [   5,  5,  5,  5,  5,  8, 13, 42, 60, 52, 44, 38, 42, 38, 36, 40, 48, 62, 62, 50, 34, 18,  9,  5],
  raja_nahar_singh:        [   5,  5,  5,  5,  5,  8, 13, 42, 60, 52, 44, 40, 44, 40, 38, 40, 48, 62, 60, 50, 34, 18,  9,  5],
};

const DEFAULT: number[] = [5,5,5,5,5,8,13,46,65,58,52,48,52,48,46,48,54,68,68,56,40,24,12,5];

export const getCrowdEstimate = (stationId: string): CrowdEstimate => {
  const hour = getISTDate().getHours();
  const pct  = (P[stationId] ?? DEFAULT)[hour] ?? 20;
  const level: CrowdLevel = pct < 30 ? "low" : pct < 55 ? "moderate" : pct < 78 ? "high" : "very-high";
  const labels: Record<CrowdLevel, string> = {
    low: "Quiet — plenty of seats", moderate: "Moderate — some seats",
    high: "Busy — standing room", "very-high": "Very crowded — peak rush",
  };
  return { level, percentage: pct, label: labels[level] };
};
