import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useWakeLock — wraps the Screen Wake Lock API.
 * Feature-detected: safe on browsers that don't support it.
 * Returns { active, request, release }
 */
export function useWakeLock() {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const [active, setActive] = useState(false);

  const release = useCallback(async () => {
    try {
      await sentinelRef.current?.release();
    } catch { /* ignore */ } finally {
      sentinelRef.current = null;
      setActive(false);
    }
  }, []);

  const request = useCallback(async () => {
    try {
      if (!("wakeLock" in navigator)) return;
      sentinelRef.current = await navigator.wakeLock.request("screen");
      setActive(true);
      sentinelRef.current.addEventListener("release", () => {
        sentinelRef.current = null;
        setActive(false);
      });
    } catch { /* permission denied or not supported */ }
  }, []);

  // Re-acquire after page becomes visible again (browser releases on hide)
  useEffect(() => {
    const onVisible = () => { if (active && !sentinelRef.current) request(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [active, request]);

  useEffect(() => () => { release(); }, [release]);

  return { active, request, release };
}
