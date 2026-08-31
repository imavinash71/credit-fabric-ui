import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  FileStack,
  Calculator,
  ShieldCheck,
  BrainCircuit,
  Gavel,
  ScrollText,
  Search,
  Bell,
  Layers,
} from "lucide-react";
import type { ReactNode } from "react";
import { primaryCaseId } from "@/data/mock";

const primaryNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/cases", label: "Credit cases", icon: FolderKanban, exact: false },
];

const caseNav = [
  { to: `/cases/${primaryCaseId}`, label: "Case overview", icon: FolderKanban },
  { to: `/cases/${primaryCaseId}/documents`, label: "Documents", icon: FileStack },
  { to: `/cases/${primaryCaseId}/spreading`, label: "Spreading & ratios", icon: Calculator },
  { to: `/cases/${primaryCaseId}/policy`, label: "Policy & KYC", icon: ShieldCheck },
  { to: `/cases/${primaryCaseId}/agents`, label: "Agent insights", icon: BrainCircuit },
  { to: `/cases/${primaryCaseId}/decision`, label: "Recommendation", icon: Gavel },
  { to: `/cases/${primaryCaseId}/audit`, label: "Audit trail", icon: ScrollText },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Layers className="size-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-sidebar-accent-foreground">Apexon</div>
            <div className="text-[11px] tracking-wide text-sidebar-foreground/70">
              Credit Intelligence Fabric
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="label-caps px-2 pb-2 text-sidebar-foreground/50">Workspace</div>
          {primaryNav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="label-caps mt-6 px-2 pb-2 text-sidebar-foreground/50">
            Active file · {primaryCaseId}
          </div>
          {caseNav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-5 py-3 text-[11px] text-sidebar-foreground/60">
          Phase 1 · Commercial underwriting MVP
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-surface/95 px-5 backdropropdrop-blur">
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-9 w-full rounded-md border border-input bg-surface-muted pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              placeholder="Search obligors, cases, documents…"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="text-right leading-tight">
                <div className="text-sm font-medium">Dara Okafor</div>
                <div className="text-[11px] text-muted-foreground">Credit Analyst II · Commercial</div>
              </div>
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                DO
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
