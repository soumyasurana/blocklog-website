import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { formatDate } from "@/lib/console/formatters";
import type { DecisionRow, TraceDetail } from "@/types/console";

export async function exportTracePdf(decision: DecisionRow, trace: TraceDetail | null): Promise<void> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const addPage = () => {
    const p = doc.addPage([612, 792]);
    return { page: p, y: p.getSize().height - 60 };
  };

  let { page, y } = addPage();

  const write = (
    text: string,
    size = 10,
    font = regular,
    color = rgb(0.1, 0.1, 0.1),
  ) => {
    if (y < 70) {
      ({ page, y } = addPage());
    }
    page.drawText(text, {
      x: 50,
      y,
      size,
      font,
      color,
      maxWidth: 512,
    });
    y -= size + 6;
  };

  write("Blocklog — Forensic Trace Report", 18, bold);
  write(`Generated: ${formatDate(new Date().toISOString())}`, 9, regular, rgb(0.5, 0.5, 0.5));
  y -= 6;
  page.drawLine({
    start: { x: 50, y },
    end: { x: 562, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 16;

  write("Decision Metadata", 13, bold);
  for (const [label, value] of [
    ["Decision ID", decision.id],
    ["Trace ID", decision.traceId ?? "none"],
    ["Session ID", decision.sessionId ?? "none"],
    ["Workflow ID", decision.workflowId ?? "none"],
    ["Agent", decision.agent],
    ["Operation", decision.operation],
    ["Amount", decision.amount],
    ["Timestamp", decision.timestamp],
    ["Status", decision.status],
    ["Integrity", decision.integrityStatus],
    ["Chain Hash", decision.chainHash],
  ] as [string, string][]) {
    write(`${label.padEnd(16)} ${value}`, 10);
  }

  y -= 8;
  if (trace) {
    write("Trace Summary", 13, bold);
    for (const [label, value] of [
      ["Trace ID", trace.trace_id],
      ["Integrity", trace.integrity_status],
      ["Events", String(trace.event_count)],
      ["Started", formatDate(trace.started_at)],
      ["Ended", formatDate(trace.ended_at)],
      ["Missing Links", String(trace.missing_links.length)],
    ] as [string, string][]) {
      write(`${label.padEnd(16)} ${value}`, 10);
    }
    y -= 8;
    write("Event Timeline", 13, bold);
    for (const [i, ev] of trace.events.entries()) {
      write(`[${i + 1}] ${ev.event_type} — ${ev.source}`, 9, bold);
      write(
        `    ${formatDate(ev.created_at)} | ${ev.integrity_status} | ${ev.is_human_authorized ? "Human auth" : "Automated"}`,
        9,
      );
      write(`    Chain: ${ev.chain_hash.slice(0, 32)}…`, 9);
      y -= 4;
    }
  }

  const pages = doc.getPages();
  for (const [i, p] of pages.entries()) {
    p.drawText(`Page ${i + 1} of ${pages.length} — Blocklog Forensic Report`, {
      x: 50,
      y: 28,
      size: 8,
      font: regular,
      color: rgb(0.6, 0.6, 0.6),
    });
  }

  const bytes = await doc.save();
  const buffer = bytes.slice().buffer;
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/pdf",
    }),
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = `trace-${decision.id.slice(0, 12)}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
