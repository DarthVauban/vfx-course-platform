# 11.02 — Portfolio Piece 2: Elemental projectile kit

## 1. Назва

**`Triune Relay` — reusable elemental projectile kit із launch, flight body, trail, impact і трьома поведінково відмінними variants.**

## 2. Результат уроку

Ви завершите portfolio kit для PC/console gameplay:

- shared integration через `BP_P11_ElementalProjectile`;
- фази launch, projectile body, trail та impact;
- variants Ember, Frostglass і Stormpulse, що відрізняються не лише hue;
- runtime data: direction/speed/hit position/surface normal;
- production-friendly contracts User Parameters і materials;
- High/Medium/Low profiles;
- four-phase breakdown, виміряне performance і чесний case-study package.

Результати: `BP_P11_ElementalProjectile`, `E_P11_Element`, `NS_P11_Projectile_Launch`, `NS_P11_Projectile_Flight`, `NS_P11_Projectile_Impact`, `L_P11_Projectile_Portfolio`, `LS_P11_Projectile_Capture`.

## 3. Орієнтовний час

**10 годин: 1 година теорії / 9 годин практики.**

- 60 хв — brief, ethical reference matrix and variant grammar;
- 60 хв — shared monochrome launch/flight/impact graybox;
- 90 хв — projectile Blueprint/runtime data;
- 120 хв — three variant Niagara profiles;
- 90 хв — M/S practice: three material identities and shared functions;
- 90 хв — H/M/L and performance parity;
- 90 хв — captures, breakdown and rubric.

M/S ledger: **1.5 години; cumulative 2.5/6 годин блоку**.

## 4. Prerequisites

- `G10`;
- 09.02 projectile, 09.03 trail/beam, 09.04 impact/element variants;
- навички runtime parameters, component lifecycle, pooling і profiling із блоку 10;
- оригінальні VFX textures/meshes/materials;
- packaged core UE 5.8 feature set; **без Beta/Experimental dependency**.

## 5. Нові терміни

- **Kit grammar** — shared rules, завдяки яким phases/variants відчуваються спорідненими.
- **Behavioral variant** — відрізняється motion, silhouette, timing і decay, а не лише hue.
- **Launch phase** — muzzle/origin event, який визначає element і direction.
- **Flight body** — стійкий читабельний core projectile.
- **Impact phase** — world-space response у registered collision/hit.
- **Runtime data contract** — точні names/types/owners для direction, speed, element і hit data.
- **Variant parity** — порівнювані ігрові підказки та виміряний cost між variants.
- **Projectile visibility envelope** — camera distances/angles, де body лишається читабельним.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Reusable kit доводить системне мислення: один gameplay actor має керувати кількома phases і visual identities без copy-pasted Blueprints. Робота з variants показує, чи architecture справді параметризована й чи performance/presentation claims витримують одночасну роботу кількох effects.

Ця portfolio piece демонструє навички, але **не гарантує працевлаштування**. Заявляйте лише documented authorship і measured results.

## 7. Теорія простими словами

Kit має спільне речення:

```text
launch announces → flight tracks → trail explains path → impact confirms contact
```

Кожен element змінює спосіб, у який це речення вимовляється:

- Ember: компактний, прискорений, granular і short-lived.
- Frostglass: faceted, стабільніший, гострий і lingering.
- Stormpulse: oscillating, elastic, pulsed і швидко dissipates.

Якщо змінюється лише RGB, це один effect із трьома tints, а не portfolio kit.

## 8. Детальні технічні пояснення

### Creative brief

`Triune Relay` — third-person family action projectiles для повторюваного PC/console gameplay:

- узгоджені launch size і hit position;
- читабельний core на відстані 5–20 m;
- вузький trail, який не приховує target;
- компактний impact, що підтверджує contact і не маскує next action;
- три variants мають спільний ring/core motif, але різні motion, geometry і decay.

### Technical requirements

