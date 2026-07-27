# 11.04 — Portfolio Piece 4: Character ultimate / boss ability

## 1. Назва

**`Rift Crown` — оригінальна багатоетапна ultimate/boss ability з правдивою gameplay telegraph-зоною для third-person PC/console.**

## 2. Результат уроку

Ви завершите четверту portfolio piece:

- п’ять фаз `Telegraph → Charge → Execute → Impact → Residue`;
- VFX boundary, що точно відповідає переданому ігровому радіусу;
- reusable Blueprint orchestration і Niagara User Parameter contract;
- окремі Niagara systems/stacks для кожної функціональної фази;
- High/Medium/Low variants зі збереженою telegraph/contact truth;
- перевірку readability проти персонажів, оточення та інших combat effects;
- зібрані докази продуктивності у baseline і stress-сценарії;
- gameplay, neutral-view та обов’язковий technical breakdown;
- чесне 100-бальне самооцінювання із category floors.

Результати: `NS_P11_Ult_Telegraph`, `NS_P11_Ult_Charge`, `NS_P11_Ult_Execute`, `NS_P11_Ult_Impact`, `NS_P11_Ult_Residue`, `M_P11_Ult_Master`, `BP_P11_UltimateController`, `L_P11_Ult_Portfolio`, `LS_P11_Ult_Capture`.

## 3. Орієнтовний час

**10 годин: 1 година теорії / 9 годин практики.**

- 60 хв — brief, ethical reference analysis, gameplay/timing contract;
- 75 хв — monochrome telegraph/phase graybox;
- 150 хв — Niagara systems і власні textures/meshes;
- 75 хв — Blueprint phase/data integration;
- 90 хв — M/S practice: telegraph, shock-front і residue material polish;
- 75 хв — H/M/L, overlap readability і target profiling;
- 75 хв — captures, breakdown і самооцінювання.

M/S ledger: **1.5 години; cumulative 5/6 годин блоку**.

## 4. Prerequisites

- `G10`;
- 08.07 Blueprint integration; 09.01 impact, 09.02 projectile, 09.03/09.08 area/telegraph, 09.04 beam за потреби;
- 10.01–10.05 gameplay integration, pooling, profiling, scalability і debugging;
- власний або ліцензований character/animation/environment із source/role disclosure;
- власні VFX textures, meshes, materials із блоків 04–06;
- лише core Unreal Engine 5.8/Niagara; **без Beta або Experimental dependency**.

## 5. Нові терміни

- **Gameplay telegraph** — попереджувальний cue, який показує де й коли відбудеться небезпека.
- **Hazard boundary parity** — візуальна межа та фактичний gameplay radius збігаються в межах задокументованої tolerance.
- **Phase contract** — дані, duration і exit condition кожної фази.
- **Commit frame** — момент, після якого ability неможливо безпечно скасувати без окремого gameplay правила.
- **Shock front** — коротка рухома межа impact, а не тривалий великий flash.
- **Residue** — післядія, яка підтверджує місце події, але не вдає активну небезпеку, якщо gameplay уже завершився.
- **Combat stack test** — перевірка ability разом із типовими ambient/combat VFX.
- **Cue preservation** — обов’язкові telegraph, direction, contact і end-state залишаються в кожному quality tier.
- **Critical gameplay error** — VFX повідомляє неправильний radius, timing, direction або active state.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Ultimate/boss ability — це перевірка візуальної ієрархії, gameplay truth, orchestration і cost під піковим overlap. Великий ефект легко зробити гучним, але складно зробити чесним: гравець повинен завчасно прочитати межу, момент удару та кінець небезпеки, а команда — мати можливість змінити radius, duration, colors і tier без ручного перебудовування.

Ця piece може показати production-relevant мислення, але завершення роботи або курсу **не гарантує працевлаштування**. Не використовуйте твердження, які не можете підтвердити capture, graph або profiling evidence.

## 7. Теорія простими словами

Будуйте ability як послідовність запитань до гравця:

1. **Telegraph:** де небезпечно і скільки часу лишилося?
2. **Charge:** хто/що спричиняє подію?
3. **Execute:** який напрямок і момент commit?
4. **Impact:** де стався hit?
5. **Residue:** що лишилося і чи зона ще небезпечна?

