# 07.01 — System, Emitter, Module, Parameter і execution stack

## 1. Назва

**Niagara з чистої системи: System, Emitter, Module, Parameter, namespaces, Parameter Map і порядок виконання stack.**

## 2. Результат уроку

Після уроку ви:

- відрізняєте Niagara System, Emitter, particle, module, parameter і renderer;
- читаєте `System Spawn`, `System Update`, `Emitter Spawn`, `Emitter Update`, `Particle Spawn`, `Particle Update` та `Render` як різні execution groups;
- пояснюєте, чому stack виконується зверху вниз;
- читаєте namespaces `System.`, `Emitter.`, `Particles.`, `User.`, `Engine.`, `Module.`, `Local.` і `Transient.`;
- простежуєте один parameter від запису до читання через Parameter Map;
- створюєте `NS_L07_01_StackTrace` з CPU emitter, deterministic seed і повністю анотованим stack;
- відрізняєте звичайні Spawn/Update groups від advanced `Simulation Stages`, які розглядатимуться у 08.04.

Deliverable: `NS_L07_01_StackTrace`, `NE_L07_01_TraceSprite`, test map `L_L07_01_StackTrace` і таблиця Parameter Map trace.

## 3. Орієнтовний час

**7 годин: 2.5 години теорії / 4.5 години практики.**

- 45 хв — об’єкти Niagara й життєві цикли;
- 45 хв — execution groups та порядок stack;
- 30 хв — namespaces;
- 30 хв — Parameter Map mental model;
- 60 хв — controlled experiments;
- 120 хв — guided practice;
- 60 хв — вправи A/B та self-check.

## 4. Передумови

- контрольна точка опанування `G06`;
- готовий UE 5.8 project і папка `/Game/SVFX/Niagara/Foundations/`;
- `MI_VFX_FoundationSprite` із блока 04, сумісний з Niagara Sprite Renderer;
- уміння створити asset у Content Browser, зберегти його й розмістити Niagara System у Level.

## 5. Нові терміни

- **Niagara System** — контейнер, який координує один або кілька emitters і має власні System-level parameters та lifecycle.
- **Emitter** — генератор і симулятор набору particles з власним stack.
- **Particle** — один запис даних, що народжується, оновлюється і помирає.
- **Module** — послідовний фрагмент Niagara logic, який читає й/або записує parameters.
- **Parameter** — типізоване значення з ім’ям і namespace.
- **Execution group** — місце виконання logic: System/Emitter/Particle Spawn або Update.
- **Renderer** — перетворює simulation attributes на видимі Sprite, Mesh, Ribbon тощо; renderer не є simulation force.
- **Parameter Map** — поточний набір доступних parameter values, який modules послідовно читають і змінюють.
- **Namespace** — префікс імені, що вказує scope/власника data.
- **Binding** — явний зв’язок renderer input або module input з parameter.
- **Sim Target** — місце particle simulation: CPU або GPU.
- **Determinism** — керована генерація random sequence для повторюваного тесту в зафіксованому build і setup.

## 6. Навіщо ця тема потрібна VFX artist

Niagara effect ламається не лише через «неправильне число». Частіше значення записане не в тому group, записане після того, як його вже прочитали, має не той namespace або renderer дивиться на інший attribute. У production вам потрібно швидко відповісти на чотири питання:

1. хто створює data;
2. коли data створюється;
3. хто її змінює;
4. хто її читає для render.

Якщо stack читається як послідовність data transformations, debugging перестає бути вгадуванням.

## 7. Теорія простими словами

Уявіть Niagara як фабрику.

- **System** — будівля з кількома виробничими лініями.
- **Emitter** — одна лінія.
- **Particle** — один виріб із карткою attributes.
- **Module** — станція, що читає картку й дописує або змінює поля.
- **Parameter Map** — картка в її поточному стані.
- **Renderer** — камера на виході, яка читає картку й вирішує, що намалювати.

