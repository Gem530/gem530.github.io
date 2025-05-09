/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'three'
declare module '*.js'
declare module '*.glb'
declare module '*.gltf'
