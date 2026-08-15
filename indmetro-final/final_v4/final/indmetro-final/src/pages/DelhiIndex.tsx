import { useState, useCallback, useEffect, useRef } from "react";
import { Train, ChevronRight, ArrowRight, Repeat, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JourneyMode from "@/components/JourneyMode";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-delhi";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  INTERCHANGE_STATIONS, DelhiLine, getStationLines,
} from "@/cities/delhi/metroData";
import { planRoute, PlannedRoute } from "@/cities/delhi/routePlanner";
import { getCrowdEstimate } from "@/cities/delhi/crowdSimulation";
import { getNextTrainsAtStation } from "@/cities/delhi/timetable";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";
import { cn } from "@/lib/utils";

const ALL_LINES: DelhiLine[] = ["red","yellow","blue","blue_b","green","violet","orange","pink","magenta","grey"];

// ── Map ──────────────────────────────────────────────────────────────────────
function DelhiMap({ highlightIds, onStationClick }: { highlightIds: string[]; onStationClick: (id: string) => void }) {
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, import("leaflet").CircleMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      const map = L.map(containerRef.current!, { center: [28.620, 77.210], zoom: 11, zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Draw each line
      ALL_LINES.forEach((line) => {
        const coords = LINE_STATIONS[line]
          .map((id) => stations[id]?.coordinates as [number, number])
          .filter(Boolean);
        if (coords.length > 1)
          L.polyline(coords, {
            color: LINE_COLORS[line], weight: line === "orange" ? 3 : 4,
            opacity: line === "orange" ? 0.85 : 0.8,
            dashArray: line === "orange" ? "6 3" : undefined,
          }).addTo(map);
      });

      // Draw stations (small, so we only show interchanges prominently)
      Object.values(stations).forEach((s) => {
        if (!s) return;
        const isIC = INTERCHANGE_STATIONS.has(s.id);
        const primaryLine = s.lines[0];
        const color = LINE_COLORS[primaryLine] ?? "#888";
        const marker = L.circleMarker(s.coordinates as [number, number], {
          radius: isIC ? 7 : 3,
          color: isIC ? "#fff" : color,
          weight: isIC ? 2 : 1,
          fillColor: color,
          fillOpacity: isIC ? 1 : 0.7,
        }).addTo(map);
        marker.bindTooltip(
          isIC ? `${s.name} ⇄ (${s.lines.map((l) => LINE_NAMES[l]).join(", ")})` : s.name,
          { direction: "top", offset: [0, -6] }
        );
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
        if (!marker || !stations[id]) return;
        const s = stations[id];
        const isIC = INTERCHANGE_STATIONS.has(id);
        const color = LINE_COLORS[s.lines[0]] ?? "#888";
        marker.setStyle(highlightIds.includes(id)
          ? { fillColor: "#FBBF24", radius: 9, weight: 2.5, color: "#fff" }
          : { fillColor: color, radius: isIC ? 7 : 3, weight: isIC ? 2 : 1, color: isIC ? "#fff" : color });
      });
    });
  }, [highlightIds]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

