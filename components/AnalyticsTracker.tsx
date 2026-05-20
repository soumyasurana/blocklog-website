"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview, trackEvent } from "../lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url =
      pathname +
      (searchParams?.toString()
        ? `?${searchParams.toString()}`
        : "") +
      window.location.hash;

    pageview(url);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor || !anchor.href) return;

      const url = anchor.href;
      const origin = window.location.origin;

      const label =
        anchor.textContent?.trim() ||
        anchor.getAttribute("aria-label") ||
        url;

      // CTA Tracking
      if (anchor.dataset.cta) {
        trackEvent("cta_click", {
          cta_name: anchor.dataset.cta,
          link_text: label,
        });
      }

      // Internal links
      if (url.startsWith(origin)) return;

      // Email
      if (url.startsWith("mailto:")) {
        trackEvent("email_click", {
          email_address: url.replace(/^mailto:/i, ""),
          link_text: label,
        });
        return;
      }

      // Phone
      if (url.startsWith("tel:")) {
        trackEvent("phone_click", {
          phone_number: url.replace(/^tel:/i, ""),
          link_text: label,
        });
        return;
      }

      // Downloads
      if (
        /\.(pdf|zip|docx|xlsx|pptx|csv|json)(?:[?#].*)?$/i.test(url)
      ) {
        trackEvent("file_download", {
          file_url: url,
          file_name: url.split("/").pop(),
          link_text: label,
        });
        return;
      }

      // External links
      trackEvent("outbound_click", {
        link_url: url,
        link_text: label,
      });
    };

    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement | null;

      if (!form || form.tagName !== "FORM") return;

      trackEvent("form_submission", {
        form_id: form.id || undefined,
        form_name: form.getAttribute("name") || undefined,
        form_action: form.action || undefined,
      });
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit, true);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, []);

  return null;
}