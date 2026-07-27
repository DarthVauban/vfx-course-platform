# 1. L01-02 — Editor та дисципліна VFX-асетів

| Поле | Значення |
|---|---|
| Блок | `01_UE_FOUNDATIONS` |
| Lesson ID | `L01-02` |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | Content-структура `/Game/VFXCourse`, naming convention і audit із діагностичних assets |
| Mastery gate | За 90 секунд знайти заданий asset за path, type або name; пояснити його роль і виправити порушення naming без роботи через File Explorer |

## 2. Результат уроку

Після уроку студент:

- орієнтується між Level Viewport, Outliner, Details, Content Drawer та Content Browser;
- відрізняє actor у відкритій карті від asset у `Content`;
- будує стабільну структуру VFX-папок;
- застосовує один naming contract до Levels, Materials, Textures, Meshes, Niagara й Blueprints;
- переміщує, перейменовує, дублює та шукає assets усередині Editor;
- проводить naming/path audit і записує виправлення.

Доказ: `/Game/VFXCourse` має визначену структуру; audit table містить щонайменше 10 перевірених entries; пошук одного asset відтворюється за ім’ям, type і path.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Ментальна модель Editor/Level/Asset | 0.75 | 0 |
| Naming, paths і references | 0.75 | 0 |
| Controlled experiments | 0.5 | 0.5 |
| Guided practice | 1.5 | 1.5 |
| Самостійні вправи | 1.0 | 1.0 |
| Audit і self-check | 0.5 | 0.5 |
| **Разом** | **5.0** | **3.5 (70%)** |

## 4. Prerequisites

| Потрібна навичка або asset | Де отримано | Як швидко перевірити |
|---|---|---|
| Clean UE 5.8 project | [L01-01](01_course_setup_and_ue58_workflow.md) | Відкривається `StylizedVFXCourse58` |
| Контрольна карта | [L01-01](01_course_setup_and_ue58_workflow.md) | `L_Startup_Check` відкривається після restart |
| Safety journal | [L01-01](01_course_setup_and_ue58_workflow.md) | Записані build і working path |

## 5. Нові терміни

