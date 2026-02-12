import { motion } from 'framer-motion'
import GradientText from './ui/GradientText'
import { Code2, Brain, Rocket, Lightbulb, Wrench } from 'lucide-react'

export default function About() {
  const skills = [
    { 
      category: "Systems & Product", 
      icon: <Lightbulb className="h-4 w-4" />, 
      items: ['Systems Design', 'Agent Architecting', 'SDLC', 'User-Centred Design', 'Product Discovery', 'Roadmapping', 'Agile Delivery'] 
    },
    { 
      category: "Software Engineering", 
      icon: <Code2 className="h-4 w-4" />, 
      items: ['Python', 'Django', 'React', 'TypeScript', 'Java', 'C++', 'Golang', 'Solidity', 'PostgreSQL', 'Docker', 'Redis', 'CI/CD', 'TDD'] 
    },
    { 
      category: "AI & Data", 
      icon: <Brain className="h-4 w-4" />, 
      items: ['LLM Integration', 'Prompt Engineering', 'RAG', 'Agentic Workflows', 'LangGraph', 'PyTorch', 'Ollama', 'Evaluations', 'Scikit-learn'] 
    },
    { 
      category: "Tools", 
      icon: <Wrench className="h-4 w-4" />, 
      items: ['GitHub', 'Linear', 'Jira', 'Figma', 'Miro', 'Cursor', 'Claude', 'Midjourney'] 
    },
  ]

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-purple-900/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-blue-900/10 blur-[80px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 relative z-10">
        <div className="grid md:grid-cols-[1fr,1.5fr] gap-12 items-start">
          
          {/* Profile / Hologram Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
             <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm group">
                {/* Placeholder for Profile Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 z-0" />
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                   <Code2 className="h-24 w-24 mb-4" />
                   <span className="text-xs font-mono uppercase tracking-widest">Profile_Image_Not_Found</span>
                </div>

                {/* Animated Scanline */}
                <motion.div 
                  className="absolute inset-x-0 h-[2px] bg-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.5)] z-20"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Corner Accents */}
                <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-white/30 rounded-tl-sm" />
                <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-white/30 rounded-tr-sm" />
                <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-white/30 rounded-bl-sm" />
                <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-white/30 rounded-br-sm" />
             </div>
             
             {/* Stats Card */}
             <div className="absolute -bottom-6 -right-6 -left-6 md:left-auto md:-right-10 bg-black/60 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl flex gap-6 justify-around">
                <div className="text-center">
                   <div className="text-2xl font-bold text-white">3+</div>
                   <div className="text-[10px] text-white/50 uppercase tracking-wider">Years Exp</div>
                </div>
                <div className="w-[1px] bg-white/10" />
                <div className="text-center">
                   <div className="text-2xl font-bold text-white">20+</div>
                   <div className="text-[10px] text-white/50 uppercase tracking-wider">Projects</div>
                </div>
             </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-2 flex items-center gap-2 text-purple-400 font-mono text-sm">
               <Rocket className="h-4 w-4" />
               <span>ABOUT_ME.md</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
               Decoding <GradientText colors={["#60A5FA", "#A78BFA", "#F472B6"]}>Complexity</GradientText>
            </h2>

            <div className="prose prose-invert prose-lg text-white mb-8 drop-shadow-md">
              <p>
                I’m Johnathan, a Computer Science graduate from King's College London specializing in <span className="text-white font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Agentic Engineering</span>. 
                My primary focus is architecting robust systems and managing autonomous agents to implement secure, efficient, and reliable solutions.
              </p>
              <p>
                Currently exploring the frontiers of <span className="text-white font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Agentic AI</span> and <span className="text-white font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Generative Media</span>. 
                I don't just write code; I design intelligent ecosystems that learn, adapt, and evolve.
              </p>
            </div>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {skills.map((skill, idx) => (
                  <motion.div 
                    key={skill.category}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group rounded-lg border border-white/5 bg-white/5 p-4 hover:border-white/20 hover:bg-white/10 transition-colors"
                  >
                     <div className="flex items-center gap-2 mb-3 text-white/90 font-medium">
                        <div className="p-1.5 rounded-md bg-purple-500/20 text-purple-300">
                           {skill.icon}
                        </div>
                        {skill.category}
                     </div>
                     <div className="flex flex-wrap gap-1.5">
                        {skill.items.map(item => (
                           <span key={item} className="text-xs px-2 py-1 rounded bg-black/40 text-white/60 border border-white/5 group-hover:text-white/80 transition-colors">
                              {item}
                           </span>
                        ))}
                     </div>
                  </motion.div>
               ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}
