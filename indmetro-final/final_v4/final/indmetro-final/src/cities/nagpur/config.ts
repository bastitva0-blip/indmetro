import type { CityConfig } from "@/types/city";
import { FARE_ZONES } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const nagpurConfig: CityConfig = {
  slug: "nagpur",
  name: "Nagpur",
  state: "Maharashtra",
  smartCardName: "Maha Metro Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_ZONES,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 6, firstTrainMinute: 0,
    lastTrainHour: 22, lastTrainMinute: 0,
    peakHeadwayMinutes: 3, offPeakHeadwayMinutes: 7,
  },
  localPlaces,
  geojsonPath: "/cities/nagpur/metroRoutes.geojson",
  mapCenter: [21.145, 79.080],
  mapZoom: 13,
  status: "operational",
};
