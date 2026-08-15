import type { CityConfig } from "@/types/city";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

// Jaipur uses a matrix fare system — we provide equivalent slabs for CityConfig compat.
// Actual fare calculation uses fareData.ts::calculateFare() directly.
const JAIPUR_FARE_SLABS = [
  { minStations: 1, maxStations: 2, fare: 10 },
  { minStations: 3, maxStations: 5, fare: 15 },
  { minStations: 6, maxStations: 8, fare: 25 },
  { minStations: 9, maxStations: 10, fare: 30 },
];

export const jaipurConfig: CityConfig = {
  slug: "jaipur",
  name: "Jaipur",
  state: "Rajasthan",
  smartCardName: "JMRC Smart Card",
  smartCardDiscount: 0.10, // base; tiered logic in fareData.ts
  fareSlabs: JAIPUR_FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 6,
    firstTrainMinute: 0,
    lastTrainHour: 21,
    lastTrainMinute: 45,
    peakHeadwayMinutes: 10,
    offPeakHeadwayMinutes: 15,
  },
  localPlaces,
  geojsonPath: "/cities/jaipur/metroRoutes.geojson",
  mapCenter: [26.903, 75.789],
  mapZoom: 13,
  status: "operational",
};
