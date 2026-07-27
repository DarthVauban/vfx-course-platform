# Рішення вправ — 07.07 Ribbon trail construction

Version-sensitive labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L07-07-A

### Обґрунтування

Rate 40 дискретизує балістичну path зі швидкістю 450–485 cm/s приблизно кожні 11–12 cm. Lifetime .8 дає близько 32 живих points і компактний trail. Криві Width/alpha звужують його; Automatic tessellation згладжує проміжки між реальними samples.

### Повний stack

```text
System Properties
System Spawn: empty
System Update: System State
Emitter Properties: CPUSim; Local False; Determinism True; Seed 1707
Emitter Spawn: empty
Emitter Update: Emitter State; Spawn Rate
Particle Spawn
  Initialize Ribbon
  Add Velocity
  Dynamic Material Parameters
Particle Update
  Particle State
  Gravity Force
  Drag
  Solve Forces and Velocity
  Scale Ribbon Width
  Scale Color
Render
  Ribbon Renderer
```

### Точні параметри

Self/Complete/Once/Fixed `2 s`; Rate `40/s`; Lifetime `.8`; Position zero; Velocity `(450,0,180)`; Color `(1,.25,.02,1)`; Width `9`; Twist `0`; Dynamic0 `(0,.1,1,0)`; Gravity `(0,0,-500)`; Drag `.1`.

Крива Width `(0,0),(.08,1),(.72,1),(1,0)`; alpha `(0,0),(.04,1),(.82,1),(1,0)`.

### Renderer і bindings

Material `MI_VFX_Ribbon_Production`; Screen; UV0 Tiling Distance `40`; UV scale `(1,1)`; offset zero; Back to Front; Automatic tessellation; Curve Tension `.25`.

Bindings: Position, Color, Velocity, NormalizedAge, RibbonTwist, RibbonWidth, RibbonFacing, RibbonID, RibbonLinkOrder, MaterialRandom і DynamicMaterialParameter до відповідних `Particles.*`.

### Перевірка

Оцінка point spacing `|V0|/40≈12.1 cm`; живі points `40×.8≈32`; order не перевертається, коли path проходить вершину; обидва кінці звужуються; texture повторюється приблизно кожні 40 cm. Один раз вимкніть Automatic, щоб довести достатність фактичної щільності points.

### Альтернативи / неправильні рішення / performance

Rate `50` допустимий, якщо задокументований, але змінює workload. Неправильно: burst усіх points одночасно; lifetime дорівнює age emitter; Initialize Particle; LinkOrder прив’язано до NormalizedAge; max tessellation 16 або collision. За ~32 points simulation мала; ribbon tessellation/width/overdraw потребують інспекції render.

## EX-L07-07-B

### Обґрунтування

Окремі emitters дають незалежні default Ribbon IDs/datasets без events або custom ID generation. Дзеркальний velocity Y створює читабельний парний мотив.

### Повні stacks дублікатів

Обидва `Ribbon_Orange` і `Ribbon_Cyan` використовують точний stack EX-L07-07-A. Групи System спільні.

| Налаштування | Orange | Cyan |
|---|---:|---:|
| seed | `1710` | `1711` |
| spawn position | `(0,-20,0)` | `(0,20,0)` |
| velocity | `(320,40,100)` | `(320,-40,100)` |
| color | `(1,.25,.03,1)` | `(.03,.65,1,1)` |
| rate | `30/s` | `30/s` |
| lifetime | `1.0 s` | `1.0 s` |
| width | `8` | `8` |
| gravity | `-240 Z` | `-240 Z` |
| drag | `.2` | `.2` |

Обидва renderers: Screen, tiling `50`, Automatic, однакові повні bindings до власного particle dataset.

### Перевірка

У Solo кожного emitter є один connected ribbon. Увімкніть обидва: дві strips лишаються незалежними, дзеркаляться за Y, мають спільні length/taper і ніколи не створюють bridge. Peak living points ≈30 для кожного. Bounds охоплюють обидва offsets і path.

### Альтернативи / неправильні рішення / performance

Один emitter із явним RibbonID може створити дві strips, але потребує правильного authoring ID/order, не потрібного для цього foundation solution. Неправильно: два Ribbon Renderers на одному dataset; ідентичні spawn location/direction, що спричиняють z-fighting; спільний custom ID; різні lifetimes, приховані як style. Два emitters подвоюють setup point simulation/render; загальна кількість живих ≈60 і має бути записана.
