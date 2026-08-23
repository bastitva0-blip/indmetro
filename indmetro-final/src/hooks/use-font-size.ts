import { useEffect, useState } from "react";

export type FontSize = "sm" | "md" | "lg";
const LS_KEY = "indmetro:fontsize";

const SIZE_MAP: Record<FontSize, string> = {
  sm: "14px",
  md: "16px",
  lg: "18px",
};

/**
 * useFontSize — returns [size, setSize]
 * Applies font-size to <html> element via CSS custom property --base-font-size.
 * Persisted in localStorage.
 */
export function useFontSize(): [FontSize, (s: FontSize) => void] {
  const [size, setSize] = useState<FontSize>(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      if (v === "sm" || v === "md" || v === "lg") return v;
    } catch { /* ignore */ }
    return "md";
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--base-font-size", SIZE_MAP[size]);
    document.documentElement.setAttribute("data-fontsize", size);
    try { localStorage.setItem(LS_KEY, size); } catch { /* ignore */ }
  }, [size]);

  return [size, setSize];
}
