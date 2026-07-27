# 11.03 — Portfolio Piece 3: Character aura / transformation

## 1. Назва

**`Glassbloom Ward` — оригінальна керована аура з фазами activation, persistent loop і deactivation для third-person PC/console gameplay.**

## 2. Результат уроку

Ви завершите третю portfolio piece:

- читабельний перехід `Off → Activating → Looping → Deactivating`;
- три окремі Niagara systems для входу, стабільного стану й виходу;
- per-instance керування аурою та матеріалом персонажа через Blueprint;
- безпечне переривання, повторний запуск і скидання pooled/reused state;
- High/Medium/Low variants зі збереженою gameplay identity;
- зібрані докази продуктивності для одного й кількох персонажів;
- gameplay, neutral-view і повний technical breakdown;
- чесне 100-бальне самооцінювання із category floors.

Результати: `NS_P11_Aura_Activation`, `NS_P11_Aura_Loop`, `NS_P11_Aura_Deactivation`, `M_P11_Aura_Character`, `MI_P11_Aura_Character`, `BP_P11_AuraController`, `L_P11_Aura_Portfolio`, `LS_P11_Aura_Capture`.

## 3. Орієнтовний час

**10 годин: 1 година теорії / 9 годин практики.**

- 60 хв — brief, ethical reference analysis, state/timing plan;
- 75 хв — monochrome state-machine graybox;
- 120 хв — activation/loop/deactivation Niagara systems;
- 75 хв — Blueprint і per-instance material integration;
- 60 хв — M/S practice: character overlay, rings і dissolve-edge polish;
- 90 хв — interruption tests, H/M/L і profiling;
- 120 хв — gameplay/neutral captures, breakdown і rubric.

M/S ledger: **1 година; cumulative 3.5/6 години блоку**.

## 4. Prerequisites

- `G10`;
- 07.05 User Parameters, 08.03/08.07 Blueprint integration, 09.07 aura;
- lifecycle, pooling, Effect Type, scalability і profiling з блоку 10;
- власний або ліцензований character/animation/environment із source/role disclosure;
- власні VFX textures, meshes і material functions із блоків 04–06;
- лише core Unreal Engine 5.8/Niagara; **без Beta або Experimental dependency**.

## 5. Нові терміни

- **Persistent state effect** — VFX, що має залишатися читабельним і стабільним протягом невідомої gameplay duration.
- **Transition ownership** — один controller визначає дозволені переходи, lifecycle і cleanup.
- **Per-instance material control** — окремий Dynamic Material Instance для кожного персонажа замість глобальної зміни всіх actors.
- **State alpha** — нормалізоване значення `0–1`, яке узгоджує Niagara й character material.
- **Cancellation path** — визначений вихід, якщо activation/deactivation перервано новою gameplay command.
- **Generation token** — ідентифікатор запуску, який не дозволяє старому delayed callback змінити новий state.
- **Aura occupancy** — частка screen/character silhouette, яку постійно займає аура.
- **Cue parity** — однакова gameplay meaning у High/Medium/Low, навіть якщо декоративна складність різна.
- **Neutral capture** — технічний ракурс без монтажу, що показує весь lifecycle і дефекти.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Character aura перевіряє не лише красу одного burst. Вона повинна коректно входити в стан, довго жити, не закривати персонажа й combat cues, реагувати на scale/team/state, переживати cancel/restart і масштабуватися на кількох actors. Це production-style задача на Niagara, materials, Blueprint lifecycle, readability і performance одночасно.

Ця робота може підтвердити релевантні навички, але завершення piece або курсу **не гарантує працевлаштування**. Показуйте тільки те, що можете пояснити й довести.

## 7. Теорія простими словами

Уявіть аuru як дієслово, стан і крапку:

1. **activation** змінює персонажа й повідомляє, що buff увімкнувся;
2. **loop** тихо підтримує стан, не змагаючись із атакою та UI;
3. **deactivation** забирає форму й підтверджує кінець.

