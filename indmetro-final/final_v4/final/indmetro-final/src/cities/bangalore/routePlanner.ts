/**
 * Bangalore Metro — Route Planner
 *
 * Handles 3-line network with 2 interchanges:
 *   Majestic (Purple ↔ Green) and RV Road (Green ↔ Yellow)
 *
 * Strategy: enumerate all valid route types and pick the fastest.
 *   - Direct single-line routes
 *   - 1-transfer routes (Purple↔Green, Green↔Yellow)
 *   - 2-transfer routes (Purple → Green → Yellow, and reverse)
 */

import { Station, stations, LINE_STATIONS, LINE_NAMES, getStationLines } from "./metroData";
import { calculateFare, getSmartCardDiscount } from "./fareData";
import {
  getTravelTimeMinutes, getHeadwayMinutes, getStationIndexOnLine,
  INTERCHANGE_TRANSFER_MINUTES, LINE_TIMINGS,
} from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export type BangaloreLine = "purple" | "green" | "yellow";

export interface RouteStep {
  type: "board" | "travel" | "transfer" | "alight";
  line?: BangaloreLine;
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
}

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (m: number) => {
  const h   = Math.floor(m / 60) % 24;
  const min = Math.round(m % 60);
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

const terminalLabel = (line: BangaloreLine, fromIdx: number): string => {
  const arr = LINE_STATIONS[line];
  const len = arr.length;
  const termId = fromIdx < len / 2 ? arr[len - 1] : arr[0];
  return `towards ${stations[termId]?.name ?? "terminal"}`;
};

// Segment: travel on one line from A to B, returns step + stats
const segmentOnLine = (
  fromId: string,
  toId: string,
  line: BangaloreLine,
  now: Date
): {
  steps: RouteStep[];
  stations: number;
  timeMin: number;
} | null => {
  const fromIdx = getStationIndexOnLine(line, fromId);
  const toIdx   = getStationIndexOnLine(line, toId);
  if (fromIdx === -1 || toIdx === -1) return null;
  const numStops = Math.abs(toIdx - fromIdx);
  const travel   = getTravelTimeMinutes(line, fromId, toId) ?? numStops * 2;
  const headway  = getHeadwayMinutes(line, now);
  const wait     = headway / 2;
  return {
    steps: [
      { type: "board",  line, stationId: fromId, stationName: stations[fromId]?.name, direction: terminalLabel(line, fromIdx) },
      { type: "travel", line, numStops, durationMinutes: travel },
    ],
    stations: numStops,
    timeMin: wait + travel,
  };
};

// Transfer step at an interchange station
const transferStep = (stationId: string): RouteStep => ({
  type: "transfer",
  stationId,
  stationName: stations[stationId]?.name,
  transferNote: "Change platform",
  durationMinutes: INTERCHANGE_TRANSFER_MINUTES,
});

// Wrap route segments into a full PlannedRoute
const buildRoute = (
  originId: string,
  destinationId: string,
  segments: { steps: RouteStep[]; stations: number; timeMin: number }[],
  transferCount: number,
  hasSmartCard: boolean,
  now: Date
): PlannedRoute => {
  const totalStations = segments.reduce((s, seg) => s + seg.stations, 0);
  const travelTime    = segments.reduce((s, seg) => s + seg.timeMin, 0);
  const extraTransfer = transferCount * INTERCHANGE_TRANSFER_MINUTES;
  const totalTime     = Math.round(travelTime + extraTransfer);

  const fare            = calculateFare(totalStations, false);
  const discountPct     = getSmartCardDiscount(now);
  const discountedFare  = Math.round(fare * (1 - discountPct));
  const currentMin      = now.getHours() * 60 + now.getMinutes();

  // Flatten steps, inserting transfer steps between segments + final alight
  const steps: RouteStep[] = [];
  segments.forEach((seg, i) => {
    steps.push(...seg.steps);
    if (i < segments.length - 1) {
      // Find interchange station = last stop of this segment
      const lastTravelStep = [...seg.steps].reverse().find((s) => s.type === "travel");
      const lastLine = seg.steps.find((s) => s.type === "board")?.line;
      // The "alight at interchange" is implicit in transfer
      const transferId = lastLine === "purple" || (lastLine === "green" && segments[i + 1].steps[0]?.line === "purple")
        ? "majestic" : "rv_road";
      steps.push(transferStep(transferId));
    }
  });
  steps.push({ type: "alight", stationId: destinationId, stationName: stations[destinationId]?.name });

  return {
    origin: stations[originId],
    destination: stations[destinationId],
    steps,
    totalStations,
    totalTime,
    interchangeCount: transferCount,
    fare,
    discountedFare,
    smartCardDiscountPercent: Math.round(discountPct * 100),
    isDirect: transferCount === 0,
    departureTime: fmt(currentMin),
    arrivalTime:   fmt(currentMin + totalTime),
  };
};

// ── main planner ─────────────────────────────────────────────────────────────

export const planRoute = (
  originId: string,
  destinationId: string,
  hasSmartCard = false
): PlannedRoute | null => {
  if (!originId || !destinationId || originId === destinationId) return null;
  if (!stations[originId] || !stations[destinationId]) return null;

  const now        = getISTDate();
  const originLines = getStationLines(originId);
  const destLines   = getStationLines(destinationId);
  const candidates: PlannedRoute[] = [];

  // ── 1. Direct (same line) ──────────────────────────────────────────
  for (const line of (["purple", "green", "yellow"] as BangaloreLine[])) {
    if (originLines.includes(line) && destLines.includes(line)) {
      const seg = segmentOnLine(originId, destinationId, line, now);
      if (seg) candidates.push(buildRoute(originId, destinationId, [seg], 0, hasSmartCard, now));
    }
  }

  // ── 2. Purple ↔ Green via Majestic ────────────────────────────────
  const tryPurpleGreen = (fromId: string, toId: string, fromLine: "purple", toLine: "green") => {
    if (!originLines.includes(fromLine) || !destLines.includes(toLine)) return;
    const seg1 = segmentOnLine(fromId, "majestic", fromLine, now);
    const seg2 = segmentOnLine("majestic", toId, toLine, now);
    if (seg1 && seg2) candidates.push(buildRoute(fromId, toId, [seg1, seg2], 1, hasSmartCard, now));
  };
  tryPurpleGreen(originId, destinationId, "purple", "green");

  const tryGreenPurple = (fromId: string, toId: string) => {
    if (!originLines.includes("green") || !destLines.includes("purple")) return;
    const seg1 = segmentOnLine(fromId, "majestic", "green", now);
    const seg2 = segmentOnLine("majestic", toId, "purple", now);
    if (seg1 && seg2) candidates.push(buildRoute(fromId, toId, [seg1, seg2], 1, hasSmartCard, now));
  };
  tryGreenPurple(originId, destinationId);

  // ── 3. Green ↔ Yellow via RV Road ─────────────────────────────────
  const tryGreenYellow = (fromId: string, toId: string) => {
    if (!originLines.includes("green") || !destLines.includes("yellow")) return;
    const seg1 = segmentOnLine(fromId, "rv_road", "green", now);
    const seg2 = segmentOnLine("rv_road", toId, "yellow", now);
    if (seg1 && seg2) candidates.push(buildRoute(fromId, toId, [seg1, seg2], 1, hasSmartCard, now));
  };
  const tryYellowGreen = (fromId: string, toId: string) => {
    if (!originLines.includes("yellow") || !destLines.includes("green")) return;
    const seg1 = segmentOnLine(fromId, "rv_road", "yellow", now);
    const seg2 = segmentOnLine("rv_road", toId, "green", now);
    if (seg1 && seg2) candidates.push(buildRoute(fromId, toId, [seg1, seg2], 1, hasSmartCard, now));
  };
  tryGreenYellow(originId, destinationId);
  tryYellowGreen(originId, destinationId);

  // ── 4. Purple → Green → Yellow (2 transfers) ──────────────────────
  const tryPurpleYellow = (fromId: string, toId: string) => {
    if (!originLines.includes("purple") || !destLines.includes("yellow")) return;
    const seg1 = segmentOnLine(fromId, "majestic", "purple", now);
    const seg2 = segmentOnLine("majestic", "rv_road", "green", now);
    const seg3 = segmentOnLine("rv_road", toId, "yellow", now);
    if (seg1 && seg2 && seg3) candidates.push(buildRoute(fromId, toId, [seg1, seg2, seg3], 2, hasSmartCard, now));
  };
  const tryYellowPurple = (fromId: string, toId: string) => {
    if (!originLines.includes("yellow") || !destLines.includes("purple")) return;
    const seg1 = segmentOnLine(fromId, "rv_road", "yellow", now);
    const seg2 = segmentOnLine("rv_road", "majestic", "green", now);
    const seg3 = segmentOnLine("majestic", toId, "purple", now);
    if (seg1 && seg2 && seg3) candidates.push(buildRoute(fromId, toId, [seg1, seg2, seg3], 2, hasSmartCard, now));
  };
  tryPurpleYellow(originId, destinationId);
  tryYellowPurple(originId, destinationId);

  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => a.totalTime - b.totalTime)[0];
};
