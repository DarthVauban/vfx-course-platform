# Ключ assessment блока B06

Це еталонна відповідь для самостійного оцінювання після завершення 120-хвилинного assessment. Візуальний стиль може відрізнятися. Оцінюй mechanism, контракт asset, докази й здатність пояснити рішення.

# 1. Еталонні відповіді на теорію — 20/20

## 1. Object transforms і negative scale

Export mesh має передбачувано переносити size, rotation і handedness. Незастосований scale, особливо negative scale після mirror, може перевернути orientation/normals або дати неочікувану transform hierarchy в UE. Перед export перевір `Location/Rotation/Scale`, застосуй потрібні transforms і повторно перевір face orientation.

## 2. Overlapping UVs

Overlap допустимий, якщо faces навмисно мають читати однакову область texture, наприклад mirrored sides beam. Він ламає effect, якщо різні regions потребують унікального fade root→tip, directional flow або independent erosion. Контракт визначається використанням material, а не правилом «overlap завжди поганий».

## 3. Face orientation та normals

Односторонній card/slash може зникнути з back side через backface culling. Перевернуті або неузгоджені normals також змінюють lighting/fresnel і можуть зробити silhouette непередбачуваною. Треба перевірити Face Orientation у Blender і поведінку front/back у цільовому material UE.

## 4. Vertex color R root→tip

На root vertices встановлюється R=0, на tip R=1, а між ними — monotonic interpolation, наприклад 0, .25, .5, .75, 1 уздовж sections. Endpoints треба перевірити через Color Attribute/Spreadsheet або debug material, бо «схожий» color viewport не доводить точних semantics.

## 5. Origin/pivot

Niagara та component transforms обертають, масштабують і розміщують mesh відносно pivot. Slash із pivot у root легко росте назовні; ring із center pivot масштабується симетрично. Неправильний pivot створює orbit/offset і змушує компенсувати помилку в system logic.

## 6. Triangulation

GPU рендерить triangles, а quad/ngon може проходити triangulation по-різному в Blender, FBX importer або UE. Це змінює silhouette, normals, interpolation UV і vertex color. Triangulate modifier/operation або зафіксований шлях exporter робить результат детермінованим.

## 7. Directional Warp проти Multiply

`Directional Warp` просторово зсуває source pixels за intensity map і direction/strength. `Multiply` не рухає pixels; він лише множить їх values і затемнює або маскує. Warp змінює contour/flow, Multiply — amplitude.

## 8. Designer Distance

`Distance` створює pixel-distance gradient від input shape і дає змогу виконати expand/halo/falloff. Це offline operation texture, а не UE Mesh Distance Fields, Global Distance Field або runtime distance-to-geometry query.

## 9. Packing trade-off

Packing корисний, коли masks мають однакову resolution/mip/compression потребу та читаються разом одним material. Окремі textures кращі, коли channels використовуються різними effects, мають різну resolution, потребують різної precision/compression або різного mip behavior.

## 10. Data masks та tiny sparks

Masks несуть числові values, тому decode color-space зазвичай спотворює їх; data intent слід перевірити. Tiny sparks треба перевірити в lower mips і на цільовому screen size: feature, менший за mip footprint, зникає незалежно від красивого preview 1024.

# 2. Еталонне практичне рішення — Geometry/FBX, 30/30

## 2.1 Організація scene для assessment

Еталонне рішення починається з нової порожньої scene та нового package Designer. Жодний готовий mesh, UV layout, graph, node group або texture з уроків чи packs assets не копіюється.

```text
Collection A06_EXPORT
├─ SM_A06_Slash
├─ SM_A06_Ring
└─ SM_A06_Debris

Collection A06_REFERENCE
├─ UNIT_CUBE_100CM
└─ FORWARD_ARROW
```

Еталонне рішення припускає:

```text
Blender scene unit: Metric
Unit Scale: documented project value
UE up/forward mapping: verified with test cube/arrow
Export selection: A06_EXPORT only
```

