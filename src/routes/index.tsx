import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowUpRight, CircleCheck, Clock } from "lucide-react";
import { DataRow, PageHeading, Panel, Pill, toneForResult } from "@/components/primitives";
import { alerts, cases, currency, cycleTrend, engineHealth, portfolioKpis, stageDistribution } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Underwriting Dashboard | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content:
          "Portfolio-level view of commercial underwriting: pipeline by stage, cycle time, open policy exceptions and engine health.",
      },
      { property: "og:title", content: "Underwriting Dashboard | Apexon Credit Intelligence Fabric" },
      {
        property: "og:description",
        content: "Commercial credit pipeline, exceptions and AI engine health in one underwriting workspace.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <PageHeading
        eyebrow="Commercial underwriting · Phase 1"
        title="Underwriting dashboard"
        description="Pipeline, exceptions and engine activity across the commercial C&I book."
        actions={
          <Link
            to="/cases"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View all cases <ArrowUpRight className="size-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {portfolioKpis.map((kpi) => (
          <div key={kpi.label} className="panel p-5">
            <div className="label-caps">{kpi.label}</div>
            <div className="num mt-2 text-3xl font-semibold tracking-tight">{kpi.value}</div>
            <div
              className={`mt-1 text-xs ${
                kpi.tone === "positive"
                  ? "text-success"
                  : kpi.tone === "negative"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {kpi.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Cycle time and volume"
          description="Median days from intake to decision, trailing six months"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cycleTrend} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="days" name="Cycle time (days)" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="volume" name="Active cases" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Pipeline by stage" description="Workflow Intelligence — single approval path">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageDistribution} layout="vertical" margin={{ left: 34, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis
                  type="category"
                  dataKey="stage"
                  width={96}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--color-muted-foreground)"
                />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Cases" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="My queue"
          description="Cases awaiting action from you or your team"
          bodyClassName="p-0"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Case", "Borrower", "Facility", "Amount", "Stage", "Risk", "SLA"].map((h) => (
                  <th key={h} className="label-caps px-5 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-surface-muted">
                  <td className="px-5 py-3">
                    <Link to="/cases/$caseId" params={{ caseId: c.id }} className="num text-xs font-medium text-accent hover:underline">
                      {c.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium">{c.borrower}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.industry} · NAICS {c.naics}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.facility}</td>
                  <td className="num px-5 py-3 font-medium">{currency(c.amount, true)}</td>
                  <td className="px-5 py-3">
                    <Pill tone="info">{c.stage}</Pill>
                  </td>
                  <td className="px-5 py-3">
                    <Pill tone={toneForResult(c.risk)}>{c.risk}</Pill>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`num inline-flex items-center gap-1 text-xs ${
                        c.slaDueDays === 0 ? "text-muted-foreground" : c.slaDueDays <= 1 ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      <Clock className="size-3.5" />
                      {c.slaDueDays === 0 ? "—" : `${c.slaDueDays}d`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className="space-y-6">
          <Panel title="Exceptions & alerts" description="Raised by the deterministic and cognitive engines" bodyClassName="p-0">
            <ul>
              {alerts.map((a) => (
                <li key={a.id} className="flex gap-3 border-b border-border/60 px-5 py-3.5 last:border-0">
                  <AlertTriangle
                    className={`mt-0.5 size-4 shrink-0 ${
                      a.severity === "high" ? "text-destructive" : a.severity === "medium" ? "text-warning" : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium">{a.title}</div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.body}</p>
                    <Link
                      to="/cases/$caseId"
                      params={{ caseId: a.case }}
                      className="num mt-1.5 inline-block text-[11px] text-accent hover:underline"
                    >
                      {a.case}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Fabric engine health" description="Four engines, one architecture">
            {engineHealth.map((e) => (
              <DataRow
                key={e.engine}
                label={e.detail}
                value={
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-medium">{e.engine}</span>
                    <CircleCheck className="size-4 text-success" />
                  </span>
                }
              />
            ))}
          </Panel>
        </div>
      </div>
    </>
  );
}
