import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const delhiConfig: CityConfig = {
  slug: "delhi",
  name: "Delhi",
  state: "Delhi NCT",
  smartCardName: "Delhi Metro Smart Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 5,
    firstTrainMinute: 30,
    lastTrainHour: 23,
    lastTrainMinute: 30,
    peakHeadwayMinutes: 3,
    offPeakHeadwayMinutes: 7,
  },
  localPlaces,
  geojsonPath: "/cities/delhi/metroRoutes.geojson",
  mapCenter: [28.620, 77.210],
  mapZoom: 11,
  status: "operational",
};
