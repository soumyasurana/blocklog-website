"use client";

import { FormEvent, useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type ApiKey = {
  id: string;
  key_name: string;
  created_date: string;
  last_used: string;
  permissions: string[];
};

type ApiKeysPayload = { keys?: ApiKey[] };

const fallbackKeys: ApiKey[] = [
  {
    id: "key_1",
    key_name: "Production API",
    created_date: "2026-01-10",
    last_used: "2 minutes ago",
    permissions: ["logs:write", "verify:read"],
  },
  {
    id: "key_2",
    key_name: "Staging API",
    created_date: "2025-12-03",
    last_used: "1 day ago",
    permissions: ["logs:write"],
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(fallbackKeys);
  const [keyName, setKeyName] = useState("");
  const [permissions, setPermissions] = useState("logs:write");
  const [error, setError] = useState<string | null>(null);

  async function loadKeys() {
    try {
      const payload = await blocklogRequest<ApiKeysPayload | { data?: ApiKeysPayload }>(
        "/api-keys",
      );
      const parsed = normalizePayload<ApiKeysPayload>(payload, {}, "data");
      if (parsed.keys?.length) {
        setKeys(parsed.keys);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load keys");
    }
  }

  useEffect(() => {
    let active = true;

    blocklogRequest<ApiKeysPayload | { data?: ApiKeysPayload }>("/api-keys")
      .then((payload) => {
        if (!active) return;
        const parsed = normalizePayload<ApiKeysPayload>(payload, {}, "data");
        if (parsed.keys?.length) {
          setKeys(parsed.keys);
        }
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load keys",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  async function createKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await blocklogRequest("/api-keys", "POST", {
        key_name: keyName,
        permissions: permissions.split(",").map((entry) => entry.trim()),
      });
      setKeyName("");
      await loadKeys();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create key");
    }
  }

  async function revokeKey(id: string) {
    setError(null);
    try {
      await blocklogRequest(`/api-keys/${id}`, "DELETE");
      await loadKeys();
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : "Failed to revoke key");
    }
  }

  return (
    <>
      <DashboardTopBar title="API Keys" />
      {error && <p className="muted">Live API unavailable: {error}</p>}
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
            placeholder="permissions (comma separated)"
            value={permissions}
            onChange={(event) => setPermissions(event.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }}>
          Create key
        </button>
      </form>

      <section className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Key name</th>
              <th>Created date</th>
              <th>Last used</th>
              <th>Permissions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key.id}>
                <td>{key.key_name}</td>
                <td>{key.created_date}</td>
                <td>{key.last_used}</td>
                <td>{key.permissions.join(", ")}</td>
                <td>
                  <button className="btn" onClick={() => revokeKey(key.id)} type="button">
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
