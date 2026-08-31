import { createFileRoute } from "@tanstack/react-router";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Lock } from "lucide-react";
import { Panel, Pill, toneForResult } from "@/components/primitives";
import { balanceSheet, incomeStatement, ratioTrend, ratios, type SpreadRow } from "@/data/mock";

export const Route = createFileRoute("/cases/$caseId/spreading")({
  head: () => ({
    meta: [
      { title: "Financial Spreading & Ratios | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content: "Deterministic financial spread across FY2023–TTM with ratio calculation and policy threshold evaluation.",
      },
      { property: "og:title", content: "Financial Spreading & Ratios | Apexon Credit Intelligence Fabric" },
      { property: "og:description", content: "Auditable spread engine output: normalized statements, ratios and thresholds." },
    ],
  }),
  component: Spreading,
});

const fmt = (n: number) => (n / 1000).toLocaleString("en-US", { maximumFractionDigits: 0 });

function SpreadTable({ title, rows }: { title: string; rows: SpreadRow[] }) {
  return (
    <Panel title={title} description="US$ thousands · GAAP mapping 2026.1" bodyClassName="p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="label-caps px-5 py-2.5 font-semibold">Line item</th>
            {["FY2023", "FY2024", "FY2025", "TTM"].map((h) => (
              <th key={h} className="label-caps px-5 py-2.5 text-right font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={`border-b border-border/60 last:border-0 ${r.emphasis ? "bg-surface-muted" : ""}`}>
              <td className={`px-5 py-2 ${r.emphasis ? "font-semibold" : ""} ${r.indent ? "pl-9 text-muted-foreground" : ""}`}>
                {r.label}
              </td>
              {[r.fy2023, r.fy2024, r.fy2025, r.ttm].map((v, i) => (
                <td key={i} className={`num px-5 py-2 text-right ${r.emphasis ? "font-semibold" : ""}`}>
                  {fmt(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function Spreading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-info/25 bg-info/10 px-4 py-3 text-sm">
        <Lock className="size-4 text-info" />
        <span className="text-foreground">
          Calculated by the Deterministic Intelligence engine. Values are rule-derived and reproducible; AI agents reason over
          these numbers but never compute them.
        </span>
        <span className="num ml-auto text-xs text-muted-foreground">Last run 2026-08-18 14:03:22 · v4</span>
      </div>

      <div className="grid gap-6 2xl:grid-cols-2">
        <SpreadTable title="Income statement" rows={incomeStatement} />
        <SpreadTable title="Balance sheet" rows={balanceSheet} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Ratio analysis" description="Evaluated against credit policy thresholds" bodyClassName="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label-caps px-5 py-2.5 font-semibold">Ratio</th>
                {["FY2023", "FY2024", "FY2025", "TTM"].map((h) => (
                  <th key={h} className="label-caps px-5 py-2.5 text-right font-semibold">
                    {h}
                  </th>
                ))}
                <th className="label-caps px-5 py-2.5 font-semibold">Policy</th>
                <th className="label-caps px-5 py-2.5 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {ratios.map((r) => (
                <tr key={r.name} className="border-b border-border/60 last:border-0 align-top">
                  <td className="px-5 py-3">
                    <div className="font-medium">{r.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{r.formula}</div>
                  </td>
                  {[r.fy2023, r.fy2024, r.fy2025, r.ttm].map((v, i) => (
                    <td key={i} className={`num px-5 py-3 text-right ${i === 3 ? "font-semibold" : ""}`}>
                      {v}
                    </td>
                  ))}
                  <td className="num px-5 py-3 text-xs text-muted-foreground">{r.policy}</td>
                  <td className="px-5 py-3">
                    <Pill tone={toneForResult(r.status)}>{r.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className="space-y-6">
          <Panel title="Coverage & leverage trend" description="DSCR vs. total debt / EBITDA">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratioTrend} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="dscr" name="DSCR" stroke="var(--color-chart-4)" strokeWidth={2} />
                  <Line type="monotone" dataKey="leverage" name="Debt / EBITDA" stroke="var(--color-chart-3)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Sensitivity" description="Applied to TTM base case">
            {[
              { scenario: "Base case", dscr: "1.28x", leverage: "3.48x", tone: "success" as const },
              { scenario: "EBITDA −5%", dscr: "1.21x", leverage: "3.66x", tone: "danger" as const },
              { scenario: "EBITDA −10%", dscr: "1.15x", leverage: "3.87x", tone: "danger" as const },
              { scenario: "Rates +100 bps", dscr: "1.22x", leverage: "3.48x", tone: "warning" as const },
            ].map((s) => (
              <div key={s.scenario} className="flex items-center justify-between border-b border-border/70 py-2.5 last:border-0">
                <span className="text-sm">{s.scenario}</span>
                <span className="flex items-center gap-3">
                  <span className="num text-sm">{s.dscr}</span>
                  <span className="num text-sm text-muted-foreground">{s.leverage}</span>
                  <Pill tone={s.tone}>{s.tone === "success" ? "within" : s.tone === "warning" ? "tight" : "breach"}</Pill>
                </span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
