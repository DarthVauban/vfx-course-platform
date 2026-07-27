# 1. L04-06 — Дані між Niagara, Material і Blueprint

| Поле | Значення |
|---|---|
| Блок | 04 — Stylized VFX Materials |
| Lesson ID | L04-06 |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | `NS_VFX_DataBridge`, renderer bindings demo, DMI demo, `MPC_VFX_Global` і data-path decision table |
| Mastery gate | Для кожного runtime control вибрати правильний scope: particle, system instance, component material instance або global collection |

## 2. Результат уроку

Ви навчитеся:

- проводити `Particles.Color` у Material через `Particle Color`;
- передавати particle/system values у scalar/vector Material Parameters через renderer bindings;
- створювати Niagara `User Parameters` для per-instance art direction;
- розуміти legacy-style `Dynamic Parameter` data path і не плутати його з DMI;
- керувати звичайним component material через Dynamic Material Instance;
- використовувати Material Parameter Collection лише для справді global values;
- документувати source, scope, update rate, default і fallback кожного parameter;
- діагностувати «значення змінюється в Blueprint, але look не змінюється».

Доказ: один effect instance grid, чотири data pathways, runtime controls і screenshot/debug log кожного hop.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Data-scope mental model | 1.0 | 0 |
| Controlled experiments | 0.5 | 0.5 |
| Guided Niagara/material bridge | 3.0 | 3.0 |
| DMI/MPC comparison | 1.0 | 1.0 |
| Самостійні вправи й validation | 2.5 | 2.0 |
| **Разом** | **8.0** | **6.5 (81.25%)** |

## 4. Prerequisites

| Навичка | Де | Перевірка |
|---|---|---|
| Material parameters/instances | [L03-08](../03_MATERIAL_FOUNDATIONS/08_instances_functions_switches_and_debugging.md) | Назвіть scalar/vector/texture parameter |
| Renderer parent templates | [L04-05](05_sprite_mesh_ribbon_and_decal_materials.md) | Particle Color підключено |
| Blueprint basics | [L01-02](../01_UE_FOUNDATIONS/02_editor_navigation_and_asset_workflow.md) | Створіть Actor із component |
| Niagara overview | Достатньо пройти guided stack; повний фундамент у блоці 07 | Знайдіть System, Emitter, Renderer |

## 5. Нові терміни

| Термін | Пояснення | Scope |
|---|---|---|
| Particle attribute | Значення на кожній particle | Per-particle |
| User Parameter | Exposed Niagara input на instance/system | Per Niagara system instance |
| Renderer binding | Mapping Niagara variable → renderer/material property | Per renderer/particle stream |
| Dynamic Parameter | Material expression/particle data vector для runtime channels | Зазвичай per-particle через renderer path |
| DMI | Dynamic Material Instance, runtime-editable instance для component/material slot | Per material instance/component |
| MPC | Material Parameter Collection, shared global values | Project/world-global для всіх readers |
| Parameter scope | Хто бачить одне й те саме value | Particle, instance, component, global |
| Fallback default | Value, яке зберігає readable effect, якщо runtime writer не спрацював | На receiving side |

## 6. Навіщо ця тема потрібна VFX artist

Production effect рідко має одну фіксовану версію. Gameplay передає:

- team color;
- charge percentage;
- hit strength;
- target position;
- remaining duration;
- quality/scalability tier;
- global weather/time event.

Помилковий scope створює bugs:

- MPC для одного projectile фарбує всі projectiles;
- DMI на shared material asset не дає per-particle variation;
- `User.Charge` існує, але material не має binding;
- `Particles.Color` змінюється, але `Particle Color` не підключено;
- Blueprint пише ім’я `Charge`, а Niagara очікує `User.Charge01`.

Дані мають пройти весь ланцюг:

```text
Writer → Named variable → Niagara usage/binding → Material parameter/expression → Material output
```

## 7. Теорія простими словами

Вибирайте найменший scope, який охоплює потрібних receivers:

```text
Одна particle відрізняється від сусідньої?
  → Particle attribute / renderer binding

Один Niagara component відрізняється від іншого?
  → User Parameter

Один звичайний mesh/decal component material має змінитися?
  → DMI

Усі materials у світі реагують на одну подію?
  → MPC
```

Параметр не «протікає» автоматично. Однакова назва у Blueprint і Material не створює connection без Niagara node/binding або DMI/MPC API.

## 8. Детальні технічні пояснення

### Path A — Particle Color

