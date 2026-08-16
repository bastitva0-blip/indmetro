import { CityApp } from "@/components/CityApp";
import type { CityTipsConfig } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/delhi/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/delhi/timetable";
import { planRoute } from "@/cities/delhi/routePlanner";
import { getCrowdEstimate } from "@/cities/delhi/crowdSimulation";
import { FARE_SLABS } from "@/cities/delhi/fareData";
import { localPlaces } from "@/cities/delhi/localPlaces";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-delhi";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];
const crowdEmoji = (level: string) =>
  level === "low" ? "🟢" : level === "moderate" ? "🟡" : level === "high" ? "🟠" : "🔴";

const tipsConfig: CityTipsConfig = {
  fareSlabs: FARE_SLABS as any,
  smartCardName: "DMC Smart Card",
  smartCardDiscount: 0.10,
  smartCardDeposit: 50,
  childFreeHeightCm: 90,
  firstTrain: "05:30",
  lastTrain: "23:30",
  peakHeadwayMinutes: 2,
  offPeakHeadwayMinutes: 5,
};

export default function DelhiIndex() {
  const primaryColor =
    LINE_COLORS["red" as keyof typeof LINE_COLORS] ??
    Object.values(LINE_COLORS)[0];
  return (
    <CityApp
      cityName="Delhi"
      citySlug="delhi"
      primaryColor={primaryColor}
      mapCenter={[28.635, 77.224]}
      mapZoom={11}
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
