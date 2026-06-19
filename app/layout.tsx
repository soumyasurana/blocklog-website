import type { Metadata, Viewport } from "next";
import { Barlow, Geist, IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import AnalyticsTracker from "@/components/AnalyticsTracker";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blocklog.ai"),

  title: {
    default:
      "Blocklog — Replay Every AI Decision. Understand Every Failure.",
    template: "%s | Blocklog",
  },

  description:
    "The forensic replay platform for AI systems. Reconstruct decisions, identify root causes, analyze failures, and generate audit-ready evidence from every AI interaction.",

  keywords: [
    "AI observability",
    "AI debugging",
    "AI compliance",
    "LLM monitoring",
    "AI audit logs",
    "AI tracing",
    "agent observability",
    "AI governance",
    "AI replay",
    "Blocklog",
  ],

  authors: [
    {
      name: "Blocklog",
    },
  ],

  creator: "Blocklog",
  publisher: "Blocklog",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blocklogsecurity.com",
    siteName: "Blocklog",
    title: "Replay Every AI Decision. Understand Every Failure.",
    description:
      "The forensic replay platform for AI systems. Reconstruct decisions, identify root causes, analyze failures, and generate audit-ready evidence.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Blocklog",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Replay Every AI Decision. Understand Every Failure.",
    description:
      "The forensic replay platform for AI systems.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  alternates: {
    canonical: "https://blocklogsecurity.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
    >
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              dataLayer.push(arguments);
            }

            window.gtag = gtag;

            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              anonymize_ip: true,
            });
          `}
        </Script>
      </head>

      <body
        className={`${barlow.variable} ${geist.variable}`}
      >
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
