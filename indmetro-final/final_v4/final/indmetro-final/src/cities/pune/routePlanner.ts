/**
 * Pune Metro — Route Planner
 * Two independent lines (Purple + Aqua), no interchange.
 * Cross-line routes cannot be planned until Pink Line UC adds a transfer.
 */

import { Station, stations, LINE_STATIONS, LINE_COLORS, getStationLine } from "./metroData";
import { calculateFare, getSmartCardDiscount } from "./fareData";
import { getTravelTimeMinutes, getStationCount, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface RouteStep {
  type: "board" | "travel" | "alight";
  line?: "purple" | "aqua";
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
  smartCardDiscountPercent: number;
  isDirect: boolean;
  departureTime?: string;
  arrivalTime?: string;
  line: "purple" | "aqua";
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
  if (!originId || !destinationId || originId === destinationId) return null;

  const origin      = stations[originId];
  const destination = stations[destinationId];
  if (!origin || !destination) return null;

  const originLine = getStationLine(originId);
  const destLine   = getStationLine(destinationId);

  // Cross-line: no interchange available
  if (!originLine || !destLine || originLine !== destLine) return null;

  const line    = originLine;
  const lineArr = LINE_STATIONS[line];
  const fi      = lineArr.indexOf(originId);
  const ti      = lineArr.indexOf(destinationId);
  if (fi === -1 || ti === -1) return null;

  const totalStations   = Math.abs(ti - fi);
  const travelTime      = getTravelTimeMinutes(line, originId, destinationId) ?? totalStations * 2;
  const fare            = calculateFare(totalStations, false);
  const now             = getISTDate();
  const discountPct     = getSmartCardDiscount(now);
  const discountedFare  = Math.round(fare * (1 - discountPct));
  const headway         = getHeadwayMinutes(line, now);
  const wait            = headway / 2;
  const currentMin      = now.getHours() * 60 + now.getMinutes();

  const terminalId  = fi < ti ? lineArr[lineArr.length - 1] : lineArr[0];
  const direction   = `towards ${stations[terminalId]?.name}`;

  return {
    origin,
    destination,
    steps: [
      { type: "board",  line, stationId: originId,      stationName: origin.name, direction },
      { type: "travel", line, numStops: totalStations,  durationMinutes: travelTime },
      { type: "alight",      stationId: destinationId, stationName: destination.name },
    ],
    totalStations,
    totalTime: Math.round(wait + travelTime),
    interchangeCount: 0,
    fare,
    discountedFare,
    smartCardDiscountPercent: Math.round(discountPct * 100),
    isDirect: true,
    line,
    departureTime: fmt(currentMin + wait),
    arrivalTime:   fmt(currentMin + wait + travelTime),
  };
};