```text
Niagara Particles.Color
  → Renderer Color Binding
  → Material ParticleColor expression
  → Emissive RGB / Opacity A
```

Це стандартний шлях для tint і fade. Material має predictable fallback: якщо renderer передає default white, look лишається видимим.

### Path B — Renderer Material Parameter Binding

Material має named parameter, наприклад `M_Charge01`. Renderer mapping пов’язує його з Niagara variable, наприклад `Particles.Charge01` або system/emitter value.

```text
Particles.Charge01
  → Renderer Material Parameter Binding
  → Material ScalarParameter "M_Charge01"
  → Erosion/Intensity/Ramp coordinate
```

Це краще за packing у color channels, коли meaning має окрему назву. Exact UI для `Material Parameter Bindings`, supported types і binding namespace:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Path C — Dynamic Parameter expression

Material expression `DynamicParameter` надає vector channels, які particle renderer може заповнювати. Це legacy-compatible pattern, корисний для деяких existing materials:

```text
R = Erode
G = Distortion
B = CoreIntensity
A = VariantBlend
```

У Niagara потрібно створити/записати відповідний particle attribute і bind-нути renderer dynamic material parameter channel. Не вважайте назви channel metadata runtime variables самі по собі.

Для нового toolkit named renderer material parameter bindings часто читабельніші. Але ви маєте вміти діагностувати обидва paths.

### Path D — Niagara User Parameter

`User.*` — input одного Niagara component/system instance. Типовий шлях:

```text
Blueprint Set Niagara Variable / component override
  → User.EffectTint
  → Niagara Set Variables або module input
  → Particles.Color / Particles.CustomValue
  → Renderer binding
  → Material
```

Якщо User value читається в Particle Spawn, пізніша зміна вплине тільки на нові particles. Якщо воно читається/копіюється в Particle Update, existing particles можуть оновлюватися щокадру. Це art і performance decision.

### Path E — DMI

DMI створюється для material slot конкретного component:

```text
Create Dynamic Material Instance
  → Store reference
  → Set Scalar/Vector Parameter Value
```

Добре для Static Mesh Component, Skeletal Mesh Component, Decal Component та інших component materials. Для Niagara particle materials per-particle/per-system control зазвичай робіть через User Parameters і renderer bindings. Не створюйте DMI на кожну particle.

Exact Niagara renderer material override/DMI accessibility у Blueprint:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Path F — MPC

Material Parameter Collection читається через `CollectionParameter`. Blueprint/world code встановлює collection scalar/vector. Усі materials, що читають collection, бачать спільне value.

Добрі use cases:

- global storm intensity;
- world event color grade for VFX;
- shared day/night magic response.

Погані:

- health одного enemy;
- charge одного projectile;
- random tint однієї particle.

### Naming contract

```text
User.EffectTint          Niagara exposed instance input
User.Charge01            Niagara exposed scalar
Particles.Charge01       Per-particle attribute
M_Charge01               Material scalar parameter
MPC_GlobalStorm01        Collection scalar
```

Suffix `01` нагадує normalized 0–1 range. Не використовуйте його, якщо value не normalized.

## 9. Візуальні й математичні приклади

### Charge remap

```text
Charge01 = 0.75
Intensity = lerp(1.0, 8.0, Charge01) = 6.25
ErodeThreshold = 1 - Charge01 = 0.25
CoreColor = Ramp(Charge01)
```

Один source може керувати кількома derived properties, але кожен mapping має власну artistic range.

### Spawn проти Update

```text
t=0.0: User.Tint = blue, 20 particles spawned
t=0.5: User.Tint = red

Read in Spawn only:
  old particles remain blue; new particles red

Read in Update:
  all living particles become red
```

### Scope failure

```text
Projectile A Charge=.2
Projectile B Charge=.9

MPC "Charge":
  last writer wins; both materials see same value

User.Charge per Niagara component:
  A=.2, B=.9
```

## 10. Controlled experiments

### CE04-06-A — White fallback

1. Підключіть `Particle Color` до tint/opacity.
2. У renderer лишіть default Color binding.
3. Видаліть/вимкніть explicit color writer.
4. Перевірте, чи material лишається visible.

Очікування: fallback white/one, а не accidental black.

### CE04-06-B — Spawn vs Update

1. `User.EffectTint` копіюйте в `Particles.Color` лише в Particle Spawn.
2. Під час continuous emission змініть User color.
3. Повторіть із copy в Particle Update.
4. Запишіть visual difference і cost/intent.

