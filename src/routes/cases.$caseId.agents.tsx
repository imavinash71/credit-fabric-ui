import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BrainCircuit, Quote, Send } from "lucide-react";
import { Panel, Pill, toneForResult } from "@/components/primitives";
import { agentInsights, agentRoster } from "@/data/mock";

export const Route = createFileRoute("/cases/$caseId/agents")({
  head: () => ({
    meta: [
      { title: "AI Agent Insights | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content: "Cognitive Intelligence domain agents explain the spread, policy exposure and KYC posture with cited evidence.",
      },
      { property: "og:title", content: "AI Agent Insights | Apexon Credit Intelligence Fabric" },
      { property: "og:description", content: "Domain-agent reasoning over deterministic facts, with evidence and confidence." },
    ],
  }),
  component: Agents,
});

const filters = ["All agents", "Financial agent", "Credit policy agent", "Compliance / KYC agent"];

function Agents() {
  const [filter, setFilter] = useState(filters[0]!);
  const visible = filter === filters[0]! ? agentInsights : agentInsights.filter((a) => a.agent === filter);

  return (
    <div className="grid gap-6 xl:grid-cols-4">
      <div className="space-y-4 xl:col-span-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-surface text-muted-foreground hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {visible.map((a) => (
          <article key={a.id} className="panel p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Pill tone="primary">
                <BrainCircuit className="size-3.5" /> {a.agent}
              </Pill>
              <Pill tone={toneForResult(a.severity)}>{a.severity}</Pill>
              <span className="num ml-auto text-xs text-muted-foreground">
                Confidence {a.confidence}% · {a.generated}
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold">{a.headline}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.narrative}</p>
            <div className="mt-4 rounded-md border border-border bg-surface-muted p-3.5">
              <div className="label-caps mb-2 flex items-center gap-1.5">
                <Quote className="size-3" /> Grounded in
              </div>
              <ul className="space-y-1">
                {a.evidence.map((e) => (
                  <li key={e} className="text-xs text-muted-foreground">
                    • {e}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-md border border-input bg-surface px-3 py-1.5 text-xs font-medium hover:bg-muted">
                Accept into memo
              </button>
              <button className="rounded-md border border-input bg-surface px-3 py-1.5 text-xs font-medium hover:bg-muted">
                Dismiss
              </button>
              <button className="rounded-md border border-input bg-surface px-3 py-1.5 text-xs font-medium hover:bg-muted">
                Ask follow-up
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="space-y-6">
        <Panel title="Agent roster" description="Phase 1 activates three agents" bodyClassName="p-0">
          <ul>
            {agentRoster.map((a) => (
              <li key={a.name} className="border-b border-border/60 px-5 py-3 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{a.name}</span>
                  <Pill tone={a.status === "Active" ? "success" : "neutral"}>{a.status}</Pill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.scope}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Ask the fabric" description="Answers cite spread lines, policy clauses and documents">
          <div className="space-y-3">
            <div className="rounded-md bg-surface-muted p-3 text-xs text-muted-foreground">
              Try: “What drives the DSCR decline?” or “Which exceptions have precedent?”
            </div>
            <div className="flex gap-2">
              <input
                className="h-9 flex-1 rounded-md border border-input bg-surface px-3 text-sm outline-none focus:border-ring"
                placeholder="Ask about this credit file…"
              />
              <button className="rounded-md bg-primary px-3 text-primary-foreground hover:bg-primary/90">
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
