import clsx from 'clsx'

/** Бегущая строка: две одинаковые ленты, CSS-анимация сдвигает на половину (см. .marquee в index.css). */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <div className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className="flex items-center gap-10 pr-10">
          <span>{item}</span>
          <span className="h-2 w-2 rotate-45 bg-gold" aria-hidden />
        </span>
      ))}
    </div>
  )
  return (
    <div className={clsx('marquee overflow-hidden border-y border-cream/10 py-6', className)}>
      <div className="marquee__track font-display text-[clamp(28px,4vw,56px)] font-[200] uppercase leading-none tracking-[-0.01em] text-cream/90">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
