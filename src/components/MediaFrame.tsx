import { useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { ImageIcon } from 'lucide-react'
import { media } from '../data/media'

type Props = {
  /** Имя из манифеста медиа (scripts/media.py). */
  name?: string
  /** Прямой адрес — для видео или файлов вне манифеста. */
  src?: string
  alt: string
  kind?: 'image' | 'video'
  sizes?: string
  /** Обёртка. */
  className?: string
  /** Сам img/video. */
  mediaClassName?: string
  /** Своя заглушка вместо стандартной. */
  fallback?: ReactNode
  eager?: boolean
}

/**
 * Каждая картинка сайта идёт через эту обёртку. Нет файла в манифесте или он не
 * загрузился — показываем стильную заглушку с ожидаемым именем файла.
 */
export function MediaFrame({ name, src, alt, kind = 'image', sizes = '100vw', className, mediaClassName, fallback, eager }: Props) {
  const m = name ? media(name) : undefined
  const url = m?.src ?? src
  const [failed, setFailed] = useState(!url)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setFailed(!url)
    // Ошибка могла случиться раньше, чем React повесил обработчик.
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [url])

  const cls = clsx('h-full w-full object-cover', mediaClassName)

  return (
    <div className={clsx('relative overflow-hidden', className)}>
      {!failed && kind === 'image' && (
        <img
          ref={imgRef}
          src={url}
          srcSet={m?.srcSet}
          sizes={m ? sizes : undefined}
          width={m?.w}
          height={m?.h}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className={cls}
        />
      )}
      {!failed && kind === 'video' && (
        <video src={url} autoPlay muted loop playsInline aria-label={alt} onError={() => setFailed(true)} className={cls} />
      )}
      {failed && (fallback ?? <MediaPlaceholder file={name ? `${name}.webp` : src?.split('/').pop()} alt={alt} />)}
    </div>
  )
}

export function MediaPlaceholder({ file, alt }: { file?: string; alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0908] text-mute"
      style={{
        backgroundImage:
          'radial-gradient(60% 60% at 50% 60%, rgba(217,130,43,0.16), transparent 70%), repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 14px)',
      }}
    >
      <ImageIcon className="h-5 w-5 text-gold/70" strokeWidth={1.25} />
      {file && <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em]">media/{file}</span>}
    </div>
  )
}
