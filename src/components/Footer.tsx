export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 py-10">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-white/60">
        <p>
          Built with React, Tailwind, and motion. Theme: cosmic purple + sun orange.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} John O</p>
      </div>
    </footer>
  )
}


