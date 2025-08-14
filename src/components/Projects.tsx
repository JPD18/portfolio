import ProjectsCarousel from './ProjectsCarousel'

export default function Projects() {
  return (
    <section id="projects" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between sm:mb-8">
          <h2 className="text-xl font-semibold sm:text-2xl">Projects</h2>
        </div>
        <ProjectsCarousel />
      </div>
    </section>
  )
}