Точні labels axis і options conversion залежать від версій Blender/UE; записуй фактичні settings exporter, а не копіюй screenshot наосліп.

## 2.2 `SM_A06_Slash`

### Geometry

1. Почни з однієї plane/strip у local plane XY.
2. Додай longitudinal cuts, щоб отримати **6 cross-sections**: root, 20%, 40%, 60%, 80%, tip.
3. Зігни centerline у читабельну arc.
4. Профіль width:

```text
root  = 0.30 normalized width
20%   = 0.72
40%   = 1.00
60%   = 0.88
80%   = 0.55
tip   = 0.06
```

5. Збережи два vertices на кожний cross-section і узгоджений edge flow.
6. Прибери faces нульової площі й doubles.
7. Розмісти origin у центрі root.

Очікувана topology: 12 основних vertices, 10 quads до triangulation, чистий border loop, без ngon.

### UV0

Mapping:

```text
U = width, left edge 0 → right edge 1
V = length, root 0 → tip 1
```

Вирівняй strip в UV, навіть якщо geometry вигнута. Залиш малий padding від 0/1 лише тоді, коли цього потребує поведінка texture wrap. Без overlap.

### Normals

- Виконай Recalculate outside після застосування transforms.
- Face Orientation показує один узгоджений front.
- У debug material UE явно протестуй front/back.
- Two-sided material — художній або runtime-вибір, а не виправлення випадкових normals.

### `VFXMask`

Створи color attribute `VFXMask` у domain, який коректно експортується й читається в проєкті. Намалюй або признач R за cross-section:

```text
root .00
20%  .20
40%  .40
60%  .60
80%  .80
tip 1.00
```

G може кодувати center width, якщо це задокументовано; B/A лишаються default 0/1 у цьому assessment. Перевір R у debug Blender і UE.

## 2.3 `SM_A06_Ring`

### Geometry

1. Додай circle із 16 segments.
2. Дублюй і масштабуй усередину, щоб створити outer та inner loops.
3. З’єднай loops в annulus.
4. Видали cap/interior geometry, не потрібну ефекту.
5. Установи origin у центрі.
6. Radial thickness становить приблизно 18% зовнішнього radius.

Очікується до triangulation: 32 vertices, 16 quads. Шістнадцяти segments достатньо для screen size assessment; 32 потребували б візуального обґрунтування.

### UV0

Два допустимі контракти:

- розгорнути annulus як горизонтальний strip: U навколо circumference, V від inner до outer;
- зберегти radial layout, якщо material явно потребує radial coordinates.

Еталонне рішення використовує strip:

```text
U = angle 0→1 around ring
V = inner edge 0 → outer edge 1
```

Розмісти seam у найменш видимому напрямку й протестуй за допомогою panning checker.

### `VFXMask`

```text
inner loop R = 0
outer loop R = 1
```

Origin у центрі ring забезпечує симетричні scale/rotation Niagara.

## 2.4 `SM_A06_Debris`

Еталонне рішення створює один асиметричний low-poly shard із нового default cube:

| Asset | Silhouette | Vertices before triangulation | Origin |
|---|---|---:|---|
| `SM_A06_Debris` | довгий асиметричний triangular shard | 6–8 | base/contact |

Правила:

- читабельна silhouette у розмірі thumbnail;
- без hidden internal faces;
- без needle triangles, якщо silhouette їх не потребує;
- flat/smooth shading задано навмисно;
- UV islands ненульові й перебувають у межах 0–1 для цього контракту;
- `VFXMask.R` іде від local base 0 до найдальшої точки 1.

## 2.5 Transforms, origin та triangulation

Checklist перед export:

```text
Object names final
Location appropriate for scene/export layout
Rotation applied/known
Scale = 1,1,1 after application
No negative scale
Origins inspected
Face orientation consistent
UV0 exists
VFXMask exists
Triangulation visible and deterministic
```

