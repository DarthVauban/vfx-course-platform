# Рішення вправ — 07.08 Niagara Foundations Control Project

Version-sensitive labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L07-08-A

### Обґрунтування

Референсний розв’язок використовує violet-gold варіант «arcane break» у межах ±25% від guided motion. Три emitters спільно використовують чотири controls, але зберігають renderer-specific particle attributes і bindings. CPU лишається виправданим через малу кількість і відсутність GPU-only features.

### Контракт System/User

`NS_EX_L07_08_Trinity`; System State у System Update; modules у System Spawn відсутні; Fixed Bounds увімкнено: Min `(-750,-750,-550)`, Max `(750,750,750)`.

| User parameter | Type | Default |
|---|---|---|
| `User.EffectColor` | Linear Color | `(.65,.15,1,1)` |
| `User.Intensity` | Float | `1.25` |
| `User.Scale` | Float | `1` |
| `User.Direction` | Vector | `(1,0,.15)` normalized at use |

### Повний розв’язок Sprite

```text
Emitter Properties: CPUSim; Local False; Determinism True; Seed 1801
Emitter Spawn: empty
Emitter Update: Emitter State; Spawn Burst Instantaneous
Particle Spawn: Initialize Particle; Shape Location; Add Velocity in Cone; Dynamic Material Parameters
Particle Update: Particle State; Gravity Force; Drag; Solve Forces and Velocity; Scale Color; Scale Sprite Size
Render: Sprite Renderer
```

Once `1.2`; Count `22`; lifetime `.4–.75`; size `(6,42)×Scale`; sphere `9×Scale`; cone D `28°`, speed `480–700`; gravity -620Z; drag 1.15; Dynamic0 `(0,.12,Intensity,0)`. Alpha `0,.04,.65,1→0,1,1,0`. Material Renderer `MI_VFX_Sprite_Production`, Velocity Aligned, Face Camera, Sort None, center pivot, усі Sprite bindings із L07-05.

### Повний розв’язок Mesh

```text
Emitter Properties: CPUSim; Local False; Determinism True; Seed 1802
Emitter Spawn: empty
Emitter Update: Emitter State; Spawn Burst Instantaneous
Particle Spawn: Initialize Particle; Shape Location; Add Velocity in Cone; Initial Mesh Orientation; Add Rotational Velocity; Dynamic Material Parameters
Particle Update: Particle State; Gravity Force; Drag; Solve Forces and Velocity; Update Mesh Orientation; Scale Mesh Size; Scale Color
Render: Mesh Renderer
```

Once `1.8`; Count `10`; lifetime `1–1.4`; scale `.35–.65×Scale`; sphere 8; cone D `42°`, speed `280–430`; gravity -720Z; drag .55; initial rotation ±180; rate ±180°/s; Dynamic0 `(0,0,Intensity,0)`. Mesh `SM_VFX_Debris_B`, material `MI_VFX_Mesh_Production`, Default facing, повні Mesh bindings.

### Повний розв’язок Ribbon

```text
Emitter Properties: CPUSim; Local False; Determinism True; Seed 1803
Emitter Spawn: empty
Emitter Update: Emitter State; Spawn Rate
Particle Spawn: Initialize Ribbon; Add Velocity; Dynamic Material Parameters
Particle Update: Particle State; Drag; Solve Forces and Velocity; Scale Ribbon Width; Scale Color
Render: Ribbon Renderer
```

Once `1.2`; Rate `32/s`; lifetime `.75`; width `9×Scale`; velocity `D×340+(0,0,70)`; drag .18; Dynamic0 `(0,.08,Intensity,0)`. Taper Width/alpha `0→1→1→0`. Renderer `MI_VFX_Ribbon_Production`, Screen, tiling 45, Automatic, повні Ribbon bindings.

### Чому це працює, альтернативи й неправильні рішення

Кожне значення User прив’язане на input module; renderers і далі читають `Particles.*`. Допустимі варіанти motion/palette лишаються в межах brief. Неправильно: змінено лише tint renderer; User.Scale не застосовано до ribbon; GPU додано без причини; coordinate spaces різні; Direction дорівнює нулю; custom module/Event.

### Перевірка/performance

Оцінка peak: Sprite 22 + Mesh 10 + Ribbon `32×.75≈24` = ~56. Захопіть спостережувані peaks для кожного emitter. Перевірте три User variants і всі quadrants напрямку. Fixed bounds не мають спричиняти culling за Scale 2. Не вигадуйте тверджень у ms; для вимірювань використовуйте умови debugger/profiler.

## EX-L07-08-B

### Матриця несправностей і точні виправлення

| Несправність | Симптом | Перший несправний stage | Мінімальне виправлення | Regression |
|---|---|---|---|---|
| Sprite Color Binding=`User.EffectColor` або unrelated attribute | fallback/хибний color; втрачено per-particle alpha | renderer binding | `Color Binding=Particles.Color` | color + крива alpha на 3 variants |
| Mesh Local Space=True | старі shards слідують за переміщеним source | Emitter Properties/space | `Local Space=False` | перемістити actor після `.3 s`; shards лишаються у world |
| Ribbon Link Order хибний/None custom | folds/fragments/order flip | Ribbon Renderer binding | `Particles.RibbonLinkOrder` | solo playback за rate 30, три resets |
| Gravity нижче Solver | у mesh trajectory немає gravity поточного проходу/dependency warning | порядок Particle Update | перемістити `Gravity Force` вище `Solve Forces and Velocity` | apex/descent і відсутність warning |

### Діагностичний протокол

1. Створіть дублікат `NS_EX_L07_08_Fault`.
2. Увімкніть лише одну несправність.
3. Увімкніть Solo відповідного emitter.
4. Запишіть expected/actual і точний User variant.
5. Простежте writer → stage/order → attribute → renderer → material.
6. Застосуйте одне мінімальне виправлення.
7. Повторно перевірте default, cyan/Scale .75, heavy/Scale 2.

### Аудит bounds/coverage

Default fixed bounds можуть бути консервативними. Перевірте User.Scale `1` і `2` з Direction ±X/±Y та camera top/front/side. Запишіть:

| Варіант | Sprite peak | Mesh peak | Ribbon peak | Разом | Culling | Спостереження coverage |
|---|---:|---:|---:|---:|---|---|
| Scale 1 | 20 | 12 | ~24 | ~56 | немає | baseline |
| Scale 2 | 20 | 12 | ~24 | ~56 | має бути відсутній | більший coverage sprite/ribbon; вищий ризик overdraw |

Scale змінює size/coverage, а не count. Якщо WPO material розширює mesh, включіть виміряне displacement до bounds.

### Альтернативи / неправильні рішення / performance

Не «виправляйте» color через hardcoding material tint, space через зупинку руху actor, LinkOrder через збільшення tessellation або gravity через подвоєння initial downward velocity. Такі дії маскують першопричини. Для порівняння coverage використовуйте однакові camera/quality/resolution; сам particle count не є повною вартістю.
