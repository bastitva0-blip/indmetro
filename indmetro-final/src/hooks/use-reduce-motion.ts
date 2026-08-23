import { useEffect, useState } from "react";

const LS_KEY = "indmetro:reduceMotion";

function getSystemPref(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function readLS(): boolean | null {
  try {
    const v = localStorage.getItem(LS_KEY);
    if (v === "true") return true;
    if (v === "false") return false;
    return null;
  } catch {
    return null;
  }
}

/**
 * useReduceMotion — returns [reduceMotion, toggle]
 *
 * Priority: manual localStorage override → system prefers-reduced-motion
 * When reduceMotion is true, applies `data-reduce-motion="true"` to <html>
 * so you can target it in CSS: html[data-reduce-motion="true"] * { transition: none !important; }
 */
export function useReduceMotion(): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(() => {
    const manual = readLS();
    return manual !== null ? manual : getSystemPref();
  });

  // Apply to <html> whenever value changes
  useEffect(() => {
    document.documentElement.setAttribute("data-reduce-motion", String(value));
  }, [value]);

  // Also listen to system preference changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually overridden
      if (readLS() === null) setValue(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => {
    setValue((prev) => {
      const next = !prev;
      try { localStorage.setItem(LS_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  };

  return [value, toggle];
}