Один великий безкінечний emitter не дає надійного контролю над цими ролями. Розділіть фази, але керуйте ними одним Blueprint contract. Колір допомагає, однак shape, motion, timing і attachment мають пояснювати стан навіть у grayscale.

## 8. Детальні технічні пояснення

### Creative brief

`Glassbloom Ward` — захисна трансформація, де тонкі скляні пелюстки сходяться до персонажа, утворюють низький ground halo й повільну shoulder crown, а при вимкненні складаються всередину:

- activation: `0.9 s`, inward motes, одна expanding-to-lock ring, короткий character-edge reveal;
- loop: спокійний `2.0 s` pulse cycle, sparse orbit motes, тонка ground boundary;
- deactivation: `0.5 s`, collapse ring, inward pull і короткий edge fade;
- ігровий задум: активний захисний state читається з 3–12 m і не маскує feet, weapon, face або hostile telegraphs;
- visual language: faceted, pale cyan/amber accent, без копіювання впізнаваного franchise motif.

### Technical requirements

- `BP_P11_AuraController` є єдиним owner станів `Off`, `Activating`, `Looping`, `Deactivating`.
- `NC_P11_Aura_Activation`, `NC_P11_Aura_Loop`, `NC_P11_Aura_Deactivation` attached до character root із задокументованими local/world-space правилами.
- `Create Dynamic Material Instance` для призначених character material slots; жодного shared global change.
- Blueprint передає однаковий contract: `User.PrimaryColor`, `User.SecondaryColor`, `User.Scale`, `User.Intensity`, `User.StateAlpha`, `User.CharacterRadius`, `User.TeamIndex`.
- character material parameters: `AuraAmount`, `AuraColor`, `AuraEdgeWidth`; baseline відновлюється після deactivation/cancel.
- повторний `Activate`, `Deactivate` і cancel не створюють дубльовані loops або stale callback.
- High/Medium/Low зберігають activation, active-state identity та deactivation.
- немає compile warnings, detached local-space layers, bounds pop, depth artifacts або persistent material state після вимкнення.

### Constraints

- target — real-time third-person PC/console gameplay;
- аура не змінює gameplay collision, invulnerability або damage; вона лише відображає переданий state;
- ground boundary не повинна візуально обіцяти більший radius, ніж заданий gameplay contract;
- persistent loop має нижчу візуальну частоту й occupancy, ніж activation;
- один controller підтримує кількох незалежних characters;
- VFX textures, meshes, material logic і Niagara setup — власні;
- rig/character/animation/environment, які ви не створили, мають lawful license і credit;
- заборонено ripped, extracted або proprietary game assets;
- без Beta/Experimental plugins, Niagara Fluids або capture-only dependency;
- cinematic lighting/camera не замінюють gameplay proof.

### Scope boundary

In scope: visual activation/loop/deactivation, per-character MID/User data, Blueprint lifecycle/cancel/reset, original aura assets, H/M/L, concurrency profiling і case study. Out of scope: реалізація самого buff/defense mechanic, character gameplay abilities, network replication, повний rewrite character materials/rig та sound; VFX лише відображає authoritative state.

### Ethical original reference analysis

Зберіть 3–5 lawful references: природна кристалізація, сценічне світло, botanical unfurling, абстрактні motion studies. Для кожної запишіть URL/source, автора, дату доступу, принцип і те, що не копіюєте. Аналізуйте:

- напрямок формування/розпаду;
- співвідношення burst і quiet loop;
- edge contrast навколо рухомого silhouette;
- частоту orbit/pulse;
- читабельність у світлому, середньому й темному оточенні.

Не трасуйте кадри, не відтворюйте впізнаваний branded crest, не копіюйте palette+shape+timing як єдиний пакет і не використовуйте proprietary textures/meshes. Складіть нову state/timing map із принципів.

### Production milestones

| Milestone | Критерій виходу |
|---|---|
| M0 Brief/reference | approved brief, source/authorship log і risk list |
| M1 State graybox | monochrome three-state lifecycle і cancel path |
| M2 Niagara | три systems мають різні roles і stable attachment |
| M3 Integration | Blueprint, MID, parameters і cleanup стабільно працюють повторно |
| M4 Art/readability | original assets, palette і gameplay silhouettes пройшли перевірку |
| M5 Performance | fixed target tests, до й після і H/M/L завершені |
| M6 Presentation | gameplay/neutral captures і mandatory breakdown завершені |

