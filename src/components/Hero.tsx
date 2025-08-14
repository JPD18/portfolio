import { motion } from 'framer-motion'
import { Button } from './ui/Button'
import KineticText from './ui/KineticText'
import GradientText from './ui/GradientText'
import Balancer from 'react-wrap-balancer'

export default function Hero() {
  return (
    <section id="home" className="relative isolate scroll-mt-24 pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-conic-aurora opacity-50" />
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-4 inline rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
            Available for work
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl sm:leading-tight">
            <GradientText  colors={["#FB923C", "#7C3AED", "#FB923C", "#7C3AED"]}>
              <KineticText
                text="Product Engineer"
                delay={1}
              />
            </GradientText>{' '}
          </h1>
    
          <p className="mx-auto mt-6 max-w-2xl text-lg text-balance text-white/90 sm:text-xl">
            <Balancer>
              Pushing the boundaries of technology to create meaningful experiences.
            </Balancer>
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6">
            <Button asChild>
              <a href="#projects">View Projects</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#contact">Contact</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