// ── Route Card ────────────────────────────────────────────────────────────────
function RouteCard({ route, onStart }: { route: PlannedRoute; onStart: () => void }) {
  const { hasGoSmartCard } = useGoSmartCard();
  const fare = hasGoSmartCard && route.discountedFare ? route.discountedFare : route.fare;
  const linesUsed = [...new Set(route.steps.filter((s) => s.type === "board" && s.line).map((s) => s.line as DelhiLine))];

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-sm font-medium min-w-0">
          <span className="truncate max-w-[100px]">{route.origin.name}</span>
          <ArrowRight className="w-3 h-3 shrink-0 text-muted-foreground" />
          <span className="truncate max-w-[100px]">{route.destination.name}</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {linesUsed.map((l) => (
            <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white shrink-0"
              style={{ backgroundColor: LINE_COLORS[l] }}>
              {LINE_NAMES[l].replace(" Line", "").replace("Airport Express", "AE")}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-center">
        {[
          { label: "Stops",     value: String(route.totalStations) },
          { label: "Time",      value: `~${route.totalTime}m` },
          { label: "Xfers",     value: String(route.interchangeCount) },
          { label: "Fare",      value: `₹${fare}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-muted/50 rounded-xl py-2">
            <p className="text-sm font-bold">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Step-by-step */}
      <div className="flex flex-col gap-1.5 text-xs">
        {route.steps.filter((s) => s.type !== "travel").map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            {step.type === "board" && (
              <>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LINE_COLORS[step.line!] }} />
                <span className="text-muted-foreground">
                  Board <span className="font-medium text-foreground">{LINE_NAMES[step.line!]}</span> at {step.stationName}
                </span>
                <span className="ml-auto text-[10px] text-muted-foreground truncate max-w-[100px]">{step.direction}</span>
              </>
            )}
            {step.type === "transfer" && (
              <>
                <Repeat className="w-3 h-3 shrink-0 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400">
                  Transfer at <span className="font-medium">{step.stationName}</span>
                  {step.transferNote ? ` — ${step.transferNote}` : ""}
                </span>
              </>
            )}
            {step.type === "alight" && (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <span className="font-medium">Alight at {step.stationName}</span>
              </>
            )}
          </div>
        ))}
      </div>

      {route.departureTime && (
        <p className="text-xs text-center text-muted-foreground">
          Departs ~{route.departureTime} · Arrives ~{route.arrivalTime}
        </p>
      )}

      {route.isAirportExpress && (
        <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl px-3 py-2">
          <Plane className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <p className="text-xs text-orange-700 dark:text-orange-300">
            Airport Express uses <span className="font-semibold">separate ticketing</span> — DMC Smart Card not valid.
          </p>
        </div>
      )}

      {hasGoSmartCard && route.discountedFare && route.discountedFare < route.fare && !route.isAirportExpress && (
        <p className="text-xs text-center font-medium text-blue-600 dark:text-blue-400">
          DMC Smart Card: {route.smartCardDiscountPercent}% discount applied
        </p>
      )}

      <button onClick={onStart}
        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-red-600 text-white">
        <Train className="w-4 h-4" /> Start Journey
      </button>
    </div>
  );
}

// ── Station Select ────────────────────────────────────────────────────────────
function StationSelect({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="bg-muted border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500">
        <option value="">Select station…</option>
        {ALL_LINES.map((line) => (
          <optgroup key={line} label={LINE_NAMES[line]}>
            {LINE_STATIONS[line].map((id) => {
              const st = stations[id];
              if (!st) return null;
              const isIC = INTERCHANGE_STATIONS.has(id);
              return (
                <option key={id} value={id}>
                  {st.name}{isIC ? " ⇄" : st.isUnderground ? " 🚇" : ""}
                </option>
              );
            })}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DelhiIndex() {
  const navigate = useNavigate();
  const { journey, startJourney, endJourney, requestNotificationPermission } = useJourneyTracker();
  const [origin,          setOrigin]          = useState("");
  const [dest,            setDest]            = useState("");
  const [route,           setRoute]           = useState<PlannedRoute | null>(null);
  const [routeError,      setRouteError]      = useState<string | null>(null);
  const [highlightIds,    setHighlightIds]    = useState<string[]>([]);
  const [activePanel,     setActivePanel]     = useState<"route" | "stations">("route");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [activeLineTab,   setActiveLineTab]   = useState<DelhiLine>("yellow");

  useEffect(() => {
    if (origin && dest && origin !== dest) {
      const r = planRoute(origin, dest);
      if (r) {
        setRoute(r); setRouteError(null);
        setHighlightIds(r.steps.filter((s) => s.stationId).map((s) => s.stationId!));
      } else {
        setRoute(null);
        setRouteError("No route found. Both stations may not be connected to the main network.");
      }
    } else { setRoute(null); setRouteError(null); setHighlightIds([]); }
  }, [origin, dest]);

  const handleMapClick = useCallback((id: string) => {
    setSelectedStation(id);
    if (!origin) setOrigin(id);
    else if (!dest && id !== origin) setDest(id);
  }, [origin, dest]);

  const handleStart = useCallback(async () => {
    if (!route) return;
    await requestNotificationPermission();
    const boardSteps = route.steps.filter((s) => s.type === "board");
    const alightStep = route.steps.find((s) => s.type === "alight");
    const transferStations = route.steps.filter((s) => s.type === "transfer").map((s) => s.stationId!);
    const segments: { fromId: string; toId: string; line: DelhiLine }[] = boardSteps.map((b, i) => ({
      fromId: b.stationId!,
      toId: transferStations[i] ?? alightStep?.stationId ?? dest,
      line: b.line as DelhiLine,
    }));
    await startJourney(segments);
  }, [route, startJourney, requestNotificationPermission, dest]);

  const crowd      = selectedStation ? getCrowdEstimate(selectedStation) : null;
  const selLines   = selectedStation ? getStationLines(selectedStation) : [];
  const nextTrains = selectedStation && selLines.length
    ? selLines.slice(0, 2).flatMap((line) => [
        ...getNextTrainsAtStation(selectedStation, line, "forward",  2),
        ...getNextTrainsAtStation(selectedStation, line, "backward", 2),
      ])
    : [];
  const selectedSt = selectedStation ? stations[selectedStation] : null;

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && <JourneyMode journey={journey as any} onEnd={endJourney} />}
      <OfflineIndicator />
      <DelhiMap highlightIds={highlightIds} onStationClick={handleMapClick} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1200] px-3 pt-3 flex items-center gap-2">
        <button onClick={() => navigate("/")}
          className="h-9 w-9 rounded-xl bg-card border border-border shadow flex items-center justify-center text-muted-foreground">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 h-9 shadow overflow-hidden">
          <Train className="w-4 h-4 shrink-0 text-red-600" />
          <span className="text-sm font-semibold truncate">Delhi Metro · DMRC</span>
          <div className="ml-auto flex gap-0.5 shrink-0">
            {(["red","yellow","blue","violet","pink","magenta"] as DelhiLine[]).map((l) => (
              <span key={l} className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: LINE_COLORS[l] }} />
            ))}
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Bottom sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-[1100] bg-card border-t border-border rounded-t-2xl shadow-2xl">
        <div className="flex border-b border-border">
          {(["route", "stations"] as const).map((tab) => (
            <button key={tab} onClick={() => setActivePanel(tab)}
              className={cn("flex-1 py-3 text-xs font-semibold capitalize transition-colors",
                activePanel === tab ? "border-b-2 border-red-600 text-red-600 dark:text-red-400" : "text-muted-foreground")}>
              {tab === "route" ? "Plan Route" : "Stations"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[55vh] px-4 pt-4 pb-8 space-y-4">
          {activePanel === "route" && (
            <>
              <StationSelect label="From" value={origin} onChange={(id) => { setOrigin(id); setDest(""); }} />
              <StationSelect label="To"   value={dest}   onChange={setDest} />
              {routeError && <p className="text-xs text-center text-destructive leading-relaxed">{routeError}</p>}
              {origin && dest && origin === dest && <p className="text-xs text-center text-muted-foreground">Same station selected.</p>}
              {route && <RouteCard route={route} onStart={handleStart} />}
            </>
          )}

          {activePanel === "stations" && (
            <div className="flex flex-col gap-2">
              {/* Line tabs — scrollable */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {ALL_LINES.map((line) => (
                  <button key={line} onClick={() => setActiveLineTab(line)}
                    className={cn("shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all",
                      activeLineTab === line ? "text-white" : "bg-muted text-muted-foreground")}
                    style={activeLineTab === line ? { backgroundColor: LINE_COLORS[line] } : {}}>
                    {LINE_NAMES[line].replace(" Line", "").replace("Airport Express", "AE")}
                  </button>
                ))}
              </div>

              {/* Stations for active line */}
              {LINE_STATIONS[activeLineTab].map((id) => {
                const st = stations[id];
                if (!st) return null;
                const isIC = INTERCHANGE_STATIONS.has(id);
                const isSelected = selectedStation === id;
                return (
                  <button key={id} onClick={() => setSelectedStation(id)}
                    className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors",
                      isSelected ? "border" : "bg-muted/40 hover:bg-muted")}
                    style={isSelected ? { backgroundColor: `${LINE_COLORS[activeLineTab]}15`, borderColor: LINE_COLORS[activeLineTab] } : {}}>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5 flex-wrap">
                        {st.name}
                        {isIC && <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full">interchange</span>}
                        {st.isUnderground && <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-500 px-1.5 py-0.5 rounded-full">🚇</span>}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {st.lines.map((l) => (
                          <span key={l} className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: LINE_COLORS[l] }} />
                            {LINE_NAMES[l]}
                          </span>
                        ))}
                      </div>
                    </div>
                    {crowd && isSelected && (
                      <span className={cn("text-xs px-2 py-0.5 rounded-full shrink-0",
                        crowd.level === "low"       && "bg-green-100 dark:bg-green-900/30 text-green-700",
                        crowd.level === "moderate"  && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700",
                        crowd.level === "high"      && "bg-orange-100 dark:bg-orange-900/30 text-orange-700",
                        crowd.level === "very-high" && "bg-red-100 dark:bg-red-900/30 text-red-700",
                      )}>{crowd.level}</span>
                    )}
                  </button>
                );
              })}

              {/* Next trains */}
              {selectedSt && nextTrains.length > 0 && (
                <div className="bg-muted/40 rounded-xl p-3 mt-1">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Next trains at {selectedSt.name}
                  </p>
                  {nextTrains.slice(0, 6).map((t, i) => {
                    const line = t.schedule.line;
                    const arr = LINE_STATIONS[line];
                    const fwd = LINE_NAMES[line] + " → " + (stations[arr[arr.length - 1]]?.name ?? "terminal");
                    const bck = LINE_NAMES[line] + " ← " + (stations[arr[0]]?.name ?? "terminal");
                    return (
                      <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LINE_COLORS[line] }} />
                          <span className="text-muted-foreground text-xs truncate">
                            {t.schedule.direction === "forward" ? fwd : bck}
                          </span>
                        </div>
                        <span className="font-medium tabular-nums text-xs shrink-0 ml-2">
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