Еталонне рішення додає modifier `Triangulate` у кінець кожного stack і застосовує його в assessment copy. Зберігай чистий source до triangulation у production, коли очікуються revisions.

## 2.6 FBX export

Вибрані objects: три meshes `SM_A06_*`.

Еталонний запис:

```text
File: A06_VFX_Geometry.fbx
Selected Objects: enabled
Object Types: Mesh
Transform/axis conversion: verified by cube+arrow
Apply Transform/Units behavior: recorded for installed version
Geometry smoothing/normals: exported
Triangulation: already deterministic in mesh
Animation: disabled
Leaf bones/armature: not applicable
FBX compatibility note: UE FBX pipeline version checked against current official docs
```

Не вибирай reference cube/arrow для фінальної delivery.

## 2.7 UE geometry validation report

Очікуваний звіт:

| Asset | Scale/orientation | Pivot | UV | VFXMask R | Normals |
|---|---|---|---|---|---|
| Slash | Pass | root | root→tip | 0→1 | узгоджені |
| Ring | Pass | center | angle/radial | inner→outer | узгоджені |
| Debris | Pass | base/contact | придатні | base→tip | навмисні |

Debug materials:

```text
M_A06_UVDebug: TexCoord → debug grid/color
M_A06_VertexColorR: VertexColor.R → Emissive
M_A06_NormalFront: front/back or normal visualization
```

Import options and Static Mesh Editor labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 3. Еталонне практичне рішення — Procedural textures, 20/20

## 3.1 Graph contract

```text
Package: A06_VFX_Utility.sbs
Graph: G_A06_UtilityVariant
Resolution: 1024×1024
Data: grayscale branches
```

Frames:

```text
R_BREAKUP
G_SPARKS
B_STREAK
A_FADE
PACK_EXPORT
```

Outputs:

| Identifier | Type | Channel |
|---|---|---|
| `a06_breakup` | Grayscale | R |
| `a06_sparks` | Grayscale | G |
| `a06_streak` | Grayscale | B |
| `a06_soft_fade` | Grayscale | A |
| `a06_utility_rgba` | Color RGBA | RGBA |

## 3.2 R — Breakup

```text
Perlin Noise Large (Scale 6)
Perlin Noise Small (Scale 21)
Small → Levels
Large → Blend.Background
SmallLevels → Blend.Foreground
Blend Mode = Multiply, Opacity = 1
Blend → Levels Final
Final → Output a06_breakup
```

Еталонне рішення змінює два default-значення з уроку: large Scale 5→6 і small Scale 18→21. Результат лишається seamless у preview 2×2 і зберігає сірі values.

## 3.3 G — Sparks

```text
Shape Disc
→ Tile Generator
→ Distance
→ Levels
→ Output a06_sparks
```

Початкові значення:

```text
X Amount = 7
Y Amount = 9
Scale ≈ .14
Position Random ≈ .50
Scale Random ≈ .45
Distance ≈ 14
```

Еталонне рішення змінює 8×8→7×9 і position randomness .45→.50. Щонайменше 60% image лишається чорним; кілька primary sparks виживають у preview нижчих mip.

## 3.4 B — Streak

```text
Gradient Linear 1
Perlin Noise Breakup (Scale 11) → Levels
Gradient + Breakup → Blend Multiply
Perlin Noise Smooth (Scale 3)
Blend → Directional Warp.Input
SmoothNoise → Directional Warp.Intensity
Warp Strength = 10
Angle aligned to slash V axis
Warp → Levels → Output a06_streak
```

Strength 10 — найменше значення, яке створює обрану curve. Strength 24 протестовано й відхилено, бо silhouette склалася.

## 3.5 A — Soft fade

```text
Gradient Linear 1
→ Levels (input low .04, high .96)
→ Output a06_soft_fade
```

