/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GEMINI_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly APP_URL?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_GCP_API_KEY?: string;
  readonly VITE_GCP_PROJECT_ID?: string;
  readonly VITE_GCP_DATABASE_ID?: string;
  readonly VITE_GCP_REGION?: string;
  readonly VITE_SUPER_ADMIN_NAME?: string;
  readonly VITE_SUPER_ADMIN_EMAIL?: string;
  readonly VITE_SUPER_ADMIN_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
