/**
 * Kanpur Metro
 *
 * ORANGE LINE (Line 1) — IIT Kanpur → Naubasta · 23.785 km · 22 stations
 *   Operational (Phase 1A, Dec 2021): IIT Kanpur → Moti Jheel (9 stations, elevated)
 *   Operational (Phase 1B, May 2025): Chunniganj → Kanpur Central (5 underground stations)
 *   Under construction: Jhakarkati → Naubasta (8 stations)
 *
 * BLUE LINE (Line 2) — Agriculture University → Barra-8 · 8.6 km · 8 stations
 *   All under construction (started late 2023). Interchange at Rawatpur.
 *   Tender passed; fast-track construction ongoing.
 *
 * Sources: Wikipedia, UPMRC, mymetro.in, metrorailnews.in (Aug 2026)
 */

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
  lines: ("orange" | "blue")[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  isWIP?: boolean;
}

export const LINE_COLORS = {
  orange: "#F97316",
  blue: "#3B82F6",
} as const;

export const LINE_NAMES = {
  orange: "Orange Line",
  blue: "Blue Line",
} as const;

export const stations: Record<string, Station> = {

  // ── ORANGE LINE: Phase 1A — Operational (Dec 2021) ────────────────────────
  iit_kanpur: {
    id: "iit_kanpur",
    name: "IIT Kanpur",
    coordinates: [26.5123, 80.2329],
    lines: ["orange"],
  },
  kalyanpur: {
    id: "kalyanpur",
    name: "Kalyanpur",
    coordinates: [26.5009, 80.2538],
    lines: ["orange"],
  },
  spm_hospital: {
    id: "spm_hospital",
    name: "SPM Hospital",
    coordinates: [26.4942, 80.2696],
    lines: ["orange"],
  },
  vishwavidyalaya: {
    id: "vishwavidyalaya",
    name: "Vishwavidyalaya",
    coordinates: [26.4879, 80.2853],
    lines: ["orange"],
  },
  gurudev_chauraha: {
    id: "gurudev_chauraha",
    name: "Gurudev Chauraha",
    coordinates: [26.4822, 80.3008],
    lines: ["orange"],
  },
  geeta_nagar: {
    id: "geeta_nagar",
    name: "Geeta Nagar",
    coordinates: [26.4769, 80.3142],
    lines: ["orange"],
  },
  rawatpur: {
    id: "rawatpur",
    name: "Rawatpur",
    coordinates: [26.4705, 80.3286],
    lines: ["orange", "blue"],
    isInterchange: true,
  },
  llr_hospital: {
    id: "llr_hospital",
    name: "LLR Hospital",
    coordinates: [26.4614, 80.3392],
    lines: ["orange"],
  },
  moti_jheel: {
    id: "moti_jheel",
    name: "Moti Jheel",
    coordinates: [26.4566, 80.3468],
    lines: ["orange"],
  },

  // ── ORANGE LINE: Phase 1B — Operational (May 2025, underground) ───────────
  chunniganj: {
    id: "chunniganj",
    name: "Chunniganj",
    coordinates: [26.4543, 80.3550],
    lines: ["orange"],
    isUnderground: true,
  },
  naveen_market: {
    id: "naveen_market",
    name: "Naveen Market",
    coordinates: [26.4511, 80.3614],
    lines: ["orange"],
    isUnderground: true,
  },
  bada_chauraha: {
    id: "bada_chauraha",
    name: "Bada Chauraha",
    coordinates: [26.4478, 80.3671],
    lines: ["orange"],
    isUnderground: true,
  },
  nayaganj: {
    id: "nayaganj",
    name: "Nayaganj",
    coordinates: [26.4447, 80.3728],
    lines: ["orange"],
    isUnderground: true,
  },
  kanpur_central: {
    id: "kanpur_central",
    name: "Kanpur Central",
    coordinates: [26.4418, 80.3786],
    lines: ["orange"],
    isUnderground: true,
  },

  // ── ORANGE LINE: Under Construction → Naubasta ────────────────────────────
  jhakarkati: {
    id: "jhakarkati",
    name: "Jhakarkati Bus Terminal",
    coordinates: [26.4378, 80.3862],
    lines: ["orange"],
    isUnderground: true,
    isWIP: true,
  },
  transport_nagar: {
    id: "transport_nagar",
    name: "Transport Nagar",
    coordinates: [26.4339, 80.3941],
    lines: ["orange"],
    isUnderground: true,
    isWIP: true,
  },
  bara_devi: {
    id: "bara_devi",
    name: "Bara Devi",
    coordinates: [26.4298, 80.4028],
    lines: ["orange"],
    isWIP: true,
  },
  kidwai_nagar: {
    id: "kidwai_nagar",
    name: "Kidwai Nagar",
    coordinates: [26.4257, 80.4114],
    lines: ["orange"],
    isWIP: true,
  },
  vasant_vihar: {
    id: "vasant_vihar",
    name: "Vasant Vihar",
    coordinates: [26.4214, 80.4201],
    lines: ["orange"],
    isWIP: true,
  },
  dada_nagar_o: {
    id: "dada_nagar_o",
    name: "Dada Nagar",
    coordinates: [26.4169, 80.4286],
    lines: ["orange"],
    isWIP: true,
  },
  mandhana: {
    id: "mandhana",
    name: "Mandhana",
    coordinates: [26.4122, 80.4369],
    lines: ["orange"],
    isWIP: true,
  },
  naubasta: {
    id: "naubasta",
    name: "Naubasta",
    coordinates: [26.4073, 80.4451],
    lines: ["orange"],
    isWIP: true,
  },

  // ── BLUE LINE: Under Construction ─────────────────────────────────────────
  agriculture_university: {
    id: "agriculture_university",
    name: "Agriculture University",
    coordinates: [26.4951, 80.2874],
    lines: ["blue"],
    isUnderground: true,
    isWIP: true,
  },
  // rawatpur is shared with orange — already defined above
  kakadeo: {
    id: "kakadeo",
    name: "Kakadeo",
    coordinates: [26.4621, 80.3195],
    lines: ["blue"],
    isUnderground: true,
    isWIP: true,
  },
  double_pulia: {
    id: "double_pulia",
    name: "Double Pulia",
    coordinates: [26.4534, 80.3098],
    lines: ["blue"],
    isUnderground: true,
    isWIP: true,
  },
  vijay_nagar_chauraha: {
    id: "vijay_nagar_chauraha",
    name: "Vijay Nagar Chauraha",
    coordinates: [26.4441, 80.2984],
    lines: ["blue"],
    isWIP: true,
  },
  shastri_chowk: {
    id: "shastri_chowk",
    name: "Shastri Chowk",
    coordinates: [26.4356, 80.2871],
    lines: ["blue"],
    isWIP: true,
  },
  barra_7: {
    id: "barra_7",
    name: "Barra-7",
    coordinates: [26.4271, 80.2762],
    lines: ["blue"],
    isWIP: true,
  },
  barra_8: {
    id: "barra_8",
    name: "Barra-8",
    coordinates: [26.4188, 80.2649],
    lines: ["blue"],
    isWIP: true,
  },
};

