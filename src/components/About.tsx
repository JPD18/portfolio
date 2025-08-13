import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'

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
            <h2 className="text-2xl font-semibold">About me</h2>
            <p className="mt-3 text-white/70">
              <Balancer>
                I’m John, a frontend-leaning full‑stack engineer who enjoys pushing pixels and performance in equal
                measure. I build with React, TypeScript, Tailwind, and a sprinkle of motion.
              </Balancer>
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-white/70 sm:grid-cols-3">
              {['React', 'TypeScript', 'Node', 'Vite', 'Tailwind', 'Framer Motion'].map((skill) => (
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


