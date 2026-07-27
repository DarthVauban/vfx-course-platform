# 1. Назва

## Урок 06.03 — UV, normals, Vertex Color, pivots, transforms і FBX pipeline

# 2. Результат уроку

Після уроку ти зможеш:

- створити UV Channel 0 для card, slash, cone, ring, beam і debris;
- орієнтувати UV відповідно до material flow;
- знаходити flipped, stretched і overlapping UV;
- пояснити face normals і виправити reversed orientation;
- створити Blender `Color Attribute` як VFX mask;
- розмістити origin/pivot відповідно до intended motion;
- привести object transforms до контрольованого стану;
- зафіксувати triangulation перед export;
- експортувати selected meshes як standard `.fbx`;
- імпортувати й перевірити Static Meshes у UE 5.8;
- довести, що scale, orientation, UV, normals, pivot і Vertex Color реально збереглися.

Ключовий deliverable — `VFX_Geometry_Kit.fbx`, UE validation map і delivery report для всього kit.

# 3. Орієнтовний час

**5 годин: 1 година теорії та 4 години практики.**

| Частина | Час |
|---|---:|
| Ментальна модель UV/normals/color/pivot | 1 год |
| Workflow UV | 1 год 10 хв |
| Normals, Vertex Color, transforms і triangulation | 1 год |
| Export FBX і перевірка в UE | 1 год 15 хв |
| Вправи, self-check і журнал | 35 хв |

# 4. Передумови

- Завершено 06.01–06.02.
- Є meshes card/slash/cone/ring/beam/debris.
- Пройдено Material blocks і є базове розуміння `TextureCoordinate`, `Vertex Color`, `Unlit`, `Emissive Color`.
- Є simple UV checker texture.
- Є UE 5.8 VFX test project.

# 5. Нові терміни

| Термін | Пояснення |
|---|---|
| **UV Coordinates** | 2D-координати, що визначають mapping texture на surface |
| **UV Island** | Зв’язана область faces у UV space |
| **Seam** | Позначений cut, по якому surface розгортається |
| **Texel direction** | Напрямок texture pattern уздовж mesh |
| **UV stretching** | Нерівномірне distortion texture через mapping |
| **Normal** | Unit vector, перпендикулярний surface |
| **Face Orientation** | Напрямок front/back для faces |
| **Shade Flat** | Окреме face shading без smooth interpolation між faces |
| **Color Attribute** | Per-vertex або per-corner color data в mesh |
| **Domain** | Де зберігається attribute: Point, Face Corner тощо |
| **Object Transform** | Location, Rotation і Scale контейнера object |
| **Apply Transform** | Перенесення transform у data зі скиданням displayed transform |
| **Triangulation** | Перетворення polygons на triangles |
| **FBX** | Exchange format для mesh pipeline |
| **Import validation** | Перевірка asset після фактичного UE import |
| **Round-trip evidence** | Доказ Blender → FBX → UE, а не лише screenshot Blender |

# 6. Навіщо ця тема потрібна VFX artist

Mesh може виглядати правильно в Blender і бути непридатним у UE:

- texture рухається поперек beam;
- slash перевернуто;
- ring UV має seam у focal area;
- normals інвертовано;
- pivot обертає effect навколо wrong point;
- scale неочікуваний;
- importer triangulates інакше;
- Vertex Color не зберігся;
- окремі meshes імпортуються як один.

Production asset готовий не тоді, коли натиснуто export, а коли його перевірено в цільовому engine.

# 7. Теорія простими словами

У кожного mesh є кілька незалежних contracts:

```text
Geometry contract: silhouette і triangles
UV contract: де 0–1 texture лежить на surface
Normal contract: яка сторона front і як shading interpolates
Attribute contract: які per-vertex masks доступні
Pivot contract: як asset transforms/spawns
Scale/axis contract: який розмір і напрямок отримає UE
```

FBX лише переносить data. Він не виправляє неправильний contract. Тому спочатку перевіряй Blender, потім FBX settings, потім UE.

# 8. Детальні технічні пояснення

## 8.1. UV 0–1 space

UV-квадрат:

```text
U: 0 left → 1 right
V: 0 bottom → 1 top
```