- один reusable `BP_P11_ElementalProjectile` з `E_P11_Element`;
- attached flight Niagara Component і world-space launch/impact spawns;
- exposed parameters:
  - `User.ElementIndex : Int32`;
  - `User.PrimaryColor`, `User.SecondaryColor : Linear Color`;
  - `User.Direction : Vector`;
  - `User.Speed : Float`;
  - `User.Scale`, `User.Intensity : Float`;
  - `User.HitNormal : Vector`;
- gameplay/projectile collision передає actual hit, а не Niagara visual collision;
- flight component безпечно deactivates/returns, impact отримує hit point/normal;
- немає stale pooled element parameters;
- H/M/L зберігають body visibility, path і contact.

### Constraints

- ігрова камера реального часу для PC/консолей має пріоритет;
- усі три variants використовують shared gameplay actor і parameter schema;
- жоден variant не може бути hue-only duplicate;
- немає proprietary/ripped textures, meshes, sounds або effects;
- external rig/environment/animation ліцензовані й credited, їх не можна називати власними;
- немає Beta/Experimental features або offline-only renderer dependency;
- немає непрозорого «magic Blueprint», який неможливо подати diagram;
- impact area не повинна візуально обіцяти gameplay radius, відмінний від actual mechanic.

### Scope boundary

In scope: shared projectile VFX actor contract, три elemental visual variants, launch/flight/trail/impact, hit-data integration, pooling reset, H/M/L, target profiling і case study. Out of scope: дизайн damage/status mechanics, network prediction, повна projectile framework, sound і environment/character authoring; external work чітко credited.

### Ethical original reference analysis

Побудуйте matrix із lawful references: combustion/embers, ice fracture/frost, electrical discharge/elastic motion та abstract graphic design. Витягуйте лише:

- motion frequency;
- silhouette breakup;
- value hierarchy;
- temporal decay;
- material surface cues.

Запишіть source/creator/date, використаний principle і те, що відхилено. Не копіюйте впізнаваний game projectile, branded shape, exact color sequence або proprietary atlas. Створіть original thumbnails, що поєднують principles із unrelated domains.

### Production milestones

| Milestone | Критерій виходу |
|---|---|
| M0 Grammar | shared motif, три variant verbs і source/authorship log |
| M1 Graybox | один monochrome `launch/flight/trail/impact` працює |
| M2 Runtime | direction, speed, element і hit normal передаються правильно |
| M3 Variants | три silhouettes/motions/decays відрізняються |
| M4 Materials | shared function і element instances перевірені |
| M5 Performance | завершені parity, H/M/L, pooling і stress captures |
| M6 Presentation | готові 3× phase matrix, gameplay/neutral clips і опис проєкту |

### Production checklist

- [ ] один Blueprint керує всіма variants;
- [ ] launch, body, trail та impact присутні;
- [ ] три variants відрізняються у чотирьох dimensions;
- [ ] paths direction/speed/hit normal перевірені;
- [ ] pooling скидає кожен User parameter;
- [ ] gameplay radius відповідає visible impact;
- [ ] H/M/L cue parity перевірено;
- [ ] усі вихідні ресурси original/credited;
- [ ] case study розрізняє shared і variant logic.

### 100-point self-review rubric and category floors

| Category | Points | Floor |
|---|---:|---:|
| Creative brief, originality, ethical references | 15 | 9 |
| Kit cohesion and variant distinctiveness | 20 | 12 |
| Niagara/material/asset architecture | 20 | 12 |
| Gameplay/Blueprint integration and reuse | 15 | 9 |
| Performance parity, H/M/L and pooling | 15 | 9 |
| Presentation, breakdown and authorship | 15 | 9 |
| **Total** | **100** | **80 overall** |

Critical fail: відсутня хоча б одна phase, hue-only variant, misleading gameplay area, proprietary asset, stale pooled data, missing performance tier або category нижче floor.

### Performance requirements with target measurement

