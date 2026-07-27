# Ключ — Підсумкове оцінювання блоку 07 Niagara Foundations

Відкривайте тільки після зафіксованої здачі. Цей ключ — довідковий контракт, а не єдиний художній вигляд. **Потребує ручної перевірки в Unreal Engine 5.8.** Це стосується version-sensitive UI/menu labels.

## Частина 1 — Відповіді на тест

1. System координує один або кілька emitters і стан System; Emitter володіє particle simulation; Module читає й записує дані в stage; Parameter є типізованим іменованим значенням.
2. Spawn виконується один раз під час створення відповідного System/Emitter/particle; Update виконується кожний tick, поки відповідний об’єкт active/alive.
3. Modules виконуються зверху вниз; нижчий module бачить попередні записи й може перезаписати їх до reader.
4. Parameter Map — це типізований стан, що розвивається й передається через упорядковані modules, а не позачасове глобальне сховище.
5. `System.` — scope System; `Emitter.` — один instance emitter; `Particles.` — кожна persistent particle; `User.` — відкритий input; `Engine.` — context; `Module.` — scope поточного module.
6. Burst випускає задану кількість у певний момент; Rate інтегрує spawn за кожну активну секунду.
7. `.45/1.5=.3`; normalized phase дозволяє різним lifetimes використовувати ту саму форму кривої `0–1`.
8. Seed стабілізує random stream для сумісних build/path/reset; він не гарантує fixed timestep, побітової ідентичності між versions/platforms або однакового результату після зміни stack.
9. Point direction використовує position частинки, тому position потрібно ініціалізувати першою.
10. `Particle State → Gravity Force → Drag → Solve Forces and Velocity → appearance curve`.
11. World particles зберігають world trajectory під час руху component; local particles лишаються відносними й слідують за transform component.
12. Curl є цілісною просторовою turbulence; attraction спрямована всередину до attractor; vortex рухається тангенціально навколо осі.
13. Facing вибирає напрямок plane; alignment — осі в площині; Velocity Aligned читає `Particles.Velocity`.
14. writer/module → `Particles.Color` → Sprite Color Binding → material `Particle Color` RGB/A → вихідні pixels.
15. Orientation читає `Particles.MeshOrientation`; Scale читає `Particles.Scale`; Velocity facing вирівнює local X mesh із `Particles.Velocity`.
16. ID групує points, LinkOrder упорядковує їх, Width керує шириною strip у точці.
17. `36×.7=25.2`, тобто приблизно 25 живих; межа frame/interpolation може відрізнятися, тому запишіть observed count.
18. Sprite: ризики translucent overdraw і sort; Mesh: кількість instances × geometry/material/shadows; Ribbon: кількість points, tessellation і overdraw від width.
19. CPU: peak ~63, немає GPU-only feature/collision, deterministic counts можна перевірити, виміряного CPU bottleneck немає. Майбутній switch — лише після порівняння high-count/feature/profile.
20. Scale і direction змінюють просторовий extent, coverage і ризик WPO; bounds, перевірені лише за default, можуть спричинити culling допустимих variants.

## Частина 2 — Довідковий контракт System

### Параметри System і User

```text
NS_A07_TriadImpact
System Properties
  Fixed Bounds = enabled
  Min=(-800,-800,-600)
  Max=(800,800,800)
System Spawn
  no added modules
System Update
  System State
```

Bounds є довідковими, а не автоматично ідеальною відповіддю. Менший box проходить, якщо всі допустимі variants виміряно без cull.

| Назва | Type | Default | Використання |
|---|---|---|---|
| `User.EffectColor` | Linear Color | `(1,.2,.03,1)` | Initialize color в усіх emitters |
| `User.Intensity` | Float | `1` | Dynamic0 Core/B |
| `User.Scale` | Float | `1` | sprite size/radius, mesh scale, ribbon width |
| `User.Direction` | Vector | `(1,0,0)` | normalized axis руху |

