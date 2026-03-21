"use client";

import { FormEvent, useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type ApiKey = {
  key_id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked: boolean;
  usage_count: number;
  rate_limit_per_minute: number;
};

const fallbackKeys: ApiKey[] = [];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(fallbackKeys);
  const [keyName, setKeyName] = useState("");
  const [rateLimit, setRateLimit] = useState("1000");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function loadKeys() {
    setLoading(true);
    try {
      const payload = await blocklogRequest<ApiKey[]>("/auth/api_keys");
      setKeys(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load keys");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKeys();
  }, []);

  async function createKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    try {
      const created = await blocklogRequest<{ api_key: string; name: string }>(
        "/auth/api_keys",
        "POST",
        {
          name: keyName,
          rate_limit_per_minute: Number(rateLimit),
        },
      );

      setKeyName("");
      setNotice(`API key created: ${created.api_key}`);
      await loadKeys();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create key");
    }
  }

  async function revokeKey(id: string) {
    setError(null);
    setNotice(null);
    setRevokingId(id);

    try {
      await blocklogRequest(`/auth/api_keys/${id}`, "DELETE");
      setNotice("API key revoked.");
      await loadKeys();
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : "Failed to revoke key");
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <>
      <DashboardTopBar title="API Keys" />

      {loading && (
        <div className="notice button-row" style={{ alignItems: "center", marginBottom: 12 }}>
          <div className="spinner" />
          <span>Loading API keys...</span>
        </div>
      )}

      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      {notice && <p className="notice">{notice}</p>}

      {/* Create Key */}
      <form className="card" onSubmit={createKey}>
        <h2 style={{ marginTop: 0 }}>Create new key</h2>

        <div className="grid grid-2">
          <input
            placeholder="Key name"
            value={keyName}
            onChange={(event) => setKeyName(event.target.value)}
            required
          />
          <input
            placeholder="Rate limit per minute"
            type="number"
            min="1"
            value={rateLimit}
            onChange={(event) => setRateLimit(event.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" style={{ marginTop: 12 }}>
          Create key
        </button>
      </form>

      {/* Keys Table */}
      <section className="table-shell">
        {keys.length === 0 ? (
          <div className="empty-state">No API keys created yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Prefix</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last used</th>
                <th>Rate limit</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {keys.map((key) => (
                <tr key={key.key_id}>
                  <td>{key.name}</td>
                  <td>{key.key_prefix}</td>

                  {/* ✅ Status */}
                  <td>
                    {key.revoked ? (
                      <span style={{ color: "var(--danger)", fontWeight: 500 }}>
                        Revoked
                      </span>
                    ) : (
                      <span style={{ color: "var(--success)", fontWeight: 500 }}>
                        Active
                      </span>
                    )}
                  </td>

                  <td>{new Date(key.created_at).toLocaleString()}</td>

                  <td>
                    {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleString()
                      : "Never"}
                  </td>

                  <td>{key.rate_limit_per_minute}/min</td>

                  {/* ✅ Action */}
                  <td>
                    {key.revoked ? (
                      <span className="muted">—</span>
                    ) : (
                      <button
                        className="btn"
                        disabled={revokingId === key.key_id}
                        onClick={() => revokeKey(key.key_id)}
                        type="button"
                      >
                        {revokingId === key.key_id ? "Revoking..." : "Revoke"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}