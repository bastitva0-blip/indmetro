import { useState, useCallback, useEffect, useRef } from "react";
import { Train, ChevronRight, ArrowRight, Repeat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JourneyMode from "@/components/JourneyMode";
import { useJourneyTracker } from "@/hooks/use-journey-tracker-bangalore";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES,
  INTERCHANGE_STATIONS, getStationLines,
} from "@/cities/bangalore/metroData";
import { planRoute, PlannedRoute } from "@/cities/bangalore/routePlanner";
import { getCrowdEstimate } from "@/cities/bangalore/crowdSimulation";
import { getNextTrainsAtStation } from "@/cities/bangalore/timetable";
import { getSmartCardDiscount } from "@/cities/bangalore/fareData";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";
import { cn } from "@/lib/utils";

type BLLine = "purple" | "green" | "yellow";

// ── Map ──────────────────────────────────────────────────────────────────────
function BangaloreMap({ highlightIds, onStationClick }: { highlightIds: string[]; onStationClick: (id: string) => void }) {
  const mapRef       = useRef<import("leaflet").Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef   = useRef<Record<string, import("leaflet").CircleMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      const map = L.map(containerRef.current!, { center: [12.975, 77.590], zoom: 12, zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Draw lines
      (["purple", "green", "yellow"] as BLLine[]).forEach((line) => {
        const coords = LINE_STATIONS[line].map((id) => stations[id]?.coordinates as [number, number]).filter(Boolean);
        L.polyline(coords, { color: LINE_COLORS[line], weight: 5, opacity: 0.9 }).addTo(map);
      });

      // Draw stations
      Object.values(stations).forEach((s) => {
        // Interchange stations: larger, multi-color ring
        const isIC    = INTERCHANGE_STATIONS.has(s.id);
        const color   = s.lines.includes("purple") ? LINE_COLORS.purple :
                        s.lines.includes("yellow") ? LINE_COLORS.yellow : LINE_COLORS.green;
        const marker  = L.circleMarker(s.coordinates as [number, number], {
          radius:      isIC ? 9 : 6,
          color:       isIC ? "#FFD700" : "#fff",
          weight:      isIC ? 3 : 1.5,
          fillColor:   s.isUnderground ? "#333" : color,
          fillOpacity: 0.95,
        }).addTo(map);

        const tip = isIC ? `${s.name} ⇄` : s.isUnderground ? `${s.name} 🚇` : s.name;
        marker.bindTooltip(tip, { direction: "top", offset: [0, -8] });
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
        const s     = stations[id];
        const isIC  = INTERCHANGE_STATIONS.has(id);
        const color = s.lines.includes("purple") ? LINE_COLORS.purple :
                      s.lines.includes("yellow") ? LINE_COLORS.yellow : LINE_COLORS.green;
        marker.setStyle(highlightIds.includes(id)
          ? { fillColor: "#FBBF24", radius: 11, weight: 3 }
          : { fillColor: s.isUnderground ? "#333" : color, radius: isIC ? 9 : 6, weight: isIC ? 3 : 1.5 });
      });
    });
  }, [highlightIds]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

