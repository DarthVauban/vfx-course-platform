# Система самостійного навчання й self-review

## Призначення

Цей файл замінює зовнішній контроль викладача системою evidence-based перевірок. Ви не оцінюєте «скільки прочитано»; ви збираєте докази, що можете:

1. пояснити mental model;
2. відтворити core setup без інструкції;
3. перенести навичку в нову задачу;
4. діагностувати помилку;
5. виміряти й поліпшити performance;
6. аргументовано оцінити художній результат.

## Baseline self-assessment

Виконайте до першого уроку. Не шукайте відповіді. Позначте кожен пункт:

- `0` — не знаю;
- `1` — упізнаю термін;
- `2` — можу виконати з інструкцією;
- `3` — можу виконати самостійно й пояснити.

| Навичка | 0–3 |
|---|---:|
| Створити проєкт і test map у UE | |
| Знайти compile error в Material Editor | |
| Пояснити різницю scalar і vector | |
| Побудувати 0–1 circle mask із UV | |
| Пояснити sRGB для color і data texture | |
| Створити Niagara burst | |
| Пояснити Spawn і Update stages | |
| Налаштувати Sprite Renderer material | |
| Передати User Parameter із Blueprint | |
| Перевірити fixed bounds | |
| Відкрити Shader Complexity | |
| Розкласти impact на 5–7 layers | |
| Створити grayscale texture з alpha | |
| Зробити UV unwrap простого VFX mesh | |

Baseline не впливає на оцінку. Повторіть таблицю після блоків 04, 08 і 11.

## Навчальний журнал

### Запис однієї сесії

```markdown
## YYYY-MM-DD — B##_L## — коротка назва

**Тривалість:** __ хв  
**Theory:** __ хв  
**Practice:** __ хв  
**Мета сесії:**  
**Вхідний стан asset:**  
**Один контрольований параметр:**  
**Прогноз до зміни:**  
**Фактичний результат:**  
**Що створено:**  
**Помилка → гіпотеза → тест → висновок:**  
**Performance evidence:**  
**Використані hints:** none / 1 / 2 / 3  
**Що відтворю без уроку:**  
**Наступний найменший крок:**  
```

### Правило 70/30

Щонеділі підсумуйте:

```text
Practice ratio = практичні хвилини / усі навчальні хвилини × 100%
```

Якщо ratio нижче 70% два тижні поспіль:

1. скоротіть повторне читання;
2. замініть нотування на blind rebuild;
3. не починайте новий lesson, поки не завершено поточний independent task;
4. обмежте reference browsing до заздалегідь визначеного питання.

## Щотижневий review

Виділіть 30–45 хв наприкінці тижня.

### 1. Факти

- Скільки годин заплановано і виконано?
- Який practice ratio?
- Які assets завершено?
- Які mastery criteria ще не виконано?
- Скільки разів використано Hint 3 або solution?

### 2. Retrieval без підглядання

Закрийте course files і за 10 хв напишіть:

- три нові terms;
- одну формулу або data flow;
- один Niagara execution-order rule;
- одну performance risk;
- один художній principle;
- одну помилку та її root cause.

Потім перевірте. Позначайте не лише неправильні, а й нечіткі відповіді.

### 3. Один blind build

Оберіть одну вправу на 20–30 хв:

- 0–1 ring mask із контрольованою товщиною;
- panning texture branch;
- dissolve edge;
- Niagara burst із curve-driven size й alpha;
- mesh particle, aligned to velocity;
- ribbon trail із контрольованою width;
- User Parameter, який реально змінює effect.

Не відкривайте попередній graph. Після завершення порівняйте architecture, а не координати nodes.

### 4. Наступний тиждень

Заплануйте не більше трьох outcomes:

```text
1. Завершити …
2. Повторити без підказки …
3. Виміряти / оптимізувати …
```

Outcome має завершуватися observable evidence, а не словом «вивчити».

## Spaced repetition

Для кожної core skill створіть коротку картку:

```text
Лице: Яку проблему розв’язує [node/module/concept]?
Зворот: input → operation → output; одна типова помилка; один performance trade-off.
```

Повторюйте:

- день 1 — одразу після уроку;
- день 3;
- день 7;
- день 14;
- день 30;
- перед наступним block assessment.

На повторенні не перечитуйте спочатку. Спробуйте відновити відповідь, схему або asset із пам’яті.

## Self-critique художнього результату

### Порядок перегляду

Оцінюйте effect у чотирьох режимах:

