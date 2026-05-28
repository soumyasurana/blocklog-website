import type { SVGProps } from "react";

// ─── Base ────────────────────────────────────────────────────────────────────
// Stroke-based icons with a refined 2px weight, crisp caps, and a subtle
// accent fill layer for visual depth on select icons.

type IconProps = SVGProps<SVGSVGElement> & {
  /** Accent color used for secondary fills on duotone icons. Defaults to currentColor at 15% opacity. */
  accent?: string;
};

function IconBase({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      {/* Subtle filled background square for directionality */}
      <rect x="8" y="4" width="12" height="12" rx="2" fill="currentColor" fillOpacity="0.08" stroke="none" />
      <path d="M7 17 17 7" />
      <path d="M10 7h7v7" />
    </IconBase>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      {/* Soft filled circle behind the play triangle */}
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08" stroke="none" />
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8.5 6 3.5-6 3.5V8.5Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      {/* Three lines with slight length variation for visual interest */}
      <path d="M4 7h16" />
      <path d="M4 12h12" strokeOpacity="0.6" />
      <path d="M4 17h14" />
    </IconBase>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.07" stroke="none" />
      <path d="M8 8l8 8" />
      <path d="M16 8 8 16" />
    </IconBase>
  );
}

export function BellIcon({ accent, ...props }: IconProps) {
  return (
    <IconBase {...props}>
      {/* Filled body for premium feel */}
      <path
        d="M6.5 9a5.5 5.5 0 1 1 11 0c0 6 2.5 7 2.5 7H4S6.5 16 6.5 9Z"
        fill="currentColor"
        fillOpacity="0.10"
        stroke="none"
      />
      <path d="M6.5 9a5.5 5.5 0 1 1 11 0c0 6 2.5 7 2.5 7H4S6.5 16 6.5 9Z" />
      {/* Accent dot — notification indicator */}
      <circle cx="17" cy="5" r="2.5" fill={accent ?? "currentColor"} fillOpacity="0.9" stroke="none" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </IconBase>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" fill="currentColor" fillOpacity="0.07" />
      <circle cx="11" cy="11" r="7" />
      <path d="m19.5 19.5-3.8-3.8" strokeWidth="2.2" />
    </IconBase>
  );
}

export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      {/* Tray fill for depth */}
      <rect x="4" y="17" width="16" height="3" rx="1.5" fill="currentColor" fillOpacity="0.12" stroke="none" />
      <path d="M12 4v11" />
      <path d="m8 11 4 4.5 4-4.5" />
      <path d="M4 18.5h16" strokeWidth="1.5" />
    </IconBase>
  );
}

export function ShieldIcon({ accent, ...props }: IconProps) {
  return (
    <IconBase {...props}>
      {/* Filled body */}
      <path
        d="M12 3 5 6v6c0 4.5 2.7 7.8 7 9 4.3-1.2 7-4.5 7-9V6l-7-3Z"
        fill="currentColor"
        fillOpacity="0.10"
        stroke="none"
      />
      <path d="M12 3 5 6v6c0 4.5 2.7 7.8 7 9 4.3-1.2 7-4.5 7-9V6l-7-3Z" />
      {/* Checkmark accent */}
      <path
        d="m9 12 2 2 4-4"
        stroke={accent ?? "currentColor"}
        strokeWidth="1.8"
        strokeOpacity="0.85"
      />
    </IconBase>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m9 18 6-6-6-6" strokeWidth="2.2" />
    </IconBase>
  );
}

// ─── Demo ────────────────────────────────────────────────────────────────────
// Remove everything below this line when integrating into your project.

const icons = [
  { label: "ArrowUpRight", C: ArrowUpRightIcon },
  { label: "Play",         C: PlayIcon },
  { label: "Menu",         C: MenuIcon },
  { label: "Close",        C: CloseIcon },
  { label: "Bell",         C: BellIcon },
  { label: "Search",       C: SearchIcon },
  { label: "Download",     C: DownloadIcon },
  { label: "Shield",       C: ShieldIcon },
  { label: "ChevronRight", C: ChevronRightIcon },
] as const;

export default function IconDemo() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f1117",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "48px 24px",
      gap: "48px",
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", color: "#6b7280", textTransform: "uppercase", marginBottom: 10 }}>
          Icon System
        </p>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "#f3f4f6", letterSpacing: "-0.02em" }}>
          Refined Stroke Icons
        </h1>
      </div>

      {/* On dark */}
      <div>
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.12em", color: "#4b5563", textTransform: "uppercase", marginBottom: 20 }}>Dark surface</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {icons.map(({ label, C }) => (
            <div key={label} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "20px 16px",
              background: "#1c1f2b",
              border: "1px solid #2d3144",
              borderRadius: 14,
              width: 88,
              cursor: "default",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#232740")}
              onMouseLeave={e => (e.currentTarget.style.background = "#1c1f2b")}
            >
              <C
                style={{ width: 28, height: 28, color: "#e2e8f0" }}
                accent="#60a5fa"
              />
              <span style={{ fontSize: 10, color: "#6b7280", letterSpacing: "0.04em" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* On light */}
      <div>
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.12em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 20 }}>Light surface</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {icons.map(({ label, C }) => (
            <div key={label} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "20px 16px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              width: 88,
              boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
              cursor: "default",
              transition: "box-shadow 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07)")}
            >
              <C
                style={{ width: 28, height: 28, color: "#1e293b" }}
                accent="#2563eb"
              />
              <span style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.04em" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Size scale */}
      <div>
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.12em", color: "#4b5563", textTransform: "uppercase", marginBottom: 20 }}>Size scale</p>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {[14, 18, 24, 32, 40].map(size => (
            <ShieldIcon
              key={size}
              style={{ width: size, height: size, color: "#94a3b8" }}
              accent="#60a5fa"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
