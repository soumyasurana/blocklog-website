import type { Metadata } from "next";
import { Barlow, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Blocklog — Security Evidence, Not Trust Language",
  description:
    "Blocklog keeps security reviews focused on verifiable proof, operational controls, and clear documentation — not vague trust language. Built for security buyers who want architecture clarity and scope boundaries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <head>
        {/* Google Analytics Script */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />

        {/* GA Init */}
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              anonymize_ip: true,
            });
          `}
        </Script>
      </head>

      <body className={`${barlow.variable} ${instrumentSerif.variable}`}>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