// Orange Line station order (IIT Kanpur → Naubasta)
export const LINE_STATIONS: Record<"orange" | "blue", string[]> = {
  orange: [
    "iit_kanpur", "kalyanpur", "spm_hospital", "vishwavidyalaya",
    "gurudev_chauraha", "geeta_nagar", "rawatpur", "llr_hospital",
    "moti_jheel", "chunniganj", "naveen_market", "bada_chauraha",
    "nayaganj", "kanpur_central", "jhakarkati", "transport_nagar",
    "bara_devi", "kidwai_nagar", "vasant_vihar", "dada_nagar_o",
    "mandhana", "naubasta",
  ],
  blue: [
    "agriculture_university", "rawatpur", "kakadeo", "double_pulia",
    "vijay_nagar_chauraha", "shastri_chowk", "barra_7", "barra_8",
  ],
};

export const LINE_TERMINALS: Record<"orange" | "blue", { start: string; end: string }> = {
  orange: { start: "IIT Kanpur", end: "Naubasta" },
  blue: { start: "Agriculture University", end: "Barra-8" },
};

export const OPERATIONAL_STATIONS = new Set([
  "iit_kanpur", "kalyanpur", "spm_hospital", "vishwavidyalaya",
  "gurudev_chauraha", "geeta_nagar", "rawatpur", "llr_hospital",
  "moti_jheel", "chunniganj", "naveen_market", "bada_chauraha",
  "nayaganj", "kanpur_central",
]);

export const getStationOptions = (includeWIP = false): Station[] =>
  Object.values(stations)
    .filter((s) => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));

export const getOrganizedStations = (): {
  line: "orange" | "blue";
  lineName: string;
  stations: Station[];
}[] =>
  (Object.keys(LINE_STATIONS) as ("orange" | "blue")[]).map((line) => ({
    line,
    lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map((id) => stations[id]).filter(Boolean),
  }));
