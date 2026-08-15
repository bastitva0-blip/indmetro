/**
 * Jaipur Metro — Metro Data
 *
 * PINK LINE — Mansarovar ↔ Badi Chaupar · 11.97 km · 11 stations
 *   Phase 1A (9 stations, elevated): Mansarovar → Chandpole — Operational 3 Jun 2015
 *   Phase 1B (2 stations, underground): Chhoti Chaupar + Badi Chaupar — Operational 23 Sep 2020
 *
 * Operator: Jaipur Metro Rail Corporation Limited (JMRC)
 * Sources: Wikipedia, JMRC, trainhelp.in (Aug 2026)
 */

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  lines: ("pink")[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  isWIP?: boolean;
}

export const LINE_COLORS = {
  pink: "#E91E8C",
} as const;

export const LINE_NAMES = {
  pink: "Pink Line",
} as const;

export const stations: Record<string, Station> = {

  // ── PINK LINE: Phase 1A — Operational (3 Jun 2015, elevated) ─────────────
  mansarovar: {
    id: "mansarovar",
    name: "Mansarovar",
    coordinates: [26.879531, 75.749971],
    lines: ["pink"],
  },
  new_aatish_market: {
    id: "new_aatish_market",
    name: "New Aatish Market",
    coordinates: [26.880308, 75.764602],
    lines: ["pink"],
  },
  vivek_vihar: {
    id: "vivek_vihar",
    name: "Vivek Vihar",
    coordinates: [26.888952, 75.768499],
    lines: ["pink"],
  },
  shyam_nagar: {
    id: "shyam_nagar",
    name: "Shyam Nagar",
    coordinates: [26.896650, 75.770667],
    lines: ["pink"],
  },
  ram_nagar: {
    id: "ram_nagar",
    name: "Ram Nagar",
    coordinates: [26.901944, 75.774652],
    lines: ["pink"],
  },
  civil_lines: {
    id: "civil_lines",
    name: "Civil Lines",
    coordinates: [26.909585, 75.781277],
    lines: ["pink"],
  },
  railway_station: {
    id: "railway_station",
    name: "Railway Station",
    coordinates: [26.918559, 75.789903],
    lines: ["pink"],
  },
  sindhi_camp: {
    id: "sindhi_camp",
    name: "Sindhi Camp",
    coordinates: [26.922563, 75.799747],
    lines: ["pink"],
  },
  chandpole: {
    id: "chandpole",
    name: "Chandpole",
    coordinates: [26.926370, 75.807456],
    lines: ["pink"],
    isUnderground: true,
  },

  // ── PINK LINE: Phase 1B — Operational (23 Sep 2020, underground) ─────────
  chhoti_chaupar: {
    id: "chhoti_chaupar",
    name: "Chhoti Chaupar",
    coordinates: [26.924720, 75.818456],
    lines: ["pink"],
    isUnderground: true,
  },
  badi_chaupar: {
    id: "badi_chaupar",
    name: "Badi Chaupar",
    coordinates: [26.922960, 75.826814],
    lines: ["pink"],
    isUnderground: true,
  },
};

// Pink Line order: Mansarovar (West) → Badi Chaupar (East)
export const LINE_STATIONS: Record<"pink", string[]> = {
  pink: [
    "mansarovar",
    "new_aatish_market",
    "vivek_vihar",
    "shyam_nagar",
    "ram_nagar",
    "civil_lines",
    "railway_station",
    "sindhi_camp",
    "chandpole",
    "chhoti_chaupar",
    "badi_chaupar",
  ],
};

export const LINE_TERMINALS: Record<"pink", { start: string; end: string }> = {
  pink: { start: "Mansarovar", end: "Badi Chaupar" },
};

// All 11 stations are operational
export const OPERATIONAL_STATIONS = new Set(Object.keys(stations));

export const getStationOptions = (includeWIP = false): Station[] =>
  Object.values(stations)
    .filter((s) => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));

export const getOrganizedStations = (): {
  line: "pink";
  lineName: string;
  stations: Station[];
}[] =>
  (Object.keys(LINE_STATIONS) as "pink"[]).map((line) => ({
    line,
    lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map((id) => stations[id]).filter(Boolean),
  }));
