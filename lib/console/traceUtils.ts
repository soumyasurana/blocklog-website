export function getFreshnessLevel(freshness: string): "fresh" | "borderline" | "stale" | "unknown" {
  if (freshness === "n/a") return "unknown";
  const value = Number.parseFloat(freshness);
  if (Number.isNaN(value)) return "unknown";
  if (freshness.endsWith("ms")) return "fresh";
  if (value <= 5) return "fresh";
  if (value <= 15) return "borderline";
  return "stale";
}

export function getFreshnessDotClass(freshness: string) {
  const level = getFreshnessLevel(freshness);
  if (level === "fresh") return "bg-emerald-400";
  if (level === "borderline") return "bg-amber-400";
  if (level === "stale") return "bg-red-400";
  return "bg-white/25";
}
