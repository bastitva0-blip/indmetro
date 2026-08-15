import { useState, useEffect, useRef, useCallback } from "react";
import { getTravelTimeMinutes, INTERCHANGE_TRANSFER_MINUTES } from "@/cities/bangalore/segmentTimings";
import { LINE_STATIONS, stations } from "@/cities/bangalore/metroData";

export type BangaloreLine = "purple" | "green" | "yellow";

export interface JourneyStop {
  stationId: string;
  stationName: string;
  etaMinutes: number;
  isTransfer?: boolean;
}

export interface JourneyState {
  active: boolean;
  boardingTime: Date | null;
  boardingStationId: string | null;
  destinationStationId: string | null;
  line?: string; // optional — Bangalore is multi-line
  stops: JourneyStop[];
  currentStationId: string | null;
  nextStationId: string | null;
  secondsToNext: number;
  progressToNext: number;
  arrived: boolean;
}

const INITIAL: JourneyState = {
  active: false, boardingTime: null, boardingStationId: null,
  destinationStationId: null, stops: [], currentStationId: null,
  nextStationId: null, secondsToNext: 0, progressToNext: 0, arrived: false,
};

// Build ordered stops for a journey that may cross lines
function buildStops(
  segments: { fromId: string; toId: string; line: BangaloreLine }[]
): JourneyStop[] {
  const stops: JourneyStop[] = [];
  let cumMin = 0;

  segments.forEach((seg, i) => {
    const lineArr  = LINE_STATIONS[seg.line];
    const fromIdx  = lineArr.indexOf(seg.fromId);
    const toIdx    = lineArr.indexOf(seg.toId);
    if (fromIdx === -1 || toIdx === -1) return;

    const ordered = fromIdx <= toIdx
      ? lineArr.slice(fromIdx, toIdx + 1)
      : lineArr.slice(toIdx, fromIdx + 1).reverse();

    ordered.forEach((id, j) => {
      if (j === 0 && stops.length > 0) return; // skip duplicate interchange
      const t = getTravelTimeMinutes(seg.line, seg.fromId, id) ?? 0;
      stops.push({ stationId: id, stationName: stations[id]?.name ?? id, etaMinutes: cumMin + t });
    });

    cumMin = stops[stops.length - 1].etaMinutes;
    if (i < segments.length - 1) cumMin += INTERCHANGE_TRANSFER_MINUTES;
  });

  return stops;
}

export function useJourneyTracker() {
  const [state, setState]   = useState<JourneyState>(INITIAL);
  const wakeLockRef         = useRef<WakeLockSentinel | null>(null);
  const intervalRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef         = useRef<Set<string>>(new Set());

  const acquireWakeLock = useCallback(async () => {
    try { if ("wakeLock" in navigator) wakeLockRef.current = await navigator.wakeLock.request("screen"); } catch {}
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) { await wakeLockRef.current.release(); wakeLockRef.current = null; }
  }, []);

  const startJourney = useCallback(async (
    segments: { fromId: string; toId: string; line: BangaloreLine }[]
  ) => {
    if (!segments.length) return;
    const stops = buildStops(segments);
    if (!stops.length) return;
    notifiedRef.current.clear();
    await acquireWakeLock();
    setState({
      active: true, boardingTime: new Date(),
      boardingStationId: segments[0].fromId,
      destinationStationId: segments[segments.length - 1].toId,
      stops, currentStationId: segments[0].fromId,
      nextStationId: stops[1]?.stationId ?? null,
      secondsToNext: (stops[1]?.etaMinutes ?? 0) * 60,
      progressToNext: 0, arrived: false,
    });
  }, [acquireWakeLock]);

  const endJourney = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    await releaseWakeLock();
    setState(INITIAL);
    notifiedRef.current.clear();
  }, [releaseWakeLock]);

  useEffect(() => {
    if (!state.active || state.arrived) return;
    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.active || !prev.boardingTime) return prev;
        const elapsedMin = (Date.now() - prev.boardingTime.getTime()) / 60000;
        const remaining  = prev.stops.filter((s) => s.etaMinutes > elapsedMin);
        if (remaining.length === 0) { releaseWakeLock(); return { ...prev, arrived: true, active: false }; }

        const nextStop = remaining[0];
        const prevStop = prev.stops[prev.stops.indexOf(nextStop) - 1] ?? prev.stops[0];
        const segDur   = nextStop.etaMinutes - prevStop.etaMinutes;
        const progress = segDur > 0 ? Math.min(1, (elapsedMin - prevStop.etaMinutes) / segDur) : 0;
        const secondsToNext = Math.max(0, (nextStop.etaMinutes - elapsedMin) * 60);

        const destId = prev.destinationStationId;
        if (destId) {
          const destIdx  = prev.stops.findIndex((s) => s.stationId === destId);
          const prevDest = prev.stops[destIdx - 1];
          if (prevDest && elapsedMin >= prevDest.etaMinutes && !notifiedRef.current.has(destId)) {
            notifiedRef.current.add(destId);
            try { navigator.vibrate?.([200, 100, 200]); } catch {}
            try {
              if (Notification.permission === "granted")
                new Notification("IndMetro — Bangalore", {
                  body: `Next stop: ${prev.stops[destIdx].stationName} — your destination!`,
                  icon: "/pwa-192x192.png",
                });
            } catch {}
          }
        }

        const passed = prev.stops.filter((s) => s.etaMinutes <= elapsedMin);
        const currentStationId = passed[passed.length - 1]?.stationId ?? prev.boardingStationId;
        return { ...prev, stops: remaining, currentStationId, nextStationId: nextStop.stationId, secondsToNext, progressToNext: progress };
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.active, state.arrived, releaseWakeLock]);

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default")
      await Notification.requestPermission();
  }, []);

  return { journey: state, startJourney, endJourney, requestNotificationPermission };
}
