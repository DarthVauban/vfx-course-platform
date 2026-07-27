# Повні рішення — L11.04 Character ultimate / boss ability

Переглядайте рішення **після** самостійної спроби. Це один перевірюваний production-style шлях, а не шаблон для копіювання art direction. У власній portfolio piece використовуйте оригінальні lawful references, assets, timing і чесний authorship record.

## EX-L11-04-A

**Повне рішення: `Sunken Compass`.**

### 1. Creative brief і gameplay contract

`Sunken Compass` — directional player ultimate з формою сектора:

- range `900 cm`, half-angle `35°` як starting gameplay contract;
- `Telegraph 1.2 s`: wedge outline, три inward compass ticks, видимий safe space поза сектором;
- `Charge .65 s`: дві arc needles сходяться вздовж aim direction;
- `Execute .2 s`: вузький forward compression;
- `Impact .35 s`: низька fan-shaped shock front до exact range;
- `Residue 1.4 s`: тьмяні directional grooves без active-hazard pulse;
- grayscale identity: wedge/needle/forward fan, а не кругла crown/radial ring.

Range, angle, direction і phase durations надходять із gameplay data. Ability не змінює damage/collision. Reference board містить lawful nautical compass mechanics, sand ripple photography і stage-light wedges; жодного copied game glyph або proprietary asset.

### 2. Assets і data schema

Власні assets:

- `SM_VFX_WedgeBoundary_Unit`: unit wedge із documented `100 cm` authored range;
- `SM_VFX_CompassNeedle_A/B`;
- `T_VFX_Compass_Mask`: R boundary, G ticks, B breakup, A soft fade;
- `M_P11_Compass_Master`, `MI_P11_Compass_H/M/L`;
- п’ять `NS_P11_Compass_*` systems.

Contract:

```text
User.RangeCm
User.HalfAngleDeg
User.AbilityDirection
User.SurfaceNormal
User.Phase01
User.PrimaryColor
User.SecondaryColor
User.Intensity
User.TeamIndex
```

Mesh/material отримують range/angle з contract; debug sector лишається видимим у technical capture.

### 3. Phase stacks

`Telegraph`:

```text
WedgeBoundary: Burst 1 persistent → mesh scale/range + material angle mask
CompassTicks: Spawn Rate driven by Phase01 → positions on wedge edges → inward velocity
CenterGuide: Burst 1 → narrow line along AbilityDirection
```

`Charge`:

```text
Needles: Burst 2 → rotate/converge toward direction → Mesh Renderer
SandLift: Spawn Rate 12/s → wedge Shape Location → +Z/Curl/Drag/Solve → Sprite
```

`Execute`:

```text
ForwardCompression: Burst 1 → narrow mesh scale `1→.05` in `.2 s`
DirectionStreaks: Burst 10 → Add Velocity along AbilityDirection
```

`Impact`:

```text
FanShock: Burst 1 → mesh/material expansion `0→RangeCm`
EdgeShards: Burst 24 → spawn across fan end arc → forward/up velocity → Mesh
ContactFlash: Burst 1 → compact sprite at origin, no full-screen flash
```

`Residue`:

```text
GrooveMesh: Burst 1 → finite `.9–1.4 s` fade
DustSettling: Burst 10 → low forward velocity → Drag/Gravity/Solve
```

Exact material angle math, orientation bindings і User setters **Потребує ручної перевірки в Unreal Engine 5.8.**

### 4. H/M/L і profiling

| Cue | High | Medium | Low |
|---|---|---|---|
| wedge/range/direction | full | full | full |
| countdown | 3 tick groups | 2 groups | one accelerating edge cue |
| charge/execute | needles+sand+compression | needles+compression | compression |
| impact | fan+24 shards+flash | fan+14 shards+flash | fan+compact flash |
| residue | grooves+dust | grooves+less dust | short grooves |
| data/timing | identical | identical | identical |

