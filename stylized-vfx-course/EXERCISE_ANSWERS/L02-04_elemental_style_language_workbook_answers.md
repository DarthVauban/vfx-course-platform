# Рішення до уроку 02.04

Відкривай цей файл лише після власного 3×3 workbook, самостійної blind/self-review процедури й трьох hints. Model solution використовує нейтральний target-centered burst і не відтворює конкретні proprietary effects.

## EX-L02-04-A

### 1. Fixed gameplay specification

```text
Function: підтвердити невеликий target-centered elemental hit.
Duration: 1.0 с.
Contact window: 0.40–0.45 с.
Camera: nominal third-person, target у центрі panel.
Bounding envelope: 70% width × 55% height panel.
Protected area: target torso має лишатися видимим після accent.
Required layers: 1 primary, 1–3 secondary groups, 1 accent, 1 residue.
```

### 2. Nine grammar cards

| Element | Primary / edge | Motion / timing | Value / residue | 3 invariants | 2 avoid |
|---|---|---|---|---|---|
| Fire | Three asymmetric tapered tongues; crisp inner/broken outer edge | Ignition 0.08, contact flare 0.42, split/rise 0.45–0.72 | Small pale core, mid hot body; embers/smoke to 1.0 | taper; irregular pulse; buoyant residue | perfect symmetry; smooth liquid sheet |
| Water | Curved concave sheet with rounded crest | Compress 0.12–0.28, sweep/contact 0.42, splash 0.45–0.70, droplets | Bright crest, mid body; droplets/mist | continuous curve; inertia; rounded breakup | rigid hold; zigzag teleport |
| Ice | Five faceted plates with polygon gaps | Grow 0.10–0.30, hold 0.30–0.41, fracture 0.43–0.53, shards settle | Bright facet edges, darker cores; frost trace | straight facets; hold; fracture | elastic ribbon; flame flicker |
| Electricity | One thick broken branch plus three thin forks | Silent/charge 0–0.20, pulse 0.41–0.46, echoes 0.50/0.58 | Near-white branch, dark support; tiny sparks only | discontinuity; branching; short pulses | broad stable mass; long smoke |
| Wind | Open crescent with large center gap and two S-wisps | Suction 0.08–0.24, sweep/contact 0.42, curl 0.48–0.66, wisps | Medium-light leading edge; dust/motes | open space; sweep; delayed trail | closed filled blob; rigid shard hold |
| Earth | Low blunt trapezoids and broken ground crescent | Compress 0.05–0.28, impulse 0.42, chunks rise/fall 0.45–0.78 | Dense mid/dark mass, small bright crack; dust/cracks | low-wide mass; blunt impulse; gravity settle | weightless drift; thin jitter |
| Nature | Branching three-lobe bloom around open torso | Sprout 0.10–0.30, unfold/contact 0.42, bloom 0.52–0.64, seeds drift | Bright tips, lower body; petals/spores | branching growth; bloom; delayed drift | pure wind swirl; rigid fracture |
| Light | Six ordered radial sectors with central void | Align 0.05–0.28, reveal/contact 0.42, short hold 0.42–0.58, clean fade | Local white edges, mid separators; faint ordered points | alignment; order; clean fade | noisy rim; full-screen white fill |
| Void | Inward broken rim around compressed dark core | Pull 0.08–0.38, collapse pause 0.40–0.46, release/echo 0.50–0.74 | Dark core with controlled rim; delayed fragments/distortion | inward pull; collapse gap; delayed echo | purple fire; featureless black disk |

### 3. Five-frame motion strips

| Element | Preparation | Onset | Contact/peak | Response | Residue |
|---|---|---|---|---|---|
| Fire | Three small points gather low | Tongues ignite | Forked flare | Tips split and rise | Sparse embers/smoke |
| Water | Sheet compresses opposite travel | Curved sweep starts | Crest reaches target | Sheet opens into spray | Droplets recede/downfall |
| Ice | Facets trace inward | Plates grow | Locked cluster | Sudden fracture | Shards/frost settle |
| Electricity | Few nodes appear | Branch path hints | Instant full branch | Two weaker path echoes | Tiny points vanish |
| Wind | Wisps pull inward | Open crescent accelerates | Leading edge crosses target | Crescent overshoots/curls | Trailing dust/motes |
| Earth | Ground compresses | Low blocks push up | Blunt central thud | Chunks rise then fall | Dust and cracks remain |
| Nature | Thin branch sprouts | Lobes unfold | Bloom opens | Secondary branches lag | Seeds/petals drift |
| Light | Points align | Sectors converge | Ordered reveal | Halo expands slightly | Clean afterimage points |
| Void | Rim fragments pull inward | Core compresses | One-frame absence/collapse | Offset echo ring releases | Dark motes/distortion fade |

### 4. Timing signatures

