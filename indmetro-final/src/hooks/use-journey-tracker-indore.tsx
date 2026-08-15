import { useState, useEffect, useRef, useCallback } from "react";
import { LINE_TIMINGS, TOTAL_RING_MINUTES } from "@/cities/indore/segmentTimings";
import { LINE_STATIONS, stations } from "@/cities/indore/metroData";

export interface JourneyStop { stationId: string; stationName: string; etaMinutes: number; }
export interface JourneyState {
  active: boolean; boardingTime: Date | null;
  boardingStationId: string | null; destinationStationId: string | null;
  line: "yellow"; direction: "clockwise" | "anticlockwise";
  stops: JourneyStop[]; currentStationId: string | null;
  nextStationId: string | null; secondsToNext: number;
  progressToNext: number; arrived: boolean;
}

const INITIAL: JourneyState = {
  active: false, boardingTime: null, boardingStationId: null,
  destinationStationId: null, line: "yellow", direction: "clockwise",
  stops: [], currentStationId: null, nextStationId: null,
  secondsToNext: 0, progressToNext: 0, arrived: false,
};

export function useJourneyTracker() {
  const [state, setState] = useState<JourneyState>(INITIAL);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef<Set<string>>(new Set());

  const acquireWakeLock = useCallback(async () => {
    try { if ("wakeLock" in navigator) wakeLockRef.current = await navigator.wakeLock.request("screen"); } catch {}
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) { await wakeLockRef.current.release(); wakeLockRef.current = null; }
  }, []);

  const startJourney = useCallback(async (
    boardingId: string, destinationId: string,
    _line: "yellow", direction: "clockwise" | "anticlockwise"
  ) => {
    const arr = LINE_STATIONS.yellow;
    const t = LINE_TIMINGS.yellow;
    const fi = arr.indexOf(boardingId);
    if (fi === -1) return;

    // Build ordered stop list along chosen arc
    const n = arr.length;
    let stopsInOrder: string[];
    if (direction === "clockwise") {
      const di = arr.indexOf(destinationId);
      if (di === -1) return;
      stopsInOrder = di >= fi ? arr.slice(fi, di + 1) : [...arr.slice(fi), ...arr.slice(0, di + 1)];
    } else {
      const di = arr.indexOf(destinationId);
      if (di === -1) return;
      const cw = di >= fi ? di - fi : n - fi + di;
      const acwCount = n - cw;
      stopsInOrder = [];
      for (let i = 0; i <= acwCount; i++) stopsInOrder.push(arr[(fi - i + n) % n]);
    }

    const stops: JourneyStop[] = stopsInOrder.map((id, i) => {
      const fromCum = t.cumulativeMinutes[fi];
      const toCum = t.cumulativeMinutes[arr.indexOf(id)];
      let eta: number;
      if (direction === "clockwise") {
        eta = toCum >= fromCum ? toCum - fromCum : TOTAL_RING_MINUTES - fromCum + toCum;
      } else {
        eta = fromCum >= toCum ? fromCum - toCum : TOTAL_RING_MINUTES - toCum + fromCum;
      }
      return { stationId: id, stationName: stations[id]?.name ?? id, etaMinutes: eta };
    });

    notifiedRef.current.clear();
    await acquireWakeLock();
    setState({
      active: true, boardingTime: new Date(), boardingStationId: boardingId,
      destinationStationId: destinationId, line: "yellow", direction,
      stops, currentStationId: boardingId,
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
      setState(prev => {
        if (!prev.active || !prev.boardingTime) return prev;
        const elapsed = (Date.now() - prev.boardingTime.getTime()) / 60000;
        const remaining = prev.stops.filter(s => s.etaMinutes > elapsed);
        if (remaining.length === 0) { releaseWakeLock(); return { ...prev, arrived: true, active: false }; }

        const next = remaining[0];
        const prevStop = prev.stops[prev.stops.indexOf(next) - 1] ?? prev.stops[0];
        const seg = next.etaMinutes - prevStop.etaMinutes;
        const progress = seg > 0 ? Math.min(1, (elapsed - prevStop.etaMinutes) / seg) : 0;
        const secondsToNext = Math.max(0, (next.etaMinutes - elapsed) * 60);

        const destId = prev.destinationStationId;
        if (destId) {
          const di = prev.stops.findIndex(s => s.stationId === destId);
          const pd = prev.stops[di - 1];
          if (pd && elapsed >= pd.etaMinutes && !notifiedRef.current.has(destId)) {
            notifiedRef.current.add(destId);
            try { navigator.vibrate?.([200, 100, 200]); } catch {}
            try {
              if (Notification.permission === "granted")
                new Notification("IndMetro — Indore", { body: `Next stop: ${prev.stops[di].stationName} — your destination!`, icon: "/pwa-192x192.png" });
            } catch {}
          }
        }
        const passed = prev.stops.filter(s => s.etaMinutes <= elapsed);
        return { ...prev, stops: remaining, currentStationId: passed[passed.length-1]?.stationId ?? prev.boardingStationId, nextStationId: next.stationId, secondsToNext, progressToNext: progress };
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.active, state.arrived, releaseWakeLock]);

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") await Notification.requestPermission();
  }, []);

  return { journey: state, startJourney, endJourney, requestNotificationPermission };
}
