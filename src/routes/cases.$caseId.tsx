import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Pill, toneForResult } from "@/components/primitives";
import { currency, getCase } from "@/data/mock";

export const Route = createFileRoute("/cases/$caseId")({
  component: CaseLayout,
});

const tabs = [
  { key: "", label: "Application" },
  { key: "documents", label: "Documents" },
  { key: "spreading", label: "Spreading & ratios" },
  { key: "policy", label: "Policy & KYC" },
  { key: "agents", label: "Agent insights" },
  { key: "knowledge", label: "Chat & knowledge graph" },
  { key: "decision", label: "Recommendation" },
  { key: "audit", label: "Audit trail" },
];

function CaseLayout() {
  const { caseId } = Route.useParams();
  const c = getCase(caseId);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = `/cases/${caseId}`;

  return (
    <div>
      <div className="panel mb-6 overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-6 px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="num text-xs text-muted-foreground">{c.id}</span>
              <Pill tone="info">{c.stage}</Pill>
              <Pill tone={toneForResult(c.risk)}>{c.risk} risk</Pill>
              {c.exceptions > 0 && <Pill tone="warning">{c.exceptions} policy exceptions</Pill>}
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{c.borrower}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {c.facility} · {c.industry} · NAICS {c.naics} · RM {c.relationshipManager}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-4">
            {[
              { label: "Requested", value: currency(c.amount) },
              { label: "Existing exposure", value: currency(c.existingExposure) },
              { label: "Risk rating", value: c.riskRating },
              { label: "File completeness", value: `${c.completeness}%` },
            ].map((s) => (
              <div key={s.label}>
                <div className="label-caps">{s.label}</div>
                <div className="num mt-1 text-lg font-semibold">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border bg-surface-muted px-4">
          {tabs.map((t) => {
            const to = t.key ? `${base}/${t.key}` : base;
            const active = pathname === to;
            return (
              <Link
                key={t.label}
                to={to}
                className={`whitespace-nowrap border-b-2 px-3.5 py-3 text-sm transition-colors ${
                  active
                    ? "border-accent font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Outlet />
    </div>
  );
}
