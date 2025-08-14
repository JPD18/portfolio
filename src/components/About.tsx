import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'
import GradientText from './ui/GradientText'

export default function About() {
  return (
    <section id="about" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="grid gap-8 md:grid-cols-5"
        >
          <div className="md:col-span-2">
            <div className="aspect-square w-full rounded-xl bg-radial-glow ring-1 ring-white/10" />
          </div>
          <div className="md:col-span-3">
            <h2 className="text-2xl font-semibold">
              <GradientText>About me</GradientText>
            </h2>
            <p className="mt-3 text-white">
              <Balancer>
                I’m John, a recent graduate from Kings College London Bsc Computer Science, looking to further my skills in the fields of software development and AI. I build with React, Django, Ollama, Hugging Face, and innovate with Generative AI to create better solutions.
              </Balancer>
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-white/70 sm:grid-cols-3">
              {['React', 'TypeScript', 'Node', 'Tailwind', 'Python', 'Django', 'Ollama', 'Hugging Face', 'Generative AI/Media', 'LangGraph','Supabase','Vercel', 'Smart-Contracts','Reinforcement Learning','Evolutionary Algorithms','Agentic AI/ElisaOS' ].map((skill) => (
                <li key={skill} className="rounded-md border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


