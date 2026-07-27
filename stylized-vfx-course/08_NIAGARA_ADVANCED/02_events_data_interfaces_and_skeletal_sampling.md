# 1. L08-02 — Events, Data Interfaces і skeletal mesh sampling

| Поле | Значення |
|---|---|
| Блок | 08 — Niagara Advanced |
| Lesson ID | L08-02 |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | CPU Event study, event-free alternative і skeletal-surface sampling prototype |
| Mastery gate | Використати Event або Data Interface лише після перевірки target support, ownership, lifetime, cost і fallback |

## 2. Результат уроку

Ви навчитеся:

- будувати CPU Niagara Event source/receiver з Persistent IDs;
- відрізняти Location, Death і Collision event intent;
- пояснювати, чому Niagara Events не працюють у GPU simulations;
- порівнювати Event Handler із timed emitter та Particle Attribute Reader/data-driven alternative;
- розуміти Data Interface як typed bridge до external/structured data;
- sample-ити skeletal mesh surface/vertices через supported Niagara modules;
- передавати source component як User Parameter;
- діагностувати invalid source, sampling region, space і skinning issues.

Доказ: paired event/event-free effect, animated skeletal sampling capture і decision record.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Event/Data Interface theory | 1.0 | 0 |
| Skeletal sampling theory | 0.5 | 0 |
| Guided Event build | 1.5 | 1.5 |
| Guided skeletal prototype | 1.5 | 1.5 |
| Вправи, validation, profiling | 1.5 | 1.5 |
| **Разом** | **6.0** | **4.5 (75%)** |

## 4. Prerequisites

| Навичка | Де | Перевірка |
|---|---|---|
| CPU/GPU/collision choice | [L08-01](01_cpu_gpu_simulation_and_collision_choices.md) | Events limitation пояснена |
| Multi-emitter System | G07 | Два emitters мають чіткі roles |
| Namespaces/Parameter Map | L07-01 | Простежте `Particles.Position` |
| Mesh spaces/orientation | L07-06 | Local/world transform не плутаються |
| Blueprint User controls | L04-06 intro; повно в L08-03 | Component instance override працює |

## 5. Нові терміни

| Термін | Пояснення |
|---|---|
| Event Generator | Source module, що записує event payload |
| Event Handler | Stage receiver emitter, що обробляє events |
| Persistent ID | Stable particle identifier, потрібний Event workflow |
| Event payload | Дані source event: position, velocity та доступні attributes |
| Location Event | Event із particle location/update context |
| Death Event | Event при завершенні particle |
| Collision Event | Event при collision response |
| Data Interface, DI | Niagara object/interface для доступу до structured external data/functions |
| Skeletal Mesh DI | Interface до skeletal mesh geometry/animation data |
| Sampling Region | Named subset mesh triangles/vertices для sampling |
| Skinning | Перетворення authored mesh vertices кістками поточної pose |
| Particle Attribute Reader, PAR | Data Interface/pattern для читання attributes іншого emitter |

## 6. Навіщо ця тема потрібна VFX artist

Events здаються природним способом «particle створює particle», але мають ціну й limits. Для простого impact flash відомого timing Event може бути зайвим. Для child sparks у точних collision points CPU Event може бути виправданим.

Data Interfaces відкривають ефектам дані:

- geometry skeletal/static mesh;
- curves;
- textures/grids;
- components/actors;
- other Niagara particles;
- scene information.

Кожен DI має target support, memory, update та ownership behavior. Неправильна assumption проявляється лише в packaged build, на іншій platform або з багатьма instances. Тому core skill — не «додати DI», а описати contract і fallback.

## 7. Теорія простими словами

Event path:

```text
Source CPU particle
  → Generate Event
  → Event DataSet
  → Receiver Event Handler
  → Spawn/modify receiver particles
```

Умови:

```text
Source Sim Target = CPU
Persistent IDs = enabled
Generator writes matching event name/type
Receiver selects correct source emitter/event
Handler modules read payload
```

Data Interface path:

```text
External object/data
  → Niagara DI
  → Module function/sample
  → Particle attributes
  → Renderer
```

DI не гарантує «живий» valid source. Source component може бути null, destroyed, wrong type або не мати sampling data.

## 8. Детальні технічні пояснення

### Official Event limitation

Niagara Events не працюють із GPU simulations. Event source/handler prototype у core course використовує CPU Sim і Persistent IDs.

### Location Event

Location event може генеруватися під час particle update й давати receiver position source particle. Якщо event генерується щокадру від багатьох particles:

```text
event rate ≈ living source particles × update frames
```

Це легко створює вибух receiver count. Використовуйте probability, frequency, age window або controlled source count.

### Death Event

Death event доречний для one-time transition:

- projectile core завершується → burst;
- ember завершується → маленький smoke puff;
- shard expires → dissolve accent.

Але якщо death timing уже відомий, receiver emitter може бути синхронізований через deterministic timing без event.

### Collision Event

Collision event може передавати contact-related payload для CPU collision. Risks:

- collision query + event generation + receiver spawn;
- кілька contacts на source;
- tunneling/missed contacts;
- visual event не є gameplay hit.

### Handler execution

Event Handler може spawn-ити receiver particles або виконати logic над existing particles залежно від execution mode. Source emitter, event name/type, spawn count і handler modules мають збігатися.

Exact Event Handler Properties і module names:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Particle Attribute Reader alternative

PAR може дати receiver emitter доступ до source emitter attributes без створення Event DataSet на кожну взаємодію. Це не автоматично дешевше й має власні Sim Target/order/ID constraints. Порівнюйте:

- one-time discrete transition → Event/timed burst;
- continuous follow/sample → PAR/direct parameter;
- high-count communication → переглянути representation.

### Data Interface contract

Запишіть:

```text
DI type:
Source owner:
CPU/GPU support:
Read/write:
Update frequency:
Per-instance object/memory:
Validity test:
Fallback:
```

Data Interface як User Parameter може створювати per-instance UObject/copy/GC overhead. Це не заборона, а причина виміряти instance scale.

### Skeletal sampling modes

Залежно від module/DI, можна sample-ити:

- vertices;
- triangles/surface area;
- bones/sockets;
- sampling regions;
- поточні skinned position/normal/velocity.

Для aura потрібно визначити, що означає «рівномірно»:

- equal chance per triangle упереджує small/large triangles;
- area-weighted surface sampling краще розподіляє по площі;
- vertex sampling залежить від topology density.

Exact modes доступні в установленому UE 5.8.x:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Space

Skeletal sample може бути component/local/world. Receiver Niagara System може бути attached або world-space. Подвійне застосування transform дає offset/rotation error.

Debug:

```text
Sample position only
Then normal
Then velocity
Then render/orientation
```

## 9. Візуальні й математичні приклади

### Event multiplication

```text
50 source particles
Generate Location Event every frame
60 fps
1 receiver per event

Potential event handling ≈ 3,000 receiver spawns/s
```

Probability .05 зменшує expected events, але не замінює deterministic budget.

### Area bias

```text
Triangle A area = 100 cm²
Triangle B area = 1 cm²

Equal triangle index sampling:
  each 50% → tiny triangle overrepresented

Area-weighted:
  A ≈ 99%, B ≈ 1%
```

### Skinned velocity

```text
Surface point moves because bone animates,
even if Niagara component transform is stationary.
```

Якщо DI/module дає current/previous skinned position, velocity можна derive/receive; exact output support перевіряється.

## 10. Controlled experiments

### CE08-02-A — Вибух count від Location Event

1. 25 source particles із lifetime 2 s.
2. `Location Event` під час кожного update.
3. Receiver spawn дорівнює 1.
4. Зафіксуйте receiver count.
5. Обмежте age window/probability генерації event.
6. Повторіть capture.

### CE08-02-B — Death Event проти timed burst

Створіть два visually matched variants:

- A: source death event → burst;
- B: deterministic delay/lifetime timing у receiver.

Порівняйте robustness, authoring complexity і profile.

### CE08-02-C — Vertex vs surface sample

На mesh із uneven topology:

- vertex sampling;
- triangle/area sampling.

Color particles за sampling method і capture density bias.

### CE08-02-D — Invalid source

Remove/unset skeletal component User Parameter. System повинен:

- не вибухати неконтрольовано у world origin;
- передбачувано hide/fallback/disable emitter;
- показувати debug marker/log у test build.

## 11. Покрокова guided practice

### Частина A — CPU Location Event

#### Крок 1 — Source emitter

`NE_EventSource_CPU`:

```text
Emitter Properties
  Sim Target = CPU Sim
  Requires Persistent IDs = true

Emitter Update
  Spawn Burst Instantaneous
    Count = 12

Particle Spawn
  Initialize Particle
    Lifetime = 1.2
    Sprite Size = (12,12)
  Shape Location: Sphere radius 8
  Add Velocity: radial 250–450

Particle Update
  Particle State
  Gravity Force
  Drag
  Solve Forces and Velocity
  Generate Location Event
    controlled frequency/probability

Render
  Sprite Renderer
```