```text
Fire:       0.08 ignite → 0.42 flare → 0.55 split → 0.75 rise → 1.0 embers
Water:      0.12 compress → 0.42 crest → 0.58 splash → 0.80 droplets → 1.0 mist
Ice:        0.10 grow → 0.30 hold → 0.43 fracture → 0.66 shards → 1.0 frost
Electric:   0.18 hint → 0.42 pulse → 0.50 echo → 0.58 echo → 0.72 vanish
Wind:       0.08 suction → 0.42 sweep → 0.58 curl → 0.82 wisps → 1.0 motes
Earth:      0.05 compress → 0.42 thud → 0.58 chunks → 0.78 settle → 1.0 dust
Nature:     0.10 sprout → 0.42 unfold → 0.58 bloom → 0.82 drift → 1.0 seeds
Light:      0.05 align → 0.42 reveal → 0.54 hold → 0.78 fade → 0.92 afterimage
Void:       0.08 pull → 0.42 collapse → 0.46 silence → 0.58 release → 0.82 echo
```

### 5. Value and color plan

| Element | Quiet | Body/support | Peak | Color role |
|---|---:|---:|---:|---|
| Fire | 25 smoke | 58 tongues | 98 core | warm dominant, pale hot accent |
| Water | 28 mist | 52 sheet | 88 crest | cool dominant, near-neutral crest |
| Ice | 24 frost | 48 inner facets | 90 edges | cool-neutral body, pale edges |
| Electricity | 18 support | 42 thin branches | 100 primary branch | hue secondary to value pulse |
| Wind | 24 motes | 46 wisps | 82 leading edge | low-chroma dominant |
| Earth | 26 dust | 50 blocks | 88 crack/contact | dense neutral-warm mass |
| Nature | 26 seeds | 52 branches/lobes | 90 growth tips | green optional, not required |
| Light | 22 separators | 56 sectors | 100 local reveal | controlled pale dominant |
| Void | 12 core | 48 rim/context | 86 displaced edge | dark core + readable rim; purple optional |

### 6. Structural-distance audit

Neutral base: симетричний circular burst, лінійне розширення, один peak, без residue.

| Element | Shape | Edge | Motion | Timing | Space | Residue | Distance |
|---|---:|---:|---:|---:|---:|---:|---:|
| Fire | 1 | 1 | 1 | 1 | 1 | 1 | 6 |
| Water | 1 | 1 | 1 | 1 | 1 | 1 | 6 |
| Ice | 1 | 1 | 1 | 1 | 0 | 1 | 5 |
| Electricity | 1 | 1 | 1 | 1 | 1 | 1 | 6 |
| Wind | 1 | 1 | 1 | 1 | 1 | 1 | 6 |
| Earth | 1 | 1 | 1 | 1 | 1 | 1 | 6 |
| Nature | 1 | 1 | 1 | 1 | 1 | 1 | 6 |
| Light | 1 | 1 | 1 | 1 | 0 | 1 | 5 |
| Void | 1 | 1 | 1 | 1 | 1 | 1 | 6 |

### 7. Initial cross-confusion findings

Самостійна blind silhouette review: labels і color приховано, panels збережено з neutral filenames, порядок перемішано після паузи; optional peer check не є умовою.

| Pair | Initial score | Root cause |
|---|---:|---|
| Fire / Electricity | 1 | Обидва мали forked edges |
| Water / Wind | 1 | Обидва мали S-curve |
| Ice / Earth | 1 | Обидва chunky |
| Wind / Nature | 2 | Nature була лише swirl із small leaves |
| Light / Electricity | 2 | Light rays були надто branch-like |
| Light / Void | 1 | Обидва radial із central core |

### 8. Revisions

#### Wind / Nature

- Wind: збільшено open central lane, primary зроблено single crescent, secondary follows.
- Nature: primary перебудовано в three-branch growth із bloom pause; leaves прибрано з blind copy.
- Timing: wind peak at 0.42, nature bloom peak at 0.58.
- Result: score `0`.

#### Light / Electricity

- Light: sectors рівномірно aligned, continuous clean edges, short hold.
- Electricity: одна discontinuous branch, нерівномірні gaps, подвійні echo pulses.
- Result: score `0`.

#### Ice / Earth

- Ice: вища ordered radial growth і visible hold.
- Earth: нижча wide compression, gravity-driven chunks і dust.
- Result: score `0` після motion preview, `1` у single silhouette.

#### Light / Void

- Light розширюється назовні після alignment.
- Void стискається всередину до відсутнього center, а потім випускає зміщений echo.
- Result: score `0` у motion preview.

Після revisions немає score `2`.

### 9. Результат самостійного blind recognition

У static solid-white review правильно названо 8/9. Ice/Earth спочатку позначено як «crystal/rock pair», але motion strip розділив їх. Це проходить acceptance criteria: 7+ static і всі 9 після motion.

