# 1. L08-04 — Scratch Pad, reusable Modules і Simulation Stages

| Поле | Значення |
|---|---|
| Блок | 08 — Niagara Advanced |
| Lesson ID | L08-04 |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | Tested Scratch Pad module, reusable Module Script asset і iterative Simulation Stage study |
| Mastery gate | Перетворити custom logic на typed/tested module та пояснити, коли додатковий simulation pass виправданий |

## 2. Результат уроку

Ви навчитеся:

- читати Niagara script graph через Parameter Map Get/Set;
- створювати Scratch Pad Module з explicit stage/usage;
- проєктувати typed inputs, safe defaults, units і spaces;
- будувати `Safe Directional Acceleration` без NaN;
- тестувати module як маленьку функцію;
- переносити local Scratch Pad logic у reusable Module Script asset;
- розуміти Simulation Stage як додатковий ordered/iterative pass;
- створювати relaxation/convergence study з 1/2/4 iterations;
- оцінювати cost як particles × iterations × work.

Доказ: module test matrix, two-System reuse, stage iteration capture і limitation report.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Niagara script mental model | 0.75 | 0 |
| Simulation Stage theory | 0.75 | 0 |
| Guided Scratch Pad/module asset | 1.5 | 1.5 |
| Guided stage study | 1.0 | 1.0 |
| Вправи, tests, performance | 1.0 | 1.0 |
| **Разом** | **5.0** | **3.5 (70%)** |

## 4. Prerequisites

| Навичка | Де | Перевірка |
|---|---|---|
| Parameter Map/stages | G07 | Запис у Spawn проти Update |
| Безпечні direction/target | [L08-03](03_user_parameters_renderer_bindings_and_blueprint_data.md) | Fallback для нульового вектора |
| Вибір CPU/GPU target | L08-01 | Підтримку feature на target зафіксовано |
| Basic math | L03-02 | Normalize, Lerp, DeltaTime |

## 5. Нові терміни

| Термін | Пояснення |
|---|---|
| Scratch Pad | Local custom Niagara script у authoring context System/Emitter |
| Module Script asset | Reusable Niagara module, збережений як content asset |
| Parameter Map Get | Читання attributes/engine/module inputs із current Parameter Map |
| Parameter Map Set | Запис outputs/attributes у Parameter Map |
| Module namespace | Inputs, які належать instance custom module |
| Usage | Де script дозволено виконувати: Particle Spawn/Update/Simulation Stage тощо |
| Simulation Stage | Додатковий pass над particles або Data Interface elements |
| Iteration Source | Data set/DI, елементи якого обробляє stage |
| Num Iterations | Кількість повторів stage |
| In-place update | Наступна iteration читає result попередньої |
| Convergence | Наближення до stable/target value через iterations |

## 6. Навіщо ця тема потрібна VFX artist

Built-in modules покривають багато задач, але production потребує:

- однакового remap/validation у багатьох Systems;
- studio-specific motion;
- компактні art-facing controls;
- encapsulated math із debug output;
- iterative operations над grid/particles.

Copy-paste Scratch Pad graph у десять Systems створює десять implementations. Непротестований reusable module, навпаки, поширює один bug на весь project. Тому шлях:

```text
Local prototype → controlled tests → clear API → reusable asset → dependency validation
```

Simulation Stage — не «покращити quality» switch. Це додаткове виконання logic, інколи багато разів, з прямою performance ціною.

## 7. Теорія простими словами

Module отримує Parameter Map, читає values, рахує й записує:

```text
Input Parameter Map
  → Get Velocity, DeltaTime, Module inputs
  → Math
  → Set Velocity, Debug attribute
  → Output Parameter Map
```

Safe directional acceleration:

```text
Valid = length(Direction) > Epsilon
Dir = Valid ? normalize(Direction) : FallbackDirection
NewVelocity = OldVelocity + Dir × AccelerationCmS2 × DeltaTime
```

Simulation Stage relaxation:

```text
PositionNext = lerp(PositionCurrent, Target, AlphaPerIteration)
```

Після `n` iterations effective approach:

```text
EffectiveAlpha = 1 - (1 - Alpha)^n
```

## 8. Детальні технічні пояснення

### Scratch Pad scope

