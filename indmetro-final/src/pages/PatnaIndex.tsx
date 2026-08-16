import { CityApp } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/patna/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/patna/timetable";
import { planRoute } from "@/cities/patna/routePlanner";
import { getCrowdEstimate } from "@/cities/patna/crowdSimulation";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-patna";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];
const crowdEmoji = (level: string) =>
  level === "low" ? "🟢" : level === "moderate" ? "🟡" : level === "high" ? "🟠" : "🔴";

export default function PatnaIndex() {
  const primaryColor = LINE_COLORS["blue" as keyof typeof LINE_COLORS]
    ?? Object.values(LINE_COLORS)[0];
  return (
    <CityApp
      cityName="Patna"
      citySlug="patna"
      primaryColor={primaryColor}
      mapCenter={[25.594, 85.137]}
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
        getNextTrainsAtStation(stationId, line as any, dir, count) as any}
      getCrowd={(id) => {
        const c = getCrowdEstimate(id);
        return c ? { level: c.level, emoji: crowdEmoji(c.level) } : null;
      }}
      useJourneyTracker={useJourneyTracker as any}
    />
  );
}
