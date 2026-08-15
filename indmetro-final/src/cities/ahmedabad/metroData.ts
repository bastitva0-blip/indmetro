/**
 * Ahmedabad Metro (GMRC — Gujarat Metro Rail Corporation)
 *
 * BLUE LINE (East-West) — Vastral Gam → Thaltej Gam · 20.7 km · 21 stations
 *   19 operational | 2 WIP near Thaltej (last ~1.4 km UC)
 *   All elevated.
 *
 * RED LINE (North-South) — APMC → Motera Stadium · 18.5 km · 16 stations
 *   16 operational | 2 WIP Phase 2 (Chandkheda, Ranip → GIFT City)
 *   Mix of elevated + underground near Kalupur.
 *
 * INTERCHANGE: Kalupur — Blue ↔ Red ↔ Ahmedabad Junction Indian Railways
 *
 * Smart Card: GMRC Smart Card | 10% discount
 * Timings: 6:00–22:00 daily | Headway: 10 min peak | 15 min off-peak
 * Fare: Distance-based (₹5–₹40)
 */

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  lines: ("blue" | "red")[];
  chainageKm: { blue?: number; red?: number }; // km from respective terminal
  isInterchange?: boolean;
  hasRailTransfer?: boolean;
  isWIP?: boolean;
}

export const LINE_COLORS = { blue: "#2196F3", red: "#F44336" } as const;
export const LINE_NAMES  = { blue: "Blue Line", red: "Red Line" } as const;

