/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STORAGE_PREFIX: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_BRIDGE_ENV?: "sandbox" | "live";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
