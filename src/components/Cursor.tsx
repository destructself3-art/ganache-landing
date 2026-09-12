import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import clsx from 'clsx'

type CursorState = { hover: boolean; label: string | null; hidden: boolean }

/**
 * Точка + кольцо. На ссылках и кнопках кольцо растёт, на элементах с
 * data-cursor="Текст" превращается в золотую плашку с подписью.
 * Монтируется только для мыши и без prefers-reduced-motion (решает App).
 */
export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.6 })
  const [state, setState] = useState<CursorState>({ hover: false, label: null, hidden: true })

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('has-cursor')

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as Element | null)?.closest<HTMLElement>('a, button, [data-cursor]')
      const hover = Boolean(target)
      const label = target?.dataset.cursor || null
      // Перерисовываемся только когда состояние реально сменилось.
      setState((s) => (s.hover === hover && s.label === label && !s.hidden ? s : { hover, label, hidden: false }))
    }
    const onLeave = () => setState((s) => ({ ...s, hidden: true }))

    window.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.classList.remove('has-cursor')
    }
  }, [x, y])

  return (
    <div aria-hidden className={clsx('pointer-events-none fixed inset-0 z-[70] transition-opacity duration-300', state.hidden && 'opacity-0')}>
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <div
          className={clsx(
            'flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-500 ease-expo',
            state.label
              ? 'h-24 w-24 border-gold bg-gold'
              : state.hover
                ? 'h-14 w-14 border-cream/50 bg-cream/5'
                : 'h-9 w-9 border-cream/35',
          )}
        >
          <AnimatePresence>
            {state.label && (
              <motion.span
                key={state.label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
                className="caps text-center text-[10px] text-ink"
              >
                {state.label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <div className={clsx('h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream transition-opacity', state.label && 'opacity-0')} />
      </motion.div>
    </div>
  )
}