Texture flow має відповідати запланованому напрямку material.

Для slash/beam:

- `U` часто йде source→target;
- `V` — across width.

Але convention можна змінити, якщо всю систему material задокументовано. Не обертай islands випадково.

## 8.2. Planar card/slash UV

Для плоского mesh:

1. розташуй view перпендикулярно до surface;
2. вибери faces;
3. `Project from View` або `Project from View (Bounds)`;
4. розташуй source в U=0, target в U=1;
5. перевір checker.

`Bounds` заповнює діапазон 0–1, але може змінити aspect ratio. Якщо texture має зберігати геометричні пропорції, масштабуй island вручну й задокументуй це.

## 8.3. Cone/frustum UV

Бічна surface потребує одного longitudinal seam:

1. познач один edge chain від base до top;
2. вибери side faces;
3. `Unwrap`;
4. отримай прямокутний або трапецієподібний island;
5. перевір розташування seam.

Caps, якщо вони є, стають окремими islands. У core cone caps прибрані.

## 8.4. Ring UV

Для регулярного quad annulus:

- познач або відкрий один radial seam;
- використай unwrap method, що зберігає quad flow;
- спрямуй circumference уздовж U;
- спрямуй ширину ring уздовж V;
- за можливості розмісти seam подалі від основного camera/contact.

`Follow Active Quads` може допомогти з regular strip. Точний workflow залежить від topology та версії Blender.

## 8.5. Debris UV

Для простого debris:

- познач seams уздовж менш видимих edges;
- розгорни islands;
- або використай `Smart UV Project` як початкову точку, але перевір результат;
- нормалізуй scale islands лише якщо material потребує узгодженої texel density;
- для stylized mask texture іноді важливішим є вручну спрямований island.

## 8.6. Checker validation

Квадрати checker:

- витягнутий прямокутник → UV distortion;
- різні розміри квадратів → різна texel density;
- віддзеркалений текст або стрілка → island перевернуто або віддзеркалено;
- стрибок seam в основній області → проблема розташування seam.

UV overlap допустимий лише навмисно. Наприклад, ідентичні debris faces можуть спільно використовувати texture, але потреби Vertex Color/motion можуть вимагати унікального mapping.

## 8.7. Normals

Face normal має напрямок. Для відкритих card/slash:

- front side визначено навмисно;
- `Face Orientation` узгоджена;
- `Recalculate Outside` може бути неоднозначним для відкритих surfaces, тому перевіряй результат, а не довіряй автоматично;
- застосуй `Flip` до вибраних faces, якщо потрібен протилежний напрямок.

Для закритого debris `Recalculate Outside` зазвичай має чіткіше значення.

## 8.8. Flat vs smooth

- `Shade Flat`: faceted debris або ring/cone з малою кількістю sides зберігає грані.
- `Shade Smooth`: інтерполює shading; може зробити cone візуально плавним, але не змінює silhouette.

У VFX часто використовують Unlit materials, але normals усе одно можуть впливати на facing, lighting в альтернативних materials або engine diagnostics. Не ігноруй їх.

## 8.9. Vertex Color / Color Attribute

Створи attribute:

```text
Name: VFXMask
Domain: Point
Data type: Byte Color або current equivalent
```

Рекомендований контракт каналів:

- R: source→target gradient;
- G: edge/width mask;
- B: random/section variation;
- A: reserved/full 1 unless needed.

У цьому уроці створи R gradient.

`Point` зберігає одне значення на vertex. `Face Corner` може зберігати різні значення для того самого vertex на різних faces. Точні domains/types залежать від версії Blender.

## 8.10. Vertex gradient

Для beam із п’ятьма секціями:

```text
R = 0.00, 0.25, 0.50, 0.75, 1.00
```

Обидва vertices у кожному cross-section отримують однакове R. У debug material UE gradient має йти від source до target.

## 8.11. Pivot/origin

Origin object у Blender відповідає очікуваному imported pivot, але settings importer/transform можуть впливати на результат. Перевір:

- card center;
- slash start;
- cone base;
- ring center;
- beam source;
- debris center/contact.

За потреби додай тимчасовий orientation marker mesh лише для validation export; не включай його до фінальної поставки.

