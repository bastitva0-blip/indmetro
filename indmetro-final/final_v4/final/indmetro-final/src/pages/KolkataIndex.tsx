import { useEffect, useRef, useState, useCallback, lazy } from "react";
import { Train, RefreshCw, MapPin, Clock, Users, ChevronRight, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  stations, LINE_STATIONS, LINE_COLORS, LINE_NAMES, OPERATIONAL_STATIONS,
  type Station,
} from "@/cities/kolkata/metroData";
import { planRoute, type PlannedRoute } from "@/cities/kolkata/routePlanner";
import { getNextTrainsAtStation } from "@/cities/kolkata/timetable";
import { getCrowdEstimate } from "@/cities/kolkata/crowdSimulation";
import { getStationOptions } from "@/cities/kolkata/metroData";

type KolLine = "blue" | "green" | "orange" | "purple";

const LINE_BADGE: Record<string, string> = {
  blue:   "bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300",
  green:  "bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-300",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
};

// ── Map Component ─────────────────────────────────────────────────────────────
function KolkataMap({ onStationClick, highlightIds }: { onStationClick: (id: string) => void; highlightIds: string[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, any>>({});
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const L = (window as any).L;
    if (!L) return;
    const map = L.map(mapRef.current, { center: [22.540, 88.360], zoom: 12, zoomControl: true, attributionControl: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);
    mapInstance.current = map;

    // Draw all 4 lines
    for (const line of ["blue","green","orange","purple"] as KolLine[]) {
      const ops = LINE_STATIONS[line].filter(id => stations[id] && !stations[id].isWIP);
      const wips = LINE_STATIONS[line].filter(id => stations[id]?.isWIP);
      if (ops.length > 1)
        L.polyline(ops.map(id => stations[id].coordinates as [number,number]), { color: LINE_COLORS[line], weight: 5, opacity: 0.9 }).addTo(map);
      if (wips.length > 1) {
        const last = ops[ops.length-1];
        const wipCoords = [last, ...wips].filter(Boolean).map(id => stations[id]?.coordinates as [number,number]).filter(Boolean);
        L.polyline(wipCoords, { color: LINE_COLORS[line], weight: 4, opacity: 0.4, dashArray: "8 6" }).addTo(map);
      }
    }

    // Station markers
    Object.values(stations).forEach(s => {
      const primary = s.lines[0];
      const color = LINE_COLORS[primary as KolLine] ?? "#888";
      const r = s.isInterchange ? 9 : s.hasRailTransfer ? 8 : 6;
      const marker = (window as any).L.circleMarker(s.coordinates as [number,number], {
        radius: r, color: "#fff", weight: s.isInterchange ? 3 : 2,
        fillColor: color, fillOpacity: 0.95,
      }).addTo(map);
      const label = s.isInterchange ? `${s.name} ⇄` : s.hasRailTransfer ? `${s.name} 🚆` : s.isUnderground ? `${s.name} (UG)` : s.name;
      marker.bindTooltip(label, { direction: "top", offset: [0, -8] });
      marker.on("click", () => onStationClick(s.id));
      markersRef.current[s.id] = marker;
    });
  }, []);

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const s = stations[id];
      if (!s) return;
      const primary = s.lines[0];
      const color = LINE_COLORS[primary as KolLine] ?? "#888";
      if (highlightIds.includes(id))
        marker.setStyle({ fillColor: "#FBBF24", radius: 10, weight: 3 });
      else
        marker.setStyle({ fillColor: color, radius: s.isInterchange ? 9 : s.hasRailTransfer ? 8 : 6, weight: s.isInterchange ? 3 : 2 });
    });
  }, [highlightIds]);

  return <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />;
}

