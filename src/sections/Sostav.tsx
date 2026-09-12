import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { sostav } from '../data/site'
import { useReducedMotion } from '../hooks/usePrefs'
import { MediaFrame } from '../components/MediaFrame'
import { Container, DisplayHeading, Eyebrow } from '../components/ui/Layout'
import { StackCards } from '../components/ui/StackCards'

type Card = (typeof sostav.cards)[number]

/** 03 Состав — «Три вещи, которые нельзя ускорить», стопка наезжающих карточек как в видео. */
export function Sostav() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-14, 18])
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -80])

  return (
    <section ref={ref} id="sostav" className="relative bg-ink py-24 md:py-36">
      <Container>
        <div className="relative">
          <Eyebrow index={sostav.index} label={sostav.label} />
          <DisplayHeading lines={sostav.lines} className="mt-8" size="text-[clamp(32px,6vw,112px)]" />
          <motion.div
            aria-hidden
            style={{ rotate, y }}
            className="pointer-events-none absolute right-0 top-0 hidden w-[clamp(120px,13vw,220px)] md:block"
          >
            <MediaFrame name={sostav.accent.name} alt="" sizes="220px" className="aspect-square" mediaClassName="object-contain" fallback={<span />} />
          </motion.div>
        </div>

        <div className="mt-16 md:mt-24">
          <StackCards items={sostav.cards} render={(card) => <SostavCard card={card} />} />
        </div>
      </Container>
    </section>
  )
}

function SostavCard({ card }: { card: Card }) {
  return (
    <article className="relative grid overflow-hidden rounded-[28px] border border-cream/10 bg-[#0a0807] md:min-h-[62vh] md:grid-cols-2">
      <MediaFrame
        name={card.photo.name}
        alt={card.photo.alt}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="aspect-[4/3] md:aspect-auto md:h-full"
      />
      <div className="flex flex-col justify-between gap-10 p-7 md:p-12">
        <span className="font-display text-[clamp(56px,7vw,120px)] font-[200] leading-none tracking-[-0.04em] text-gold/80">{card.n}</span>
        <div>
          <h3 className="font-display text-[clamp(30px,3.6vw,60px)] font-[300] uppercase leading-[0.95] tracking-[-0.02em] text-cream">
            {card.title}
          </h3>
          <p className="mt-6 max-w-[460px] text-[15px] leading-relaxed text-cream/75 md:text-base">{card.text}</p>
        </div>
      </div>
    </article>
  )
}
