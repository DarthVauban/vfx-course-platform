# Повні рішення — L11.03 Character aura / transformation

Ці рішення призначені для перевірки **після** власної спроби. Вони показують один production-valid шлях, а не єдиний можливий art direction. У portfolio piece використовуйте власні lawful references, meshes, textures, materials, timing і чесний authorship record.

## EX-L11-03-A

**Повне рішення: `Ironleaf Ward`.**

### 1. Brief і відмінність від guided piece

`Ironleaf Ward` — original defensive transformation з verbs `unfold → brace → hover → fold`:

- activation `.75 s`: чотири широкі bronze-leaf plates розкриваються з torso sockets і фіксують ground square/diamond;
- loop: sparse vertical vein sparks і дві повільні leaf plates біля shoulders;
- deactivation `.6 s`: plates складаються до spine, veins гаснуть згори вниз;
- palette: dark bronze base, warm green edge і один pale-gold contact accent;
- grayscale identity: широкі angular plates і vertical motion замість круглих glass petals/orbits;
- ігровий задум: defense state читається з 3–12 m без закриття feet, weapon або hostile telegraph.

Добірка дозволених референсів містить botanical leaf folding, hammered-metal edges і stage-light silhouettes. Для кожного item записані source/creator/date/principle; жодного game screenshot, frame trace або extracted asset.

### 2. Assets і parameter contract

Власні assets:

- `SM_VFX_Ironleaf_Plate_A/B`: low-poly tapered plates із pivot біля stem;
- `T_VFX_Ironleaf_Mask`: R edge erosion, G veins, B breakup, A soft body;
- `M_P11_Ironleaf_Plate`, `MI_P11_Ironleaf_H/M/L`;
- `NS_P11_Ironleaf_Activation`, `NS_P11_Ironleaf_Loop`, `NS_P11_Ironleaf_Deactivation`.

Збережено contract guided project:

```text
User.PrimaryColor
User.SecondaryColor
User.Scale
User.Intensity
User.StateAlpha
User.CharacterRadius
User.TeamIndex
```

Character MID використовує `AuraAmount`, `AuraColor`, `AuraEdgeWidth`. `BP_P11_AuraController` не змінюється за state semantics; profile assets/data обираються до activation.

### 3. Niagara stacks

`NS_P11_Ironleaf_Activation`:

```text
PlateBurst: Burst 4 → Initialize Mesh → Initial Mesh Orientation
          → Scale Mesh Size/Color → Mesh Renderer
VeinRise:  Burst 14 → Shape Location (cylinder shell) → Add Velocity +Z
          → Drag → Solve Forces and Velocity → Scale Color/Size → Sprite
GroundLock: Burst 1 → Initialize → Scale Mesh Size/Color → Mesh diamond
```

Plate lifetime `.75 s`, start scale `.15`, end `1`; positions походять із documented torso/root offsets. `GroundLock` ніколи не перевищує `User.CharacterRadius`.

`NS_P11_Ironleaf_Loop`:

```text
GroundDiamond: persistent Burst 1 → pulse Dynamic Material Parameter
ShoulderPlates: Burst 2, persistent/local → slow orientation/pivot motion
VeinSparks: Spawn Rate 4/s → cylinder shell → +Z → Drag/Solve → Sprite
```

`NS_P11_Ironleaf_Deactivation`:

```text
FoldPlates: Burst 4 → initialize at recorded ring offsets
          → attraction toward spine/root → orientation/scale inward → Mesh
VeinFalloff: Burst 8 → -Z velocity → Drag/Solve → Scale Color
GroundFold: Burst 1 → scale diamond `1→0`
```

Усі loops мають explicit lifecycle; completion restores MID baseline. Exact socket and renderer binding labels **Потребує ручної перевірки в Unreal Engine 5.8.**

### 4. H/M/L

| Cue | High | Medium | Low |
|---|---|---|---|
| activation plates | 4 + 14 veins | 4 + 8 veins | 2 crossed silhouettes + lock |
| loop identity | ground+2 plates+4/s veins | ground+2 plates+2/s | ground+MID edge |
| deactivation | 4 plates+8 veins | 4 plates+4 veins | fold silhouette+edge |
| material | full edge/breakup | reduced feature switches | opaque/masked minimal accent |
| state timing | same | same | same |

