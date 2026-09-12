import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import clsx from 'clsx'
import { Clock3, Droplet } from 'lucide-react'
import { media, type Media } from '../data/media'
import { hero } from '../data/site'
import { useFinePointer, useLayout, useReducedMotion, type Layout } from '../hooks/usePrefs'
import { ArtFrame, BoxClosed, BoxOpen, SceneBackdrop } from './HeroArt'
import { MediaFrame } from './MediaFrame'
import { EASE } from './Reveal'

export function Hero({ ready }: { ready: boolean }) {
  const layout = useLayout()
  return layout === 'desktop' ? <HeroDesktop ready={ready} /> : <HeroCompact ready={ready} layout={layout} />
}

/*
 * Десктоп. Слои снизу вверх, как в видео:
 * сцена (закрытая / открытая) → заголовок → вырезанный продукт (закрытый / открытый) → затемнение низа → плашки.
 * Наведение на коробку проявляет открытое состояние кругом от курсора (reveal).
 */
function HeroDesktop({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()

  const closed = media('hero-closed')
  const open = media('hero-open')
  const closedCut = media('hero-closed-cut')
  const openCut = media('hero-open-cut')
  const realScene = Boolean(closed && open)
  const realCuts = Boolean(closedCut && openCut)

  const [isOpen, setOpen] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const radius = useSpring(0, { stiffness: 50, damping: 15, mass: 1 })
  const edge = useTransform(radius, (r) => r * 1.35 + 0.5)
  const showMask = useMotionTemplate`radial-gradient(circle at ${mx}px ${my}px, #000 ${radius}px, transparent ${edge}px)`
  const hideMask = useMotionTemplate`radial-gradient(circle at ${mx}px ${my}px, transparent ${radius}px, #000 ${edge}px)`
  const showStyle = reduced ? { opacity: isOpen ? 1 : 0 } : { WebkitMaskImage: showMask, maskImage: showMask }
  const hideStyle = reduced ? { opacity: isOpen ? 0 : 1 } : { WebkitMaskImage: hideMask, maskImage: hideMask }

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08])
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '6%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '24%'])

  const track = (e: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    mx.set(e.clientX - box.left)
    my.set(e.clientY - box.top)
  }

  const toggle = (next: boolean) => {
    setOpen(next)
    const el = ref.current
    radius.set(next ? (el ? Math.hypot(el.clientWidth, el.clientHeight) : 2400) : 0)
  }

  const fromCenter = () => {
    const el = ref.current
    if (!el) return
    mx.set(el.clientWidth / 2)
    my.set(el.clientHeight * 0.55)
  }

  const scene = { scale: sceneScale, y: sceneY, ready }

  return (
    <section ref={ref} id="top" onPointerMove={track} className="relative h-[100svh] min-h-[700px] overflow-hidden bg-ink">
      <Scene {...scene}>
        {realScene ? (
          <Photo m={closed!} alt="Чёрная коробка-шляпница с золотой лентой и печатью «Г» на вулканических камнях" eager />
        ) : (
          <SceneBackdrop />
        )}
      </Scene>
      {realScene && (
        <motion.div className="absolute inset-0" style={showStyle}>
          <Scene {...scene}>
            <Photo m={open!} alt="" eager />
          </Scene>
        </motion.div>
      )}

      <motion.h1
        aria-label={`${hero.lineTop} ${hero.lineBottom}`}
        style={{ y: textY }}
        className="pointer-events-none absolute inset-0 z-10 select-none font-display text-[clamp(96px,15.2vw,300px)] font-[200] uppercase leading-[0.8] tracking-[-0.035em]"
      >
        <Line text={hero.lineTop} ready={ready} delay={0.15} className="absolute left-[15vw] top-[15vh]" />
        <Line text={hero.lineBottom} ready={ready} delay={0.28} className="absolute bottom-[19vh] right-[4vw]" />
      </motion.h1>

      <motion.div className="absolute inset-0 z-20" style={hideStyle}>
        <Scene {...scene}>
          {realCuts ? (
            <Photo m={closedCut!} alt="" eager />
          ) : (
            !realScene && (
              <ArtFrame>
                <BoxClosed />
              </ArtFrame>
            )
          )}
        </Scene>
      </motion.div>
      <motion.div className="absolute inset-0 z-20" style={showStyle}>
        <Scene {...scene}>
          {realCuts ? (
            <Photo m={openCut!} alt="" eager />
          ) : (
            !realScene && (
              <ArtFrame>
                <BoxOpen />
              </ArtFrame>
            )
          )}
        </Scene>
      </motion.div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[24%] bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      {/* Поднятая крышка заходит под меню — лёгкое затемнение сверху держит навигацию читаемой. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[18%] bg-gradient-to-b from-ink/70 to-transparent" />

      {/* Зона коробки: мышью — наведение, пальцем — тап. */}
      <div
        data-cursor=""
        aria-hidden
        className="absolute bottom-[8%] left-1/2 z-[35] h-[74%] w-[28%] -translate-x-1/2"
        onPointerEnter={fine ? () => toggle(true) : undefined}
        onPointerLeave={fine ? () => toggle(false) : undefined}
        onClick={fine ? undefined : () => toggle(!isOpen)}
      />

      <Plate ready={ready} delay={0.6} className="absolute left-[4vw] top-[48%] z-40 w-[clamp(180px,14vw,240px)]">
        <MediaFrame name={hero.card.name} alt={hero.card.alt} sizes="240px" className="aspect-[4/3] rounded-xl border border-cream/10" />
        <div className="caps mt-3 flex items-center justify-between">
          <span className="text-gold">{hero.card.since}</span>
          <span className="text-cream/60">{hero.card.label}</span>
        </div>
      </Plate>

      <Plate ready={ready} delay={0.7} className="absolute right-[4vw] top-[19vh] z-40 flex items-start gap-3">
        <Droplet className="mt-0.5 h-4 w-4 text-gold" strokeWidth={1.25} aria-hidden />
        <ul className="caps space-y-1 text-cream/75">
          {hero.kicker.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Plate>

      <Plate ready={ready} delay={0.8} className="absolute bottom-[6vh] left-[4vw] z-40 max-w-[320px]">
        <p className="text-[15px] leading-relaxed text-cream/85">{hero.subtitle}</p>
      </Plate>

      <Plate ready={ready} delay={0.9} className="absolute bottom-[5vh] right-[4vw] z-40">
        <Badge />
      </Plate>

      <motion.button
        type="button"
        onClick={() => {
          fromCenter()
          toggle(!isOpen)
        }}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="caps absolute bottom-[5.5vh] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-cream/15 bg-ink/40 px-4 py-2.5 text-cream/80 backdrop-blur-md"
      >
        <span className="relative flex h-2 w-2" aria-hidden>
          {!isOpen && !reduced && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />}
          <span className="relative h-2 w-2 rounded-full bg-gold" />
        </span>
        {isOpen ? 'Закрыть коробку' : hero.hint}
      </motion.button>
    </section>
  )
}

