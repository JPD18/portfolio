import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'

const planetUrls = [
  new URL('../assets/Molten_Earth_0809000822_texture.glb', import.meta.url).href,
  new URL('../assets/Molten_Earth_0809003511_texture.glb', import.meta.url).href,
  new URL('../assets/Molten_Earth_0809003919_texture.glb', import.meta.url).href,
]

type PlanetProps = {
  url: string
  position: [number, number, number]
  scale?: number
  rotationSpeed?: number
}

function RotatingPlanet({ url, position, scale = 6, rotationSpeed = 0.08 }: PlanetProps) {
  const gl = useThree((state) => state.gl)
  const ktx2Loader = useMemo(() => {
    const loader = new KTX2Loader().setTranscoderPath('/basis/')
    loader.detectSupport(gl)
    return loader
  }, [gl])

  const gltf = useLoader(GLTFLoader, url, (loader) => {
    (loader as any).setKTX2Loader(ktx2Loader)
  }) as unknown as GLTF
  const ref = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    // Constant self-rotation regardless of scroll
    ref.current.rotation.y += rotationSpeed * delta
    ref.current.rotation.x += rotationSpeed * 0.35 * delta
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 12], fov: 55 }}
        gl={{ antialias: false, powerPreference: 'low-power', toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl, scene }) => {
          gl.toneMappingExposure = 1.2
          scene.background = new THREE.Color('#05070f')
          scene.fog = new THREE.Fog('#05070f', 30, 140)
        }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.6} />
        <hemisphereLight args={[0x4455aa, 0x090b1a, 0.5]} />
        <pointLight position={[8, 6, 12]} intensity={40} color="#ffffff" />
        

        <Suspense fallback={null}>
          <Stars radius={160} depth={80} count={2000} factor={1.2} saturation={0} fade speed={0} />
          {/* Three planets orbiting the center with individual self-rotation */}
          <OrbitingPlanets />
        </Suspense>

        <EffectComposer multisampling={0} resolutionScale={0.75}>
          <Bloom intensity={0.4} luminanceThreshold={0.2} luminanceSmoothing={0.04} />
          <Vignette eskil={false} offset={0.25} darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

// Preloading is optional; if using KTX2-compressed textures, the configured loader above will handle them

//

function OrbitingPlanets() {
  // Evenly spaced 3-planet formation, slightly closer radius
  const radius = 28
  const baseAngles = [0, 120, 240]
  const largeScales = [10, 10, 10]
  const urls = planetUrls

  const groupsRef = useRef<Array<THREE.Group | null>>([])
  const baseAngleRef = useRef(0)
  const angularVelocityRef = useRef(0)


  // Scroll drives additional orbital rotation with gentle inertia
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Positive deltaY scrolls down; adjust sensitivity (radians per second impulse)
      angularVelocityRef.current += e.deltaY * 0.005
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  useFrame((_, delta) => {
    // Base slow orbital rotation (always happening)
    const baseOrbitalSpeed = 0.05 // radians per second for slow continuous orbit
    baseAngleRef.current += baseOrbitalSpeed * delta
    
    // Add scroll-driven velocity on top of base rotation
    baseAngleRef.current += angularVelocityRef.current * delta
    angularVelocityRef.current *= Math.exp(-2.5 * delta)
    


    for (let i = 0; i < urls.length; i += 1) {
      const g = groupsRef.current[i]
      if (!g) continue
      const a = (baseAngles[i] * Math.PI) / 180 + baseAngleRef.current
      const x = Math.cos(a) * radius
      const z = -60 - Math.sin(a) * radius
      const y = 0
      g.position.set(x, y, z)
    }
  })

  return (
    <group>
      {urls.map((url, i) => (
        <group key={url} ref={(el) => (groupsRef.current[i] = el)}>
          <RotatingPlanet 
            url={url} 
            position={[0, 0, 0]} 
            scale={largeScales[i]} 
            rotationSpeed={0.1}
          />
        </group>
      ))}
    </group>
  )
}



