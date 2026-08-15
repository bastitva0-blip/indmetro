/**
 * Chennai Metro Route Planner
 * Two lines (Blue + Green), interchanges at Central and Alandur.
 */
import { Station, stations, LINE_STATIONS, OPERATIONAL_STATIONS } from "./metroData";
import { calculateFare } from "./fareData";
import { getTravelTimeMinutes, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface RouteStep {
  type: "board" | "travel" | "interchange" | "alight";
  line?: "blue" | "green"; stationId?: string; stationName?: string;
  direction?: string; numStops?: number; durationMinutes?: number;
}
export interface PlannedRoute {
  origin: Station; destination: Station; steps: RouteStep[];
  totalStations: number; totalTime: number; interchangeCount: number;
  fare: number; discountedFare?: number; isDirect: boolean;
  departureTime?: string; arrivalTime?: string;
}

const fmt = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;

const getLine = (id: string): "blue" | "green" | null => {
  if (LINE_STATIONS.blue.includes(id))  return "blue";
  if (LINE_STATIONS.green.includes(id)) return "green";
  return null;
};
const commonLine = (a: string, b: string): "blue" | "green" | null => {
  for (const l of ["blue", "green"] as const)
    if (LINE_STATIONS[l].includes(a) && LINE_STATIONS[l].includes(b)) return l;
  return null;
};

// Interchange pairs: [blue_station_id, green_station_id]
const INTERCHANGES: [string, string][] = [
  ["central",  "chennai_central"],
  ["alandur",  "alandur_green"],
];

export const planRoute = (originId: string, destinationId: string): PlannedRoute | null => {
  const origin = stations[originId], destination = stations[destinationId];
  if (!origin || !destination || originId === destinationId) return null;
  if (!OPERATIONAL_STATIONS.has(originId) || !OPERATIONAL_STATIONS.has(destinationId)) return null;

  const now = getISTDate();
  const curr = now.getHours() * 60 + now.getMinutes();

  // Try direct same line
  const direct = commonLine(originId, destinationId);
  if (direct) {
    const arr = LINE_STATIONS[direct];
    const fi = arr.indexOf(originId), ti = arr.indexOf(destinationId);
    const stops = Math.abs(ti - fi);
    const travel = getTravelTimeMinutes(direct, originId, destinationId) ?? stops * 1.5;
    const wait = getHeadwayMinutes(direct, now) / 2;
    const dirStation = fi < ti ? stations[arr[arr.length - 1]] : stations[arr[0]];
    return {
      origin, destination,
      steps: [
        { type: "board",  line: direct, stationId: originId, stationName: origin.name, direction: `towards ${dirStation.name}` },
        { type: "travel", line: direct, numStops: stops, durationMinutes: travel },
        { type: "alight", stationId: destinationId, stationName: destination.name },
      ],
      totalStations: stops, totalTime: Math.round(wait + travel), interchangeCount: 0,
      fare: calculateFare(stops), discountedFare: calculateFare(stops, true), isDirect: true,
      departureTime: fmt(curr + wait), arrivalTime: fmt(curr + wait + travel),
    };
  }

  // Try via interchange
  const oLine = getLine(originId), dLine = getLine(destinationId);
  if (!oLine || !dLine || oLine === dLine) return null;

  // Find best interchange
  let best: PlannedRoute | null = null;
  for (const [blueId, greenId] of INTERCHANGES) {
    const ixOrigin = oLine === "blue" ? blueId : greenId;
    const ixDest   = dLine === "blue" ? blueId : greenId;
    if (!LINE_STATIONS[oLine].includes(ixOrigin)) continue;
    if (!LINE_STATIONS[dLine].includes(ixDest)) continue;

    const l1arr = LINE_STATIONS[oLine];
    const l2arr = LINE_STATIONS[dLine];
    const fi1 = l1arr.indexOf(originId), ti1 = l1arr.indexOf(ixOrigin);
    const fi2 = l2arr.indexOf(ixDest),  ti2 = l2arr.indexOf(destinationId);
    if (fi1 === -1 || ti1 === -1 || fi2 === -1 || ti2 === -1) continue;

    const stops1 = Math.abs(ti1 - fi1), stops2 = Math.abs(ti2 - fi2);
    const t1 = getTravelTimeMinutes(oLine, originId, ixOrigin) ?? stops1 * 1.5;
    const t2 = getTravelTimeMinutes(dLine, ixDest, destinationId) ?? stops2 * 1.5;
    const wait = getHeadwayMinutes(oLine, now) / 2;
    const total = Math.round(wait + t1 + 3 + t2); // 3 min interchange walk
    const stops = stops1 + stops2;

    const dir1 = fi1 < ti1 ? stations[l1arr[l1arr.length - 1]] : stations[l1arr[0]];
    const dir2 = fi2 < ti2 ? stations[l2arr[l2arr.length - 1]] : stations[l2arr[0]];

    const candidate: PlannedRoute = {
      origin, destination,
      steps: [
        { type: "board",       line: oLine, stationId: originId, stationName: origin.name, direction: `towards ${dir1.name}` },
        { type: "travel",      line: oLine, numStops: stops1, durationMinutes: t1 },
        { type: "interchange", stationId: ixOrigin, stationName: stations[ixOrigin].name },
        { type: "board",       line: dLine, stationId: ixDest, stationName: stations[ixDest].name, direction: `towards ${dir2.name}` },
        { type: "travel",      line: dLine, numStops: stops2, durationMinutes: t2 },
        { type: "alight",      stationId: destinationId, stationName: destination.name },
      ],
      totalStations: stops, totalTime: total, interchangeCount: 1,
      fare: calculateFare(stops), discountedFare: calculateFare(stops, true), isDirect: false,
      departureTime: fmt(curr + wait), arrivalTime: fmt(curr + total),
    };
    if (!best || total < best.totalTime) best = candidate;
  }
  return best;
};
