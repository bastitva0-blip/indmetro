import { X, Train, Users, MapPin, ArrowRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import TrainCountdownChip from "@/components/TrainCountdownChip";

interface NextTrain {
  time: string;
  direction: string;
  destination?: string;
  minutesAway?: number;
}

interface StationDetailSheetProps {
  open: boolean;
  onClose: () => void;
  stationId: string | null;
  stationName: string;
  lines: string[];
  lineColors: Record<string, string>;
  lineNames: Record<string, string>;
  isInterchange?: boolean;
  isUnderground?: boolean;
  nextTrains: NextTrain[];
  crowdInfo?: { level: string; emoji: string } | null;
  firstTrain?: string;
  lastTrain?: string;
  onPlanFrom: (stationId: string) => void;
  onPlanTo: (stationId: string) => void;
}

const FACILITY_ICONS: Record<string, string> = {
  lift: "🛗",
  escalator: "⬆️",
  parking: "🅿️",
  toilet: "🚻",
  atm: "🏧",
  food: "🍽️",
  wifi: "📶",
};

export function StationDetailSheet({
  open, onClose, stationId, stationName, lines, lineColors, lineNames,
  isInterchange, isUnderground, nextTrains, crowdInfo,
  firstTrain = "06:00", lastTrain = "22:00",
  onPlanFrom, onPlanTo,
}: StationDetailSheetProps) {
  if (!stationId) return null;

  const forward = nextTrains.filter((_, i) => i % 2 === 0).slice(0, 3);
  const backward = nextTrains.filter((_, i) => i % 2 === 1).slice(0, 3);

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <DrawerTitle className="text-lg leading-tight">{stationName}</DrawerTitle>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {lines.map((line) => (
                  <span
                    key={line}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ background: lineColors[line] ?? "#888" }}
                  >
                    {lineNames[line] ?? line}
                  </span>
                ))}
                {isInterchange && (
                  <span className="text-[11px] font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 px-2 py-0.5 rounded-full">
                    🔄 Interchange
                  </span>
                )}
                {isUnderground && (
                  <span className="text-[11px] text-muted-foreground">🕳️ Underground</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Countdown chip */}
          <TrainCountdownChip firstTrain={firstTrain} lastTrain={lastTrain} />

          {/* Crowd */}
          {crowdInfo && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{crowdInfo.emoji}</span>
              <span className="text-muted-foreground">Crowd: <span className="font-medium text-foreground">{crowdInfo.level}</span></span>
            </div>
          )}

          {/* Facilities */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(FACILITY_ICONS).slice(0, 5).map(([key, icon]) => (
              <span key={key} className="flex items-center gap-1 text-xs bg-muted rounded-lg px-2.5 py-1.5">
                <span>{icon}</span>
                <span className="capitalize text-muted-foreground">{key}</span>
              </span>
            ))}
          </div>

          {/* Next trains */}
          {nextTrains.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <Train className="h-3.5 w-3.5" /> Next trains
              </p>
              <div className="space-y-1.5">
                {nextTrains.slice(0, 6).map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      <span>{t.direction}</span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="font-mono font-medium">{t.time}</span>
                      {t.minutesAway !== undefined && (
                        <span className="text-xs text-muted-foreground">in {t.minutesAway}m</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plan from/to here — Feature 23 */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 gap-2 h-11 text-sm"
              onClick={() => { onPlanFrom(stationId); onClose(); }}
            >
              <MapPin className="h-4 w-4 text-green-500" />
              Plan from here
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 h-11 text-sm"
              onClick={() => { onPlanTo(stationId); onClose(); }}
            >
              <ArrowRight className="h-4 w-4 text-red-500" />
              Plan to here
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default StationDetailSheet;
