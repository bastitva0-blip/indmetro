import { useState, useCallback, useEffect, useRef } from "react";
import { Train, ChevronRight, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JourneyMode from "@/components/JourneyMode";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-chennai";
import {
  stations, getStationOptions, LINE_STATIONS, LINE_COLORS, LINE_NAMES, OPERATIONAL_STATIONS,
} from "@/cities/chennai/metroData";
import { planRoute, PlannedRoute } from "@/cities/chennai/routePlanner";
import { getCrowdEstimate } from "@/cities/chennai/crowdSimulation";
import { getNextTrainsAtStation } from "@/cities/chennai/timetable";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";
import { cn } from "@/lib/utils";

type ChennaiLine = "blue" | "green";

function ChennaiMap({ highlightIds, onStationClick }: { highlightIds: string[]; onStationClick: (id: string) => void }) {
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, import("leaflet").CircleMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      const map = L.map(containerRef.current!, { center: [13.052, 80.230], zoom: 12, zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Blue operational
      const blueOp = LINE_STATIONS.blue.filter(id => OPERATIONAL_STATIONS.has(id));
      L.polyline(blueOp.map(id => stations[id].coordinates as [number,number]),
        { color: LINE_COLORS.blue, weight: 5, opacity: 0.9 }).addTo(map);

      // Blue WIP
      const blueWip = LINE_STATIONS.blue.filter(id => !OPERATIONAL_STATIONS.has(id));
      if (blueWip.length > 1) {
        const blueWipWithLast = [blueOp[blueOp.length - 1], ...blueWip];
        L.polyline(blueWipWithLast.map(id => stations[id].coordinates as [number,number]),
          { color: LINE_COLORS.blue, weight: 3, opacity: 0.4, dashArray: "8 6" }).addTo(map);
      }

      // Green line
      L.polyline(LINE_STATIONS.green.map(id => stations[id].coordinates as [number,number]),
        { color: LINE_COLORS.green, weight: 5, opacity: 0.9 }).addTo(map);

      Object.values(stations).forEach(s => {
        const isOp = OPERATIONAL_STATIONS.has(s.id);
        const primary = s.lines[0] as ChennaiLine;
        const marker = L.circleMarker(s.coordinates as [number,number], {
          radius: s.isInterchange ? 9 : s.isWIP ? 4 : 7,
          color: "#fff", weight: s.isInterchange ? 3 : 2,
          fillColor: s.isWIP ? "#9CA3AF" : LINE_COLORS[primary], fillOpacity: 0.95,
        }).addTo(map);
        marker.bindTooltip(s.name, { direction: "top", offset: [0,-8] });
        marker.on("click", () => onStationClick(s.id));
        markersRef.current[s.id] = marker;
      });
      mapRef.current = map;
    });
    return () => { mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    import("leaflet").then(() => {
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        const s = stations[id];
        const primary = s.lines[0] as ChennaiLine;
        if (highlightIds.includes(id))
          marker.setStyle({ fillColor: "#FBBF24", radius: 10, weight: 3 });
        else
          marker.setStyle({ fillColor: s.isWIP ? "#9CA3AF" : LINE_COLORS[primary], radius: s.isInterchange ? 9 : s.isWIP ? 4 : 7, weight: s.isInterchange ? 3 : 2 });
      });
    });
  }, [highlightIds]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

const LINE_BADGE: Record<string, string> = {
  blue:  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
};

