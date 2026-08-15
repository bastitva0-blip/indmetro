import { Station, stations, LINE_STATIONS, INTERCHANGE_MAP } from "./metroData";
import { calculateFare } from "./fareData";
import { getTravelTime, getHeadway } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export type MumbaiLine = "line1" | "line2a" | "line3" | "line7" | "line9";

export interface RouteStep {
  type: "board" | "travel" | "interchange" | "alight";
  line?: MumbaiLine; stationId?: string; stationName?: string;
  direction?: string; numStops?: number; durationMinutes?: number;
  walkMinutes?: number;
}
export interface PlannedRoute {
  origin: Station; destination: Station; steps: RouteStep[];
  totalStations: number; totalTime: number; interchangeCount: number;
  fare: number; discountedFare: number; isDirect: boolean;
  departureTime?: string; arrivalTime?: string;
  note?: string;
}

const fmt = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;

// Resolve canonical station id (e.g. marol_naka_l3 → marol_naka)
const resolve = (id: string) => INTERCHANGE_MAP[id] ?? id;

const getLineForStation = (id: string): MumbaiLine | null => {
  const rid = resolve(id);
  for (const line of ["line1","line2a","line3","line7","line9"] as MumbaiLine[])
    if (LINE_STATIONS[line].includes(rid) || LINE_STATIONS[line].includes(id)) return line;
  return null;
};

const commonLine = (a: string, b: string): MumbaiLine | null => {
  const ra = resolve(a), rb = resolve(b);
  for (const line of ["line1","line2a","line3","line7","line9"] as MumbaiLine[]) {
    const arr = LINE_STATIONS[line];
    if ((arr.includes(a) || arr.includes(ra)) && (arr.includes(b) || arr.includes(rb))) return line;
  }
  return null;
};

const stopsOnLine = (line: MumbaiLine, a: string, b: string): number => {
  const arr = LINE_STATIONS[line];
  const fi = arr.indexOf(a), ti = arr.indexOf(b);
  return Math.abs(fi - ti);
};

// INTERCHANGE NODES
// marol_naka: Line1 ↔ Line3
// dahisar_east: Line2A ↔ Line7 ↔ Line9
// gundavali: Line7 terminal — ~300m skywalk to Line1 Andheri (andheri_l1)
const INTERCHANGES: { from: MumbaiLine; to: MumbaiLine; via: string; walkMin?: number }[] = [
  { from: "line1",  to: "line3",  via: "marol_naka",   walkMin: 3  },
  { from: "line3",  to: "line1",  via: "marol_naka_l3", walkMin: 3 },
  { from: "line2a", to: "line7",  via: "dahisar_east",  walkMin: 2 },
  { from: "line7",  to: "line2a", via: "dahisar_east",  walkMin: 2 },
  { from: "line2a", to: "line9",  via: "dahisar_east",  walkMin: 2 },
  { from: "line9",  to: "line2a", via: "dahisar_east",  walkMin: 2 },
  { from: "line7",  to: "line9",  via: "dahisar_east",  walkMin: 2 },
  { from: "line9",  to: "line7",  via: "dahisar_east",  walkMin: 2 },
  // Gundavali ↔ Andheri (skywalk walk)
  { from: "line7",  to: "line1",  via: "gundavali",     walkMin: 7 },
  { from: "line1",  to: "line7",  via: "andheri_l1",    walkMin: 7 },
];

const buildDirect = (
  oLine: MumbaiLine, originId: string, destinationId: string, hasCard: boolean,
  now: Date, curr: number
): PlannedRoute | null => {
  const origin = stations[originId], destination = stations[destinationId];
  if (!origin || !destination) return null;
  const arr = LINE_STATIONS[oLine];
  const fi = arr.indexOf(originId), ti = arr.indexOf(destinationId);
  if (fi === -1 || ti === -1) return null;
  const stops = Math.abs(fi - ti);
  const travel = getTravelTime(oLine, originId, destinationId) ?? stops * 2;
  const wait = getHeadway(oLine, now) / 2;
  const dirSt = fi < ti ? stations[arr[arr.length-1]] : stations[arr[0]];
  return {
    origin, destination,
    steps: [
      { type: "board", line: oLine, stationId: originId, stationName: origin.name, direction: `towards ${dirSt?.name}` },
      { type: "travel", line: oLine, numStops: stops, durationMinutes: travel },
      { type: "alight", stationId: destinationId, stationName: destination.name },
    ],
    totalStations: stops, totalTime: Math.round(wait + travel), interchangeCount: 0,
    fare: calculateFare(originId, destinationId, oLine, stops, false),
    discountedFare: calculateFare(originId, destinationId, oLine, stops, true),
    isDirect: true,
    departureTime: fmt(curr + wait), arrivalTime: fmt(curr + wait + travel),
  };
};

