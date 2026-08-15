import type { CityConfig } from "@/types/city";
import { FARE_SLABS } from "./fareData";
import { LINE_TIMINGS } from "./segmentTimings";
import { localPlaces } from "./localPlaces";
export const meerutConfig: CityConfig = {
  slug:"meerut", name:"Meerut", state:"Uttar Pradesh",
  smartCardName:"NCRTC Smart Card (Namo Bharat)", smartCardDiscount:0,
  fareSlabs:FARE_SLABS, segmentTimings:Object.values(LINE_TIMINGS),
  timetableConfig:{firstTrainHour:6,firstTrainMinute:0,lastTrainHour:22,lastTrainMinute:0,peakHeadwayMinutes:10,offPeakHeadwayMinutes:15},
  localPlaces,
  geojsonPath:"/cities/meerut/metroRoutes.geojson",
  mapCenter:[28.980,77.706],mapZoom:13,status:"operational",
};
