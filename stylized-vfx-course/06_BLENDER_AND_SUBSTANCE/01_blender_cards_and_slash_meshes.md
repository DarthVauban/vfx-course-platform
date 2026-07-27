# 1. Назва

## Урок 06.01 — VFX cards, planes і slash meshes у Blender

# 2. Результат уроку

Після уроку ти зможеш:

- пояснити різницю між `Object`, `Mesh`, `Vertex`, `Edge` і `Face`;
- створити простий one-sided VFX card із передбачуваною локальною орієнтацією;
- побудувати low-complexity curved slash strip із контрольованим taper;
- розміщувати topology там, де вона змінює silhouette або deformation;
- задавати зрозумілий object origin і локальні axes;
- перевіряти face direction, duplicate vertices і silhouette;
- створити camera-readable card/slash kit без зайвої modelling complexity;
- підготувати meshes до глибшого UV/export workflow уроку 06.03.

Ключовий deliverable — два Blender assets: `SM_VFX_Card_01` і `SM_VFX_Slash_01`, а також silhouette/angle test sheet.

# 3. Орієнтовний час

**5 годин: 1.5 години теорії та 3.5 години практики.**

| Частина | Час |
|---|---:|
| Mesh mental model і VFX topology | 45 хв |
| Card/slash construction theory | 45 хв |
| Controlled experiments | 35 хв |
| Guided card | 45 хв |
| Guided slash mesh | 1 год 10 хв |
| Вправи, self-check і журнал | 1 год |

# 4. Prerequisites

- Пройдено `G05`.
- Є базова орієнтація в Blender: navigation, selection, save.
- Доступний Blender; installed version записано в навчальному журналі.
- Є власна slash texture з блока 05 для майбутнього UV test.
- У UE 5.8 є VFX test level, але export виконується лише в 06.03.

# 5. Нові терміни

| Термін | Пояснення |
|---|---|
| **Object** | Container із transform, origin і посиланням на mesh data |
| **Mesh** | Геометричні дані з vertices, edges і faces |
| **Vertex** | Точка в local 3D space |
| **Edge** | Зв’язок між двома vertices |
| **Face** | Polygon, що визначає поверхню |
| **Topology** | Структура зв’язків vertices/edges/faces |
| **Card** | Плоска surface для texture-driven VFX |
| **Slash strip** | Вузький curved/tapered mesh для arc/slash material |
| **Object Origin** | Точка, відносно якої працюють object transform і pivot |
| **Local Axes** | Осі object space після його rotation |
| **Face Normal** | Напрямок «передньої» сторони face |
| **Taper** | Звуження width до одного або обох кінців |
| **Silhouette density** | Скільки topology реально впливає на зовнішній contour |
| **Degenerate geometry** | Face/triangle з нульовою або майже нульовою площею |

# 6. Навіщо ця тема потрібна VFX artist

VFX mesh — не miniature environment model. Його задача:

- дати material потрібну surface;
- визначити silhouette;
- підтримати UV flow;
- дозволити WPO/vertex-driven animation;
- мати правильний pivot і orientation для Niagara.

Надто проста plane може зникнути під camera angle або не дати curved silhouette. Надто складний mesh збільшує authoring/debug cost без видимої користі. VFX artist має вміти знайти найменшу topology, яка зберігає форму й motion.

# 7. Теорія простими словами

Уяви mesh як каркас для material:

- vertices визначають опорні точки;
- edges визначають, як точки з’єднані;
- faces — де material може бути намальований;
- UV пізніше скаже, яка частина texture потрапляє на кожну face;
- normals скажуть, яка сторона surface «дивиться назовні»;
- origin визначить, навколо чого object обертається й масштабується.

Для card часто достатньо одного quad. Для curved slash потрібні кілька поперечних sections, бо кожна section контролює centerline, width і curvature. Додавай section тільки тоді, коли вона:

- змінює silhouette;
- потрібна для bend;
- потрібна для vertex mask;
- запобігає грубому interpolation.

# 8. Детальні технічні пояснення

