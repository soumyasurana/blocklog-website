"use client";

import Link from "next/link";

type Param = {
  name: string;
  type: string;
  description: string;
};

type ReturnMethod = {
  name: string;
  description: string;
};

type ApiSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  signature: string;
  params?: Param[];
  warning?: string;
  returns?: { label: string; methods: ReturnMethod[] };
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

function ApiSection({ id, eyebrow, title, description, signature, params, warning, returns, notes, example }: ApiSectionProps) {
  return (
    <section id={id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
      <h2 className="text-lg font-semibold tracking-tight text-white"><code>{title}</code></h2>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-[15px]">{description}</p>
      {warning && <Callout>{warning}</Callout>}
      <div className="mt-4"><CodeBlock code={signature} /></div>
      {params && params.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">Parameters</h3>
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
      {returns && returns.methods.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">
            Returns: <code className="text-zinc-100">{returns.label}</code>
          </h3>
          <ul className="mt-3 space-y-3 text-sm leading-7 text-muted">
            {returns.methods.map((m) => (
              <li key={m.name} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <code className="text-zinc-100">{m.name}</code>
                <p className="mt-1">{m.description}</p>
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
    id: "init",
    eyebrow: "Method",
    title: "blocklog.init()",
    description: "Initialize the global SDK configuration. Call once at application startup.",
    signature: `def init(
    api_key: str | None = None,
    *,
    base_url: str | None = None,
    signing_key: str | None = None,
    timeout: float | None = None,
    max_retries: int | None = None,
    debug: bool = False,
) -> BlocklogClient`,
    params: [
      { name: "api_key", type: "str, optional", description: "Key for verification. Falls back to BLOCKLOG_API_KEY." },
      { name: "base_url", type: "str, optional", description: "Custom API endpoint override. Falls back to BLOCKLOG_BASE_URL." },
      { name: "signing_key", type: "str, optional", description: "HMAC-SHA256 key for tamper-evident log signatures. Falls back to BLOCKLOG_SDK_SIGNING_KEY. This is not asymmetric Ed25519 signing." },
      { name: "timeout", type: "float, optional", description: "Request timeout in seconds. Default is 10." },
      { name: "max_retries", type: "int, optional", description: "Ingestion retries. Default is 3." },
    ],
    example: `import blocklog\nblocklog.init(api_key="blk_live_xxxx", debug=True)`,
  },
  {
    id: "agent",
    eyebrow: "Decorator",
    title: "@blocklog.agent",
    description: "Trace an AI agent function, linking it to a Blocklog session. Handles sync and async functions automatically.",
    signature: `def agent(
    func: F | None = None,
    *,
    name: str | None = None,
    version: str = "1.0",
    tags: list[str] | None = None,
    metadata: dict[str, Any] | None = None,
) -> F | Callable[[F], F]`,
    params: [
      { name: "name", type: "str, optional", description: "Human-readable agent name. Defaults to func.__name__." },
      { name: "version", type: "str", description: "Semver-style version string. Default is \"1.0\"." },
      { name: "tags", type: "list[str], optional", description: "Optional list of string tags." },
      { name: "metadata", type: "dict, optional", description: "Arbitrary extra data attached to the agent session." },
    ],
    warning: "Class decoration only emits AGENT_START. For full lifecycle tracing, decorate the specific method (e.g. run, execute) rather than the class itself.",
    example: `@blocklog.agent(name="stock-trader", version="2.0", tags=["prod"])\ndef run_trading(ticker):\n    pass`,
  },
  {
    id: "tool",
    eyebrow: "Decorator",
    title: "@blocklog.tool",
    description: "Wrap a helper function or external API call to record it as a TOOL_CALL event. Inherits trace context from the surrounding @agent.",
    signature: `def tool(
    func: F | None = None,
    *,
    name: str | None = None,
    schema: dict[str, Any] | None = None,
    tags: list[str] | None = None,
    metadata: dict[str, Any] | None = None,
) -> F | Callable[[F], F]`,
    params: [
      { name: "name", type: "str, optional", description: "Human-readable tool name. Defaults to func.__name__." },
      { name: "schema", type: "dict, optional", description: "Optional dict describing the input schema." },
      { name: "tags", type: "list[str], optional", description: "Optional string tags." },
      { name: "metadata", type: "dict, optional", description: "Arbitrary extra data." },
    ],
    example: `@blocklog.tool(name="fetch-price", tags=["market-data"])\ndef get_price(ticker):\n    return 189.30`,
  },
  {
    id: "decision",
    eyebrow: "Context Manager",
    title: "blocklog.decision()",
    description: "Define a block for recording structured inputs, outputs, and review tasks associated with a system choice.",
    signature: `def decision(
    *,
    type: str,
    asset: str | None = None,
    confidence: float | None = None,
    metadata: dict[str, Any] | None = None,
    agent_id: str | None = None,
    trace_id: str | None = None,
) -> Generator[DecisionContext, None, None]`,
    params: [
      { name: "type", type: "str", description: "Decision type identifier (e.g. \"BUY\")." },
      { name: "asset", type: "str, optional", description: "Asset this decision is about." },
      { name: "confidence", type: "float, optional", description: "Model confidence score, from 0 to 1." },
      { name: "metadata", type: "dict, optional", description: "Extra structured fields." },
      { name: "agent_id", type: "str, optional", description: "Links this decision to a specific agent session." },
      { name: "trace_id", type: "str, optional", description: "Links this decision to a specific trace." },
    ],
    returns: {
      label: "DecisionContext",
      methods: [
        { name: "record_input(**kwargs)", description: "Record structured inputs. Returns self." },
        { name: "record_output(**kwargs)", description: "Record structured outputs. Returns self." },
        { name: "tag(*tags)", description: "Attach string labels. Returns self." },
        { name: "request_approval(reason, reviewer=None)", description: "Non-blocking request for human approval. Returns self." },
        { name: "verify()", description: "Verify the decision after the with block has exited. Raises RuntimeError if called before the decision is committed." },
      ],
    },
    example: `with blocklog.decision(type="BUY", asset="AAPL", confidence=0.9) as d:\n    d.record_input(price=189.30)\n    d.tag("high-conviction")\n    d.record_output(order_id="ord_99")`,
  },
  {
    id: "approval-request",
    eyebrow: "Governance Method",
    title: "blocklog.approval.request()",
    description: "Request human review for an action. Triggers webhooks asynchronously.",
    signature: `def request(
    decision_id: str | None = None,
    *,
    reason: str,
    reviewer: str | None = None,
    log_id: str | None = None,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]`,
    params: [
      { name: "decision_id", type: "str, optional", description: "ID of the decision this approval request relates to." },
      { name: "reason", type: "str", description: "Why human review is needed." },
      { name: "reviewer", type: "str, optional", description: "Email or identifier of the assigned reviewer." },
      { name: "log_id", type: "str, optional", description: "ID of a specific log entry this request relates to, if not tied to a decision." },
      { name: "metadata", type: "dict, optional", description: "Arbitrary extra data." },
    ],
    notes: ["Related: blocklog.approval.reject(), escalate(), list_overrides(), and audit_trail() round out the human-in-the-loop workflow."],
    example: `blocklog.approval.request(\n    decision_id="dec_123",\n    reason="Price exceeds limits",\n    reviewer="cro@company.com"\n)`,
  },
  {
    id: "replay",
    eyebrow: "Forensic Method",
    title: "blocklog.replay()",
    description: "Instantiate a session to examine execution traces, staleness heatmaps, and counterfactual outcomes.",
    signature: `def replay(
    trace_id: str,
    *,
    token_id: str | None = None,
    metadata: dict[str, Any] | None = None,
) -> ReplaySession`,
    params: [
      { name: "trace_id", type: "str", description: "Trace ID to replay." },
      { name: "token_id", type: "str, optional", description: "Restrict the replay to a specific token within the trace." },
      { name: "metadata", type: "dict, optional", description: "Extra context attached to the replay session." },
    ],
    example: `session = blocklog.replay("trace-uuid")\ncause = session.root_cause()\nprint(cause["description"])`,
  },
  {
    id: "verify-log",
    eyebrow: "Verification Method",
    title: "blocklog.verify.log()",
    description: "Confirm a single log entry has not been tampered with since creation.",
    signature: `def log(log_id: str) -> dict[str, Any]`,
    params: [{ name: "log_id", type: "str", description: "ID of the log entry to verify." }],
    example: `result = blocklog.verify.log("log-uuid")\nassert result["status"] == "verified"`,
  },
];

type EventRow = {
  event: string;
  causality: string;
  firedWhen: string;
};

type EventGroup = {
  label?: string;
  rows: EventRow[];
};

type IntegrationProps = {
  id: string;
  name: string;
  description: string;
  setup: string;
  usage?: string;
  usageLabel?: string;
  eventGroups: EventGroup[];
  notes?: string[];
};

function EventTable({ rows }: { rows: EventRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Event</th>
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Causality type</th>
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Fired when</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.event} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-2.5 align-top"><code className="text-zinc-100">{r.event}</code></td>
              <td className="px-4 py-2.5 align-top text-muted"><code className="text-zinc-300">{r.causality}</code></td>
              <td className="px-4 py-2.5 align-top leading-6 text-muted">{r.firedWhen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IntegrationSection({ id, name, description, setup, usage, usageLabel, eventGroups, notes }: IntegrationProps) {
  return (
    <section id={id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Integration</p>
      <h3 className="text-lg font-semibold tracking-tight text-white">{name}</h3>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-[15px]">{description}</p>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-white">Setup</h4>
        <div className="mt-3"><CodeBlock code={setup} small /></div>
      </div>

      {usage && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-white">{usageLabel ?? "Usage"}</h4>
          <div className="mt-3"><CodeBlock code={usage} small /></div>
        </div>
      )}

      <div className="mt-5 space-y-5">
        <h4 className="text-sm font-semibold text-white">Events emitted</h4>
        {eventGroups.map((group, i) => (
          <div key={i}>
            {group.label && <p className="mb-2 text-[13px] font-medium text-zinc-300">{group.label}</p>}
            <EventTable rows={group.rows} />
          </div>
        ))}
      </div>

      {notes && notes.length > 0 && <NoteList notes={notes} />}
    </section>
  );
}

const integrations: IntegrationProps[] = [
  {
    id: "langchain",
    name: "LangChain",
    description: "Attach a callback handler to any chain, agent, or LLM to capture chain, model, and tool lifecycle events.",
    setup: `import blocklog\n\nclient = blocklog.init(api_key="blk_...")\nhandler = client.instrument_langchain()`,
    usage: `chain.invoke(inputs, config={"callbacks": [handler]})`,
    eventGroups: [
      {
        rows: [
          { event: "agent.chain.started", causality: "chain_start", firedWhen: "A chain begins; includes inputs and input_keys." },
          { event: "agent.chain.completed", causality: "chain_end", firedWhen: "A chain finishes successfully; includes outputs." },
          { event: "agent.chain.errored", causality: "chain_error", firedWhen: "A chain raises an exception." },
          { event: "agent.model.started", causality: "llm_start", firedWhen: "An LLM call begins; includes serialized model info and prompts." },
          { event: "agent.model.completed", causality: "llm_end", firedWhen: "An LLM call finishes; includes the full response." },
          { event: "agent.model.errored", causality: "llm_error", firedWhen: "An LLM call raises an exception." },
          { event: "agent.tool.started", causality: "tool_start", firedWhen: "A tool begins execution; includes the raw input string." },
          { event: "agent.tool.completed", causality: "tool_end", firedWhen: "A tool finishes; includes output." },
          { event: "agent.tool.errored", causality: "tool_error", firedWhen: "A tool raises an exception." },
        ],
      },
    ],
    notes: [
      "Every event carries a span_id (derived from run_id), a parent_run_id for causality linking, and an agent_metadata block with framework, captured_at, and any LangChain-provided metadata.",
    ],
  },
  {
    id: "langgraph",
    name: "LangGraph",
    description: "Extends the LangChain handler pattern with graph-native event families. Because LangGraph routes both top-level graphs and individual nodes through on_chain_*, the handler inspects the serialized payload to tell them apart and emit the right event.",
    setup: `import blocklog\n\nclient = blocklog.init(api_key="blk_...")\nhandler = client.instrument_langgraph()`,
    usage: `result = graph.invoke(state, config={"callbacks": [handler]})\n\n# Or via RunnableConfig\nfrom langchain_core.runnables import RunnableConfig\nresult = graph.invoke(state, config=RunnableConfig(callbacks=[handler]))`,
    eventGroups: [
      {
        label: "Graph lifecycle",
        rows: [
          { event: "agent.graph.started", causality: "graph_start", firedWhen: "The top-level CompiledGraph begins; includes graph_name, inputs, and input_keys." },
          { event: "agent.graph.completed", causality: "graph_end", firedWhen: "The graph finishes successfully; includes outputs." },
          { event: "agent.graph.errored", causality: "graph_error", firedWhen: "The graph raises an unhandled exception." },
        ],
      },
      {
        label: "Node lifecycle",
        rows: [
          { event: "agent.graph.node.started", causality: "node_start", firedWhen: "A node begins; includes node_name and inputs." },
          { event: "agent.graph.node.completed", causality: "node_end", firedWhen: "A node finishes; includes node_name and outputs." },
          { event: "agent.graph.node.errored", causality: "node_error", firedWhen: "A node raises an exception; includes node_name and error details." },
        ],
      },
      {
        label: "Subgraph lifecycle",
        rows: [
          { event: "agent.graph.subgraph.started", causality: "subgraph_start", firedWhen: "A nested subgraph begins; includes subgraph_name and inputs." },
          { event: "agent.graph.subgraph.completed", causality: "subgraph_end", firedWhen: "A nested subgraph finishes; includes outputs." },
        ],
      },
      {
        label: "Checkpoint lifecycle",
        rows: [
          { event: "agent.graph.checkpoint.started", causality: "checkpoint_start", firedWhen: "LangGraph is about to write a checkpoint; includes thread_id and checkpoint_ns." },
          { event: "agent.graph.checkpoint.completed", causality: "checkpoint_end", firedWhen: "A checkpoint is successfully persisted; includes checkpoint_id, thread_id, and checkpoint_ns." },
        ],
      },
    ],
    notes: [
      "All agent.model.* and agent.tool.* events are also emitted for calls made inside nodes, identical to the LangChain integration.",
      "A _node_name_stack keyed by run_id ensures node names are correctly attributed on completion and error callbacks, which LangGraph does not re-supply.",
      "State dicts — which often contain Pydantic models — are safely serialized before emission.",
    ],
  },
  {
    id: "openai-sdk",
    name: "OpenAI SDK",
    description: "The OpenAI Python SDK has no callback system, so instrumentation works by monkey-patching the create method on the SDK's resource classes directly. Every OpenAI(), AsyncOpenAI(), and AzureOpenAI() instance in the process — including ones already constructed — is instrumented automatically.",
    setup: `import blocklog\n\nclient = blocklog.init(api_key="blk_...")\nclient.instrument_openai_agents()`,
    usage: `import openai\nfrom blocklog.integrations.openai_agents import instrument_openai\n\nblocklog_client = blocklog.init(api_key="blk_...")\nopenai_client = openai.OpenAI(api_key="...")\n\ninstrument_openai(blocklog_client, openai_client=openai_client)`,
    usageLabel: "Instrument a single instance instead",
    eventGroups: [
      {
        rows: [
          { event: "agent.model.started", causality: "llm_start", firedWhen: "A chat.completions.create or responses.create call begins; includes model, messages, and remaining request parameters." },
          { event: "agent.model.completed", causality: "llm_end", firedWhen: "The call finishes; includes the full response, usage, duration_s, and a streamed flag." },
          { event: "agent.model.errored", causality: "llm_error", firedWhen: "The call raises an exception." },
        ],
      },
    ],
    notes: [
      "Streaming is handled transparently for sync and async clients — chunks are re-yielded unmodified, and agent.model.completed fires only once the stream is fully consumed, with deltas merged into one coherent response.",
      "Async create methods are wrapped with an async-native path, including async streaming via async for; sync vs. async is detected automatically.",
      "A contextvars.ContextVar (blocklog_openai_span_id) propagates span_id across nested or concurrent calls within the same async context.",
      "A _blocklog_wrapped sentinel flag makes calling instrument_openai_agents() more than once safe.",
    ],
  },
  {
    id: "litellm",
    name: "LiteLLM",
    description: "LiteLLM has a first-class CustomLogger base class. The handler subclasses it and registers via litellm.callbacks — the same pattern every other LiteLLM observability tool uses, with no monkey-patching required.",
    setup: `import blocklog\n\nclient = blocklog.init(api_key="blk_...")\nhandler = client.instrument_litellm()`,
    usage: `import litellm\n\n# Replace all existing callbacks\nlitellm.callbacks = [handler]\n\n# Or append alongside existing callbacks\nlitellm.callbacks += [handler]`,
    eventGroups: [
      {
        rows: [
          { event: "agent.model.pre_call", causality: "llm_pre_call", firedWhen: "Before the HTTP request is dispatched; includes model, messages, stream, and litellm_call_id." },
          { event: "agent.model.post_call", causality: "llm_post_call", firedWhen: "After the API responds, before the success/failure split; includes the full request fields, raw response, and duration_s." },
          { event: "agent.model.stream_chunk", causality: "llm_stream_chunk", firedWhen: "For each individual chunk on the sync streaming path; includes model, chunk, and litellm_call_id." },
          { event: "agent.model.completed", causality: "llm_end", firedWhen: "A call finishes successfully (sync or async); includes response, usage, response_cost, duration_s, stream, and cache_hit." },
          { event: "agent.model.errored", causality: "llm_error", firedWhen: "A call fails (sync or async); includes error_type, error_message, and duration_s." },
        ],
      },
    ],
    notes: [
      "span_id is derived from litellm_call_id, stamped onto kwargs by LiteLLM before any hook fires, so pre-call, post-call, and success/failure events for one request share a consistent span ID.",
      "usage (prompt_tokens, completion_tokens, total_tokens) and response_cost are promoted to the top level of agent.model.completed payloads.",
      "log_success_event / log_failure_event handle sync calls; async_log_success_event / async_log_failure_event handle acompletion and async streaming — both delegate to shared handlers so payloads are identical regardless of mode.",
      "Any metadata dict passed via litellm_params is forwarded into the agent_metadata block on every event.",
    ],
  },
];

const commonBehaviour = [
  "Concurrent run safety — LangChain/LangGraph key state by run_id, LiteLLM by litellm_call_id, and OpenAI by a ContextVar, so nested or parallel runs never clobber each other.",
  "Context inheritance — trace_id, session_id, workflow_id, and agent_id are pulled automatically from the active Blocklog context (blocklog.context.vars); no manual threading required.",
  "Safe serialization — Pydantic v1 (.dict()) and v2 (.model_dump()) models, plain Python types, and arbitrary objects are all handled; unknown types fall back to str().",
  "Error events always fire — on any exception, an errored event is emitted before it propagates, so failures are never silently dropped from your audit trail.",
];

export default function PythonSdkDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-10">
        <header className="max-w-3xl">
          <p className="eyebrow">SDK Reference</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Python SDK Reference
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Method signatures, parameter schemas, return types, runnable code examples, and framework
            integrations for the Blocklog Python client.
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
              Built-in instrumentation for LangChain, LangGraph, the OpenAI SDK, and LiteLLM. Each
              integration wires into the framework&rsquo;s native execution model and emits structured
              events to the Blocklog ingest API — covering LLM calls, tool use, chain and graph
              lifecycle, streaming, and errors.
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
            href="/docs/concepts"
          >
            Core Concepts
          </Link>
        </nav>
      </div>
    </main>
  );
}