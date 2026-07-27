# Ключ assessment блока B05

Цей файл призначений для самоперевірки й самостійного оцінювання після завершення роботи в межах таймбоксу. Він не є покроковим шаблоном виконання assessment.

## Підсумок оцінювання

| Категорія | Бали | Мінімум |
|---|---:|---:|
| A — Теорія | 20 | 12 |
| B — Практика | 60 | 36 |
| C — Troubleshooting/performance | 10 | 6 |
| D — Самоперевірка/handoff | 10 | 6 |
| **Разом** | **100** | **80 загалом** |

Автоматичні blockers з assessment застосовуються до числового бала.

## Категорія A — Очікувані відповіді, 20 балів

По 2 бали: 2 — точна відповідь; 1 — напрямок правильний, але бракує критичної відмінності або формули; 0 — неправильно або відсутнє.

1. **Grayscale vs alpha:** grayscale є intensity/data value у color channel; alpha є окремим coverage/opacity channel. Вони можуть, але не мусять збігатися.
2. **Offset:** half-size Offset переносить opposing borders у central cross; Wrap Around повертає pixels із протилежного боку й зберігає periodic boundary.
3. **Seam vs signature:** seam — discontinuity на boundary; signature — видимий repeated hero mark навіть при безперервній boundary.
4. **sRGB Off:** gamma/color decoding змінює numeric mid-values; masks/packed data мають читатися linear.
5. **Frequency:** велика mass/silhouette, середні lobes/rhythm, дрібний breakup/detail.
6. **Distortion neutral/decode:** neutral ≈0.5 або 128/255; full signed decode `(encoded−0.5)×2`. Допускається `RG−0.5` з calibrated Strength, якщо contract це каже.
7. **Сумісність packing:** resolution, addressing, mip policy, gamma/linearity, tolerance/format compression, важливість streaming/lifecycle.
8. **Frame 11:** row `floor(11/4)=2`, column `11−2×4=3`.
9. **Bleed vs halo:** bleed sample-ить neighboring atlas cell; halo виникає через RGB/alpha edge mismatch/padding.
10. **1024 RGBA8:** `4,194,304 bytes = 4.00 MiB` raw без mips; приблизно `5.33 MiB` із повним mip chain до platform compression.

## Категорія B — Рубрика практичної роботи, 60 балів

### B1 — Source organization і grayscale/alpha, 8

| Доказ | Бали |
|---|---:|
| Іменовані логічні groups; без беззмістовних duplicate names | 1 |
| Masks і редаговані Levels/Curves | 2 |
| Tapered читабельний slash | 2 |
| Контракт RGB/A видно й пояснено | 2 |
| Padding 8 px + повторно відкриті PNG/TGA | 1 |

Нуль за контракт RGB/A, якщо надано лише composite screenshot.

### B2 — Seamless noise/smoke, 10

| Доказ | Бали |
|---|---:|
| Докази source Offset/repair для обох | 2 |
| Boards 3×3 без очевидного border cross | 3 |
| Noise придатний за Tiling 1/4/8 | 1 |
| Ієрархія smoke large/medium/small | 2 |
| Немає домінантного повторюваного hero blob в overview | 1 |
| Докази Wrap/linear import в UE | 1 |

Відніміть 2, якщо seam приховано лише crop. Відніміть 1, якщо border seamless, але signature виражена.

### B3 — Combat texture sheet, 10

| Доказ | Бали |
|---|---:|
| Читабельність motion/taper slash | 2 |
| Домінантна axis/hierarchy spark | 2 |
| Оригінальне magic circle з ієрархією spacing | 3 |
| Grayscale thumbnails 64/128 px | 1 |
| Перевірка alpha-only/halo | 1 |
| Походження original/default-tools | 1 |

Завантажений artwork glyph/brush активує автоматичний blocker.

### B4 — Ramp/distortion/packing, 14

| Доказ | Бали |
|---|---:|
| Dimensions ramp, endpoints і призначення / політика sRGB | 2 |
| Neutral distortion, незалежні R/G | 3 |
| Encode/decode задокументовано | 1 |
| Коректне призначення channels R/G/B/A | 4 |
| Докази channels із повторно відкритого export | 1 |
| Докази viewer R/G/B/A в UE | 2 |
| Обґрунтування сумісності | 1 |

Swap або інвертований channel без оновленого контракту: нуль за цей channel. Global drift за neutral: максимум 1/3 балів за distortion.

### B5 — Flipbook, 10

| Доказ | Бали |
|---|---:|
| 16 zero-padded frames, cells 256, atlas 1024 | 2 |
| Коректний порядок row-major | 2 |
| Padding 8 px | 1 |
| Стабільний і задокументований pivot | 1 |
| Узгоджені temporal phases, не лише scale | 2 |
| Перевірка frames/mip/bleed в UE | 2 |

Неправильний порядок обмежує максимум B5 до `5/10`. Порядок, який неможливо перевірити, активує blocker.

### B6 — UE validation, 8

| Доказ | Бали |
|---|---:|
| Повна таблиця import | 2 |
| Captures packed R/G/B/A | 2 |
| Distortion Strength 0 і 0.03 | 1 |
| Frames flipbook 0, 6, 15 | 1 |
| Докази resource-size/mip | 1 |
| Чиста compile або пояснений warning | 1 |

Потребує ручної перевірки в Unreal Engine 5.8. Фактичні labels/defaults UI і reported resource data оцінюйте за доказами встановленого build, а не за запам’ятованими labels.

## Категорія C — Рубрика troubleshooting/performance, 10 балів

### C1 — Repair case, 5

- симптом у контрольованій умові — 1;
- ізольований diagnostic view — 1;
- root cause відповідає доказам — 1;
- цільове виправлення — 1;
- capture після виправлення за тієї самої умови — 1.

Косметичний after-crop без root cause отримує максимум 2.

### C2 — Budget comparison, 5

- Reference 512 R8 ≈0.25 MiB raw, ≈0.33 MiB із mips — 1;
- 512 RGBA8 ≈1.00/1.33 MiB — 1;
- 1024 RGBA8 ≈4.00/5.33 MiB — 1;
- Компроміс sample/memory для packing і застереження щодо платформи — 1;
- Спостереження translucent screen coverage/overdraw — 1.

Розмір PNG/TGA на диску, поданий як GPU memory, отримує нуль за числові бали memory.

## Категорія D — Рубрика самоперевірки/handoff, 10 балів

| Доказ | Бали |
|---|---:|
| Аудит naming/version | 2 |
| Contact sheet організації source | 2 |
| Повний manifest export/channels | 3 |
| Еквіваленти Krita або явне обмеження Photoshop-only | 1 |
| Ledger M/S рівно 14 годин + корисна retrospective | 2 |

Retrospective корисна, коли називає одне збережене рішення, один failed test/root cause і одне покращення для наступного блока.

## Приклади фінального рішення

- `86 загалом`, усі мінімуми, без blocker → G05 пройдено.
- `84 загалом`, C=5 → Ще ні; цільовий retest troubleshooting/performance.
- `92 загалом`, proprietary asset rune → Не пройдено; замінити оригінальним asset і повторити відповідні timed sections.
- `79 загалом`, усі мінімуми → Ще ні; доопрацювати до ≥80.

## Template feedback

```text
Бал: A__/20 + B__/60 + C__/10 + D__/10 = __/100
Мінімальні бали categories: пройдено / не пройдено
Автоматичний blocker: немає / зазначено
Найсильніший доказ:
Найважливіше виправлення:
Потрібне remediation:
Asset і timebox для retest:
Рішення G05: Пройдено / Ще ні
```
