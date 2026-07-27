# 1. Назва

## Урок 06.02 — Cones, rings, beams і simple debris у Blender

# 2. Результат уроку

Після уроку ти зможеш:

- обрати між plane, cone, ring, beam і debris за функцією effect;
- створити low-sided cone/frustum для radial або directional volume;
- побудувати annulus ring strip без overlapping surfaces;
- створити single-card і cross-card beam variants;
- зробити кілька low-poly debris silhouettes без sculpting;
- задавати topology за silhouette, deformation і camera, а не за звичкою;
- організувати modular VFX geometry kit;
- підготувати assets до UV/normals/export уроку 06.03.

Ключовий результат — `SM_VFX_Cone_01`, `SM_VFX_Ring_01`, `SM_VFX_Beam_01` і три `SM_VFX_Debris_*` meshes.

# 3. Орієнтовний час

**5 годин: 1 година теорії та 4 години практики.**

| Частина | Час |
|---|---:|
| Shape-to-function theory | 1 год |
| Controlled experiments | 35 хв |
| Guided cone і ring | 1 год 15 хв |
| Guided beam і debris | 1 год 25 хв |
| Вправи, self-check і журнал | 45 хв |

# 4. Prerequisites

- Завершено 06.01.
- Умієш працювати в `Object Mode` і `Edit Mode`.
- Умієш перевірити Face Orientation та object origin.
- Розумієш, чому topology має виправдовувати silhouette/deformation.

# 5. Нові терміни

| Термін | Пояснення |
|---|---|
| **Cone** | Surface, що звужується від base до apex або smaller cap |
| **Frustum** | Cone зі зрізаною верхівкою |
| **Radial segment count** | Кількість sides навколо cone/ring |
| **Annulus** | Плоска ring surface між outer й inner loops |
| **Cross-card** | Дві planes, що перетинаються для volume from more angles |
| **Beam axis** | Локальна вісь від source до target |
| **Debris silhouette** | Зовнішня форма chunk, важливіша за дрібну surface detail |
| **Manifold expectation** | Чи має mesh бути closed volume; VFX meshes часто intentionally open |
| **Internal face** | Face, яка опинилася всередині mesh і не потрібна |
| **Radial topology** | Vertices/edges, організовані навколо center |
| **Profile** | Зміна radius/width уздовж axis |
| **Geometry kit** | Невелика бібліотека reusable meshes із чіткими use cases |

# 6. Навіщо ця тема потрібна VFX-фахівцю

Sprite не вирішує всі задачі. Mesh потрібен, коли effect має:

- зберігати volume під camera movement;
- формувати cone of influence;
- лежати на ground;
- тягнутися між source і target;
- обертатися як debris/shards;
- використовувати Vertex Color/WPO по surface.

Водночас VFX artist не повинен перетворювати цей блок на hard-surface modelling course. Мета — швидко створити чисті, прості, передбачувані surfaces.

# 7. Теорія простими словами

Обирай mesh за question:

- потрібна плоска texture? — card;
- потрібен widening volume? — cone/frustum;
- потрібна ground або radial wave? — ring;
- потрібен source→target shape? — beam;
- потрібне обертання й material chunk? — debris.

Потім обирай найменшу radial/longitudinal density, де silhouette не ламається на expected camera. Круг із 64 sides не завжди кращий за 12-sided ring: stylized effect може виграти від faceted silhouette.

# 8. Детальні технічні пояснення

## 8.1. Cone і frustum

Параметри:

- base radius;
- top radius;
- depth/length;
- radial segments;
- caps або open ends;
- origin;
- local axis.

Для VFX часто корисний open frustum:

- material видно на side surface;
- cap не створює зайву overlap area;
- top radius не zero, тому немає apex degeneracy;
- UV уздовж length простіша.

Starter:

```text
segments = 12
base radius = 0.50
top radius = 0.08
length = 1.50
```

Це навчальний starting point, не universal geometry budget.

## 8.2. Annulus ring

Ring — дві edge loops:

```text
Outer radius R
Inner radius r
width = R - r
```

Starter:

```text
R = 1.0
r = 0.72
width = 0.28
segments = 16
```

Для ground shockwave ring може бути flat. Для volume — додай slight height/profile тільки якщо silhouette/camera потребує.

Не залишай n-gon cap під annulus. Потрібна лише strip surface між loops.

## 8.3. Ring construction

Beginner-safe:

1. Додай Circle без fill.
2. Виконай Extrude вибраного loop на місці.
3. Масштабуй дубльований loop усередину.
4. Отримати faces між outer й inner loops.
5. Перевірити normal direction.

