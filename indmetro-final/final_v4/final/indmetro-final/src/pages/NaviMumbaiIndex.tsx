import { useState, useCallback, useEffect, useRef } from "react";
import { Train, Wrench, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JourneyMode from "@/components/JourneyMode";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-navi_mumbai";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  OPERATIONAL_STATIONS,
} from "@/cities/navi_mumbai/metroData";
import { planRoute, PlannedRoute } from "@/cities/navi_mumbai/routePlanner";
import { getCrowdEstimate } from "@/cities/navi_mumbai/crowdSimulation";
import { getNextTrainsAtStation } from "@/cities/navi_mumbai/timetable";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";
import { cn } from "@/lib/utils";

// ── Map ───────────────────────────────────────────────────────────────────────
function NaviMumbaiMap({
  highlightIds,
  onStationClick,
}: {
  highlightIds: string[];
  onStationClick: (id: string) => void;
}) {
  const mapRef       = useRef<import("leaflet").Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef   = useRef<Record<string, import("leaflet").CircleMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((mod) => {
      const L = mod.default;
      const map = L.map(containerRef.current!, {
        center: [23.235, 77.428],
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Line 1 — all 11 stations operational
      const allCoords = LINE_STATIONS.line1.map((id) => stations[id].coordinates as [number, number]);
      L.polyline(allCoords, { color: LINE_COLORS.line1, weight: 5, opacity: 0.95 }).addTo(map);

      // Station markers
      Object.values(stations).forEach((s) => {
        const marker = L.circleMarker(
          s.coordinates as [number, number],
          {
            radius: s.isTerminal || s.hasRailTransfer ? 9 : 7,
            color: "#fff", weight: s.isTerminal || s.hasRailTransfer ? 3 : 2,
            fillColor: LINE_COLORS.line1, fillOpacity: 0.95,
          }
        ).addTo(map);
        const label = s.hasRailTransfer ? `${s.name} ⇄` : s.hasFutureInterchange ? `${s.name} 🔗` : s.name;
        marker.bindTooltip(label, { direction: "top", offset: [0, -8] });
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
        if (highlightIds.includes(id)) {
          marker.setStyle({ fillColor: "#FBBF24", radius: 10, weight: 3 });
        } else {
          marker.setStyle({ fillColor: LINE_COLORS.line1, radius: s.isTerminal || s.hasRailTransfer ? 9 : 7, weight: s.isTerminal || s.hasRailTransfer ? 3 : 2 });
        }
      });
    });
  }, [highlightIds]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

// ── Route Card ────────────────────────────────────────────────────────────────
function RouteCard({ route, onStart }: { route: PlannedRoute; onStart: () => void }) {
  const { hasGoSmartCard } = useGoSmartCard();
  const fare = hasGoSmartCard && route.discountedFare ? route.discountedFare : route.fare;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{route.origin.name}</span>
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
          <span>{route.destination.name}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: LINE_COLORS.line1 }}>
          Orange Line
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Stations", value: String(route.totalStations) },
          { label: "Time",     value: `~${route.totalTime} min`   },
          { label: "Fare",     value: `₹${fare}`                  },
        ].map(({ label, value }) => (
          <div key={label} className="bg-muted/50 rounded-xl py-2">
            <p className="text-base font-bold">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {route.departureTime && (
        <p className="text-xs text-center text-muted-foreground">
          Departs ~{route.departureTime} · Arrives ~{route.arrivalTime}
        </p>
      )}
      {hasGoSmartCard && route.discountedFare && route.discountedFare < route.fare && (
        <p className="text-xs text-center text-yellow-600 dark:text-yellow-400">
          10% CIDCO Metro Card discount applied
        </p>
      )}

      <button
        onClick={onStart}
        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white"
        style={{ backgroundColor: LINE_COLORS.line1 }}
      >
        <Train className="w-4 h-4" /> Start Journey
      </button>
    </div>
  );
}

