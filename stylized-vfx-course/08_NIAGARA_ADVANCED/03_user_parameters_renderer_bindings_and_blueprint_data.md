# 1. L08-03 — User Parameters, renderer bindings і Blueprint data

| Поле | Значення |
|---|---|
| Блок | 08 — Niagara Advanced |
| Lesson ID | L08-03 |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | `NS_AbilityDataContract`, `BP_AbilityVFXProbe` і 12-instance reuse wall |
| Mastery gate | Один Niagara System приймає typed direction/color/scale/target inputs, має safe defaults і не потребує asset duplication |

## 2. Результат уроку

Ви навчитеся:

- проєктувати User Parameter API до побудови effect;
- передавати `DirectionWS`, `TargetPositionWS`, `EffectTint` і `EffectScale`;
- нормалізувати vectors та обробляти zero-length input;
- розрізняти world/local/component space;
- вирішувати, які values copy-ити в Particle Spawn, а які читати в Update;
- bind-ити particle attributes до Sprite/Mesh/Ribbon/material controls;
- встановлювати values з Blueprint із correct target/name/type;
- уникати unnecessary Tick updates і stale reused-component state;
- створювати debug modes для кожного hop.

Доказ: 12 instances одного System asset, animated target test і data-contract table.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| API/scope/space theory | 1.0 | 0 |
| Blueprint/data flow theory | 0.5 | 0 |
| Guided System contract | 2.0 | 2.0 |
| Blueprint controller | 1.0 | 1.0 |
| Вправи, edge cases, validation | 1.5 | 1.5 |
| **Разом** | **6.0** | **4.5 (75%)** |

## 4. Prerequisites

| Навичка | Де | Перевірка |
|---|---|---|
| Runtime-scopes Material | [L04-06](../04_STYLIZED_VFX_MATERIALS/06_niagara_material_data_and_runtime_parameters.md) | User проти DMI проти MPC |
| Bindings renderer Niagara | G07 | Binding color/size/orientation |
| Контракти CPU/GPU і DI | L08-01–02 | Підтримку target задокументовано |
| Основи Blueprint Actor/component | L01-02 | Зберігання reference component |
| Векторна математика / spaces | L03-02, L07-03 | Normalize, subtraction, transforms |

## 5. Нові терміни

| Термін | Пояснення |
|---|---|
| Public VFX API | Exposed inputs, їх meanings, types, ranges, spaces і defaults |
| Контракт даних | Source → variable → stage → attribute → binding → receiver |
| Direction vector | Орієнтований normalized vector, не world position |
| Target position | Point у documented coordinate space |
| Zero-length vector | Vector із довжиною близькою до 0, який не можна безпечно normalize |
| Snapshot input | Value copied at spawn і збережене particle |
| Live input | Value повторно читається під час Update |
| Stale state | Old User values залишилися на reused component |
| Type-safe setter | Blueprint/API setter, type якого збігається з Niagara parameter |
| Fallback | Safe value при missing/invalid writer |

## 6. Навіщо ця тема потрібна VFX artist

Reusable effect повинен працювати для:

- різних teams/elements;
- різних caster/target positions;
- різної ability strength;
- actor rotation;
- placed preview без Blueprint;
- repeated activation/pooling;
- High/Low variants.

Якщо API не формалізований, з’являються magic names і contradictions:

```text
"Direction" іноді local, іноді world
"Scale" одночасно system scale і sprite size
"Target" іноді Actor, іноді position
Tint alpha випадково вимикає effect
```

Public API має бути малим, typed і стабільним. Internal attributes можуть змінюватися без зміни callers.

## 7. Теорія простими словами

Вихідний contract:

```text
User.DirectionWS       Vector3, normalized/fallback +X
User.TargetPositionWS  Position/Vector3 in world space
User.EffectTint        Linear Color, default white
User.EffectScale       Float, default 1, clamped >0
User.Charge01          Float 0–1
User.DebugMode         Int/Float enum-like, default 0
```

Derived values:

```text
ToTarget = TargetPositionWS - SystemPositionWS
DistanceToTarget = length(ToTarget)
SafeTargetDirection =
  Distance > Epsilon ? ToTarget / Distance : SafeDirection
```

Blueprint задає input. Niagara відповідає за validation/remap. Material отримує лише renderer-ready values.

## 8. Детальні технічні пояснення

### Names і types

Ім’я включає namespace:

```text
User.DirectionWS ≠ DirectionWS ≠ Particles.DirectionWS
```

Setter type має збігатися:

- Float → Float;
- Linear Color → Linear Color;
- Vector3/Position → відповідний supported type;
- object/DI → відповідний object/DI parameter.

У Niagara Position має Large World Coordinates semantics, тоді як Vector3 описує direction/offset. Exact Blueprint setter та conversion behavior для Position:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Space contract

Suffix:

- `WS` — world space;
- `LS` — system/emitter local space;
- `CS` — component space, якщо team convention.

Якщо emitter `Local Space=true`, world direction/target треба transform-увати. Не множте world position actor transform вдруге.

### Safe normalize

```text
Len = length(InputDirection)
Valid = Len > 0.001
SafeDirection = Valid ? InputDirection / Len : float3(1,0,0)
```

Доступність і назва Niagara function `Normalize`/`Safe Normalize`:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Snapshot vs live

Snapshot:

```text
Particle Spawn:
  Particles.Direction = User.DirectionWS
```

Existing particles не повертаються, коли input зміниться. Добре для fired projectile sparks.

Live:

```text
Particle Update:
  Particles.Target = User.TargetPositionWS
```

Existing particles можуть homing/follow. Дорожче й змінює motion semantics.

### Renderer bindings

Internal attributes:

```text
Particles.Color
Particles.SpriteSize
Particles.Scale
Particles.Orientation
Particles.RibbonWidth
Particles.Charge01
```

Renderer map-ить attributes у geometry/material. Material parameter binding map-ить `Particles.Charge01` у `M_Charge01`.

### Blueprint timing

Установлюйте values так:

1. отримайте/створіть intended Niagara Component;
2. встановіть усі required User Parameters;
3. activate/spawn або ensure initial evaluation order;
4. оновлюйте лише за meaningful changes.

Для `Spawn System` nodes деякі exposed parameters можуть вимагати returned component і встановлення до/після activation; точна lifecycle behavior:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Для надійної практики використовуйте placed/deactivated `NiagaraComponent`: установіть parameters, потім виконайте `Activate`.

### Reuse/stale values

Під час кожної activation ініціалізуйте повний contract:

```text
Tint = provided or white
Direction = provided or +X
Target = provided or source + direction×100
Scale = provided or 1
Charge = provided or 0
Debug = 0
```

Ніколи не покладайтеся на value з попередньої activation.

## 9. Візуальні й математичні приклади

### Target

```text
Source = (100, 200, 50)
Target = (400, 600, 50)
Delta = (300,400,0)
Distance = 500
Direction = (.6,.8,0)
```

### Scale layers

Уникайте:

```text
ComponentScale 2 × User.EffectScale 2 × SpriteSize 2 = accidental 8×
```

Policy:

```text
Component transform scale = 1 for VFX API test
User.EffectScale drives authored sizes/velocities intentionally
```

Вирішіть, чи scale впливає на speed; не множте всі values автоматично.

### Charge remaps

```text
Charge01 = saturate(User.Charge01)
SpawnCount = round(lerp(8,32,Charge01))
Size = BaseSize × lerp(.8,1.3,Charge01)
Material M_Charge01 = Charge01
```

## 10. Controlled experiments

### CE08-03-A — Неправильні name/type

1. Правильно встановіть `User.Charge01=.8`.
2. Спробуйте `User.Charge=.8`.
3. Спробуйте неправильний setter type.
4. Зафіксуйте, який варіант використовує fallback.
5. Відновіть exact contract.

### CE08-03-B — Zero direction

Передайте `(0,0,0)`. Effect має використати fallback +X або вимкнути directional layer, а не створити NaN чи зникнути.

### CE08-03-C — Snapshot/live

Один emitter копіює direction у `Spawn`, другий читає target/direction в `Update`. Обертайте target протягом 2 s, зафіксуйте різну behavior і поясніть її.

### CE08-03-D — Reuse reset

Активуйте red/large/left, деактивуйте, потім активуйте без explicit new values. Це навмисний failure. Виправте його повною initialization до white/1/+X/default target перед activation.

## 11. Покрокова guided practice

### Крок 1 — Запишіть public API

Створіть User Parameters у `NS_AbilityDataContract`:

```text
User.DirectionWS       Vector3 = (1,0,0)
User.TargetPositionWS  Position = (100,0,0) relative test or explicit world point
User.EffectTint        Linear Color = (1,1,1,1)
User.EffectScale       Float = 1
User.Charge01          Float = 0
User.DebugMode         Integer/Float = 0
```

