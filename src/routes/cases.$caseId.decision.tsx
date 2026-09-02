import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, CircleDot, Circle, ThumbsUp, ThumbsDown, PenLine } from "lucide-react";
import { DataRow, Panel, Pill } from "@/components/primitives";
import { approvalChain, currency, getCase, recommendation } from "@/data/mock";

export const Route = createFileRoute("/cases/$caseId/decision")({
  head: () => ({
    meta: [
      { title: "Underwriter Recommendation & Decision | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content: "Analyst recommendation, conditions, approval routing and credit officer decision for the commercial credit file.",
      },
      { property: "og:title", content: "Underwriter Recommendation & Decision | Apexon Credit Intelligence Fabric" },
      { property: "og:description", content: "Recommendation with conditions, approval chain and human-in-the-loop decision." },
    ],
  }),
  component: Decision,
});

const outcomes = ["Approve", "Approve with conditions", "Refer to committee", "Decline"];

function Decision() {
  const { caseId } = Route.useParams();
  const c = getCase(caseId);
  const [outcome, setOutcome] = useState(recommendation.outcome);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Panel
          title="System recommendation"
          description="Synthesised from deterministic results and the three MVP agents"
          action={<Pill tone="warning">{recommendation.outcome}</Pill>}
        >
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="label-caps">Proposed structure</div>
              <p className="mt-1 text-sm font-medium">{recommendation.structure}</p>
            </div>
            <div>
              <div className="label-caps">Risk rating</div>
              <p className="num mt-1 text-sm font-medium">{recommendation.riskRating}</p>
            </div>
            <div>
              <div className="label-caps">Model confidence</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${recommendation.confidence}%` }} />
                </div>
                <span className="num text-sm font-medium">{recommendation.confidence}%</span>
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{recommendation.rationale}</p>
        </Panel>

        <div className="grid gap-6 md:grid-cols-2">
          <Panel title="Credit strengths" bodyClassName="p-5">
            <ul className="space-y-2.5">
              {recommendation.strengths.map((s) => (
                <li key={s} className="flex gap-2.5 text-sm">
                  <ThumbsUp className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Credit concerns" bodyClassName="p-5">
            <ul className="space-y-2.5">
              {recommendation.concerns.map((s) => (
                <li key={s} className="flex gap-2.5 text-sm">
                  <ThumbsDown className="mt-0.5 size-4 shrink-0 text-warning" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel title="Proposed conditions" description="Attached to the approval and tracked to funding" bodyClassName="p-0">
          <ul>
            {recommendation.conditions.map((cond, i) => (
              <li key={cond} className="flex items-start gap-3 border-b border-border/60 px-5 py-3 last:border-0">
                <span className="num mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm">{cond}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Underwriter decision" description="Human-in-the-loop — the fabric recommends, the underwriter decides">
          <div className="flex flex-wrap gap-2">
            {outcomes.map((o) => (
              <button
                key={o}
                onClick={() => setOutcome(o)}
                className={`rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                  outcome === o
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-surface text-muted-foreground hover:bg-muted"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <textarea
            rows={4}
            className="mt-4 w-full rounded-md border border-input bg-surface p-3 text-sm outline-none focus:border-ring"
            defaultValue="Concur with the recommendation. Coverage headroom is thin, so conditions 3 and 4 are required rather than optional. Exceptions CP-118 and CP-152 approved with mitigants as documented."
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <PenLine className="size-4" /> Submit decision
            </button>
            <button className="rounded-md border border-input bg-surface px-4 py-2 text-sm font-medium hover:bg-muted">
              Save draft
            </button>
            <span className="num ml-auto text-xs text-muted-foreground">
              {c.id} · {currency(c.amount)} · routed to Credit Officer II
            </span>
          </div>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel title="Approval chain" description="Single approval path (Phase 1)">
          <ol className="space-y-4">
            {approvalChain.map((a) => (
              <li key={a.role} className="flex gap-3">
                {a.status === "Completed" ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                ) : a.status === "In progress" ? (
                  <CircleDot className="mt-0.5 size-4 shrink-0 text-accent" />
                ) : (
                  <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                )}
                <div>
                  <div className="text-sm font-medium">{a.role}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.name} · {a.date}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Decision summary">
          <DataRow label="Obligor" value={c.borrower} />
          <DataRow label="Facility" value={c.facility} />
          <DataRow label="Amount" value={currency(c.amount)} />
          <DataRow label="Tenor" value={`${c.tenorMonths} months`} />
          <DataRow label="Pricing" value={c.pricing} />
          <DataRow label="Collateral" value={c.collateral} />
          <DataRow label="Selected outcome" value={<Pill tone="warning">{outcome}</Pill>} />
        </Panel>
      </div>
    </div>
  );
}
