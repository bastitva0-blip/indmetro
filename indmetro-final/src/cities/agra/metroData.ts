/**
 * Agra Metro (UPMRC)
 *
 * YELLOW LINE (Line 1) — Sikandra → Taj East Gate · 14.25 km · 13 stations
 *   Operational (6, Mar 2024): Taj East Gate → Mankameshwar (priority corridor, 6.5 km)
 *   Under Construction (7): Mankameshwar → Sikandra
 *
 * BLUE LINE (Line 2) — Agra Cantt → Kalindi Vihar · 15.4 km · 14 stations
 *   All under construction. Interchange with Yellow at Agra College.
 *
 * Sources: Wikipedia, UPMRC, metroagra.com (Aug 2026)
 */

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
  lines: ("yellow" | "blue")[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  isWIP?: boolean;
}

export const LINE_COLORS = {
  yellow: "#EAB308",
  blue: "#3B82F6",
} as const;

export const LINE_NAMES = {
  yellow: "Yellow Line",
  blue: "Blue Line",
} as const;

export const stations: Record<string, Station> = {

  // ── YELLOW LINE: Operational (priority corridor, Taj East Gate → Mankameshwar) ──
  taj_east_gate: {
    id: "taj_east_gate",
    name: "Taj East Gate",
    coordinates: [27.1712, 78.0424],
    lines: ["yellow"],
  },
  basai: {
    id: "basai",
    name: "Basai",
    coordinates: [27.1698, 78.0350],
    lines: ["yellow"],
  },
  fatehabad_road: {
    id: "fatehabad_road",
    name: "Fatehabad Road",
    coordinates: [27.1684, 78.0256],
    lines: ["yellow"],
  },
  taj_mahal: {
    id: "taj_mahal",
    name: "Taj Mahal",
    coordinates: [27.1684, 78.0178],
    lines: ["yellow"],
    isUnderground: true,
  },
  dr_ambedkar_chowk: {
    id: "dr_ambedkar_chowk",
    name: "Dr. Ambedkar Chowk",
    coordinates: [27.1775, 78.0113],
    lines: ["yellow"],
    isUnderground: true,
  },
  mankameshwar: {
    id: "mankameshwar",
    name: "Mankameshwar",
    coordinates: [27.1775, 78.0179],
    lines: ["yellow"],
    isUnderground: true,
  },

  // ── YELLOW LINE: Under Construction (toward Sikandra) ──
  medical_college: {
    id: "medical_college",
    name: "Medical College",
    coordinates: [27.1821, 78.0019],
    lines: ["yellow"],
    isUnderground: true,
    isWIP: true,
  },
  agra_college: {
    id: "agra_college",
    name: "Agra College",
    coordinates: [27.1868, 79.9925],
    lines: ["yellow", "blue"],
    isUnderground: true,
    isInterchange: true,
    isWIP: true,
  },
  raja_ki_mandi: {
    id: "raja_ki_mandi",
    name: "Raja Ki Mandi",
    coordinates: [27.1920, 79.9840],
    lines: ["yellow"],
    isUnderground: true,
    isWIP: true,
  },
  rbs_college: {
    id: "rbs_college",
    name: "RBS College",
    coordinates: [27.1975, 79.9762],
    lines: ["yellow"],
    isUnderground: true,
    isWIP: true,
  },
  isbt_agra: {
    id: "isbt_agra",
    name: "ISBT",
    coordinates: [27.2038, 79.9689],
    lines: ["yellow"],
    isWIP: true,
  },
  guru_ka_taal: {
    id: "guru_ka_taal",
    name: "Guru Ka Taal",
    coordinates: [27.2102, 79.9615],
    lines: ["yellow"],
    isWIP: true,
  },
  sikandra: {
    id: "sikandra",
    name: "Sikandra",
    coordinates: [27.2168, 79.9543],
    lines: ["yellow"],
    isWIP: true,
  },

  // ── BLUE LINE: All Under Construction ──
  agra_cantt: {
    id: "agra_cantt",
    name: "Agra Cantt",
    coordinates: [27.1559, 78.0081],
    lines: ["blue"],
    isWIP: true,
  },
  sultanpura: {
    id: "sultanpura",
    name: "Sultanpura",
    coordinates: [27.1623, 78.0015],
    lines: ["blue"],
    isWIP: true,
  },
  sadar_bazar: {
    id: "sadar_bazar",
    name: "Sadar Bazar",
    coordinates: [27.1682, 79.9952],
    lines: ["blue"],
    isWIP: true,
  },
  collectorate: {
    id: "collectorate",
    name: "Collectorate",
    coordinates: [27.1745, 79.9888],
    lines: ["blue"],
    isWIP: true,
  },
  subhash_park: {
    id: "subhash_park",
    name: "Subhash Park",
    coordinates: [27.1808, 79.9834],
    lines: ["blue"],
    isWIP: true,
  },
  st_johns: {
    id: "st_johns",
    name: "St. John's College",
    coordinates: [27.1858, 79.9887],
    lines: ["blue"],
    isWIP: true,
  },
  // agra_college is shared — already defined above
  pratap_pura: {
    id: "pratap_pura",
    name: "Pratap Pura",
    coordinates: [27.1921, 79.9934],
    lines: ["blue"],
    isWIP: true,
  },
  sanjay_place: {
    id: "sanjay_place",
    name: "Sanjay Place",
    coordinates: [27.1983, 79.9982],
    lines: ["blue"],
    isWIP: true,
  },
  awas_vikas: {
    id: "awas_vikas",
    name: "Awas Vikas",
    coordinates: [27.2048, 80.0038],
    lines: ["blue"],
    isWIP: true,
  },
  sikandra_road: {
    id: "sikandra_road",
    name: "Sikandra Road",
    coordinates: [27.2104, 80.0092],
    lines: ["blue"],
    isWIP: true,
  },
  bijli_ghar: {
    id: "bijli_ghar",
    name: "Bijli Ghar Chowk",
    coordinates: [27.2162, 80.0148],
    lines: ["blue"],
    isWIP: true,
  },
  shastri_nagar_agra: {
    id: "shastri_nagar_agra",
    name: "Shastri Nagar",
    coordinates: [27.2219, 80.0201],
    lines: ["blue"],
    isWIP: true,
  },
  kalindi_vihar: {
    id: "kalindi_vihar",
    name: "Kalindi Vihar",
    coordinates: [27.2278, 80.0255],
    lines: ["blue"],
    isWIP: true,
  },
};