## 8.1. Object Mode і Edit Mode

`Object Mode` змінює object transform: Location, Rotation, Scale.  
`Edit Mode` змінює vertices у local mesh space.

Це важливо для export:

- object scale `2,1,1` не те саме, що удвічі довший mesh зі scale `1,1,1`;
- origin не рухається автоматично разом із vertices у `Edit Mode`;
- duplication object і duplication mesh elements мають різні наслідки.

## 8.2. One-sided surface

Plane має front і back, визначені normal. У viewport обидві сторони можуть бути видимими залежно від shading/settings, але material/rendering пізніше може поводитися інакше.

Тому card повинен мати:

- свідомо обрану front side;
- перевірену face orientation;
- задокументований запланований напрямок камери;
- material decision `Two Sided` лише коли він справді потрібен.

Не дублюй plane back-to-back автоматично: це подвоює geometry/surface overlap і може створити z-fighting.

## 8.3. Card topology

Варіанти:

- **1 quad:** статична card, подібна до sprite;
- **2×2 або 3×3 grid:** деформація/WPO або vertex mask;
- **cross-card:** дві planes під кутом для volume, але більше overlap;
- **curved card:** кілька sections для silhouette/parallax.

У цьому уроці базовий card — один quad. Додаткові sections виправдані тільки experiment result.

## 8.4. Slash strip topology

Slash strip будується як дві edge chains:

```text
L0---L1---L2---L3---L4
|    |    |    |    |
R0---R1---R2---R3---R4
```

Кожна пара `L/R` — cross-section. Width:

```text
width_i = distance(L_i, R_i)
```

Starter width profile:

```text
0.05 → 0.35 → 0.60 → 0.40 → 0.08
```

Нульова width на кінці може створити overlapping vertices або degenerate triangle. Залишай малу, але ненульову width, поки topology не перевірена.

## 8.5. Curvature

Centerline slash:

```text
C_i = (L_i + R_i) / 2
```

Переміщуй cross-sections уздовж arc. Не роби curvature тільки rotation object: silhouette mesh лишиться прямою.

Starter centerline у local XY plane:

```text
C0=(-1.00,-0.25)
C1=(-0.55,-0.05)
C2=( 0.00, 0.20)
C3=( 0.55, 0.35)
C4=( 1.00, 0.25)
```

Це навчальні координати, не engine scale requirement.

## 8.6. Quads і triangles

Працюй із quads для зручного editing, але real-time surface зрештою triangulated. Остаточний diagonal впливає на interpolation/deformation. У 06.03 ти зафіксуєш triangulation й порівняєш із UE import.

## 8.7. Origin strategy

Для slash:

- origin біля старту — зручно для growth from weapon/contact;
- origin у center — зручно для radial scale/rotation;
- origin у contact point — зручно для impact placement.

Сьогодні вибери start-origin для `SM_VFX_Slash_01` і center-origin для card. У 06.03 перевір їх в UE.

## 8.8. Naming

Use:

```text
SM_VFX_Card_01
SM_VFX_Slash_01
```

`SM_` означає intended Static Mesh asset. Naming не замінює folder organization і validation.

# 9. Візуальні або математичні приклади

## 9.1. Card area

Для card width `1.0`, height `1.0`:

```text
area = width × height = 1.0
```

Якщо scale object `2,1,1`, visual area зміниться, але mesh data й transform будуть різними. Для передбачуваного export краще привести transform до documented state в 06.03.

## 9.2. Section count

Straight strip:

```text
2 sections → 1 quad
```

Curved five-section strip:

```text
5 sections → 4 quads → після triangulation приблизно 8 triangles
```

Більше sections виправдані, якщо curvature або WPO visibly improve.

## 9.3. Taper profile

```text
section: 0    1    2    3    4
width:  .05  .35  .60  .40  .08
```

На thumbnail primary mass концентрується біля middle/late part, а ends не створюють blunt rectangles.

## 9.4. Camera angle

Projected width плоскої card приблизно зменшується, коли view наближається до edge-on. Не використовуй це як точну renderer formula; зроби front/35°/70° visual tests.

