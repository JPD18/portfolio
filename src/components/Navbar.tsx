import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Menu, X } from 'lucide-react'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'contact']
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all',
        scrolled ? 'backdrop-blur bg-black/20 border-b border-white/10' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#home" className="font-semibold tracking-wide text-white">
          John<span className="text-cosmic-orange">.</span>O
        </a>
        <button className="sm:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="relative hidden sm:block">
          <ul className="relative flex gap-6">
            {navItems.map((item) => (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  className="text-sm text-white/80 hover:text-white transition"
                >
                  {item.label}
                </a>
                {active === item.id && (
                  <div className="absolute -bottom-2 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-cosmic-orange to-cosmic-purple shadow-[0_0_8px_rgba(124,58,237,0.6)]" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {open && (
        <div className="sm:hidden border-t border-white/10 bg-black/40 backdrop-blur">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  onClick={() => setOpen(false)}
                  href={`#${item.id}`}
                  className="block py-2 text-white/80 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}