Найбільший layer не завжди найважливіший. До commit найважливіша межа й countdown; на contact — короткий impact; після нього — швидке повернення control до gameplay. Кожен декоративний layer підпорядковується цій ієрархії.

## 8. Детальні технічні пояснення

### Creative brief

`Rift Crown` — area ultimate, де boss формує над ареною ламану корону, стягує її сегменти до центру та розколює землю:

- `Telegraph 1.5 s`: чітка кругла boundary, чотири inward ticks і спокійне затемнення центру;
- `Charge .8 s`: crown shards піднімаються над caster, frequency прискорюється;
- `Execute .25 s`: вертикальний compression streak і коротка пауза перед contact;
- `Impact .4 s`: низький radial shock front, central column і directional shards;
- `Residue 2.0 s`: розломи/іскри згасають; якщо gameplay hazard завершився, residue візуально не виглядає активною damage zone;
- ігровий задум: radius і contact читаються з 5–20 m camera distance на темному, середньому й світлому фоні.

### Technical requirements

- `BP_P11_UltimateController` керує enum/state `Idle`, `Telegraph`, `Charge`, `Execute`, `Impact`, `Residue`, `Complete/Cancelled`.
- Gameplay logic передає `Origin`, `SurfaceNormal`, `AbilityDirection`, `HazardRadius`, phase durations, team/profile; VFX їх не вигадує.
- `NS_P11_Ult_Telegraph` використовує exact `User.HazardRadius` для boundary mesh/material.
- User contract: `User.PrimaryColor`, `User.SecondaryColor`, `User.Scale`, `User.Intensity`, `User.Phase01`, `User.HazardRadius`, `User.AbilityDirection`, `User.SurfaceNormal`, `User.TeamIndex`.
- phase transition запускається одним owner; заборонені дубльовані timers/callbacks.
- impact transform походить із gameplay origin/trace normal, а не з capture-only hand placement.
- High/Medium/Low зберігають boundary, countdown acceleration, commit direction, contact і end-state.
- no compile warnings, stale parameters, bounds pop, depth-fighting, orphan residue або tier timing drift.

### Constraints

- target — real-time PC/console gameplay, не offline cinematic-only shot;
- telegraph boundary має відповідати gameplay radius; tolerance визначається й перевіряється в project units;
- effect не приховує player/boss pose, exit route, camera або інші lethal cues;
- flash/contrast має враховувати photosensitivity/accessibility direction проєкту;
- gameplay camera є primary acceptance view;
- усі VFX textures, meshes, material graphs і Niagara logic — власні;
- character, animation, sound або environment не вашого авторства мають lawful license і credit;
- заборонені ripped/extracted/proprietary assets та впізнаване копіювання franchise ability;
- без Beta/Experimental plugins, Niagara Fluids або feature, яку не можна відтворити/запакувати на target;
- один reusable controller, а не hand-authored phase placement для ролика.

### Scope boundary

In scope: five visual phases, radius/timing/data contract, Blueprint VFX orchestration, original materials/Niagara assets, H/M/L, combat-overlap profiling і breakdown. Out of scope: boss AI, damage/collision authority, encounter design, network replication, animation/sound/environment authoring; ці systems лише передають VFX authoritative data й окремо credited.

### Ethical original reference analysis

Зберіть 4–6 lawful references із різних доменів: fracture patterns, eclipse/crown silhouettes, stage-light timing, dust shock fronts, readable sports-field markings. Запишіть source URL, creator, access date, принцип і те, що не копіюєте. Аналізуйте:

- коли boundary стає однозначною;
- як frequency повідомляє countdown;
- як вертикальна charge пов’язана з radial impact;
- як короткий contrast peak не перекриває exit route;
- як residue відрізняється від активної hazard.

Не трасуйте кадри, не копіюйте named ability, exact glyph, palette+silhouette+timing bundle, звук або proprietary textures/meshes. Побудуйте нову phase/layer map із абстрактних принципів.

### Production milestones

