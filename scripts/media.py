"""Сжимает media-src/*.png в public/media/<имя>-<ширина>.webp и пишет src/data/media-manifest.json.

    python scripts/media.py      (или npm run media)

Сайт берёт список файлов из манифеста, поэтому не запрашивает несуществующие картинки,
а 4k-исходники не попадают в сборку.
"""

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'media-src'
OUT = ROOT / 'public' / 'media'
MANIFEST = ROOT / 'src' / 'data' / 'media-manifest.json'
WIDTHS = [640, 1280, 1920]
RAW = {'praline-src', 'cacao-src', 'footer-stones-src'}  # сырьё, на сайт не идёт


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for f in sorted(SRC.glob('*.png')):
        name = f.stem
        if name in RAW:
            continue
        im = Image.open(f)
        alpha = 'A' in im.getbands() and im.getchannel('A').getextrema()[0] < 255
        im = im.convert('RGBA' if alpha else 'RGB')
        widths = sorted({w for w in WIDTHS if w < im.width} | {min(im.width, WIDTHS[-1])})
        for w in widths:
            frame = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            frame.save(OUT / f'{name}-{w}.webp', 'WEBP', quality=88 if alpha else 82, method=6)
        manifest[name] = {'w': im.width, 'h': im.height, 'alpha': alpha, 'widths': widths}
        print(f'{name:18} {im.width}x{im.height} {"alpha " if alpha else ""}-> {widths}')

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'manifest: {len(manifest)} files')

    # Превью для соцсетей: открытая сцена, 1200×630.
    hero = SRC / 'hero-open.png'
    if hero.exists():
        im = Image.open(hero).convert('RGB')
        h = round(im.width * 630 / 1200)
        top = max(0, (im.height - h) // 2)
        im.crop((0, top, im.width, top + h)).resize((1200, 630), Image.LANCZOS).save(
            ROOT / 'public' / 'og.jpg', 'JPEG', quality=86, optimize=True
        )
        print('og.jpg 1200x630')


if __name__ == '__main__':
    main()
