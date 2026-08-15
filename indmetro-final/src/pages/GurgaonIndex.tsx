import { useState, useCallback, useEffect, useRef } from "react";
import { Train, ChevronRight, ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JourneyMode from "@/components/JourneyMode";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-gurgaon";
import { stations, getStationOptions, LINE_STATIONS, LINE_COLORS, OPERATIONAL_STATIONS } from "@/cities/gurgaon/metroData";
import { planRoute, PlannedRoute } from "@/cities/gurgaon/routePlanner";
import { getCrowdEstimate } from "@/cities/gurgaon/crowdSimulation";
import { getNextTrainsAtStation } from "@/cities/gurgaon/timetable";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";
import { cn } from "@/lib/utils";

function GurgaonMap({ highlightIds, onStationClick }: { highlightIds: string[]; onStationClick: (id: string) => void }) {
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, import("leaflet").CircleMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      const map = L.map(containerRef.current!, { center: [28.460, 77.098], zoom: 14, zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Full line
      L.polyline(LINE_STATIONS.rapid.map(id => stations[id].coordinates as [number, number]), {
        color: LINE_COLORS.rapid, weight: 5, opacity: 0.9,
      }).addTo(map);

      Object.values(stations).forEach(s => {
        const marker = L.circleMarker(s.coordinates as [number, number], {
          radius: s.isInterchange ? 9 : 7,
          color: "#fff", weight: s.isInterchange ? 3 : 2,
          fillColor: LINE_COLORS.rapid, fillOpacity: 0.95,
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
        else marker.setStyle({ fillColor: LINE_COLORS.rapid, radius: s.isInterchange ? 9 : 7, weight: s.isInterchange ? 3 : 2 });
      });
    });
  }, [highlightIds]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

function RouteCard({ route, onStart }: { route: PlannedRoute; onStart: () => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="truncate max-w-[120px]">{route.origin.name}</span>
          <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="truncate max-w-[120px]">{route.destination.name}</span>
        </div>
        <span className="text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded-full font-medium">
          Rapid Line
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Stops", value: String(route.totalStations) },
          { label: "Time", value: `~${route.totalTime} min` },
          { label: "Fare", value: `₹${route.fare}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-muted/50 rounded-xl py-2">
            <p className="text-base font-bold">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {route.fareNote && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="w-3 h-3 shrink-0" /> {route.fareNote}
        </p>
      )}

      {route.departureTime && (
        <p className="text-xs text-muted-foreground text-center">
          Departs ~{route.departureTime} · Arrives ~{route.arrivalTime}
        </p>
      )}

      <button onClick={onStart} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
        <Train className="w-4 h-4" /> Start Journey
      </button>
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
        {ops.map(s => <option key={s.id} value={s.id}>{s.name}{s.isInterchange ? " ↔" : ""}</option>)}
      </select>
    </div>
  );
}

export default function GurgaonIndex() {
  const navigate = useNavigate();
  const { journey, startJourney, endJourney, requestNotificationPermission } = useJourneyTracker();
  const [origin, setOrigin] = useState(""), [dest, setDest] = useState("");
  const [route, setRoute] = useState<PlannedRoute | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<"route" | "stations">("route");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  useEffect(() => {
    if (origin && dest && origin !== dest) {
      const r = planRoute(origin, dest);
      if (r) {
        setRoute(r);
        const arr = LINE_STATIONS.rapid;
        const fi = arr.indexOf(origin), ti = arr.indexOf(dest);
        setHighlightIds(fi < ti ? arr.slice(fi, ti + 1) : arr.slice(ti, fi + 1).reverse());
      } else setRoute(null);
    } else { setRoute(null); setHighlightIds([]); }
  }, [origin, dest]);

  const handleMapClick = useCallback((id: string) => {
    setSelectedStation(id);
    if (!origin) setOrigin(id); else if (!dest) setDest(id);
  }, [origin, dest]);

  const handleStart = useCallback(async () => {
    if (!route) return;
    await requestNotificationPermission();
    await startJourney(route.origin.id, route.destination.id, "rapid");
  }, [route, startJourney, requestNotificationPermission]);

  const crowd = selectedStation ? getCrowdEstimate(selectedStation) : null;
  const nextFwd = selectedStation ? getNextTrainsAtStation(selectedStation, "forward", 2) : [];
  const nextBwd = selectedStation ? getNextTrainsAtStation(selectedStation, "backward", 2) : [];

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && <JourneyMode journey={journey} onEnd={endJourney} />}
      <OfflineIndicator />
      <GurgaonMap highlightIds={highlightIds} onStationClick={handleMapClick} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1200] px-3 pt-3 flex items-center gap-2">
        <button onClick={() => navigate("/")} className="h-9 w-9 rounded-xl bg-card border border-border shadow flex items-center justify-center text-muted-foreground">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 h-9 shadow">
          <Train className="w-4 h-4 text-cyan-500 shrink-0" />
          <span className="text-sm font-semibold">Gurgaon Rapid Metro</span>
          <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full">11 live</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Bottom sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-[1100] bg-card border-t border-border rounded-t-2xl shadow-2xl">
        <div className="flex border-b border-border">
          {(["route", "stations"] as const).map(tab => (
            <button key={tab} onClick={() => setActivePanel(tab)} className={cn("flex-1 py-3 text-xs font-semibold capitalize transition-colors", activePanel === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground")}>
              {tab === "route" ? "Plan Route" : "Stations"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[55vh] px-4 pt-4 pb-8 space-y-4">
          {activePanel === "route" && (
            <>
              <StationSelect label="From" value={origin} onChange={setOrigin} />
              <StationSelect label="To" value={dest} onChange={setDest} />
              {origin && dest && origin === dest && <p className="text-xs text-center text-muted-foreground">Same station selected.</p>}
              {route && <RouteCard route={route} onStart={handleStart} />}
              {!origin && (
                <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-3">
                  <p className="text-xs text-cyan-700 dark:text-cyan-300 font-medium mb-1">Flat fare system</p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400">₹20 within same phase · ₹35 cross-phase (via Sikanderpur). Delhi Metro Smart Card accepted.</p>
                </div>
              )}
            </>
          )}

          {activePanel === "stations" && (
            <div className="flex flex-col gap-2">
              {Object.values(stations).sort((a, b) => {
                // Sort by line order, not alphabetically
                return LINE_STATIONS.rapid.indexOf(a.id) - LINE_STATIONS.rapid.indexOf(b.id);
              }).map(s => (
                <button key={s.id} onClick={() => setSelectedStation(s.id)} className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors", selectedStation === s.id ? "bg-primary/10 border border-primary/30" : "bg-muted/40 hover:bg-muted")}>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      🔵 Rapid Line{s.isInterchange ? " · ↔ Delhi Metro Yellow" : ""}
                    </p>
                  </div>
                  {crowd && selectedStation === s.id && (
                    <span className={cn("text-xs px-2 py-0.5 rounded-full",
                      crowd.level === "low" && "bg-green-100 text-green-700",
                      crowd.level === "moderate" && "bg-yellow-100 text-yellow-700",
                      crowd.level === "high" && "bg-orange-100 text-orange-700",
                      crowd.level === "very-high" && "bg-red-100 text-red-700",
                    )}>{crowd.level}</span>
                  )}
                </button>
              ))}

              {selectedStation && (nextFwd.length > 0 || nextBwd.length > 0) && (
                <div className="mt-2 bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Next trains at {stations[selectedStation].name}
                  </p>
                  {nextFwd.map((t, i) => (
                    <div key={`f${i}`} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground">→ DLF Phase 3</span>
                      <span className="font-medium tabular-nums">{t.minutesAway < 1 ? "Now" : `${Math.round(t.minutesAway)} min`}</span>
                    </div>
                  ))}
                  {nextBwd.map((t, i) => (
                    <div key={`b${i}`} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground">← Sector 55-56</span>
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