## 8.12. Object transforms

Цільовий стан перед export:

```text
Rotation: 0,0,0
Scale: 1,1,1
```

Використовуй `Apply Rotation & Scale` лише після:

- збереження source-версії;
- підтвердження origin;
- перевірки modifiers/children;
- розуміння наслідків зміни.

Застосування Location зазвичай змінює зв’язок origin/data небажаним чином; тут це не є вимогою за замовчуванням.

## 8.13. Scale and axes

Не покладайся лише на пам’ять. Створи validation-набір:

- один reference cube із відомим розміром один метр;
- одну arrow/triangle, що показує запланований forward;
- одну plane, що показує front normal;
- фактичні VFX meshes.

Виконай export/import і вимірювання в UE. Коректний тест надійніший за скопійовану пораду щодо axis.

Поширена початкова convention Blender FBX для Unreal workflows може використовувати `Forward -Y` і `Up Z`, але поведінку exporter/importer та шлях проєкту потрібно перевірити.  
**Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.14. Triangulation

Real-time meshes складаються з triangles. Збережи редагований quad source, а потім:

1. дублюй delivery mesh або використай `Triangulate Modifier`;
2. перевір diagonals;
3. порівняй результат deformation/UV/normal;
4. застосуй або зафіксуй контрольовану triangulation для delivery copy, якщо цього потребує pipeline;
5. запиши кількість triangles.

Не виконуй triangulation наосліп до редагування й не залишай результат повністю невідомим.

## 8.15. FBX export

Безпечний baseline:

1. вибери лише delivery objects;
2. `File > Export > FBX (.fbx)`;
3. увімкни export лише вибраного;
4. додай object type `Mesh`;
5. виключи cameras/lights/empties, якщо validation marker не додано навмисно;
6. застосовуй modifiers лише після перевірки;
7. задай початкові значення transform/axis;
8. експортуй стандартний `.fbx`.

Epic документує pipeline FBX 2020.2. Implementation/version exporter Blender є окремим фактором; перевір сумісність із фактичним файлом.

## 8.16. UE import

UE 5.8 може показувати legacy FBX або UI на основі Interchange залежно від проєкту/configuration. Не змішуй інструкції.

Намір baseline:

- import як Static Mesh;
- окремі objects, якщо `Combine` не ввімкнено навмисно;
- без skeletal import;
- без generated collision для VFX mesh, якщо вона явно не потрібна;
- вибір import normals/tangents задокументовано;
- import scale 1.0 як початкове значення;
- auto-import material/texture вимкнено, якщо він не потрібен.

Точні importer, labels, defaults і поведінка:  
**Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.17. UE validation

Для кожного asset:

- dimensions;
- orientation forward/up;
- rotation pivot;
- кількість triangles;
- checker UV Channel 0;
- normal front/back;
- debug Vertex Color;
- окремий naming asset;
- bounds;
- вигляд material.

Не став позначку pass лише за thumbnail.

# 9. Візуальні або математичні приклади

## 9.1. UV mapping beam

```text
source section → U=0
middle         → U=0.5
target section → U=1
left edge      → V=0
right edge     → V=1
```

Якщо convention material збігається, Panner уздовж +U рухається від source до target.

## 9.2. Vertex Color interpolation

Між секціями R=0.25 і R=0.50 rasterized surface інтерполює проміжні значення. Це створює плавний gradient без додаткової texture з урахуванням vertex density.

## 9.3. Scale check

Якщо reference object Blender із запланованим розміром 1 м імпортується в UE з неочікуваним розміром, не виправляй кожен asset довільним `Import Uniform Scale`. Виправ або задокументуй pipeline і протестуй повторно.

## 9.4. Triangle count

Slash із п’ятьма секціями:

```text
4 quads × 2 triangles = 8 triangles
```

Ring із 16 quads:

```text
16 × 2 = 32 triangles
```

Підтвердь фактичне значення після export/import.

# 10. Контрольовані експерименти

## Експеримент 1 — Напрямок UV

Застосуй arrow checker до beam. Створи duplicate з island, повернутим на 90°.

**Очікування:** ідентичні mesh/material мають різний flow; orientation UV є контрактом.

