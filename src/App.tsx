import './App.css'
import BackgroundFX from './components/BackgroundFX'
import CursorFX from './components/CursorFX'
import RippleLayer from './components/RippleLayer'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-dvh">
      <BackgroundFX />
      {/* Subtle translucent cursor ripples between BG and content */}
      <RippleLayer zIndex={-5} mixBlendMode="screen" opacity={0.28} maxRipples={10} speed={520} frequency={0.05} damping={2.4} maxRadius={220} />
      {/* Keep the existing dot/pulse for precision focus; remove if undesired */}
      <CursorFX />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-20 sm:pt-24">
        <Hero />
        <About />
        <Projects />
      </main>
      <Footer />
    </div>
  )
}