Exact `Requires Persistent IDs` property label і generator inputs:

`Потребує ручної перевірки в Unreal Engine 5.8.`

#### Крок 2 — Receiver emitter

`NE_EventReceiver_CPU`:

```text
Emitter Properties
  Sim Target = CPU Sim

Emitter Spawn/Update
  No independent spawn for event-only baseline

Event Handler
  Source Emitter = NE_EventSource_CPU
  Source Event = LocationEvent
  Execution Mode = Spawned Particles
  Spawn Number = 1

  Receive Location Event
  Initialize Particle
    Lifetime = .25
    Sprite Size = (18,18)
    Color = cyan
  Add Velocity = low radial

Particle Update
  Particle State
  Scale Color by normalized age

Render
  Sprite Renderer
```

Stack/module placement inside Event Handler може відрізнятися:

`Потребує ручної перевірки в Unreal Engine 5.8.`

#### Крок 3 — Limit event volume

Target:

- не більше одного secondary accent per source per chosen interval;
- receiver lifetime short;
- source count controlled;
- optional probability documented.

Використовуйте emitter/particle variables, доступні в actual generator, а не вигадані.

### Частина B — Event-free variant

`NE_TimedReceiver`:

- own deterministic burst at `t=.8` або curve/time gate;
- ті самі sprite material/size/lifetime, що й у Event receiver;
- position у відомому system origin/impact point;
- без per-source location following.

Це valid only if exact source positions are not needed.

### Частина C — Skeletal sampling

#### Крок 4 — Source parameter

Створіть Niagara User Parameter:

```text
User.SourceSkeletalMesh : Skeletal Mesh Component Data Interface
```

Або exact supported object/DI type exposed in 5.8 System:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Зробіть bind/override з placed component/Blueprint.

#### Крок 5 — Surface emitter

`NE_SkeletalSurfaceAura`:

```text
Emitter Properties
  Sim Target = CPU for first diagnostic

Emitter Update
  Spawn Rate = 40

Particle Spawn
  Initialize Particle
    Lifetime = .8–1.4
    Sprite Size = (4,4)
  Skeletal Mesh Location
    Skeletal Mesh / Source ← User.SourceSkeletalMesh
    Sampling Mode = surface/triangle area candidate
    Position output → Particles.Position
    Normal output → Particles.MeshNormal (custom if needed)

Particle Update
  Particle State
  Optional follow/resample strategy
  Scale Color by normalized age

Render
  Sprite Renderer
```

Не виконуйте resample випадкового triangle кожного `Update`, якщо flicker/teleport не є задумом. Для stable attachment може знадобитися зберігати sample index/coordinates і послідовно resample skinned position; точна module support:

`Потребує ручної перевірки в Unreal Engine 5.8.`

#### Крок 6 — Normal/orientation debug

```text
Color = NormalWS × .5 + .5
Velocity = NormalWS × User.OutwardSpeed
```

Якщо particles рухаються всередину, знак normal/space неправильний.

#### Крок 7 — Animation test

- idle;
- fast attack;
- root motion/translation actor;
- component scale;
- вихід off-screen і повернення;
- source destroyed/deactivated.

Запишіть, чи particles лишаються на surface, відстають або використовують spawn-only pose.

#### Крок 8 — Sampling region

Якщо emit мають лише hands/weapon/torso:

- налаштуйте named sampling region у skeletal mesh asset, якщо workflow підтримується;
- виберіть region у Niagara module;
- перевірте area й fallback для invalid region name.

Exact asset UI:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 12. Точні modules, properties і data contracts

### Event source contract

```text
Sim Target = CPU
Persistent IDs = true
Generator Type = Location/Death/Collision as brief requires
Event Name = explicit and matched
Generation rate/window = bounded
Payload fields used = documented
```

### Event receiver contract

```text
Source Emitter = exact handle/name
Source Event = exact generated event
Execution Mode = documented
Spawn Count per Event = bounded
Receive module reads Position/Velocity only if payload supports
Receiver has independent lifetime/kill
```

### Skeletal DI contract

```text
User.SourceSkeletalMesh
Owner = spawning/attached Blueprint or placed System
Expected type = skeletal mesh component DI/object path supported by 5.8
Space = documented
Sampling mode = vertex / area-weighted triangle / region
Update = spawn-only or stable re-sample
Invalid fallback = no spawn/hidden debug
```

