import { useId, type ReactNode } from 'react'
import clsx from 'clsx'

/*
 * Нарисованная заглушка первого экрана — пока нет сгенерированных hero-*.jpg/png.
 * Та же логика слоёв, что и у фото: сцена (градиент + камни) → текст → коробка/торт.
 * Обе иллюстрации коробки в одном viewBox 400×800 с общим подносом,
 * поэтому раскрытие совпадает по месту так же, как совпадут два кадра генерации.
 */

export function SceneBackdrop({ compact = false }: { compact?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-ink">
      <div
        className="absolute inset-0"
        style={{
          background: compact
            ? 'radial-gradient(70% 45% at 50% 66%, rgba(232,146,58,0.8) 0%, rgba(150,62,22,0.5) 38%, rgba(42,20,12,0.92) 68%, #000 100%)'
            : 'radial-gradient(34% 58% at 50% 64%, rgba(232,146,58,0.85) 0%, rgba(150,62,22,0.55) 36%, rgba(42,20,12,0.92) 66%, #000 100%)',
        }}
      />
      <Stones className={clsx('absolute inset-x-0 bottom-0 w-full', compact ? 'h-[30%]' : 'h-[34%]')} />
    </div>
  )
}

function Stones({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice" className={className}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1612" />
          <stop offset="0.45" stopColor="#0b0807" />
          <stop offset="1" stopColor="#030202" />
        </linearGradient>
      </defs>
      <g fill={`url(#${id}s)`} stroke="rgba(255,196,140,0.28)" strokeWidth="1.4">
        <path d="M-20 400V250q60-45 150-28 75 14 120 68 25 40 50 110Z" />
        <path d="M1300 400q40-160 160-174 100-10 160 34v140Z" />
        <path d="M210 400q20-100 120-130 100-25 170 30 40 35 60 100Z" />
        <path d="M1050 400q30-100 130-128 110-22 170 28 40 40 50 100Z" />
        <path d="M600 400q10-100 100-138 100-34 200 0 90 38 100 138Z" />
        <path d="M470 400q30-70 110-82 80-10 120 32 20 25 25 50Z" />
        <path d="M880 400q20-70 100-88 80-12 130 33 20 25 25 55Z" />
      </g>
      <g fill="#050403">
        <ellipse cx="360" cy="396" rx="90" ry="30" />
        <ellipse cx="820" cy="400" rx="130" ry="26" />
        <ellipse cx="1240" cy="398" rx="100" ry="28" />
      </g>
    </svg>
  )
}

/** Где стоит иллюстрация коробки. На фото эту роль играет сам кадр. */
export function ArtFrame({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div
      aria-hidden
      className={clsx(
        'absolute left-1/2 aspect-[1/2] -translate-x-1/2',
        compact ? 'bottom-[10%] h-[57%]' : 'bottom-[6%] h-[86%]',
      )}
    >
      {children}
    </div>
  )
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}box`} x1="0" x2="1">
        <stop offset="0" stopColor="#020202" />
        <stop offset="0.3" stopColor="#1c1b1a" />
        <stop offset="0.62" stopColor="#0b0b0b" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
      <linearGradient id={`${id}gold`} x1="0" x2="1">
        <stop offset="0" stopColor="#7d5e33" />
        <stop offset="0.45" stopColor="#e8cb92" />
        <stop offset="1" stopColor="#8f6d3d" />
      </linearGradient>
      <linearGradient id={`${id}choc`} x1="0" x2="1">
        <stop offset="0" stopColor="#0d0503" />
        <stop offset="0.32" stopColor="#3b1d11" />
        <stop offset="0.6" stopColor="#1c0c06" />
        <stop offset="1" stopColor="#070302" />
      </linearGradient>
    </defs>
  )
}

function Tray({ id }: { id: string }) {
  return (
    <g>
      <path d="M60 748v16a140 20 0 0 0 280 0v-16Z" fill={`url(#${id}box)`} />
      <ellipse cx="200" cy="748" rx="140" ry="20" fill="#111" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
    </g>
  )
}

