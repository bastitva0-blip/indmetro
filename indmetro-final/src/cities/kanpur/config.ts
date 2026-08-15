import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const kanpurConfig: CityConfig = {
  slug: "kanpur",
  name: "Kanpur",
  state: "Uttar Pradesh",
  smartCardName: "GoSmart Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 6,
    firstTrainMinute: 0,
    lastTrainHour: 22,
    lastTrainMinute: 0,
    peakHeadwayMinutes: 7.5,
    offPeakHeadwayMinutes: 12,
  },
  localPlaces,
  geojsonPath: "/cities/kanpur/metroRoutes.geojson",
  mapCenter: [26.488, 80.31],
  mapZoom: 12,
  status: "operational",
};
