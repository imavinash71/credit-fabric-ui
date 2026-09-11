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
  Menu,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { primaryCaseId } from "@/data/mock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const primaryNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/cases", label: "Credit cases", icon: FolderKanban, exact: false },
];

const caseNav = [
  { to: `/cases/${primaryCaseId}`, label: "Case overview", icon: FolderKanban },
  { to: `/cases/${primaryCaseId}/documents`, label: "Documents", icon: FileStack },
  { to: `/cases/${primaryCaseId}/spreading`, label: "Spreading & ratios", icon: Calculator },
  { to: `/cases/${primaryCaseId}/policy`, label: "Policy & KYC", icon: ShieldCheck },
  { to: `/cases/${primaryCaseId}/knowledge`, label: "Chat & knowledge graph", icon: BrainCircuit },
  { to: `/cases/${primaryCaseId}/agents`, label: "Agent insights", icon: BrainCircuit },
  { to: `/cases/${primaryCaseId}/decision`, label: "Recommendation", icon: Gavel },
  { to: `/cases/${primaryCaseId}/audit`, label: "Audit trail", icon: ScrollText },
];

const EASE = "cubic-bezier(0.3, 0, 0.5, 1)";
const STORAGE_KEY = "cif-sidebar-collapsed";

function NavItem({
  to,
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  collapsed: boolean;
}) {
  const link = (
    <Link
      to={to}
      className={`relative mb-1 flex items-center gap-3 rounded-md py-2 text-sm transition-colors ${
        collapsed ? "justify-center px-0" : "px-3"
      } ${
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      }`}
      aria-label={label}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-sidebar-primary" />
      )}
      <Icon className={`size-4 shrink-0 ${active ? "text-sidebar-primary" : ""}`} />
      <span
        className="overflow-hidden whitespace-nowrap transition-all duration-300"
        style={{
          transitionTimingFunction: EASE,
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : "auto",
        }}
      >
        {label}
      </span>
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved !== null) setCollapsed(saved === "1");
    else setCollapsed(window.innerWidth < 1024);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      sessionStorage.setItem(STORAGE_KEY, prev ? "0" : "1");
      return !prev;
    });
  };

  const width = collapsed ? "5rem" : "16rem";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        <aside
          className="fixed inset-y-0 left-0 z-30 hidden flex-col overflow-hidden bg-sidebar text-sidebar-foreground transition-[width] duration-300 lg:flex"
          style={{ width, transitionTimingFunction: EASE }}
        >
          <div
            className={`flex items-center border-b border-sidebar-border py-4 ${
              collapsed ? "flex-col gap-3 px-2" : "gap-3 px-5"
            }`}
          >
            <button
              onClick={toggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="cursor-pointer rounded-md p-1 text-sidebar-primary transition-all duration-300 hover:rotate-90 hover:bg-sidebar-accent/60 hover:brightness-125"
              style={{ transitionTimingFunction: EASE }}
            >
              <Menu className="size-6" />
            </button>
            {!collapsed && (
              <div className="min-w-0 leading-tight animate-fade-in">
                <div className="truncate text-sm font-semibold text-sidebar-accent-foreground">
                  Apexon
                </div>
                <div className="truncate text-[11px] tracking-wide text-sidebar-foreground/70">
                  Credit Intelligence Fabric
                </div>
              </div>
            )}
            {collapsed && (
              <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Layers className="size-5" />
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {!collapsed && (
              <div className="label-caps px-2 pb-2 text-sidebar-foreground/50">Workspace</div>
            )}
            {primaryNav.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                collapsed={collapsed}
                active={item.exact ? pathname === item.to : pathname.startsWith(item.to)}
              />
            ))}

            {collapsed ? (
              <div className="my-3 border-t border-sidebar-border" />
            ) : (
              <div className="label-caps mt-6 px-2 pb-2 text-sidebar-foreground/50">
                Active file · {primaryCaseId}
              </div>
            )}
            {caseNav.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                collapsed={collapsed}
                active={pathname === item.to}
              />
            ))}
          </nav>

          {!collapsed && (
            <div className="border-t border-sidebar-border px-5 py-3 text-[11px] text-sidebar-foreground/60">
              Phase 1 · Commercial underwriting MVP
            </div>
          )}
        </aside>

        <div
          className="transition-[padding] duration-300"
          style={{ transitionTimingFunction: EASE, paddingLeft: undefined }}
        >
          <div
            className="hidden lg:block"
            style={{ transitionTimingFunction: EASE }}
            aria-hidden
          />
          <div
            className="transition-[padding-left] duration-300"
            style={{ transitionTimingFunction: EASE }}
          >
            <div className="lg:[--sidebar-w:0px]" />
          </div>
          <div
            className="transition-[padding-left] duration-300"
            style={{ transitionTimingFunction: EASE }}
          >
            <div />
          </div>
        </div>

        <div
          className="transition-[padding-left] duration-300"
          style={{
            transitionTimingFunction: EASE,
            paddingLeft: 0,
          }}
        >
          <SidebarOffset width={width}>
            <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-surface/95 px-5 backdrop-blur">
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
                    <div className="text-[11px] text-muted-foreground">
                      Credit Analyst II · Commercial
                    </div>
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    DO
                  </div>
                </div>
              </div>
            </header>

            <main className="px-5 py-6 lg:px-8">{children}</main>
          </SidebarOffset>
        </div>
      </div>
    </TooltipProvider>
  );
}

function SidebarOffset({ width, children }: { width: string; children: ReactNode }) {
  return (
    <>
      <div
        className="transition-[padding-left] duration-300 lg:pl-[var(--sb-w)]"
        style={{ transitionTimingFunction: EASE, ["--sb-w" as string]: width }}
      >
        {children}
      </div>
    </>
  );
}
