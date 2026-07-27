# 1. Назва

## Урок 06.05 — Procedural texture library, channel packing та перевірка в Unreal Engine

# 2. Результат уроку

Після уроку ти зможеш:

- зібрати невелику reusable library процедурних VFX masks у Substance 3D Designer;
- створити directional streak через `Gradient Linear 1`, noise та `Directional Warp`;
- розкласти sparks через `Tile Generator`;
- пояснити, як `Distance` розширює або пом’якшує бінарну форму;
- відрізнити texture distance transform від Mesh Distance Fields в Unreal Engine;
- об’єднати чотири незалежні grayscale masks через `RGBA Merge`;
- задати стабільні identifiers у `Output`;
- експортувати звичайні `.png`/`.tga` bitmap files без `.sbsar` і без Substance plugin;
- імпортувати data texture в Unreal Engine та перевірити R, G, B і A окремо;
- обґрунтувати resolution, color-space, mip та compression choices;
- пройти підсумкову атестацію блоку 06.

Ключовий deliverable — `T_VFX_Utility_RGBA.tga`, де R = breakup, G = sparks, B = streak, A = soft fade, а також UE evidence sheet із перевіркою кожного каналу.

# 3. Орієнтовний час

**4 години: 0.5 години теорії та 3.5 години практики.**

| Частина | T | P | Час |
|---|---:|---:|---:|
| Library contract, packing і runtime model | 30 хв | — | 30 хв |
| Controlled experiments та guided procedural branches | — | 45 хв | 45 хв |
| Standard bitmap export і UE channel validation | — | 30 хв | 30 хв |
| EX-L06-05-A: polish, naming і evidence | — | 15 хв | 15 хв |
| [Block 06 assessment](BLOCK_ASSESSMENT.md) | — | 2 год | 2 год |
| **Разом** | **30 хв** | **3 год 30 хв** | **4 год** |

`EX-L06-05-B` — складніша remediation/extension-вправа. Вона не додає годин до 24-годинного бюджету блоку: виконуй її замість 15-хвилинного polish-pass або як частину повторної спроби assessment.

# 4. Prerequisites

- Завершено 06.01–06.04.
- Є `P_VFX_TextureLab.sbs` та `G_VFX_SmokeMask` з попереднього уроку.
- Є Unreal-проєкт курсу, Material Lab і хоча б один card/slash mesh із 06.03.
- Зрозумілі values 0–1, `Multiply`, `Add`, `Max`, `Min`, `Levels` і texture sampling.
- Версії Blender, Substance 3D Designer та Unreal Engine записані у production journal.
- Жодний Substance plugin для Unreal Engine не потрібен і не припускається.

# 5. Нові терміни

| Термін | Просте пояснення |
|---|---|
| **Procedural library** | Набір graphs/outputs із передбачуваними назвами та призначенням |
| **Directional Warp** | Зсуває pixels input-зображення в заданому напрямку за grayscale intensity input |
| **Distance** | Створює градієнт від межі source shape; корисний для expand/soft halo |
| **Tile Generator** | Розкладає повторювані shapes по сітці та додає контрольовану випадковість |
| **Channel packing** | Зберігання різних grayscale datasets у R, G, B і A одного texture file |
| **RGBA Merge** | Збирає чотири grayscale inputs в одне color RGBA output |
| **Output Identifier** | Стабільне машинне ім’я output, яке формує контракт export |
| **Data texture** | Texture, чиї channels є числами/masks, а не кольором для сприйняття оком |
| **sRGB decode** | Color-space conversion для color textures; зазвичай небажана для masks/data |
| **Compression artifact** | Зміна значень через block compression або channel precision |
| **Mip** | Менша версія texture для віддаленого/малого screen footprint |
| **Channel bleed** | Небажаний вплив compression одного packed channel на інший |
| **Evidence sheet** | Набір скриншотів і коротких висновків, що доводить correctness delivery |

# 6. Навіщо ця тема потрібна VFX artist

VFX texture має пройти три різні контексти:

1. **Authoring:** graph повинен бути зрозумілим, відтворюваним і швидко змінюватися.
2. **Delivery:** output має мати стабільне ім’я, resolution, bit depth та standard file format.
3. **Runtime:** Unreal material повинен прочитати саме ті channel values, які ти задумав.

Без цього artist легко отримує «красивий» Designer preview, але в Unreal:

- mask стає світлішим через color-space conversion;
- alpha зникає через неправильний file/export contract;
- channel packing читається не тим каналом;
- mip знищує дрібні sparks;
- compression спотворює плавний gradient;
- texture коштує більше пам’яті, ніж потрібно.

