import { ArrowUpRight } from 'lucide-react'
import { buildOrderLink, contacts, order } from '../data/site'
import { Reveal } from '../components/Reveal'
import { RollText } from '../components/RollText'
import { Container, DisplayHeading, Eyebrow } from '../components/ui/Layout'
import { MagneticButton } from '../components/ui/MagneticButton'

/** 05 Заказ — «Торт к 8:00». В видео: «До 6:00 утра» + Где / Часы / Связь + «Заказать». */
export function Order() {
  return (
    <section id="order" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{ background: 'radial-gradient(50% 60% at 50% 100%, rgba(217,130,43,0.2), transparent 70%)' }}
      />
      <Container className="relative">
        <Eyebrow index={order.index} label={order.label} />
        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:items-end">
          <DisplayHeading lines={order.lines} className="lg:col-span-7" size="text-[clamp(64px,12vw,220px)]" />
          <Reveal className="flex flex-col items-start gap-6 lg:col-span-5 lg:items-end lg:pb-6">
            <MagneticButton
              href={buildOrderLink()}
              external
              className="caps inline-flex items-center gap-3 rounded-full bg-cream px-8 py-6 text-[12px] text-ink transition-colors hover:bg-gold"
            >
              <RollText text={order.button} />
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </MagneticButton>
            <a href={contacts.phoneHref} className="caps text-cream/70 transition-colors hover:text-cream">
              <RollText text={`или позвоните: ${contacts.phone}`} />
            </a>
          </Reveal>
        </div>

        <ol className="mt-16 grid gap-4 md:mt-20 md:grid-cols-3">
          {order.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.08} className="rounded-[24px] border border-cream/10 bg-[#0a0807] p-7 md:p-8">
              <p className="caps text-gold">0{i + 1}</p>
              <p className="mt-8 font-display text-[clamp(22px,2vw,30px)] font-[300] uppercase leading-tight tracking-[-0.01em] text-cream">
                {step.title}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-cream/70">{step.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <dl className="mt-16 grid gap-8 border-t border-cream/10 pt-10 sm:grid-cols-3">
            <div>
              <dt className="caps text-cream/45">Где</dt>
              <dd className="mt-3 text-[17px] text-cream">
                {contacts.place}
                <span className="mt-1 block text-[14px] text-cream/55">{contacts.placeNote}</span>
              </dd>
            </div>
            <div>
              <dt className="caps text-cream/45">Часы</dt>
              <dd className="mt-3 text-[17px] text-cream">{contacts.hours}</dd>
            </div>
            <div>
              <dt className="caps text-cream/45">Связь</dt>
              <dd className="mt-3 flex flex-col gap-1 text-[17px] text-cream">
                <a href={contacts.phoneHref} className="transition-colors hover:text-gold">
                  {contacts.phone}
                </a>
                <a href={`https://t.me/${contacts.telegram}`} target="_blank" rel="noopener noreferrer" className="text-cream/70 transition-colors hover:text-gold">
                  Telegram · @{contacts.telegram}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </Container>
    </section>
  )
}
