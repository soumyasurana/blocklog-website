"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type NotificationItem = { alert: string; time: string };
type NotificationPayload = { notifications?: NotificationItem[] };

const fallback: NotificationItem[] = [
  { alert: "verification failure", time: "2 minutes ago" },
  { alert: "ingestion failure", time: "10 minutes ago" },
  { alert: "API misuse", time: "17 minutes ago" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const payload = await blocklogRequest<
          NotificationPayload | { data?: NotificationPayload }
        >("/notifications");
        const parsed = normalizePayload<NotificationPayload>(payload, {}, "data");
        if (parsed.notifications?.length) {
          setNotifications(parsed.notifications);
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load notifications",
        );
      }
    }

    loadNotifications();
  }, []);

  return (
    <>
      <DashboardTopBar title="Notifications" />
      {error && <p className="muted">Live API unavailable: {error}</p>}
      <section className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Alert</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((item) => (
              <tr key={`${item.alert}-${item.time}`}>
                <td>{item.alert}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
