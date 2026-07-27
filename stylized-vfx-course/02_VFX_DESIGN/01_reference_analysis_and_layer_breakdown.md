# 1. Назва

## Урок 02.01 — Етичний аналіз референсів і декомпозиція ефекту

# 2. Результат уроку

Після уроку ти зможеш:

- вибрати придатний відеореференс і зафіксувати його походження;
- відокремити спостережуваний факт від власного припущення;
- розкласти складний real-time effect на функціональні шари;
- описати роль кожного шару в silhouette, timing і gameplay communication;
- відрізнити вивчення design principle від копіювання конкретної форми;
- сформувати production-oriented layer breakdown із первинною оцінкою вартості;
- створити абстрактну reconstruction board лише з власних простих shapes.

Ключовий результат — завершений `Reference Breakdown Sheet`, який можна використати як основу для оригінального effect brief, але не як інструкцію з копіювання чужого asset.

# 3. Орієнтовний час

**6 годин: 2 години теорії та 4 години практики.**

| Частина | Час |
|---|---:|
| Ментальна модель і етика | 35 хв |
| Layer taxonomy | 45 хв |
| Візуальні вимірювання | 40 хв |
| Controlled experiments | 45 хв |
| Guided practice | 1 год 45 хв |
| Самостійні вправи, self-check і журнал | 1 год 35 хв |

# 4. Prerequisites

- Пройдено `G01`.
- Є UE 5.8 VFX test level із зафіксованою gameplay camera.
- Студент уміє створити й зберегти простий документ у Photoshop або Krita.
- Прочитано правила роботи з референсами в `03_STUDY_AND_SELF_REVIEW.md`.

# 5. Нові терміни

| Термін | Пояснення | Практичне питання |
|---|---|---|
| **Reference study** | Аналіз принципів чужої роботи без вилучення або повторного використання assets | Який принцип руху або композиції можна сформулювати словами? |
| **Layer decomposition** | Поділ ефекту на елементи з окремою функцією | Що зникне з повідомлення ефекту, якщо прибрати цей шар? |
| **Primary shape** | Найважливіша форма, яка першою передає дію | Чи видно напрямок і тип дії лише за silhouette? |
| **Secondary shape** | Форма, яка уточнює обсяг, енергію або матеріальність | Чи допомагає вона primary shape, а не конкурує з нею? |
| **Accent** | Короткий, контрастний елемент у ключовий момент | Чи підсилює він contact/impact frame? |
| **Supporting particles** | Дрібні частинки, що пояснюють scale, direction або material behavior | Чи читається ефект без них? |
| **Residue** | Залишковий шар після main action | Чи підтверджує він місце контакту й завершення дії? |
| **Screen-space footprint** | Частка екрана, яку займає видимий effect | Чи перекриває effect персонажа, ціль або telegraph? |
| **Camera dependence** | Залежність сприйняття від позиції, FOV і руху камери | Чи працює effect тільки з одного постановочного ракурсу? |
| **Observation** | Те, що безпосередньо видно у footage | «Яскравий arc з’являється за два кадри до impact». |
| **Inference** | Обґрунтоване, але неперевірене припущення про реалізацію | «Arc, імовірно, є camera-facing mesh». |
| **Design principle** | Узагальнене правило, придатне для іншої роботи | «Найяскравіший accent збігається з contact». |

# 6. Навіщо ця тема потрібна VFX artist

Junior VFX artist рідко отримує завдання «зроби точно цей effect». Частіше є gameplay intent, mood, кілька референсів і технічні обмеження. Якщо аналіз зводиться до «бачу синій спалах — зроблю синій спалах», результат буде поверховим і залежним від tutorial.

Декомпозиція дає три практичні переваги:

1. **Керованість.** Кожний шар можна створити, перевірити й оптимізувати окремо.
2. **Оригінальність.** Ти переносиш принцип, а не копіюєш конкретний contour, texture або timing.
3. **Production thinking.** Ще до Niagara можна помітити надмірний screen coverage, дублювання шарів і потенційно дорогі елементи.

Це також мова спілкування з gameplay, animation і art direction: замість «ефект не такий» можна сказати «primary arc запізнюється відносно contact, а residue перекриває наступну дію».

