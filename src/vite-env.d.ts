/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE: string
  readonly VITE_APP_TITLE: string
  readonly VITE_OPENAI_KEY: string
  readonly VITE_OPENAI_URL: string
  readonly VITE_MAX_SEND_MES_COUNT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
