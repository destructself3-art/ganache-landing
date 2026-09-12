import clsx from 'clsx'
import { brand } from '../data/site'

/** Монограмма: «Г» из двух штрихов в тонком золотом кольце — как печать на ленте коробки. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18.25" fill="none" stroke="#C9A36A" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="15" fill="none" stroke="#C9A36A" strokeOpacity="0.35" strokeWidth="0.6" />
      <path d="M14.5 12.5h11.5M14.5 12.5v15" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-3', className)}>
      <Monogram className="h-8 w-8 text-cream" />
      <span className="font-display text-[15px] font-[300] uppercase tracking-[0.42em] text-cream">{brand.name}</span>
    </span>
  )
}