# 7. Теорія простими словами

Уяви effect як коротке речення:

- **primary shape** — головне дієслово;
- **secondary shapes** — пояснюють, як саме відбулася дія;
- **accent** — знак оклику;
- **supporting particles** — інтонація та material clues;
- **residue** — наслідок, який підтверджує, що подія завершилася.

Аналізувати треба не «з чого це зроблено в Niagara», а спочатку «що гравець повинен зрозуміти й у якій послідовності». Реалізація є другим питанням.

Корисний порядок перегляду:

1. Подивитися кліп у реальному часі й записати перше враження одним реченням.
2. Подивитися без кольору: що тримає silhouette і value hierarchy?
3. Подивитися покадрово: коли виникає кожний шар?
4. Подивитися тільки на рух: куди спрямована енергія?
5. Подивитися на gameplay context: що видно до, під час і після дії?
6. Лише потім припускати renderer, material або simulation method.

# 8. Детальні технічні пояснення

## 8.1. Вибір референсу

Референс придатний, якщо:

- походить з офіційно опублікованого footage або матеріалу, який дозволено переглядати;
- має достатню temporal clarity: effect видно щонайменше кілька кадрів;
- містить gameplay camera, а не лише cinematic close-up;
- дозволяє відокремити effect від UI, motion blur і post-processing;
- відповідає задачі за функцією, а не лише за кольором.

Запиши: назву гри, офіційний канал або сторінку, URL, дату доступу, приблизний timestamp, тип камери й мету аналізу. Не завантажуй game files, не витягуй textures/meshes і не trace-юй proprietary contours.

## 8.2. Observation, inference і confidence

Для кожного твердження постав мітку:

- `OBS` — безпосередньо видно;
- `INF-H` — inference з високою впевненістю;
- `INF-M` — середня впевненість;
- `UNK` — невідомо.

Приклад:

- `OBS`: arc витягнутий у напрямку удару.
- `OBS`: його brightest frame триває приблизно один кадр.
- `INF-M`: arc може бути animated mesh або sprite sequence.
- `UNK`: точний Blend Mode і material graph.

Це захищає від вигаданих технічних «фактів».

## 8.3. Функціональна layer taxonomy

Для кожного шару заповни поля:

| Поле | Що записати |
|---|---|
| `Layer ID` | `P1`, `S1`, `A1`, `SP1`, `R1` |
| `Function` | direction, volume, contact, scale, persistence тощо |
| `Shape` | arc, wedge, ring, streak, cluster, cloud |
| `Value` | low, mid, high, clipped accent |
| `Color role` | dominant, accent, neutral-hot, dark support |
| `Start/Peak/End` | normalized time 0–1 |
| `Motion` | linear, radial, orbiting, turbulent, settling |
| `Space` | character, weapon, world, target, camera-dependent |
| `Occlusion risk` | low/medium/high |
| `Likely cost driver` | screen area, particle count, ribbon length, lights, collision |

Не визначай шар за способом реалізації. «Sprite layer» — слабкий опис. «Короткий contact accent, що фіксує точку удару» — функціональний опис, який можна реалізувати різними способами.

## 8.4. Межі шару

Створюй окремий layer, якщо змінюється хоча б дві з цих властивостей:

- функція;
- timing;
- motion;
- value;
- spatial attachment;
- scale;
- lifecycle.

Не розбивай десять однакових sparks на десять шарів. Це один supporting-particle layer із десятьма instances.

## 8.5. Reference principle проти копії

Допустимий principle:

> «Перед impact primary shape стискається вздовж осі руху, а після contact розкривається radial secondary ring».

Недопустима reconstruction goal:

> «Повторити той самий contour, ті самі пропорції, точну кількість зубців, колірні значення й frame timing».

Для оригінальної варіації зміни щонайменше чотири design axes:

- silhouette family;
- proportion;
- motion path;
- timing rhythm;
- secondary-shape logic;
- residue behavior;
- value distribution;
- elemental material cues.

Простий recolor не змінює design logic.

## 8.6. Первинна cost classification

