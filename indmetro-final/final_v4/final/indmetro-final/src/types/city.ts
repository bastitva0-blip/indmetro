import type { LineTiming } from "@/data/segmentTimings";

export interface TimetableConfig {
  firstTrainHour: number;      // e.g. 6
  firstTrainMinute: number;
  lastTrainHour: number;       // e.g. 22
  lastTrainMinute: number;
  peakHeadwayMinutes: number;
  offPeakHeadwayMinutes: number;
}

export interface LocalPlace {
  id: string;
  name: string;
  nearestStationId: string;
  distanceKm: number;
  category: "heritage" | "shopping" | "park" | "education" | "hospital" | "transport" | "civic" | "religious" | "entertainment" | "sports";
  coordinates: [number, number];
}

export interface CityConfig {
  slug: string;
  name: string;
  state: string;
  smartCardName: string;
  smartCardDiscount: number;       // 0.10 = 10%
  fareSlabs: unknown[];  // city-specific — can be FareSlab[], FareZone[], etc.
  segmentTimings: LineTiming[];
  timetableConfig: TimetableConfig;
  localPlaces: LocalPlace[];
  geojsonPath: string;
  mapCenter: [number, number];     // [lat, lng]
  mapZoom: number;
  status: "operational" | "partial" | "wip";
}