// ── Station Select ─────────────────────────────────────────────────────────────
function StationSelect({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  const opts = getStationOptions();
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="bg-muted border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Select station…</option>
        {opts.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}{s.isInterchange ? " ⇄" : ""}{s.hasRailTransfer ? " 🚆" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Route Card ────────────────────────────────────────────────────────────────
function RouteCard({ route }: { route: PlannedRoute }) {
  return (
    <div className="bg-muted/50 border border-border rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Journey</span>
          <span className="text-sm font-semibold">{route.totalStations} stops · ~{route.totalTime} min</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">Fare</span>
          <span className="text-sm font-semibold">₹{route.fare} <span className="text-xs text-green-600 dark:text-green-400">(₹{route.discountedFare} card)</span></span>
        </div>
      </div>
      {(route as any).gaugeNote && (
        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{"(route as any).note" as any}</p>
      )}
      {route.steps.filter(s => s.type !== "travel").map((s, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          {s.type === "board" && <><div className="w-2 h-2 rounded-full shrink-0" style={{ background: LINE_COLORS[s.line as KolLine] }} /><span className="font-medium">{s.stationName}</span><span className="text-muted-foreground">{s.direction}</span></>}
          {s.type === "interchange" && <><RefreshCw className="w-3 h-3 text-amber-500" /><span>Change at <b>{s.stationName}</b>{s.walkMinutes ? ` (~${s.walkMinutes} min walk)` : ""}</span></>}
          {s.type === "alight" && <><MapPin className="w-3 h-3 text-green-500" /><span className="font-medium">{s.stationName}</span></>}
        </div>
      ))}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
        <span>Depart {route.departureTime}</span>
        <ArrowRight className="w-3 h-3" />
        <span>Arrive {route.arrivalTime}</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function KolkataIndex() {
  const [activePanel, setActivePanel] = useState<"route" | "stations" | "info">("route");
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [route, setRoute] = useState<PlannedRoute | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [activeStationLine, setActiveStationLine] = useState<KolLine>("blue");

  const handleMapClick = useCallback((id: string) => {
    setSelectedStation(id);
    const s = stations[id];
    if (s) setActiveStationLine(s.lines[0] as KolLine);
    if (!origin) setOrigin(id);
    else if (!dest && id !== origin) setDest(id);
  }, [origin, dest]);

  const handlePlan = () => {
    if (!origin || !dest) return;
    const r = planRoute(origin, dest);
    if (r) {
      setRoute(r);
      setRouteError(null);
      const ids = r.steps.filter(s => s.stationId).map(s => s.stationId!);
      setHighlightIds(ids);
    } else {
      setRoute(null);
      setRouteError("No direct or single-interchange route found between these stations.");
    }
  };

  const selectedSt = selectedStation ? stations[selectedStation] : null;
  const crowd = selectedSt ? getCrowdEstimate(selectedSt.id) : null;
  const stLine = selectedSt?.lines[0] as KolLine | undefined;
  const nextTrains = selectedSt && stLine
    ? [...getNextTrainsAtStation(selectedSt.id, stLine, "forward", 2),
       ...getNextTrainsAtStation(selectedSt.id, stLine, "backward", 2)] : [];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card shrink-0">
        <Train className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="text-sm font-semibold">Kolkata Metro</span>
        <div className="ml-auto flex gap-1 flex-wrap">
          {(["blue","green","orange","purple"] as KolLine[]).map(l => (
            <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: LINE_COLORS[l] }}>
              {LINE_NAMES[l].split(" ")[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="h-[42vh] shrink-0 px-3 pt-2">
        <KolkataMap onStationClick={handleMapClick} highlightIds={highlightIds} />
      </div>

      {/* Panel tabs */}
      <div className="flex border-b border-border shrink-0">
        {(["route","stations","info"] as const).map(tab => (
          <button key={tab} onClick={() => setActivePanel(tab)}
            className={cn("flex-1 py-2 text-xs font-medium capitalize transition-colors",
              activePanel === tab ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" : "text-muted-foreground hover:text-foreground")}>
            {tab}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {activePanel === "route" && (
          <>
            <StationSelect label="From" value={origin} onChange={setOrigin} />
            <StationSelect label="To" value={dest} onChange={setDest} />
            <button onClick={handlePlan} disabled={!origin || !dest}
              className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white disabled:opacity-40 transition-opacity"
              style={{ background: "linear-gradient(90deg, #2196F3, #00BCD4)" }}>
              <Train className="w-4 h-4" /> Plan Journey
            </button>
            {route && <RouteCard route={route} />}
            {routeError && <p className="text-xs text-red-500 text-center">{routeError}</p>}
            <p className="text-xs text-center text-muted-foreground">10% off with Smart Card (Kolkata)</p>
          </>
        )}

        {activePanel === "stations" && (
          <>
            {/* Line tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {(["blue","green","orange","purple"] as KolLine[]).map(l => (
                <button key={l} onClick={() => setActiveStationLine(l)}
                  className={cn("shrink-0 text-[10px] px-2 py-1 rounded-full font-medium border transition-colors",
                    activeStationLine === l ? "text-white border-transparent" : "border-border text-muted-foreground")}
                  style={activeStationLine === l ? { background: LINE_COLORS[l] } : {}}>
                  {LINE_NAMES[l]}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {LINE_NAMES[activeStationLine]}
            </p>
            {LINE_STATIONS[activeStationLine].map(id => {
              const s = stations[id];
              if (!s) return null;
              return (
                <button key={id} onClick={() => { setSelectedStation(id); setActiveStationLine(s.lines[0] as KolLine); }}
                  className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-colors",
                    selectedStation === id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-border bg-card hover:bg-muted/50")}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: LINE_COLORS[activeStationLine] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <div className="flex gap-1 flex-wrap mt-0.5">
                      {s.isInterchange && <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 rounded-full">⇄ Interchange</span>}
                      {s.hasRailTransfer && <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 rounded-full">🚆 Rail</span>}
                      {s.isUnderground && <span className="text-[10px] bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 px-1.5 rounded-full">Underground</span>}
                      {(s as any).isAtGrade && <span className="text-[10px] bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 px-1.5 rounded-full">At-grade</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </>
        )}

        {activePanel === "info" && (
          <div className="flex flex-col gap-3">
            <div className="bg-muted/50 border border-border rounded-xl p-3">
              <p className="text-sm font-semibold mb-2">Line Summary</p>
              {(["blue","green","orange","purple","blue","green","orange","purple","blue","green","orange","purple","blue","green","orange","purple","blue","green","orange","purple"] as KolLine[]).map(l => (
                <div key={l} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: LINE_COLORS[l] }} />
                  <div className="flex-1">
                    <p className="text-xs font-medium">{LINE_NAMES[l]}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {LINE_STATIONS[l].length} stations · Operational
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-muted/50 border border-border rounded-xl p-3 flex flex-col gap-1.5">
              <p className="text-sm font-semibold">Key Interchanges</p>
              {[
                { name: "Esplanade", lines: ["blue","green"], note: "Blue L1 ↔ Green L2 (walkway)" },
                { name: "Kavi Subhash / Hemanta", lines: ["blue","orange"], note: "Blue L1 ↔ Orange L6 (~5 min walk)" },
                
              ].map((ix, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <div className="flex gap-0.5">
                    {ix.lines.map(l => <div key={l} className="w-2 h-2 rounded-full" style={{ background: LINE_COLORS[l as KolLine] }} />)}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{ix.name}</p>
                    <p className="text-[10px] text-muted-foreground">{ix.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ Smart Card Note</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">Blue Line (L1) uses Indian Railways broad gauge fare — separate ticket. Green/Orange/Purple use KMRC NCMC card. ⚠️ Different gauge systems: carry right card per line.</p>
            </div>
          </div>
        )}

        {/* Station detail panel (shown when station selected) */}
        {selectedSt && (
          <div className="border border-border rounded-xl bg-card p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: stLine ? LINE_COLORS[stLine] : "#888" }} />
              <p className="text-sm font-semibold">{selectedSt.name}</p>
              {selectedSt.isInterchange && <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 rounded-full ml-auto">⇄ Interchange</span>}
            </div>
            {crowd && (
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs">{crowd.label}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${crowd.percentage}%` }} />
                </div>
              </div>
            )}
            {nextTrains.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Next Trains</p>
                {nextTrains.slice(0, 3).map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium">{t.arrivalTime}</span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", t.minutesAway <= 2 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground")}>
                      {t.minutesAway <= 1 ? "Arriving" : `${t.minutesAway} min`}
                    </span>
                    <span className="text-muted-foreground">{t.schedule.direction === "forward" ? "→" : "←"} {t.schedule.direction === "forward" ? LINE_NAMES[stLine!]?.split(" ").pop() : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
