/**
 * Mumbai Metro (Multiple Operators)
 *
 * LINE 1 — Blue  · Versova → Ghatkopar      · 11.4 km · 12 stations · Elevated · ALL OPERATIONAL (2014)
 *   Operator: MMOPL (Reliance–MMRDA JV)
 *   Smart card: Mumbai Metro One Card (interoperable with NCMC)
 *
 * LINE 2A — Yellow · Dahisar East → DN Nagar · 18.6 km · 17 stations · Elevated · ALL OPERATIONAL (2022)
 *   Operator: MMMOCL (MMRDA subsidiary)
 *
 * LINE 3 — Aqua  · Aarey JVLR → Cuffe Parade · 33.5 km · 27 stations · Underground (1 at-grade) · ALL OPERATIONAL (Oct 2025)
 *   Operator: DMRC (on behalf of MMRCL)
 *
 * LINE 7 — Red   · Dahisar East → Gundavali  · 16.5 km · 13 stations · Elevated · ALL OPERATIONAL (2022–23)
 *   Operator: MMMOCL
 *
 * LINE 9 — Red   · Dahisar East → Kashigaon  · 3.1 km  · 4 stations  · Elevated · OPERATIONAL (Apr 7 2026)
 *   Operator: MMMOCL (Red Line extension into Mira-Bhayandar)
 *
 * UNIFIED SMART CARD: Mumbai Metro NCMC Card | 10% discount
 * ⚠️ Mumbai Metro One Card (Line 1) is separate; IndMetro uses unified NCMC.
 *
 * KEY INTERCHANGES:
 *   Marol Naka      : Line 1 ↔ Line 3
 *   Dahisar East    : Line 2A ↔ Line 7 ↔ Line 9
 *   Gundavali       : Line 7 ↔ Line 1 (Andheri skywalk, ~300m walk)
 *   BKC             : Line 3 ↔ Line 2B (UC)
 *   Andheri         : Line 1 ↔ WR Suburban
 *   CSMT            : Line 3 ↔ Central + Harbour Suburban
 *   Churchgate      : Line 3 ↔ WR Suburban
 *   Mahalaxmi       : Line 3 ↔ WR Suburban + Mumbai Monorail
 */

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  lines: Array<"line1" | "line2a" | "line3" | "line7" | "line9">;
  chainageKm?: Partial<Record<"line1" | "line2a" | "line3" | "line7" | "line9", number>>;
  isInterchange?: boolean;   // metro-to-metro
  hasRailTransfer?: boolean; // Indian Railways / Suburban
  hasMonorailTransfer?: boolean;
  isUnderground?: boolean;   // Line 3 — most stations UG
  isAtGrade?: boolean;       // Line 3 — Aarey JVLR only
}

export const LINE_COLORS = {
  line1:  "#2196F3",  // Blue
  line2a: "#FFC107",  // Yellow
  line3:  "#00BCD4",  // Aqua
  line7:  "#F44336",  // Red
  line9:  "#E91E8C",  // Pink-Red (Line 9 extension)
} as const;

export const LINE_NAMES = {
  line1:  "Blue Line 1",
  line2a: "Yellow Line 2A",
  line3:  "Aqua Line 3",
  line7:  "Red Line 7",
  line9:  "Red Line 9",
} as const;

