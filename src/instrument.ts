import { CONFIG } from "@/config";
import * as Sentry from "@sentry/react";

const SENSITIVE_KEYS = /password|otp|code|privateKey|secret|token|authorization|apiKey|iban|accountNumber/i;

function scrub(value: unknown, depth = 0): unknown {
  if (depth > 6 || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => scrub(v, depth + 1));
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, v]) => [
      key,
      SENSITIVE_KEYS.test(key) ? "[redacted]" : scrub(v, depth + 1),
    ]),
  );
}

// Errors only: no tracing, no replay, no request bodies (exported keys and OTPs pass through the UI)
if (CONFIG.SENTRY_DSN) {
  Sentry.init({
    dsn: CONFIG.SENTRY_DSN,
    release: `${CONFIG.APP_NAME}@${CONFIG.VERSION}`,
    tracesSampleRate: 0,
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
        delete event.request.data;
        if (event.request.url) event.request.url = event.request.url.split("?")[0];
      }
      if (event.extra) event.extra = scrub(event.extra) as typeof event.extra;
      if (event.contexts) event.contexts = scrub(event.contexts) as typeof event.contexts;
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      // Console output and form input can echo secrets; network breadcrumbs keep only method, URL and status
      if (breadcrumb.category === "console" || breadcrumb.category?.startsWith("ui.input")) return null;
      if (breadcrumb.data) {
        delete breadcrumb.data["body"];
        delete breadcrumb.data["request_body"];
        delete breadcrumb.data["response_body"];
        // Reset and invite links carry their token in the query string
        for (const key of ["url", "from", "to"]) {
          const value = breadcrumb.data[key];
          if (typeof value === "string") breadcrumb.data[key] = value.split("?")[0];
        }
      }
      return breadcrumb;
    },
  });
}