export const stations: Record<string, Station> = {

  // ── BLUE LINE: East → West ─────────────────────────────────────────────────

  vastral_gam: {
    id: "vastral_gam", name: "Vastral Gam",
    coordinates: [23.0100, 72.6550], lines: ["blue"],
    chainageKm: { blue: 0 },
  },
  apparel_park: {
    id: "apparel_park", name: "Apparel Park",
    coordinates: [23.0150, 72.6450], lines: ["blue"],
    chainageKm: { blue: 1.4 },
  },
  amraiwadi: {
    id: "amraiwadi", name: "Amraiwadi",
    coordinates: [23.0200, 72.6320], lines: ["blue"],
    chainageKm: { blue: 3.0 },
  },
  rabari_colony: {
    id: "rabari_colony", name: "Rabari Colony",
    coordinates: [23.0240, 72.6200], lines: ["blue"],
    chainageKm: { blue: 4.4 },
  },
  old_wadaj: {
    id: "old_wadaj", name: "Old Wadaj",
    coordinates: [23.0260, 72.6100], lines: ["blue"],
    chainageKm: { blue: 5.7 },
  },
  rakhial: {
    id: "rakhial", name: "Rakhial",
    coordinates: [23.0270, 72.6000], lines: ["blue"],
    chainageKm: { blue: 7.0 },
  },
  ctm: {
    id: "ctm", name: "CTM",
    coordinates: [23.0280, 72.5920], lines: ["blue"],
    chainageKm: { blue: 8.2 },
  },
  naroda_gam: {
    id: "naroda_gam", name: "Naroda Gam",
    coordinates: [23.0280, 72.5870], lines: ["blue"],
    chainageKm: { blue: 9.0 },
  },
  kalupur: {
    id: "kalupur", name: "Kalupur",
    coordinates: [23.0280, 72.5850], lines: ["blue", "red"],
    chainageKm: { blue: 9.4, red: 5.4 },
    isInterchange: true, hasRailTransfer: true, // ↔ Ahmedabad Junction
  },
  shahpur: {
    id: "shahpur", name: "Shahpur",
    coordinates: [23.0290, 72.5780], lines: ["blue"],
    chainageKm: { blue: 10.4 },
  },
  relief_road: {
    id: "relief_road", name: "Relief Road",
    coordinates: [23.0280, 72.5720], lines: ["blue"],
    chainageKm: { blue: 11.3 },
  },
  lal_darwaja: {
    id: "lal_darwaja", name: "Lal Darwaja",
    coordinates: [23.0270, 72.5650], lines: ["blue"],
    chainageKm: { blue: 12.2 },
  },
  paldi: {
    id: "paldi", name: "Paldi",
    coordinates: [23.0300, 72.5580], lines: ["blue"],
    chainageKm: { blue: 13.1 },
  },
  ambawadi: {
    id: "ambawadi", name: "Ambawadi",
    coordinates: [23.0340, 72.5500], lines: ["blue"],
    chainageKm: { blue: 14.3 },
  },
  commerce_six_roads: {
    id: "commerce_six_roads", name: "Commerce Six Roads",
    coordinates: [23.0380, 72.5420], lines: ["blue"],
    chainageKm: { blue: 15.4 },
  },
  municipal_market: {
    id: "municipal_market", name: "Municipal Market",
    coordinates: [23.0410, 72.5380], lines: ["blue"],
    chainageKm: { blue: 16.0 },
  },
  doordarshan_kendra: {
    id: "doordarshan_kendra", name: "Doordarshan Kendra",
    coordinates: [23.0430, 72.5360], lines: ["blue"],
    chainageKm: { blue: 16.5 },
  },
  gurukul_road: {
    id: "gurukul_road", name: "Gurukul Road",
    coordinates: [23.04587, 72.53493], lines: ["blue"],
    chainageKm: { blue: 17.1 },
  },
  thaltej_crossing: {
    id: "thaltej_crossing", name: "Thaltej Crossing",
    coordinates: [23.0500, 72.5200], lines: ["blue"],
    chainageKm: { blue: 19.3 }, isWIP: true,
  },
  sola_rd: {
    id: "sola_rd", name: "Sola Road",
    coordinates: [23.0520, 72.5140], lines: ["blue"],
    chainageKm: { blue: 20.0 }, isWIP: true,
  },
  thaltej_gam: {
    id: "thaltej_gam", name: "Thaltej Gam",
    coordinates: [23.0540, 72.5080], lines: ["blue"],
    chainageKm: { blue: 20.7 }, isWIP: true,
  },

  // ── RED LINE: South → North ────────────────────────────────────────────────

  apmc: {
    id: "apmc", name: "APMC",
    coordinates: [22.99773, 72.53725], lines: ["red"],
    chainageKm: { red: 0 },
  },
  rajiv_nagar: {
    id: "rajiv_nagar", name: "Rajiv Nagar",
    coordinates: [23.01200, 72.54500], lines: ["red"],
    chainageKm: { red: 1.8 },
  },
  jamalpur: {
    id: "jamalpur", name: "Jamalpur",
    coordinates: [23.02000, 72.55200], lines: ["red"],
    chainageKm: { red: 3.4 },
  },
  // kalupur shared above — Red chainage: 5.4 km from APMC
  old_high_court: {
    id: "old_high_court", name: "Old High Court",
    coordinates: [23.03200, 72.58800], lines: ["red"],
    chainageKm: { red: 7.2 },
  },
  income_tax: {
    id: "income_tax", name: "Income Tax",
    coordinates: [23.03500, 72.58900], lines: ["red"],
    chainageKm: { red: 8.0 },
  },
  gujarat_college: {
    id: "gujarat_college", name: "Gujarat College",
    coordinates: [23.03900, 72.58200], lines: ["red"],
    chainageKm: { red: 9.2 },
  },
  shreyas: {
    id: "shreyas", name: "Shreyas",
    coordinates: [23.04200, 72.57500], lines: ["red"],
    chainageKm: { red: 10.2 },
  },
  gujarat_university: {
    id: "gujarat_university", name: "Gujarat University",
    coordinates: [23.04600, 72.57000], lines: ["red"],
    chainageKm: { red: 11.1 },
  },
  nehru_nagar_ahm: {
    id: "nehru_nagar_ahm", name: "Nehru Nagar",
    coordinates: [23.04800, 72.56800], lines: ["red"],
    chainageKm: { red: 11.8 },
  },
  vijay_nagar_ahm: {
    id: "vijay_nagar_ahm", name: "Vijay Nagar",
    coordinates: [23.05618, 72.56239], lines: ["red"],
    chainageKm: { red: 13.6 },
  },
  sabarmati_rly: {
    id: "sabarmati_rly", name: "Sabarmati Railway Station",
    coordinates: [23.06979, 72.58777], lines: ["red"],
    chainageKm: { red: 15.8 }, hasRailTransfer: true,
  },
  aec: {
    id: "aec", name: "AEC",
    coordinates: [23.07511, 72.59321], lines: ["red"],
    chainageKm: { red: 16.6 },
  },
  sabarmati: {
    id: "sabarmati", name: "Sabarmati",
    coordinates: [23.08564, 72.59228], lines: ["red"],
    chainageKm: { red: 17.8 },
  },
  nsit: {
    id: "nsit", name: "NSIT",
    coordinates: [23.09000, 72.58800], lines: ["red"],
    chainageKm: { red: 18.5 },
  },
  motera: {
    id: "motera", name: "Motera Stadium",
    coordinates: [23.09950, 72.60350], lines: ["red"],
    chainageKm: { red: 19.5 },
  },
  // Phase 2 WIP — towards GIFT City / Gandhinagar
  chandkheda: {
    id: "chandkheda", name: "Chandkheda",
    coordinates: [23.09500, 72.59800], lines: ["red"],
    chainageKm: { red: 21.0 }, isWIP: true,
  },
  ranip: {
    id: "ranip", name: "Ranip",
    coordinates: [23.10200, 72.60100], lines: ["red"],
    chainageKm: { red: 22.4 }, isWIP: true,
  },
};