Scratch Pad зручний для local experiment. Він живе в System/Emitter context і не є автоматично canonical asset для інших Systems. Exact ability to duplicate/promote/create asset:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Module API

Public inputs:

```text
Module.DirectionWS         Vector3
Module.FallbackDirectionWS Vector3
Module.AccelerationCmS2    Float
Module.Strength01          Float
Module.Epsilon             Float
Module.WriteDebug          Static Bool
```

Internal variables не expose-те без use case.

Metadata:

- display name;
- category;
- description;
- units/range;
- default;
- advanced display;
- edit condition/static switch;
- usage restrictions.

Exact metadata UI:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Read/write contract

Reads:

- `Particles.Velocity`;
- `Engine.DeltaTime`;
- Module inputs.

Writes:

- `Particles.Velocity`;
- optional `Particles.DirectionValidity01`.

Не write-те Position і Velocity одночасно без clear integration model.

### Stage usage

Particle Update module executes once per particle per update. Simulation Stage може:

- додатково iterate particles;
- iterate grid/DI elements;
- read/write attributes/data в ordered pass;
- виконувати GPU-oriented workflows.

Target/usage support залежить від script і DI. General beginner workflow у official docs частково описаний через Fluids, тому exact UI/availability:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Iteration stability

Для Lerp relaxation:

- `Alpha=0` — без змін;
- `0<Alpha<1` — convergence;
- `Alpha=1` — досягає target за одну iteration;
- `Alpha>1` — overshoot і можлива divergence;
- negative — рух від target.

Clamp `AlphaPerIteration` у межах 0–1 для цього study.

### Order/data hazards

Якщо stage читає neighbor particles або grid cells, важливі parallel order і data dependencies. У цьому уроці кожна particle лише рухається до власного stored target, тому cross-particle race не передбачено.

## 9. Візуальні й математичні приклади

### Acceleration

```text
Old V = (100,0,0) cm/s
Direction = (0,2,0) → normalized (0,1,0)
Acceleration = 300 cm/s²
Strength = .5
DeltaTime = 1/60

DeltaV = (0,1,0) × 300 × .5 × .01667 ≈ (0,2.5,0)
New V = (100,2.5,0)
```

### Zero direction

```text
Direction=(0,0,0)
Fallback=(1,0,0)
Validity=0
```

Division by zero відсутнє; debug може використовувати magenta color.

### Relaxation

`Alpha=.25`:

```text
n=1 → Effective .25
n=2 → 1-.75² = .4375
n=4 → 1-.75⁴ ≈ .6836
n=8 → ≈ .8999
```

Iterations фундаментально змінюють response, якщо Alpha не скориговано.

## 10. Controlled experiments

### CE08-04-A — Zero/scale/DeltaTime

Перевірте Direction:

- `(1,0,0)`;
- `(10,0,0)` — same normalized direction;
- `(0,0,0)` — fallback;
- very small `(1e-8,0,0)` — fallback.

Перевірте за різних frame rates/profile conditions; множення на DeltaTime має зробити acceleration приблизно time-consistent.

### CE08-04-B — Stack placement

Розмістіть module:

1. before `Solve Forces and Velocity`;
2. after it;
3. замість force accumulation і через direct modification `Velocity`.

Задокументуйте actual behavior і виберіть один contract. Не заявляйте equivalence.

### CE08-04-C — Module reuse

Використайте той самий asset у двох Systems:

- sparks;
- aura drift.

Змінюйте description/default лише після запису dependency impact. Перевірте обидва Systems.

### CE08-04-D — Iteration convergence

Виконайте stage iterations `1`, `2`, `4`, `8` з однаковим Alpha `.25`. Зафіксуйте final distance й обчисліть expected trend.

## 11. Покрокова guided practice

### Частина A — Scratch Pad

#### Крок 1 — Створіть local module

У `Particle Update` CPU diagnostic emitter додайте новий Scratch Pad Module:

`SPM_SafeDirectionalAcceleration`.

Установіть usage, сумісний із `Particle Update`. Точне creation menu:

`Потребує ручної перевірки в Unreal Engine 5.8.`

#### Крок 2 — Inputs

Створіть Module inputs:

```text
DirectionWS = (1,0,0)
FallbackDirectionWS = (1,0,0)
AccelerationCmS2 = 300
Strength01 = 1
Epsilon = .001
WriteDebug = false (Static Bool)
```

