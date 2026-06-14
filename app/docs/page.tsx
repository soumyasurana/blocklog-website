"use client";

import { useMemo, useState } from "react";
import { Footer, PageFrame, Reveal, SiteHeader } from "@/components/site/Primitives";
import { SearchIcon } from "@/components/site/icons";

// ─── Navigation tree ────────────────────────────────────────────────────────

const docsTree = [
  {
    category: "Getting Started",
    items: [
      "Introduction",
      "Why Blocklog",
      "How Blocklog Works",
      "Quick Start (5 minutes)",
      "Shadow Mode Setup",
      "Your First Decision Log",
    ],
  },
  {
    category: "Core Concepts",
    items: [
      "Integrity Model",
      "Decision Logging",
      "Cryptographic Signing",
      "Verification",
      "Audit Trails",
    ],
  },
  {
    category: "Security",
    items: [
      "Security Model",
      "Tenant Isolation",
      "Authentication & Authorization",
      "Rate Limiting",
      "Secret Handling",
    ],
  },
  {
    category: "API Reference",
    items: [
      "Authentication",
      "Logs API",
      "Batches & Signing API",
      "Verification API",
      "Decisions API",
      "HITL Overrides API",
      "Forensics & Replay API",
      "Compliance Reports API",
      "Alerts API",
      "Webhooks API",
      "Execution Gate API",
      "Integrity API",
    ],
  },
];

// ─── Content ─────────────────────────────────────────────────────────────────

type DocSection = {
  title: string;
  body: string;
  code?: { label: string; snippet: string }[];
  table?: { headers: string[]; rows: string[][] };
  subsections?: { heading: string; body: string; code?: string }[];
};

