import { useEffect, useRef, useState } from "react";
import { blocklogRequest } from "@/lib/blocklog";
import type { TraceDetail } from "@/types/console";

export function useTrace(traceId: string | null | undefined, accessToken: string | null | undefined) {
  const [trace, setTrace] = useState<TraceDetail | null>(null);
  const [loadedTraceId, setLoadedTraceId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!traceId || !accessToken) {
      abortRef.current?.abort();
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    blocklogRequest<TraceDetail>(`/traces/${traceId}`)
      .then((data) => {
        setTrace(data);
        setLoadedTraceId(traceId);
      })
      .catch(() => {
        setTrace(null);
        setLoadedTraceId(traceId);
      });

    return () => {
      abortRef.current?.abort();
    };
  }, [traceId, accessToken]);

  const loading = Boolean(traceId && loadedTraceId !== traceId);

  return {
    trace: loadedTraceId === traceId ? trace : null,
    loading,
  };
}
