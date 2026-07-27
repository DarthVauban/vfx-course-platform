# 1. Назва

## Урок 02.04 — Система shape і motion language для дев’яти стихій

# 2. Результат уроку

Після уроку ти зможеш:

- описати element не палітрою, а системою shape, edge, motion, timing, value, residue і spatial behavior;
- створити впізнавані grayscale silhouettes для fire, water, ice, electricity, wind, earth, nature, light і darkness/void;
- задати concrete constraints, які захищають кожну language від випадкового змішування;
- переносити один gameplay archetype між стихіями без простого recolor;
- відокремити `elemental invariants` від параметрів, які можна варіювати;
- побудувати cross-confusion matrix і знайти пари, що надто схожі;
- створити дев’ять design cards і три короткі animatics;
- пояснити, чому зміна hue без зміни design grammar не є новою variation.

Ключовий результат — `Elemental Style Language Workbook`: дев’ять самостійних design systems, які пізніше повторюються в окремих практичних archetype lessons блока 09.

# 3. Орієнтовний час

**6 годин: 1 година теорії та 5 годин практики.**

| Частина | Час |
|---|---:|
| Elemental grammar і дев’ять design systems | 1 год теорії |
| Controlled experiments | 20 хв практики |
| Guided workbook, який переходить у EX-L02-04-A | 1 год 25 хв практики |
| EX-L02-04-A, revisions і self-check | 45 хв практики |
| `BLOCK_ASSESSMENT.md` | 2 год 30 хв практики |

`EX-L02-04-B` є stretch-вправою для поглиблення: виконуй її замість додаткової voluntary iteration або поза базовим 456-годинним бюджетом. Вона не є умовою допуску до block assessment. `EX-L02-04-A` не дублює guided practice: це завершення й самостійна blind validation того самого workbook.

# 4. Prerequisites

- Завершено `02.01`, `02.02` і `02.03`.
- Є власні layer breakdown, composition board і timing sheet.
- Студент уміє створити abstract animatic із primitive shapes.
- Зрозумілі primary/secondary/accent/residue, negative space, value hierarchy, normalized time й staggered timing.

# 5. Нові терміни

| Термін | Пояснення |
|---|---|
| **Elemental grammar** | Узгоджений набір shape, edge, motion, timing, value, spatial і residue rules |
| **Invariant** | Ознака, що має зберігатися в різних effects однієї стихії |
| **Variable** | Ознака, яку можна змінювати, не втрачаючи identity |
| **Motion signature** | Характерний path, acceleration, direction change і secondary response |
| **Temporal signature** | Характерний rhythm anticipation, peak, holds, pulses і dissipation |
| **Edge rhythm** | Повторюваний pattern hard/soft, continuous/broken, regular/irregular edges |
| **Material cue** | Shape/motion clue, що нагадує burning, flowing, fracturing, growing тощо |
| **Non-color identity** | Впізнаваність у white silhouette або grayscale |
| **Elemental translation** | Перепроєктування archetype під іншу grammar зі збереженням ігрової функції |
| **Recolor** | Зміна palette без зміни design logic |
| **Cross-confusion** | Ситуація, коли дві elemental languages виглядають однаково без labels/color |
| **Constraint pair** | Правило «використовуй X, уникай Y», яке утримує language |

# 6. Навіщо ця тема потрібна VFX-фахівцю

Elemental variation часто провалюється так:

```text
один projectile + синій = water
той самий projectile + червоний = fire
той самий projectile + фіолетовий = void
```

Гравець бачить не три systems, а один effect із palette swaps. Це послаблює gameplay feedback, worldbuilding і portfolio quality.

Production-friendly elemental system потрібна для:

- consistency між impact, projectile, aura, telegraph і ultimate;
- швидкого art direction review;
- повторного використання rules без повторного використання exact assets;
- читабельності у grayscale, на різних environments і в rapid combat;
- усвідомленої побудови portfolio kit, а не набору випадкових effects.

# 7. Теорія простими словами

Element — це не колір. Element — це відповідь на сім питань:

1. **Shape:** яку форму energy любить утворювати?
2. **Edge:** де вона hard, soft, broken або continuous?
3. **Motion:** як вона починає, змінює напрямок і закінчує рух?
4. **Timing:** чи вона flicker, flow, hold, fracture, pulse або collapse?
5. **Space:** вона rising, grounded, orbiting, inward, camera-facing чи volumetric?
6. **Residue:** що залишається після main action?
7. **Value/color:** де core, accent і quiet material?

Якщо змінився лише пункт 7, це recolor. Для справжньої elemental translation треба змінити щонайменше shape, motion, timing і residue; часто також edge та spatial behavior.

# 8. Детальні технічні пояснення

## 8.1. Design vector

Записуй language як:

```text
E = [Shape, Edge, Motion, Timing, Space, Value, Color, Residue]
```

Два effects належать до однієї family, якщо зберігають більшість invariants, навіть коли archetype і scale різні.

Приклад fire invariants:

- tapered upward-splitting shapes;
- unstable asymmetric edges;
- fast ignition і irregular pulses;
- buoyant late motion;
- ember/smoke residue.

Fire projectile і fire aura не мають бути однаковою mesh. Вони мають говорити однією grammar.

## 8.2. Recolor test

Variation не пройшла, якщо після:

1. переведення в grayscale;
2. заміни всього effect на solid white;
3. приховування labels;
4. вирівнювання scale;

два elements залишаються практично однаковими за silhouette, motion path, peak rhythm і residue.

Мінімальна elemental translation змінює:

- одне правило основної форми;
- одну edge rule;
- одну motion path/acceleration rule;
- одну temporal rule;
- одну residue rule.

## 8.3. Fire language

| Система | Конкретні обмеження |
|---|---|
| Primary shapes | Tapered tongues, wedges, split teardrops; major axis переважно upward або forward-up |
| Secondary shapes | Small ember points, forked tips, broken hot fragments |
| Negative space | Asymmetric gaps між tongues; не замикати все в smooth ring |
| Edge language | Crisp/hot leading core, eroded/broken trailing edge; irregular silhouette |
| Motion | Rapid ignition; outward impulse переходить у buoyant upward acceleration; small lateral flicker |
| Timing | Start 0–0.08; irregular peaks у 0.15–0.45; fastest shapes die by 0.55; embers/smoke 0.45–1.0 |
| Value/color | Small pale/yellow-hot core; dominant orange/red family; low-value smoke support; не робити весь volume однаково emissive |
| Residue | Rising embers, thinning smoke, char-like low-value fragments where relevant |
| Avoid | Smooth continuous liquid ribbons, perfect bilateral symmetry, long stable hold |
| Camera/readability | Upward taper має читатися на 25%; smoke не закриває target |
| Cost risk | Overlapping translucent tongues, glow/smoke area, long ember lifetime |

Fire temporal signature: **ignite → split/flicker → rise → fragment**.

## 8.4. Water language

| Система | Конкретні обмеження |
|---|---|
| Primary shapes | Rounded arcs, ribbons, droplets, concave sheets; continuous flow direction |
| Secondary shapes | Beads, spray fans, small bubbles/mist only where scale supports |
| Negative space | Smooth internal channels і open curves; avoid dense solid blob |
| Edge language | Clean leading crest, softer trailing sheet, rounded breakup |
| Motion | Inertial sweep, compression before release, follow-through, curl and splash; direction changes are smooth |
| Timing | Gather 0–0.18; coherent sweep 0.15–0.52; splash separation 0.45–0.72; droplets/mist 0.60–1.0 |
| Value/color | Bright thin crest/edge, mid-value body, darker internal thickness; color family may vary |
| Residue | Droplets, mist, short wet-looking low layer or receding ribbon; avoid fire-like upward embers |
| Avoid | Random angular teleport, rigid shard hold, repeated sharp zigzag |
| Camera/readability | Ribbon path must not collapse edge-on; preserve one broad macro arc |
| Cost risk | Broad translucent sheets, layered refraction/distortion, long ribbons |

Water signature: **gather → sweep/curl → splash → droplets/recede**.

## 8.5. Ice language

| Система | Конкретні обмеження |
|---|---|
| Primary shapes | Faceted wedges, crystalline clusters, straight shards, angular radial plates |
| Secondary shapes | Smaller shards, frost lines, sparse granular snow accents |
| Negative space | Hard polygonal gaps; controlled symmetry or radial order before fracture |
| Edge language | Crisp straight segments, sharp corners, little soft wobble |
| Motion | Growth/lock along straight axes; short hold; sudden fracture; ballistic shards |
| Timing | Crystallize 0–0.28; hold 0.25–0.42; fracture peak 0.40–0.52; shards 0.48–0.85; fine frost 0.70–1.0 |
| Value/color | Bright edges/tips, mid/dark inner facets; avoid uniform white fill |
| Residue | Settling shards, frost trace, sparse fine particles |
| Avoid | Continuous elastic ribbon, irregular flame flicker, buoyant smoke as main cue |
| Camera/readability | At least one large facet survives far camera; tiny snow detail is optional |
| Cost risk | Too many mesh shards, sorting/transparency inside stacked facets |

Ice signature: **grow → lock/hold → fracture → ballistic settle**.

## 8.6. Electricity language

| Система | Конкретні обмеження |
|---|---|
| Primary shapes | Thin branching zigzags, broken paths, sharp forks, separated bright nodes |
| Secondary shapes | Short sparks, tiny branch echoes, point accents |
| Negative space | Gaps are part of path; connection may appear discontinuous |
| Edge language | Very crisp, thin, high local contrast; branch thickness hierarchy |
| Motion | Near-instant path changes, jitter, branch re-selection, short directional jumps; optional charge convergence |
| Timing | Optional charge 0–0.18; main pulse 0.18–0.25; echo pulses 0.28–0.48; sparks 0.25–0.70; minimal long residue |
| Value/color | Small near-white core/branches; dark or lower-value support around them; hue is secondary |
| Residue | Brief ion-like points or faint afterimage; not broad smoke by default |
| Avoid | Long smooth ease-in-out travel, broad soft blob, heavy stable ground mass |
| Camera/readability | One thick primary branch must survive 25%; micro branches are secondary |
| Cost risk | Excessive branching layers, flicker aliasing, lights, high-frequency overdraw |

