import { X, Train, MapPin, ArrowRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import TrainCountdownChip from "@/components/TrainCountdownChip";
import type { StationGate } from "@/components/GenericCityMap";

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
  // New props
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
}

export function StationDetailSheet({
  open, onClose, stationId, stationName, lines, lineColors, lineNames,
  isInterchange, isUnderground, nextTrains, crowdInfo,
  firstTrain = "06:00", lastTrain = "22:00",
  onPlanFrom, onPlanTo,
  gates, parkingAvailable,
}: StationDetailSheetProps) {
  if (!stationId) return null;

  const hasParking = parkingAvailable?.twoWheeler || parkingAvailable?.fourWheeler;
  const hasAccessibleGate = gates?.some((g) => g.hasLift || g.hasRamp);

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
                {hasAccessibleGate && (
                  <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    ♿ Lift available
                  </span>
                )}
                {hasParking && (
                  <span className="text-[11px] font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                    🅿️ Parking
                  </span>
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

        <div className="px-4 pb-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Countdown chip */}
          <TrainCountdownChip firstTrain={firstTrain} lastTrain={lastTrain} />

          {/* Crowd */}
          {crowdInfo && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{crowdInfo.emoji}</span>
              <span className="text-muted-foreground">Crowd: <span className="font-medium text-foreground">{crowdInfo.level}</span></span>
            </div>
          )}

          {/* Gates / Exits */}
          {gates && gates.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                🚪 Gates &amp; exits
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {gates.map((gate) => (
                  <div
                    key={gate.id}
                    className="flex items-center gap-3 bg-muted/60 rounded-xl px-3 py-2"
                  >
                    <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                      {gate.id}
                    </span>
                    <span className="text-sm flex-1">{gate.description}</span>
                    <div className="flex gap-1 shrink-0">
                      {gate.hasLift && (
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-medium">
                          🛗 Lift
                        </span>
                      )}
                      {gate.hasRamp && (
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded-full font-medium">
                          ♿ Ramp
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parking */}
          {hasParking && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                🅿️ Parking
              </p>
              <div className="flex gap-2">
                {parkingAvailable?.twoWheeler && (
                  <span className="text-xs bg-muted rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                    🛵 2-wheeler
                  </span>
                )}
                {parkingAvailable?.fourWheeler && (
                  <span className="text-xs bg-muted rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                    🚗 4-wheeler
                  </span>
                )}
              </div>
            </div>
          )}

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

          {/* Last-mile options */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              🚖 Last-mile from this station
            </p>
            <div className="flex gap-2 flex-wrap">
              <a
                href={`https://www.olacabs.com/?drop_lat=&drop_lng=&drop_name=${encodeURIComponent(stationName + " Metro Station")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-xl px-3 py-2 font-medium"
              >
                🟡 Ola
              </a>
              <a
                href={`https://www.rapido.bike/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300 rounded-xl px-3 py-2 font-medium"
              >
                🟠 Rapido
              </a>
              <a
                href={`https://www.uber.com/in/en/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-muted border border-border rounded-xl px-3 py-2 font-medium text-foreground"
              >
                ⚫ Uber
              </a>
            </div>
          </div>

          {/* Plan from/to here */}
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