const docContent: Record<string, DocSection> = {
  // ── Getting Started ──────────────────────────────────────────────────────

  Introduction: {
    title: "Introduction",
    body: "Blocklog is a tamper-evident logging and decision-integrity platform. It records why a system took a specific action, what data it used, and who authorized it — then makes that record mathematically verifiable by anyone, at any time, without trusting Blocklog itself.\n\nEvery log is cryptographically chained to the one before it. Batches of logs are sealed into Merkle trees and signed with Ed25519 cryptographic signatures. The result is forensic-grade evidence that survives database breaches, malicious insiders, and compliance audits alike.",
    subsections: [
      {
        heading: "Who is Blocklog for?",
        body: "Blocklog is purpose-built for teams where the answer to \"Did this really happen exactly as recorded?\" carries legal, financial, or severe security weight. If you are building AI agents that execute trades or approve loans, operating a fintech platform under SOC 2 or HIPAA, or managing high-privilege access in a regulated environment, Blocklog belongs in your stack.",
      },
      {
        heading: "Base URL",
        body: "All API requests are made over HTTPS to the following base URL:",
        code: "https://blocklogsecurity.com/app/api/v1",
      },
    ],
  },

  "Why Blocklog": {
    title: "Why Blocklog",
    body: "Observability tools — Datadog, New Relic, CloudWatch — are optimized for speed, volume, and searchability. They help debug crashes and monitor latency. But because they are optimized for performance, they make a critical trade-off: mutability. An administrator, or an attacker who has compromised an administrator's credentials, can silently alter or delete logs. When an auditor asks for definitive proof that an action occurred exactly as recorded, observability tools cannot provide mathematical certainty.\n\nDistributed tracing tools track the flow of a request across microservices. Traces are ephemeral and mutable. They tell you where a request went — not why an AI agent or a human operator made a specific decision, and not with a non-repudiable cryptographic record.\n\nBlocklog is optimized for integrity, immutability, and independent verification. It acts as a digital notary for your most critical application events.",
    subsections: [
      {
        heading: "Key Differentiators",
        body: "Mathematical Certainty — every log can be independently verified via Ed25519 cryptographic signatures without trusting Blocklog's own infrastructure.\n\nChain of Custody — Blocklog proves not just that a log exists, but the exact sequence of events leading up to it.\n\nZero-Knowledge Proofs — prove to a third-party regulator that a specific event occurred without exposing your entire logging database, using Merkle batching.",
      },
      {
        heading: "Primary Use Cases",
        body: "AI Agents & LLMs: when an autonomous agent executes a trade or approves a loan, you must prove exactly what prompt and context led to that action.\n\nFintech & Trading: every ledger transaction and compliance override must be immutable and audit-ready.\n\nHealthcare (HIPAA): access to patient records must be logged in a way that mathematically proves the logs were never altered.\n\nAccess Control: high-privilege access (e.g. granting production SSH keys) requires a tamper-evident audit trail.",
      },
    ],
  },

  "How Blocklog Works": {
    title: "How Blocklog Works",
    body: "Blocklog's integrity rests on four stacked layers. Each layer compensates for the attack surface left by the one below it.",
    subsections: [
      {
        heading: "Layer 1 — Immutable Storage",
        body: "The API exposes no endpoints to modify or delete existing logs. The source of truth is an append-only JSONL ledger. For production deployments, this ledger should be synced to an object storage bucket (e.g. AWS S3) configured with WORM (Write Once, Read Many) retention policies, preventing even a rogue database administrator from deleting data.",
      },
      {
        heading: "Layer 2 — Hash Chaining",
        body: "Every log is cryptographically linked to its predecessor using SHA-256:\n\nSHA256(Log N Data + Hash of Log N-1)\n\nAltering any single log changes its hash, which invalidates every subsequent log's hash. Tampering immediately breaks the chain and triggers a high-priority integrity violation alert.",
      },
      {
        heading: "Layer 3 — Merkle Batching",
        body: "Periodically, a set of logs is sealed into a batch. A Merkle Tree is constructed from the hashes of those logs. The resulting Merkle Root is a single 32-byte hash that mathematically represents every log in the batch. This enables zero-knowledge proofs: you can prove a specific log is part of a batch without revealing any other log in that batch.",
      },
      {
        heading: "Layer 4 — Cryptographic Signing",
        body: "The Merkle Root is signed with Ed25519 cryptographic signature. Once signed, the signature provides tamper-evidence — no single entity, including Blocklog, can rewrite the history without invalidating the signature — and cryptographic timestamping that proves the logs existed at that exact moment.",
      },
    ],
  },

  "Quick Start (5 minutes)": {
    title: "Quick Start (5 minutes)",
    body: "This guide gets your first tamper-evident log ingested in under five minutes.",
    code: [
      {
        label: "1. Install the SDK",
        snippet: `pip install blocklog
# or
pip install blocklog`,
      },
      {
        label: "2. Ingest your first log",
        snippet: `curl -X POST "https://blocklogsecurity/api/v1/logs" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event_type": "user.login",
    "source": "auth-service",
    "data": {
      "user_id": "usr_8821",
      "ip": "203.0.113.42",
      "method": "oauth2"
    }
  }'`,
      },
      {
        label: "3. Verify the log",
        snippet: `curl -X GET "https://blocklogsecurity/api/v1/logs/{log_id}/verify" \\
  -H "X-API-Key: YOUR_API_KEY"`,
      },
    ],
    subsections: [
      {
        heading: "Response",
        body: "A successful ingest returns a log_id, company_id, event_type, source, and created_at timestamp. Store the log_id — you will use it for verification, Merkle proof retrieval, and forensic replay.",
      },
    ],
  },

  "Shadow Mode Setup": {
    title: "Shadow Mode Setup",
    body: "Shadow mode lets Blocklog observe and record your decision pipeline without blocking live execution. It is the safest way to introduce Blocklog to a production environment before full enforcement is enabled.\n\nIn shadow mode, every log is ingested, hash-chained, and made eligible for Merkle batching and signing — but failed ingestion calls are silently swallowed rather than surfaced to your application. Once you confirm the integration is healthy, switch mode to enforce.",
    code: [
      {
        label: "TypeScript — shadow mode",
        snippet: `import { Blocklog } from '@blocklog/sdk';

const blocklog = new Blocklog({
  apiKey: process.env.BLOCKLOG_API_KEY,
  mode: 'shadow',      // 'shadow' | 'enforce'
  agentId: 'loan-approval-agent-v3',
});

const result = await blocklog.observe(async () => {
  return await loanAgent.evaluate(application);
});
// Governance record created — execution never blocked.`,
      },
    ],
  },

  "Your First Decision Log": {
    title: "Your First Decision Log",
    body: "Standard logs record that something happened. Decision logs record why — the context, inputs, policy, outcome, and actor that together constitute a complete, auditable chain of custody for any system action.\n\nThis is critical for AI agents, financial algorithms, and access control systems where compliance requires more than a timestamp and a status code.",
    code: [
      {
        label: "Recommended decision log schema",
        snippet: `{
  "event_type": "loan_approval_decision",
  "actor": {
    "id": "agent-123",
    "type": "ai_model",
    "version": "gpt-4-turbo-2024-04-09"
  },
  "context": {
    "application_id": "app-8891",
    "credit_score": 720,
    "requested_amount": 50000
  },
  "policy": {
    "id": "policy-v2.1",
    "description": "Approve loans under 100k if credit score > 700"
  },
  "decision": {
    "action": "APPROVED",
    "confidence_score": 0.98,
    "reasoning": "Credit score meets minimum threshold for requested amount."
  }
}`,
      },
    ],
    subsections: [
      {
        heading: "Human-in-the-Loop (HITL)",
        body: "When an AI agent flags an action as ambiguous or high-risk, Blocklog records the pending decision. A human operator reviews the immutably preserved context and records their final authorization. Both the agent's initial assessment and the human's approval are cryptographically linked, creating an unbroken chain of custody for the decision. See the HITL Overrides API section for implementation details.",
      },
    ],
  },

  // ── Core Concepts ────────────────────────────────────────────────────────

  "Integrity Model": {
    title: "Integrity Model",
    body: "Blocklog's integrity model has four layers. Removing any one of them would leave an attack surface that the others cannot close.",
    subsections: [
      {
        heading: "Append-Only API",
        body: "The Blocklog API exposes no DELETE or PATCH endpoints for logs. Every write is final. The operational database is backed by an append-only JSONL ledger at exports/immutable_ledger.jsonl.",
      },
      {
        heading: "Hash Chaining",
        body: "Log N's chain_hash is computed as SHA256(Log N data + previous_hash). A background task (detect_integrity_drift) continuously verifies that this chain remains unbroken. Any tampering raises a high-priority alert that cannot be silently cleared.",
      },
      {
        heading: "Merkle Batching",
        body: "Sealed batches are represented by a single 32-byte Merkle Root. This enables lightweight, zero-knowledge inclusion proofs — you can prove a single log existed in a signed batch without revealing any other log.",
      },
      {
        heading: "Cryptographic Signing",
        body: "The Merkle Root is signed with Ed25519 cryptographic signature. The resulting signature is the permanent, tamper-evident timestamp for the entire batch. Even Blocklog cannot retroactively alter a signed batch — the cryptographic signature prevents it.",
      },
    ],
  },

  "Decision Logging": {
    title: "Decision Logging",
    body: "A decision log captures the complete causal record of a system action: the context, the inputs evaluated, the policy consulted, the outcome produced, and the actor responsible. It is the difference between an audit trail that says an action occurred and one that proves why it was taken.\n\nBlocklog accepts arbitrary JSON payloads — you define the schema. The recommended structure below maximizes compatibility with the Dashboard, verification tools, and compliance report generation.",
    code: [
      {
        label: "Decision log fields",
        snippet: `POST /api/v1/logs

{
  "event_type": "string",          // required — identifies the decision type
  "actor_id": "string",            // optional — agent or user ID
  "actor_type": "ai_model|human",  // optional
  "agent_metadata": {},            // optional — model version, prompt hash, etc.
  "data": {},                      // optional — your full decision payload
  "policy": {},                    // recommended — rule or prompt that guided the decision
  "trace_id": "string",            // optional — correlates events across a workflow
  "session_id": "string",          // optional
  "workflow_id": "string",         // optional
  "idempotency_key": "string"      // optional — prevents duplicate ingestion
}`,
      },
    ],
  },

  "Cryptographic Signing": {
    title: "Cryptographic Signing",
    body: "Cryptographic signing gives Blocklog its tamper-evident guarantee beyond the local hash chain. It proves that an entire body of logs existed at a specific point in time and has not been rewritten from scratch.",
    subsections: [
      {
        heading: "Automatic Signing",
        body: "In managed environments, Blocklog automatically seals and signs batches based on your configured retention and security policies — typically every hour or after 10,000 logs.",
      },
      {
        heading: "Manual Signing",
        body: "For self-hosted deployments or high-value events, you can seal a batch on demand:",
        code: `# Seal the current batch
curl -X POST "https://blocklogsecurity/api/v1/batches/seal" \\
  -H "X-API-Key: YOUR_API_KEY"`,
      },
      {
        heading: "Verifying a Signature",
        body: "Once signed, you can retrieve the cryptographic proof bundle for any batch. The proof bundle contains the Merkle Root, the Ed25519 signature, and the timestamp. Use this bundle for offline verification without relying on the Blocklog API at all.",
        code: `GET /api/v1/batches/{batch_id}/proof-bundle`,
      },
      {
        heading: "Signature Algorithm",
        body: "Blocklog uses Ed25519 for cryptographic signing. Ed25519 provides strong security guarantees with fast verification times, making it ideal for high-volume logging systems.",
      },
    ],
  },

  Verification: {
    title: "Verification",
    body: "Verification is the process of proving — independently of Blocklog — that a specific log is authentic, unaltered, and existed at the time it was recorded.",
    subsections: [
      {
        heading: "1. Internal Hash Chain Verification",
        body: "Checks that the log's chain_hash is consistent with its predecessor. Blocklog runs this continuously via the detect_integrity_drift background task. You can also trigger it manually:",
        code: `GET /api/v1/logs/{log_id}/verify`,
      },
      {
        heading: "2. Signature Verification",
        body: "If your application signs logs at the source before sending them to Blocklog (using log_signature and public_key_id), Blocklog verifies the signature to confirm the log originated from your trusted application and has not been altered in transit or at rest.",
      },
      {
        heading: "3. Merkle Proof Verification",
        body: "Proves that a specific log is part of an anchored batch without revealing other logs in that batch. Blocklog generates a proof bundle containing the log's hash and the sibling hashes needed to reconstruct the Merkle Root.",
        code: `GET /api/v1/verify/log/{log_id}
GET /api/v1/verify/batch/{batch_id}`,
      },
      {
        heading: "4. Cryptographic Verification (Offline)",
        body: "The gold standard for compliance audits. Export the proof bundle, calculate the SHA-256 hash of the raw log data yourself, reconstruct the Merkle Root using a standard library, then verify the Ed25519 signature using the public key. No Blocklog infrastructure required.",
        code: `# 1. Export the proof bundle
GET /api/v1/logs/export-proof?from=2024-01-01T00:00:00Z&to=2024-01-02T00:00:00Z

# 2. Public verification (no API key required)
GET /api/v1/public/verify/{proof_id}`,
      },
    ],
  },

  "Audit Trails": {
    title: "Audit Trails",
    body: "Blocklog applies the same cryptographic integrity guarantees to its own internal operations. Every administrative action within your tenant workspace is recorded in a tamper-evident audit trail — including actions taken by Blocklog's own infrastructure.",
    subsections: [
      {
        heading: "What Is Tracked",
        body: "API Key Management: creation, rotation, and revocation of API keys.\n\nUser Management: user signups, role changes, and login events.\n\nCompany Settings: changes to retention policies, anchoring schedules, and webhook configurations.\n\nBilling Events: plan upgrades, downgrades, and payment processing events.",
      },
      {
        heading: "Why It Matters",
        body: "For SOC 2, ISO 27001, and HIPAA, demonstrating tight control over access to sensitive systems is a strict requirement. If a malicious actor steals an admin's credentials and revokes a critical API key to disrupt your logging pipeline, that action is recorded immutably. The attacker cannot delete the evidence of their own intrusion.",
      },
      {
        heading: "Accessing Audit Trails",
        body: "View the administrative audit trail in the Dashboard under Console > Audit Trail. Programmatic access via the API is coming soon.",
      },
    ],
  },

  // ── Security ─────────────────────────────────────────────────────────────

  "Security Model": {
    title: "Security Model",
    body: "Blocklog employs defense-in-depth across every layer of the platform. The security model is designed so that a breach at any single layer — API, database, or infrastructure — does not compromise the integrity of historical logs.",
  },

  "Tenant Isolation": {
    title: "Tenant Isolation",
    body: "Blocklog is a multi-tenant platform. Data from one company is strictly isolated from all others through two complementary mechanisms.\n\nRow-Level Security (RLS): database queries are scoped to the authenticated company_id. A query that does not produce a valid company_id scope will not return rows.\n\nAPI Key Scoping: API keys are bound at creation time to a specific company. They cannot be used to read, write, or verify data belonging to any other tenant.",
  },

  "Authentication & Authorization": {
    title: "Authentication & Authorization",
    body: "Dashboard access uses JWT (JSON Web Tokens). Passwords are hashed using bcrypt.\n\nAPI access for ingestion and verification uses high-entropy Bearer Tokens passed via the X-API-Key header.\n\nRole-Based Access Control (RBAC) restricts access to sensitive endpoints and dashboard views by role: Admin, Auditor, Developer.",
    code: [
      {
        label: "Authenticating API requests",
        snippet: `curl -H "X-API-Key: YOUR_API_KEY" \\
     https://blocklogsecurity/api/v1/logs`,
      },
      {
        label: "Create an API key",
        snippet: `POST /api/v1/auth/api_keys
Authorization: Bearer <jwt>

{
  "name": "production-ingest",
  "role": "developer",
  "expires_in_days": 90,
  "rate_limit_per_minute": 1000
}`,
      },
    ],
  },

  "Rate Limiting": {
    title: "Rate Limiting",
    body: "A distributed Redis-backed rate limiter is enforced across all Blocklog instances. Default limits are 100 requests/second per API key and 1,000 logs/minute for ingestion.\n\nIf the distributed limiter fails (e.g. during a Redis outage), a process-local fallback limiter automatically activates to prevent overwhelming application servers. Rate limit events are recorded in the audit trail.",
  },

  "Secret Handling": {
    title: "Secret Handling",
    body: "API keys are generated using cryptographically secure random number generators (CSPRNG). Sensitive configuration values — Ed25519 signing keys, JWT secrets — are injected via environment variables and are never stored in source code or the operational database.\n\nEvidence signing keys are managed separately from general application secrets and are not accessible via the standard API key endpoints.",
  },

  // ── API Reference ────────────────────────────────────────────────────────

  Authentication: {
    title: "Authentication",
    body: "All API endpoints require authentication via an X-API-Key header. You can view and manage your API keys in the Blocklog Dashboard or programmatically via the auth endpoints.\n\nJWT-based authentication (Authorization: Bearer <token>) is also accepted on all endpoints and is required for admin and user management operations.",
    code: [
      {
        label: "Signup",
        snippet: `POST /api/v1/auth/signup

{
  "username": "ada.lovelace",
  "email": "ada@example.com",
  "password": "••••••••",
  "workspace_name": "Acme Corp"         // optional — creates a new company
}

// Response
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user_id": 42,
  "company_id": "cmp_8821abc"
}`,
      },
      {
        label: "Login",
        snippet: `POST /api/v1/auth/login

{
  "email": "ada@example.com",
  "password": "••••••••"
}`,
      },
      {
        label: "Create API key",
        snippet: `POST /api/v1/auth/api_keys
Authorization: Bearer <jwt>

{
  "name": "ci-ingest",
  "role": "developer",
  "expires_in_days": 365,
  "rate_limit_per_minute": 500
}

// Response includes the raw api_key — store it securely.
// It is not retrievable after creation.`,
      },
      {
        label: "Revoke API key",
        snippet: `DELETE /api/v1/auth/api_keys/{key_id}
Authorization: Bearer <jwt>`,
      },
    ],
  },

  "Logs API": {
    title: "Logs API",
    body: "The Logs API is the primary ingestion and retrieval interface. All logs are immutable once written.",
    code: [
      {
        label: "Ingest a single log",
        snippet: `POST /api/v1/logs
X-API-Key: YOUR_API_KEY

{
  "event_type": "payment.authorized",   // required
  "source": "payment-service",          // optional
  "data": { ... },                      // optional — arbitrary JSON
  "actor_id": "usr_8821",               // optional
  "actor_type": "human",                // optional
  "trace_id": "trace_abc123",           // optional — links related events
  "session_id": "sess_xyz",             // optional
  "workflow_id": "wf_001",              // optional
  "idempotency_key": "unique-key-1",    // optional — prevents duplicates
  "log_signature": "...",               // optional — source-signed payload
  "public_key_id": "key_v1"            // optional — key used to verify signature
}

// Response
{
  "log_id": "log_a1b2c3",
  "company_id": "cmp_8821abc",
  "event_type": "payment.authorized",
  "source": "payment-service",
  "created_at": "2024-06-01T12:00:00Z"
}`,
      },
      {
        label: "Batch ingest",
        snippet: `POST /api/v1/logs/batch
X-API-Key: YOUR_API_KEY

{
  "logs": [
    { "event_type": "step.started", "trace_id": "trace_abc123", "data": { ... } },
    { "event_type": "step.completed", "trace_id": "trace_abc123", "data": { ... } }
  ]
}`,
      },
      {
        label: "List logs",
        snippet: `GET /api/v1/logs
  ?event_type=payment.authorized
  &trace_id=trace_abc123
  &from=2024-06-01T00:00:00Z
  &to=2024-06-02T00:00:00Z
  &limit=50
  &cursor=<pagination_cursor>
  &integrity=valid               // filter: valid | violated | unverified
  &q=search+term`,
      },
      {
        label: "Get a single log",
        snippet: `GET /api/v1/logs/{log_id}`,
      },
      {
        label: "Verify a log's chain integrity",
        snippet: `GET /api/v1/logs/{log_id}/verify`,
      },
      {
        label: "Export proof bundle",
        snippet: `GET /api/v1/logs/export-proof?from=2024-06-01T00:00:00Z&to=2024-06-02T00:00:00Z`,
      },
    ],
  },

  "Batches & Signing API": {
    title: "Batches & Signing API",
    body: "Batches group logs for Merkle tree construction and cryptographic signing. In managed environments this happens automatically. In self-hosted or high-assurance environments you can drive the lifecycle manually.",
    code: [
      {
        label: "Seal the current batch",
        snippet: `POST /api/v1/batches/seal
X-API-Key: YOUR_API_KEY

// Optional query param:
?interval_minutes=60`,
      },
      {
        label: "List batches",
        snippet: `GET /api/v1/batches?limit=20&offset=0`,
      },
      {
        label: "Get batch details",
        snippet: `GET /api/v1/batches/{batch_id}`,
      },
      {
        label: "Get batch status",
        snippet: `GET /api/v1/batches/{batch_id}/status`,
      },
      {
        label: "Anchor a batch",
        snippet: `POST /api/v1/batches/{batch_id}/anchor`,
      },
      {
        label: "Get proof bundle",
        snippet: `GET /api/v1/batches/{batch_id}/proof-bundle`,
      },
      {
        label: "Get anchor proof",
        snippet: `GET /api/v1/anchors/{batch_id}`,
      },
    ],
  },

  "Verification API": {
    title: "Verification API",
    body: "Verification endpoints produce cryptographic proof that a specific log or batch is authentic and unaltered. These proofs can be reconstructed offline without any Blocklog infrastructure.",
    code: [
      {
        label: "Verify a log",
        snippet: `GET /api/v1/verify/log/{log_id}
X-API-Key: YOUR_API_KEY

// Returns: log hash, Merkle siblings, Merkle root, batch ID,
// Ed25519 signature, and signed_at timestamp.`,
      },
      {
        label: "Verify a batch",
        snippet: `GET /api/v1/verify/batch/{batch_id}
X-API-Key: YOUR_API_KEY`,
      },
      {
        label: "Public verification (no API key)",
        snippet: `GET /api/v1/public/verify/{proof_id}

// Share proof_id with auditors or regulators.
// They verify independently without accessing your tenant.`,
      },
      {
        label: "Integrity status",
        snippet: `GET /api/v1/integrity/status
GET /api/v1/integrity/report`,
      },
    ],
  },

  "Decisions API": {
    title: "Decisions API",
    body: "The Decisions API provides first-class support for recording, retrieving, and verifying structured decision records — including AI agent decisions, human authorization events, and policy evaluations.",
    code: [
      {
        label: "Create a decision record",
        snippet: `POST /api/v1/decisions
X-API-Key: YOUR_API_KEY

{
  "actor": {
    "id": "agent-loan-v3",
    "type": "ai_model",
    "version": "gpt-4-turbo-2024-04-09"
  },
  "model": "gpt-4-turbo",
  "prompt": { "hash": "sha256:abc...", "version": "prompt-v2.1" },
  "inputs": { "credit_score": 720, "amount": 50000 },
  "outputs": { "action": "APPROVED", "confidence": 0.98 },
  "policies": [{ "id": "policy-v2.1", "description": "Approve loans under 100k if score > 700" }],
  "status": "pending_review"
}

// Response
{
  "id": "dec_a1b2c3",
  "company_id": "cmp_8821abc",
  "created_at": "2024-06-01T12:00:00Z"
}`,
      },
      {
        label: "Get a decision",
        snippet: `GET /api/v1/decisions/{decision_id}`,
      },
      {
        label: "Verify a decision",
        snippet: `GET /api/v1/decisions/{decision_id}/verify`,
      },
      {
        label: "Get decision timeline",
        snippet: `GET /api/v1/decisions/{decision_id}/timeline`,
      },
      {
        label: "Get decision evidence",
        snippet: `GET /api/v1/decisions/{decision_id}/evidence`,
      },
      {
        label: "Get decision replay",
        snippet: `GET /api/v1/decisions/{decision_id}/replay`,
      },
    ],
  },

  "HITL Overrides API": {
    title: "HITL Overrides API",
    body: "Human-in-the-Loop (HITL) endpoints let human operators review AI decisions and record their authorization, rejection, or escalation. Every override action is cryptographically chained to the original decision record.",
    code: [
      {
        label: "List pending overrides",
        snippet: `GET /api/v1/hitl/overrides`,
      },
      {
        label: "Get an override",
        snippet: `GET /api/v1/hitl/overrides/{override_id}`,
      },
      {
        label: "Approve a decision",
        snippet: `POST /api/v1/hitl/approve?log_id={log_id}`,
      },
      {
        label: "Reject a decision",
        snippet: `POST /api/v1/hitl/reject

{
  "reviewer": "jane.smith@example.com",
  "rejection_reason": "Credit bureau data is stale — manual review required."
}`,
      },
      {
        label: "Escalate a decision",
        snippet: `POST /api/v1/hitl/escalate

{
  "current_reviewer": "jane.smith@example.com",
  "escalation_target": "risk-committee@example.com",
  "escalation_reason": "Amount exceeds single-reviewer threshold."
}`,
      },
      {
        label: "Get HITL audit trail",
        snippet: `GET /api/v1/hitl/audit-trail

// Returns all approve, reject, and escalate actions
// with reviewer, timestamp, and cryptographic chain position.`,
      },
    ],
  },

  "Forensics & Replay API": {
    title: "Forensics & Replay API",
    body: "The Forensics API reconstructs the complete causal record for any trace, session, workflow, or execution token. Replays are read-only reconstructions — they do not affect live data.",
    code: [
      {
        label: "Create a forensic replay",
        snippet: `POST /api/v1/forensics/replays
X-API-Key: YOUR_API_KEY

{
  "trace_id": "trace_abc123",    // provide one of:
  // "session_id": "sess_xyz",
  // "workflow_id": "wf_001",
  // "token_id": "tok_001"
}`,
      },
      {
        label: "Get replay",
        snippet: `GET /api/v1/forensics/replays/{replay_session_id}`,
      },
      {
        label: "Get replay timeline",
        snippet: `GET /api/v1/forensics/replays/{replay_session_id}/timeline`,
      },
      {
        label: "Get causal graph",
        snippet: `GET /api/v1/forensics/replays/{replay_session_id}/causal-graph`,
      },
      {
        label: "Get staleness analysis",
        snippet: `GET /api/v1/forensics/replays/{replay_session_id}/staleness`,
      },
      {
        label: "Get root cause",
        snippet: `GET /api/v1/forensics/replays/{replay_session_id}/root-cause`,
      },
      {
        label: "Run counterfactual analysis",
        snippet: `POST /api/v1/forensics/replays/{replay_session_id}/counterfactuals

{
  "token_id": "tok_001",
  "scenarios": [
    { "field": "credit_score", "value": 680 },
    { "field": "requested_amount", "value": 120000 }
  ]
}`,
      },
      {
        label: "Compare two replays",
        snippet: `POST /api/v1/forensics/compare

{
  "baseline_session_id": "rpl_baseline",
  "candidate_session_id": "rpl_candidate"
}`,
      },
    ],
  },

  "Compliance Reports API": {
    title: "Compliance Reports API",
    body: "Compliance reports consolidate logs, decisions, verification proofs, and HITL records into structured, exportable documents mapped to specific regulatory frameworks.",
    code: [
      {
        label: "Generate a report",
        snippet: `POST /api/v1/compliance/reports
X-API-Key: YOUR_API_KEY

{
  "title": "Q2 2024 SOC2 Audit — Loan Approvals",
  "report_kind": "soc2",
  "scope_type": "trace",
  "trace_id": "trace_abc123",
  "schedule_frequency": "monthly"    // optional
}`,
      },
      {
        label: "List reports",
        snippet: `GET /api/v1/compliance/reports`,
      },
      {
        label: "Get report detail",
        snippet: `GET /api/v1/compliance/reports/{report_id}`,
      },
      {
        label: "Export report (PDF)",
        snippet: `GET /api/v1/compliance/reports/{report_id}/export?download=true`,
      },
      {
        label: "Share report with auditors",
        snippet: `POST /api/v1/compliance/reports/{report_id}/share

{
  "recipients": ["auditor@regulator.gov"],
  "note": "Q2 audit package",
  "create_auditor_api_key": true,    // creates a read-only key for the recipient
  "expires_in_days": 30
}`,
      },
      {
        label: "Compliance dashboard",
        snippet: `GET /api/v1/compliance/dashboard`,
      },
    ],
  },

  "Alerts API": {
    title: "Alerts API",
    body: "The Alerts API lets you define rules that fire when specific event types are ingested, and retrieve the resulting alert events.",
    code: [
      {
        label: "Create an alert rule",
        snippet: `POST /api/v1/alerts/rules
X-API-Key: YOUR_API_KEY

{
  "name": "integrity-violation-critical",
  "event_type": "integrity.chain_broken",
  "severity": "critical",
  "channels": ["pagerduty", "slack"],
  "cooldown_seconds": 300
}`,
      },
      {
        label: "List alert rules",
        snippet: `GET /api/v1/alerts/rules`,
      },
      {
        label: "List alert events",
        snippet: `GET /api/v1/alerts/events`,
      },
      {
        label: "Emit an alert event",
        snippet: `POST /api/v1/alerts/events

{
  "event_type": "policy.threshold_exceeded",
  "severity": "warning",
  "payload": { "policy_id": "policy-v2.1", "count": 47 },
  "trace_id": "trace_abc123"
}`,
      },
    ],
  },

  "Webhooks API": {
    title: "Webhooks API",
    body: "Webhooks deliver real-time notifications to your infrastructure when Blocklog emits specific event types — including integrity violations, batch anchoring completions, and HITL override requests.",
    code: [
      {
        label: "Register a webhook",
        snippet: `POST /api/v1/webhooks
X-API-Key: YOUR_API_KEY

{
  "event_type": "batch.anchored",
  "target_url": "https://your-service.example.com/hooks/blocklog",
  "signing_secret": "whsec_••••••••"   // optional — for payload verification
}

// Response
{
  "webhook_id": "wh_abc123",
  "event_type": "batch.anchored",
  "target_url": "https://your-service.example.com/hooks/blocklog",
  "is_active": true,
  "created_at": "2024-06-01T12:00:00Z"
}`,
      },
      {
        label: "List webhook event types",
        snippet: `GET /api/v1/webhooks/events`,
      },
    ],
  },

  "Execution Gate API": {
    title: "Execution Gate API",
    body: "The Execution Gate issues short-lived, cryptographically signed tokens that authorize a specific action — amount, currency, processor, and subject — before it is executed. The downstream system must verify the token before proceeding. This creates a pre-execution authorization record that is immutably linked to the post-execution log.",
    code: [
      {
        label: "Issue an execution token",
        snippet: `POST /api/v1/execution/authorize
X-API-Key: YOUR_API_KEY

{
  "processor": "stripe",
  "action_type": "charge",
  "amount_minor": 5000,           // in smallest currency unit (e.g. cents)
  "currency": "USD",
  "idempotency_key": "charge-unique-001",
  "subject_reference": "cus_8821abc",
  "trace_id": "trace_abc123",
  "approval": {
    "approver_id": "agent-loan-v3",
    "approver_type": "ai_model"
  }
}`,
      },
      {
        label: "Verify an execution token",
        snippet: `POST /api/v1/execution/verify

{
  "token": "<signed_execution_token>",
  "processor": "stripe",
  "action_type": "charge",
  "amount_minor": 5000,
  "currency": "USD",
  "idempotency_key": "charge-unique-001",
  "subject_reference": "cus_8821abc",
  "enforce": true   // if true, token is consumed and cannot be reused
}`,
      },
      {
        label: "Fetch execution receipt",
        snippet: `GET /api/v1/execution/receipts/{receipt_id}`,
      },
      {
        label: "Counterfactual simulation",
        snippet: `POST /api/v1/execution/simulations

{
  "token_id": "tok_001",
  "scenarios": [
    { "field": "amount_minor", "value": 150000 }
  ]
}`,
      },
    ],
  },

  "Integrity API": {
    title: "Integrity API",
    body: "The Integrity API exposes the continuous chain verification state for your tenant. Use these endpoints to monitor for drift, confirm verification coverage, and generate integrity reports for auditors.",
    code: [
      {
        label: "Get integrity status",
        snippet: `GET /api/v1/integrity/status
X-API-Key: YOUR_API_KEY

// Response indicates: chain_status, last_verified_log_id,
// last_verified_at, violation_count, and coverage_percent.`,
      },
      {
        label: "Get integrity report",
        snippet: `GET /api/v1/integrity/report`,
      },
    ],
  },
};