### 10. Camera/background notes

| Element | Failure | Revision |
|---|---|---|
| Fire | Smoke перекриває torso on Near | Зменшити area 25%, змістити up |
| Water | Sheet collapse at 35° | Додати broad crest layer, не лише thin plane |
| Ice | Tiny shards vanish Far | Залишити 3 major facets |
| Electricity | Micro branches alias | One thick primary branch mandatory |
| Wind | Wisps губляться on busy background | Зберегти clear leading crescent |
| Earth | Vertical chunks form wall | Stagger positions, open torso gap |
| Nature | Small petals become noise Far | Replace with two larger delayed lobes |
| Light | Bright background hides sectors | Додати mid-value separators/rim |
| Void | Dark background hides core | Controlled bright/mid rim and warped context |

### 11. `Must keep / Can simplify / Optional`

| Element | Must keep | Can simplify | Optional |
|---|---|---|---|
| Fire | taper + rise + irregular pulse | ember count | smoke |
| Water | curved inertia + splash | droplet count | mist |
| Ice | grow/hold/fracture | shard count | frost dust |
| Electricity | discontinuous primary pulse | micro branches | point sparks |
| Wind | open sweep + delayed trail | wisp count | environmental motes |
| Earth | low impulse + gravity settle | chunk count | long dust |
| Nature | branching growth + bloom | petal count | spores |
| Light | alignment + ordered reveal | ray count | afterimage points |
| Void | inward collapse + echo | rim fragments | distortion residue |

### 12. Block 09 bridge

| Element | Transfer task |
|---|---|
| Fire | Hit spark + melee impact: preserve taper, pulse, rise |
| Water | Projectile/trail: preserve curved inertia and splash |
| Ice | Shockwave: preserve grow/hold/fracture |
| Electricity | Beam/ribbon: preserve discontinuous pulse and branching |
| Wind | Slash/arc: preserve open sweep and trailing air |
| Earth | Ground crack: preserve compression, impulse and settle |
| Nature | Aura/area: preserve branching growth and drift |
| Light | Circle/telegraph/burst: preserve order and clean reveal |
| Void | Spawn/transformation/ultimate: preserve pull, collapse and echo |

### 13. Чому рішення працює

Gameplay function, bounding envelope і contact point однакові. Identity змінюється structural categories, тому comparison чесний. Static silhouettes уже відрізняють більшість elements, а motion/timing/residue завершують identity.

### 14. Допустимі альтернативи

- Fire може спрямовуватися вниз у meteor impact, але late buoyant breakup або ember grammar має зберігатися.
- Water може бути thick wave або thin blade, якщо inertia/splash/recede лишаються.
- Nature може бути fungal/spore або thorn growth без leaf motifs.
- Light може бути asymmetrical для directional attack, якщо ordered alignment лишається.
- Void може використовувати bright negative core на dark scene, якщо inward collapse/echo зберігаються.

### 15. Типові неправильні рішення

- Different icons у центрі одного circle burst.
- Exact color palettes як єдині `invariants`.
- Wind і nature розрізняються leaves.
- Void є opaque black disk без environmental edge.
- Earth має більше particles, але не має weight rhythm.

### 16. Verification

1. Приховати labels і color.
2. Збережи panels з neutral filenames, зроби паузу щонайменше на одну навчальну сесію й перемішай їх перед self-review.
3. Провести static naming.
4. Провести motion naming.
5. Перевірити pair matrix.
6. Swap colors між pairs: identity має лишитися.
7. Перевірити 25% scale.
8. Перевірити four backgrounds.
9. Підтвердити 5+ structural changes для кожного.

### 17. Performance

Workbook не призначає budgets. Він визначає essential information:

- Low profile зберігає `must keep`;
- Medium скорочує optional micro layers;
- High може додати detail після profiling;
- peak-overlap frames і residue accumulation зафіксовані для блока 10.

---

## EX-L02-04-B

### 1. Fixed specification

Archetype: `projectile impact`.

```text
Duration: 1.0 с.
Contact: 0.45 с ±0.05.
Target point: center-right.
Camera/bounding envelope: identical.
Elements: Wind, Nature, Void.
Color: disabled for primary review.
```

### 2. Translation matrix

| Category | Wind | Nature | Void |
|---|---|---|---|
| Shape | Open crescent + two S-wisps | Three branching lobes + central bloom gap | Broken inward rim + compressed empty core |
| Edge | Hard leading, soft trailing | Clean growth tips, organic broken tails | Unstable segmented rim |
| Motion | Suction then fast sweep/curl | Sprout, branch, unfold/bloom | Pull inward, collapse pause, offset release |
| Timing | Fast main sweep, delayed wisps | Slower growth, later bloom peak | Quiet pull, silence, delayed echo |
| Space | Directional open lane | Target-centered outward growth | Target-centered inward depth/occlusion |
| Residue | Dust/motes trailing direction | Seeds/petals drifting outward | Dark motes + echo ring |
| Value | Medium body, bright leading edge | Mid body, bright tips/bloom | Dark core, mid rim, bright displaced accent |

