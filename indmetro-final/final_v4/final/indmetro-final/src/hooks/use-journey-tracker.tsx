import { useState, useEffect, useRef, useCallback } from "react";
import { getTravelTimeMinutes } from "@/data/segmentTimings";
import { LINE_STATIONS } from "@/data/metroData";

export interface JourneyStop {
  stationId: string;
  stationName: string;
  etaMinutes: number; // minutes from journey start
}

export interface JourneyState {
  active: boolean;
  boardingTime: Date | null;
  boardingStationId: string | null;
  destinationStationId: string | null;
  line: "red" | "blue";
  stops: JourneyStop[]; // remaining stops incl destination
  currentStationId: string | null;
  nextStationId: string | null;
  secondsToNext: number;
  progressToNext: number; // 0–1
  arrived: boolean;
}

const INITIAL: JourneyState = {
  active: false,
  boardingTime: null,
  boardingStationId: null,
  destinationStationId: null,
  line: "red",
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
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {
      // WakeLock denied — ignore, non-critical
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  const startJourney = useCallback(
    async (
      boardingStationId: string,
      destinationStationId: string,
      line: "red" | "blue"
    ) => {
      const lineStations = LINE_STATIONS[line];
      const boardIdx = lineStations.indexOf(boardingStationId);
      const destIdx = lineStations.indexOf(destinationStationId);
      if (boardIdx === -1 || destIdx === -1) return;

      const direction = destIdx > boardIdx ? 1 : -1;
      const stopsInOrder =
        direction > 0
          ? lineStations.slice(boardIdx, destIdx + 1)
          : lineStations.slice(destIdx, boardIdx + 1).reverse();

      // Import station names
      const { stations } = await import("@/data/metroData");
      const stops: JourneyStop[] = stopsInOrder.map((id) => {
        const t = getTravelTimeMinutes(line, boardingStationId, id) ?? 0;
        return {
          stationId: id,
          stationName: stations[id]?.name ?? id,
          etaMinutes: t,
        };
      });

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

  // Tick engine
  useEffect(() => {
    if (!state.active || state.arrived) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.active || !prev.boardingTime) return prev;

        const elapsedMin = (Date.now() - prev.boardingTime.getTime()) / 60000;
        const remaining = prev.stops.filter((s) => s.etaMinutes > elapsedMin);

        if (remaining.length === 0) {
          // Arrived
          releaseWakeLock();
          return { ...prev, arrived: true, active: false };
        }

        const nextStop = remaining[0];
        const prevStop =
          prev.stops[prev.stops.indexOf(nextStop) - 1] ?? prev.stops[0];
        const segDuration = nextStop.etaMinutes - prevStop.etaMinutes;
        const segElapsed = elapsedMin - prevStop.etaMinutes;
        const progress =
          segDuration > 0 ? Math.min(1, segElapsed / segDuration) : 0;
        const secondsToNext = Math.max(
          0,
          (nextStop.etaMinutes - elapsedMin) * 60
        );

        // 1-station-before notification
        const destId = prev.destinationStationId;
        if (destId) {
          const destIdx = prev.stops.findIndex((s) => s.stationId === destId);
          const prevDestStop = prev.stops[destIdx - 1];
          if (
            prevDestStop &&
            elapsedMin >= prevDestStop.etaMinutes &&
            !notifiedRef.current.has(destId)
          ) {
            notifiedRef.current.add(destId);
            // Vibrate + notification
            try {
              navigator.vibrate?.([200, 100, 200]);
            } catch {}
            try {
              if (Notification.permission === "granted") {
                new Notification("IndMetro", {
                  body: `Next stop: ${prev.stops[destIdx].stationName} — your destination!`,
                  icon: "/pwa-192x192.png",
                });
              }
            } catch {}
          }
        }

        // Current station = last stop we've passed
        const passedStops = prev.stops.filter((s) => s.etaMinutes <= elapsedMin);
        const currentStationId =
          passedStops[passedStops.length - 1]?.stationId ??
          prev.boardingStationId;

        return {
          ...prev,
          stops: remaining,
          currentStationId,
          nextStationId: nextStop.stationId,
          secondsToNext,
          progressToNext: progress,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.active, state.arrived, releaseWakeLock]);

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  return {
    journey: state,
    startJourney,
    endJourney,
    requestNotificationPermission,
  };
}