function RouteCard({ route, onStart }: { route: PlannedRoute; onStart: () => void }) {
  const { hasGoSmartCard } = useGoSmartCard();
  const fare = hasGoSmartCard && route.discountedFare ? route.discountedFare : route.fare;
  const boardSteps = route.steps.filter(s => s.type === "board");
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="truncate max-w-[110px]">{route.origin.name}</span>
          <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="truncate max-w-[110px]">{route.destination.name}</span>
        </div>
        <div className="flex gap-1">
          {boardSteps.map((s, i) => (
            <span key={i} className={cn("text-xs px-2 py-0.5 rounded-full font-medium", LINE_BADGE[s.line!])}>
              {LINE_NAMES[s.line as ChennaiLine]}
            </span>
          ))}
        </div>
      </div>
      {route.interchangeCount > 0 && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <RefreshCw className="w-3 h-3" />
          Interchange at {route.steps.find(s => s.type === "interchange")?.stationName}
        </p>
      )}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[{label:"Stations",value:String(route.totalStations)},{label:"Time",value:`~${route.totalTime} min`},{label:"Fare",value:`₹${fare}`}].map(({label,value}) => (
          <div key={label} className="bg-muted/50 rounded-xl py-2">
            <p className="text-base font-bold">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      {route.departureTime && (
        <p className="text-xs text-muted-foreground text-center">Departs ~{route.departureTime} · Arrives ~{route.arrivalTime}</p>
      )}
      {route.isDirect && (
        <button onClick={onStart} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
          <Train className="w-4 h-4" /> Start Journey
        </button>
      )}
    </div>
  );
}

