import { useState } from 'react'
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

export default function ProjectsCarousel() {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + projects.length) % projects.length)
  const next = () => setIndex((i) => (i + 1) % projects.length)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute -inset-40 -z-10 bg-conic-aurora opacity-60 blur-3xl" />

      <div className="relative w-full">
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <button
            onClick={prev}
            className="rounded-full border border-white/10 bg-black/50 p-2 text-white/80 backdrop-blur transition hover:text-white"
            aria-label="Previous project"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button
            onClick={next}
            className="rounded-full border border-white/10 bg-black/50 p-2 text-white/80 backdrop-blur transition hover:text-white"
            aria-label="Next project"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-hidden">
          <div className="relative aspect-[16/9] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="group/card absolute inset-0 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(21,26,55,0.7),rgba(11,16,38,0.9))] p-6 [perspective:1000px]"
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover/card:opacity-100" style={{ boxShadow: 'inset 0 0 40px rgba(124,58,237,0.15), 0 0 0 1px rgba(255,255,255,0.06)' }} />
                <motion.div
                  className="flex h-full flex-col justify-end gap-3 will-change-transform"
                  whileHover={{ rotateX: 6, rotateY: -6 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <h3 className="text-xl font-semibold">{projects[index].title}</h3>
                  <p className="text-sm text-white/70">{projects[index].description}</p>
                  <ul className="mt-2 flex flex-wrap gap-2 text-xs text-white/70">
                    {projects[index].tech.map((t) => (
                      <li key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex gap-2">
                    {projects[index].href && (
                      <a
                        href={projects[index].href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80 backdrop-blur transition hover:text-white"
                      >
                        <LinkIcon className="h-4 w-4" /> Live
                      </a>
                    )}
                    {projects[index].repo && (
                      <a
                        href={projects[index].repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80 backdrop-blur transition hover:text-white"
                      >
                        <Github className="h-4 w-4" /> Repo
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}


