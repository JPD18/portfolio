import './App.css'
import { lazy, Suspense, useEffect, useState } from 'react'
const BackgroundFX = lazy(() => import('./components/BackgroundFX'))
import RippleLayer from './components/RippleLayer'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Footer from './components/Footer'

export default function App() {
  const [canShowBg, setCanShowBg] = useState(false)
  useEffect(() => {
    const show = () => setCanShowBg(true)
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(show, { timeout: 2000 })
    } else {
      setTimeout(show, 1200)
    }
  }, [])

  return (
    <div className="relative min-h-dvh">
      <Suspense fallback={
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#05070f] via-[#0a0e1a] to-[#05070f]">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                                radial-gradient(2px 2px at 60% 70%, white, transparent),
                                radial-gradient(1px 1px at 50% 50%, white, transparent)`,
              backgroundSize: '200px 200px',
              backgroundPosition: '0 0, 40px 60px, 130px 270px'
            }}
          />
        </div>
      }>
        {canShowBg && <BackgroundFX />}
      </Suspense>
      {/* Subtle translucent cursor ripples between BG and content */}
      <RippleLayer zIndex={-5} mixBlendMode="screen" opacity={0.05} maxRipples={3} speed={0.6} frequency={1} damping={0.8} intensity={1.5} />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4">
        <Hero />
        <About />
        <Projects />
      </main>
      <Footer />
    </div>
  )
}
