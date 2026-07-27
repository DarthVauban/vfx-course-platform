# 11.01 — Portfolio Piece 1: Stylized melee combo

## 1. Назва

**`Resonant Edge` — оригінальне стилізоване melee-комбо з трьох ударів для third-person PC/console gameplay.**

## 2. Результат уроку

Ви завершите першу portfolio piece:

- anticipation і три різні моменти contact;
- дві slash-дуги, weapon ribbon trail, contact impacts і фінальний ground response;
- синхронізацію через Animation Notifies/Notify State та Blueprint;
- reusable contract Niagara/User Parameters;
- High/Medium/Low variants;
- зібрані докази продуктивності;
- gameplay, neutral-view і technical breakdown package;
- чесне 100-бальне самооцінювання із category floors.

Результати: `NS_P11_Melee_WeaponTrail`, `NS_P11_Melee_SlashArc`, `NS_P11_Melee_Impact`, `NS_P11_Melee_GroundResponse`, `BP_P11_MeleeComboController`, `L_P11_Melee_Portfolio`, `LS_P11_Melee_Capture`.

## 3. Орієнтовний час

**10 годин: 1 година теорії / 9 годин практики.**

- 60 хв — brief, ethical reference analysis і timing plan;
- 60 хв — monochrome gameplay graybox;
- 90 хв — Animation Notify/Blueprint integration;
- 150 хв — Niagara layers, materials і authored assets;
- 60 хв — M/S practice: slash/impact material polish;
- 90 хв — H/M/L, profiling і remediation;
- 90 хв — captures, breakdown і rubric.

M/S ledger: **1 година; cumulative 1/6 годин блоку**.

## 4. Prerequisites

- `G10`;
- 09.01 impact, 09.05 slash, 09.06 trail;
- gameplay integration, pooling/scalability і profiling із блоку 10;
- власні або ліцензовані character, animation та environment із точним source/role disclosure;
- власні VFX textures, meshes і materials із блоків 04–06;
- лише core Unreal Engine 5.8/Niagara; **без Beta або Experimental dependency**.

## 5. Нові терміни

- **Portfolio piece** — завершена й пояснювана робота з context, evidence та authorship record.
- **Contact frame** — gameplay-момент реєстрації hit, з яким має збігатися impact response.
- **Anticipation** — cue перед дією, що готує direction і weight.
- **Ground response** — effect, розміщений та орієнтований за ground trace під час важкого contact.
- **Notify State** — timed animation event із begin/end window.
- **Gameplay readability** — гравець читає direction, timing, hit і hazard через ігрову камеру.
- **Authorship statement** — точний перелік створеного вами й використаних external assets.
- **Category floor** — мінімальний бал категорії rubric; polish не може приховати критичну слабкість.
- **Neutral capture** — non-cinematic test view, який показує timing, layers і defects.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Melee-комбо одночасно перевіряє майже всі базові обов’язки real-time VFX artist: timing, silhouette, sockets, локальний/світовий простір, contact data, material/Niagara architecture і вартість повторного gameplay. Відполірований beauty shot без точного contact або reusable integration не є production-ready доказом.

Ця piece може показати релевантні професійні навички, але завершення її або курсу **не гарантує працевлаштування**. Обмежуйте claims лише роботою й evidence, які можете показати.

## 7. Теорія простими словами

Сприймайте комбо як три речення:

1. перший hit задає direction;
2. другий змінює direction і прискорює rhythm;
3. третій завершує фразу через weight і ground response.

Кожному реченню потрібні anticipation, action, contact і decay. VFX має відображати gameplay truth: trail показує шлях зброї, slash підсилює direction, impact з’являється в hit location, а ground ring орієнтується за surface normal. Більше layers не компенсує неправильний timing.

## 8. Детальні технічні пояснення

### Creative brief

`Resonant Edge` — оригінальне комбо з теплим металевим core і прохолодним echo-accent для читабельної third-person camera:

- Hit 1: вузький висхідний diagonal slash і легкий contact.
- Hit 2: швидший reverse slash, яскравіший, але коротший contact.
- Hit 3: важкий удар униз, compressed flash, зовнішній ground ring і debris.
- Tone: точний, енергійний, не фотореалістичний; без gore.
- Gameplay intent: contact лишається читабельним із camera distance 4–8 m на темному, середньому й світлому фоні.

