import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Upload, Sparkles, AlertTriangle, Check, Pencil } from "lucide-react";
import { Panel, Pill, toneForResult } from "@/components/primitives";
import { documents, extractedFields } from "@/data/mock";

export const Route = createFileRoute("/cases/$caseId/documents")({
  head: () => ({
    meta: [
      { title: "Document Intake & Review | Apexon Credit Intelligence Fabric" },
      {
        name: "description",
        content: "Document intake queue and field-level extraction review with confidence scores and analyst corrections.",
      },
      { property: "og:title", content: "Document Intake & Review | Apexon Credit Intelligence Fabric" },
      { property: "og:description", content: "Review ingested borrower documents and validate extracted financial fields." },
    ],
  }),
  component: Documents,
});

function Documents() {
  const [selected, setSelected] = useState(documents[0]!.id);
  const doc = documents.find((d) => d.id === selected) ?? documents[0]!;
  const received = documents.filter((d) => d.status !== "Missing" && d.status !== "Queued").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Documents received", value: `${received} / ${documents.length}` },
          { label: "Mean extraction confidence", value: "91%" },
          { label: "Fields flagged for review", value: "16" },
          { label: "Outstanding items", value: "2" },
        ].map((s) => (
          <div key={s.label} className="panel p-4">
            <div className="label-caps">{s.label}</div>
            <div className="num mt-1.5 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel
          className="xl:col-span-3"
          title="Document intake"
          description="Knowledge Intelligence — ingestion and classification"
          bodyClassName="p-0"
          action={
            <button className="inline-flex items-center gap-2 rounded-md border border-input bg-surface px-3 py-1.5 text-xs font-medium hover:bg-muted">
              <Upload className="size-3.5" /> Request document
            </button>
          }
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Document", "Period", "Source", "Status", "Confidence"].map((h) => (
                  <th key={h} className="label-caps px-5 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => setSelected(d.id)}
                  className={`cursor-pointer border-b border-border/60 last:border-0 hover:bg-surface-muted ${
                    d.id === selected ? "bg-surface-muted" : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-start gap-2.5">
                      <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{d.name}</div>
                        <div className="text-xs text-muted-foreground">{d.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{d.period}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.source}</td>
                  <td className="px-5 py-3">
                    <Pill tone={toneForResult(d.status)}>{d.status}</Pill>
                  </td>
                  <td className="num px-5 py-3">{d.confidence ? `${d.confidence}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className="space-y-6 xl:col-span-2">
          <Panel title="Document review" description={`${doc.id} · ${doc.type}`}>
            <div className="mb-4 rounded-md border border-border bg-surface-muted p-4">
              <div className="text-sm font-medium">{doc.name}</div>
              <div className="mt-2 grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
                <span>Pages: <span className="num text-foreground">{doc.pages || "—"}</span></span>
                <span>Received: <span className="num text-foreground">{doc.received}</span></span>
                <span>Fields: <span className="num text-foreground">{doc.fields}</span></span>
                <span>Flagged: <span className="num text-foreground">{doc.flagged}</span></span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                Accept extraction
              </button>
              <button className="flex-1 rounded-md border border-input bg-surface px-3 py-2 text-xs font-medium hover:bg-muted">
                Return to borrower
              </button>
            </div>
          </Panel>

          <Panel
            title="Extracted fields"
            description="Mapped to the borrower knowledge domain"
            bodyClassName="p-0"
            action={
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-accent" /> auto-mapped
              </span>
            }
          >
            <ul className="max-h-[26rem] overflow-y-auto">
              {extractedFields.map((f) => (
                <li key={f.label} className="border-b border-border/60 px-5 py-3 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm">{f.label}</span>
                    <span className="num text-sm font-medium">{f.value}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="num">p.{f.page}</span>
                    <span>·</span>
                    <span className="num">{f.confidence}% confidence</span>
                    {f.status === "accepted" && (
                      <Pill tone="success">
                        <Check className="size-3" /> accepted
                      </Pill>
                    )}
                    {f.status === "review" && (
                      <Pill tone="warning">
                        <AlertTriangle className="size-3" /> review
                      </Pill>
                    )}
                    {f.status === "corrected" && (
                      <Pill tone="info">
                        <Pencil className="size-3" /> corrected
                      </Pill>
                    )}
                  </div>
                  {f.note && <p className="mt-1.5 text-xs text-muted-foreground">{f.note}</p>}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