Чорний біля root slash, білий у напрямку body/tip відповідно до контракту material. Noise не додається; sampled line через image є монотонною.

## 3.6 Packing

```text
a06_breakup final  → RGBA Merge.R
a06_sparks final   → RGBA Merge.G
a06_streak final   → RGBA Merge.B
a06_soft_fade      → RGBA Merge.A
RGBA Merge         → Output a06_utility_rgba
```

Preview повного graph виглядає кольоровим, що очікувано для непов’язаних data в RGB.

## 3.7 Export

```text
T_A06_Breakup_R_1024.png
T_A06_Sparks_G_1024.png
T_A06_Streak_B_1024.png
T_A06_SoftFade_A_1024.png
T_A06_Utility_RGBA_1024.tga
```

Перевірки:

- усі файли 1024×1024;
- окремі PNG відкриваються як grayscale;
- R/G/B/A TGA перевірено незалежно;
- alpha не є константною;
- no JPEG;
- у delivery немає `.sbsar`;
- немає plugin Substance для Unreal.

# 4. Еталонне практичне рішення — Перевірка в UE, 10/10

## 4.1 Import

```text
/Game/VFX/Assessments/A06/Meshes/
/Game/VFX/Assessments/A06/Textures/
/Game/VFX/Assessments/A06/Materials/
```

Імпортовано:

- `A06_VFX_Geometry.fbx`;
- `T_A06_Utility_RGBA_1024.tga`.

Еталонне рішення записує фактичні choices dialog import UE у `SELF_REVIEW.md`. Точні labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 4.2 Packed texture interpretation

Заплановано:

```text
sRGB: Off
Compression: data/mask-compatible candidate
Mip generation: initial project default, then inspected
```

Не оцінюй конкретний label compression як універсально правильний; оцінюй, чи перевірено data intent, доступність alpha, artifacts і поведінку на цільовій платформі.

## 4.3 `M_A06_ChannelCheck`

Nodes:

```text
TextureSampleParameter2D A06Utility
ComponentMask R
ComponentMask G
ComponentMask B
ComponentMask A
VectorParameter Tint
Multiply
Emissive Color
Opacity/Opacity Mask according to debug blend mode
```

Чотири instances material або чотири зафіксовані rewires показують:

| View | Очікувано | Спостереження еталонного рішення |
|---|---|---|
| R | Breakup середньої частоти | відповідає окремому PNG |
| G | Розріджені sparks | відповідає, primary dots виживають у far view |
| B | Directional streak | слідує за UV slash |
| A | Плавний fade | монотонний, без noise |

## 4.4 Mesh context

- Slash використовує streak B і fade A; напрямок іде root→tip.
- Debug Vertex Color R іде від чорного до білого root→tip.
- `VFXMask.R` ring іде inner→outer.
- Pivots протестовано через rotation/scale у level або preview Niagara.
- Rotation debris відбувається навколо запланованих local centers/bases.
- Немає непоясненого mismatch scale.

## 4.5 Near/far

Зафіксуй той самий asset із:

- near: features займають достатньо pixels для порівняння shape;
- far: очікуваний gameplay footprint.

Висновок еталонного рішення: дрібні secondary dots іскор зникають, primary dots лишаються. Це прийнятно, бо візуальна ієрархія зберігається; якщо зникають усі dots, повернись до стратегії content/mip.

# 5. Еталон troubleshooting/performance — 10/10

## Сценарій 1 — G показує breakup, а mid-gray яскравіший

### Гіпотези

1. `RGBA Merge` R/G inputs swapped.
2. UE debug material uses wrong `ComponentMask`.
3. Exporter/channel viewer maps channels incorrectly or stale file imported.
4. `sRGB`/color interpretation changes mid-gray.
5. Material applies extra multiply/power/tint.

### Упорядковані тести

