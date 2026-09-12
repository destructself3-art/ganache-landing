import { useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import clsx from 'clsx'
import { useFinePointer, useReducedMotion } from '../../hooks/usePrefs'
import { MediaFrame } from '../MediaFrame'

/**
 * Кадр с запасом по краям: едет за курсором (как ларёк в видео) и чуть-чуть по скроллу.
 * Курсорный параллакс — только мышь и без reduced-motion.
 */
export function ParallaxMedia({
  name,
  alt,
  sizes,
  className,
  strength = 16,
}: {
  name: string
  alt: string
  sizes?: string
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const active = fine && !reduced

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const x = useSpring(px, { stiffness: 110, damping: 20, mass: 0.6 })
  const y = useSpring(py, { stiffness: 110, damping: 20, mass: 0.6 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scrollShift = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-5%', '5%'])

  const onMove = (e: PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set(((e.clientX - r.left) / r.width - 0.5) * -strength * 2)
    py.set(((e.clientY - r.top) / r.height - 0.5) * -strength * 2)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <div
      ref={ref}
      className={clsx('relative overflow-hidden', className)}
      onPointerMove={active ? onMove : undefined}
      onPointerLeave={active ? onLeave : undefined}
    >
      <motion.div className="absolute inset-[-7%]" style={{ y: scrollShift }}>
        <motion.div className="absolute inset-0" style={{ x, y }}>
          <MediaFrame name={name} alt={alt} sizes={sizes} className="h-full w-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}
