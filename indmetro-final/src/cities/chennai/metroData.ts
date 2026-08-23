/**
 * Chennai Metro (CMRL)
 *
 * BLUE LINE (Line 1) — Wimco Nagar Depot → Chennai Airport
 *   32.65 km · 26 operational + 1 depot = 27 stations · Opened Sep 2016 (full: Feb 2021)
 *   Mix: 13 underground, 14 elevated
 *   Phase 1 extension (Airport → Kilambakkam): 15.46 km, 11 stations — DPR approved, UC
 *
 * GREEN LINE (Line 2) — Chennai Central → St. Thomas Mount
 *   22 km · 17 stations · Opened Jun 2015 (full: May 2018)
 *   Mix: 9 underground, 8 elevated
 *
 * INTERCHANGE: Central (Blue ↔ Green), Alandur (Blue ↔ Green)
 * FARE: ₹10–₹50 distance-based. CMRL Smart Card (stored value tap-in/tap-out).
 * HOURS: 05:00–23:00 (last trains ~22:30–22:45 from terminals)
 * OPERATOR: Chennai Metro Rail Limited (CMRL)
 *
 * Sources: Wikipedia Blue/Green Line articles (Aug 2026), chennaimetrorail.org
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
  lines: ("blue" | "green")[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  isWIP?: boolean;
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = {
  blue:  "#1E40AF",
  green: "#16A34A",
} as const;

export const LINE_NAMES = {
  blue:  "Blue Line",
  green: "Green Line",
} as const;

export const stations: Record<string, Station> = {

  // ── BLUE LINE: Operational (south to north: Airport → Wimco Nagar Depot) ──
  chennai_airport: {
    id: "chennai_airport", name: "Chennai Airport",
    coordinates: [12.9823, 80.1637], lines: ["blue"],
  },
  meenambakkam: {
    id: "meenambakkam", name: "Meenambakkam",
    coordinates: [12.9897, 80.1712], lines: ["blue"],
  },
  nanganallur_road: {
    id: "nanganallur_road", name: "Nanganallur Road",
    coordinates: [12.9978, 80.1798], lines: ["blue"],
  },
  alandur: {
    id: "alandur", name: "Alandur",
    coordinates: [13.0041, 80.1902], lines: ["blue", "green"],
    isInterchange: true,
    gates: [
      { id: "A", description: "Alandur Main Road, GST Road side", hasLift: true, hasRamp: true },
      { id: "B", description: "Alandur Bus Stand, Sankarapuram side", hasLift: true },
      { id: "C", description: "DLF Cyber City, RTO Office side", hasLift: true },
      { id: "D", description: "REMO College, West side", hasLift: false },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: false },
    platformInfo: {
      blue:  { number: 1, direction: "towards Chennai Airport" },
      green: { number: 3, direction: "towards St. Thomas Mount" },
    },
  },
  guindy: {
    id: "guindy", name: "Guindy",
    coordinates: [13.0112, 80.2002], lines: ["blue"],
  },
  little_mount: {
    id: "little_mount", name: "Little Mount",
    coordinates: [13.0198, 80.2102], lines: ["blue"],
  },
  saidapet: {
    id: "saidapet", name: "Saidapet",
    coordinates: [13.0268, 80.2171], lines: ["blue"], isUnderground: true,
  },
  nandanam: {
    id: "nandanam", name: "Nandanam",
    coordinates: [13.0318, 80.2218], lines: ["blue"], isUnderground: true,
  },
  teynampet: {
    id: "teynampet", name: "Teynampet",
    coordinates: [13.0381, 80.2278], lines: ["blue"], isUnderground: true,
  },
  ag_dms: {
    id: "ag_dms", name: "AG–DMS",
    coordinates: [13.0432, 80.2322], lines: ["blue"], isUnderground: true,
  },
  thousand_lights: {
    id: "thousand_lights", name: "Thousand Lights",
    coordinates: [13.0498, 80.2378], lines: ["blue"], isUnderground: true,
  },
  lic: {
    id: "lic", name: "LIC",
    coordinates: [13.0551, 80.2421], lines: ["blue"], isUnderground: true,
  },
  government_estate: {
    id: "government_estate", name: "Government Estate",
    coordinates: [13.0598, 80.2461], lines: ["blue"], isUnderground: true,
  },
  central: {
    id: "central", name: "Central",
    coordinates: [13.0827, 80.2762], lines: ["blue", "green"],
    isUnderground: true, isInterchange: true,
  },
  high_court: {
    id: "high_court", name: "High Court",
    coordinates: [13.0881, 80.2811], lines: ["blue"], isUnderground: true,
  },
  mannadi: {
    id: "mannadi", name: "Mannadi",
    coordinates: [13.0938, 80.2852], lines: ["blue"], isUnderground: true,
  },
  washermanpet: {
    id: "washermanpet", name: "Washermanpet",
    coordinates: [13.1018, 80.2912], lines: ["blue"], isUnderground: true,
  },
  sir_theagaraya_college: {
    id: "sir_theagaraya_college", name: "Sir Theagaraya College",
    coordinates: [13.1098, 80.2948], lines: ["blue"], isUnderground: true,
  },
  tondiarpet: {
    id: "tondiarpet", name: "Tondiarpet",
    coordinates: [13.1172, 80.2981], lines: ["blue"], isUnderground: true,
  },
  new_washermanpet: {
    id: "new_washermanpet", name: "New Washermanpet",
    coordinates: [13.1252, 80.3018], lines: ["blue"],
  },
  tollgate: {
    id: "tollgate", name: "Tollgate",
    coordinates: [13.1322, 80.3048], lines: ["blue"],
  },
  kaladipet: {
    id: "kaladipet", name: "Kaladipet",
    coordinates: [13.1398, 80.3078], lines: ["blue"],
  },
  tiruvottriyur_theradi: {
    id: "tiruvottriyur_theradi", name: "Tiruvottriyur Theradi",
    coordinates: [13.1472, 80.3102], lines: ["blue"],
  },
  tiruvottriyur: {
    id: "tiruvottriyur", name: "Tiruvottriyur",
    coordinates: [13.1558, 80.3128], lines: ["blue"],
  },
  wimco_nagar: {
    id: "wimco_nagar", name: "Wimco Nagar",
    coordinates: [13.1638, 80.3152], lines: ["blue"],
  },
  wimco_nagar_depot: {
    id: "wimco_nagar_depot", name: "Wimco Nagar Depot",
    coordinates: [13.1698, 80.3171], lines: ["blue"],
  },

  // ── BLUE LINE: WIP Extension (Airport → Kilambakkam) ──
  pallavaram: {
    id: "pallavaram", name: "Pallavaram",
    coordinates: [12.9721, 80.1538], lines: ["blue"], isWIP: true,
  },
  kothandam_nagar: {
    id: "kothandam_nagar", name: "Kothandam Nagar",
    coordinates: [12.9618, 80.1431], lines: ["blue"], isWIP: true,
  },
  chromepet: {
    id: "chromepet", name: "Chromepet",
    coordinates: [12.9518, 80.1318], lines: ["blue"], isWIP: true,
  },
  mepz: {
    id: "mepz", name: "MEPZ",
    coordinates: [12.9421, 80.1201], lines: ["blue"], isWIP: true,
  },
  tambaram: {
    id: "tambaram", name: "Tambaram",
    coordinates: [12.9318, 80.1091], lines: ["blue"], isWIP: true,
  },
  irumbuliyur: {
    id: "irumbuliyur", name: "Irumbuliyur",
    coordinates: [12.9218, 80.0988], lines: ["blue"], isWIP: true,
  },
  peerkankaranai: {
    id: "peerkankaranai", name: "Peerkankaranai",
    coordinates: [12.9118, 80.0882], lines: ["blue"], isWIP: true,
  },
  perungalathur: {
    id: "perungalathur", name: "Perungalathur",
    coordinates: [12.9018, 80.0772], lines: ["blue"], isWIP: true,
  },
  vandalur: {
    id: "vandalur", name: "Vandalur",
    coordinates: [12.8918, 80.0668], lines: ["blue"], isWIP: true,
  },
  arignar_anna_zoo: {
    id: "arignar_anna_zoo", name: "Arignar Anna Zoological Park",
    coordinates: [12.8818, 80.0558], lines: ["blue"], isWIP: true,
  },
  kilambakkam: {
    id: "kilambakkam", name: "Kilambakkam Bus Terminus",
    coordinates: [12.8718, 80.0451], lines: ["blue"], isWIP: true,
  },

  // ── GREEN LINE: Operational (Chennai Central → St. Thomas Mount) ──
  chennai_central: {
    id: "chennai_central", name: "Chennai Central",
    coordinates: [13.0827, 80.2762], lines: ["green"],
    isUnderground: true, isInterchange: true,
    gates: [
      { id: "B1", description: "Chennai Central Railway Station main entrance", hasLift: true, hasRamp: true },
      { id: "B2", description: "Park Railway Station side", hasLift: true },
      { id: "B3", description: "Allikulam Court Complex, Moore Market side", hasLift: true },
      { id: "B5", description: "Ripon Building, Jawaharlal Nehru Indoor Stadium", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: false, fourWheeler: true },
    platformInfo: {
      green: { number: 1, direction: "towards St. Thomas Mount / Alandur" },
    },
  },
  nehru_park: {
    id: "nehru_park", name: "Nehru Park",
    coordinates: [13.0768, 80.2702], lines: ["green"], isUnderground: true,
  },
  kilpauk_medical_college: {
    id: "kilpauk_medical_college", name: "Kilpauk Medical College",
    coordinates: [13.0701, 80.2638], lines: ["green"], isUnderground: true,
  },
  pachaiyappas_college: {
    id: "pachaiyappas_college", name: "Pachaiyappa's College",
    coordinates: [13.0638, 80.2572], lines: ["green"], isUnderground: true,
  },
  thirumangalam: {
    id: "thirumangalam", name: "Thirumangalam",
    coordinates: [13.0568, 80.2498], lines: ["green"], isUnderground: true,
  },
  koyambedu: {
    id: "koyambedu", name: "Koyambedu",
    coordinates: [13.0698, 80.1958], lines: ["green"],
  },
  cmbt: {
    id: "cmbt", name: "CMBT",
    coordinates: [13.0658, 80.1912], lines: ["green"],
  },
  arumbakkam: {
    id: "arumbakkam", name: "Arumbakkam",
    coordinates: [13.0601, 80.1868], lines: ["green"],
  },
  vadapalani: {
    id: "vadapalani", name: "Vadapalani",
    coordinates: [13.0538, 80.1818], lines: ["green"],
  },
  ashok_nagar: {
    id: "ashok_nagar", name: "Ashok Nagar",
    coordinates: [13.0471, 80.1768], lines: ["green"],
  },
  ekkattuthangal: {
    id: "ekkattuthangal", name: "Ekkattuthangal",
    coordinates: [13.0271, 80.1958], lines: ["green"],
  },
  alandur_green: {
    id: "alandur_green", name: "Alandur",
    coordinates: [13.0041, 80.1902], lines: ["green"],
    isInterchange: true,
  },
  st_thomas_mount: {
    id: "st_thomas_mount", name: "St. Thomas Mount",
    coordinates: [12.9968, 80.1828], lines: ["green"],
  },
};

export const LINE_STATIONS: Record<"blue" | "green", string[]> = {
  blue: [
    "wimco_nagar_depot", "wimco_nagar", "tiruvottriyur", "tiruvottriyur_theradi",
    "kaladipet", "tollgate", "new_washermanpet", "tondiarpet",
    "sir_theagaraya_college", "washermanpet", "mannadi", "high_court",
    "central", "government_estate", "lic", "thousand_lights",
    "ag_dms", "teynampet", "nandanam", "saidapet",
    "little_mount", "guindy", "alandur", "nanganallur_road",
    "meenambakkam", "chennai_airport",
    // WIP extension
    "pallavaram", "kothandam_nagar", "chromepet", "mepz",
    "tambaram", "irumbuliyur", "peerkankaranai", "perungalathur",
    "vandalur", "arignar_anna_zoo", "kilambakkam",
  ],
  green: [
    "chennai_central", "nehru_park", "kilpauk_medical_college",
    "pachaiyappas_college", "thirumangalam", "koyambedu", "cmbt",
    "arumbakkam", "vadapalani", "ashok_nagar", "ekkattuthangal",
    "alandur_green", "st_thomas_mount",
  ],
};

export const LINE_TERMINALS = {
  blue:  { start: "Wimco Nagar Depot", end: "Chennai Airport" },
  green: { start: "Chennai Central",   end: "St. Thomas Mount" },
};

export const OPERATIONAL_STATIONS = new Set([
  // Blue operational
  "wimco_nagar_depot","wimco_nagar","tiruvottriyur","tiruvottriyur_theradi",
  "kaladipet","tollgate","new_washermanpet","tondiarpet",
  "sir_theagaraya_college","washermanpet","mannadi","high_court",
  "central","government_estate","lic","thousand_lights",
  "ag_dms","teynampet","nandanam","saidapet",
  "little_mount","guindy","alandur","nanganallur_road",
  "meenambakkam","chennai_airport",
  // Green — all operational
  "chennai_central","nehru_park","kilpauk_medical_college",
  "pachaiyappas_college","thirumangalam","koyambedu","cmbt",
  "arumbakkam","vadapalani","ashok_nagar","ekkattuthangal",
  "alandur_green","st_thomas_mount",
]);

export const getStationOptions = (includeWIP = false): Station[] =>
  Object.values(stations)
    .filter(s => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));
