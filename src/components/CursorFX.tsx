import { useEffect, useRef } from 'react'

export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const pulseRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    dotRef.current = dot

    const pulse = document.createElement('div')
    pulse.className = 'cursor-pulse'
    pulseRef.current = pulse

    document.body.appendChild(dot)
    document.body.appendChild(pulse)

    let currentX = window.innerWidth / 2
    let currentY = window.innerHeight / 2
    let targetX = currentX
    let targetY = currentY
    let rafId = 0

    const setDotPos = (x: number, y: number) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
    }
    const setPulsePos = (x: number, y: number) => {
      if (pulseRef.current) {
        pulseRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
    }

    const tick = () => {
      const alpha = 0.18
      currentX += (targetX - currentX) * alpha
      currentY += (targetY - currentY) * alpha
      setDotPos(currentX, currentY)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      setPulsePos(targetX, targetY)
      if (pulseRef.current) {
        pulseRef.current.classList.remove('animate')
        // Force restart animation
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        pulseRef.current.offsetHeight
        pulseRef.current.classList.add('animate')
      }
    }

    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (pulseRef.current) pulseRef.current.style.opacity = '1'
    }
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (pulseRef.current) pulseRef.current.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseleave', onLeave)
      if (dotRef.current) document.body.removeChild(dotRef.current)
      if (pulseRef.current) document.body.removeChild(pulseRef.current)
    }
  }, [])

  return null
}


