/**
 * Generic train position simulation — works with any city's timetable schedules.
 * Mirrors the logic in src/data/timetable.ts (Lucknow) but is city-agnostic.
 */
import { getISTDate } from "@/lib/utils";

export interface GenericSchedule {
  id: string;
  line: string;
  direction: "forward" | "backward";
  startTime: string;           // "HH:MM"
  stations: string[];          // ordered station ids
  stationTimes: number[];      // cumulative minutes from first station
}

export type TrainStatus = "not_started" | "in_transit" | "at_station" | "completed";

export interface TrainPosition {
  status: TrainStatus;
  stationId?: string;          // when at_station
  fromStationId?: string;      // when in_transit
  toStationId?: string;
  progress?: number;           // 0–1 between fromStation and toStation
  lat?: number;
  lng?: number;
}

const toMin = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const getCurrentISTMinutes = (): number => {
  const now = getISTDate();
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
};

export const getTrainPosition = (
  schedule: GenericSchedule,
  stations: Record<string, { coordinates: [number, number] }>,
  currentMinutes = getCurrentISTMinutes()
): TrainPosition => {
  const startMinutes = toMin(schedule.startTime);
  const elapsed = currentMinutes - startMinutes;
  const totalMinutes = schedule.stationTimes[schedule.stationTimes.length - 1];

  if (elapsed < 0) return { status: "not_started" };
  if (elapsed >= totalMinutes) return { status: "completed" };

  for (let i = 0; i < schedule.stationTimes.length - 1; i++) {
    const segStart = schedule.stationTimes[i];
    const segEnd = schedule.stationTimes[i + 1];
    const segDuration = segEnd - segStart;

    if (elapsed >= segStart && elapsed < segEnd) {
      const progress = segDuration > 0 ? (elapsed - segStart) / segDuration : 0;
      const fromId = schedule.stations[i];
      const toId = schedule.stations[i + 1];
      const fromCoords = stations[fromId]?.coordinates;
      const toCoords = stations[toId]?.coordinates;

      let lat: number | undefined;
      let lng: number | undefined;
      if (fromCoords && toCoords) {
        lat = fromCoords[0] + (toCoords[0] - fromCoords[0]) * progress;
        lng = fromCoords[1] + (toCoords[1] - fromCoords[1]) * progress;
      }

      // "At station" if within 30s of arrival
      if (progress < 0.05 || progress > 0.95) {
        const atId = progress < 0.05 ? fromId : toId;
        const atCoords = stations[atId]?.coordinates;
        return {
          status: "at_station",
          stationId: atId,
          lat: atCoords?.[0],
          lng: atCoords?.[1],
        };
      }

      return {
        status: "in_transit",
        fromStationId: fromId,
        toStationId: toId,
        progress,
        lat,
        lng,
      };
    }
  }
  return { status: "completed" };
};

export const getActiveTrains = (
  schedules: GenericSchedule[],
  stations: Record<string, { coordinates: [number, number] }>,
  currentMinutes = getCurrentISTMinutes()
): { schedule: GenericSchedule; position: TrainPosition }[] => {
  return schedules
    .map((s) => ({ schedule: s, position: getTrainPosition(s, stations, currentMinutes) }))
    .filter((t) => t.position.status === "in_transit" || t.position.status === "at_station");
};
