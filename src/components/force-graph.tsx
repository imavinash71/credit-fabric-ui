import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import { Hand, Maximize, MousePointer2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { graphLinks, graphNodes, nodeKindMeta, type GraphLink, type GraphNode } from "@/data/knowledge-graph";

type Shape = "circle" | "square" | "diamond" | "hexagon" | "rect";

interface SimNode extends SimulationNodeDatum {
  id: string;
  data: GraphNode;
  size: number;
  shape: Shape;
  color: string;
}
interface SimLink extends SimulationLinkDatum<SimNode> {
  data: GraphLink;
  kind: "ownership" | "guarantee" | "policy" | "normal";
}

const SPECIAL: Record<string, { shape: Shape; size: number; color: string }> = {
  founder: { shape: "diamond", size: 28, color: "var(--graph-document)" },
  institutional: { shape: "hexagon", size: 28, color: "var(--graph-ownership)" },
};

function shapeFor(n: GraphNode): { shape: Shape; size: number; color: string } {
  const special = SPECIAL[n.id];
  if (special) return special;
  switch (n.kind) {
    case "entity":
      return { shape: "circle", size: 40, color: nodeKindMeta.entity.token };
    case "ownership":
      return { shape: "square", size: 30, color: nodeKindMeta.ownership.token };
    case "policy":
      return { shape: "rect", size: 25, color: nodeKindMeta.policy.token };
    case "risk":
      return { shape: "circle", size: 24, color: nodeKindMeta.risk.token };
    case "document":
      return { shape: "square", size: 24, color: nodeKindMeta.document.token };
    case "financial":
      return { shape: "circle", size: 26, color: nodeKindMeta.financial.token };
    default:
      return { shape: "circle", size: 24, color: nodeKindMeta.agent.token };
  }
}

function linkKind(l: GraphLink, byId: Map<string, GraphNode>): SimLink["kind"] {
  if (l.emphasis === "guarantee") return "guarantee";
  const from = byId.get(l.from);
  const to = byId.get(l.to);
  if (from?.kind === "policy" || to?.kind === "policy") return "policy";
  if (from?.kind === "ownership" || to?.kind === "ownership") return "ownership";
  return "normal";
}

const LINK_STYLE: Record<SimLink["kind"], { stroke: string; width: number; dash?: string }> = {
  ownership: { stroke: "var(--graph-ownership)", width: 2.5 },
  guarantee: { stroke: "var(--graph-risk)", width: 3, dash: "7 5" },
  policy: { stroke: "var(--graph-policy)", width: 1.6, dash: "2 4" },
  normal: { stroke: "var(--color-border)", width: 1.4 },
};

function NodeShape({ n, glow }: { n: SimNode; glow: boolean }) {
  const s = n.size / 2;
  const common = {
    fill: n.color,
    stroke: "var(--color-surface)",
    strokeWidth: 2,
    style: glow ? { filter: `drop-shadow(0 0 8px ${n.color})` } : undefined,
  };
  switch (n.shape) {
    case "square":
      return <rect x={-s} y={-s} width={n.size} height={n.size} rx={4} {...common} />;
    case "rect":
      return <rect x={-s * 1.5} y={-s * 0.75} width={n.size * 1.5} height={n.size * 0.75} rx={3} {...common} />;
    case "diamond":
      return <polygon points={`0,${-s} ${s},0 0,${s} ${-s},0`} {...common} />;
    case "hexagon": {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${(s * Math.cos(a)).toFixed(1)},${(s * Math.sin(a)).toFixed(1)}`;
      }).join(" ");
      return <polygon points={pts} {...common} />;
    }
    default:
      return <circle r={s} {...common} />;
  }
}

export interface ForceGraphProps {
  highlight: string[];
  mode: "full" | "path";
  onModeChange: (m: "full" | "path") => void;
  onSelect: (n: GraphNode) => void;
  selectedId?: string | undefined;
}

export function ForceGraph({ highlight, mode, onModeChange, onSelect, selectedId }: ForceGraphProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 520, h: 420 });
  const [, setTick] = useState(0);
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const [panMode, setPanMode] = useState(false);
  const [hovered, setHovered] = useState<SimNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<SimLink | null>(null);

  const byId = useMemo(() => new Map(graphNodes.map((n) => [n.id, n])), []);

  const { nodes, links } = useMemo(() => {
    const nodes: SimNode[] = graphNodes.map((n) => ({
      id: n.id,
      data: n,
      x: n.x,
      y: n.y,
      ...shapeFor(n),
    }));
    const map = new Map(nodes.map((n) => [n.id, n]));
    const links: SimLink[] = graphLinks
      .filter((l) => map.has(l.from) && map.has(l.to))
      .map((l) => ({ source: map.get(l.from)!, target: map.get(l.to)!, data: l, kind: linkKind(l, byId) }));
    return { nodes, links };
  }, [byId]);

  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const rafRef = useRef<number | null>(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  const fitRef = useRef<() => void>(() => {});

  const run = useCallback((autoFit = false) => {
    const sim = simRef.current;
    if (!sim) return;
    let ticks = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = () => {
      sim.tick();
      setTick((t) => t + 1);
      ticks += 1;
      if (ticks < 500 && sim.alpha() > 0.005) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        if (autoFit) fitRef.current();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const sim = forceSimulation<SimNode, SimLink>(nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(100)
          .strength(0.5),
      )
      .force("charge", forceManyBody().strength(-500))
      .force("center", forceCenter(size.w / 2, size.h / 2))
      .force("collide", forceCollide<SimNode>().radius((d) => d.size / 2 + 22))
      .velocityDecay(0.8)
      .stop();
    simRef.current = sim;
    run(true);
    return () => {
      sim.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, run]);

  // Debounced resize observation
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let t: number | undefined;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      window.clearTimeout(t);
      t = window.setTimeout(() => setSize({ w: Math.max(240, r.width), h: Math.max(280, r.height) }), 100);
    });
    ro.observe(el);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.force("center", forceCenter(size.w / 2, size.h / 2));
    sim.alpha(0.5);
    run(true);
  }, [size, run]);

  const visibleIds = useMemo(
    () => new Set(mode === "path" && highlight.length ? highlight : graphNodes.map((n) => n.id)),
    [mode, highlight],
  );

  const fit = useCallback(() => {
    const vis = nodes.filter((n) => visibleIds.has(n.id));
    if (!vis.length) return;
    const xs = vis.map((n) => n.x ?? 0);
    const ys = vis.map((n) => n.y ?? 0);
    const pad = 60;
    const minX = Math.min(...xs) - pad;
    const maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad;
    const maxY = Math.max(...ys) + pad;
    const k = Math.min(size.w / (maxX - minX), size.h / (maxY - minY), 1.6);
    setView({
      k,
      x: size.w / 2 - ((minX + maxX) / 2) * k,
      y: size.h / 2 - ((minY + maxY) / 2) * k,
    });
  }, [nodes, visibleIds, size]);

  fitRef.current = fit;

  // Fit when the visible set changes
  useEffect(() => {
    const id = window.setTimeout(fit, 350);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIds]);

  function zoomBy(factor: number) {
    setView((v) => {
      const k = Math.min(3, Math.max(0.25, v.k * factor));
      const cx = size.w / 2;
      const cy = size.h / 2;
      const r = k / v.k;
      return { k, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r };
    });
  }

  // Non-passive wheel zoom
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      setView((v) => {
        const k = Math.min(3, Math.max(0.25, v.k * Math.exp(-dy * 0.0015)));
        const r = k / v.k;
        return { k, x: px - (px - v.x) * r, y: py - (py - v.y) * r };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function startNodeDrag(e: React.PointerEvent, n: SimNode) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const rect = wrapRef.current!.getBoundingClientRect();
    const sim = simRef.current!;
    sim.alphaTarget(0.3);
    run();
    const move = (ev: PointerEvent) => {
      const v = viewRef.current;
      n.fx = (ev.clientX - rect.left - v.x) / v.k;
      n.fy = (ev.clientY - rect.top - v.y) / v.k;
    };
    const up = () => {
      n.fx = null;
      n.fy = null;
      sim.alphaTarget(0).alpha(0.35);
      run();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startPan(e: React.PointerEvent) {
    const sx = e.clientX;
    const sy = e.clientY;
    const start = viewRef.current;
    const move = (ev: PointerEvent) =>
      setView({ k: start.k, x: start.x + (ev.clientX - sx), y: start.y + (ev.clientY - sy) });
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function focusNode(n: SimNode) {
    const k = 1.8;
    setView({ k, x: size.w / 2 - (n.x ?? 0) * k, y: size.h / 2 - (n.y ?? 0) * k });
  }

  function resetLayout() {
    nodes.forEach((n) => {
      n.fx = null;
      n.fy = null;
    });
    simRef.current?.alpha(1);
    run();
    window.setTimeout(fit, 400);
  }

  const btn =
    "inline-flex size-7 items-center justify-center rounded-md border border-input bg-surface text-muted-foreground transition-colors hover:border-accent hover:text-foreground";

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex rounded-md border border-input p-0.5">
          {(["full", "path"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {m === "full" ? "Full network" : "Query path"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button className={btn} onClick={resetLayout} title="Reset layout">
            <RotateCcw className="size-3.5" />
          </button>
          <button className={btn} onClick={fit} title="Fit to view">
            <Maximize className="size-3.5" />
          </button>
          <button className={btn} onClick={() => zoomBy(1.25)} title="Zoom in">
            <ZoomIn className="size-3.5" />
          </button>
          <button className={btn} onClick={() => zoomBy(1 / 1.25)} title="Zoom out">
            <ZoomOut className="size-3.5" />
          </button>
          <button
            className={`${btn} ${panMode ? "border-accent text-accent" : ""}`}
            onClick={() => setPanMode((p) => !p)}
            title={panMode ? "Pan mode on" : "Pan mode off"}
          >
            {panMode ? <Hand className="size-3.5" /> : <MousePointer2 className="size-3.5" />}
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative min-h-[24rem] flex-1 overflow-hidden"
        style={{ cursor: panMode ? "grab" : "default", touchAction: "none" }}
        onPointerDown={(e) => {
          if (panMode || e.button === 1) startPan(e);
        }}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${size.w} ${size.h}`}>
          <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            {links.map((l) => {
              const s = l.source as SimNode;
              const t = l.target as SimNode;
              if (!visibleIds.has(s.id) || !visibleIds.has(t.id)) return null;
              const on = highlight.includes(s.id) && highlight.includes(t.id);
              const style = LINK_STYLE[l.kind];
              return (
                <g
                  key={`${s.id}-${t.id}`}
                  opacity={highlight.length === 0 || on ? 1 : 0.2}
                  className="transition-opacity duration-300"
                  onMouseEnter={() => setHoveredLink(l)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke="transparent"
                    strokeWidth={12}
                    style={{ cursor: "pointer" }}
                  />
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={style.stroke}
                    strokeWidth={style.width}
                    strokeDasharray={style.dash}
                    pointerEvents="none"
                  />
                  {(on || hoveredLink === l) && (
                    <text
                      x={((s.x ?? 0) + (t.x ?? 0)) / 2}
                      y={((s.y ?? 0) + (t.y ?? 0)) / 2 - 5}
                      textAnchor="middle"
                      fontSize={9}
                      className="fill-muted-foreground"
                      pointerEvents="none"
                    >
                      {l.data.label}
                    </text>
                  )}
                </g>
              );
            })}

            {nodes.map((n) => {
              if (!visibleIds.has(n.id)) return null;
              const dim = highlight.length > 0 && !highlight.includes(n.id);
              const glow = hovered?.id === n.id || selectedId === n.id || highlight.includes(n.id);
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x ?? 0},${n.y ?? 0})`}
                  opacity={dim ? 0.25 : 1}
                  className="transition-opacity duration-300"
                  style={{ cursor: panMode ? "grab" : "pointer" }}
                  onPointerDown={(e) => {
                    if (!panMode) startNodeDrag(e, n);
                  }}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelect(n.data)}
                  onDoubleClick={() => focusNode(n)}
                >
                  {glow && (
                    <circle r={n.size / 2 + 8} fill={n.color} opacity={0.16}>
                      <animate
                        attributeName="r"
                        values={`${n.size / 2 + 4};${n.size / 2 + 12};${n.size / 2 + 4}`}
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  <NodeShape n={n} glow={hovered?.id === n.id} />
                  <text
                    y={n.size / 2 + 13}
                    textAnchor="middle"
                    fontSize={n.data.kind === "entity" ? 12 : 10}
                    className={n.data.kind === "entity" ? "fill-foreground font-semibold" : "fill-muted-foreground"}
                    pointerEvents="none"
                  >
                    {n.data.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute z-10 w-56 -translate-x-1/2 rounded-md border border-border bg-popover p-3 text-xs shadow-lg"
            style={{
              left: Math.min(size.w - 40, Math.max(40, (hovered.x ?? 0) * view.k + view.x)),
              top: (hovered.y ?? 0) * view.k + view.y + hovered.size / 2 + 12,
            }}
          >
            <div className="font-semibold text-foreground">{hovered.data.label}</div>
            <div className="label-caps mt-0.5">{nodeKindMeta[hovered.data.kind].label}</div>
            <p className="mt-1.5 text-muted-foreground">{hovered.data.detail}</p>
          </div>
        )}
        {hoveredLink && !hovered && (
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-md border border-border bg-popover px-3 py-1.5 text-xs shadow-lg">
            <span className="font-medium">{(hoveredLink.source as SimNode).data.label}</span>{" "}
            <span className="text-muted-foreground">{hoveredLink.data.label}</span>{" "}
            <span className="font-medium">{(hoveredLink.target as SimNode).data.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
