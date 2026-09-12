import type { CSSProperties } from 'react'
import clsx from 'clsx'

/**
 * Ховер «перелистывание»: каждая буква целиком уезжает вверх, снизу поднимается
 * её копия, с лёгкой волной по буквам. Срабатывает на ховер ближайшей ссылки или
 * кнопки (или любого родителя с классом .roll-host). Стили — в index.css (.roll).
 */
export function RollText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={clsx('roll', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="roll__chars">
        {Array.from(text).map((char, i) => {
          const glyph = char === ' ' ? ' ' : char
          return (
            <span key={i} className="roll__char" style={{ '--i': i } as CSSProperties}>
              <span>{glyph}</span>
              <span>{glyph}</span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
