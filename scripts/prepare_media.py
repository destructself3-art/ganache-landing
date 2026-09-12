"""Готовит медиа «Ганаш» из картинок, которые сгенерировал пользователь.

    python scripts/prepare_media.py intake     # копирует исходники из папок пользователя в media-src/
    python scripts/prepare_media.py composite  # открытая сцена 16:9 из hero-closed + hero-tablet
    python scripts/prepare_media.py footer     # полоса камней для футера
    python scripts/prepare_media.py cutouts    # вырезки (нужен rembg)

Папки пользователя не трогаем — только читаем.
"""

import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'media-src'
DIAG = ROOT / 'media-src' / '_diag'

USER_DIRS = ['1', 'БЛОКИ', 'ПЛАШКИ', 'Меню, 4 торта · 45 · 2k']
# Подстрока из имени файла Codex → каноничное имя. Соответствие проверено глазами.
INTAKE = {
    '02_15_09': 'hero-closed',
    '02_15_16': 'hero-mobile',
    '02_15_23': 'hero-tablet',
    '02_23_41': 'boutique',
    '02_23_49': 'lab',
    '02_27_01': 'stack-night',
    '02_27_05': 'stack-glaze',
    '02_27_46': 'stack-notebook',
    '02_19_54': 'card-pour',
    '02_20_07': 'praline-src',
    '02_20_11': 'cacao-src',
    '02_32_04': 'menu-signature',
    '02_32_09': 'menu-yuzu',
    '02_32_12': 'menu-cherry',
    '02_32_15': 'menu-praline',
}
# Отдельные файлы в корне проекта: у «ФУТЕР» нет расширения, поэтому он не попадает в glob по *.png.
INTAKE_FILES = {'ФУТЕР': 'footer-stones-src'}

# Открытую сцену 16:9 собираем так, чтобы поднос из hero-tablet лёг ровно на поднос hero-closed.
OPEN = {
    # Замерено по диагностике open-compare.png.
    'tray_closed': (605, 1065, 788),  # x-лево, x-право, y-низ подноса на hero-closed
    'tray_tablet': (337, 755, 1126),  # то же на hero-tablet
    'feather': 0.2,  # доля ширины вклейки на растушёвку каждого края
}


def smooth_ramp(n: int, feather: int, both: bool = True) -> list[int]:
    out = []
    for i in range(n):
        d = min(i, n - 1 - i) if both else i
        t = min(1.0, d / max(1, feather))
        out.append(round(255 * t * t * (3 - 2 * t)))
    return out


def h_mask(w: int, h: int, feather: int) -> Image.Image:
    row = Image.new('L', (w, 1))
    row.putdata(smooth_ramp(w, feather))
    return row.resize((w, h))


def left_mask(w: int, h: int, feather: int) -> Image.Image:
    row = Image.new('L', (w, 1))
    row.putdata(smooth_ramp(w, feather, both=False))
    return row.resize((w, h))


def open_placement() -> tuple[float, int, int]:
    cl, cr, cb = OPEN['tray_closed']
    tl, tr, tb = OPEN['tray_tablet']
    s = (cr - cl) / (tr - tl)
    x = round((cl + cr) / 2 - (tl + tr) / 2 * s)
    y = round(cb - tb * s)
    return s, x, y


def intake() -> None:
    SRC.mkdir(exist_ok=True)
    found = set()
    for d in USER_DIRS:
        for f in sorted((ROOT / d).glob('*.png')):
            for key, name in INTAKE.items():
                if key in f.name:
                    Image.open(f).convert('RGB').save(SRC / f'{name}.png')
                    found.add(key)
                    print(f'intake  {d}/{key} -> {name}.png')
    for src, name in INTAKE_FILES.items():
        path = ROOT / src
        if path.exists():
            Image.open(path).convert('RGB').save(SRC / f'{name}.png')
            print(f'intake  {src} -> {name}.png')

    missing = set(INTAKE) - found
    if missing:
        sys.exit(f'не найдены исходники: {sorted(missing)}')


