/**
 * CityApp — universal full-screen metro app UI.
 * Every city page is a thin wrapper that passes its data into this component.
 *
 * Features (matches Lucknow):
 *  - Full-screen map with live animated trains
 *  - Floating search bar (top-right) — stations + landmarks
 *  - "X trains running" pill (top-left)
 *  - Nearest-station prompt after GPS fix
 *  - Dock: Menu | Plan Route | Stations | Co-Commute | Live
 *  - Drawer: Route planner (with Start Journey), Station list + next trains, Co-Commute, Live board
 *  - Side menu with Tips (Fares / Hours / Cards), About, Smart-card toggle, Balance
 *  - Tips dialog — per-city fares, headways, smart card info
 *  - Journey Mode overlay
 */
import { useState, useCallback, lazy, Suspense, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Navigation, X, Route, ListTree, Users, Menu, Train,
  Search, MapPin, Landmark, Clock, IndianRupee, CreditCard, Baby,
  ShieldCheck, Info, ArrowUpDown, Share2,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SideMenu from "@/components/SideMenu";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import OfflineIndicator from "@/components/OfflineIndicator";
import JourneyMode from "@/components/JourneyMode";
import ThemeToggle from "@/components/ThemeToggle";
import { QrShareSheet } from "@/components/QrShareSheet";
import { StationDetailSheet } from "@/components/StationDetailSheet";
import { MultiTripCalculator } from "@/components/MultiTripCalculator";
import { haptics } from "@/lib/haptics";
import { cn, getISTDate } from "@/lib/utils";
import type { GenericSchedule } from "@/lib/trainSimulation";
import { getActiveTrains, getCurrentISTMinutes } from "@/lib/trainSimulation";
import type { GenericStation } from "@/components/GenericCityMap";

const GenericCityMap = lazy(() => import("@/components/GenericCityMap"));

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FareSlab {
  minStations: number;
  maxStations: number;
  fare: number;
}

export interface CityTipsConfig {
  fareSlabs: FareSlab[];
  smartCardName: string;
  smartCardDiscount: number;       // 0.10 = 10%
  smartCardDeposit?: number;
  touristCard1Day?: number;
  touristCard3Day?: number;
  touristCardDeposit?: number;
  childFreeHeightCm?: number;
  firstTrain: string;              // e.g. "06:00"
  lastTrain: string;
  peakHeadwayMinutes: number;
  offPeakHeadwayMinutes: number;
  officialSiteUrl?: string;
}

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
  getNextTrains: (stationId: string, line: string, dir: "forward" | "backward", count: number) => NextTrain[];
  getCrowd?: (stationId: string) => { level: string; emoji: string } | null;
  tipsConfig?: CityTipsConfig;
  /** @deprecated pass tipsConfig instead */
  smartCardName?: string;
  /** @deprecated pass tipsConfig instead */
  smartCardDiscount?: number;
  localPlaces?: LocalPlace[];
  useJourneyTracker: () => JourneyTrackerHook;
}