### CE04-06-C — Scope grid

Розмістіть чотири instances одного Niagara System. Встановіть Charge `.1`, `.35`, `.7`, `1`. Якщо всі однакові, User Parameter instance overrides або binding path несправні.

### CE04-06-D — DMI проти MPC

Два Static Mesh Components:

1. створіть окремі DMI й встановіть різні colors;
2. додайте shared MPC intensity;
3. змініть MPC;
4. доведіть: local colors різні, global intensity спільна.

## 11. Покрокова guided practice

### Крок 1 — Підготуйте material

Створіть `M_VFX_DataBridge`.

Properties:

```text
Material Domain = Surface
Blend Mode = AlphaComposite
Shading Model = Unlit
```

Parameters:

```text
M_Charge01 = 0
M_Erode01 = 0
M_LocalIntensity = 1
ColorLow
ColorHigh
T_Shape
```

Expressions:

- `ParticleColor`;
- `DynamicParameter` з channel labels `Erode`, `Distortion`, `Core`, `Variant`;
- `CollectionParameter` із `MPC_VFX_Global.GlobalIntensity`;
- scalar/vector parameters вище.

Build:

```text
Shape = T_Shape.R
ChargeColor = lerp(ColorLow, ColorHigh, saturate(M_Charge01))
Eroded = step(M_Erode01, Shape)
Local = ChargeColor × ParticleColor.RGB × M_LocalIntensity
Global = Local × MPC_GlobalIntensity
Emissive = Global × lerp(1, 8, M_Charge01) × Eroded
Opacity = Eroded × ParticleColor.A
```

Для baseline `DynamicParameter` preview-те окремо; не змішуйте його в final до перевірки binding.

### Крок 2 — Створіть `NS_VFX_DataBridge`

Один CPU emitter для прозорого debug:

```text
System Spawn
  System State

Emitter Spawn
  Emitter State

Emitter Update
  Spawn Rate = 8

Particle Spawn
  Initialize Particle
    Lifetime = 1.5–2.0
    Sprite Size = (48,48)
    Color = white
  Shape Location: Sphere, radius 12
  Set Variables
    Particles.Charge01 = User.Charge01
    Particles.Color = User.EffectTint

Particle Update
  Particle State
  Scale Color / Color update as needed for alpha fade

Render
  Sprite Renderer
    Material = M_VFX_DataBridge
```

Exact default template stack/order і module labels:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 3 — Створіть User Parameters

```text
User.EffectTint : Linear Color = white
User.Charge01 : Float = 0
User.Erode01 : Float = 0
User.LocalIntensity : Float = 1
```

Використовуйте consistent 0–1 ranges.

### Крок 4 — Bind Particle Color

У Sprite Renderer:

```text
Color Binding ← Particles.Color
```

У material:

```text
ParticleColor.RGB → tint multiply
ParticleColor.A → opacity multiply
```

Спершу змініть `Initialize Particle.Color` на magenta. Якщо material не magenta, renderer/material hop несправний.

### Крок 5 — Bind named material parameters

У renderer material parameter bindings:

```text
Material "M_Charge01" ← Particles.Charge01
Material "M_Erode01" ← User.Erode01 або Particles.Erode01
Material "M_LocalIntensity" ← User.LocalIntensity
```

Supported source namespace/type може вимагати копіювання User values у particle attributes. Якщо direct User binding недоступний, використайте:

```text
Particles.Erode01 = User.Erode01
Particles.LocalIntensity = User.LocalIntensity
```

Exact setup:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 6 — Додайте Dynamic Parameter diagnostic

Створіть four-channel particle attribute/binding path, який ваш UE 5.8 Niagara Sprite Renderer exposes для Dynamic Material Parameters.

Set:

```text
R/Erode = User.Erode01
G/Distortion = 0.25
B/Core = User.Charge01
A/Variant = 0
```

У material тимчасово:

```text
Emissive = float3(DynamicParameter.R, DynamicParameter.G, DynamicParameter.B)
```

Capture `.2/.5/.8` test. Після цього поверніть final material.

### Крок 7 — Blueprint instance controller

Створіть `BP_VFX_DataBridgeController`:

- `NiagaraComponent` з `NS_VFX_DataBridge`;
- exposed variables `EffectTint`, `Charge01`, `Erode01`, `LocalIntensity`;
- у Construction Script або BeginPlay встановіть Niagara variables;
- optional Timeline 0→1 керує Charge.