| Milestone | Exit criterion |
|---|---|
| M0 Brief/gameplay contract | original brief, source/authorship log, radius/timing data, risk list |
| M1 Telegraph graybox | monochrome boundary/ticks match debug radius and timing |
| M2 Phase graybox | five phases readable without color/post-process |
| M3 Integration | one controller/data contract runs, cancels and resets correctly |
| M4 Art/readability | own assets, camera/background/combat-stack pass |
| M5 Performance | fixed baseline/stress before-after and H/M/L |
| M6 Presentation | gameplay/neutral captures and mandatory breakdown complete |

### Production checklist

- [ ] telegraph boundary збігається з gameplay debug radius;
- [ ] countdown/commit/contact/end мають окремі cues;
- [ ] phase durations надходять із одного contract;
- [ ] cancel до commit очищує systems; post-commit path задокументований;
- [ ] surface normal і ability direction перевірено;
- [ ] residue не вдає active hazard після її завершення;
- [ ] camera, characters та exit route залишаються видимими;
- [ ] H/M/L зберігають усі critical cues;
- [ ] external assets credited, claims перевірювані;
- [ ] captures відповідають submitted build/assets.

### 100-point self-review rubric and category floors

| Category | Points | Floor |
|---|---:|---:|
| Creative brief, originality, reference ethics | 15 | 9 |
| Telegraph/timing/gameplay readability | 20 | 12 |
| Niagara/material/asset technical quality | 20 | 12 |
| Blueprint phase/data integration and reuse | 15 | 9 |
| Performance, combat overlap and H/M/L | 15 | 9 |
| Presentation, breakdown and authorship | 15 | 9 |
| **Total** | **100** | **80 overall** |

Кожна категорія має досягти floor. Critical fail: неправильний radius/timing/active-state cue, прихований exit route, proprietary/uncredited asset, відсутній working tier або inability to explain the architecture.

### Performance requirements with target measurement

До optimization зафіксуйте target hardware, build, resolution, graphics/scalability profile й intended frame-time target. Виконайте:

- baseline: один повний cast без інших VFX;
- gameplay: один cast із character movement/camera route;
- stress: один ultimate, вісім типових ambient/combat effects і до трьох overlapping residue instances;
- phase isolation: окремий capture Telegraph/Charge/Impact для пошуку bottleneck;
- High/Medium/Low за однакових умов;
- warmed systems/shaders, однакові duration, camera та spawn schedule.

Зберіть `stat unit`, `stat gpu`/GPU profiler where available, Niagara Debugger, Shader Complexity/Quad Overdraw і Unreal Insights при CPU hitch. Порівнюйте captured ranges/representative frames і називайте перший bottleneck. Pass — declared target виконується без втрати critical cues, visible culling, bounds pop або warnings. **Не вигадуйте універсальні particle, draw-call чи millisecond budgets.**

### Presentation requirements

- 10–15 s clean gameplay clip від початку telegraph до кінця residue;
- neutral front/side/top captures із visible gameplay-radius debug comparison;
- real-time phase capture; slow playback лише з label `slowed`;
- dark/mid/bright background і combat-overlap proof;
- default plus H/M/L comparison;
- показники продуктивності до й після за однакових умов;
- captions: name, engine build, target, role, tools, gameplay radius, third-party assets;
- cinematic close-up — додатковий, не gameplay/performance proof.

### Mandatory breakdown materials list

1. ethical reference-principles board і source/authorship log;
2. layer/timing map для всіх п’яти phases і commit/cancel;
3. own textures, meshes, channel/atlas sheets;
4. material graphs/functions/instances і radius/phase parameter contract;
5. повні Niagara stacks кожної phase;
6. Blueprint gameplay-data, state, spawn і reset diagram;
7. показники продуктивності до й після за однакових умов;
8. High/Medium/Low table зі збереженими cues;
9. limitations, accessibility notes і next iteration.

### Completion criteria / Definition of Done

Piece завершена лише коли три casts поспіль відповідають ігровому радіусу/timing, cancel/reset працює, residue чесно показує end-state, combat stack і H/M/L pass critical-cue parity, declared target виміряно, score `≥80/100` з усіма floors, assets/claims attributable, а mandatory breakdown повний.

## 9. Візуальні або математичні приклади

Phase map:

| Phase | Duration | Dominant information | Max decorative priority |
|---|---:|---|---|
| Telegraph | `1.5 s` | radius + remaining time | low |
| Charge | `.8 s` | source + escalation | medium |
| Execute | `.25 s` | commit + direction | low/brief |
| Impact | `.4 s` | contact + shock front | high/short |
| Residue | `2.0 s` | location + inactive/active truth | low |

Scale boundary обчислюється з authored diameter mesh:

```text
if MeshDiameterCm = 200:
UniformScale = (2 × HazardRadiusCm) / MeshDiameterCm
```

Countdown:

```text
Phase01 = clamp(Elapsed / TelegraphDuration, 0, 1)
tickFrequency = lerp(StartFrequency, EndFrequency, Phase01²)
```

Числа — starting profile цього проєкту; ігровий контракт і measured target мають пріоритет.

## 10. Controlled experiments

1. Покажіть тільки boundary і gameplay debug circle; виміряйте parity на трьох radii.
2. Вимкніть color/post-process; визначте кожну phase за shape/motion/timing.
3. Зсуньте impact ±2–3 frames; поверніть його до gameplay contact.
4. Скасуйте ability на 25%, 75% telegraph і після commit; перевірте визначені paths.
5. Нахиліть surface normal; boundary/impact мають лягти на surface відповідно до contract.
6. Додайте вісім combat effects; telegraph і exit route лишаються видимими.
7. Порівняйте residue з active hazard debug; при неактивній hazard воно не повинно виглядати небезпечним.
8. Порівняйте H/M/L та до й після із тією самою camera/spawn schedule.

## 11. Покрокова керована практика

### Blueprint phase architecture

```text
BP_P11_UltimateController
├─ State: Idle/Telegraph/Charge/Execute/Impact/Residue/Complete/Cancelled
├─ CastGenerationId
├─ Gameplay contract: Origin, SurfaceNormal, Direction, Radius, Durations, Profile
├─ StartAbility(Data)
│  ├─ validate contract and increment CastGenerationId
│  ├─ set every Niagara parameter before activation
│  └─ enter Telegraph
├─ AdvancePhase(ExpectedState, GenerationId)
│  ├─ reject stale/duplicate callbacks
│  ├─ stop/reset previous phase
│  └─ activate next phase once
└─ CancelAbility()
   ├─ pre-commit: clean exit cue and reset
   └─ post-commit: follow documented gameplay rule
```

Phase transitions повинні походити з gameplay timeline/data owner. Niagara `Emitter State` завершує візуальний emitter, але не є єдиним gameplay timer.

### `NS_P11_Ult_Telegraph`

```text
Emitter Boundary
  Burst 1 → Initialize Particle → Initial Mesh Orientation
  → Scale Mesh Size → Dynamic Material Parameters → Mesh Renderer
Emitter CountdownTicks
  Spawn Rate driven by Phase01 → Initialize → Shape Location (ring)
  → inward velocity/Drag/Solve → Scale Color/Size → Sprite/Mesh
Emitter CenterVeil
  Burst 1 persistent → Initialize → Scale Color/Size → Sprite/Mesh
```

Boundary використовує `User.HazardRadius`; edge material лишається видимим на трьох backgrounds. Alpha `CenterVeil` достатньо низька, щоб зберегти character/exit route.

### `NS_P11_Ult_Charge`

```text
Emitter CrownShards
  Burst 8 → Shape Location (cylinder/ring) → Point Attraction Force
  → Vortex Force → Drag → Solve → Mesh Renderer
Emitter VerticalThreads
  Spawn Rate 18/s → Initialize → +Z velocity → Curl Noise/Drag/Solve → Sprite/Ribbon
Emitter ChargeCore
  Burst 1 persistent → Dynamic Material Parameters from Phase01 → Mesh/Sprite
```

Charge concentrates toward caster/origin; it не розширює hazard boundary. Залиште camera center і boss pose readable.

### `NS_P11_Ult_Execute`

```text
Emitter Compression
  Burst 1 → Initialize → Scale Mesh Size/Color quickly inward → Mesh Renderer
Emitter DirectionStreaks
  Burst 12 → initialize along AbilityDirection/normal → velocity → Drag/Solve → Sprite
```