def composite() -> None:
    closed = Image.open(SRC / 'hero-closed.png').convert('RGB')
    tablet = Image.open(SRC / 'hero-tablet.png').convert('RGB')
    s, x, y = open_placement()
    t = tablet.resize((round(tablet.width * s), round(tablet.height * s)), Image.LANCZOS)
    mask = h_mask(t.width, t.height, round(t.width * OPEN['feather']))
    out = closed.copy()
    out.paste(t, (x, y), mask)
    out.save(SRC / 'hero-open.png')
    print(f'composite  scale={s:.4f} x={x} y={y} -> hero-open.png {out.size}')

    DIAG.mkdir(exist_ok=True)
    box = (480, 120, 1190, 900)
    a, b = closed.crop(box), out.crop(box)
    pair = Image.new('RGB', (a.width * 2 + 10, a.height), (255, 0, 255))
    pair.paste(a, (0, 0))
    pair.paste(b, (a.width + 10, 0))
    pair.save(DIAG / 'open-compare.png')
    out.resize((out.width // 2, out.height // 2), Image.LANCZOS).save(DIAG / 'open-full.png')


def footer() -> None:
    """Полоса камней для футера: настоящий кадр, если он есть, иначе склейка из первого экрана."""
    photo = SRC / 'footer-stones-src.png'
    if photo.exists():
        footer_from_photo(photo)
    else:
        footer_from_hero()


# Настоящий кадр (1536×1024): сверху чистый чёрный, свечение и камни — снизу.
# Верх режем и уводим в прозрачность, иначе он закроет слово «ГАНАШ», которое лежит под полосой.
FOOTER_PHOTO = {'crop_top': 430, 'fade': 300}


def footer_from_photo(path: Path) -> None:
    im = Image.open(path).convert('RGB').crop((0, FOOTER_PHOTO['crop_top'], *Image.open(path).size))
    fade = FOOTER_PHOTO['fade']
    col = Image.new('L', (1, im.height))
    col.putdata([round(255 * min(1.0, i / fade) ** 1.6) for i in range(im.height)])
    im.putalpha(col.resize((im.width, im.height)))
    im.save(SRC / 'footer-stones.png')
    print(f'footer  фото -> footer-stones.png {im.size}')


def footer_from_hero() -> None:
    closed = Image.open(SRC / 'hero-closed.png').convert('RGB')
    top = 700
    h = closed.height - top
    left = closed.crop((0, top, 500, closed.height))
    right = closed.crop((1170, top, closed.width, closed.height))
    parts = [left, right, left.transpose(Image.FLIP_LEFT_RIGHT), right.transpose(Image.FLIP_LEFT_RIGHT)]
    overlap = 140
    width = sum(p.width for p in parts) - overlap * (len(parts) - 1)
    strip = Image.new('RGB', (width, h))
    x = 0
    for i, p in enumerate(parts):
        strip.paste(p, (x, 0), None if i == 0 else left_mask(p.width, h, overlap))
        x += p.width - overlap
    # Верх полосы уходит в прозрачность — над камнями будет слово «ГАНАШ» и CSS-свечение.
    col = Image.new('L', (1, h))
    col.putdata([round(255 * min(1.0, i / 110) ** 1.4) for i in range(h)])
    strip.putalpha(col.resize((width, h)))
    strip = strip.resize((round(width * 1.4), round(h * 1.4)), Image.LANCZOS)
    strip.save(SRC / 'footer-stones.png')
    print(f'footer  -> footer-stones.png {strip.size}')


def cutouts() -> None:
    from rembg import new_session, remove  # тяжёлый импорт — только здесь

    session = new_session('isnet-general-use')

    def cut(src: Image.Image) -> Image.Image:
        rgba = remove(src, session=session, post_process_mask=True)
        alpha = rgba.getchannel('A').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
        rgba.putalpha(alpha)
        return rgba

    for name in ['hero-closed', 'hero-mobile', 'hero-tablet']:
        img = Image.open(SRC / f'{name}.png').convert('RGB')
        cut(img).save(SRC / f'{name}-cut.png')
        print(f'cutout  {name}-cut.png')

    # Вырезка открытой сцены: режем чистый hero-tablet и переносим тем же масштабом и сдвигом.
    s, x, y = open_placement()
    tablet_cut = Image.open(SRC / 'hero-tablet-cut.png')
    t = tablet_cut.resize((round(tablet_cut.width * s), round(tablet_cut.height * s)), Image.LANCZOS)
    closed = Image.open(SRC / 'hero-closed.png')
    canvas = Image.new('RGBA', closed.size, (0, 0, 0, 0))
    canvas.paste(t, (x, y))  # холст пустой — копируем RGBA как есть, отрицательный сдвиг просто обрезается
    canvas.save(SRC / 'hero-open-cut.png')
    print('cutout  hero-open-cut.png (из hero-tablet-cut)')

    for name in ['praline', 'cacao']:
        img = Image.open(SRC / f'{name}-src.png').convert('RGB')
        cut(img).save(SRC / f'{name}.png')
        print(f'cutout  {name}.png')

    # Превью на шахматке и на янтаре — для проверки глазами.
    DIAG.mkdir(exist_ok=True)
    for f in ['hero-closed-cut', 'hero-open-cut', 'hero-mobile-cut', 'praline', 'cacao']:
        im = Image.open(SRC / f'{f}.png').convert('RGBA')
        im.thumbnail((900, 900))
        bg = Image.new('RGBA', im.size, (217, 130, 43, 255))
        checker = Image.new('RGBA', im.size, (255, 255, 255, 255))
        for cy in range(0, im.height, 24):
            for cx in range(0, im.width, 24):
                if (cx // 24 + cy // 24) % 2:
                    checker.paste((200, 200, 200, 255), (cx, cy, cx + 24, cy + 24))
        pair = Image.new('RGBA', (im.width * 2 + 10, im.height), (255, 0, 255, 255))
        pair.paste(Image.alpha_composite(checker, im), (0, 0))
        pair.paste(Image.alpha_composite(bg, im), (im.width + 10, 0))
        pair.convert('RGB').save(DIAG / f'cut-{f}.png')


if __name__ == '__main__':
    steps = {'intake': intake, 'composite': composite, 'footer': footer, 'cutouts': cutouts}
    for arg in sys.argv[1:] or ['intake', 'composite', 'footer']:
        steps[arg]()