### Technical requirements

- `AM_P11_MeleeCombo` або еквівалентний montage/sequence з названими contact Notifies.
- `NC_P11_WeaponTrail`, attached до перевіреної weapon/socket hierarchy.
- begin/end `AN_P11_TrailWindow` активує/деактивує trail.
- `AN_P11_Hit01/02/03` викликає reusable Blueprint event із `HitResult`.
- User parameters: `User.EffectColor`, `User.AccentColor`, `User.Scale`, `User.Intensity`, `User.ComboIndex`, `User.Direction`, `User.SurfaceNormal`.
- contact systems spawn у `ImpactPoint`; ground response вирівнюється за trace normal.
- High/Medium/Low profiles зберігають усі contact timings.
- немає compile warnings, stale pooled parameters, bounds pop або detached local-space debris.

### Constraints

- target — real-time PC/console gameplay, а не offline cinematic-only rendering;
- third-person gameplay camera — primary, cinematic camera — supplemental;
- VFX не приховує character silhouette, enemy pose або ground danger;
- усі VFX source textures, meshes, material graphs і Niagara logic оригінальні;
- будь-які rig/animation/environment не вашого авторства ліцензовані й чітко credited;
- жодних ripped, extracted або proprietary game assets;
- жодного Beta/Experimental plugin, Fluids або dependency, яку не можна packaged на target;
- один reusable integration path, а не effects, вручну розставлені для кожного capture.

### Scope boundary

In scope: three-hit VFX, trail/slash/impact/ground systems, Notify/Blueprint hookup, original VFX assets, H/M/L, target profiling і presentation package. Out of scope: авторство повної combat/damage system, нового character rig/animation set, sound design, network replication і environment art; якщо вони показані, їх роль та source/license розкриваються окремо.

### Ethical original reference analysis

Зберіть 3–5 lawful references і запишіть URL/source, creator, дату доступу та потрібний принцип. Аналізуйте:

- temporal spacing між wind-up/contact/decay;
- direction дуги та screen hierarchy;
- distribution contrast у contact;
- як ground response підтримує weight;
- що саме **не буде скопійовано**.

Не трасуйте frames, не відтворюйте впізнаваний branded motif, не копіюйте exact palette+silhouette+timing як пакет і не використовуйте proprietary textures/meshes. Побудуйте нову thumbnail/timing map з abstract principles.

### Production milestones

| Milestone | Критерій виходу |
|---|---|
| M0 Brief/reference | затверджено brief, authorship/source log і risk list |
| M1 Graybox | monochrome trail/slash/impact вирівняні за contacts |
| M2 Integration | notify windows, hit data і ground trace стабільно працюють повторно |
| M3 Art pass | оригінальні textures/materials/Niagara layers завершені |
| M4 Polish | пройдено hierarchy, palette і camera readability |
| M5 Performance | відтворювані до й після, H/M/L і bounds |
| M6 Presentation | gameplay/neutral captures і повний breakdown |

### Production checklist

- [ ] три contacts мають різні timing/shape;
- [ ] trail запускається/зупиняється з animation state;
- [ ] impacts використовують actual hit data;
- [ ] ground response використовує trace normal;
- [ ] User parameters правильно скидаються під час pooling/reuse;
- [ ] materials мають validated fallbacks;
- [ ] H/M/L зберігають contact і direction;
- [ ] немає proprietary asset або unverifiable claim;
- [ ] усі captures відповідають submitted assets;

### 100-point self-review rubric and category floors

| Category | Points | Floor |
|---|---:|---:|
| Creative brief, originality, reference ethics | 15 | 9 |
| Gameplay timing and readability | 20 | 12 |
| Niagara/material/asset technical quality | 20 | 12 |
| Blueprint/animation integration and reuse | 15 | 9 |
| Performance, bounds and H/M/L | 15 | 9 |
| Presentation, breakdown and authorship | 15 | 9 |
| **Total** | **100** | **80 overall** |

Кожна категорія має досягти свого floor. Critical fail: contact feedback не збігається з gameplay timing, є proprietary/uncredited assets, відсутній working tier або material/Niagara architecture неможливо пояснити.