Duration `.25 s`; long opaque flash відсутній. Direction і commit frame чітко читаються з ігрової камери.

### `NS_P11_Ult_Impact`

```text
Emitter ShockFront
  Burst 1 → Initialize → Scale Mesh Size from center to HazardRadius → Mesh Renderer
Emitter Column
  Burst 1 → Initialize → Scale Sprite/Mesh Size and Color → Sprite/Mesh
Emitter Shards
  Burst 32 → Shape Location → Add Velocity in Cone/normal
  → Gravity Force/Drag/Solve → Initial/Update Mesh Orientation → Mesh
Emitter DustAccent
  Burst 18 → Shape Location → radial velocity → Drag/Solve → Sprite
```

Shock front lifetime `.4 s`, reaches boundary only if gameplay art direction supports it, і швидко clears. Collision/damage не симулюються Niagara.

### `NS_P11_Ult_Residue`

```text
Emitter FractureDecalLikeMesh
  Burst 1 → Initialize → Dynamic Material Parameters → Scale Color → Mesh Renderer
Emitter ResidualSparks
  Spawn Rate 6/s with finite emitter duration → velocity → Drag/Solve → Sprite
Emitter SmokeWisps
  Spawn Rate 3/s finite → Curl Noise/Drag/Solve → Scale Color/Size → Sprite
```

Якщо gameplay hazard уже неактивна, material edge і pulse зникають; residue має інший value/frequency language. Врахуйте ground depth offset і slope.

### H/M/L policy

| Cue | High | Medium | Low |
|---|---|---|---|
| boundary/countdown | full, crisp | full, simplified ticks | full boundary + minimal ticks |
| charge/commit | crown+threads+compression | fewer shards/threads | core+compression |
| impact/contact | shock+column+shards+dust | shock+column+reduced debris | shock+compact contact |
| residue/end-state | fracture+sparks+wisps | fracture+few sparks | short fracture/fade |
| material features | full measured set | feature reductions | no nonessential distortion |
| phase timing/radius | identical | identical | identical |

Остаточні reductions визначайте profiling; таблиця не є universal budget.

## 12. Точні назви вузлів, модулів і налаштувань UE

- Blueprint: `Spawn System at Location`, `Spawn System Attached`, `Activate`, `Deactivate`, `Reset System`, `Set Niagara Variable (Float/Linear Color/Vector3/Int32)`, `Line Trace by Channel` за contract;
- Niagara: `Emitter State`, `Spawn Rate`, `Spawn Burst Instantaneous`, `Initialize Particle`, `Shape Location`, `Add Velocity`, `Add Velocity in Cone`, `Point Attraction Force`, `Vortex Force`, `Curl Noise Force`, `Gravity Force`, `Drag`, `Solve Forces and Velocity`, `Initial Mesh Orientation`, `Update Mesh Orientation`, `Scale Color`, `Scale Sprite Size`, `Scale Mesh Size`, `Dynamic Material Parameters`;
- renderers: `Sprite Renderer`, `Mesh Renderer`, `Ribbon Renderer` за обґрунтованої потреби;
- profiling: `Niagara Debugger`, `stat unit`, `stat gpu`, `ProfileGPU`, `Unreal Insights`, Shader Complexity/Quad Overdraw;
- scalability: Niagara Effect Type/System scalability, culling і фіксовані межі після вимірювання.

Exact labels, typed parameter setters, trace pins, orientation bindings і Effect Type options: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Parameter | Type | Default |
|---|---|---|
| `User.PrimaryColor` | Linear Color | `(.32,.06,1,1)` |
| `User.SecondaryColor` | Linear Color | `(1,.22,.04,1)` |
| `User.Scale` | Float | `1` |
| `User.Intensity` | Float | `1` (`.5–1.5`) |
| `User.Phase01` | Float | `0–1` |
| `User.HazardRadius` | Float | `450 cm` project start |
| `User.AbilityDirection` | Vector | normalized gameplay direction |
| `User.SurfaceNormal` | Vector | trace/gameplay normal |
| `User.TeamIndex` | Int32 | `0` |
| phase durations | Float | `1.5/.8/.25/.4/2.0 s` |
| impact shards/dust | Int32 | `32/18` High start |

