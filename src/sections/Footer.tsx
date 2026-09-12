import type { MouseEvent } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { media } from '../data/media'
import { brand, buildOrderLink, contacts, footer, nav } from '../data/site'
import { scrollToHash } from '../hooks/useLenis'
import { Logo } from '../components/Logo'
import { RollText } from '../components/RollText'
import { Container } from '../components/ui/Layout'
import { MagneticButton } from '../components/ui/MagneticButton'

/** Масштабный футер: гигантское «ГАНАШ» наполовину утоплено в камни, за ними янтарное свечение. */
export function Footer() {
  const stones = media('footer-stones')
  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToHash(href)
  }

  return (
    <footer className="relative overflow-hidden bg-ink pt-24 md:pt-32">
      <Container className="relative z-20 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-[360px] text-[15px] leading-relaxed text-cream/60">
            {brand.tagline}. Шесть тортов за ночь, забираете в 8:00.
          </p>
          <MagneticButton
            href={buildOrderLink()}
            external
            className="caps mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-cream px-8 py-5 text-ink transition-colors hover:bg-gold md:w-auto"
          >
            <RollText text="Заказать торт" />
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </MagneticButton>
        </div>

        <nav className="md:col-span-3 md:col-start-7" aria-label="Разделы в подвале">
          <p className="caps text-cream/40">Разделы</p>
          <ul className="mt-5 space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={go(item.href)} className="text-[15px] text-cream/80 transition-colors hover:text-cream">
                  <RollText text={item.label} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="caps text-cream/40">Связь</p>
          <ul className="mt-5 space-y-3 text-[15px] text-cream/80">
            <li>{contacts.place}</li>
            <li>{contacts.hours}</li>
            <li>
              <a href={contacts.phoneHref} className="transition-colors hover:text-gold">
                {contacts.phone}
              </a>
            </li>
            <li>
              <a href={`https://t.me/${contacts.telegram}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">
                Telegram · @{contacts.telegram}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="relative mt-20 md:mt-28" aria-hidden>
        <div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{ background: 'radial-gradient(55% 75% at 50% 100%, rgba(217,130,43,0.5), rgba(120,50,18,0.22) 45%, transparent 75%)' }}
        />
        {/* На телефоне слово крупнее, а полоса ниже: иначе камни закрывают его почти целиком. */}
        <p className="text-sheen relative select-none text-center font-display text-[30vw] font-[200] uppercase leading-[0.8] tracking-[-0.05em] md:text-[23vw]">
          {footer.word}
        </p>
        {/* Привязка к верху: в кадре остаются прозрачный верх, свечение и гребень камней,
            а плотный передний план уходит за нижний край. С привязкой к низу было наоборот —
            полоса выходила целиком непрозрачной и закрывала слово. */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-[max(96px,20vw)] md:h-[max(120px,24vw)]">
          {stones && (
            <img
              src={stones.src}
              srcSet={stones.srcSet}
              sizes="100vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          )}
        </div>
      </div>

      <div className="relative z-20 bg-ink">
        <Container className="flex flex-col gap-2 border-t border-cream/10 py-6 text-[12px] text-cream/40 md:flex-row md:justify-between">
          <span>© 2026 {brand.name} · {brand.city}</span>
          <span>{footer.note}</span>
        </Container>
      </div>
    </footer>
  )
}
