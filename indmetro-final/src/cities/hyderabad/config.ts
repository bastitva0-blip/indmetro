import type { CityConfig } from "@/types/city";
import { FARE_ZONES } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const hyderabadConfig: CityConfig = {
  slug: "hyderabad",
  name: "Hyderabad",
  state: "Telangana",
  smartCardName: "Tspay Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_ZONES,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 6, firstTrainMinute: 0,
    lastTrainHour: 23, lastTrainMinute: 0,
    peakHeadwayMinutes: 3.5, offPeakHeadwayMinutes: 7,
  },
  localPlaces,
  geojsonPath: "/cities/hyderabad/metroRoutes.geojson",
  mapCenter: [17.387, 78.490],
  mapZoom: 12,
  status: "operational",
};
