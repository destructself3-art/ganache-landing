# ГАНАШ — визуал: что есть и как перегенерировать

Картинки сгенерировал пользователь (12.09.2026, GPT Image) и разложил по папкам `1/`, `БЛОКИ/`, `ПЛАШКИ/`, `Меню, 4 торта · 45 · 2k/`. Дальше конвейер:

```
python scripts/prepare_media.py intake composite footer cutouts   # или npm run media:prepare
python scripts/media.py                                           # или npm run media
```

1. `intake` копирует исходники в `media-src/` под каноничными именами (папки пользователя только читаются).
2. `composite` собирает открытую сцену 16:9: в центр `hero-closed` вклеивается `hero-tablet`, так что подносы совпадают.
3. `footer` склеивает полосу камней из боковых камней `hero-closed`.
4. `cutouts` делает вырезки через rembg (`isnet-general-use`): `hero-*-cut`, `praline`, `cacao`.
5. `media.py` пишет `public/media/<имя>-<ширина>.webp`, `src/data/media-manifest.json` и `public/og.jpg`.

Диагностика (сравнение подносов, вырезки на шахматке) лежит в `media-src/_diag/`.

## Где что на сайте

| Имя | Исходник | Где |
|---|---|---|
| `hero-closed` / `hero-closed-cut` | 1/…02_15_09 | Первый экран, закрытая коробка |
| `hero-open` / `hero-open-cut` | собран из 02_15_09 + 02_15_23 | Первый экран, раскрытие по наведению |
| `hero-tablet` / `-cut`, `hero-mobile` / `-cut` | 1/…02_15_23, 02_15_16 | Первый экран на планшете и телефоне |
| `boutique` | БЛОКИ/…02_23_41 | 01 Витрина |
| `lab` | БЛОКИ/…02_23_49 | Цифры |
| `card-pour` | ПЛАШКИ/…02_19_54 | Плашка на первом экране, 02 Ночью |
| `stack-night` / `stack-glaze` / `stack-notebook` | БЛОКИ/…02_27_01 / 02_27_05 / 02_27_46 | 03 Состав |
| `praline`, `cacao` | ПЛАШКИ/…02_20_07, 02_20_11 | Плашка «Торт к утру», акцент в «Составе» |
| `menu-signature` / `-praline` / `-cherry` / `-yuzu` | Меню/…02_32_04 / _15 / _12 / _09 | 04 Меню |
| `footer-stones` | собрана из `hero-closed` | Футер |

Тексты сверены с кадром тетради: какао 70%, сливки 35%, 45° / 32° / 28°, кольца Ø16.

## По желанию: сделать идеально

Две картинки собраны из других кадров. Если захочется снять их отдельно — промпты ниже. Файл кладём в `media-src/` под этим именем. Для открытой сцены после этого не запускаем `composite`, а сразу `cutouts` и `media.py`.

**`hero-open.png` · 16:9.** Прикрепить `media-src/hero-closed.png` как референс:
```
Use the attached image as the exact base. Keep camera, framing, background gradient, stones, lighting, the pedestal and the base tray identical — same position, same scale.
Change only one thing: the hatbox is open. The tall matte-black cylindrical lid floats about 20 cm above, slightly tilted, as if just lifted; the gold satin ribbon hangs loose from it. On the base tray stands a tall round dark-chocolate ganache cake with a mirror-gloss top and a slow ganache drip, crowned with a quenelle of whipped ganache and a flake of gold leaf.
Same neutral-white rim light. Natural contact shadows only. No text.
```

**`footer-stones.png` · 21:9.**
```
A pure black frame. Along the bottom 45% of the frame: a low uneven ridge of dark volcanic basalt stones and pebbles, sharp and detailed, lit from behind by a warm amber-copper glow rising from below the horizon line; the glow fades upward into pure black by the middle of the frame. The upper half is completely black and empty. No objects, no text. Photorealistic.
```

Полный набор исходных промптов (17 штук) лежит в чате проекта от 12.09.2026. Стиль всей серии: ultra-premium food photography, глубокий чёрный, янтарно-медное свечение, нейтральный белый контровой свет, базальтовые камни.
