/**
 * Indore Metro — Yellow Line (Line 3)
 * Ring line: Devi Ahilya Bai Holkar Terminal → ... → Airport → (loops back)
 * Total: 29 stations, 33.53 km (ring/loop)
 *
 * OPERATIONAL (5, from 31 May 2025):
 *   Devi Ahilya Bai Holkar Terminal → Maharani Lakshmi Bai → Rani Avanti Bai Lodhi
 *   → Rani Durgavati → Veerangana Jhalkari Bai
 *   (Super Priority Corridor, Gandhi Nagar area, elevated, 5.9 km)
 *
 * UNDER CONSTRUCTION (24): Super Corridor-2 → ... → Airport
 *   Section 1 (16.21 km): UC, expected ~2027
 *   Section 2 (17.32 km): Approved, ~2029–2030
 *
 * Note: It is a RING LINE — routing must handle clockwise/anticlockwise direction.
 * Operator: MPMRCL | Electrification: 750V DC third rail | Gauge: 1435mm
 * Fare: Not officially announced as of Aug 2026 — estimates used (₹10–40)
 *
 * Sources: Wikipedia, myindoremetro.com, MPMRCL, themetrorailguy.com (Aug 2026)
 */

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
  lines: ("yellow")[];
  isUnderground?: boolean;
  isWIP?: boolean;
}

export const LINE_COLORS = { yellow: "#EAB308" } as const;
export const LINE_NAMES  = { yellow: "Yellow Line" } as const;

/**
 * Stations in ring order (clockwise from Devi Ahilya Bai Holkar Terminal).
 * Index 0–4 are operational; 5–28 are WIP.
 */
export const stations: Record<string, Station> = {

  // ── OPERATIONAL (5) ──────────────────────────────────────────────────────
  devi_ahilya_terminal: {
    id: "devi_ahilya_terminal",
    name: "Devi Ahilya Bai Holkar Terminal",
    coordinates: [22.7562, 75.9040],
    lines: ["yellow"],
  },
  maharani_lakshmi_bai: {
    id: "maharani_lakshmi_bai",
    name: "Maharani Lakshmi Bai",
    coordinates: [22.7492, 75.8978],
    lines: ["yellow"],
  },
  rani_avanti_bai_lodhi: {
    id: "rani_avanti_bai_lodhi",
    name: "Rani Avanti Bai Lodhi",
    coordinates: [22.7418, 75.8912],
    lines: ["yellow"],
  },
  rani_durgavati: {
    id: "rani_durgavati",
    name: "Rani Durgavati",
    coordinates: [22.7348, 75.8848],
    lines: ["yellow"],
  },
  veerangana_jhalkari_bai: {
    id: "veerangana_jhalkari_bai",
    name: "Veerangana Jhalkari Bai",
    coordinates: [22.7282, 75.8788],
    lines: ["yellow"],
  },

  // ── UNDER CONSTRUCTION ────────────────────────────────────────────────────
  super_corridor_2: {
    id: "super_corridor_2",
    name: "Super Corridor-2",
    coordinates: [22.7218, 75.8728],
    lines: ["yellow"], isWIP: true,
  },
  super_corridor_1: {
    id: "super_corridor_1",
    name: "Super Corridor-1",
    coordinates: [22.7155, 75.8668],
    lines: ["yellow"], isWIP: true,
  },
  bhawarsala_square: {
    id: "bhawarsala_square",
    name: "Bhawarsala Square",
    coordinates: [22.7092, 75.8600],
    lines: ["yellow"], isWIP: true,
  },
  mr10_road: {
    id: "mr10_road",
    name: "MR-10 Road",
    coordinates: [22.7031, 75.8532],
    lines: ["yellow"], isWIP: true,
  },
  isbt_mr10_flyover: {
    id: "isbt_mr10_flyover",
    name: "ISBT / MR-10 Flyover",
    coordinates: [22.6962, 75.8461],
    lines: ["yellow"], isWIP: true,
  },
  chandragupta_square: {
    id: "chandragupta_square",
    name: "Chandragupta Square",
    coordinates: [22.6898, 75.8392],
    lines: ["yellow"], isWIP: true,
  },
  hira_nagar: {
    id: "hira_nagar",
    name: "Hira Nagar",
    coordinates: [22.6839, 75.8332],
    lines: ["yellow"], isWIP: true,
  },
  bapat_square: {
    id: "bapat_square",
    name: "Bapat Square",
    coordinates: [22.6779, 75.8272],
    lines: ["yellow"], isWIP: true,
  },
  meghdoot_garden: {
    id: "meghdoot_garden",
    name: "Meghdoot Garden",
    coordinates: [22.7012, 75.8212],
    lines: ["yellow"], isWIP: true,
  },
  vijay_nagar_square: {
    id: "vijay_nagar_square",
    name: "Vijay Nagar Square",
    coordinates: [22.7124, 75.8178],
    lines: ["yellow"], isWIP: true,
  },
  radisson_square: {
    id: "radisson_square",
    name: "Radisson Square",
    coordinates: [22.7212, 75.8131],
    lines: ["yellow"], isWIP: true,
  },
  mumtaj_bag_colony: {
    id: "mumtaj_bag_colony",
    name: "Mumtaj Bag Colony",
    coordinates: [22.7308, 75.8092],
    lines: ["yellow"], isWIP: true,
  },
  khajrana_square: {
    id: "khajrana_square",
    name: "Khajrana Square",
    coordinates: [22.7398, 75.8062],
    lines: ["yellow"], isWIP: true,
  },
  bengali_square: {
    id: "bengali_square",
    name: "Bengali Square",
    coordinates: [22.7488, 75.8039],
    lines: ["yellow"], isWIP: true,
  },
  patrakar_colony: {
    id: "patrakar_colony",
    name: "Patrakar Colony",
    coordinates: [22.7562, 75.8038],
    lines: ["yellow"], isWIP: true,
  },
  palasia_square: {
    id: "palasia_square",
    name: "Palasia Square",
    coordinates: [22.7201, 75.8638],
    lines: ["yellow"], isWIP: true,
  },
  high_court: {
    id: "high_court",
    name: "High Court",
    coordinates: [22.7162, 75.8552],
    lines: ["yellow"], isWIP: true,
  },
  indore_railway_station: {
    id: "indore_railway_station",
    name: "Indore Railway Station",
    coordinates: [22.7198, 75.8468],
    lines: ["yellow"], isWIP: true,
  },
  rajwada: {
    id: "rajwada",
    name: "Rajwada",
    coordinates: [22.7181, 75.8388],
    lines: ["yellow"], isWIP: true,
  },
  chota_ganpati: {
    id: "chota_ganpati",
    name: "Chota Ganpati",
    coordinates: [22.7148, 75.8302],
    lines: ["yellow"], isWIP: true,
  },
  bada_ganpati: {
    id: "bada_ganpati",
    name: "Bada Ganpati",
    coordinates: [22.7112, 75.8218],
    lines: ["yellow"], isWIP: true,
  },
  ramchandra_nagar: {
    id: "ramchandra_nagar",
    name: "Ramchandra Nagar",
    coordinates: [22.7069, 75.8302],
    lines: ["yellow"], isWIP: true,
  },
  bsf_kalani_nagar: {
    id: "bsf_kalani_nagar",
    name: "BSF / Kalani Nagar",
    coordinates: [22.7148, 75.8481],
    lines: ["yellow"], isWIP: true,
  },
  airport_indore: {
    id: "airport_indore",
    name: "Airport",
    coordinates: [22.7218, 75.8011],
    lines: ["yellow"], isWIP: true,
  },
};