// ── LINE 1: Blue — Versova → Ghatkopar ──────────────────────────────────────
const L1: Station[] = [
  { id: "versova",       name: "Versova",            coordinates: [19.1362, 72.8216], lines: ["line1"], chainageKm: { line1: 0 } },
  { id: "dnyaneshwar",   name: "D.N. Nagar",         coordinates: [19.1312, 72.8326], lines: ["line1"], chainageKm: { line1: 1.2 } },
  { id: "azad_nagar_l1", name: "Azad Nagar",         coordinates: [19.1278, 72.8382], lines: ["line1"], chainageKm: { line1: 1.9 } },
  { id: "andheri_l1",    name: "Andheri",             coordinates: [19.1190, 72.8468], lines: ["line1"], chainageKm: { line1: 2.9 }, hasRailTransfer: true }, // ↔ WR suburban
  { id: "western_express",name:"Western Express Hwy", coordinates: [19.1106, 72.8582], lines: ["line1"], chainageKm: { line1: 4.1 } },
  { id: "chakala_l1",    name: "Chakala",             coordinates: [19.1082, 72.8688], lines: ["line1"], chainageKm: { line1: 5.2 } },
  { id: "airport_road_l1",name:"Airport Road",        coordinates: [19.1002, 72.8782], lines: ["line1"], chainageKm: { line1: 6.5 } },
  { id: "marol_naka",    name: "Marol Naka",          coordinates: [19.0952, 72.8888], lines: ["line1", "line3"], chainageKm: { line1: 7.5 }, isInterchange: true }, // ↔ Line 3 Aqua
  { id: "saki_naka",     name: "Saki Naka",           coordinates: [19.0882, 72.8968], lines: ["line1"], chainageKm: { line1: 8.5 } },
  { id: "asalpha",       name: "Asalpha",             coordinates: [19.0818, 72.9048], lines: ["line1"], chainageKm: { line1: 9.4 } },
  { id: "jagruti_nagar", name: "Jagruti Nagar",       coordinates: [19.0768, 72.9118], lines: ["line1"], chainageKm: { line1: 10.3 } },
  { id: "ghatkopar",     name: "Ghatkopar",           coordinates: [19.0872, 72.9072], lines: ["line1"], chainageKm: { line1: 11.4 }, hasRailTransfer: true }, // ↔ Central Suburban
];

// ── LINE 2A: Yellow — Dahisar East → DN Nagar ───────────────────────────────
const L2A: Station[] = [
  { id: "dahisar_east",     name: "Dahisar East",      coordinates: [19.2511, 72.8670], lines: ["line2a", "line7", "line9"], chainageKm: { line2a: 0 }, isInterchange: true, hasRailTransfer: true },
  { id: "anand_nagar_2a",   name: "Anand Nagar",       coordinates: [19.2318, 72.8638], lines: ["line2a"], chainageKm: { line2a: 2.0 } },
  { id: "kandivali_east",   name: "Kandivali East",    coordinates: [19.2178, 72.8688], lines: ["line2a"], chainageKm: { line2a: 3.6 } },
  { id: "poisar_2a",        name: "Poisar",            coordinates: [19.2018, 72.8708], lines: ["line2a"], chainageKm: { line2a: 5.4 } },
  { id: "magathane_2a",     name: "Magathane",         coordinates: [19.1918, 72.8718], lines: ["line2a"], chainageKm: { line2a: 6.5 } },
  { id: "devipada_2a",      name: "Devipada",          coordinates: [19.1818, 72.8718], lines: ["line2a"], chainageKm: { line2a: 7.6 } },
  { id: "borivali_east",    name: "Borivali East",     coordinates: [19.1718, 72.8718], lines: ["line2a"], chainageKm: { line2a: 8.7 }, hasRailTransfer: true }, // ↔ WR suburban
  { id: "eksar",            name: "Eksar",             coordinates: [19.1608, 72.8698], lines: ["line2a"], chainageKm: { line2a: 9.9 } },
  { id: "pahadi_goregaon",  name: "Pahadi Goregaon",   coordinates: [19.1498, 72.8658], lines: ["line2a"], chainageKm: { line2a: 11.1 } },
  { id: "goregaon_east_2a", name: "Goregaon East",     coordinates: [19.1428, 72.8618], lines: ["line2a"], chainageKm: { line2a: 11.9 }, hasRailTransfer: true }, // ↔ WR suburban
  { id: "sai_nagar",        name: "Sai Nagar",         coordinates: [19.1368, 72.8578], lines: ["line2a"], chainageKm: { line2a: 12.7 } },
  { id: "mindhe",           name: "Mindhe",            coordinates: [19.1308, 72.8558], lines: ["line2a"], chainageKm: { line2a: 13.5 } },
  { id: "chincholi",        name: "Chincholi",         coordinates: [19.1258, 72.8538], lines: ["line2a"], chainageKm: { line2a: 14.1 } },
  { id: "maroshi",          name: "Maroshi",           coordinates: [19.1218, 72.8518], lines: ["line2a"], chainageKm: { line2a: 14.7 } },
  { id: "malad_2a",         name: "Malad",             coordinates: [19.1178, 72.8488], lines: ["line2a"], chainageKm: { line2a: 15.4 }, hasRailTransfer: true }, // ↔ WR suburban
  { id: "kandarpada",       name: "Kandarpada",        coordinates: [19.1088, 72.8458], lines: ["line2a"], chainageKm: { line2a: 16.5 } },
  { id: "dn_nagar",         name: "D.N. Nagar",        coordinates: [19.0988, 72.8418], lines: ["line2a"], chainageKm: { line2a: 18.6 } }, // S terminal; future ↔ Line 2B
];