Мета не в тому, щоб зробити максимально складний graph. Мета — створити малу, зрозумілу library, яку можна regenerate, export, inspect і безпечно використати в матеріалах.

# 7. Теорія простими словами

Уяви одну RGBA texture як коробку з чотирма окремими шухлядами:

- R містить breakup;
- G містить sparks;
- B містить directional streak;
- A містить soft fade.

Кожна шухляда зберігає число 0–1. Якщо UE material бере лише `ComponentMask R`, він не повинен «бачити» G, B або A.

## Directional Warp

Є source image і intensity map. Для кожного pixel intensity визначає, наскільки далеко source посунеться в одному напрямку. Smooth noise дає плавний bend; high-frequency noise дає рваний edge.

## Distance

Бінарна біла точка має жорстку межу. `Distance` вимірює відстань від неї та створює навколо градієнт. Потім `Levels` вирішує, чи це буде маленький sharp spark, м’який halo або ширша пляма.

`Distance` у Designer працює з pixels texture. Це **не** Mesh Distance Fields, Global Distance Field або distance-to-geometry feature в Unreal Engine.

## Tile Generator

Він не «малює магію», а повторює shape по X/Y. Random parameters змінюють scale, position, rotation або luminance. Спочатку створи контрольовану сітку, потім додавай randomness по одному параметру.

## Packing

Packing може зменшити кількість texture assets і, якщо material використовує кілька masks разом, кількість samples. Але він не завжди вигідний: channels можуть потребувати різної resolution, compression або mip поведінки.

# 8. Детальні технічні пояснення

## 8.1 Library contract

Створи graph `G_VFX_UtilityLibrary` у package `P_VFX_TextureLab.sbs`.

Contract:

| Identifier Output | Type | Значення | Канал packing |
|---|---|---|---|
| `breakup_mask` | Grayscale | seamless breakup середньої частоти | R |
| `spark_mask` | Grayscale | розріджені dots/shards | G |
| `streak_mask` | Grayscale | спрямований streak slash/beam | B |
| `soft_fade` | Grayscale | широкий монотонний fade | A |
| `utility_rgba` | Color RGBA | запакована delivery texture | RGBA |

Graph working resolution: **1024×1024, Relative to Parent**. Це стартова точка, а не універсальне правило.

## 8.2 Breakup branch

1. `Perlin Noise` дає continuous noise.
2. `Levels` звужує діапазон без повного clipping.
3. За потреби другий `Perlin Noise` з іншим `Scale` комбінується через `Blend` → `Multiply`.
4. Output залишається seamless, якщо обидва source nodes tile.

Початкова ідея: великий noise визначає mass, малий — edge detail.

## 8.3 Spark branch

1. `Shape` із pattern `Disc` або інший простий grayscale source.
2. `Tile Generator` розкладає shape.
3. `Distance` створює контрольовану зону навколо shapes.
4. `Levels` повертає потрібну sharpness.

Якщо installed Designer version використовує інші назви properties у `Tile Generator`/`Distance`, зафіксуй фактичні labels у journal; логіка branch та acceptance criteria не змінюються.

## 8.4 Streak branch

Базова формула:

```text
streak_base = GradientLinear × strip_breakup
streak_warped = DirectionalWarp(streak_base, smooth_noise, intensity, angle)
streak_mask = Levels(streak_warped)
```

Важливо:

- intensity map має бути smooth enough;
- надмірний intensity може fold/tear silhouette;
- macro fade повинен залишатися читабельним;
- якщо streak буде sampled вздовж beam/slash UV, перевір його в контексті mesh, а не лише 2D preview.

## 8.5 Soft fade branch

`Gradient Linear 1` → optional `Levels`.

Цей channel має бути:

- monotonic уздовж обраної осі;
- без випадкового noise;
- без hard step, якщо він керує opacity tip/root;
- документований: чорний = hidden, білий = visible.

## 8.6 RGBA Merge

Підключи grayscale outputs до `RGBA Merge`:

```text
breakup_mask → R
spark_mask   → G
streak_mask  → B
soft_fade    → A
```

Усі inputs повинні мати однакові dimensions. Перед packing перевір кожний branch окремо. `RGBA Merge` не виправляє неправильну mask — він лише пакує values.

## 8.7 Standard bitmap delivery

Безпечний baseline:

- individual diagnostic masks: grayscale `.png`;
- packed RGBA: `.tga` або `.png` з alpha;
- naming: `T_VFX_Utility_RGBA_1024.tga`;
- source graph зберігається окремо як `.sbs`;
- `.sbsar`, runtime graph або Unreal Substance plugin не потрібні.

Для цього курсу не використовуй JPEG: lossy artifacts руйнують masks.

## 8.8 UE interpretation

Packed texture — data. Типовий intent:

- `sRGB`: Off;
- channel inspection: R/G/B/A окремо;
- compression: mask/data-compatible choice;
- mip behavior: перевірити на target viewing distance;
- sampler/material: не застосовувати color correction до mask без явної причини.

Точні labels і доступні варіанти Texture Editor у поточній збірці: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 9. Візуальні або математичні приклади

## 9.1 Packing одного pixel

Якщо в координаті UV = (0.35, 0.70):

```text
breakup = 0.20
spark   = 1.00
streak  = 0.65
fade    = 0.40
```

то packed pixel:

```text
RGBA = (0.20, 1.00, 0.65, 0.40)
```

`ComponentMask G` у UE повинен повернути 1.00; не середнє значення і не luminance.

## 9.2 Warp displacement

Спрощена модель:

```text
offset = (intensityMap - 0.5) × warpStrength
warpedUV = sourceUV + direction × offset
```

Реалізація node може відрізнятися, але ця модель пояснює:

- 0.5 ≈ малий/нульовий signed offset;
- крайні values рухають сильніше;
- більший strength збільшує displacement;
- smooth intensity дає smooth contour.

## 9.3 8-bit precision

8-bit channel має приблизно 256 discrete values:

```text
stored ≈ round(value × 255) / 255
```

Для binary spark mask цього зазвичай достатньо. Для дуже плавного low-contrast fade banding потрібно перевірити, а не вгадувати.

## 9.4 Resolution comparison

| Texture | Pixels | Відносна кількість pixels |
|---|---:|---:|
| 512² | 262,144 | 1× |
| 1024² | 1,048,576 | 4× |
| 2048² | 4,194,304 | 16× |

Подвоєння width/height дає вчетверо більше pixels.

## 9.5 Packing decision

```text
Однакові resolution + однакове використання + сумісні compression/mips?
        ├─ Так → packing є добрим кандидатом
        └─ Ні  → залиш окремі textures або перегрупуй channels
```

# 10. Controlled experiments

Виконай experiments до guided practice. Змінюй лише одну variable.

## Experiment A — Warp strength

1. Візьми один streak source та один smooth intensity map.
2. Збережи previews із strength 0, 8 і 24.
3. Не змінюй angle/noise.
4. Запиши, коли silhouette стає expressive, а коли ламається.

**Очікування:** 0 не деформує, середнє value додає flow, велике створює fold/edge loss.

## Experiment B — Distance radius

1. Візьми ту саму spark layout.
2. Порівняй small, medium і large maximum distance.
3. Після кожного варіанта застосуй однаковий `Levels`.

**Очікування:** більша distance зона дає ширшу falloff, але може злити сусідні sparks.

## Experiment C — Tile randomness

1. Почни з regular 8×8 grid.
2. Додай лише position randomness.
3. Поверни position до 0, додай лише scale randomness.
4. Увімкни обидва і порівняй.

**Очікування:** ти зможеш назвати, який parameter створив конкретну variation.

## Experiment D — Color-space proof у UE

1. Імпортуй packed texture.
2. Переглянь один mid-gray channel із data-intent.
3. Порівняй preview/material result при вимкненому і ввімкненому `sRGB`.
4. Поверни правильний data setting.

Точне розташування `sRGB` у Texture Editor: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 11. Покрокова guided practice

## Частина A — Організація library

1. Відкрий `P_VFX_TextureLab.sbs`.
2. Створи Substance graph `G_VFX_UtilityLibrary`.
3. У graph properties задай 1024×1024 через Relative to Parent.
4. Створи frames:
   - `01_BREAKUP_R`;
   - `02_SPARK_G`;
   - `03_STREAK_B`;
   - `04_FADE_A`;
   - `05_PACK_AND_OUTPUT`.
5. Додай коментар: `All channels are linear data masks, 0=off, 1=on`.

**Checkpoint:** graph порожній, але contract, frames та resolution вже зрозумілі іншому artist.

## Частина B — Breakup у R

1. Додай `Perlin Noise`, назви node `N_BreakupLarge`.
2. Встанови `Scale = 5`.
3. Додай другий `Perlin Noise`, `N_BreakupSmall`, `Scale = 18`.
4. Після малого noise додай `Levels`, `L_BreakupSmall`; залиш приблизно 20–80% gray information.
5. Додай `Blend`:
   - Background = large noise;
   - Foreground = leveled small noise;
   - Opacity = 1;
   - Blending Mode = `Multiply`.