function StationSelect({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  const ops = getStationOptions(false);
  // Deduplicate interchange stations (Central appears as both blue+green)
  const seen = new Set<string>();
  const deduped = ops.filter(s => {
    const key = s.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-muted border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">Select station…</option>
        <optgroup label="🔵 Blue Line">
          {LINE_STATIONS.blue.filter(id => OPERATIONAL_STATIONS.has(id)).map(id => (
            <option key={id} value={id}>{stations[id].name}{stations[id].isInterchange ? " ↔" : ""}</option>
          ))}
        </optgroup>
        <optgroup label="🟢 Green Line">
          {LINE_STATIONS.green.map(id => (
            <option key={id} value={id}>{stations[id].name}{stations[id].isInterchange ? " ↔" : ""}</option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}

export default function ChennaiIndex() {
  const navigate = useNavigate();
  const { journey, startJourney, endJourney, requestNotificationPermission } = useJourneyTracker();
  const [origin, setOrigin] = useState(""), [dest, setDest] = useState("");
  const [route, setRoute] = useState<PlannedRoute | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<"route" | "stations">("route");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  useEffect(() => {
    if (origin && dest && origin !== dest) {
      const r = planRoute(origin, dest);
      if (r) {
        setRoute(r); setRouteError(null);
        // Highlight arc
        const ids: string[] = [];
        r.steps.forEach(step => { if (step.stationId) ids.push(step.stationId); });
        // Fill in intermediate stations
        r.steps.forEach(step => {
          if (step.type === "travel" && step.line) {
            const arr = LINE_STATIONS[step.line as ChennaiLine];
            const prev = r.steps[r.steps.indexOf(step) - 1];
            const next = r.steps[r.steps.indexOf(step) + 1];
            if (prev?.stationId && next?.stationId) {
              const fi = arr.indexOf(prev.stationId), ti = arr.indexOf(next.stationId);
              if (fi !== -1 && ti !== -1) {
                const slice = fi < ti ? arr.slice(fi, ti+1) : arr.slice(ti, fi+1).reverse();
                slice.forEach(id => { if (!ids.includes(id)) ids.push(id); });
              }
            }
          }
        });
        setHighlightIds(ids);
      } else { setRoute(null); setRouteError("No route found between these stations."); }
    } else { setRoute(null); setRouteError(null); setHighlightIds([]); }
  }, [origin, dest]);

  const handleMapClick = useCallback((id: string) => {
    if (!OPERATIONAL_STATIONS.has(id)) return;
    setSelectedStation(id);
    if (!origin) setOrigin(id); else if (!dest) setDest(id);
  }, [origin, dest]);

  const handleStart = useCallback(async () => {
    if (!route?.isDirect) return;
    const line = (route.steps.find(s => s.line)?.line ?? "blue") as ChennaiLine;
    await requestNotificationPermission();
    await startJourney(route.origin.id, route.destination.id, line);
  }, [route, startJourney, requestNotificationPermission]);

  const crowd = selectedStation ? getCrowdEstimate(selectedStation) : null;
  const stLine = selectedStation
    ? (LINE_STATIONS.blue.includes(selectedStation) ? "blue" : "green") as ChennaiLine
    : null;
  const nextFwd = selectedStation && stLine ? getNextTrainsAtStation(selectedStation, stLine, "forward", 2) : [];
  const nextBwd = selectedStation && stLine ? getNextTrainsAtStation(selectedStation, stLine, "backward", 2) : [];
  const termFwd = stLine === "blue" ? "Chennai Airport" : "St. Thomas Mount";
  const termBwd = stLine === "blue" ? "Wimco Nagar Depot" : "Chennai Central";

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && <JourneyMode journey={journey} onEnd={endJourney} />}
      <OfflineIndicator />
      <ChennaiMap highlightIds={highlightIds} onStationClick={handleMapClick} />

      <div className="absolute top-0 left-0 right-0 z-[1200] px-3 pt-3 flex items-center gap-2">
        <button onClick={() => navigate("/")} className="h-9 w-9 rounded-xl bg-card border border-border shadow flex items-center justify-center text-muted-foreground">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 h-9 shadow">
          <Train className="w-4 h-4 text-blue-700 shrink-0" />
          <span className="text-sm font-semibold">Chennai Metro</span>
          <div className="ml-auto flex gap-1">
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">Blue 26</span>
            <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full">Green 13</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[1100] bg-card border-t border-border rounded-t-2xl shadow-2xl">
        <div className="flex border-b border-border">
          {(["route","stations"] as const).map(tab => (
            <button key={tab} onClick={() => setActivePanel(tab)} className={cn("flex-1 py-3 text-xs font-semibold capitalize transition-colors", activePanel===tab?"text-primary border-b-2 border-primary":"text-muted-foreground")}>
              {tab === "route" ? "Plan Route" : "Stations"}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto max-h-[55vh] px-4 pt-4 pb-8 space-y-4">
          {activePanel === "route" && (
            <>
              <StationSelect label="From" value={origin} onChange={setOrigin} />
              <StationSelect label="To" value={dest} onChange={setDest} />
              {routeError && <p className="text-xs text-center text-destructive">{routeError}</p>}
              {origin && dest && origin === dest && <p className="text-xs text-center text-muted-foreground">Same station selected.</p>}
              {route && <RouteCard route={route} onStart={handleStart} />}
            </>
          )}
          {activePanel === "stations" && (
            <div className="flex flex-col gap-2">
              {Object.values(stations).filter(s => !s.isWIP).sort((a,b) => a.name.localeCompare(b.name)).map(s => {
                const primary = s.lines[0] as ChennaiLine;
                return (
                  <button key={s.id} onClick={() => setSelectedStation(s.id)} className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors", selectedStation===s.id?"bg-primary/10 border border-primary/30":"bg-muted/40 hover:bg-muted")}>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {primary === "blue" ? "🔵" : "🟢"} {LINE_NAMES[primary]}
                        {s.isInterchange ? " · Interchange" : ""}
                        {s.isUnderground ? " · Underground" : ""}
                      </p>
                    </div>
                    {crowd && selectedStation===s.id && (
                      <span className={cn("text-xs px-2 py-0.5 rounded-full",
                        crowd.level==="low"&&"bg-green-100 text-green-700",
                        crowd.level==="moderate"&&"bg-yellow-100 text-yellow-700",
                        crowd.level==="high"&&"bg-orange-100 text-orange-700",
                        crowd.level==="very-high"&&"bg-red-100 text-red-700",
                      )}>{crowd.level}</span>
                    )}
                  </button>
                );
              })}
              {selectedStation && (nextFwd.length > 0 || nextBwd.length > 0) && (
                <div className="mt-2 bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Next trains at {stations[selectedStation].name}
                  </p>
                  {nextFwd.map((t,i) => (
                    <div key={`f${i}`} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground">→ {termFwd}</span>
                      <span className="font-medium tabular-nums">{t.minutesAway<1?"Now":`${Math.round(t.minutesAway)} min`}</span>
                    </div>
                  ))}
                  {nextBwd.map((t,i) => (
                    <div key={`b${i}`} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground">← {termBwd}</span>
                      <span className="font-medium tabular-nums">{t.minutesAway<1?"Now":`${Math.round(t.minutesAway)} min`}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
