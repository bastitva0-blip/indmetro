/**
 * Pune Metro — MahaMetro
 *
 * PURPLE LINE (Line 1) — PCMC Bhavan ↔ Swargate · 14.97 km · 14 stations
 *   Elevated: PCMC Bhavan → Range Hills (9 stations, Phase 1)
 *   Underground: Shivajinagar → Swargate (5 stations, Phase 1)
 *   Fully operational.
 *
 * AQUA LINE (Line 2) — Vanaz ↔ Ramwadi · 16.59 km · 16 stations
 *   All elevated. Fully operational.
 *
 * No interchange between the two lines (Pink Line UC will add one at Swargate ↔ Swargate area).
 * Operator: MahaMetro (Maharashtra Metro Rail Corporation Limited)
 * Sources: Wikipedia, MahaMetro official, trainhelp.in (Aug 2026)
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
  lines: ("purple" | "aqua")[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  isWIP?: boolean;
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = {
  purple: "#9C27B0",
  aqua:   "#00BCD4",
} as const;

export const LINE_NAMES = {
  purple: "Purple Line",
  aqua:   "Aqua Line",
} as const;

export const stations: Record<string, Station> = {

  // ── PURPLE LINE (Line 1) ─────────────────────────────────────────────────

  // Elevated section: PCMC Bhavan → Range Hills
  pcmc_bhavan: {
    id: "pcmc_bhavan",
    name: "PCMC Bhavan",
    coordinates: [18.6279, 73.8059],
    lines: ["purple"],
  },
  sant_tukaram_nagar: {
    id: "sant_tukaram_nagar",
    name: "Sant Tukaram Nagar",
    coordinates: [18.6195, 73.8018],
    lines: ["purple"],
  },
  bhosari: {
    id: "bhosari",
    name: "Bhosari",
    coordinates: [18.6098, 73.7988],
    lines: ["purple"],
  },
  kasarwadi: {
    id: "kasarwadi",
    name: "Kasarwadi",
    coordinates: [18.6008, 73.7972],
    lines: ["purple"],
  },
  phugewadi: {
    id: "phugewadi",
    name: "Phugewadi",
    coordinates: [18.5918, 73.7958],
    lines: ["purple"],
  },
  dapodi: {
    id: "dapodi",
    name: "Dapodi",
    coordinates: [18.5828, 73.7958],
    lines: ["purple"],
  },
  bopodi: {
    id: "bopodi",
    name: "Bopodi",
    coordinates: [18.5738, 73.7978],
    lines: ["purple"],
  },
  khadki: {
    id: "khadki",
    name: "Khadki",
    coordinates: [18.5658, 73.8238],
    lines: ["purple"],
  },
  range_hills: {
    id: "range_hills",
    name: "Range Hills",
    coordinates: [18.5578, 73.8318],
    lines: ["purple"],
  },

  // Underground section: Shivajinagar → Swargate
  shivajinagar: {
    id: "shivajinagar",
    name: "Shivajinagar",
    coordinates: [18.5328, 73.8468],
    lines: ["purple"],
    isUnderground: true,
  },
  civil_court: {
    id: "civil_court",
    name: "Civil Court",
    coordinates: [18.5228, 73.8548],
    lines: ["purple"],
    isUnderground: true,
  },
  budhwar_peth: {
    id: "budhwar_peth",
    name: "Budhwar Peth",
    coordinates: [18.5148, 73.8558],
    lines: ["purple"],
    isUnderground: true,
  },
  mandai: {
    id: "mandai",
    name: "Mandai",
    coordinates: [18.5098, 73.8568],
    lines: ["purple"],
    isUnderground: true,
  },
  swargate: {
    id: "swargate",
    name: "Swargate",
    coordinates: [18.5018, 73.8608],
    lines: ["purple"],
    isUnderground: true,
  },

  // ── AQUA LINE (Line 2) ───────────────────────────────────────────────────
  // All elevated
  vanaz: {
    id: "vanaz",
    name: "Vanaz",
    coordinates: [18.5038, 73.8002],
    lines: ["aqua"],
  },
  anand_nagar: {
    id: "anand_nagar",
    name: "Anand Nagar",
    coordinates: [18.5098, 73.8098],
    lines: ["aqua"],
  },
  ideal_colony: {
    id: "ideal_colony",
    name: "Ideal Colony",
    coordinates: [18.5148, 73.8218],
    lines: ["aqua"],
  },
  nal_stop: {
    id: "nal_stop",
    name: "Nal Stop",
    coordinates: [18.5168, 73.8338],
    lines: ["aqua"],
  },
  garware_college: {
    id: "garware_college",
    name: "Garware College",
    coordinates: [18.5178, 73.8438],
    lines: ["aqua"],
  },
  deccan_gymkhana: {
    id: "deccan_gymkhana",
    name: "Deccan Gymkhana",
    coordinates: [18.5188, 73.8518],
    lines: ["aqua"],
  },
  chhatrapati_sambhaji_chowk: {
    id: "chhatrapati_sambhaji_chowk",
    name: "Chhatrapati Sambhaji Chowk",
    coordinates: [18.5205, 73.8598],
    lines: ["aqua"],
  },
  pmc: {
    id: "pmc",
    name: "PMC",
    coordinates: [18.5202, 73.8678],
    lines: ["aqua"],
  },
  mangalwar_peth: {
    id: "mangalwar_peth",
    name: "Mangalwar Peth",
    coordinates: [18.5198, 73.8758],
    lines: ["aqua"],
  },
  pune_railway_station: {
    id: "pune_railway_station",
    name: "Pune Railway Station",
    coordinates: [18.5280, 73.8742],
    lines: ["aqua"],
  },
  ruby_hall_clinic: {
    id: "ruby_hall_clinic",
    name: "Ruby Hall Clinic",
    coordinates: [18.5358, 73.8792],
    lines: ["aqua"],
  },
  bund_garden: {
    id: "bund_garden",
    name: "Bund Garden",
    coordinates: [18.5438, 73.8838],
    lines: ["aqua"],
  },
  yerawada: {
    id: "yerawada",
    name: "Yerawada",
    coordinates: [18.5518, 73.8878],
    lines: ["aqua"],
  },
  nagar_road: {
    id: "nagar_road",
    name: "Nagar Road",
    coordinates: [18.5598, 73.8968],
    lines: ["aqua"],
  },
  bopkhel: {
    id: "bopkhel",
    name: "Bopkhel",
    coordinates: [18.5668, 73.9038],
    lines: ["aqua"],
  },
  ramwadi: {
    id: "ramwadi",
    name: "Ramwadi",
    coordinates: [18.5738, 73.9118],
    lines: ["aqua"],
  },
};

export const LINE_STATIONS: Record<"purple" | "aqua", string[]> = {
  purple: [
    "pcmc_bhavan", "sant_tukaram_nagar", "bhosari", "kasarwadi",
    "phugewadi", "dapodi", "bopodi", "khadki", "range_hills",
    "shivajinagar", "civil_court", "budhwar_peth", "mandai", "swargate",
  ],
  aqua: [
    "vanaz", "anand_nagar", "ideal_colony", "nal_stop",
    "garware_college", "deccan_gymkhana", "chhatrapati_sambhaji_chowk",
    "pmc", "mangalwar_peth", "pune_railway_station", "ruby_hall_clinic",
    "bund_garden", "yerawada", "nagar_road", "bopkhel", "ramwadi",
  ],
};

export const LINE_TERMINALS: Record<"purple" | "aqua", { start: string; end: string }> = {
  purple: { start: "PCMC Bhavan", end: "Swargate" },
  aqua:   { start: "Vanaz", end: "Ramwadi" },
};

// All 30 stations are operational
export const OPERATIONAL_STATIONS = new Set(Object.keys(stations));

export const getStationOptions = (line?: "purple" | "aqua"): Station[] => {
  const all = Object.values(stations);
  if (!line) return all.sort((a, b) => a.name.localeCompare(b.name));
  return LINE_STATIONS[line].map((id) => stations[id]).filter(Boolean);
};

export const getStationLine = (stationId: string): "purple" | "aqua" | null => {
  if (LINE_STATIONS.purple.includes(stationId)) return "purple";
  if (LINE_STATIONS.aqua.includes(stationId)) return "aqua";
  return null;
};
