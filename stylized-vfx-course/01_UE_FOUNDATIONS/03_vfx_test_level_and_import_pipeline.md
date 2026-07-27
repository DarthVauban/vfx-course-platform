# 1. L01-03 — VFX test level, камера та pipeline імпорту

| Поле | Значення |
|---|---|
| Блок | `01_UE_FOUNDATIONS` |
| Lesson ID | `L01-03` |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | `L_VFX_Test` із фіксованою camera station, scale references та перевіреними `T_Import_RGBA_256` і `SM_Import_Cube100` |
| Mastery gate | Студент повторює texture/mesh import, знаходить фактичні dimensions/scale/channels і доводить результат screenshot-ами та import record |

## 2. Результат уроку

Після уроку студент:

- створює Level для порівняння VFX у незмінних умовах;
- розрізняє test stage, camera condition і asset-under-test;
- готує просту RGBA diagnostic texture без художнього малювання;
- імпортує Texture і Static Mesh у canonical folders;
- перевіряє texture dimensions/channels/settings та mesh scale/pivot/UV/normal orientation;
- відрізняє спостережений факт від припущення про importer defaults;
- веде import record, достатній для повторення.

Доказ: `L_VFX_Test` відкривається з однакового camera view; imported assets мають правильні names/paths; два validation records містять source, importer, settings, observed result і verdict.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Теорія test scene та import contract | 1.25 | 0 |
| Texture/mesh validation model | 0.75 | 0 |
| Controlled experiments | 0.75 | 0.75 |
| Guided practice | 1.75 | 1.75 |
| Самостійні вправи | 1.0 | 1.0 |
| Reimport, журнал і self-check | 0.5 | 0.5 |
| **Разом** | **6.0** | **4.0 (66.7%)** |

Баланс блока лишається 15.5 практичних годин із 22. У цьому уроці теорія потрібна, щоб студент не перетворив випадковий успішний import на хибний production preset.

## 4. Prerequisites

| Потрібна навичка або asset | Де отримано | Як перевірити |
|---|---|---|
| Clean UE 5.8 sandbox | [L01-01](01_course_setup_and_ue58_workflow.md) | Відкривається правильний `.uproject` |
| Canonical folders і naming | [L01-02](02_editor_navigation_and_asset_workflow.md) | Є `/Game/VFXCourse/Maps`, `Textures/Diagnostics`, `Meshes/Diagnostics` |
| Базовий Blender | Профіль студента | Створити Cube й змінити Dimensions |
| Photoshop або Krita | Доступний інструмент | Створити 256×256 document і кольорові прямокутники |

## 5. Нові терміни

