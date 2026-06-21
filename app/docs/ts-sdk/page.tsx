"use client";

import Link from "next/link";

type Field = {
  name: string;
  type: string;
  description: string;
};

type ListItem = {
  name: string;
  description: string;
};

type ApiSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  signature: string;
  paramsLabel?: string;
  params?: Field[];
  warning?: string;
  list?: { label: string; items: ListItem[] };
  notes?: string[];
  example: string;
};

function CodeBlock({ code, small = false }: { code: string; small?: boolean }) {
  return (
    <pre className={["overflow-x-auto rounded-xl border border-white/10 bg-black/30 text-zinc-200", small ? "p-4 text-[13px] leading-6" : "p-4 text-sm leading-6 sm:p-5"].join(" ")}>
      <code>{code}</code>
    </pre>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-sm leading-6 text-amber-200">
      <span className="font-semibold">Note — </span>
      {children}
    </div>
  );
}

function NoteList({ notes }: { notes: string[] }) {
  return (
    <ul className="mt-4 space-y-1.5 text-[13px] leading-6 text-muted">
      {notes.map((n, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-zinc-500">—</span>
          <span>{n}</span>
        </li>
      ))}
    </ul>
  );
}

function ApiSection({ id, eyebrow, title, description, signature, paramsLabel = "Parameters", params, warning, list, notes, example }: ApiSectionProps) {
  return (
    <section id={id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
      <h2 className="text-lg font-semibold tracking-tight text-white"><code>{title}</code></h2>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-[15px]">{description}</p>
      {warning && <Callout>{warning}</Callout>}
      <div className="mt-4"><CodeBlock code={signature} /></div>
      {params && params.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">{paramsLabel}</h3>
          <ul className="mt-3 space-y-3 text-sm leading-7 text-muted">
            {params.map((param) => (
              <li key={param.name} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <code className="text-zinc-100">{param.name}</code>
                <span className="text-zinc-400"> · {param.type}</span>
                <p className="mt-1">{param.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {list && list.items.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">{list.label}</h3>
          <ul className="mt-3 space-y-3 text-sm leading-7 text-muted">
            {list.items.map((item) => (
              <li key={item.name} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <code className="text-zinc-100">{item.name}</code>
                <p className="mt-1">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-white">Example</h3>
        <div className="mt-3"><CodeBlock code={example} small /></div>
      </div>
      {notes && notes.length > 0 && <NoteList notes={notes} />}
    </section>
  );
}

const sections: ApiSectionProps[] = [
  {
    id: "constructor",
    eyebrow: "Constructor",
    title: "new BlocklogClient()",
    description: "The main entry point and orchestration layer. Coordinates configuration, tracing, the event pipeline, queues, and transport — while keeping minimal business logic of its own.",
    signature: `new BlocklogClient(
  config: BlocklogConfig,
  dependencies?: ClientDependencies
)`,
    params: [
      { name: "config", type: "BlocklogConfig", description: "Configuration object. See BlocklogConfig below." },
      { name: "dependencies", type: "ClientDependencies, optional", description: "Dependency injection overrides — transport, retry, buffer, processor, memoryQueue, persistentQueue, deadLetterQueue. Mainly used for testing." },
    ],
    list: {
      label: "Key client properties",
      items: [
        { name: "decisions: DecisionsClient", description: "Create, get, list, search, update, and verify decision records." },
        { name: "traces: TracesClient", description: "Retrieve traces and trace timelines." },
        { name: "approvals: ApprovalClient", description: "Human-in-the-loop approval workflows. Aliased as client.hitl." },
        { name: "incidents: IncidentsClient", description: "Create, update, assign, resolve, and close incidents." },
        { name: "compliance: ComplianceClient", description: "Generate audits, dashboards, and exportable evidence." },
        { name: "replay: ReplayClient", description: "Reconstruct, verify, replay, and compare traces. Aliased as client.forensics." },
        { name: "traceManager: typeof TraceManager", description: "Static span-management class — see TraceManager below." },
      ],
    },
    example: `const client = new BlocklogClient({
  apiKey: 'your-api-key',
  endpoint: 'base_url',
  batchSize: 100,
  flushInterval: 5000
});`,
  },
  {
    id: "configuration",
    eyebrow: "Type",
    title: "BlocklogConfig",
    description: "The configuration object passed to the BlocklogClient constructor. Resolved into a ResolvedConfig internally, with environment-variable fallbacks and defaults applied.",
    signature: `interface BlocklogConfig {
  apiKey: string;
  endpoint?: string;
  batchSize?: number;
  flushInterval?: number;
  timeout?: number;
  retryCount?: number;
  enableSigning?: boolean;
  signingKey?: string;
  signingAlg?: 'hmac-sha256' | 'ed25519';
  enableCompression?: boolean;
  debug?: boolean;
}`,
    paramsLabel: "Fields",
    params: [
      { name: "apiKey", type: "string", description: "Required. Your Blocklog API key." },
      { name: "endpoint", type: "string, optional", description: "Override the default API base URL." },
      { name: "batchSize", type: "number, optional", description: "Events per batch flush. Default is 100." },
      { name: "flushInterval", type: "number, optional", description: "Milliseconds between automatic flushes." },
      { name: "timeout", type: "number, optional", description: "Per-request timeout in milliseconds." },
      { name: "retryCount", type: "number, optional", description: "Automatic retry attempts on failure." },
      { name: "enableSigning", type: "boolean, optional", description: "Turn on tamper-evident event signing." },
      { name: "signingKey", type: "string, optional", description: "Key used for signing, when enableSigning is true." },
      { name: "signingAlg", type: "'hmac-sha256' | 'ed25519', optional", description: "Signing algorithm. Defaults to hmac-sha256." },
      { name: "enableCompression", type: "boolean, optional", description: "Compress event payloads before sending." },
      { name: "debug", type: "boolean, optional", description: "Log every outbound request to stderr." },
    ],
    example: `const client = new BlocklogClient({
  apiKey: process.env.BLOCKLOG_API_KEY!,
  enableSigning: true,
  signingAlg: 'hmac-sha256',
  debug: process.env.NODE_ENV !== 'production'
});`,
  },
  {
    id: "event-methods",
    eyebrow: "Event Methods",
    title: "client.event() / client.enqueue()",
    description: "Send a single event immediately with event(), or buffer it for batched delivery with enqueue(). Both take the same arguments — enqueue() simply resolves to null while the event sits in the buffer.",
    signature: `event(eventType: string, payload: any, options?: EventOptions): Promise<IngestResponse>
enqueue(eventType: string, payload: any, options?: EventOptions): Promise<IngestResponse | null>`,
    params: [
      { name: "eventType", type: "string", description: "Event type identifier, e.g. \"AGENT_RUN\" or \"TOOL_CALL\"." },
      { name: "payload", type: "any", description: "Event payload data. Must be serializable." },
      { name: "options", type: "EventOptions, optional", description: "metadata, trace_id, span_id, and timestamp overrides." },
    ],
    example: `await client.event('AGENT_RUN', {
  agent_id: 'my-agent',
  input: 'test input',
  output: 'test output'
});

await client.enqueue('TOOL_CALL', {
  tool_name: 'calculator',
  input: '2 + 2',
  output: '4'
});`,
  },
  {
    id: "add-hook",
    eyebrow: "Middleware Method",
    title: "client.addHook()",
    description: "Register a middleware hook that can transform, enrich, validate, or filter every outbound event. Hooks run in the order they were added and may be async.",
    signature: `addHook(hook: MiddlewareHook): BlocklogClient

type MiddlewareHook = (event: EventEnvelope) => EventEnvelope | Promise<EventEnvelope> | null`,
    params: [
      { name: "hook", type: "MiddlewareHook", description: "Receives an EventEnvelope and returns a (possibly modified) envelope, or null to drop the event entirely." },
    ],
    example: `client.addHook((event) => {
  event.metadata = { ...event.metadata, enriched: true };
  return event;
});`,
    notes: [
      "Returning null from a hook skips the event entirely — useful for filtering debug events in production.",
      "addHook() returns the client itself, so calls can be chained.",
    ],
  },
  {
    id: "lifecycle-methods",
    eyebrow: "Lifecycle",
    title: "client.flush() / shutdown() / health()",
    description: "Manage the client's buffered events and background resources.",
    signature: `flush(): Promise<IngestResponse>
shutdown(): Promise<void>
health(): Promise<HealthStatus>`,
    list: {
      label: "What each call does",
      items: [
        { name: "flush()", description: "Flushes the pipeline, buffer, and queues, then awaits transport completion." },
        { name: "shutdown()", description: "Flushes everything, persists the queue, stops timers, and closes transports to prevent event loss." },
        { name: "health()", description: "Returns { healthy, queueDepth, pendingEvents, transportReady } for monitoring." },
      ],
    },
    example: `await client.flush();

const health = await client.health();
console.log(health);
// { healthy: true, queueDepth: 0, pendingEvents: 0, transportReady: true }

await client.shutdown();`,
  },
  {
    id: "trace-agent",
    eyebrow: "Decorator",
    title: "@traceAgent",
    description: "Trace an AI agent method automatically, emitting AGENT_START, AGENT_COMPLETE, and AGENT_ERROR events with input/output, duration, and trace context.",
    signature: `function traceAgent(options: AgentOptions | string)`,
    params: [
      { name: "options", type: "AgentOptions | string", description: "An agent name string, or an options object: { name, version, tags, metadata }." },
    ],
    warning: "Decorators read from the global client, not an instance you pass in directly — call setGlobalClient() before any @traceAgent method runs.",
    example: `class WeatherAgent {
  @traceAgent('weather-agent')
  async getWeather(location: string): Promise<string> {
    const response = await fetch(\`https://api.weather.com/\${location}\`);
    return (await response.json()).weather;
  }
}`,
    notes: [
      "Trace context (trace ID, span ID, parent span ID) propagates automatically to nested @traceAgent calls.",
      "On error, AGENT_ERROR is emitted with the error details before it propagates to the caller.",
    ],
  },
  {
    id: "execute-agent",
    eyebrow: "Method",
    title: "executeAgent()",
    description: "Trace an agent execution without a decorator — useful for functional code or one-off calls.",
    signature: `function executeAgent<T>(
  agentId: string,
  fn: () => Promise<T>,
  options?: AgentOptions
): Promise<T>`,
    params: [
      { name: "agentId", type: "string", description: "Agent identifier." },
      { name: "fn", type: "() => Promise<T>", description: "Function to execute and trace." },
      { name: "options", type: "AgentOptions, optional", description: "version, tags, metadata." },
    ],
    example: `const result = await executeAgent(
  'my-agent',
  async () => 'agent result',
  { version: '1.0', tags: ['test'], metadata: { custom: 'value' } }
);`,
  },
  {
    id: "trace-manager",
    eyebrow: "Tracing",
    title: "TraceManager",
    description: "Static class managing span lifecycle and context propagation across async operations, via Async Local Storage.",
    signature: `class TraceManager {
  static startSpan(name: string, options?: SpanOptions): Span
  static endSpan(span: Span | string, status?: string): void
  static currentSpan(): Span | undefined
  static parentSpan(): Span | undefined
  static runWithSpan<T>(span: Span, fn: () => Promise<T>): Promise<T>
}`,
    list: {
      label: "Static methods",
      items: [
        { name: "startSpan(name, options?)", description: "Creates and starts a new span, storing it in Async Local Storage." },
        { name: "endSpan(span, status?)", description: "Finalizes a span, optionally recording a status such as \"success\" or \"error\"." },
        { name: "currentSpan()", description: "Returns the active span for the current async context, if any." },
        { name: "parentSpan()", description: "Returns the parent of the active span, if any." },
        { name: "runWithSpan(span, fn)", description: "Runs fn() with span set as the active context for any nested operations." },
      ],
    },
    example: `const span = TraceManager.startSpan('my-operation');
const result = await TraceManager.runWithSpan(span, async () => {
  return 'result';
});
TraceManager.endSpan(span, 'success');`,
    notes: [
      "Spans propagate automatically across await boundaries — no manual threading of IDs required.",
      "Always end a span, ideally in a finally block, so it isn't left open if the wrapped code throws.",
    ],
  },
  {
    id: "approvals",
    eyebrow: "Governance Method",
    title: "client.approvals.create()",
    description: "Request human review for a decision. Part of the ApprovalClient, which also exposes approve(), reject(), status(), and list(). Aliased as client.hitl.",
    signature: `client.approvals.create(data: Record<string, any>): Promise<any>
client.approvals.approve(id: string, reason?: string): Promise<any>
client.approvals.reject(id: string, reason?: string): Promise<any>
client.approvals.status(id: string): Promise<any>
client.approvals.list(params?: Record<string, any>): Promise<any>`,
    params: [
      { name: "decisionId", type: "string", description: "ID of the decision this approval request relates to." },
      { name: "reason", type: "string", description: "Why human review is needed." },
      { name: "metadata", type: "Record<string, any>, optional", description: "Extra context, e.g. required_approver, expires_at, approval_level." },
    ],
    example: `const approval = await client.approvals.create({
  decisionId: 'decision-123',
  reason: 'High value trade requires approval'
});

await client.approvals.approve(approval.id, 'Approved based on risk analysis');
const status = await client.approvals.status(approval.id);`,
    notes: ["Approval requests resolve to a status of \"pending\", \"approved\", or \"rejected\"."],
  },
  {
    id: "replay",
    eyebrow: "Forensic Method",
    title: "client.replay.reconstruct()",
    description: "Reconstruct a trace for debugging and analysis. Part of the ReplayClient, which also exposes verify(), replay(), get(), list(), and compare(). Aliased as client.forensics.",
    signature: `client.replay.reconstruct(traceId: string, options?: Record<string, any>): Promise<any>
client.replay.verify(id: string): Promise<any>
client.replay.replay(id: string, options?: Record<string, any>): Promise<any>
client.replay.compare(idA: string, idB: string): Promise<any>`,
    params: [
      { name: "traceId", type: "string", description: "Trace to reconstruct." },
      { name: "options", type: "Record<string, any>, optional", description: "include_tool_calls, include_decisions, include_timeline, and similar flags." },
    ],
    example: `const reconstruction = await client.replay.reconstruct('trace-123', {
  include_tool_calls: true,
  include_decisions: true
});

const result = await client.replay.replay(reconstruction.replay_id, {
  speed: 2,
  stop_on_error: false
});`,
    notes: ["compare(idA, idB) returns { identical, differences, similarity_score } for A/B debugging two executions."],
  },
  {
    id: "verify-decision",
    eyebrow: "Verification Method",
    title: "client.decisions.verify()",
    description: "Confirm a decision record's integrity and that it hasn't been tampered with since creation.",
    signature: `client.decisions.verify(id: string): Promise<any>`,
    params: [{ name: "id", type: "string", description: "Decision ID to verify." }],
    example: `const verification = await client.decisions.verify('decision-123');

if (verification.valid) {
  console.log('Decision is valid');
} else {
  console.log('Decision verification failed:', verification.reason);
}`,
  },
];

type HookRow = {
  method: string;
  description: string;
};

type IntegrationProps = {
  id: string;
  name: string;
  description: string;
  setup: string;
  usage: string;
  usageLabel?: string;
  hooks: HookRow[];
  notes?: string[];
};

function HookTable({ rows }: { rows: HookRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Method</th>
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Use it to…</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.method} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-2.5 align-top"><code className="text-zinc-100">{r.method}</code></td>
              <td className="px-4 py-2.5 align-top leading-6 text-muted">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IntegrationSection({ id, name, description, setup, usage, usageLabel, hooks, notes }: IntegrationProps) {
  return (
    <section id={id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Integration</p>
      <h3 className="text-lg font-semibold tracking-tight text-white">{name}</h3>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-[15px]">{description}</p>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-white">Setup</h4>
        <div className="mt-3"><CodeBlock code={setup} small /></div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-white">{usageLabel ?? "Automatic tracing"}</h4>
        <div className="mt-3"><CodeBlock code={usage} small /></div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-white">Manual tracing hooks</h4>
        <p className="mt-2 text-[13px] leading-6 text-muted">
          For cases the automatic instrumentation doesn&rsquo;t cover, call the corresponding hook directly.
        </p>
        <div className="mt-3"><HookTable rows={hooks} /></div>
      </div>

      {notes && notes.length > 0 && <NoteList notes={notes} />}
    </section>
  );
}

const integrations: IntegrationProps[] = [
  {
    id: "langchain",
    name: "LangChain",
    description: "Wraps LangChain's callback system to trace chains, tools, LLM calls, and agents.",
    setup: `import { BlocklogClient, setGlobalClient, instrumentLangChain } from '@blocklog/sdk';

const client = new BlocklogClient({ apiKey: 'your-api-key' });
setGlobalClient(client);

const tracer = instrumentLangChain();`,
    usage: `import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';

const agent = await createOpenAIFunctionsAgent(llm, tools, prompt);
const executor = new AgentExecutor({ agent, tools, verbose: true });

// Execution is automatically traced
const result = await executor.invoke({ input: 'What is the weather?' });`,
    hooks: [
      { method: "handleChainStart(chain, inputs, runId)", description: "Mark a chain's start. chain is { name, metadata? }." },
      { method: "handleChainEnd(outputs, runId)", description: "Mark a chain's successful completion." },
      { method: "handleToolStart(tool, input, runId)", description: "Mark a tool call's start." },
      { method: "handleToolEnd(output, runId)", description: "Mark a tool call's completion." },
      { method: "handleLLMStart(llm, prompts, runId)", description: "Mark an LLM call's start." },
      { method: "handleLLMEnd(output, runId)", description: "Mark an LLM call's completion." },
    ],
    notes: [
      "For deeper control, subclass BaseCallbackHandler and forward each callback to the matching tracer.handle*() method.",
      "Set the global client with setGlobalClient() before calling instrumentLangChain() — the tracer reads from the global client.",
    ],
  },
  {
    id: "langgraph",
    name: "LangGraph",
    description: "Extends the same hook pattern to LangGraph's node, edge, and graph lifecycle.",
    setup: `import { BlocklogClient, setGlobalClient, instrumentLangGraph } from '@blocklog/sdk';

const client = new BlocklogClient({ apiKey: 'your-api-key' });
setGlobalClient(client);

const hooks = instrumentLangGraph();`,
    usage: `const compiledGraph = graph.compile();

// Node, edge, and graph execution are automatically traced
const result = await compiledGraph.invoke({ input: 'test input' });`,
    hooks: [
      { method: "onGraphStart({ graph_id, metadata? })", description: "Mark the start of a graph run." },
      { method: "onGraphEnd({ graph_id })", description: "Mark the end of a graph run." },
      { method: "onNodeStart(nodeName, state, runId)", description: "Mark a node's start, including the state it received." },
      { method: "onNodeEnd(nodeName, state, runId)", description: "Mark a node's completion, including the state it produced." },
      { method: "onEdge(from, to, condition, runId)", description: "Mark an edge transition, including whether it matched a condition." },
    ],
    notes: [
      "Conditional edges added via addConditionalEdges() are traced the same way as static edges.",
      "State objects passed to onNodeStart / onNodeEnd are recorded as-is, so keep them serializable.",
    ],
  },
  {
    id: "openai-agents",
    name: "OpenAI Agents",
    description: "Traces OpenAI chat completion calls, tool and function calls, and the messages exchanged during an agent run.",
    setup: `import { BlocklogClient, setGlobalClient, instrumentOpenAIAgents } from '@blocklog/sdk';

const client = new BlocklogClient({ apiKey: 'your-api-key' });
setGlobalClient(client);

const hooks = instrumentOpenAIAgents();`,
    usage: `import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: 'your-openai-key' });

// Chat completions, tool calls, and messages are automatically traced
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello' }]
});`,
    hooks: [
      { method: "onAgentRunStart(agentId, input)", description: "Mark the start of an agent run." },
      { method: "onAgentRunEnd(agentId, output)", description: "Mark an agent run's successful completion." },
      { method: "onAgentRunError(agentId, error)", description: "Mark an agent run's failure." },
      { method: "onToolCall(toolName, args)", description: "Record a tool call's name and arguments." },
      { method: "onFunctionCall(name, args)", description: "Record a legacy function-calling invocation." },
      { method: "onMessage(role, content)", description: "Record a message exchanged during the run — user, assistant, or system." },
    ],
    notes: [
      "Call onAgentRunError() inside a catch block and re-throw, so failures are traced without being swallowed.",
      "Metadata such as user_id, session_id, or environment can be passed alongside input on onAgentRunStart().",
    ],
  },
];

const commonBehaviour = [
  "All instrument*() functions read configuration from the global client — call setGlobalClient() before instrumenting.",
  "Trace context (trace ID, span ID, parent span ID) is preserved across async operations via Async Local Storage, the same mechanism TraceManager itself uses.",
  "Errors are always traced — automatic instrumentation captures exceptions before they propagate, and manual hooks expose explicit onError / handle*Error methods for the same purpose.",
  "Each integration also accepts a custom callback handler class for frameworks that support pluggable callbacks, letting you forward lifecycle events to the tracer or hooks object yourself.",
];

export default function TypeScriptSdkDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-10">
        <header className="max-w-3xl">
          <p className="eyebrow">SDK Reference</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            TypeScript SDK Reference
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Constructor and configuration, event and lifecycle methods, decorators, tracing, governance,
            forensic, and verification methods, plus framework integrations for the Blocklog TypeScript
            client.
          </p>
          <nav className="mt-5 flex flex-wrap gap-2 text-xs">
            <a
              href="#reference"
              className="rounded-full border border-white/10 px-3 py-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Core SDK
            </a>
            <a
              href="#integrations"
              className="rounded-full border border-white/10 px-3 py-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Integrations
            </a>
          </nav>
        </header>

        <div id="reference" className="space-y-6">
          {sections.map((section) => (
            <ApiSection key={section.id} {...section} />
          ))}
        </div>

        <div className="space-y-6">
          <div className="max-w-3xl border-t border-white/10 pt-8">
            <p className="eyebrow">Framework instrumentation</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white" id="integrations">
              Integrations
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-[15px]">
              Native instrumentation for LangChain, LangGraph, and OpenAI Agents. Each integration wires
              into the framework&rsquo;s callback or hook system to trace chains, nodes, tools, and LLM
              calls automatically, with manual hooks available for anything outside the automatic path.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-white">Common behaviour across all integrations</h3>
            <NoteList notes={commonBehaviour} />
          </div>

          {integrations.map((integration) => (
            <IntegrationSection key={integration.id} {...integration} />
          ))}
        </div>

        <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href="/docs/api-reference"
          >
            API Reference
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            href="/docs/architecture"
          >
            Architecture
          </Link>
        </nav>
      </div>
    </main>
  );
}