/**
 * Kochi Metro (KMRL — Kochi Metro Rail Limited)
 *
 * BLUE LINE — Aluva → Thrippunithura Terminal  ·  27.96 km  ·  25 stations
 *   ALL ELEVATED. ALL OPERATIONAL (Phase 1 complete Mar 2024).
 *   Operated by KMRL (50:50 JV: GoI + GoK). World's first metro managed entirely by women.
 *   Headway: 8 min (peak). First train 6:00 AM, last 10:30 PM.
 *   Rail transfers: Kalamassery, Town Hall (Ernakulam Town), Ernakulam South (Ernakulam Junction), Thrippunithura Terminal.
 *
 * PINK LINE (Phase II) — JLN Stadium → Infopark/Kakkanad  ·  ~11.2 km  ·  11 stations (UC)
 *   All under construction. Expected ~2027. Station names not yet finalised.
 *
 * Sources: Wikipedia, KMRL, themetrorailguy.com (Aug 2026)
 *
 * Chainage (km from Aluva) — from Wikipedia station table — used for distance-based fares.
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
  lines: ("blue" | "pink")[];
  chainageKm: number;           // cumulative km from Aluva — used for fare calc
  openedYear: number;
  hasRailTransfer?: boolean;    // connects to Indian Railways
  isWIP?: boolean;
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = { blue: "#3B82F6", pink: "#EC4899" } as const;
export const LINE_NAMES  = { blue: "Blue Line", pink: "Pink Line" } as const;

export const stations: Record<string, Station> = {
  aluva: {
    id: "aluva", name: "Aluva",
    coordinates: [10.1098, 76.3496], lines: ["blue"], chainageKm: 0.098, openedYear: 2017,
  },
  pulinchodu: {
    id: "pulinchodu", name: "Pulinchodu",
    coordinates: [10.0951, 76.3467], lines: ["blue"], chainageKm: 1.827, openedYear: 2017,
  },
  companypady: {
    id: "companypady", name: "Companypady",
    coordinates: [10.0873, 76.3428], lines: ["blue"], chainageKm: 2.796, openedYear: 2017,
  },
  ambattukavu: {
    id: "ambattukavu", name: "Ambattukavu",
    coordinates: [10.0794, 76.3390], lines: ["blue"], chainageKm: 3.779, openedYear: 2017,
  },
  muttom: {
    id: "muttom", name: "Muttom",
    coordinates: [10.0727, 76.3337], lines: ["blue"], chainageKm: 4.716, openedYear: 2017,
  },
  kalamassery: {
    id: "kalamassery", name: "Kalamassery",
    coordinates: [10.0584, 76.3219], lines: ["blue"], chainageKm: 6.768, openedYear: 2017,
    hasRailTransfer: true,
  },
  cochin_university: {
    id: "cochin_university", name: "Cochin University",
    coordinates: [10.0469, 76.3184], lines: ["blue"], chainageKm: 8.147, openedYear: 2017,
  },
  pathadipalam: {
    id: "pathadipalam", name: "Pathadipalam",
    coordinates: [10.0359, 76.3144], lines: ["blue"], chainageKm: 9.394, openedYear: 2017,
  },
  edapally: {
    id: "edapally", name: "Edapally",
    coordinates: [10.0267, 76.3093], lines: ["blue"], chainageKm: 10.787, openedYear: 2017,
  },
  changampuzha_park: {
    id: "changampuzha_park", name: "Changampuzha Park",
    coordinates: [10.0152, 76.3023], lines: ["blue"], chainageKm: 12.088, openedYear: 2017,
  },
  palarivattom: {
    id: "palarivattom", name: "Palarivattom",
    coordinates: [10.0090, 76.3039], lines: ["blue"], chainageKm: 13.096, openedYear: 2017,
  },
  jln_stadium: {
    id: "jln_stadium", name: "JLN Stadium",
    coordinates: [10.0005, 76.2990], lines: ["blue", "pink"], chainageKm: 14.217, openedYear: 2017,
    // Pink Line will originate here (Phase II)
  },
  kaloor: {
    id: "kaloor", name: "Kaloor",
    coordinates: [9.9946, 76.2916], lines: ["blue"], chainageKm: 15.250, openedYear: 2017,
  },
  town_hall: {
    id: "town_hall", name: "Town Hall",
    coordinates: [9.9912, 76.2880], lines: ["blue"], chainageKm: 15.723, openedYear: 2017,
    hasRailTransfer: true, // Ernakulam Town railway station
  },
  mg_road: {
    id: "mg_road", name: "MG Road",
    coordinates: [9.9841, 76.2821], lines: ["blue"], chainageKm: 16.926, openedYear: 2017,
  },
  maharajas_college: {
    id: "maharajas_college", name: "Maharaja's College",
    coordinates: [9.9734, 76.2850], lines: ["blue"], chainageKm: 18.100, openedYear: 2017,
  },
  ernakulam_south: {
    id: "ernakulam_south", name: "Ernakulam South",
    coordinates: [9.9678, 76.2913], lines: ["blue"], chainageKm: 18.956, openedYear: 2019,
    hasRailTransfer: true, // Ernakulam Junction railway station
  },
  kadavanthra: {
    id: "kadavanthra", name: "Kadavanthra",
    coordinates: [9.9666, 76.2983], lines: ["blue"], chainageKm: 20.141, openedYear: 2019,
  },
  elamkulam: {
    id: "elamkulam", name: "Elamkulam",
    coordinates: [9.9671, 76.3084], lines: ["blue"], chainageKm: 21.295, openedYear: 2019,
  },
  vyttila: {
    id: "vyttila", name: "Vyttila",
    coordinates: [9.9675, 76.3204], lines: ["blue"], chainageKm: 22.734, openedYear: 2019,
    // Vyttila Mobility Hub — connects metro + bus + Kochi Water Metro
  },
  thaikoodam: {
    id: "thaikoodam", name: "Thaikoodam",
    coordinates: [9.9601, 76.3237], lines: ["blue"], chainageKm: 23.758, openedYear: 2019,
  },
  pettah: {
    id: "pettah", name: "Pettah",
    coordinates: [9.9512, 76.3310], lines: ["blue"], chainageKm: 24.941, openedYear: 2020,
  },
  vadakkekotta: {
    id: "vadakkekotta", name: "Vadakkekotta",
    coordinates: [9.9425, 76.3370], lines: ["blue"], chainageKm: 26.10, openedYear: 2022,
  },
  sn_junction: {
    id: "sn_junction", name: "SN Junction",
    coordinates: [9.9360, 76.3415], lines: ["blue"], chainageKm: 26.98, openedYear: 2022,
  },
  thrippunithura_terminal: {
    id: "thrippunithura_terminal", name: "Thrippunithura Terminal",
    coordinates: [9.9295, 76.3472], lines: ["blue"], chainageKm: 27.96, openedYear: 2024,
    hasRailTransfer: true, // Tripunithura railway station
  },
};

export const LINE_STATIONS: Record<"blue", string[]> = {
  blue: [
    "aluva", "pulinchodu", "companypady", "ambattukavu", "muttom",
    "kalamassery", "cochin_university", "pathadipalam", "edapally",
    "changampuzha_park", "palarivattom", "jln_stadium", "kaloor",
    "town_hall", "mg_road", "maharajas_college", "ernakulam_south",
    "kadavanthra", "elamkulam", "vyttila", "thaikoodam", "pettah",
    "vadakkekotta", "sn_junction", "thrippunithura_terminal",
  ],
};

export const LINE_TERMINALS = {
  blue: { start: "Aluva", end: "Thrippunithura Terminal" },
};

/** All 25 Blue Line stations are fully operational */
export const OPERATIONAL_STATIONS = new Set(LINE_STATIONS.blue);

/** Stations with Indian Railways connections */
export const RAIL_TRANSFER_STATIONS = new Set([
  "kalamassery", "town_hall", "ernakulam_south", "thrippunithura_terminal",
]);

export const getStationOptions = (): Station[] =>
  Object.values(stations).sort((a, b) => a.name.localeCompare(b.name));

export const getOrganizedStations = () => [
  {
    line: "blue" as const,
    lineName: LINE_NAMES.blue,
    stations: LINE_STATIONS.blue.map(id => stations[id]),
  },
];
