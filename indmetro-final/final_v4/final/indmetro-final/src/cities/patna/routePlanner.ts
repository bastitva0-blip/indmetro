import { Station, stations, LINE_STATIONS, OPERATIONAL_STATIONS } from "./metroData";
import { calculateFare } from "./fareData";
import { getTravelTimeMinutes, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface RouteStep {
  type: "board" | "travel" | "interchange" | "alight";
  line?: "blue" | "red"; stationId?: string; stationName?: string;
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

const getLineForStation = (id: string): "blue" | "red" | null =>
  LINE_STATIONS.blue.includes(id) ? "blue" : LINE_STATIONS.red.includes(id) ? "red" : null;

const commonLine = (a: string, b: string): "blue" | "red" | null => {
  for (const l of ["blue", "red"] as const)
    if (LINE_STATIONS[l].includes(a) && LINE_STATIONS[l].includes(b)) return l;
  return null;
};

/**
 * Interchange nodes: Patna Junction (blue+red) and Khemnichak (blue+red).
 * Both are currently WIP; route planning works for all stations.
 */
const INTERCHANGES = ["patna_junction", "khemnichak"] as const;

export const planRoute = (originId: string, destinationId: string, hasCard = false): PlannedRoute | null => {
  const origin = stations[originId], destination = stations[destinationId];
  if (!origin || !destination || originId === destinationId) return null;
  const now = getISTDate();
  const curr = now.getHours() * 60 + now.getMinutes();

  // Direct — same line
  const direct = commonLine(originId, destinationId);
  if (direct) {
    const arr = LINE_STATIONS[direct];
    const fi = arr.indexOf(originId), ti = arr.indexOf(destinationId);
    const stops = Math.abs(ti - fi);
    const travel = getTravelTimeMinutes(direct, originId, destinationId) ?? stops * 2.5;
    const wait = getHeadwayMinutes(direct, now) / 2;
    const dirStation = fi < ti ? stations[arr[arr.length - 1]] : stations[arr[0]];
    return {
      origin, destination,
      steps: [
        { type: "board", line: direct, stationId: originId, stationName: origin.name, direction: `towards ${dirStation.name}` },
        { type: "travel", line: direct, numStops: stops, durationMinutes: travel },
        { type: "alight", stationId: destinationId, stationName: destination.name },
      ],
      totalStations: stops, totalTime: Math.round(wait + travel), interchangeCount: 0,
      fare: calculateFare(stops), discountedFare: calculateFare(stops, true), isDirect: true,
      departureTime: fmt(curr + wait), arrivalTime: fmt(curr + wait + travel),
    };
  }

  // Try interchange via Patna Junction or Khemnichak
  const oLine = getLineForStation(originId), dLine = getLineForStation(destinationId);
  if (!oLine || !dLine) return null;

  for (const ix of INTERCHANGES) {
    if (!LINE_STATIONS[oLine].includes(ix) || !LINE_STATIONS[dLine].includes(ix)) continue;

    const l1stops = Math.abs(LINE_STATIONS[oLine].indexOf(originId) - LINE_STATIONS[oLine].indexOf(ix));
    const l2stops = Math.abs(LINE_STATIONS[dLine].indexOf(ix) - LINE_STATIONS[dLine].indexOf(destinationId));
    const l1t = getTravelTimeMinutes(oLine, originId, ix) ?? l1stops * 2.5;
    const l2t = getTravelTimeMinutes(dLine, ix, destinationId) ?? l2stops * 2.5;
    const wait = getHeadwayMinutes(oLine, now) / 2;
    const total = Math.round(wait + l1t + 3 + l2t);
    const stops = l1stops + l2stops;

    const l2arr = LINE_STATIONS[dLine];
    const ixIdx = l2arr.indexOf(ix), diIdx = l2arr.indexOf(destinationId);
    const l2dir = `towards ${stations[ixIdx < diIdx ? l2arr[l2arr.length - 1] : l2arr[0]].name}`;

    return {
      origin, destination,
      steps: [
        { type: "board", line: oLine, stationId: originId, stationName: origin.name, direction: `towards ${stations[ix].name} (interchange)` },
        { type: "travel", line: oLine, numStops: l1stops, durationMinutes: l1t },
        { type: "interchange", stationId: ix, stationName: stations[ix].name },
        { type: "board", line: dLine, stationId: ix, stationName: stations[ix].name, direction: l2dir },
        { type: "travel", line: dLine, numStops: l2stops, durationMinutes: l2t },
        { type: "alight", stationId: destinationId, stationName: destination.name },
      ],
      totalStations: stops, totalTime: total, interchangeCount: 1,
      fare: calculateFare(stops), discountedFare: calculateFare(stops, true), isDirect: false,
      departureTime: fmt(curr + wait), arrivalTime: fmt(curr + total),
    };
  }

  return null;
};