### Renderer binding

```text
Sprite Renderer
  Position ← Particles.Position
  Color ← Particles.Color
  Sprite Size ← Particles.SpriteSize
  Facing/Alignment uses Particles.MeshNormal only if configured
```

## 13. Стартові значення

| Setting | Start |
|---|---:|
| Source burst | 12 |
| Source lifetime | 1.2 s |
| Source speed | 250–450 cm/s |
| Receiver lifetime | .25 s |
| Receiver per event | 1 |
| Event probability/frequency | почати з малого значення; вивести з budget |
| Skeletal spawn rate | 40/s |
| Surface particle lifetime | .8–1.4 s |
| Sprite size | 4 cm |
| Outward speed | 20 cm/s |

## 14. Очікуваний результат

| Stage | Evidence |
|---|---|
| Джерело Event | CPU + Persistent IDs, обмежений generator |
| Receiver | Secondary у source locations |
| Event-free | Той самий broad cue з простішим deterministic timing |
| Skeletal source | Particles походять з animated mesh |
| Normal debug | Outward directions/color mapping узгоджені |
| Region | Emission обмежено потрібною body area |
| Invalid source | Передбачуваний no-spawn/fallback |
| Decision | Event/DI обґрунтовано requirement і виміряно |

## 15. Самостійна вправа

### EX08-02-A — Hit sparks: Event проти deterministic alternative

Побудуйте:

- Variant A: CPU collision/death event створює secondary flash;
- Variant B: відомі impact point/timing запускають незалежний secondary emitter;
- однаковий target visual output;
- representative concurrency;
- decision record для одного обраного production approach.

## 16. Додаткова складніша вправа

### EX08-02-B — Animated character surface aura

Вимоги:

- User Parameter для source component;
- region torso/arms або documented full-body fallback;
- area-aware sampling;
- outward motion, керований normal;
- tests idle/attack/root movement;
- behavior invalid/destroyed source;
- рішення щодо CPU/GPU support;
- без uncontrolled random resampling щокадру;
- High/Low variants sampling rate/coverage.

## 17. Три рівні підказок

### EX08-02-A

1. **Напрям:** Event потрібен лише якщо secondary position/time походить від unpredictable source particle.
2. **Структура:** CPU + Persistent IDs → generator → named event → handler.
3. **Майже відповідь:** якщо gameplay уже знає impact transform, передайте його System/Blueprint і використайте deterministic burst.

### EX08-02-B

1. **Напрям:** спершу position debug, потім normal, потім art material.
2. **Структура:** User skeletal source → Skeletal Mesh Location → store position/normal → renderer.
3. **Майже відповідь:** particles teleport-яться, якщо кожен `Update` вибирає новий random triangle; sample один раз або зберігайте stable coordinates/index, якщо module це підтримує.

Повні розв’язки: [L08-02 answers](../EXERCISE_ANSWERS/L08-02_events_data_interfaces_answers.md).

## 18. Типові помилки

| Помилка | Симптом | Виправлення |
|---|---|---|
| Event на GPU | Немає events/compile issue | CPU Sim |
| Persistent IDs вимкнені | Handler inconsistent | Увімкнути на CPU source |
| Location event кожного frame | Receiver explosion | Обмежити rate/window/probability |
| Неправильне source event name | Receiver не spawn-иться | Точні source/type/name |
| Events для known timing | Надмірна complexity | Timed/Blueprint trigger |
| Null skeletal source | Spawn у origin або no output | Validity/fallback |
| Подвійний world/local transform | Offset aura | Один documented space conversion |
| Random resample кожного Update | Teleport/flicker | Stable sample strategy |
| Vertex sample на uneven mesh | Density bias | Area-weighted surface/region |
| DI per instance ігнорується | Memory/GC scaling | Виміряти representative instances |

## 19. Troubleshooting

### No Event

```text
Source CPU?
→ Persistent IDs?
→ Generator executed?
→ Correct event type/name?
→ Receiver source emitter?
→ Handler spawn count/mode?
→ Receiver lifetime/renderer?
```

### Skeletal particles at origin

```text
User source assigned?
→ Correct component/type?
→ Sampling module source binding?
→ Valid mesh/region?
→ Space transform?
→ Position overwritten later in stack?
```

### Aura trails behind animation

Визначте intent:

- spawn-only surface particles природно detach;
- attached particles потребують stable re-sampling/follow logic;
- надмірну latency може спричинити tick/order/data update.

