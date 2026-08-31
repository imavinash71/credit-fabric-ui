import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, CheckCircle2, CircleDot, Circle } from "lucide-react";
import { DataRow, Panel, Pill, toneForResult } from "@/components/primitives";
import { agentInsights, currency, getCase, policyChecks, ratios } from "@/data/mock";

export const Route = createFileRoute("/cases/$caseId/")({
  head: () => ({
    meta: [
      { title: "Credit Case | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content: "Commercial credit application detail: request structure, obligor profile, workflow position and key findings.",
      },
      { property: "og:title", content: "Credit Case | Apexon Credit Intelligence Fabric" },
      { property: "og:description", content: "Full commercial credit application file with structure, obligor profile and findings." },
    ],
  }),
  component: CaseOverview,
});

const stages = ["Intake", "Spreading", "Policy & KYC", "Analyst Review", "Credit Officer", "Decided"];

function CaseOverview() {
  const { caseId } = Route.useParams();
  const c = getCase(caseId);
  const currentIndex = stages.indexOf(c.stage);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Panel title="Workflow position" description="Single approval path with full audit trail">
          <ol className="flex flex-wrap items-center gap-y-4">
            {stages.map((s, i) => (
              <li key={s} className="flex items-center">
                <div className="flex items-center gap-2">
                  {i < currentIndex ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : i === currentIndex ? (
                    <CircleDot className="size-4 text-accent" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground/50" />
                  )}
                  <span className={`text-xs ${i <= currentIndex ? "font-medium text-foreground" : "text-muted-foreground"}`}>{s}</span>
                </div>
                {i < stages.length - 1 && <ArrowRight className="mx-3 size-3.5 text-muted-foreground/40" />}
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Facility request" description="As submitted by the relationship manager">
          <div className="grid gap-x-10 sm:grid-cols-2">
            <div>
              <DataRow label="Facility type" value={c.facility} />
              <DataRow label="Requested amount" value={currency(c.amount)} />
              <DataRow label="Tenor" value={`${c.tenorMonths} months`} />
              <DataRow label="Indicative pricing" value={c.pricing} />
            </div>
            <div>
              <DataRow label="Purpose" value={c.purpose} />
              <DataRow label="Collateral" value={c.collateral} />
              <DataRow label="Existing exposure" value={currency(c.existingExposure)} />
              <DataRow label="Post-approval exposure" value={currency(c.amount + c.existingExposure)} />
            </div>
          </div>
        </Panel>

        <Panel title="Key findings" description="Deterministic thresholds and cognitive summaries at a glance" bodyClassName="p-0">
          <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="p-5">
              <div className="label-caps mb-3">Ratios against policy</div>
              <ul className="space-y-2.5">
                {ratios.slice(0, 4).map((r) => (
                  <li key={r.name} className="flex items-center justify-between gap-3">
                    <span className="text-sm">{r.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="num text-sm font-medium">{r.ttm}</span>
                      <Pill tone={toneForResult(r.status)}>{r.status}</Pill>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/cases/$caseId/spreading"
                params={{ caseId }}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                Open spreading & ratios <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="p-5">
              <div className="label-caps mb-3">Open policy items</div>
              <ul className="space-y-2.5">
                {policyChecks
                  .filter((p) => p.result !== "Pass")
                  .map((p) => (
                    <li key={p.id} className="flex items-start justify-between gap-3">
                      <span className="text-sm">
                        {p.rule}
                        <span className="block text-xs text-muted-foreground">{p.reference}</span>
                      </span>
                      <Pill tone={toneForResult(p.result)}>{p.result}</Pill>
                    </li>
                  ))}
              </ul>
              <Link
                to="/cases/$caseId/policy"
                params={{ caseId }}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                Open policy & KYC <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel title="Obligor profile">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <div className="text-sm font-medium">{c.borrower}</div>
              <div className="text-xs text-muted-foreground">Delaware corporation · est. 2004</div>
            </div>
          </div>
          <DataRow label="Industry" value={c.industry} />
          <DataRow label="NAICS" value={c.naics} />
          <DataRow label="Region" value={c.region} />
          <DataRow label="Relationship since" value="2012" />
          <DataRow label="Relationship manager" value={c.relationshipManager} />
          <DataRow label="Assigned analyst" value={c.analyst} />
          <DataRow label="Submitted" value={c.submitted} />
        </Panel>

        <Panel title="Agent summary" description="MVP roster: Financial, Credit policy, Compliance/KYC" bodyClassName="p-0">
          <ul>
            {agentInsights.slice(0, 3).map((a) => (
              <li key={a.id} className="border-b border-border/60 px-5 py-3.5 last:border-0">
                <div className="label-caps">{a.agent}</div>
                <div className="mt-1 text-sm font-medium">{a.headline}</div>
                <div className="mt-1 num text-[11px] text-muted-foreground">Confidence {a.confidence}%</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
