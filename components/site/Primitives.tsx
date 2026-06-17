"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import FadingVideo from "@/components/site/FadingVideo";
import {
  ArrowUpRightIcon,
  BellIcon,
  ChevronRightIcon,
  CloseIcon,
  MenuIcon,
  PlayIcon,
} from "@/components/site/icons";

// ─── Motion Presets ────────────────────────────────────────────────────────
const EASE_INST = [0.16, 1, 0.3, 1] as const; 

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE_INST },
  },
};

const REVEAL = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: EASE_INST },
  }),
};

// ─── Video Sources ─────────────────────────────────────────────────────────
export const HERO_VIDEO =
  "https://www.pexels.com/download/video/29874954/";
export const SYSTEM_VIDEO =
  "https://www.pexels.com/download/video/3141207/";
export const ADOPTION_VIDEO =
  "https://www.pexels.com/download/video/2792370/"

// ─── Nav ───────────────────────────────────────────────────────────────────
const navLinks = [
  { href: "/",         label: "Platform" },
  { href: "/pilot",    label: "Pilot"    },
  { href: "/docs",     label: "Docs"     },
  { href: "/status",   label: "Status"   },
];

// ─── Footer data ───────────────────────────────────────────────────────────
const footerColumns = [
  {
    title: "Product",
    links: [
      ["Platform",            "/"],
      ["Timeline",            "/timeline"],
      ["Forensic Replay",     "/"],
      ["Authorization Gate",  "/"],
      ["Cryptographic Proof", "/"],
    ],
  },
  {
    title: "Developers",
    links: [
      ["Docs",        "/docs"],
      ["Quick Start", "/docs"],
      ["SDK Reference","/docs"],
      ["API Reference","/docs"],
      ["Status",      "/status"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About",        "/"],
      ["Pilot Program","/pilot"],
      ["Contact",      "/contact"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy",    "/privacy_policy"],
      ["Terms of Service",  "/terms_of_service"],
      ["Security",          "/docs"],
    ],
  },
];


// ─── Trace grid ────────────────────────────────────────────────────────────
function TraceGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
    />
  );
}

// ─── Proof ticker ──────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "AUTH:VERIFIED · TXN-9F2A · 0xC4E9…3B1F",
  "REPLAY:OK · CHAIN-7D4C · POLICY:ENFORCED",
  "PROOF:VALID · SIG:ED25519 · BLOCK:4,821,004",
  "AUDIT:IMMUTABLE · TRACE-2E8B · TS:2026-05-25T09:14:32Z",
  "GATE:PASS · RISK:0.02 · AGENT:MERIDIAN-01",
  "LINEAGE:COMPLETE · REF:BL-00441 · STATE:FINALIZED",
  "HASH:SHA3-256 · VERIFY:0xA7F2…88CC · CONSENSUS:OK",
];

