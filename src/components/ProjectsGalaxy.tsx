import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Github, Link as LinkIcon } from 'lucide-react'

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
    href: '#',
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

function useKeyNav(onLeft: () => void, onRight: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onLeft()
      if (e.key === 'ArrowRight') onRight()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onLeft, onRight])
}

export default function ProjectsGalaxy() {
  const [active, setActive] = useState(0)
  const [baseAngle, setBaseAngle] = useState(0) // degrees

  const radii = [28, 40, 52] // percent of container min-dimension
  const angleStep = 360 / projects.length

  const planetData = useMemo(
    () =>
      projects.map((p, i) => {
        const ring = i % radii.length
        const angle = baseAngle + i * angleStep
        return { project: p, angle, ring }
      }),
    [baseAngle]
  )

  const goLeft = useCallback(() => setActive((i) => (i - 1 + projects.length) % projects.length), [])
  const goRight = useCallback(() => setActive((i) => (i + 1) % projects.length), [])

  useKeyNav(goLeft, goRight)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-3 backdrop-blur">
      {/* Portal frame and glows */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute -inset-40 -z-10 bg-conic-aurora opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-glow" />

      {/* Controls */}
      <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2">
        <button
          onClick={goLeft}
          className="rounded-full border border-white/10 bg-black/50 p-2 text-white/80 backdrop-blur transition hover:text-white"
          aria-label="Previous project"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute right-3 top-1/2 z-20 -translate-y-1/2">
        <button
          onClick={goRight}
          className="rounded-full border border-white/10 bg-black/50 p-2 text-white/80 backdrop-blur transition hover:text-white"
          aria-label="Next project"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Galaxy canvas */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[linear-gradient(180deg,rgba(21,26,55,0.7),rgba(11,16,38,0.9))]">
        {/* Orbits */}
        {radii.map((r) => (
          <div
            key={r}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
            style={{ width: `${r * 2}%`, height: `${r * 2}%` }}
          />
        ))}

        {/* Planets */}
        <div className="absolute inset-0">
          {planetData.map(({ project, ring, angle }, i) => {
            const radius = radii[ring]
            // Convert polar -> percentage positions; 50% center + offset
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180)
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180)
            const selected = i === active
            return (
              <motion.button
                key={project.title}
                onClick={() => setActive(i)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: selected ? 1.15 : 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-[2px]"
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-label={`Open ${project.title}`}
              >
                <span
                  className="block size-10 rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-orange shadow-xl shadow-cosmic-purple/20 transition group-hover:scale-110 md:size-12"
                />
                <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-cosmic-purple/30 blur-2xl md:block md:size-24" />
              </motion.button>
            )
          })}
        </div>

        {/* Slow ambient rotation to simulate galaxy drift */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 240, ease: 'linear' }}
          onUpdate={() => setBaseAngle((a) => (a + 0.02) % 360)}
        />
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


