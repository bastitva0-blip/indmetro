import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const patnaConfig: CityConfig = {
  slug: "patna",
  name: "Patna",
  state: "Bihar",
  smartCardName: "PMRC Smart Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 8, firstTrainMinute: 0,
    lastTrainHour: 22, lastTrainMinute: 0,
    peakHeadwayMinutes: 20, offPeakHeadwayMinutes: 20,
  },
  localPlaces,
  geojsonPath: "/cities/patna/metroRoutes.geojson",
  mapCenter: [25.592, 85.162],
  mapZoom: 13,
  status: "operational",
};
