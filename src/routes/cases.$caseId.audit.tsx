import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Cog, Cpu, Download, User } from "lucide-react";
import { Panel, Pill } from "@/components/primitives";
import { auditTrail } from "@/data/mock";

export const Route = createFileRoute("/cases/$caseId/audit")({
  head: () => ({
    meta: [
      { title: "Audit Trail | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content: "Immutable, engine-attributed audit trail of every extraction, calculation, policy run, agent insight and human action.",
      },
      { property: "og:title", content: "Audit Trail | Apexon Credit Intelligence Fabric" },
      { property: "og:description", content: "Every recommendation traceable back to the facts and policy that produced it." },
    ],
  }),
  component: Audit,
});

const actorIcon = {
  Human: User,
  Engine: Cog,
  Agent: Bot,
  System: Cpu,
};

const filters = ["All", "Human", "Engine", "Agent", "System"];

function Audit() {
  const [filter, setFilter] = useState("All");
  const entries = filter === "All" ? auditTrail : auditTrail.filter((e) => e.actorType === filter);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Events recorded", value: `${auditTrail.length}` },
          { label: "Human actions", value: `${auditTrail.filter((e) => e.actorType === "Human").length}` },
          { label: "Engine & agent events", value: `${auditTrail.filter((e) => e.actorType !== "Human").length}` },
          { label: "Integrity", value: "Verified" },
        ].map((s) => (
          <div key={s.label} className="panel p-4">
            <div className="label-caps">{s.label}</div>
            <div className="num mt-1.5 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <Panel
        title="Full audit trail"
        description="Workflow Intelligence — append-only event log with content hashes"
        bodyClassName="p-0"
        action={
          <button className="inline-flex items-center gap-2 rounded-md border border-input bg-surface px-3 py-1.5 text-xs font-medium hover:bg-muted">
            <Download className="size-3.5" /> Export for examiners
          </button>
        }
      >
        <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-surface text-muted-foreground hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <ol className="px-5 py-2">
          {entries.map((e) => {
            const Icon = actorIcon[e.actorType];
            return (
              <li key={e.id} className="flex gap-4 border-b border-border/60 py-4 last:border-0">
                <div className="flex flex-col items-center">
                  <span className="flex size-8 items-center justify-center rounded-full border border-border bg-surface-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{e.action}</span>
                    <Pill tone="neutral">{e.engine}</Pill>
                    <span className="num ml-auto text-xs text-muted-foreground">{e.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{e.detail}</p>
                  <div className="num mt-1.5 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span>{e.id}</span>
                    <span>
                      {e.actor} · {e.actorType}
                    </span>
                    <span>hash {e.hash}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}
