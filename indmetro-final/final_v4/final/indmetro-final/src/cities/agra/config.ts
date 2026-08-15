import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const agraConfig: CityConfig = {
  slug: "agra",
  name: "Agra",
  state: "Uttar Pradesh",
  smartCardName: "NCMC Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_SLABS,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: { firstTrainHour: 6, firstTrainMinute: 0, lastTrainHour: 22, lastTrainMinute: 0, peakHeadwayMinutes: 7, offPeakHeadwayMinutes: 12 },
  localPlaces,
  geojsonPath: "/cities/agra/metroRoutes.geojson",
  mapCenter: [27.188, 78.010],
  mapZoom: 13,
  status: "operational",
};
