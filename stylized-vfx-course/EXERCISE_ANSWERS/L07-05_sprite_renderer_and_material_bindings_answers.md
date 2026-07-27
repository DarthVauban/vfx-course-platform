# Рішення вправ — 07.05 Sprite Renderer і bindings

Назви, залежні від версії: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L07-05-A

### Обґрунтування

Impact sparks потребують короткого, швидкого й анізотропного burst. CPU зберігає stack із малою кількістю частинок придатним до інспекції. Контракт renderer/material оцінюється окремо від руху.

### Повний stack

```text
System Properties
System Spawn: empty
System Update: System State
Emitter Properties: CPUSim; Local Space False; Determinism True; Seed 1505
Emitter Spawn: empty
Emitter Update
  Emitter State
  Spawn Burst Instantaneous
Particle Spawn
  Initialize Particle
  Shape Location
  Add Velocity in Cone
  Dynamic Material Parameters
Particle Update
  Particle State
  Gravity Force
  Drag
  Solve Forces and Velocity
  Scale Color
  Scale Sprite Size
Render
  Sprite Renderer
```

### Точні налаштування й default values

- lifecycle Self/Complete/Once/Fixed `1 s`;
- burst `36 @ 0`;
- lifetime Random `.25–.65`;
- radius birth sphere/hemisphere `8`; якщо input `Hemisphere` недоступний, використайте лише cone й запишіть це;
- вісь cone Z, angle `55°`, random speed `500–900`;
- size `(4,30)`, rotation `0`, color `(1,.18,.015,1)`;
- Dynamic0 `(Erode=.03, Distortion=.1, Core=1, Variant=0)`;
- Gravity `(0,0,-900)`, Drag `1.6`, default settings solver;
- keys alpha `(0,0),(.03,1),(.55,1),(1,0)`;
- scale X-size `(0,.5),(.08,1),(1,.15)`, Y `(0,.7),(.08,1),(1,.05)`.

### Контракт renderer і bindings

Material `MI_VFX_Sprite_Production`; `Use with Niagara Sprites`; перевірено Particle Color RGB/A і Dynamic Parameter index0.

```text
Alignment=Velocity Aligned
Facing Mode=Face Camera
Pivot=(.5,.5)
Sort Mode=None
Sub Image Size=(1,1)
Position=Particles.Position
Color=Particles.Color
Velocity=Particles.Velocity
Rotation=Particles.SpriteRotation
Size=Particles.SpriteSize
Facing=Particles.SpriteFacing
Alignment Binding=Particles.SpriteAlignment
SubImage=Particles.SubImageIndex
Dynamic0=Particles.DynamicMaterialParameter
CameraOffset=Particles.CameraOffset
UVScale=Particles.UVScale
MaterialRandom=Particles.MaterialRandom
CustomSorting/NormalizedAge=Particles.NormalizedAge
```

### Чому це працює, альтернативи й неправильні рішення

Velocity alignment робить балістичний напрямок читабельним; gravity повертає cards під час спуску. Допустима альтернатива: `Add Velocity` Random Range Vector із додатною hemisphere, якщо distribution задокументовано. Неправильно: gravity після solver, квадратні sprites, material tint hardcoded після Particle Color, View Depth увімкнено без відповідного artifact або переставлено channels Dynamic0.

### Перевірка й performance

Peak alive `36`; reset відтворює той самий seeded pattern у записаному build; color і Core реагують; cards згасають до death; bounds охоплюють найдальший spark. Перевірте Shader Complexity на темному й світлому фонах. Якщо bottleneck є покриття екрана, а не simulation, першим важелем буде зменшення size/overlap.

## EX-L07-05-B

### Обґрунтування

Вправа перевіряє atlas, attribute кадру simulation, grid renderer і sampling material як один ланцюг.

### Повний stack

```text
Emitter Properties: CPUSim, Local False, Determinism True, Seed 1510
Emitter Spawn: empty
Emitter Update: Emitter State; Spawn Burst Instantaneous
Particle Spawn
  Initialize Particle
  Shape Location
  Sub UV Animation
Particle Update
  Particle State
  Scale Color
  Scale Sprite Size
Render
  Sprite Renderer
```

Групи System: System Properties, порожній System Spawn, System Update/System State.

### Точне налаштування

- lifecycle `Once/1.2 s`, burst `8`, lifetime `1.0`;
- radius sphere `20`, velocity zero;
- color `(.15,.65,1,1)`, size `(96,96)`;
- `Sub UV Animation`: start frame `0`, end frame `15`, animation phase/input `Particles.NormalizedAge`, playback once, без random start;
- Sprite Renderer: material instance із sampling `T_Flipbook_EnergyRing_4x4_1024`; Sub Image Size `(4,4)`; Sub UV Blending Enabled true; Sub Image Index Binding `Particles.SubImageIndex`;
- решта повних bindings відповідає EX-L07-05-A; Face Camera, Unaligned, pivot center, Sort None.

Exact Sub UV Animation input labels **потребують ручної перевірки в Unreal Engine 5.8.**

### Перевірка кадрів

Призупиніть і примусово задайте або перевірте normalized phases:

| NormalizedAge | Очікувана околиця frame |
|---:|---:|
| `0` | `0` |
| `.333` | `5` |
| `.667` | `10` |
| `1` | `15` |

За ввімкненого blending дробові фази інтерполюють сусідні frames. Вимкніть blending для захоплення точного порядку cells, а потім відновіть його.

### Альтернативи / неправильні рішення / продуктивність

Пряма крива, що записує `Particles.SubImageIndex`, допустима, але `Sub UV Animation` є зрозумілішим foundation module. Неправильно: grid 16×1, припущення column-major, material sampling усього atlas без SubUV coordinates, random start або ігнорування alpha bleed.

Вісім translucent cards `96×96` можуть мати більше overdraw, ніж 36 тонких sparks. Перевірте mip distance і neighbor bleed; зменшуйте size/overlap або використовуйте cutout лише після виміряного порівняння.