Electricity signature: **charge or silence → instant branch pulse → echo → vanish**.

## 8.7. Wind language

| Система | Конкретні обмеження |
|---|---|
| Primary shapes | Open crescents, S-curves, tapered streamlines, spirals with visible gaps |
| Secondary shapes | Wisps, thin trailing arcs, optional environmental particles such as dust/leaves made from own assets |
| Negative space | Large open center and directional lanes; air is shown partly by what remains empty |
| Edge language | Crisp leading edge plus soft/broken trailing edges |
| Motion | Suction or counter-motion anticipation; accelerating sweep/orbit; delayed trailing wisps |
| Timing | Inward gather 0–0.15; sweep 0.12–0.48; overshoot/curl 0.42–0.65; wisps 0.50–0.90; sparse environmental residue to 1.0 |
| Value/color | Mostly value/edge-driven; dominant can be subtle; accent at leading pressure edge |
| Residue | Dust, leaves, motes or dissipating streamlines; never depend on green/cyan alone |
| Avoid | Closed heavy filled mass, vertical buoyant flame tongues, rigid crystal hold |
| Camera/readability | Open curve must retain direction from oblique camera; add secondary depth layer if plane collapses |
| Cost risk | Long ribbons, many transparent wisps, large soft coverage |

Wind signature: **suction → sweep/orbit → overshoot → trailing air evidence**.

## 8.8. Earth language

| Система | Конкретні обмеження |
|---|---|
| Primary shapes | Low wide blocks, slabs, trapezoids, ground wedges, chunky radial segments |
| Secondary shapes | Rock chunks, crack lines, compact dust puffs |
| Negative space | Weighty clustering, але gaps між chunks зберігають target silhouette |
| Edge language | Hard irregular breaks, blunt corners, low horizontal emphasis |
| Motion | Slow compression/build; short forceful impulse; ballistic chunks; gravity-dominant settle |
| Timing | Build 0–0.22; impulse/contact 0.22–0.36; chunks peak 0.36–0.55; settle 0.50–0.82; dust/crack residue 0.60–1.0 |
| Value/color | Dense mid/dark mass із локальним bright crack/contact; не робити весь dust bright |
| Residue | Dust, cracks, small settling chunks; longest persistence among heavy variants |
| Avoid | Weightless upward drift, thin jitter branches, smooth continuous ribbons |
| Camera/readability | Ground boundary й contact point видимі; vertical chunks не створюють wall |
| Cost risk | Mesh count, collision temptation, dust overdraw, long ground residue |

Earth signature: **compress → blunt impulse → ballistic rise/fall → settle/dust**.

## 8.9. Nature language

| Система | Конкретні обмеження |
|---|---|
| Primary shapes | Branching stems, spirals, petal/leaf-like lobes, growth rings without copied symbols |
| Secondary shapes | Buds, seeds, spores, small leaves/petals from own simple assets |
| Negative space | Organic branching gaps; center may open during bloom |
| Edge language | Mix of clean growth tips and soft organic trailing shapes; repeating but non-mechanical |
| Motion | Growth along paths, unfurl, orbit, bloom, delayed branch motion and drifting secondary pieces |
| Timing | Sprout/gather 0–0.24; unfold 0.18–0.55; bloom peak 0.48–0.65; secondary drift 0.58–1.0 |
| Value/color | Bright growth tips or bloom center; body lower value; identity must survive without green |
| Residue | Spores, petals, leaves, short vine trace or motes |
| Avoid | Pure recolored wind swirl, rigid crystal fracture, random flame flicker |
| Camera/readability | One clear growth direction; small leaves do not replace macro shape |
| Cost risk | Many small alpha cards, long orbiting motes, dense overlapping petals |

Nature signature: **sprout → branch/unfurl → bloom → drift/seed**.

## 8.10. Light language

| Система | Конкретні обмеження |
|---|---|
| Primary shapes | Clean rays, halos, radial sectors, aligned geometric planes, open symmetric motifs |
| Secondary shapes | Small ordered points, thin rings, controlled ray fragments |
| Negative space | Deliberate central voids or evenly spaced sectors; high order |
| Edge language | Clean, precise, low noise; symmetry may be broken only for direction |
| Motion | Converge/align, crisp activation, ordered expansion or reveal; minimal random drift |
| Timing | Align 0–0.20; activation 0.18–0.30; clean hold/expansion 0.28–0.60; orderly fade 0.55–0.88; faint afterimage 0.75–1.0 |
| Value/color | Local near-white accents, controlled HDR impression, dark/mid separators; light is not «everything white» |
| Residue | Faint rays, ordered motes, afterimage; little dirty smoke |
| Avoid | Noisy irregular edge everywhere, heavy dust, branch jitter as primary |
| Camera/readability | Symmetry/center must survive perspective; prevent full-screen white wash |
| Cost risk | Broad additive/translucent halos, overlapping rays, excessive bloom-like coverage |

