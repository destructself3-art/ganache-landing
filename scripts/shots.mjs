// Скриншоты для проверки вёрстки: установленный Edge + puppeteer-core, браузер не скачивается.
//   node scripts/shots.mjs <папка>   (дев-сервер должен работать на :5173)
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = process.env.BASE ?? 'http://localhost:5173'
const OUT = process.argv[2] ?? 'shots'
const SECTIONS = {
  hero: '#top',
  vitrina: '#vitrina',
  numbers: '#vitrina + section',
  night: '#night',
  sostav: '#sostav',
  menu: '#menu',
  order: '#order',
  faq: '#faq',
  footer: 'footer',
}
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 820, height: 1180, isMobile: true, hasTouch: true },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function settle(page) {
  await page.evaluate(async () => {
    const visible = [...document.images].filter((img) => {
      const r = img.getBoundingClientRect()
      return r.bottom > 0 && r.top < innerHeight
    })
    await Promise.all(
      visible.map((img) =>
        img.complete ? null : new Promise((done) => { img.onload = img.onerror = done; setTimeout(done, 4000) }),
      ),
    )
  })
  await sleep(300)
}

function watch(page, log) {
  page.on('pageerror', (e) => log.push(`pageerror: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && log.push(`console: ${m.text()}`))
  page.on('response', (r) => r.status() >= 400 && log.push(`${r.status()} ${r.url()}`))
}

await mkdir(OUT, { recursive: true })
// CDP_URL=http://127.0.0.1:9333 — подключиться к уже запущенному headless Edge
// (msedge --headless=new --remote-debugging-port=9333 --user-data-dir=...). На этой машине
// puppeteer.launch() не держит процесс Edge: тот сразу выходит с кодом 0.
const browser = process.env.CDP_URL
  ? await puppeteer.connect({ browserURL: process.env.CDP_URL, defaultViewport: null })
  : await puppeteer.launch({
      executablePath: EDGE,
      headless: true,
      userDataDir: process.env.EDGE_PROFILE ?? `${OUT}/.edge-profile`,
      args: ['--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions'],
    })
const problems = []
const report = []

try {
  // Статичные кадры каждой секции на трёх ширинах (?shot — без прелоадера и анимаций).
  for (const [vp, viewport] of Object.entries(VIEWPORTS)) {
    const page = await browser.newPage()
    watch(page, problems)
    await page.setViewport(viewport)
    await page.goto(`${BASE}/?shot`, { waitUntil: 'networkidle0' })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    if (overflow > 0) problems.push(`${vp}: горизонтальное переполнение ${overflow}px`)
    for (const [name, selector] of Object.entries(SECTIONS)) {
      await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView(), selector)
      await settle(page)
      await page.screenshot({ path: `${OUT}/${vp}-${name}.png` })
    }
    // Самый низ страницы: слово «ГАНАШ» в камнях (scrollIntoView футера его не показывает).
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await settle(page)
    await page.screenshot({ path: `${OUT}/${vp}-footer-end.png` })
    // Карточки меню целиком + состояние их картинок (на первом прогоне кадр меню был пустым).
    await page.evaluate(() => document.querySelector('#menu article')?.scrollIntoView({ block: 'center' }))
    await settle(page)
    await page.screenshot({ path: `${OUT}/${vp}-menu-cards.png` })
    const menuImgs = await page.evaluate(() =>
      [...document.querySelectorAll('#menu img')].map(
        (img) => `${img.currentSrc.split('/').pop() || '(no src)'} complete=${img.complete} w=${img.naturalWidth}`,
      ),
    )
    report.push(`${vp} menu: ${menuImgs.join(' | ') || 'нет <img> в #menu'}`)
    await page.close()
  }

  // Прелоадер по таймингу: кадры от начала загрузки страницы.
  const pre = await browser.newPage()
  watch(pre, problems)
  await pre.setViewport(VIEWPORTS.desktop)
  await pre.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  let elapsed = 0
  for (const at of [250, 1300, 2000, 2600, 3400]) {
    await sleep(at - elapsed)
    elapsed = at
    await pre.screenshot({ path: `${OUT}/live-preloader-${at}.png` })
  }
  await pre.close()

  // Живой десктоп: раскрытие коробки по наведению, стопка карточек.
  const page = await browser.newPage()
  watch(page, problems)
  await page.setViewport(VIEWPORTS.desktop)
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
  await sleep(4100)
  await page.screenshot({ path: `${OUT}/live-hero-closed.png` })
  await page.mouse.move(720, 470, { steps: 10 })
  await sleep(450)
  await page.screenshot({ path: `${OUT}/live-hero-revealing.png` })
  await sleep(1600)
  await page.screenshot({ path: `${OUT}/live-hero-open.png` })
  await page.mouse.move(1300, 200, { steps: 6 })
  const sostavTop = await page.evaluate(() => document.querySelector('#sostav').getBoundingClientRect().top + scrollY)
  for (const [i, dy] of [900, 1500].entries()) {
    await page.evaluate((y) => window.scrollTo(0, y), sostavTop + dy)
    await sleep(1400)
    await page.screenshot({ path: `${OUT}/live-stack-${i + 1}.png` })
  }
  await page.close()
} finally {
  await browser.close()
}

console.log([...report, problems.length ? problems.join('\n') : 'no console errors, no 4xx/5xx, no horizontal overflow'].join('\n'))