/** Цилиндр-шляпница: крышка коробки. top — y верхнего эллипса, h — высота. */
function Cover({ id, top, h, open = false }: { id: string; top: number; h: number; open?: boolean }) {
  const bottom = top + h
  return (
    <g>
      <path d={`M70 ${top}V${bottom}a130 22 0 0 0 260 0V${top}Z`} fill={`url(#${id}box)`} />
      {open && <ellipse cx="200" cy={bottom} rx="130" ry="22" fill="#000" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />}
      <ellipse cx="200" cy={top} rx="130" ry="22" fill="#161514" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      {/* Контровой свет по краям цилиндра. */}
      <path d={`M71 ${top + 2}V${bottom}M329 ${top + 2}V${bottom}`} stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" />
      {/* Лента: вертикальная по фронту и поясом вокруг. */}
      <path d={`M186 ${top + 21}h28V${bottom + 21}h-28Z`} fill={`url(#${id}gold)`} opacity="0.95" />
      <path
        d={`M70 ${top + h * 0.45}q130 24 260 0v26q-130 24-260 0Z`}
        fill={`url(#${id}gold)`}
        opacity="0.95"
      />
    </g>
  )
}

export function BoxClosed({ className }: { className?: string }) {
  const id = useId()
  const top = 380
  const knotY = top + 372 * 0.45 + 24
  return (
    <svg viewBox="0 0 400 800" className={clsx('h-full w-full overflow-visible', className)}>
      <Defs id={id} />
      <Tray id={id} />
      <Cover id={id} top={top} h={372} />
      {/* Бант с печатью «Г». */}
      <g transform={`translate(200 ${knotY})`}>
        <ellipse cx="-36" cy="-8" rx="38" ry="15" transform="rotate(-22 -36 -8)" fill="none" stroke={`url(#${id}gold)`} strokeWidth="9" />
        <ellipse cx="36" cy="-8" rx="38" ry="15" transform="rotate(22 36 -8)" fill="none" stroke={`url(#${id}gold)`} strokeWidth="9" />
        <path d="M-6 6q-18 40-34 76M6 6q18 40 36 72" stroke={`url(#${id}gold)`} strokeWidth="10" fill="none" strokeLinecap="square" />
        <circle r="15" fill="#b8924f" stroke="#e8cb92" strokeWidth="1.2" />
        <path d="M-5 -7h10M-5 -7v14" stroke="#3a2a14" strokeWidth="1.8" fill="none" />
      </g>
    </svg>
  )
}

export function BoxOpen({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 400 800" className={clsx('h-full w-full overflow-visible', className)}>
      <Defs id={id} />
      <Tray id={id} />
      {/* Торт: цилиндр, глянцевый верх, подтёки ганаша. */}
      <path d="M92 540v206a108 18 0 0 0 216 0V540Z" fill={`url(#${id}choc)`} />
      <path
        d="M92 540v34q8 10 14 0v-12q8 30 18 2 10-8 16 26 6 6 12-18 14 14 26 6 10 34 20 2 12-10 22 4 10 20 20-4 14 10 26 0 8 22 18-8 10 6 16-10V540Z"
        fill="#2a130a"
      />
      <path d="M93 542v204M307 542v204" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" />
      <ellipse cx="200" cy="540" rx="108" ry="18" fill="#321a10" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
      <ellipse cx="172" cy="536" rx="46" ry="5" fill="rgba(255,255,255,0.22)" />
      <ellipse cx="206" cy="528" rx="26" ry="9" fill="#4a2616" />
      <ellipse cx="200" cy="524" rx="12" ry="2.5" fill="rgba(255,255,255,0.35)" />
      <path d="M226 516l9 3-4 6-8-2Z" fill="#e8cb92" />
      {/* Крышка приподнята и слегка наклонена, лента развязана. */}
      <g transform="rotate(-7 200 300)">
        <Cover id={id} top={110} h={360} open />
      </g>
      <path d="M300 344q30 90 6 170-20 70 18 150" stroke={`url(#${id}gold)`} strokeWidth="11" fill="none" />
      <path d="M284 350q-20 110 10 190" stroke={`url(#${id}gold)`} strokeWidth="9" fill="none" opacity="0.85" />
    </svg>
  )
}
