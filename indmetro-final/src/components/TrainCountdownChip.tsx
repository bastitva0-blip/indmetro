import { useEffect, useState } from "react";

interface Props {
  /** "HH:MM" in IST */
  firstTrain: string;
  /** "HH:MM" in IST */
  lastTrain: string;
}

function getISTMinutes(): number {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return ist.getHours() * 60 + ist.getMinutes();
}

function parseHHMM(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fmtCountdown(diffMin: number): string {
  if (diffMin <= 0) return "now";
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Shows:
 *  - "First train in Xh Ym" when within 2 h before first train
 *  - "Last train in Xh Ym" when within 2 h before last train
 *  - null otherwise
 */
export function TrainCountdownChip({ firstTrain, lastTrain }: Props) {
  const [now, setNow] = useState(getISTMinutes());

  useEffect(() => {
    const id = setInterval(() => setNow(getISTMinutes()), 30_000);
    return () => clearInterval(id);
  }, []);

  const firstMin = parseHHMM(firstTrain);
  const lastMin  = parseHHMM(lastTrain);

  const diffFirst = firstMin - now;
  const diffLast  = lastMin  - now;

  if (diffFirst > 0 && diffFirst <= 120) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 text-green-700 dark:text-green-400 text-[11px] font-semibold px-2.5 py-0.5 border border-green-500/30">
        🟢 First train in {fmtCountdown(diffFirst)}
      </span>
    );
  }

  if (diffLast > 0 && diffLast <= 120) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 text-red-700 dark:text-red-400 text-[11px] font-semibold px-2.5 py-0.5 border border-red-500/30">
        🔴 Last train in {fmtCountdown(diffLast)}
      </span>
    );
  }

  return null;
}

export default TrainCountdownChip;