### Production checklist

- [ ] activation, loop і deactivation мають різні visual verbs;
- [ ] controller дозволяє тільки визначені transitions;
- [ ] cancel/restart не залишає дубльовану loop;
- [ ] кожен character має окремий MID/state;
- [ ] root/spine attachment і локальний/світовий простір задокументовані;
- [ ] ground cue не ковзає й не перебільшує gameplay radius;
- [ ] weapon, feet, face і hostile cues залишаються видимими;
- [ ] H/M/L зберігають active-state identity;
- [ ] усі сторонні assets credited, усі claims перевірювані;
- [ ] submitted captures відповідають фінальним assets.

### 100-point self-review rubric and category floors

| Category | Points | Floor |
|---|---:|---:|
| Creative brief, originality, reference ethics | 15 | 9 |
| State timing, character/gameplay readability | 20 | 12 |
| Niagara/material/asset technical quality | 20 | 12 |
| Blueprint lifecycle, cancellation and reuse | 15 | 9 |
| Performance, bounds and H/M/L | 15 | 9 |
| Presentation, breakdown and authorship | 15 | 9 |
| **Total** | **100** | **80 overall** |

Кожна категорія має досягти floor. Critical fail: аура неправильно показує gameplay state, material не скидається, cancel створює дубль, proprietary/uncredited asset, відсутній робочий tier або технічну архітектуру неможливо пояснити.

### Performance requirements with target measurement

До оптимізації зафіксуйте target hardware, packaged/development build, resolution, graphics/scalability profile та intended frame-time target. Виміряйте:

- baseline: один character проходить activation → 5 s loop → deactivation;
- scale: 1, 4 і 8 characters у loop;
- transition stress: 4 characters одночасно активуються, ще 4 залишаються в loop;
- gameplay camera, close neutral camera, dark/mid/bright backgrounds;
- warmed systems/shaders, той самий маршрут і тривалість.

Зберіть `stat unit`, `stat gpu`/GPU profiler where available, Niagara Debugger counts, Shader Complexity/Quad Overdraw та Unreal Insights при CPU hitch. Покажіть range/representative frames, bottleneck і однаковий до й після. Pass — заявлений target виконано без state loss, visible culling, bounds pop або warning. **Не вигадуйте універсальні particle, draw-call чи millisecond budgets.**

### Presentation requirements

- 8–12 s uncut gameplay clip: activation, moving loop, one attack under aura, deactivation;
- neutral front/side/top captures із fixed exposure;
- simultaneous two-character capture, що доводить per-instance color/state;
- cancel/restart proof у real time;
- default plus H/M/L comparison;
- показники продуктивності до й після за однакових умов;
- captions: piece, engine build, target, role, tools, third-party assets;
- slow playback позначається як slowed; cinematic shot не є performance proof.

### Mandatory breakdown materials list

1. ethical reference-principles board і source/authorship log;
2. layer/timing/state map з activation/loop/deactivation/cancel;
3. own textures, meshes і channel sheets;
4. character/aura material graphs, functions, instances і parameter contract;
5. повні Niagara stacks усіх трьох systems;
6. Blueprint state-machine, attachment, MID і reset diagram;
7. дані про продуктивність до й після за однакових умов;
8. High/Medium/Low table зі збереженими ігровими підказками;
9. limitations, known edge cases і next iteration.

### Completion criteria / Definition of Done

Piece завершена лише коли state проходить три повні цикли, cancel/restart працює, два characters мають незалежні parameters, character material повністю скидається, H/M/L pass cue parity, target performance виміряно, score `≥80/100` з усіма floors, assets/claims attributable, а mandatory breakdown повний.

## 9. Візуальні або математичні приклади

State timeline:

| Time | State | `StateAlpha` | Dominant cue |
|---|---|---:|---|
| `0.00–0.90 s` | Activating | `0→1` eased | inward motes + locking ring |
| `0.90–2.90 s` | Looping | `1` | sparse orbit + quiet pulse |
| `2.90–3.40 s` | Deactivating | `1→0` eased | collapse + edge fade |
| `≥3.40 s` | Off | `0` | no residual component/material |

Нормалізуйте transition:

```text
t = clamp((Now - StateStartTime) / StateDuration, 0, 1)
activationAlpha = smoothstep(0, 1, t)
deactivationAlpha = 1 - smoothstep(0, 1, t)
```

Пріоритет layers:

```text
gameplay state identity > character silhouette > transition accent > orbit detail > decorative residue
```

Ці timings — project starting values, не універсальний стандарт.

## 10. Controlled experiments

1. Вимкніть color: state має читатися через form/motion/timing.
2. Залиште лише character material, потім лише Niagara; перевірте внесок кожного.
3. Перервіть activation на 25%, 60% і 95%; не має бути orphan loop.
4. Повторіть activate/deactivate десять разів на reused controller.
5. Запустіть два characters із різними colors/intensity; перевірте per-instance isolation.
6. Рухайтеся, стрибайте й атакуйте; перевірте local/world-space attachment.
7. Перевірте black/mid/white backgrounds, feet/weapon/face visibility.
8. Порівняйте 1/4/8 actors і H/M/L за однакової camera route.

## 11. Покрокова керована практика

### State і Blueprint architecture

```text
BP_P11_AuraController
├─ State: Off | Activating | Looping | Deactivating
├─ GenerationId
├─ NC_P11_Aura_Activation
├─ NC_P11_Aura_Loop
├─ NC_P11_Aura_Deactivation
├─ CharacterMID[]
├─ StartAura(Profile)
│  ├─ increment GenerationId
│  ├─ set every Niagara/MID parameter
│  ├─ reset and Activate Activation
│  └─ transition to Looping only if callback GenerationId is current
└─ StopAura()
   ├─ stop/deactivate Loop
   ├─ initialize Deactivation from current alpha
   └─ restore baseline MID values on valid completion
```

Створіть MID один раз для кожного сумісного material slot і збережіть baseline values. Не використовуйте Material Parameter Collection для actor-specific color/state: вона змінить усіх consumers.

### `NS_P11_Aura_Activation`

```text
Emitter LockRing
  Emitter Update: Emitter State; Spawn Burst Instantaneous=1
  Particle Spawn: Initialize Particle; Initial Mesh Orientation; Dynamic Material Parameters
  Particle Update: Particle State; Scale Mesh Size; Scale Color
  Render: Mesh Renderer
Emitter InwardPetals
  Emitter Update: Emitter State; Spawn Burst Instantaneous=24
  Particle Spawn: Initialize Particle; Shape Location; Add Velocity
  Particle Update: Particle State; Point Attraction Force; Drag; Solve Forces and Velocity; Scale Color/Size
  Render: Mesh Renderer or Sprite Renderer
Emitter EdgeFlash
  Emitter Update: Emitter State; Spawn Burst Instantaneous=1
  Particle Spawn/Update: Initialize Particle; Scale Sprite Size; Scale Color
  Render: Sprite Renderer
```

Початок: ring lifetime `.9 s`, petals `.65–.9 s`, radius `90×User.Scale cm`, seeded deterministic selection. Attraction center follows character root; persistent residue тут заборонений.

### `NS_P11_Aura_Loop`

```text
Emitter GroundHalo
  Emitter Update: Emitter State
  Particle Spawn: Spawn Burst Instantaneous=1; Initialize Particle
  Particle Update: Scale Mesh Size; Scale Color; Dynamic Material Parameters
  Render: Mesh Renderer
Emitter OrbitMotes
  Emitter Update: Emitter State; Spawn Rate=8/s
  Particle Spawn: Initialize Particle; Shape Location
  Particle Update: Vortex Force; Curl Noise Force; Drag; Solve Forces and Velocity; Scale Color/Size
  Render: Sprite Renderer
Emitter ShoulderCrown
  Emitter Update: Emitter State; Spawn Rate=3/s
  Particle Spawn: Initialize Particle; Skeletal Mesh Location or documented socket sampling
  Particle Update: Particle State; Scale Color/Size
  Render: Mesh/Sprite Renderer
```

