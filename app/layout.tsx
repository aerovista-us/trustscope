import type { Metadata } from "next";
import AeroVistaLocalBadge from "@/components/AeroVistaLocalBadge";
import UmamiAnalytics from "@/components/UmamiAnalytics";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://trustscope.aerovista.us").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "TrustScope | Does This Look Legit?",
  description: "A privacy-first scam and phishing signal checker for suspicious messages, links, and emails.",
  alternates: { canonical: siteUrl },
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    title: "TrustScope — Does this look legit?",
    description: "Check the signals before you click, pay, sign in, or reply.",
    url: siteUrl,
    siteName: "TrustScope",
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "TrustScope — check the signals before you click, pay, sign in, or reply." }]
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustScope — Does this look legit?",
    description: "Check the signals before you click, pay, sign in, or reply.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AeroVistaLocalBadge />
        <UmamiAnalytics />
      </body>
    </html>
  );
}
