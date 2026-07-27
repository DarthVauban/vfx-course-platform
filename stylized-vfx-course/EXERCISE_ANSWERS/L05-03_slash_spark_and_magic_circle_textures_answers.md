# Рішення вправ L05-03

Solutions є reference, не source art. Відтворіть proportions і contracts власними geometric layers.

## EX-L05-03-A — Kit wind slash

### Повна побудова

Створіть 1024 master із 16 px safe border і три variants.

#### Heavy slash

1. Outer ellipse `850×600`, inner `660×410`, inner shift `+58 X/+12 Y`.
2. Rotation `−22°`; arc occupancy близько 70% width.
3. Taper start/end через mask brush `220 px`; body thickness у center близько `120 px`.
4. Дубль hot core зі scale `84%`, opacity `85%`.
5. Breakup лише trailing outer edge, coverage ≤18%.

#### Quick slash

1. Outer `900×430`, inner `820×340`, shift `+35 X`.
2. Rotation `−14°`; center thickness `62 px`.
3. Leading tip 10 px, trailing tip 4 px.
4. Дві secondary streaks, thickness `8–14 px`, length 35–50% main arc.

#### Circular slash

1. Outer circle diameter `760`, inner `635`, offset `+18 X`.
2. Mask gap `55°`; taper both sides of gap.
3. Brightness lower than quick hot core, щоб kit не мав three identical focal accents.

Спільне:

- RGB = body + ширший glow 20–28 px;
- A = body + core, feather edge 2–4 px;
- Levels `18/0.95/238`;
- експортуй кожен PNG/TGA, повторно відкрий, виконай тест R/A в UE.

### Чому це працює

Variants змінюють curvature, thickness і taper — параметри motion language. Noise лишається secondary, тому kit читається навіть у grayscale thumbnail.

### Допустимі альтернативи

- Vector Pen paths зі strokes/outlines.
- Один 2048 sheet із subsequent cropped exports, якщо source naming і bounds clean.
- A=R для mask-only use; wider glow тоді створюється Material-ом, а contract це зазначає.

### Типові неправильні рішення

- Три duplicates різняться лише rotation.
- Heavy має тоншу line за quick.
- Circular arc closed: читається як ring.
- Завантажений brush slash.
- Glow торкається border або потрапляє в alpha без наміру.

### Перевірка

- Після паузи randomized-label blind thumbnail test: власний повторний sort правильно відрізняє heavy/quick/circular; optional — повторити тест з іншою людиною.
- A-only має clean taper і no accidental gaps.
- 16 px padding підтверджено bounding box.
- Three-background UE captures з однаковими Tint/Intensity.
- Texture bounds і intended card aspect ratios записані.

### Performance

Окремі 1024 RGBA exports можуть коштувати багато пам’яті; після visual approval розгляньте 512, R-only або packing. Не складайте slashes в atlas без оцінки padding/mips і independent streaming needs. Overdraw зменшується tight card bounds, а не лише crop у texture.

## EX-L05-03-B — Elemental circle і sparks

### Повна побудова

1. Document 1024, центр `(512,512)`.
2. Rings:
   - outer radius 360, stroke 14;
   - main radius 285, stroke 8;
   - inner radius 170, stroke 5.
3. Gaps outer mask: кути `15°,105°,195°,285°`, width `18°`.
4. Gaps main: кожні 45°, width `8°`, але пропусти accents на 90° і 270°, щоб порушити рівномірність.
5. Оригінальний motif: два вкладені triangles плюс зміщений vertical tick; без font/glyph. Size `68×92`.
6. Дублюй motif під 8 кутами, крок 45°; чергуй scale `100%/72%`.
7. Focal diamond `96×96` із inner cut `54×54`.
8. Element identity: три flame-like teardrops, побудовані з ellipses/warp під 0°, 120°, 240°.
9. Group RGB додає glow ring: розширені strokes, Gaussian/soft mask `18 px`, opacity 28%.
10. Alpha використовує structural lines із feather `2 px`; glow виключено.
11. Набір sparks:
    - кут primary ray відповідає motif 15°;
    - lengths 340/230/120/96 px;
    - secondary rays під `+90°`, `−35°`, `+145°`;
    - контракт glow/alpha такий самий, як для circle.
12. Thumbnail у 128; прибери будь-який accent, що зливається.
13. Export, повторне відкриття, viewer UE.

### Чому це працює

Three ring scales дають hierarchy, alternating motifs прибирають sterile repetition, а shared 15° directional axis зв’язує sparks із circle. Separate glow/alpha забезпечує читабельність без великого coverage.

### Допустимі альтернативи

- Six accents із 60° cadence.
- Hexagon/chevron original motif замість triangles.
- Hard alpha=R для masked variant, якщо anti-aliasing test прийнятний.

### Типові неправильні рішення

- Шрифт Wingdings або downloaded rune.
- Усі rings/strokes однакової товщини.
- 24 дрібні accents, що зникають у mips.
- Perfect symmetry без focal hierarchy.
- Spark style не повторює angles/line weights circle.

### Перевірка

1. Source licenses: лише own/default geometric operations.
2. Circle readable at 1024, 256 і 128.
3. RGB/A toggle показує wider glow, tighter coverage.
4. Центр Rotation точний; без eccentric ring.
5. UE close/gameplay motion test без moiré unacceptable for target.
6. Sparks і circle на одному contact sheet мають shared motif language.

### Performance

Magic circle з thin high-frequency lines може shimmer-ити й витрачати 1024 RGBA resource. Спершу simplify design, потім compare 512/1024 and mip behavior. Translucent full-screen circle cost визначає covered pixels; tighter geometry або Masked variant може бути test candidate, але verdict потребує profiling.
