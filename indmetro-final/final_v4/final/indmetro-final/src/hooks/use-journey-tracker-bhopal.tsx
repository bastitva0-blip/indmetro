import { useState, useEffect, useRef, useCallback } from "react";
import { getTravelTimeMinutes } from "@/cities/bhopal/segmentTimings";
import { LINE_STATIONS, stations, OPERATIONAL_STATIONS } from "@/cities/bhopal/metroData";

export type BhopalLine = "orange" | "blue";

export interface JourneyStop {
  stationId: string;
  stationName: string;
  etaMinutes: number;
}

export interface JourneyState {
  active: boolean;
  boardingTime: Date | null;
  boardingStationId: string | null;
  destinationStationId: string | null;
  line: BhopalLine;
  stops: JourneyStop[];
  currentStationId: string | null;
  nextStationId: string | null;
  secondsToNext: number;
  progressToNext: number;
  arrived: boolean;
}

const INITIAL: JourneyState = {
  active: false,
  boardingTime: null,
  boardingStationId: null,
  destinationStationId: null,
  line: "orange",
  stops: [],
  currentStationId: null,
  nextStationId: null,
  secondsToNext: 0,
  progressToNext: 0,
  arrived: false,
};

export function useJourneyTracker() {
  const [state, setState] = useState<JourneyState>(INITIAL);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef<Set<string>>(new Set());

  const acquireWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator)
        wakeLockRef.current = await navigator.wakeLock.request("screen");
    } catch {}
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  const startJourney = useCallback(
    async (boardingStationId: string, destinationStationId: string, line: BhopalLine) => {
      if (!OPERATIONAL_STATIONS.has(boardingStationId) || !OPERATIONAL_STATIONS.has(destinationStationId)) return;
      const lineArr = LINE_STATIONS[line];
      const boardIdx = lineArr.indexOf(boardingStationId);
      const destIdx  = lineArr.indexOf(destinationStationId);
      if (boardIdx === -1 || destIdx === -1) return;

      const ordered = destIdx > boardIdx
        ? lineArr.slice(boardIdx, destIdx + 1)
        : lineArr.slice(destIdx, boardIdx + 1).reverse();

      const stops: JourneyStop[] = ordered.map((id) => ({
        stationId: id,
        stationName: stations[id]?.name ?? id,
        etaMinutes: getTravelTimeMinutes(line, boardingStationId, id) ?? 0,
      }));

      notifiedRef.current.clear();
      await acquireWakeLock();

      setState({
        active: true,
        boardingTime: new Date(),
        boardingStationId,
        destinationStationId,
        line,
        stops,
        currentStationId: boardingStationId,
        nextStationId: stops[1]?.stationId ?? null,
        secondsToNext: (stops[1]?.etaMinutes ?? 0) * 60,
        progressToNext: 0,
        arrived: false,
      });
    },
    [acquireWakeLock]
  );

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

        if (remaining.length === 0) {
          releaseWakeLock();
          return { ...prev, arrived: true, active: false };
        }

        const nextStop = remaining[0];
        const prevStop = prev.stops[prev.stops.indexOf(nextStop) - 1] ?? prev.stops[0];
        const segDur   = nextStop.etaMinutes - prevStop.etaMinutes;
        const segEl    = elapsedMin - prevStop.etaMinutes;
        const progress = segDur > 0 ? Math.min(1, segEl / segDur) : 0;
        const secondsToNext = Math.max(0, (nextStop.etaMinutes - elapsedMin) * 60);

        // Alert 1 stop before destination
        const destId = prev.destinationStationId;
        if (destId) {
          const destIdx = prev.stops.findIndex((s) => s.stationId === destId);
          const prevDest = prev.stops[destIdx - 1];
          if (prevDest && elapsedMin >= prevDest.etaMinutes && !notifiedRef.current.has(destId)) {
            notifiedRef.current.add(destId);
            try { navigator.vibrate?.([200, 100, 200]); } catch {}
            try {
              if (Notification.permission === "granted")
                new Notification("IndMetro — Bhopal", {
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
