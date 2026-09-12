import { ArrowUpRight } from 'lucide-react'
import { buildOrderLink, menu } from '../data/site'
import { MediaFrame } from '../components/MediaFrame'
import { Reveal } from '../components/Reveal'
import { RollText } from '../components/RollText'
import { Container, DisplayHeading, Eyebrow } from '../components/ui/Layout'

type Item = (typeof menu.items)[number]

/** 04 Меню — четыре торта. На телефоне горизонтальная лента, с планшета сетка 2×2. */
export function Menu() {
  return (
    <section id="menu" className="relative bg-ink py-24 md:py-36">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow index={menu.index} label={menu.label} />
            <DisplayHeading lines={menu.lines} className="mt-8" size="text-[clamp(32px,6vw,112px)]" />
          </div>
          <Reveal className="md:max-w-[300px] md:pb-3">
            <p className="caps text-cream/55">{menu.note}</p>
          </Reveal>
        </div>

        <div className="-mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:mt-20 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {menu.items.map((item, i) => (
            <Reveal key={item.name} delay={(i % 2) * 0.08} className="w-[84vw] shrink-0 snap-start sm:w-[62vw] md:w-auto">
              <MenuCard item={item} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

function MenuCard({ item }: { item: Item }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-cream/10 bg-[#0a0807]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <MediaFrame
          name={item.photo.name}
          alt={item.photo.alt}
          sizes="(min-width: 768px) 46vw, 84vw"
          className="h-full w-full"
          mediaClassName="transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.06]"
        />
        <a
          href={buildOrderLink(item.name)}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Заказать"
          className="caps absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-cream py-3 pl-4 pr-3.5 text-ink transition-all duration-500 ease-expo hover:bg-gold focus-visible:translate-y-0 focus-visible:opacity-100 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          <RollText text="Заказать этот" />
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </a>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-[clamp(24px,2.6vw,44px)] font-[300] uppercase leading-none tracking-[-0.02em] text-cream">
            {item.name}
          </h3>
          <p className="whitespace-nowrap font-display text-[clamp(18px,1.8vw,28px)] font-[300] text-gold">{item.price}</p>
        </div>
        <p className="text-[15px] leading-relaxed text-cream/70">{item.text}</p>
        <p className="caps mt-auto pt-2 text-cream/45">Ø16 · 1,2 кг</p>
      </div>
    </article>
  )
}
