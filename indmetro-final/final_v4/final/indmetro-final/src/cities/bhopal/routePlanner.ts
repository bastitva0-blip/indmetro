/**
 * Bhopal Metro — Route Planner
 * Only operational Orange Line stations are routable.
 * Pul Bogda interchange is WIP — no Blue Line routes possible yet.
 */

import { Station, stations, LINE_STATIONS, OPERATIONAL_STATIONS } from "./metroData";
import { calculateFare } from "./fareData";
import { getTravelTimeMinutes, getStationCount, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface RouteStep {
  type: "board" | "travel" | "interchange" | "alight";
  line?: "orange" | "blue";
  stationId?: string;
  stationName?: string;
  direction?: string;
  numStops?: number;
  durationMinutes?: number;
}

export interface PlannedRoute {
  origin: Station;
  destination: Station;
  steps: RouteStep[];
  totalStations: number;
  totalTime: number;
  interchangeCount: number;
  fare: number;
  discountedFare?: number;
  isDirect: boolean;
  departureTime?: string;
  arrivalTime?: string;
}

const fmt = (m: number) => {
  const h = Math.floor(m / 60) % 24;
  const min = Math.round(m % 60);
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

export const planRoute = (
  originId: string,
  destinationId: string,
  hasSmartCard = false
): PlannedRoute | null => {
  const origin = stations[originId];
  const destination = stations[destinationId];

  if (!origin || !destination || originId === destinationId) return null;
  if (!OPERATIONAL_STATIONS.has(originId) || !OPERATIONAL_STATIONS.has(destinationId)) return null;

  // All operational stations are on the Orange Line — always direct
  const line = "orange" as const;
  const lineArr = LINE_STATIONS[line];
  const fi = lineArr.indexOf(originId);
  const ti = lineArr.indexOf(destinationId);
  if (fi === -1 || ti === -1) return null;

  const totalStations = Math.abs(ti - fi);
  const travelTime = getTravelTimeMinutes(line, originId, destinationId) ?? totalStations * 1.75;
  const fare = calculateFare(totalStations, false);
  const discountedFare = calculateFare(totalStations, true);

  const now = getISTDate();
  const headway = getHeadwayMinutes(line, now);
  const wait = headway / 2;
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const terminalId = fi < ti ? lineArr[lineArr.length - 1] : lineArr[0];
  const direction = `towards ${stations[terminalId]?.name ?? "terminal"}`;

  return {
    origin,
    destination,
    steps: [
      { type: "board",   line, stationId: originId,      stationName: origin.name, direction },
      { type: "travel",  line, numStops: totalStations,  durationMinutes: travelTime },
      { type: "alight",        stationId: destinationId, stationName: destination.name },
    ],
    totalStations,
    totalTime: Math.round(wait + travelTime),
    interchangeCount: 0,
    fare,
    discountedFare,
    isDirect: true,
    departureTime: fmt(currentMin + wait),
    arrivalTime:   fmt(currentMin + wait + travelTime),
  };
};
