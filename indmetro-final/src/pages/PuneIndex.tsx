import { CityApp } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/pune/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/pune/timetable";
import { planRoute } from "@/cities/pune/routePlanner";
import { getCrowdEstimate } from "@/cities/pune/crowdSimulation";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-pune";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];

export default function PuneIndex() {
  return (
    <CityApp
      cityName="Pune"
      citySlug="pune"
      primaryColor={LINE_COLORS.aqua ?? "#6b7280"}
      mapCenter={[18.520, 73.856]}
      mapZoom={12}
      stations={stations as unknown as Record<string, GenericStation>}
      lineStations={LINE_STATIONS}
      lineColors={LINE_COLORS}
      lineNames={LINE_NAMES}
      lineTerminals={LINE_TERMINALS}
      operationalStations={OPERATIONAL_STATIONS}
      schedules={schedules}
      planRoute={(o, d) => planRoute(o, d) as any}
      getNextTrains={(stationId, line, dir, count) =>
        getNextTrainsAtStation(stationId, line as any, dir, count) as any
      }
      getCrowd={(id) => {
        const c = getCrowdEstimate(id);
        return c ? { level: c.level, emoji: c.emoji ?? "🚇" } : null;
      }}
      useJourneyTracker={useJourneyTracker as any}
    />
  );
}
