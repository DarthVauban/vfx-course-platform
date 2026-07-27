# Рішення вправ — 07.01 System, Emitter, Module, Parameter і stack

Відкривайте після власної спроби й трьох hints. Версія: UE 5.8.x. **Потребує ручної перевірки в Unreal Engine 5.8.** Це стосується version-sensitive category paths і labels.

## EX-L07-01-A

### Обґрунтування

Два modules пишуть один persistent attribute в одному stage. Через top-to-bottom execution final value дорівнює останньому write перед renderer. Test навмисно не використовує curves або timing, щоб ізолювати order.

### Asset і повний stack

`NS_EX_L07_01_StackOrder`, emitter `NE_EX_L07_01_Order`:

```text
System Properties
System Spawn
  no added modules
System Update
  System State
Emitter Properties
Emitter Spawn
  no added modules
Emitter Update
  Emitter State
  Spawn Burst Instantaneous
Particle Spawn
  Initialize Particle
Particle Update
  Particle State
  Set Parameter — Particles.Color = (0,1,0,1)
  Set Parameter — Particles.Color = (1,0,1,1)
Render
  Sprite Renderer
```

### Exact settings, parameters і bindings

| Розташування | Налаштування | Значення |
|---|---|---|
| Emitter Properties | `Sim Target` | `CPUSim` |
|  | `Local Space` | `False` |
|  | `Determinism` / `Random Seed` | `True` / `1101` |
| Emitter State | lifecycle | `Self`, `Complete`, `Once`, Fixed `2.5 s` |
| Spawn Burst Instantaneous | `Spawn Count`, `Spawn Time` | `5`, `0.0 s` |
| Initialize Particle | Lifetime | `2.0 s` |
|  | Position / Velocity | `(0,0,0)` / `(0,0,0)` |
|  | Color | `(1,1,1,1)` |
|  | Sprite Size / Rotation | `(32,32)` / `0°` |
| перший Set Parameter | target/type/default | `Particles.Color`, Linear Color, `(0,1,0,1)` |
| другий Set Parameter | target/type/default | `Particles.Color`, Linear Color, `(1,0,1,1)` |

Sprite Renderer:

```text
Material = MI_VFX_FoundationSprite
Alignment = Unaligned
Facing Mode = Face Camera
Pivot in UVSpace = (0.5,0.5)
Position Binding = Particles.Position
Color Binding = Particles.Color
Velocity Binding = Particles.Velocity
Sprite Rotation Binding = Particles.SpriteRotation
Sprite Size Binding = Particles.SpriteSize
Normalized Age Binding = Particles.NormalizedAge
```

### Простеження Parameter Map

```text
Initialize Particle: Particles.Color = white
Set Parameter #1:   Particles.Color = green
Set Parameter #2:   Particles.Color = magenta
Sprite Renderer:    reads magenta
```

Поміняйте місцями два modules Set Parameter, і фінальне простеження стане `white → magenta → green → renderer`. Це обов’язкове друге захоплення.

### Чому це працює

Modules не змішуються лише через те, що впливають на той самий attribute. Прямий запис замінює попереднє значення. Обидва записи використовують однакові namespace і type, тому єдиною змінною лишається порядок.

### Допустимий альтернативний підхід

Два modules `Color` можуть продемонструвати те саме перезаписування, якщо обидва безпосередньо задають `Particles.Color`; прямий `Set Parameter` дає кращий доказ, бо його target видно. Module `Scale Color` не є рівнозначним: множення перевірятиме композицію, а не два прямі присвоєння.

### Типові неправильні рішення

- один запис має target `Emitter.Color`, тому перевірка більше не ізолює порядок;
- один module вимкнено;
- renderer прив’язано до custom color attribute;
- захоплення зроблено без reset simulation;
- material ігнорує Niagara Particle Color;
- modules розміщено в різних stages, але описано як чисту перевірку порядку.

### Verification і performance

- рівно п’ять magenta sprites у виробничому порядку;
- після swap — рівно п’ять green sprites;
- немає compile/dependency warnings;
- screenshot stack і trace узгоджуються.

Два прямі записи є навмисно надлишковою діагностичною роботою; у production приберіть запис, значення якого перезаписується. У цій малій лабораторії домінує вартість renderer/material.