/**
 * Ring line station order (clockwise).
 * Routing logic must find the shorter arc between two stations.
 */
export const LINE_STATIONS: Record<"yellow", string[]> = {
  yellow: [
    "devi_ahilya_terminal",
    "maharani_lakshmi_bai",
    "rani_avanti_bai_lodhi",
    "rani_durgavati",
    "veerangana_jhalkari_bai",
    "super_corridor_2",
    "super_corridor_1",
    "bhawarsala_square",
    "mr10_road",
    "isbt_mr10_flyover",
    "chandragupta_square",
    "hira_nagar",
    "bapat_square",
    "meghdoot_garden",
    "vijay_nagar_square",
    "radisson_square",
    "mumtaj_bag_colony",
    "khajrana_square",
    "bengali_square",
    "patrakar_colony",
    "palasia_square",
    "high_court",
    "indore_railway_station",
    "rajwada",
    "chota_ganpati",
    "bada_ganpati",
    "ramchandra_nagar",
    "bsf_kalani_nagar",
    "airport_indore",
  ],
};

export const IS_RING_LINE = true; // affects routing — find shorter arc

export const OPERATIONAL_STATIONS = new Set([
  "devi_ahilya_terminal",
  "maharani_lakshmi_bai",
  "rani_avanti_bai_lodhi",
  "rani_durgavati",
  "veerangana_jhalkari_bai",
]);

export const getStationOptions = (includeWIP = false): Station[] =>
  Object.values(stations)
    .filter(s => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));

export const LINE_TERMINALS: Record<"yellow", { start: string; end: string }> = {
  yellow: { start: "devi_ahilya_terminal", end: "airport_indore" },
};