6. Додай фінальний `Levels`, `L_BreakupFinal`; підніми contrast, але не перетворюй усе на pure black/white.

**Checkpoint:** 2×2 preview не показує seam, histogram має black, white і gray values.

## Частина C — Sparks у G

1. Додай `Shape` з простим disc-like pattern.
2. Підключи його до `Tile Generator` як pattern input.
3. Почни з:
   - X Amount = 8;
   - Y Amount = 8;
   - Scale ≈ 0.12;
   - Position Random ≈ 0.45;
   - Scale Random ≈ 0.55;
   - Rotation Random = 0 для discs.
4. Зменш pattern density так, щоб у viewport лишалися large negative spaces.
5. Додай `Distance`; почни з Maximum Distance ≈ 12–20 px-equivalent at 1024.
6. Додай `Levels` і створи small bright core із narrow soft edge.
7. Якщо sparks зливаються, спочатку зменш scale/count, а не crush `Levels`.

Назви окремих Tile Generator/Distance properties можуть відрізнятися між версіями Designer; звір фактичні labels з installed version і запиши їх у journal.

**Checkpoint:** spark channel sparse, читається на 25% zoom і не перетворюється на суцільний шум.

## Частина D — Streak у B

1. Додай `Gradient Linear 1`, зорієнтуй white→black уздовж планованої slash/beam UV.
2. Додай `Perlin Noise`, `Scale = 10`; пропусти через `Levels`, залиш кілька довгих regions.
3. Через `Blend` → `Multiply` об’єднай gradient і strip breakup.
4. Додай smooth `Perlin Noise`, `Scale = 3` як intensity map.
5. Додай `Directional Warp`:
   - Input = streak base;
   - Intensity Input = smooth noise;
   - Intensity/Strength starting point = 8;
   - Angle = 0° або 90° відповідно до UV direction.
6. Підніми strength до максимум 24 тільки для experiment; поверни найменше value, яке дає потрібний flow.
7. Додай фінальний `Levels`, але збережи anti-aliased edge.

**Checkpoint:** streak має напрямок, negative space та цілісний fade; warp не створює випадкову «локшину».

## Частина E — Soft fade у A

1. Додай другий `Gradient Linear 1`.
2. Зорієнтуй black на root/edge, який повинен зникати, і white на visible region.
3. Додай `Levels` лише для control ширини transition.
4. Перевір monotonicity: при русі вздовж осі fade не повинен раптово темніти/світлішати.

**Checkpoint:** channel зрозумілий навіть без інших masks.

## Частина F — Output nodes

1. Додай чотири grayscale `Output` nodes.
2. Задай identifiers:
   - `breakup_mask`;
   - `spark_mask`;
   - `streak_mask`;
   - `soft_fade`.
3. Додай `RGBA Merge`.
4. Підключи R/G/B/A за contract.
5. Додай color `Output` із identifier `utility_rgba`.
6. Усі Outputs повинні успадковувати 1024×1024.

**Checkpoint:** preview `utility_rgba` буде кольоровим — це нормально, бо різні masks лежать у різних channels.

## Частина G — Standard bitmap export

1. Save package.
2. Запусти `Export Outputs as Bitmaps`.
3. Обери окрему папку `Exports/VFX_Utility/`.
4. Експортуй individual grayscale outputs як PNG.
5. Експортуй `utility_rgba` як TGA RGBA або PNG RGBA.
6. Не експортуй JPEG.
7. Не створюй delivery, що залежить від `.sbsar` або Unreal plugin.
8. Перевір файли у зовнішньому image viewer: dimensions, alpha, file names.

Точний шлях команди export та labels dialog залежать від installed Designer version; зафіксуй фактичний шлях у journal.

**Checkpoint:** standard bitmap files відкриваються без Designer.

## Частина H — Import і channel validation в UE

1. Створи folder `/Game/VFX/Textures/Utility/`.
2. Імпортуй `T_VFX_Utility_RGBA_1024.tga`.
3. Відкрий Texture Editor.
4. Встанови data intent:
   - `sRGB` off;
   - mask/data-compatible compression candidate;
   - mip setting спочатку залиш controlled project default.
