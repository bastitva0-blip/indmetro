import type { CityConfig } from "@/types/city";
import { localPlaces } from "./localPlaces";

export const mumbaiConfig: CityConfig = {
  slug: "mumbai",
  name: "Mumbai",
  state: "Maharashtra",
  smartCardName: "Mumbai Metro NCMC Card",
  smartCardDiscount: 0.10,
  fareSlabs: [], // Mumbai uses multi-system fares — handled in fareData.ts
  segmentTimings: [],
  timetableConfig: {
    firstTrainHour: 5, firstTrainMinute: 30,
    lastTrainHour: 23, lastTrainMinute: 30,
    peakHeadwayMinutes: 3,
    offPeakHeadwayMinutes: 6,
  },
  localPlaces,
  geojsonPath: "/cities/mumbai/metroRoutes.geojson",
  mapCenter: [19.076, 72.877],
  mapZoom: 12,
  status: "operational",
};
