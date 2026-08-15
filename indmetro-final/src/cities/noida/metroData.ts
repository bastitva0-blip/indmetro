/**
 * Noida Metro — NMRC Aqua Line
 * Operator: NMRC (Noida Metro Rail Corporation)
 * Aqua Line: Sector 51 → Depot Station · 29.7 km · 21 stations · All elevated · All operational
 * Opened: Jan 2019 (Phase 1), extended to Depot Station Dec 2022
 * Interchange: Sector 51 ↔ Delhi Metro Blue Line Sector 52 (skywalk ~300m)
 * Note: DMRC smart cards NOT valid on NMRC. Separate ticketing.
 */

export interface Station {
  id: string; name: string; coordinates: [number, number];
  lines: ("aqua")[]; isInterchange?: boolean;
}

export const LINE_COLORS = { aqua: "#00BCD4" } as const;
export const LINE_NAMES  = { aqua: "Aqua Line" } as const;

export const stations: Record<string, Station> = {
  sector_51:        { id: "sector_51",        name: "Noida Sector 51",      coordinates: [28.5867, 77.3728], lines: ["aqua"], isInterchange: true },
  sector_50:        { id: "sector_50",        name: "Noida Sector 50",      coordinates: [28.5754, 77.3742], lines: ["aqua"] },
  sector_76:        { id: "sector_76",        name: "Noida Sector 76",      coordinates: [28.5632, 77.3812], lines: ["aqua"] },
  sector_101:       { id: "sector_101",       name: "Noida Sector 101",     coordinates: [28.5564, 77.3848], lines: ["aqua"] },
  sector_81:        { id: "sector_81",        name: "Noida Sector 81",      coordinates: [28.5438, 77.3902], lines: ["aqua"] },
  nsez:             { id: "nsez",             name: "NSEZ",                  coordinates: [28.5323, 77.3948], lines: ["aqua"] },
  sector_83:        { id: "sector_83",        name: "Noida Sector 83",      coordinates: [28.5222, 77.3965], lines: ["aqua"] },
  sector_137:       { id: "sector_137",       name: "Noida Sector 137",     coordinates: [28.5108, 77.4012], lines: ["aqua"] },
  sector_142:       { id: "sector_142",       name: "Noida Sector 142",     coordinates: [28.4991, 77.4126], lines: ["aqua"] },
  sector_143:       { id: "sector_143",       name: "Noida Sector 143",     coordinates: [28.4945, 77.4222], lines: ["aqua"] },
  sector_144:       { id: "sector_144",       name: "Noida Sector 144",     coordinates: [28.4865, 77.4329], lines: ["aqua"] },
  sector_145:       { id: "sector_145",       name: "Noida Sector 145",     coordinates: [28.4782, 77.4428], lines: ["aqua"] },
  sector_146:       { id: "sector_146",       name: "Noida Sector 146",     coordinates: [28.4689, 77.4550], lines: ["aqua"] },
  sector_147:       { id: "sector_147",       name: "Noida Sector 147",     coordinates: [28.4595, 77.4659], lines: ["aqua"] },
  sector_148:       { id: "sector_148",       name: "Noida Sector 148",     coordinates: [28.4512, 77.4756], lines: ["aqua"] },
  pari_chowk:       { id: "pari_chowk",       name: "Pari Chowk",           coordinates: [28.4418, 77.4854], lines: ["aqua"] },
  alpha_1:          { id: "alpha_1",          name: "Alpha 1",               coordinates: [28.4325, 77.4922], lines: ["aqua"] },
  alpha_2:          { id: "alpha_2",          name: "Alpha 2",               coordinates: [28.4242, 77.4982], lines: ["aqua"] },
  delta_1:          { id: "delta_1",          name: "Delta 1",               coordinates: [28.4159, 77.5036], lines: ["aqua"] },
  knowledge_park_2: { id: "knowledge_park_2", name: "Knowledge Park II",     coordinates: [28.4082, 77.5094], lines: ["aqua"] },
  depot_station:    { id: "depot_station",    name: "Depot Station",         coordinates: [28.3998, 77.5160], lines: ["aqua"] },
};

export const LINE_STATIONS: Record<"aqua", string[]> = {
  aqua: [
    "sector_51","sector_50","sector_76","sector_101","sector_81","nsez",
    "sector_83","sector_137","sector_142","sector_143","sector_144",
    "sector_145","sector_146","sector_147","sector_148","pari_chowk",
    "alpha_1","alpha_2","delta_1","knowledge_park_2","depot_station",
  ],
};

export const LINE_TERMINALS = { aqua: { start: "Noida Sector 51", end: "Depot Station" } };
export const OPERATIONAL_STATIONS = new Set(Object.keys(stations));

export const getStationOptions = (): Station[] =>
  Object.values(stations).sort((a, b) =>
    LINE_STATIONS.aqua.indexOf(a.id) - LINE_STATIONS.aqua.indexOf(b.id)
  );