### `A07_Sprite` — точний повний stack

```text
Emitter Properties: CPUSim; Local Space False; Determinism True; Random Seed 7011
Emitter Spawn
  no added modules
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

Налаштування:

- Emitter State Self/Complete/Once/Fixed `1.1 s`;
- burst Count `28`, Time `0`;
- lifetime Random `.35–.70`;
- Color=`User.EffectColor`; Sprite Size `(6,36)×User.Scale`; rotation 0;
- Shape Sphere radius `10×User.Scale`;
- cone axis Normalize(User.Direction), angle `35°`, speed Random `450–750`;
- Dynamic0 `(0,.1,User.Intensity,0)`;
- Gravity `(0,0,-700)`, Drag `1.3`, default settings solver;
- keys alpha `(0,0),(.03,1),(.65,1),(1,0)`;
- size X `.5→1→.15`, Y `.7→1→.05`.

Sprite Renderer:

```text
Material=MI_VFX_Sprite_Production
Alignment=Velocity Aligned
Facing Mode=Face Camera
Pivot=(.5,.5)
Sort Mode=None
Sub Image Size=(1,1)
Position=Particles.Position
Color=Particles.Color
Velocity=Particles.Velocity
Sprite Rotation=Particles.SpriteRotation
Sprite Size=Particles.SpriteSize
Sprite Facing=Particles.SpriteFacing
Sprite Alignment=Particles.SpriteAlignment
Sub Image Index=Particles.SubImageIndex
Dynamic Material=Particles.DynamicMaterialParameter
Camera Offset=Particles.CameraOffset
UVScale=Particles.UVScale
Material Random=Particles.MaterialRandom
Custom Sorting=Particles.NormalizedAge
Normalized Age=Particles.NormalizedAge
```

### `A07_Mesh` — точний повний stack

```text
Emitter Properties: CPUSim; Local Space False; Determinism True; Seed 7012
Emitter Spawn: no added modules
Emitter Update
  Emitter State
  Spawn Burst Instantaneous
Particle Spawn
  Initialize Particle
  Shape Location
  Add Velocity in Cone
  Initial Mesh Orientation
  Add Rotational Velocity
  Dynamic Material Parameters
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

Налаштування:

- Self/Complete/Once/Fixed `1.8 s`; burst `10 @ 0`;
- lifetime `1–1.5`; Color=User; scale Random Uniform `.35–.70×User.Scale`;
- sphere radius `8×Scale`; cone D `45°`, speed `250–450`;
- initial rotation ±180°; angular velocity ±200°/s у Simulation space;
- Dynamic0 `(0,0,User.Intensity,0)`;
- gravity `-800 Z`, drag `.5`, solver;
- крива mesh scale `.5 at 0 → 1 at .1 → 1 at .8 → .25 at 1`;
- alpha `1 до .8 →0 у 1`.

Mesh Renderer:

```text
Particle Mesh=SM_VFX_Debris_B
Override slot0=MI_VFX_Mesh_Production
Facing Mode=Default
Sort Mode=None
Position=Particles.Position
Color=Particles.Color
Velocity=Particles.Velocity
Mesh Orientation=Particles.MeshOrientation
Scale=Particles.Scale
Dynamic Material=Particles.DynamicMaterialParameter
Material Random=Particles.MaterialRandom
Custom Sorting=Particles.NormalizedAge
Normalized Age=Particles.NormalizedAge
```

### `A07_Ribbon` — точний повний stack

```text
Emitter Properties: CPUSim; Local Space False; Determinism True; Seed 7013
Emitter Spawn: no added modules
Emitter Update
  Emitter State
  Spawn Rate
Particle Spawn
  Initialize Ribbon
  Add Velocity
  Dynamic Material Parameters
Particle Update
  Particle State
  Drag
  Solve Forces and Velocity
  Scale Ribbon Width
  Scale Color
Render
  Ribbon Renderer
```