Spawn виконується під час народження відповідного об’єкта; Update — під час його подальших ticks. Усередині group modules виконуються зверху вниз. Отже, module нижче бачить результат module вище, якщо scope і type сумісні.

## 8. Детальні технічні пояснення

### Ієрархія й частота виконання

| Рівень | Spawn | Update | Типова частота |
|---|---|---|---|
| System | `System Spawn` | `System Update` | один раз / кожний System tick |
| Emitter | `Emitter Spawn` | `Emitter Update` | один раз для emitter / кожний emitter tick |
| Particle | `Particle Spawn` | `Particle Update` | один раз для кожного нового particle / кожний tick для кожного живого particle |
| Render | — | renderer properties/bindings | читає simulation result для побудови draw data |

`System Spawn` не означає particle spawn. `Emitter Update` може створити spawn instructions через `Spawn Rate` або `Spawn Burst Instantaneous`, але `Initialize Particle` виконується окремо для кожного народженого particle у `Particle Spawn`.

### Контракт namespace

| Namespace | Хто володіє / приклад | Початкове правило |
|---|---|---|
| `System.` | одна system instance; `System.ExecutionState` | дані системи |
| `Emitter.` | конкретний emitter; `Emitter.Age` | дані emitter |
| `Particles.` | окремий particle; `Particles.Position` | persistent particle attributes |
| `User.` | exposed input; `User.EffectColor` | зовнішній override; детально у 08.03 |
| `Engine.` | engine-provided context; `Engine.Owner.Position` | read-only context у більшості базових задач |
| `Module.` | inputs/outputs поточного module | локальна межа module call |
| `Local.` | тимчасові values усередині script/module | не є persistent particle attribute |
| `Transient.` | короткоживучі intermediate values | не покладайтеся на persistence між stages |

`Particles.Color` і `Emitter.Color` — різні variables, навіть якщо обидві мають type `Linear Color`. Renderer за default читає саме `Particles.Color`.

### Parameter Map як послідовний state

Conceptual запис:

```text
Map0
  → Initialize Particle writes Particles.Lifetime, Color, SpriteSize, Position
Map1
  → Particle State reads Lifetime, updates Age/NormalizedAge/Alive
Map2
  → Sprite Renderer reads Position, Color, SpriteSize, SpriteRotation
```

Parameter Map не є «глобальним словником без часу». Порядок має значення. Якщо `Scale Color` стоїть до initialization у неправильному stage, module не має коректного initial attribute contract.

### CPU choice цього уроку

`Sim Target = CPUSim` використовується через малу кількість particles, простий inspectable stack і відсутність GPU-only задач. Це не твердження, що CPU «кращий». Порівняння CPU/GPU, GPU fixed bounds і collision choices належить 08.01.

### Версійна межа

Epic reference підтверджує execution order і module roles, але видимі category names, template defaults та деякі labels можуть змінитися між minor builds. **Потребує ручної перевірки в Unreal Engine 5.8.** Запишіть exact `5.8.x` build у evidence.

## 9. Візуальні або математичні приклади

Один particle у guided system:

```text
t = 0.00: Spawn Burst Instantaneous emits spawn instruction Count=3
           Initialize Particle writes Lifetime=1.50, Position=(0,0,0),
           Color=(1,0.4,0.05,1), SpriteSize=(24,24)
t = 0.50: Particle State gives Age≈0.50, NormalizedAge≈0.333
t = 1.50: Age reaches Lifetime; Particle State marks particle dead
```

Таблиця trace:

| Module / item | Reads | Writes | Чому тут |
|---|---|---|---|
| `Emitter State` | system/emitter time | execution state, loop data | визначає active window |
| `Spawn Burst Instantaneous` | emitter loop time | spawn info | має створити particles |
| `Initialize Particle` | spawn context, constants | `Particles.*` initial attributes | першим у Particle Spawn |
| `Particle State` | `Age`, `Lifetime` | `Age`, `NormalizedAge`, стан alive | update життєвого циклу |
| `Sprite Renderer` | position/color/size/rotation | draw data, не simulation attributes | після simulation |