Оголосіть target PC/console profile і frame budget. Перевірте:

- один projectile `launch→impact`;
- 12 simultaneous flights і 6 impacts протягом 10 секунд;
- кожен element окремо та mixed `4+4+4`;
- однакові route, camera, resolution, build і warmed state;
- High/Medium/Low.

Зберіть Niagara Debugger instance/particle counts, `stat unit`, `stat gpu`/GPU profiler, overdraw і Unreal Insights для CPU/pooling hitch. Порівняйте до й після за однакових умов. Усі variants мають виконати declared project target без hitch/cull/stale state. **Не вигадуйте universal millisecond, particle або draw-call budget.**

### Presentation requirements

- одна gameplay matrix тривалістю 12–18 s, що показує всі variants і phases;
- один neutral side/top view з однаковими distance/exposure;
- phase freeze frames: launch/body/trail/impact;
- table `shared architecture vs variant`;
- до й після і H/M/L captures;
- captions містять element, phase, engine build, role та measured scenario;
- prerecorded cinematic не використовується як proof real-time gameplay performance.

### Mandatory breakdown materials list

1. ethical reference principles і source/authorship log;
2. layer/timing map для `launch/flight/trail/impact × три elements`;
3. original textures/channel/flipbook sheets;
4. shared material functions, material graphs і три instances;
5. повні Niagara stacks/bindings та variant parameter table;
6. Blueprint projectile/hit/pooling integration diagram;
7. показники продуктивності до й після і parity evidence;
8. High/Medium/Low table;
9. limitations і rejected design paths.

### Completion criteria / Definition of Done

Piece завершена, коли кожен variant десять разів проходить `launch→flight→hit` без stale state, відрізняється у grayscale за motion/silhouette, використовує actual runtime hit data, проходить declared target і H/M/L cue parity, отримує `≥80/100` з усіма floors та має повний чесний breakdown.

## 9. Візуальні або математичні приклади

Grammar variants:

| Dimension | Ember | Frostglass | Stormpulse |
|---|---|---|---|
| body | compact sprite core | faceted mesh core | pulsing paired sprites |
| trail | granular thin ribbon | short shard wake | oscillating segmented ribbon |
| impact | fast outward sparks | radial shards + ring | two pulse rings + wisps |
| decay | `.3–.6 s` | `.8–1.4 s` | `.25–.7 s` |

Contract direction:

```text
D = normalize(User.Direction), reject zero vector
visual forward and ProjectileMovement velocity must agree
impact local Z = User.HitNormal
```

## 10. Controlled experiments

1. Установіть усі colors у white; variants мають лишатися відмінними.
2. Зафіксуйте camera і speed; ізолюйте body silhouettes.
3. Вимкніть trail; projectile body має лишитися читабельним.
4. Використайте wall/floor/slope hits; impact orientation має слідувати normal.
5. Чергуйте elements на одному pooled actor десять разів.
6. Порівняйте фактичний ігровий радіус із visible impact boundary.
7. Проведіть stress кожного element окремо для cost parity.
8. Перемикайте H/M/L у test/instance setup і перевірте core cues.

## 11. Покрокова керована практика

### Blueprint/runtime architecture

```text
BP_P11_ElementalProjectile
├─ ProjectileMovement / gameplay movement source
├─ NC_P11_Flight (Spawn System Attached or component asset)
├─ ConfigureElement
│  ├─ select ElementIndex/palette/profile
│  ├─ set Direction, Speed, Scale, Intensity
│  └─ Activate flight
├─ BeginPlay/Launch → Spawn NS_P11_Projectile_Launch at muzzle
└─ On gameplay hit
   ├─ Deactivate flight
   ├─ Spawn NS_P11_Projectile_Impact at ImpactPoint
   ├─ pass Direction and HitNormal
   └─ reset/return/destroy according to documented lifecycle
```

### `NS_P11_Projectile_Launch`