Налаштування:

- Self/Complete/Once/Fixed `1.0 s`; Rate `36/s`;
- Lifetime `.7`; Color=User; Width `9×Scale`; Twist 0;
- velocity `Normalize(Direction)×300+(0,0,70)`;
- Dynamic0 `(0,.08,Intensity,0)`; Drag `.15`;
- width `(0,0),(.08,1),(.75,1),(1,0)`;
- alpha `(0,0),(.04,1),(.8,1),(1,0)`.

Ribbon Renderer:

```text
Material=MI_VFX_Ribbon_Production
Facing Mode=Screen
UV0 Tiling Distance=40
UV0 Scale=(1,1)
UV0 Offset=(0,0)
Draw Direction=Back to Front
Tessellation Mode=Automatic
Curve Tension=.25
Position=Particles.Position
Color=Particles.Color
Velocity=Particles.Velocity
Normalized Age=Particles.NormalizedAge
Ribbon Twist=Particles.RibbonTwist
Ribbon Width=Particles.RibbonWidth
Ribbon Facing=Particles.RibbonFacing
Ribbon ID=Particles.RibbonID
Ribbon Link Order=Particles.RibbonLinkOrder
Material Random=Particles.MaterialRandom
Dynamic Material=Particles.DynamicMaterialParameter
```

### Очікувані counts і variants

Оцінки peak: Sprite `28`; Mesh `10`; Ribbon `36×.7≈25`; загалом `≈63`. Три допустимі variants:

1. default orange, intensity1, scale1, +X;
2. cyan, intensity1.5, scale.75, +Y;
3. violet, intensity2, scale2, normalized `(-1,1,.2)`.

Усі controls мають впливати на всі три emitters; точна естетика може відрізнятися.

### Інтерпретація практичної rubric

- Architecture 10: усі groups/order правильні, comments/names зрозумілі, warnings відсутні.
- Sprite/Mesh/Ribbon по 12: 4 simulation, 4 renderer/material/bindings, 2 visual acceptance, 2 evidence.
- User 8: по 2 за кожний control в усіх emitters.
- Determinism/count/bounds 6: по 2 за кожний компонент.

## Частина 3 — Ключ несправностей

| Seed | Першопричина | Правильне виправлення | Неприпустиме маскування |
|---:|---|---|---|
| 1 | Gravity після solver | перемістити Gravity вище solver | змінити initial velocity |
| 2 | Mesh Local Space true | задати false | зупинити рух actor |
| 3 | Хибний Sprite Color Binding | прив’язати `Particles.Color` і перевірити material | hardcode material tint |
| 4 | Хибний Ribbon LinkOrder | прив’язати `Particles.RibbonLinkOrder` | max tessellation/збільшити width |

Regression: default і один non-default User variant, emitter у Solo плюс повний System.

Довідка з performance:

- Scale 2 не змінює counts, але збільшує screen coverage sprite/ribbon і size/bounds mesh.
- Обґрунтована optimization має зберігати brief і розкривати змінену variable.
- Універсальні мілісекунди не є частиною ключа.

## Частина 4 — Ключ самоперевірки

Мінімально прийнятна документація:

```text
System
├─ A07_Sprite: Burst → Initialize/Shape/Velocity/Dynamic → State/Forces/Solve/Curves → Sprite
├─ A07_Mesh: Burst → Initialize/Shape/Velocity/Orientation/Dynamic → State/Forces/Solve/Orientation/Scale → Mesh
└─ A07_Ribbon: Rate → InitializeRibbon/Velocity/Dynamic → State/Drag/Solve/Width/Color → Ribbon
```

Кожний trace має називати birth writer, update readers/writers, renderer bindings і death за lifetime. Обґрунтування CPU має містити умову майбутнього switch, наприклад профільоване high-count workload або потребу в GPU-compatible feature, після чого у 08.01 перевіряються bounds/collision.
