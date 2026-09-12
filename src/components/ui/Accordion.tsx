import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { useReducedMotion } from '../../hooks/usePrefs'
import { EASE } from '../Reveal'

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const reduced = useReducedMotion()
  const baseId = useId()

  return (
    <div className="border-t border-cream/10">
      {items.map((item, i) => {
        const isOpen = open === i
        const panelId = `${baseId}-${i}`
        return (
          <div key={item.q} className="border-b border-cream/10">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
            >
              <span className="font-display text-[clamp(20px,2.3vw,32px)] font-[300] leading-tight text-cream/90 transition-colors group-hover:text-cream">
                {item.q}
              </span>
              <span
                aria-hidden
                className={clsx(
                  'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-500',
                  isOpen ? 'border-gold bg-gold' : 'border-cream/20 group-hover:border-cream/50',
                )}
              >
                <span className={clsx('absolute h-px w-4 transition-colors', isOpen ? 'bg-ink' : 'bg-cream')} />
                <span
                  className={clsx(
                    'absolute h-4 w-px transition-transform duration-500 ease-expo',
                    isOpen ? 'scale-y-0 bg-ink' : 'bg-cream',
                  )}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[680px] pb-7 text-[15px] leading-relaxed text-cream/70 md:text-base">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