У descriptions зазначте world-space direction і `cm/s²`.

#### Крок 3 — Parameter Map Get

Прочитайте:

```text
Particles.Velocity
Engine.DeltaTime
Module.DirectionWS
Module.FallbackDirectionWS
Module.AccelerationCmS2
Module.Strength01
Module.Epsilon
```

#### Крок 4 — Safe direction graph

Концептуальний graph:

```text
DirLength = Length(DirectionWS)
IsValid = DirLength > Epsilon
NormalizedInput = DirectionWS / max(DirLength,Epsilon)

FallbackLength = Length(FallbackDirectionWS)
NormalizedFallback =
  FallbackLength > Epsilon
  ? FallbackDirectionWS / FallbackLength
  : (1,0,0)

SafeDirection = Select(IsValid, NormalizedInput, NormalizedFallback)
Validity01 = IsValid ? 1 : 0
```

Exact `Select`/comparison nodes:

`Потребує ручної перевірки в Unreal Engine 5.8.`

#### Крок 5 — Velocity

```text
ClampedStrength = saturate(Strength01)
DeltaVelocity =
  SafeDirection
  × max(AccelerationCmS2,0)
  × ClampedStrength
  × max(Engine.DeltaTime,0)

NewVelocity = Particles.Velocity + DeltaVelocity
```

Parameter Map Set:

```text
Particles.Velocity = NewVelocity
Particles.DirectionValidity01 = Validity01
```

#### Крок 6 — Debug

Якщо `WriteDebug`:

```text
Particles.Color =
  IsValid ? float4(.1,1,.2,1) : float4(1,0,1,1)
```

Використайте static switch або окремий debug output. Не override-те color постійно у production без opt-in.

#### Крок 7 — Test harness

Spawn-іть Burst із 4 particles через чотири direction inputs або чотири emitter instances. Вимкніть інші forces. Очікувану velocity після відомого часу запишіть або візуалізуйте.

### Частина B — Reusable asset

#### Крок 8 — Promote/recreate module

Створіть Module Script asset `NMS_VFX_SafeDirectionalAcceleration`:

- скопіюйте verified logic;
- Particle Update usage;
- version/owner/description;
- change log;
- unit tests table;
- без hard dependency на один System.

Замініть local module у двох Systems і порівняйте.

### Частина C — Simulation Stage

#### Крок 9 — GPU study emitter

`NS_StageRelaxationStudy`:

```text
Emitter Properties
  Sim Target = GPU Compute Sim

Particle Spawn
  Burst = 64
  Initialize Particle
  Shape Location: Sphere radius 300
  Particles.TargetPosition = system origin or per-particle target
  Particles.RelaxAlpha01 = User.RelaxAlpha01

Particle Update
  Particle State
  no target attraction baseline

Simulation Stage: RelaxToTarget
  Iteration Source = Particles
  Num Iterations = User/constant test 1,2,4,8
  Enabled = true
  Module:
    Position = lerp(Position, TargetPosition, saturate(RelaxAlpha01))

Render
  Sprite Renderer
```

Точні stage add menu, iteration source, запис particle attributes і можливість bind `Num Iterations` до User input:

`Потребує ручної перевірки в Unreal Engine 5.8.`

#### Крок 10 — Порівняйте

Створіть окремі instances/assets для iteration counts, якщо dynamic binding не підтримується. Зафіксуйте:

- initial seed/positions;
- Alpha;
- count;
- camera;
- duration/frame.

Зафіксуйте distance-to-target і profiler.

## 12. Точні graph nodes, inputs і stage settings

### Module graph contract

```text
Input Parameter Map
→ Parameter Map Get
  Particles.Velocity
  Engine.DeltaTime
  Module.*
→ Length / Max / Divide / Compare / Select
→ Multiply chain
→ Add OldVelocity
→ Parameter Map Set
  Particles.Velocity
  Particles.DirectionValidity01
→ Output Parameter Map
```

### Stage module contract

```text
Input Parameter Map
→ Get Particles.Position
→ Get Particles.TargetPosition
→ Get Particles.RelaxAlpha01
→ Saturate Alpha
→ Lerp(Position, Target, Alpha)
→ Set Particles.Position
→ Output Parameter Map
```

### Required metadata

