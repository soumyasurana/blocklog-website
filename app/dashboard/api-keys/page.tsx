import DashboardTopBar from "@/components/DashboardTopBar";

const keys = [
  ["Production API", "2026-01-10", "2 minutes ago", "logs:write, verify:read"],
  ["Staging API", "2025-12-03", "1 day ago", "logs:write"],
];

export default function ApiKeysPage() {
  return (
    <>
      <DashboardTopBar title="API Keys" />
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Create new key</h2>
        <div className="grid grid-2">
          <input placeholder="Key name" />
          <select>
            <option>Permissions: Full</option>
            <option>logs:write</option>
            <option>verify:read</option>
          </select>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }}>
          Create key
        </button>
      </section>

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
            {keys.map(([name, created, used, permission]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{created}</td>
                <td>{used}</td>
                <td>{permission}</td>
                <td>
                  <button className="btn">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
