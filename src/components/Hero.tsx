import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import KineticText from "./ui/KineticText";
import GradientText from "./ui/GradientText";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-dvh flex-col justify-center px-4 pt-20 sm:px-8 lg:px-16"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_60%)]" />

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Aligned */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-purple-100/75 shadow-[0_0_40px_rgba(124,58,237,0.12)] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
              Design-led AI Engineering
            </div>

            <h1 className="font-bold leading-none tracking-tight text-white drop-shadow-2xl">
              <span className="block text-5xl sm:text-7xl lg:text-8xl mb-2 opacity-90 text-shadow-sm">
                Johnathan
              </span>
              <span className="block text-5xl sm:text-7xl lg:text-8xl text-glow">
                <GradientText colors={["#a78bfa", "#f472b6", "#a78bfa"]}>
                  Dawber
                </GradientText>
              </span>
            </h1>

            <div className="mt-6 flex items-center gap-2 text-xl sm:text-2xl font-light text-white text-shadow-sm">
              <Terminal className="h-5 w-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <KineticText text="Agentic Engineer" />
            </div>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white drop-shadow-md">
              I craft polished AI products, intelligent interfaces, and
              resilient web systems with a cinematic sense of detail.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="group" asChild>
                <a href="#projects">
                  Explore Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <a href="#about">About Me</a>
              </Button>
            </div>
          </motion.div>

          {/* Right Side - Empty for 3D Elements to shine, or subtle decor */}
          <div className="hidden lg:block relative h-full min-h-[400px]">
            {/* Decorative HUD Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute top-0 right-0 p-4 border border-white/10 bg-black/20 backdrop-blur-md rounded-lg"
            >
              <div className="flex flex-col gap-2">
                <div className="h-1 w-24 bg-purple-500/20 rounded overflow-hidden">
                  <motion.div
                    animate={{ x: [-100, 100] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-full w-1/2 bg-purple-500"
                  />
                </div>
                <div className="text-[10px] text-purple-300 font-mono">
                  COORDINATES: 51.5074° N, 0.1278° W
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-8 flex flex-col items-center gap-2 lg:left-16"
      >
        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <span className="text-[10px] uppercase tracking-widest text-white/30 vertical-writing-rl rotate-180">
          Scroll to Explore
        </span>
      </motion.div>
    </section>
  );
}
