/**
 * GenericCityMap — a city-agnostic Leaflet map for any Indian metro.
 * Draws lines, station markers, highlights a route, and animates live trains.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { trainIconSvg, stationIconSvg, interchangeStationIconSvg } from "@/lib/leafletIcons";
import {
  GenericSchedule,
  getActiveTrains,
  getCurrentISTMinutes,
} from "@/lib/trainSimulation";
import { useGeolocation } from "@/hooks/use-geolocation";
import { findNearestStation } from "@/lib/nearestStation";

export interface GenericStation {
  id: string;
  name: string;
  coordinates: [number, number];
  lines: string[];
  isInterchange?: boolean;
  isWIP?: boolean;
  isUnderground?: boolean;
}

interface GenericCityMapProps {
  stations: Record<string, GenericStation>;
  lineStations: Record<string, string[]>;
  lineColors: Record<string, string>;
  lineNames: Record<string, string>;
  operationalStations: Set<string>;
  schedules: GenericSchedule[];
  mapCenter: [number, number];
  mapZoom: number;
  selectedStationId?: string | null;
  highlightRouteIds?: string[] | null;
  onStationClick?: (stationId: string) => void;
  onActiveTrainCount?: (count: number) => void;
  onNearestStationFound?: (stationId: string, distanceKm: number, walkingMinutes: number) => void;
  /** Feature 11/24: crowd data per station */
  getCrowd?: (stationId: string) => { level: string; emoji: string } | null;
  /** Feature 39: open station detail sheet */
  onStationDetail?: (stationId: string) => void;
}

const buildIcon = (
  station: GenericStation,
  lineColors: Record<string, string>,
  isSelected: boolean,
  isOperational: boolean
) => {
  const color = isSelected
    ? "#F5C518"
    : station.isInterchange
    ? "#F5C518"
    : isOperational
    ? lineColors[station.lines[0]] ?? "#6b7280"
    : "#9CA3AF";

  const size = isSelected ? 20 : station.isInterchange ? 20 : isOperational ? 16 : 12;

  const html = station.isInterchange
    ? interchangeStationIconSvg(color, size)
    : stationIconSvg(color, size);

  return {
    className: "station-marker",
    html: `<div style="opacity:${station.isWIP ? 0.5 : 1};filter:drop-shadow(0 1px 2px rgba(0,0,0,.2))">${html}</div>`,
    iconSize: [size, size] as [number, number],
    iconAnchor: [size / 2, size / 2] as [number, number],
  };
};