## 10. Контрольовані експерименти

### Експеримент 1 — зверху вниз

1. У копії emitter додайте два `Set new or existing value directly` modules у `Particle Update`.
2. Перший записує `Particles.Color = red`, другий — `Particles.Color = blue`.
3. Переміняйте modules місцями.
4. Останній запис у stack має визначити колір renderer.
5. Видаліть test modules після capture.

### Експеримент 2 — невідповідність namespace

1. Замість `Particles.Color` створіть `Emitter.DebugColor`.
2. Не змінюйте `Sprite Renderer > Color Binding`.
3. Видимий particle не стане автоматично кольором `Emitter.DebugColor`.
4. Поверніть binding до `Particles.Color` і запишіть висновок: однаковий type не створює implicit binding.

### Experiment 3 — Spawn проти Update

1. У Particle Spawn задайте `Particles.SpriteSize = (24,24)`.
2. У Particle Update нижче `Particle State` задайте `(48,12)`.
3. Particle народжується з initial value, але до render поточного update проходить через пізніший write.
4. Зафіксуйте, чому «значення в Initialize Particle» не обов’язково є фінальним.

## 11. Покрокова guided practice

### Крок 1 — assets

1. Створіть Niagara System `NS_L07_01_StackTrace` з **Empty System**.
2. Додайте empty stateful emitter та назвіть instance `NE_L07_01_TraceSprite`.
3. Створіть map `L_L07_01_StackTrace`, поставте system на `(0,0,100)`.

### Крок 2 — повний stack contract

Зберіть stack саме в такому порядку:

```text
NS_L07_01_StackTrace
├─ System Properties
├─ System Spawn
│  └─ no added modules
├─ System Update
│  └─ System State
└─ NE_L07_01_TraceSprite
   ├─ Emitter Properties
   ├─ Emitter Spawn
   │  └─ no added modules
   ├─ Emitter Update
   │  ├─ Emitter State
   │  └─ Spawn Burst Instantaneous
   ├─ Particle Spawn
   │  └─ Initialize Particle
   ├─ Particle Update
   │  └─ Particle State
   └─ Render
      └─ Sprite Renderer
```

### Крок 3 — settings

- `Emitter Properties`: `Sim Target = CPUSim`; `Local Space = False`; `Determinism = True`; `Random Seed = 101`.
- `Emitter State`: `Life Cycle Mode = Self`; `Inactive Response = Complete`; `Loop Behavior = Once`; `Loop Duration Mode = Fixed`; `Loop Duration = 2.0 s`.
- `Spawn Burst Instantaneous`: `Spawn Count = 3`; `Spawn Time = 0.0 s`.
- `Initialize Particle`: `Lifetime = 1.5 s`; `Position = (0,0,0)`; `Color = (1.0,0.4,0.05,1.0)`; `Sprite Size = (24,24)`; `Sprite Rotation = 0°`; `Velocity = (0,0,0)`.
- `Particle State`: default age/lifetime management; `Kill Particles When Lifetime Has Elapsed = enabled`, якщо цей input показаний.
- `Sprite Renderer`: material `MI_VFX_FoundationSprite`; `Alignment = Unaligned`; `Facing Mode = Face Camera`; `Pivot in UVSpace = (0.5,0.5)`; `Sort Mode = None`.

### Крок 4 — bindings

| Renderer field | Binding |
|---|---|
| `Position Binding` | `Particles.Position` |
| `Color Binding` | `Particles.Color` |
| `Velocity Binding` | `Particles.Velocity` |
| `Sprite Rotation Binding` | `Particles.SpriteRotation` |
| `Sprite Size Binding` | `Particles.SpriteSize` |
| `Normalized Age Binding` | `Particles.NormalizedAge` |

Epic Sprite Renderer reference має дві неузгоджені singular/plural форми у prose (`Particle.Velocity`, `Particle.SpriteSize`), тоді як particle attribute reference використовує `Particles.*`. У project оберіть dropdown attribute `Particles.Velocity` і `Particles.SpriteSize`. **Потребує ручної перевірки в Unreal Engine 5.8.**

