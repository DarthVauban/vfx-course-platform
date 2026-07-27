# Рішення вправ — 07.03 Shape, velocity, forces і spaces

Назви, залежні від версії: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L07-03-A

### Обґрунтування

Box керує областю народження; початковий upward velocity створює викид fountain; Gravity викривляє його; Drag скорочує дальність; solver інтегрує рух. Collision виключено, тому жодний environmental query не змінює траєкторію.

### Повний stack

```text
System Properties
System Spawn: empty
System Update: System State
Emitter Properties: CPUSim; Local Space False; Determinism True; Seed 1303
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
  Gravity Force
  Drag
  Solve Forces and Velocity
  Scale Color
  Scale Sprite Size
Render
  Sprite Renderer
```

### Налаштування й параметри

`Emitter State=Self/Complete/Once/Fixed 2.0 s`; burst `24 @ 0`; lifetime `1.2`; color `(1,.25,.02,1)`; size `(10,22)`; `Shape Primitive=Box`; розміри box `(80,20,10)`.

`Add Velocity`: direct/random ranged vector із minimum `(-60,-30,260)` і maximum `(60,30,260)` у Simulation space. Якщо встановлений `Add Velocity` відкриває `Velocity Mode`, використайте dynamic input Random Ranged Vector на Velocity. `Gravity Force=(0,0,-500)`; `Drag=.4`; default settings solver.

Крива Alpha `(0,1),(.75,1),(1,0)`; множник size `(0,.5),(.15,1),(1,.2)`.

Renderer: `MI_VFX_FoundationSprite`; Face Camera; velocity-aligned, якщо доступно, інакше Unaligned для оцінювання лише руху; bindings Position/Color/Velocity/Rotation/Size/NormalizedAge до `Particles.*`.

### Перевірка

- footprint народження широкий за X і вузький за Y/Z;
- усі частинки починають із додатного Z;
- vertical velocity зменшується з часом, а траєкторія утворює arc;
- відскоку від підлоги немає;
- загалом 24 частинки, потім чистий death.

Приблизна вершина центральної частинки без drag: `t≈260/500=.52 s`, `z≈67.6 cm`. Drag знижує вершину. Це очікування, а не точний oracle solver.

### Альтернативи / неправильні рішення / продуктивність

`Box Location` specialized module is valid if `Shape Location` does not expose Box in installed build. **Потребує ручної перевірки в Unreal Engine 5.8.** Wrong: Gravity after solver, random negative Z, collision added, infinite rate, or box scale applied through System actor between captures. Cost is 24 CPU particles with two simple per-particle update modules; sprite coverage remains relevant.

## EX-L07-03-B

### Обґрунтування

Перевірка ізолює coordinate frames. Використайте два emitters з однаковими числами й transform System, змінюючи лише інтерпретацію local/world. Явні inputs coordinate space у module потрібно задокументувати, бо вони можуть перевизначити очікуваний frame.

### Повні парні stacks

Для обох:

```text
Emitter Properties
Emitter Spawn: empty
Emitter Update: Emitter State; Spawn Burst Instantaneous
Particle Spawn: Initialize Particle; Shape Location; Add Velocity
Particle Update: Particle State; Drag; Solve Forces and Velocity; Scale Color
Render: Sprite Renderer
```

Групи System містять System State. `WorldTwin`: CPUSim, Local Space False, seed `1310`. `LocalTwin`: CPUSim, Local Space True, seed `1310`. Якщо duplicate emitters зі спільним seed не ідентичні у встановленому build, запишіть значення seed для кожного emitter, але використайте fixed velocity без random range.

### Точні налаштування

- rotation actor System `(Pitch=0,Yaw=90,Roll=0)`;
- burst `5 @ 0`;
- lifetime `1.5`;
- radius sphere Shape `5`;
- direct Velocity `(250,0,0)`, coordinate space явно `Simulation` для local twin;
- для world-control branch задайте coordinate space input module як `World`, якщо його відкрито;
- Drag `.2`; default settings solver;
- initial positions локально зміщено на `(-20,0,0)` / `(20,0,0)`;
- size `(12,12)`, різні orange/cyan colors.

### Очікуваний результат

Вісь X local simulation слідує за yaw actor, тому local twin рухається приблизно вздовж world +Y. Velocity, явно заданий у World X, рухається вздовж world +X. Якщо обидва velocity modules використовують Simulation space, Simulation space emitter з `LocalSpace=False` є World, тоді як local emitter використовує component-local coordinates.

### Bindings і перевірка

Усі bindings Sprite Renderer використовують `Particles.Position`, `Color`, `Velocity`, `SpriteRotation`, `SpriteSize`, `NormalizedAge`. Подайте захоплення зверху з world axes, component axes і стрілками. Поверніть actor до yaw 0: обидва мають вирівнятися за +X.

### Альтернативи / неправильні рішення / продуктивність

Допустима альтернатива використовує два окремі actors System, один Local і один World, з ідентичними assets; докази transform мають бути явними. Неправильно: обертати лише один actor, використовувати випадковий напрямок From Point, порівнювати перспективу без axis gizmo або змінювати `Local Space` після spawn і називати це чистим baseline. Експеримент дешевий; його цінність — семантична правильність.
