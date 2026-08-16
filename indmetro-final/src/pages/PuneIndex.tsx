import { CityApp } from "@/components/CityApp";
import type { CityTipsConfig } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/pune/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/pune/timetable";
import { planRoute } from "@/cities/pune/routePlanner";
import { getCrowdEstimate } from "@/cities/pune/crowdSimulation";
import { FARE_SLABS } from "@/cities/pune/fareData";
import { localPlaces } from "@/cities/pune/localPlaces";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-pune";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];
const crowdEmoji = (level: string) =>
  level === "low" ? "🟢" : level === "moderate" ? "🟡" : level === "high" ? "🟠" : "🔴";

const tipsConfig: CityTipsConfig = {
  fareSlabs: FARE_SLABS as any,
  smartCardName: "Maha Metro Card",
  smartCardDiscount: 0.10,
  smartCardDeposit: 50,
  childFreeHeightCm: 90,
  firstTrain: "06:00",
  lastTrain: "22:00",
  peakHeadwayMinutes: 7,
  offPeakHeadwayMinutes: 12,
};

export default function PuneIndex() {
  const primaryColor =
    LINE_COLORS["purple" as keyof typeof LINE_COLORS] ??
    Object.values(LINE_COLORS)[0];
  return (
    <CityApp
      cityName="Pune"
      citySlug="pune"
      primaryColor={primaryColor}
      mapCenter={[18.52, 73.856]}
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
