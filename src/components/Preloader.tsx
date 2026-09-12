import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { brand } from '../data/site'
import { useReducedMotion } from '../hooks/usePrefs'
import { EASE } from './Reveal'

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)
  const doneRef = useRef(onDone)

  useEffect(() => {
    doneRef.current = onDone
  })

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: reduced ? 0.2 : 1.7,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      // Сайт стартует, когда шторка только начинает подниматься: первый экран проявляется
      // прямо под ней. Если ждать конца ухода шторки — между ними секунда чёрного экрана.
      onComplete: () => {
        setVisible(false)
        doneRef.current()
      },
    })
    return () => controls.stop()
  }, [reduced])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Загрузка"
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ink"
          exit={reduced ? { opacity: 0 } : { y: '-100%' }}
          transition={{ duration: reduced ? 0.3 : 1.05, ease: EASE }}
        >
          <div className="flex overflow-hidden pb-[0.06em] font-display text-[clamp(56px,11vw,168px)] font-[200] uppercase leading-none tracking-[-0.02em] text-cream">
            {Array.from(brand.name).map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={reduced ? false : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.07 }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          <div className="mt-8 flex w-[min(320px,60vw)] items-center gap-4">
            <div className="relative h-px flex-1 bg-cream/15">
              <div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${count}%` }} />
            </div>
            <span className="caps w-10 text-right tabular-nums text-mute">{String(count).padStart(3, '0')}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
