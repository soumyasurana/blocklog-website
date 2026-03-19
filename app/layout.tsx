import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blocklog Security",
  description: "Tamper-proof audit logs and trust infrastructure for modern systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