```text
Emitter Ring: Burst1 → Initialize Particle → Scale Mesh Size/Color → Mesh Renderer
Emitter Flare: Burst1 → Initialize Particle → Scale Sprite Size/Color → Sprite Renderer
Emitter Accent: Burst8 → Initialize/Shape/Add Velocity → State/Drag/Solve/Curves → Sprite
```

Lifetime `.15–.45`; system вирівняна за Direction; variant table змінює ring shape/scale, accent count/motion і decay.

### `NS_P11_Projectile_Flight`

```text
Emitter BodySprite
  Emitter Update: Emitter State; Spawn Rate or persistent Burst1
  Particle Spawn: Initialize Particle; Dynamic Material Parameters
  Particle Update: Particle State; Scale Color/Size
  Render: Sprite Renderer
Emitter BodyMesh (Frost enabled; optional disabled for others)
  Burst1 → Initialize/Initial Mesh Orientation → Update Orientation/Scale/Color → Mesh Renderer
Emitter Trail
  Spawn Rate 36–56 → Initialize Ribbon → State/Width/Color → Ribbon Renderer
Emitter Motifs
  Spawn Rate 6–14 → Initialize/Shape/Velocity → State/Curl or Drag/Solve/Curves → Sprite
```

Component слідує за gameplay projectile; не симулюйте competing Niagara position. `User.Direction` керує orientation/material motion; вибір Local/World документується.

### `NS_P11_Projectile_Impact`

```text
Emitter Flash: Burst1 → Initialize → Color/Size → Sprite
Emitter Ring: Burst1/2 → Initialize → Scale Mesh/Color → Mesh
Emitter Radial: Burst12–32 → Initialize/Shape/Add Velocity → State/Gravity/Drag/Solve/Curves → Sprite
Emitter Shards: Frost profile Burst8 → Initialize/Velocity/Orientation → State/Gravity/Drag/Solve/Orientation → Mesh
Emitter Residue: profile-specific Rate/Burst → Initialize → State/Curves → Sprite
```

Impact працює у світовому просторі та орієнтується за `HitNormal`. Visible boundary перевіряється проти actual gameplay hit/radius debug.

### Variant values

| Parameter | Ember | Frostglass | Stormpulse |
|---|---:|---:|---:|
| ElementIndex | `0` | `1` | `2` |
| body scale | `1.0` | `.85 mesh` | `1.15 pulse` |
| trail rate | `48` | `36` | `56` |
| impact radial count | `28` | `12 + 8 shards` | `18 + 2 rings` |
| curl/noise | low | none | medium controlled |
| intensity | `1.2` | `1.0` | `1.1` |

Це starting values; final profile визначає target measurement.

### H/M/L policy

- High: повні body/motif, trail та impact secondary/residue.
- Medium: ті самі body/path/contact, зменшені motif/rate і спрощений material feature.
- Low: один core body, мінімальний trail, один contact flash+ring+directional particles; nonessential residue вилучено.

Exact Blueprint display/pin names and Niagara parameter setters: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 12. Точні назви вузлів, модулів і налаштувань UE

- Blueprint: `Spawn System at Location`, `Spawn System Attached`, Niagara Component `Activate`/`Deactivate`, `Set Niagara Variable Vector3` і відповідні typed setters; labels projectile hit/event залежать від actor setup.
- Niagara modules/renderers із блоків 07–09: `Emitter State`, `Spawn Burst Instantaneous`, `Spawn Rate`, `Initialize Particle`, `Initialize Ribbon`, `Shape Location`, `Add Velocity`, `Curl Noise Force`, `Drag`, `Gravity Force`, `Solve Forces and Velocity`, orientation/scale/color modules, Sprite/Mesh/Ribbon Renderers.
- scalability/profile: Niagara Effect Type/System settings, bounds і H/M/L asset/profile selection.

**Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| User parameter | Type | Default |
|---|---|---|
| `User.ElementIndex` | Int32 | `0` |
| `User.PrimaryColor` | Linear Color | Ember `(1,.12,.02,1)` |
| `User.SecondaryColor` | Linear Color | `(1,.75,.08,1)` |
| `User.Direction` | Vector | `(1,0,0)` |
| `User.Speed` | Float | `1200 cm/s` project start |
| `User.Scale` | Float | `1` |
| `User.Intensity` | Float | `1` |
| `User.HitNormal` | Vector | `(0,0,1)` |
| flight bounds | measured | includes all motif/trail variants |

Projectile speed — gameplay starting value, а не універсальна рекомендація.

## 14. Очікуваний результат кожного етапу

- Shared graybox доводить усі phases і hit data.
- Ember читається granular/fast навіть без color.
- Frostglass читається faceted/lingering.
- Stormpulse читається elastic/pulsed.
- Один actor перемикає elements без stale values.
- Impacts вирівнюються за surfaces і не перебільшують gameplay radius.
- H/M/L зберігають body/path/contact.
- Mixed stress capture виконує declared project target.

## 15. Самостійна вправа

### `EX-L11-02-A` — Четвертий оригінальний element

Створіть Stone/Sand variant із новим material instance, однією власною mesh або texture, відмінними body/trail/impact/decay і тією самою Blueprint/User schema. Він має лишатися читабельним без hue та отримати повні rubric, H/M/L і breakdown.

