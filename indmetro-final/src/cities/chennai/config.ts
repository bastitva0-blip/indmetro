import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";
export const chennaiConfig: CityConfig = {
  slug: "chennai", name: "Chennai", state: "Tamil Nadu",
  smartCardName: "CMRL Smart Card",
  smartCardDiscount: 0,
  fareSlabs: FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: { firstTrainHour:5, firstTrainMinute:0, lastTrainHour:23, lastTrainMinute:0, peakHeadwayMinutes:5, offPeakHeadwayMinutes:8 },
  localPlaces,
  geojsonPath: "/cities/chennai/metroRoutes.geojson",
  mapCenter: [13.052, 80.230],
  mapZoom: 12,
  status: "operational",
};
