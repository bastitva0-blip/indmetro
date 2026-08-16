import { CityApp } from "@/components/CityApp";
import type { CityTipsConfig } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/jaipur/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/jaipur/timetable";
import { planRoute } from "@/cities/jaipur/routePlanner";
import { getCrowdEstimate } from "@/cities/jaipur/crowdSimulation";
import { FARE_SLABS } from "@/cities/jaipur/fareData";
import { localPlaces } from "@/cities/jaipur/localPlaces";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-jaipur";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];
const crowdEmoji = (level: string) =>
  level === "low" ? "🟢" : level === "moderate" ? "🟡" : level === "high" ? "🟠" : "🔴";

const tipsConfig: CityTipsConfig = {
  fareSlabs: FARE_SLABS as any,
  smartCardName: "JMRC Smart Card",
  smartCardDiscount: 0.10,
  smartCardDeposit: 100,
  childFreeHeightCm: 90,
  firstTrain: "06:00",
  lastTrain: "22:00",
  peakHeadwayMinutes: 10,
  offPeakHeadwayMinutes: 15,
};

export default function JaipurIndex() {
  const primaryColor =
    LINE_COLORS["pink" as keyof typeof LINE_COLORS] ??
    Object.values(LINE_COLORS)[0];
  return (
    <CityApp
      cityName="Jaipur"
      citySlug="jaipur"
      primaryColor={primaryColor}
      mapCenter={[26.912, 75.787]}
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
