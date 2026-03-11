import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BLOCKLOG_API_BASE_URL;
const DEMO_MODE = !BASE_URL || process.env.BLOCKLOG_DEMO_MODE === "true";

type Context = {
  params: Promise<{ path: string[] }>;
};

type DemoLog = {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  hash: string;
  status: string;
  company: string;
  metadata?: Record<string, string>;
};

type DemoApiKey = {
  id: string;
  key_name: string;
  created_date: string;
  last_used: string;
  permissions: string[];
};

type DemoState = {
  logs: DemoLog[];
  apiKeys: DemoApiKey[];
  user: {
    id: string;
    email: string;
    full_name: string;
    company_id: string;
  };
  settings: {
    company_name: string;
    company_id: string;
    api_endpoint: string;
    region: string;
  };
};

declare global {
  var __blocklogDemoState: DemoState | undefined;
}

function getDemoState(): DemoState {
  if (!globalThis.__blocklogDemoState) {
    globalThis.__blocklogDemoState = {
      logs: [
        {
          id: "log_10021",
          timestamp: "2026-03-11T12:01:22Z",
          event: "user.login",
          source: "web-app",
          hash: "0x2eaf81d1",
          status: "verified",
          company: "cmp_84f02",
          metadata: { user_id: "123", ip: "172.2.4.9" },
        },
        {
          id: "log_10022",
          timestamp: "2026-03-11T12:01:23Z",
          event: "payment.created",
          source: "payments-api",
          hash: "0xf11e554f",
          status: "pending",
          company: "cmp_84f02",
          metadata: { amount: "2000", currency: "USD" },
        },
        {
          id: "log_10023",
          timestamp: "2026-03-11T12:01:25Z",
          event: "invoice.generated",
          source: "billing-worker",
          hash: "0x14ac4bc2",
          status: "failed",
          company: "cmp_84f02",
          metadata: { invoice_id: "inv_444" },
        },
      ],
      apiKeys: [
        {
          id: "key_1",
          key_name: "Production API",
          created_date: "2026-01-10",
          last_used: "2 minutes ago",
          permissions: ["logs:write", "verify:read"],
        },
      ],
      user: {
        id: "usr_demo_1",
        email: "founder@blocklogsecurity.com",
        full_name: "Blocklog Admin",
        company_id: "cmp_84f02",
      },
      settings: {
        company_name: "Acme Financial",
        company_id: "cmp_84f02",
        api_endpoint: "http://127.0.0.1:8000/api/v1",
        region: "us-east-1",
      },
    };
  }

  return globalThis.__blocklogDemoState;
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "x-blocklog-mode": DEMO_MODE ? "demo" : "live" },
  });
}

