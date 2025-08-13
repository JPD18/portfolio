import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Github, Link as LinkIcon } from 'lucide-react'
import * as THREE from 'three'

type Project = {
  title: string
  description: string
  tech: string[]
  href?: string
  repo?: string
}

const projects: Project[] = [
  {
    title: 'Stellar Charts',
    description: 'Interactive financial charts with real‑time streams and buttery animations.',
    tech: ['React', 'TypeScript', 'WebSockets', 'Framer Motion'],
    href: '#',
    repo: '#',
  },
  {
    title: 'Nebula Notes',
    description: 'Markdown notebook with AI snippets and elegant offline‑first sync.',
    tech: ['Vite', 'PWA', 'IndexedDB', 'Tailwind'],
    href: '#',
  },
  {
    title: 'Comet Commerce',
    description: 'Headless storefront focused on lighthouse scores and delightful UX.',
    tech: ['Next.js', 'Stripe', 'Framer Motion'],
  },
  {
    title: 'Orbit Ops',
    description: 'DevOps dashboard with real‑time telemetry and incident insights.',
    tech: ['React', 'tRPC', 'WebSockets'],
  },
  {
    title: 'Aurora UI',
    description: 'A small design system focused on accessibility and motion.',
    tech: ['React', 'Tailwind', 'Radix'],
    repo: '#',
  },
]

// Resolve GLB asset URLs via Vite so they get bundled correctly
const planetModelUrls = [
  new URL('../assets/Molten_Earth_0809000822_texture.glb', import.meta.url).href,
  new URL('../assets/Molten_Earth_0809003511_texture.glb', import.meta.url).href,
  new URL('../assets/Molten_Earth_0809003919_texture.glb', import.meta.url).href,
  new URL('../assets/Molten_Earth_0809004558_texture.glb', import.meta.url).href,
  new URL('../assets/Molten_Earth_0809005317_texture.glb', import.meta.url).href,
]
const GLOW_LAYER = 1

function setLayerRecursive(object: THREE.Object3D, layer: number, enabled: boolean) {
  object.traverse((obj) => {
    if (enabled) obj.layers.enable(layer)
    else obj.layers.disable(layer)
  })
}

function useAngles(count: number) {
  const step = 360 / count
  const base = useRef(0)
  useFrame((_, delta) => {
    base.current = (base.current + delta * 6) % 360 // slow drift
  })
  return { getAngle: (i: number) => base.current + i * step }
}

function Orbits({ radii }: { radii: number[] }) {
  return (
    <group rotation-x={Math.PI / 2}>
      {radii.map((r) => (
        <mesh key={r}>
          <ringGeometry args={[r * 0.98, r, 128]} />
          <meshBasicMaterial color="#ffffff" opacity={0.15} transparent />
        </mesh>
      ))}
    </group>
  )
}

function CenterGlowLight() {
  const pointRef = useRef<THREE.PointLight>(null)
  useEffect(() => {
    if (!pointRef.current) return
    // Only affect objects on the glow layer
    pointRef.current.layers.set(GLOW_LAYER)
  }, [])
  return <pointLight ref={pointRef} position={[0, 0, 2]} intensity={26} color="#ffffff" distance={22} decay={2} />
}

function Planets({
  radii,
  onSelect,
  active,
}: {
  radii: number[]
  onSelect: (i: number) => void
  active: number
}) {
  const { getAngle } = useAngles(projects.length)
  const group = useRef<THREE.Group>(null)
  const models = planetModelUrls.map((url) => useGLTF(url))

  useFrame((_, delta) => {
    if (!group.current) return
    const orbitRadius = radii[0]
    const damping = 6
    const t = 1 - Math.exp(-damping * delta)

    projects.forEach((_, i) => {
      const angle = (getAngle(i) * Math.PI) / 180
      const x = Math.cos(angle) * orbitRadius
      const y = Math.sin(angle) * orbitRadius
      const planet = group.current!.children[i] as THREE.Object3D

      const targetPos = i === active ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(x, y, 0)
      planet.position.lerp(targetPos, t)

      const targetScale = i === active ? 2.8 : 1
      planet.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), t)
      planet.renderOrder = i === active ? 1 : 0

      // Rotate planets; active spins faster for a showcase feel
      planet.rotation.y += (i === active ? 0.9 : 0.25) * delta

      // Lighting control: make center light affect only non-active planets
      setLayerRecursive(planet, GLOW_LAYER, i !== active)
    })
  })

  return (
    <group ref={group}>
      {projects.map((_, i) => {
        const model = models[i % models.length]
        return (
          <group
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(i)
            }}
          >
            {/* Base scale roughly matching previous sphere radius */}
            <group scale={0.35}>{model && <primitive object={model.scene.clone()} />}</group>
          </group>
        )
      })}
    </group>
  )
}

export default function ProjectsGalaxy3D() {
  const [active, setActive] = useState(0)

  // Radii tuned to canvas units; camera z≈12
  const radii = useMemo(() => [4.6], [])

  const goLeft = () => setActive((i) => (i - 1 + projects.length) % projects.length)
  const goRight = () => setActive((i) => (i + 1) % projects.length)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-3 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute -inset-40 -z-10 bg-conic-aurora opacity-60 blur-3xl" />
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 12], fov: 45 }}
          gl={{ antialias: false, powerPreference: 'low-power', toneMapping: THREE.ACESFilmicToneMapping }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.3
          }}
        >
          <color attach="background" args={[0, 0, 0]} />
          <ambientLight intensity={0.65} />
          <hemisphereLight args={[0x8899ff, 0x222233, 0.35]} />
          <pointLight position={[5, 5, 8]} intensity={20} color="#FB923C" />
          <pointLight position={[-6, -4, 6]} intensity={12} color="#7C3AED" />
          {/* Center ambient glow that lights only the ring planets */}
          <CenterGlowLight />

          <Suspense fallback={null}>
            <Stars radius={80} depth={50} count={600} factor={3} saturation={0} fade speed={0.5} />
            <Orbits radii={radii} />
            <Planets radii={radii} onSelect={setActive} active={active} />
          </Suspense>

          <EffectComposer multisampling={0} resolutionScale={0.75}>
            <Bloom intensity={0.85} luminanceThreshold={0.15} luminanceSmoothing={0.03} />
          </EffectComposer>

          <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
        </Canvas>

        {/* Controls */}
        <div className="pointer-events-none absolute inset-0">
          <div className="pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2">
            <button
              onClick={goLeft}
              className="rounded-full border border-white/10 bg-black/50 p-2 text-white/80 backdrop-blur transition hover:text-white"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2">
            <button
              onClick={goRight}
              className="rounded-full border border-white/10 bg-black/50 p-2 text-white/80 backdrop-blur transition hover:text-white"
              aria-label="Next project"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur md:grid-cols-5"
        >
          <div className="md:col-span-3">
            <h3 className="text-lg font-medium">{projects[active].title}</h3>
            <p className="mt-1 text-sm text-white/70">{projects[active].description}</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
              {projects[active].tech.map((t) => (
                <li key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-end justify-start gap-2 md:col-span-2 md:justify-end">
            {projects[active].href && (
              <a
                href={projects[active].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80 backdrop-blur transition hover:text-white"
              >
                <LinkIcon className="h-4 w-4" /> Live
              </a>
            )}
            {projects[active].repo && (
              <a
                href={projects[active].repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80 backdrop-blur transition hover:text-white"
              >
                <Github className="h-4 w-4" /> Repo
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Preload the GLBs for smoother first render
planetModelUrls.forEach((url) => useGLTF.preload(url))