import { X } from "lucide-react";
import { Panel, Pill } from "@/components/primitives";
import { nodeKindMeta, type GraphNode } from "@/data/knowledge-graph";

export default function NodeDetail({
  node,
  inPath,
  onClose,
}: {
  node: GraphNode;
  inPath: boolean;
  onClose: () => void;
}) {
  return (
    <Panel
      title="Node detail"
      description={nodeKindMeta[node.kind].label}
      action={
        <button
          onClick={onClose}
          className="inline-flex size-7 items-center justify-center rounded-md border border-input bg-surface text-muted-foreground hover:bg-muted"
          aria-label="Close node detail"
        >
          <X className="size-3.5" />
        </button>
      }
    >
      <div className="animate-in fade-in duration-300">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: nodeKindMeta[node.kind].token }} />
          <h3 className="text-sm font-semibold">{node.label}</h3>
          {inPath && <Pill tone="info">In query path</Pill>}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{node.detail}</p>
        <dl className="mt-3">
          {node.facts.map((f) => (
            <div
              key={f.label}
              className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2 last:border-0"
            >
              <dt className="text-xs text-muted-foreground">{f.label}</dt>
              <dd className="text-right text-sm font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Panel>
  );
}