# 10. Controlled experiments

## Експеримент 1 — Один quad проти subdivided card

1. Створи one-quad card.
2. Duplicate.
3. Другий card subdivide у grid.
4. Зігни middle vertices.
5. Порівняй silhouette front/35°.

**Контрольована змінна:** topology density.  
**Очікування:** subdivision корисна лише якщо деформація/curvature видима.

## Experiment 2 — Width profile

Створи три slash strips:

- uniform width;
- taper both ends;
- широкий початок / вузький кінець.

Перевір solid silhouette на 25%.

**Очікування:** profile змінює direction/weight без texture.

## Experiment 3 — Origin

1. Duplicate slash.
2. Один object rotate навколо center origin.
3. Другий — навколо start origin.

**Очікування:** одна й та сама geometry має різний placement behavior.

## Experiment 4 — Face direction

Увімкни face-orientation visualization, переверни normal duplicate plane й порівняй.

**Очікування:** front/back orientation повинна бути deliberate до export.

# 11. Покрокова guided practice

## Частина A — Card

### Крок 1. Створи файл

Збережи:

```text
L06_01_vfx_meshes.blend
```

Запиши Blender version.

### Крок 2. Додай Plane

1. Перейди в `Object Mode`.
2. `Add > Mesh > Plane`.
3. Перейменуй object на `SM_VFX_Card_01`.
4. У `Edit Mode` залиш один quad.
5. Розмісти card у локальній площині, яку легко документувати.

### Крок 3. Встанови розмір у mesh data

В `Edit Mode` scale vertices до width `1.0`, height `1.0` у навчальних Blender units. Повернись в `Object Mode` і перевір, що object Scale не був випадково використаний для shape authoring.

### Крок 4. Перевір orientation

Увімкни `Face Orientation` overlay. Front face має бути consistent. Якщо ні — у `Edit Mode` використай normal recalculation або flip selected faces.

### Крок 5. Origin

Origin card залиш у center. Додай temporary Empty або axes screenshot для документації.

## Частина B — Slash strip

### Крок 6. Створи base strip

1. Duplicate card або додай new Plane.
2. Перейменуй на `SM_VFX_Slash_01`.
3. У `Edit Mode` побудуй 5 cross-sections уздовж X.
4. Збережи quads між sections.

Практичний спосіб:

- start with Plane;
- scale його в long rectangle;
- додай три loop cuts поперек довжини;
- отримай 5 vertical cross-sections.

### Крок 7. Сформуй taper

Для кожної section перемісти left/right boundary симетрично від centerline.

Starter widths:

```text
0.08, 0.35, 0.60, 0.40, 0.10
```

Не collapse endpoints у одну точку.

### Крок 8. Сформуй arc

Перемісти sections у local Y:

```text
-0.25, -0.05, 0.20, 0.35, 0.25
```

Використай proportional editing лише якщо контролюєш, які vertices affected. Для beginner-safe variant переміщуй sections окремо.

### Крок 9. Перевір topology

- немає duplicate vertices;
- немає crossed edges;
- faces не overlap;
- quads мають consistent order;
- normals однакові;
- silhouette smooth enough на 25%;
- sections не надто dense.

### Крок 10. Origin at start

1. Постав `3D Cursor` у center першої cross-section.
2. В `Object Mode` set origin to 3D Cursor.
3. Rotate object 30° як test.
4. Undo rotation або поверни transform до clean state.

### Крок 11. Angle sheet

Зроби screenshots:

- front;
- 35°;
- 70°;
- solid/wireframe;
- face orientation.

### Крок 12. Save versions

```text
L06_01_vfx_meshes_v01.blend
L06_01_vfx_meshes_v02.blend
```

Не export до UE: export contract будується в 06.03.

# 12. Точні назви nodes, modules і settings

### Blender tools і modes

