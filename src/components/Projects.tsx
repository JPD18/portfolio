import ProjectsCarousel from './ProjectsCarousel'

export default function Projects() {
  return (
    <section id="projects" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Projects</h2>
        </div>
        <ProjectsCarousel />
      </div>
    </section>
  )
}