export const GenericCityMap = ({
  stations,
  lineStations,
  lineColors,
  lineNames,
  operationalStations,
  schedules,
  mapCenter,
  mapZoom,
  selectedStationId,
  highlightRouteIds,
  onStationClick,
  onActiveTrainCount,
  onNearestStationFound,
  getCrowd,
  onStationDetail,
}: GenericCityMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const stationMarkersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const trainMarkersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const highlightLayerRef = useRef<import("leaflet").Polyline | null>(null);
  const [, forceRender] = useState(0);
  const nearestFiredRef = useRef(false);
  // Feature 40: line filter toggle
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());
  const toggleLine = (line: string) => setHiddenLines((p) => { const n = new Set(p); n.has(line) ? n.delete(line) : n.add(line); return n; });
  // Feature 11: crowd heatmap toggle
  const [heatmapOn, setHeatmapOn] = useState(false);
  // Feature 7: GPS button state
  const [gpsLocating, setGpsLocating] = useState(false);

  // Geolocation → nearest station
  const geo = useGeolocation();
  useEffect(() => {
    if (nearestFiredRef.current) return;
    if (!geo.coordinates || !onNearestStationFound) return;
    try {
      const nearest = findNearestStation(geo.coordinates);
      if (nearest) {
        nearestFiredRef.current = true;
        onNearestStationFound(nearest.station.id, nearest.distanceKm, nearest.walkingMinutes);
      }
    } catch {
      // findNearestStation may not work for all cities — silently ignore
    }
  }, [geo.coordinates, onNearestStationFound]);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((mod) => {
      const L = mod.default;

      const map = L.map(containerRef.current!, {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Draw lines — operational solid, WIP dashed
      const lineKeys = Object.keys(lineStations);
      lineKeys.forEach((line) => {
        const ids = lineStations[line];
        const opIds = ids.filter((id) => operationalStations.has(id));
        const wipIds = ids.filter((id) => !operationalStations.has(id));

        if (opIds.length > 1) {
          // Build contiguous segments of operational stations
          const coords = opIds
            .map((id) => stations[id]?.coordinates)
            .filter(Boolean) as [number, number][];
          L.polyline(coords, {
            color: lineColors[line] ?? "#888",
            weight: 5,
            opacity: 0.9,
            lineCap: "round",
          }).addTo(map);
        }
        if (wipIds.length > 1) {
          const coords = ids
            .map((id) => stations[id]?.coordinates)
            .filter(Boolean) as [number, number][];
          L.polyline(coords, {
            color: lineColors[line] ?? "#888",
            weight: 4,
            opacity: 0.4,
            dashArray: "8 6",
          }).addTo(map);
        }
      });

      // Station markers
      Object.values(stations).forEach((station) => {
        const isOp = operationalStations.has(station.id);
        const iconCfg = buildIcon(station, lineColors, false, isOp);
        const marker = L.marker(station.coordinates, {
          icon: L.divIcon(iconCfg),
          zIndexOffset: station.isInterchange ? 500 : 0,
        }).addTo(map);

        marker.bindTooltip(station.name, { direction: "top", offset: [0, -8] });

        if (isOp) {
          marker.on("click", () => {
            onStationClick?.(station.id);
            onStationDetail?.(station.id); // Feature 39
          });
        }

        stationMarkersRef.current.set(station.id, marker);
      });

      mapRef.current = map;
      // Force Leaflet to recalculate container size after React paint
      setTimeout(() => map.invalidateSize(), 50);
      forceRender((n) => n + 1);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      stationMarkersRef.current.clear();
      trainMarkersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update selected station marker style
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      stationMarkersRef.current.forEach((marker, id) => {
        const station = stations[id];
        if (!station) return;
        const isOp = operationalStations.has(id);
        const isSelected = id === selectedStationId;
        marker.setIcon(L.divIcon(buildIcon(station, lineColors, isSelected, isOp)));
        marker.setZIndexOffset(isSelected ? 1000 : station.isInterchange ? 500 : 0);
      });
    });
  }, [selectedStationId, stations, lineColors, operationalStations]);

  // Highlight route
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      if (highlightLayerRef.current) {
        highlightLayerRef.current.remove();
        highlightLayerRef.current = null;
      }
      if (highlightRouteIds && highlightRouteIds.length > 1) {
        const coords = highlightRouteIds
          .map((id) => stations[id]?.coordinates)
          .filter(Boolean) as [number, number][];
        const layer = L.polyline(coords, {
          color: "#F5C518",
          weight: 6,
          opacity: 0.9,
        }).addTo(mapRef.current!);
        highlightLayerRef.current = layer;
        mapRef.current!.fitBounds(layer.getBounds(), { padding: [60, 60] });
      }
    });
  }, [highlightRouteIds, stations]);

  // Live train animation
  useEffect(() => {
    if (!schedules.length) return;

    const update = () => {
      if (!mapRef.current) return;
      import("leaflet").then((mod) => {
        const L = mod.default;
        const currentMin = getCurrentISTMinutes();
        const active = getActiveTrains(schedules, stations, currentMin);

        const activeIds = new Set(active.map((t) => t.schedule.id));

        // Remove stale
        trainMarkersRef.current.forEach((marker, id) => {
          if (!activeIds.has(id)) {
            marker.remove();
            trainMarkersRef.current.delete(id);
          }
        });

        // Add / update
        active.forEach(({ schedule, position }) => {
          if (position.lat == null || position.lng == null) return;
          const lineColor = lineColors[schedule.line] ?? "#888";
          const icon = L.divIcon({
            className: "train-marker",
            html: `<div style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))">${trainIconSvg(lineColor)}</div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          const existing = trainMarkersRef.current.get(schedule.id);
          if (existing) {
            existing.setLatLng([position.lat, position.lng]);
          } else {
            const m = L.marker([position.lat, position.lng], { icon, zIndexOffset: 800 })
              .addTo(mapRef.current!);
            const dir = schedule.direction === "forward" ? "→" : "←";
            const lineName = lineNames[schedule.line] ?? schedule.line;
            m.bindTooltip(`${lineName} ${dir} · Train ${schedule.id.split("-")[2]}`, {
              direction: "top",
              offset: [0, -12],
            });
            trainMarkersRef.current.set(schedule.id, m);
          }
        });

        onActiveTrainCount?.(active.length);
      });
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules, stations, lineColors, lineNames]);

  // Feature 11: recolor markers for crowd heatmap when heatmapOn changes
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then(({ default: L }) => {
      stationMarkersRef.current.forEach((marker, id) => {
        if (!heatmapOn || !getCrowd) return;
        const crowd = getCrowd(id);
        const crowdColor = crowd?.level === "Very High" ? "#ef4444"
          : crowd?.level === "High" ? "#f97316"
          : crowd?.level === "Moderate" ? "#eab308"
          : "#22c55e";
        const el = marker.getElement();
        if (el) {
          const svg = el.querySelector("svg circle");
          if (svg) (svg as SVGElement).setAttribute("fill", crowdColor);
        }
      });
    });
  }, [heatmapOn, getCrowd]);

  const lineKeys = Object.keys(lineStations);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Feature 7: GPS nearest station button */}
      <button
        onClick={async () => {
          setGpsLocating(true);
          geo.locate();
          setTimeout(() => setGpsLocating(false), 5000);
        }}
        className="absolute bottom-24 right-3 z-[800] bg-background border border-border rounded-full p-3 shadow-md hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Find nearest station"
        title="Find nearest station"
      >
        <span className={`text-lg ${gpsLocating ? "animate-pulse" : ""}`}>📍</span>
      </button>

      {/* Feature 11: Crowd heatmap toggle */}
      {getCrowd && (
        <button
          onClick={() => setHeatmapOn((v) => !v)}
          className={`absolute top-2 right-2 z-[800] rounded-full px-3 py-1.5 text-xs font-semibold shadow-md border transition-all min-h-[36px] ${heatmapOn ? "bg-orange-500 text-white border-orange-500" : "bg-background border-border text-foreground"}`}
          title="Toggle crowd heatmap"
        >
          {heatmapOn ? "🌡️ Live" : "🌡️ Crowd"}
        </button>
      )}

      {/* Feature 40: Line filter toggles */}
      {lineKeys.length > 1 && (
        <div className="absolute top-14 left-0 right-0 z-[800] pointer-events-auto">
          <div className="flex flex-row gap-1.5 overflow-x-auto px-2 py-1.5 no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {lineKeys.map((line) => {
            const color = lineColors[line] ?? "#888";
            const hidden = hiddenLines.has(line);
            return (
              <button
                key={line}
                onClick={() => toggleLine(line)}
                aria-pressed={!hidden}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-md border transition-all shrink-0 min-h-[28px]"
                style={{ background: hidden ? "var(--background)" : color, color: hidden ? color : "#fff", borderColor: color, opacity: hidden ? 0.7 : 1 }}
              >
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: hidden ? color : "#fff" }} />
                {(lineNames[line] ?? line).replace(" Line", "")}
              </button>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericCityMap;
