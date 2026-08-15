import { Station, stations, LINE_STATIONS, OPERATIONAL_STATIONS } from "./metroData";
import { calculateFare } from "./fareData";
import { getTravelTimeMinutes, getHeadwayMinutes } from "./segmentTimings";
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

const getLineForStation = (id: string): "orange" | "blue" | null => {
  if (LINE_STATIONS.orange.includes(id)) return "orange";
  if (LINE_STATIONS.blue.includes(id)) return "blue";
  return null;
};

const getCommonLine = (originId: string, destId: string): "orange" | "blue" | null => {
  for (const line of ["orange", "blue"] as const) {
    if (LINE_STATIONS[line].includes(originId) && LINE_STATIONS[line].includes(destId)) return line;
  }
  return null;
};

// Rawatpur is the only interchange
const INTERCHANGE_ID = "rawatpur";

export const planRoute = (originId: string, destinationId: string, hasGoSmartCard = false): PlannedRoute | null => {
  const origin = stations[originId];
  const destination = stations[destinationId];
  if (!origin || !destination || originId === destinationId) return null;

  const now = getISTDate();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  // Try direct on same line first
  const directLine = getCommonLine(originId, destinationId);
  if (directLine) {
    const lineArr = LINE_STATIONS[directLine];
    const fi = lineArr.indexOf(originId);
    const ti = lineArr.indexOf(destinationId);
    const totalStations = Math.abs(ti - fi);
    const travelTime = getTravelTimeMinutes(directLine, originId, destinationId) ?? totalStations * 2.2;
    const fare = calculateFare(totalStations);
    const discountedFare = calculateFare(totalStations, true);
    const headway = getHeadwayMinutes(directLine, now);
    const wait = headway / 2;
    const dirStation = fi < ti ? stations[lineArr[lineArr.length - 1]] : stations[lineArr[0]];
    const direction = `towards ${dirStation.name}`;

    return {
      origin, destination,
      steps: [
        { type: "board", line: directLine, stationId: originId, stationName: origin.name, direction },
        { type: "travel", line: directLine, numStops: totalStations, durationMinutes: travelTime },
        { type: "alight", stationId: destinationId, stationName: destination.name },
      ],
      totalStations,
      totalTime: Math.round(wait + travelTime),
      interchangeCount: 0,
      fare,
      discountedFare,
      isDirect: true,
      departureTime: fmt(currentMin + wait),
      arrivalTime: fmt(currentMin + wait + travelTime),
    };
  }

  // Try via Rawatpur interchange
  const originLine = getLineForStation(originId);
  const destLine = getLineForStation(destinationId);
  if (!originLine || !destLine || originLine === destLine) return null;

  if (!LINE_STATIONS[originLine].includes(INTERCHANGE_ID) || !LINE_STATIONS[destLine].includes(INTERCHANGE_ID)) return null;

  const leg1Stops = Math.abs(LINE_STATIONS[originLine].indexOf(originId) - LINE_STATIONS[originLine].indexOf(INTERCHANGE_ID));
  const leg2Stops = Math.abs(LINE_STATIONS[destLine].indexOf(INTERCHANGE_ID) - LINE_STATIONS[destLine].indexOf(destinationId));
  const leg1Time = getTravelTimeMinutes(originLine, originId, INTERCHANGE_ID) ?? leg1Stops * 2.2;
  const leg2Time = getTravelTimeMinutes(destLine, INTERCHANGE_ID, destinationId) ?? leg2Stops * 2.2;
  const interchangeWait = 3;
  const totalStations = leg1Stops + leg2Stops;
  const fare = calculateFare(totalStations);
  const discountedFare = calculateFare(totalStations, true);
  const headway = getHeadwayMinutes(originLine, now);
  const wait = headway / 2;
  const totalTime = Math.round(wait + leg1Time + interchangeWait + leg2Time);

  const leg1Dir = `towards Rawatpur (interchange)`;
  const leg2Di = LINE_STATIONS[destLine].indexOf(INTERCHANGE_ID) < LINE_STATIONS[destLine].indexOf(destinationId)
    ? `towards ${stations[LINE_STATIONS[destLine][LINE_STATIONS[destLine].length - 1]].name}`
    : `towards ${stations[LINE_STATIONS[destLine][0]].name}`;

  return {
    origin, destination,
    steps: [
      { type: "board", line: originLine, stationId: originId, stationName: origin.name, direction: leg1Dir },
      { type: "travel", line: originLine, numStops: leg1Stops, durationMinutes: leg1Time },
      { type: "interchange", stationId: INTERCHANGE_ID, stationName: stations[INTERCHANGE_ID].name },
      { type: "board", line: destLine, stationId: INTERCHANGE_ID, stationName: stations[INTERCHANGE_ID].name, direction: leg2Di },
      { type: "travel", line: destLine, numStops: leg2Stops, durationMinutes: leg2Time },
      { type: "alight", stationId: destinationId, stationName: destination.name },
    ],
    totalStations,
    totalTime,
    interchangeCount: 1,
    fare,
    discountedFare,
    isDirect: false,
    departureTime: fmt(currentMin + wait),
    arrivalTime: fmt(currentMin + totalTime),
  };
};
