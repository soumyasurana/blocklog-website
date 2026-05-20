declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-254DW7H7BM";

type AnalyticsParams = Record<
  string,
  string | number | boolean | undefined
>;

const isAnalyticsAvailable = () => {
  return (
    typeof window !== "undefined" &&
    typeof window.gtag === "function"
  );
};

export const pageview = (url: string) => {
  if (!isAnalyticsAvailable()) return;

  window.gtag!("event", "page_view", {
    send_to: GA_MEASUREMENT_ID,
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
    transport_type: "beacon",
    debug_mode: process.env.NODE_ENV === "development",
  });
};

export const trackEvent = (
  eventName: string,
  params?: AnalyticsParams
) => {
  if (!isAnalyticsAvailable()) return;

  window.gtag!("event", eventName, {
    send_to: GA_MEASUREMENT_ID,
    transport_type: "beacon",
    debug_mode: process.env.NODE_ENV === "development",
    ...params,
  });
};