На design stage не вигадуй універсальний budget. Познач ризики:

- `S` — великий translucent screen area;
- `N` — висока кількість particles;
- `R` — довгі ribbons або багато segments;
- `C` — collision/data sampling;
- `L` — dynamic lights;
- `O` — багато overlapping layers;
- `D` — довга duration або багато active Systems.

Ці мітки не є performance verdict. Вони визначають, що пізніше треба виміряти на target hardware.

# 9. Візуальні або математичні приклади

## 9.1. Normalized timeline

Познач початок effect як `t = 0`, кінець як `t = 1`.

Якщо clip триває 30 кадрів, а impact відбувається на кадрі 12:

```text
t_impact = 12 / 30 = 0.40
```

Тепер timing можна перенести в effect іншої тривалості без копіювання абсолютної кількості кадрів. Для effect тривалістю 0.75 с:

```text
impact_time = 0.75 × 0.40 = 0.30 с
```

## 9.2. Screen-space footprint

Оціни bounding rectangle effect:

```text
coverage ≈ (effect_width × effect_height) / (viewport_width × viewport_height)
```

Для rectangle 700×400 у viewport 1920×1080:

```text
coverage ≈ 280000 / 2073600 ≈ 0.135 = 13.5%
```

Це лише порівняльна оцінка. Прозорі області й overlap вона не враховує.

## 9.3. Layer timing table

| Layer | Start | Peak | End | Функція |
|---|---:|---:|---:|---|
| P1 primary arc | 0.18 | 0.38 | 0.52 | Напрямок атаки |
| A1 contact flash | 0.37 | 0.40 | 0.43 | Фіксація impact |
| S1 radial ring | 0.39 | 0.48 | 0.68 | Розширення енергії |
| SP1 sparks | 0.40 | 0.58 | 0.90 | Scale і material cue |
| R1 smoke residue | 0.55 | 0.75 | 1.00 | Наслідок |

Таблиця показує staggered timing: шари не стартують і не закінчуються одночасно.

## 9.4. Абстракція

Замість trace чужого arc:

- заміни curved blade на tapered wedge;
- зміни напрямок із горизонтального на diagonal;
- заміни один ring на два broken crescents;
- зроби residue коротким і спрямованим, а не круговим;
- збережи лише principle: «directional anticipation → contact accent → radial response».

# 10. Controlled experiments

## Experiment 1 — Color removal

1. Візьми один legally viewable frame reference.
2. Створи grayscale copy.
3. Зменш preview до 25% розміру.
4. За 10 секунд назви primary shape і brightest accent.
5. Якщо не можеш — запиши, які color differences маскували слабку value hierarchy.

**Контрольована змінна:** color information.  
**Очікування:** функціональна композиція частково зберігається без hue.

## Experiment 2 — Layer subtraction

1. На tracing-free abstract board відтвори тільки P1.
2. Додай A1.
3. Додай S1.
4. Додай SP1 і R1.
5. Порівняй, на якому кроці message стає зрозумілим, а на якому починається clutter.

**Контрольована змінна:** кількість функціональних шарів.  
**Очікування:** не кожний видимий шар однаково важливий.

## Experiment 3 — Timing shuffle

1. Створи п’ять rectangles, що представляють P1, A1, S1, SP1, R1.
2. У варіанті A синхронізуй усі peaks.
3. У варіанті B розведи peaks за таблицею 9.3.
4. Переглянь обидва animatics у реальному часі.

**Контрольована змінна:** temporal staggering.  
**Очікування:** варіант B має чіткіший rhythm і менше візуального злипання.

# 11. Покрокова guided practice

## Етап 1 — Сформулюй питання

Не починай з «подобається effect». Запиши:

> Як effect передає напрямок melee contact і залишає target видимою?

Одне питання обмежує аналіз.

## Етап 2 — Зафіксуй джерело

Створи картку:

```text
Title:
Official publisher/developer:
URL:
Access date:
Timestamp:
Camera type:
Study question:
Usage rule: observation only; no extracted assets.
```

## Етап 3 — Вибери короткий interval

Візьми 0.5–2.0 секунди навколо однієї gameplay action. Вибери 8–12 ключових моментів:

