/**
 * CityApp — universal full-screen metro app UI.
 * Every city page is a thin wrapper that passes its data into this component.
 *
 * Layout (matches Lucknow):
 *  - Full-screen map with live animated trains
 *  - Search bar floating top-right
 *  - "X trains running" pill top-left
 *  - Drawer bottom panel: Menu | Plan Route | Stations | Co-Commute | Live
 */
import { useState, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Navigation, X, Route, ListTree, Users, Menu, Train } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import SideMenu from "@/components/SideMenu";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import OfflineIndicator from "@/components/OfflineIndicator";
import JourneyMode from "@/components/JourneyMode";
import ThemeToggle from "@/components/ThemeToggle";
import { cn, getISTDate } from "@/lib/utils";
import type { GenericSchedule } from "@/lib/trainSimulation";
import type { GenericStation } from "@/components/GenericCityMap";

const GenericCityMap = lazy(() => import("@/components/GenericCityMap"));

export interface CityAppProps {
  cityName: string;
  citySlug: string;
  primaryColor: string;
  mapCenter: [number, number];
  mapZoom: number;
  stations: Record<string, GenericStation>;
  lineStations: Record<string, string[]>;
  lineColors: Record<string, string>;
  lineNames: Record<string, string>;
  lineTerminals: Record<string, { start: string; end: string }>;
  operationalStations: Set<string>;
  schedules: GenericSchedule[];
  planRoute: (originId: string, destId: string) => CityRoute | null;
  getNextTrains: (stationId: string, line: string, dir: "forward"|"backward", count: number) => NextTrain[];
  getCrowd?: (stationId: string) => { level: string; emoji: string } | null;
  smartCardName?: string;
  smartCardDiscount?: number;
  useJourneyTracker: () => JourneyTrackerHook;
}

export interface CityRoute {
  origin: GenericStation;
  destination: GenericStation;
  totalStations: number;
  totalTime: number;
  fare: number;
  discountedFare?: number;
  isDirect: boolean;
  departureTime?: string;
  arrivalTime?: string;
  interchangeCount: number;
  steps: RouteStep[];
}

interface RouteStep {
  type: string;
  line?: string;
  stationId?: string;
  stationName?: string;
  direction?: string;
  numStops?: number;
  durationMinutes?: number;
  transferNote?: string;
}

interface NextTrain {
  arrivalTime: string;
  minutesAway: number;
  schedule: { direction: "forward" | "backward"; line: string };
}

interface JourneyTrackerHook {
  journey: { active: boolean; arrived: boolean; [key: string]: unknown };
  startJourney: (o: string, d: string, line: string) => Promise<void>;
  endJourney: () => void;
  requestNotificationPermission: () => Promise<void>;
}

type PanelTab = "route" | "stations" | "live" | null;

