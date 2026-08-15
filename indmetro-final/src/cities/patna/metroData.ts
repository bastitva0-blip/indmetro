/**
 * Patna Metro (PMRC / DMRC-operated)
 *
 * BLUE LINE (Corridor 2) — Patna Junction → Patliputra Bus Terminal (New ISBT) · 14.56 km · 12 stations
 *   7 underground + 5 elevated
 *   Operational (3, Oct 2025): Bhootnath → Zero Mile → Patliputra Bus Terminal (3.6 km elevated)
 *   WIP (priority corridor, UC): Malahi Pakri, Khemnichak (~Feb 2026 target)
 *   UC: Patna Junction → Rajendra Nagar (underground section)
 *   Interchanges with Red Line at Patna Junction and Khemnichak.
 *
 * RED LINE (Corridor 1) — Danapur Cantonment → Khemnichak · 16.86 km · 14 stations
 *   All under construction. Expected ~2027.
 *   Interchanges with Blue Line at Patna Junction and Khemnichak.
 *
 * Sources: Wikipedia, PMRC, patnametroroute.in, patnametro.space (Aug 2026)
 */

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
  lines: ("blue" | "red")[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  isWIP?: boolean;
}

export const LINE_COLORS = {
  blue: "#3B82F6",
  red: "#EF4444",
} as const;

export const LINE_NAMES = {
  blue: "Blue Line",
  red: "Red Line",
} as const;

export const stations: Record<string, Station> = {

  // ── BLUE LINE: Underground (WIP) — Patna Junction → Rajendra Nagar ──
  patna_junction: {
    id: "patna_junction",
    name: "Patna Junction",
    coordinates: [25.60278, 85.13750],
    lines: ["blue", "red"],
    isUnderground: true,
    isInterchange: true,
    isWIP: true,
  },
  akashvani: {
    id: "akashvani",
    name: "Akashvani",
    coordinates: [25.6105, 85.1395],
    lines: ["blue"],
    isUnderground: true,
    isWIP: true,
  },
  gandhi_maidan: {
    id: "gandhi_maidan",
    name: "Gandhi Maidan",
    coordinates: [25.61989, 85.14515],
    lines: ["blue"],
    isUnderground: true,
    isWIP: true,
  },
  pmch: {
    id: "pmch",
    name: "PMCH",
    coordinates: [25.619, 85.151],
    lines: ["blue"],
    isUnderground: true,
    isWIP: true,
  },
  university: {
    id: "university",
    name: "University",
    coordinates: [25.616, 85.157],
    lines: ["blue"],
    isUnderground: true,
    isWIP: true,
  },
  moin_ul_haq: {
    id: "moin_ul_haq",
    name: "Moin-ul-Haq Stadium",
    coordinates: [25.60778, 85.16778],
    lines: ["blue"],
    isUnderground: true,
    isWIP: true,
  },
  rajendra_nagar: {
    id: "rajendra_nagar",
    name: "Rajendra Nagar",
    coordinates: [25.6003, 85.163],
    lines: ["blue"],
    isUnderground: true,
    isWIP: true,
  },

  // ── BLUE LINE: Elevated (Priority Corridor WIP/Operational) ──
  malahi_pakri: {
    id: "malahi_pakri",
    name: "Malahi Pakri",
    coordinates: [25.5938, 85.1578],
    lines: ["blue", "red"],
    isInterchange: true,
    isWIP: true,
  },
  khemnichak: {
    id: "khemnichak",
    name: "Khemnichak",
    coordinates: [25.5846, 85.1589],
    lines: ["blue", "red"],
    isInterchange: true,
    isWIP: true,
  },
  bhootnath: {
    id: "bhootnath",
    name: "Bhootnath",
    coordinates: [25.5862, 85.1733],
    lines: ["blue"],
  },
  zero_mile: {
    id: "zero_mile",
    name: "Zero Mile",
    coordinates: [25.5858, 85.1864],
    lines: ["blue"],
  },
  patliputra_bus_terminal: {
    id: "patliputra_bus_terminal",
    name: "Patliputra Bus Terminal",
    coordinates: [25.5791, 85.1891],
    lines: ["blue"],
  },

  // ── RED LINE: All Under Construction — Danapur Cantonment → Khemnichak ──
  danapur_cantonment: {
    id: "danapur_cantonment",
    name: "Danapur Cantonment",
    coordinates: [25.617, 85.042],
    lines: ["red"],
    isWIP: true,
  },
  saguna_mor: {
    id: "saguna_mor",
    name: "Saguna Mor",
    coordinates: [25.614, 85.060],
    lines: ["red"],
    isWIP: true,
  },
  rps_mor: {
    id: "rps_mor",
    name: "RPS Mor",
    coordinates: [25.610, 85.076],
    lines: ["red"],
    isWIP: true,
  },
  patliputra_red: {
    id: "patliputra_red",
    name: "Patliputra",
    coordinates: [25.606, 85.092],
    lines: ["red"],
    isWIP: true,
  },
  rukanpura: {
    id: "rukanpura",
    name: "Rukanpura",
    coordinates: [25.602, 85.104],
    lines: ["red"],
    isUnderground: true,
    isWIP: true,
  },
  raja_bazar: {
    id: "raja_bazar",
    name: "Raja Bazar",
    coordinates: [25.606, 85.113],
    lines: ["red"],
    isUnderground: true,
    isWIP: true,
  },
  patna_zoo: {
    id: "patna_zoo",
    name: "Patna Zoo",
    coordinates: [25.610, 85.120],
    lines: ["red"],
    isUnderground: true,
    isWIP: true,
  },
  vikas_bhawan: {
    id: "vikas_bhawan",
    name: "Vikas Bhawan",
    coordinates: [25.608, 85.128],
    lines: ["red"],
    isUnderground: true,
    isWIP: true,
  },
  vidyut_bhawan: {
    id: "vidyut_bhawan",
    name: "Vidyut Bhawan",
    coordinates: [25.605, 85.133],
    lines: ["red"],
    isUnderground: true,
    isWIP: true,
  },
  // patna_junction is shared — already defined above
  mithapur: {
    id: "mithapur",
    name: "Mithapur",
    coordinates: [25.598, 85.148],
    lines: ["red"],
    isWIP: true,
  },
  ramkrishna_nagar: {
    id: "ramkrishna_nagar",
    name: "Ramkrishna Nagar",
    coordinates: [25.592, 85.154],
    lines: ["red"],
    isWIP: true,
  },
  jaganpura: {
    id: "jaganpura",
    name: "Jaganpura",
    coordinates: [25.587, 85.157],
    lines: ["red"],
    isWIP: true,
  },
  // khemnichak shared — already defined above
};