// ── LINE 3: Aqua — Aarey JVLR → Cuffe Parade ────────────────────────────────
const L3: Station[] = [
  // Phase 1 (Oct 2024): Aarey JVLR → BKC
  { id: "aarey_jvlr",      name: "Aarey JVLR",          coordinates: [19.1307, 72.8843], lines: ["line3"], chainageKm: { line3: 0 }, isAtGrade: true }, // N terminal, at-grade depot
  { id: "seepz",           name: "SEEPZ",                coordinates: [19.1080, 72.8750], lines: ["line3"], chainageKm: { line3: 2.4 }, isUnderground: true },
  { id: "marol_naka_l3",   name: "Marol Naka",           coordinates: [19.0952, 72.8888], lines: ["line1", "line3"], chainageKm: { line3: 3.8 }, isInterchange: true, isUnderground: true }, // ↔ Line 1 Blue
  { id: "midc_l3",         name: "MIDC",                 coordinates: [19.1005, 72.8780], lines: ["line3"], chainageKm: { line3: 5.0 }, isUnderground: true },
  { id: "csmia_t2",        name: "CSMIA Terminal 2",     coordinates: [19.0970, 72.8628], lines: ["line3"], chainageKm: { line3: 6.3 }, isUnderground: true }, // ↔ Airport T2
  { id: "csmia_t1",        name: "CSMIA Terminal 1",     coordinates: [19.0892, 72.8566], lines: ["line3"], chainageKm: { line3: 7.5 }, isUnderground: true }, // ↔ Airport T1
  { id: "santacruz_l3",    name: "Santacruz",            coordinates: [19.0818, 72.8484], lines: ["line3"], chainageKm: { line3: 8.5 }, isUnderground: true, hasRailTransfer: true }, // ↔ WR suburban (skywalk)
  { id: "bkc",             name: "Bandra Kurla Complex", coordinates: [19.0655, 72.8622], lines: ["line3"], chainageKm: { line3: 10.2 }, isUnderground: true }, // ↔ Line 2B (UC); BKC under-river section
  { id: "dharavi_l3",      name: "Dharavi",              coordinates: [19.0415, 72.8575], lines: ["line3"], chainageKm: { line3: 12.7 }, isUnderground: true },
  // Phase 2A (May 2025): BKC → Acharya Atre Chowk
  { id: "shitaladevi",     name: "Shitaladevi Mandir",   coordinates: [19.03830, 72.84210], lines: ["line3"], chainageKm: { line3: 14.2 }, isUnderground: true },
  { id: "dadar_l3",        name: "Dadar",                coordinates: [19.0195, 72.8415], lines: ["line3"], chainageKm: { line3: 15.5 }, isUnderground: true, hasRailTransfer: true }, // ↔ Central + WR
  { id: "siddhivinayak",   name: "Siddhivinayak",        coordinates: [19.0170, 72.8340], lines: ["line3"], chainageKm: { line3: 16.2 }, isUnderground: true },
  { id: "worli",           name: "Worli",                coordinates: [19.0105, 72.8335], lines: ["line3"], chainageKm: { line3: 17.5 }, isUnderground: true },
  { id: "acharya_atre",    name: "Acharya Atre Chowk",   coordinates: [18.9995, 72.8312], lines: ["line3"], chainageKm: { line3: 18.6 }, isUnderground: true },
  // Phase 2B (Oct 2025): Acharya Atre Chowk → Cuffe Parade
  { id: "science_museum",  name: "Science Museum",       coordinates: [18.9895, 72.8282], lines: ["line3"], chainageKm: { line3: 20.1 }, isUnderground: true },
  { id: "mahalaxmi_l3",    name: "Mahalaxmi",            coordinates: [18.97947, 72.82540], lines: ["line3"], chainageKm: { line3: 21.4 }, isUnderground: true, hasRailTransfer: true, hasMonorailTransfer: true }, // ↔ WR + Monorail
  { id: "jagannath_sheth", name: "Jagannath Shankar Sheth", coordinates: [18.97083, 72.82203], lines: ["line3"], chainageKm: { line3: 22.5 }, isUnderground: true, hasRailTransfer: true }, // Mumbai Central ↔ WR
  { id: "grant_road_l3",   name: "Grant Road",           coordinates: [18.9608, 72.8228], lines: ["line3"], chainageKm: { line3: 23.8 }, isUnderground: true, hasRailTransfer: true }, // ↔ WR
  { id: "girgaum",         name: "Girgaum",              coordinates: [18.9535, 72.8235], lines: ["line3"], chainageKm: { line3: 24.7 }, isUnderground: true },
  { id: "kalbadevi",       name: "Kalbadevi",            coordinates: [18.9490, 72.8270], lines: ["line3"], chainageKm: { line3: 25.5 }, isUnderground: true },
  { id: "csmt_l3",         name: "CSMT",                 coordinates: [18.94133, 72.83082], lines: ["line3"], chainageKm: { line3: 26.7 }, isUnderground: true, hasRailTransfer: true }, // ↔ Central + Harbour
  { id: "churchgate_l3",   name: "Churchgate",           coordinates: [18.9355, 72.8260], lines: ["line3"], chainageKm: { line3: 27.8 }, isUnderground: true, hasRailTransfer: true }, // ↔ WR
  { id: "vidhan_bhavan",   name: "Vidhan Bhavan",        coordinates: [18.9280, 72.8220], lines: ["line3"], chainageKm: { line3: 28.9 }, isUnderground: true },
  { id: "hutatma_chowk",   name: "Hutatma Chowk",        coordinates: [18.9235, 72.8268], lines: ["line3"], chainageKm: { line3: 29.9 }, isUnderground: true },
  { id: "azad_maidan_l3",  name: "Azad Maidan",          coordinates: [18.9298, 72.8318], lines: ["line3"], chainageKm: { line3: 30.8 }, isUnderground: true },
  { id: "cross_maidan",    name: "Cross Maidan",         coordinates: [18.9175, 72.8265], lines: ["line3"], chainageKm: { line3: 32.1 }, isUnderground: true },
  { id: "cuffe_parade",    name: "Cuffe Parade",         coordinates: [18.91426, 72.82150], lines: ["line3"], chainageKm: { line3: 33.5 }, isUnderground: true }, // S terminal
];

