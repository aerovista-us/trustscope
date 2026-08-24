"use client";

import Script from "next/script";
import { flushAnalyticsQueue } from "@/lib/analytics";

const defaultUrl = "https://stats.aerocoreos.com";
const defaultWebsiteId = "0b295f4a-b308-40e9-b3f3-ed1d50b18ac0";

export default function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() || defaultWebsiteId;
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL || defaultUrl;
  const allowed = (process.env.NEXT_PUBLIC_UMAMI_DOMAINS || "").split(",").map((value) => value.trim()).filter(Boolean);

  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  const hostAllowed = allowed.length === 0 || allowed.some((rule) => rule.startsWith(".") ? host.endsWith(rule) : host === rule);
  if (!hostAllowed || host === "localhost" || host === "127.0.0.1") return null;

  return (
    <Script
      src={`${umamiUrl.replace(/\/$/, "")}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
      onLoad={flushAnalyticsQueue}
    />
  );
}
