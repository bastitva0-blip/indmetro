import { CityApp } from "@/components/CityApp";
import type { CityTipsConfig } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/gurgaon/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/gurgaon/timetable";
import { planRoute } from "@/cities/gurgaon/routePlanner";
import { getCrowdEstimate } from "@/cities/gurgaon/crowdSimulation";
import { FARE_SLABS } from "@/cities/gurgaon/fareData";
import { localPlaces } from "@/cities/gurgaon/localPlaces";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-gurgaon";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];
const crowdEmoji = (level: string) =>
  level === "low" ? "🟢" : level === "moderate" ? "🟡" : level === "high" ? "🟠" : "🔴";

const tipsConfig: CityTipsConfig = {
  fareSlabs: FARE_SLABS as any,
  smartCardName: "Rapid Metro Card",
  smartCardDiscount: 0.10,
  smartCardDeposit: 100,
  childFreeHeightCm: 90,
  firstTrain: "06:00",
  lastTrain: "22:00",
  peakHeadwayMinutes: 4,
  offPeakHeadwayMinutes: 6,
};

export default function GurgaonIndex() {
  const primaryColor =
    LINE_COLORS["red" as keyof typeof LINE_COLORS] ??
    Object.values(LINE_COLORS)[0];
  return (
    <CityApp
      cityName="Gurgaon"
      citySlug="gurgaon"
      primaryColor={primaryColor}
      mapCenter={[28.448, 77.025]}
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
