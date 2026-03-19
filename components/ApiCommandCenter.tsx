"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiCatalog, apiCategories } from "@/components/apiCatalog";
import { blocklogRequest, type HttpMethod } from "@/lib/blocklog";

function canSendBody(method: HttpMethod) {
  return method !== "GET" && method !== "DELETE";
}

function defaultPayloadFor(method: HttpMethod, path: string) {
  const matched = apiCatalog.find((endpoint) => endpoint.method === method && endpoint.path === path);
  return matched?.samplePayload ?? "";
}

function extractTemplateKeys(path: string) {
  return Array.from(path.matchAll(/\{([^}]+)\}/g)).map((match) => match[1]);
}

function defaultTemplateValue(key: string) {
  if (key.includes("batch")) return "batch_demo_1";
  if (key.includes("log")) return "log_10021";
  if (key.includes("proof")) return "proof_demo_1";
  if (key.includes("company")) return "cmp_84f02";
  if (key.includes("key")) return "key_1";
  if (key.includes("iso_from")) return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  if (key.includes("iso_to")) return new Date().toISOString();
  return "";
}

function buildPath(template: string, values: Record<string, string>) {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}

export default function ApiCommandCenter() {
  const [category, setCategory] = useState("All");
  const [templatePath, setTemplatePath] = useState("/logs");
  const [method, setMethod] = useState<HttpMethod>("POST");
  const [payload, setPayload] = useState(defaultPayloadFor("POST", "/logs"));
  const [result, setResult] = useState<string>("Select an endpoint or send a custom request.");
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState("POST /logs");
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});

  const filteredEndpoints = useMemo(
    () => (category === "All" ? apiCatalog : apiCatalog.filter((endpoint) => endpoint.category === category)),
    [category],
  );

  const templateKeys = useMemo(() => extractTemplateKeys(templatePath), [templatePath]);
  const resolvedPath = useMemo(() => buildPath(templatePath, templateValues), [templatePath, templateValues]);

  useEffect(() => {
    const nextValues = Object.fromEntries(
      templateKeys.map((key) => [key, templateValues[key] ?? defaultTemplateValue(key)]),
    );
    setTemplateValues(nextValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templatePath]);

  function chooseEndpoint(nextMethod: HttpMethod, nextPath: string) {
    setMethod(nextMethod);
    setTemplatePath(nextPath);
    setSelectedKey(`${nextMethod} ${nextPath}`);
    setPayload(defaultPayloadFor(nextMethod, nextPath));
    setResult(`Prepared ${nextMethod} ${nextPath}`);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      if (resolvedPath.includes("{")) {
        throw new Error("Fill in every path parameter before sending the request.");
      }

      const parsedPayload = payload && canSendBody(method) ? JSON.parse(payload) : undefined;
      const response = await blocklogRequest<unknown>(resolvedPath, method, parsedPayload);
      setResult(JSON.stringify(response, null, 2));
    } catch (submitError) {
      setResult(submitError instanceof Error ? submitError.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid" style={{ gap: 18 }}>
      <article className="card glass-card api-command-shell">
        <div className="api-catalog-panel">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <p className="eyebrow">Developer surface</p>
              <h2 style={{ marginBottom: 8 }}>The playground now acts as the console-grade API command center.</h2>
              <p className="muted" style={{ margin: 0, maxWidth: 780 }}>
                Browse the full endpoint catalog, jump to the related console surface, and run
                requests with structured path inputs instead of editing placeholders by hand.
              </p>
            </div>
            <div className="button-row">
              <span className="status-pill status-valid">{apiCatalog.length} endpoints mapped</span>
              <span className="status-pill">{apiCategories.length} categories</span>
            </div>
          </div>

          <div className="api-category-strip">
            <button
              className={`btn${category === "All" ? " btn-primary" : ""}`}
              onClick={() => setCategory("All")}
              type="button"
            >
              All
            </button>
            {apiCategories.map((entry) => (
              <button
                className={`btn${category === entry ? " btn-primary" : ""}`}
                key={entry}
                onClick={() => setCategory(entry)}
                type="button"
              >
                {entry}
              </button>
            ))}
          </div>

          <div className="endpoint-grid">
            {filteredEndpoints.map((endpoint) => {
              const key = `${endpoint.method} ${endpoint.path}`;
              const selected = key === selectedKey;

              return (
                <article
                  className={`endpoint-card${selected ? " selected" : ""}`}
                  key={key}
                  onClick={() => chooseEndpoint(endpoint.method, endpoint.path)}
                >
                  <div className="endpoint-card-top">
                    <span className={`endpoint-method endpoint-method-${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                    {endpoint.liveOnly && <span className="endpoint-badge">Live only</span>}
                  </div>
                  <h3>{endpoint.label}</h3>
                  <code>{endpoint.path}</code>
                  <p className="muted">{endpoint.description}</p>
                  <div className="endpoint-card-footer">
                    <span className="endpoint-category">{endpoint.category}</span>
                    {endpoint.pageHref ? (
                      <Link
                        className="endpoint-link"
                        href={endpoint.pageHref}
                        onClick={(event) => event.stopPropagation()}
                      >
                        Open surface
                      </Link>
                    ) : (
                      <span className="endpoint-link subtle">Runner only</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="api-runner-panel">
          <form className="card glass-card api-runner-card" onSubmit={onSubmit}>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <div>
                <p className="eyebrow">Request runner</p>
                <h2 style={{ margin: 0, fontSize: "1.55rem" }}>Send a live console request</h2>
              </div>
              <span className="status-pill">{selectedKey}</span>
            </div>

            <div className="grid grid-2">
              <div>
                <label>Method</label>
                <select
                  value={method}
                  onChange={(event) => setMethod(event.target.value as HttpMethod)}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label>Endpoint template</label>
                <input value={templatePath} onChange={(event) => setTemplatePath(event.target.value)} />
              </div>
            </div>

            {templateKeys.length > 0 && (
              <div className="api-param-panel">
                <div className="api-param-header">
                  <strong>Path and query parameters</strong>
                  <span className="muted">These values replace <code>{"{placeholder}"}</code> tokens automatically.</span>
                </div>
                <div className="grid grid-2">
                  {templateKeys.map((key) => (
                    <div key={key}>
                      <label>{key}</label>
                      <input
                        placeholder={`Enter ${key}`}
                        value={templateValues[key] ?? ""}
                        onChange={(event) =>
                          setTemplateValues((current) => ({
                            ...current,
                            [key]: event.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="api-path-preview">
              <span className="muted">Resolved path</span>
              <code>{resolvedPath}</code>
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Payload</label>
              <textarea
                disabled={!canSendBody(method)}
                placeholder={
                  canSendBody(method)
                    ? "{\n  \"key\": \"value\"\n}"
                    : "GET and DELETE requests do not require a payload."
                }
                value={canSendBody(method) ? payload : ""}
                onChange={(event) => setPayload(event.target.value)}
              />
            </div>

            <button className="btn btn-primary" disabled={loading} style={{ marginTop: 12 }} type="submit">
              {loading ? "Sending..." : "Send request"}
            </button>
          </form>

          <section className="card glass-card api-response-card">
            <div className="section-header" style={{ marginBottom: 12 }}>
              <div>
                <p className="eyebrow">Response</p>
                <h2 style={{ margin: 0, fontSize: "1.55rem" }}>API output</h2>
              </div>
            </div>
            <pre className="code-pane api-result-pane" style={{ margin: 0 }}>
              {result}
            </pre>
          </section>
        </div>
      </article>
    </section>
  );
}