export const LINE_STATIONS: Record<"yellow" | "blue", string[]> = {
  yellow: [
    "sikandra", "guru_ka_taal", "isbt_agra", "rbs_college",
    "raja_ki_mandi", "agra_college", "medical_college",
    "mankameshwar", "dr_ambedkar_chowk", "taj_mahal",
    "fatehabad_road", "basai", "taj_east_gate",
  ],
  blue: [
    "agra_cantt", "sultanpura", "sadar_bazar", "collectorate",
    "subhash_park", "st_johns", "agra_college", "pratap_pura",
    "sanjay_place", "awas_vikas", "sikandra_road", "bijli_ghar",
    "shastri_nagar_agra", "kalindi_vihar",
  ],
};

export const LINE_TERMINALS: Record<"yellow" | "blue", { start: string; end: string }> = {
  yellow: { start: "Sikandra", end: "Taj East Gate" },
  blue: { start: "Agra Cantt", end: "Kalindi Vihar" },
};

export const OPERATIONAL_STATIONS = new Set([
  "taj_east_gate", "basai", "fatehabad_road",
  "taj_mahal", "dr_ambedkar_chowk", "mankameshwar",
]);

export const getStationOptions = (includeWIP = false): Station[] =>
  Object.values(stations)
    .filter((s) => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));

export const getOrganizedStations = () =>
  (Object.keys(LINE_STATIONS) as ("yellow" | "blue")[]).map((line) => ({
    line,
    lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map((id) => stations[id]).filter(Boolean),
  }));