### Performance requirements with target measurement

До optimization оголосіть target hardware, build, resolution, graphics/scalability profile та intended frame-rate budget. Перевірте:

- baseline: одне повне комбо;
- stress: три повні комбо за 10 секунд із максимум трьома overlapping impacts і одним active trail;
- gameplay camera та close neutral camera;
- warmed shaders/systems і однаковий route.

Зберіть `stat unit`, `stat gpu`/GPU profiler where available, Niagara Debugger counts, Shader Complexity/Quad Overdraw і Unreal Insights, якщо підозрюється CPU hitch. Покажіть range/representative frames та перший bottleneck. Pass вимагає виконання declared project target без visible culling, втрати gameplay timing або нових warnings. **Не вигадуйте універсальні particle, draw-call або millisecond budgets.**

### Presentation requirements

- чистий gameplay clip 8–12 s із записаними resolution/frame rate;
- front/side/top neutral captures із fixed exposure;
- один slow playback для timing analysis, позначений як `slowed`;
- default і H/M/L comparison;
- до й після optimization за однакових умов;
- читабельні captions: назва piece, engine build, role, tools, target scenario;
- cinematic-only shot не використовується як доказ gameplay performance.

### Mandatory breakdown materials list

1. ethical reference-principles board і source/authorship log;
2. layer/timing map із animation contact frames;
3. власні textures і channel/atlas sheet;
4. material graphs/functions/instances і data contracts;
5. повні Niagara stacks і renderer bindings;
6. Blueprint/Animation Notify integration diagram;
7. дані про продуктивність до й після за однакових умов;
8. High/Medium/Low table зі збереженими ігровими підказками;
9. limitations і next iteration.

### Completion criteria / Definition of Done

Piece завершена лише тоді, коли тричі поспіль працює від gameplay input, усі contacts вирівняні, H/M/L проходять cue parity, submitted score дорівнює `≥80/100` з усіма floors, performance target виміряно, усі assets/claims attributable, а mandatory breakdown package повний.

## 9. Візуальні або математичні приклади

Приклад timing map для 30 fps:

| Beat | Frame | Purpose |
|---|---:|---|
| anticipation 1 | `0–4` | direction preview |
| hit 1 contact | `7` | first flash/impact |
| hit 2 contact | `15` | quicker reverse |
| heavy anticipation | `19–26` | weight |
| hit 3 contact | `29` | largest impact/ground response |
| residue clear | `45` | return visual control |

Перетворюйте frames на секунди лише за actual sequence rate: `time = frame / fps`. Не називайте ці timings універсальними.

Пріоритет layers:

```text
gameplay contact > slash silhouette > weapon trail > sparks/debris > residue
```

## 10. Controlled experiments

1. Вимкніть усе, крім trail; перевірте socket path і window.
2. Вимкніть trail; порівняйте slash arc у contact ±2 frames.
3. Spawn impact у animation hand і в actual `HitResult`; збережіть hit-data path.
4. Змініть ground normal на slope; перевірте ring alignment.
5. Перевірте black/mid/white backgrounds і desaturated view.
6. Запустіть комбо тричі з pooled/reused components; знайдіть stale parameters.
7. Порівняйте H/M/L з однакової camera й contact frame.
8. Створіть overlap stress і зафіксуйте до й після material/particle optimization.

## 11. Покрокова керована практика

### Архітектура проєкту

```text
BP_P11_MeleeComboController
├─ NC_P11_WeaponTrail (attached to weapon/root)
├─ Play Montage / animation playback
├─ AN_P11_TrailWindow Begin → Activate trail
├─ AN_P11_TrailWindow End   → Deactivate trail
├─ AN_P11_Hit01/02/03
│  ├─ receive/perform hit trace
│  ├─ Spawn System at Location: Slash/Impact
│  ├─ Set Niagara variables: color, scale, index, direction
│  └─ Hit03 only → ground trace → GroundResponse
└─ quality profile selects H/M/L assets/settings
```

### `NS_P11_Melee_WeaponTrail`

