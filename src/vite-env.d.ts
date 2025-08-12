/// <reference types="vite/client" />

declare module 'react-dom/client' {
  import { Container } from 'react-dom'
  
  export interface Root {
    render(children: React.ReactNode): void
    unmount(): void
  }
  
  export function createRoot(container: Container): Root
  export function hydrateRoot(container: Container, initialChildren: React.ReactNode): Root
}

declare module '*.css' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_APP_TITLE?: string
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