function ProofTicker() {
  const text = TICKER_ITEMS.join("   ·   ");
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 w-full overflow-hidden"
      style={{
        height: 22,
        background: "rgba(0,0,0,0.72)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <motion.div
        className="flex items-center h-full whitespace-nowrap"
        style={{
          fontFamily: "var(--font-heading), serif",
          fontSize: 9,
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.30)",
        }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        {/* Doubled so the loop is seamless */}
        <span className="pr-16">{text}</span>
        <span className="pr-16">{text}</span>
      </motion.div>
    </div>
  );
}

// ─── Live Backdrop ─────────────────────────────────────────────────────────
export function LiveBackdrop({ minimal = false }: { minimal?: boolean }) {
  const traces = minimal
    ? [
        { y: "22%", x: "8%",  w: "28%", delay: 0 },
        { y: "68%", x: "52%", w: "20%", delay: 1.4 },
      ]
    : [
        { y: "14%", x: "6%",  w: "32%", delay: 0   },
        { y: "28%", x: "54%", w: "22%", delay: 0.8 },
        { y: "46%", x: "18%", w: "38%", delay: 1.6 },
        { y: "62%", x: "60%", w: "18%", delay: 2.4 },
        { y: "78%", x: "10%", w: "26%", delay: 0.4 },
      ];

  const orbs = minimal
    ? [
        { size: 360, top: "10%", left: "-6%", tone: "cold" },
        { size: 280, top: "62%", right: "-4%", tone: "warm" },
      ]
    : [
        { size: 460, top: "6%", left: "-8%", tone: "cold" },
        { size: 320, top: "16%", right: "8%", tone: "warm" },
        { size: 380, top: "58%", left: "18%", tone: "silver" },
        { size: 300, top: "72%", right: "-6%", tone: "cold" },
      ];

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* Base fill */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #07090d 0%, #020304 100%)" }}
      />

      <div className="bg-grid absolute inset-0" />
      <div className="bg-trace absolute inset-0" />
      <div className="bg-noise absolute inset-0" />

      {orbs.map((orb, index) => (
        <motion.div
          key={`${orb.top}-${index}`}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            background:
              orb.tone === "warm"
                ? "radial-gradient(circle at 30% 30%, rgba(255,214,156,0.22), rgba(255,214,156,0.05) 40%, transparent 74%)"
                : orb.tone === "silver"
                  ? "radial-gradient(circle at 30% 30%, rgba(228,236,255,0.2), rgba(228,236,255,0.04) 42%, transparent 72%)"
                  : "radial-gradient(circle at 30% 30%, rgba(144,182,255,0.22), rgba(144,182,255,0.05) 42%, transparent 72%)",
            filter: "blur(24px)",
            opacity: minimal ? 0.48 : 0.62,
          }}
          animate={{
            x: [0, index % 2 === 0 ? 24 : -20, 0],
            y: [0, index % 2 === 0 ? -18 : 22, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 12 + index * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Authorization trace lines */}
      {traces.map((t, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: t.y,
            left: t.x,
            width: t.w,
            height: 1,
            background:
              i % 2 === 0
                ? "linear-gradient(90deg, transparent, rgba(132,174,255,0.28), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,211,152,0.24), transparent)",
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.8, 0.45, 0.8, 0], scaleX: [0, 1, 1, 1, 0] }}
          transition={{
            duration: 6,
            delay: t.delay,
            repeat: Infinity,
            repeatDelay: 4 + i,
            ease: "easeInOut",
          }}
        >
          {/* Moving proof node */}
          <motion.span
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 4,
              height: 4,
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 14px rgba(255,255,255,0.65)",
            }}
            animate={{ left: ["0%", "100%"] }}
            transition={{
              duration: 3.5,
              delay: t.delay + 0.4,
              repeat: Infinity,
              repeatDelay: 6.5 + i,
              ease: "linear",
            }}
          />
        </motion.div>
      ))}

      {minimal ? null : (
        <>
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.div
              key={`node-${index}`}
              className="absolute rounded-full bg-white/20"
              style={{
                width: 8 + (index % 3) * 4,
                height: 8 + (index % 3) * 4,
                top: `${12 + (index % 6) * 13}%`,
                left: `${8 + ((index * 13) % 74)}%`,
                boxShadow: "0 0 20px 4px rgba(255,255,255,0.2)",
                filter: "blur(3px)",
              }}
              animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.8, 1.4, 0.8] }}
              transition={{ duration: 3 + (index % 4), repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <motion.div
            className="absolute -left-[12%] top-[16%] h-[40rem] w-[18rem] rotate-[18deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(120,165,255,0.08), rgba(255,214,168,0.05), transparent)",
              filter: "blur(12px)",
            }}
            animate={{ x: ["0%", "125%"] }}
            transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      {/* Subtle bottom-edge gradient to blend content */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 200,
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))",
        }}
      />
      <div className="bg-vignette absolute inset-0" />
    </div>
  );
}

// ─── Page Frame ────────────────────────────────────────────────────────────
export function PageFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`site-main ${className ?? ""}`}>
      <ProofTicker />
      <TraceGrid />
      <LiveBackdrop />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </main>
  );
}

// ─── Reveal ────────────────────────────────────────────────────────────────
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0 }}
      custom={delay}
      variants={REVEAL}
    >
      {children}
    </motion.div>
  );
}

// ─── Mono label ────────────────────────────────────────────────────────────
// Reusable uppercase monospace tag for trace IDs, status labels, timestamps.
export function MonoTag({
  children,
  accent = false,
  className,
}: {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-heading), serif",
        fontSize: 9,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: accent
          ? "rgba(196,166,118,0.9)"   // bronze accent
          : "rgba(255,255,255,0.32)",
        padding: "2px 6px",
        border: accent
          ? "1px solid rgba(196,166,118,0.28)"
          : "1px solid rgba(255,255,255,0.10)",
        borderRadius: 2,
      }}
    >
      {children}
    </span>
  );
}

