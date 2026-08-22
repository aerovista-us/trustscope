"use client";

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, string | number | boolean | null>) => void };
    __trustscopeAnalyticsQueue?: Array<{ name: string; data?: Record<string, string | number | boolean | null> }>;
  }
}

export function trackEvent(name: string, data?: Record<string, string | number | boolean | null>) {
  if (typeof window === "undefined") return;
  if (window.umami?.track) {
    window.umami.track(name, data);
    return;
  }
  window.__trustscopeAnalyticsQueue ||= [];
  window.__trustscopeAnalyticsQueue.push({ name, data });
}

export function flushAnalyticsQueue() {
  if (typeof window === "undefined" || !window.umami?.track || !window.__trustscopeAnalyticsQueue?.length) return;
  const queued = [...window.__trustscopeAnalyticsQueue];
  window.__trustscopeAnalyticsQueue = [];
  queued.forEach(({ name, data }) => window.umami?.track(name, data));
}