```text
Emitter Properties: CPUSim; Local Space=True; Determinism=True; Seed=1101
Emitter Update: Emitter State; Spawn Rate=60/s
Particle Spawn: Initialize Ribbon; position from attached/socket path contract
Particle Update: Particle State; Scale Ribbon Width; Scale Color
Render: Ribbon Renderer
```

Старт: lifetime `.18 s`, width `7×User.Scale`, color `User.EffectColor`, `UV0 Tiling Distance=35`, перевірений Screen/Custom facing, Automatic tessellation і повні Ribbon bindings. Trail component активується лише протягом Notify State. Точна реалізація socket sampling залежить від integration із блоку 10 та **потребує ручної перевірки в Unreal Engine 5.8.**

### `NS_P11_Melee_SlashArc`

```text
Emitter ArcMesh
  Emitter Update: Emitter State; Spawn Burst Instantaneous=1
  Particle Spawn: Initialize Particle; Initial Mesh Orientation; Dynamic Material Parameters
  Particle Update: Particle State; Scale Color; Scale Mesh Size
  Render: Mesh Renderer
Emitter AccentSparks
  Emitter Update: Emitter State; Spawn Burst Instantaneous=12
  Particle Spawn: Initialize Particle; Shape Location; Add Velocity in Cone
  Particle Update: Particle State; Drag; Solve Forces and Velocity; Scale Color; Scale Sprite Size
  Render: Sprite Renderer
```

Arc використовує `SM_VFX_Slash_01`, lifetime `.22/.18/.28` за `ComboIndex`, User scale/color і `Dynamic0 Core=Intensity`. Sparks використовують deterministic seeds `1111–1113` або stable selection від `ComboIndex`.

### `NS_P11_Melee_Impact`

```text
Emitter Flash: Burst 1 → Initialize Particle → Scale Color/Size → Sprite
Emitter Sparks: Burst 18/24/32 → Initialize/Shape/Add Velocity → State/Gravity/Drag/Solve/Curves → Sprite
Emitter Shards: Burst 3/5/8 → Initialize/Shape/Velocity/Orientation → State/Gravity/Drag/Solve/Orientation → Mesh
```

Усі layers працюють у світовому просторі, мають seeds і прив’язані до hit direction/normal. Hit 3 більший, але не просто множить усі counts: він додає lower-frequency shards і довший decay.

### `NS_P11_Melee_GroundResponse`

```text
Emitter Ring: Burst 1 → Initialize Particle → Scale Mesh Size/Color → Mesh Renderer SM_VFX_Ring_01
Emitter Dust: Burst 10 → Initialize/Shape/Velocity → State/Drag/Solve/Color/Size → Sprite
```

Spawn transform вирівнює local Z за `HitResult.ImpactNormal`; position зміщено на малу задокументовану величину вздовж normal, щоб уникнути z-fighting. Collision визначається gameplay trace, а не невиміряним Niagara collision layer.

### H/M/L policy

| Cue | High | Medium | Low |
|---|---|---|---|
| contacts/slashes | all | all | all |
| trail | full rate/tessellation | lower rate/automatic | simplified ribbon or mesh arc |
| impact sparks | 18/24/32 by hit | ~70% measured | ~40%, preserve direction |
| shards | 3/5/8 | 2/3/5 | hit3 only |
| ground response | ring+dust+shards | ring+dust | ring+compact dust |
| material | full distortion/soft depth | reduced options | no nonessential distortion |

Остаточні values визначайте з profiling; percentages — starting hypotheses, а не budgets.

## 12. Точні назви вузлів, модулів і налаштувань UE

Точні core labels:

- `Animation Notify`, `Notify State`, `Montage Notify`, `Montage Notify Window`;
- Blueprint `Spawn System at Location`, `Spawn System Attached`, `Activate`, `Deactivate`;
- display names Niagara `Set Niagara Variable (Linear Color/Float/Vector3/Int32)` можуть відрізнятися;
- modules: `Emitter State`, `Spawn Rate`, `Spawn Burst Instantaneous`, `Initialize Particle`, `Initialize Ribbon`, `Shape Location`, `Add Velocity in Cone`, `Gravity Force`, `Drag`, `Solve Forces and Velocity`, `Initial Mesh Orientation`, `Update Mesh Orientation`, `Scale Color`, `Scale Sprite Size`, `Scale Mesh Size`, `Scale Ribbon Width`, `Dynamic Material Parameters`;
- renderers: `Sprite Renderer`, `Mesh Renderer`, `Ribbon Renderer`;
- profiling: `Niagara Debugger`, `stat unit`, `stat gpu`, `ProfileGPU`, `Unreal Insights`.

