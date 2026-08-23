import { useEffect, useState } from "react";

const LS_KEY = "indmetro:highContrast";

/**
 * useHighContrast — returns [enabled, toggle]
 * When enabled, sets data-high-contrast="true" on <html>.
 * CSS targets: html[data-high-contrast="true"] { ... }
 */
export function useHighContrast(): [boolean, () => void] {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_KEY) === "true"; }
    catch { return false; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-high-contrast", String(enabled));
    try { localStorage.setItem(LS_KEY, String(enabled)); } catch { /* ignore */ }
  }, [enabled]);

  const toggle = () => setEnabled((v) => !v);
  return [enabled, toggle];
}
