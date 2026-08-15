import { useState, useEffect, useRef, useCallback } from "react";
import { DelhiLine, stations, LINE_STATIONS } from "@/cities/delhi/metroData";
import { getTravelTimeMinutes, INTERCHANGE_TRANSFER_MINUTES } from "@/cities/delhi/segmentTimings";

export interface JourneyStop { stationId: string; stationName: string; etaMinutes: number; isTransfer?: boolean; }

export interface JourneyState {
  active: boolean; boardingTime: Date | null; boardingStationId: string | null;
  destinationStationId: string | null; line?: string; stops: JourneyStop[];
  currentStationId: string | null; nextStationId: string | null;
  secondsToNext: number; progressToNext: number; arrived: boolean;
}

const INITIAL: JourneyState = {
  active: false, boardingTime: null, boardingStationId: null,
  destinationStationId: null, stops: [], currentStationId: null,
  nextStationId: null, secondsToNext: 0, progressToNext: 0, arrived: false,
};

function buildStops(segments: { fromId: string; toId: string; line: DelhiLine }[]): JourneyStop[] {
  const stops: JourneyStop[] = [];
  let cum = 0;
  segments.forEach((seg, i) => {
    const arr = LINE_STATIONS[seg.line];
    const fi = arr.indexOf(seg.fromId); const ti = arr.indexOf(seg.toId);
    if (fi === -1 || ti === -1) return;
    const ordered = fi <= ti ? arr.slice(fi, ti + 1) : [...arr.slice(ti, fi + 1)].reverse();
    ordered.forEach((id, j) => {
      if (j === 0 && stops.length > 0) return;
      const t = getTravelTimeMinutes(seg.line, seg.fromId, id) ?? 0;
      stops.push({ stationId: id, stationName: stations[id]?.name ?? id, etaMinutes: cum + t });
    });
    cum = stops[stops.length - 1]?.etaMinutes ?? cum;
    if (i < segments.length - 1) cum += INTERCHANGE_TRANSFER_MINUTES;
  });
  return stops;
}

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
    segments: { fromId: string; toId: string; line: DelhiLine }[]
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
      secondsToNext: (stops[1]?.etaMinutes ?? 0) * 60, progressToNext: 0, arrived: false,
    });
  }, [acquireWakeLock]);

  const endJourney = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    await releaseWakeLock(); setState(INITIAL); notifiedRef.current.clear();
  }, [releaseWakeLock]);

  useEffect(() => {
    if (!state.active || state.arrived) return;
    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.active || !prev.boardingTime) return prev;
        const elapsed = (Date.now() - prev.boardingTime.getTime()) / 60000;
        const remaining = prev.stops.filter((s) => s.etaMinutes > elapsed);
        if (remaining.length === 0) { releaseWakeLock(); return { ...prev, arrived: true, active: false }; }
        const next = remaining[0]; const prevStop = prev.stops[prev.stops.indexOf(next) - 1] ?? prev.stops[0];
        const segDur = next.etaMinutes - prevStop.etaMinutes;
        const progress = segDur > 0 ? Math.min(1, (elapsed - prevStop.etaMinutes) / segDur) : 0;
        const destId = prev.destinationStationId;
        if (destId) {
          const di = prev.stops.findIndex((s) => s.stationId === destId);
          const pd = prev.stops[di - 1];
          if (pd && elapsed >= pd.etaMinutes && !notifiedRef.current.has(destId)) {
            notifiedRef.current.add(destId);
            try { navigator.vibrate?.([200, 100, 200]); } catch {}
            try { if (Notification.permission === "granted") new Notification("IndMetro — Delhi", { body: `Next stop: ${prev.stops[di].stationName} — your destination!`, icon: "/pwa-192x192.png" }); } catch {}
          }
        }
        const passed = prev.stops.filter((s) => s.etaMinutes <= elapsed);
        return { ...prev, stops: remaining, currentStationId: passed[passed.length - 1]?.stationId ?? prev.boardingStationId, nextStationId: next.stationId, secondsToNext: Math.max(0, (next.etaMinutes - elapsed) * 60), progressToNext: progress };
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.active, state.arrived, releaseWakeLock]);

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") await Notification.requestPermission();
  }, []);

  return { journey: state, startJourney, endJourney, requestNotificationPermission };
}