Radius, durations і counts — project starting profile, не універсальна рекомендація.

## 14. Очікуваний результат кожного етапу

- Brief: original phase language, lawful sources і gameplay contract записані.
- Telegraph: boundary збігається з radius і читається без color.
- Charge/Execute: source, escalation, direction і commit однозначні.
- Impact: contact короткий, сильний і не приховує exit route.
- Residue: location лишається, active-state truth не спотворюється.
- Integration: cast/cancel/reset повторюються без stale phases.
- H/M/L: однакові radius, timing і critical cues.
- Presentation: gameplay, neutral, breakdown і докази продуктивності узгоджені.

## 15. Самостійна вправа

### `EX-L11-04-A` — Original player ultimate

Створіть `Sunken Compass`: directional player ultimate з новою shape/palette/timing language, але повним five-phase contract. Замість круглої boss hazard використайте сектор/напрямок, який точно відповідає gameplay shape. Створіть власні texture/mesh, H/M/L, profiling і complete breakdown.

[Повне рішення A](../EXERCISE_ANSWERS/L11-04_character_ultimate_boss_ability_portfolio_piece_answers.md#ex-l11-04-a)

## 16. Додаткова складніша вправа

### `EX-L11-04-B` — Hazard/readability/performance remediation

Відтворіть або знайдіть чотири weaknesses: boundary mismatch, late contact, exit-route occlusion і High-tier overlap bottleneck. Усуньте першопричини, не змінюючи ігрові дані для красивішого capture. Надайте debug parity, зіставні матеріали до й після, final H/M/L і оновлений rubric.

[Повне рішення B](../EXERCISE_ANSWERS/L11-04_character_ultimate_boss_ability_portfolio_piece_answers.md#ex-l11-04-b)

## 17. Три рівні підказок

### Для `EX-L11-04-A`

- **Hint 1:** спочатку визначте gameplay shape, commit time і exit direction, лише потім style.
- **Hint 2:** зробіть shape читабельною без color: wedge boundary, inward compass ticks, directional compression.
- **Hint 3:** передавайте angle/range/direction як data; не підганяйте mesh вручну під один camera shot.

### Для `EX-L11-04-B`

- **Hint 1:** overlay debug geometry поверх VFX із fixed top/front views.
- **Hint 2:** timing перевіряйте від ігрової події, а occlusion — desaturated gameplay camera.
- **Hint 3:** ізолюйте phase у profiler; спочатку зменшіть coverage/lifetime/redundant renderer, зберігши boundary/contact.

## 18. Типові помилки

- telegraph красива, але не відповідає damage radius;
- boundary з’являється запізно або зникає до commit;
- impact запускається від cinematic timeline, не gameplay event;
- residue виглядає активною hazard після завершення damage;
- усі phases — однаковий ring різного scale;
- великий opaque flash приховує exit route/caster;
- H/M/L змінюють duration/radius;
- fixed bounds обрізають crown/shock front;
- performance claim зроблено без combat overlap;
- запозичена branded ability або uncredited assets.

## 19. Troubleshooting

| Симптом | Перша перевірка | Мінімальне виправлення |
|---|---|---|
| boundary не збігається | mesh diameter, radius units, transform | обчислити scale з contract і перевірити debug overlay |
| contact запізнюється | gameplay commit/hit event | запускати Impact від authoritative event |
| effect вертикальний на slope | SurfaceNormal/orientation | align local normal axis до переданої normal |
| стара phase з’являється після cancel | duplicated timer/generation | один owner, reject stale callback, reset systems |
| exit route зникає | alpha coverage/value hierarchy | прибрати центральну завісу, скоротити flash/decay |
| stress spike | phase isolation | знайти renderer/material/emitter bottleneck і змінити саме його |
| Low нечитабельний | cue checklist | повернути boundary/countdown/contact, прибрати декор |

## 20. Performance considerations

- Велике покриття екрана прозорими елементами може домінувати над particle count.
- Impact створює короткий concurrency peak; residue створює overlap tail.
- Mesh shard cost включає triangles, materials, shadows, orientation update і lifetime.
- Rate×Lifetime для residue визначає live count; finite emitter duration обов’язкова.
- Blueprint timers/components і parameter sets також множаться під concurrent casts.
- Fixed bounds мають охоплювати crown, shock front і slope transforms без надмірної зони.
- H/M/L спрощують декор/material features, але не radius, timing, telegraph або contact.
- Beauty capture/MRQ не замінює profiling у target gameplay build.

## 21. Запитання для самоперевірки

1. Які п’ять фаз має `Rift Crown`?
2. Хто є джерелом `HazardRadius`?
3. Чому residue не повинно виглядати як активна hazard після її завершення?
4. Які cues зберігає Low?
5. Як перевірити boundary parity?
6. Чому Niagara не має самостійно визначати gameplay damage?
7. Що фіксується для performance comparison?
8. Який stress-сценарій обов’язковий?
9. Що заборонено в reference/assets?
10. Чи гарантує ця piece роботу?

## 22. Відповіді

1. Telegraph, Charge, Execute, Impact, Residue.
2. Authoritative gameplay/ability contract.
3. Інакше VFX повідомляє неправдивий active state.
4. Boundary, countdown/escalation, commit direction, contact і end-state.
5. Порівняти VFX із gameplay debug geometry на кількох radii/views.
6. VFX відображає gameplay truth, а не є джерелом damage logic.
7. Hardware, build, resolution, profile, camera, duration, spawn schedule і warmed state.
8. Один ultimate + вісім combat/ambient effects + до трьох overlapping residue.
9. Ripped/proprietary assets, frame tracing, recognizable ability та bundled copying.
10. Ні.

## 23. Self-check checklist

- [ ] Creative brief, constraints, етична добірка референсів і ігровий контракт існують.
- [ ] Five phases читаються без color.
- [ ] Boundary відповідає debug radius на трьох значеннях.
- [ ] Commit/contact/end-state синхронні з gameplay.
- [ ] Cancel/reset не залишають stale phase.
- [ ] Gameplay camera й exit route читабельні в combat stack.
- [ ] H/M/L зберігають усі critical cues.
- [ ] Baseline/stress і до й після виміряні.
- [ ] Mandatory breakdown повний.
- [ ] Rubric `≥80`, усі floors, жодного critical fail.

## 24. Mastery criteria

Ви можете перетворити gameplay ability contract на читабельну багатоетапну VFX orchestration, довести radius/timing truth, знайти й виправити overlap bottleneck, зберегти critical cues у H/M/L і представити complete чесний опис проєкту на `≥80/100` з category floors.

## 25. Підсумок

Четверта piece демонструє найскладнішу ієрархію блоку: telegraph і gameplay truth важливіші за spectacle. `Rift Crown` об’єднує phase ownership, reusable data, authored Niagara/material layers, combat readability, performance і evidence-driven presentation.

## 26. Зв’язок із наступними уроками

[11.05](05_portfolio_breakdowns_reel_and_case_studies.md) перетворює всі чотири завершені pieces на перевірювані описи проєктів, reel і delivery package, а також містить block assessment без додаткових годин.

## 27. Офіційні джерела

- [Overview of Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-niagara-effects-for-unreal-engine)
- [Spawn System at Location](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystematLocation)
- [UNiagaraComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraComponent)
- [Controlling Niagara Systems](https://dev.epicgames.com/documentation/en-us/unreal-engine/controlling-your-niagara-systems)
- [Performance Budgeting Using Effect Types](https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-budgeting-using-effect-types-in-niagara-for-unreal-engine)
- [Niagara Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-debugger-for-unreal-engine)
- [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara)
- [Introduction to Performance Profiling and Configuration](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Ethical reference-principles/source board.
2. Five-phase map timing/layer/commit/cancel.
3. Radius debug overlay для трьох values і views.
4. Власні texture/mesh/channel sheets.
5. Material graphs/instances і parameter table.
6. Повні Niagara stacks для всіх phases.
7. Blueprint diagram gameplay-data/state/reset.
8. Gameplay combat-stack, H/M/L і знімки до й після.
9. Authorship, limitations, accessibility notes і final case-study layout.
