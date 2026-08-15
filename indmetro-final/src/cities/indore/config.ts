import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";
export const indoreConfig: CityConfig = {
  slug: "indore", name: "Indore", state: "Madhya Pradesh",
  smartCardName: "MPMRCL Smart Card", smartCardDiscount: 0.10,
  fareSlabs: FARE_SLABS, segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: { firstTrainHour:6, firstTrainMinute:0, lastTrainHour:22, lastTrainMinute:0, peakHeadwayMinutes:10, offPeakHeadwayMinutes:15 },
  localPlaces,
  geojsonPath: "/cities/indore/metroRoutes.geojson",
  mapCenter: [22.7248, 75.8652], mapZoom: 12, status: "operational",
};
