export type UsageResponse = {
  logs_ingested?: number;
  logs_ingested_today?: number;
  api_calls?: number;
  gb_processed?: number;
};

export type IntegrityStatusResponse = {
  status?: string;
  logs_verified?: number;
  anchors_created?: number;
};

export type CompanyResponse = {
  company_id: string;
  company_name: string;
  status: string;
};

export type LogItem = {
  log_id: string;
  trace_id: string | null;
  session_id: string | null;
  workflow_id: string | null;
  event_type: string;
  source: string;
  timestamp: string;
  created_at: string;
  idempotency_key: string | null;
  integrity_status: string;
  chain_hash: string;
  payload: Record<string, unknown>;
  status: string | null;
  company_id: string;
  is_deleted: boolean;
};

export type LogsResponse = {
  items: LogItem[];
  next_cursor: string | null;
};

export type TraceSummary = {
  trace_id: string;
  session_id: string | null;
  workflow_id: string | null;
  started_at: string;
  ended_at: string;
  event_count: number;
  sources: string[];
  event_types: string[];
  integrity_status: string;
};

export type TracesResponse = {
  items: TraceSummary[];
};

export type TraceEvent = {
  log_id: string;
  event_type: string;
  source: string;
  timestamp: string;
  created_at: string;
  payload: Record<string, unknown>;
  chain_hash: string;
  previous_hash: string;
  integrity_status: string;
  is_human_authorized: boolean;
};

export type TraceDetail = {
  trace_id: string;
  session_id: string | null;
  workflow_id: string | null;
  integrity_status: string;
  event_count: number;
  started_at: string;
  ended_at: string;
  missing_links: string[];
  events: TraceEvent[];
};

export type DecisionRow = {
  id: string;
  traceId: string | null;
  sessionId: string | null;
  workflowId: string | null;
  agent: string;
  operation: string;
  amount: string;
  timestamp: string;
  freshness: string;
  status: string;
  integrityStatus: string;
  chainHash: string;
  createdAt: string;
};

export type ConsoleStats = {
  totalRecords: number;
  integrityCoverage: number;
  activeTraces: number;
  anchorsCreated: number;
  gbProcessed: number;
  apiCalls: number;
};

export type SortField = "timestamp" | "agent" | "operation" | "status" | "amount";
export type SortDir = "asc" | "desc";
export type UserRole = "ADMIN" | "AUDITOR" | "ANALYST" | "VIEWER";
export type SidebarTab =
  | "Overview"
  | "Agents"
  | "Decisions"
  | "Forensic Replay"
  | "Compliance Reports"
  | "Authorization Gate"
  | "Policy Engine"
  | "Audit Log"
  | "Settings";
