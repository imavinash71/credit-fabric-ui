import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Maximize2, Pin, Send, Share2 } from "lucide-react";
import { Panel, Pill } from "@/components/primitives";
import {
  chatAnswers,
  graphLinks,
  graphNodes,
  nodeKindMeta,
  seedMessages,
  suggestedQuestions,
  type GraphNode,
  type NodeKind,
} from "@/data/knowledge-graph";

export const Route = createFileRoute("/cases/$caseId/knowledge")({
  head: () => ({
    meta: [
      { title: "Chat & Knowledge Graph | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content:
          "Ask the credit fabric about ownership, guarantees, policy and covenants, and watch the knowledge graph highlight the evidence path.",
      },
      { property: "og:title", content: "Chat & Knowledge Graph | Apexon Credit Intelligence Fabric" },
      {
        property: "og:description",
        content: "Grounded credit Q&A paired with an interactive entity, policy and risk knowledge graph.",
      },
    ],
  }),
  component: KnowledgeWorkspace,
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  detail?: string;
  time: string;
  highlight?: string[];
}

const VIEW_W = 700;
const VIEW_H = 560;

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function matchAnswer(q: string) {
  const words = q.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3);
  let best = chatAnswers[0]!;
  let bestScore = 0;
  for (const a of chatAnswers) {
    const target = a.question.toLowerCase();
    const score = words.reduce((acc, w) => acc + (target.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return { answer: best, matched: bestScore > 0 };
}

function KnowledgeWorkspace() {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages as ChatMessage[]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [mode, setMode] = useState<"full" | "path">("full");
  const [highlight, setHighlight] = useState<string[]>(seedMessages[2]!.highlight ?? []);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q, time: nowTime() }]);
    setLoading(true);
    window.setTimeout(() => {
      const { answer, matched } = matchAnswer(q);
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: matched
            ? answer.answer
            : "I don't have a grounded answer for that in this credit file yet. Try one of the suggested questions — those are backed by extracted documents, spreads and policy results.",
          detail: matched ? answer.detail : undefined,
          highlight: matched ? answer.highlight : [],
          time: nowTime(),
        },
      ]);
      setHighlight(matched ? answer.highlight : []);
      setLoading(false);
    }, 1100);
  }

  function exportTranscript() {
    const body = messages
      .map((m) => `[${m.time}] ${m.role === "user" ? "Underwriter" : "Credit fabric"}: ${m.text}`)
      .join("\n\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "credit-fabric-transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const visibleNodes = useMemo(
    () => (mode === "path" && highlight.length ? graphNodes.filter((n) => highlight.includes(n.id)) : graphNodes),
    [mode, highlight],
  );
  const visibleIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);
  const visibleLinks = graphLinks.filter((l) => visibleIds.has(l.from) && visibleIds.has(l.to));
  const nodeById = useMemo(() => new Map(graphNodes.map((n) => [n.id, n])), []);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Chat */}
      <div className="lg:col-span-3">
        <Panel
          title="Ask the credit fabric"
          description="Answers are grounded in extracted documents, spreads and policy results"
          bodyClassName="p-0"
          action={
            <button
              onClick={exportTranscript}
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-surface px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
            >
              <Download className="size-3.5" /> Export transcript
            </button>
          }
        >
          <div ref={scrollRef} className="h-[26rem] space-y-4 overflow-y-auto px-5 py-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] ${m.role === "user" ? "text-right" : ""}`}>
                  <div className="label-caps mb-1">
                    {m.role === "user" ? "You" : "Credit fabric"} · {m.time}
                  </div>
                  <div
                    className={`rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface-muted text-foreground"
                    }`}
                  >
                    {m.text}
                    {expanded.includes(m.id) && m.detail && (
                      <p className="mt-3 border-t border-border/70 pt-3 text-xs text-muted-foreground">{m.detail}</p>
                    )}
                  </div>
                  {m.role === "assistant" && m.detail && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          setExpanded((e) => (e.includes(m.id) ? e.filter((x) => x !== m.id) : [...e, m.id]))
                        }
                        className="inline-flex items-center gap-1.5 rounded-md border border-input bg-surface px-2.5 py-1 text-xs font-medium hover:bg-muted"
                      >
                        <Maximize2 className="size-3" />
                        {expanded.includes(m.id) ? "Hide full analysis" : "View full analysis"}
                      </button>
                      <button
                        onClick={() => setPinned((p) => (p.includes(m.id) ? p : [...p, m.id]))}
                        className="inline-flex items-center gap-1.5 rounded-md border border-input bg-surface px-2.5 py-1 text-xs font-medium hover:bg-muted"
                      >
                        <Pin className="size-3" /> {pinned.includes(m.id) ? "Pinned" : "Pin to dashboard"}
                      </button>
                      {m.highlight && m.highlight.length > 0 && (
                        <button
                          onClick={() => {
                            setHighlight(m.highlight ?? []);
                            setMode("path");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-surface px-2.5 py-1 text-xs font-medium hover:bg-muted"
                        >
                          <Share2 className="size-3" /> Show on graph
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.1s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-accent" />
                Retrieving evidence and traversing the graph…
              </div>
            )}
          </div>

          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-10 flex-1 rounded-md border border-input bg-surface px-3 text-sm outline-none focus:border-ring"
                placeholder="Ask about ownership, guarantees, covenants…"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary px-3.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </form>
            <div className="label-caps mt-4 mb-2">Suggested questions</div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="rounded-full border border-input bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Knowledge graph */}
      <div className="space-y-4 lg:col-span-2">
        <Panel
          title="Knowledge graph"
          description={mode === "path" ? "Query-relevant path" : "Full network"}
          bodyClassName="p-0"
          action={
            <div className="flex rounded-md border border-input p-0.5">
              {(["full", "path"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {m === "full" ? "Full network" : "Query path"}
                </button>
              ))}
            </div>
          }
        >
          <div className="relative">
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-[26rem] w-full">
              {visibleLinks.map((l) => {
                const a = nodeById.get(l.from)!;
                const b = nodeById.get(l.to)!;
                const on = highlight.includes(l.from) && highlight.includes(l.to);
                return (
                  <g key={`${l.from}-${l.to}`} className="transition-opacity duration-500" opacity={on ? 1 : 0.35}>
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={l.emphasis === "guarantee" ? "var(--graph-risk)" : "var(--color-border)"}
                      strokeWidth={l.emphasis === "guarantee" ? 2.5 : 1.5}
                      strokeDasharray={l.emphasis === "guarantee" ? "6 4" : undefined}
                    />
                    {on && (
                      <text
                        x={(a.x + b.x) / 2}
                        y={(a.y + b.y) / 2 - 4}
                        textAnchor="middle"
                        className="fill-muted-foreground"
                        fontSize={10}
                      >
                        {l.label}
                      </text>
                    )}
                  </g>
                );
              })}
              {visibleNodes.map((n) => {
                const on = highlight.length === 0 || highlight.includes(n.id);
                const isCore = n.kind === "entity";
                return (
                  <g
                    key={n.id}
                    className="cursor-pointer transition-all duration-500"
                    opacity={on ? 1 : 0.3}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(n)}
                  >
                    {on && highlight.includes(n.id) && (
                      <circle cx={n.x} cy={n.y} r={isCore ? 26 : 20} fill={nodeKindMeta[n.kind].token} opacity={0.18}>
                        <animate attributeName="r" values={`${isCore ? 22 : 16};${isCore ? 30 : 24};${isCore ? 22 : 16}`} dur="2.4s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isCore ? 17 : 11}
                      fill={nodeKindMeta[n.kind].token}
                      stroke="var(--color-surface)"
                      strokeWidth={2}
                      className="transition-all duration-500"
                    />
                    <text
                      x={n.x}
                      y={n.y + (isCore ? 32 : 25)}
                      textAnchor="middle"
                      fontSize={isCore ? 13 : 11}
                      className={isCore ? "fill-foreground font-semibold" : "fill-muted-foreground"}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {hovered && (
              <div
                className="pointer-events-none absolute z-10 w-56 -translate-x-1/2 rounded-md border border-border bg-popover p-3 text-xs shadow-lg"
                style={{ left: `${(hovered.x / VIEW_W) * 100}%`, top: `${(hovered.y / VIEW_H) * 100 + 6}%` }}
              >
                <div className="font-semibold text-foreground">{hovered.label}</div>
                <div className="label-caps mt-0.5">{nodeKindMeta[hovered.kind].label}</div>
                <p className="mt-1.5 text-muted-foreground">{hovered.detail}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border px-5 py-3">
            {(Object.keys(nodeKindMeta) as NodeKind[]).map((k) => (
              <span key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2.5 rounded-full" style={{ background: nodeKindMeta[k].token }} />
                {nodeKindMeta[k].label}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Node detail" description={selected ? nodeKindMeta[selected.kind].label : "Select a node on the graph"}>
          {selected ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: nodeKindMeta[selected.kind].token }} />
                <h3 className="text-sm font-semibold">{selected.label}</h3>
                {highlight.includes(selected.id) && <Pill tone="info">In query path</Pill>}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selected.detail}</p>
              <dl className="mt-3">
                {selected.facts.map((f) => (
                  <div key={f.label} className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2 last:border-0">
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd className="text-right text-sm font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Click any node to inspect the underlying entity, metric, rule or document.
            </p>
          )}
        </Panel>

        {pinned.length > 0 && (
          <Panel title="Pinned to dashboard" description={`${pinned.length} finding${pinned.length > 1 ? "s" : ""}`}>
            <ul className="space-y-2">
              {messages
                .filter((m) => pinned.includes(m.id))
                .map((m) => (
                  <li key={m.id} className="line-clamp-2 text-xs text-muted-foreground">
                    • {m.text}
                  </li>
                ))}
            </ul>
          </Panel>
        )}
      </div>
    </div>
  );
}
