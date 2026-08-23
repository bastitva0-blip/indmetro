/**
 * Nagpur Metro (MahaMetro — Maharashtra Metro Rail Corporation)
 *
 * ORANGE LINE (North-South) — Automotive Square → Khapri · 19.66 km · 18 stations
 *   Elevated N section | At-grade S section (Airport South → Khapri)
 *   ALL OPERATIONAL
 *
 * AQUA LINE (East-West) — Prajapati Nagar → Hingna Mount View · 18.56 km · 20 stations
 *   ALL OPERATIONAL
 *
 * INTERCHANGE: Sitabuldi (Orange ↔ Aqua)
 * Smart Card: Maha Metro Card | 10% discount
 * Timings: 6:00–22:00 daily | Headway: 3 min peak | 5–10 min off-peak
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
  lines: ("orange" | "aqua")[];
  chainageKm: { orange?: number; aqua?: number };
  isInterchange?: boolean;
  hasRailTransfer?: boolean;
  isAtGrade?: boolean;
  isWIP?: boolean;
  isUnderground?: boolean; // at-grade section south of airport
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = { orange: "#F97316", aqua: "#00BCD4" } as const;
export const LINE_NAMES  = { orange: "Orange Line", aqua: "Aqua Line" } as const;

export const stations: Record<string, Station> = {

  // ── ORANGE LINE: North → South ─────────────────────────────────────────────
  automotive_square: {
    id: "automotive_square", name: "Automotive Square",
    coordinates: [21.18573, 79.11968], lines: ["orange"],
    chainageKm: { orange: 0 },
  },
  nari_road: {
    id: "nari_road", name: "Nari Road",
    coordinates: [21.17947, 79.10992], lines: ["orange"],
    chainageKm: { orange: 1.5 },
  },
  indora_square: {
    id: "indora_square", name: "Indora Square",
    coordinates: [21.17349, 79.10056], lines: ["orange"],
    chainageKm: { orange: 2.8 },
  },
  kadvi_chowk: {
    id: "kadvi_chowk", name: "Kadvi Chowk",
    coordinates: [21.16860, 79.09240], lines: ["orange"],
    chainageKm: { orange: 4.2 },
  },
  gaddi_godam: {
    id: "gaddi_godam", name: "Gaddi Godam Square",
    coordinates: [21.16150, 79.08369], lines: ["orange"],
    chainageKm: { orange: 5.5 },
  },
  kasturchand_park: {
    id: "kasturchand_park", name: "Kasturchand Park",
    coordinates: [21.15487, 79.08150], lines: ["orange"],
    chainageKm: { orange: 6.7 },
  },
  sitabuldi: {
    id: "sitabuldi", name: "Sitabuldi",
    coordinates: [21.14152, 79.08315], lines: ["orange", "aqua"],
    chainageKm: { orange: 8.2, aqua: 9.4 },
    isInterchange: true,
    gates: [
      { id: "N1", description: "Sitabuldi Main Road, Variety Square side", hasLift: true, hasRamp: true },
      { id: "S1", description: "Empress Mall, Residency Road side", hasLift: true },
      { id: "E1", description: "Central Avenue, Cotton Market side", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: false },
    platformInfo: {
      orange: { number: 1, direction: "towards Prajapati Nagar" },
      aqua:   { number: 3, direction: "towards Lokmanya Nagar" },
    },
  },
  congress_nagar: {
    id: "congress_nagar", name: "Congress Nagar",
    coordinates: [21.13500, 79.07900], lines: ["orange"],
    chainageKm: { orange: 9.3 },
  },
  ajni_square: {
    id: "ajni_square", name: "Ajni Square",
    coordinates: [21.12000, 79.07400], lines: ["orange"],
    chainageKm: { orange: 11.0 },
  },
  rahate_colony: {
    id: "rahate_colony", name: "Rahate Colony",
    coordinates: [21.11000, 79.06800], lines: ["orange"],
    chainageKm: { orange: 12.3 },
  },
  airport_nagpur: {
    id: "airport_nagpur", name: "Airport",
    coordinates: [21.08630, 79.06380], lines: ["orange"],
    chainageKm: { orange: 14.9 },
  },
  airport_south: {
    id: "airport_south", name: "Airport South",
    coordinates: [21.07200, 79.05800], lines: ["orange"],
    chainageKm: { orange: 16.3 }, isAtGrade: true,
  },
  mihan: {
    id: "mihan", name: "MIHAN",
    coordinates: [21.06000, 79.05200], lines: ["orange"],
    chainageKm: { orange: 17.1 }, isAtGrade: true,
  },
  jaiprakash_nagar: {
    id: "jaiprakash_nagar", name: "Jai Prakash Nagar",
    coordinates: [21.05200, 79.04500], lines: ["orange"],
    chainageKm: { orange: 17.7 }, isAtGrade: true,
  },
  ujjwal_nagar: {
    id: "ujjwal_nagar", name: "Ujjwal Nagar",
    coordinates: [21.04500, 79.04000], lines: ["orange"],
    chainageKm: { orange: 18.2 }, isAtGrade: true,
  },
  new_airport_south: {
    id: "new_airport_south", name: "New Airport South",
    coordinates: [21.03800, 79.03800], lines: ["orange"],
    chainageKm: { orange: 18.8 }, isAtGrade: true,
  },
  new_khapri: {
    id: "new_khapri", name: "New Khapri",
    coordinates: [21.03200, 79.03600], lines: ["orange"],
    chainageKm: { orange: 19.2 }, isAtGrade: true,
  },
  khapri: {
    id: "khapri", name: "Khapri",
    coordinates: [21.02600, 79.03000], lines: ["orange"],
    chainageKm: { orange: 19.66 }, isAtGrade: true,
  },

  // ── AQUA LINE: West → East ─────────────────────────────────────────────────
  prajapati_nagar: {
    id: "prajapati_nagar", name: "Prajapati Nagar",
    coordinates: [21.13000, 78.99000], lines: ["aqua"],
    chainageKm: { aqua: 0 },
  },
  subhash_nagar_ngp: {
    id: "subhash_nagar_ngp", name: "Subhash Nagar",
    coordinates: [21.13200, 79.00500], lines: ["aqua"],
    chainageKm: { aqua: 1.6 },
  },
  institute_engineers: {
    id: "institute_engineers", name: "Institute of Engineers",
    coordinates: [21.13500, 79.02000], lines: ["aqua"],
    chainageKm: { aqua: 3.2 },
  },
  zero_mile_ngp: {
    id: "zero_mile_ngp", name: "Zero Mile",
    coordinates: [21.13800, 79.03500], lines: ["aqua"],
    chainageKm: { aqua: 4.8 },
  },
  kasturchand_park_aq: {
    id: "kasturchand_park_aq", name: "Kasturchand Park",
    coordinates: [21.14000, 79.05200], lines: ["aqua"],
    chainageKm: { aqua: 6.4 },
  },
  congress_nagar_aq: {
    id: "congress_nagar_aq", name: "Congress Nagar",
    coordinates: [21.14100, 79.06500], lines: ["aqua"],
    chainageKm: { aqua: 7.8 },
  },
  rly_station_ngp: {
    id: "rly_station_ngp", name: "Nagpur Railway Station",
    coordinates: [21.14550, 79.08900], lines: ["aqua"],
    chainageKm: { aqua: 8.8 }, hasRailTransfer: true,
  },
  // sitabuldi shared — Aqua chainage: 9.4 km from Prajapati Nagar
  cotton_market: {
    id: "cotton_market", name: "Cotton Market",
    coordinates: [21.14500, 79.09500], lines: ["aqua"],
    chainageKm: { aqua: 10.0 },
  },
  gandhibagh: {
    id: "gandhibagh", name: "Gandhibagh",
    coordinates: [21.14800, 79.10800], lines: ["aqua"],
    chainageKm: { aqua: 11.3 },
  },
  agrasen_square: {
    id: "agrasen_square", name: "Agrasen Square",
    coordinates: [21.15500, 79.11500], lines: ["aqua"],
    chainageKm: { aqua: 12.1 },
  },
  ambedkar_square: {
    id: "ambedkar_square", name: "Ambedkar Square",
    coordinates: [21.16000, 79.12500], lines: ["aqua"],
    chainageKm: { aqua: 13.2 },
  },
  laxmi_nagar: {
    id: "laxmi_nagar", name: "Laxmi Nagar",
    coordinates: [21.15800, 79.13800], lines: ["aqua"],
    chainageKm: { aqua: 14.5 },
  },
  shankar_nagar: {
    id: "shankar_nagar", name: "Shankar Nagar",
    coordinates: [21.15500, 79.15000], lines: ["aqua"],
    chainageKm: { aqua: 15.7 },
  },
  dharampeth: {
    id: "dharampeth", name: "Dharampeth",
    coordinates: [21.15200, 79.16200], lines: ["aqua"],
    chainageKm: { aqua: 16.9 },
  },
  chhatrapati_square: {
    id: "chhatrapati_square", name: "Chhatrapati Square",
    coordinates: [21.14900, 79.17500], lines: ["aqua"],
    chainageKm: { aqua: 18.0 },
  },
  variety_square: {
    id: "variety_square", name: "Variety Square",
    coordinates: [21.14600, 79.18800], lines: ["aqua"],
    chainageKm: { aqua: 19.2 },
  },
  lokmanya_nagar: {
    id: "lokmanya_nagar", name: "Lokmanya Nagar",
    coordinates: [21.14300, 79.20100], lines: ["aqua"],
    chainageKm: { aqua: 20.5 },
  },
  pratap_nagar: {
    id: "pratap_nagar", name: "Pratap Nagar",
    coordinates: [21.14000, 79.21400], lines: ["aqua"],
    chainageKm: { aqua: 21.8 },
  },
  telangkhedi: {
    id: "telangkhedi", name: "Telangkhedi",
    coordinates: [21.13800, 79.22700], lines: ["aqua"],
    chainageKm: { aqua: 23.1 },
  },
  wadi: {
    id: "wadi", name: "Wadi",
    coordinates: [21.13500, 79.24000], lines: ["aqua"],
    chainageKm: { aqua: 24.4 },
  },
  hingna_mount_view: {
    id: "hingna_mount_view", name: "Hingna Mount View",
    coordinates: [21.13200, 79.25300], lines: ["aqua"],
    chainageKm: { aqua: 25.7 },
  },
};

export const LINE_STATIONS: Record<"orange" | "aqua", string[]> = {
  orange: [
    "automotive_square", "nari_road", "indora_square", "kadvi_chowk",
    "gaddi_godam", "kasturchand_park", "sitabuldi", "congress_nagar",
    "ajni_square", "rahate_colony", "airport_nagpur", "airport_south",
    "mihan", "jaiprakash_nagar", "ujjwal_nagar", "new_airport_south",
    "new_khapri", "khapri",
  ],
  aqua: [
    "prajapati_nagar", "subhash_nagar_ngp", "institute_engineers",
    "zero_mile_ngp", "kasturchand_park_aq", "congress_nagar_aq",
    "rly_station_ngp", "sitabuldi", "cotton_market", "gandhibagh",
    "agrasen_square", "ambedkar_square", "laxmi_nagar", "shankar_nagar",
    "dharampeth", "chhatrapati_square", "variety_square", "lokmanya_nagar",
    "pratap_nagar", "telangkhedi", "wadi", "hingna_mount_view",
  ],
};

export const LINE_TERMINALS = {
  orange: { start: "Automotive Square", end: "Khapri" },
  aqua:   { start: "Prajapati Nagar",  end: "Hingna Mount View" },
};

export const OPERATIONAL_STATIONS = new Set([
  ...LINE_STATIONS.orange, ...LINE_STATIONS.aqua,
]);

export const getOrganizedStations = () =>
  (["orange", "aqua"] as const).map(line => ({
    line, lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map(id => stations[id]).filter(Boolean),
  }));

export const getStationOptions = () =>
  Object.values(stations).sort((a, b) => a.name.localeCompare(b.name));