5. Збережи asset.
6. Створи `M_VFX_TextureChannelCheck`.
7. Додай:
   - `TextureSampleParameter2D` `UtilityTexture`;
   - чотири `ComponentMask` nodes R/G/B/A;
   - `Multiply`;
   - `VectorParameter` `Tint`;
   - `Emissive Color`;
   - за потреби `Opacity`/`Opacity Mask` згідно з Material Lab.
8. По черзі підключи R, G, B, A до preview path та зроби чотири screenshots.
9. Признач material на card/slash mesh:
   - R має давати breakup;
   - G — sparse sparks;
   - B — directional streak;
   - A — broad fade.
10. Перевір near/far view і mip transitions.

Точні поля `Compression Settings`, `Mip Gen Settings`, `Texture Group`, channel-view buttons і Material editor UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

**Checkpoint:** кожний UE channel візуально відповідає individual export із Designer.

## Частина I — Evidence sheet

Створи `L06_05_Evidence.md` або одну image board з:

- full graph;
- four individual outputs;
- packed output;
- export dialog/file list;
- UE Texture Editor settings;
- previews R/G/B/A в UE;
- одне порівняння mip near/far;
- коротким висновком: що працює, що змінив би.

Після цього переходь до [Block 06 assessment](BLOCK_ASSESSMENT.md). Його 2 години вже включені в цей урок.

# 12. Точні назви nodes, modules і settings

## Substance 3D Designer

- `Gradient Linear 1`
- `Perlin Noise`
- `Levels`
- `Blend`
- `Shape`
- `Tile Generator`
- `Distance`
- `Directional Warp`
- `RGBA Merge`
- `Output`
- `Relative to Parent`
- `Output Size`
- `Identifier`
- `Export Outputs as Bitmaps`

## Unreal Engine

- `TextureSampleParameter2D`
- `ComponentMask`
- `Multiply`
- `VectorParameter`
- `Emissive Color`
- `Opacity`
- `Opacity Mask`
- `sRGB`
- `Compression Settings`
- `Mip Gen Settings`
- `Texture Group`

Назви UE settings наведено як очікувані labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 13. Стартові значення параметрів

| Branch | Node/setting | Start |
|---|---|---:|
| Graph | Output Size | 1024×1024 |
| Breakup | Perlin large Scale | 5 |
| Breakup | Perlin small Scale | 18 |
| Breakup | Blend mode | Multiply |
| Sparks | Tile X/Y Amount | 8 / 8 |
| Sparks | Tile Scale | ≈0.12 |
| Sparks | Position Random | ≈0.45 |
| Sparks | Scale Random | ≈0.55 |
| Sparks | Distance | ≈12–20 |
| Streak | Perlin breakup Scale | 10 |
| Streak | Warp noise Scale | 3 |
| Streak | Directional Warp strength | 8 |
| Streak | Experiment maximum | 24 |
| Pack | R/G/B/A | breakup/spark/streak/fade |
| Export | Packed resolution | 1024² |
| UE | sRGB intent | Off |

Це baselines для навчального graph, не magic numbers. Якщо property range відрізняється, нормалізуй результат за acceptance criteria, а не копіюй число всліпу.

# 14. Очікуваний результат кожного етапу

| Етап | Видимий результат | Якщо не так |
|---|---|---|
| Contract | 5 stable Output identifiers | Виправ naming до побудови material |
| Breakup | seamless gray variation | Перевір source tiling/Levels |
| Sparks | sparse isolated shapes | Зменш count/scale, потім Distance |
| Streak | directional readable silhouette | Зменш warp, перевір UV axis |
| Fade | monotonic broad gradient | Прибери noise/over-crushed Levels |
| Packing | colored RGBA preview | Перевір wiring R/G/B/A |
| Export | standard files з alpha | Перевір format/output selection |
| UE import | data values без gamma shift | Перевір sRGB/data settings |
| Channel check | 4 правильні masks | Зістав ComponentMask і contract |
| Mip check | stable far silhouette | Переглянь spark size/resolution/mips |

# 15. Самостійна вправа

## EX-L06-05-A — Production-ready utility pack для VFX

### Завдання

Доведи guided graph до reusable delivery: чотири distinct masks, packed RGBA, standard bitmap export та UE channel validation.

### Обмеження

- Graph 1024×1024.
- Обов’язкові `Directional Warp`, `Distance`, `Tile Generator`, `RGBA Merge`, `Output`.
- R = breakup, G = sparks, B = streak, A = soft fade.
- Minimum 20% gray range у breakup/streak до UE compression.
- Spark channel має не менше 60% black negative space.
- Export лише standard `.png`/`.tga`.
- Немає `.sbsar` delivery та немає залежності від Substance plugin.
- UE data texture intent документований.
- Version-sensitive UE labels позначені manual verification.