Якщо `Extrude` випадково перемістив loop по axis, undo й повтори with constrained zero movement before scale.

## 8.4. Beam variants

### Single card

- minimum surface;
- легко UV;
- може зникати edge-on.

### Cross-card

- дві cards навколо same beam axis;
- краще читається з різних angles;
- подвоює surface overlap;
- може бути надмірним із broad translucent material.

### Simple prism

- 3–6 sides;
- volume stable;
- більше faces;
- material mapping складніша.

Створи single card як core, cross-card як comparison. Не вирішуй наперед, що cross-card завжди кращий.

## 8.5. Beam segmentation

Straight beam може мати two end sections. Додавай longitudinal sections для:

- taper;
- bend;
- WPO;
- Vertex Color gradient;
- variable width.

Starter five sections уздовж X:

```text
x = -1.0, -0.5, 0.0, 0.5, 1.0
width = 0.08, 0.20, 0.26, 0.20, 0.08
```

## 8.6. Debris

Debris VFX не потребує bevel/subdivision за замовчуванням. Потрібні:

- distinct silhouette;
- stable origin;
- clean faces/normals;
- достатня variation aspect ratio;
- UV/Vertex Color later.

Створи з cube:

- move vertices asymmetrically;
- прибирай hidden/internal faces лише тоді, коли вони справді існують;
- зберігай малу кількість faces;
- використовуй `Shade Flat` для faceted-вигляду;
- не sculpt.

## 8.7. Debris variation axes

Змінюй:

- aspect ratio;
- center of mass;
- one dominant plane;
- taper;
- one broken corner;
- pivot placement.

Не створюй variants лише object Scale: після random rotation вони все одно виглядатимуть як одна shape.

## 8.8. Open vs closed

Card/ring/frustum можуть бути intentionally open. Debris зазвичай краще closed, якщо camera може бачити з усіх боків. Перевір:

- чи видно holes;
- чи потрібні caps;
- чи caps створять зайву visible overlap;
- чи material Two Sided/Unlit змінює requirement.

## 8.9. Origin

- Cone: base center для growth from source/ground.
- Ring: geometric center.
- Beam: source end.
- Debris: center of mass для spin або contact corner для planted chunk.

# 9. Візуальні або математичні приклади

## 9.1. Ring width

```text
R=1.0
r=0.72
width=1.0-0.72=0.28
```

Збільшення inner radius робить ring thinner; зменшення — broad band із більшим screen/ground coverage.

## 9.2. Approximate face counts

Open frustum із `n` segments:

```text
side quads = n
triangles after triangulation ≈ 2n
```

Для `n=12`: близько 12 quads / 24 triangles до caps.

Flat annulus із `n=16`:

```text
16 quads / приблизно 32 triangles
```

Це authoring expectation; actual export/import треба перевірити в 06.03.

## 9.3. Faceting comparison

| Segments | Visual tendency |
|---:|---|
| 6 | Strong stylized facets |
| 8–12 | Часто достатній volume для середньої дистанції |
| 16 | Smoother ring/cone |
| 32+ | Використовуй лише тоді, коли це виправдовує тест silhouette |

Це не fixed rule.

## 9.4. Beam profile

```text
source .08 → body .20 → peak .26 → body .20 → target .08
```

Material/UV may later animate source→target, але geometry already avoids rectangular ends.

# 10. Controlled experiments

## Experiment 1 — Cone segments

Створи 6-, 12- і 24-sided duplicates. Порівняй:

- front;
- 35°;
- solid silhouette;
- wireframe.

**Очікування:** потрібна density залежить від style/size; більше sides не автоматично краще.

## Experiment 2 — Ring width

Створи rings із `r=0.45`, `0.72`, `0.90` при `R=1`.

**Очікування:** wide band читається як area plate, thin ring — як boundary/wave.

## Експеримент 3 — Одинарний beam проти cross-card

Порівняй 0°/45°/90° навколо beam axis.

**Очікування:** cross-card стабільніший angle-wise, але має double surface overlap.

## Experiment 4 — Debris silhouette

Зроби three cube variants і подивись solid black на 25%. Якщо silhouettes однакові — object-scale-only variation недостатня.

# 11. Покрокова керована практика

## Частина A — Cone

1. `Add > Mesh > Cone`.
2. У create parameters встанови start values: 12 vertices, radius 0.50, second radius 0.08, depth 1.50, no caps/open if option available.
3. Перейменуй на `SM_VFX_Cone_01`.
4. Послідовно вирівняй local axis довжини.
5. У `Edit Mode` видали caps, якщо вони створені й не потрібні.
6. Перевір top loop: без collapsed apex.
7. Установи origin у центрі base.
8. Face Orientation check.

