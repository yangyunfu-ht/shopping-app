/// <reference types="vite/client" />

declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

interface ImportMetaEnv {
  VITE_APP_REQUEST_URL: string
  VITE_APP_UPLOAD_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
