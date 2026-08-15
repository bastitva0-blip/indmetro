import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";
export const noidaConfig: CityConfig = {
  slug:"noida", name:"Noida", state:"Uttar Pradesh",
  smartCardName:"GoSmart Card (CITY1)", smartCardDiscount:0.10,
  fareSlabs:FARE_SLABS, segmentTimings:Object.values(LINE_TIMINGS),
  timetableConfig:{firstTrainHour:6,firstTrainMinute:0,lastTrainHour:22,lastTrainMinute:45,peakHeadwayMinutes:7.5,offPeakHeadwayMinutes:10},
  localPlaces,
  geojsonPath:"/cities/noida/metroRoutes.geojson",
  mapCenter:[28.510,77.400],mapZoom:12,status:"operational",
};