- `Object Mode`
- `Edit Mode`
- `Vertex Select`, `Edge Select`, `Face Select`
- `Add > Mesh > Plane`
- `Subdivide`
- `Loop Cut`
- `Extrude`
- `Scale`
- `Move`
- `Rotate`
- `Proportional Editing`
- `Merge by Distance`
- `Mesh > Normals > Recalculate Outside`
- `Mesh > Normals > Flip`
- `Viewport Overlays > Face Orientation`
- `Object > Set Origin > Origin to 3D Cursor`
- `Shade Flat`

Exact menu placement, shortcut і wording залежать від installed Blender version. Зафіксуй version і перевір їх у Blender Reference Manual.

### Unreal Engine

У цьому уроці UE import settings не використовуються. Точний FBX/Interchange importer path буде визначено в 06.03.  
**Потребує ручної перевірки в Unreal Engine 5.8.**

# 13. Стартові значення параметрів

| Параметр | Старт | Навіщо |
|---|---:|---|
| Card | 1×1 Blender unit | Простий comparison asset |
| Card faces | 1 quad | Мінімум для static card |
| Slash length | 2.0 units | Зручний локальний test |
| Slash sections | 5 | Достатньо для simple arc |
| Slash quads | 4 | Перед triangulation |
| Width profile | 0.08/0.35/0.60/0.40/0.10 | Taper без degenerate endpoints |
| Centerline Y | -0.25/-0.05/0.20/0.35/0.25 | Mild readable arc |
| Object rotation | 0,0,0 після test | Clean handoff |
| Object scale | 1,1,1 як target state | Export consistency |
| Review angles | 0°/35°/70° | Camera dependence |

Units тут є authoring convention. Фактичний size/orientation transfer перевіряється test asset у 06.03.

# 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат |
|---|---|
| Card | Один clean quad, center origin, deliberate normal |
| Основа slash | 5 упорядкованих cross-sections |
| Taper | Вузькі кінці, читабельна центральна маса |
| Arc | Плавна centerline без перехрещених faces |
| Topology | Немає duplicate/degenerate geometry |
| Origin | Обертання від початку slash працює |
| Тести кутів | Відомий edge-on failure |
| Naming | `SM_VFX_Card_01`, `SM_VFX_Slash_01` |
| Збережені версії | Зворотна історія `.blend` |

# 15. Самостійна вправа

## EX-L06-01-A — Kit camera cards

**Завдання:** створи три cards для майбутніх Sprite/Mesh-style VFX:

1. one-quad card;
2. three-section curved card;
3. tapered beam card.

**Обмеження:**

- лише geometry, потрібна для silhouette;
- clean origins;
- consistent normals;
- без modifiers у фінальній delivery;
- без duplicate planes, накладених back-to-back;
- кожну card задокументовано під 0°/35°/70°.

**Deliverables:**

- `.blend` file;
- topology table;
- angle sheet;
- коротка нотатка: `чому ця topology існує`.

**Acceptance criteria:**

- кожен mesh має окреме обґрунтоване застосування;
- немає duplicate/degenerate faces;
- поведінка origin задана навмисно;
- додані секції помітно покращують shape або deformation;
- names використовують `SM_VFX_`.

# 16. Додаткова складніша вправа

## EX-L06-01-B — Сімейство silhouettes slash

**Завдання:** створи three original slash meshes:

- `Fast`;
- `Heavy`;
- `Arcane Precision`.

**Обмеження:**

- той самий topology budget із п’яти секцій;
- різні width profiles, centerlines і negative space;
- без скопійованого контуру з гри;
- endpoints remain non-degenerate;
- кожен проходить тест silhouette у 25%;
- один використовує start origin, другий — center origin, третій — contact origin.

**Deliverables:**

- three named objects;
- width/centerline table;
- wireframe + solid comparison;
- pivot/origin rationale.

**Acceptance criteria:**

- variants відрізняються структурно, а не лише scale;
- topology remains clean;
- origin відповідає запланованій animation;
- щонайменше два variants залишаються читабельними під 35°.

# 17. Три рівні підказок

## EX-L06-01-A

