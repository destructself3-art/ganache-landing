import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** ?shot — режим для скриншотов и QA: без прелоадера и анимаций, всё сразу в финальном состоянии. */
export const SHOT = new URLSearchParams(window.location.search).has('shot')

export function useReducedMotion() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  return SHOT || reduced
}

/** Мышь, а не палец: кастомный курсор, раскрытие коробки по наведению, magnetic. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

export type Layout = 'mobile' | 'tablet' | 'desktop'

export function useLayout(): Layout {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const tablet = useMediaQuery('(min-width: 768px)')
  return desktop ? 'desktop' : tablet ? 'tablet' : 'mobile'
}
