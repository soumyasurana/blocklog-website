"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { DownloadIcon } from "@/components/site/icons";
import type { DecisionRow, TraceDetail } from "@/types/console";
import { exportTracePdf } from "@/lib/console/pdfExport";
import { formatDate, truncateHash } from "@/lib/console/formatters";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      aria-label={`Copy ${label}`}
      className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/46 hover:text-white transition-colors"
      type="button"
      onClick={() => navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function TraceDrawer({
  decision,
  accessToken,
  onClose,
}: {
  decision: DecisionRow | null;
  accessToken: string | null | undefined;
  onClose: () => void;
}) {
  const [trace, setTrace] = useState<TraceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!decision || !accessToken) {
      setTrace(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    fetch(`/api/traces/${decision.traceId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setTrace(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setTrace(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [decision, accessToken]);

  useEffect(() => {
    if (decision) setTimeout(() => closeBtnRef.current?.focus(), 50);
  }, [decision]);

  useEffect(() => {
    if (!decision) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [decision, onClose]);

  const handleExport = useCallback(async () => {
    if (!decision) return;
    setExporting(true);
    try {
      await exportTracePdf(decision, trace);
    } finally {
      setExporting(false);
    }
  }, [decision, trace]);

  return (
    <AnimatePresence>
      {decision && (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-[70] bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="ml-auto h-full w-full max-w-3xl overflow-auto rounded-[2.6rem] liquid-glass-strong p-6 md:p-8"
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Forensic Replay</p>
                <h2 className="mt-4 break-all text-4xl serif-italic">{decision.id}</h2>
                <p className="mt-3 text-sm text-white/68">{decision.timestamp} | {decision.agent}</p>
              </div>
              <button
                ref={closeBtnRef}
                aria-label="Close"
                className="liquid-glass flex-shrink-0 rounded-full px-4 py-3 text-sm text-white/74 hover:text-white"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            {loading && (
              <div aria-live="polite" className="mt-8 rounded-[2rem] border border-white/10 p-6 text-sm text-white/64">
                Loading trace reconstruction…
              </div>
            )}

            <div className="mt-8 grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                {([
                  ["Trace ID", decision.traceId ?? "none"],
                  ["Session ID", decision.sessionId ?? "none"],
                  ["Workflow ID", decision.workflowId ?? "none"],
                  ["Chain Hash", truncateHash(decision.chainHash)],
                ] as [string, string][]).map(([label, value]) => (
                  <div className="liquid-glass rounded-[1.6rem] p-4" key={label}>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/38">{label}</p>
                    <div className="mt-3 flex items-center">
                      <span className="flex-1 break-all text-xl serif-italic">{value}</span>
                      {value !== "none" && <CopyButton value={value} label={label} />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="liquid-glass rounded-[1.8rem] p-5">
                <p className="eyebrow">Captured Input Parameters</p>
                <div className="mt-4 grid gap-3 text-sm">
                  {trace?.events?.[0]?.payload ? (
                    Object.entries(trace.events[0].payload).slice(0, 10).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between rounded-full border border-white/8 px-4 py-3">
                        <span className="mono text-white/78">{k}</span>
                        <span className="max-w-[60%] truncate text-white/56">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-full border border-white/8 px-4 py-3 text-white/56">
                      No structured payload fields available.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="liquid-glass rounded-[1.6rem] p-4 text-sm leading-7 text-white/72">
                  Integrity: <strong className="text-white">{trace?.integrity_status ?? decision.integrityStatus}</strong>. Events: <strong className="text-white">{trace?.event_count ?? 1}</strong>. Missing links: <strong className="text-white">{trace?.missing_links?.length ?? 0}</strong>.
                </div>
                <div className="liquid-glass rounded-[1.6rem] p-4 text-sm leading-7 text-white/72">
                  {trace ? `${formatDate(trace.started_at)} → ${formatDate(trace.ended_at)}` : "Standalone event record."}
                </div>
              </div>

              <div className="liquid-glass rounded-[1.8rem] p-5">
                <p className="eyebrow">Trace Timeline</p>
                <div className="mt-4 grid gap-3">
                  {(trace?.events ?? []).map((ev, i) => (
                    <div className="rounded-[1.4rem] border border-white/8 px-4 py-4" key={ev.log_id}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-white/60">{i + 1}</span>
                          <span className="font-medium text-white">{ev.event_type}</span>
                        </div>
                        <span className="flex-shrink-0 text-sm text-white/46">{formatDate(ev.created_at)}</span>
                      </div>
                      <div className="mt-2 pl-9 text-sm text-white/56">
                        {ev.source} | <span className={ev.integrity_status === "valid" ? "text-emerald-400" : "text-red-400"}>{ev.integrity_status}</span> | {ev.is_human_authorized ? "Human authorized" : "Automated"}
                      </div>
                    </div>
                  ))}
                  {!trace?.events?.length && !loading && (
                    <div className="rounded-[1.4rem] border border-white/8 px-4 py-4 text-sm text-white/54">
                      No replayable trace sequence found.
                    </div>
                  )}
                </div>
              </div>

              <button
                aria-label="Export trace as PDF"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-medium text-black transition-opacity disabled:opacity-60"
                disabled={exporting}
                type="button"
                onClick={handleExport}
              >
                <DownloadIcon width={16} height={16} />
                {exporting ? "Generating PDF…" : "Export to PDF"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
