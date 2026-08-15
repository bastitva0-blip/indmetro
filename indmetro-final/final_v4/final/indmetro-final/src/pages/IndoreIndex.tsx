import { useState, useCallback, useEffect, useRef } from "react";
import { Train, ChevronRight, ArrowRight, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JourneyMode from "@/components/JourneyMode";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-indore";
import { stations, getStationOptions, LINE_STATIONS, LINE_COLORS, OPERATIONAL_STATIONS } from "@/cities/indore/metroData";
import { planRoute, PlannedRoute } from "@/cities/indore/routePlanner";
import { getCrowdEstimate } from "@/cities/indore/crowdSimulation";
import { getNextTrainsAtStation } from "@/cities/indore/timetable";
import { FARE_NOTE } from "@/cities/indore/fareData";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";
import { cn } from "@/lib/utils";

function IndoreMap({ highlightIds, onStationClick }: { highlightIds: string[]; onStationClick: (id: string) => void }) {
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, import("leaflet").CircleMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      const map = L.map(containerRef.current!, { center: [22.724, 75.865], zoom: 12, zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Operational segment
      const opIds = ["devi_ahilya_terminal","maharani_lakshmi_bai","rani_avanti_bai_lodhi","rani_durgavati","veerangana_jhalkari_bai"];
      L.polyline(opIds.map(id => stations[id].coordinates as [number,number]), { color: LINE_COLORS.yellow, weight: 5, opacity: 0.9 }).addTo(map);

      // WIP ring (remaining)
      const wipIds = LINE_STATIONS.yellow.slice(4);
      if (wipIds.length > 1) {
        L.polyline(wipIds.map(id => stations[id].coordinates as [number,number]), { color: LINE_COLORS.yellow, weight: 3, opacity: 0.35, dashArray: "8 6" }).addTo(map);
      }

      Object.values(stations).forEach(s => {
        const isOp = OPERATIONAL_STATIONS.has(s.id);
        const marker = L.circleMarker(s.coordinates as [number,number], {
          radius: s.isWIP ? 4 : 7, color: "#fff", weight: 2,
          fillColor: s.isWIP ? "#9CA3AF" : LINE_COLORS.yellow, fillOpacity: 0.95,
        }).addTo(map);
        marker.bindTooltip(s.name, { direction: "top", offset: [0, -8] });
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
        if (highlightIds.includes(id)) marker.setStyle({ fillColor: "#FBBF24", radius: 10, weight: 3 });
        else marker.setStyle({ fillColor: s.isWIP ? "#9CA3AF" : LINE_COLORS.yellow, radius: s.isWIP ? 4 : 7, weight: 2 });
      });
    });
  }, [highlightIds]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

function RouteCard({ route, onStart }: { route: PlannedRoute; onStart: () => void }) {
  const { hasGoSmartCard } = useGoSmartCard();
  const fare = hasGoSmartCard && route.discountedFare ? route.discountedFare : route.fare;
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="truncate max-w-[120px]">{route.origin.name}</span>
          <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="truncate max-w-[120px]">{route.destination.name}</span>
        </div>
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1",
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300")}>
          <RotateCcw className="w-2.5 h-2.5" />
          {route.direction === "clockwise" ? "Clockwise" : "Anticlockwise"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[{label:"Stations",value:String(route.totalStations)},{label:"Time",value:`~${route.totalTime} min`},{label:"Fare*",value:`₹${fare}`}].map(({label,value})=>(
          <div key={label} className="bg-muted/50 rounded-xl py-2">
            <p className="text-base font-bold">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      {route.departureTime && <p className="text-xs text-muted-foreground text-center">Departs ~{route.departureTime} · Arrives ~{route.arrivalTime}</p>}
      <p className="text-[10px] text-muted-foreground">*{FARE_NOTE}</p>
      <button onClick={onStart} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
        <Train className="w-4 h-4" /> Start Journey
      </button>
    </div>
  );
}

function StationSelect({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  const ops = getStationOptions(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-muted border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">Select station…</option>
        {ops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </div>
  );
}

export default function IndoreIndex() {
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
        // Highlight the arc
        const arr = LINE_STATIONS.yellow;
        const fi = arr.indexOf(origin), ti = arr.indexOf(dest);
        const n = arr.length;
        const cwStops = ti >= fi ? ti - fi : n - fi + ti;
        const acwStops = n - cwStops;
        const useClockwise = cwStops <= acwStops;
        const ids: string[] = [];
        if (useClockwise) { for (let i = 0; i <= cwStops; i++) ids.push(arr[(fi + i) % n]); }
        else { for (let i = 0; i <= acwStops; i++) ids.push(arr[(fi - i + n) % n]); }
        setHighlightIds(ids);
      } else { setRoute(null); setRouteError("No route found."); }
    } else { setRoute(null); setRouteError(null); setHighlightIds([]); }
  }, [origin, dest]);

  const handleMapClick = useCallback((id: string) => {
    if (!OPERATIONAL_STATIONS.has(id)) return;
    setSelectedStation(id);
    if (!origin) setOrigin(id); else if (!dest) setDest(id);
  }, [origin, dest]);

  const handleStart = useCallback(async () => {
    if (!route) return;
    await requestNotificationPermission();
    await startJourney(route.origin.id, route.destination.id, "yellow", route.direction);
  }, [route, startJourney, requestNotificationPermission]);

  const crowd = selectedStation ? getCrowdEstimate(selectedStation) : null;
  const nextCw = selectedStation && OPERATIONAL_STATIONS.has(selectedStation)
    ? getNextTrainsAtStation(selectedStation, "clockwise", 2) : [];
  const nextAcw = selectedStation && OPERATIONAL_STATIONS.has(selectedStation)
    ? getNextTrainsAtStation(selectedStation, "anticlockwise", 2) : [];

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && <JourneyMode journey={journey} onEnd={endJourney} />}
      <OfflineIndicator />
      <IndoreMap highlightIds={highlightIds} onStationClick={handleMapClick} />

      <div className="absolute top-0 left-0 right-0 z-[1200] px-3 pt-3 flex items-center gap-2">
        <button onClick={() => navigate("/")} className="h-9 w-9 rounded-xl bg-card border border-border shadow flex items-center justify-center text-muted-foreground"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 h-9 shadow">
          <Train className="w-4 h-4 text-yellow-500 shrink-0" />
          <span className="text-sm font-semibold">Indore Metro</span>
          <div className="ml-auto flex gap-1">
            <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded-full">5 Live</span>
            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">Ring UC</span>
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
              {!origin && <p className="text-xs text-muted-foreground text-center pt-2">Only the 5 operational stations are selectable for now</p>}
            </>
          )}
          {activePanel === "stations" && (
            <div className="flex flex-col gap-2">
              {Object.values(stations).sort((a,b) => a.name.localeCompare(b.name)).map(s => {
                const isOp = OPERATIONAL_STATIONS.has(s.id);
                return (
                  <button key={s.id} onClick={() => setSelectedStation(s.id)} className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl text-left", selectedStation===s.id?"bg-primary/10 border border-primary/30":"bg-muted/40 hover:bg-muted")}>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.isWIP ? "🚧 Under construction" : "🟡 Yellow Line"}</p>
                    </div>
                    {isOp && crowd && selectedStation === s.id && (
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
              {selectedStation && OPERATIONAL_STATIONS.has(selectedStation) && (nextCw.length > 0 || nextAcw.length > 0) && (
                <div className="mt-2 bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Next trains at {stations[selectedStation].name}</p>
                  {nextCw.map((t,i) => (
                    <div key={`cw${i}`} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground">↻ Clockwise</span>
                      <span className="font-medium tabular-nums">{t.minutesAway < 1 ? "Now" : `${Math.round(t.minutesAway)} min`}</span>
                    </div>
                  ))}
                  {nextAcw.map((t,i) => (
                    <div key={`acw${i}`} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground">↺ Anticlockwise</span>
                      <span className="font-medium tabular-nums">{t.minutesAway < 1 ? "Now" : `${Math.round(t.minutesAway)} min`}</span>
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