### Крок 5 — annotation

Додайте stack comments або окрему таблицю:

- «Emitter Update створює інструкції spawn»;
- «Initialize Particle записує persistent attributes»;
- «Particle State просуває Age і визначає death»;
- «Renderer читає attributes; він не просуває simulation».

### Крок 6 — evidence

Перезапустіть simulation тричі. Capture має показувати три particles, які виникають разом і зникають приблизно через `1.5 s`. Додайте build number, full stack screenshot і Parameter Map trace table.

## 12. Точні назви UE nodes, modules і settings

Використані labels:

- asset commands: `FX > Niagara System`, `Empty System`;
- stack items/groups: `System Properties`, `System Spawn`, `System Update`, `Emitter Properties`, `Emitter Spawn`, `Emitter Update`, `Particle Spawn`, `Particle Update`, `Render`;
- modules: `System State`, `Emitter State`, `Spawn Burst Instantaneous`, `Initialize Particle`, `Particle State`;
- renderer: `Sprite Renderer`;
- direct write command для experiments: `Set new or existing value directly` → `Set Parameter`;
- settings: `Sim Target`, `Local Space`, `Determinism`, `Random Seed`, `Life Cycle Mode`, `Inactive Response`, `Loop Behavior`, `Loop Duration Mode`, `Loop Duration`, `Spawn Count`, `Spawn Time`, `Lifetime`, `Sprite Size`, `Facing Mode`, `Alignment`, `Pivot in UVSpace`, `Sort Mode`.

Template presence і category path можуть відрізнятися. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Parameter / setting | Type | Старт |
|---|---|---|
| `Emitter.Properties.SimTarget` | enum | `CPUSim` |
| `Emitter.Properties.LocalSpace` | bool | `False` |
| `Emitter.Properties.Determinism` | bool | `True` |
| `Emitter.Properties.RandomSeed` | int32 | `101` |
| loop duration | float seconds | `2.0` |
| burst count | int32 | `3` |
| burst time | float seconds | `0.0` |
| `Particles.Lifetime` | float seconds | `1.5` |
| `Particles.Position` | Position | `(0,0,0)` |
| `Particles.Velocity` | Vector cm/s | `(0,0,0)` |
| `Particles.Color` | Linear Color | `(1,0.4,0.05,1)` |
| `Particles.SpriteSize` | Vector2D cm | `(24,24)` |
| `Particles.SpriteRotation` | float degrees | `0` |

## 14. Очікуваний результат кожного етапу

| Етап | Observable result |
|---|---|
| Empty System + emitter | один emitter без template clutter |
| Emitter lifecycle | один two-second loop, без нескінченного respawn |
| Burst | рівно 3 spawn instructions у момент `0` |
| Initialize | три однакові orange sprites у system origin |
| Particle State | усі зникають після lifetime, без завислих particles |
| Renderer bindings | зміна `Particles.Color`/`SpriteSize` змінює visible result |
| Trace | для кожного visible attribute відомі writer, reader і stage |

## 15. Самостійна вправа

### `EX-L07-01-A` — Діагностика порядку stack

Створіть `NS_EX_L07_01_StackOrder` з одним CPU sprite emitter. Burst `5`, lifetime `2.0`. У `Particle Update` два direct-write modules мають по черзі ставити `Particles.Color` green і magenta. Доведіть двома captures, що нижній write перемагає, а потім залиште production order із magenta нижче. Подайте full stack, Parameter Map trace і пояснення без фрази «бо Niagara так вирішив».