Exact create-panel wording залежить від Blender version.

## Частина B — Ring

1. `Add > Mesh > Circle`.
2. Почни з 16 vertices, radius 1.0, без fill.
3. Перейменуй на `SM_VFX_Ring_01`.
4. У `Edit Mode` вибери loop.
5. Виконай Extrude й підтвердь без зміщення по axis.
6. Масштабуй дубльований loop до 0.72.
7. Підтвердь, що faces з’єднують зовнішній і внутрішній loops.
8. Set origin center.
9. Face Orientation check.
10. No n-gon fill.

## Частина C — Beam

1. Add Plane.
2. Перейменуй на `SM_VFX_Beam_01`.
3. Build five sections.
4. Apply width profile `.08/.20/.26/.20/.08`.
5. Збережи пряму centerline для core beam.
6. Origin розмісти на source section.
7. Дублюй як `SM_VFX_Beam_Cross_Test`.
8. Дублюй і поверни card на 90° навколо local axis beam; за бажанням об’єднай лише для порівняння.
9. Запиши ризик overlap surfaces.

## Частина D — Debris

Create:

```text
SM_VFX_Debris_A
SM_VFX_Debris_B
SM_VFX_Debris_C
```

For each:

1. Add Cube.
2. У `Edit Mode` перемісти 2–4 vertices.
3. Створи інший aspect ratio в mesh data.
4. Keep closed volume.
5. `Shade Flat`.
6. Recalculate normals outside.
7. Origin — наближений центр маси.
8. Solid-black 25% test.

## Частина E — Kit audit

Table:

| Asset | Функція | Open/closed | Origin | Ризик кута | Навіщо ця topology |
|---|---|---|---|---|---|
| Cone |  |  |  |  |  |
| Ring |  |  |  |  |  |
| Beam |  |  |  |  |  |
| Debris A/B/C |  |  |  |  |  |

Save:

```text
L06_02_vfx_geometry_kit.blend
```

# 12. Точні назви вузлів, модулів і налаштувань

### Blender

- `Add > Mesh > Cone`
- `Add > Mesh > Circle`
- `Add > Mesh > Plane`
- `Add > Mesh > Cube`
- `Vertices`
- `Radius 1`
- `Radius 2`
- `Depth`
- `Fill Type`
- `Extrude`
- `Scale`
- `Loop Cut`
- `Join`
- `Separate`
- `Shade Flat`
- `Mesh > Normals > Recalculate Outside`
- `Viewport Overlays > Face Orientation`
- `Object > Set Origin`

Create-panel properties та exact labels можуть змінюватися між Blender versions. Перевір installed version у Blender Reference Manual.

### Unreal Engine

UE tools не використовуються до 06.03.  
**Потребує ручної перевірки в Unreal Engine 5.8.**

# 13. Стартові значення параметрів

| Asset | Параметри |
|---|---|
| Cone | 12 sides; base 0.50; top 0.08; length 1.50; open ends |
| Ring | 16 sides; outer 1.0; inner 0.72; flat |
| Beam | 5 sections; length 2.0; widths .08/.20/.26/.20/.08 |
| Cross beam | Two cards at 90° around beam axis |
| Debris A | Long/slender 1.0×0.35×0.25 |
| Debris B | Compact 0.65×0.55×0.45 |
| Debris C | Flat wedge 0.9×0.55×0.18 |
| Origins | Cone base; ring center; beam source; debris center |
| Review | 0°/35°/70° + 25% silhouette |

Dimensions — навчальні authoring-значення. Scale/orientation в UE перевіряються пізніше.

# 14. Очікуваний результат кожного етапу

| Етап | Результат |
|---|---|
| Cone | Відкритий frustum без degeneracy apex, origin на base |
| Ring | Чистий annulus без n-gon/internal overlap |
| Beam | Tapered source-target strip із п’яти секцій |
| Cross test | Відомі виграш кута й вартість overlap |
| Debris | Три різні закриті low-poly silhouettes |
| Normals | Узгоджена orientation назовні/front |
| Аудит kit | Function/origin/risk задокументовано |

# 15. Самостійна вправа

## EX-L06-02-A — Модульний kit elemental geometry

**Завдання:** створи modular kit для одного elemental family:

- cone/frustum;
- ring;
- beam;
- три variants debris/shard.

**Обмеження:**

- own original silhouettes;
- максимум два variants density на кожний radial asset;
- origins follow use;
- no sculpting, bevel stacks або subdivision surface;
- без hidden internal faces;
- angle sheet required.

**Deliverables:**

