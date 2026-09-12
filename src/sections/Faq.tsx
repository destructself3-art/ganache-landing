import { faq } from '../data/site'
import { Reveal } from '../components/Reveal'
import { Accordion } from '../components/ui/Accordion'
import { Container, DisplayHeading, Eyebrow } from '../components/ui/Layout'

/** 06 Вопросы — заголовок закреплён слева, аккордеон справа. */
export function Faq() {
  return (
    <section id="faq" className="relative bg-ink py-24 md:py-36">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[14vh]">
            <Eyebrow index={faq.index} label={faq.label} />
            <DisplayHeading lines={[faq.title]} className="mt-8" size="text-[clamp(32px,3.8vw,68px)]" />
          </div>
        </div>
        <Reveal className="lg:col-span-7 lg:col-start-6">
          <Accordion items={faq.items} />
        </Reveal>
      </Container>
    </section>
  )
}