Точні UI labels, Blueprint pin names, Notify behavior і pooling options: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Parameter | Type | Default |
|---|---|---|
| `User.EffectColor` | Linear Color | `(1,.25,.04,1)` |
| `User.AccentColor` | Linear Color | `(.08,.45,1,1)` |
| `User.Scale` | Float | `1` (`.75–1.5`) |
| `User.Intensity` | Float | `1` (`.5–2`) |
| `User.ComboIndex` | Int32 | `0` (`0–2`) |
| `User.Direction` | Vector | normalized hit direction |
| `User.SurfaceNormal` | Vector | hit/ground normal |
| Trail rate/lifetime | Float | `60/s`, `.18 s` |
| Impact spark counts | Int32 | `18/24/32` |
| Ground ring lifetime | Float | `.55 s` |

## 14. Очікуваний результат кожного етапу

- Graybox: contacts читаються без color/post-process.
- Trail: слідує за weapon лише у правильному Notify window.
- Slash: direction відповідає animation.
- Impact: використовує actual hit point і direction.
- Ground response: лежить на slope і з’являється лише на heavy hit.
- Art pass: layers розділяються за scale/frequency.
- H/M/L: однакові gameplay beats із виміряними visual reductions.
- Presentation: gameplay і neutral captures показують ту саму technical truth.

## 15. Самостійна вправа

### `EX-L11-01-A` — Оригінальне альтернативне комбо

Створіть незалежне комбо `два light + один heavy` з іншою мовою руху, palette і timing map. Використайте лише principle-level references, нові seeds і щонайменше одну власну texture або mesh, якої немає у guided piece. Збережіть повний portfolio contract, 100-point rubric і H/M/L.