// ─── Verification Badge ────────────────────────────────────────────────────
export function VerificationBadge({ label = "VERIFIED" }: { label?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--font-heading), serif",
        fontSize: 9,
        letterSpacing: "0.16em",
        color: "rgba(140,188,140,0.85)",
        border: "1px solid rgba(140,188,140,0.22)",
        padding: "2px 7px",
        borderRadius: 2,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "rgba(140,188,140,0.8)",
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

// ─── Site Header ───────────────────────────────────────────────────────────
export function SiteHeader({
  consoleMode = false,
  workspaceName = "Meridian Risk Ops",
}: {
  consoleMode?: boolean;
  workspaceName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rightSlot = useMemo(() => {
    if (consoleMode) {
      return (
        <div className="flex items-center gap-3">
          {/* Alert count */}
          <button
            style={glassStyle(scrolled)}
            className="hidden-mobile flex items-center gap-2 rounded-sm px-4 py-2 text-xs text-white/60 transition hover:text-white/90"
          >
            <BellIcon width={14} height={14} />
            <span style={{ fontFamily: "var(--font-heading), serif", fontSize: 10, letterSpacing: "0.12em" }}>
              3 ALERTS
            </span>
          </button>
          {/* Avatar */}
          <div
            style={{
              ...glassStyle(scrolled),
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-heading), serif",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            SS
          </div>
        </div>
      );
    }

    return (
      <div className="hidden items-center gap-3 md:flex">
        <Link
          href="/login"
          style={glassStyle(scrolled)}
          className="rounded-sm px-4 py-2 text-xs text-white/60 transition hover:text-white/90"
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.14em",
            }}
          >
            LOG IN
          </span>
        </Link>
        <Link
          href="/get-started"
          className="flex items-center gap-2 rounded-sm px-5 py-2 text-xs font-medium transition"
          style={{
            background: "rgba(255,255,255,0.94)",
            color: "#0a0b0d",
            fontFamily: "var(--font-heading), serif",
            letterSpacing: "0.14em",
          }}
        >
          START FREE
          <ArrowUpRightIcon width={13} height={13} />
        </Link>
      </div>
    );
  }, [consoleMode, scrolled]);

  return (
    <>
      {/* Spacer for the proof ticker */}
      <div style={{ height: 22 }} aria-hidden="true" />

      <header
        className="fixed left-0 z-50 w-full px-4 transition-all duration-500"
        style={{ top: 22 }}
      >
        <div className="content-wrap">
          <motion.div
            className="flex items-center justify-between gap-3"
            style={{
              background: scrolled
                ? "rgba(10,11,13,0.88)"
                : "rgba(10,11,13,0.60)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px) saturate(0.8)",
              WebkitBackdropFilter: "blur(16px) saturate(0.8)",
              padding: "0 20px",
              height: 48,
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_INST }}
          >
              {/* Wordmark */}
              <span
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.72)",
                  textTransform: "uppercase",
                }}
              >
                BLOCKLOG
              </span>

            {/* Nav — desktop */}
            <nav className="hidden items-center gap-7 md:flex">
              {consoleMode ? (
                <div
                  className="flex items-center gap-3"
                  style={{
                    fontFamily: "var(--font-heading), serif",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.28)" }}>CONSOLE</span>
                  <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
                  <span style={{ color: "rgba(255,255,255,0.70)" }}>
                    {workspaceName.toUpperCase()}
                  </span>
                </div>
              ) : (
                navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      fontFamily: "var(--font-heading), serif",
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      color: "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      transition: "color 0.15s",
                    }}
                    className="hover:text-white/80"
                  >
                    {link.label}
                  </Link>
                ))
              )}
            </nav>

            {rightSlot}

            {/* Mobile menu toggle */}
            <button
              className="show-mobile flex h-9 w-9 items-center justify-center"
              style={glassStyle(scrolled)}
              onClick={() => setOpen((v) => !v)}
              type="button"
              aria-label="Toggle menu"
            >
              {open ? (
                <CloseIcon width={16} height={16} />
              ) : (
                <MenuIcon width={16} height={16} />
              )}
            </button>
          </motion.div>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && !consoleMode && (
              <motion.div
                className="mt-px md:hidden"
                style={{
                  background: "rgba(10,11,13,0.96)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      style={{
                        fontFamily: "var(--font-heading), serif",
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        color: "rgba(255,255,255,0.45)",
                        padding: "14px 20px",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        textDecoration: "none",
                        textTransform: "uppercase",
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    style={{
                      fontFamily: "var(--font-heading), serif",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: "rgba(255,255,255,0.45)",
                      padding: "14px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      textDecoration: "none",
                      textTransform: "uppercase",
                    }}
                  >
                    LOG IN
                  </Link>
                  <Link
                    href="/get-started"
                    style={{
                      fontFamily: "var(--font-heading), serif",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      background: "rgba(255,255,255,0.92)",
                      color: "#0a0b0d",
                      padding: "14px 20px",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      margin: 12,
                      textAlign: "center",
                    }}
                  >
                    START FREE →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
export function Footer() {
  // Authorization lineage indicator — purely decorative status strip
  const STATUS_NODES = [
    { label: "AUTH", state: "VERIFIED"  },
    { label: "CHAIN", state: "INTACT"   },
    { label: "PROOF", state: "VALID"    },
    { label: "AUDIT", state: "LIVE"     },
    { label: "GATE", state: "ENFORCED"  },
  ];

  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingTop: 0,
        background: "rgba(0,0,0,0.30)",
      }}
    >
      {/* Status strip */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "10px 0",
          overflow: "hidden",
        }}
      >
        <div
          className="content-wrap"
          style={{ display: "flex", gap: 32, flexWrap: "wrap" }}
        >
          {STATUS_NODES.map((n) => (
            <div
              key={n.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-heading), serif",
                fontSize: 9,
                letterSpacing: "0.18em",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "rgba(140,188,140,0.7)",
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "rgba(255,255,255,0.28)" }}>{n.label}</span>
              <span style={{ color: "rgba(140,188,140,0.65)" }}>
                {n.state}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="content-wrap" style={{ paddingTop: 48, paddingBottom: 48 }}>
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gap: 32,
            gridTemplateColumns: "1.4fr repeat(4, 1fr)",
          }}
          className="md:grid-cols-[1.4fr_repeat(4,1fr)] grid-cols-1"
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Logo mark */}
            <div
              style={{
                width: 32,
                height: 32,
                border: "1px solid rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {[
                { top: -1,    left: -1  },
                { top: -1,    right: -1 },
                { bottom: -1, right: -1 },
                { bottom: -1, left: -1  },
              ].map((pos, i) => (
                <span
                  key={i}
                  aria-hidden
                  style={{
                    position: "absolute",
                    width: 5,
                    height: 5,
                    border: "1px solid rgba(255,255,255,0.45)",
                    borderRight: "none",
                    borderBottom: "none",
                    transform: `rotate(${i * 90}deg)`,
                    ...pos,
                  }}
                />
              ))}
              <span
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                B
              </span>
            </div>

            <p
              style={{
                maxWidth: 220,
                fontSize: 12,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.38)",
                margin: 0,
              }}
            >
              The control plane protecting autonomous financial operations.
            </p>

            {/* Trace reference */}
            <MonoTag>REPLAY · PROVENANCE · COMPLIANCE</MonoTag>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.24)",
                  textTransform: "uppercase",
                  marginBottom: 16,
                  marginTop: 0,
                }}
              >
                {col.title}
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 11 }}
              >
                {col.links.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                      transition: "color 0.15s",
                      letterSpacing: "0.02em",
                    }}
                    className="hover:text-white/75"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
          className="md:flex-row md:items-center md:justify-between"
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 9,
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.22)",
            }}
          >
            © 2026 BLOCKLOG INC · ALL RIGHTS RESERVED
          </span>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 9,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            BUILT FOR FINANCIAL SYSTEMS THAT CANNOT AFFORD TO BE WRONG
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Primary Button ────────────────────────────────────────────────────────
export function PrimaryButton({
  href,
  children,
  inverted = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        fontFamily: "var(--font-heading), serif",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        textDecoration: "none",
        transition: "all 0.18s",
        ...(inverted
          ? {
              background: "rgba(255,255,255,0.94)",
              color: "#0a0b0d",
              border: "1px solid transparent",
            }
          : {
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(8px)",
            }),
      }}
    >
      {children}
    </Link>
  );
}