export const LINE_STATIONS: Record<"blue" | "red", string[]> = {
  blue: [
    "patna_junction", "akashvani", "gandhi_maidan", "pmch", "university",
    "moin_ul_haq", "rajendra_nagar", "malahi_pakri", "khemnichak",
    "bhootnath", "zero_mile", "patliputra_bus_terminal",
  ],
  red: [
    "danapur_cantonment", "saguna_mor", "rps_mor", "patliputra_red",
    "rukanpura", "raja_bazar", "patna_zoo", "vikas_bhawan", "vidyut_bhawan",
    "patna_junction", "mithapur", "ramkrishna_nagar", "jaganpura", "khemnichak",
  ],
};

export const LINE_TERMINALS: Record<"blue" | "red", { start: string; end: string }> = {
  blue: { start: "Patna Junction", end: "Patliputra Bus Terminal" },
  red: { start: "Danapur Cantonment", end: "Khemnichak" },
};

/** Only Blue Line priority corridor operational as of Oct 2025 */
export const OPERATIONAL_STATIONS = new Set([
  "bhootnath", "zero_mile", "patliputra_bus_terminal",
]);

export const getStationOptions = (includeWIP = false): Station[] =>
  Object.values(stations)
    .filter((s) => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));

export const getOrganizedStations = () =>
  (Object.keys(LINE_STATIONS) as ("blue" | "red")[]).map((line) => ({
    line,
    lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map((id) => stations[id]).filter(Boolean),
  }));
