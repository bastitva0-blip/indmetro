import { CityApp } from "@/components/CityApp";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  LINE_TERMINALS, OPERATIONAL_STATIONS,
} from "@/cities/navi_mumbai/metroData";
import { getAllSchedules, getNextTrainsAtStation } from "@/cities/navi_mumbai/timetable";
import { planRoute } from "@/cities/navi_mumbai/routePlanner";
import { getCrowdEstimate } from "@/cities/navi_mumbai/crowdSimulation";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-navi_mumbai";
import type { GenericStation } from "@/components/GenericCityMap";
import type { GenericSchedule } from "@/lib/trainSimulation";

const schedules = getAllSchedules() as unknown as GenericSchedule[];
const crowdEmoji = (level: string) =>
  level === "low" ? "🟢" : level === "moderate" ? "🟡" : level === "high" ? "🟠" : "🔴";

export default function NaviMumbaiIndex() {
  const primaryColor = LINE_COLORS["line1" as keyof typeof LINE_COLORS]
    ?? Object.values(LINE_COLORS)[0];
  return (
    <CityApp
      cityName="Navi Mumbai"
      citySlug="navi_mumbai"
      primaryColor={primaryColor}
      mapCenter={[19.033, 73.029]}
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