export interface LocalPlace {
  id: string;
  name: string;
  nearestStationId: string;
  distanceKm: number;
  category: string;
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

interface NearestStationInfo {
  stationId: string;
  distanceKm: number;
  walkingMinutes: number;
}

type PanelTab = "route" | "stations" | "cocommute" | "live" | "multifares" | null;

// ── CityApp ───────────────────────────────────────────────────────────────────

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
  tipsConfig,
  smartCardName,
  smartCardDiscount,
  localPlaces = [],
  useJourneyTracker,
}: CityAppProps) {
  const navigate = useNavigate();
  const { journey, startJourney, endJourney, requestNotificationPermission } = useJourneyTracker();
  const { hasGoSmartCard, balance, getDiscountedFare } = useGoSmartCard();

  const [activeTab, setActiveTab] = useState<PanelTab>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [activeTrainCount, setActiveTrainCount] = useState(0);

  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  // Feature 4: QR share sheet
  const [qrOpen, setQrOpen] = useState(false);
  // Feature 22/23: station detail sheet
  const [detailStationId, setDetailStationId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  // Feature 5: card pill dismissed
  const [cardPillDismissed, setCardPillDismissed] = useState(false);
  // Feature 18: recents in autocomplete
  const recentStationsKey = `indmetro:${citySlug}:recentStations`;
  const getRecentStations = () => {
    try { return JSON.parse(localStorage.getItem(recentStationsKey) ?? "[]") as string[]; }
    catch { return []; }
  };
  const saveRecentStation = (id: string) => {
    try {
      const prev = getRecentStations().filter((s) => s !== id);
      localStorage.setItem(recentStationsKey, JSON.stringify([id, ...prev].slice(0, 5)));
    } catch { /* ignore */ }
  };
  const [route, setRoute] = useState<CityRoute | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[] | null>(null);

  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [stationSearch, setStationSearch] = useState("");

  // Floating search bar
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Nearest station
  const [nearestStation, setNearestStation] = useState<NearestStationInfo | null>(null);
  const [showNearestPrompt, setShowNearestPrompt] = useState(false);

  // ── derived ────────────────────────────────────────────────────────────────

  const stationOptions = useMemo(
    () =>
      Object.values(stations)
        .filter((s) => operationalStations.has(s.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [stations, operationalStations]
  );

  const filteredStations = stationSearch
    ? stationOptions.filter((s) => s.name.toLowerCase().includes(stationSearch.toLowerCase()))
    : stationOptions;

  // Inline floating search results (stations + local places)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const stResults = stationOptions
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((s) => ({ type: "station" as const, id: s.id, label: s.name }));
    const placeResults = localPlaces
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({ type: "landmark" as const, id: p.nearestStationId, label: p.name, sublabel: `Nearest station: ${stations[p.nearestStationId]?.name ?? ""}`, category: p.category }));
    return [...stResults, ...placeResults].slice(0, 7);
  }, [searchQuery, stationOptions, localPlaces, stations]);

  const selectedStationNextTrains = useMemo(() => {
    if (!selectedStationId || !operationalStations.has(selectedStationId)) return [];
    return Object.keys(lineStations)
      .filter((line) => lineStations[line].includes(selectedStationId))
      .flatMap((line) => [
        ...getNextTrains(selectedStationId, line, "forward", 2),
        ...getNextTrains(selectedStationId, line, "backward", 2),
      ])
      .sort((a, b) => a.minutesAway - b.minutesAway)
      .slice(0, 6);
  }, [selectedStationId, operationalStations, lineStations, getNextTrains]);

  const isOperatingNow = useMemo(() => {
    const h = getISTDate().getHours();
    return h >= 6 && h < 22;
  }, []);

  // ── route helpers ──────────────────────────────────────────────────────────

  const buildHighlight = useCallback((r: CityRoute) => {
    const ids: string[] = [];
    r.steps.forEach((s) => { if (s.stationId) ids.push(s.stationId); });
    if (ids.length > 1) setHighlightIds(ids);
    else setHighlightIds(null);
  }, []);

  const tryRoute = useCallback((o: string, d: string) => {
    if (!o || !d || o === d) { setRoute(null); setHighlightIds(null); return; }
    const r = planRoute(o, d);
    if (r) { setRoute(r); setRouteError(null); buildHighlight(r); }
    else { setRoute(null); setRouteError("No route found."); setHighlightIds(null); }
  }, [planRoute, buildHighlight]);

  const handleOriginChange = useCallback((id: string) => {
    setOrigin(id);
    tryRoute(id, dest);
  }, [dest, tryRoute]);

  const handleDestChange = useCallback((id: string) => {
    setDest(id);
    tryRoute(origin, id);
  }, [origin, tryRoute]);

  // Feature 39: open station detail sheet
  const handleStationDetail = useCallback((id: string) => {
    setDetailStationId(id);
    setDetailOpen(true);
  }, []);

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

  const handleNearestStationFound = useCallback(
    (stationId: string, distanceKm: number, walkingMinutes: number) => {
      setNearestStation({ stationId, distanceKm, walkingMinutes });
      setShowNearestPrompt(true);
    },
    []
  );

  const useNearestAsOrigin = useCallback(() => {
    if (!nearestStation) return;
    setOrigin(nearestStation.stationId);
    setShowNearestPrompt(false);
    setActiveTab("route");
  }, [nearestStation]);

  const handleSearchSelect = useCallback((stationId: string) => {
    setDest(stationId);
    tryRoute(origin, stationId);
    setSearchQuery("");
    setSearchOpen(false);
    setActiveTab("route");
  }, [origin, tryRoute]);

  // ── Co-Commute ─────────────────────────────────────────────────────────────
  const [friendA, setFriendA] = useState("");
  const [friendB, setFriendB] = useState("");

  const coCommutePlan = useMemo(() => {
    if (!friendA || !friendB || friendA === friendB) return null;
    // Find meeting station by minimizing travel time difference across all lines
    let best: {
      stationId: string;
      labelA: string; labelB: string;
      diffMin: number;
    } | null = null;

    const allLineArrays = Object.values(lineStations);

    for (const lineArr of allLineArrays) {
      const idxA = lineArr.indexOf(friendA);
      const idxB = lineArr.indexOf(friendB);
      if (idxA === -1 || idxB === -1) continue;
      const lo = Math.min(idxA, idxB);
      const hi = Math.max(idxA, idxB);
      for (let i = lo; i <= hi; i++) {
        const mid = lineArr[i];
        const stopsA = Math.abs(idxA - i);
        const stopsB = Math.abs(idxB - i);
        const diff = Math.abs(stopsA - stopsB);
        if (!best || diff < best.diffMin) {
          best = {
            stationId: mid,
            labelA: stopsA === 0 ? "Already here" : `${stopsA} stop${stopsA !== 1 ? "s" : ""} away`,
            labelB: stopsB === 0 ? "Already here" : `${stopsB} stop${stopsB !== 1 ? "s" : ""} away`,
            diffMin: diff,
          };
        }
      }
    }
    return best;
  }, [friendA, friendB, lineStations]);

  // ── resolved tips config ───────────────────────────────────────────────────
  const resolvedTips: CityTipsConfig | null = tipsConfig ?? (
    smartCardName
      ? {
          fareSlabs: [],
          smartCardName,
          smartCardDiscount: smartCardDiscount ?? 0.10,
          firstTrain: "06:00",
          lastTrain: "22:00",
          peakHeadwayMinutes: 8,
          offPeakHeadwayMinutes: 12,
        }
      : null
  );

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {/* Journey Mode full-screen overlay */}
      {(journey.active || journey.arrived) && (
        <JourneyMode journey={journey as any} onEnd={endJourney} />
      )}

      <OfflineIndicator />
      {/* Feature 5: Floating smart card balance pill */}
      {hasGoSmartCard && !cardPillDismissed && activeTab === null && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[850] flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
          <span className="text-base">💳</span>
          <span className="text-sm font-semibold">₹{balance.toFixed(0)}</span>
          <span className="text-xs text-muted-foreground">GoSmart</span>
          <button onClick={() => setCardPillDismissed(true)} className="ml-1 p-1 rounded-full hover:bg-muted" aria-label="Dismiss">
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      )}

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
          onStationDetail={handleStationDetail}
          getCrowd={getCrowd}
          onActiveTrainCount={setActiveTrainCount}
          onNearestStationFound={handleNearestStationFound}
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

      {/* Top-right: back + city pill + theme toggle */}
      <div className="absolute top-3 right-3 z-[1200] flex items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className="h-9 w-9 rounded-xl bg-card/95 backdrop-blur border border-border shadow flex items-center justify-center text-muted-foreground"
          aria-label="All cities"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 bg-card/95 backdrop-blur border border-border rounded-xl px-3 h-9 shadow">
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

      {/* Floating search bar — below top pills */}
      <div className="absolute top-16 right-3 left-3 sm:left-auto sm:w-80 z-[1200]">
        <div className="relative">
          <div className="flex items-center gap-2 bg-card/95 backdrop-blur border border-border rounded-xl px-3 h-10 shadow">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder={`Search ${cityName} stations…`}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              {searchResults.map((r, i) => {
                const catEmoji: Record<string, string> = {
                  heritage: "🏛️", shopping: "🛍️", park: "🌳", education: "🎓",
                  hospital: "🏥", transport: "🚉", civic: "🏛️", religious: "🕌",
                  entertainment: "🎭", sports: "🏟️",
                };
                const emoji = r.type === "station" ? null : catEmoji[("category" in r ? r.category : "") ?? ""] ?? "📍";
                return (
                  <button
                    key={i}
                    onClick={() => handleSearchSelect(r.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted transition-colors text-left border-b border-border last:border-0"
                  >
                    {r.type === "station"
                      ? <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      : <span className="text-base shrink-0">{emoji}</span>
                    }
                    <div className="min-w-0">
                      <p className="text-sm truncate">{r.label}</p>
                      {"sublabel" in r && r.sublabel && (
                        <p className="text-xs text-muted-foreground truncate">{r.sublabel}</p>
                      )}
                    </div>
                    {r.type === "landmark" && (
                      <span className="ml-auto text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full shrink-0">landmark</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Nearest station prompt */}
      {showNearestPrompt && nearestStation && (
        <div className="absolute top-[108px] right-3 left-3 sm:left-auto sm:w-80 z-[1200] bg-card border border-border rounded-xl shadow-lg p-3.5 animate-fade-up">
          <button
            onClick={() => setShowNearestPrompt(false)}
            className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-2.5 pr-5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Navigation className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">
                Nearest: {stations[nearestStation.stationId]?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ~{nearestStation.distanceKm.toFixed(1)} km · {nearestStation.walkingMinutes} min walk
              </p>
              <button
                onClick={useNearestAsOrigin}
                className="mt-2 text-xs font-medium text-primary hover:underline"
              >
                Start my journey from here →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom dock */}
      <div className="fixed bottom-0 inset-x-0 z-[1200] bg-card/95 backdrop-blur border-t border-border safe-bottom">
        <div className="grid grid-cols-6 gap-1 px-2 py-2 max-w-xl mx-auto">
          <DockBtn icon={<Menu className="h-5 w-5" />} label="Menu" onClick={() => setMenuOpen(true)} />
          <DockBtn icon={<Route className="h-5 w-5" />} label="Plan Route" active={activeTab === "route"} onClick={() => setActiveTab(activeTab === "route" ? null : "route")} />
          <DockBtn icon={<ListTree className="h-5 w-5" />} label="Stations" active={activeTab === "stations"} onClick={() => setActiveTab(activeTab === "stations" ? null : "stations")} />
          <DockBtn icon={<Users className="h-5 w-5" />} label="Co-Commute" active={activeTab === "cocommute"} onClick={() => setActiveTab(activeTab === "cocommute" ? null : "cocommute")} />
          <DockBtn icon={<Train className="h-5 w-5" />} label="Live" active={activeTab === "live"} onClick={() => setActiveTab(activeTab === "live" ? null : "live")} />
          <DockBtn icon={<IndianRupee className="h-5 w-5" />} label="Multi-fare" active={activeTab === "multifares"} onClick={() => setActiveTab(activeTab === "multifares" ? null : "multifares")} />
        </div>
      </div>

      {/* Main drawer */}
      <Drawer open={activeTab !== null} onOpenChange={(open) => !open && setActiveTab(null)}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>
              {activeTab === "route" && "Plan your journey"}
              {activeTab === "stations" && `${cityName} Metro stations`}
              {activeTab === "cocommute" && "Co-Commute"}
              {activeTab === "live" && "Live Trains"}
              {activeTab === "multifares" && "Multi-leg Fare Calculator"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-8">

            {/* ── Route planner ──────────────────────────────────────────── */}
            {activeTab === "route" && (
              <div className="space-y-3">
                <StationSelect label="From" value={origin} onChange={handleOriginChange} stations={stationOptions} />
                <StationSelect label="To" value={dest} onChange={handleDestChange} stations={stationOptions} />

                {routeError && <p className="text-xs text-center text-destructive">{routeError}</p>}
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

                    {/* Step-by-step breakdown */}
                    {route.steps.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-border">
                        {route.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            {step.type === "board" && (
                              <>
                                <span
                                  className="h-2 w-2 rounded-full mt-0.5 shrink-0"
                                  style={{ background: step.line ? lineColors[step.line] : primaryColor }}
                                />
                                <span>
                                  Board <strong>{step.line ? lineNames[step.line] : ""}</strong> at {step.stationName}
                                  {step.line && stations[step.stationId ?? ""]?.platformInfo?.[step.line] && (
                                    <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                      Plt {stations[step.stationId ?? ""]?.platformInfo?.[step.line]?.number}
                                    </span>
                                  )}
                                  {" → "}{step.direction}
                                </span>
                              </>
                            )}
                            {step.type === "travel" && (
                              <>
                                <span className="h-2 w-2 rounded-full mt-0.5 shrink-0 bg-muted-foreground" />
                                <span>Travel {step.numStops} stop{step.numStops !== 1 ? "s" : ""} (~{step.durationMinutes} min)</span>
                              </>
                            )}
                            {step.type === "interchange" && (
                              <>
                                <span className="h-2 w-2 rounded-full mt-0.5 shrink-0 bg-yellow-400" />
                                <span>Interchange at {step.stationName}{step.transferNote ? ` — ${step.transferNote}` : ""}</span>
                              </>
                            )}
                            {step.type === "alight" && (
                              <>
                                <span className="h-2 w-2 rounded-full mt-0.5 shrink-0 bg-green-500" />
                                <span>Alight at {step.stationName}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {route.isDirect && (
                      <button
                        onClick={handleStartJourney}
                        className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Train className="w-4 h-4" /> Start Journey
                      </button>
                    )}
                    {/* Feature 4: Share trip */}
                    <button
                      onClick={() => setQrOpen(true)}
                      className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground py-2 border border-border rounded-xl transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      Share trip
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Stations list ──────────────────────────────────────────── */}
            {activeTab === "stations" && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={stationSearch}
                  onChange={(e) => setStationSearch(e.target.value)}
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
                      const destName =
                        t.schedule.direction === "forward"
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

                    {/* Quick-action: use selected station as route origin */}
                    <button
                      onClick={() => {
                        setOrigin(selectedStationId);
                        setActiveTab("route");
                      }}
                      className="mt-2 text-xs font-medium text-primary hover:underline w-full text-left"
                    >
                      Plan a route from here →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Co-Commute ─────────────────────────────────────────────── */}
            {activeTab === "cocommute" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Find the best station for two friends to meet halfway.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Friend A starts from</label>
                    <select
                      value={friendA}
                      onChange={(e) => setFriendA(e.target.value)}
                      className="bg-muted border border-border rounded-xl px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select…</option>
                      {stationOptions.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Friend B starts from</label>
                    <select
                      value={friendB}
                      onChange={(e) => setFriendB(e.target.value)}
                      className="bg-muted border border-border rounded-xl px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select…</option>
                      {stationOptions.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {friendA && friendB && friendA === friendB && (
                  <p className="text-sm text-muted-foreground">Pick two different starting stations.</p>
                )}

                {coCommutePlan && (
                  <div className="rounded-xl border border-border bg-card p-4 space-y-4 animate-fade-up">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Best meeting point</p>
                        <p className="text-lg font-semibold">{stations[coCommutePlan.stationId]?.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Friend A", origin: friendA, info: coCommutePlan.labelA },
                        { label: "Friend B", origin: friendB, info: coCommutePlan.labelB },
                      ].map(({ label, origin: o, info }) => (
                        <div key={label} className="rounded-lg bg-secondary/40 p-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
                          <p className="text-sm font-medium">{stations[o]?.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{info}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
                      <Clock className="h-3.5 w-3.5" />
                      Difference: ~{coCommutePlan.diffMin} stop{coCommutePlan.diffMin !== 1 ? "s" : ""} — both arrive close together.
                    </div>
                  </div>
                )}

                {friendA && friendB && friendA !== friendB && !coCommutePlan && (
                  <p className="text-sm text-muted-foreground">
                    No shared line found for these stations. Try stations on the same metro line.
                  </p>
                )}
              </div>
            )}

            {/* ── Multi-leg fare calculator ───────────────────────── */}
            {activeTab === "multifares" && (
              <MultiTripCalculator
                stations={stationOptions}
                calculateFare={(from, to) => planRoute(from, to)?.fare ?? 0}
                hasGoSmartCard={hasGoSmartCard}
              />
            )}

            {/* ── Live trains board ──────────────────────────────────────── */}
            {activeTab === "live" && (
              <LiveBoard
                schedules={schedules}
                stations={stations}
                lineColors={lineColors}
                lineNames={lineNames}
                lineTerminals={lineTerminals}
                isOperatingNow={isOperatingNow}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Side menu — wired to Tips */}
      <SideMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        onOpenTips={() => { setMenuOpen(false); setTipsOpen(true); }}
      />

      {/* Tips dialog */}
      {resolvedTips && (
        <CityTipsDialog
          open={tipsOpen}
          onOpenChange={setTipsOpen}
          cityName={cityName}
          tips={resolvedTips}
        />
      )}

      {/* Feature 4: QR Share Sheet */}
      {route && (
        <QrShareSheet
          open={qrOpen}
          onClose={() => setQrOpen(false)}
          citySlug={citySlug}
          fromId={route.origin.id}
          toId={route.destination.id}
          fromName={route.origin.name}
          toName={route.destination.name}
          fare={route.discountedFare ?? route.fare}
          durationMinutes={route.totalTime}
        />
      )}

      {/* Feature 22/23: Station Detail Sheet */}
      <StationDetailSheet
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        stationId={detailStationId}
        stationName={detailStationId ? (stations[detailStationId]?.name ?? "") : ""}
        lines={detailStationId ? (stations[detailStationId]?.lines ?? []) : []}
        lineColors={lineColors}
        lineNames={lineNames}
        isInterchange={detailStationId ? stations[detailStationId]?.isInterchange : false}
        isUnderground={detailStationId ? stations[detailStationId]?.isUnderground : false}
        nextTrains={detailStationId && getNextTrains ? getNextTrains(detailStationId, "", "forward", 6) as any ?? [] : []}
        crowdInfo={detailStationId && getCrowd ? getCrowd(detailStationId) : null}
        gates={detailStationId ? stations[detailStationId]?.gates : undefined}
        parkingAvailable={detailStationId ? stations[detailStationId]?.parkingAvailable : undefined}
        onPlanFrom={(id) => { setOrigin(id); setActiveTab("route"); }}
        onPlanTo={(id) => { setDest(id); setActiveTab("route"); }}
      />
    </div>
  );
}

// ── CityTipsDialog ─────────────────────────────────────────────────────────────

function CityTipsDialog({
  open, onOpenChange, cityName, tips,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cityName: string;
  tips: CityTipsConfig;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Fares, hours &amp; tips</DialogTitle>
          <DialogDescription>{cityName} Metro — fares, timings and smart card info.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="fares">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="fares">Fares</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="fares" className="space-y-2">
            {tips.fareSlabs.length > 0 ? (
              <>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5" /> Single journey token fares
                </p>
                <div className="rounded-lg border border-border overflow-hidden">
                  {tips.fareSlabs.map((slab, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 text-sm border-b border-border last:border-0 odd:bg-secondary/30"
                    >
                      <span>
                        {slab.minStations === slab.maxStations
                          ? `${slab.minStations} station`
                          : slab.maxStations === Infinity
                          ? `${slab.minStations}+ stations`
                          : `${slab.minStations}–${slab.maxStations} stations`}
                      </span>
                      <span className="font-medium">₹{slab.fare}</span>
                    </div>
                  ))}
                </div>
                {tips.childFreeHeightCm && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2 mt-2">
                    <Baby className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    Children under {tips.childFreeHeightCm}cm travel free.
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Fare details coming soon for {cityName} Metro.
              </p>
            )}
          </TabsContent>

          <TabsContent value="hours" className="space-y-3">
            <div className="flex items-center gap-2.5 rounded-lg bg-secondary/40 px-3 py-2.5">
              <Clock className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <p className="font-medium">{tips.firstTrain} – {tips.lastTrain}</p>
                <p className="text-xs text-muted-foreground">Daily operating hours</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary/40 px-3 py-2.5">
                <p className="text-xs text-muted-foreground">Peak headway</p>
                <p className="text-lg font-semibold">{tips.peakHeadwayMinutes} min</p>
                <p className="text-[10px] text-muted-foreground">8–11 AM, 5–8 PM weekdays</p>
              </div>
              <div className="rounded-lg bg-secondary/40 px-3 py-2.5">
                <p className="text-xs text-muted-foreground">Off-peak headway</p>
                <p className="text-lg font-semibold">{tips.offPeakHeadwayMinutes} min</p>
              </div>
            </div>
            {tips.officialSiteUrl && (
              <p className="text-xs text-muted-foreground">
                Source:{" "}
                <a href={tips.officialSiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  official operator website
                </a>
              </p>
            )}
          </TabsContent>

          <TabsContent value="cards" className="space-y-3">
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <CreditCard className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">{tips.smartCardName}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(tips.smartCardDiscount * 100)}% discount on every journey.
                {tips.smartCardDeposit ? ` Refundable deposit of ₹${tips.smartCardDeposit}.` : ""}
              </p>
            </div>

            {(tips.touristCard1Day || tips.touristCard3Day) && (
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <CreditCard className="h-4 w-4 text-accent" />
                  <p className="text-sm font-medium">Tourist Card</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unlimited travel:{" "}
                  {tips.touristCard1Day ? `₹${tips.touristCard1Day} for 1 day` : ""}
                  {tips.touristCard1Day && tips.touristCard3Day ? ", " : ""}
                  {tips.touristCard3Day ? `₹${tips.touristCard3Day} for 3 days` : ""}
                  {tips.touristCardDeposit ? ` (plus ₹${tips.touristCardDeposit} refundable deposit).` : "."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-start gap-2 text-xs text-muted-foreground pt-1">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          Independent app. Not affiliated with any metro authority. Fares sourced from official operator websites.
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── LiveBoard ──────────────────────────────────────────────────────────────────

function LiveBoard({
  schedules, stations, lineColors, lineNames, lineTerminals, isOperatingNow,
}: {
  schedules: GenericSchedule[];
  stations: Record<string, GenericStation>;
  lineColors: Record<string, string>;
  lineNames: Record<string, string>;
  lineTerminals: Record<string, { start: string; end: string }>;
  isOperatingNow: boolean;
}) {
  const [now, setNow] = useState(() => getCurrentISTMinutes());

  useEffect(() => {
    const t = setInterval(() => setNow(getCurrentISTMinutes()), 5000);
    return () => clearInterval(t);
  }, []);

  const active = getActiveTrains(schedules, stations, now);

  if (!isOperatingNow) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Train className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">Service not running</p>
        <p className="text-xs mt-1">Metro operates 06:00 – 22:00</p>
      </div>
    );
  }

  if (active.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Train className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No trains detected</p>
        <p className="text-xs mt-1">Updates every 5 seconds</p>
      </div>
    );
  }

  const byLine: Record<string, typeof active> = {};
  active.forEach((t) => {
    const line = t.schedule.line;
    if (!byLine[line]) byLine[line] = [];
    byLine[line].push(t);
  });

  return (
    <div className="space-y-4 pb-2">
      <p className="text-xs text-muted-foreground text-center">
        {active.length} train{active.length !== 1 ? "s" : ""} running · updates every 5s
      </p>

      {Object.entries(byLine).map(([line, trains]) => {
        const color = lineColors[line] ?? "#888";
        const name = lineNames[line] ?? line;
        const terminal = lineTerminals[line];

        return (
          <div key={line}>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
              <p className="text-xs font-semibold uppercase tracking-wider">{name}</p>
              <span className="text-xs text-muted-foreground ml-auto">{trains.length} trains</span>
            </div>

            <div className="space-y-2">
              {trains.map(({ schedule, position }) => {
                const isAtStation = position.status === "at_station";
                const locationLabel = isAtStation
                  ? `At ${stations[position.stationId!]?.name ?? "—"}`
                  : `${stations[position.fromStationId!]?.name ?? "—"} → ${stations[position.toStationId!]?.name ?? "—"}`;

                const dir = schedule.direction === "forward" ? "→" : "←";
                const terminalName = schedule.direction === "forward"
                  ? stations[terminal?.end]?.name
                  : stations[terminal?.start]?.name;

                const progress = position.progress ?? (isAtStation ? 1 : 0);

                return (
                  <div key={schedule.id} className="bg-card border border-border rounded-xl px-3 py-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                          style={{ background: color }}
                        >
                          {schedule.id.split("-")[2] ?? "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {dir} {terminalName ?? "Terminal"}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        isAtStation
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      )}>
                        {isAtStation ? "At station" : "In transit"}
                      </span>
                    </div>

                    <p className="text-sm font-medium truncate">{locationLabel}</p>

                    {!isAtStation && (
                      <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.round(progress * 100)}%`, background: color }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
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