[Повне рішення A](../EXERCISE_ANSWERS/L11-01_stylized_melee_combo_portfolio_piece_answers.md#ex-l11-01-a)

## 16. Додаткова складніша вправа

### `EX-L11-01-B` — Gameplay/performance remediation

Навмисно створіть або знайдіть по одній реальній weakness: contact timing, silhouette occlusion, stale pooled parameter і High-tier overdraw. Усуньте першопричини, створіть знімки до й після за однакових умов і чесно оновіть self-score.

[Повне рішення B](../EXERCISE_ANSWERS/L11-01_stylized_melee_combo_portfolio_piece_answers.md#ex-l11-01-b)

## 17. Три рівні підказок

### Для `EX-L11-01-A`

- **Hint 1:** почніть із black/white timing thumbnails, а не palette.
- **Hint 2:** розрізняйте contacts через direction, scale і decay, а не лише hue.
- **Hint 3:** зафіксуйте Notify frames, hit-data path і H/M/L cue parity до final materials.

### Для `EX-L11-01-B`

- **Hint 1:** відтворюйте одну weakness за раз із двома вимкненими layers.
- **Hint 2:** шукайте перший failed stage у порядку: animation/contact data → Blueprint spawn/parameters → Niagara → renderer/material.
- **Hint 3:** виправляйте timing у Notify, stale data під час activation/reset, а overdraw — через coverage/layers, не зміною camera.

## 18. Типові помилки

- усі три hits використовують той самий effect з різним scale;
- trail window починається після motion або лишається в idle;
- impact spawned у weapon socket замість actual hit;
- ground ring ігнорує normal;
- cinematic camera приховує gameplay occlusion;
- H/M/L змінюють contact timing;
- animation/environment не credited;
- скопійовано branded slash silhouette/palette;
- optimization claim не має identical captures;
- portfolio score усереднює категорію нижче floor.

## 19. Troubleshooting

| Симптом | Перша перевірка | Мінімальне виправлення |
|---|---|---|
| late impact | Notify/contact frame | перенести event на actual hit, не effect curve |
| detached trail | attach/socket/space | перевірити hierarchy і transform rule |
| повторюється неправильний color | pooled parameter reset | установити кожен exposed value до `Activate` |
| ground ring вертикальний | surface normal transform | вирівняти local Z за normal |
| втрата на світлому фоні | value/silhouette hierarchy | посилити shape/contrast, не лише HDR |
| spikes у High tier | overlap/material/renderer counts | ізолювати `ProfileGPU`/Niagara counters і зменшити responsible layer |

## 20. Performance considerations

- Rate/lifetime weapon trail керує ribbon points і tessellation input.
- Велике translucent coverage slash/flash може домінувати в overdraw.
- Cost mesh debris враховує triangles, material, shadows і lifetime.
- Повторне комбо виявляє проблеми pooling/lifecycle/stale parameters.
- Animation Notifies синхронізують events, але accuracy/cost settings мають відповідати gameplay requirement.
- H/M/L reductions зберігають contact direction і timing.
- Профілюйте target PC/console build; beauty viewport editor не є performance proof.

## 21. Запитання для самоперевірки

1. Які чотири фази має кожен hit?
2. Чому impact використовує hit data, а не weapon position?
3. Чим тут керує Notify State?
4. Як ground ring має використовувати surface normal?
5. Що розрізняє три hits без hue?
6. Чому portfolio beauty shot може бути недостатнім?
7. Що має лишатися незмінним у performance comparison?
8. Які floors має rubric?
9. Що має розкривати authorship log?
10. Чи гарантує завершення piece роботу?

## 22. Відповіді

1. Anticipation, action, contact і decay.
2. Gameplay truth може відрізнятися; impact належить registered contact.
3. Begin/end activation window для trail.
4. Вирівняти local up/normal axis effect за traced normal.
5. Direction, scale/frequency, timing і decay.
6. Він може приховати gameplay timing, occlusion, integration і cost.
7. Build, hardware, resolution, camera, route, concurrency і settings.
8. 60% кожної категорії та 80 overall.
9. Створене вами, third-party assets/source/license і team roles.
10. Ні.

## 23. Self-check checklist

- [ ] Creative brief і етична добірка референсів існують.
- [ ] Повні technical requirements/constraints записані.
- [ ] Пройдено сім milestones.
- [ ] Contacts, trail, impacts і ground response працюють від gameplay.
- [ ] Усі VFX assets оригінальні; інші assets credited.
- [ ] H/M/L cue parity зафіксовано.
- [ ] Performance target/config і докази до й після існують.
- [ ] Mandatory breakdown materials повні.
- [ ] Кожна rubric category досягла floor; total `≥80`.
- [ ] Limitations і statement про відсутність job guarantee додані.

## 24. Mastery criteria

Ви можете перебудувати й пояснити комбо без tutorial, відтворити всі gameplay triggers, простежити кожен renderer/material data path, обґрунтувати ethical reference choices, діагностувати одну timing і одну performance weakness та представити чесний case study з `≥80/100` і всіма floors.

## 25. Підсумок

Перша piece доводить, що stylized combat VFX — це gameplay system: animation timing, hit data, reusable Niagara layers, target measurements і чесна presentation мають узгоджуватися. Visual polish приймається лише після виконання цих contracts.

## 26. Зв’язок із наступними уроками

[11.02](02_elemental_projectile_kit_portfolio_piece.md) розширює одну integrated action у reusable kit `launch/flight/trail/impact` із трьома поведінково відмінними elemental variants.

## 27. Офіційні джерела

- [Animation Notifies](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-notifies-in-unreal-engine)
- [Spawn System at Location](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystematLocation)
- [Spawn System Attached](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystemAttached)
- [UNiagaraComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraComponent)
- [System Settings Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine)
- [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara)
- [Introduction to Performance Profiling](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Ethical reference-principles board із sources і notes «використано/не скопійовано».
2. Animation timeline із трьома contact/Notify windows.
3. Layer/timing map і silhouettes з ігрової камери.
4. Власні textures/channel sheet і material graphs.
5. Повні Niagara stacks/bindings для trail, slash, impact і ground response.
6. Blueprint/Notify/hit-data integration diagram.
7. H/M/L same-frame contact comparison.
8. Performance до й після із точними capture conditions.
9. Gameplay і neutral final frames та authorship statement.
