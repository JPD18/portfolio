import { useState } from 'react'
import baldwinImg from '../assets/project/baldwin.png'
import mandryImg from '../assets/project/mandry.png'
import wefitImg from '../assets/project/WeFit Prototyping Board - Brave 13_08_2025 13_10_42.png'
import pollImg from '../assets/project/PollWherever - Profile 1 - Microsoft​ Edge 13_08_2025 14_22_41.png'
import { ChevronLeft, ChevronRight, Github, Link as LinkIcon } from 'lucide-react'

type Project = {
  title: string
  description: string
  tech: string[]
  href?: string
  repo?: string
  image?: string
}

const projects: Project[] = [
  {
    title: 'Voxaga',
    description: 'LLM-based puzzle-solving web game',
    tech: ['React', 'Django','Supabase', 'LangGraph','Midjourney','Higgsfield'],
    href: 'https://infinitewhispers.onrender.com/',
  },
  {
    title: 'Baldwin',
    description: 'GraphRag ChatbotPoC for student services',
    tech: ['Python', 'Neo4j', 'LangChain', 'Knowledge Graphs'],
    image: baldwinImg,
  },
  {
    title: 'Mandry AI',
    description: 'Visa and Immigration AI Assistant',
    tech: ['Next.js', 'LangGraph', 'Ollama','Anthropic'],
    repo: 'https://github.com/JPD18/Mandry-ai',
    image: mandryImg,
  },
  {
    title: 'PollWherever',
    description: 'Interative quiz for Computer Science lectures',
    tech: ['Django', 'WebSockets','RoBERTa'],
    image: pollImg,
  },
  {
    title: 'WeFit',
    description: 'User-Centred design for a fitness app',
    tech: ['Figma', 'Miro'],
    href: 'https://www.figma.com/proto/WDxNzFA2CKxsTeaPvT7vWg/WeFit-Prototyping-Board?node-id=225-24019&t=RYHn42xCICiFFNbk-1&starting-point-node-id=233%3A25007',
    image: wefitImg,
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

      <div className="relative z-0 w-full isolate">
        <div className="pointer-events-auto absolute left-2 top-1/2 z-10 -translate-y-1/2">
          <button
            onClick={prev}
            className="rounded-full border border-white/10 bg-black/50 p-2 text-white/80 backdrop-blur transition hover:text-white hover:border-white/30 hover:bg-black/60 hover:shadow-[0_0_24px_rgba(124,58,237,0.35)] active:scale-95"
            aria-label="Previous project"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="pointer-events-auto absolute right-2 top-1/2 z-10 -translate-y-1/2">
          <button
            onClick={next}
            className="rounded-full border border-white/10 bg-black/50 p-2 text-white/80 backdrop-blur transition hover:text-white hover:border-white/30 hover:bg-black/60 hover:shadow-[0_0_24px_rgba(124,58,237,0.35)] active:scale-95"
            aria-label="Next project"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-hidden">
          <div
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') prev()
              if (e.key === 'ArrowRight') next()
            }}
            className="group/card relative aspect-[16/9] w-full rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(21,26,55,0.7),rgba(11,16,38,0.9))] p-6 transition duration-200 hover:border-white/20 hover:brightness-110 hover:shadow-[inset_0_0_40px_rgba(124,58,237,0.15),0_0_0_1px_rgba(255,255,255,0.06)] focus:outline-none focus:ring-2 focus:ring-cosmic-purple/40"
          >
            {projects[index].image && (
              <>
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img
                    src={projects[index].image}
                    className="max-h-full max-w-full object-contain"
                    aria-hidden="true"
                  />
                </div>
                <div className="absolute inset-0 z-0 bg-black/30" aria-hidden="true" />
              </>
            )}

            {/* Overlay info panel */}
            <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
              <div className="inline-block w-fit max-w-[90%] rounded-xl border border-white/10 bg-black/50 p-4 backdrop-blur md:max-w-[70%]">
                <h3 className="text-lg font-semibold md:text-xl">{projects[index].title}</h3>
                <p className="mt-1 text-xs text-white/75 md:text-sm">{projects[index].description}</p>
                <ul className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/75 md:text-xs">
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
                      className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/85 backdrop-blur transition hover:text-white hover:border-white/30 hover:bg-black/60 md:text-sm"
                    >
                      <LinkIcon className="h-4 w-4" /> Live
                    </a>
                  )}
                  {projects[index].repo && (
                    <a
                      href={projects[index].repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/85 backdrop-blur transition hover:text-white hover:border-white/30 hover:bg-black/60 md:text-sm"
                    >
                      <Github className="h-4 w-4" /> Repo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mini previews */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {projects.map((p, i) => (
          <button
            key={p.title}
            onClick={() => setIndex(i)}
            aria-label={`Show ${p.title}`}
            className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md border transition ${
              i === index
                ? 'border-white/40 ring-2 ring-cosmic-purple/50'
                : 'border-white/10 hover:border-white/30 hover:ring-1 hover:ring-cosmic-purple/40'
            }`}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              src={p.image }
              className="h-full w-full object-cover opacity-80 transition group-hover/card:opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30" />
            <span className="absolute bottom-1 left-1 right-1 truncate text-left text-[11px] text-white/90">
              {p.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}


