import { vitrina } from '../data/site'
import { Reveal } from '../components/Reveal'
import { Container, DisplayHeading, Eyebrow } from '../components/ui/Layout'
import { ParallaxMedia } from '../components/ui/ParallaxMedia'

/** 01 Витрина — аналог «Один ларёк у канатки» из видео: одна точка, фирменная, ночью. */
export function Vitrina() {
  return (
    <section id="vitrina" className="relative bg-ink py-24 md:py-36">
      <Container className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Eyebrow index={vitrina.index} label={vitrina.label} />
          <DisplayHeading lines={vitrina.lines} className="mt-8" size="text-[clamp(32px,5.8vw,108px)]" />
          <Reveal delay={0.1} className="mt-10 max-w-[540px]">
            <p className="text-base leading-relaxed text-cream/75 md:text-[17px]">{vitrina.text}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-12 grid max-w-[660px] gap-6 border-t border-cream/10 pt-8 sm:grid-cols-3">
            {vitrina.facts.map((fact) => (
              <div key={fact.k}>
                <p className="caps text-gold">{fact.k}</p>
                <p className="mt-2 text-[15px] leading-snug text-cream/85">{fact.v}</p>
              </div>
            ))}
          </Reveal>
        </div>
        <Reveal delay={0.15} className="lg:col-span-5">
          <div data-cursor="Витрина">
            <ParallaxMedia
              name={vitrina.photo.name}
              alt={vitrina.photo.alt}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/5] rounded-[28px] border border-cream/10"
            />
          </div>
          <p className="caps mt-4 text-cream/50">{vitrina.caption}</p>
        </Reveal>
      </Container>
    </section>
  )
}
