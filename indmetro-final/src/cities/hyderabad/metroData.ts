/**
 * Hyderabad Metro (HMRL / L&T Metro Rail Hyderabad — operated by Keolis)
 *
 * RED LINE  — Miyapur (W) → LB Nagar (E)  · 29.87 km · 27 stations · ALL OPERATIONAL (2017–2019)
 * BLUE LINE — Nagole (E)  → Raidurg (W)   · 27 km    · 23 stations · ALL OPERATIONAL (2017–2019)
 * GREEN LINE — JBS Parade Ground (N) → Falaknuma (S) · ~16 km · 15 stations
 *   9 operational (to MG Bus Station) | 6 WIP (Malakpet → Falaknuma)
 *
 * INTERCHANGES:
 *   Ameerpet       : Red ↔ Blue
 *   Parade Ground  : Blue ↔ Green (JBS)
 *   MG Bus Station : Red ↔ Green
 *
 * Smart Card: Tspay Card | 10% discount
 * Timings: 6:00–23:00 (Red/Blue) | 6:00–23:35 (Green)
 * Headway: 3.5–7 min (peak) | 7–10 min (off-peak) — very frequent
 * Fare: Distance-based ₹10–₹60
 *
 * Sources: Wikipedia, HMRL, themetrorailguy.com (Aug 2026)
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
  lines: ("red" | "blue" | "green")[];
  isInterchange?: boolean;
  hasRailTransfer?: boolean;
  isWIP?: boolean;
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = { red: "#F44336", blue: "#2196F3", green: "#4CAF50" } as const;
export const LINE_NAMES  = { red: "Red Line", blue: "Blue Line", green: "Green Line" } as const;

export const stations: Record<string, Station> = {

  // ── RED LINE: Miyapur (W) → LB Nagar (E) · 27 stations ───────────────────
  miyapur:           { id: "miyapur",           name: "Miyapur",                    coordinates: [17.4950, 78.3622], lines: ["red"] },
  jntu_college:      { id: "jntu_college",      name: "JNTU College",               coordinates: [17.4935, 78.3748], lines: ["red"] },
  kphb_colony:       { id: "kphb_colony",       name: "KPHB Colony",                coordinates: [17.4888, 78.3875], lines: ["red"] },
  kukatpally:        { id: "kukatpally",        name: "Kukatpally",                 coordinates: [17.4848, 78.3988], lines: ["red"] },
  balanagar:         { id: "balanagar",         name: "Balanagar",                  coordinates: [17.4818, 78.4108], lines: ["red"] },
  moosapet:          { id: "moosapet",          name: "Moosapet",                   coordinates: [17.4618, 78.4268], lines: ["red"] },
  bhel:              { id: "bhel",              name: "BHEL",                       coordinates: [17.4488, 78.4388], lines: ["red"] },
  pattancheru:       { id: "pattancheru",       name: "Pattancheru",                coordinates: [17.4388, 78.4448], lines: ["red"] },
  prakash_nagar:     { id: "prakash_nagar",     name: "Prakash Nagar",              coordinates: [17.4288, 78.4488], lines: ["red"] },
  begumpet:          { id: "begumpet",          name: "Begumpet",                   coordinates: [17.4418, 78.4668], lines: ["red"], hasRailTransfer: true },
  ameerpet:          { id: "ameerpet",          name: "Ameerpet",                   coordinates: [17.4348, 78.4538], lines: ["red", "blue"], isInterchange: true,
    gates: [
      { id: "A", description: "Image Hospital, Punjagutta Circle side", hasLift: true, hasRamp: true },
      { id: "B", description: "Sarathi Studios, Yousufguda Road", hasLift: true },
      { id: "C", description: "Maitrivanam, Aditya Enclave side", hasLift: true },
      { id: "D", description: "Balkampet Road, MCH Market side", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: true },
    platformInfo: {
      red:  { number: 1, direction: "towards LB Nagar" },
      blue: { number: 3, direction: "towards Raidurg / HITEC City" },
    },
  },
  sr_nagar:          { id: "sr_nagar",          name: "SR Nagar",                   coordinates: [17.4428, 78.4718], lines: ["red"] },
  erragadda:         { id: "erragadda",         name: "Erragadda",                  coordinates: [17.4488, 78.4578], lines: ["red"] },
  esi_hospital:      { id: "esi_hospital",      name: "ESI Hospital",               coordinates: [17.4318, 78.4808], lines: ["red"] },
  bhavaninagar:      { id: "bhavaninagar",      name: "Bhavaninagar",               coordinates: [17.4258, 78.4858], lines: ["red"] },
  nampally:          { id: "nampally",          name: "Nampally",                   coordinates: [17.4028, 78.4758], lines: ["red"], hasRailTransfer: true }, // ↔ Hyderabad Deccan rly
  gandhi_bhavan:     { id: "gandhi_bhavan",     name: "Gandhi Bhavan",              coordinates: [17.3928, 78.4728], lines: ["red"] },
  osmania_medical:   { id: "osmania_medical",   name: "Osmania Medical College",    coordinates: [17.3838, 78.4748], lines: ["red"] },
  mg_bus_station:    { id: "mg_bus_station",    name: "MG Bus Station",             coordinates: [17.3781, 78.4800], lines: ["red", "green"], isInterchange: true,
    gates: [
      { id: "A", description: "MGBS main entrance, Imlibun (direct bus terminal access)", hasLift: true, hasRamp: true },
      { id: "B", description: "Gowliguda Chowk, Malakpet Road side", hasLift: true },
      { id: "C", description: "Afzalgunj, Chaderghat Road side", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: false, fourWheeler: false },
    platformInfo: {
      red:   { number: 1, direction: "towards LB Nagar" },
      green: { number: 3, direction: "towards JBS Parade Ground" },
    },
  },
  malakpet:          { id: "malakpet",          name: "Malakpet",                   coordinates: [17.3748, 78.4928], lines: ["red"] },
  new_market:        { id: "new_market",        name: "New Market",                 coordinates: [17.3688, 78.5008], lines: ["red"] },
  musarambagh:       { id: "musarambagh",       name: "Musarambagh",                coordinates: [17.3638, 78.5088], lines: ["red"] },
  dilsuknagar:       { id: "dilsuknagar",       name: "Dilsukhnagar",               coordinates: [17.3578, 78.5168], lines: ["red"] },
  chaitanyapuri:     { id: "chaitanyapuri",     name: "Chaitanyapuri",              coordinates: [17.3528, 78.5248], lines: ["red"] },
  victoria_memorial: { id: "victoria_memorial", name: "Victoria Memorial",          coordinates: [17.3488, 78.5338], lines: ["red"] },
  lb_nagar:          { id: "lb_nagar",          name: "LB Nagar",                   coordinates: [17.3438, 78.5448], lines: ["red"] },

  // ── BLUE LINE: Nagole (E) → Raidurg (W) · 23 stations ────────────────────
  nagole:            { id: "nagole",            name: "Nagole",                     coordinates: [17.3888, 78.5608], lines: ["blue"] },
  uppal:             { id: "uppal",             name: "Uppal",                      coordinates: [17.4058, 78.5578], lines: ["blue"] },
  survey_of_india:   { id: "survey_of_india",   name: "Survey of India",            coordinates: [17.4218, 78.5448], lines: ["blue"] },
  ngri:              { id: "ngri",              name: "NGRI",                       coordinates: [17.4258, 78.5388], lines: ["blue"] },
  habsiguda:         { id: "habsiguda",         name: "Habsiguda",                  coordinates: [17.4288, 78.5278], lines: ["blue"] },
  tarnaka:           { id: "tarnaka",           name: "Tarnaka",                    coordinates: [17.4288, 78.5148], lines: ["blue"] },
  mettuguda:         { id: "mettuguda",         name: "Mettuguda",                  coordinates: [17.4288, 78.5018], lines: ["blue"] },
  secunderabad_east: { id: "secunderabad_east", name: "Secunderabad East",          coordinates: [17.4358, 78.4998], lines: ["blue"], hasRailTransfer: true }, // ↔ Secunderabad rly
  parade_ground:     { id: "parade_ground",     name: "Parade Ground",              coordinates: [17.4388, 78.5028], lines: ["blue", "green"], isInterchange: true, // ↔ Green (JBS)
    gates: [
      { id: "A", description: "Parade Ground, Secunderabad Clock Tower side", hasLift: true, hasRamp: true },
      { id: "B", description: "Paradise Circle, MJ Road side", hasLift: true },
      { id: "C", description: "SP Road, Secunderabad Railway Station side", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: false },
    platformInfo: {
      blue:  { number: 1, direction: "towards Raidurg / HITEC City" },
      green: { number: 3, direction: "towards MG Bus Station" },
    },
  },
  paradise:          { id: "paradise",          name: "Paradise",                   coordinates: [17.4428, 78.4898], lines: ["blue"] },
  rasoolpura:        { id: "rasoolpura",        name: "Rasoolpura",                 coordinates: [17.4448, 78.4798], lines: ["blue"] },
  prakash_nagar_blue:{ id: "prakash_nagar_blue",name: "Prakash Nagar",             coordinates: [17.4438, 78.4668], lines: ["blue"] },
  begumpet_blue:     { id: "begumpet_blue",     name: "Begumpet",                   coordinates: [17.4418, 78.4568], lines: ["blue"] },
  // ameerpet shared — already defined
  punjagutta:        { id: "punjagutta",        name: "Punjagutta",                 coordinates: [17.4308, 78.4468], lines: ["blue"] },
  irrum_manzil:      { id: "irrum_manzil",      name: "Irrum Manzil",               coordinates: [17.4238, 78.4398], lines: ["blue"] },
  khairatabad:       { id: "khairatabad",       name: "Khairatabad",                coordinates: [17.4158, 78.4328], lines: ["blue"] },
  lakdi_ka_pul:      { id: "lakdi_ka_pul",      name: "Lakdi ka Pul",               coordinates: [17.4078, 78.4258], lines: ["blue"] },
  assembly:          { id: "assembly",          name: "Assembly",                   coordinates: [17.4018, 78.4188], lines: ["blue"] },
  necklace_road:     { id: "necklace_road",     name: "Necklace Road",              coordinates: [17.4008, 78.4118], lines: ["blue"] },
  filmnagar:         { id: "filmnagar",         name: "Filmnagar",                  coordinates: [17.4058, 78.4028], lines: ["blue"] },
  jubilee_hills:     { id: "jubilee_hills",     name: "Jubilee Hills Check Post",   coordinates: [17.4138, 78.3968], lines: ["blue"] },
  raidurg:           { id: "raidurg",           name: "Raidurg",                    coordinates: [17.4228, 78.3808], lines: ["blue"] },

  // ── GREEN LINE: JBS Parade Ground (N) → Falaknuma (S) · 9 live + 6 WIP ──
  jbs_parade_ground: { id: "jbs_parade_ground", name: "JBS Parade Ground",          coordinates: [17.4508, 78.5028], lines: ["green", "blue"], isInterchange: true }, // ↔ Blue at Parade Ground
  secunderabad_west: { id: "secunderabad_west", name: "Secunderabad West",          coordinates: [17.4388, 78.4998], lines: ["green"], hasRailTransfer: true }, // ↔ Secunderabad rly
  gandhi_hospital:   { id: "gandhi_hospital",   name: "Gandhi Hospital",            coordinates: [17.4258, 78.4928], lines: ["green"] },
  musheerabad:       { id: "musheerabad",       name: "Musheerabad",                coordinates: [17.4148, 78.4858], lines: ["green"] },
  rein_bazaar:       { id: "rein_bazaar",       name: "Rein Bazaar",                coordinates: [17.4058, 78.4848], lines: ["green"] },
  chikkadpally:      { id: "chikkadpally",      name: "Chikkadpally",               coordinates: [17.3968, 78.4858], lines: ["green"] },
  narayanguda:       { id: "narayanguda",       name: "Narayanguda",                coordinates: [17.3878, 78.4848], lines: ["green"] },
  sultan_bazar:      { id: "sultan_bazar",      name: "Sultan Bazar",               coordinates: [17.3808, 78.4808], lines: ["green"] },
  mg_bus_station_grn:{ id: "mg_bus_station_grn",name: "MG Bus Station",             coordinates: [17.3781, 78.4800], lines: ["red", "green"], isInterchange: true }, // ↔ Red Line
  // WIP (6 stations south)
  malakpet_grn:      { id: "malakpet_grn",      name: "Malakpet",                   coordinates: [17.3650, 78.4870], lines: ["green"], isWIP: true },
  bhavaninagar_grn:  { id: "bhavaninagar_grn",  name: "Bhavaninagar",               coordinates: [17.3550, 78.4860], lines: ["green"], isWIP: true },
  chandrayangutta:   { id: "chandrayangutta",   name: "Chandrayangutta",            coordinates: [17.3430, 78.4850], lines: ["green"], isWIP: true },
  saidabad:          { id: "saidabad",          name: "Saidabad",                   coordinates: [17.3330, 78.4840], lines: ["green"], isWIP: true },
  new_malakpet:      { id: "new_malakpet",      name: "New Malakpet",               coordinates: [17.3230, 78.4830], lines: ["green"], isWIP: true },
  falaknuma:         { id: "falaknuma",         name: "Falaknuma",                  coordinates: [17.3130, 78.4820], lines: ["green"], isWIP: true },
};

export const LINE_STATIONS: Record<"red" | "blue" | "green", string[]> = {
  red: [
    "miyapur","jntu_college","kphb_colony","kukatpally","balanagar","moosapet",
    "bhel","pattancheru","prakash_nagar","begumpet","ameerpet","sr_nagar",
    "erragadda","esi_hospital","bhavaninagar","nampally","gandhi_bhavan",
    "osmania_medical","mg_bus_station","malakpet","new_market","musarambagh",
    "dilsuknagar","chaitanyapuri","victoria_memorial","lb_nagar",
  ],
  blue: [
    "nagole","uppal","survey_of_india","ngri","habsiguda","tarnaka","mettuguda",
    "secunderabad_east","parade_ground","paradise","rasoolpura","prakash_nagar_blue",
    "begumpet_blue","ameerpet","punjagutta","irrum_manzil","khairatabad",
    "lakdi_ka_pul","assembly","necklace_road","filmnagar","jubilee_hills","raidurg",
  ],
  green: [
    "jbs_parade_ground","secunderabad_west","gandhi_hospital","musheerabad",
    "rein_bazaar","chikkadpally","narayanguda","sultan_bazar","mg_bus_station_grn",
    "malakpet_grn","bhavaninagar_grn","chandrayangutta","saidabad","new_malakpet","falaknuma",
  ],
};

export const LINE_TERMINALS = {
  red:   { start: "Miyapur", end: "LB Nagar" },
  blue:  { start: "Nagole",  end: "Raidurg" },
  green: { start: "JBS Parade Ground", end: "Falaknuma" },
};

export const OPERATIONAL_STATIONS = new Set([
  ...LINE_STATIONS.red,
  ...LINE_STATIONS.blue,
  ...LINE_STATIONS.green.slice(0, 9), // first 9 live; last 6 WIP
]);

export const getOrganizedStations = () =>
  (["red","blue","green"] as const).map(line => ({
    line, lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map(id => stations[id]).filter(Boolean),
  }));

export const getStationOptions = (includeWIP = false) =>
  Object.values(stations)
    .filter(s => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));