```text
Display Name
Description
Usage/target support
Input unit/space/range/default
Output attributes
Known limitations
Version/date
```

## 13. Стартові значення

| Input | Start |
|---|---:|
| DirectionWS | +X |
| FallbackDirectionWS | +X |
| AccelerationCmS2 | 300 |
| Strength01 | 1 |
| Epsilon | .001 |
| RelaxAlpha01 | .25 |
| Stage iterations | 1/2/4/8 study |
| Particle count | 64 |
| Initial radius | 300 cm |

## 14. Очікуваний результат

| Stage | Evidence |
|---|---|
| Scratch Pad | Direction прискорюється послідовно |
| Zero input | Magenta/fallback, без NaN |
| DeltaTime | Приблизна time consistency |
| Asset | Два Systems використовують той самий module |
| Stage 1/2/4/8 | Ordered convergence відповідає trend формули |
| Cost | Зростання iterations видно у profile/work estimate |
| Documentation | API/usage/limits завершені |

## 15. Самостійна вправа

### EX08-04-A — Author `NMS_VFX_OrbitVelocity`

Специфікація:

- inputs: `CenterWS`, `AxisWS`, `AngularSpeedRadS`, `RadialPullCmS2`, `Strength01`, epsilon;
- safe axis fallback +Z;
- usage `Particle Update`;
- записує `Velocity`, а не `Position`;
- optional debug validity;
- tests у center, з zero axis і negative/large values;
- reusable у двох Systems.

## 16. Додаткова складніша вправа

### EX08-04-B — Iterative relaxation dossier

Побудуйте stage study:

- 1/2/4/8 iterations;
- Alpha .1/.25/.5;
- fixed seed/count;
- порівняйте expected effective alpha з observed distance;
- порівняйте one-stage iteration з equivalent `Particle Update` attempt;
- target support/packaged test;
- cost report;
- рекомендуйте production setting або відхиліть stage.

## 17. Три рівні підказок

### EX08-04-A

1. **Напрям:** tangent direction дорівнює `cross(axis, radial direction)`.
2. **Структура:** radial = Position−Center; safe normalize axis/radial; tangent = normalize(cross(axis,radial)).
3. **Майже відповідь:** `DeltaV = tangent×AngularSpeed×Radius×dt + (-radialDir)×RadialPull×dt`, потім Strength; particle у center обробляйте через fallback/no orbit.

### EX08-04-B

1. **Напрям:** порівнюйте distance ratio, а не лише screenshot.
2. **Структура:** expected remaining fraction `(1-Alpha)^Iterations`.
3. **Майже відповідь:** за Alpha=.25 і n=4 лишається `.75^4≈.3164` distance; effective alpha≈.6836.

Повні розв’язки: [L08-04 answers](../EXERCISE_ANSWERS/L08-04_scratch_simulation_stages_answers.md).

## 18. Типові помилки

| Помилка | Симптом | Виправлення |
|---|---|---|
| Normalize zero | NaN/disappear | Epsilon/fallback |
| Немає DeltaTime | Frame-rate dependent acceleration | Множити на dt |
| Units невідомі | Wild motion | Names/descriptions із cm/s², rad/s |
| Записує Position+Velocity | Double integration | Одна explicit model |
| Scratch скопійовано вручну | Divergent versions | Tested canonical Module Script |
| Asset promoted до tests | Bug усюди | Спочатку local harness |
| Alpha >1 | Overshoot/divergence | Clamp для relaxation |
| Iterations додані заради «quality» | Cost без goal | Convergence/cost evidence |
| Cross-particle assumptions | Race/order issues | Незалежне per-particle study |
| GPU/stage вважаються universal | Compile/platform fail | Target/package validation |

## 19. Troubleshooting

### Module no effect

```text
Usage/stage?
→ Parameter Map connected?
→ Input values?
→ Attribute overwritten later?
→ DeltaTime/Strength?
→ Renderer visualizes motion?
```

### Different after promotion

```text
Defaults/metadata
→ namespace/input bindings
→ script usage
→ stale compile/cache
→ dependency version
```

### Stage no effect

```text
Sim Target/support
→ stage enabled/order
→ iteration source
→ module usage
→ writable attribute
→ Alpha/Target
→ renderer reads updated Position
```

Точний compile/reset/debug UI:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 20. Performance considerations

