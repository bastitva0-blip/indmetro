import { WifiOff, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { useOnlineStatus } from "@/hooks/use-online-status";

/**
 * OfflineIndicator
 * - Offline: persistent amber banner
 * - Just came back online: green banner auto-dismisses after 3 s with slide-out
 */
export const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  const [justReconnected, setJustReconnected] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prevOnline, setPrevOnline] = useState(isOnline);

  useEffect(() => {
    // Transition offline → online
    if (!prevOnline && isOnline) {
      setJustReconnected(true);
      setVisible(true);
      const hide = setTimeout(() => setVisible(false), 2800);
      const clear = setTimeout(() => setJustReconnected(false), 3200);
      setPrevOnline(isOnline);
      return () => { clearTimeout(hide); clearTimeout(clear); };
    }
    // Transition online → offline
    if (prevOnline && !isOnline) {
      setJustReconnected(false);
      setVisible(true);
    }
    setPrevOnline(isOnline);
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isOnline && !justReconnected) return null;

  if (justReconnected) {
    return (
      <div
        className="fixed top-0 inset-x-0 z-[1100] flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-white transition-all duration-500"
        style={{
          background: "#16a34a",
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          opacity: visible ? 1 : 0,
        }}
      >
        <Wifi className="h-3.5 w-3.5" />
        Back online — all features restored
      </div>
    );
  }

  return (
    <div className="fixed top-0 inset-x-0 z-[1100] bg-amber-500 text-white text-xs font-medium text-center py-1.5 flex items-center justify-center gap-1.5">
      <WifiOff className="h-3.5 w-3.5" />
      You're offline — showing cached data
    </div>
  );
};

export default OfflineIndicator;