1. neutral;
2. anticipation start;
3. pre-contact;
4. contact;
5. accent frame;
6. early dissipation;
7. late dissipation;
8. residue;
9–12. додаткові моменти, якщо змінюється motion або silhouette.

## Етап 4 — П’ять переглядів

1. **Message pass:** одне речення про gameplay event.
2. **Silhouette pass:** primary/secondary shapes без кольору.
3. **Value/color pass:** dominant, accent і dark support.
4. **Timing pass:** Start/Peak/End кожного layer.
5. **Camera/cost pass:** screen coverage, overlap і ризики.

Не змішуй записи різних passes.

## Етап 5 — Заповни layer table

Мінімум:

- 1 primary;
- 1–3 secondary;
- 1 accent;
- 1 supporting-particle group;
- 0–2 residue layers.

Якщо нарахував понад 10 layers, об’єднай елементи з однаковою функцією та timing.

## Етап 6 — Побудуй normalized timeline

Для кожного layer запиши `Start`, `Peak`, `End` у діапазоні 0–1. Намалюй horizontal bars. Познач contact vertical line.

## Етап 7 — Створи abstract reconstruction

У Photoshop/Krita:

1. Створи document 1920×1080.
2. Зроби neutral dark-gray background.
3. Використовуй тільки ellipse, polygon, line і soft brush.
4. Не trace-юй reference.
5. Зміни silhouette family, proportions і motion direction.
6. Збережи функціональний порядок шарів.

## Етап 8 — Додай cost-risk tags

Познач кожний layer кодами `S/N/R/C/L/O/D`. Для кожного ризику напиши майбутню перевірку, наприклад:

> `S`: перевірити translucent coverage у gameplay camera на High/Medium/Low.

## Етап 9 — Сформулюй три principles

Приклад:

1. Primary direction читається до contact.
2. Accent коротший за secondary response.
3. Residue має нижчий value й не перекриває наступну action.

## Етап 10 — Проведи ethics check

Переконайся, що не переносиш:

- exact contour;
- точну texture;
- точні пропорції;
- повну color palette;
- унікальний symbol;
- унікальну послідовність деталей.

# 12. Точні назви nodes, modules і settings

У цьому design lesson Material nodes і Niagara modules не використовуються. Використовуються такі точні інструменти:

### Photoshop

- `File > New`
- `Window > Layers`
- `Window > Timeline`
- `Image > Adjustments > Desaturate` для швидкого контрольного preview
- `Layer > New Adjustment Layer > Black & White` для nondestructive grayscale check
- `Rectangle Tool`, `Ellipse Tool`, `Polygon Tool`, `Line Tool`
- `Brush Tool`
- `Transform` через `Edit > Free Transform`

### Krita equivalents

- `File > New`
- `Settings > Dockers > Layers`
- `Settings > Dockers > Animation Timeline`
- `Filter > Adjust > Desaturate`
- `Rectangle Tool`, `Ellipse Tool`, `Polygon Tool`, `Line Tool`, `Freehand Brush Tool`
- `Tool > Transform`

### Unreal Engine 5.8

- `Level Editor Viewport`
- `Perspective`
- `Field of View` у camera або viewport setup, якщо він уже зафіксований у test level
- `High Resolution Screenshot` можна використати лише для власного test scene

Положення окремих menu commands потребує ручної перевірки у встановленій версії Photoshop/Krita та Unreal Engine 5.8.

# 13. Стартові значення параметрів

| Параметр | Стартове значення | Навіщо |
|---|---:|---|
| Design board | 1920×1080 px | Відповідає типовому 16:9 gameplay review |
| Color mode | RGB, 8 bit | Достатньо для design board |
| Background value | 18–25% gray | Видно dark і bright shapes |
| Key frames | 8–12 | Достатньо для короткої action без надмірного capture |
| Normalized timeline | 0–1 | Порівняння effects різної duration |
| Primary layers | 1 | Зберігає чіткий focal message |
| Secondary layers | 1–3 | Додають обсяг без конкуренції |
| Accent layers | 1–2 | Не розмивають focal moment |
| Supporting groups | 1–2 | Один group може містити багато particles |
| Reference preview scale | 25% і 100% | Перевірка macro-read та деталей |
| Abstract reconstruction values | 20%, 55%, 90–100% | Простий three-value hierarchy |

