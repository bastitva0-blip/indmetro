import { useCallback } from "react";
import { X, MapPin, CheckCircle2, Clock } from "lucide-react";
import type { JourneyState } from "@/hooks/use-journey-tracker";

// Accept any city's JourneyState — line field is city-specific
type AnyJourneyState = Omit<JourneyState, "line"> & { line: string };

interface Props {
  journey: AnyJourneyState;
  onEnd: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m} min ${s} sec` : `${s} sec`;
}

export default function JourneyMode({ journey, onEnd }: Props) {
  const handleEnd = useCallback(() => {
    onEnd();
  }, [onEnd]);

  if (journey.arrived) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-6 p-6">
        <CheckCircle2 className="w-24 h-24 text-green-500" />
        <h1 className="text-3xl font-bold text-center">You have arrived!</h1>
        <p className="text-muted-foreground text-center">
          Welcome to your destination. Have a great time!
        </p>
        <button
          onClick={handleEnd}
          className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-lg"
        >
          Done
        </button>
      </div>
    );
  }

  const nextStop = journey.stops[0];
  const remainingAfterNext = journey.stops.slice(1);

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe-top pt-4 pb-3 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Journey in progress
          </p>
          <p className="text-sm font-medium">
            {journey.line === "red" ? "🔴" : journey.line === "blue" ? "🔵" : journey.line === "orange" ? "🟠" : "🚇"} {journey.line.charAt(0).toUpperCase() + journey.line.slice(1)} Line
          </p>
        </div>
        <button
          onClick={handleEnd}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="End journey"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Big countdown */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
        {nextStop ? (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 text-center">
            <p className="text-sm text-muted-foreground mb-1">Reaching</p>
            <h2 className="text-2xl font-bold text-primary mb-3">
              {nextStop.stationName}
            </h2>
            <div className="text-4xl font-mono font-bold tabular-nums">
              {formatTime(journey.secondsToNext)}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${journey.progressToNext * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-muted rounded-2xl p-5 text-center">
            <p className="text-muted-foreground">Calculating…</p>
          </div>
        )}

        {/* Remaining stops */}
        {remainingAfterNext.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Upcoming stops
            </p>
            <div className="flex flex-col gap-2">
              {remainingAfterNext.map((stop, i) => {
                const isDestination = stop.stationId === journey.destinationStationId;
                return (
                  <div
                    key={stop.stationId}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isDestination
                        ? "bg-green-500/10 border border-green-500/30"
                        : "bg-muted/50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isDestination ? "bg-green-500" : "bg-muted-foreground/40"
                      }`}
                    />
                    <span
                      className={`flex-1 text-sm ${
                        isDestination ? "font-semibold text-green-600 dark:text-green-400" : ""
                      }`}
                    >
                      {stop.stationName}
                      {isDestination && " 🏁"}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      ~{Math.ceil(stop.etaMinutes)} min
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Current position indicator */}
        {journey.currentStationId && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <MapPin className="w-4 h-4" />
            <span>
              Last passed:{" "}
              <span className="font-medium text-foreground">
                {journey.stops.find(() => true)?.stationName ??
                  journey.currentStationId}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* End journey button */}
      <div className="px-4 pb-safe-bottom pb-6 pt-3 border-t border-border">
        <button
          onClick={handleEnd}
          className="w-full py-3 rounded-xl border border-destructive/50 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
        >
          End Journey
        </button>
      </div>
    </div>
  );
}
