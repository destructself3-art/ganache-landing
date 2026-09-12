import { useRef, type PointerEvent, type ReactNode } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useFinePointer, useReducedMotion } from '../../hooks/usePrefs'

/** Главная кнопка тянется за курсором. Только мышь и без reduced-motion. */
export function MagneticButton({
  href,
  children,
  className,
  external = false,
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const active = fine && !reduced
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 })

  const onMove = (e: PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{ x, y }}
      onPointerMove={active ? onMove : undefined}
      onPointerLeave={active ? reset : undefined}
      className={className}
    >
      {children}
    </motion.a>
  )
}
