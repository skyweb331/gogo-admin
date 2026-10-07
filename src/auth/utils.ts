import { CONFIG } from "@/config";

export function jwtDecode(token: string): { exp?: number; [key: string]: unknown } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    return JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

/** Milliseconds until the token expires (0 when missing or expired), capped for setTimeout. */
export function getTimeToLive(token: string | null | undefined) {
  if (!token) return 0;
  const decoded = jwtDecode(token);
  if (!decoded?.exp) return 0;
  return Math.max(0, Math.min(decoded.exp * 1000 - Date.now(), 2_147_483_646));
}

export function setSession(token: string | null) {
  if (token) localStorage.setItem(CONFIG.storageTokenKey, token);
  else localStorage.removeItem(CONFIG.storageTokenKey);
}

export function getSession() {
  return localStorage.getItem(CONFIG.storageTokenKey);
}

/** Only same-origin relative paths are allowed as `returnTo`. */
export function safeReturnUrl(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
