"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type NotificationItem = { alert: string; time: string };
type HealthPayload = { status?: string };
type IntegrityPayload = { status?: string; integrity_status?: string; logs_verified?: number };
type WebhookEventsPayload = { events?: unknown[] } | unknown[];

function toNotifications(
  health: HealthPayload,
  integrity: IntegrityPayload,
  eventsPayload: WebhookEventsPayload,
): NotificationItem[] {
  const notifications: NotificationItem[] = [];
  const serviceStatus = health.status ?? "unknown";
  const integrityStatus = integrity.integrity_status ?? integrity.status ?? "unknown";

  notifications.push({
    alert: `API health: ${serviceStatus}`,
    time: "Live",
  });
  notifications.push({
    alert: `Integrity status: ${integrityStatus}`,
    time: `${integrity.logs_verified ?? 0} verified`,
  });

  const rawEvents = Array.isArray(eventsPayload)
    ? eventsPayload
    : normalizePayload<{ events?: unknown[] }>(eventsPayload, {}, "data").events ?? [];

  rawEvents.slice(0, 6).forEach((event, index) => {
    if (typeof event === "string") {
      notifications.push({ alert: event, time: `Event ${index + 1}` });
      return;
    }

    if (event && typeof event === "object") {
      const record = event as Record<string, unknown>;
      notifications.push({
        alert: String(record.type ?? record.event ?? record.name ?? "Webhook event"),
        time: String(record.created_at ?? record.timestamp ?? `Event ${index + 1}`),
      });
    }
  });

  return notifications;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const [healthPayload, integrityPayload, eventsPayload] = await Promise.all([
          blocklogRequest<HealthPayload | { data?: HealthPayload }>("/health"),
          blocklogRequest<IntegrityPayload | { data?: IntegrityPayload }>("/integrity/status"),
          blocklogRequest<WebhookEventsPayload>("/webhooks/events"),
        ]);

        const health = normalizePayload<HealthPayload>(healthPayload, {}, "data");
        const integrity = normalizePayload<IntegrityPayload>(integrityPayload, {}, "data");
        setNotifications(toNotifications(health, integrity, eventsPayload));
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
      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      <section className="table-shell">
        {notifications.length === 0 ? (
          <div className="empty-state">No notifications available.</div>
        ) : (
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
        )}
      </section>
    </>
  );
}