Ground halo має один persistent particle або documented reinitialization, а не необмежене накопичення. Orbit motes лишають chest/face/weapon negative space. Якщо skeletal sampling нестабільний на target, використайте validated sockets.

### `NS_P11_Aura_Deactivation`

```text
Emitter CollapseRing
  Burst 1 → Initialize Particle → Scale Mesh Size/Color inward → Mesh Renderer
Emitter ReturnPetals
  Burst 16 → Shape Location → Point Attraction Force → Drag → Solve → Scale → Mesh/Sprite
Emitter ResidualPin
  Burst 1 → Initialize → Scale Color/Size → Sprite Renderer
```

Початок: `.5 s`, no looping emitters, no delayed callback without `GenerationId` validation. Після completion: deactivate/reset components, `AuraAmount=0`, restore recorded color/edge defaults.

### Integration character material

`M_P11_Aura_Character` отримує `AuraAmount`, `AuraColor`, `AuraEdgeWidth`. Використайте маску edge/fresnel обережно: не перетворюйте весь character на великий translucent object. Динамічний параметр має змінювати emissive/edge accent у межах art direction; base gameplay material залишається opaque/masked where designed.

### Політика H/M/L

| Cue | High | Medium | Low |
|---|---|---|---|
| activation/deactivation | full petals+ring+edge | fewer petals+ring+edge | ring+compact edge |
| active-state identity | halo+crown+orbit | halo+sparse orbit | halo+MID edge |
| orbit rate | `8/s` start | `5/s` start | `0–2/s` measured |
| character material | full safe features | simplified accent | minimal edge |
| secondary residue | present if measured | reduced | removed |
| timing/state | identical | identical | identical |

Остаточні values визначає target profiling; starting reductions не є budgets.

## 12. Точні назви вузлів, модулів і налаштувань UE

- Blueprint/material: `Create Dynamic Material Instance`, `Set Scalar Parameter Value`, `Set Vector Parameter Value`, `Set Niagara Variable (Float/Linear Color/Vector3/Int32)`, `Activate`, `Deactivate`, `Reset System`;
- Niagara: `Emitter State`, `Spawn Rate`, `Spawn Burst Instantaneous`, `Initialize Particle`, `Shape Location`, `Skeletal Mesh Location`, `Add Velocity`, `Point Attraction Force`, `Vortex Force`, `Curl Noise Force`, `Drag`, `Solve Forces and Velocity`, `Initial Mesh Orientation`, `Scale Color`, `Scale Sprite Size`, `Scale Mesh Size`, `Dynamic Material Parameters`;
- renderers: `Sprite Renderer`, `Mesh Renderer`;
- profiling: `Niagara Debugger`, `stat unit`, `stat gpu`, `ProfileGPU`, `Unreal Insights`, Shader Complexity/Quad Overdraw views;
- scalability: Niagara Effect Type/System scalability settings and fixed bounds where validated.

Exact display names, Blueprint pins, skeletal sampling options, component reset behavior і material-slot route: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Parameter | Type | Default |
|---|---|---|
| `User.PrimaryColor` | Linear Color | `(.08,.75,1,1)` |
| `User.SecondaryColor` | Linear Color | `(1,.45,.08,1)` |
| `User.Scale` | Float | `1` (`.75–1.4`) |
| `User.Intensity` | Float | `1` (`.5–1.5`) |
| `User.StateAlpha` | Float | `0–1` |
| `User.CharacterRadius` | Float | `45 cm` measured from project |
| `User.TeamIndex` | Int32 | `0` |
| `AuraAmount` | Scalar | `0–1` |
| `AuraEdgeWidth` | Scalar | `.18` start |
| activation / deactivation | Float | `.9 s / .5 s` |
| loop pulse period | Float | `2.0 s` |
| orbit rate/lifetime | Float | `8/s`, `.8–1.4 s` |

