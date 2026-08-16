/**
 * UpdatePrompt — detects when a new service worker has taken over
 * and reloads the page automatically if the user is online.
 *
 * Shows a slim banner during the brief window before reload so the
 * user isn't confused by a sudden refresh.
 */
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export function UpdatePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Listen for the new SW taking control (fires after skipWaiting + clientsClaim)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!navigator.onLine) return; // don't force-reload offline users
      setShow(true);
      // Give the user 1.5 s to see the banner, then reload
      setTimeout(() => window.location.reload(), 1500);
    });

    // Also poll the SW registration for updates every 60 s while the tab is visible
    const checkForUpdate = async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) await reg.update();
      } catch {
        // ignore — no network, etc.
      }
    };

    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        checkForUpdate();
      }
    }, 60_000);

    // Also check immediately on tab focus
    const onFocus = () => { if (navigator.onLine) checkForUpdate(); };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2 px-4 animate-fade-up">
      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
      <span>New version available — updating…</span>
    </div>
  );
}

export default UpdatePrompt;
