import type { SortDir, SortField } from "@/types/console";

export default function SortIcon({
  field,
  current,
  dir,
}: {
  field: SortField;
  current: SortField;
  dir: SortDir;
}) {
  return field === current ? (
    <span className="ml-1 opacity-70">{dir === "asc" ? "↑" : "↓"}</span>
  ) : (
    <span className="ml-1 opacity-20">↕</span>
  );
}