Повне рішення: [L07-01 answers](../EXERCISE_ANSWERS/L07-01_niagara_system_emitter_module_and_stack_answers.md#ex-l07-01-a).

## 16. Додаткова складніша вправа

### `EX-L07-01-B` — Аудит scope двох emitters

Створіть `NS_EX_L07_01_ScopeAudit` з emitters `Emitter_Orange` і `Emitter_Cyan`. Обидва мають однаковий lifecycle, але різні `Particles.Color`, size і seed. Створіть `Emitter.DebugColor` у першому emitter й доведіть, що другий emitter та Sprite Renderer не використовують його без explicit binding/copy. Подайте дві scope tables і один screenshot обох emitters.

Повне рішення: [L07-01 answers](../EXERCISE_ANSWERS/L07-01_niagara_system_emitter_module_and_stack_answers.md#ex-l07-01-b).

## 17. Три рівні підказок

### Для `EX-L07-01-A`

- **Hint 1:** дивіться на вертикальний порядок двох modules, а не на час їх створення в editor.
- **Hint 2:** обидва writes повинні мати exact target `Particles.Color` і стояти в одному `Particle Update`.
- **Hint 3:** trace завершується останнім write перед renderer: `Initial Color → green → magenta → Color Binding`.

### Для `EX-L07-01-B`

- **Hint 1:** namespace є частиною exact variable name.
- **Hint 2:** складіть окрему колонку `owner` для `Emitter_Orange`, `Emitter_Cyan` і кожного `Particles.*` dataset.
- **Hint 3:** не змінюйте renderer binding, доки не зафіксуєте, що `Emitter.DebugColor` сам по собі не впливає на `Particles.Color`.

## 18. Типові помилки

- плутати System і Emitter asset/instance;
- називати renderer «останнім simulation module»;
- ставити `Initialize Particle` у Particle Update;
- вважати, що нижчий stack item виконується раніше;
- очікувати automatic conversion між `Emitter.DebugColor` і `Particles.Color`;
- залишати `Loop Behavior = Infinite`, а потім рахувати burst як один;
- робити GPU emitter лише тому, що renderer працює на GPU;
- використовувати `User.` для внутрішнього temporary value;
- не фіксувати exact build при deterministic comparison.

## 19. Пошук несправностей

| Симптом | Перевірка | Виправлення |
|---|---|---|
| нічого не видно | material, renderer enabled, burst, bounds, system transform | поставте known-good material, Count=3, origin над floor |
| particles не помирають | `Particle State`, lifetime | поверніть module і lifetime `1.5` |
| burst повторюється | loop behavior / editor auto-reset | `Once`; reset simulation вручну |
| колір не змінюється | target namespace і renderer binding | write `Particles.Color`; bind `Particles.Color` |
| local movement дивний | `Local Space` | для уроку `False`; не змішуйте spaces |
| stack dependency warning | stage/order | прийміть `Fix Issue`, потім звірте contract |
| 3 resets різні | seed, ranges, auto-play timing | determinism on, seed 101, fixed values, однаковий reset protocol |

## 20. Міркування про performance

- Три CPU particles — свідомо малий diagnostic budget; не робіть висновок про high-count workload.
- Cost має simulation і rendering частини. CPU simulation не означає CPU rendering sprites.
- Кожен particle attribute збільшує payload; не створюйте дублікати без причини.
- Translucent material може мати overdraw, навіть якщо simulation проста.
- Bounds мають охоплювати effect. У цьому нерухомому CPU test auto bounds достатні для лабораторії; production bounds audit виконується у 07.08, а системний scalability курс — у 08.05/10.
- Для performance висновку потрібне вимірювання, а не лише particle count.

## 21. Запитання для самоперевірки

1. Чим System відрізняється від Emitter?
2. Коли виконується `Particle Spawn`, а коли `Particle Update`?
3. Чому порядок modules у group має значення?
4. Що робить Parameter Map у mental model?
5. Чому `Emitter.DebugColor` не є `Particles.Color`?
6. Хто пише `Particles.NormalizedAge` у базовому lifecycle?
7. Чи Sprite Renderer змінює particle velocity?
8. Чому цього уроку обрано CPU, а не GPU?
9. Чим Spawn/Update group відрізняється від advanced Simulation Stage?
10. Які чотири факти треба знайти для debugging parameter?

## 22. Відповіді

1. System координує emitters і System-level state; emitter породжує та симулює власний particle dataset.
2. Spawn — один раз для кожного нового particle; Update — кожний simulation tick, доки particle живий.
3. Stack виконується зверху вниз; нижній module читає map після попередніх writes і може overwrite attribute.
4. Це послідовний state типізованих parameters, який переходить через modules.
5. Namespace і owner є частиною identity variable; потрібен explicit copy/binding.
6. `Particle State` на основі `Particles.Age` і `Particles.Lifetime`.
7. Ні; він читає attributes і створює render data.
8. Мала inspectable лабораторія без GPU-only потреб; CPU/GPU trade-off ще не оцінюється.
9. Spawn/Update — базові execution groups; Simulation Stages — додатковий advanced GPU/iteration workflow, не синонім.
10. Writer, stage/time write, namespace/type і reader/binding.

## 23. Чекліст самоперевірки

- [ ] `NS_L07_01_StackTrace` створено з empty system.
- [ ] Full stack збігається з contract.
- [ ] CPU, Local Space, determinism і seed записані.
- [ ] Burst виникає один раз і має Count `3`.
- [ ] Lifetime `1.5` керує death.
- [ ] Усі шість renderer bindings перевірені.
- [ ] Parameter Map trace має writer/readers.
- [ ] Я можу пояснити namespaces без слова «папка».
- [ ] Я відрізняю Render від Particle Update.
- [ ] Обидві вправи мають evidence.
- [ ] Exact UE 5.8.x build зафіксовано.

## 24. Критерії опанування

Урок засвоєно, якщо без notes ви:

1. за 20 хвилин створюєте clean one-emitter System;
2. називаєте всі шість Spawn/Update groups у правильній ієрархії;
3. пояснюєте top-to-bottom overwrite;
4. простежуєте `Particles.Color`, `Position`, `Lifetime`, `NormalizedAge`;
5. відрізняєте `Emitter.`, `Particles.` і `User.`;
6. виправляєте один namespace і один stack-order defect;
7. виконуєте A/B;
8. відповідаєте щонайменше на 8 із 10 питань.

## 25. Підсумок

Niagara — це впорядкований data-flow runtime. System координує emitters; emitter породжує particles; modules послідовно змінюють Parameter Map; renderer читає final attributes. Stage, order, namespace, type і binding визначають результат не менше, ніж numeric value.

## 26. Зв’язок із наступними уроками

У [07.02 — Spawn, lifetime, normalized age і curves](02_spawn_lifetime_normalized_age_and_curves.md) цей stack стане часовою лабораторією. Ви порівняєте Burst і Rate, виведете `NormalizedAge = Age / Lifetime` та використаєте його як стабільну вісь curves.

## 27. Офіційні джерела

- [Creating Visual Effects in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-visual-effects-in-niagara-for-unreal-engine)
- [Overview of Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-niagara-effects-for-unreal-engine)
- [System and Emitter Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-and-emitter-module-reference-for-niagara-effects-in-unreal-engine)
- [Emitter Spawn Group Reference](https://dev.epicgames.com/documentation/unreal-engine/emitter-spawn-group-reference-for-niagara-effects-in-unreal-engine?lang=en-US)
- [Emitter Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/emitter-update-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Spawn Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-spawn-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-update-group-reference-for-niagara-effects-in-unreal-engine)
- [Render Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine)

URL перевірено 2026-07-27. Version-sensitive labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Full `NS_L07_01_StackTrace` System Overview: усі groups розгорнуті, видимі exact order і emitter name.
2. `Emitter Properties`: `Sim Target`, `Local Space`, `Determinism`, `Random Seed`.
3. `Initialize Particle` поруч із renderer binding panel для `Particles.Color` і `Particles.SpriteSize`.
4. Схема `Parameter Map 0 → Initialize → Particle State → Renderer`.
5. Two-capture comparison з переставленими direct-write color modules.

Не вигадуйте screenshots. Знімайте їх у встановленому UE 5.8.x build і підписуйте build, asset та перевірюваний contract.