async function parseBody(req: NextRequest) {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function handleDemo(req: NextRequest, path: string[], method: string) {
  const state = getDemoState();
  const [resource, id, action] = path;

  if (resource === "auth" && method === "POST") {
    if (id === "login" || id === "signup") {
      return json({
        data: {
          token: "demo-token",
          api_key: "blk_demo_key",
          company_id: state.settings.company_id,
          expires_in: 28800,
        },
      });
    }

    if (id === "forgot-password" || id === "reset-password") {
      return json({ data: { ok: true } });
    }
  }

  if (resource === "auth" && id === "me" && method === "GET") {
    return json({
      data: state.user,
    });
  }

  if (resource === "auth" && id === "api_keys" && method === "GET") {
    return json({ data: { keys: state.apiKeys } });
  }

  if (resource === "auth" && id === "api_keys" && method === "POST") {
    const body = await parseBody(req);
    const created: DemoApiKey = {
      id: `key_${Date.now()}`,
      key_name: String(body.key_name ?? "New API Key"),
      created_date: new Date().toISOString().slice(0, 10),
      last_used: "never",
      permissions: Array.isArray(body.permissions)
        ? body.permissions.map((entry) => String(entry))
        : ["logs:write"],
    };
    state.apiKeys.unshift(created);
    return json({ data: created }, 201);
  }

  if (resource === "auth" && id === "api_keys" && action && method === "DELETE") {
    state.apiKeys = state.apiKeys.filter((entry) => entry.id !== action);
    return json({ data: { ok: true } });
  }

  if (resource === "health" && method === "GET") {
    return json({ data: { status: "ok", service: "blocklog-api" } });
  }

  if (resource === "metrics" && method === "GET") {
    return json({
      data: {
        logs_series: [32, 48, 41, 56, 62, 74, 69, 82],
        api_series: [12, 18, 16, 24, 29, 34, 31, 37],
        requests_total: 920,
        ingestion_rate: 128,
      },
    });
  }

  if (resource === "usage" && method === "GET") {
    return json({
      data: {
        logs_ingested_today: state.logs.length * 431,
        total_logs: 18044112,
        verification_requests: 920,
      },
    });
  }

  if (resource === "integrity" && id === "status" && method === "GET") {
    return json({
      data: {
        integrity_status: "Healthy",
        verification_failures: state.logs.filter((log) => log.status === "failed").length,
      },
    });
  }

  if (resource === "integrity" && id === "report" && method === "GET") {
    return json({
      data: {
        last_scan_at: new Date().toISOString(),
        issues: state.logs.filter((log) => log.status === "failed").length,
      },
    });
  }

  if (resource === "companies" && id === state.settings.company_id && method === "GET") {
    return json({
      data: {
        company_name: state.settings.company_name,
        company_id: state.settings.company_id,
        region: state.settings.region,
      },
    });
  }

  if (resource === "policy" && id === "retention" && method === "GET") {
    return json({
      data: {
        default_days: 365,
        policy_name: "standard-retention",
      },
    });
  }

  if (resource === "logs" && id === "stream" && method === "GET") {
    return json({
      data: {
        lines: state.logs.map((log) => `[${log.timestamp.slice(11, 19)}] ${log.event}`),
        verified_pct: 98.4,
        pending_pct: 1.1,
        failed_pct: 0.5,
      },
    });
  }

  if (resource === "logs" && id === "errors" && method === "GET") {
    return json({
      data: {
        errors: ["Error: Invalid API key", "Error: Schema mismatch"],
      },
    });
  }

  if (resource === "logs" && id === "chain" && method === "GET") {
    return json({
      data: {
        nodes: state.logs.map((log, index) => ({
          log: `Log ${index + 1}`,
          hash: log.hash,
        })),
      },
    });
  }

  if (resource === "logs" && !id && method === "GET") {
    const q = req.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";
    const eventType = req.nextUrl.searchParams.get("event_type")?.toLowerCase() ?? "";
    const source = req.nextUrl.searchParams.get("source")?.toLowerCase() ?? "";
    const status = req.nextUrl.searchParams.get("status")?.toLowerCase() ?? "";

    const filtered = state.logs.filter((log) => {
      return (
        (!q ||
          log.timestamp.toLowerCase().includes(q) ||
          log.event.toLowerCase().includes(q) ||
          log.hash.toLowerCase().includes(q)) &&
        (!eventType || log.event.toLowerCase().includes(eventType)) &&
        (!source || log.source.toLowerCase().includes(source)) &&
        (!status || log.status.toLowerCase() === status)
      );
    });

    return json({ data: { logs: filtered } });
  }

  if (resource === "logs" && !id && method === "POST") {
    const body = await parseBody(req);
    const newLog: DemoLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: String(body.event ?? "custom.event"),
      source: "playground",
      hash: `0x${Date.now().toString(16)}`,
      status: "verified",
      company: state.settings.company_id,
      metadata: { created_via: "demo" },
    };
    state.logs.unshift(newLog);
    return json({ data: newLog }, 201);
  }

  if (resource === "logs" && id && !action && method === "GET") {
    const log = state.logs.find((entry) => entry.id === id);
    if (!log) {
      return json({ detail: "Log not found" }, 404);
    }
    return json({
      data: {
        id: log.id,
        event_data: { event: log.event, hash: log.hash },
        metadata: log.metadata ?? {},
        hash: log.hash,
        signature: "sig_demo_123",
        integrity_status: log.status === "failed" ? "INVALID" : "VALID",
        chain_position: `Block #${6800 + state.logs.indexOf(log)}`,
        verification_result:
          log.status === "failed" ? "Signature mismatch" : "Signature MATCH, Chain VERIFIED",
      },
    });
  }

  if (resource === "logs" && id && action === "verify" && (method === "POST" || method === "GET")) {
    const log = state.logs.find((entry) => entry.id === id);
    return json({
      data: {
        result: log?.status === "failed" ? "Integrity check failed." : "Integrity check passed.",
      },
    });
  }

  if (resource === "public" && id === "verify" && action && method === "GET") {
    return json({
      data: {
        exists: true,
        hash_valid: true,
        timestamp_anchored: true,
        integrity: "VALID",
      },
    });
  }

  if (resource === "verify" && id === "log" && action && method === "GET") {
    return json({
      data: {
        exists: true,
        hash_valid: true,
        timestamp_anchored: true,
        integrity: "VALID",
      },
    });
  }

  if (resource === "notifications" && method === "GET") {
    return json({
      data: {
        notifications: [
          { alert: "verification failure", time: "2 minutes ago" },
          { alert: "ingestion failure", time: "10 minutes ago" },
          { alert: "API misuse", time: "17 minutes ago" },
        ],
      },
    });
  }

  if (resource === "status" && method === "GET") {
    return json({
      data: {
        services: [
          { service: "API status", status: "Operational", uptime: "99.99%" },
          { service: "Log ingestion", status: "Operational", uptime: "99.95%" },
          { service: "Verification service", status: "Operational", uptime: "99.97%" },
        ],
      },
    });
  }

  return json({ detail: `No demo handler for ${method} /${path.join("/")}` }, 404);
}

async function forward(req: NextRequest, context: Context, method: string) {
  const { path } = await context.params;

  if (DEMO_MODE) {
    return handleDemo(req, path, method);
  }

  const suffix = path.join("/");
  const target = new URL(`${BASE_URL!.replace(/\/$/, "")}/${suffix}`);

  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });

  const headers = new Headers();
  const auth = req.headers.get("authorization");
  const company = req.headers.get("x-company-id");
  const apiKey = req.headers.get("x-api-key");

  if (auth) headers.set("authorization", auth);
  if (company) headers.set("x-company-id", company);
  if (apiKey) headers.set("x-api-key", apiKey);

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const init: RequestInit = { method, headers };
  if (method !== "GET" && method !== "HEAD") {
    init.body = await req.text();
  }

  try {
    const response = await fetch(target, init);
    const bodyText = await response.text();

    return new NextResponse(bodyText, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
        "x-blocklog-mode": "live",
      },
    });
  } catch {
    return NextResponse.json(
      {
        detail:
          "Unable to reach Blocklog API. Set BLOCKLOG_API_BASE_URL to your running backend URL or enable demo mode.",
      },
      { status: 502 },
    );
  }
}

export async function GET(req: NextRequest, context: Context) {
  return forward(req, context, "GET");
}

export async function POST(req: NextRequest, context: Context) {
  return forward(req, context, "POST");
}

export async function PUT(req: NextRequest, context: Context) {
  return forward(req, context, "PUT");
}

export async function PATCH(req: NextRequest, context: Context) {
  return forward(req, context, "PATCH");
}

export async function DELETE(req: NextRequest, context: Context) {
  return forward(req, context, "DELETE");
}
