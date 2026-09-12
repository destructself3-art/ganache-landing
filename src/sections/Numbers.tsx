import type { MouseEvent } from 'react'
import { ArrowDown } from 'lucide-react'
import { marquee, numbers } from '../data/site'
import { scrollToHash } from '../hooks/useLenis'
import { Reveal } from '../components/Reveal'
import { RollText } from '../components/RollText'
import { Counter } from '../components/ui/Counter'
import { Container, DisplayHeading } from '../components/ui/Layout'
import { Marquee } from '../components/ui/Marquee'
import { ParallaxMedia } from '../components/ui/ParallaxMedia'

/** Бегущая строка + цифры + цех. В видео: «29 лет за вертелом · 6 минут на свёрток · 1 точка». */
export function Numbers() {
  const go = (e: MouseEvent) => {
    e.preventDefault()
    scrollToHash(numbers.link.href)
  }

  return (
    <section className="relative bg-ink pb-24 md:pb-36">
      <Marquee items={marquee} />
      <Container className="mt-20 md:mt-28">
        <div className="grid gap-12 border-b border-cream/10 pb-16 sm:grid-cols-3 sm:gap-8">
          {numbers.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="font-display text-[clamp(84px,10vw,184px)] font-[200] leading-none tracking-[-0.04em] text-cream"
              />
              <p className="caps mt-5 text-cream/60">{stat.label}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-12 md:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <ParallaxMedia
              name={numbers.photo.name}
              alt={numbers.photo.alt}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/5] rounded-[28px] border border-cream/10"
            />
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <DisplayHeading as="h3" lines={[numbers.title]} size="text-[clamp(34px,4.4vw,76px)]" />
            <Reveal delay={0.1} className="mt-8 max-w-[520px]">
              <p className="text-base leading-relaxed text-cream/75 md:text-[17px]">{numbers.text}</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <a href={numbers.link.href} onClick={go} className="caps inline-flex items-center gap-3 text-gold">
                <RollText text={numbers.link.label} />
                <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