- `.blend`;
- asset audit table;
- solid/wireframe screenshots;
- порівняння low/high segments для cone/ring;
- brief elemental rationale.

**Acceptance criteria:**

- кожен asset має окрему функцію;
- density обґрунтовано silhouette;
- variants debris структурно відрізняються;
- немає degenerate/duplicate geometry;
- kit готовий до уроку UV.

# 16. Додаткова складніша вправа

## EX-L06-02-B — Завдання зі скорочення geometry

**Завдання:** для cone, ring і beam створи `Original` та `Reduced` versions. Reduced має зберегти gameplay silhouette at nominal/far view.

**Обмеження:**

- прибрати щонайменше 25% triangles після контрольованої оцінки triangulation;
- same outer dimensions;
- same origin;
- no material change;
- порівняти silhouette у масштабі 25% і кут 35°;
- чесно зафіксувати видиму різницю.

**Deliverables:**

- six objects;
- оцінені й фактичні triangles після локальної triangulation copy;
- side-by-side review;
- рішення keep/reject для кожного asset.

**Acceptance criteria:**

- reduction не є blind decimation;
- primary silhouette preserved;
- visible failure documented;
- відхилене скорочення залишається відхиленим;
- без тверджень про універсальний budget.

# 17. Три рівні підказок

## EX-L06-02-A

- **Hint 1 — напрямок мислення:** спочатку напиши function кожного mesh, потім обирай topology.
- **Hint 2 — потрібні інструменти:** Cone/Circle/Plane/Cube, Extrude+Scale annulus, Face Orientation, Set Origin, Shade Flat.
- **Hint 3 — майже повна структура:** cone 12 sides open; ring 16 outer/inner .72; beam five sections; debris long/compact/flat, усі з distinct origins/use notes.

