import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useLayout, useReducedMotion } from '../../hooks/usePrefs'

/**
 * Стопка наезжающих карточек (как «Состав» в видео): все карточки sticky внутри одного
 * родителя, следующая наезжает на предыдущую, предыдущие чуть уменьшаются и темнеют.
 * На телефоне и при reduced-motion — обычный список без наслоений.
 */
export function StackCards<T>({ items, render }: { items: T[]; render: (item: T, index: number) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const layout = useLayout()
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  if (layout === 'mobile' || reduced) {
    return (
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={i}>{render(item, i)}</div>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      {items.map((item, i) => (
        <StackCard key={i} index={i} total={items.length} progress={scrollYProgress}>
          {render(item, i)}
        </StackCard>
      ))}
    </div>
  )
}

function StackCard({
  children,
  index,
  total,
  progress,
}: {
  children: ReactNode
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const depth = total - 1 - index
  const scale = useTransform(progress, [index / total, 1], [1, 1 - depth * 0.05])
  const shade = useTransform(progress, [index / total, 1], [0, depth * 0.28])
  const last = index === total - 1

  return (
    <motion.div
      className="sticky origin-top"
      style={{ top: `calc(13vh + ${index * 26}px)`, scale, marginBottom: last ? 0 : '22vh' }}
    >
      {children}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] bg-ink" style={{ opacity: shade }} />
    </motion.div>
  )
}
