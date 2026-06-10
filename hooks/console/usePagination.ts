import { useCallback, useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize = 25) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const clamped = Math.min(page, totalPages);

  const paged = useMemo(
    () => items.slice((clamped - 1) * pageSize, clamped * pageSize),
    [items, clamped, pageSize],
  );

  const goTo = useCallback((p: number) => setPage(Math.max(1, Math.min(totalPages, p))), [totalPages]);
  const reset = useCallback(() => setPage(1), []);

  return {
    page: clamped,
    totalPages,
    paged,
    next: () => goTo(clamped + 1),
    prev: () => goTo(clamped - 1),
    canNext: clamped < totalPages,
    canPrev: clamped > 1,
    reset,
  };
}