export const LINE_STATIONS: Record<"blue" | "red", string[]> = {
  blue: [
    "vastral_gam", "apparel_park", "amraiwadi", "rabari_colony",
    "old_wadaj", "rakhial", "ctm", "naroda_gam", "kalupur",
    "shahpur", "relief_road", "lal_darwaja", "paldi", "ambawadi",
    "commerce_six_roads", "municipal_market", "doordarshan_kendra",
    "gurukul_road", "thaltej_crossing", "sola_rd", "thaltej_gam",
  ],
  red: [
    "apmc", "rajiv_nagar", "jamalpur", "kalupur",
    "old_high_court", "income_tax", "gujarat_college", "shreyas",
    "gujarat_university", "nehru_nagar_ahm", "vijay_nagar_ahm",
    "sabarmati_rly", "aec", "sabarmati", "nsit", "motera",
    "chandkheda", "ranip",
  ],
};

export const LINE_TERMINALS = {
  blue: { start: "Vastral Gam", end: "Thaltej Gam" },
  red:  { start: "APMC",        end: "Motera Stadium" },
};

export const OPERATIONAL_STATIONS = new Set([
  // Blue — 18 operational
  "vastral_gam","apparel_park","amraiwadi","rabari_colony","old_wadaj",
  "rakhial","ctm","naroda_gam","kalupur","shahpur","relief_road",
  "lal_darwaja","paldi","ambawadi","commerce_six_roads","municipal_market",
  "doordarshan_kendra","gurukul_road",
  // Red — 16 operational
  "apmc","rajiv_nagar","jamalpur","old_high_court","income_tax",
  "gujarat_college","shreyas","gujarat_university","nehru_nagar_ahm",
  "vijay_nagar_ahm","sabarmati_rly","aec","sabarmati","nsit","motera",
]);

const INTERCHANGES = ["kalupur"] as const;

export const getOrganizedStations = () =>
  (["blue", "red"] as const).map(line => ({
    line, lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map(id => stations[id]).filter(Boolean),
  }));

export const getStationOptions = (includeWIP = false) =>
  Object.values(stations)
    .filter(s => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));
