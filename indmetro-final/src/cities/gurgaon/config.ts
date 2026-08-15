import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const gurgaonConfig: CityConfig = {
  slug: "gurgaon",
  name: "Gurgaon",
  state: "Haryana",
  smartCardName: "Rapid Metro Card",
  smartCardDiscount: 0,
  fareSlabs: FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: { firstTrainHour: 6, firstTrainMinute: 5, lastTrainHour: 22, lastTrainMinute: 0, peakHeadwayMinutes: 4, offPeakHeadwayMinutes: 6 },
  localPlaces,
  geojsonPath: "/cities/gurgaon/metroRoutes.geojson",
  mapCenter: [28.460, 77.098],
  mapZoom: 14,
  status: "operational",
};
