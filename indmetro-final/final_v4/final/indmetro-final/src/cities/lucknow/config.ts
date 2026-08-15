import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "@/data/fareData";
import { LINE_TIMINGS } from "@/data/segmentTimings";
import { localPlaces as lkoLocalPlaces } from "@/data/localPlaces";

export const lucknowConfig: CityConfig = {
  slug: "lucknow",
  name: "Lucknow",
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
    peakHeadwayMinutes: 5.5,
    offPeakHeadwayMinutes: 8,
  },
  localPlaces: lkoLocalPlaces,
  geojsonPath: "/cities/lucknow/metroRoutes.geojson",
  mapCenter: [26.846, 80.946],
  mapZoom: 13,
  status: "operational",
};
