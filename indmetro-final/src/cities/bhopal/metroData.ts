/**
 * Bhopal Metro — Bhoj Metro (MPMRCL)
 *
 * ORANGE LINE (Line 2) — Karond Chauraha ↔ AIIMS · 14.99 km · 16 stations
 *   Priority corridor operational (Dec 21, 2025): Subhash Nagar → AIIMS (8 stations, elevated)
 *   Under construction: Aishbagh → Karond Chauraha (8 stations, elevated + 2 underground)
 *
 * BLUE LINE (Line 5) — Bhadbhada Chauraha ↔ Ratnagiri Tiraha · 12.91 km · 13 stations
 *   All under construction. Interchange with Orange Line at Pul Bogda.
 *
 * Operator: Madhya Pradesh Metro Rail Corporation Limited (MPMRCL)
 * Sources: Wikipedia, themetrorailguy.com, yometro.com (Aug 2026)
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
  lines: ("orange" | "blue")[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  isWIP?: boolean;
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = {
  orange: "#F97316",
  blue:   "#3B82F6",
} as const;

export const LINE_NAMES = {
  orange: "Orange Line",
  blue:   "Blue Line",
} as const;

export const stations: Record<string, Station> = {

  // ── ORANGE LINE: Priority Corridor — Operational (21 Dec 2025, elevated) ─────
  aiims: {
    id: "aiims",
    name: "AIIMS",
    coordinates: [23.1928, 77.4005],
    lines: ["orange"],
  },
  alkapuri: {
    id: "alkapuri",
    name: "Alkapuri",
    coordinates: [23.2065, 77.4098],
    lines: ["orange"],
  },
  drm_office: {
    id: "drm_office",
    name: "DRM Office",
    coordinates: [23.2138, 77.4218],
    lines: ["orange"],
  },
  rani_kamalapati: {
    id: "rani_kamalapati",
    name: "Rani Kamalapati Railway Station",
    coordinates: [23.2216, 77.4401],
    lines: ["orange"],
  },
  mp_nagar: {
    id: "mp_nagar",
    name: "MP Nagar",
    coordinates: [23.2355, 77.4352],
    lines: ["orange"],
  },
  board_office_chauraha: {
    id: "board_office_chauraha",
    name: "Board Office Chauraha",
    coordinates: [23.2455, 77.4295],
    lines: ["orange"],
  },
  kendriya_vidyalaya: {
    id: "kendriya_vidyalaya",
    name: "Kendriya Vidyalaya",
    coordinates: [23.2572, 77.4258],
    lines: ["orange"],
  },
  subhash_nagar: {
    id: "subhash_nagar",
    name: "Subhash Nagar",
    coordinates: [23.2680, 77.4238],
    lines: ["orange"],
  },

  // ── ORANGE LINE: Under Construction (north of Subhash Nagar → Karond) ────────
  aishbagh: {
    id: "aishbagh",
    name: "Aishbagh",
    coordinates: [23.2785, 77.4218],
    lines: ["orange"],
    isWIP: true,
  },
  pul_bogda: {
    id: "pul_bogda",
    name: "Pul Bogda",
    coordinates: [23.2865, 77.4165],
    lines: ["orange", "blue"],
    isInterchange: true,
    isWIP: true,
    gates: [
      { id: "1", description: "Pul Bogda Bridge, Bhopal Junction Railway Station side", hasLift: true, hasRamp: true },
      { id: "2", description: "Nadra Bus Stand, Hamidia Road side", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: false },
    platformInfo: {
      orange: { number: 1, direction: "towards Karond" },
      blue:   { number: 3, direction: "towards Bhadbhada" },
    },
  },
  nadra_bus_stand: {
    id: "nadra_bus_stand",
    name: "Nadra Bus Stand",
    coordinates: [23.2842, 77.4038],
    lines: ["orange"],
    isUnderground: true,
    isWIP: true,
  },
  bhopal_junction: {
    id: "bhopal_junction",
    name: "Bhopal Junction",
    coordinates: [23.2672, 77.4130],
    lines: ["orange"],
    isUnderground: true,
    isWIP: true,
  },
  sindhi_colony: {
    id: "sindhi_colony",
    name: "Sindhi Colony",
    coordinates: [23.3045, 77.4012],
    lines: ["orange"],
    isWIP: true,
  },
  dig_bungalow: {
    id: "dig_bungalow",
    name: "DIG Bungalow",
    coordinates: [23.3175, 77.3955],
    lines: ["orange"],
    isWIP: true,
  },
  krishi_upaj_mandi: {
    id: "krishi_upaj_mandi",
    name: "Krishi Upaj Mandi",
    coordinates: [23.3310, 77.3900],
    lines: ["orange"],
    isWIP: true,
  },
  karond_chauraha: {
    id: "karond_chauraha",
    name: "Karond Chauraha",
    coordinates: [23.3478, 77.3812],
    lines: ["orange"],
    isWIP: true,
  },

  // ── BLUE LINE: All Under Construction ─────────────────────────────────────────
  bhadbhada_chauraha: {
    id: "bhadbhada_chauraha",
    name: "Bhadbhada Chauraha",
    coordinates: [23.2652, 77.3922],
    lines: ["blue"],
    isWIP: true,
  },
  depot_chauraha: {
    id: "depot_chauraha",
    name: "Depot Chauraha",
    coordinates: [23.2582, 77.4012],
    lines: ["blue"],
    isWIP: true,
  },
  jawahar_chowk: {
    id: "jawahar_chowk",
    name: "Jawahar Chowk",
    coordinates: [23.2538, 77.4118],
    lines: ["blue"],
    isWIP: true,
  },
  roshanpura: {
    id: "roshanpura",
    name: "Roshanpura Chauraha",
    coordinates: [23.2510, 77.4182],
    lines: ["blue"],
    isWIP: true,
  },
  minto_hall: {
    id: "minto_hall",
    name: "Minto Hall",
    coordinates: [23.2575, 77.4225],
    lines: ["blue"],
    isWIP: true,
  },
  lily_talkies: {
    id: "lily_talkies",
    name: "Lily Talkies",
    coordinates: [23.2618, 77.4308],
    lines: ["blue"],
    isWIP: true,
  },
  // pul_bogda is shared — defined above in Orange Line
  prabhat_chauraha: {
    id: "prabhat_chauraha",
    name: "Prabhat Chauraha",
    coordinates: [23.2688, 77.4385],
    lines: ["blue"],
    isWIP: true,
  },
  govindpura: {
    id: "govindpura",
    name: "Govindpura",
    coordinates: [23.2712, 77.4495],
    lines: ["blue"],
    isWIP: true,
  },
  jk_road: {
    id: "jk_road",
    name: "J.K. Road",
    coordinates: [23.2745, 77.4618],
    lines: ["blue"],
    isWIP: true,
  },
  indrapuri: {
    id: "indrapuri",
    name: "Indrapuri",
    coordinates: [23.2758, 77.4745],
    lines: ["blue"],
    isWIP: true,
  },
  piplani: {
    id: "piplani",
    name: "Piplani",
    coordinates: [23.2772, 77.4872],
    lines: ["blue"],
    isWIP: true,
  },
  ratnagiri_tiraha: {
    id: "ratnagiri_tiraha",
    name: "Ratnagiri Tiraha",
    coordinates: [23.2782, 77.5012],
    lines: ["blue"],
    isWIP: true,
  },
};

// Orange Line: Karond Chauraha (N) → AIIMS (S)
// Blue Line: Bhadbhada Chauraha (W) → Ratnagiri Tiraha (E)
export const LINE_STATIONS: Record<"orange" | "blue", string[]> = {
  orange: [
    "karond_chauraha", "krishi_upaj_mandi", "dig_bungalow", "sindhi_colony",
    "nadra_bus_stand", "bhopal_junction", "aishbagh", "pul_bogda",
    "subhash_nagar", "kendriya_vidyalaya", "board_office_chauraha",
    "mp_nagar", "rani_kamalapati", "drm_office", "alkapuri", "aiims",
  ],
  blue: [
    "bhadbhada_chauraha", "depot_chauraha", "jawahar_chowk", "roshanpura",
    "minto_hall", "lily_talkies", "pul_bogda",
    "prabhat_chauraha", "govindpura", "jk_road", "indrapuri",
    "piplani", "ratnagiri_tiraha",
  ],
};

export const LINE_TERMINALS: Record<"orange" | "blue", { start: string; end: string }> = {
  orange: { start: "Karond Chauraha", end: "AIIMS" },
  blue:   { start: "Bhadbhada Chauraha", end: "Ratnagiri Tiraha" },
};

// Only the 8 priority corridor stations are operational
export const OPERATIONAL_STATIONS = new Set([
  "aiims", "alkapuri", "drm_office", "rani_kamalapati",
  "mp_nagar", "board_office_chauraha", "kendriya_vidyalaya", "subhash_nagar",
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
