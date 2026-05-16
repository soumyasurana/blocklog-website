declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export {};

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "G-254DW7H7BM", {
      page_path: url,
    });
  }
};
