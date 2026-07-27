# Рішення вправ L05-05

Відкривайте після власної спроби sequence/atlas/UE. Debug numbers потрібні лише для validation copy, а не для фінального asset.

## EX-L05-05-A — Energy ring flipbook

### Повна побудова

Контракт: 16 frames, `4×4`, cell 256, atlas 1024, row-major, padding 8 px, pivot `(128,128)`.

План frames:

| Frames | Radius | Thickness | Opacity core | Breakup |
|---|---:|---:|---:|---:|
| F000–F002 | 8→18% | 30→34 px | 100→90% | 0% |
| F003–F006 | 25→48% | 32→22 px | 85→60% | 0→8% |
| F007–F010 | 56→74% | 20→13 px | 55→32% | 10→25% |
| F011–F013 | 80→90% | 11→7 px | 26→12% | 30→50% |
| F014–F015 | 94→96% | 6→5 px | 6→0% | 65→85% |

1. Source 256 із guides у 8/128/248.
2. Побудуй ring із двох ellipses як Shape Layers; pivot зафіксовано.
3. Дублюй state source F000–F015, застосуй цілі з таблиці.
4. F000–F002 anticipation: thickness зростає до швидкого розширення radius.
5. Від F008: noise з L05-02 на transparency mask, що поступово посилюється.
6. Glow RGB виходить максимум на 5 px за structural ring; alpha лишається всередині safe area.
7. Експортуй точні файли від `F_000.png` до `F_015.png`; повторно відкрий 0/8/15.
8. Склади rows:

```text
R0: F000 F001 F002 F003
R1: F004 F005 F006 F007
R2: F008 F009 F010 F011
R3: F012 F013 F014 F015
```

9. Позиції top-left розміщених layers кратні 256.
10. Експортуй atlas; в UE `sRGB=Off`; протестуй цілі значення Frame 0–15.

### Чому це працює

Anticipation надає motion авторського відчуття; radius/thickness/opacity/breakup не змінюються лінійно разом. Фіксований pivot запобігає jitter. Внутрішній padding захищає boundaries cells.

### Допустимі альтернативи

- Atlas 8×2 з оновленими Columns/Rows і тією самою загальною кількістю frames.
- Atlas лише з R, де alpha дублює R, якщо це підтримує тест resource/format.
- A slight non-monotonic thickness pulse, якщо radius remains monotonic and timing is intentional.

### Типові неправильні рішення

- Лише рівномірні scale й opacity.
- Filenames F_1, F_2, F_10 сортуються лексично.
- Layers розміщуються на око, спричиняючи registration errors в один pixel.
- Glow перетинає safe guide 8 px.
- Orientation row atlas припускається без debug-тесту.

### Перевірка

1. Наклади всі pivots: без drift центра.
2. Порядок contact sheet — row-major.
3. Frames 0,3,4,6,15 в UE відповідають source.
4. Scrub 0→15: без зворотного кроку radius.
5. Тест distance/mip: без неприйнятної arc сусідньої cell.
6. Halo board для first/middle/last.
7. Resource size і першу failing distance записано.

### Performance

Raw reference 1024 RGBA8 становить `4.00 MiB`, а з повним mip chain — приблизно `5.33 MiB` до platform compression. Reference лише з R становить `1.00/1.33 MiB`. Atlas використовує один lookup, але фінальна translucent card усе одно сплачує overdraw у межах screen bounds.

## EX-L05-05-B — Asymmetric smear/smoke flipbook

### Повна побудова

1. Обери motion vector `(right, slightly up)` і guide pivot `(128,128)`.
2. Створи key poses:
   - F000: compact oval `70×52`, center `(120,132)`;
   - F005: warped lobe `150×82`, center `(136,125)`, short tail;
   - F010: `210×108`, center `(150,117)`, two negative pockets;
   - F015: fragmented `224×126`, center `(158,112)`, low alpha.
3. Створи in-betweens вручну або інтерполюй Transform, потім виправ silhouette; shift mass на frame ≤6 px.
4. Warp tail зростає з часом; одна negative pocket з’являється у F006, друга у F009, третя у F012.
5. Велика mass лишається зв’язаною до F011; після цього breakup може розділяти islands.
6. Розклад Opacity: `100%` F000–F003, `90→55%` F004–F010, `45→0%` F011–F015.
7. Зберігай усі RGB/alpha всередині padding cell 8 px.
8. Експортуй zero-padded sequence і atlas 4×4.
9. Numbers у debug copy підтверджують порядок; у фінальній copy numbers прибрано.
10. Manual viewer UE: перевір цілі frames, потім анімуй за допомогою stepped/continuous external driver, якщо він доступний.

### Чому це працює

Key poses задають узгоджений напрямок і розвиток внутрішніх voids. Обмежений рух center of mass створює travel без втрати registration. Shape, pockets і fade змінюються на різних фазах, тому motion не зводиться лише до scale.

### Допустимі альтернативи

- Smoke puff із майже фіксованим центром, але rotational evolution lobes.
- Directional smear, де alpha слідує за hard core, а RGB несе довший trail.
- 8 key poses duplicated/interpolated to 16, якщо every in-between passes silhouette review.

### Типові неправильні рішення

- Випадковий незалежний noise на кожному frame: boiling incoherence.
- Shift >15 px на кожному frame: teleport/jitter.
- Кожен frame створено через uniform scale.
- Breakup починається з F001 і не дає зчитати mass.
- Padding cell перевірено лише у F000.

### Перевірка

1. Onion-skin/contact overlay: motion vector узгоджений.
2. Після паузи прибери labels і randomize order; під час власного повторного blind sort правильно впорядкуй щонайменше 12/16. Інша людина може optional повторити тест.
3. Жодна shape не перетинає safe guides.
4. Sequence лише з A згасає без раптового білого frame.
5. Contact sheet цілих frames в UE відповідає source.
6. На gameplay distance/lower mip немає неприйнятного забруднення сусідньою cell.
7. Відхилення pivot і center of mass задокументовано.

### Performance

Reference memory atlas така сама, як у вправі A. Asymmetric smoke часто використовує більшу частину кожної cell, зменшуючи невикористані texels, але збільшуючи видимий translucent coverage. Оптимізуй фінальні bounds renderer, overlap і lifetime; не оцінюй лише розмір файла atlas. Якщо lower mips забруднюють cells, порівняй більший padding, меншу кількість більших cells, іншу стратегію mip або окремі frames на основі вимірювань цільової платформи.
