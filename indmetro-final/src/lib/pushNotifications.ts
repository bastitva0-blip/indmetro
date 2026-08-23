/**
 * pushNotifications.ts — local train alert notifications.
 * Uses setTimeout + Notification API (no service worker push required).
 * Baseline implementation; SW push can be layered on top later.
 */

const ALERT_KEY = "indmetro:trainAlerts";

export interface TrainAlert {
  citySlug: string;
  stationId: string;
  stationName: string;
  firstTrain: string;  // "HH:MM"
  lastTrain: string;   // "HH:MM"
  alertMinutesBefore: number;
  enabled: boolean;
}

function getISTNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function parseHHMM(t: string): { h: number; m: number } {
  const [h, m] = t.split(":").map(Number);
  return { h, m };
}

function msUntilHHMM(hh: number, mm: number, leadMinutes: number): number {
  const now = getISTNow();
  const target = new Date(now);
  target.setHours(hh, mm - leadMinutes, 0, 0);
  return target.getTime() - now.getTime();
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

const timerIds: ReturnType<typeof setTimeout>[] = [];

export function scheduleTrainAlerts(alert: TrainAlert): void {
  if (!alert.enabled) return;
  if (Notification.permission !== "granted") return;

  const send = (title: string, body: string) => {
    try {
      new Notification(title, {
        body,
        icon: "/pwa-192x192.png",
        badge: "/pwa-64x64.png",
        tag: `indmetro-train-${alert.stationId}`,
      });
    } catch { /* ignore */ }
  };

  const { h: fh, m: fm } = parseHHMM(alert.firstTrain);
  const firstMs = msUntilHHMM(fh, fm, alert.alertMinutesBefore);
  if (firstMs > 0) {
    timerIds.push(
      setTimeout(() => send(
        `🚇 First train soon — ${alert.stationName}`,
        `First train at ${alert.firstTrain}. Board in ~${alert.alertMinutesBefore} min.`
      ), firstMs)
    );
  }

  const { h: lh, m: lm } = parseHHMM(alert.lastTrain);
  const lastMs = msUntilHHMM(lh, lm, alert.alertMinutesBefore);
  if (lastMs > 0) {
    timerIds.push(
      setTimeout(() => send(
        `⚠️ Last train soon — ${alert.stationName}`,
        `Last train at ${alert.lastTrain}. Don't miss it!`
      ), lastMs)
    );
  }
}

export function clearAllAlerts(): void {
  timerIds.forEach(clearTimeout);
  timerIds.length = 0;
}

export function readAlerts(): TrainAlert[] {
  try {
    const v = localStorage.getItem(ALERT_KEY);
    return v ? JSON.parse(v) : [];
  } catch { return []; }
}

export function saveAlert(alert: TrainAlert): void {
  try {
    const all = readAlerts().filter(
      (a) => !(a.citySlug === alert.citySlug && a.stationId === alert.stationId)
    );
    localStorage.setItem(ALERT_KEY, JSON.stringify([...all, alert]));
  } catch { /* ignore */ }
}
