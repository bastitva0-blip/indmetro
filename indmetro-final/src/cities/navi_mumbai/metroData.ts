/**
 * Navi Mumbai Metro — Line 1
 * Operator: CIDCO (City & Industrial Development Corporation) / Konkan Railway (O&M)
 * Line 1: CBD Belapur → Pendhar · 11.1 km · 11 stations · All elevated
 * ALL OPERATIONAL (opened 17 Nov 2023)
 * Smart Card: CIDCO Metro Card (NCMC compatible) · 10% discount
 * Headway: 15 min (flat, all hours)
 * Timings: 6:00–22:00 daily
 * Interchange: CBD Belapur ↔ Central Railway Harbour Line
 * Future: Amandoot ↔ future Navi Mumbai Metro Orange Line
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
  coordinates: [number, number]; // [lat, lng]
  lines: ("line1")[];
  isTerminal?: boolean;
  hasRailTransfer?: boolean;
  hasFutureInterchange?: boolean;
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = { line1: "#FFC107" } as const;
export const LINE_NAMES  = { line1: "Line 1" } as const;

export const stations: Record<string, Station> = {
  cbd_belapur: {
    id: "cbd_belapur", name: "CBD Belapur",
    coordinates: [19.0173, 73.0352], lines: ["line1"],
    isTerminal: true, hasRailTransfer: true, // ↔ Central Railway Harbour Line
  },
  rbi_colony: {
    id: "rbi_colony", name: "RBI Colony",
    coordinates: [19.0223, 73.0415], lines: ["line1"],
  },
  belpada: {
    id: "belpada", name: "Belpada",
    coordinates: [19.0308, 73.0508], lines: ["line1"],
  },
  utsav_chowk: {
    id: "utsav_chowk", name: "Utsav Chowk",
    coordinates: [19.0408, 73.0578], lines: ["line1"],
  },
  kendriya_vihar: {
    id: "kendriya_vihar", name: "Kendriya Vihar",
    coordinates: [19.0468, 73.0622], lines: ["line1"],
  },
  kharghar_village: {
    id: "kharghar_village", name: "Kharghar Village",
    coordinates: [19.0538, 73.0672], lines: ["line1"],
  },
  central_park_kharghar: {
    id: "central_park_kharghar", name: "Central Park",
    coordinates: [19.0618, 73.0735], lines: ["line1"],
  },
  pethpada: {
    id: "pethpada", name: "Pethpada",
    coordinates: [19.0718, 73.0808], lines: ["line1"],
  },
  amandoot: {
    id: "amandoot", name: "Amandoot",
    coordinates: [19.0818, 73.0878], lines: ["line1"],
    hasFutureInterchange: true, // future Orange Line
  },
  pethali_taloja: {
    id: "pethali_taloja", name: "Pethali - Taloja",
    coordinates: [19.0938, 73.0958], lines: ["line1"],
  },
  pendhar: {
    id: "pendhar", name: "Pendhar",
    coordinates: [19.1018, 73.1018], lines: ["line1"],
    isTerminal: true,
  },
};

export const LINE_STATIONS: Record<"line1", string[]> = {
  line1: [
    "cbd_belapur", "rbi_colony", "belpada", "utsav_chowk",
    "kendriya_vihar", "kharghar_village", "central_park_kharghar",
    "pethpada", "amandoot", "pethali_taloja", "pendhar",
  ],
};

export const LINE_TERMINALS = {
  line1: { start: "CBD Belapur", end: "Pendhar" },
};

export const OPERATIONAL_STATIONS = new Set(LINE_STATIONS.line1);

export const getStationOptions = (): Station[] =>
  Object.values(stations).sort((a, b) => a.name.localeCompare(b.name));

export const getOrganizedStations = () => [
  {
    line: "line1" as const,
    lineName: LINE_NAMES.line1,
    stations: LINE_STATIONS.line1.map(id => stations[id]),
  },
];
