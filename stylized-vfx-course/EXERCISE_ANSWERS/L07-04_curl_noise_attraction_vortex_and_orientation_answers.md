# Рішення вправ — 07.04 Motion fields і orientation

Version-sensitive labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L07-04-A

### Обґрунтування

Обмежена спіраль потребує tangential та inward components плюс damping. Vortex сам по собі обертає або викидає частинки залежно від setup; attraction сам по собі стискає їх до центру; Drag обмежує накопичену speed.

### Повний stack

```text
System Properties
System Spawn: empty
System Update: System State
Emitter Properties: CPUSim; Local Space False; Determinism True; Seed 1404
Emitter Spawn: empty
Emitter Update
  Emitter State
  Spawn Burst Instantaneous
Particle Spawn
  Initialize Particle
  Shape Location
  Add Velocity
Particle Update
  Particle State
  Vortex Force
  Point Attraction Force
  Drag
  Solve Forces and Velocity
  Scale Color
  Scale Sprite Size
Render
  Sprite Renderer
```

### Точні налаштування, параметри й bindings

- lifecycle `Self/Complete/Once/Fixed 3.5 s`;
- burst `64 @ 0`; lifetime `3.0`; radius sphere `120`;
- initial speed From Point `20`; color `(.15,.55,1,1)`; size `(5,30)`;
- Vortex: Amount `120`, Axis `(0,0,1)`, origin zero, optional inward pull вимкнено;
- Point Attraction: position zero, Strength `4`, Radius `300`, Falloff `.8`, Kill Radius вимкнено;
- Drag `1.4`; default settings solver;
- крива alpha `(0,0),(.08,1),(.8,1),(1,0)`;
- крива size `(0,.5),(.15,1),(1,.35)`.

Sprite Renderer: material `MI_VFX_FoundationSprite`; `Velocity Aligned`; `Face Camera`; pivot `(.5,.5)`; bindings Position, Color, Velocity, Sprite Rotation, Sprite Size, Normalized Age → відповідні `Particles.*`.

### Чому це працює / порядок

Обидва field modules накопичують вплив до Drag/Solver. Не слід вважати їхній відносний порядок комутативним у кожній реалізації, тому збережіть і задокументуйте наведений порядок. Attractor і origin vortex використовують спільний Simulation space.

### Дозволене налаштування й перевірка

Допустимі фінальні діапазони: Vortex `90–150`, Attraction `3–5`, Drag `1.05–1.75`. Змініть одне значення, виконайте reset і захопіть у `1.5 s`. Умова проходження: більшість частинок лишається приблизно в radius `300`, circulation читається, миттєвого kill у центрі немає, death настає за lifetime.

### Альтернативи, неправильні рішення й performance

`Vortex Velocity` є альтернативною архітектурою, але безпосередньо змінює velocity замість перевірки `Vortex Force`; не підміняйте ним module у цій вправі. Неправильно: solver між fields, attraction після solver, random origin, kill radius або зміна трьох inputs за одну спробу. Два analytic fields + drag виконуються для кожної частинки в кожному update; 64 CPU particles доречні для аудиту.

## EX-L07-04-B

### Обґрунтування

Дублікат simulation ізолює alignment renderer. Однакові seed, порядок modules, positions і camera означають, що різниця осей походить від settings renderer.

### Повний контракт парної перевірки

Обидва emitters:

```text
Emitter Properties: CPUSim, Local False, Determinism True, Seed 1410
Emitter Spawn: empty
Emitter Update: Emitter State; Spawn Burst Instantaneous
Particle Spawn: Initialize Particle; Shape Location; Add Velocity
Particle Update: Particle State; Curl Noise Force; Drag; Solve Forces and Velocity; Scale Color
Render: Sprite Renderer
```

Settings: burst `32`, lifetime `2.5`, radius sphere `60`, speed From Point `40`, Curl `72/.02`, Drag `.7`, size `(5,35)`. Offset emitter A `-120 X`, B `+120 X` після документування всіх припущень щодо simulation space.

Renderer A: `Alignment=Unaligned`; Renderer B: `Alignment=Velocity Aligned`; для обох `Facing Mode=Face Camera`; для обох `Velocity Binding=Particles.Velocity`; інші standard bindings ідентичні.

### Перевірка

У `t≈1.2 s` позначте десять частинок із виразно ненульовим velocity. У B довгі осі слідують за projected velocity; у A осі слідують за поведінкою SpriteRotation/facing, а не за поточним velocity. Обертайте camera: Face Camera зберігає cards видимими, а відмінність alignment A/B лишається.

### Альтернативи / неправильні рішення / performance

Один emitter із двома Sprite Renderers може порівнювати renderer modes, але overlapping cards створюють візуальну неоднозначність; бажані парні emitters. Неправильно: різні seeds, квадратні sprites, різні materials, custom facing або порівняння в центрі з нульовою speed. Подвійний rendering коштує вдвічі більше sprite draw data у діагностиці; приберіть дублікат після доказу.