Blueprint logic:

```text
BeginPlay
  → Set Niagara Variable (Linear Color), "User.EffectTint", EffectTint
  → Set Niagara Variable (Float), "User.Charge01", Charge01
  → Set Niagara Variable (Float), "User.Erode01", Erode01
  → Set Niagara Variable (Float), "User.LocalIntensity", LocalIntensity
```

Exact Blueprint node display names у UE 5.8.x:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Не оновлюйте values у Tick, якщо вони не змінюються.

### Крок 8 — DMI demo

Додайте окремий `StaticMeshComponent` із `M_VFX_DataBridge`-compatible opaque/translucent material slot:

```text
BeginPlay
  → Create Dynamic Material Instance (Element Index 0)
  → Store as MID_Local
  → MID_Local.SetVectorParameterValue("ColorLow", LocalColor)
  → MID_Local.SetScalarParameterValue("M_LocalIntensity", LocalIntensity)
```

Змініть лише один actor instance й доведіть local scope.

### Крок 9 — MPC demo

Створіть `MPC_VFX_Global`:

```text
Scalar GlobalIntensity = 1
Vector GlobalEventTint = white
```

Material читає `GlobalIntensity`. Blueprint test key/timeline:

```text
Set Scalar Parameter Value
Collection = MPC_VFX_Global
Parameter Name = GlobalIntensity
Value = 0.25 або 2.0
```

Усі readers змінюються разом.

### Крок 10 — Data-path log

Для кожного control заповніть:

| Control | Source | Scope | Update stage/rate | Niagara variable | Binding | Material receiver | Default |
|---|---|---|---|---|---|---|---|
| Tint | BP | System instance | On spawn/change | User.EffectTint → Particles.Color | Color | ParticleColor | white |
| Charge | BP | System instance→particle | Spawn або Update | User.Charge01 → Particles.Charge01 | M_Charge01 | ScalarParameter | 0 |
| Local mesh color | BP | Component | On spawn | — | DMI API | VectorParameter | authored |
| Storm intensity | BP/world | Global | Event | — | MPC | CollectionParameter | 1 |

## 12. Точні назви nodes, modules, settings і connections

### Material connections

```text
T_Shape.R → Step_Erode.X
M_Erode01 → Step_Erode.Y
M_Charge01 → Saturate_Charge.Input
ColorLow → Lerp_ChargeColor.A
ColorHigh → Lerp_ChargeColor.B
Saturate_Charge.Result → Lerp_ChargeColor.Alpha
Lerp_ChargeColor.Result → Multiply_ParticleTint.A
ParticleColor.RGB → Multiply_ParticleTint.B
Multiply_ParticleTint.Result → Multiply_LocalIntensity.A
M_LocalIntensity → Multiply_LocalIntensity.B
Multiply_LocalIntensity.Result → Multiply_GlobalIntensity.A
MPC.GlobalIntensity → Multiply_GlobalIntensity.B
Constant 1 → Lerp_HDR.A
Constant 8 → Lerp_HDR.B
Saturate_Charge.Result → Lerp_HDR.Alpha
Multiply_GlobalIntensity.Result → Multiply_HDR.A
Lerp_HDR.Result → Multiply_HDR.B
Multiply_HDR.Result → Multiply_Eroded.A
Step_Erode.Result → Multiply_Eroded.B
Multiply_Eroded.Result → Material.Emissive Color
Step_Erode.Result × ParticleColor.A → Material.Opacity
```

UE `Step` input convention треба перевірити preview-ом, бо перестановка edge/value інвертує result:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Niagara stack contract

```text
System Spawn
  System State
Emitter Spawn
  Emitter State
Emitter Update
  Spawn Rate
Particle Spawn
  Initialize Particle
  Shape Location
  Set Variables (copy User → Particles)
Particle Update
  Particle State
  Color/Scale Color
Render
  Sprite Renderer
```

### Blueprint API contract

```text
Target = Niagara Component instance
Variable Name includes "User." prefix
Type matches Niagara parameter type
Value normalized/clamped before set where required
Set only on event/change unless continuous animation is intentional
```

## 13. Стартові значення параметрів

| Parameter | Default | Range |
|---|---:|---:|
| User.Charge01 | 0 | 0–1 |
| User.Erode01 | 0 | 0–1 |
| User.LocalIntensity | 1 | 0–8 |
| User.EffectTint | white | linear color |
| Particles.Color | white | linear RGBA |
| MPC GlobalIntensity | 1 | 0–2 study |
| Lifetime | 1.75 s | 1–3 s |
| Spawn Rate | 8/s | 1–20/s |
| Sprite Size | 48 | 24–96 |

