import { CityApp } from "@/components/CityApp";
import type { CityTipsConfig } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/kolkata/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/kolkata/timetable";
import { planRoute } from "@/cities/kolkata/routePlanner";
import { getCrowdEstimate } from "@/cities/kolkata/crowdSimulation";
import { FARE_SLABS } from "@/cities/kolkata/fareData";
import { localPlaces } from "@/cities/kolkata/localPlaces";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-kolkata";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];
const crowdEmoji = (level: string) =>
  level === "low" ? "🟢" : level === "moderate" ? "🟡" : level === "high" ? "🟠" : "🔴";

const tipsConfig: CityTipsConfig = {
  fareSlabs: FARE_SLABS as any,
  smartCardName: "Smart Card",
  smartCardDiscount: 0.10,
  smartCardDeposit: 50,
  childFreeHeightCm: 90,
  firstTrain: "06:45",
  lastTrain: "21:45",
  peakHeadwayMinutes: 5,
  offPeakHeadwayMinutes: 10,
};

export default function KolkataIndex() {
  const primaryColor =
    LINE_COLORS["blue" as keyof typeof LINE_COLORS] ??
    Object.values(LINE_COLORS)[0];
  return (
    <CityApp
      cityName="Kolkata"
      citySlug="kolkata"
      primaryColor={primaryColor}
      mapCenter={[22.572, 88.363]}
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
