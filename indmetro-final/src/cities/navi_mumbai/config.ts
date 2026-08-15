import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const naviMumbaiConfig: CityConfig = {
  slug: "navi_mumbai",
  name: "Navi Mumbai",
  state: "Maharashtra",
  smartCardName: "CIDCO Metro Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 6, firstTrainMinute: 0,
    lastTrainHour: 22, lastTrainMinute: 0,
    peakHeadwayMinutes: 15, offPeakHeadwayMinutes: 15,
  },
  localPlaces,
  geojsonPath: "/cities/navi_mumbai/metroRoutes.geojson",
  mapCenter: [19.022, 73.065],
  mapZoom: 13,
  status: "operational",
};
