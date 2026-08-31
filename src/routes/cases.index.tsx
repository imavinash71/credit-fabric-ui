import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter, Plus } from "lucide-react";
import { PageHeading, Panel, Pill, toneForResult } from "@/components/primitives";
import { cases, currency } from "@/data/mock";

export const Route = createFileRoute("/cases/")({
  head: () => ({
    meta: [
      { title: "Credit Cases | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content: "All commercial credit applications in the pipeline with stage, risk rating, completeness and open exceptions.",
      },
      { property: "og:title", content: "Credit Cases | Apexon Credit Intelligence Fabric" },
      { property: "og:description", content: "Commercial credit application pipeline with stage, risk and exception tracking." },
    ],
  }),
  component: CaseList,
});

function CaseList() {
  return (
    <>
      <PageHeading
        eyebrow="Workflow Intelligence"
        title="Credit cases"
        description="Every commercial application currently in the underwriting pipeline."
        actions={
          <>
            <button className="inline-flex items-center gap-2 rounded-md border border-input bg-surface px-3.5 py-2 text-sm font-medium hover:bg-muted">
              <Filter className="size-4" /> Filters
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="size-4" /> New case
            </button>
          </>
        }
      />

      <Panel bodyClassName="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {["Case", "Borrower", "Amount", "Stage", "Risk rating", "Analyst", "Completeness", "Exceptions"].map((h) => (
                <th key={h} className="label-caps px-5 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-surface-muted">
                <td className="px-5 py-3.5">
                  <Link to="/cases/$caseId" params={{ caseId: c.id }} className="num text-xs font-medium text-accent hover:underline">
                    {c.id}
                  </Link>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{c.submitted}</div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-medium">{c.borrower}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.facility} · {c.region}
                  </div>
                </td>
                <td className="num px-5 py-3.5 font-medium">{currency(c.amount)}</td>
                <td className="px-5 py-3.5">
                  <Pill tone="info">{c.stage}</Pill>
                </td>
                <td className="px-5 py-3.5">
                  <div className="num text-xs">{c.riskRating}</div>
                  <Pill tone={toneForResult(c.risk)} className="mt-1">
                    {c.risk}
                  </Pill>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{c.analyst}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${c.completeness >= 90 ? "bg-success" : c.completeness >= 60 ? "bg-warning" : "bg-destructive"}`}
                        style={{ width: `${c.completeness}%` }}
                      />
                    </div>
                    <span className="num text-xs text-muted-foreground">{c.completeness}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {c.exceptions === 0 ? (
                    <Pill tone="success">None</Pill>
                  ) : (
                    <Pill tone="warning">{c.exceptions} open</Pill>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
