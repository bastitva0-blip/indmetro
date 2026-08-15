import { useState, useCallback, useEffect, useRef } from "react";
import { Train, ChevronRight, ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JourneyMode from "@/components/JourneyMode";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-pune";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES, getStationLine,
} from "@/cities/pune/metroData";
import { planRoute, PlannedRoute } from "@/cities/pune/routePlanner";
import { getCrowdEstimate } from "@/cities/pune/crowdSimulation";
import { getNextTrainsAtStation } from "@/cities/pune/timetable";
import { getSmartCardDiscount } from "@/cities/pune/fareData";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";
import { cn } from "@/lib/utils";

// ── Map ──────────────────────────────────────────────────────────────────────
function PuneMap({ highlightIds, onStationClick }: { highlightIds: string[]; onStationClick: (id: string) => void }) {
  const mapRef       = useRef<import("leaflet").Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef   = useRef<Record<string, import("leaflet").CircleMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      const map = L.map(containerRef.current!, { center: [18.538, 73.855], zoom: 12, zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Purple Line — elevated solid, underground dashed
      const purpleElevated = LINE_STATIONS.purple.slice(0, 9).map((id) => stations[id].coordinates as [number,number]);
      const purpleUnderground = LINE_STATIONS.purple.slice(8).map((id) => stations[id].coordinates as [number,number]);
      L.polyline(purpleElevated,    { color: LINE_COLORS.purple, weight: 5, opacity: 0.9 }).addTo(map);
      L.polyline(purpleUnderground, { color: LINE_COLORS.purple, weight: 5, opacity: 0.7, dashArray: "6 4" }).addTo(map);

      // Aqua Line — all elevated, solid
      const aquaCoords = LINE_STATIONS.aqua.map((id) => stations[id].coordinates as [number,number]);
      L.polyline(aquaCoords, { color: LINE_COLORS.aqua, weight: 5, opacity: 0.9 }).addTo(map);

      Object.values(stations).forEach((s) => {
        const color = s.lines.includes("purple") ? LINE_COLORS.purple : LINE_COLORS.aqua;
        const marker = L.circleMarker(s.coordinates as [number,number], {
          radius: 7, color: "#fff", weight: 2, fillColor: color, fillOpacity: 0.95,
        }).addTo(map);
        marker.bindTooltip(s.isUnderground ? `${s.name} 🚇` : s.name, { direction: "top", offset: [0, -8] });
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
        const color = s.lines.includes("purple") ? LINE_COLORS.purple : LINE_COLORS.aqua;
        marker.setStyle(highlightIds.includes(id)
          ? { fillColor: "#FBBF24", radius: 10, weight: 3 }
          : { fillColor: color, radius: 7, weight: 2 });
      });
    });
  }, [highlightIds]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

// ── Route Card ───────────────────────────────────────────────────────────────
function RouteCard({ route, onStart }: { route: PlannedRoute; onStart: () => void }) {
  const { hasGoSmartCard } = useGoSmartCard();
  const isWeekend = [0, 6].includes(new Date().getDay());
  const fare = hasGoSmartCard && route.discountedFare ? route.discountedFare : route.fare;
  const lineColor = LINE_COLORS[route.line];

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{route.origin.name}</span>
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
          <span>{route.destination.name}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: lineColor }}>
          {LINE_NAMES[route.line]}
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
        <p className="text-xs text-center font-medium" style={{ color: lineColor }}>
          Maha Metro Card: {isWeekend ? "30%" : "10%"} {isWeekend ? "weekend" : "weekday"} discount applied
        </p>
      )}

      <button
        onClick={onStart}
        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white"
        style={{ backgroundColor: lineColor }}
      >
        <Train className="w-4 h-4" /> Start Journey
      </button>
    </div>
  );
}

