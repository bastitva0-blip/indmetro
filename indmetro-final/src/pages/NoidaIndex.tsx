import { CityApp } from "@/components/CityApp";
import type { CityTipsConfig } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/noida/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/noida/timetable";
import { planRoute } from "@/cities/noida/routePlanner";
import { getCrowdEstimate } from "@/cities/noida/crowdSimulation";
import { FARE_SLABS } from "@/cities/noida/fareData";
import { localPlaces } from "@/cities/noida/localPlaces";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-noida";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];
const crowdEmoji = (level: string) =>
  level === "low" ? "🟢" : level === "moderate" ? "🟡" : level === "high" ? "🟠" : "🔴";

const tipsConfig: CityTipsConfig = {
  fareSlabs: FARE_SLABS as any,
  smartCardName: "GoSmart Card (NMRC)",
  smartCardDiscount: 0.10,
  smartCardDeposit: 100,
  childFreeHeightCm: 90,
  firstTrain: "06:00",
  lastTrain: "22:00",
  peakHeadwayMinutes: 7,
  offPeakHeadwayMinutes: 10,
};

export default function NoidaIndex() {
  const primaryColor =
    LINE_COLORS["aqua" as keyof typeof LINE_COLORS] ??
    Object.values(LINE_COLORS)[0];
  return (
    <CityApp
      cityName="Noida"
      citySlug="noida"
      primaryColor={primaryColor}
      mapCenter={[28.535, 77.391]}
      mapZoom={12}
      stations={stations as unknown as Record<string, GenericStation>}
      lineStations={LINE_STATIONS}
      lineColors={LINE_COLORS}
      lineNames={LINE_NAMES}
      lineTerminals={LINE_TERMINALS}
      operationalStations={OPERATIONAL_STATIONS}
      schedules={schedules}
      tipsConfig={tipsConfig}
      localPlaces={localPlaces as any}
      planRoute={(o, d) => planRoute(o, d) as any}
      getNextTrains={(stationId, line, dir, count) =>
        getNextTrainsAtStation(stationId, line as any, dir, count) as any}
      getCrowd={(id) => {
        const c = getCrowdEstimate(id);
        return c ? { level: c.level, emoji: crowdEmoji(c.level) } : null;
      }}
      useJourneyTracker={useJourneyTracker as any}
    />
  );
}