### 5. Verification і submission

Перевірки:

1. grayscale показує angular/vertical identity;
2. три повні cycles і десять rapid cancel/restarts не лишають components/MID residue;
3. два actors зберігають різні team colors;
4. slope/movement/attack зберігають ground і shoulder alignment;
5. 1/4/8 actors і чотири simultaneous activations профільовано за fixed target conditions;
6. H/M/L зберігають activation, active state і deactivation.

Submission містить reference principles, timing/state map, original asset sheets, material graphs, усі Niagara stacks, Blueprint contract, показники продуктивності до й після, tiers, authorship і limitations. Приклад score дійсний лише за наявності evidence: `86/100`, кожна category вище floor.

## EX-L11-03-B

**Повне рішення: cancellation, isolation і performance remediation.**

### 1. Matrix відтворення

| Weakness | Відтворення | Root cause | Evidence до виправлення |
|---|---|---|---|
| orphan loop | stop на 60%, restart до завершення old timer | old delayed callback не має run identity | два active Loop components |
| shared color | activate actor B після actor A | один shared MID/MPC path | actor A змінюється на color B |
| silhouette occlusion | attack протягом High loop | broad translucent shell + dense chest motes | weapon/torso втрачені у gameplay |
| High overdraw | 8 actors, bright background | full-screen alpha coverage і long mote life | Shader Complexity/GPU layer spike |

Фіксуються build, hardware, resolution, profile, route, duration і warmed state.

### 2. Виправлення root cause

Cancellation:

```text
StartAura:
  GenerationId += 1
  LocalId = GenerationId
  Reset transition components
  Set all parameters
  Activate Activation
  on completion:
    if LocalId != GenerationId or State != Activating: return
    enter Looping once

StopAura:
  GenerationId += 1
  stop Activation/Loop
  start Deactivation from current visual alpha
  restore baseline on valid completion
```

Isolation:

- створити/зберегти MID array на кожному actor;
- вилучити actor color із global MPC path;
- установити кожен Niagara/MID parameter до `Activate`;
- actor A і B виконують alternating activation десять разів.

Readability:

- вилучити torso-wide translucent shell;
- залишити на 20–30% більше negative space біля hands/weapon/face;
- перемістити orbit radius назовні, але скоротити lifetime;
- тримати ground halo тонким і нижче ankles;
- перевірити desaturated gameplay capture.

Performance:

- скоротити High orbit lifetime `1.4→.9 s` і rate `8→6/s` лише після isolation;
- замінити repeated ground ring Rate одним persistent particle;
- зменшити alpha coverage/soft edge до зменшення state cue;
- вимкнути nonessential secondary edge feature для Medium/Low;
- перерахувати й перевірити bounds.

Exact Effect Type/scalability options and component reset pins **Потребує ручної перевірки в Unreal Engine 5.8.**

### 3. Identical before/after evidence

Обов’язкова таблиця:

| Test | До | Після | Cue збережено? |
|---|---|---|---|
| cancel на 25/60/95% | orphan count і capture | zero orphan/stale state | так |
| A/B color isolation | shared-color capture | independent colors | так |
| attack readability | silhouette mask/capture | weapon/torso visible | так |
| 1/4/8 actors | target counters і range | measured improvement | так |
| H/M/L | cue checklist | activation/loop/deactivation pass | так |

Не замінюйте numeric evidence словом «optimized». Повідомляйте лише captured counters/timings із declared target.

### 4. Rubric remediation

- зберегти failed submission і initial rubric;
- повторно оцінити `State timing/readability`, `Blueprint lifecycle/reuse` і `Performance/H/M/L`;
- додати new state log, gameplay captures і profiler evidence;
- якщо будь-яка category лишається нижче floor, вправа не завершена навіть за overall arithmetic понад 80;
- записати remaining limitation, наприклад Low halo втрачає subtle material detail на extreme distance.

### 5. Критерій приймання

Remediation пройдено, коли десять rapid sequences утворюють рівно один valid state path, два actors ніколи не share data, weapon/feet/hostile cue лишаються видимими, tests 1/4/8 виконують declared target, усі три tiers зберігають state identity, а умови до й після однакові й disclosed.
