/**
 * Gurgaon Rapid Metro Route Planner
 * Single line, flat fare (₹20 same-phase, ₹35 cross-phase).
 */
import { Station, stations, LINE_STATIONS } from "./metroData";
import { calculateFare } from "./fareData";
import { getTravelTimeMinutes, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface RouteStep {
  type: "board" | "travel" | "alight";
  line?: "rapid"; stationId?: string; stationName?: string;
  direction?: string; numStops?: number; durationMinutes?: number;
}
export interface PlannedRoute {
  origin: Station; destination: Station; steps: RouteStep[];
  totalStations: number; totalTime: number; interchangeCount: number;
  fare: number; discountedFare?: number; isDirect: boolean;
  departureTime?: string; arrivalTime?: string;
  fareNote?: string;
}

const fmt = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;

export const planRoute = (originId: string, destinationId: string): PlannedRoute | null => {
  const origin = stations[originId], destination = stations[destinationId];
  if (!origin || !destination || originId === destinationId) return null;
  const arr = LINE_STATIONS.rapid;
  const fi = arr.indexOf(originId), ti = arr.indexOf(destinationId);
  if (fi === -1 || ti === -1) return null;

  const stops = Math.abs(ti - fi);
  const travel = getTravelTimeMinutes("rapid", originId, destinationId) ?? stops * 1.9;
  const now = getISTDate();
  const wait = getHeadwayMinutes("rapid", now) / 2;
  const curr = now.getHours() * 60 + now.getMinutes();
  const fare = calculateFare(originId, destinationId);
  const dirStation = fi < ti ? stations[arr[arr.length - 1]] : stations[arr[0]];
  const crossPhase = fare === 35;

  return {
    origin, destination,
    steps: [
      { type: "board", line: "rapid", stationId: originId, stationName: origin.name, direction: `towards ${dirStation.name}` },
      { type: "travel", line: "rapid", numStops: stops, durationMinutes: travel },
      { type: "alight", stationId: destinationId, stationName: destination.name },
    ],
    totalStations: stops, totalTime: Math.round(wait + travel), interchangeCount: 0,
    fare, discountedFare: fare, // no % discount on Rapid Metro
    isDirect: true,
    departureTime: fmt(curr + wait), arrivalTime: fmt(curr + wait + travel),
    fareNote: crossPhase ? "₹35 — cross-phase journey (via Sikanderpur)" : "₹20 flat fare",
  };
};
