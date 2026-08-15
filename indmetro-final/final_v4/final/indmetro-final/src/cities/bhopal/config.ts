import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const bhopalConfig: CityConfig = {
  slug: "bhopal",
  name: "Bhopal",
  state: "Madhya Pradesh",
  smartCardName: "Bhoj Metro Smart Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 6,
    firstTrainMinute: 0,
    lastTrainHour: 22,
    lastTrainMinute: 0,
    peakHeadwayMinutes: 10,
    offPeakHeadwayMinutes: 15,
  },
  localPlaces,
  geojsonPath: "/cities/bhopal/metroRoutes.geojson",
  mapCenter: [23.2350, 77.4280],
  mapZoom: 13,
  status: "operational",
};