1. Перевір окремі outputs Designer: установи source truth.
2. Перевір packed channels TGA у зовнішньому viewer: це відділяє graph/export від UE.
3. Перевір timestamp/name файла й виконай правильний reimport, якщо файл застарів.
4. Використай незмінений debug material UE й перевір labels R/G.
5. Порівняй, змінюючи лише data intent color-space.
6. Перевір compression/math material лише після перевірок channels і color-space.

### Розрізнення причин

- **Channel swap:** shapes міняються місцями — dots з’являються в R, а clouds у G. Це впливає на те, який content присутній.
- **Проблема color-space:** identity content лишається правильною, але числовий вигляд або threshold mid-gray змінюється.
- Обидві проблеми можуть виникнути одночасно; виправляй і повторно тестуй по одній.

### Виправлення першопричини

- Якщо swap є у зовнішньому packed-файлі, виправ `RGBA Merge`/контракт source і повтори export.
- Якщо зовнішній файл правильний, але mask UE неправильна, виправ `ComponentMask`/призначення asset.
- Якщо identity content правильна, але values зсунуті, віднови data intent color-space.
- Не приховуй swap source компенсаційним swap downstream.

### Докази

- чотири source masks;
- зовнішні captures packed channels;
- R/G в UE до/після;
- зміна setting;
- фінальна таблиця контракту.

## Сценарій 2 — Основні masks разом, sparks окремо й чутливі до mip

Еталонна рекомендація:

```text
T_A06_MainUtility_RGB_1024
R breakup / G streak / B fade

T_A06_Sparks_R_512
R sparks
```

Обґрунтування:

- основний slash читає три masks разом, тому один packed sample є узгодженим;
- emitter іскор читає лише sparks, тому окремий asset уникає завантаження невикористаних channels 1024;
- resolution/content/mips іскор можна налаштовувати незалежно;
- збільшуй primary features іскор до вимкнення mips;
- порівнюй 512/1024 за фактичного screen size.

Вимірювання в UE:

- stats resource/memory texture;
- streaming residency;
- кількість texture samples material;
- релевантний рівень mip на цільовій відстані;
- вартість GPU/material, де це доречно;
- візуальна стабільність у русі й цільовому anti-aliasing.

Exact profiling windows and platform formats: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 6. Еталонна самоперевірка й документація — 10/10

## Таблиця версій

```text
Blender: actual installed version recorded
Substance 3D Designer: actual installed version recorded
Unreal Engine: 5.8 build identifier recorded
FBX exporter/importer notes: actual UI labels recorded
```

Не вигадуй номери версій. У реальній submission порожні або відсутні values втрачають бали за документацію; у цьому ключі формулювання вказує на потрібні докази.

## Контракт geometry

| Asset | Pivot | Напрямок UV | VFXMask.R | Facing |
|---|---|---|---|---|
| Slash | root | V root→tip | 0→1 | задокументований front |
| Ring | center | U angle, V inner→outer | inner 0→outer 1 | задокументований front |
| Debris | base/contact | local axis | base 0→tip 1 | закритий / заданий навмисно |

## Припущення FBX

```text
Three mesh objects selected
Transforms checked/applied
No negative scale
Normals verified
UV0 and VFXMask present
Triangulation deterministic
Reference objects excluded
Axis/unit conversion verified by UE evidence
```

## Контракт texture

```text
R breakup
G sparks
B streak
A soft fade
Linear numerical masks
1024×1024 assessment delivery
Standard bitmap only
```

## Таблиця перевірки в UE

| Перевірка | Очікувано | Спостережено | Результат | Дія |
|---|---|---|---|---|
| UV slash | root→tip | Streak B слідує за довжиною | Pass | немає |
| VFXMask R | 0→1 | чорний root, білий tip | Pass | немає |
| Packed R | breakup | відповідає PNG | Pass | немає |
| Packed G | sparks | відповідає PNG | Pass | збережено збільшені primary dots |
| Packed B | streak | відповідає PNG | Pass | немає |
| Packed A | fade | відповідає PNG | Pass | немає |
| Far mip | ключова shape виживає | primary shapes виживають | Pass | контролювати цільову платформу |

