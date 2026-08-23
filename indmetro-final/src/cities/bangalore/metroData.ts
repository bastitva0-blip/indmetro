/**
 * Bangalore Metro — Namma Metro (BMRCL)
 *
 * PURPLE LINE — Whitefield (Kadugodi) ↔ Challaghatta · 43.49 km · 36 stations
 *   East section (Phase 2A, Jun 2023): Whitefield → Baiyappanahalli (13 stations)
 *   Phase 1 (2011–2016): Baiyappanahalli → Mysore Road (22 stations)
 *   West section (Phase 2B, 2022–2024): Mysore Road → Challaghatta (5 more)
 *
 * GREEN LINE — Madavara ↔ Silk Institute · 33.46 km · 29 stations
 *   Phase 1 (2011): MG Road to Baiyappanahalli (north section was via Nagasandra)
 *   Phase 2N (2023): Nagasandra → Madavara (+3 stations)
 *   Phase 2S (2023): Yelachenahalli → Silk Institute (+5 stations)
 *
 * YELLOW LINE — RV Road ↔ Delta Electronics Bommasandra · 19.15 km · 16 stations
 *   All elevated. Opened 10 Aug 2025.
 *
 * INTERCHANGES:
 *   `majestic` — Purple ↔ Green (Nadaprabhu Kempegowda station)
 *   `rv_road`  — Green ↔ Yellow (Rashtreeya Vidyalaya Road station)
 *
 * Operator: BMRCL (Bangalore Metro Rail Corporation Limited)
 * Sources: Wikipedia, bengalurumetrolines.in, BMRCL (Aug 2026)
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
  lines: ("purple" | "green" | "yellow")[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  isWIP?: boolean;
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = {
  purple: "#9C27B0",
  green:  "#4CAF50",
  yellow: "#F9A825",
} as const;

export const LINE_NAMES = {
  purple: "Purple Line",
  green:  "Green Line",
  yellow: "Yellow Line",
} as const;

export const stations: Record<string, Station> = {

  // ═══════════════════════════════════════════════════════════════════
  // PURPLE LINE — East to West
  // ═══════════════════════════════════════════════════════════════════

  // Phase 2A East (opened Jun 2023) — elevated
  whitefield:          { id: "whitefield",          name: "Whitefield (Kadugodi)",    coordinates: [12.9702, 77.7501], lines: ["purple"] },
  sri_sathya_sai:      { id: "sri_sathya_sai",      name: "Sri Sathya Sai Hospital",  coordinates: [12.9718, 77.7412], lines: ["purple"] },
  hopefarm:            { id: "hopefarm",             name: "Hopefarm Channasandra",    coordinates: [12.9752, 77.7348], lines: ["purple"] },
  kadugodi_tree_park:  { id: "kadugodi_tree_park",   name: "Kadugodi Tree Park",       coordinates: [12.9782, 77.7268], lines: ["purple"] },
  pattandur:           { id: "pattandur",            name: "Pattandur Agrahara",       coordinates: [12.9812, 77.7188], lines: ["purple"] },
  nallurhalli:         { id: "nallurhalli",           name: "Nallurhalli",              coordinates: [12.9835, 77.7102], lines: ["purple"] },
  seetharampalya:      { id: "seetharampalya",       name: "Seetharampalya",           coordinates: [12.9852, 77.7018], lines: ["purple"] },
  kundalahalli:        { id: "kundalahalli",          name: "Kundalahalli",             coordinates: [12.9865, 77.6938], lines: ["purple"] },
  brookefield:         { id: "brookefield",           name: "Brookefield",              coordinates: [12.9878, 77.6858], lines: ["purple"] },
  itpl:                { id: "itpl",                  name: "ITPL Main",                coordinates: [12.9885, 77.6772], lines: ["purple"] },
  graphite_india:      { id: "graphite_india",        name: "Graphite India",           coordinates: [12.9890, 77.6688], lines: ["purple"] },
  kr_puram:            { id: "kr_puram",              name: "KR Puram",                 coordinates: [12.9905, 77.6608], lines: ["purple"] },
  tin_factory:         { id: "tin_factory",           name: "Tin Factory",              coordinates: [12.9908, 77.6518], lines: ["purple"] },

  // Phase 1 East — underground/elevated
  baiyappanahalli:     { id: "baiyappanahalli",       name: "Baiyappanahalli",          coordinates: [12.9908, 77.6505], lines: ["purple"] },
  swami_vivekananda:   { id: "swami_vivekananda",     name: "Swami Vivekananda Road",   coordinates: [12.9784, 77.6408], lines: ["purple"] },
  indiranagar:         { id: "indiranagar",            name: "Indiranagar",              coordinates: [12.9748, 77.6388], lines: ["purple"] },
  halasuru:            { id: "halasuru",               name: "Halasuru",                 coordinates: [12.9735, 77.6318], lines: ["purple"] },
  trinity:             { id: "trinity",                name: "Trinity",                  coordinates: [12.9755, 77.6198], lines: ["purple"] },
  mg_road:             { id: "mg_road",                name: "MG Road",                  coordinates: [12.9759, 77.6100], lines: ["purple"], isUnderground: true },
  cubbon_park:         { id: "cubbon_park",            name: "Cubbon Park",              coordinates: [12.9788, 77.5965], lines: ["purple"], isUnderground: true },
  vidhana_soudha:      { id: "vidhana_soudha",         name: "Vidhana Soudha",           coordinates: [12.9788, 77.5868], lines: ["purple"], isUnderground: true },
  sir_mv:              { id: "sir_mv",                 name: "Sir M. Visveswaraya",      coordinates: [12.9778, 77.5778], lines: ["purple"], isUnderground: true },
  majestic:            { id: "majestic",               name: "Nadaprabhu Kempegowda",    coordinates: [12.9770, 77.5712], lines: ["purple", "green"], isInterchange: true, isUnderground: true,
    gates: [
      { id: "A/A1", description: "KSR Bengaluru Railway Station & KSRTC Terminal 2/2A", hasLift: true, hasRamp: true },
      { id: "B",    description: "Chikka Lalbagh, Shantala Silk Road side", hasLift: true, hasRamp: true },
      { id: "C",    description: "Upparpete Police Station, Tank Bund Road, Gandhi Nagar", hasLift: true, hasRamp: true },
      { id: "D",    description: "KSRTC Terminal 1 & BMTC bus station walkway", hasLift: false },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: false },
    platformInfo: {
      purple: { number: 1, direction: "towards Challaghatta / Kengeri" },
      green:  { number: 3, direction: "towards Silk Institute / Yelachenahalli" },
    },
  },
  city_railway_station:{ id: "city_railway_station",  name: "Krantivira Sangolli Rayanna", coordinates: [12.9769, 77.5635], lines: ["purple"] },

  // Phase 1 West + Phase 2B West — elevated
  magadi_road:         { id: "magadi_road",           name: "Magadi Road",              coordinates: [12.9738, 77.5538], lines: ["purple"] },
  hosahalli:           { id: "hosahalli",             name: "Hosahalli",                coordinates: [12.9618, 77.5438], lines: ["purple"] },
  vijayanagar:         { id: "vijayanagar",           name: "Vijayanagar",              coordinates: [12.9538, 77.5348], lines: ["purple"] },
  attiguppe:           { id: "attiguppe",             name: "Attiguppe",                coordinates: [12.9468, 77.5258], lines: ["purple"] },
  deepanjali_nagar:    { id: "deepanjali_nagar",      name: "Deepanjali Nagar",         coordinates: [12.9398, 77.5158], lines: ["purple"] },
  mysore_road:         { id: "mysore_road",           name: "Mysore Road",              coordinates: [12.9358, 77.5068], lines: ["purple"] },
  pantharapalya:       { id: "pantharapalya",         name: "Pantharapalya",            coordinates: [12.9338, 77.4968], lines: ["purple"] },
  nayandahalli:        { id: "nayandahalli",          name: "Nayandahalli",             coordinates: [12.9368, 77.4878], lines: ["purple"] },
  rajarajeshwari_nagar:{ id: "rajarajeshwari_nagar",  name: "Rajarajeshwari Nagar",     coordinates: [12.9408, 77.4778], lines: ["purple"] },
  jnana_bharathi:      { id: "jnana_bharathi",        name: "Jnana Bharathi",           coordinates: [12.9438, 77.4698], lines: ["purple"] },
  kengeri_bus_terminal:{ id: "kengeri_bus_terminal",  name: "Kengeri Bus Terminal",     coordinates: [12.9468, 77.4838], lines: ["purple"] },
  kengeri:             { id: "kengeri",               name: "Kengeri",                  coordinates: [12.9481, 77.4837], lines: ["purple"] },
  challaghatta:        { id: "challaghatta",          name: "Challaghatta",             coordinates: [12.9422, 77.4638], lines: ["purple"] },

  // ═══════════════════════════════════════════════════════════════════
  // GREEN LINE — North to South
  // ═══════════════════════════════════════════════════════════════════

  // Phase 2N (opened 2023) — elevated
  madavara:            { id: "madavara",              name: "Madavara",                 coordinates: [13.0675, 77.5350], lines: ["green"] },
  chikkabidarakallu:   { id: "chikkabidarakallu",    name: "Chikkabidarakallu",        coordinates: [13.0585, 77.5285], lines: ["green"] },
  manjunathanagar:     { id: "manjunathanagar",       name: "Manjunathanagar",          coordinates: [13.0495, 77.5215], lines: ["green"] },

  // Phase 1 North
  nagasandra:          { id: "nagasandra",            name: "Nagasandra",               coordinates: [13.0418, 77.5152], lines: ["green"] },
  dasarahalli:         { id: "dasarahalli",           name: "Dasarahalli",              coordinates: [13.0328, 77.5068], lines: ["green"] },
  jalahalli:           { id: "jalahalli",             name: "Jalahalli",                coordinates: [13.0248, 77.5128], lines: ["green"] },
  peenya_industry:     { id: "peenya_industry",       name: "Peenya Industry",          coordinates: [13.0168, 77.5208], lines: ["green"] },
  peenya:              { id: "peenya",                name: "Peenya",                   coordinates: [13.0088, 77.5278], lines: ["green"] },
  goraguntepalya:      { id: "goraguntepalya",        name: "Goraguntepalya",           coordinates: [13.0018, 77.5348], lines: ["green"] },
  yeshwanthpur:        { id: "yeshwanthpur",          name: "Yeshwanthpur",             coordinates: [12.9948, 77.5398], lines: ["green"] },
  sandal_soap_factory: { id: "sandal_soap_factory",  name: "Sandal Soap Factory",      coordinates: [12.9878, 77.5458], lines: ["green"] },
  mahalakshmi:         { id: "mahalakshmi",           name: "Mahalakshmi",              coordinates: [12.9808, 77.5518], lines: ["green"] },
  rajajinagar:         { id: "rajajinagar",           name: "Rajajinagar",              coordinates: [12.9748, 77.5568], lines: ["green"] },
  mahakavi_kuvempu:    { id: "mahakavi_kuvempu",      name: "Mahakavi Kuvempu Road",    coordinates: [12.9698, 77.5618], lines: ["green"] },
  srirampura:          { id: "srirampura",            name: "Srirampura",               coordinates: [12.9638, 77.5658], lines: ["green"] },
  // majestic shared — defined above in Purple Line

  // Phase 1 South
  chickpete:           { id: "chickpete",             name: "Chickpete",                coordinates: [12.9618, 77.5738], lines: ["green"] },
  kr_market:           { id: "kr_market",             name: "KR Market",                coordinates: [12.9558, 77.5758], lines: ["green"] },
  national_college:    { id: "national_college",      name: "National College",         coordinates: [12.9488, 77.5778], lines: ["green"] },
  lalbagh:             { id: "lalbagh",               name: "Lalbagh",                  coordinates: [12.9428, 77.5828], lines: ["green"] },
  south_end_circle:    { id: "south_end_circle",      name: "South End Circle",         coordinates: [12.9358, 77.5838], lines: ["green"] },
  jayanagar:           { id: "jayanagar",             name: "Jayanagar",                coordinates: [12.9278, 77.5848], lines: ["green"] },
  rv_road:             { id: "rv_road",               name: "RV Road",                  coordinates: [12.9198, 77.5878], lines: ["green", "yellow"], isInterchange: true,
    gates: [
      { id: "A", description: "RV Road, Jayanagar 1st Block side", hasLift: true },
      { id: "B", description: "South End Road, Basavanagudi side", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: false },
    platformInfo: {
      green:  { number: 1, direction: "towards Yelachenahalli" },
      yellow: { number: 3, direction: "towards Bommasandra" },
    },
  },

  // Phase 2S (opened 2023) — elevated
  yelachenahalli:      { id: "yelachenahalli",        name: "Yelachenahalli",           coordinates: [12.9128, 77.5748], lines: ["green"] },
  banashankari:        { id: "banashankari",          name: "Banashankari",             coordinates: [12.9068, 77.5618], lines: ["green"] },
  jp_nagar:            { id: "jp_nagar",              name: "JP Nagar",                 coordinates: [12.8998, 77.5718], lines: ["green"] },
  puttenahalli:        { id: "puttenahalli",          name: "Puttenahalli",             coordinates: [12.8928, 77.5778], lines: ["green"] },
  hulimavu:            { id: "hulimavu",              name: "Hulimavu",                 coordinates: [12.8858, 77.5838], lines: ["green"] },
  silk_institute:      { id: "silk_institute",        name: "Silk Institute",           coordinates: [12.8788, 77.5908], lines: ["green"] },

  // ═══════════════════════════════════════════════════════════════════
  // YELLOW LINE — North to South (all elevated, opened Aug 2025)
  // ═══════════════════════════════════════════════════════════════════
  // rv_road shared — defined above in Green Line

  ragigudda:           { id: "ragigudda",             name: "Ragigudda",                coordinates: [12.9248, 77.5958], lines: ["yellow"] },
  jayadeva_hospital:   { id: "jayadeva_hospital",     name: "Jayadeva Hospital",        coordinates: [12.9168, 77.6022], lines: ["yellow"] },
  btm_layout:          { id: "btm_layout",            name: "BTM Layout",               coordinates: [12.9068, 77.6078], lines: ["yellow"] },
  central_silk_board:  { id: "central_silk_board",    name: "Central Silk Board",       coordinates: [12.9018, 77.6188], lines: ["yellow"] },
  bommanahalli:        { id: "bommanahalli",           name: "Bommanahalli",             coordinates: [12.8938, 77.6248], lines: ["yellow"] },
  hongasandra:         { id: "hongasandra",            name: "Hongasandra",              coordinates: [12.8828, 77.6318], lines: ["yellow"] },
  kudlu_gate:          { id: "kudlu_gate",             name: "Kudlu Gate",               coordinates: [12.8728, 77.6388], lines: ["yellow"] },
  singasandra:         { id: "singasandra",            name: "Singasandra",              coordinates: [12.8618, 77.6448], lines: ["yellow"] },
  hosa_road:           { id: "hosa_road",              name: "Hosa Road",                coordinates: [12.8518, 77.6508], lines: ["yellow"] },
  beratena_agrahara:   { id: "beratena_agrahara",      name: "Beratena Agrahara",        coordinates: [12.8418, 77.6558], lines: ["yellow"] },
  electronic_city:     { id: "electronic_city",        name: "Electronic City",          coordinates: [12.8338, 77.6618], lines: ["yellow"] },
  infosys_agrahara:    { id: "infosys_agrahara",       name: "Infosys Agrahara",         coordinates: [12.8238, 77.6688], lines: ["yellow"] },
  huskur_road:         { id: "huskur_road",            name: "Huskur Road",              coordinates: [12.8148, 77.6748], lines: ["yellow"] },
  hebbagodi:           { id: "hebbagodi",              name: "Biocon Hebbagodi",         coordinates: [12.8058, 77.6808], lines: ["yellow"] },
  bommasandra:         { id: "bommasandra",            name: "Delta Electronics Bommasandra", coordinates: [12.7978, 77.6878], lines: ["yellow"] },
};

// Station order per line
export const LINE_STATIONS: Record<"purple" | "green" | "yellow", string[]> = {
  purple: [
    "whitefield", "sri_sathya_sai", "hopefarm", "kadugodi_tree_park", "pattandur",
    "nallurhalli", "seetharampalya", "kundalahalli", "brookefield", "itpl",
    "graphite_india", "kr_puram", "tin_factory", "baiyappanahalli",
    "swami_vivekananda", "indiranagar", "halasuru", "trinity",
    "mg_road", "cubbon_park", "vidhana_soudha", "sir_mv", "majestic",
    "city_railway_station", "magadi_road", "hosahalli", "vijayanagar",
    "attiguppe", "deepanjali_nagar", "mysore_road", "pantharapalya",
    "nayandahalli", "rajarajeshwari_nagar", "jnana_bharathi",
    "kengeri_bus_terminal", "kengeri", "challaghatta",
  ],
  green: [
    "madavara", "chikkabidarakallu", "manjunathanagar", "nagasandra",
    "dasarahalli", "jalahalli", "peenya_industry", "peenya", "goraguntepalya",
    "yeshwanthpur", "sandal_soap_factory", "mahalakshmi", "rajajinagar",
    "mahakavi_kuvempu", "srirampura", "majestic",
    "chickpete", "kr_market", "national_college", "lalbagh", "south_end_circle",
    "jayanagar", "rv_road", "yelachenahalli", "banashankari",
    "jp_nagar", "puttenahalli", "hulimavu", "silk_institute",
  ],
  yellow: [
    "rv_road", "ragigudda", "jayadeva_hospital", "btm_layout", "central_silk_board",
    "bommanahalli", "hongasandra", "kudlu_gate", "singasandra", "hosa_road",
    "beratena_agrahara", "electronic_city", "infosys_agrahara",
    "huskur_road", "hebbagodi", "bommasandra",
  ],
};

export const LINE_TERMINALS: Record<"purple" | "green" | "yellow", { start: string; end: string }> = {
  purple: { start: "Whitefield (Kadugodi)",    end: "Challaghatta" },
  green:  { start: "Madavara",                 end: "Silk Institute" },
  yellow: { start: "RV Road",                  end: "Delta Electronics Bommasandra" },
};

// Interchange station IDs that appear on multiple lines
export const INTERCHANGE_STATIONS = new Set(["majestic", "rv_road"]);

export const ALL_STATIONS = new Set(Object.keys(stations));

export const getStationLines = (stationId: string): ("purple" | "green" | "yellow")[] =>
  stations[stationId]?.lines ?? [];

export const getOrganizedStations = () =>
  (Object.keys(LINE_STATIONS) as ("purple" | "green" | "yellow")[]).map((line) => ({
    line,
    lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map((id) => stations[id]).filter(Boolean),
  }));

export const OPERATIONAL_STATIONS = ALL_STATIONS;
