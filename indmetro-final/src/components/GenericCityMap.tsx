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
}: GenericCityMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const stationMarkersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const trainMarkersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const highlightLayerRef = useRef<import("leaflet").Polyline | null>(null);
  const [, forceRender] = useState(0);
  const nearestFiredRef = useRef(false);

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

        if (onStationClick && isOp) {
          marker.on("click", () => onStationClick(station.id));
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

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default GenericCityMap;
