/**
 * haptics.ts — thin wrapper around navigator.vibrate
 * Feature-detected: silent fail on iOS / unsupported browsers.
 */

const vibe = (pattern: number | number[]) => {
  try { navigator.vibrate?.(pattern); } catch { /* unsupported */ }
};

export const haptics = {
  /** Route found — short single pulse */
  routeFound: () => vibe(50),
  /** Journey started — confident tap */
  journeyStart: () => vibe(100),
  /** One station before destination — double alert */
  stationApproach: () => vibe([200, 100, 200]),
  /** Arrived at destination — celebration */
  arrival: () => vibe([100, 50, 100, 50, 300]),
  /** Smart card deduction — subtle ack */
  cardDeduct: () => vibe(30),
  /** Generic light tap for UI interactions */
  tap: () => vibe(20),
};
