import { motion } from 'framer-motion'
import clsx from 'clsx'
import './ShinyText.css'

type Props = {
  text: string
  className?: string
  delay?: number
  /** Enables translucent moving highlight across the text */
  shiny?: boolean
  /** Shiny animation duration in seconds (lower = faster) */
  speed?: number
  /** Disable the shiny effect without changing layout */
  disabled?: boolean
  /** Optional class applied to each character span */
  charClassName?: string
  /** Optional style applied to each character span */
  charStyle?: React.CSSProperties
}

export default function KineticText({ text, className, delay = 0, shiny = false, speed = 5, disabled = false, charClassName, charStyle }: Props) {
  const chars = Array.from(text)

  return (
    <span
      className={clsx('relative inline-block align-baseline', className, shiny && 'shiny-text-container')}
      aria-label={text}
      style={shiny ? ({ ['--shiny-duration' as any]: `${speed}s` } as React.CSSProperties) : undefined}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          className={clsx('inline-block align-baseline', charClassName)}
          style={charStyle}
          initial={{ y: 18, opacity: 0, rotateX: -40 }}
          whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: delay + i * 0.02, type: 'spring', stiffness: 300, damping: 20 }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}

      {shiny && !disabled && (
        <span className="shiny-text-layer" aria-hidden>
          {chars.map((ch, i) => (
            <span key={`s-${i}`} className="inline-block">
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </span>
      )}
    </span>
  )
}


