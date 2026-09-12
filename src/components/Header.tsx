import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { ArrowUpRight } from 'lucide-react'
import { brand, cta, nav } from '../data/site'
import { getLenis, scrollToHash } from '../hooks/useLenis'
import { useReducedMotion } from '../hooks/usePrefs'
import { Logo } from './Logo'
import { EASE } from './Reveal'
import { RollText } from './RollText'

export function Header({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (open) lenis?.stop()
    else lenis?.start()
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToHash(href)
  }

  return (
    <>
      <motion.header
        initial={reduced ? false : { opacity: 0, y: -16 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
        className={clsx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500',
          scrolled && !open && 'bg-ink/70 backdrop-blur-md',
        )}
      >
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:px-8 lg:px-12">
          <a href="#top" onClick={go('#top')} aria-label={`${brand.name} — наверх`}>
            <Logo />
          </a>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex" aria-label="Разделы">
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={go(item.href)} className="caps text-cream/80 transition-colors hover:text-cream">
                <RollText text={item.label} />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={cta.href}
              onClick={go(cta.href)}
              className="caps hidden items-center gap-2 rounded-full bg-cream py-3 pl-5 pr-4 text-ink transition-colors hover:bg-gold sm:inline-flex"
            >
              <RollText text={cta.label} />
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 lg:hidden"
            >
              <span className={clsx('absolute h-px w-4 bg-cream transition-transform duration-500 ease-expo', open ? 'rotate-45' : '-translate-y-[3px]')} />
              <span className={clsx('absolute h-px w-4 bg-cream transition-transform duration-500 ease-expo', open ? '-rotate-45' : 'translate-y-[3px]')} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-28 md:px-8 lg:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Разделы">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={go(item.href)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.06 }}
                  className="flex items-baseline justify-between border-b border-cream/10 py-4"
                >
                  <span className="font-display text-[clamp(40px,11vw,72px)] font-[200] uppercase leading-none tracking-[-0.02em]">
                    {item.label}
                  </span>
                  <span className="caps text-mute">0{i + 1}</span>
                </motion.a>
              ))}
            </nav>
            <a
              href={cta.href}
              onClick={go(cta.href)}
              className="caps flex items-center justify-center gap-2 rounded-full bg-cream py-5 text-ink"
            >
              {cta.label}
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