# 14. Очікуваний результат кожного етапу

| Етап | Перевірюваний результат |
|---|---|
| Питання | Одне конкретне design question |
| Source card | Є attribution, timestamp і usage rule |
| Key frames | Видно повний lifecycle action |
| Five passes | Observation не змішано з inference |
| Layer table | Кожний layer має функцію, timing і cost risk |
| Timeline | Peaks і contact читаються без footage |
| Abstract reconstruction | Передає principle, але не повторює exact shapes |
| Cost tags | Кожний risk має майбутню measurement action |
| Principles | Три transferable statements |
| Ethics check | Немає extracted assets, tracing або унікальних copied motifs |

# 15. Самостійна вправа

## EX-L02-01-A — Layer breakdown gameplay impact

**Завдання:** вибери короткий melee або projectile impact з офіційного gameplay footage й створи повний `Reference Breakdown Sheet`.

**Обмеження:**

- interval 0.5–2.0 с;
- 8–12 key frames;
- 5–8 functional layers;
- тільки observations та явно позначені inferences;
- без tracing і без extracted assets;
- abstract reconstruction використовує лише primitive shapes;
- щонайменше три design principles і три cost-risk tags.

**Deliverables:**

1. Source card.
2. Key-frame strip.
3. Layer table.
4. Normalized timeline.
5. Abstract reconstruction.
6. Ethics statement.
7. Три principles.

**Acceptance criteria:**

- primary action зрозуміла без оригінального clip;
- кожний layer має унікальну функцію;
- abstract board не повторює exact contour;
- observations/inferences розділені;
- cost risks придатні для майбутнього profiling.

# 16. Додаткова складніша вправа

## EX-L02-01-B — Порівняльний аналіз двох рішень

**Завдання:** порівняй два офіційні gameplay references з однаковою функцією, але різною visual language, наприклад два projectile impacts або дві transformation activations. Побудуй одну comparative matrix і сформуй третій, оригінальний design direction.

**Обмеження:**

- не оцінюй «краще/гірше» без критерію;
- використовуй однакову layer taxonomy для обох references;
- не змішуй точні форми двох робіт;
- оригінальний direction має змінити щонайменше чотири design axes;
- додай camera-dependence і cost-risk comparison.

**Deliverables:**

1. Дві source cards.
2. Comparative layer/timing matrix.
3. Таблиця similarities/differences за функцією.
4. Оригінальний five-layer brief.
5. 6-frame abstract animatic.
6. Ethics statement.

**Acceptance criteria:**

- comparison використовує ті самі критерії;
- conclusions описують principles, а не superficial colors;
- оригінальний brief не є hybrid copy;
- animatic має власні silhouette, rhythm і residue behavior.

# 17. Три рівні підказок

## EX-L02-01-A

- **Hint 1 — напрямок мислення:** почни з питання «який gameplay fact повідомляє effect?» і знайди найменшу кількість шарів, що передає цей факт.
- **Hint 2 — потрібні інструменти:** source card, 8–12 frames, grayscale preview, layer table `P/S/A/SP/R`, normalized timeline і primitive-shape board.
- **Hint 3 — майже повна структура:** `P1 directional shape → A1 contact flash → S1 radial response → SP1 directional particles → R1 low-value residue`; для кожного запиши Start/Peak/End і один cost tag.