## Експеримент 2 — Перевертання normal

Дублюй card, переверни normal та імпортуй обидва варіанти.

**Очікування:** поведінка front/back відрізняється залежно від material/settings. Зафіксуй результат, не вгадуй.

## Експеримент 3 — Vertex density

Порівняй card з одним quad і beam із п’ятьма секціями та gradient R.

**Очікування:** один quad інтерполює лише між endpoints; більша кількість секцій дає змогу формувати gradient.

## Експеримент 4 — Діагональ triangulation

На вигнутому quad порівняй два напрямки diagonal.

**Очікування:** interpolation/silhouette можуть відрізнятися; контрольована triangulation важлива для non-planar геометрії.

## Експеримент 5 — Marker axis/scale

Експортуй reference розміром один метр і forward arrow до повного kit.

**Очікування:** orientation/scale pipeline підтверджено емпірично.

# 11. Покрокова guided practice

## Етап 1 — Збережи source/delivery

```text
L06_03_geometry_source.blend
L06_03_geometry_delivery.blend
```

Не руйнуй source quads або історію modifiers.

## Етап 2 — UV card/slash/beam

1. Відкрий workspace `UV Editing`.
2. Вибери faces card.
3. Вирівняй view перпендикулярно.
4. Використай `U > Project from View (Bounds)` як початкову точку.
5. Спрямуй arrow: source U=0 → target U=1.
6. Повтори для slash і beam.
7. Застосуй checker.
8. Виправ stretch/mirror.

## Етап 3 — UV cone

1. Познач один longitudinal seam.
2. Вибери side faces.
3. `U > Unwrap`.
4. Поверни island так, щоб довжина відповідала задокументованому напрямку U або V.
5. Перемісти seam подалі від основного view.
6. Перевір checker.

## Етап 4 — UV ring

1. Познач один radial seam.
2. Вибери quads ring.
3. Використай `Follow Active Quads` або регулярний unwrap, що відповідає topology.
4. Circumference уздовж U, width уздовж V.
5. Перевір рівність сегментів за checker.

## Етап 5 — UV debris

1. Познач seams на малопомітних edges.
2. Виконай `Unwrap` або контрольований `Smart UV Project`.
3. Запакуй islands.
4. Перевір scale/stretch.
5. Не допускай overlap, якщо його не задокументовано.

## Етап 6 — Normals

Для кожного asset:

1. `Face Orientation`.
2. Перевір відкриті surfaces вручну.
3. Для закритого debris: `Recalculate Outside`.
4. Використовуй `Flip` лише для вибраних неправильних faces.
5. Обирай `Shade Flat`/`Shade Smooth` свідомо.

## Етап 7 — Color Attribute

1. Вибери beam/slash.
2. У mesh data `Color Attributes` додай `VFXMask`.
3. Domain `Point`; data type, придатний для зберігання color.
4. Перейди до `Vertex Paint`.
5. Признач gradient R за секціями: 0/.25/.5/.75/1.
6. Для простого тесту залиш G/B=0, A=1.
7. Перевір preview attribute.

Точні names/types panel залежать від версії Blender.

## Етап 8 — Origins

Задай:

```text
Card center
Slash start
Cone base
Ring center
Beam source
Debris center
```

Виконай тестове обертання кожного object, потім зроби reset.

## Етап 9 — Apply transforms

1. Збережи файл.
2. Перейди в Object Mode.
3. Перевір Location/Rotation/Scale у N-panel.
4. За потреби використай `Object > Apply > Rotation & Scale` на delivery copies.
5. Підтвердь Rotation 0, Scale 1.
6. Повторно перевір dimensions/origin.

## Етап 10 — Triangulation delivery copies

1. Додай `Triangulate Modifier` або виконай triangulation duplicate в Edit Mode.
2. Перевір diagonals.
3. Застосуй лише до delivery copy.
4. Запиши кількість triangles.
5. Повторно перевір UV/attribute.

## Етап 11 — Тестовий export FBX

Для першого export використай лише:

- reference cube;
- forward arrow;
- card.

Рекомендовані початкові fields:

