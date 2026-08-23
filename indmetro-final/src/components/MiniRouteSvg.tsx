/**
 * MiniRouteSvg — draws a compact horizontal SVG diagram for a route result.
 * Pure SVG, no external dependencies.
 *
 * Visual:
 *   [Origin●]————[Interchange●]————[Destination●]
 *       LineA (N stops)       LineB (M stops)
 */

interface RouteStep {
  type: "board" | "travel" | "interchange" | "alight";
  stationName?: string;
  stationId?: string;
  numStops?: number;
  line?: string;
}

interface MiniRouteSvgProps {
  steps: RouteStep[];
  lineColors: Record<string, string>;
  primaryColor: string;
}

interface Segment {
  line: string;
  color: string;
  stops: number;
  fromName: string;
  toName: string;
  isInterchange: boolean;
}

export function MiniRouteSvg({ steps, lineColors, primaryColor }: MiniRouteSvgProps) {
  // Build segments from steps
  const segments: Segment[] = [];
  let currentLine = "";
  let currentColor = primaryColor;
  let boardName = "";

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.type === "board") {
      currentLine = s.line ?? "";
      currentColor = s.line ? (lineColors[s.line] ?? primaryColor) : primaryColor;
      boardName = s.stationName ?? "";
    }
    if (s.type === "interchange" || s.type === "alight") {
      const prev = steps.find((x, j) => j < i && x.type === "travel");
      segments.push({
        line: currentLine,
        color: currentColor,
        stops: prev?.numStops ?? 1,
        fromName: boardName,
        toName: s.stationName ?? "",
        isInterchange: s.type === "interchange",
      });
      boardName = s.stationName ?? "";
    }
  }

  if (segments.length === 0) return null;

  const W = 320;
  const H = 64;
  const nodeR = 6;
  const y = H / 2;

  // Distribute node x positions evenly
  const nodeCount = segments.length + 1;
  const padding = 24;
  const nodeXs = Array.from({ length: nodeCount }, (_, i) =>
    padding + (i * (W - padding * 2)) / (nodeCount - 1)
  );

  // Clamp long station names
  const clamp = (name: string, max = 10) =>
    name.length > max ? name.slice(0, max - 1) + "…" : name;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      aria-hidden="true"
      className="overflow-visible"
    >
      {/* Line segments */}
      {segments.map((seg, i) => (
        <line
          key={i}
          x1={nodeXs[i]}
          y1={y}
          x2={nodeXs[i + 1]}
          y2={y}
          stroke={seg.color}
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}

      {/* Stop-count labels on segments */}
      {segments.map((seg, i) => {
        const midX = (nodeXs[i] + nodeXs[i + 1]) / 2;
        return (
          <text
            key={`lbl-${i}`}
            x={midX}
            y={y - 10}
            textAnchor="middle"
            fontSize={9}
            fill="currentColor"
            className="fill-muted-foreground"
          >
            {seg.stops} stop{seg.stops !== 1 ? "s" : ""}
          </text>
        );
      })}

      {/* Station nodes */}
      {nodeXs.map((x, i) => {
        const isFirst = i === 0;
        const isLast  = i === nodeXs.length - 1;
        const isIxn   = !isFirst && !isLast;
        const color   = isFirst
          ? "#22c55e"
          : isLast
          ? "#ef4444"
          : "#f59e0b";
        const r = isIxn ? nodeR - 1 : nodeR;
        const name = isFirst
          ? segments[0].fromName
          : isLast
          ? segments[segments.length - 1].toName
          : segments[i - 1].toName;

        return (
          <g key={`node-${i}`}>
            <circle cx={x} cy={y} r={r + 2} fill="var(--background, #fff)" />
            <circle cx={x} cy={y} r={r} fill={color} />
            <text
              x={x}
              y={y + nodeR + 10}
              textAnchor="middle"
              fontSize={8.5}
              fill="currentColor"
              className="fill-muted-foreground"
            >
              {clamp(name)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default MiniRouteSvg;
