import { useState, useCallback, useEffect, useRef } from "react";
import { Train, ChevronRight, ArrowRight, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JourneyMode from "@/components/JourneyMode";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-bhopal";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  OPERATIONAL_STATIONS,
} from "@/cities/bhopal/metroData";
import { planRoute, PlannedRoute } from "@/cities/bhopal/routePlanner";
import { getCrowdEstimate } from "@/cities/bhopal/crowdSimulation";
import { getNextTrainsAtStation } from "@/cities/bhopal/timetable";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";
import { cn } from "@/lib/utils";

// ── Map ───────────────────────────────────────────────────────────────────────
function BhopalMap({
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

      // Orange Line — operational segment (solid)
      const opIds = LINE_STATIONS.orange.filter((id) => OPERATIONAL_STATIONS.has(id));
      const opCoords = opIds.map((id) => stations[id].coordinates as [number, number]);
      L.polyline(opCoords, { color: LINE_COLORS.orange, weight: 5, opacity: 0.95 }).addTo(map);

      // Orange Line — WIP segment (dashed, faded)
      const wipOrangeIds = LINE_STATIONS.orange.filter((id) => !OPERATIONAL_STATIONS.has(id));
      if (wipOrangeIds.length) {
        const wipCoords = wipOrangeIds.map((id) => stations[id].coordinates as [number, number]);
        L.polyline(wipCoords, { color: LINE_COLORS.orange, weight: 4, opacity: 0.35, dashArray: "8 6" }).addTo(map);
      }

      // Blue Line — all WIP (dashed, faded)
      const blueCoords = LINE_STATIONS.blue.map((id) => stations[id].coordinates as [number, number]);
      L.polyline(blueCoords, { color: LINE_COLORS.blue, weight: 4, opacity: 0.30, dashArray: "8 6" }).addTo(map);

      // Station markers
      Object.values(stations).forEach((s) => {
        const isOp  = OPERATIONAL_STATIONS.has(s.id);
        const color = s.lines.includes("orange") ? LINE_COLORS.orange : LINE_COLORS.blue;
        const marker = L.circleMarker(
          s.coordinates as [number, number],
          {
            radius: isOp ? 7 : 4,
            color: "#fff",
            weight: isOp ? 2 : 1,
            fillColor: isOp ? color : "#9ca3af",
            fillOpacity: isOp ? 0.95 : 0.5,
          }
        ).addTo(map);

        const label = s.isWIP ? `${s.name} 🚧` : s.isInterchange ? `${s.name} ⇄` : s.name;
        marker.bindTooltip(label, { direction: "top", offset: [0, -8] });
        if (isOp) marker.on("click", () => onStationClick(s.id));
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
        const s    = stations[id];
        const isOp = OPERATIONAL_STATIONS.has(id);
        if (highlightIds.includes(id)) {
          marker.setStyle({ fillColor: "#FBBF24", radius: 10, weight: 3 });
        } else {
          const color = s.lines.includes("orange") ? LINE_COLORS.orange : LINE_COLORS.blue;
          marker.setStyle({ fillColor: isOp ? color : "#9ca3af", radius: isOp ? 7 : 4, weight: isOp ? 2 : 1 });
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
        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: LINE_COLORS.orange }}>
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
        <p className="text-xs text-center text-orange-600 dark:text-orange-400">
          10% Bhoj Metro Smart Card discount applied
        </p>
      )}

      <button
        onClick={onStart}
        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white"
        style={{ backgroundColor: LINE_COLORS.orange }}
      >
        <Train className="w-4 h-4" /> Start Journey
      </button>
    </div>
  );
}