[Повне рішення A](../EXERCISE_ANSWERS/L11-02_elemental_projectile_kit_portfolio_piece_answers.md#ex-l11-02-a)

## 16. Додаткова складніша вправа

### `EX-L11-02-B` — Audit variant parity і pooling

Виміряйте кожен variant окремо й у mixed test. Виправте один highest-cost layer, один stale pooled parameter і один gameplay-radius mismatch без зменшення required cues. Подайте зіставні знімки до й після і оновлені category scores.

[Повне рішення B](../EXERCISE_ANSWERS/L11-02_elemental_projectile_kit_portfolio_piece_answers.md#ex-l11-02-b)

## 17. Три рівні підказок

### Для `EX-L11-02-A`

- **Hint 1:** оберіть verbs до colors: dense, shedding, heavy, settling.
- **Hint 2:** повторно використовуйте schema/Blueprint, але не exact Niagara layer values.
- **Hint 3:** зробіть body faceted chunk, trail — sparse granular wake, impact — low radial burst і settling residue.

### Для `EX-L11-02-B`

- **Hint 1:** запустіть той самий route `12-flight/6-impact` для кожного variant.
- **Hint 2:** чергуйте `ElementIndex` під час кожної activation, щоб виявити stale values.
- **Hint 3:** порівняйте фактичний ігровий радіус debug із ring/particle boundary; виправляйте VFX scale/data, а не приховано collision.

## 18. Типові помилки

- variants відрізняються лише tint;
- flight Niagara симулює direction незалежно від gameplay actor;
- impact використовує component position після його переміщення;
- `HitNormal` ігнорується;
- trail приховує body/target;
- pooled actor зберігає попередній `ElementIndex`/color;
- один variant коштує значно більше без evidence;
- cinematic blur приховує segmentation;
- external assets не credited;
- claim «console optimized» не має console/target measurement.

## 19. Troubleshooting

| Симптом | Перевірка root cause | Виправлення |
|---|---|---|
| body відстає від actor | attach/tick/space | використати component attachment і documented update order |
| impact на неправильній surface | `HitPoint`/`HitNormal` | передати actual hit data до actor reset |
| element tint застарів | pooled setters | установити кожен value до `Activate` |
| variants не відрізняються у grayscale | silhouette/motion/decay | переробити verbs, а не saturation |
| Storm домінує за cost | trail rate/curl/coverage | ізолювати й зменшити nonessential motif |
| visible ring більший за damage | scale/radius contract | вирівняти VFX boundary за gameplay debug |

## 20. Performance considerations

- Attached flight systems множаться з projectile concurrency.
- `Trail Rate×Lifetime` керує ribbon points.
- Persistent mesh body/material може бути дешевшим або дорожчим за translucent core залежно від content; вимірюйте.
- Impacts створюють короткі concurrency spikes.
- Pooling зменшує частину creation churn лише за правильного reset lifecycle/parameters.
- Effect Types/scalability можуть групувати systems, але thresholds мають походити з target measurements.
- H/M/L зберігають projectile location/path/contact і ніколи не вилучають gameplay information.

## 21. Запитання для самоперевірки

1. Які чотири phases має містити кожен variant?
2. Чому hue-only недостатньо?
3. Хто володіє projectile movement?
4. Які data має передати hit?
5. Як перевірити pooling?
6. Що означає variant parity?
7. Які cues має зберегти Low?
8. Який performance scenario обов’язковий?
9. Чого має уникати reference analysis?
10. Чи може ця piece гарантувати працевлаштування?

## 22. Відповіді

1. Launch, flight body, trail та impact.
2. Відсутня відмінна behavior/silhouette/timing identity.
3. Gameplay projectile/Blueprint movement, а не competing visual simulation.
4. Impact point, normal, incoming direction і element/profile values.
5. Багаторазово чергувати variants на reused actor і перевірити кожен User value/lifecycle.
6. Порівнювана quality cues та measured target cost із поясненими відмінностями.
7. Body visibility, path і contact location/timing.
8. Один baseline та `12 flights/6 impacts`, окремо й mixed, за fixed conditions.
9. Proprietary assets, frame tracing і recognizable bundled copying.
10. Ні.

## 23. Self-check checklist

- [ ] Creative brief/reference ethics записані.
- [ ] Shared actor і parameter schema працюють.
- [ ] Усі phases існують для всіх variants.
- [ ] Variants проходять grayscale identity.
- [ ] Hit data і pooling проходять десять cycles.
- [ ] H/M/L зберігають cues.
- [ ] Performance parity/before-after зафіксовано.
- [ ] Mandatory breakdown завершено.
- [ ] Rubric `≥80` і всі floors.
- [ ] Немає Beta/proprietary/unverifiable claim.

## 24. Mastery criteria

Ви можете пояснити shared і variant architecture, простежити ігрові дані через кожну phase, довести три non-hue identities, виправити pooling/hit/performance defects і подати повний чесний опис набору на `≥80/100` із category floors.

## 25. Підсумок

Друга piece демонструє reuse: один gameplay contract керує трьома візуально й поведінково різними projectile experiences. Cohesion, hit truth, pooling, parity і presentation є частиною effect, а не пізнім доповненням.

## 26. Зв’язок із наступними уроками

[11.03](03_character_aura_transformation_portfolio_piece.md) переходить від short-lived world projectiles до character-bound effect `activation/loop/deactivation`, де домінують persistent readability і per-instance control.

## 27. Офіційні джерела

- [Spawn System at Location](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystematLocation)
- [Spawn System Attached](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystemAttached)
- [Set Niagara Variable Vector3](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SetNiagaraVariable_Vector3)
- [UNiagaraComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraComponent)
- [Performance Budgeting Using Effect Types](https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-budgeting-using-effect-types-in-niagara-for-unreal-engine)
- [Niagara Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-debugger-for-unreal-engine)
- [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Ethical reference/variant-principle matrix.
2. Timing/layer board `3×4 launch/body/trail/impact`.
3. Original textures/meshes і channel sheets.
4. Shared material function і graphs/values трьох instances.
5. Повні Niagara stacks і variant parameter table.
6. Blueprint launch/hit/pooling/data diagram.
7. Grayscale і gameplay-camera variant comparison.
8. H/M/L і дані про продуктивність до й після captures.
9. Authorship/limitations і final case-study layout.