// ─── Renderer helpers ─────────────────────────────────────────────────────────

function CodeBlock({ snippet }: { snippet: string }) {
  return (
    <pre className="mt-3 overflow-auto rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 text-xs leading-6 text-white/70">
      {snippet}
    </pre>
  );
}

function DocBody({ section }: { section: DocSection }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm leading-7 text-white/74 whitespace-pre-line">{section.body}</p>
      </div>

      {section.code && section.code.length > 0 && (
        <div className="space-y-6">
          {section.code.map((c) => (
            <div key={c.label}>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-1">{c.label}</p>
              <CodeBlock snippet={c.snippet} />
            </div>
          ))}
        </div>
      )}

      {section.subsections && section.subsections.length > 0 && (
        <div className="space-y-7 border-t border-white/8 pt-7">
          {section.subsections.map((sub) => (
            <div key={sub.heading}>
              <h3 className="text-sm font-semibold text-white/90 mb-2">{sub.heading}</h3>
              <p className="text-sm leading-7 text-white/68 whitespace-pre-line">{sub.body}</p>
              {sub.code && <CodeBlock snippet={sub.code} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Introduction");

  const filteredTree = useMemo(() => {
    if (!query.trim()) return docsTree;
    const needle = query.toLowerCase();
    return docsTree
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLowerCase().includes(needle)),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  const section = docContent[active];

  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <section className="section-block pt-32">
          <div className="content-wrap">
            <Reveal className="grid gap-6 lg:grid-cols-[320px_1fr]">
              {/* ── Sidebar ── */}
              <aside className="liquid-glass h-fit rounded-[2rem] p-4 lg:sticky lg:top-28">
                <div className="mb-4 flex items-center gap-3 rounded-full border border-white/10 px-4 py-3">
                  <SearchIcon width={15} height={15} />
                  <input
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                    placeholder="Search documentation..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="scrollbar-thin max-h-[70vh] overflow-auto pr-2">
                  {filteredTree.map((group) => (
                    <div className="mb-5" key={group.category}>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/38">
                        {group.category}
                      </p>
                      <div className="grid gap-1">
                        {group.items.map((item) => (
                          <button
                            className={`rounded-full px-4 py-2.5 text-left text-sm transition-colors ${
                              active === item
                                ? "bg-white text-black font-medium"
                                : "liquid-glass text-white/72 hover:text-white"
                            }`}
                            key={item}
                            onClick={() => setActive(item)}
                            type="button"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

              {/* ── Content ── */}
              <div className="space-y-6">
                {/* Header card */}
                <Reveal>
                  <div className="liquid-glass-strong rounded-[2.4rem] p-6 md:p-8">
                    <p className="eyebrow">Documentation</p>
                    <h1 className="mt-4 text-5xl serif-italic">Blocklog Docs</h1>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-white/72">
                      Tamper-evident logging, cryptographic decision records, and independent
                      verification — for teams where proof matters.
                    </p>
                  </div>
                </Reveal>

                {/* Active section */}
                <Reveal delay={0.08}>
                  <div className="liquid-glass rounded-[2.4rem] p-6 md:p-8">
                    {section ? (
                      <>
                        <p className="eyebrow">{active}</p>
                        <h2 className="mt-3 text-2xl font-semibold text-white mb-6">
                          {section.title}
                        </h2>
                        <DocBody section={section} />
                      </>
                    ) : (
                      <>
                        <p className="eyebrow">{active}</p>
                        <p className="mt-4 text-sm leading-7 text-white/74">
                          Detailed reference content for this section is being prepared.
                        </p>
                      </>
                    )}
                  </div>
                </Reveal>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}