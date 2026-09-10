import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, Maximize2, Pin, Send, Share2 } from "lucide-react";
import { Panel } from "@/components/primitives";
import { ForceGraph } from "@/components/force-graph";
import {
  chatAnswers,
  nodeKindMeta,
  seedMessages,
  suggestedQuestions,
  type GraphNode,
  type NodeKind,
} from "@/data/knowledge-graph";

const NodeDetail = lazy(() => import("@/components/node-detail"));

export const Route = createFileRoute("/cases/$caseId/knowledge")({
  head: () => ({
    meta: [
      { title: "Chat & Knowledge Graph | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content:
          "Ask the credit fabric about ownership, guarantees, policy and covenants, and watch the force-directed knowledge graph highlight the evidence path.",
      },
      { property: "og:title", content: "Chat & Knowledge Graph | Apexon Credit Intelligence Fabric" },
      {
        property: "og:description",
        content: "Grounded credit Q&A paired with an interactive entity, policy and risk knowledge graph.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KnowledgeWorkspace,
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  detail?: string | undefined;
  time: string;
  highlight?: string[];
}

const SPLIT_KEY = "cif-knowledge-split";
const MIN_LEFT = 30;
const MAX_LEFT = 75; // right pane keeps a 25% minimum

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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Draggable split (session-persisted)
  const [leftPct, setLeftPct] = useState(60);
  const [dragging, setDragging] = useState(false);
  const splitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = Number(window.sessionStorage.getItem(SPLIT_KEY));
    if (stored >= MIN_LEFT && stored <= MAX_LEFT) setLeftPct(stored);
  }, []);

  const startResize = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    const move = (ev: PointerEvent) => {
      const rect = splitRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.min(MAX_LEFT, Math.max(MIN_LEFT, pct)));
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(SPLIT_KEY, String(Math.round(leftPct)));
  }, [leftPct]);

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

  const paneTransition = dragging ? "none" : "width 300ms cubic-bezier(0.4,0,0.2,1)";
  const legendKinds = useMemo(() => Object.keys(nodeKindMeta) as NodeKind[], []);

  return (
    <div ref={splitRef} className="flex animate-in fade-in duration-500 items-stretch">
      {/* Chat pane */}
      <div className="min-w-0" style={{ width: `${leftPct}%`, transition: paneTransition }}>
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
          <div className="flex h-[38rem] flex-col">
            <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[85%] min-w-0 ${m.role === "user" ? "text-right" : ""}`}>
                    <div className="label-caps mb-1 whitespace-nowrap">
                      {m.role === "user" ? "You" : "Credit fabric"} · {m.time}
                    </div>
                    <div
                      className={`rounded-lg px-3.5 py-2.5 text-sm leading-relaxed break-words ${
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

            <div className="shrink-0 border-t border-border p-4">
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
                  className="h-10 min-w-0 flex-1 rounded-md border border-input bg-surface px-3 text-sm outline-none focus:border-ring"
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
              <div className="max-h-24 overflow-y-auto flex flex-wrap gap-2">
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
          </div>
        </Panel>
      </div>

      {/* Divider */}
      <div
        role="separator"
        aria-orientation="vertical"
        onPointerDown={startResize}
        onDoubleClick={() => setLeftPct(60)}
        className="group relative mx-1.5 flex w-3 shrink-0 select-none items-center justify-center"
        style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      >
        <span
          className={`h-full w-px rounded-full shadow-sm transition-all duration-300 ${
            dragging ? "w-[3px] bg-accent" : "bg-border group-hover:w-[3px] group-hover:bg-accent/60"
          }`}
        />
      </div>

      {/* Knowledge graph pane */}
      <div className="min-w-0 flex-1 space-y-4" style={{ transition: paneTransition }}>
        <Panel title="Knowledge graph" description={mode === "path" ? "Query-relevant path" : "Full network"} bodyClassName="p-0">
          <div className="h-[38rem]">
            <ForceGraph
              highlight={highlight}
              mode={mode}
              onModeChange={setMode}
              onSelect={setSelected}
              selectedId={selected?.id}
            />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border px-5 py-3">
            {legendKinds.map((k) => (
              <span key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2.5 rounded-full" style={{ background: nodeKindMeta[k].token }} />
                {nodeKindMeta[k].label}
              </span>
            ))}
          </div>
        </Panel>

        {selected && (
          <Suspense fallback={<Panel title="Node detail" description="Loading…">{null}</Panel>}>
            <NodeDetail node={selected} inPath={highlight.includes(selected.id)} onClose={() => setSelected(null)} />
          </Suspense>
        )}
        {!selected && (
          <Panel title="Node detail" description="Select a node on the graph">
            <p className="text-xs text-muted-foreground">
              Click any node to inspect the underlying entity, metric, rule or document. Drag nodes to rearrange, double-click to focus.
            </p>
          </Panel>
        )}

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
