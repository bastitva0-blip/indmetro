import type { CityConfig } from "@/types/city";
import { FARE_SLABS_BY_STATION } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";

export const bangaloreConfig: CityConfig = {
  slug: "bangalore",
  name: "Bangalore",
  state: "Karnataka",
  smartCardName: "Namma Metro Card",
  smartCardDiscount: 0.10,
  fareSlabs: FARE_SLABS_BY_STATION,
  segmentTimings: Object.values(LINE_TIMINGS),
  timetableConfig: {
    firstTrainHour: 5,
    firstTrainMinute: 0,
    lastTrainHour: 23,
    lastTrainMinute: 55,
    peakHeadwayMinutes: 5,
    offPeakHeadwayMinutes: 10,
  },
  localPlaces,
  geojsonPath: "/cities/bangalore/metroRoutes.geojson",
  mapCenter: [12.975, 77.590],
  mapZoom: 12,
  status: "operational",
};
