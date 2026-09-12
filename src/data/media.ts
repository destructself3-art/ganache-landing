import manifest from './media-manifest.json'

type Entry = { w: number; h: number; alpha: boolean; widths: number[] }

export type Media = { src: string; srcSet: string; w: number; h: number; alpha: boolean }

const entries = manifest as Record<string, Entry>

/**
 * Картинка из public/media по имени из манифеста (его пишет scripts/media.py).
 * Если файла нет — undefined, и компонент рисует заглушку, не запрашивая сеть.
 */
export function media(name: string): Media | undefined {
  const e = entries[name]
  if (!e) return undefined
  const url = (w: number) => `/media/${name}-${w}.webp`
  return {
    src: url(e.widths[e.widths.length - 1]),
    srcSet: e.widths.map((w) => `${url(w)} ${w}w`).join(', '),
    w: e.w,
    h: e.h,
    alpha: e.alpha,
  }
}
