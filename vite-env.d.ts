/// <reference types="vite/client" />
/// <reference types="node" />

declare module 'vite' {
  export function defineConfig(config: any): any
}

declare module '@vitejs/plugin-react' {
  function react(options?: any): any
  export default react
}