[Повне рішення EX-L06-02-A](../EXERCISE_ANSWERS/L06-02_blender_cones_rings_beams_and_debris_answers.md#ex-l06-02-a)

## EX-L06-02-B

- **Hint 1 — напрямок мислення:** скорочуй radial segments або longitudinal loops лише там, де silhouette не змінюється.
- **Hint 2 — потрібні інструменти:** duplicate, dissolve/delete loops, temporary Triangulate, solid-black 25% test, 35° comparison.
- **Hint 3 — майже повна структура:** cone 16→10 sides, ring 24→16, beam 5→4 sections; порівняй contact profile й reject, якщо taper/curve ламається.

[Повне рішення EX-L06-02-B](../EXERCISE_ANSWERS/L06-02_blender_cones_rings_beams_and_debris_answers.md#ex-l06-02-b)

# 18. Типові помилки

1. Cone apex collapsed у many degenerate triangles.
2. Ring має n-gon fill під strip.
3. Inner/outer loops overlap або normals змішані.
4. Cross-card прийнято як default без overlap test.
5. Beam axis/origin не documented.
6. Debris variants — один cube з object Scale.
7. Bevel/Subdivision використано для невидимої detail.
8. Radial segment count copied без silhouette test.
9. Internal faces залишилися після mesh combination.
10. Open mesh помилково оцінюється як «зламаний» без intended use.

# 19. Troubleshooting

| Симптом | Причина | Виправлення |
|---|---|---|
| Cone tip має artifacts | Zero-radius apex/degenerate faces | Use small top radius/frustum |
| Ring center filled | Circle Fill Type створив face | Delete fill, leave annulus strip only |
| Faces ring перекручені | Неправильні selection/order Extrude/scale | Перебудувати loops, перевірити wireframe/normals |
| Beam зникає навколо axis | Одинарна card в edge-on | Прийняти й задокументувати, протестувати cross-card/prism |
| Cross-card надто яскрава | Overlapping translucent surfaces | Використати одну card, згодом налаштувати material і профілювати |
| Debris виглядає однаково | Змінено лише scale | Перемістити vertices, змінити dominant planes/taper |
| У debris видно отвори | Mesh не закрито або normals неправильні | Закрити заплановану boundary, перерахувати normals |
| Cone надто faceted | Замало segments для масштабу | Порівняти 12/16; додати лише обґрунтовані sides |
| Ring надто плавний для стилю | Забагато segments | Зменшити sides і переглянути faceted-мову |

# 20. Performance considerations

- Radial segments directly affect triangles, але actual cost depends on renderer/material/count.
- Широкі translucent surfaces cone/ring можуть спричиняти overdraw незалежно від малої кількості triangles.
- Cross-card подвоює overlapping surfaces.
- Кількість meshes debris і кількість particles взаємодіють; навіть один простий mesh, створений тисячі разів, може мати значення.
- Caps/internal faces add triangles й possibly overdraw without visible role.
- Далекий variant може використовувати менше radial sides.
- Збережи `Original` і `Reduced` для подальшого тестування H/M/L.
- Collision у цьому блоці не додається.
- Dynamic lights не входять до geometry kit.
- Вимірювання в UE виконується після import та інтеграції Niagara.

# 21. Запитання для самоперевірки

1. Чим cone відрізняється від frustum?
2. Навіщо залишати small top radius?
3. Як побудувати annulus із two loops?
4. Яка перевага й ціна cross-card?
5. Коли beam потребує longitudinal sections?
6. Чому debris variants не варто робити лише object Scale?
7. Коли open mesh є правильним?
8. Що має визначати radial segment count?

# 22. Відповіді

1. Frustum має зрізану верхівку/ненульовий top radius.
2. Щоб уникнути collapsed apex і degenerate triangles та спростити UV.
3. Створити outer loop, extrude duplicate in place, scale inward, залишити connecting strip.
4. Він краще читається з angles, але додає surface/overlap.
5. Для taper, bend, WPO, vertex gradient або width changes.
6. Після rotation silhouettes лишаються надто схожими; потрібні structural changes.
7. Коли back/cap surfaces не потрібні intended camera/material/function.
8. Silhouette, scale, camera, deformation й measurements, а не preset.

# 23. Self-check checklist

- [ ] Cone є frustum без collapsed apex.
- [ ] Рішення щодо cap cone задокументовано.
- [ ] Ring є annulus без n-gon.
- [ ] Loops ring не перекриваються.
- [ ] Axis/origin beam задокументовано.
- [ ] Порівняння single проти cross збережено.
- [ ] Три silhouettes debris відрізняються.
- [ ] Volumes debris закриті там, де це заплановано.
- [ ] Face Orientation consistent.
- [ ] Немає hidden internal faces.
- [ ] Segment counts justified.
- [ ] Тести 25% і кутів збережено.
- [ ] Kit audit complete.
- [ ] No unnecessary modifiers.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. створено cone, ring, beam і three debris assets;
2. cone/ring density justified by tests;
3. origins відповідають use cases;
4. ring/cone не мають unintended caps/degeneracy;
5. debris structurally distinct;
6. angle/25% review виконано;
7. мінімум 12 із 14 checklist пунктів виконано.

# 25. Підсумок

Modular VFX geometry kit покриває volume, radial response, source-target shapes і chunks. Quality визначається не modelling complexity, а clean topology, silhouette, origin і documented camera/material use.

# 26. Зв’язок із наступними уроками

У `03_uv_normals_vertex_color_and_fbx_export.md` усі meshes отримають UV contract, checked normals, Vertex Color masks, pivots, applied transforms, controlled triangulation, FBX export та UE 5.8 validation.

# 27. Офіційні джерела

- Blender Foundation. [Mesh Primitives](https://docs.blender.org/manual/en/latest/modeling/meshes/primitives.html).
- Blender Foundation. [Editing Meshes](https://docs.blender.org/manual/en/latest/modeling/meshes/editing/index.html).
- Blender Foundation. [Object Origin](https://docs.blender.org/manual/en/latest/scene_layout/object/origin.html).
- Epic Games. [Static Meshes](https://dev.epicgames.com/documentation/en-us/unreal-engine/static-meshes). UE 5.8.
- Epic Games. [Importing Static Meshes](https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-static-meshes-in-unreal-engine). UE 5.8; import виконується в 06.03.

# 28. Рекомендовані скриншоти або схеми

```text
Рекомендована схема 1:
Що показати: open frustum із base/top radius.
Що повинно бути видно: no apex collapse, base origin.
Яку область виділити: side quads і cap decision.
```

```text
Рекомендований скриншот 2:
Що відкрити: annulus ring wireframe.
Що повинно бути видно: outer/inner loops і connecting faces.
Яку область виділити: відсутність n-gon center.
```

```text
Рекомендована схема 3:
Що показати: single card, cross-card, simple prism beam.
Що повинно бути видно: angle coverage vs surface count.
Яку область виділити: overlap у cross-card.
```

```text
Рекомендований скриншот 4:
Що відкрити: debris A/B/C solid black at 25%.
Що повинно бути видно: distinct aspect ratio й dominant planes.
Яку область виділити: structural, not scale-only, variation.
```

```text
Рекомендований скриншот 5:
Що відкрити: cone/ring segment comparison.
Що повинно бути видно: 6/12/24 або 12/16/24 sides.
Яку область виділити: first density where silhouette is sufficient.
```