Точне рішення залежить від DI/module:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 20. Performance considerations

- Events можуть множити work як `source count × event frequency × receiver spawn`.
- Persistent IDs і Event DataSets додають data/processing.
- Events працюють лише на CPU.
- PAR/direct approaches мають власний access/order cost; вимірюйте.
- Skeletal skinning/surface sampling може бути дорогим, особливо per particle у `Update`.
- Sampling regions можуть зменшити irrelevant work/coverage, але потребують asset setup.
- User Parameter DI instances можуть додавати overhead UObject/memory/GC.
- High/Low можуть зменшувати sampling rate, lifetime, surface coverage і follow frequency.
- Уникайте expensive animated sampling для particles, які надто малі або далекі для читання.
- Профілюйте representative characters/effects, а не один mannequin.

## 21. Запитання для самоперевірки

1. Які дві prerequisites має Niagara Event source?
2. Чому Location Event може вибухово збільшити count?
3. Коли Death Event легко замінити timed burst?
4. Чим Event відрізняється від PAR?
5. Що таке Data Interface contract?
6. Чому vertex sampling може бути нерівномірним?
7. Що відбувається при random surface resample every Update?
8. Який перший debug для skeletal sampling?
9. Чому source component validity важлива?
10. Який event ніколи не повинен визначати gameplay damage?

## 22. Відповіді

1. CPU Sim і Persistent IDs.
2. Він може генеруватися кожною living particle щокадру.
3. Коли death time/impact transform already deterministic/known.
4. Event створює discrete payload/handler work; PAR читає attributes іншого emitter без того ж event pattern.
5. Type, owner, підтримка target, read/write, update, вартість, validity, fallback.
6. Dense topology ділянки мають більше vertices незалежно від surface area.
7. Particles teleport/flicker між випадковими points.
8. Вивести sampled position простими sprites без art material.
9. Null/destroyed/wrong source дає no data, origin artifacts або invalid behavior.
10. Cosmetic Niagara collision/death/location event.

## 23. Self-check checklist

- [ ] Event source CPU.
- [ ] Persistent IDs enabled.
- [ ] Event rate bounded і estimated.
- [ ] Event-free alternative побудована.
- [ ] DI contract записаний.
- [ ] Skeletal source передано як User Parameter.
- [ ] Position і normal debug окремі.
- [ ] Sampling bias/region пояснені.
- [ ] Invalid/destroyed source test виконано.
- [ ] Gameplay authority перебуває поза VFX.

## 24. Mastery criteria

Урок зараховано, якщо:

1. working CPU Event source/receiver;
2. student пояснює GPU Events limitation;
3. event volume bounded;
4. deterministic alternative порівняна;
5. skeletal particles sample-ять animated source;
6. немає uncontrolled random resampling;
7. invalid source має safe behavior;
8. DI/Event performance evidence задокументовано;
9. EX08-02-A ≥80/100.

## 25. Підсумок

- Events — CPU-only discrete communication з Persistent IDs.
- Event Handler виправданий unpredictable per-particle transition, не будь-яким secondary burst.
- Data Interface — typed bridge з target/ownership/cost contract.
- Skeletal sampling потребує valid source, sampling mode, space і stable update strategy.
- Gameplay truth не залежить від cosmetic particle events.

## 26. Зв’язок із наступними уроками

У [L08-03](03_user_parameters_renderer_bindings_and_blueprint_data.md) source components, target vectors, direction, color і scale стануть повним reusable Blueprint-to-Niagara contract.

## 27. Офіційні джерела

- [Events and Event Handlers](https://dev.epicgames.com/documentation/en-us/unreal-engine/events-and-event-handlers-in-niagara-effects-for-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [UNiagaraDataInterface API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraDataInterface) — Epic Games, UE 5.8 API, доступ 2026-07-27.
- [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Niagara API — `UNiagaraDataInterfaceSkeletalMesh` у переліку класів](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara) — Epic Games, UE 5.8 API, доступ 2026-07-27.

## 28. Рекомендовані скриншоти або схеми

```text
Схема 1
CPU Source + Persistent IDs → Event DataSet → Receiver Handler.
Поряд: crossed-out GPU Events path.
```

```text
Скриншот 2
Event vs timed variant, locked camera/count.
Підписати source count, event rate, receiver count.
```

```text
Скриншот 3
Animated skeletal mesh: position debug, normal debug, final aura.
Показати invalid-source fallback окремою tile.
```