Structural distance між кожною pair = 6/6 categories.

### 3. Phase strips

#### Wind

| Phase | Time |
|---|---|
| Suction anticipation | 0.05–0.20 |
| Fast sweep | 0.18–0.46 |
| Contact | 0.43–0.47 |
| Curl/overshoot | 0.45–0.66 |
| Wisps/motes | 0.55–0.95 |

#### Nature

| Phase | Time |
|---|---|
| Sprout | 0.05–0.24 |
| Branch/unfold | 0.20–0.46 |
| Contact | 0.43–0.47 |
| Bloom peak | 0.52–0.64 |
| Seed/petal drift | 0.60–1.00 |

#### Void

| Phase | Time |
|---|---|
| Inward pull | 0.05–0.39 |
| Collapse/contact | 0.40–0.45 |
| Silence hold | 0.45–0.49 |
| Offset release | 0.49–0.66 |
| Echo/distortion | 0.62–0.94 |

Contact function однакова, але main peak Nature і Void response відкладені по-різному.

### 4. Animatic states

| State | Wind | Nature | Void |
|---|---|---|---|
| 1 Prepare | Wisps drawn inward | Thin branch sprouts | Rim fragments drift inward |
| 2 Onset | Crescent accelerates | Branch divides into lobes | Core gap compresses |
| 3 Contact | Leading edge crosses target | Tips reach target | Rim closes into near-absence |
| 4 Response | Crescent curls past | Bloom opens after contact | Empty pause then offset echo |
| 5 Residue | Directional motes | Seeds/petals drift | Dark fragments and warped rim fade |

### 5. Value plan

```text
Wind:   body 50, leading edge 84, residue 25
Nature: branches 48, growth tips 76, bloom 90, residue 28
Void:   core 10, rim 52, release accent 88, residue 24
```

Hue swap test: призначення green/purple/cyan навмання не змінює interpretation після motion preview.

### 6. Peak-overlap frames

| Element | Interval | Layers |
|---|---|---|
| Wind | 0.44–0.54 | Primary crescent, contact edge, first trailing wisp |
| Nature | 0.53–0.64 | Branch lobes, bloom accent, first seeds |
| Void | 0.49–0.62 | Rim release, echo ring, fragments |

### 7. Camera/readability

#### Wind

- failure: thin crescent edge-on at 35°;
- revision: додати width/secondary depth arc зі збереженням open center.

#### Nature

- failure: small branches become noise at 25%;
- revision: скоротити до трьох major lobes і перенести seeds лише в residue.

#### Void

- failure: dark core disappears on dark background;
- revision: контрольований mid-value rim і малий зміщений bright accent; не заповнювати core фіолетовим.

### 8. Чому це одна gameplay function

У всіх:

- target-centered contact at ~0.45 с;
- similar maximum envelope;
- readable local peak;
- cleanup before 1.0 с;
- same consequence: projectile reached target.

Elemental translation змінює metaphor і response, не gameplay event.

### 9. Чому це не recolor

Кожна version змінює:

1. primary silhouette;
2. edge rhythm;
3. motion path;
4. anticipation;
5. post-contact timing;
6. residue behavior.

Color можна повністю вимкнути.

### 10. Допустимі альтернативи

- Wind contact може бути radial suction release, якщо open-lane/sweep behavior лишається.
- Nature може бути thorn burst із delayed vine recoil.
- Void може release vertical slit замість echo ring.
- Contact може бути 0.40 або 0.50 с, якщо всі три лишаються в tolerance й gameplay sync.

### 11. Типові неправильні рішення

- Один crescent у трьох colors.
- Nature = Wind + leaf sprites.
- Void = Wind + distortion + purple.
- Contact timestamps настільки різні, що gameplay function змінюється.
- Nature стає strongest лише через більшу кількість petals.

### 12. Verification

1. Side-by-side grayscale real-time playback.
2. Solid-white silhouette snapshots at contact.
3. Hue swap.
4. 25% scale.
5. Four backgrounds.
6. Structural-distance audit.
7. Самостійне blind naming без labels після паузи та shuffle; optional peer naming дозволено лише як додатковий evidence.
8. Target visibility at peak.

### 13. Performance

- Wind: long wisps/ribbons — скорочувати secondary length/count.
- Nature: many alpha cards — зберігати three major lobes, скорочувати seeds.
- Void: distortion/overlap — зберігати inward collapse and echo, спрощувати rim fragments.
- Low profiles повинні зберігати causal sequence; не можна перетворити всі three versions на identical single burst.