/* Планшет и телефон: без механики раскрытия, торт сразу открыт, заголовок по центральной оси. */
function HeroCompact({ ready, layout }: { ready: boolean; layout: Exclude<Layout, 'desktop'> }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const bg = media(`hero-${layout}`)
  const cut = media(`hero-${layout}-cut`)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%'])

  return (
    <>
      <section ref={ref} id="top" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink">
        <FadeIn ready={ready}>
          {bg ? <Photo m={bg} alt="Торт с приподнятой крышкой коробки на камнях" eager /> : <SceneBackdrop compact />}
        </FadeIn>

        <motion.div style={{ y: textY }} className="absolute inset-x-0 top-[13svh] z-10 flex flex-col items-center px-5 text-center">
          <Plate ready={ready} delay={0.1}>
            <p className="caps text-cream/70">{hero.kicker.join(' · ')}</p>
          </Plate>
          <h1
            aria-label={`${hero.lineTop} ${hero.lineBottom}`}
            className="mt-5 font-display text-[clamp(64px,21vw,168px)] font-[200] uppercase leading-[0.82] tracking-[-0.035em]"
          >
            <Line text={hero.lineTop} ready={ready} delay={0.15} />
            <Line text={hero.lineBottom} ready={ready} delay={0.25} />
          </h1>
        </motion.div>

        <FadeIn ready={ready} className="z-20">
          {cut ? (
            <Photo m={cut} alt="" eager />
          ) : (
            !bg && (
              <ArtFrame compact>
                <BoxOpen />
              </ArtFrame>
            )
          )}
        </FadeIn>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[30%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />

        <Plate ready={ready} delay={0.6} className="absolute inset-x-0 bottom-[6svh] z-40 px-8 text-center">
          <p className="mx-auto max-w-[300px] text-[15px] leading-relaxed text-cream/90">{hero.subtitle}</p>
        </Plate>
      </section>

      {/* Плашки на мобилке уезжают на чистый чёрный — на камнях они не читаются. */}
      <div className="grid gap-3 bg-ink px-5 pb-8 pt-2 md:grid-cols-2 md:px-8">
        <div className="flex items-center gap-4 rounded-2xl border border-cream/10 p-2.5 pr-5">
          <MediaFrame name={hero.card.name} alt={hero.card.alt} sizes="80px" className="h-16 w-20 shrink-0 rounded-xl" />
          <div>
            <p className="caps text-gold">{hero.card.since}</p>
            <p className="mt-1 text-[13px] leading-snug text-cream/80">{hero.cardNote}</p>
          </div>
        </div>
        <Badge />
      </div>
    </>
  )
}

function Photo({ m, alt, eager }: { m: Media; alt: string; eager?: boolean }) {
  return (
    <img
      src={m.src}
      srcSet={m.srcSet}
      sizes="100vw"
      width={m.w}
      height={m.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className="absolute inset-0 h-full w-full select-none object-cover"
    />
  )
}

function Scene({ children, scale, y, ready }: { children: ReactNode; scale: MotionValue<number>; y: MotionValue<string>; ready: boolean }) {
  const reduced = useReducedMotion()
  return (
    <motion.div className="absolute inset-0" style={{ scale, y }}>
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { opacity: 0, scale: 1.06 }}
        animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1.8, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function FadeIn({ children, ready, className }: { children: ReactNode; ready: boolean; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={clsx('absolute inset-0', className)}
      initial={reduced ? false : { opacity: 0, scale: 1.05 }}
      animate={ready ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 1.6, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function Line({ text, ready, delay, className }: { text: string; ready: boolean; delay: number; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <span className={clsx('block overflow-hidden pb-[0.05em]', className)}>
      <motion.span
        className="text-sheen block"
        initial={reduced ? false : { y: '105%' }}
        animate={ready ? { y: 0 } : undefined}
        transition={{ duration: 1.3, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  )
}

function Plate({ children, ready, delay, className }: { children: ReactNode; ready: boolean; delay: number; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={ready ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function Badge() {
  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-cream/10 bg-ink/45 p-2.5 pr-5 backdrop-blur-md md:w-[300px]">
      <MediaFrame
        name={hero.badge.name}
        alt=""
        sizes="64px"
        className="h-16 w-16 shrink-0 rounded-xl bg-cocoa/60"
        mediaClassName="object-contain p-1"
        fallback={<PralineGlyph />}
      />
      <div>
        <p className="caps flex items-center gap-2 text-gold">
          <Clock3 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          {hero.badge.title}
        </p>
        <p className="mt-1 text-[13px] leading-snug text-cream/80">{hero.badge.text}</p>
      </div>
    </div>
  )
}

function PralineGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full p-2" aria-hidden>
      <ellipse cx="32" cy="46" rx="20" ry="4" fill="#000" opacity="0.5" />
      <path d="M12 44a20 20 0 0 1 40 0Z" fill="#2a130a" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
      <path d="M18 34q14-8 28 0" stroke="#e8cb92" strokeWidth="2" fill="none" />
      <ellipse cx="24" cy="31" rx="5" ry="2" fill="rgba(255,255,255,0.35)" transform="rotate(-25 24 31)" />
    </svg>
  )
}