```text
Selected Objects: enabled
Object Types: Mesh
Forward: -Y
Up: Z
Apply Modifiers: enabled if modifiers reviewed
```

Точні labels/options Blender FBX залежать від установленої версії.

## Етап 12 — Тестовий import в UE

Імпортуй до:

```text
/Game/VFX/Geometry/Validation/
```

Визнач, чи проєкт використовує шлях FBX або Interchange, і зафіксуй screenshot.  
**Потребує ручної перевірки в Unreal Engine 5.8.**

Перевір reference size, напрямок arrow і front card. Якщо тест не пройдено, зміни одну export/import variable і протестуй повторно.

## Етап 13 — Export/import повного kit

Експортуй `VFX_Geometry_Kit.fbx`. Імпортуй як окремі Static Meshes. Для цього тесту уникай автоматично створених materials/textures.

## Етап 14 — Debug material для UV

Використай наявну checker texture і простий Unlit material:

```text
Material Domain: Surface
Blend Mode: Opaque
Shading Model: Unlit
TextureSample RGB → Emissive Color
TextureCoordinate → TextureSample UVs
```

Застосуй до кожного mesh.

## Етап 15 — Debug material для Vertex Color

```text
Material Domain: Surface
Blend Mode: Opaque
Shading Model: Unlit
Vertex Color RGB → Emissive Color
```

Застосуй і перевір червоний gradient від source до target.

Точні labels property material UE і результати пошуку nodes:  
**Потребує ручної перевірки в Unreal Engine 5.8.**

## Етап 16 — Delivery report

| Asset | Scale | Axis | Pivot | UV0 | Normal | VFXMask | Tris | Результат |
|---|---|---|---|---|---|---|---:|---|
|  |  |  |  |  |  |  |  |  |

# 12. Точні назви nodes, modules і settings

### Blender

- `UV Editing`
- `Mark Seam`
- `Unwrap`
- `Project from View`
- `Project from View (Bounds)`
- `Follow Active Quads`
- `Smart UV Project`
- `Average Islands Scale`
- `Pack Islands`
- `Face Orientation`
- `Recalculate Outside`
- `Flip`
- `Shade Flat`
- `Shade Smooth`
- `Color Attributes`
- `Vertex Paint`
- `Object > Apply > Rotation & Scale`
- `Triangulate Modifier`
- `File > Export > FBX (.fbx)`
- `Selected Objects`
- `Object Types: Mesh`
- `Forward`
- `Up`
- `Apply Modifiers`

Labels/options UI Blender залежать від версії; запиши встановлену версію.

### Unreal Engine 5.8

- `Static Mesh`
- `Static Mesh Editor`
- `UV Channel 0`
- `Import Uniform Scale`
- `Normal Import Method`
- `Combine Meshes`
- `Generate Missing Collision`
- `Material Domain`
- `Blend Mode`
- `Shading Model`
- `Unlit`
- `TextureCoordinate`
- `Texture Sample`
- `Vertex Color`
- `Emissive Color`

Labels/defaults importer/nodes:  
**Потребує ручної перевірки в Unreal Engine 5.8.**

# 13. Стартові значення параметрів

| Параметр | Початкове значення |
|---|---|
| UV channel | UV0 |
| Card/slash/beam | Source U=0, target U=1 |
| Ring | Circumference U, width V |
| Cone | Довжину задокументовано вздовж однієї осі UV |
| VFXMask domain | Point |
| VFXMask R | Секції 0/.25/.5/.75/1 |
| VFXMask G/B | 0 |
| VFXMask A | 1 |
| Object Rotation | Цільове delivery-значення 0,0,0 |
| Object Scale | Цільове delivery-значення 1,1,1 |
| Вибір для FBX | Лише вибрані Mesh objects |
| Тест Forward/Up | Початкова гіпотеза -Y / Z |
| UE Import Uniform Scale | Початкове значення 1.0 |
| Collision | Вимкнено / не генерується для перевірки VFX |
| Debug material | Surface/Opaque/Unlit |

Вибір axis/import лишається гіпотезою до перевірки.  
**Потребує ручної перевірки в Unreal Engine 5.8.**

# 14. Очікуваний результат кожного етапу