export const planRoute = (originId: string, destinationId: string, hasCard = false): PlannedRoute | null => {
  if (!stations[originId] || !stations[destinationId] || originId === destinationId) return null;

  const now = getISTDate();
  const curr = now.getHours() * 60 + now.getMinutes();
  const origin = stations[originId], destination = stations[destinationId];

  // Direct
  const direct = commonLine(originId, destinationId);
  if (direct) return buildDirect(direct, originId, destinationId, hasCard, now, curr);

  // Single interchange
  const oLine = getLineForStation(originId), dLine = getLineForStation(destinationId);
  if (!oLine || !dLine) return null;

  for (const ix of INTERCHANGES) {
    if (ix.from !== oLine) continue;
    const ixId = ix.via;
    const ixIdDest = ix.to === dLine ? ixId : null;
    if (!ixIdDest) continue;

    const l1arr = LINE_STATIONS[oLine];
    const l2arr = LINE_STATIONS[ix.to];
    const fi = l1arr.indexOf(originId);
    const xi = l1arr.indexOf(ixId);
    if (fi === -1 || xi === -1) continue;

    // Find corresponding ix station on dLine
    const dLineIxId = l2arr.includes(ixId) ? ixId
      : ixId === "marol_naka" && l2arr.includes("marol_naka_l3") ? "marol_naka_l3"
      : ixId === "marol_naka_l3" && l2arr.includes("marol_naka") ? "marol_naka"
      : ixId === "andheri_l1" && l2arr.includes("gundavali") ? "gundavali"
      : null;
    if (!dLineIxId) continue;

    const di = l2arr.indexOf(destinationId);
    const dxi = l2arr.indexOf(dLineIxId);
    if (di === -1 || dxi === -1) continue;

    const l1stops = Math.abs(fi - xi);
    const l2stops = Math.abs(dxi - di);
    const l1t = getTravelTime(oLine, originId, ixId) ?? l1stops * 2;
    const l2t = getTravelTime(ix.to, dLineIxId, destinationId) ?? l2stops * 2;
    const walkMin = ix.walkMin ?? 3;
    const wait = getHeadway(oLine, now) / 2;
    const fare1 = calculateFare(originId, ixId, oLine, l1stops, false);
    const fare2 = calculateFare(dLineIxId, destinationId, ix.to, l2stops, false);
    const disc1 = calculateFare(originId, ixId, oLine, l1stops, true);
    const disc2 = calculateFare(dLineIxId, destinationId, ix.to, l2stops, true);

    const l2dirSt = dxi < di ? stations[l2arr[l2arr.length-1]] : stations[l2arr[0]];

    return {
      origin, destination,
      steps: [
        { type: "board", line: oLine, stationId: originId, stationName: origin.name, direction: `towards ${stations[ixId]?.name ?? ixId}` },
        { type: "travel", line: oLine, numStops: l1stops, durationMinutes: l1t },
        { type: "interchange", stationId: ixId, stationName: stations[ixId]?.name ?? ixId, walkMinutes: walkMin },
        { type: "board", line: ix.to, stationId: dLineIxId, stationName: stations[dLineIxId]?.name ?? dLineIxId, direction: `towards ${l2dirSt?.name}` },
        { type: "travel", line: ix.to, numStops: l2stops, durationMinutes: l2t },
        { type: "alight", stationId: destinationId, stationName: destination.name },
      ],
      totalStations: l1stops + l2stops,
      totalTime: Math.round(wait + l1t + walkMin + l2t),
      interchangeCount: 1,
      fare: fare1 + fare2,
      discountedFare: disc1 + disc2,
      isDirect: false,
      departureTime: fmt(curr + wait),
      arrivalTime: fmt(curr + wait + l1t + walkMin + l2t),
      note: walkMin >= 5 ? `Includes ${walkMin}-min skywalk between stations` : undefined,
    };
  }

  return null;
};