// ── LINE 7: Red — Dahisar East → Gundavali ──────────────────────────────────
const L7: Station[] = [
  // dahisar_east shared with 2A above
  { id: "ovaripada",        name: "Ovaripada",           coordinates: [19.2378, 72.8625], lines: ["line7"], chainageKm: { line7: 1.4 } },
  { id: "national_park_l7", name: "National Park",       coordinates: [19.2278, 72.8625], lines: ["line7"], chainageKm: { line7: 2.8 } },
  { id: "devipada_l7",      name: "Devipada",            coordinates: [19.2178, 72.8635], lines: ["line7"], chainageKm: { line7: 4.0 } },
  { id: "magathane_l7",     name: "Magathane",           coordinates: [19.2018, 72.8658], lines: ["line7"], chainageKm: { line7: 5.5 } },
  { id: "poisar_l7",        name: "Poisar",              coordinates: [19.1905, 72.8655], lines: ["line7"], chainageKm: { line7: 6.9 } },
  { id: "akurli",           name: "Akurli",              coordinates: [19.1805, 72.8668], lines: ["line7"], chainageKm: { line7: 8.0 } },
  { id: "kurar",            name: "Kurar",               coordinates: [19.1705, 72.8668], lines: ["line7"], chainageKm: { line7: 9.2 } },
  { id: "dindoshi",         name: "Dindoshi",            coordinates: [19.1605, 72.8618], lines: ["line7"], chainageKm: { line7: 10.4 } },
  { id: "aarey_l7",         name: "Aarey",               coordinates: [19.1518, 72.8575], lines: ["line7"], chainageKm: { line7: 11.4 } },
  { id: "goregaon_east_l7", name: "Goregaon East",       coordinates: [19.1480, 72.8558], lines: ["line7"], chainageKm: { line7: 12.0 }, hasRailTransfer: true }, // ↔ WR suburban
  { id: "jogeshwari_east",  name: "Jogeshwari East",     coordinates: [19.14302, 72.85510], lines: ["line7"], chainageKm: { line7: 12.8 } }, // ↔ Pink Line UC
  { id: "shankarwadi",      name: "Shankarwadi",         coordinates: [19.1288, 72.8552], lines: ["line7"], chainageKm: { line7: 14.0 } },
  { id: "gundavali",        name: "Gundavali (Andheri East)", coordinates: [19.11502, 72.85517], lines: ["line7"], chainageKm: { line7: 16.5 }, isInterchange: true }, // ↔ Line 1 via skywalk ~300m
];

