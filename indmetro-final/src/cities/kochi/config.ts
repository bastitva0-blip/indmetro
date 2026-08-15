import type { CityConfig } from "@/types/city";
import { FARE_ZONES } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const kochiConfig: CityConfig = {
  slug: "kochi",
  name: "Kochi",
  state: "Kerala",
  smartCardName: "Kochi Metro Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_ZONES,   // distance-based (F1–F6) — not station-count based
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 6, firstTrainMinute: 0,
    lastTrainHour: 22, lastTrainMinute: 30,
    peakHeadwayMinutes: 8,
    offPeakHeadwayMinutes: 15,
  },
  localPlaces,
  geojsonPath: "/cities/kochi/metroRoutes.geojson",
  mapCenter: [10.005, 76.308],
  mapZoom: 13,
  status: "operational",
};