Light signature: **align/converge → precise reveal → ordered expansion/hold → clean fade**.

## 8.11. Darkness/void language

| Система | Конкретні обмеження |
|---|---|
| Primary shapes | Inward spirals, holes, occluding wedges, broken silhouettes, offset rings, compressed void cores |
| Secondary shapes | Edge fragments pulled inward, delayed echoes, warped streaks |
| Negative space | Negative space itself becomes primary; a dark core needs readable rim/context |
| Edge language | Unstable broken rim, sharp disappearance, discontinuous contour |
| Motion | Absorption/inward pull, collapse, discontinuous skip, delayed echo, sudden release or cut |
| Timing | Quiet pre-phase 0–0.20; inward pull 0.15–0.45; collapse/silence 0.42–0.52; release/echo 0.50–0.76; residual distortion/embers 0.68–1.0 |
| Value/color | Dark core separated by mid/bright rim and environment contrast; purple is optional, not identity |
| Residue | Faint distortion, falling fragments, delayed echo ring, dissipating dark motes |
| Avoid | Просто purple recolor fire/light; uniform black blob без rim/negative-space design |
| Camera/readability | Перевіряти на dark і bright backgrounds; core не повинен зникати або стати UI-like disk |
| Cost risk | Distortion, layered dark/bright rims, broad occlusion, long echo layers |

Void signature: **pull inward → collapse/silence → displaced release → delayed echo**.

## 8.12. Invariants і variables

Для кожного element зафіксуй:

- **3 invariants:** повинні повторюватися в impact, projectile, aura та ultimate.
- **3 змінні:** scale, точний contour, кількість secondary groups, температура palette або тривалість у межах дозволеного rhythm.
- **2 forbidden shortcuts:** ознаки, що руйнують або змішують language.

Приклад water:

```text
Invariants: continuous curved path; compression→follow-through; rounded breakup.
Variables: arc direction; number of droplets; dominant hue.
Avoid: rigid hold→fracture; random zigzag teleport.
```

# 9. Візуальні або математичні приклади

## 9.1. Identity distance

Для review можна використати просту checklist-distance, не perceptual formula:

```text
distance = changed_shape + changed_edge + changed_motion
         + changed_timing + changed_space + changed_residue
```

Кожний changed category = 1.

- recolor only: distance `0`;
- shape + motion: `2`, усе ще слабка translation;
- shape + edge + motion + timing + residue: `5`, сильна structural variation.

Це не mathematical truth; це дисципліна review.

## 9.2. Timing signatures

```text
Fire:       spike / flicker / rise
Water:      gather ~ sweep ~ splash ~ recede
Ice:        grow | HOLD | crack! ... settle
Electric:   . . FLASH . echo . vanish
Wind:       inhale → sweep → curl → trail
Earth:      compress → THUD → rise/fall → dust
Nature:     sprout → unfold → bloom → drift
Light:      align → reveal — hold → clean fade
Void:       pull inward → silence → displaced release → echo
```

## 9.3. Non-color silhouettes

Для одного projectile impact:

- fire — forked upward wedge;
- water — curved sheet і droplets;
- ice — faceted cluster, hold, shards;
- electricity — broken branch path;
- wind — open crescent і trailing S-curves;
- earth — low block burst;
- nature — branching bloom;
- light — ordered radial sectors;
- void — dark/empty core з inward rim.

Якщо всі дев’ять стають однаковим circle burst, grammar не побудована.

## 9.4. Cross-confusion matrix

Для кожної пари постав:

- `0` — легко відрізнити без color;
- `1` — іноді плутається;
- `2` — часто плутається.

Усі pairs із `2` потребують revision щонайменше двох categories.

# 10. Controlled experiments

## Experiment 1 — Recolor trap

1. Створи один radial burst.
2. Зроби дев’ять color versions.
3. Переведи всі в grayscale та solid white.
4. Запитай: що лишилося від elemental identity?

**Очікування:** майже нічого. Це palette set, не дев’ять languages.

## Experiment 2 — Motion swap

1. Візьми fire silhouette.
2. Version A: ignition/flicker/rise.
3. Version B: grow/hold/fracture.

**Очікування:** B починає читатися як ice/crystal behavior, хоча shape/color fire не змінилися. Motion є identity channel.

## Experiment 3 — Residue swap

Після однакового impact додай:

- embers/smoke;
- droplets/recede;
- shards/frost;
- dust/cracks.

**Очікування:** residue сильно змінює material interpretation.

## Experiment 4 — Pair confusion