// ── LINE 9: Red Extension — Dahisar East → Kashigaon (opened Apr 7, 2026) ──
const L9: Station[] = [
  // dahisar_east shared — already in L2A
  { id: "pandurang_wadi",  name: "Pandurang Wadi",       coordinates: [19.2604, 72.8728], lines: ["line9"], chainageKm: { line9: 1.2 } },
  { id: "miragaon",        name: "Miragaon",             coordinates: [19.2690, 72.8755], lines: ["line9"], chainageKm: { line9: 2.1 } },
  { id: "kashigaon",       name: "Kashigaon",            coordinates: [19.2755, 72.8780], lines: ["line9"], chainageKm: { line9: 3.1 } }, // N terminal
];

// Build station map (deduplicate shared stations)
const _all = [...L1, ...L2A, ...L3, ...L7, ...L9];
export const stations: Record<string, Station> = {};
for (const s of _all) {
  if (!stations[s.id]) stations[s.id] = s;
  else {
    // Merge lines array
    for (const l of s.lines) {
      if (!stations[s.id].lines.includes(l)) stations[s.id].lines.push(l);
    }
    if (s.chainageKm) Object.assign(stations[s.id].chainageKm ??= {}, s.chainageKm);
    if (s.isInterchange) stations[s.id].isInterchange = true;
    if (s.hasRailTransfer) stations[s.id].hasRailTransfer = true;
  }
}

export const LINE_STATIONS: Record<"line1" | "line2a" | "line3" | "line7" | "line9", string[]> = {
  line1:  ["versova","dnyaneshwar","azad_nagar_l1","andheri_l1","western_express","chakala_l1","airport_road_l1","marol_naka","saki_naka","asalpha","jagruti_nagar","ghatkopar"],
  line2a: ["dahisar_east","anand_nagar_2a","kandivali_east","poisar_2a","magathane_2a","devipada_2a","borivali_east","eksar","pahadi_goregaon","goregaon_east_2a","sai_nagar","mindhe","chincholi","maroshi","malad_2a","kandarpada","dn_nagar"],
  line3:  ["aarey_jvlr","seepz","marol_naka_l3","midc_l3","csmia_t2","csmia_t1","santacruz_l3","bkc","dharavi_l3","shitaladevi","dadar_l3","siddhivinayak","worli","acharya_atre","science_museum","mahalaxmi_l3","jagannath_sheth","grant_road_l3","girgaum","kalbadevi","csmt_l3","churchgate_l3","vidhan_bhavan","hutatma_chowk","azad_maidan_l3","cross_maidan","cuffe_parade"],
  line7:  ["dahisar_east","ovaripada","national_park_l7","devipada_l7","magathane_l7","poisar_l7","akurli","kurar","dindoshi","aarey_l7","goregaon_east_l7","jogeshwari_east","shankarwadi","gundavali"],
  line9:  ["dahisar_east","pandurang_wadi","miragaon","kashigaon"],
};

// Note: marol_naka and marol_naka_l3 are same physical station (Line 1 + Line 3 interchange)
// They have slightly different coordinates due to line routing — treat as interchange node "marol_naka"
export const INTERCHANGE_MAP: Record<string, string> = {
  marol_naka_l3: "marol_naka", // same physical station
};

export const LINE_TERMINALS = {
  line1:  { start: "Versova",      end: "Ghatkopar" },
  line2a: { start: "Dahisar East", end: "D.N. Nagar" },
  line3:  { start: "Aarey JVLR",  end: "Cuffe Parade" },
  line7:  { start: "Dahisar East", end: "Gundavali" },
  line9:  { start: "Dahisar East", end: "Kashigaon" },
};

export const OPERATIONAL_STATIONS = new Set(Object.keys(stations));

export const getOrganizedStations = () =>
  (["line1","line2a","line3","line7","line9"] as const).map(line => ({
    line, lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map(id => stations[id]).filter(Boolean),
  }));

export const getStationOptions = () =>
  Object.values(stations).sort((a, b) => a.name.localeCompare(b.name));