| Етап | Результат |
|---|---|
| UV плоских meshes | Checker вирівняно від source до target |
| UV cone/ring | Один контрольований seam, без twist |
| UV debris | Запаковано, читабельно, overlap задокументовано |
| Normals | Заплановані front/outside |
| VFXMask | Червоний gradient видно в Blender |
| Origins | Обертання навколо запланованого source/contact |
| Transforms | Delivery rotation 0, scale 1 |
| Triangulation | Відомі diagonals/count |
| Тест FBX | Коректні scale/axis/front |
| Повний import | Окремі іменовані Static Meshes |
| Debug UV | Checker відповідає Blender |
| Debug Vertex Color | Gradient R збережено |
| Звіт | Кожне поле спирається на докази |

# 15. Самостійна вправа

## EX-L06-03-A — Повний delivery package

**Завдання:** підготуй card, slash, cone, ring, beam і three debris meshes до production handoff.

**Обмеження:**

- UV0 на кожному mesh;
- свідомо налаштовані normals;
- задокументовані origins;
- чисті Rotation/Scale;
- контрольована triangulation;
- gradient R VFXMask на slash/beam;
- standard `.fbx`;
- фактична перевірка в UE 5.8;
- без plugin Substance або auto repair.

**Матеріали для здачі:**

- source `.blend`;
- delivery `.blend`;
- `.fbx`;
- screenshot validation map UE;
- UV checker sheet;
- Vertex Color sheet;
- delivery report.

**Критерії приймання:**

- scale/orientation перевірено marker;
- UV від source до target коректний;
- normals/front коректні;
- pivots поводяться як заплановано;
- кількість triangles записано;
- Vertex Color збережено;
- окремі meshes і names коректні.

# 16. Додаткова складніша вправа

## EX-L06-03-B — Внесення й діагностика несправностей

**Завдання:** створи duplicate test assets із п’ятьма faults:

1. повернутий UV;
2. перевернута normal;
3. неправильний origin;
4. незастосований non-uniform scale;
5. відсутній або перевернутий VFXMask.

Виконай import, спершу діагностуй без відкриття Blender, потім виправ source і зроби reimport.

**Обмеження:**

- одна несправність на asset;
- задокументуй symptom→hypothesis→test→root cause→fix;
- без довільного виправлення через Import Uniform Scale;
- reimport має довести виправлення source.

**Матеріали для здачі:**

- п’ять несправних assets;
- таблиця діагностики;
- screenshots UE до/після;
- виправлений FBX/reimport.

**Критерії приймання:**

- усі п’ять першопричин правильно визначено;
- виправлення виконано на правильному етапі pipeline;
- жодну несправність не приховано workaround через Two Sided/material;
- докази підтверджують reimport.

# 17. Три рівні підказок

## EX-L06-03-A

- **Hint 1 — напрямок мислення:** перевіряй contracts окремо: geometry→UV→normal→attribute→pivot→scale/axis→triangulation.
- **Hint 2 — потрібні інструменти:** UV checker, Face Orientation, Color Attributes/Vertex Paint, Apply Rotation & Scale, Triangulate, FBX selection export, UE debug materials.
- **Hint 3 — майже повна структура:** flat Project from View; cone longitudinal seam; ring radial seam; VFXMask R 0→1; origin by function; test cube/arrow/card first; then full import report.

