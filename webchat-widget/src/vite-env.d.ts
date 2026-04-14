/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SARAH_API_URL: string;
  /** Must match sarah.organizations.slug */
  readonly VITE_ORG_SLUG: string;
  /** Connect to `/ws/chat/{org}` when the org has a single location */
  readonly VITE_SINGLE_LOCATION_EMBED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