| English term | Українське пояснення | Практичний приклад | Glossary |
|---|---|---|---|
| Test level | Контрольована карта для повторюваного огляду assets/effects | `L_VFX_Test` | [Test level](../02_GLOSSARY.md#test-level) |
| Camera station | Зафіксований Transform і lens state для порівнянь | `CameraActor` у `L_VFX_Test` | [Camera station](../02_GLOSSARY.md#camera-station) |
| Source asset | Файл поза UE, з якого створено imported asset | `T_Import_RGBA_256.png` | [Source asset](../02_GLOSSARY.md#source-asset) |
| Importer | Pipeline, який перетворює зовнішній файл на UE asset | Texture importer, FBX або Interchange path | [Importer](../02_GLOSSARY.md#importer) |
| Reimport | Повторне оновлення UE asset із відомого source file | Заміна одного quadrant і `Reimport` | [Reimport](../02_GLOSSARY.md#reimport) |
| Mip | Зменшена версія texture для sampling на меншому screen size | Mip chain у Texture Asset Editor | [Mip](../02_GLOSSARY.md#mip) |
| Pivot | Опорна точка mesh для Transform, rotation і attachment | Центр diagnostic cube | [Pivot](../02_GLOSSARY.md#pivot) |
| Normal | Напрям поверхні, що впливає на shading і culling | Cube faces спрямовані назовні | [Normal](../02_GLOSSARY.md#normal) |
| UV channel | 2D coordinates mesh для texture sampling | UV channel 0 у diagnostic cube | [UV channel](../02_GLOSSARY.md#uv-channel) |

## 6. Навіщо ця тема потрібна VFX artist

VFX часто “виглядає неправильно” не через Niagara або shader math, а через source data:

- texture прочитана як color, хоча це mask;
- alpha відсутня або неочікувана;
- mesh має інший scale або pivot;
- UV повернуті;
- normals спрямовані не туди;
- порівняння виконано з іншої camera distance.

Test level перетворює суб’єктивне “щось не так” на контрольоване питання: що змінилося — asset, import settings, placement чи камера? Ця звичка надалі використовується для Material, Niagara, gameplay readability і performance.

## 7. Теорія простими словами

Import — не копіювання картинки або mesh “як є”. Це переклад source file у внутрішній UE asset. Перекладач має options і припущення. Одне й те саме PNG може бути:

- color image;
- grayscale mask;
- packed data;
- flipbook.

Файл однаковий, але правильна інтерпретація різна. Так само FBX може містити geometry, transforms, normals, tangents, UV та інші data. Тому “import завершився без error” означає лише, що asset створено, а не що він production-correct.

Test level має три шари:

1. **Незмінний контекст:** floor, scale references, lighting state, camera station.
2. **Asset under test:** texture preview, mesh або майбутній effect.
3. **Evidence:** screenshot, property record, side-by-side comparison.

Змінюючи лише asset under test, можна робити чесні A/B comparisons.

## 8. Детальні технічні пояснення

### Test-stage contract

| Елемент | Роль | Що не змінювати між A/B |
|---|---|---|
| Floor | Просторова опора | Transform |
| Reference Cube | Масштаб | Actor Scale |
| Reference Sphere | Shading/silhouette check | Transform |
| CameraActor | Screen size і perspective | Transform та lens state |
| Lighting state | Видимість форми | Light actors/settings |
| Asset station | Місце test object | World position |

У цьому foundation lesson exposure не “оптимізується на око”. Запиши поточний exposure state й використовуй його послідовно. Точні UE 5.8 exposure controls та defaults: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Diagnostic texture contract

Створи `T_Import_RGBA_256.png`:

- dimensions: 256×256;
- RGBA, 8 bit/channel;
- top-left: red;
- top-right: green;
- bottom-left: blue;
- bottom-right: white;
- centered transparent circle діаметром 64 px;
- без resize після export.

Це не artwork. Quadrants дозволяють перевірити channel orientation, transparency — alpha, dimensions — source integrity.

### Texture validation

Після import зафіксуй:

- imported dimensions;
- displayed alpha/channel previews;
- `sRGB`;
- `Compression Settings`;
- `Mip Gen Settings`;
- visible source filename;
- resource/disk information, якщо доступне.

Не встановлюй “правильний universal preset”: color texture, mask і packed data матимуть різні semantics. У цьому уроці verdict звучить: “UE прочитав source відповідно/невідповідно до diagnostic contract”.

### Diagnostic mesh contract

У Blender:

- один Cube;
- object name `ImportProbe_Cube100`;
- Dimensions: X=1 m, Y=1 m, Z=1 m;
- object origin у центрі;
- один UV map;
- без bevel/subdivision;
- export лише selected object.

Мета — порівняти imported cube з відомим reference cube у UE. Exact Blender-to-UE axes, unit conversion, FBX exporter options і default UE importer: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Mesh validation

Перевір:

- видимий розмір поруч із reference cube;
- actor Scale = `(1,1,1)` під час порівняння;
- pivot через rotation test;
- silhouette і faces ззовні;
- UV channel наявний;
- triangle/vertex information;
- material slots;
- importer і source filename.

Якщо розмір відрізняється, не “лікуй” actor Scale випадковим числом. Спочатку запиши ratio:

```text
Scale ratio = observed imported width / reference width
```

Наприклад, ratio 100 означає systematic unit mismatch, а не “mesh трохи завеликий”.

## 9. Візуальні або математичні приклади

### Layout test stage

```text
CameraActor (-800, 0, 220)
          │
          ▼ дивиться вздовж +X

Reference Cube      Reference Sphere      Imported Cube
(0,-200,50)         (0,0,50)              (0,200,50)
──────────────────────── Floor ────────────────────────
```

Стартовий Camera Transform:

```text
Location: X=-800, Y=0, Z=220
Rotation: Pitch=-12, Yaw=0, Roll=0
Scale:    X=1, Y=1, Z=1
```

Це course preset, а не “найкраща camera”. Якщо project axes або frame відрізняються, збережи інший Transform як documented preset і не змінюй його між tests.

### Scale ratio

Якщо reference cube має видиму ширину 100 units, а imported cube — 10, тоді:

```text
ratio = 10 / 100 = 0.1
correction factor for source investigation = 1 / 0.1 = 10
```

Це діагноз масштабу. Production fix ще має визначити, де саме виникла конверсія: source Dimensions, unapplied transform, exporter чи importer.

## 10. Controlled experiments

### CE-L01-03-01 — Camera consistency

- Збережи view із CameraActor.
- Зроби screenshot A.
- Перемісти editor free camera, але не CameraActor.
- Повернися до CameraActor view і зроби screenshot B.
- **Очікувано:** framing A і B збігається.
- Якщо ні — запиши, що змінилося: actor Transform, lens state, viewport aspect або camera lock workflow.

### CE-L01-03-02 — Reimport змінює asset, не placement

- У source PNG заміни white quadrant на 50% gray.
- Не змінюй dimensions або filename.
- Виконай `Reimport` imported texture.
- **Очікувано:** quadrant змінюється; UE asset name/path лишається.
- Поверни white quadrant і reimport ще раз.

### CE-L01-03-03 — Mesh scale comparison

- Розмісти reference й imported cube з actor Scale `(1,1,1)`.
- Оціни width у world space або за однаковою grid.
- Запиши ratio.
- Поверни imported actor до заданої station.
- **Висновок:** “виглядає приблизно однаково” не замінює ratio й screenshot.

## 11. Покрокова guided practice

### GP-L01-03 — Стандартизований import sandbox

1. **Дублюй `L_Asset_Workflow_Audit` як `L_VFX_Test`.**  
   Розмісти в `/Game/VFXCourse/Maps`.  
   **Навіщо:** структура Editor уже перевірена, але нова карта має окремий test purpose.

2. **Очисть disposable audit actors, лишивши базове lighting оточення.**  
   Не видаляй світло навмання. Запиши перелік лишених Light/Environment actors.

3. **Додай floor, Cube і Sphere з доступних basic shapes.**  
   Floor: Location `(0,0,0)`, достатній scale для всієї station.  
   Cube: `(0,-200,50)`, Scale `(1,1,1)`.  
   Sphere: `(0,0,50)`, Scale `(1,1,1)`.  
   Точний `Place Actors` UI і basic-shape labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

4. **Перейменуй actors у Outliner:** `Stage_Floor`, `Ref_Cube100`, `Ref_Sphere100`.

5. **Додай `CameraActor`.**  
   Встанови course Transform із секції 9. Якщо framing не охоплює три stations, зміни Transform один раз, запиши фактичне значення й надалі не змінюй.

6. **Збережи camera-view screenshot і viewport dimensions.**  
   **Очікувано:** це baseline framing.

7. **Створи source texture за diagnostic contract.**  
   Photoshop: New Document → 256×256 px → RGB Color → 8 bit; побудуй quadrants простими selections/fills і прозорий круг.  
   У Krita використай відповідні New Document, Rectangle/Fill і Elliptical Selection tools. Точні current DCC UI labels залежать від installed version.

8. **Export як `T_Import_RGBA_256.png`.**  
   Перевір dimensions після export, не лише в робочому document.

9. **Імпортуй файл у `/Game/VFXCourse/VFX/Textures/Diagnostics`.**  
   Використай `Import` або drag-and-drop у Content Browser. Exact import dialog: **Потребує ручної перевірки в Unreal Engine 5.8.**

10. **Відкрий Texture Asset Editor і заповни record.**

| Check | Expected | Observed | Verdict |
|---|---|---|---|
| Dimensions | 256×256 | Записати фактичні dimensions | Pass / Fail |
| RGB quadrants | R/G/B/White | Назвати фактичний порядок | Pass / Fail |
| Alpha | Center circle transparent | Описати фактичний alpha preview | Pass / Fail |
| sRGB | Record, не вгадувати | Записати фактичний стан | Info |
| Compression | Record | Записати фактичне значення | Info |
| Mips | Record | Записати фактичний результат | Info |

11. **Виконай CE-L01-03-02 і поверни source до початкового стану.**

12. **У Blender підготуй diagnostic cube.**  
    Set Dimensions `(1 m,1 m,1 m)`, Apply Scale, переконайся, що origin centered, export selected object. Exact Blender version/export labels і FBX settings запиши в record.

13. **Імпортуй у `/Game/VFXCourse/VFX/Meshes/Diagnostics` як `SM_Import_Cube100`.**  
    Не змішуй у записі FBX legacy options та Interchange options. Який pipeline відкрився фактично: **Потребує ручної перевірки в Unreal Engine 5.8.**

14. **Відкрий Static Mesh asset і запиши validation.**

| Check | Expected | Observed | Verdict |
|---|---|---|---|
| Source object | Один Cube | Записати фактичну кількість objects | Pass / Fail |
| Size vs `Ref_Cube100` | Ratio близько 1 | Записати виміряний ratio | Pass / Observation / Fail |
| Pivot | Center | Описати результат rotation test | Pass / Fail |
| Faces/normals | Назовні | Описати фактичну видимість faces | Pass / Fail |
| UV channels | Щонайменше 1 | Записати фактичну кількість | Pass / Fail |
| Material slots | Зафіксовано | Записати фактичну кількість | Info |
| Triangle/vertex count | Зафіксовано | Записати фактичні counts | Info |

15. **Розмісти `SM_Import_Cube100` у `(0,200,50)` із Scale `(1,1,1)` і назви actor `Test_SM_Import_Cube100`.**

16. **Порівняй scale й pivot.**  
    Для pivot поверни actor на 90° по одній осі й Undo. Центр не повинен “обертатися навколо далекої точки”.

17. **Збережи `L_VFX_Test`, закрий і відкрий проєкт.**  
    Перевір camera view та обидва imported assets.

18. **Заверши import record.**  
    Verdict для кожного: `PASS`, `PASS WITH OBSERVATION` або `FAIL`; додай один конкретний next action для failure.

## 12. Точні назви UE nodes, modules і settings

Material Graph і Niagara stack не створюються.

| ID | Точна назва | Тип | Де використано |
|---|---|---|---|
| UI01 | `CameraActor` | Actor | Camera station |
| UI02 | `Static Mesh` | Asset type | Imported diagnostic mesh |
| UI03 | `Texture` | Asset type | Imported RGBA diagnostic |
| UI04 | `Texture Asset Editor` | Asset editor | Dimensions, channels, compression, mips |
| UI05 | `Static Mesh Editor` | Asset editor | Geometry, UV, material slots, bounds |
| UI06 | `Import` | Content Browser action | Direct asset import |
| UI07 | `Reimport` | Asset action | Update з source file |
| UI08 | `sRGB` | Texture property | Color-space interpretation flag |
| UI09 | `Compression Settings` | Texture property | Compression policy |
| UI10 | `Mip Gen Settings` | Texture property | Mip generation policy |
| UI11 | `Transform` | Actor property group | Location, Rotation, Scale |

Exact property locations, active importer і dialog defaults: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| ID | Asset/actor | Parameter | Start | Зміна й наслідок |
|---|---|---|---|---|
| P01 | Diagnostic texture | Dimensions | 256×256 | 512×512 збільшує pixel count у 4 рази |
| P02 | Diagnostic texture | Bit depth | 8 bit/channel | Інший bit depth змінює precision/size й потребує окремої перевірки |
| P03 | Reference actors | Scale | `(1,1,1)` | Інша actor Scale псує import-size comparison |
| P04 | CameraActor | Location | `(-800,0,220)` | Distance змінює screen coverage |
| P05 | CameraActor | Rotation | `(-12,0,0)` | Інший angle змінює silhouette й floor visibility |
| P06 | Imported mesh actor | Location | `(0,200,50)` | Інша station ускладнює side-by-side |
| P07 | Source Cube | Dimensions | 1 m each axis | Інший source size змінює expected ratio |
| P08 | Imported actor | Scale | `(1,1,1)` | Не використовувати як прихований import fix |

## 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат | Перевірка |
|---|---|---|
| Stage | Floor і три stations читаються з camera view | Baseline screenshot |
| Camera | View відтворюється після free navigation | Screenshot A/B |
| Texture source | 256×256 RGBA contract | External file properties |
| Texture import | Quadrants і alpha розпізнаються | Texture Asset Editor |
| Reimport | Один quadrant оновлюється без нового UE asset | Same name/path |
| Mesh import | Один cube з documented scale ratio | Side-by-side |
| Persistence | Map/assets доступні після restart | Reopen test |

## 15. Самостійна вправа

### EX-L01-03-A — Другий import contract

Створи:

- `T_Import_Gradient_512.png`: 512×512, horizontal black-to-white gradient, opaque, з 16 px border;
- `SM_Import_Cone100`: простий cone або pyramid приблизно 1 m заввишки, centered origin, один UV channel.

Імпортуй у canonical folders, розмісти mesh на asset station і склади два validation records.

**Обмеження:** не копіювати settings із першого import без перевірки; actor Scale має лишитися `(1,1,1)` під час dimension test.

**Acceptance criteria:** texture dimensions/border/gradient видимі; mesh scale ratio записаний; pivot rotation test виконаний; source/importer/version задокументовані.

## 16. Додаткова складніша вправа

### EX-L01-03-B — Несправна пара та виправлена пара

Створи дві контрольовані відмінності:

1. Texture `300×180` із тим самим quadrant pattern і corrected `512×256` version.
2. Mesh із object Scale, який не було застосовано перед export, і corrected version з documented applied transform.

Імпортуй усі чотири files з різними semantic suffixes `_Probe` і `_Corrected`. Не називай probe “broken”, доки UE validation не покаже конкретну проблему.

**Acceptance criteria:** before/after table описує фактичні mips/resource/scale/pivot observations; жодного універсального твердження “NPOT завжди не працює”; corrected pair обрана на основі цільового use, а не ритуалу.

## 17. Три рівні підказок

### EX-L01-03-A

<details>
<summary>Hint 1 — напрямок мислення</summary>

Визнач expected evidence до import: dimensions, visible pattern, scale ratio, pivot і UV presence.
</details>

<details>
<summary>Hint 2 — потрібні інструменти</summary>

Photoshop/Krita New Document і Gradient/Border; Blender primitive, Dimensions, origin, UV, export selected; UE Import, Texture Asset Editor, Static Mesh Editor, CameraActor.
</details>

<details>
<summary>Hint 3 — майже повна структура</summary>

Source contract → export record → canonical import → editor inspection → placement at fixed station → side-by-side screenshot → verdict → reopen test.
</details>

**Повне рішення:** [EX-L01-03-A](../EXERCISE_ANSWERS/L01-03_vfx_test_level_and_import_pipeline_answers.md#ex-l01-03-a)

### EX-L01-03-B

<details>
<summary>Hint 1 — напрямок мислення</summary>

Не шукай “правильний preset”. Зміни одну source property і виміряй, що реально змінилося після import.
</details>

<details>
<summary>Hint 2 — потрібні інструменти</summary>

Дві texture dimensions, дві mesh transform states, однаковий importer per pair, Texture/Static Mesh editors, actor Scale `(1,1,1)`, A/B table.
</details>

<details>
<summary>Hint 3 — майже повна структура</summary>

Для texture зафіксуй dimensions, mip chain і resource info; для mesh — source Dimensions/Scale, imported size ratio і pivot. Verdict окремо для Probe й Corrected, без зміни camera або station.
</details>

**Повне рішення:** [EX-L01-03-B](../EXERCISE_ANSWERS/L01-03_vfx_test_level_and_import_pipeline_answers.md#ex-l01-03-b)

## 18. Типові помилки

| Помилка | Прояв | Причина | Попередження |
|---|---|---|---|
| Actor Scale маскує import issue | Mesh “правильний”, але Scale 100 | Fix зроблено після import без diagnosis | Порівнювати тільки при Scale 1 |
| Camera рухається між screenshots | A/B має інше framing | Використано free viewport camera | Camera station |
| PNG названо `T_` ще до import, а UE додає іншу назву | Duplicate prefix/suffix | Source й UE naming не сплановані | Перевір final UE name |
| Alpha перевіряють лише на checkerboard thumbnail | Channels не оглянуті | Припущення за preview | Inspect alpha/channel |
| FBX/Interchange steps змішані | Settings не відповідають dialog | Використано instructions іншого importer | Записати фактичний pipeline |
| Warning “виправляють” усіма options | Немає причинного зв’язку | Змінено кілька змінних | Одна setting per reimport |

## 19. Troubleshooting

| Симптом | Діагностичний тест | Імовірна причина | Виправлення | Перевірка |
|---|---|---|---|---|
| Texture blurry | Перевір source dimensions, zoom і mip level | Preview не 1:1 або mips/filtering | Порівняти 1:1 source й relevant mip; не вимикати mips навмання | Border і quadrants читаються на expected view |
| Alpha відсутня | Переглянути alpha channel у source та Texture Editor | Export без transparency/alpha | Перевірити source export і reimport | Transparent circle присутній |
| Colors неочікувані | Перевір `sRGB` і source profile | Color/data interpretation | Для diagnostic color зафіксувати correct semantic setup | R/G/B quadrants не переплутані |
| Mesh занадто великий/малий | Actor Scale 1, порівняти ratio | Source units, unapplied transform або importer conversion | Ізолювати source/export/import step | Corrected version ratio documented |
| Pivot далеко | Rotation test | Origin не centered або transform baked інакше | Виправити origin у source, export/reimport | Rotation навколо центру |
| Faces зникають | Оглянути normals і backside | Reversed normals або one-sided rendering | Recalculate/flip normals у source | Зовнішні faces стабільно видимі |
| Reimport створює не той result | Перевір source filename/path | Asset посилається на інший source | Вказати correct source і повторити | Expected quadrant/geometry change |

## 20. Performance considerations

- Pixel count масштабується як `width × height`: 512×512 має в 4 рази більше source pixels, ніж 256×256.
- Resource size залежить не лише від file size, а від imported format, compression, mips і platform.
- Non-power-of-two texture не оголошується автоматично “помилкою”; перевіряй mip/streaming behavior і target use.
- Mesh cost не визначається лише triangle count; material, overdraw, instance count і renderer path важливіші в багатьох VFX.
- Camera distance визначає screen coverage, тому однаковий asset може мати різний practical cost у різних shots.
- Не запускай benchmark під час import, shader compilation або thumbnail generation.
- Запиши texture resource information і mesh triangle/vertex counts як baseline, без універсального pass/fail budget.

## 21. Запитання для самоперевірки

1. Чому import success не дорівнює production correctness?
2. Які три шари має test level?
3. Навіщо diagnostic texture містить різні RGB quadrants і alpha shape?
4. Чому actor Scale має бути `(1,1,1)` під час mesh validation?
5. Що показує scale ratio?
6. Які дані потрібно записати про Texture після import?
7. Чому не можна змішувати legacy FBX та Interchange instructions?
8. Що має лишитися незмінним між A/B screenshots?
9. Чому 300×180 texture не слід автоматично називати зламаною?

## 22. Відповіді на запитання

1. Importer міг створити asset із неправильними semantics, scale, alpha, UV або settings.
2. Незмінний контекст, asset under test та evidence.
3. Вони дозволяють перевірити channel orientation, color і transparency без складного artwork.
4. Інакше placement correction приховає source/import conversion issue.
5. Відношення observed imported size до reference size й масштаб systematic mismatch.
6. Dimensions, channels/alpha, sRGB, compression, mips, source path і resource information.
7. Це різні pipelines із різними dialogs/options; змішаний record не можна повторити.
8. Camera Transform/lens, stage, lighting/exposure state, placement і viewport condition.
9. NPOT suitability залежить від фактичних mip/streaming/resource results і use case.

## 23. Self-check checklist

- [ ] `L_VFX_Test` має floor, reference cube, sphere, asset station і CameraActor.
- [ ] Camera Transform/lens state записані.
- [ ] Texture source відповідає 256×256 RGBA contract.
- [ ] Texture dimensions, alpha, sRGB, compression і mips перевірені.
- [ ] Reimport experiment завершений і source повернений.
- [ ] Mesh source/exporter/importer записані.
- [ ] Imported mesh перевірений при actor Scale `(1,1,1)`.
- [ ] Pivot, normals, UV і scale ratio перевірені.
- [ ] Level та assets працюють після restart.

## 24. Mastery criteria

Урок пройдено, якщо:

- camera A/B framing відтворюється;
- texture validation має всі required observations і no unexplained mismatch;
- mesh validation має ratio, pivot, normals і UV verdict;
- студент повторює import другого contract без guided steps;
- statements про FBX/Interchange обмежені фактично використаним pipeline;
- правильні щонайменше 8 із 9 контрольних відповідей.

## 25. Підсумок

- Test level контролює camera, stage і evidence.
- Import — інтерпретація source data, а не проста копія.
- Diagnostic assets мають простий contract і легко перевіряються.
- Scale/pivot/channel issues діагностуються до випадкових fixes.
- Importer, settings і observations належать import record.

## 26. Зв’язок із наступними уроками

| Наступний урок | Що буде використано | Що зберегти |
|---|---|---|
| [L01-04 — Цикл ітерації, діагностика й baseline](04_debugging_iteration_and_performance_baseline.md) | `L_VFX_Test`, fixed camera, imported probes | Validation records і screenshots |
| Блок 03 | `T_Import_RGBA_256` як channel/texture diagnostic | Не змінювати source contract |
| Блок 06 | `SM_Import_Cube100` і import observations | Blender/export/import record |

## 27. Офіційні джерела

- `ASSET-01` — [Textures in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/textures-in-unreal-engine), Epic Games, UE 5.8.
- `ASSET-02` — [Texture Asset Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-asset-editor-in-unreal-engine), Epic Games, UE 5.8.
- `ASSET-03` — [Importing Assets Directly](https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-assets-directly-into-unreal-engine), Epic Games, UE 5.8.
- `ASSET-05` — [Importing Static Meshes](https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-static-meshes-in-unreal-engine), Epic Games, UE 5.8.
- `ASSET-08` — [Interchange Import Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/interchange-import-reference-in-unreal-engine), Epic Games, UE 5.8.
- `MC-21`, `MC-24`, `MC-25` — manual-check registry у [SOURCES.md](../SOURCES.md), доступ 2026-07-27.

## 28. Перелік рекомендованих скриншотів або схем

**Рекомендований скриншот 1 — test-stage overview**  
Що відкрити: `L_VFX_Test` через CameraActor.  
Що повинно бути видно: floor, reference cube, sphere, imported mesh station.  
Яку область виділити: весь camera frame і viewport dimensions.

**Рекомендований скриншот 2 — Texture Asset Editor**  
Що відкрити: `T_Import_RGBA_256`.  
Що повинно бути видно: dimensions, RGB/alpha preview та relevant settings.  
Яку область виділити: asset name, dimensions і channel controls.

**Рекомендований скриншот 3 — mesh side-by-side**  
Що відкрити: CameraActor view у `L_VFX_Test`.  
Що повинно бути видно: reference й imported cube при Scale 1.  
Яку область виділити: обидва silhouettes й Transform panel imported actor.

**Рекомендований скриншот 4 — import record**  
Що відкрити: завершену validation table.  
Що повинно бути видно: source, importer, observed values, verdict.  
Яку область виділити: scale ratio та texture alpha verdict.

**Рекомендована схема**  
Що показати: `source file → importer/settings → UE asset → placement → evidence`.  
Що повинно бути видно: кожен етап може бути окремою причиною mismatch.