// ── Station Select (operational only) ────────────────────────────────────────
function StationSelect({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  const opStations = LINE_STATIONS.orange
    .filter((id) => OPERATIONAL_STATIONS.has(id))
    .map((id) => stations[id]);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-muted border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="">Select station…</option>
        {opStations.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  );
}

// ── WIP Banner ────────────────────────────────────────────────────────────────
function WipBanner() {
  return (
    <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2.5">
      <Construction className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
        <span className="font-semibold">Bhoj Metro — Partial Operations.</span>{" "}
        Priority corridor (AIIMS ↔ Subhash Nagar, 8 stations) opened Dec 21, 2025.
        Blue Line and remaining Orange Line stations under construction.
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BhopalIndex() {
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
        const oIdx = LINE_STATIONS.orange.indexOf(origin);
        const dIdx = LINE_STATIONS.orange.indexOf(dest);
        if (oIdx !== -1 && dIdx !== -1) {
          const slice = oIdx < dIdx
            ? LINE_STATIONS.orange.slice(oIdx, dIdx + 1)
            : LINE_STATIONS.orange.slice(dIdx, oIdx + 1).reverse();
          setHighlightIds(slice.filter((id) => OPERATIONAL_STATIONS.has(id)));
        }
      } else {
        setRoute(null);
        setRouteError("No route between these stations. Only the 8 operational stations are routable.");
      }
    } else {
      setRoute(null);
      setRouteError(null);
      setHighlightIds([]);
    }
  }, [origin, dest]);

  const handleMapClick = useCallback((id: string) => {
    if (!OPERATIONAL_STATIONS.has(id)) return;
    setSelectedStation(id);
    if (!origin) setOrigin(id);
    else if (!dest && id !== origin) setDest(id);
  }, [origin, dest]);

  const handleStart = useCallback(async () => {
    if (!route) return;
    await requestNotificationPermission();
    await startJourney(route.origin.id, route.destination.id, "orange");
  }, [route, startJourney, requestNotificationPermission]);

  const crowd      = selectedStation ? getCrowdEstimate(selectedStation) : null;
  const nextTrains = selectedStation && OPERATIONAL_STATIONS.has(selectedStation)
    ? [
        ...getNextTrainsAtStation(selectedStation, "orange", "forward",  2),
        ...getNextTrainsAtStation(selectedStation, "orange", "backward", 2),
      ]
    : [];

  const selectedSt = selectedStation ? stations[selectedStation] : null;

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && (
        <JourneyMode journey={journey} onEnd={endJourney} />
      )}
      <OfflineIndicator />
      <BhopalMap highlightIds={highlightIds} onStationClick={handleMapClick} />

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
          <Train className="w-4 h-4 shrink-0" style={{ color: LINE_COLORS.orange }} />
          <span className="text-sm font-semibold">Bhopal · Bhoj Metro</span>
          <div className="ml-auto flex gap-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: LINE_COLORS.orange }}>
              8 live
            </span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full">
              21 UC
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
                  ? "border-b-2 border-orange-500 text-orange-600 dark:text-orange-400"
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
              <WipBanner />
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
                Orange Line — Operational
              </p>
              {LINE_STATIONS.orange
                .filter((id) => OPERATIONAL_STATIONS.has(id))
                .map((id) => {
                  const s = stations[id];
                  const isSelected = selectedStation === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedStation(id)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors",
                        isSelected
                          ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700"
                          : "bg-muted/40 hover:bg-muted"
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: LINE_COLORS.orange }} />
                          {LINE_NAMES.orange}
                        </p>
                      </div>
                      {crowd && isSelected && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          crowd.level === "low"       && "bg-green-100 dark:bg-green-900/30 text-green-700",
                          crowd.level === "moderate"  && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700",
                          crowd.level === "high"      && "bg-orange-100 dark:bg-orange-900/30 text-orange-700",
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
              {LINE_STATIONS.orange
                .filter((id) => !OPERATIONAL_STATIONS.has(id))
                .map((id) => {
                  const s = stations[id];
                  return (
                    <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/20 opacity-60">
                      <Construction className="w-3 h-3 shrink-0 text-amber-500" />
                      <span className="text-xs text-muted-foreground">{s.name}</span>
                      {s.isInterchange && (
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full ml-auto">
                          interchange
                        </span>
                      )}
                      {s.isUnderground && (
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
              {LINE_STATIONS.blue.map((id) => {
                const s = stations[id];
                return (
                  <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/20 opacity-60">
                    <Construction className="w-3 h-3 shrink-0 text-amber-500" />
                    <span className="text-xs text-muted-foreground">{s.name}</span>
                    {s.isInterchange && (
                      <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded-full ml-auto">
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
                        {t.schedule.direction === "forward" ? "→ AIIMS" : "← Subhash Nagar"}
                      </span>
                      <span className="font-medium tabular-nums">
                        {t.minutesAway < 1 ? "Now" : `${Math.round(t.minutesAway)} min`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedSt && OPERATIONAL_STATIONS.has(selectedSt.id) && crowd && (
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
