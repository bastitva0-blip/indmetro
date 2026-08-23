import { useState } from "react";
import { Plus, X, IndianRupee, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Leg {
  fromId: string;
  toId: string;
}

interface MultiTripCalculatorProps {
  stations: { id: string; name: string }[];
  calculateFare: (fromId: string, toId: string) => number;
  hasGoSmartCard: boolean;
  discountRate?: number; // e.g. 0.10 for 10%
}

export function MultiTripCalculator({
  stations, calculateFare, hasGoSmartCard, discountRate = 0.1,
}: MultiTripCalculatorProps) {
  const [legs, setLegs] = useState<Leg[]>([{ fromId: "", toId: "" }]);

  const addLeg = () => {
    if (legs.length >= 4) return;
    const last = legs[legs.length - 1];
    setLegs([...legs, { fromId: last.toId, toId: "" }]);
  };

  const removeLeg = (i: number) => setLegs(legs.filter((_, j) => j !== i));

  const updateLeg = (i: number, key: "fromId" | "toId", val: string) => {
    const next = legs.map((l, j) => {
      if (j !== i) return l;
      const updated = { ...l, [key]: val };
      return updated;
    });
    // Auto-chain: set next leg's fromId to this leg's toId
    if (key === "toId" && next[i + 1]) next[i + 1] = { ...next[i + 1], fromId: val };
    setLegs(next);
  };

  const legFares = legs.map((l) => {
    if (!l.fromId || !l.toId || l.fromId === l.toId) return null;
    try { return calculateFare(l.fromId, l.toId); }
    catch { return null; }
  });

  const totalToken = legFares.reduce<number>((s, f) => s + (f ?? 0), 0);
  const totalCard = hasGoSmartCard
    ? Math.round(totalToken * (1 - discountRate))
    : totalToken;

  const reset = () => setLegs([{ fromId: "", toId: "" }]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {legs.map((leg, i) => (
          <div key={i} className="bg-muted/40 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Leg {i + 1}
              </span>
              {legs.length > 1 && (
                <button
                  onClick={() => removeLeg(i)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                  aria-label="Remove leg"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* From */}
            <div>
              <label className="text-xs text-muted-foreground">From</label>
              <select
                value={leg.fromId}
                onChange={(e) => updateLeg(i, "fromId", e.target.value)}
                className="w-full mt-0.5 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select station…</option>
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* To */}
            <div>
              <label className="text-xs text-muted-foreground">To</label>
              <select
                value={leg.toId}
                onChange={(e) => updateLeg(i, "toId", e.target.value)}
                className="w-full mt-0.5 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select station…</option>
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Leg fare */}
            {legFares[i] !== null && legFares[i] !== undefined && (
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-xs text-muted-foreground">Fare</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">₹{legFares[i]}</span>
                  {hasGoSmartCard && (
                    <span className="text-xs text-green-600 font-medium">
                      ₹{Math.round(legFares[i]! * (1 - discountRate))} with card
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add leg button */}
      {legs.length < 4 && (
        <Button variant="outline" className="w-full gap-2 h-10" onClick={addLeg}>
          <Plus className="h-4 w-4" />
          Add another leg
        </Button>
      )}

      {/* Grand total */}
      {totalToken > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</p>
          <div className="flex items-center justify-between">
            <span className="text-sm">Token / cash</span>
            <span className="text-xl font-bold flex items-center gap-0.5">
              <IndianRupee className="h-4 w-4" />{totalToken}
            </span>
          </div>
          {hasGoSmartCard && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">GoSmart card</span>
              <span className="text-xl font-bold text-green-600 flex items-center gap-0.5">
                <IndianRupee className="h-4 w-4" />{totalCard}
                <span className="text-xs ml-1">(-{Math.round(discountRate * 100)}%)</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Reset */}
      {legs.some((l) => l.fromId || l.toId) && (
        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear all legs
        </button>
      )}
    </div>
  );
}

export default MultiTripCalculator;
