import { Station, stations, LINE_STATIONS, OPERATIONAL_STATIONS } from "./metroData";
import { getDistanceKm, calculateFare } from "./fareData";
import { getTravelTimeMinutes, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export interface RouteStep {
  type: "board"|"travel"|"interchange"|"alight";
  line?: "red"|"blue"|"green"; stationId?: string; stationName?: string;
  direction?: string; numStops?: number; durationMinutes?: number;
}
export interface PlannedRoute {
  origin: Station; destination: Station; steps: RouteStep[];
  totalStations: number; totalTime: number; interchangeCount: number;
  distanceKm: number; fare: number; discountedFare: number; isDirect: boolean;
  departureTime?: string; arrivalTime?: string;
}

const fmt = (m: number) =>
  `${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(Math.round(m%60)).padStart(2,"0")}`;

const commonLine = (a: string, b: string): "red"|"blue"|"green"|null => {
  for (const l of ["red","blue","green"] as const)
    if (LINE_STATIONS[l].includes(a) && LINE_STATIONS[l].includes(b)) return l;
  return null;
};

const getLineForStation = (id: string): "red"|"blue"|"green"|null =>
  LINE_STATIONS.red.includes(id) ? "red" : LINE_STATIONS.blue.includes(id) ? "blue"
  : LINE_STATIONS.green.includes(id) ? "green" : null;

// Three interchange nodes
const INTERCHANGES: { id: string; lines: ("red"|"blue"|"green")[] }[] = [
  { id: "ameerpet",          lines: ["red","blue"]   }, // Red ↔ Blue
  { id: "parade_ground",     lines: ["blue","green"]  }, // Blue ↔ Green (note: jbs_parade_ground on green side)
  { id: "mg_bus_station",    lines: ["red","green"]   }, // Red ↔ Green
];

// Map Green interchange station to its counterpart id
const GREEN_IX: Record<string, string> = {
  parade_ground:  "jbs_parade_ground",  // Blue Parade Ground ↔ Green JBS Parade Ground
  jbs_parade_ground: "parade_ground",
  mg_bus_station: "mg_bus_station_grn",
  mg_bus_station_grn: "mg_bus_station",
};

export const planRoute = (originId: string, destinationId: string, hasCard = false): PlannedRoute | null => {
  const origin = stations[originId], destination = stations[destinationId];
  if (!origin || !destination || originId === destinationId) return null;
  if (!OPERATIONAL_STATIONS.has(originId) || !OPERATIONAL_STATIONS.has(destinationId)) return null;

  const now = getISTDate(), curr = now.getHours()*60+now.getMinutes();

  // Direct
  const direct = commonLine(originId, destinationId);
  if (direct) {
    const arr = LINE_STATIONS[direct];
    const fi = arr.indexOf(originId), ti = arr.indexOf(destinationId);
    const stops = Math.abs(fi-ti);
    const distKm = getDistanceKm(originId, destinationId, direct);
    const travel = getTravelTimeMinutes(direct, originId, destinationId) ?? stops*2;
    const wait = getHeadwayMinutes(direct, now)/2;
    const dirSt = fi < ti ? stations[arr[arr.length-1]] : stations[arr[0]];
    return {
      origin, destination,
      steps: [
        { type:"board", line:direct, stationId:originId, stationName:origin.name, direction:`towards ${dirSt?.name}` },
        { type:"travel", line:direct, numStops:stops, durationMinutes:travel },
        { type:"alight", stationId:destinationId, stationName:destination.name },
      ],
      totalStations:stops, totalTime:Math.round(wait+travel), interchangeCount:0,
      distanceKm:Math.round(distKm*10)/10,
      fare:calculateFare(distKm,false), discountedFare:calculateFare(distKm,true),
      isDirect:true, departureTime:fmt(curr+wait), arrivalTime:fmt(curr+wait+travel),
    };
  }

  // Interchange
  const oLine = getLineForStation(originId), dLine = getLineForStation(destinationId);
  if (!oLine || !dLine) return null;

  for (const ix of INTERCHANGES) {
    if (!ix.lines.includes(oLine) || !ix.lines.includes(dLine)) continue;

    // find canonical ix id on each line
    const ixOnOriginLine = LINE_STATIONS[oLine].includes(ix.id) ? ix.id
      : LINE_STATIONS[oLine].includes(GREEN_IX[ix.id]??'') ? GREEN_IX[ix.id] : null;
    const ixOnDestLine = LINE_STATIONS[dLine].includes(ix.id) ? ix.id
      : LINE_STATIONS[dLine].includes(GREEN_IX[ix.id]??'') ? GREEN_IX[ix.id] : null;
    if (!ixOnOriginLine || !ixOnDestLine) continue;

    const l1arr = LINE_STATIONS[oLine], l2arr = LINE_STATIONS[dLine];
    const fi = l1arr.indexOf(originId), xi = l1arr.indexOf(ixOnOriginLine);
    const dxi = l2arr.indexOf(ixOnDestLine), di = l2arr.indexOf(destinationId);
    if (fi===-1||xi===-1||dxi===-1||di===-1) continue;

    const l1stops = Math.abs(fi-xi), l2stops = Math.abs(dxi-di);
    const d1 = getDistanceKm(originId, ixOnOriginLine, oLine);
    const d2 = getDistanceKm(ixOnDestLine, destinationId, dLine);
    const l1t = getTravelTimeMinutes(oLine, originId, ixOnOriginLine) ?? l1stops*2;
    const l2t = getTravelTimeMinutes(dLine, ixOnDestLine, destinationId) ?? l2stops*2;
    const wait = getHeadwayMinutes(oLine, now)/2;
    const totalDist = Math.round((d1+d2)*10)/10;
    const l2dirSt = dxi < di ? stations[l2arr[l2arr.length-1]] : stations[l2arr[0]];

    return {
      origin, destination,
      steps: [
        { type:"board", line:oLine, stationId:originId, stationName:origin.name, direction:`towards ${stations[ixOnOriginLine]?.name}` },
        { type:"travel", line:oLine, numStops:l1stops, durationMinutes:l1t },
        { type:"interchange", stationId:ix.id, stationName:stations[ix.id]?.name ?? ix.id },
        { type:"board", line:dLine, stationId:ixOnDestLine, stationName:stations[ixOnDestLine]?.name, direction:`towards ${l2dirSt?.name}` },
        { type:"travel", line:dLine, numStops:l2stops, durationMinutes:l2t },
        { type:"alight", stationId:destinationId, stationName:destination.name },
      ],
      totalStations:l1stops+l2stops, totalTime:Math.round(wait+l1t+3+l2t), interchangeCount:1,
      distanceKm:totalDist, fare:calculateFare(totalDist,false), discountedFare:calculateFare(totalDist,true),
      isDirect:false, departureTime:fmt(curr+wait), arrivalTime:fmt(curr+wait+l1t+3+l2t),
    };
  }
  return null;
};
