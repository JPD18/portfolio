import { type ButtonHTMLAttributes, forwardRef, isValidElement, cloneElement } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'ghost' | 'subtle'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

const base =
  'group relative inline-flex items-center justify-center select-none rounded-md transition ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 overflow-hidden ' +
  'hover:scale-[1.015] active:scale-[0.98]'

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-sm px-5 py-2.5',
}

const variants: Record<Variant, string> = {
  primary:
    'text-white shadow-lg shadow-cosmic-purple/25 ' +
    'bg-gradient-to-br from-cosmic-orange via-cosmic-purple to-cosmic-orange ' +
    // Sheen sweep: narrow, skewed band moving left->right with fade in/out
    'before:pointer-events-none before:absolute before:top-0 before:left-[-120%] before:h-full before:w-[45%] ' +
    'before:bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.6),transparent)] before:skew-x-12 ' +
    'before:opacity-0 group-hover:before:left-[120%] group-hover:before:opacity-60 before:transition-all before:duration-700 before:ease-out ' +
    // Subtle inner ring
    'after:pointer-events-none after:absolute after:inset-[-1px] after:rounded-md after:ring-1 after:ring-white/20',
  ghost:
    'text-white/85 hover:text-white border border-white/10 bg-black/30 backdrop-blur ' +
    'hover:border-white/20 ' +
    'before:pointer-events-none before:absolute before:top-0 before:left-[-120%] before:h-full before:w-[45%] ' +
    'before:bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.35),transparent)] before:skew-x-12 ' +
    'before:opacity-0 group-hover:before:left-[120%] group-hover:before:opacity-60 before:transition-all before:duration-700 before:ease-out',
  subtle:
    'text-white/85 hover:text-white bg-white/5 border border-white/10 backdrop-blur ' +
    'hover:border-white/20',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild, children, ...props }, ref) => {
    const classes = clsx(base, sizes[size], variants[variant], className)

    if (asChild && isValidElement(children)) {
      // Style the child element directly and avoid passing button-only props to DOM nodes like <a>
      return cloneElement(children as any, {
        className: clsx((children as any).props?.className, classes),
      })
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'