## 14. Очікуваний результат кожного етапу

| Етап | Доказ |
|---|---|
| Particle Color | Magenta writer робить particles magenta |
| User Tint grid | Чотири instances мають різні tints |
| Charge binding | `.1/.35/.7/1` дають ordered intensity/color |
| Dynamic diagnostic | RGB channels відображають задані values |
| DMI | Один mesh actor змінюється незалежно |
| MPC | Усі readers змінюють global intensity разом |
| Spawn/Update | Старі particles або зберігають, або оновлюють tint відповідно до design |
| Data log | Кожен control має один owner і fallback |

## 15. Самостійна вправа

### EX04-06-A — 12-instance parameter wall

Створіть 12 instances одного `NS_VFX_DataBridge` без duplicate system/material:

- 3 team colors;
- 4 charge values на color;
- однакова exposure/background;
- labels зі значеннями;
- Blueprint або instance overrides;
- no Tick для static values;
- один runtime animated charge instance;
- screenshot і data-path table.

## 16. Додаткова складніша вправа

### EX04-06-B — Scope architecture challenge

Реалізуйте:

- 6 projectiles із власним charge/tint;
- 2 enemies із local DMI shield damage;
- global storm intensity, що впливає на всі electric VFX;
- per-particle age fade;
- High/Low feature toggle без зміни gameplay tint/charge.

Для кожного value виберіть Particle Attribute, User Parameter, DMI, MPC або renderer binding і поясніть, чому інші scopes гірші.

## 17. Три рівні підказок

### EX04-06-A

1. **Напрям:** один System asset, 12 component instances.
2. **Структура:** User Tint/Charge → copy/binding → material.
3. **Майже відповідь:** якщо всі однакові, перевірте, чи Blueprint target — конкретний NiagaraComponent і variable name містить `User.`.

### EX04-06-B

1. **Напрям:** найменший достатній scope.
2. **Структура:** projectile=User, shield component=DMI, storm=MPC, age=particle.
3. **Майже відповідь:** High/Low — system/scalability/static material feature; не MPC, якщо tier може відрізнятися між components/platform contexts.

Повні розв’язки: [L04-06 answers](../EXERCISE_ANSWERS/L04-06_runtime_parameters_answers.md).

## 18. Типові помилки

| Помилка | Симптом | Виправлення |
|---|---|---|
| Немає `User.` prefix | Blueprint set не впливає | Точне ім’я/namespace |
| Float пишеться в Color | Silent fail/default | Типи мають збігатися |
| User variable ніде не читається | Override видно, look ні | Copy/module/binding |
| Particle Color не підключено | Renderer color ignored | Material `ParticleColor` |
| Value copied only in Spawn | Existing particles не змінюються | Update, якщо design цього вимагає |
| MPC для local effect | Всі instances змінюються | User Parameter/DMI |
| DMI reference не збережено | Set йде не в той instance | Store returned MID |
| Tick updates static value | CPU overhead/noise | Event-driven update |
| Binding wrong parameter name | Material default | Exact material parameter |
| Default black/zero | Effect invisible при writer failure | Safe visible fallback |

## 19. Troubleshooting

Діагностуйте від receiver назад:

1. Preview material parameter як grayscale/color.
2. Перевірте exact material instance/renderer assignment.
3. Перевірте renderer binding target name/type.
4. Preview Niagara particle attribute в debugger/attribute visualization.
5. Hard-code User value в System.
6. Перевірте component instance override.
7. Лише потім перевірте Blueprint execution/target.

| Симптом | Швидкий isolated test |
|---|---|
| Tint не працює | Hard-code `Particles.Color=magenta` |
| Charge не працює | Bind constant particle float .8 |
| BP не працює | Встановіть User override вручну на component |
| MPC не працює | Material preview CollectionParameter × visible color |
| DMI не працює | Print valid MID reference; change scalar once |
| Old particles wrong | Move copy from Spawn to Update temporarily |

Exact debugger/material binding UI:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 20. Performance considerations