// ── Station Select ────────────────────────────────────────────────────────────
function StationSelect({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  const allStations = LINE_STATIONS.line1.map((id) => stations[id]);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-muted border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <option value="">Select station…</option>
        {allStations.map((s) => (
          <option key={s.id} value={s.id}>{s.name}{s.hasRailTransfer ? " ⇄" : ""}</option>
        ))}
      </select>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function NaviMumbaiIndex() {
  const navigate = useNavigate();
  const { journey, startJourney, endJourney, requestNotificationPermission } = useJourneyTracker();
  const [origin,       setOrigin]       = useState("");
  const [dest,         setDest]         = useState("");
  const [route,        setRoute]        = useState<PlannedRoute | null>(null);
  const [routeError,   setRouteError]   = useState<string | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [activePanel,  setActivePanel]  = useState<"route" | "stations">("route");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  useEffect(() => {
    if (origin && dest && origin !== dest) {
      const r = planRoute(origin, dest);
      if (r) {
        setRoute(r);
        setRouteError(null);
        const oIdx = LINE_STATIONS.line1.indexOf(origin);
        const dIdx = LINE_STATIONS.line1.indexOf(dest);
        if (oIdx !== -1 && dIdx !== -1) {
          const slice = oIdx < dIdx
            ? LINE_STATIONS.line1.slice(oIdx, dIdx + 1)
            : LINE_STATIONS.line1.slice(dIdx, oIdx + 1).reverse();
          setHighlightIds(slice);
        }
      } else {
        setRoute(null);
        setRouteError("Could not find a route. Please select two different stations.");
      }
    } else {
      setRoute(null);
      setRouteError(null);
      setHighlightIds([]);
    }
  }, [origin, dest]);

  const handleMapClick = useCallback((id: string) => {
    setSelectedStation(id);
    if (!origin) setOrigin(id);
    else if (!dest && id !== origin) setDest(id);
  }, [origin, dest]);

  const handleStart = useCallback(async () => {
    if (!route) return;
    await requestNotificationPermission();
    await startJourney(route.origin.id, route.destination.id, "line1");
  }, [route, startJourney, requestNotificationPermission]);

  const crowd      = selectedStation ? getCrowdEstimate(selectedStation) : null;
  const nextTrains = selectedStation && OPERATIONAL_STATIONS.has(selectedStation)
    ? [
        ...getNextTrainsAtStation(selectedStation, "line1", "forward",  2),
        ...getNextTrainsAtStation(selectedStation, "line1", "backward", 2),
      ]
    : [];

  const selectedSt = selectedStation ? stations[selectedStation] : null;

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && (
        <JourneyMode journey={journey} onEnd={endJourney} />
      )}
      <OfflineIndicator />
      <NaviMumbaiMap highlightIds={highlightIds} onStationClick={handleMapClick} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1200] px-3 pt-3 flex items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className="h-9 w-9 rounded-xl bg-card border border-border shadow flex items-center justify-center text-muted-foreground"
          aria-label="All cities"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 h-9 shadow">
          <Train className="w-4 h-4 shrink-0" style={{ color: LINE_COLORS.line1 }} />
          <span className="text-sm font-semibold">Navi Mumbai Metro</span>
          <div className="ml-auto flex gap-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: LINE_COLORS.line1 }}>
              11 live
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Bottom sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-[1100] bg-card border-t border-border rounded-t-2xl shadow-2xl">
        <div className="flex border-b border-border">
          {(["route", "stations"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePanel(tab)}
              className={cn(
                "flex-1 py-3 text-xs font-semibold capitalize transition-colors",
                activePanel === tab
                  ? "border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400"
                  : "text-muted-foreground"
              )}
            >
              {tab === "route" ? "Plan Route" : "Stations"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[55vh] px-4 pt-4 pb-8 space-y-4">
          {activePanel === "route" && (
            <>
              <StationSelect label="From" value={origin} onChange={setOrigin} />
              <StationSelect label="To"   value={dest}   onChange={setDest}   />
              {routeError && (
                <p className="text-xs text-center text-destructive">{routeError}</p>
              )}
              {origin && dest && origin === dest && (
                <p className="text-xs text-center text-muted-foreground">Same station selected.</p>
              )}
              {route && <RouteCard route={route} onStart={handleStart} />}
            </>
          )}

          {activePanel === "stations" && (
            <div className="flex flex-col gap-2">
              {/* Operational stations */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Line 1 — All Stations (11 live)
              </p>
              {LINE_STATIONS.line1.map((id) => {
                  const s = stations[id];
                  const isSelected = selectedStation === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedStation(id)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors",
                        isSelected
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700"
                          : "bg-muted/40 hover:bg-muted"
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: LINE_COLORS.line1 }} />
                          {LINE_NAMES.line1}
                        </p>
                      </div>
                      {crowd && isSelected && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          crowd.level === "low"       && "bg-green-100 dark:bg-green-900/30 text-green-700",
                          crowd.level === "moderate"  && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700",
                          crowd.level === "high"      && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700",
                          crowd.level === "very-high" && "bg-red-100 dark:bg-red-900/30 text-red-700",
                        )}>
                          {crowd.level}
                        </span>
                      )}
                    </button>
                  );
                })}

              {/* Under construction — Orange */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">
                Orange Line — Under Construction
              </p>
              {LINE_STATIONS.line1
                .filter((id) => !OPERATIONAL_STATIONS.has(id))
                .map((id) => {
                  const s = stations[id];
                  return (
                    <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/20 opacity-60">
                      <Wrench className="w-3 h-3 shrink-0 text-amber-500" />
                      <span className="text-xs text-muted-foreground">{s.name}</span>
                      {(s as any).isInterchange && (
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full ml-auto">
                          interchange
                        </span>
                      )}
                      {(s as any).isUnderground && (
                        <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 px-1.5 py-0.5 rounded-full ml-auto">
                          underground
                        </span>
                      )}
                    </div>
                  );
                })}

              {/* Under construction — Blue */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">
                Blue Line — Under Construction
              </p>
              {LINE_STATIONS.line1.map((id) => {
                const s = stations[id];
                return (
                  <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/20 opacity-60">
                    <Wrench className="w-3 h-3 shrink-0 text-amber-500" />
                    <span className="text-xs text-muted-foreground">{s.name}</span>
                    {(s as any).isInterchange && (
                      <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-orange-300 px-1.5 py-0.5 rounded-full ml-auto">
                        interchange
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Next trains + crowd for selected op station */}
              {selectedSt && OPERATIONAL_STATIONS.has(selectedSt.id) && nextTrains.length > 0 && (
                <div className="mt-2 bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Next trains at {selectedSt.name}
                  </p>
                  {nextTrains.map((t, i) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground">
                        {t.schedule.direction === "forward" ? "→ Pendhar" : "← CBD Belapur"}
                      </span>
                      <span className="font-medium tabular-nums">
                        {t.minutesAway < 1 ? "Now" : `${Math.round(t.minutesAway)} min`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedSt && crowd && (
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Current crowd
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${crowd.percentage}%`,
                          backgroundColor:
                            crowd.level === "low"       ? "#22c55e" :
                            crowd.level === "moderate"  ? "#eab308" :
                            crowd.level === "high"      ? "#f97316" : "#ef4444",
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{crowd.label}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
