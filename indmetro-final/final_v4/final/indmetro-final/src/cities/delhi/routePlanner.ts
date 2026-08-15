/**
 * Delhi Metro Route Planner — BFS across 10 lines + 15+ interchanges.
 *
 * State: { stationId, line }
 * Edges: adjacent stations on same line + transfer edges at interchange stations
 * Cost: time in minutes (travel + transfer penalty + wait)
 *
 * Returns the fastest route (min total time), not necessarily fewest transfers.
 */

import { Station, stations, LINE_STATIONS, LINE_NAMES, LINE_COLORS, DelhiLine, getStationLines } from "./metroData";
import { calculateFare, getSmartCardDiscount, getAirportExpressFare } from "./fareData";
import { getTravelTimeMinutes, getHeadwayMinutes, INTERCHANGE_TRANSFER_MINUTES, LINE_TIMINGS } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface RouteStep {
  type: "board" | "travel" | "transfer" | "alight";
  line?: DelhiLine;
  stationId?: string;
  stationName?: string;
  direction?: string;
  numStops?: number;
  durationMinutes?: number;
  transferNote?: string;
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
  isAirportExpress?: boolean;
}

interface BFSState {
  stationId: string;
  line: DelhiLine;
  totalTime: number;
  transfers: number;
  path: { stationId: string; line: DelhiLine }[];
}

