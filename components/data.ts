export type LogItem = {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  hash: string;
  status: string;
  company: string;
};

export const recentLogs: LogItem[] = [
  {
    id: "log_10021",
    timestamp: "2026-03-08T12:01:22Z",
    event: "user.login",
    source: "web-app",
    hash: "0x2eaf...81d1",
    status: "verified",
    company: "cmp_84f02",
  },
  {
    id: "log_10022",
    timestamp: "2026-03-08T12:01:23Z",
    event: "payment.created",
    source: "payments-api",
    hash: "0xf11e...554f",
    status: "pending",
    company: "cmp_84f02",
  },
  {
    id: "log_10023",
    timestamp: "2026-03-08T12:01:25Z",
    event: "invoice.generated",
    source: "billing-worker",
    hash: "0x14ac...4bc2",
    status: "failed",
    company: "cmp_84f02",
  },
  {
    id: "log_10024",
    timestamp: "2026-03-08T12:03:20Z",
    event: "session.revoked",
    source: "auth-api",
    hash: "0xca31...af91",
    status: "verified",
    company: "cmp_84f02",
  },
];

export const defaultStats = {
  logsIngestedToday: 48291,
  totalLogs: 18044112,
  verificationFailures: 12,
  apiRequests: 522902,
};
