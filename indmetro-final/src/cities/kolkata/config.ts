import type { CityConfig } from "@/types/city";
import { localPlaces } from "./localPlaces";

export const kolkataConfig: CityConfig = {
  slug: "kolkata",
  name: "Kolkata",
  state: "West Bengal",
  smartCardName: "Smart Card (Kolkata)",
  smartCardDiscount: 0.10,
  fareSlabs: [],
  segmentTimings: [],
  timetableConfig: {
    firstTrainHour: 6, firstTrainMinute: 50,
    lastTrainHour: 22, lastTrainMinute: 47,
    peakHeadwayMinutes: 5, offPeakHeadwayMinutes: 10,
  },
  localPlaces,
  geojsonPath: "/cities/kolkata/metroRoutes.geojson",
  mapCenter: [22.540, 88.360],
  mapZoom: 12,
  status: "operational",
};
