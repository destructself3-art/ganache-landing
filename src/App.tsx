import { useEffect, useState } from 'react'
import { Cursor } from './components/Cursor'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Preloader } from './components/Preloader'
import { getLenis, scrollToHash, useLenis } from './hooks/useLenis'
import { SHOT, useFinePointer, useReducedMotion } from './hooks/usePrefs'
import { Faq } from './sections/Faq'
import { Footer } from './sections/Footer'
import { Menu } from './sections/Menu'
import { Night } from './sections/Night'
import { Numbers } from './sections/Numbers'
import { Order } from './sections/Order'
import { Sostav } from './sections/Sostav'
import { Vitrina } from './sections/Vitrina'

export default function App() {
  const [ready, setReady] = useState(SHOT)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  useLenis(!reduced)

  // Пока идёт прелоадер, страница не скроллится.
  useEffect(() => {
    document.documentElement.style.overflow = ready ? '' : 'hidden'
    const lenis = getLenis()
    if (ready) lenis?.start()
    else lenis?.stop()
  }, [ready])

  // Прямая ссылка на раздел (/#menu): секции рендерит React, поэтому браузер сам не доскролливает.
  // Несколько попыток — поздно догружённые картинки и шрифты сдвигают высоту документа.
  useEffect(() => {
    const hash = window.location.hash
    if (!ready || hash.length < 2) return
    const timers = [0, 300, 900].map((ms) => window.setTimeout(() => scrollToHash(hash), ms))
    return () => timers.forEach(window.clearTimeout)
  }, [ready])

  return (
    <>
      {!SHOT && <Preloader onDone={() => setReady(true)} />}
      {fine && !reduced && <Cursor />}
      <Header ready={ready} />
      <main>
        <Hero ready={ready} />
        <Vitrina />
        <Numbers />
        <Night />
        <Sostav />
        <Menu />
        <Order />
        <Faq />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  )
}