- Module виконується per particle у кожному applicable stage/update.
- Work `Simulation Stage` приблизно масштабується як `elements × iterations × operations`.
- Extra attributes збільшують particle data.
- Static debug switches/permutations потребують policy.
- DI iteration може додати memory/bandwidth і synchronization.
- Reusable module покращує maintenance, але не автоматично runtime cost.
- Safe normalize додає math, але запобігає catastrophic invalid state.
- Не використовуйте `Update` module, якщо достатньо Spawn snapshot.
- Порівняйте alternate analytic single-pass formula до multi-iteration stage.
- Профілюйте target platform/packaged build.

## 21. Запитання для самоперевірки

1. Чим Scratch Pad відрізняється від Module Script asset?
2. Що передає Parameter Map?
3. Навіщо Module namespace?
4. Чому DeltaTime потрібен acceleration?
5. Які tests потрібні safe direction?
6. Що таке Simulation Stage?
7. Як iterations змінюють Lerp relaxation?
8. Чому reusable module може бути ризиком?
9. Коли stage не потрібен?
10. Який cost model stage?

## 22. Відповіді

1. Scratch Pad — локальний prototype; asset — канонічна повторно використовувана залежність content.
2. Current variables/attributes через execution stack.
3. Щоб inputs належали конкретному module instance й мали API.
4. Перетворює per-second acceleration на per-frame delta velocity.
5. Normal, non-unit, zero, near-zero, fallback, frame-rate.
6. Додатковий ordered/iterative execution pass над particles/DI elements.
7. Effective alpha `1-(1-a)^n`; більше iterations сильніше наближає.
8. Один bug/default change поширюється на багато dependencies.
9. Якщо one-pass analytic/module update дає goal дешевше/простішe.
10. `Elements/particles × iterations × work` плюс data/memory/sync.

## 23. Self-check checklist

- [ ] Scratch Pad test harness завершено.
- [ ] Inputs мають types/names/units/spaces/defaults.
- [ ] Zero/near-zero inputs безпечні.
- [ ] DeltaTime використано правильно.
- [ ] Module записує explicit attributes.
- [ ] Reuse asset у двох Systems перевірено.
- [ ] Stage 1/2/4/8 зафіксовано.
- [ ] Convergence math відповідає trend.
- [ ] Target/package support зазначено.
- [ ] Stage обґрунтовано або відхилено через evidence.

## 24. Mastery criteria

Урок зараховано, якщо:

1. safe custom module працює;
2. Parameter Map reads/writes explained;
3. local prototype перетворено на reusable asset;
4. дві dependencies проходять regression;
5. Simulation Stage виконує controlled per-particle relaxation;
6. iteration effect передбачено чисельно;
7. invalid inputs не створюють NaN;
8. cost/alternative записано;
9. EX08-04-A ≥80/100.

## 25. Підсумок

- Scratch Pad — безпечна local laboratory.
- Reusable module потребує API, tests, metadata й dependency discipline.
- Parameter Map робить data flow explicit.
- Simulation Stage додає passes/iterations, а не безкоштовну quality.
- Mathematical expectation і locked profile визначають, чи stage потрапляє до shipping.

## 26. Зв’язок із наступними уроками

У [L08-05](05_bounds_culling_scalability_and_optional_fluids.md) custom/advanced systems отримають bounds і scalability policy. Simulation Stages будуть пов’язані з optional Niagara Fluids study, але Fluids лишається Beta й не входить у core gate.

## 27. Офіційні джерела

- [Niagara Scratch Pad Modules](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-scratch-pad-modules-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Niagara Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-niagara-effects-for-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Fluid Simulation Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/fluid-simulation-in-unreal-engine---overview) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Niagara Plugin API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara) — Epic Games, UE 5.8 API, доступ 2026-07-27.
- [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara) — Epic Games, UE 5.8, доступ 2026-07-27.

## 28. Рекомендовані скриншоти або схеми

```text
Схема 1
Parameter Map Get → safe direction math → velocity → Parameter Map Set.
Підписати units/spaces.
```

```text
Скриншот 2
Scratch Pad vs canonical Module Script used by two Systems.
Показати version/test table.
```

```text
Скриншот 3
Stage iterations 1/2/4/8 with expected remaining-distance labels and profile.
```