// ── Station Select — line-aware ──────────────────────────────────────────────
function StationSelect({ label, value, onChange, filterLine }: {
  label: string; value: string; onChange: (id: string) => void; filterLine?: "purple" | "aqua" | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-muted border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Select station…</option>
        {(["purple", "aqua"] as const).map((line) => {
          if (filterLine && filterLine !== line) return null;
          return (
            <optgroup key={line} label={LINE_NAMES[line]}>
              {LINE_STATIONS[line].map((id) => {
                const s = stations[id];
                return (
                  <option key={id} value={id}>
                    {s.name}{s.isUnderground ? " 🚇" : ""}
                  </option>
                );
              })}
            </optgroup>
          );
        })}
      </select>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PuneIndex() {
  const navigate = useNavigate();
  const { journey, startJourney, endJourney, requestNotificationPermission } = useJourneyTracker();
  const [origin,          setOrigin]          = useState("");
  const [dest,            setDest]            = useState("");
  const [route,           setRoute]           = useState<PlannedRoute | null>(null);
  const [routeError,      setRouteError]      = useState<string | null>(null);
  const [highlightIds,    setHighlightIds]    = useState<string[]>([]);
  const [activePanel,     setActivePanel]     = useState<"route" | "stations">("route");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [activeLineTab,   setActiveLineTab]   = useState<"purple" | "aqua">("purple");

  // When origin selected, lock dest selector to same line
  const originLine = origin ? getStationLine(origin) : null;

  useEffect(() => {
    if (origin && dest && origin !== dest) {
      const r = planRoute(origin, dest);
      if (r) {
        setRoute(r);
        setRouteError(null);
        const lineArr = LINE_STATIONS[r.line];
        const fi = lineArr.indexOf(origin);
        const ti = lineArr.indexOf(dest);
        if (fi !== -1 && ti !== -1) {
          setHighlightIds(fi < ti ? lineArr.slice(fi, ti + 1) : lineArr.slice(ti, fi + 1).reverse());
        }
      } else {
        setRoute(null);
        const oLine = getStationLine(origin);
        const dLine = getStationLine(dest);
        setRouteError(
          oLine !== dLine
            ? "These stations are on different lines. No interchange available yet — Pink Line UC will connect them."
            : "No route found."
        );
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
    await startJourney(route.origin.id, route.destination.id, route.line);
  }, [route, startJourney, requestNotificationPermission]);

  const crowd      = selectedStation ? getCrowdEstimate(selectedStation) : null;
  const selLine    = selectedStation ? getStationLine(selectedStation) : null;
  const nextTrains = selectedStation && selLine
    ? [
        ...getNextTrainsAtStation(selectedStation, selLine, "forward",  2),
        ...getNextTrainsAtStation(selectedStation, selLine, "backward", 2),
      ]
    : [];
  const selectedSt = selectedStation ? stations[selectedStation] : null;

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && <JourneyMode journey={journey} onEnd={endJourney} />}
      <OfflineIndicator />
      <PuneMap highlightIds={highlightIds} onStationClick={handleMapClick} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1200] px-3 pt-3 flex items-center gap-2">
        <button onClick={() => navigate("/")} className="h-9 w-9 rounded-xl bg-card border border-border shadow flex items-center justify-center text-muted-foreground">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 h-9 shadow">
          <Train className="w-4 h-4 shrink-0 text-purple-600" />
          <span className="text-sm font-semibold">Pune Metro</span>
          <div className="ml-auto flex gap-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white bg-purple-600">Purple</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white bg-cyan-500">Aqua</span>
            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">30 st</span>
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
                activePanel === tab ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400" : "text-muted-foreground"
              )}
            >
              {tab === "route" ? "Plan Route" : "Stations"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[55vh] px-4 pt-4 pb-8 space-y-4">
          {activePanel === "route" && (
            <>
              {/* No-interchange info */}
              <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2.5">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Purple and Aqua lines have <span className="font-semibold">no interchange</span> yet. Plan trips within one line only.
                </p>
              </div>

              <StationSelect label="From" value={origin} onChange={(id) => { setOrigin(id); setDest(""); }} />
              <StationSelect
                label="To"
                value={dest}
                onChange={setDest}
                filterLine={originLine}
              />

              {routeError && <p className="text-xs text-center text-destructive leading-relaxed">{routeError}</p>}
              {origin && dest && origin === dest && <p className="text-xs text-center text-muted-foreground">Same station selected.</p>}
              {route && <RouteCard route={route} onStart={handleStart} />}
            </>
          )}

          {activePanel === "stations" && (
            <div className="flex flex-col gap-2">
              {/* Line tabs */}
              <div className="flex gap-2 mb-1">
                {(["purple", "aqua"] as const).map((line) => (
                  <button
                    key={line}
                    onClick={() => setActiveLineTab(line)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      activeLineTab === line ? "text-white" : "bg-muted text-muted-foreground"
                    )}
                    style={activeLineTab === line ? { backgroundColor: LINE_COLORS[line] } : {}}
                  >
                    {LINE_NAMES[line]}
                  </button>
                ))}
              </div>

              {LINE_STATIONS[activeLineTab].map((id) => {
                const s = stations[id];
                const isSelected = selectedStation === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedStation(id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors",
                      isSelected
                        ? activeLineTab === "purple"
                          ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700"
                          : "bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-300 dark:border-cyan-700"
                        : "bg-muted/40 hover:bg-muted"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        {s.name}
                        {s.isUnderground && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: LINE_COLORS[activeLineTab] }}>
                            underground
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: LINE_COLORS[activeLineTab] }} />
                        {LINE_NAMES[activeLineTab]}
                      </p>
                    </div>
                    {crowd && isSelected && (
                      <span className={cn("text-xs px-2 py-0.5 rounded-full",
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

              {/* Next trains */}
              {selectedSt && selLine && nextTrains.length > 0 && (
                <div className="mt-2 bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Next trains at {selectedSt.name}
                  </p>
                  {nextTrains.map((t, i) => {
                    const terminals = selLine === "purple"
                      ? { forward: "Swargate", backward: "PCMC Bhavan" }
                      : { forward: "Ramwadi",  backward: "Vanaz"       };
                    return (
                      <div key={i} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                        <span className="text-muted-foreground">
                          {t.schedule.direction === "forward" ? `→ ${terminals.forward}` : `← ${terminals.backward}`}
                        </span>
                        <span className="font-medium tabular-nums">
                          {t.minutesAway < 1 ? "Now" : `${Math.round(t.minutesAway)} min`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Crowd */}
              {selectedSt && crowd && (
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Current crowd</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${crowd.percentage}%`,
                        backgroundColor: crowd.level === "low" ? "#22c55e" : crowd.level === "moderate" ? "#eab308" : crowd.level === "high" ? "#f97316" : "#ef4444",
                      }} />
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
