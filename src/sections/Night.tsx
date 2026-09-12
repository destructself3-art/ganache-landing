import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { night } from '../data/site'
import { useReducedMotion } from '../hooks/usePrefs'
import { Reveal } from '../components/Reveal'
import { Container, DisplayHeading, Eyebrow } from '../components/ui/Layout'
import { ParallaxMedia } from '../components/ui/ParallaxMedia'

/** 02 Ночью — таймлайн смены. Кадр слева закреплён, золотая линия заполняется по скроллу. */
export function Night() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="night" className="relative bg-ink py-24 md:py-36">
      <Container>
        <Eyebrow index={night.index} label={night.label} />
        <DisplayHeading lines={[night.title]} className="mt-8" size="text-[clamp(34px,6vw,112px)]" />

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[14vh]">
              <ParallaxMedia
                name={night.photo.name}
                alt={night.photo.alt}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/5] rounded-[28px] border border-cream/10"
              />
            </div>
          </div>

          <div ref={ref} className="relative lg:col-span-6 lg:col-start-7">
            <div aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-cream/10" />
            <motion.div
              aria-hidden
              className="absolute bottom-3 left-[7px] top-3 w-px origin-top bg-gold"
              style={{ scaleY: reduced ? 1 : fill }}
            />
            <ol className="space-y-14">
              {night.steps.map((step) => (
                <Reveal as="li" key={step.time} className="relative pl-12">
                  <span aria-hidden className="absolute left-0 top-3 h-[15px] w-[15px] rounded-full border border-gold bg-ink" />
                  <p className="font-display text-[clamp(44px,4.6vw,76px)] font-[200] leading-none tracking-[-0.03em] text-cream">
                    {step.time}
                  </p>
                  <p className="caps mt-4 text-gold">{step.title}</p>
                  <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-cream/70 md:text-base">{step.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}
