"use client";

import { FormEvent, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

export default function PlaygroundPage() {
  const [path, setPath] = useState("/logs");
  const [method, setMethod] = useState("POST");
  const [payload, setPayload] = useState(
    '{\n  "event": "payment.created",\n  "user_id": "123",\n  "metadata": {"amount": 2000}\n}',
  );
  const [result, setResult] = useState<string>("No request sent yet.");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const parsedPayload = payload ? JSON.parse(payload) : undefined;
      const response = await blocklogRequest<unknown>(path, method as "POST" | "GET", parsedPayload);
      setResult(JSON.stringify(response, null, 2));
    } catch (submitError) {
      setResult(submitError instanceof Error ? submitError.message : "Request failed");
    }
  }

  return (
    <>
      <DashboardTopBar title="Developer Playground" />
      <form className="card" onSubmit={onSubmit}>
        <h2 style={{ marginTop: 0 }}>Interactive API tester</h2>
        <p className="muted">
          Try <code>POST /logs</code> with a sample payload.
        </p>
        <div className="grid grid-2">
          <div>
            <label>Method</label>
            <select value={method} onChange={(event) => setMethod(event.target.value)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </div>
          <div>
            <label>Endpoint path</label>
            <input value={path} onChange={(event) => setPath(event.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Payload</label>
          <textarea value={payload} onChange={(event) => setPayload(event.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }}>
          Send request
        </button>
      </form>
      <section className="card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Response</h3>
        <pre className="code-pane" style={{ margin: 0 }}>
          {result}
        </pre>
      </section>
    </>
  );
}
