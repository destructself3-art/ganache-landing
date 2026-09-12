import { useEffect } from 'react'
import Lenis from 'lenis'

let instance: Lenis | null = null

export const getLenis = () => instance

export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ duration: 1.15, autoRaf: true })
    instance = lenis
    return () => {
      lenis.destroy()
      instance = null
    }
  }, [enabled])
}

export function scrollToHash(href: string) {
  const el = document.querySelector<HTMLElement>(href)
  if (!el) return
  if (instance) {
    instance.resize()
    instance.scrollTo(el)
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
