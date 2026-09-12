import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useReducedMotion } from '../../hooks/usePrefs'
import { EASE } from '../Reveal'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('mx-auto w-full max-w-[1600px] px-5 md:px-8 lg:px-12', className)}>{children}</div>
}

/** Подпись раздела: «01 — Витрина» с тонкой линией. */
export function Eyebrow({ index, label, className }: { index: string; label: string; className?: string }) {
  return (
    <p className={clsx('caps flex items-center gap-3 text-cream/60', className)}>
      <span className="text-gold">{index}</span>
      <span className="h-px w-10 bg-cream/25" aria-hidden />
      {label}
    </p>
  )
}

/** Крупный тонкий капс, строки выезжают снизу при появлении в кадре. */
export function DisplayHeading({
  lines,
  as: Tag = 'h2',
  className,
  size = 'text-[clamp(44px,8.2vw,148px)]',
}: {
  lines: string[]
  as?: 'h2' | 'h3'
  className?: string
  size?: string
}) {
  const reduced = useReducedMotion()
  return (
    <Tag className={clsx('font-display font-[200] uppercase leading-[0.86] tracking-[-0.03em]', size, className)}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="text-sheen block"
            initial={reduced ? false : { y: '105%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, ease: EASE, delay: i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