Створи grayscale wind і nature versions без leaves/green. Якщо обидва є однаковими S-curves, додай:

- wind: suction, open lane, fast sweep;
- nature: branching growth, bloom hold, delayed seed drift.

**Очікування:** різниця працює без icon props.

# 11. Покрокова керована практика

## Етап 1 — Зафіксуй один archetype

Використай нейтральний `small target-centered burst`. Gameplay function, bounding envelope й camera однакові для всіх дев’яти cards.

## Етап 2 — Створи workbook grid

Document 3000×3000 px, 3×3 panels:

```text
Fire | Water | Ice
Electricity | Wind | Earth
Nature | Light | Void
```

Кожна panel має місце для:

- silhouette;
- 5-frame motion strip;
- timing line;
- edge sample;
- residue sample;
- three-value swatches;
- invariants/avoid list.

## Етап 3 — Напиши grammar до drawing

Для кожного element заповни:

```text
Primary:
Secondary:
Edge:
Motion:
Timing:
Space:
Value:
Residue:
3 invariants:
2 avoid:
```

Не вибирай color на цьому етапі.

## Етап 4 — Намалюй solid-white silhouettes

Rules:

- один bounding envelope;
- один target marker;
- максимум 1 primary і 3 secondary groups;
- без textures, glow, symbols або labels у review copy;
- кожна silhouette має змінити shape family, а не detail.

## Етап 5 — Створи 5-frame motion strips

Frames:

1. preparation;
2. onset;
3. peak;
4. response;
5. residue.

Використай element-specific motion. Не копіюй одну strip і не рухай particles інакше лише на останньому frame.

## Етап 6 — Признач timing

Для кожного element запиши normalized timestamps:

```text
prep_end:
main_peak:
secondary_peak:
residue_start:
end:
```

Збережи gameplay contact у близькому range, але зміни rhythm довкола нього.

## Етап 7 — Додай value

Створи grayscale:

- quiet;
- body/support;
- peak;
- dark separator, якщо потрібен light/void.

Fire, electricity і light не повинні всі стати full-white blobs. Void не повинен стати невидимим black blob.

## Етап 8 — Додай color last

Color відповідає identity, але не замінює grammar. Зроби color version і поруч залиш grayscale.

## Етап 9 — Cross-confusion review

1. Приховай labels.
2. Shuffle panels.
3. Спробуй назвати elements.
4. Заповни pair matrix.
5. Для pair score `2` зміни щонайменше два: motion/timing/shape/residue/edge.

## Етап 10 — Camera/readability

Перевір:

- 100% і 25%;
- dark/light/busy backgrounds;
- front і 35° oblique schematic;
- target visible;
- peak не full-screen;
- residue не перекриває наступну action.

## Етап 11 — Створи три short animatics

Обери найбільш схожі pair і третій contrast element. Рекомендовано:

- wind;
- nature;
- electricity.

Тривалість кожного 0.8–1.2 с. Gameplay contact однаковий, grammar різна.

## Етап 12 — Підготуй bridge до блока 09

Для кожного element запиши майбутній archetype:

| Element | Блок 09 |
|---|---|
| Fire | hit spark / melee impact |
| Water | projectile / projectile trail |
| Ice | shockwave |
| Electricity | beam / ribbon trail |
| Wind | sword slash / slash arc |
| Earth | ground crack |
| Nature | aura / buff-debuff / lingering area |
| Light | magic circle / targeting telegraph / elemental burst |
| Darkness/void | spawn / transformation / character ultimate |

# 12. Точні назви вузлів, модулів і налаштувань

Це design lesson: Material nodes і Niagara modules не використовуються.

### Photoshop

- `File > New`
- `Rectangle Tool`, `Ellipse Tool`, `Polygon Tool`, `Pen Tool`
- `Layer Mask`
- `Layer > New Adjustment Layer > Black & White`
- `Layer > New Adjustment Layer > Hue/Saturation`
- `Layer > New Adjustment Layer > Levels`
- `Window > Timeline`
- `Edit > Free Transform`
- `View > New Guide Layout`

### Krita

- `Rectangle Tool`, `Ellipse Tool`, `Polygon Tool`, `Bezier Curve Tool`
- `Transparency Mask`, `Filter Mask`
- `Filter > Adjust > Desaturate`
- `Filter > Adjust > HSV Adjustment`
- `Filter > Adjust > Levels`
- `Settings > Dockers > Animation Timeline`
- `Transform Tool`

### Unreal Engine 5.8 vocabulary для bridge

- `Sprite Renderer`
- `Mesh Renderer`
- `Ribbon Renderer`
- `User Parameters`
- `Normalized Age`
- `Curve`

Exact implementation stack не створюється до Niagara lessons. Потребує ручної перевірки в Unreal Engine 5.8.

# 13. Стартові значення параметрів