export function CityApp({
  cityName,
  citySlug,
  primaryColor,
  mapCenter,
  mapZoom,
  stations,
  lineStations,
  lineColors,
  lineNames,
  lineTerminals,
  operationalStations,
  schedules,
  planRoute,
  getNextTrains,
  getCrowd,
  smartCardName,
  smartCardDiscount,
  useJourneyTracker,
}: CityAppProps) {
  const navigate = useNavigate();
  const { journey, startJourney, endJourney, requestNotificationPermission } = useJourneyTracker();

  const [activeTab, setActiveTab] = useState<PanelTab>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTrainCount, setActiveTrainCount] = useState(0);

  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [route, setRoute] = useState<CityRoute | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[] | null>(null);

  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const handleOriginChange = useCallback((id: string) => {
    setOrigin(id);
    if (id && dest && id !== dest) {
      const r = planRoute(id, dest);
      if (r) { setRoute(r); setRouteError(null); buildHighlight(r); }
      else { setRoute(null); setRouteError("No route found."); setHighlightIds(null); }
    } else { setRoute(null); setHighlightIds(null); }
  }, [dest]);

  const handleDestChange = useCallback((id: string) => {
    setDest(id);
    if (origin && id && origin !== id) {
      const r = planRoute(origin, id);
      if (r) { setRoute(r); setRouteError(null); buildHighlight(r); }
      else { setRoute(null); setRouteError("No route found."); setHighlightIds(null); }
    } else { setRoute(null); setHighlightIds(null); }
  }, [origin]);

  const buildHighlight = (r: CityRoute) => {
    const ids: string[] = [];
    r.steps.forEach((s) => { if (s.stationId) ids.push(s.stationId); });
    if (ids.length > 1) setHighlightIds(ids);
    else setHighlightIds(null);
  };

  const handleStationClick = useCallback((id: string) => {
    setSelectedStationId(id);
    if (!origin) { setOrigin(id); setActiveTab("route"); }
    else if (!dest) { handleDestChange(id); setActiveTab("route"); }
  }, [origin, dest, handleDestChange]);

  const handleStartJourney = useCallback(async () => {
    if (!route) return;
    const line = route.steps.find((s) => s.line)?.line ?? Object.keys(lineStations)[0];
    await requestNotificationPermission();
    await startJourney(route.origin.id, route.destination.id, line);
  }, [route, startJourney, requestNotificationPermission, lineStations]);

  const stationOptions = Object.values(stations)
    .filter((s) => operationalStations.has(s.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredStations = search
    ? stationOptions.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : stationOptions;

  const crowd = selectedStationId && getCrowd ? getCrowd(selectedStationId) : null;
  const selectedStationNextTrains = selectedStationId && operationalStations.has(selectedStationId)
    ? Object.keys(lineStations)
        .filter((line) => lineStations[line].includes(selectedStationId))
        .flatMap((line) => [
          ...getNextTrains(selectedStationId, line, "forward", 2),
          ...getNextTrains(selectedStationId, line, "backward", 2),
        ])
        .sort((a, b) => a.minutesAway - b.minutesAway)
        .slice(0, 6)
    : [];

  const isOperatingNow = (() => {
    const now = getISTDate();
    const h = now.getHours();
    return h >= 6 && h < 22;
  })();

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {(journey.active || journey.arrived) && (
        <JourneyMode journey={journey as any} onEnd={endJourney} />
      )}

      <OfflineIndicator />
      <WelcomeOverlay
        cityName={`${cityName} Metro`}
        storageKey={`indmetro:welcome:${citySlug}`}
      />

      {/* Map */}
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <GenericCityMap
          stations={stations}
          lineStations={lineStations}
          lineColors={lineColors}
          lineNames={lineNames}
          operationalStations={operationalStations}
          schedules={schedules}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          selectedStationId={selectedStationId}
          highlightRouteIds={highlightIds}
          onStationClick={handleStationClick}
          onActiveTrainCount={setActiveTrainCount}
        />
      </Suspense>

      {/* Top-left: trains running pill */}
      <div className="absolute top-3 left-3 z-[1200]">
        <div className="flex items-center gap-2 bg-card/95 backdrop-blur border border-border rounded-full px-3 py-1.5 shadow text-sm">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ background: isOperatingNow && activeTrainCount > 0 ? "#22c55e" : "#6b7280" }}
          />
          <span className="text-xs font-medium">
            {activeTrainCount} train{activeTrainCount !== 1 ? "s" : ""} running
          </span>
        </div>
      </div>

      {/* Top-right: back button + city name + theme toggle */}
      <div className="absolute top-3 right-3 z-[1200] flex items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className="h-9 w-9 rounded-xl bg-card/95 backdrop-blur border border-border shadow flex items-center justify-center text-muted-foreground"
          aria-label="All cities"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div
          className="flex items-center gap-2 bg-card/95 backdrop-blur border border-border rounded-xl px-3 h-9 shadow"
        >
          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: primaryColor }} />
          <span className="text-sm font-semibold">{cityName}</span>
          <div className="flex gap-1 ml-1">
            {Object.entries(lineNames).map(([key, name]) => (
              <span
                key={key}
                className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white"
                style={{ background: lineColors[key] }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Bottom dock + drawer */}
      <div className="fixed bottom-0 inset-x-0 z-[1200] bg-card/95 backdrop-blur border-t border-border safe-bottom">
        <div className="grid grid-cols-5 gap-1 px-2 py-2 max-w-xl mx-auto">
          <DockBtn icon={<Menu className="h-5 w-5" />} label="Menu" onClick={() => setMenuOpen(true)} />
          <DockBtn icon={<Route className="h-5 w-5" />} label="Plan Route" active={activeTab === "route"} onClick={() => setActiveTab(activeTab === "route" ? null : "route")} />
          <DockBtn icon={<ListTree className="h-5 w-5" />} label="Stations" active={activeTab === "stations"} onClick={() => setActiveTab(activeTab === "stations" ? null : "stations")} />
          <DockBtn icon={<Users className="h-5 w-5" />} label="Co-Commute" active={activeTab === "live"} onClick={() => setActiveTab(activeTab === "live" ? null : "live")} />
          <DockBtn icon={<Train className="h-5 w-5" />} label="Live" active={false} onClick={() => setActiveTab(activeTab === "route" ? null : "route")} />
        </div>
      </div>

      {/* Drawer */}
      <Drawer open={activeTab !== null} onOpenChange={(open) => !open && setActiveTab(null)}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>
              {activeTab === "route" && "Plan your journey"}
              {activeTab === "stations" && `${cityName} Metro stations`}
              {activeTab === "live" && "Co-Commute"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-8">
            {/* ── Route planner ─────────────────────────────── */}
            {activeTab === "route" && (
              <div className="space-y-3">
                <StationSelect
                  label="From"
                  value={origin}
                  onChange={handleOriginChange}
                  stations={stationOptions}
                />
                <StationSelect
                  label="To"
                  value={dest}
                  onChange={handleDestChange}
                  stations={stationOptions}
                />

                {routeError && (
                  <p className="text-xs text-center text-destructive">{routeError}</p>
                )}
                {origin && dest && origin === dest && (
                  <p className="text-xs text-center text-muted-foreground">Same station selected.</p>
                )}

                {route && (
                  <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium flex-wrap">
                      <span>{route.origin.name}</span>
                      <span className="text-muted-foreground">→</span>
                      <span>{route.destination.name}</span>
                    </div>

                    {route.interchangeCount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        🔄 {route.interchangeCount} interchange{route.interchangeCount > 1 ? "s" : ""}
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: "Stations", value: String(route.totalStations) },
                        { label: "Time", value: `~${route.totalTime} min` },
                        { label: "Fare", value: `₹${route.discountedFare ?? route.fare}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-muted/50 rounded-xl py-2">
                          <p className="text-base font-bold">{value}</p>
                          <p className="text-[10px] text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>

                    {route.departureTime && (
                      <p className="text-xs text-muted-foreground text-center">
                        Departs ~{route.departureTime} · Arrives ~{route.arrivalTime}
                      </p>
                    )}

                    {route.isDirect && (
                      <button
                        onClick={handleStartJourney}
                        className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Train className="w-4 h-4" /> Start Journey
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Stations list ──────────────────────────────── */}
            {activeTab === "stations" && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stations…"
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary mb-2"
                />
                {filteredStations.map((s) => {
                  const primaryLine = s.lines[0];
                  const isSelected = s.id === selectedStationId;
                  const crowd = isSelected && getCrowd ? getCrowd(s.id) : null;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStationId(s.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors",
                        isSelected ? "bg-primary/10 border border-primary/30" : "bg-muted/40 hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ background: s.isInterchange ? "#F5C518" : lineColors[primaryLine] }}
                        />
                        <div>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.isInterchange ? "Interchange" : lineNames[primaryLine]}
                            {s.isUnderground ? " · Underground" : ""}
                          </p>
                        </div>
                      </div>
                      {crowd && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          {crowd.emoji} {crowd.level}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Next trains for selected station */}
                {selectedStationId && selectedStationNextTrains.length > 0 && (
                  <div className="mt-3 bg-muted/40 rounded-xl p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Next trains at {stations[selectedStationId]?.name}
                    </p>
                    {selectedStationNextTrains.map((t, i) => {
                      const terminal = lineTerminals[t.schedule.line];
                      const destName = t.schedule.direction === "forward"
                        ? stations[terminal?.end]?.name ?? "Terminal"
                        : stations[terminal?.start]?.name ?? "Terminal";
                      return (
                        <div key={i} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: lineColors[t.schedule.line] }}
                            />
                            → {destName}
                          </span>
                          <span className="font-medium tabular-nums">
                            {t.minutesAway < 1 ? "Now" : `${Math.round(t.minutesAway)} min`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Co-commute placeholder ──────────────────────── */}
            {activeTab === "live" && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Co-Commute</p>
                <p className="text-xs mt-1">Find the best station to meet a friend halfway.</p>
                <p className="text-xs mt-1 opacity-60">Coming soon for {cityName}</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <SideMenu open={menuOpen} onOpenChange={setMenuOpen} onOpenTips={() => {}} />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

const DockBtn = ({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 rounded-lg py-1.5 transition-colors",
      active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
    )}
  >
    {icon}
    <span className="text-[10px] font-medium leading-none">{label}</span>
  </button>
);

const StationSelect = ({
  label, value, onChange, stations,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  stations: GenericStation[];
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-muted-foreground font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted border border-border rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">Select station…</option>
      {stations.map((s) => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </select>
  </div>
);

export default CityApp;