- Per-particle attributes збільшують simulation/data bandwidth; не створюйте дублікати без need.
- Update-stage copy щокадру дорожча за Spawn-stage copy; вибір залежить від desired living-particle response.
- Blueprint Tick setters створюють CPU work; використовуйте events/timelines з потрібною частотою.
- Renderer bindings і material parameters можуть збільшити shader/data complexity.
- DMI count має memory/management cost; reuse per component, не створюйте щокадру.
- MPC update поширює global change на всі readers; він не per-instance storage.
- Static material switches можуть створювати permutations; runtime scalars лишають ALU branch/math.
- Profile representative counts, а не один isolated sprite.

Числові CPU/GPU budgets і точна cost одного setter:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 21. Запитання для самоперевірки

1. Який scope має `Particles.Color`?
2. Який повний шлях User Tint до Material?
3. Чому User Parameter не змінює look сам по собі?
4. Коли читати User value в Spawn, а коли в Update?
5. Чим Dynamic Parameter відрізняється від DMI?
6. Коли MPC є правильним вибором?
7. Чому `User.Charge` і `User.Charge01` — різні variables?
8. Який fallback потрібен tint?
9. Як ізолювати Blueprint від Niagara під час debug?
10. Чому не слід створювати DMI щокадру?

## 22. Відповіді

1. Per-particle.
2. BP/component override → `User.EffectTint` → Niagara copy/module → `Particles.Color` → Renderer Color Binding → Material `ParticleColor`.
3. Його треба прочитати module, expression або renderer binding.
4. Spawn — value фіксується при народженні; Update — living particles реагують на зміни.
5. Dynamic Parameter — particle-renderer data vector/expression; DMI — runtime material instance object для component slot.
6. Коли одне global value навмисно читають усі relevant materials.
7. Names мають збігатися точно; namespace/name визначає identity.
8. White RGB і alpha 1, якщо effect має лишатися видимим.
9. Встановити User override вручну й перевірити hard-coded Niagara attribute.
10. Це створює зайві objects/work і втрачає stable reference; створюйте один раз і reuse.

## 23. Self-check checklist

- [ ] Particle Color path працює з magenta diagnostic.
- [ ] Named renderer material binding працює з constant `.8`.
- [ ] Dynamic Parameter channels перевірені окремо.
- [ ] User values мають точні names/types/ranges.
- [ ] Spawn/Update behavior обрано свідомо.
- [ ] DMI створюється один раз і reference збережено.
- [ ] MPC використано лише для global value.
- [ ] Static values не оновлюються через Tick.
- [ ] Усі receivers мають safe defaults.
- [ ] Data-path log завершений.

## 24. Mastery criteria

Урок зараховано, якщо:

1. 12 instances одного asset мають незалежні tint/charge;
2. material не duplicated для variants;
3. Particle Color і named parameter binding перевірені isolated tests;
4. DMI змінює лише intended component;
5. MPC навмисно змінює всі readers;
6. студент пояснює Spawn vs Update consequence;
7. кожен control має owner, scope, type, range і fallback;
8. EX04-06-A ≥80/100;
9. runtime setters не виконуються частіше, ніж потрібно.

## 25. Підсумок

- Обирайте найменший достатній parameter scope.
- User Parameter — per Niagara instance input, не автоматичний material parameter.
- Renderer binding є явним bridge між Niagara data та Material.
- DMI — local component material instance; MPC — global shared state.
- Імена, типи, stage і fallback є частиною data contract.
- Debug іде від material receiver назад до writer.

## 26. Зв’язок із наступними уроками

У [L04-07](07_material_laboratory_capstone.md) усі data paths входять до production-ready Material Laboratory. У L07-05–L07-07 renderer bindings будуть відпрацьовані в повних Sprite/Mesh/Ribbon systems; у блоці 10 Blueprint lifecycle і gameplay data отримають production integration.

## 27. Офіційні джерела

- [Render Module Reference for Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Niagara Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-niagara-effects-for-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [System Settings Reference for Niagara Effects — User Parameters](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Using Material Parameter Collections](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-material-parameter-collections-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Instanced Materials](https://dev.epicgames.com/documentation/en-us/unreal-engine/instanced-materials-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Material Parameter Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-parameter-expressions-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.

## 28. Рекомендовані скриншоти або схеми

```text
Схема 1
User.EffectTint → Particles.Color → Renderer Color Binding → ParticleColor → Emissive/Opacity.
Під кожним arrow: тип і scope.
```

```text
Скриншот 2
12-instance wall.
Показати: labels color/charge, один animated instance, один System asset у Content Browser.
```

```text
Схема 3
Чотири колонки: Particle Attribute | User Parameter | DMI | MPC.
Рядки: owner, scope, update, best use, misuse.
```