Вимірювання: baseline cast, gameplay route, один cast + вісім combat effects + три residues, phase isolation, H/M/L. У звіті вказані actual captured values з target build; жодного твердження «console optimized» без target evidence.

### 5. Критерії приймання й presentation

- debug wedge/range/angle збігаються на трьох input profiles;
- aim direction змінюється без hand-authored reposition;
- cancel до commit і post-commit rule працюють;
- Low зберігає sector, countdown, commit, contact і end-state;
- gameplay/neutral captures, source/authorship log, own assets, materials, Niagara stacks, Blueprint contract, profiling before/after і limitations завершені;
- self-score `≥80/100`, кожна категорія вище floor.

## EX-L11-04-B

**Повне рішення: hazard/readability/performance remediation.**

### 1. Matrix відтворення

| Weakness | Як відтворити | Root cause | Evidence до виправлення |
|---|---|---|---|
| boundary mismatch | debug radius `450 cm`, top view | authored diameter mesh прийнято за radius | VFX edge майже `900 cm`: помилка diameter rule |
| late contact | порівняти gameplay event/frame capture | phase timer запускає Impact після event | shock front з’являється на кілька frames пізно |
| exit occlusion | gameplay camera з player біля edge | center veil + opaque column закривають route | player і safe direction зникають |
| overlap bottleneck | stress schedule, phase isolation | overlap translucent Impact і long Residue | GPU/overdraw peak у contact tail |

У звіті записані exact build, hardware, resolution, profile, spawn schedule й warmed route.

### 2. Виправлення

Boundary parity:

```text
MeshDiameterCm = 200
DesiredDiameterCm = 2 × User.HazardRadius
UniformScale = DesiredDiameterCm / MeshDiameterCm
```

Перевірка виконується для трьох radii у top і gameplay views; gameplay collision/data не змінюються.

Timing:

- authoritative gameplay commit/hit event викликає `EnterImpact`;
- visual Phase01 лише анімує поточну phase;
- stale timers відхиляються через `CastGenerationId` і expected state;
- frame capture підтверджує contact parity.

Readability:

- center veil opacity/coverage зменшено;
- column став вузьким і коротшим;
- shock front лишається нижче ключового character silhouette;
- safe/exit direction перевірено у desaturated view із combat stack.

Performance:

- Impact і Residue профільовано окремо;
- один великий redundant translucent layer вилучено;
- shock front lifetime скорочено без зміни contact;
- residue spark `Rate×Lifetime` зменшено після вимірювання;
- nonessential distortion вимкнено в Medium/Low;
- bounds перевірено після змін.

Exact profiler availability, typed setters, state/timer labels і Effect Type options **Потребує ручної перевірки в Unreal Engine 5.8.**

### 3. Identical before/after package

| Evidence | Незмінна умова | Критерій проходження |
|---|---|---|
| boundary/debug overlay | той самий radius, transform, camera | edges відповідають documented tolerance |
| contact frames | той самий gameplay event і playback rate | visible late hit відсутній |
| exit readability | той самий combat stack/exposure | player і safe direction видимі |
| phase profiler | ті самі target/build/duration | measured bottleneck зменшено |
| H/M/L comparison | ті самі cast/data/camera | усі critical cues збережені |

Звіт містить actual measured counters/ranges, а не вигадані universal budgets або слово «optimized» без чисел.

### 4. Rubric remediation

- initial submission і rubric зберігаються;
- повторно оцінюються `Telegraph/timing/readability`, `Blueprint integration` та `Performance/H/M/L`;
- для кожної слабкої категорії додається новий artifact: radius overlay, contact capture, state log або profiler comparison;
- сильний presentation не компенсує категорію нижче floor;
- remaining limitation записується чесно, наприклад residue менше помітне на дуже світлому ground material.

### 5. Критерій приймання

Ремедіація завершена, коли radius/timing відповідають authoritative gameplay data, exit route видимий, stress test виконує declared target, H/M/L не втрачають critical cues, before/after умови ідентичні, а всі слабкі rubric categories досягли floor.