// ─── Secondary Link ────────────────────────────────────────────────────────
export function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 transition"
      style={{
        fontFamily: "var(--font-heading), serif",
        fontSize: 9,
        letterSpacing: "0.18em",
        color: "rgba(255,255,255,0.40)",
        textDecoration: "none",
        textTransform: "uppercase",
      }}
    >
      {children}
      <ChevronRightIcon width={11} height={11} />
    </Link>
  );
}

// ─── Hero Video ────────────────────────────────────────────────────────────
// Heavily desaturated and darkened to read as institutional surveillance
// rather than consumer lifestyle video.
export function HeroVideo({
  src = HERO_VIDEO,
  objectClassName,
}: {
  src?: string;
  objectClassName?: string;
}) {
  return (
    <div
      className="video-shell"
      style={{ filter: "saturate(0.2) brightness(0.45) contrast(1.1)" }}
    >
      <FadingVideo
        className={`absolute left-1/2 top-0 h-[120%] w-[120%] -translate-x-1/2 object-cover object-top ${objectClassName ?? ""}`}
        src={src}
      />
    </div>
  );
}

// ─── Play Text Button ──────────────────────────────────────────────────────
export function PlayTextButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 transition"
      style={{ textDecoration: "none" }}
    >
      {/* Square icon container — no rounded corners */}
      <span
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.04)",
          flexShrink: 0,
        }}
      >
        <PlayIcon width={12} height={12} />
      </span>
      <span
        style={{
          fontFamily: "var(--font-heading), serif",
          fontSize: 9,
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.50)",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </Link>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function glassStyle(solid: boolean): React.CSSProperties {
  return {
    background: solid
      ? "rgba(255,255,255,0.06)"
      : "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    cursor: "pointer",
  };
}