// ── Route Card ───────────────────────────────────────────────────────────────
function RouteCard({ route, onStart }: { route: PlannedRoute; onStart: () => void }) {
  const { hasGoSmartCard } = useGoSmartCard();
  const fare = hasGoSmartCard && route.discountedFare ? route.discountedFare : route.fare;
  const isWeekend = [0, 6].includes(new Date().getDay());

  // Collect lines used
  const linesUsed = [...new Set(
    route.steps.filter((s) => s.type === "board" && s.line).map((s) => s.line as BLLine)
  )];

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="truncate max-w-[110px]">{route.origin.name}</span>
          <ArrowRight className="w-3 h-3 shrink-0 text-muted-foreground" />
          <span className="truncate max-w-[110px]">{route.destination.name}</span>
        </div>
        <div className="flex gap-1">
          {linesUsed.map((l) => (
            <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white"
              style={{ backgroundColor: LINE_COLORS[l] }}>
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Stops",    value: String(route.totalStations) },
          { label: "Time",     value: `~${route.totalTime}m`      },
          { label: "Transfer", value: String(route.interchangeCount) },
          { label: "Fare",     value: `₹${fare}`                  },
        ].map(({ label, value }) => (
          <div key={label} className="bg-muted/50 rounded-xl py-2">
            <p className="text-sm font-bold">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Step-by-step route */}
      <div className="flex flex-col gap-1">
        {route.steps.filter((s) => s.type !== "travel").map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            {step.type === "board" && (
              <>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LINE_COLORS[step.line!] }} />
                <span className="text-muted-foreground">Board <span className="font-medium text-foreground">{LINE_NAMES[step.line!]}</span> at {step.stationName}</span>
                <span className="ml-auto text-muted-foreground text-[10px]">{step.direction}</span>
              </>
            )}
            {step.type === "transfer" && (
              <>
                <Repeat className="w-3 h-3 shrink-0 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400">Transfer at <span className="font-medium">{step.stationName}</span></span>
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
      {hasGoSmartCard && route.discountedFare && route.discountedFare < route.fare && (
        <p className="text-xs text-center font-medium text-purple-600 dark:text-purple-400">
          Namma Metro Card: {isWeekend ? "10% weekend" : "5% peak / 10% off-peak"} discount applied
        </p>
      )}

      <button onClick={onStart}
        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white bg-purple-600">
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
        className="bg-muted border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500">
        <option value="">Select station…</option>
        {(["purple", "green", "yellow"] as BLLine[]).map((line) => (
          <optgroup key={line} label={`${LINE_NAMES[line]} (${LINE_STATIONS[line].length} st)`}>
            {LINE_STATIONS[line].map((id) => {
              const s = stations[id];
              const isIC = INTERCHANGE_STATIONS.has(id);
              return (
                <option key={id} value={id}>
                  {s.name}{isIC ? " ⇄" : s.isUnderground ? " 🚇" : ""}
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
export default function BangaloreIndex() {
  const navigate = useNavigate();
  const { journey, startJourney, endJourney, requestNotificationPermission } = useJourneyTracker();
  const [origin,          setOrigin]          = useState("");
  const [dest,            setDest]            = useState("");
  const [route,           setRoute]           = useState<PlannedRoute | null>(null);
  const [routeError,      setRouteError]      = useState<string | null>(null);
  const [highlightIds,    setHighlightIds]    = useState<string[]>([]);
  const [activePanel,     setActivePanel]     = useState<"route" | "stations">("route");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [activeLineTab,   setActiveLineTab]   = useState<BLLine>("purple");

  useEffect(() => {
    if (origin && dest && origin !== dest) {
      const r = planRoute(origin, dest);
      if (r) {
        setRoute(r);
        setRouteError(null);
        // Highlight all stops
        const ids = r.steps
          .filter((s) => s.stationId)
          .map((s) => s.stationId!);
        setHighlightIds(ids);
      } else {
        setRoute(null);
        setRouteError("No route found between these stations.");
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
    // Build segments from route steps
    const boardSteps = route.steps.filter((s) => s.type === "board");
    const travelSteps = route.steps.filter((s) => s.type === "travel");
    const alightStep = route.steps.find((s) => s.type === "alight");
    const segments: { fromId: string; toId: string; line: BLLine }[] = [];

    boardSteps.forEach((b, i) => {
      const nextBoard = boardSteps[i + 1];
      const toId = nextBoard
        ? (route.steps.find((s) => s.type === "transfer")?.stationId ?? "majestic")
        : (alightStep?.stationId ?? dest);
      segments.push({ fromId: b.stationId!, toId, line: b.line as BLLine });
    });

    await startJourney(segments);
  }, [route, startJourney, requestNotificationPermission, dest]);

  const crowd      = selectedStation ? getCrowdEstimate(selectedStation) : null;
  const selLines   = selectedStation ? getStationLines(selectedStation) : [];
  const nextTrains = selectedStation && selLines.length
    ? selLines.flatMap((line) => [
        ...getNextTrainsAtStation(selectedStation, line, "forward",  2),
        ...getNextTrainsAtStation(selectedStation, line, "backward", 2),
      ])
    : [];
  const selectedSt = selectedStation ? stations[selectedStation] : null;

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && <JourneyMode journey={journey} onEnd={endJourney} />}
      <OfflineIndicator />
      <BangaloreMap highlightIds={highlightIds} onStationClick={handleMapClick} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1200] px-3 pt-3 flex items-center gap-2">
        <button onClick={() => navigate("/")} className="h-9 w-9 rounded-xl bg-card border border-border shadow flex items-center justify-center text-muted-foreground">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 h-9 shadow overflow-hidden">
          <Train className="w-4 h-4 shrink-0 text-purple-600" />
          <span className="text-sm font-semibold">Namma Metro</span>
          <div className="ml-auto flex gap-1">
            {(["purple", "green", "yellow"] as BLLine[]).map((l) => (
              <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white shrink-0"
                style={{ backgroundColor: LINE_COLORS[l] }}>
                {LINE_STATIONS[l].length}
              </span>
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
                activePanel === tab ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400" : "text-muted-foreground")}>
              {tab === "route" ? "Plan Route" : "Stations"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[55vh] px-4 pt-4 pb-8 space-y-4">
          {activePanel === "route" && (
            <>
              <StationSelect label="From" value={origin} onChange={(id) => { setOrigin(id); setDest(""); }} />
              <StationSelect label="To"   value={dest}   onChange={setDest} />
              {routeError && <p className="text-xs text-center text-destructive">{routeError}</p>}
              {origin && dest && origin === dest && <p className="text-xs text-center text-muted-foreground">Same station selected.</p>}
              {route && <RouteCard route={route} onStart={handleStart} />}
            </>
          )}

          {activePanel === "stations" && (
            <div className="flex flex-col gap-2">
              {/* Line tabs */}
              <div className="flex gap-1.5">
                {(["purple", "green", "yellow"] as BLLine[]).map((line) => (
                  <button key={line} onClick={() => setActiveLineTab(line)}
                    className={cn("flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      activeLineTab === line ? "text-white" : "bg-muted text-muted-foreground")}
                    style={activeLineTab === line ? { backgroundColor: LINE_COLORS[line] } : {}}>
                    {line.charAt(0).toUpperCase() + line.slice(1)}
                  </button>
                ))}
              </div>

              {/* Station list */}
              {LINE_STATIONS[activeLineTab].map((id) => {
                const s = stations[id];
                const isIC = INTERCHANGE_STATIONS.has(id);
                const isSelected = selectedStation === id;
                return (
                  <button key={id} onClick={() => setSelectedStation(id)}
                    className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors",
                      isSelected ? "border" : "bg-muted/40 hover:bg-muted")}
                    style={isSelected ? { backgroundColor: `${LINE_COLORS[activeLineTab]}15`, borderColor: LINE_COLORS[activeLineTab] } : {}}>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        {s.name}
                        {isIC && <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full">interchange</span>}
                        {s.isUnderground && <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 px-1.5 py-0.5 rounded-full">🚇</span>}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {s.lines.map((l) => (
                          <span key={l} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: LINE_COLORS[l] }} />
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
                <div className="mt-2 bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Next trains at {selectedSt.name}
                  </p>
                  {nextTrains.map((t, i) => {
                    const line = t.schedule.line;
                    const terminals = {
                      purple: { forward: "Challaghatta", backward: "Whitefield (Kadugodi)" },
                      green:  { forward: "Silk Institute", backward: "Madavara" },
                      yellow: { forward: "Delta Electronics Bommasandra", backward: "RV Road" },
                    }[line];
                    return (
                      <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LINE_COLORS[line] }} />
                          <span className="text-muted-foreground text-xs">
                            {t.schedule.direction === "forward" ? `→ ${terminals.forward}` : `← ${terminals.backward}`}
                          </span>
                        </div>
                        <span className="font-medium tabular-nums text-xs">
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