[Повне рішення EX-L06-03-A](../EXERCISE_ANSWERS/L06-03_uv_normals_vertex_color_and_fbx_export_answers.md#ex-l06-03-a)

## EX-L06-03-B

- **Hint 1 — напрямок мислення:** не виправляй symptom; знайди, який contract порушено.
- **Hint 2 — потрібні інструменти:** checker arrow, one-sided debug material, pivot rotation, dimension comparison, Vertex Color debug.
- **Hint 3 — майже повна структура:** wrong checker direction→UV; missing face→normal; orbit wrong→origin; size/rotation inconsistency→transform/axis; black gradient→attribute/export/import.

[Повне рішення EX-L06-03-B](../EXERCISE_ANSWERS/L06-03_uv_normals_vertex_color_and_fbx_export_answers.md#ex-l06-03-b)

# 18. Типові помилки

1. UV checker не використано.
2. Panner direction planned без documented U axis.
3. `Recalculate Outside` без перевірки застосовано до відкритої card.
4. Color Attribute name/domain змінюється між assets.
5. Origin correct visually in Blender, але не validated UE.
6. Non-uniform scale залишено без пояснення.
7. Apply transforms руйнує source без резервної копії.
8. Triangulation повністю залишено на importer.
9. Повний kit експортовано до перевірки одного test marker.
10. Неправильний import scale виправляється окремо для кожного asset.
11. Інструкції legacy FBX та Interchange змішано.
12. Two Sided приховує помилку normal.
13. Збереження Vertex Color припускається без debug material.

# 19. Усунення несправностей

| Симптом в UE | Імовірно порушений контракт | Тест | Виправлення |
|---|---|---|---|
| Texture рухається поперек beam | Напрямок UV | Arrow checker | Повернути або перебудувати UV island |
| Card невидима спереду | Normal/import | Односторонній debug, Face Orientation | Виправити source normal або вибір import |
| Mesh завеликий або замалий | Scale/units/import | Розміри reference cube | Виправити задокументований pipeline і повторити export |
| Mesh спрямовано неправильно | Axis | Marker forward arrow | Змінити одне setting axis і повторити тест |
| Обертання відбувається по орбіті | Origin/pivot | Обертання в UE | Виправити origin у Blender і зробити reimport |
| Checker розтягується | UV | Квадратний checker | Повторити unwrap або scale island |
| Seam ring стрибає | UV seam | Panner/checker | Перемістити seam або вирівняти кінці UV |
| Vertex Color чорний | Attribute/export/import/material | Preview Blender + debug Vertex Color в UE | Перевірити name/domain/data/export/reimport |
| Діагональ shading відрізняється | Triangulation | Порівняння wireframe/normal | Контролювати triangulation у delivery |
| Assets об’єднані | Опція import/export scene | Звіт import | Вимкнути Combine або експортувати окремо |

Деталі importer, що залежать від версії:  
**Потребує ручної перевірки в Unreal Engine 5.8.**

# 20. Міркування щодо performance

- Якісний UV може дати змогу використовувати простіші materials/textures і менше corrective layers.
- Vertex Color може замінити окрему mask texture для деяких controls, але interpolation залежить від vertex density.
- Додаткові vertices лише заради masks можуть бути виправданими, але вимірюй загальну кількість instances.
- Контрольована triangulation запобігає неочікуваним deformation/shading, але не обов’язково знижує вартість.
- Генерація collision не потрібна для більшості суто візуальних meshes.
- Автоматично створені materials/textures засмічують content і можуть приховати контракт import.
- Two Sided може збільшити rendering work; не використовуй його для маскування неправильних normals.
- Помилки великих bounds/pivot можуть згодом погіршити culling.
- Розмір файлу FBX не дорівнює runtime cost.
- Фактичну вартість mesh/material/overdraw вимірюй після інтеграції Niagara.

# 21. Запитання для самоперевірки

1. Який UV direction рекомендовано документувати для beam?
2. Навіщо cone має longitudinal seam?
3. Коли UV overlap допустимий?
4. Чому `Recalculate Outside` не завжди достатній для open plane?
5. Що зберігає Color Attribute domain `Point`?
6. Навіщо test cube й forward arrow?
7. Чому треба контролювати triangulation?
8. Що доводить UE Vertex Color debug material?
9. Чому не слід змішувати FBX та Interchange instructions?
10. Коли delivery pass вважається завершеним?

# 22. Відповіді

1. Source→target, наприклад U=0→1, якщо це material convention.
2. Щоб розрізати side surface й розгорнути її без twist.
3. Коли deliberate sharing не конфліктує з directional texture/unique masks.
4. Open surface не має однозначного inside/outside; front треба inspect.
5. Одне color value per vertex, що interpolates across faces.
6. Емпірично перевірити scale й axes до full kit.
7. Quad diagonal може змінити interpolation/deformation/shading.
8. Що attribute пережив Blender→FBX→UE й читається material node.
9. Це різні importer paths/UI/defaults; змішування руйнує reproducibility.
10. Коли scale, axis, pivot, UV, normal, attribute, triangles і names перевірені в UE evidence report.

# 23. Checklist самоперевірки

- [ ] UV0 є на кожному mesh.
- [ ] Напрямок UV задокументовано.
- [ ] Checker не має ненавмисного stretch/mirror.
- [ ] Seams cone/ring контрольовані.
- [ ] Normals налаштовані свідомо.
- [ ] Точне name VFXMask узгоджене.
- [ ] Gradient R перевірено в Blender.
- [ ] Origins відповідають використанню.
- [ ] Delivery Rotation 0.
- [ ] Delivery Scale 1.
- [ ] Triangulation перевірено.
- [ ] Спочатку імпортовано test cube/arrow/card.
- [ ] Шлях importer UE записано.
- [ ] Повний kit імпортується окремо.
- [ ] UV checker перевірено в UE.
- [ ] Vertex Color перевірено в UE.
- [ ] Кількість triangles записано.
- [ ] Delivery report завершено.

# 24. Критерії опанування

Урок засвоєно, якщо:

1. повний kit витримує round trip;
2. кожне виправлення axis/scale має пояснення;
3. flow UV підтримує запланований напрямок material;
4. normals/pivots поводяться коректно;
5. VFXMask збережено;
6. triangulation/count відомі;
7. шлях importer і твердження, залежні від версії, позначено;
8. пройдено щонайменше 16 із 18 пунктів checklist.

# 25. Підсумок

Export не є кнопкою; це chain of contracts. UV, normal, attribute, pivot, scale, axes і triangulation треба перевірити окремо. One-meter marker, forward arrow, UV checker і Vertex Color debug перетворюють припущення на evidence.

# 26. Зв’язок із наступними уроками

У `04_substance_graphs_noise_gradients_and_masks.md` ти почнеш Substance 3D Designer із graph fundamentals і створиш procedural grayscale masks. У 06.05 ці masks стануть standard bitmap library, будуть packed, imported і validated у UE materials без стороннього plugin.

# 27. Офіційні джерела

- Blender Foundation. [UV Unwrapping](https://docs.blender.org/manual/en/latest/modeling/meshes/uv/unwrapping/index.html).
- Blender Foundation. [Apply Object Transforms](https://docs.blender.org/manual/en/latest/scene_layout/object/editing/apply.html).
- Blender Foundation. [Triangulate Modifier](https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/triangulate.html).
- Blender Foundation. [Mesh Object Data and Color Attributes](https://docs.blender.org/manual/en/latest/modeling/meshes/properties/object_data.html).
- Blender Foundation. [FBX Import/Export](https://docs.blender.org/manual/en/latest/addons/import_export/scene_fbx.html).
- Epic Games. [Importing Static Meshes](https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-static-meshes-in-unreal-engine). UE 5.8.
- Epic Games. [FBX Static Mesh Pipeline](https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-static-mesh-pipeline-in-unreal-engine). UE 5.8; Epic documents FBX 2020.2.
- Epic Games. [Interchange Import Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/interchange-import-reference-in-unreal-engine). UE 5.8.

# 28. Рекомендовані скриншоти або схеми

```text
Рекомендований скриншот 1:
Що відкрити: UV Editing with beam and arrow checker.
Що повинно бути видно: source U=0, target U=1.
Яку область виділити: Panner direction contract.
```

```text
Рекомендований скриншот 2:
Що відкрити: cone/ring UV islands.
Що повинно бути видно: one longitudinal/radial seam.
Яку область виділити: no twist and consistent checker.
```

```text
Рекомендований скриншот 3:
Що відкрити: Blender Color Attribute preview.
Що повинно бути видно: R gradient 0→1 by sections.
Яку область виділити: exact `VFXMask` name/domain.
```

```text
Рекомендована схема 4:
Що показати: Blender source → delivery → FBX → UE validation.
Що повинно бути видно: each contract checkpoint.
Яку область виділити: test cube/arrow/card before full kit.
```

```text
Рекомендований скриншот 5:
Що відкрити: UE Static Mesh/validation map.
Що повинно бути видно: UV checker, Vertex Color material, pivot rotation.
Яку область виділити: dimensions/triangles/UV0 evidence.
```
