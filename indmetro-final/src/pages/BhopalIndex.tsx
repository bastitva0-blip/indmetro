import { CityApp } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/bhopal/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/bhopal/timetable";
import { planRoute } from "@/cities/bhopal/routePlanner";
import { getCrowdEstimate } from "@/cities/bhopal/crowdSimulation";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-bhopal";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];

export default function BhopalIndex() {
  return (
    <CityApp
      cityName="Bhopal"
      citySlug="bhopal"
      primaryColor={LINE_COLORS.red ?? "#6b7280"}
      mapCenter={[23.259, 77.413]}
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
