import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Blocklog",
  description: "Tamper-proof audit logs and trust infrastructure for modern systems",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-254DW7H7BM"
          strategy="afterInteractive"
        />

        {/* GA Init */}
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-254DW7H7BM', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>

      <body>
        <AnalyticsTracker />
        {children}</body>
    </html>
  );
}