| Англійський термін | Українське пояснення | Практичний приклад | Glossary |
|---|---|---|---|
| Asset | Збережений об’єкт проєкту в `Content` | `M_Diagnostic_Surface` | [Asset](../02_GLOSSARY.md#asset) |
| Actor | Екземпляр, розміщений у Level | `StaticMeshActor` на сцені | [Actor](../02_GLOSSARY.md#actor) |
| Level | Asset карти, що містить actors і world setup | `L_VFX_Test` | [Level](../02_GLOSSARY.md#level) |
| Package path | Внутрішній шлях UE, що починається з `/Game` | `/Game/VFXCourse/Maps` | [Package path](../02_GLOSSARY.md#package-path) |
| Reference | Зв’язок одного asset з іншим | Material Instance посилається на parent Material | [Reference](../02_GLOSSARY.md#reference) |
| Redirector | Технічний слід переміщення або перейменування asset | Старий path тимчасово спрямовує на новий | [Redirector](../02_GLOSSARY.md#redirector) |
| Outliner | Список actors поточного world/level | Пошук `CameraActor` у карті | [Outliner](../02_GLOSSARY.md#outliner) |
| Details | Panel властивостей поточного selection | Transform вибраного actor | [Details](../02_GLOSSARY.md#details) |

## 6. Навіщо ця тема потрібна VFX-фахівцю

Один gameplay effect може використовувати Niagara System, кілька Emitters, Materials, Material Instances, Textures, Static Meshes і Blueprint integration. Якщо names на кшталт `NewMaterial`, `NewMaterial_2`, `final_final` нічого не пояснюють, artist витрачає час не на VFX, а на пошук.

Організація також є частиною troubleshooting. Повідомлення про missing Material корисне лише тоді, коли path і prefix одразу підказують, що саме відсутнє. Naming не покращує GPU time напряму, але скорочує iteration time, зменшує помилки вибору asset і робить breakdown зрозумілим роботодавцю або команді.

## 7. Теорія простими словами

Editor показує два різні світи:

- **Level world:** actors, які мають Transform і існують у поточній сцені.
- **Content world:** assets, які зберігаються як reusable data.

Якщо перетягнути Static Mesh asset у Level, у сцені з’являється actor, але mesh asset не дублюється. Видалення actor зі сцени не видаляє source asset. Видалення source asset може зламати всі actors та інші assets, які на нього посилаються.

Хороший package path відповідає на “де це живе?”, prefix — “який це тип?”, semantic name — “для чого?”. Наприклад:

```text
/Game/VFXCourse/VFX/Materials/Instances/MI_Impact_Fire_High
```

- `MI_` — Material Instance;
- `Impact_Fire` — призначення й element;
- `High` — quality або production variant.

Не додавай інформацію, яку Editor уже знає, якщо вона не допомагає відрізнити assets. Назва `M_Material` гірша за `M_VFX_UnlitBase`.

## 8. Детальні технічні пояснення

### Базова структура

```text
/Game/VFXCourse/
  Maps/
  VFX/
    Materials/
      Master/
      Instances/
      Functions/
    Textures/
      Diagnostics/
      Masks/
      Flipbooks/
    Meshes/
      Diagnostics/
    Niagara/
      Systems/
      Emitters/
      Modules/
    Blueprints/
  TestAssets/
  Dev/
```

`TestAssets` містить контрольовані probes, які можна видалити без шкоди production assets. `Dev` містить тимчасову особисту роботу. Уроки не використовують `Dev` як постійне джерело dependencies.

### Naming contract курсу

| Prefix | Asset type | Приклад |
|---|---|---|
| `L_` | Level | `L_VFX_Test` |
| `M_` | Material | `M_VFX_UnlitBase` |
| `MI_` | Material Instance | `MI_Impact_Fire` |
| `MF_` | Material Function | `MF_Remap01` |
| `T_` | Texture | `T_Diagnostic_RGBA` |
| `SM_` | Static Mesh | `SM_Diagnostic_Cube` |
| `NS_` | Niagara System | `NS_Impact_Fire` |
| `NE_` | Niagara Emitter asset | `NE_Sparks_Base` |
| `NMS_` | Niagara Module Script, course convention | `NMS_RotateAroundPoint` |
| `BP_` | Blueprint Class | `BP_VFX_TestRig` |

Це naming convention курсу, а не твердження, що UE примусово вимагає такі prefixes.

### Правила path

1. Asset має один canonical location.
2. Переміщення й перейменування виконуються в Content Browser/Content Drawer.
3. Тимчасовий asset не стає dependency production asset.
4. Quality suffix використовують лише коли реально існують variants.
5. Слово `Final` не використовується як version control.
6. Дата й номер спроби належать журналу або version control, а не semantic asset name.

### Naming audit

Кожен entry відповідає на п’ять питань:

- prefix правильний;
- semantic name зрозумілий;
- path відповідає типу;
- немає зайвого numeric suffix;
- asset використовується або має diagnostic purpose.

## 9. Візуальні або математичні приклади

### Asset чи actor

```text
SM_Diagnostic_Cube (asset у Content)
      │
      ├── StaticMeshActor_A у L_VFX_Test
      ├── StaticMeshActor_B у L_VFX_Test
      └── Mesh Renderer у майбутньому Niagara System
```

Видалення `StaticMeshActor_A` не змінює дві інші references. Переміщення `SM_Diagnostic_Cube` всередині Editor має зберегти references, але workflow redirectors у конкретному build потрібно перевірити.

### Якість назви

| Назва | Type видно? | Purpose видно? | Variant видно? | Verdict |
|---|---|---|---|---|
| `NewMaterial_3` | Ні | Ні | Ні | Fail |
| `M_Fire` | Так | Частково | Ні | Weak |
| `M_ProjectileTrail_Unlit` | Так | Так | Не потрібен | Pass |
| `MI_ProjectileTrail_Fire_Low` | Так | Так | Так | Pass |

## 10. Controlled experiments

### CE-L01-02-01 — Один asset, два actors

- Створи або використай один Static Mesh asset.
- Розмісти його у Level двічі.
- Зміни Transform лише другого actor.
- Видали перший actor.
- **Очікувано:** source asset лишається в Content, другий actor лишається в Level.
- **Висновок:** actor lifecycle і asset lifecycle — різні.

### CE-L01-02-02 — Пошук трьома способами

- Обери один diagnostic asset.
- Знайди його за повною назвою.
- Очисть пошук і знайди за prefix.
- Очисть пошук і відфільтруй за asset type.
- **Контроль:** кожен спосіб приводить до того самого package path.

## 11. Покрокова керована практика

### GP-L01-02 — Content architecture й audit

1. **Відкрий `L_Startup_Check`.**  
   **Перевірка:** у Outliner видно actors карти, у Content — Level asset.

2. **Покажи `Outliner`, `Details` і `Content Drawer`/`Content Browser`.**  
   Якщо panel відсутня, віднови її через доступне `Window` menu. Точні labels і menu paths: **Потребує ручної перевірки в Unreal Engine 5.8.**

3. **Створи кореневу папку `/Game/VFXCourse`.**  
   Не створюй курс прямо в `/Game` десятками незв’язаних папок.

4. **Створи структуру з секції 8.**  
   **Перевірка:** `Maps`, `VFX`, `TestAssets`, `Dev` є siblings; renderer assets розділені за type.

5. **Перемісти `L_Startup_Check` у `/Game/VFXCourse/Maps`.**  
   Роби це лише всередині Editor.  
   **Очікувано:** Level відкривається з нового path.

6. **Створи Material asset `M_Diagnostic_Surface` у `TestAssets`.**  
   Не змінюй Material Graph — мета кроку лише asset lifecycle. Точний create menu: **Потребує ручної перевірки в Unreal Engine 5.8.**

7. **Дублюй його як `M_Diagnostic_Surface_Copy`, потім перейменуй на `M_Diagnostic_Surface_Alt`.**  
   **Очікувано:** обидва assets мають зрозумілі names без `_2`.

8. **Перемісти `M_Diagnostic_Surface` у `VFX/Materials/Master`.**  
   `Alt` лиши в `TestAssets` як diagnostic variant.

9. **Створи порожній Blueprint Class типу Actor `BP_VFX_TestRig` у `VFX/Blueprints`.**  
   У цьому уроці Event Graph не редагується. Точний creation dialog: **Потребує ручної перевірки в Unreal Engine 5.8.**

10. **Створи новий Level `L_Asset_Workflow_Audit` у `Maps`.**  
    Додай до нього два instances базового shape asset і назви actors `Audit_Cube_A`, `Audit_Cube_B`.

11. **Знайди кожен створений asset за name, prefix і type filter.**  
    Запиши час найдовшого пошуку. Якщо понад 90 секунд — структура або назва недостатньо однозначна.

12. **Проведи audit.**

| Asset | Expected path | Prefix | Semantic name | Action |
|---|---|---|---|---|
| `L_Asset_Workflow_Audit` | `Maps` | Pass | Pass | Keep |
| `M_Diagnostic_Surface` | `Materials/Master` | Pass | Pass | Keep |
| `M_Diagnostic_Surface_Alt` | `TestAssets` | Pass | Pass | Keep |
| `BP_VFX_TestRig` | `VFX/Blueprints` | Pass | Pass | Keep |

13. **Перевір redirector workflow після move/rename.**  
    Не застосовуй команду механічно до всього проєкту. Точна назва `Fix Up Redirectors in Folder`, її location і поведінка: **Потребує ручної перевірки в Unreal Engine 5.8.**

14. **Закрий і повторно відкрий `L_Asset_Workflow_Audit`.**  
    **Очікувано:** references на actors і assets не втрачені.

## 12. Точні назви вузлів, модулів і налаштувань UE

Material Graph і Niagara stack не створюються. Технічні елементи уроку:

| ID | Точна назва | Тип | Призначення |
|---|---|---|---|
| UI01 | `Level Viewport` | Editor viewport | Огляд і manipulation actors |
| UI02 | `Outliner` | Editor panel | Ієрархія та пошук actors |
| UI03 | `Details` | Editor panel | Властивості selection |
| UI04 | `Content Drawer` | Editor panel | Швидкий доступ до assets |
| UI05 | `Content Browser` | Editor panel | Пошук, folders, filters і asset operations |
| UI06 | `Material` | Asset type | Діагностичний asset lifecycle |
| UI07 | `Blueprint Class` | Asset type | Майбутній reusable test rig |
| UI08 | `Actor` | Blueprint parent class | Об’єкт, який можна розмістити у Level |
| UI09 | `Fix Up Redirectors in Folder` | Context action | Cleanup redirectors після перевіреного move/rename |

Положення panels, context-menu entries і точна назва redirector action у build 5.8.x: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| ID | Параметр | Start | Test variation | Ефект |
|---|---|---|---|---|
| P01 | Root path | `/Game/VFXCourse` | `/Game/MyCourse` | Допустимо лише якщо всі уроки й журнал використовують його послідовно |
| P02 | Personal work path | `/Game/VFXCourse/Dev/<Name>` | — | Ізолює WIP від reusable assets |
| P03 | Search target time | ≤90 секунд | 180 секунд | Високий час означає слабкий name/path |
| P04 | Numeric suffix tolerance | 0 випадкових suffixes | 1+ | `_2`, `_3` приховують purpose і потребують audit |
| P05 | Diagnostic actor count | 2 | 1 | Два actors демонструють reuse одного asset |

## 14. Очікуваний результат кожного етапу

| Етап | Очікувано | Перевірка |
|---|---|---|
| Panel orientation | Selection у Viewport підсвічує той самий actor в Outliner | Зміна selection |
| Root structure | Усі reusable VFX assets мають canonical category | Folder tree inspection |
| Naming | Type і purpose читаються без відкриття asset | Blind name test |
| Move/rename | Level і references відкриваються після restart | Reopen test |
| Search | Asset знаходиться трьома способами | Name/prefix/type |
| Audit | Усі violations мають конкретну action | Audit table |

## 15. Самостійна вправа

### EX-L01-02-A — Розбір “хаотичного” набору

У `TestAssets/Messy` створи п’ять diagnostic assets із навмисно слабкими names: `NewMaterial`, `NewMaterial_2`, `Test`, `Final`, `Thing`. Не створюй external dependencies. Потім:

- класифікуй type і purpose;
- дай semantic names;
- перемісти в canonical folders;
- склади до й після table;
- закрий і повторно відкрий проєкт.

**Acceptance criteria:** жодного випадкового numeric suffix; path відповідає type; старі names не використовуються в audit result; проєкт відкривається без missing references.

## 16. Додаткова складніша вправа

### EX-L01-02-B — Blind asset retrieval

Склади список із 12 requests, наприклад “master Material для diagnostic surface”, “Level для asset audit”, “Blueprint test rig”. Відклади список на 20 хвилин, потім знайди кожен target без перегляду всього folder tree.

Запиши:

- query;
- спосіб пошуку;
- знайдений path;
- час;
- чи name однозначний;
- одну зміну convention, якщо target шукався понад 90 секунд.

**Acceptance criteria:** 10 із 12 targets знайдені правильно; жоден slow target не лишився без correction.

## 17. Три рівні підказок

### EX-L01-02-A

<details>
<summary>Підказка 1 — напрямок мислення</summary>

Спочатку визнач type, потім production purpose, лише потім path і name.
</details>

<details>
<summary>Підказка 2 — потрібні інструменти</summary>

Content Browser folders, type filters, Rename, Move, Duplicate, audit table і reopen test.
</details>

<details>
<summary>Підказка 3 — майже повна структура</summary>

Для кожного asset заповни `old name → type → purpose → prefix → canonical path → new name → reopen result`. Якщо purpose невідомий, asset лишається в `TestAssets`, а не маскується production name.
</details>

**Повне рішення:** [EX-L01-02-A](../EXERCISE_ANSWERS/L01-02_editor_navigation_and_asset_workflow_answers.md#ex-l01-02-a)

### EX-L01-02-B

<details>
<summary>Підказка 1 — напрямок мислення</summary>

Хороший retrieval test перевіряє не пам’ять про folder tree, а інформацію в name, prefix і type.
</details>

<details>
<summary>Підказка 2 — потрібні інструменти</summary>

Search field, asset type filter, current folder scope, timer і results table.
</details>

<details>
<summary>Підказка 3 — майже повна структура</summary>

Змішай 4 name queries, 4 type queries і 4 purpose queries. Для помилки не повторюй пошук одразу: спочатку визнач, чого бракує — prefix, semantic word чи canonical path.
</details>

**Повне рішення:** [EX-L01-02-B](../EXERCISE_ANSWERS/L01-02_editor_navigation_and_asset_workflow_answers.md#ex-l01-02-b)

## 18. Типові помилки

| Помилка | Прояв | Причина | Попередження |
|---|---|---|---|
| Actor плутають з asset | Видалили actor й думають, що mesh зник | Не розділено Level і Content | Завжди називати location: Outliner чи Content |
| Assets переносять через File Explorer | Missing references або невидимі assets | UE не виконав asset operation | Move/rename тільки в Editor |
| Створюють надто багато root folders | Пошук розпорошений | Немає project namespace | Один `/Game/VFXCourse` |
| Prefix є, purpose немає | `M_Test`, `T_Final` | Naming зупинився на type | Додати semantic role |
| WIP стає production dependency | Видалення `Dev` ламає effect | Тимчасовий asset використано напряму | Promote asset у canonical path перед reuse |
| Виправляють redirectors без перевірки | Незрозумілі зміни packages | Cleanup використано ритуально | Backup, small scope, reopen test |

## 19. Troubleshooting

| Симптом | Діагностичний тест | Причина | Виправлення | Перевірка |
|---|---|---|---|---|
| Asset “зник” | Search `All Assets`, перевір filters | Активний folder/type filter | Очистити filters і знайти package path | Asset видимий у canonical folder |
| Selection не має Transform у Details | Подивитися, де обрано object | Обрано asset, не actor | Обрати actor у Viewport/Outliner | Details показує actor properties |
| Level не відкривається після move | Знайти Level за повною назвою | Старий shortcut/path | Відкрити canonical asset із Content | Reopen після restart |
| З’явився `_2` | Пошукати same base name | Name conflict під час duplicate/import | Порівняти purpose, перейменувати semantic variant | Немає випадкових suffixes |
| Пошук дає десятки results | Перевір prefix і folder scope | Query надто загальний | Додати type/purpose або звузити path | Один correct target |
| Redirector action відсутня | Перевір show filters/context | UI/build відрізняється | Не вигадувати path; звірити UE 5.8 UI | References працюють після restart |

## 20. Performance considerations

- Folder і name самі по собі не скорочують shader instructions або draw calls.
- Надійна структура скорочує human iteration cost і ризик підключити неправильний heavy asset.
- Великі preview thumbnails, background discovery й перший search можуть створювати Editor activity; це не gameplay benchmark.
- Duplicate asset може збільшити disk/package size, навіть якщо виглядає однаково.
- Redirector cleanup — maintenance operation; його не слід виконувати під час performance capture.
- Порівнюючи Editor responsiveness, використовуй той самий folder, filter і cache state; не роби production висновок із одного пошуку.

## 21. Запитання для самоперевірки

1. Чим actor відрізняється від asset?
2. Що означає `/Game` у package path?
3. Які три частини роблять name інформативним?
4. Чому `Final_Final_2` є слабкою назвою?
5. Де має жити reusable Material, а де disposable probe?
6. Чому не слід переміщати UE assets через File Explorer?
7. Що перевіряє reopen test після move/rename?
8. Чи покращує prefix GPU performance? Поясни.

## 22. Відповіді на запитання

1. Asset зберігається у Content і може мати багато uses; actor є instance у конкретному Level.
2. Це корінь authored project content у внутрішніх UE paths.
3. Type prefix, semantic purpose і, лише коли потрібно, variant.
4. Вона не описує type, purpose або справжню версію й швидко стає неправдивою.
5. Reusable Material — у `VFX/Materials`; disposable probe — у `TestAssets` або `Dev`.
6. Editor має керувати asset operation та references; зовнішнє переміщення обходить цей workflow.
7. Що canonical asset і залежні references реально збереглися після нової Editor session.
8. Ні. Prefix покращує пошук, audit і знижує human error, але не змінює compiled rendering cost.

## 23. Self-check checklist

- [ ] `/Game/VFXCourse` має `Maps`, `VFX`, `TestAssets`, `Dev`.
- [ ] Materials, Textures, Meshes, Niagara та Blueprints мають canonical folders.
- [ ] Я можу пояснити різницю між Outliner actor і Content asset.
- [ ] У постійних assets немає `New`, `Final`, `Test2` або випадкових suffixes.
- [ ] Move/rename виконувалися лише в Editor.
- [ ] `L_Asset_Workflow_Audit` відкрився після restart.
- [ ] Audit містить щонайменше 10 entries.
- [ ] Заданий asset знаходиться за ≤90 секунд.

## 24. Mastery criteria

Урок пройдено, якщо:

- структура відповідає контракту або має письмово аргументовану еквівалентну схему;
- 10 із 12 blind retrieval targets знайдені;
- немає випадкових numeric suffixes у canonical folders;
- студент без підказки показує Viewport, Outliner, Details і Content;
- Level та diagnostic assets працюють після restart;
- правильні щонайменше 7 із 8 відповідей.

## 25. Підсумок

- Level actors і Content assets мають різний lifecycle.
- Canonical path пояснює location, prefix — type, semantic name — purpose.
- `TestAssets` і `Dev` не є джерелом production dependencies.
- Search test і reopen test роблять organization перевірюваною.
- Naming — частина troubleshooting і production communication, не runtime optimization.

## 26. Зв’язок із наступними уроками

| Наступний урок | Що використовується | Що зберегти |
|---|---|---|
| [L01-03 — VFX test level та import pipeline](03_vfx_test_level_and_import_pipeline.md) | `Maps`, `Textures/Diagnostics`, `Meshes/Diagnostics`, naming contract | `L_Asset_Workflow_Audit`, audit table |
| L01-04 | Canonical test assets і blind retrieval | Naming violations як troubleshooting examples |
| Блоки 03–10 | Уся VFX folder architecture | Не змінювати prefixes посеред курсу без migration note |

## 27. Офіційні джерела

- `UE58-01` — [Unreal Engine 5.8 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine), Epic Games, UE 5.8, доступ 2026-07-27.
- `MAT-02` — [Material Editor User Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-editor-user-guide), Epic Games, UE 5.8 — приклад спеціалізованого asset editor.
- `ASSET-03` — [Importing Assets Directly](https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-assets-directly-into-unreal-engine), Epic Games, UE 5.8 — Content Browser як точка asset workflow.
- Повний каталог: [SOURCES.md](../SOURCES.md).

## 28. Перелік рекомендованих скриншотів або схем

**Рекомендований скриншот 1 — Level Editor anatomy**  
Що відкрити: `L_Asset_Workflow_Audit`.  
Що повинно бути видно: Viewport, Outliner, Details, Content Drawer.  
Яку область виділити: один actor у Viewport і той самий selection в Outliner.

**Рекомендований скриншот 2 — canonical folder tree**  
Що відкрити: `/Game/VFXCourse`.  
Що повинно бути видно: `Maps`, `VFX`, `TestAssets`, `Dev` і основні VFX categories.  
Яку область виділити: корінь та два рівні вкладеності.

**Рекомендований скриншот 3 — search/filter**  
Що відкрити: Content Browser із query для `M_Diagnostic_Surface`.  
Що повинно бути видно: один correct result і його path.  
Яку область виділити: query, type і breadcrumb/path.

**Рекомендована схема**  
Що показати: `Asset → багато actors/references`.  
Що повинно бути видно: видалення actor не дорівнює видаленню asset.
