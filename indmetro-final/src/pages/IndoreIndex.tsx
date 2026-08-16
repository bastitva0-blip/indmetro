import { CityApp } from "@/components/CityApp";
import type { CityTipsConfig } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/indore/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/indore/timetable";
import { planRoute } from "@/cities/indore/routePlanner";
import { getCrowdEstimate } from "@/cities/indore/crowdSimulation";
import { FARE_SLABS } from "@/cities/indore/fareData";
import { localPlaces } from "@/cities/indore/localPlaces";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-indore";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];
const crowdEmoji = (level: string) =>
  level === "low" ? "🟢" : level === "moderate" ? "🟡" : level === "high" ? "🟠" : "🔴";

const tipsConfig: CityTipsConfig = {
  fareSlabs: FARE_SLABS as any,
  smartCardName: "MPMRC Smart Card",
  smartCardDiscount: 0.10,
  smartCardDeposit: 100,
  childFreeHeightCm: 90,
  firstTrain: "06:00",
  lastTrain: "22:00",
  peakHeadwayMinutes: 10,
  offPeakHeadwayMinutes: 15,
};

export default function IndoreIndex() {
  const primaryColor =
    LINE_COLORS["red" as keyof typeof LINE_COLORS] ??
    Object.values(LINE_COLORS)[0];
  return (
    <CityApp
      cityName="Indore"
      citySlug="indore"
      primaryColor={primaryColor}
      mapCenter={[22.719, 75.857]}
      mapZoom={13}
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
        getNextTrainsAtStation(stationId, dir, count) as any}
      getCrowd={(id) => {
        const c = getCrowdEstimate(id);
        return c ? { level: c.level, emoji: crowdEmoji(c.level) } : null;
      }}
      useJourneyTracker={useJourneyTracker as any}
    />
  );
}