| Параметр | Старт |
|---|---:|
| Workbook | 3000×3000 px |
| Grid | 3×3 |
| Panel working area | приблизно 900×900 px із margins |
| Archetype | Small target-centered burst |
| Total duration | 1.0 с normalized |
| Key states | 5 |
| Primary groups | 1 |
| Secondary groups | 1–3 |
| Accent groups | 1–2 |
| Value groups | 3–4 |
| Contact window | t=0.35–0.50 |
| Residue | low-value, starts after primary peak |
| Review scale | 100%, 25% |
| Camera | front + 35° oblique schematic |
| Backgrounds | dark, light, warm busy, cool busy |
| Required structural changes from base | minimum 5 of 6 categories: shape, edge, motion, timing, space, residue |

Element-specific timing ranges наведені в секціях 8.3–8.11. Це training constraints, які пізніше коригуються під archetype і gameplay animation.

# 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат |
|---|---|
| Fixed archetype | Дев’ять cards можна порівнювати чесно |
| Grammar text | Design decisions існують до drawing/color |
| Silhouettes | 9 distinct non-color identities |
| Motion strips | Кожний element має власну cause/response |
| Timing | Не дев’ять однакових peaks |
| Value | Peak/body/residue читаються у grayscale |
| Color | Підсилює, але не створює identity |
| Cross-confusion | Пара score 2 отримує revision |
| Camera tests | Macro shape survives, target visible |
| Three animatics | Identity працює в real time |
| Block 09 bridge | Кожний element прив’язаний до archetype practice |

# 15. Самостійна вправа

## EX-L02-04-A — Nine-element identity workbook

**Завдання:** створити повний 3×3 workbook для одного target-centered burst.

**Обмеження:**

- gameplay function, target point, camera й bounding envelope однакові;
- кожний element має shape, edge, motion, timing, value, residue й avoid rules;
- color додається після solid-white і grayscale;
- між кожною версією та neutral base змінено щонайменше 5 structural categories;
- без proprietary symbols, traced contours або extracted assets;
- усі pair scores `2` у cross-confusion matrix виправлено.

**Deliverables:**

1. Дев’ять grammar cards.
2. Дев’ять solid-white silhouettes.
3. Дев’ять 5-frame motion strips.
4. Дев’ять timing signatures.
5. Grayscale і color workbook.
6. Cross-confusion matrix до/після revisions.
7. Camera/background test sheet.
8. Block 09 bridge table.

**Acceptance criteria:**

- щонайменше 7 із 9 elements правильно розпізнаються без labels/color з першої спроби, а решта — після motion preview;
- жодна variation не є palette swap;
- fire/water, ice/electricity, wind/nature, light/void мають очевидні structural distinctions;
- target лишається видимою;
- timing/residue відповідають grammar.

# 16. Додаткова складніша вправа

## EX-L02-04-B — Elemental translation triad

**Завдання:** обери один archetype — projectile impact, aura activation або ground telegraph — і створи три real-time abstract animatics для elements із різною grammar. Рекомендована складна triad: `Wind`, `Nature`, `Void`.

**Обмеження:**

- однакова gameplay function і duration range 0.8–1.2 с;
- один і той самий contact/activation timestamp ±0.05 с;
- не можна змінювати лише color, texture або particle count;
- кожна version змінює minimum 5 structural categories;
- кожна має окремий peak-overlap frame й performance-risk note;
- silhouette/readability перевіряється на 25% і чотирьох backgrounds.

**Deliverables:**

1. Translation matrix.
2. Три phase strips.
3. Три animatics.
4. Side-by-side grayscale playback.
5. Structural-distance audit.
6. Camera/performance notes.
7. Короткий rationale, чому це одна ігрова функція, але три elements.

**Acceptance criteria:**

- під час самостійного blind naming після приховування labels/color, паузи та shuffle triad розрізняється без hue; optional peer check дозволений лише як додатковий evidence;
- contact/activation читається однаково надійно;
- motion/timing/residue відповідають grammar;
- жодна version не повторює exact silhouette іншої;
- ризики продуктивності сформульовані без вигаданих budgets.

# 17. Три рівні підказок

## EX-L02-04-A

- **Hint 1 — напрямок мислення:** спочатку напиши для кожного element дієслова: ignite, flow, lock/fracture, pulse, sweep, compress, grow, align, absorb.
- **Hint 2 — потрібні інструменти:** 3×3 grid, grammar template, solid-white silhouettes, 5-frame strips, normalized timestamps, grayscale/color versions і pair matrix.
- **Hint 3 — майже повна структура:** використай signatures із 8.3–8.11; зафіксуй один contact point; для кожної card заповни `Primary/Edge/Motion/Timing/Residue/3 invariants/2 avoid`; revise pairs score 2.