Точний UI authoring для default `Position`:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 2 — System-level derived values

У `System Spawn/Update` або shared module:

```text
ValidatedScale = clamp(User.EffectScale, .01, 10)
Charge01 = saturate(User.Charge01)
SafeDirection = safe normalize(User.DirectionWS, fallback +X)
SourcePositionWS = System/Owner Position
ToTargetWS = User.TargetPositionWS - SourcePositionWS
TargetDistanceCm = length(ToTargetWS)
TargetDirectionWS = safe normalize(ToTargetWS, SafeDirection)
```

Зберігайте в `System.*` або emitter parameters відповідно до module context:

```text
System.VFXScale
System.Charge01
System.SafeDirectionWS
System.TargetDistanceCm
System.TargetDirectionWS
```

Exact writable namespaces/context:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 3 — Directional Sprite emitter

```text
Emitter Update
  Spawn Burst Instantaneous = round(lerp(8,24,System.Charge01))

Particle Spawn
  Initialize Particle
    Lifetime = .6–1.0
    Sprite Size = BaseSize × System.VFXScale
    Color = User.EffectTint
  Shape Location: Cone/Sphere near origin
  Velocity = System.SafeDirectionWS × random(300,600) × System.VFXScale
  Particles.Charge01 = System.Charge01

Particle Update
  Particle State
  Drag
  Solve Forces and Velocity
  Scale Color

Render
  Sprite Renderer
    Color ← Particles.Color
    Size ← Particles.SpriteSize
    M_Charge01 ← Particles.Charge01
```

### Крок 4 — Target marker emitter

Лише для debug:

- spawn-іть одну mesh/sprite у `User.TargetPositionWS`;
- green color, якщо target distance > epsilon;
- magenta/fallback для invalid/zero distance;
- без expensive continuous particles.

### Крок 5 — Target-directed mesh

Spawn-іть mesh arrow/cone:

```text
Particles.Position = SourcePositionWS
Particles.Orientation aligns authored forward axis to System.TargetDirectionWS
Particles.Scale.X or authored axis scale maps TargetDistanceCm if beam-like
```

Binding axis/orientation залежить від mesh import:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 6 — Ribbon/beam preview

Використайте простий two-point/particle setup із G07:

- source point;
- target point;
- Ribbon ID shared;
- link/order deterministic;
- width × `System.VFXScale`;
- color із `User.EffectTint`.

Точні ribbon link order/bindings використовуйте з implementation L07-07.

### Крок 7 — Material binding

У кожному relevant renderer:

```text
Material Parameter "M_Charge01" ← Particles.Charge01
Color Binding ← Particles.Color
```

Перевірте constant `.8` до Blueprint integration.

### Крок 8 — Blueprint Actor

`BP_AbilityVFXProbe`:

- Scene Root;
- NiagaraComponent, Auto Activate false;
- Source marker;
- Target marker component;
- exposed `EffectTint`, `EffectScale`, `Charge01`;
- function `InitializeAndActivateVFX`.

Pseudo graph:

```text
DirectionWS = GetActorForwardVector
TargetPositionWS = TargetMarker.GetWorldLocation

NiagaraComponent.SetVariableVec3("User.DirectionWS", DirectionWS)
NiagaraComponent.SetVariablePosition("User.TargetPositionWS", TargetPositionWS)
NiagaraComponent.SetVariableLinearColor("User.EffectTint", EffectTint)
NiagaraComponent.SetVariableFloat("User.EffectScale", EffectScale)
NiagaraComponent.SetVariableFloat("User.Charge01", clamp(Charge01,0,1))
NiagaraComponent.SetVariableInt("User.DebugMode", 0)
NiagaraComponent.Activate(true/reset as intended)
```

Exact Blueprint node names/pins:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 9 — Event-driven live target

Для moving target:

- update only when target moves beyond position threshold або at justified rate;
- не використовуйте `Event Tick` без обґрунтування;
- record update frequency;
- existing particles реагують лише якщо `Update` path читає target.

### Крок 10 — 12-instance wall

Rows: 3 colors. Columns:

```text
Direction/target: +X, +Y, diagonal, fallback zero
Scale: .75, 1, 1.5, 1
Charge: .2, .5, .8, 1
```

Усі instances використовують один System asset.

## 12. Точні parameters, modules і bindings

### Public contract table

