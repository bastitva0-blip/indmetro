/**
 * Gurgaon Rapid Metro
 * Operator: DMRC (took over from RMGL, Oct 2019)
 * Rapid Line — 11 stations, 12.85 km, all elevated
 * Phase 1 (Nov 2013): Sikanderpur → DLF Phase 3
 * Phase 2 (Mar 2017): Sector 55-56 → Sikanderpur
 * Interchange: Sikanderpur ↔ Delhi Metro Yellow Line
 * All stations operational.
 */

export interface StationGate {
  id: string;
  description: string;
  hasLift?: boolean;
  hasRamp?: boolean;
}
export interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
  lines: ("rapid")[];
  isInterchange?: boolean;
  isUnderground?: boolean;
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = { rapid: "#00BCD4" } as const;
export const LINE_NAMES  = { rapid: "Rapid Line" } as const;

export const stations: Record<string, Station> = {
  sector_55_56:    { id: "sector_55_56",    name: "Sector 55-56",      coordinates: [28.4233, 77.1052], lines: ["rapid"] },
  sector_54_chowk: { id: "sector_54_chowk", name: "Sector 54 Chowk",   coordinates: [28.4329, 77.1049], lines: ["rapid"] },
  sector_53_54:    { id: "sector_53_54",    name: "Sector 53-54",       coordinates: [28.4464, 77.1004], lines: ["rapid"] },
  sector_42_43:    { id: "sector_42_43",    name: "Sector 42-43",       coordinates: [28.4574, 77.0969], lines: ["rapid"] },
  dlf_phase_1:     { id: "dlf_phase_1",     name: "DLF Phase 1",        coordinates: [28.4714, 77.0939], lines: ["rapid"] },
  sikanderpur:     { id: "sikanderpur",     name: "Sikanderpur",        coordinates: [28.4814, 77.0931], lines: ["rapid"], isInterchange: true,
    gates: [
      { id: "1", description: "MG Road, Sikanderpur metro crossing, towards DLF phase 4", hasLift: true, hasRamp: true },
      { id: "2", description: "Galleria DLF, Sikanderpur village side", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: false },
    platformInfo: {
      rapid: { number: 1, direction: "towards Sector 55-56" },
    },
  },
  dlf_phase_2:     { id: "dlf_phase_2",     name: "DLF Phase 2",        coordinates: [28.4842, 77.0932], lines: ["rapid"] },
  belvedere_towers:{ id: "belvedere_towers",name: "Belvedere Towers",   coordinates: [28.4871, 77.0933], lines: ["rapid"] },
  cyber_city:      { id: "cyber_city",      name: "Cyber City",         coordinates: [28.4901, 77.0934], lines: ["rapid"] },
  moulsari_avenue: { id: "moulsari_avenue", name: "Moulsari Avenue",    coordinates: [28.4918, 77.0935], lines: ["rapid"] },
  dlf_phase_3:     { id: "dlf_phase_3",     name: "DLF Phase 3",        coordinates: [28.4935, 77.0937], lines: ["rapid"] },
};

export const LINE_STATIONS: Record<"rapid", string[]> = {
  rapid: [
    "sector_55_56", "sector_54_chowk", "sector_53_54", "sector_42_43",
    "dlf_phase_1", "sikanderpur", "dlf_phase_2", "belvedere_towers",
    "cyber_city", "moulsari_avenue", "dlf_phase_3",
  ],
};

export const LINE_TERMINALS = {
  rapid: { start: "Sector 55-56", end: "DLF Phase 3" },
};

export const OPERATIONAL_STATIONS = new Set(Object.keys(stations));

export const getStationOptions = (): Station[] =>
  Object.values(stations).sort((a, b) => a.name.localeCompare(b.name));
