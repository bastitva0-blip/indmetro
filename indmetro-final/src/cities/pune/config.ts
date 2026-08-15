import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const puneConfig: CityConfig = {
  slug: "pune",
  name: "Pune",
  state: "Maharashtra",
  smartCardName: "Maha Metro Card",
  smartCardDiscount: 0.10, // weekday 10%; weekend 30% handled in fareData.ts
  fareSlabs: FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 6,
    firstTrainMinute: 0,
    lastTrainHour: 23,
    lastTrainMinute: 0,
    peakHeadwayMinutes: 7,
    offPeakHeadwayMinutes: 12,
  },
  localPlaces,
  geojsonPath: "/cities/pune/metroRoutes.geojson",
  mapCenter: [18.538, 73.855],
  mapZoom: 12,
  status: "operational",
};