[Повне рішення EX-L02-04-A](../EXERCISE_ANSWERS/L02-04_elemental_style_language_workbook_answers.md#ex-l02-04-a)

## EX-L02-04-B

- **Hint 1 — напрямок мислення:** збережи gameplay event, але зміни physical metaphor і causal sequence.
- **Hint 2 — потрібні інструменти:** translation matrix із rows Shape/Edge/Motion/Timing/Space/Residue, три phase strips, grayscale playback і structural-distance audit.
- **Hint 3 — майже повна структура:** Wind = suction→sweep→trail; Nature = sprout→bloom→drift; Void = inward pull→collapse pause→echo. Contact близько 0.45 с у всіх, але шлях до/після нього різний.

[Повне рішення EX-L02-04-B](../EXERCISE_ANSWERS/L02-04_elemental_style_language_workbook_answers.md#ex-l02-04-b)

# 18. Типові помилки

1. Один effect recolored дев’ять разів.
2. Shape змінено, але motion/timing лишилися однаковими.
3. Element identity тримається лише на props: leaf, snowflake, lightning icon.
4. Усі bright elements — однакові white blobs.
5. Void — просто black/purple blob без rim і negative-space design.
6. Wind і nature — однакові green/cyan swirls.
7. Fire і electricity — однаковий jitter із різними branches.
8. Water і wind — однакові ribbons без різного inertia/residue.
9. Earth strength створено тільки більшою кількістю chunks.
10. Ice не має hold/fracture rhythm.
11. Light копіює конкретний sacred/magic symbol.
12. Cross-confusion matrix заповнено з видимими labels, а не через самостійну blind review після паузи та shuffle.
13. Training constraints сприймаються як immutable laws.

# 19. Troubleshooting

| Симптом | Причина | Виправлення |
|---|---|---|
| У grayscale всі elements однакові | Identity залежить від hue | Перебудуй silhouette, motion і residue |
| Fire схожий на electricity | Обидва лише flicker/jitter | Fire: broader tongues + rise; electricity: thin discontinuous branches + pulses |
| Water схожий на wind | Однакові S-curves | Water: inertia/splash/droplets; wind: suction/open lanes/trailing air evidence |
| Wind схожий на nature | Nature не має growth logic | Додай branch/unfold/bloom і delayed seeds |
| Ice схожий на earth | Обидва chunky/shards | Ice: ordered growth/hold/fracture; earth: low compression/impulse/gravity settle |
| Light схожий на electricity | Обидва bright/crisp | Light: ordered alignment/hold; electricity: discontinuous instant branch pulses |
| Void не видно на dark background | Dark core без separator | Додай controlled rim, distortion edge або mid-value context |
| Nature читається тільки через leaves | Слабка macro grammar | Підсил branching/growth/bloom без props |
| Fire smoke перекриває target | Residue завелике/bright | Зменш area/value/lifetime, offset upward |
| 9 cards мають різний scale | Comparison unfair | Поверни спільний bounding envelope й target marker |
| Animatic працює frame-by-frame, не real time | Надмірно subtle timing | Збільш phase contrast, скороти transitional states |

# 20. Performance considerations

- Elemental identity не повинна залежати від дорогого layer. Macro shape/timing має пережити Medium/Low.
- Fire/smoke, water sheets, wind wisps і void distortion мають screen-space/overdraw risks.
- Ice/earth можуть мати mesh-count risk; electricity — high-frequency/flicker risk; nature — many small cards; light — broad bright overlap.
- Residue duration впливає на active System overlap у combo/rapid fire.
- В design card познач `must keep`, `can simplify`, `optional`.
- Для Low profile першими прибирай micro secondary particles, а не primary/contact.
- Ніколи не призначай universal particle count або millisecond budget із workbook.
- Peak-overlap frame має бути окремим future profiler target.
- Cross-element kit повинен використовувати shared production architecture пізніше, але shared architecture не означає identical motion/shape.

# 21. Запитання для самоперевірки

1. Назви вісім categories design vector.
2. Чому recolor не є elemental variation?
3. Які п’ять structural categories мінімально перевіряються при translation?
4. Чим fire motion відрізняється від electricity?
5. Чим water відрізняється від wind без color?
6. Який temporal signature робить ice distinct?
7. Як розвести earth та ice?
8. Чому nature не повинна залежати лише від leaf props?
9. Як зробити void readable на dark background?
10. Для чого потрібна cross-confusion matrix?

# 22. Відповіді

1. Shape, Edge, Motion, Timing, Space, Value, Color, Residue.
2. Він змінює palette, але зберігає silhouette, causal motion, rhythm, edge й aftermath.
3. Shape, edge, motion, timing і residue; також бажано space.
4. Fire має broader tongues, irregular flicker і buoyant rise; electricity — thin discontinuous branch pulses і короткі echoes.
5. Water має inertia, coherent sheet, splash і droplets; wind — suction, open lanes, sweep/orbit і air evidence.
6. Ordered growth → short hold → sudden fracture → ballistic settle.
7. Ice — faceted order/hold/fracture; earth — low wide compression, blunt impulse, gravity settle й dust.
8. Props є detail; identity має читатися через growth, branching, bloom і delayed drift.
9. Дати core readable rim/context, negative-space silhouette й перевірити dark/light backgrounds.
10. Вона знаходить pairs, які плутаються без labels/color, і змушує змінити structural categories.

# 23. Self-check checklist

- [ ] Gameplay archetype, camera й bounding envelope однакові для 9 cards.
- [ ] Кожна card має 8-category grammar.
- [ ] Кожна має 3 invariants і 2 avoid rules.
- [ ] Створено 9 distinct solid-white silhouettes.
- [ ] Створено 9 motion strips.
- [ ] Timing signatures не скопійовані.
- [ ] Color додано після grayscale.
- [ ] Fire читається через ignite/flicker/rise.
- [ ] Water читається через inertia/splash.
- [ ] Ice читається через grow/hold/fracture.
- [ ] Electricity читається через branch pulses.
- [ ] Wind читається через suction/sweep/open space.
- [ ] Earth читається через compression/impulse/settle.
- [ ] Nature читається через growth/bloom/drift.
- [ ] Light читається через alignment/order/clean fade.
- [ ] Void читається через pull/collapse/echo.
- [ ] Cross-confusion score 2 виправлено.
- [ ] Target visible у camera/background tests.
- [ ] Немає traced proprietary symbols/assets.
- [ ] Є bridge table до всіх уроків блока 09.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. завершено всі дев’ять grammar cards;
2. під час самостійного blind naming після приховування labels/color, паузи та shuffle щонайменше 7 із 9 silhouettes розпізнаються правильно, а всі 9 — після motion preview;
3. кожна variation змінює щонайменше 5 structural categories;
4. cross-confusion pairs score 2 переглянуто й виправлено;
5. три animatics працюють у real time і grayscale;
6. student може пояснити, чому palette swap не є translation;
7. ризики продуктивності і `must keep/can simplify/optional` позначено;
8. виконано щонайменше 18 із 20 checklist пунктів.

# 25. Підсумок

Elemental language — це система причин і форм. Fire ignite/flicker/rise; water gathers/sweeps/splashes; ice grows/holds/fractures; electricity pulses/branches/vanishes; wind sucks/sweeps/trails; earth compresses/impacts/settles; nature grows/blooms/drifts; light aligns/reveals/fades; void pulls/collapses/echoes. Color підсилює цю різницю, але не створює її.

# 26. Зв’язок із наступними уроками

У блоці `09_EFFECT_ARCHETYPES` кожна language отримує окрему practical transfer:

- 09.01 fire — hit spark і melee impact;
- 09.02 water — projectile і trail;
- 09.03 ice — shockwave;
- 09.04 electricity — beam і ribbon trail;
- 09.05 wind — sword slash і slash arc;
- 09.06 earth — ground crack;
- 09.07 nature — aura, buff/debuff і lingering area;
- 09.08 light — magic circle, telegraph і burst;
- 09.09 darkness/void — spawn, transformation і ultimate.

Перед переходом до Material Foundations потрібно пройти `02_VFX_DESIGN/BLOCK_ASSESSMENT.md` і отримати не менше 80/100.

# 27. Офіційні джерела

- Epic Games. [Creating Visual Effects in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-visual-effects-in-niagara-for-unreal-engine). UE 5.8. Production context для майбутньої реалізації elemental languages.
- Epic Games. [Render Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine). UE 5.8. Офіційний контекст Sprite/Mesh/Ribbon Renderers; exact implementation відкладено до Niagara lessons.
- Epic Games. [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara). UE 5.8. Підстава визначати `must keep/can simplify/optional`.
- Epic Games. [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara). UE 5.8. Підстава профілювати peak overlap та representative effects.
- Візуальні орієнтири курсу можна аналізувати тільки через офіційно опубліковане publisher/developer footage. Не використовуй extracted assets, traced proprietary symbols або exact reconstruction.

# 28. Рекомендовані скриншоти або схеми

```text
Рекомендована схема 1:
Що показати: design vector E=[Shape,Edge,Motion,Timing,Space,Value,Color,Residue].
Що повинно бути видно: recolor змінює лише Color; translation змінює 5+ categories.
Яку область виділити: minimum structural change rule.
```

```text
Рекомендований скриншот 2:
Що відкрити: 3×3 solid-white workbook без labels.
Що повинно бути видно: distinct silhouettes усіх дев’яти elements.
Яку область виділити: fire/water, wind/nature, light/void contrasts.
```

```text
Рекомендована схема 3:
Що показати: дев’ять timing signatures як horizontal rhythm strips.
Що повинно бути видно: ice hold/fracture, electricity pulse, void collapse pause.
Яку область виділити: різні causal sequences при однаковому contact window.
```

```text
Рекомендований скриншот 4:
Що відкрити: cross-confusion matrix before/after revisions.
Що повинно бути видно: pair score 2 і дві structural changes, що його виправили.
Яку область виділити: wind/nature або light/electricity.
```

```text
Рекомендована схема 5:
Що показати: bridge 02.04 → 09.01–09.09.
Що повинно бути видно: кожний element та його practical archetypes.
Яку область виділити: повторення language як transfer, а не tutorial copy.
```
