# Рішення вправ — 07.06 Mesh Renderer і spaces

Назви, залежні від версії: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L07-06-A

### Обґрунтування

Три emitters зберігають один Particle Mesh на renderer і роблять budgets силуету та count явними. Спільний stack забезпечує цілісний рух; scale/mesh/count створюють варіативність.

### Повний System

System: `System Properties`; порожній `System Spawn`; `System Update > System State`.

Кожен `Debris_A/B/C`:

```text
Emitter Properties: CPUSim, Local False, Determinism True
Emitter Spawn: empty
Emitter Update: Emitter State; Spawn Burst Instantaneous
Particle Spawn
  Initialize Particle
  Shape Location
  Add Velocity in Cone
  Initial Mesh Orientation
  Add Rotational Velocity
Particle Update
  Particle State
  Gravity Force
  Drag
  Solve Forces and Velocity
  Update Mesh Orientation
  Scale Mesh Size
  Scale Color
Render
  Mesh Renderer
```

### Точні значення для кожного emitter

| Emitter | Mesh | Seed | Count | Scale |
|---|---|---:|---:|---|
| A | `SM_VFX_Debris_A` | `1606` | `8` | `.45–.80` |
| B | `SM_VFX_Debris_B` | `1607` | `6` | `.35–.65` |
| C | `SM_VFX_Debris_C` | `1608` | `4` | `.60–1.00` |

Спільні значення: Self/Complete/Once/2.2 s; lifetime `1.2–1.8`; radius sphere `12`; cone Z `55°`, speed `320–620`; random initial rotation ±180°; angular velocity ±220°/s; gravity -980Z; drag .45; крива scale `.4→1→.2`; alpha fade протягом останніх 20%.

Кожен Mesh Renderer: `Facing Mode=Default`, Sort None, override slot0 `MI_VFX_Mesh_Production`; bindings Position/Color/Velocity/MeshOrientation/Scale/Dynamic0/MaterialRandom/NormalizedAge до відповідних `Particles.*`.

### Перевірка й примітка про вартість

Peak count=18. Для кожного imported mesh запишіть triangle count `T_A/T_B/T_C`; пікова оцінка поданої геометрії дорівнює `8T_A+6T_B+4T_C` до renderer-specific optimizations/culling. Це не мілісекунди. Bounds охоплюють усі три arcs.

### Альтернативи / неправильні рішення

Шлях multi-mesh array/random mesh index може бути допустимим у встановленому renderer, але виходить за межі потрібної foundation clarity. Неправильно: один emitter із трьома overlapping Mesh Renderers, що рендерять кожну частинку тричі; неузгоджені materials; local debris або різна gravity. Overhead трьох emitters прийнятний і має бути профільований пізніше.

## EX-L07-06-B

### Обґрунтування

Needle демонструє velocity facing renderer і attached local-space behavior без Blueprint/data interfaces.

### Повний stack

```text
System Properties
System Spawn: empty
System Update: System State
Emitter Properties: CPUSim; Local Space True; Determinism True; Seed 1610
Emitter Spawn: empty
Emitter Update
  Emitter State
  Spawn Rate
Particle Spawn
  Initialize Particle
  Shape Location
  Add Velocity
Particle Update
  Particle State
  Drag
  Solve Forces and Velocity
  Scale Mesh Size
  Scale Color
Render
  Mesh Renderer
```

### Налаштування/bindings

- lifecycle Self/Complete/Infinite для інтерактивної лабораторії; Spawn Rate `6/s`;
- lifetime `.8`; position plane/box навколо origin `(10,10,2)`; direct velocity local/Simulation `(450,0,0)`; Drag `.15`;
- scale `(1,.3,.3)` лише якщо цього вимагають перевірені пропорції mesh; color cyan;
- Particle Mesh `SM_VFX_Beam_01`; material `MI_VFX_Mesh_Production`;
- Facing Mode `Velocity`; Position=`Particles.Position`; Velocity=`Particles.Velocity`; Color=`Particles.Color`; Scale=`Particles.Scale`; Mesh Orientation лишається прив’язаним, але velocity facing є основним шляхом орієнтації.

### Очікуваний результат і перевірка

Перевірте local +X у `SM_VFX_Beam_01`. За yaw System 90° needles рухаються вздовж world +Y, лишаючись local до component. Перемістіть component: наявні local particles слідують за frame component. У дублікаті з Local Space false уже народжені частинки зберігають world trajectories.

### Альтернативи / неправильні рішення / продуктивність

Якщо local +X у beam mesh не є forward, виправте source/import або використайте задокументовану initial corrective orientation; не обертайте мовчки System для кожного використання. Неправильно: zero velocity, Facing Default, world/local actors із різними transforms, collision або вимірювання в перспективі без axes.

За `6/s × .8 s` steady living count ≈5. Мала кількість CPU доречна; Mesh complexity/material лишаються вимірюваними змінними.