## Найсильніше рішення

Найкращим рішенням було збереження окремих diagnostic outputs разом із packed texture. Це дало змогу знаходити будь-який mismatch на етапі graph, file, import або material замість вгадування.

## Відоме обмеження

Поведінку compression/memory перевірено лише на навчальній development-платформі. Shipping-платформа може використовувати інший format texture і потребує ще одного проходу вимірювань.

## Наступна iteration

Створи кандидат 512 лише для sparks і порівняй far visibility, memory residency та usage samples із версією RGBA 1024 у репрезентативній system Niagara.

## Статус завершення

Усі потрібні докази присутні. Профілювання на цільовій платформі явно лишається поза межами цього 2-годинного assessment і відстежується як наступна робота, а не помилково позначається завершеним.

# 7. Приклад оцінювання

Приклад сильної submission:

| Категорія | Бал | Примітка |
|---|---:|---|
| Теорія | 18/20 | У відповіді про packing пропущено несумісність compression |
| Geometry/FBX | 27/30 | Один pivot debris слабкий, докази seam ring нечіткі |
| Procedural texture | 19/20 | Відмінний graph; мала неузгодженість naming output |
| Перевірка в UE | 9/10 | Near/far присутні; порівняння compression коротке |
| Troubleshooting/performance | 9/10 | Добрі впорядковані тести; у плані вимірювань немає streaming residency |
| Самоперевірка/документація | 9/10 | Versions/contracts повні; наступна iteration трохи широка |
| **Разом** | **91/100** | **Пройдено** |

Мінімальні бали в categories:

```text
Theory: 18 ≥ 12
Practical: 27+19+9 = 55 ≥ 36
Troubleshooting: 9 ≥ 6
Documentation: 9 ≥ 6
No critical failure
```

# 8. Поширені помилки оцінювання

- Нараховувати повні бали за красивий screenshot без доказів UV/channels.
- Штрафувати візуально інший slash, навіть коли topology/contract коректні.
- Вважати конкретний preset axis FBX універсальним без доказу import.
- Нараховувати бали за packing, коли mapping R/G/B/A не задокументовано.
- Вважати workflow із plugin стандартною bitmap delivery.
- Припускати, що лише `sRGB Off` доводить коректність compression/mip.
- Ігнорувати pivots, бо статичне placement у viewport виглядає правильно.
- Нараховувати бали за troubleshooting для випадкових змін settings без hypotheses.
- Зараховувати загальний бал ≥80, коли category нижча за мінімум 60%.
- Приховувати незавершену роботу на цільовій платформі замість зазначення її як обмеження.

# 9. Фінальний checklist для оцінювача

- [ ] Timer зупинено на 120 хвилинах.
- [ ] Теорію оцінено питання за питанням.
- [ ] Файл Blender відкривається.
- [ ] FBX імпортується.
- [ ] Присутні три assessment meshes.
- [ ] UV0, normals, pivots, transforms і triangulation перевірено.
- [ ] Semantics `VFXMask` перевірено.
- [ ] Graph Designer відкривається й повторно генерується.
- [ ] Потрібні nodes присутні.
- [ ] П’ять outputs присутні.
- [ ] Стандартні файли PNG/TGA присутні.
- [ ] Packed alpha існує.
- [ ] Немає обов’язкового plugin.
- [ ] Докази R/G/B/A в UE присутні.
- [ ] Докази near/far присутні.
- [ ] Troubleshooting використовує single-variable tests.
- [ ] Рішення performance містить план вимірювань.
- [ ] Самоперевірка чесна й практична.
- [ ] Загальний бал ≥80.
- [ ] Мінімум кожної category пройдено.
- [ ] Немає критичної помилки.