- **Hint 1 — напрямок мислення:** кожна additional section має відповісти «яку visible problem вона виправляє?».
- **Hint 2 — потрібні інструменти:** Plane, Loop Cut/Subdivide, Move/Scale, Face Orientation, Set Origin, solid/wireframe views.
- **Hint 3 — майже повна структура:** Card 1 = one quad center origin; Card 2 = 3 sections із middle offset; Card 3 = 4 sections із width 0.10/0.35/0.35/0.10 та origin at start.

[Повне рішення EX-L06-01-A](../EXERCISE_ANSWERS/L06-01_blender_cards_and_slash_meshes_answers.md#ex-l06-01-a)

## EX-L06-01-B

- **Hint 1 — напрямок мислення:** Fast — forward taper; Heavy — mass near contact; Precision — controlled gap/clean arc.
- **Hint 2 — потрібні інструменти:** five cross-sections, numeric width profiles, local centerline offsets, 3D Cursor й Object Origin.
- **Hint 3 — майже повна структура:** Fast widths `.05/.18/.42/.30/.06`; Heavy `.18/.45/.70/.62/.16`; Precision `.04/.26/.48/.26/.04`, з різними centerline curves й origin strategies.

[Повне рішення EX-L06-01-B](../EXERCISE_ANSWERS/L06-01_blender_cards_and_slash_meshes_answers.md#ex-l06-01-b)

# 18. Типові помилки

1. Shape створено object Scale замість mesh data без плану apply.
2. Десятки subdivisions на static card.
3. Zero-width endpoints створюють degenerate geometry.
4. Plane duplicated back-to-back.
5. Mixed face orientation.
6. Origin випадково лишився у world center.
7. Slash contour копіює proprietary reference.
8. Sections не ordered, faces crossed.
9. Curvature зроблено object rotation, а mesh лишився straight.
10. Geometry оцінюється лише front view.

# 19. Troubleshooting

| Симптом | Причина | Виправлення |
|---|---|---|
| Card не видно з expected side | Normal reversed | Face Orientation → Recalculate Outside/Flip |
| Slash має чорні/дивні faces | Overlap, duplicate vertices або normals | Merge by Distance із контрольованим threshold, recalculate, inspect |
| End виглядає blunt | Width profile завеликий | Зменш endpoint width, але не до zero |
| Arc має kink | Замало або нерівні sections | Перемісти centerline; додай section лише в kink |
| Rotation поводиться дивно | Origin неправильний | Set 3D Cursor і Origin consciously |
| Card edge-on зникає | One plane geometry | Accept/document, curve card або complementary layer |
| Wireframe dense без benefit | Overmodeling | Delete loops, повтори silhouette test |
| Proportional Editing рухає зайве | Radius/selection неконтрольовані | Disable або move sections manually |
| Faces crossed | Left/right chain order порушено | Rebuild affected quads у consistent order |

# 20. Performance considerations

- Triangle count важливий, але universal triangle budget тут не задається.
- Overdraw від translucent material часто дорожчий за кілька додаткових justified vertices; це треба виміряти пізніше.
- Extra sections виправдані, якщо покращують silhouette, UV deformation або WPO.
- Back-to-back planes можуть подвоювати surface overlap.
- Cross-cards додають angle coverage, але також overlapping translucent area.
- Long thin triangles можуть давати нестабільну interpolation/deformation.
- Degenerate faces не дають visible benefit і ускладнюють import.
- Для Low variant спочатку зберігай primary silhouette, а не micro curvature.
- У 06.03 зафіксуй triangle count до/після triangulation та UE import.

# 21. Запитання для самоперевірки

1. Чим `Object Mode` відрізняється від `Edit Mode`?
2. Коли one-quad card достатній?
3. Навіщо slash strip має кілька cross-sections?
4. Чому не варто collapse endpoint у zero-width без перевірки?
5. Що визначає face normal?
6. Назви три origin strategies для slash.
7. Коли additional topology виправдана?
8. Чому front-view test недостатній?

# 22. Відповіді

1. Object Mode змінює object transform; Edit Mode змінює mesh data в local space.
2. Коли card плоский, static і не потребує bend/WPO/vertex gradient.
3. Вони контролюють curvature, width profile, silhouette й майбутню deformation.
4. Це може створити overlapping vertices або degenerate triangles.
5. Напрямок передньої сторони surface й основу shading/orientation behavior.
6. Start, center, contact/end.
7. Коли вона visibly змінює silhouette, deformation, UV flow або vertex mask.
8. Плоский mesh може collapse edge-on і мати іншу silhouette під gameplay camera.

# 23. Self-check checklist

- [ ] Blender version записано.
- [ ] Objects мають exact names.
- [ ] Card має clean one-quad topology.
- [ ] Slash має ordered five sections.
- [ ] Endpoints non-degenerate.
- [ ] Немає duplicate faces/vertices.
- [ ] Face orientation consistent.
- [ ] Origin card centered.
- [ ] Origin slash at intended start.
- [ ] Object rotation повернено до clean state.
- [ ] Object scale target 1,1,1.
- [ ] 0°/35°/70° tests збережено.
- [ ] Proprietary contour не trace-ився.
- [ ] Topology rationale записано.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. card і slash створені без tutorial copy;
2. ти пояснюєш кожну cross-section;
3. face orientation та origin deliberate;
4. немає duplicate/degenerate geometry;
5. slash читається на 25% і щонайменше при 35°;
6. width profile відрізняє start/middle/end;
7. виконано мінімум 12 із 14 checklist пунктів.

# 25. Підсумок

VFX mesh є surface contract для material і Niagara. Найкраща topology — не найменша й не найбільша, а така, де кожний vertex має видиму роботу: silhouette, curve, deformation або mask. Card і slash повинні мати clean normals, predictable origin і documented camera limits.

# 26. Зв’язок із наступними уроками

У `02_blender_cones_rings_beams_and_debris.md` ти розшириш kit об’ємними й модульними shapes: cone, ring, beam і debris. У 06.03 весь kit отримає UV, normals, vertex colors, pivots, triangulation, FBX export і UE validation.

# 27. Офіційні джерела

- Blender Foundation. [Blender Reference Manual](https://docs.blender.org/manual/en/latest/). Rolling documentation; фіксуй installed version.
- Blender Foundation. [Mesh Primitives](https://docs.blender.org/manual/en/latest/modeling/meshes/primitives.html). Plane та інші base meshes.
- Blender Foundation. [Meshes](https://docs.blender.org/manual/en/latest/modeling/meshes/index.html). Поточний hub для mesh structure, vertices, edges, faces і topology.
- Blender Foundation. [Editing Meshes](https://docs.blender.org/manual/en/latest/modeling/meshes/editing/index.html). Editing operations.
- Epic Games. [Static Meshes](https://dev.epicgames.com/documentation/en-us/unreal-engine/static-meshes). UE 5.8; production context для external DCC meshes.

# 28. Рекомендовані скриншоти або схеми

```text
Рекомендований скриншот 1:
Що відкрити: Blender із one-quad card у Edit Mode.
Що повинно бути видно: 4 vertices, 4 edges, 1 face, center origin.
Яку область виділити: різницю mesh data й object origin.
```

```text
Рекомендована схема 2:
Що показати: five-section slash strip L0–L4/R0–R4.
Що повинно бути видно: width profile і centerline.
Яку область виділити: non-zero tapered endpoints.
```

```text
Рекомендований скриншот 3:
Що відкрити: Face Orientation overlay.
Що повинно бути видно: consistent front side card/slash.
Яку область виділити: duplicate із flipped normal для contrast.
```

```text
Рекомендована схема 4:
Що показати: same slash із start/center/contact origin.
Що повинно бути видно: різні rotation arcs.
Яку область виділити: intended Niagara placement use.
```

```text
Рекомендований скриншот 5:
Що відкрити: solid і wireframe angle sheet 0°/35°/70°.
Що повинно бути видно: де plane collapse.
Яку область виділити: topology, яка реально змінює silhouette.
```
