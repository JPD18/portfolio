import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Github,
  ExternalLink,
  Play,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

// Assets
import baldwinImg from "../assets/project/baldwin.png";
import embeddingLabImg from "../assets/project/Embedding Lab - Profile 1 - Microsoft​ Edge 20_08_2025 14_31_51.png";
import mandryImg from "../assets/project/mandry.png";
import wefitImg from "../assets/project/WeFit Prototyping Board - Brave 13_08_2025 13_10_42.png";
import pollImg from "../assets/project/PollWherever - Profile 1 - Microsoft​ Edge 13_08_2025 14_22_41.png";
import whisperGameVideo from "../assets/project/drafttrailer - Made with Clipchamp (3).mp4";

type Project = {
  title: string;
  description: string;
  impact: string;
  tech: string[];
  href?: string;
  repo?: string;
  image?: string;
  video?: string;
};

const projects: Project[] = [
  {
    title: "Voxaga",
    description:
      "A cinematic LLM puzzle game blending narrative, generated media, and agentic clue solving.",
    impact: "Narrative AI game",
    tech: [
      "React",
      "Django",
      "Supabase",
      "LangGraph",
      "Midjourney",
      "Higgsfield",
    ],
    href: "https://voxaga.onrender.com/",
    video: whisperGameVideo,
  },
  {
    title: "Embedding Lab",
    description:
      "An experimental NLP workbench for training, exploring, and explaining word embeddings.",
    impact: "Interactive NLP lab",
    tech: [
      "Python",
      "Word2Vec",
      "Pytorch",
      "NLTK",
      "PCA",
      "Nearest Neighbours",
      "NLP",
    ],
    image: embeddingLabImg,
    repo: "https://github.com/JPD18/Embedding_lab",
  },
  {
    title: "Baldwin",
    description:
      "A graph-backed assistant proof of concept for navigating student-service knowledge.",
    impact: "Knowledge graph assistant",
    tech: ["Python", "Neo4j", "LangChain", "Knowledge Graphs"],
    image: baldwinImg,
  },
  {
    title: "Mandry AI",
    description:
      "An AI assistant concept for clearer visa and immigration support workflows.",
    impact: "Guided immigration support",
    tech: ["Next.js", "LangGraph", "Ollama", "Anthropic"],
    repo: "https://github.com/JPD18/Mandry-ai",
    image: mandryImg,
  },
  {
    title: "PollWherever",
    description:
      "A live quiz platform for computer science lectures with responsive classroom interactions.",
    impact: "Lecture engagement tool",
    tech: ["Django", "WebSockets", "RoBERTa"],
    image: pollImg,
  },
  {
    title: "WeFit",
    description:
      "A user-centred fitness prototype focused on approachable planning and habit formation.",
    impact: "UX prototype",
    tech: ["Figma", "Miro"],
    href: "https://www.figma.com/proto/WDxNzFA2CKxsTeaPvT7vWg/WeFit-Prototyping-Board?node-id=225-24019&t=RYHn42xCICiFFNbk-1&starting-point-node-id=233%3A25007",
    image: wefitImg,
  },
];

// Video player component
function VideoPlayer({ src, title }: { src: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative h-full w-full bg-black/20 group">
      {!isPlaying ? (
        <>
          <video
            ref={videoRef}
            src={src}
            className="h-full w-full object-cover opacity-60 transition group-hover:opacity-80"
            muted
            playsInline
            preload="metadata"
          />
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 z-10 flex items-center justify-center"
            aria-label={`Play ${title} video`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20">
              <Play className="ml-1 h-6 w-6 text-white" fill="currentColor" />
            </div>
          </button>
        </>
      ) : (
        <video
          src={src}
          controls
          autoPlay
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}

export default function ProjectsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex(
      (prev) => (prev + newDirection + projects.length) % projects.length,
    );
  };

  const currentProject = projects[index];
  const previousIndex = (index - 1 + projects.length) % projects.length;
  const nextIndex = (index + 1) % projects.length;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-3 shadow-[0_30px_120px_rgba(15,23,42,0.55)] backdrop-blur-md sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(216,180,254,0.18),transparent_28%),radial-gradient(circle_at_85%_70%,rgba(251,146,60,0.12),transparent_32%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.55fr,1fr] lg:items-center lg:gap-12">
        {/* Visual Side */}
        <div className="group relative aspect-video w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10 mix-blend-overlay" />

          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 h-full w-full"
            >
              {currentProject.video ? (
                <VideoPlayer
                  src={currentProject.video}
                  title={currentProject.title}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-black/20 p-4">
                  {currentProject.image && (
                    <img
                      src={currentProject.image}
                      alt={currentProject.title}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" /> Featured work
          </div>

          {/* Navigation Buttons (Always Visible) */}
          <div className="absolute inset-0 z-20 flex items-center justify-between p-4 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              className="pointer-events-auto p-3 rounded-full bg-black/50 text-white/90 hover:bg-purple-600 hover:text-white hover:scale-110 transition-all duration-300 backdrop-blur-md border border-white/10 shadow-lg"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              className="pointer-events-auto p-3 rounded-full bg-black/50 text-white/90 hover:bg-purple-600 hover:text-white hover:scale-110 transition-all duration-300 backdrop-blur-md border border-white/10 shadow-lg"
              aria-label="Next project"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Details Side */}
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-200/70">
                  {currentProject.impact}
                </p>
                <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {currentProject.title}
                </h3>
                <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 opacity-80" />
              </div>

              <p className="max-w-xl text-lg leading-relaxed text-white/72">
                {currentProject.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {currentProject.tech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                {currentProject.href && (
                  <a
                    href={currentProject.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                  >
                    <ExternalLink className="h-4 w-4" /> Visit Live
                  </a>
                )}
                {currentProject.repo && (
                  <a
                    href={currentProject.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <Github className="h-4 w-4" /> View Code
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/55">
            <button
              onClick={() => paginate(-1)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-purple-300/40 hover:bg-white/[0.06]"
            >
              <span className="block text-[10px] uppercase tracking-[0.22em] text-white/35">
                Previous
              </span>
              <span className="mt-1 block truncate font-semibold text-white/75">
                {projects[previousIndex].title}
              </span>
            </button>
            <button
              onClick={() => paginate(1)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-purple-300/40 hover:bg-white/[0.06]"
            >
              <span className="block text-[10px] uppercase tracking-[0.22em] text-white/35">
                Next
              </span>
              <span className="mt-1 block truncate font-semibold text-white/75">
                {projects[nextIndex].title}
              </span>
            </button>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-6">
            <button
              onClick={() => paginate(-1)}
              className="group flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              PREV
            </button>

            <div className="flex gap-2">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={clsx(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index
                      ? "w-10 bg-gradient-to-r from-fuchsia-400 to-orange-300"
                      : "w-2 bg-white/20 hover:bg-white/40",
                  )}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="group flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors"
            >
              NEXT
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