const fmt = (m: number) => {
  const h = Math.floor(m / 60) % 24;
  const min = Math.round(m % 60);
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

const terminalName = (line: DelhiLine, fromIdx: number): string => {
  const arr = LINE_STATIONS[line];
  const termId = fromIdx < arr.length / 2 ? arr[arr.length - 1] : arr[0];
  return `towards ${stations[termId]?.name ?? "terminal"}`;
};

// Build BFS result into a PlannedRoute
const buildRoute = (
  path: { stationId: string; line: DelhiLine }[],
  hasSmartCard: boolean,
  now: Date
): PlannedRoute | null => {
  if (path.length < 2) return null;

  const originId = path[0].stationId;
  const destId   = path[path.length - 1].stationId;
  const origin   = stations[originId];
  const dest     = stations[destId];
  if (!origin || !dest) return null;

  // Group consecutive stations on same line into segments
  type Segment = { line: DelhiLine; from: string; to: string; stations: string[] };
  const segments: Segment[] = [];
  let curLine = path[0].line;
  let segStations: string[] = [path[0].stationId];

  for (let i = 1; i < path.length; i++) {
    const { stationId, line } = path[i];
    if (line === curLine) {
      segStations.push(stationId);
    } else {
      segments.push({ line: curLine, from: segStations[0], to: segStations[segStations.length - 1], stations: segStations });
      curLine = line;
      segStations = [path[i - 1].stationId, stationId]; // include transfer station
    }
  }
  segments.push({ line: curLine, from: segStations[0], to: segStations[segStations.length - 1], stations: segStations });

  const steps: RouteStep[] = [];
  let totalStations = 0;
  let totalTravelTime = 0;
  let interchangeCount = 0;

  segments.forEach((seg, i) => {
    const fromIdx = LINE_TIMINGS[seg.line].stations.indexOf(seg.from);
    const numStops = seg.stations.length - 1;
    totalStations += numStops;
    const travel = getTravelTimeMinutes(seg.line, seg.from, seg.to) ?? numStops * 2;
    totalTravelTime += travel;
    const headway = getHeadwayMinutes(seg.line, now);
    const wait = i === 0 ? headway / 2 : 0; // only wait for first board
    totalTravelTime += wait;

    steps.push({
      type: "board",
      line: seg.line,
      stationId: seg.from,
      stationName: stations[seg.from]?.name,
      direction: terminalName(seg.line, fromIdx),
    });
    steps.push({ type: "travel", line: seg.line, numStops, durationMinutes: Math.round(travel) });

    if (i < segments.length - 1) {
      interchangeCount++;
      totalTravelTime += INTERCHANGE_TRANSFER_MINUTES;
      steps.push({
        type: "transfer",
        stationId: seg.to,
        stationName: stations[seg.to]?.name,
        durationMinutes: INTERCHANGE_TRANSFER_MINUTES,
        transferNote: `Change to ${LINE_NAMES[segments[i + 1].line]}`,
      });
    }
  });

  steps.push({ type: "alight", stationId: destId, stationName: dest.name });

  const isAirportExpress = segments.some((s) => s.line === "orange");
  let fare: number;
  if (isAirportExpress && segments.length === 1) {
    fare = getAirportExpressFare(originId, destId);
  } else {
    fare = calculateFare(totalStations, false, now);
  }

  const discountPct = getSmartCardDiscount(now);
  const discountedFare = Math.round(fare * (1 - discountPct));
  const totalTime = Math.round(totalTravelTime);
  const currentMin = now.getHours() * 60 + now.getMinutes();

  return {
    origin, destination: dest,
    steps, totalStations, totalTime, interchangeCount,
    fare, discountedFare,
    smartCardDiscountPercent: Math.round(discountPct * 100),
    isDirect: interchangeCount === 0,
    departureTime: fmt(currentMin),
    arrivalTime: fmt(currentMin + totalTime),
    isAirportExpress,
  };
};

export const planRoute = (
  originId: string,
  destinationId: string,
  hasSmartCard = false
): PlannedRoute | null => {
  if (!originId || !destinationId || originId === destinationId) return null;
  if (!stations[originId] || !stations[destinationId]) return null;

  const now = getISTDate();

  // Build adjacency: (stationId, line) → [(stationId, line)]
  // For each line, connect adjacent stations
  // At interchange stations, can switch lines (with transfer cost)

  const visited = new Set<string>();
  const queue: BFSState[] = [];

  // Initialize from all lines of origin station
  for (const line of getStationLines(originId)) {
    const key = `${originId}|${line}`;
    if (!visited.has(key)) {
      visited.add(key);
      queue.push({ stationId: originId, line, totalTime: 0, transfers: 0, path: [{ stationId: originId, line }] });
    }
  }

  // BFS (priority queue by totalTime would be Dijkstra — but BFS with transfer penalty is close enough)
  let best: BFSState | null = null;

  while (queue.length > 0) {
    // Simple priority: sort by totalTime + transfers * 5
    queue.sort((a, b) => (a.totalTime + a.transfers * 5) - (b.totalTime + b.transfers * 5));
    const current = queue.shift()!;

    if (current.stationId === destinationId) {
      if (!best || current.totalTime < best.totalTime) best = current;
      continue;
    }

    if (best && current.totalTime >= best.totalTime) continue;
    if (current.transfers > 4) continue; // limit transfers

    const lineArr = LINE_STATIONS[current.line];
    const idx = lineArr.indexOf(current.stationId);

    // Move to adjacent stations on same line
    for (const nextIdx of [idx - 1, idx + 1]) {
      if (nextIdx < 0 || nextIdx >= lineArr.length) continue;
      const nextId = lineArr[nextIdx];
      const key = `${nextId}|${current.line}`;
      if (visited.has(key)) continue;
      visited.add(key);
      const travelTime = getTravelTimeMinutes(current.line, current.stationId, nextId) ?? 2;
      queue.push({
        stationId: nextId,
        line: current.line,
        totalTime: current.totalTime + travelTime,
        transfers: current.transfers,
        path: [...current.path, { stationId: nextId, line: current.line }],
      });
    }

    // Transfer at interchange stations
    if (stations[current.stationId]?.isInterchange || stations[current.stationId]?.lines.length > 1) {
      for (const otherLine of getStationLines(current.stationId)) {
        if (otherLine === current.line) continue;
        const key = `${current.stationId}|${otherLine}`;
        if (visited.has(key)) continue;
        visited.add(key);
        queue.push({
          stationId: current.stationId,
          line: otherLine,
          totalTime: current.totalTime + INTERCHANGE_TRANSFER_MINUTES,
          transfers: current.transfers + 1,
          path: [...current.path, { stationId: current.stationId, line: otherLine }],
        });
      }
    }
  }

  if (!best) return null;
  return buildRoute(best.path, hasSmartCard, now);
};