[Повне рішення EX-L02-01-A](../EXERCISE_ANSWERS/L02-01_reference_analysis_and_layer_breakdown_answers.md#ex-l02-01-a)

## EX-L02-01-B

- **Hint 1 — напрямок мислення:** порівнюй не картинки, а відповіді на однакові питання: коли читається напрямок, де peak, що залишається після contact.
- **Hint 2 — потрібні інструменти:** дві однакові layer tables, дві normalized timelines, screen-space estimates, design-axis checklist і 6-frame abstract animatic.
- **Hint 3 — майже повна структура:** створи rows `primary/secondary/accent/support/residue`, columns `Reference A/Reference B/New direction`; у New direction зміни silhouette, motion path, timing rhythm і residue.

[Повне рішення EX-L02-01-B](../EXERCISE_ANSWERS/L02-01_reference_analysis_and_layer_breakdown_answers.md#ex-l02-01-b)

# 18. Типові помилки

1. **Опис кольору замість функції.** «Синя пляма» не пояснює, навіщо існує layer.
2. **Припущення видається за факт.** Renderer або material неможливо точно визначити лише з footage.
3. **Надмірна кількість layers.** Instances з однаковою функцією треба групувати.
4. **Усі peaks одночасно.** Effect перетворюється на один нечіткий flash.
5. **Trace proprietary contour.** Це копіювання instance, а не вивчення principle.
6. **Аналіз тільки cinematic camera.** Gameplay readability залишається неперевіреною.
7. **Cost verdict без вимірювання.** Design-stage tags — гіпотези, не profiler results.
8. **Reference board без attribution.** Пізніше неможливо перевірити джерело й дозволений контекст.
9. **Змішування двох references у collage.** Потрібен новий design logic, а не монтаж деталей.

# 19. Troubleshooting

| Симптом | Імовірна причина | Дія |
|---|---|---|
| Не можу визначити primary shape | Кадр перевантажений post-processing або UI | Перейди в grayscale, зменш preview, вибери інший timestamp |
| Кожна частинка здається окремим layer | Аналіз за instances, а не функцією | Групуй елементи з однаковими timing/motion/function |
| Timeline не збігається з відчуттям clip | Вибрано неправильні start/end межі | Додай neutral frame до й після action, перенормалізуй |
| Abstract board надто схожий на reference | Збережено contour і proportions | Зміни чотири design axes; заборони собі trace |
| Без кольору effect зникає | Hue замінював value hierarchy | Введи three-value plan і перевір на 25% scale |
| Неясно, чи це residue чи secondary | Не визначена функція | Запитай: layer пояснює main action чи лише її наслідок після peak? |
| Cost table виглядає вигаданою | Записані числа без profiler | Заміни числа на risk codes і конкретні майбутні tests |
| Footage має занадто мало кадрів | Сильний motion blur або монтаж | Вибери довший official gameplay shot з тією самою функцією |

# 20. Performance considerations

Design analysis не замінює profiling, але може зменшити ризик до implementation:

- великий translucent screen-space footprint позначай як `S`;
- тривалі overlapping residue layers — як `O` і `D`;
- hundreds of visible sparks не рахуй буквально з compressed footage; познач як `N` і перевір пізніше;
- dynamic-looking glow не доводить наявність dynamic light;
- cinematic motion blur може приховувати реальну складність silhouette;
- effect, який читається лише через дуже високу яскравість, може вимагати дорожчого screen coverage замість сильнішого design;
- рання перевірка на gameplay camera часто дозволяє видалити decorative layers;
- numerical budgets визначаються тільки на representative PC/console hardware і representative scene.

Performance evidence цього уроку — не milliseconds, а коректно сформульований список risk → future measurement.

# 21. Запитання для самоперевірки

1. Чим observation відрізняється від inference?
2. Чому renderer type не є достатньою назвою layer?
3. Яка роль primary shape?
4. Коли кілька sparks треба об’єднати в один layer?
5. Навіщо normalizing timeline до 0–1?
6. Назви чотири design axes, які треба змінити для оригінальної варіації.
7. Чому grayscale preview корисний, але не достатній?
8. Що означає cost-risk tag `S`?
9. Чому не можна робити performance verdict із відеореференсу?

# 22. Відповіді

1. Observation безпосередньо видно; inference є припущенням про невидиму причину або реалізацію.
2. Renderer описує можливий implementation, але не функцію шару в gameplay communication.
3. Primary shape першою передає напрямок, scale або тип головної дії.
4. Коли вони мають однакову функцію, timing, motion family і lifecycle.
5. Щоб порівнювати rhythm effects різної абсолютної duration і переносити proportions без копіювання кадрів.
6. Наприклад silhouette, proportions, motion path, timing rhythm, residue behavior, value distribution.
7. Він перевіряє value hierarchy, але не показує hue contrast, material identity і повний temporal behavior.
8. Потенційно великий translucent screen-space footprint, який треба виміряти пізніше.
9. Footage не показує actual profiler data, target hardware, hidden particles, simulation type або material cost.

# 23. Self-check checklist

- [ ] Я зафіксував офіційне джерело, URL, timestamp і дату доступу.
- [ ] Я сформулював одне design question.
- [ ] Я відокремив `OBS`, `INF` і `UNK`.
- [ ] Я використав function-based layer names.
- [ ] Primary shape читається в grayscale і на 25% preview.
- [ ] Кожний layer має Start/Peak/End.
- [ ] Timeline містить staggered timing.
- [ ] Abstract reconstruction не trace-ить reference.
- [ ] Змінено щонайменше чотири design axes.
- [ ] Cost tags ведуть до конкретних майбутніх tests.
- [ ] Ethics statement прямо забороняє extracted assets.
- [ ] У навчальному журналі записано, що було найважче визначити.

# 24. Mastery criteria

Урок засвоєно, якщо ти без покрокового туторіалу:

1. створюєш повний breakdown із 5–8 functional layers;
2. правильно розділяєш observation та inference;
3. будуєш normalized timeline з окремими Start/Peak/End;
4. пояснюєш функцію кожного шару одним реченням;
5. створюєш абстрактну оригінальну reconstruction;
6. називаєш щонайменше три transferable principles;
7. позначаєш cost risks без вигаданих числових budgets;
8. проходиш self-check мінімум на 10 із 12 пунктів.

# 25. Підсумок

Reference analysis — це перетворення footage на перевірювану модель: функціональні layers, normalized timing, camera constraints і principles. Сильний breakdown не говорить «скопіюй цей arc»; він говорить «direction читається до contact, accent короткий, а residue підтверджує наслідок». Саме така модель переноситься в оригінальну роботу.

# 26. Зв’язок із наступними уроками

В уроці `02_shape_value_color_and_readability.md` layer table перетвориться на композиційний plan. Ти навчишся керувати silhouette, negative space, value hierarchy, dominant/accent color і screen coverage, а не лише називати layers.

# 27. Офіційні джерела

- Epic Games. [Creating Visual Effects in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-visual-effects-in-niagara-for-unreal-engine). UE 5.8. Загальний production context для майбутньої реалізації layers.
- Epic Games. [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara). UE 5.8. Пояснює, чому design-stage cost hypotheses потрібно підтверджувати вимірюванням.
- Epic Games. [Introduction to Performance Profiling and Configuration](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine). UE 5.8. Контекст representative profiling.
- Epic Games. [Guidelines for Optimizing Rendering for Real Time](https://dev.epicgames.com/documentation/en-us/unreal-engine/guidelines-for-optimizing-rendering-for-real-time-in-unreal-engine). UE 5.8. Загальні rendering trade-offs.
- Для самого reference study використовуй лише офіційно опубліковане developer/publisher gameplay footage. Записуй конкретне джерело у власному `Reference Breakdown Sheet`; не вилучай assets.

# 28. Рекомендовані скриншоти або схеми

```text
Рекомендована схема 1:
Що показати: functional layer taxonomy.
Що повинно бути видно: P1, S1–S3, A1, SP1, R1 та коротка функція кожного.
Яку область виділити: різницю між функцією шару й способом реалізації.
```

```text
Рекомендована схема 2:
Що показати: normalized timeline.
Що повинно бути видно: horizontal bars Start–Peak–End і vertical contact line.
Яку область виділити: staggered peaks.
```

```text
Рекомендований скриншот 3:
Що відкрити: Photoshop/Krita board із color і grayscale views поруч.
Що повинно бути видно: primary silhouette на 100% і 25% scale.
Яку область виділити: brightest accent та negative space навколо primary.
```

```text
Рекомендована схема 4:
Що показати: Observation → Principle → Original variation.
Що повинно бути видно: один observed fact, узагальнене правило й нова primitive-shape композиція.
Яку область виділити: чотири змінені design axes.
```
