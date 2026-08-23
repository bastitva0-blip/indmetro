/**
 * Meerut Metro (MRTS section of Delhi–Meerut RRTS / Namo Bharat)
 * Operator: NCRTC (National Capital Region Transport Corporation)
 * Line: Meerut Metro (teal) — 12 operational, Modipuram Depot UC
 * Opened: 22 Feb 2026 (full Meerut section)
 * Max speed: 120 km/h (fastest metro in India)
 * Total: 13 stations, 23 km, mix elevated + underground
 * Note: RRTS express trains skip MRTS-only stations.
 *       IndMetro covers Meerut Metro (MRTS local) section only.
 */

export interface StationGate {
  id: string;
  description: string;
  hasLift?: boolean;
  hasRamp?: boolean;
}
export interface Station {
  id: string; name: string; coordinates: [number, number];
  lines: ("metro")[]; isUnderground?: boolean; isWIP?: boolean;
  isRRTSAlso?: boolean; // station served by both RRTS express + MRTS local
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS = { metro: "#00897B" } as const;
export const LINE_NAMES  = { metro: "Meerut Metro" } as const;

export const stations: Record<string, Station> = {
  meerut_south:   { id:"meerut_south",   name:"Meerut South",   coordinates:[28.9238,77.7308], lines:["metro"], isRRTSAlso:true },
  partapur:       { id:"partapur",       name:"Partapur",       coordinates:[28.9338,77.7178], lines:["metro"] },
  rithani:        { id:"rithani",        name:"Rithani",        coordinates:[28.9438,77.7138], lines:["metro"] },
  shatabdi_nagar: { id:"shatabdi_nagar", name:"Shatabdi Nagar", coordinates:[28.9548,77.7128], lines:["metro"], isRRTSAlso:true },
  brahmapuri:     { id:"brahmapuri",     name:"Brahmapuri",     coordinates:[28.9618,77.7058], lines:["metro"], isUnderground:true },
  meerut_central: { id:"meerut_central", name:"Meerut Central", coordinates:[28.9715,77.6898], lines:["metro"], isUnderground:true },
  bhaisali:       { id:"bhaisali",       name:"Bhaisali",       coordinates:[28.9818,77.6838], lines:["metro"], isUnderground:true },
  begum_pul:      { id:"begum_pul",      name:"Begum Pul",      coordinates:[28.9938,77.7028], lines:["metro"], isRRTSAlso:true },
  mes_colony:     { id:"mes_colony",     name:"MES Colony",     coordinates:[29.0028,77.7028], lines:["metro"] },
  daurli:         { id:"daurli",         name:"Daurli",         coordinates:[29.0118,77.7078], lines:["metro"] },
  meerut_north:   { id:"meerut_north",   name:"Meerut North",   coordinates:[29.0218,77.7128], lines:["metro"] },
  modipuram:      { id:"modipuram",      name:"Modipuram",      coordinates:[29.0338,77.7198], lines:["metro"], isRRTSAlso:true },
  modipuram_depot:{ id:"modipuram_depot",name:"Modipuram Depot",coordinates:[29.0438,77.7258], lines:["metro"], isWIP:true },
};

export const LINE_STATIONS: Record<"metro", string[]> = {
  metro: [
    "meerut_south","partapur","rithani","shatabdi_nagar","brahmapuri",
    "meerut_central","bhaisali","begum_pul","mes_colony","daurli",
    "meerut_north","modipuram","modipuram_depot",
  ],
};

export const LINE_TERMINALS = { metro: { start: "Meerut South", end: "Modipuram" } };
export const OPERATIONAL_STATIONS = new Set([
  "meerut_south","partapur","rithani","shatabdi_nagar","brahmapuri",
  "meerut_central","bhaisali","begum_pul","mes_colony","daurli",
  "meerut_north","modipuram",
]);

export const getStationOptions = (includeWIP = false): Station[] =>
  Object.values(stations)
    .filter(s => includeWIP || !s.isWIP)
    .sort((a, b) => LINE_STATIONS.metro.indexOf(a.id) - LINE_STATIONS.metro.indexOf(b.id));