1. **Silhouette only:** тимчасово зведіть color до одного value або дивіться thumbnail.
2. **Grayscale:** перевірте value hierarchy.
3. **Gameplay camera:** реальна дистанція, рух персонажа й фон.
4. **Slow motion / frame stepping:** перевірте timing, але не робіть висновок лише зі slow motion.

### Питання

- Чи читається primary action у перші 1–3 frames контакту?
- Який layer є primary shape? Чи не конкурують із ним accents?
- Де є negative space?
- Чи існує чіткий dominant value і один accent value?
- Чи direction of motion підтримує gameplay action?
- Чи є anticipation, activation, main action, contact, dissipation і residue там, де вони потрібні?
- Чи secondary motion запізнюється, а не запускається одночасно?
- Чи effect читається на світлому, середньому й темному фоні?
- Чи screen coverage відповідає gameplay importance?
- Що можна видалити без втрати змісту?

### Метод трьох змін

Після review запишіть рівно три зміни:

1. одна композиційна;
2. одна timing/motion;
3. одна технічна або performance.

Не змінюйте десять параметрів одночасно. Після кожної зміни робіть A/B capture.

## Technical self-review

### Матеріал

- Відомі Material Domain, Blend Mode, Shading Model і Two Sided?
- Кожен parameter має зрозуміле ім’я, group і default?
- Між гілками немає неочевидного type coercion?
- Mask перевірено окремо через Emissive Color?
- Діапазон перед Opacity/Opacity Mask відомий?
- Texture samples і channels виправдані?
- sRGB/compression/mips відповідають призначенню texture?
- Material Instance дає потрібний art direction control?
- Static Switch використано лише для справді різних compile-time paths?
- Shader Complexity перевірено на target-like scene?

### Niagara

- System, Emitter, Sim Target і Local Space обрані свідомо?
- Modules стоять у правильних groups і порядку?
- Initialize Particle перед shape/behavior modules, які залежать від attributes?
- Forces стоять до Solve Forces and Velocity?
- Renderer bindings збігаються з attributes і material inputs?
- Lifetime/NormalizedAge logic передбачувана?
- Randomness deterministic там, де потрібна повторюваність?
- Bounds охоплюють effect, але не є безмежно великими?
- System зупиняє spawn і деактивується?
- CPU/GPU choice підтверджено вимірюванням?

### Gameplay

- Effect запускається в правильний animation frame?
- Position, direction і scale приходять із gameplay source, а не «вгадані»?
- Attached effect справді має слідувати socket?
- One-shot не loop-иться й очищається?
- Camera motion, FOV, occlusion і різні фони перевірено?
- Повторне створення component не спричиняє зайвих allocations у stress test?

## Перевірка без підглядання

Для кожного lesson використовуйте три рівні:

### Level A — explain

За 3 хв поясніть topic голосом або письмово без назв конкретних clicks.

### Level B — rebuild

Відтворіть core graph/stack без lesson. Дозволено офіційний reference для перевірки exact node/module name, але не course solution.

### Level C — transfer

Застосуйте logic до іншої element family, mesh, timing або constraint. Простий recolor не зараховується.

Core skill засвоєно, коли Level C працює і ви можете знайти хоча б одну власну помилку.

## Правила reference study

### Дозволено

- власні gameplay captures, зроблені законним способом;
- офіційні trailers, developer breakdowns і screenshots;
- аналіз shapes, values, timing, motion і layer roles;
- власні thumbnails та власноруч створені assets;
- citation джерела, часу й контексту кадру.

### Не дозволено

- extraction proprietary textures, meshes, materials або flipbooks;
- trace чужого effect frame-by-frame для portfolio;
- presentation, що створює враження авторства чужого design;
- використання чужого breakdown як заміни власного аналізу;
- копіювання color/timing/shape разом без суттєвої самостійної зміни.

### Reference analysis card

```markdown
**Джерело / URL / timestamp:**  
**Gameplay context:**  
**Primary shape:**  
**Secondary shapes:**  
**Accents / residue:**  
**Silhouette і negative space:**  
**Value hierarchy:**  
**Dominant / accent color:**  
**Timing beats:**  
**Direction / camera dependence:**  
**Що є загальним principle:**  
**Що є унікальним proprietary design і не копіюється:**  
**Моя нова constraint / theme:**  
```

## Як порівнювати свою роботу з професійною

Не ставте два відео поруч і не запитуйте лише «яке красивіше». Нормалізуйте порівняння:

1. Виберіть однаковий gameplay context: hit, projectile travel, cast або buff.
2. Вирівняйте приблизний screen size.
3. Порівняйте 6–10 ключових frames, а не тільки фінальний still.
4. Окремо оцініть:
   - readability;
   - shape hierarchy;
   - value;
   - timing;
   - motion;
   - cohesion;
   - technical stability;
   - performance evidence.
5. Визначте один principle, який покращить вашу роботу.
6. Реалізуйте principle власними shapes/assets.

Професійний effect може мати більший production budget або залежати від внутрішніх tools. Порівнюйте decision quality, а не кількість layers.

## Шаблон технічної проблеми

```markdown
# Problem report

## Context
- UE version і patch:
- Platform / RHI:
- Asset path:
- System / Emitter / Material:

## Expected
Одне перевірюване речення.

## Actual
Одне перевірюване речення.

## Reproduction
1.
2.
3.

## Evidence
- compile message / log:
- screenshot:
- minimal graph або exact stack order:
- values:

## Already tested
| Гіпотеза | Зміна | Результат |
|---|---|---|
| | | |

## Performance context
- active systems:
- particle count:
- bounds:
- CPU/GPU sim:
- view mode / profiler:

## Smallest reproducible asset
Що можна видалити, а проблема лишається?
```

## Запит до LLM для аналізу технічної помилки

Скопіюйте й заповніть:

```text
Ти аналізуєш технічну помилку в Unreal Engine 5.8. Не вигадуй nodes,
modules, pins або UI. Якщо точний факт не підтверджено, напиши:
«Потребує ручної перевірки в Unreal Engine 5.8.»

Контекст:
[version, platform, asset type]

Очікувано:
[observable result]

Фактично:
[observable result]

Мінімальні кроки відтворення:
[steps]

Material properties / node connections або Niagara stack:
[exact text]

Messages:
[verbatim errors, без секретів]

Що вже перевірено:
[hypothesis → test → result]

Дай:
1. 3–5 гіпотез у порядку ймовірності.
2. Для кожної — один мінімальний тест, який змінює одну змінну.
3. Очікуваний результат тесту.
4. Як інтерпретувати positive/negative result.
5. Які факти слід звірити з офіційною документацією UE 5.8.
Не пропонуй перебудувати весь effect до встановлення root cause.
```

Перед надсиланням видаліть приватні paths, tokens, імена клієнтів і proprietary content.

## Запит до LLM для художнього фідбеку

```text
Ти даєш art-direction feedback для stylized anime real-time gameplay VFX.
Не пропонуй копіювати proprietary assets або конкретний effect кадр у кадр.

Gameplay action:
[що робить персонаж / зброя]

Camera і viewing distance:
[third person / FOV / approximate screen size]

Intent:
[element, mood, gameplay importance]

Layer breakdown:
[primary, secondary, accents, residue]

Timing:
[duration і ключові beats]

Constraints:
[texture count, renderer count, target platform, performance]

Evidence:
[frames/capture descriptions]

Оціни окремо:
1. silhouette і negative space;
2. value hierarchy;
3. dominant/accent color;
4. anticipation, contact, dissipation;
5. direction і secondary motion;
6. gameplay readability на різних фонах;
7. що видалити;
8. три найбільш впливові зміни.

Для кожної зміни вкажи observable before/after criterion.
Чітко відділяй спостереження від припущення.
```

LLM feedback — гіпотеза, а не verdict. Перевіряйте її A/B capture і gameplay test.

## Коли звертатися до офіційної документації

Звертайтеся до official docs, коли:

- не впевнені в exact node/module name;
- UI не збігається з уроком після patch update;
- змінюється platform/RHI;
- feature позначена Experimental або Beta;
- потрібні точні limitations Events, Data Interfaces, Simulation Stages або renderer;
- performance claim не підтверджено profiler capture.

Якщо факт не підтверджено:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## Джерела

- [Unreal Engine 5.8 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine)
- [Material Editor User Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-editor-user-guide)
- [Niagara Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-debugger-for-unreal-engine)
- [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara)
- [Introduction to Performance Profiling](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine)

## Рекомендовані скриншоти або схеми

```text
Рекомендована схема:
Що показати: цикл Build → Observe → Diagnose → Measure → Vary → Review.
Що повинно бути видно: повернення з Review до нового Build.
Яку область виділити: evidence на кожному переході.
```

```text
Рекомендований скриншот:
Що відкрити: приклад навчального журналу поруч із Content Browser.
Що повинно бути видно: asset path, hypothesis table і performance before/after.
Яку область виділити: відсутність приватних даних та proprietary assets.
```
