declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { Group, Loader } from 'three'
  export interface GLTF {
    scene: Group
  }
  export class GLTFLoader extends Loader {
    setKTX2Loader(loader: any): this
  }
}

declare module 'three/examples/jsm/loaders/KTX2Loader.js' {
  import { Loader, WebGLRenderer } from 'three'
  export class KTX2Loader extends Loader {
    setTranscoderPath(path: string): this
    detectSupport(renderer: WebGLRenderer): this
  }
}