### Deliverables

1. `P_VFX_TextureLab.sbs` з `G_VFX_UtilityLibrary`.
2. `T_VFX_Utility_RGBA_1024.tga`.
3. Four individual diagnostic PNGs.
4. `M_VFX_TextureChannelCheck` або еквівалентний Material Lab asset.
5. Evidence sheet із graph, export, UE R/G/B/A та near/far view.
6. Коротка таблиця channel contract.

### Acceptance criteria

- [ ] Output identifiers точні й унікальні.
- [ ] Breakup seamless у 2×2 preview.
- [ ] Sparks sparse і не зливаються після Distance.
- [ ] Streak має intentional direction і не втрачений warp-ом.
- [ ] Fade monotonic.
- [ ] Packed wiring відповідає contract.
- [ ] Standard file відкривається поза Designer.
- [ ] Alpha channel існує.
- [ ] UE R/G/B/A збігаються з individual outputs.
- [ ] sRGB/data intent перевірено.
- [ ] Mip behavior задокументовано.
- [ ] Plugin не потрібен.

# 16. Додаткова складніша вправа

## EX-L06-05-B — Packing failure lab і redesign

### Завдання

Створи контрольовану неправильну версію utility texture, діагностуй три failures, потім виріши, чи masks слід лишити packed або розділити на дві textures.

### Обмеження

- Інжектуй рівно три помилки:
  1. swapped R/G;
  2. incorrect color-space intent у UE;
  3. spark detail, який руйнується на far mip.
- Не змінюй більше однієї variable під час кожного diagnosis step.
- Redesign має враховувати resolution, compression, sampling together.
- Export залишається standard bitmap-only.
- Немає plugin dependency.

### Deliverables

1. Before/after packed files.
2. UE screenshots для кожного failure.
3. Diagnosis log: symptom → hypothesis → test → finding → fix.
4. Packing decision matrix.
5. Final channel contract та memory/sample rationale.

### Acceptance criteria

- [ ] Кожний injected failure відтворюється.
- [ ] Root cause доведено single-variable test.
- [ ] R/G wiring виправлено.
- [ ] Data color-space intent відновлено.
- [ ] Spark mip issue виправлено через content/resolution/mip choice, а не випадковий parameter sweep.
- [ ] Final packing decision аргументований.
- [ ] UE final channels збігаються з source masks.

# 17. Три рівні підказок

## EX-L06-05-A

- **Hint 1:** Спочатку перевір individual outputs; packing роби лише після їх approval.
- **Hint 2:** Намалюй таблицю `mask → channel → UE ComponentMask`. Якщо preview неправильний, пройди таблицю зліва направо.
- **Hint 3:** Для delivery використовуй `RGBA Merge`, color `Output` `utility_rgba`, export RGBA TGA/PNG, у UE вимкни color interpretation для data та перевір R/G/B/A окремо.

