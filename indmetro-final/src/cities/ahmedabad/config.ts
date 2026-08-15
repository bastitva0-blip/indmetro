import type { CityConfig } from "@/types/city";
import { FARE_ZONES } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const ahmedabadConfig: CityConfig = {
  slug: "ahmedabad",
  name: "Ahmedabad",
  state: "Gujarat",
  smartCardName: "GMRC Smart Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_ZONES,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 6, firstTrainMinute: 0,
    lastTrainHour: 22, lastTrainMinute: 0,
    peakHeadwayMinutes: 10, offPeakHeadwayMinutes: 15,
  },
  localPlaces,
  geojsonPath: "/cities/ahmedabad/metroRoutes.geojson",
  mapCenter: [23.035, 72.580],
  mapZoom: 12,
  status: "operational",
};
