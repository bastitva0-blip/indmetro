/**
 * Indore Metro Route Planner — Ring Line
 * For a ring line, always find the shorter arc between two stations.
 * Currently only operational stations (0–4) are selectable — WIP excluded.
 */
import { Station, stations, LINE_STATIONS, OPERATIONAL_STATIONS } from "./metroData";
import { calculateFare } from "./fareData";
import { LINE_TIMINGS, TOTAL_RING_MINUTES, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface RouteStep {
  type: "board" | "travel" | "alight";
  line?: "yellow"; stationId?: string; stationName?: string;
  direction?: string; numStops?: number; durationMinutes?: number;
}

export interface PlannedRoute {
  origin: Station; destination: Station; steps: RouteStep[];
  totalStations: number; totalTime: number; interchangeCount: number;
  fare: number; discountedFare?: number; isDirect: boolean;
  departureTime?: string; arrivalTime?: string;
  direction: "clockwise" | "anticlockwise";
}

const fmt = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;

export const planRoute = (originId: string, destinationId: string, hasCard = false): PlannedRoute | null => {
  const origin = stations[originId], destination = stations[destinationId];
  if (!origin || !destination || originId === destinationId) return null;

  const arr = LINE_STATIONS.yellow;
  const fi = arr.indexOf(originId), ti = arr.indexOf(destinationId);
  if (fi === -1 || ti === -1) return null;

  const n = arr.length;
  const cwStops = ti >= fi ? ti - fi : n - fi + ti;
  const acwStops = n - cwStops;
  const useClockwise = cwStops <= acwStops;
  const stops = useClockwise ? cwStops : acwStops;

  const t = LINE_TIMINGS.yellow;
  const cwTime = ti >= fi
    ? t.cumulativeMinutes[ti] - t.cumulativeMinutes[fi]
    : TOTAL_RING_MINUTES - t.cumulativeMinutes[fi] + t.cumulativeMinutes[ti];
  const travelTime = useClockwise ? cwTime : TOTAL_RING_MINUTES - cwTime;

  const now = getISTDate();
  const wait = getHeadwayMinutes("yellow", now) / 2;
  const curr = now.getHours() * 60 + now.getMinutes();

  // Direction label — next station clockwise or anticlockwise
  const nextCwIdx = (fi + 1) % n;
  const nextAcwIdx = (fi - 1 + n) % n;
  const nextStation = useClockwise ? arr[nextCwIdx] : arr[nextAcwIdx];
  const lastStation = useClockwise
    ? arr[(fi + cwStops) % n]
    : arr[(fi - acwStops + n) % n];
  const dirLabel = `towards ${stations[lastStation]?.name ?? destination.name}`;
  const directionKey: "clockwise" | "anticlockwise" = useClockwise ? "clockwise" : "anticlockwise";

  return {
    origin, destination,
    steps: [
      { type: "board", line: "yellow", stationId: originId, stationName: origin.name, direction: dirLabel },
      { type: "travel", line: "yellow", numStops: stops, durationMinutes: travelTime },
      { type: "alight", stationId: destinationId, stationName: destination.name },
    ],
    totalStations: stops,
    totalTime: Math.round(wait + travelTime),
    interchangeCount: 0,
    fare: calculateFare(stops),
    discountedFare: calculateFare(stops, true),
    isDirect: true,
    departureTime: fmt(curr + wait),
    arrivalTime: fmt(curr + wait + travelTime),
    direction: directionKey,
  };
};