[Повне рішення EX-L06-05-A](../EXERCISE_ANSWERS/L06-05_procedural_texture_library_and_ue_validation_answers.md#ex-l06-05-a)

## EX-L06-05-B

- **Hint 1:** Запиши symptom до зміни settings; інакше ти не доведеш root cause.
- **Hint 2:** Swapped channels видно одразу при порівнянні individual PNG і `ComponentMask`; gamma problem найбільше змінює mid-gray.
- **Hint 3:** Для far spark failure порівняй content із більшим spark core, окремий texture/іншу resolution strategy та mip choice; обери найменшу виправдану зміну.

[Повне рішення EX-L06-05-B](../EXERCISE_ANSWERS/L06-05_procedural_texture_library_and_ue_validation_answers.md#ex-l06-05-b)

# 18. Типові помилки

| Помилка | Симптом | Причина |
|---|---|---|
| Надмірний Directional Warp | streak рветься/складається | strength вищий за scale detail |
| High-frequency warp input | noisy edge | intensity map надто дрібний |
| Distance після dense tiles | одна біла пляма | shapes занадто близько |
| Crushed Levels | немає gray edge | input low/high зведені надто близько |
| Wrong RGBA wiring | UE channel показує іншу mask | contract не перевірено |
| PNG/TGA без alpha | A завжди 1 | export не включив alpha |
| sRGB on для data | mid-gray змінюється | color decode applied to mask |
| Невдале compression | ringing/channel artifacts | data не відповідає format |
| Tiny sparks + mips | far view порожній | feature менший за mip footprint |
| 2048 «про всяк випадок» | memory waste | resolution не обґрунтована |
| Plugin-dependent delivery | asset не відкривається на іншій machine | немає standard bitmap baseline |

# 19. Troubleshooting

## Symptom: packed texture повністю чорна

1. Preview `RGBA Merge`.
2. Preview кожний input.
3. Перевір graph output size.
4. Перевір, чи `Output` usage/type є color RGBA.
5. Відкрий exported file поза Designer.

## Symptom: alpha відсутня

1. Перевір A input у `RGBA Merge`.
2. Переконайся, що `utility_rgba` — RGBA, не RGB-only.
3. Export format має підтримувати alpha.
4. Перевір alpha у external viewer.
5. Лише потім reimport у UE.

## Symptom: R показує sparks, а G — breakup

1. Зістав wiring у Designer.
2. Зістав individual files.
3. Зістав UE `ComponentMask`.
4. Виправ один бік contract; не роби подвійне swap, яке маскує помилку.

## Symptom: UE mask світліша за Designer

1. Знайди mid-gray test area.
2. Перевір data color-space intent.
3. Перевір material arithmetic.
4. Перевір compression.
5. Не компенсуй problem випадковим `Power`.

Точний UE texture setting: **Потребує ручної перевірки в Unreal Engine 5.8.**

## Symptom: spark mask зникає на відстані

1. Переглянь mip levels.
2. Виміряй spark diameter у source pixels.
3. Збільш feature, якщо art direction дозволяє.
4. Порівняй packed та окремий texture candidate.
5. Зміни mip/compression лише з documented target-platform test.

## Symptom: Designer graph повільний

1. Зменш preview Output Size до 512.
2. Preview лише потрібний node.
3. Відключи expensive exploratory branches.
4. Зменш кількість warp/distance operations.
5. Поверни 1024 перед final export.

# 20. Performance considerations

## Designer authoring

- Grayscale nodes там, де color не потрібний.
- 512 preview для iteration, 1024 final validation.
- `Directional Warp`, `Distance` та dense generators можуть бути authoring-expensive.
- Graph frames і reuse зменшують human cost, навіть якщо не змінюють runtime.

## UE runtime

- Після standard bitmap export Designer graph не виконується в UE.
- Runtime залежить від texture dimensions, format, mips, sampling і material operations.
- 1024² не «безкоштовна» лише тому, що graph procedural.
- Packing корисний, коли material читає кілька channels одного sample.
- Якщо masks використовуються в різних effects, packing може завантажувати непотрібні data.
- Alpha іноді змінює available compression/memory footprint; вимірюй target format.
- Tiny high-frequency content погано переживає mips і temporal sampling.
- Final platform stats і visual quality: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 21. Запитання для самоперевірки

1. Чим `Directional Warp` відрізняється від простого noise multiply?
2. Що робить `Distance` і чим він не є?
3. Чому randomness у `Tile Generator` треба додавати по одному parameter?
4. Який channel contract має `utility_rgba`?
5. Чому packed VFX masks зазвичай трактуються як data, а не color?
6. Коли packing може бути гіршим за окремі textures?
7. Чому 2048² має в 16 разів більше pixels, ніж 512²?
8. Як довести, що alpha загубилася на export, а не в UE material?
9. Від чого залежить runtime cost після bitmap export?
10. Чому plugin не потрібен у цьому workflow?

# 22. Відповіді

1. Warp spatially зміщує source pixels за intensity map; multiply лише змінює їх values.
2. Він створює pixel-distance gradient від shape; це не Unreal Mesh/Global Distance Field.
3. Так видно причинно-наслідковий зв’язок і легше уникнути uncontrolled noise.
4. R breakup, G sparks, B streak, A soft fade.
5. Channels несуть числові masks; color gamma conversion змінює ці values.
6. Коли channels потребують різних resolution, compression, mips або не використовуються разом.
7. Width і height зростають у 4 рази кожна відносно 512→2048: 4×4 = 16.
8. Відкрити exported bitmap у independent viewer і перевірити alpha до import.
9. Від dimensions, format, mips, texture samples та material operations, не від Designer node count.
10. UE імпортує standard PNG/TGA як звичайні textures; runtime graph не потрібен.

# 23. Self-check checklist

- [ ] `G_VFX_UtilityLibrary` організований frames.
- [ ] 1024×1024 final graph.
- [ ] Breakup seamless.
- [ ] Sparks sparse.
- [ ] Distance не зливає shapes.
- [ ] Directional Warp controlled.
- [ ] Streak читається на mesh UV.
- [ ] Fade monotonic.
- [ ] Five Output identifiers stable.
- [ ] Контракт R/G/B/A задокументовано.
- [ ] Individual PNGs exported.
- [ ] Запакований RGBA TGA/PNG експортовано.
- [ ] Alpha verified outside Designer.
- [ ] No JPEG.
- [ ] No `.sbsar`/plugin dependency.
- [ ] Намір sRGB/data в UE перевірено.
- [ ] Four ComponentMask previews saved.
- [ ] Поведінку mip near/far збережено.
- [ ] UI UE, що залежить від версії, позначено для ручної перевірки.
- [ ] Block assessment completed.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. ти можеш rebuild кожний branch з node list;
2. можеш пояснити source та intensity inputs `Directional Warp`;
3. не плутаєш Designer `Distance` з UE distance fields;
4. packing contract точний;
5. standard bitmaps не залежать від plugin;
6. UE channel previews збігаються з source masks;
7. resolution/compression/mip decision має evidence;
8. EX-L06-05-A має щонайменше 10/12 acceptance checks;
9. Block 06 assessment має ≥80/100 і жодна категорія не нижче 60%.

# 25. Підсумок

Ти побудував повний offline-to-runtime bridge: procedural masks у Designer, stable Outputs, RGBA packing, standard bitmap export і manual channel validation в Unreal. Головна професійна звичка — перевіряти contract на кожній межі: graph → file → texture asset → material → mesh.

# 26. Зв’язок із наступними уроками

У блоці 07 Niagara Foundations ці meshes і textures стануть production inputs для sprite, mesh і ribbon emitters. Breakup керуватиме opacity, streak — slash/beam silhouette, sparks — particle detail, soft fade — normalized lifetime/UV fade. Якщо asset contract стабільний, Niagara iteration не витрачається на пошук помилок authoring pipeline.

# 27. Офіційні джерела

- Adobe. [Substance 3D Designer User Guide](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/home).
- Adobe. [Directional Warp](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/atomic-nodes/directional-warp).
- Adobe. [Distance](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/atomic-nodes/distance).
- Adobe. [Tile Generator](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/texture-generators/patterns/tile-generator).
- Adobe. [RGBA Merge](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/filters/channels/rgba-merge).
- Adobe. [Output](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/atomic-nodes/output).
- Adobe. [Exporting Bitmaps](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/exporting-bitmaps).
- Epic Games. [Textures in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/textures-in-unreal-engine).
- Epic Games. [Importing Assets Directly into Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-assets-directly-into-unreal-engine).

# 28. Рекомендовані скриншоти або схеми

```text
Рекомендована схема 1:
Що показати: full G_VFX_UtilityLibrary.
Що повинно бути видно: five frames, four branches, RGBA Merge, five Outputs.
Яку область виділити: left-to-right data flow та identifiers.
```

```text
Рекомендований скриншот 2:
Що відкрити: Directional Warp before/after.
Що повинно бути видно: strength 0, 8, 24.
Яку область виділити: момент, де expressive flow переходить у broken silhouette.
```

```text
Рекомендований скриншот 3:
Що відкрити: Tile Generator → Distance → Levels.
Що повинно бути видно: regular layout, randomized layout, final sparse sparks.
Яку область виділити: negative space і spark edge.
```

```text
Рекомендована схема 4:
Що показати: R breakup / G sparks / B streak / A fade → RGBA Merge.
Що повинно бути видно: exact channel contract.
Яку область виділити: mapping до UE ComponentMask.
```

```text
Рекомендований скриншот 5:
Що відкрити: Export Outputs as Bitmaps та exported file list.
Що повинно бути видно: PNG diagnostics, RGBA TGA, 1024 dimensions.
Яку область виділити: alpha-capable format і відсутність plugin dependency.
```

```text
Рекомендований скриншот 6:
Що відкрити: UE Texture Editor.
Що повинно бути видно: data settings і channel controls.
Яку область виділити: sRGB/compression/mip fields.
Примітка: Потребує ручної перевірки в Unreal Engine 5.8.
```

```text
Рекомендований скриншот 7:
Що відкрити: M_VFX_TextureChannelCheck на slash/card.
Що повинно бути видно: чотири окремі R/G/B/A views.
Яку область виділити: correspondence з Designer individual masks.
```

```text
Рекомендована схема 8:
Що показати: Designer authoring → PNG/TGA → UE Texture → Material → Mesh/Niagara.
Що повинно бути видно: graph не виконується в runtime.
Яку область виділити: validation gates між етапами.
```