| Name | Type | Space/range | Default | Update |
|---|---|---|---|---|
| User.DirectionWS | Vector3 | normalized world direction | +X | activation/change |
| User.TargetPositionWS | Position | world | source+100X | target change |
| User.EffectTint | Linear Color | linear RGBA | white | activation/change |
| User.EffectScale | Float | .01–10 authored | 1 | activation/change |
| User.Charge01 | Float | 0–1 | 0 | ability change |
| User.DebugMode | Int | enum-like | 0 | debug only |

### Data flow

```text
Blueprint
→ User.*
→ System validated/derived values
→ Particle Spawn/Update attributes
→ Renderer geometry bindings
→ Material parameter bindings
→ Material outputs
```

### Binding table

| Niagara attribute | Renderer target |
|---|---|
| Particles.Position | Position |
| Particles.Color | Color |
| Particles.SpriteSize | Sprite Size |
| Particles.Scale | Mesh Scale |
| Particles.Orientation | Mesh Orientation |
| Particles.RibbonWidth | Ribbon Width |
| Particles.Charge01 | Material `M_Charge01` |

Exact names:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 13. Стартові значення

| Input | Start |
|---|---:|
| DirectionWS | (1,0,0) |
| Target | source + (500,0,0) |
| Tint | white |
| Scale | 1 |
| Charge | .5 |
| Burst | 8–24 from charge |
| Speed | 300–600 cm/s |
| Lifetime | .6–1 s |
| Position epsilon | .1 cm study |

## 14. Очікуваний результат

| Stage | Evidence |
|---|---|
| Hard-coded Niagara | Inputs керують direction/target/tint/scale |
| Constant binding | `M_Charge01=.8` видимий |
| Blueprint | Values надходять із точними names/types |
| Zero vector | Safe fallback, без NaN |
| Snapshot/live | Різниця є навмисною |
| 12 wall | Унікальні instances, один asset |
| Reuse | Full reset запобігає stale state |
| Debug | Кожен hop ізольовано |

## 15. Самостійна вправа

### EX08-03-A — 12-direction ability wall

Створіть 12 instances:

- 4 directions/targets × 3 element colors;
- variations scale і charge;
- один zero-direction fallback;
- один moving target;
- без duplicate System/material;
- label із actual API values;
- data contract і performance note.

## 16. Додаткова складніша вправа

### EX08-03-B — Target-driven reusable cast

Один System підтримує:

- без target: запускається вздовж safe direction;
- static target: beam/mesh досягає target;
- moving target: optional live follow;
- near-zero distance: compact burst без invalid orientation;
- tint/charge/scale;
- repeated deactivate/reactivate із reset;
- High/Low renderer set з однаковим gameplay cue.

## 17. Три рівні підказок

### EX08-03-A

1. **Напрям:** виконайте validation у Niagara до Blueprint.
2. **Структура:** User → System derived → Particle → Renderer/Material.
3. **Майже відповідь:** якщо всі instances однакові, помилкові setter target/name/type або component override; hard-code один instance value для isolation.

### EX08-03-B

1. **Напрям:** target delta length decides branch/fallback.
2. **Структура:** `ToTarget=Target-Source`; if length>epsilon normalize, else use Direction.
3. **Майже відповідь:** reset усі User values до activation; live follow читає target у `Update`, static snapshot — один раз.

Повні розв’язки: [L08-03 answers](../EXERCISE_ANSWERS/L08-03_user_parameters_blueprint_answers.md).

## 18. Типові помилки

| Помилка | Симптом | Виправлення |
|---|---|---|
| Відсутній `User.` | Setter ігнорується | Точне name |
| Неправильний setter type | Default/fail | Зіставити type |
| World target у local emitter | Offset/rotation error | Transform один раз |
| Normalize zero | NaN/disappear | Epsilon fallback |
| Component scale + API scale | Double scaling | Одна scale policy |
| Spawn snapshot очікується як live | Старі particles ігнорують target | `Update` path, якщо потрібен |
| Tick усіх setters | CPU overhead | Event/threshold update |
| Stale values після reuse | Попередні color/target | Full init перед activate |
| Відсутній material binding | Charge впливає лише на sim | Renderer binding |
| Alpha Particle Color дорівнює нулю | Invisible | White/alpha-one fallback |

## 19. Troubleshooting

Діагностуйте receiver у зворотному напрямку:

```text
Material `M_Charge01` hard-coded
→ renderer binding constant
→ Particles.Charge01 preview
→ System.Charge01
→ User override in component
→ Blueprint execution/target/name/type
```

Для direction:

```text
Render debug arrow from System.SafeDirectionWS
→ length/input
→ space
→ Blueprint actor forward
```

Для target:

```text
Target marker world position
→ delta/distance debug
→ local/world conversion
→ orientation axis
```

## 20. Performance considerations

- User setters — це CPU work; оновлюйте їх лише коли value суттєво змінюється.
- Live copies у `Particle Update` коштують більше за Spawn snapshots.
- Per-particle custom attributes додають data bandwidth.
- Renderer material bindings додають data/material complexity.
- Великий scale збільшує coverage/overdraw, а не лише aesthetic size.
- Live target follow може додавати math/DI/update frequency.
- Reuse зменшує spawn/object churn лише за правильного state reset/lifecycle.
- High/Low мають зберігати cue; спочатку зменшуйте cosmetic renderer/layers.
- Профілюйте representative concurrency з 12+ instances.
- Numeric update thresholds/budgets потребують target validation.

## 21. Запитання для самоперевірки

1. Що входить у public VFX API?
2. Чому suffix `WS` важливий?
3. Як safe-normalize zero direction?
4. Коли value є snapshot?
5. Коли потрібен live input?
6. Чим User Parameter відрізняється від renderer binding?
7. Чому scale не слід множити всюди?
8. Як діагностувати material charge?
9. Чому setter перед activation може бути важливим?
10. Що таке stale state?

## 22. Відповіді

1. Names, types, spaces/ranges, defaults і ownership/update/fallback.
2. Він фіксує coordinate contract.
3. Перевірити length>epsilon, інакше +X/defined fallback.
4. Коли copied/read once at Spawn/activation.
5. Коли living particles мають реагувати на moving target/input.
6. User є external System input; binding maps internal variable to renderer/material.
7. Component, particle size, velocity і material UV можуть дати accidental compounded scale.
8. Hard-code Material → константа binding → particle → system → user → BP.
9. System може evaluate/spawn із defaults до writer.
10. Values попередньої activation лишилися на reused component.

## 23. Self-check checklist

- [ ] API table завершена.
- [ ] Names/types точні.
- [ ] Space suffixes задокументовані.
- [ ] Zero direction/near target безпечні.
- [ ] Snapshot/live є навмисними.
- [ ] Renderer/material bindings перевірені ізольовано.
- [ ] Немає unnecessary Tick.
- [ ] Full activation reset виконано.
- [ ] 12 instances повторно використовують один asset.
- [ ] High/Low cue parity збережено.

## 24. Mastery criteria

Урок зараховано, якщо:

1. direction/color/scale/target/charge працюють незалежно;
2. zero/near-zero input безпечний;
3. world/local space правильний;
4. один System обслуговує 12 instances;
5. Blueprint contract typed і documented;
6. material binding verified;
7. snapshot/live behavior продемонстровано;
8. reuse reset запобігає stale state;
9. EX08-03-A ≥80/100.

## 25. Підсумок

- Reusable Niagara починається з small typed public API.
- User Parameters є external inputs; internal attributes і renderer bindings завершують path.
- Direction, position і scale мають explicit semantics/spaces.
- Safe defaults і epsilon handling запобігають invisible/NaN effects.
- Event-driven updates і full reset роблять integration стабільною.

## 26. Зв’язок із наступними уроками

У [L08-04](04_scratch_pad_reusable_modules_and_simulation_stages.md) validation/remap logic API буде винесено в custom Scratch Pad module, перетворено на reusable Module Script і порівняно з Simulation Stage.

## 27. Офіційні джерела

- [System Settings Reference for Niagara Effects — User Parameters](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Render Module Reference for Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Set Niagara Variable Vector3](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SetNiagaraVariable_Vector3) — Epic Games, UE 5.8 Blueprint API, доступ 2026-07-27.
- [UNiagaraComponent API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraComponent) — Epic Games, UE 5.8 API, доступ 2026-07-27.

## 28. Рекомендовані скриншоти або схеми

```text
Схема 1
Blueprint → User → System derived → Particles → Renderer → Material.
Кожен arrow має type/space.
```

```text
Скриншот 2
12-instance wall з labels actual direction/target/tint/scale/charge.
Content Browser показує один System.
```

```text
Скриншот 3
Zero direction, near-zero target, moving target і reuse reset tests.
```