## EX-L07-01-B

### Обґрунтування

Emitter scope і particle scope must remain separate. Two emitter instances can use similarly named attributes without sharing their particle datasets. `Emitter.DebugColor` does not populate `Particles.Color`.

### Повний stack System

```text
NS_EX_L07_01_ScopeAudit
├─ System Properties
├─ System Spawn
│  └─ no added modules
├─ System Update
│  └─ System State
├─ Emitter_Orange
│  ├─ Emitter Properties: CPUSim, Local Space False, Determinism True, Seed 1102
│  ├─ Emitter Spawn: Set Parameter Emitter.DebugColor=(0.1,1,0.1,1)
│  ├─ Emitter Update: Emitter State; Spawn Burst Instantaneous
│  ├─ Particle Spawn: Initialize Particle
│  ├─ Particle Update: Particle State
│  └─ Render: Sprite Renderer
└─ Emitter_Cyan
   ├─ Emitter Properties: CPUSim, Local Space False, Determinism True, Seed 1103
   ├─ Emitter Spawn: no added modules
   ├─ Emitter Update: Emitter State; Spawn Burst Instantaneous
   ├─ Particle Spawn: Initialize Particle
   ├─ Particle Update: Particle State
   └─ Render: Sprite Renderer
```

### Точні стартові значення

| Значення | `Emitter_Orange` | `Emitter_Cyan` |
|---|---:|---:|
| loop | Once, `2.0 s` | Once, `2.0 s` |
| burst | `4 @ 0.0 s` | `4 @ 0.0 s` |
| lifetime | `1.5 s` | `1.5 s` |
| position | `(-50,0,0)` | `(50,0,0)` |
| velocity | `(0,0,0)` | `(0,0,0)` |
| `Particles.Color` | `(1,0.25,0.02,1)` | `(0.02,0.8,1,1)` |
| `Particles.SpriteSize` | `(24,24)` | `(36,16)` |
| seed | `1102` | `1103` |

Обидва Sprite Renderers використовують шість default bindings `Particles.*` з EX-L07-01-A. `Emitter_Orange.Emitter.DebugColor` має тип Linear Color і значення `(0.1,1,0.1,1)`, але не має renderer binding.

### Аудит scope

| Parameter | Owner/scope | Writer | Reader | Видимий наслідок |
|---|---|---|---|---|
| `Emitter.DebugColor` | instance Orange emitter | Emitter Spawn Set Parameter | немає | немає |
| `Particles.Color` | кожна частинка Orange | Orange Initialize Particle | Orange Sprite Renderer | orange |
| `Particles.Color` | кожна частинка Cyan | Cyan Initialize Particle | Cyan Sprite Renderer | cyan |
| `System.ExecutionState` | System | System State | обидва lifecycle contexts | спільний lifecycle context System |

### Чому це працює

Кожен emitter володіє окремим particle dataset. Ім’я variable містить namespace і context. Зелений `Emitter.DebugColor` лишається невикористаними даними, доки явний module не скопіює або не прив’яже його до particle attribute, який читає renderer.

### Допустимий альтернативний підхід

Можна явно скопіювати `Emitter.DebugColor` у `Particles.Color` в `Particle Spawn` через прямий input Set Parameter, прив’язаний до `Emitter.DebugColor`. Це корисне продовження, але обов’язкове захоплення «до» має довести відсутність неявного копіювання.

### Типові неправильні рішення

- зміна `Color Binding` Orange Sprite Renderer на custom attribute до baseline;
- використання одного emitter із двома burst locations і називання їх двома scopes;
- однакове display name для обох emitters;
- зміна material tint для кожного emitter, що приховує перевірку потоку даних;
- припущення, що сам різний seed доводить ізоляцію даних.

### Verification і performance

- чотири orange particles ліворуч і чотири cyan particles праворуч;
- зелений `Emitter.DebugColor` видно в panel параметрів, але не на екрані;
- вимкнення одного emitter не змінює колір частинок іншого;
- подано повний stack і таблицю scope.

Два emitters мають більший lifecycle/dispatch overhead, ніж один, але вправа перевіряє володіння даними. Не узагальнюйте цю архітектуру до «одного emitter на кожен колір» у production без вимірювання й дизайнерської потреби.