Character radius і timing мають походити з вашого gameplay target; наведені values — лише starting profile.

## 14. Очікуваний результат кожного етапу

- Brief: original state verbs і lawful references задокументовані.
- Graybox: state читається без color/post-process.
- Activation: збирає увагу й точно завершується в Looping.
- Loop: стабільний під час movement/attack, не перекриває silhouette.
- Deactivation: візуально й технічно очищає state.
- Integration: два characters незалежні; cancel/restart проходить десять циклів.
- H/M/L: однакове state meaning, менша measured complexity.
- Presentation: gameplay, neutral і докази продуктивності не суперечать одне одному.

## 15. Самостійна вправа

### `EX-L11-03-A` — Original alternate transformation

Створіть `Ironleaf Ward`: теплу metallic/leaf transformation з іншими shape, motion, palette і timing. Збережіть той самий state/parameter contract, але створіть власний mesh/texture, нову material identity, H/M/L і повний breakdown. Ефект має читатися в grayscale без використання assets guided piece.

[Повне рішення A](../EXERCISE_ANSWERS/L11-03_character_aura_transformation_portfolio_piece_answers.md#ex-l11-03-a)

## 16. Додаткова складніша вправа

### `EX-L11-03-B` — Cancellation, isolation and performance remediation

Знайдіть або навмисно відтворіть чотири weaknesses: orphan loop після cancel, shared color між characters, silhouette occlusion і High-tier overdraw. Усуньте першопричини, проведіть 1/4/8-character test, надайте зіставні матеріали до й після і чесно оновіть rubric.

[Повне рішення B](../EXERCISE_ANSWERS/L11-03_character_aura_transformation_portfolio_piece_answers.md#ex-l11-03-b)

## 17. Три рівні підказок

### Для `EX-L11-03-A`

- **Hint 1:** оберіть verbs до palette: unfold, brace, hover, fold.
- **Hint 2:** змініть silhouette й frequency: broad leaf plates на вході, sparse vertical veins у loop.
- **Hint 3:** використайте нові seeds/mesh/material instance, але не змінюйте lifecycle і required User contract.

### Для `EX-L11-03-B`

- **Hint 1:** тестуйте один defect окремо й записуйте точну sequence команд.
- **Hint 2:** orphan callback лікується state ownership/token; shared color — per-character MID і setters before activation.
- **Hint 3:** occupancy зменшуйте через radius, alpha coverage, lifetime/rate та negative space, зберігаючи halo/state cue.

## 18. Типові помилки

- activation і deactivation — той самий loop із reverse playback без перевірки lifecycle;
- один global material parameter змінює всіх characters;
- delayed callback старого запуску активує новий/зайвий loop;
- world-space aura відстає від moving character;
- ground halo ковзає або заходить у ноги;
- persistent translucent shell приховує animation й hostile cue;
- Low прибирає сам active-state cue;
- bounds обрізають motes при русі;
- cinematic exposure приховує readability problem;
- сторонній character/animation не credited.

## 19. Troubleshooting

| Symptom | First check | Minimal correction |
|---|---|---|
| loop лишається після cancel | state owner/callback token | invalidate old generation, stop/reset once |
| другий actor отримує той самий color | shared MID/MPC | create/store MID per actor and set all values |
| aura відстає | attachment/local-space rule | attach to validated root/socket; isolate world residue |
| material не скидається | completion/cancel cleanup | one restore function for every exit path |
| feet/weapon зникають | occupancy/depth/alpha | restore negative space, reduce coverage/lifetime |
| pop at camera edge | measured bounds | validate fixed/dynamic bounds across animation |
| 8 actors spike | emitter/material/concurrency | isolate Niagara and GPU layer, reduce nonessential loop |

## 20. Performance considerations

- Persistent Rate×Lifetime визначає кількість одночасно активних частинок; навіть низький rate накопичується при довгому lifetime.
- Character-surface sampling, translucent coverage і multiple material passes можуть коштувати більше, ніж burst count.
- Actor count множить components, emitters, parameter updates і bounds work.
- Один persistent halo particle часто контрольованіший за repeated ring spawn.
- MID per character дає isolation, але parameters не треба встановлювати щокадру без потреби.
- H/M/L зменшують decorative density/material features, не state timing або identity.
- Effect Type/scalability thresholds походять із target measurement, не з вигаданого універсального бюджету.

## 21. Запитання для самоперевірки

1. Які чотири states контролює Blueprint?
2. Чому activation, loop і deactivation розділені?
3. Чому MPC не підходить для actor-specific aura color?
4. Що захищає від stale delayed callback?
5. Які cues мусить зберегти Low?
6. Як перевірити material cleanup?
7. Що має залишатися видимим під аурою?
8. Які target performance scenarios обов’язкові?
9. Що має містити authorship/reference record?
10. Чи гарантує piece працевлаштування?

## 22. Відповіді

1. `Off`, `Activating`, `Looping`, `Deactivating`.
2. Вони мають різні timing, visual roles, lifecycle і cost.
3. MPC глобальна для consumers; потрібен незалежний MID кожного actor.
4. State ownership разом із generation token/id.
5. Activation confirmation, active-state identity і deactivation confirmation.
6. Повторити всі normal/cancel exits і перевірити baseline parameters/components.
7. Character silhouette, feet, weapon, face, attack і hostile telegraphs.
8. Baseline one actor, 1/4/8 loops і simultaneous transition stress за fixed conditions.
9. Що створено вами, джерело/license/role сторонніх assets і принципи, а не copied content.
10. Ні.

## 23. Self-check checklist

- [ ] Creative brief, constraints і етична добірка референсів існують.
- [ ] Three-system state lifecycle проходить три цикли.
- [ ] Cancel/restart і generation token перевірено.
- [ ] Два characters мають незалежні MID/User parameters.
- [ ] Character baseline повністю відновлюється.
- [ ] Gameplay silhouette й hostile cues видимі.
- [ ] H/M/L зберігають state identity.
- [ ] 1/4/8 і transition stress виміряні.
- [ ] Mandatory breakdown повний.
- [ ] Rubric `≥80`, усі floors, жодного critical fail.

## 24. Mastery criteria

Ви можете пояснити й побудувати persistent character effect як stateful system: розділити transitions/loop, передати per-instance data, безпечно обробити cancel/restart, зберегти читабельність під час гри, виміряти кілька actors і представити complete чесний опис проєкту на `≥80/100` з category floors.

## 25. Підсумок

Третя piece демонструє тривалу production behavior, а не лише красивий burst. `Glassbloom Ward` пов’язує Niagara, character material і Blueprint lifecycle, доводить instance isolation, cue parity та performance під concurrency.

## 26. Зв’язок із наступними уроками

[11.04](04_character_ultimate_boss_ability_portfolio_piece.md) розширює state/timing ownership до великої multi-phase ultimate, де telegraph boundary, impact truth і combat hazard мають найвищий пріоритет.

## 27. Офіційні джерела

- [Overview of Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-niagara-effects-for-unreal-engine)
- [UNiagaraComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraComponent)
- [Spawn System Attached](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystemAttached)
- [Creating and Using Material Instances](https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-and-using-material-instances-in-unreal-engine)
- [Material Parameter Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-parameter-expressions-in-unreal-engine)
- [Performance Budgeting Using Effect Types](https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-budgeting-using-effect-types-in-niagara-for-unreal-engine)
- [Niagara Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-debugger-for-unreal-engine)
- [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Ethical reference-principles/source board.
2. State/timing/cancellation map.
3. Own textures, petal/ring meshes і channel sheets.
4. Character material graph, instances й parameter table.
5. Full activation/loop/deactivation Niagara stacks.
6. Blueprint state, generation token, MID і reset diagram.
7. Gameplay silhouettes, two-character isolation і cancel proof.
8. High/Medium/Low and 1/4/8 before/after captures.
9. Authorship, limitations і final case-study layout.
