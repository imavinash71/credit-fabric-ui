import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, ShieldAlert, GitBranch } from "lucide-react";
import { Panel, Pill, toneForResult } from "@/components/primitives";
import { kycChecks, policyChecks, uboChain } from "@/data/mock";

export const Route = createFileRoute("/cases/$caseId/policy")({
  head: () => ({
    meta: [
      { title: "Credit Policy & KYC Checks | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content: "Deterministic credit policy evaluation, risk appetite checks, KYC/AML screening and beneficial ownership chain.",
      },
      { property: "og:title", content: "Credit Policy & KYC Checks | Apexon Credit Intelligence Fabric" },
      { property: "og:description", content: "Policy rule results, exceptions and KYC screening for the credit file." },
    ],
  }),
  component: PolicyKyc;
});

function PolicyKyc() {
  const passed = policyChecks.filter((p) => p.result === "Pass").length;
  const exceptions = policyChecks.filter((p) => p.result === "Exception").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Policy rules evaluated", value: `${policyChecks.length}` },
          { label: "Passed", value: `${passed}` },
          { label: "Open exceptions", value: `${exceptions}` },
          { label: "KYC status", value: "1 item open" },
        ].map((s) => (
          <div key={s.label} className="panel p-4">
            <div className="label-caps">{s.label}</div>
            <div className="num mt-1.5 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <Panel
        title="Credit policy & risk appetite"
        description="Deterministic rule evaluation against Credit Policy v14.2 and Risk Appetite Statement 2026"
        bodyClassName="p-0"
        action={<Pill tone="primary"><ShieldCheck className="size-3.5" /> Rules engine</Pill>}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {["Rule", "Reference", "Requirement", "Observed", "Result"].map((h) => (
                <th key={h} className="label-caps px-5 py-2.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {policyChecks.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-surface-muted">
                <td className="px-5 py-3">
                  <div className="font-medium">{p.rule}</div>
                  <div className="num text-[11px] text-muted-foreground">{p.id}</div>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{p.reference}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.requirement}</td>
                <td className="num px-5 py-3">{p.observed}</td>
                <td className="px-5 py-3">
                  <Pill tone={toneForResult(p.result)}>{p.result}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel
          className="xl:col-span-3"
          title="KYC / AML checks"
          description="Compliance domain — entity, ownership and screening"
          bodyClassName="p-0"
          action={<Pill tone="warning"><ShieldAlert className="size-3.5" /> 1 attention</Pill>}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Check", "Detail", "Refreshed", "Result"].map((h) => (
                  <th key={h} className="label-caps px-5 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kycChecks.map((k) => (
                <tr key={k.id} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3">
                    <div className="font-medium">{k.check}</div>
                    <div className="num text-[11px] text-muted-foreground">{k.id}</div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{k.detail}</td>
                  <td className="num px-5 py-3 text-xs text-muted-foreground">{k.refreshed}</td>
                  <td className="px-5 py-3">
                    <Pill tone={toneForResult(k.result)}>{k.result}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel
          className="xl:col-span-2"
          title="Beneficial ownership chain"
          description="Entity & ownership domain modelled on FIBO"
          action={<GitBranch className="size-4 text-muted-foreground" />}
        >
          <ul className="space-y-2">
            {uboChain.map((n) => (
              <li
                key={n.name}
                className="rounded-md border border-border bg-surface-muted p-3"
                style={{ marginLeft: `${n.level * 20}px` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{n.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {n.role} · {n.jurisdiction}
                    </div>
                  </div>
                  <span className="num text-sm font-semibold">{n.ownership}</span>
                </div>
                {n.flag && (
                  <Pill tone="warning" className="mt-2">
                    {n.flag}
                  </Pill>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
