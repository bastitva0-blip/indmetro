import { CityApp } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/kanpur/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/kanpur/timetable";
import { planRoute } from "@/cities/kanpur/routePlanner";
import { getCrowdEstimate } from "@/cities/kanpur/crowdSimulation";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-kanpur";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];

export default function KanpurIndex() {
  return (
    <CityApp
      cityName="Kanpur"
      citySlug="kanpur"
      primaryColor={LINE_COLORS.orange}
      mapCenter={[26.468, 80.340]}
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
      smartCardName="GoSmart Card"
      smartCardDiscount={0.1}
      useJourneyTracker={useJourneyTracker as any}
    />
  );
}
