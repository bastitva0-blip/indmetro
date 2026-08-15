import { useState, useCallback, useEffect, useRef } from "react";
import { Train, ChevronRight, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JourneyMode from "@/components/JourneyMode";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-kochi";
import { stations, getStationOptions, LINE_STATIONS, LINE_COLORS, LINE_NAMES, OPERATIONAL_STATIONS } from "@/cities/kochi/metroData";
import { planRoute, PlannedRoute } from "@/cities/kochi/routePlanner";
import { getCrowdEstimate } from "@/cities/kochi/crowdSimulation";
import { getNextTrainsAtStation } from "@/cities/kochi/timetable";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";
import { cn } from "@/lib/utils";

function KochiMap({ highlightIds, onStationClick }: { highlightIds: string[]; onStationClick: (id: string) => void }) {
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, import("leaflet").CircleMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      const map = L.map(containerRef.current!, { center: [10.005, 76.308], zoom: 13, zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Blue Line — all 25 stations operational
      const blueCoords = LINE_STATIONS.blue.map(id => stations[id].coordinates as [number,number]);
      L.polyline(blueCoords, { color: LINE_COLORS.blue, weight: 5, opacity: 0.9 }).addTo(map);
      // Pink Line — Phase II WIP (approximate route)
      const pinkCoords: [number,number][] = [
        [10.0005, 76.2990],[10.0050, 76.3100],[10.0100, 76.3250],
        [10.0120, 76.3400],[10.0080, 76.3500],[10.0040, 76.3600],[10.0000, 76.3650],
      ];
      L.polyline(pinkCoords, { color: LINE_COLORS.pink ?? "#EC4899", weight: 4, opacity: 0.45, dashArray: "8 6" }).addTo(map);

      Object.values(stations).forEach((s) => {
        const primary = s.lines[0] as "blue";
        const marker = L.circleMarker(s.coordinates as [number,number], {
          radius: s.hasRailTransfer ? 9 : 7,
          color: "#fff", weight: s.hasRailTransfer ? 3 : 2,
          fillColor: LINE_COLORS[primary], fillOpacity: 0.95,
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
        const primary = s.lines[0] as "blue";
        if (highlightIds.includes(id)) marker.setStyle({ fillColor: "#FBBF24", radius: 10, weight: 3 });
        else marker.setStyle({ fillColor: LINE_COLORS[primary], radius: s.hasRailTransfer ? 9 : 7, weight: s.hasRailTransfer ? 3 : 2 });
      });
    });
  }, [highlightIds]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

const LINE_BADGE: Record<string, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
};

function RouteCard({ route, onStart }: { route: PlannedRoute; onStart: () => void }) {
  const { hasGoSmartCard } = useGoSmartCard();
  const fare = hasGoSmartCard && route.discountedFare ? route.discountedFare : route.fare;
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{route.origin.name}</span><ArrowRight className="w-3 h-3 text-muted-foreground" /><span>{route.destination.name}</span>
        </div>
        <div className="flex gap-1">
          {route.steps.filter(s => s.type === "board").map((s, i) => (
            <span key={i} className={cn("text-xs px-2 py-0.5 rounded-full font-medium", LINE_BADGE[s.line!])}>{LINE_NAMES[s.line as "blue"]}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[{ label: "Stations", value: String(route.totalStations) }, { label: "Time", value: `~${route.totalTime} min` }, { label: "Fare", value: `₹${fare}` }].map(({ label, value }) => (
          <div key={label} className="bg-muted/50 rounded-xl py-2"><p className="text-base font-bold">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div>
        ))}
      </div>
      {route.departureTime && <p className="text-xs text-muted-foreground text-center">Departs ~{route.departureTime} · Arrives ~{route.arrivalTime}</p>}
      {route.isDirect && (
        <button onClick={onStart} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
          <Train className="w-4 h-4" /> Start Journey
        </button>
      )}
    </div>
  );
}

function StationSelect({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  const ops = getStationOptions();
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

export default function KochiIndex() {
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
        const bArr = LINE_STATIONS.blue;
        const oi = bArr.indexOf(origin), di = bArr.indexOf(dest);
        if (oi !== -1 && di !== -1) setHighlightIds(oi < di ? bArr.slice(oi, di+1) : bArr.slice(di, oi+1).reverse());
        else setHighlightIds([origin, dest]);
      } else { setRoute(null); setRouteError("No route between these stations."); }
    } else { setRoute(null); setRouteError(null); setHighlightIds([]); }
  }, [origin, dest]);

  const handleMapClick = useCallback((id: string) => {
    // All Kochi Blue Line stations are operational
    if (!id) return;
    setSelectedStation(id);
    if (!origin) setOrigin(id); else if (!dest) setDest(id);
  }, [origin, dest]);

  const handleStart = useCallback(async () => {
    if (!route?.isDirect) return;
    const line = "blue" as const;
    await requestNotificationPermission();
    await startJourney(route.origin.id, route.destination.id, line);
  }, [route, startJourney, requestNotificationPermission]);

  const crowd = selectedStation ? getCrowdEstimate(selectedStation) : null;
  const nextTrains = selectedStation
    ? [...getNextTrainsAtStation(selectedStation, "forward", 2), ...getNextTrainsAtStation(selectedStation, "backward", 2)] : [];

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && <JourneyMode journey={journey} onEnd={endJourney} />}
      <OfflineIndicator />
      <KochiMap highlightIds={highlightIds} onStationClick={handleMapClick} />

      <div className="absolute top-0 left-0 right-0 z-[1200] px-3 pt-3 flex items-center gap-2">
        <button onClick={() => navigate("/")} className="h-9 w-9 rounded-xl bg-card border border-border shadow flex items-center justify-center text-muted-foreground"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 h-9 shadow">
          <Train className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-sm font-semibold">Kochi Metro</span>
          <div className="ml-auto flex gap-1">
            <span className="text-[10px] bg-blue-100 dark:bg-blue-100/30 text-blue-500 dark:text-blue-500 px-1.5 py-0.5 rounded-full">Blue Live</span>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">Pink UC</span>
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
              {!origin && <p className="text-xs text-muted-foreground text-center pt-2">🗺️ Tap a station on the map or select above</p>}
            </>
          )}
          {activePanel === "stations" && (
            <div className="flex flex-col gap-2">
              {Object.values(stations).sort((a,b) => a.name.localeCompare(b.name)).map(s => {
                const primary = s.lines[0] as "blue";
                const isOp = OPERATIONAL_STATIONS.has(s.id);
                return (
                  <button key={s.id} onClick={() => setSelectedStation(s.id)} className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors", selectedStation===s.id?"bg-primary/10 border border-primary/30":"bg-muted/40 hover:bg-muted")}>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.isWIP ? "🚧 Under construction" : `${LINE_NAMES[primary]}${"isInterchange" in s && s.isInterchange ? " · Interchange" : ""}`}</p>
                    </div>
                    {isOp && crowd && selectedStation === s.id && (
                      <span className={cn("text-xs px-2 py-0.5 rounded-full",
                        crowd.level==="low"&&"bg-green-100 dark:bg-green-900/30 text-green-700",
                        crowd.level==="moderate"&&"bg-blue-100 dark:bg-blue-100/30 text-blue-500",
                        crowd.level==="high"&&"bg-orange-100 dark:bg-orange-900/30 text-orange-700",
                        crowd.level==="very-high"&&"bg-red-100 dark:bg-red-900/30 text-red-700",
                      )}>{crowd.level}</span>
                    )}
                  </button>
                );
              })}
              {selectedStation && OPERATIONAL_STATIONS.has(selectedStation) && nextTrains.length > 0 && (
                <div className="mt-2 bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Next trains at {stations[selectedStation].name}</p>
                  {nextTrains.map((t, i) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{t.schedule.direction==="forward"?"→ Thrippunithura Terminal":"← Aluva"}</span>
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
