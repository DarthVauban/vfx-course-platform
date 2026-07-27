# 07.08 — Контрольний multi-renderer Niagara System

## 1. Назва

**Контрольний проєкт Niagara Foundations: один створений з нуля System зі Sprite, Mesh і Ribbon emitters, детермінованими seeds та експонованими User controls.**

## 2. Результат уроку

Ви створите `NS_CP07_TrinityBurst`, який:

- має три CPU emitters, які можна перевіряти незалежно;
- використовує Sprite, Mesh і Ribbon Renderers;
- має точні логічні stages і порядок;
- експонує `User.EffectColor`, `User.Intensity`, `User.Scale`, `User.Direction`;
- відтворюється за fixed seeds і reset protocol;
- має робочі material/render bindings;
- має виміряні fixed bounds і таблицю peak count;
- проходить внесення faults, самоперевірку й Gate `G07`.

Це інтеграційний проєкт, а не вступ до даних, керованих через Blueprint. Архітектура runtime/Blueprint для user parameters системно вивчається у 08.03.

## 3. Орієнтовний час

**7 годин: 1 година теорії/планування / 6 годин практики.**

- 30 хв — аналіз brief і схема stack;
- 30 хв — план parameters, джерел і ranges;
- 270 хв — побудова Sprite/Mesh/Ribbon та bindings;
- 60 хв — усунення несправностей, продуктивність і bounds;
- 30 хв — самоперевірка й докази.

`BLOCK_ASSESSMENT.md` є формалізованим проходом/перездачею цієї контрольної фази й **не додає годин понад 60 годин блока**.

## 4. Передумови

- 07.01–07.07 завершено;
- виконано спроби всіх вправ A/B;
- `MI_VFX_Sprite_Production`, `MI_VFX_Mesh_Production`, `MI_VFX_Ribbon_Production`;
- `SM_VFX_Debris_A`;
- чиста assessment map, зафіксовані camera/exposure, доступ до Niagara particle counts/debugger.

## 5. Нові терміни

- **Multi-renderer System** — один System з emitters, які використовують різні типи renderer.
- **User Parameter** — експонований input System/component у namespace `User.`.
- **Control surface** — малий набір керованих художником controls із types, defaults і ranges.
- **Direction contract** — правило normalization, поведінки zero vector і coordinate space.
- **Fixed Bounds** — явно заданий AABB для culling; має охоплювати прийняті variants.
- **Peak alive count** — максимальна одночасна кількість живих particles/points.
- **CPU/GPU rationale** — обґрунтування simulation target на основі features, count і вимірювань.
- **Gate evidence** — assets, схеми stack, таблиці parameters, captures і пояснення, достатні для pass/fail.

## 6. Навіщо ця тема потрібна VFX artist

Production brief зазвичай вимагає один виразний effect, а не окремий demo renderer. Sprite дає glow/streak detail, mesh — silhouette і mass, ribbon — continuity. Складність виникає на стиках: спільні timing, direction, scale, palette, bounds і performance. Контрольний проєкт перевіряє, чи можете ви організувати систему, а не лише повторити послідовність modules.

## 7. Теорія простими словами

Один System має спільний задум, але кожен emitter має власну симуляцію.

```text
User controls
   ├→ Sprite: color / size / direction / intensity
   ├→ Mesh:   color / scale / direction / intensity
   └→ Ribbon: color / width / direction / intensity
```

Значення `User.` не стає particle attribute автоматично. Module input має бути явно прив’язаний або скопійований. Потім renderer читає `Particles.*`.

## 8. Детальні технічні пояснення

### Мінімальний control surface

| Parameter | Type | Default | Прийнятий range/contract |
|---|---|---|---|
| `User.EffectColor` | Linear Color | `(1,.25,.04,1)` | RGB невід’ємні; A `0–1` |
| `User.Intensity` | Float | `1.0` | `.25–3.0` |
| `User.Scale` | Float | `1.0` | `.5–2.0` |
| `User.Direction` | Vector | `(1,0,0)` | ненульовий; нормалізований у module input; Simulation/World задокументовано |

Blueprint setter, Data Interface і Scratch Pad не потрібні. Перевіряйте User values через overrides розміщеного Niagara Component.

### Cross-emitter timing

- Sprite: миттєвий короткий burst — початок і читабельність.
- Mesh: миттєвий довший burst — вага й secondary motion.
- Ribbon: Rate протягом `1.2 s` — безперервний directional accent.

Усі починають роботу під час активації system. Кожен emitter має `Inactive Response=Complete`, щоб particles завершили життєвий цикл.

### CPU/GPU decision

Для всіх використовується CPU:

- peak alive близько 56;
- немає collision, Events, skeletal sampling, Simulation Stages або GPU-only data;
- потрібні проста детермінована перевірка й окремі counts для кожного emitter;
- немає ознак CPU bottleneck.

Це рішення для конкретного scope, а не універсальна перевага. У 08.01 додано порівняльні тести CPU/GPU.

### Bounds

Direction може обертатися, тому bounds потрібно перевірити на прийнятих крайніх значеннях. Референсні fixed System bounds:

```text
Min = (-700,-700,-500)
Max = ( 700, 700, 700)
```

Цей консервативний симетричний AABB охоплює прийняті direction variants для наведених speeds/lifetimes. Зменшуйте його лише після captures для ±X/±Y/+Z і material WPO. Назва й розташування Fixed Bounds **потребують ручної перевірки в Unreal Engine 5.8.**

### Advanced boundary

Не додавайте Collision, Events, Data Interfaces, Blueprint runtime control, custom Scratch Pad або Simulation Stages. Вони належать до блока 08. User parameters тут є лише безпосередньо експонованими inputs, оскільки цього вимагає Gate G07.

## 9. Візуальні або математичні приклади

Peak count estimate:

```text
Sprite peak = 20
Mesh peak = 12
Ribbon peak ≈ Rate 30/s × Lifetime .8 s = 24
System peak ≈ 56 living records
```

Direction:

```text
D = normalize(User.Direction), reject |D|≈0
Sprite cone axis = D
Mesh cone axis = D
Ribbon velocity = D × 320 + (0,0,80)
```

`User.Scale=2` подвоює базовий size sprite, scale mesh і width ribbon; це також підвищує ризик для bounds/coverage.

## 10. Контрольовані експерименти

1. Override EffectColor orange/cyan; усі три renderers мають реагувати.
2. Intensity `.25/1/3`; канал Core у material має реагувати, а alpha/timing — лишатися незмінними.
3. Scale `.5/1/2`; усі три geometric scales мають реагувати, а lifetime — лишатися незмінним.
4. Direction +X/+Y/діагональ; усі три emitters мають іти за спільним direction.
5. Direction дорівнює нулю; зафіксуйте порушення contract і відновіть ненульове значення.
6. Виконайте reset тричі; seeded distributions мають бути стабільними в точній збірці.
7. Вимикайте emitters по одному; визначте внесок і count кожного.
8. Перевірте bounds із чотирьох camera angles і на прийнятих крайніх User values.
9. Навмисно задайте неправильний binding, знайдіть перший несправний перехід і відновіть його.

## 11. Покрокова практика

### Каркас System і User Parameters

Створіть `NS_CP07_TrinityBurst`; додайте `User.EffectColor`, `User.Intensity`, `User.Scale`, `User.Direction` із defaults із таблиці. Групи System:

```text
System Properties
  Fixed Bounds enabled: Min(-700,-700,-500), Max(700,700,700)
System Spawn
  no added modules
System Update
  System State
```

### Emitter 1 — `NE_CP07_SpriteCore`

```text
Emitter Properties: CPUSim; Local False; Determinism True; Seed 801
Emitter Spawn: no added modules
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

Значення: Self/Complete/Once/1.2 s; burst `20`; lifetime `.45–.8`; input color — `User.EffectColor`; size `(7,38)×User.Scale`; radius sphere `10×User.Scale`; axis cone — `normalize(User.Direction)`, angle `30°`, speed `420–720`; Dynamic0 `(0,.1,User.Intensity,0)`; gravity `-650 Z`; drag `1.1`; alpha `0→1 на .04→утримання до .65→0 на 1`; velocity aligned, Face Camera, стандартний повний набір Sprite bindings, `MI_VFX_Sprite_Production`.

### Emitter 2 — `NE_CP07_MeshShards`

```text
Emitter Properties: CPUSim; Local False; Determinism True; Seed 802
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

Значення: Once `1.8 s`; burst `12`; lifetime `1–1.4`; color з User; випадковий mesh scale `.3–.6 × User.Scale`; radius sphere `8×Scale`; axis cone D, angle `45°`, speed `260–460`; випадковий initial rotation ±180°, angular velocity ±200°/s; Dynamic0 `(0,0,User.Intensity,0)`; gravity `-700 Z`; drag `.5`; крива scale `.5→1→.25`; Mesh `SM_VFX_Debris_A`, material `MI_VFX_Mesh_Production`, Facing Default, повний набір Mesh bindings.

### Emitter 3 — `NE_CP07_RibbonAccent`

```text
Emitter Properties: CPUSim; Local False; Determinism True; Seed 803
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

Значення: Self/Complete/Once/1.2 s; Rate `30/s`; lifetime `.8`; color з User; width `10×User.Scale`; twist `0`; velocity `normalize(Direction)×320 + (0,0,80)`; Dynamic0 `(0,.08,User.Intensity,0)`; Drag `.15`; крива width `0,.08,.75,1→0,1,1,0`; така сама alpha; Screen facing, UV tiling `45`, Automatic, повний набір Ribbon bindings, `MI_VFX_Ribbon_Production`.

### Точна реалізація User bindings

Використовуйте dropdowns у module input, щоб прив’язати `User.*`; за потреби використовуйте dynamic inputs `Normalize`, `Multiply Vector by Float`, `Add Vector`. Точні labels ієрархії dynamic-input/menu **потребують ручної перевірки в Unreal Engine 5.8.** Не створюйте Scratch Pad, щоб обійти невизначеність label.

### Evidence

Зробіть captures default-варіанта й ще двох variants:

| Variant | Color | Intensity | Scale | Direction |
|---|---|---:|---:|---|
| Default | orange | `1` | `1` | `(1,0,0)` |
| Arcane | cyan | `1.5` | `.75` | `(0,1,0)` |
| Heavy | red | `2.0` | `1.5` | `(.7,.7,.2)` |

Надайте повні stacks, bindings, peak counts, зображення bounds і один trace particle від spawn до death для кожного renderer.

## 12. Точні назви UE nodes, modules і налаштувань

Усі foundation modules з 07.01–07.07, а також:

- `User Parameters`;
- `Make New > Common > Linear Color`, `Float`, `Vector`;
- dynamic inputs `Normalize`, `Multiply Vector by Float`, `Add Vector`;
- System/Emitter `Fixed Bounds`;
- повний набір bindings Sprite/Mesh/Ribbon Renderer.

Точні назви panel User Parameters і dynamic-input labels **потребують ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Emitter | Seed | Spawn | Lifetime | Motion |
|---|---:|---|---|---|
| Sprite | `801` | Burst `20` | `.45–.8` | cone `420–720`, gravity `-650`, drag `1.1` |
| Mesh | `802` | Burst `12` | `1–1.4` | cone `260–460`, gravity `-700`, drag `.5` |
| Ribbon | `803` | Rate `30/s ×1.2 s` | `.8` | D×`320` + Z`80`, drag `.15` |

User defaults і bounds наведено в розділах 8/11.

## 14. Очікуваний результат кожного етапу

- Sprite одразу дає directional streak core.
- Mesh додає повільніший обертовий silhouette.
- Ribbon малює безперервний accent уздовж спільного direction.
- User color/intensity/scale/direction впливають на всі три emitters через явно задані inputs.
- Reset до defaults відтворює distributions.
- Peak count приблизно відповідає задокументованій таблиці.
- Bounds не спричиняють culling для прийнятих variants.
- Після вимкнення одного emitter решта stacks продовжують працювати.

## 15. Самостійна вправа

### `EX-L07-08-A` — Оригінальний variant Trinity / репетиція Gate

Не копіюючи попередній System asset, перебудуйте `NS_EX_L07_08_Trinity` із blank System за трьома повними контрактами stack. Виберіть оригінальну палітру й одну варіацію руху в межах ±25% від стартових значень. Збережіть чотири User controls, CPU rationale, детерміновані seeds, повний набір bindings, виміряні bounds/counts і не додавайте advanced modules.

[Повне еталонне рішення A](../EXERCISE_ANSWERS/L07-08_niagara_foundations_control_project_answers.md#ex-l07-08-a)

## 16. Додаткова складніша вправа

### `EX-L07-08-B` — Аудит faults і продуктивності

У дублікаті навмисно створіть чотири дефекти: неправильний Sprite Color Binding; Mesh Local Space true; неправильний Ribbon Link Order Binding; Mesh Gravity нижче Solver. Діагностуйте кожний за схемою symptom→перший несправний stage→мінімальне виправлення→regression. Потім порівняйте bounds/coverage для default і Scale=2 та запишіть peak counts без вигаданих значень у мілісекундах.

[Повне еталонне рішення B](../EXERCISE_ANSWERS/L07-08_niagara_foundations_control_project_answers.md#ex-l07-08-b)

## 17. Три рівні підказок

### Для `EX-L07-08-A`

- **Hint 1:** намалюйте три схеми stack до відкриття Niagara.
- **Hint 2:** прив’язуйте User values у module inputs; renderer і далі читає `Particles.*`.
- **Hint 3:** порядок приймання: solo emitter → перехід у material → спільні controls → усі emitters → counts/bounds.

### Для `EX-L07-08-B`

- **Hint 1:** вимкніть два emitters і відтворіть один симптом.
- **Hint 2:** перевіряйте в такому порядку: writer → stage/order → attribute → renderer binding → material.
- **Hint 3:** відповідні виправлення: Color→Particles.Color; Local False; LinkOrder→Particles.RibbonLinkOrder; Gravity над Solver.

## 18. Типові помилки

- User parameter існує, але жодний module input його не читає;
- renderer безпосередньо прив’язаний до несумісного User type замість particle attribute там, де він потрібен;
- Direction дорівнює нулю;
- GPU обрано без потреби;
- між evidence captures приховано використано різні seeds;
- material одного renderer не має потрібного usage/Particle Color;
- fixed bounds перевірено лише для default direction/scale;
- усі emitters мають Local, тому що System прикріплений;
- advanced Events/Collision/Scratch Pad додано, щоб «покращити» brief.

## 19. Усунення несправностей

| Симптом | Ізоляція | Мінімальне виправлення |
|---|---|---|
| один renderer ігнорує color | solo, перевірте writer/binding/material | прив’яжіть Color до `Particles.Color`, а в material — Particle Color |
| mesh рухається за source | Emitter Properties | Local Space false |
| ribbon фрагментується | ID/LinkOrder/rate | відновіть точні bindings і щільність points |
| gravity ігнорується | порядок force/solver | перемістіть Gravity над solver |
| Scale впливає лише на один emitter | простежте кожний module input | прив’яжіть User.Scale в усіх трьох |
| direction непослідовний | normalized input/space | один контракт D у Simulation/world |
| variant відсікається | bounds/крайні значення | повторіть captures і скоригуйте виміряний AABB |

## 20. Міркування щодо продуктивності

- Записуйте peak для кожного emitter і загальний підсумок; Rate×Lifetime є оцінкою, а debugger дає спостережене значення.
- User.Scale змінює pixel/geometry coverage і bounds, навіть якщо particle count лишається незмінним.
- Ribbon tessellation і translucent width можуть переважати вплив її малої кількості points.
- Mesh count потрібно оцінювати разом із налаштуваннями triangles/material/shadows.
- Overlap/size sprite можуть визначати більшість overdraw.
- CPU rationale ґрунтується на features/count; виміряйте репрезентативну сцену, перш ніж змінювати target.
- Завеликі Fixed Bounds знижують ефективність culling, а замалі спричиняють popping. Використовуйте найменший перевірений box для прийнятих controls.

## 21. Запитання для самоперевірки

1. Чому User parameter не стає автоматично атрибутом Particles?
2. Які чотири controls експоновано?
3. Чому Direction потрібно нормалізувати?
4. Чому нульовий direction є неприпустимим?
5. Яка оцінка peak living?
6. Чим обґрунтовано вибір CPU для всіх emitters?
7. Що мають охоплювати bounds?
8. Які modules заборонено в цьому scope?
9. Як простежити шлях Sprite color?
10. Що потрібно пояснити для одного particle від spawn до death?

## 22. Відповіді

1. Scope і шлях даних відрізняються; module має прив’язати або скопіювати значення.
2. EffectColor, Intensity, Scale, Direction.
3. Щоб magnitude direction приховано не змінювала speed.
4. Він не має визначеного axis і руйнує directional motion.
5. ~56.
6. Низький count, відсутність GPU-only потреб, детермінована перевірка й відсутність виміряного bottleneck.
7. Повний рух, width/size/WPO для всіх прийнятих User variants.
8. Collision, Events, Data Interfaces, Scratch Pad, Simulation Stages, Blueprint runtime control.
9. User/Initialize write → `Particles.Color` → renderer Color Binding → material Particle Color.
10. Час spawn і початкові attributes, update forces/curves, читання в renderer та death після lifetime.

## 23. Контрольний список самоперевірки

- [ ] Створений з blank System, три emitters.
- [ ] Усі повні stacks задокументовано.
- [ ] Чотири User parameters із types/defaults/ranges.
- [ ] Явний trace User→module→Particles→renderer/material.
- [ ] Seeds 801–803 і reset protocol.
- [ ] CPU rationale.
- [ ] Таблиця peak count.
- [ ] Bounds перевірено на variants.
- [ ] Немає відхилення в advanced-теми.
- [ ] Вправи A/B і докази Gate завершено.

## 24. Критерії опанування

Gate `G07` пройдено, коли multi-renderer System відповідає brief, modules розміщено в логічних stages, bindings працюють, User controls впливають на всі renderers, детерміновані докази відтворюються, bounds/counts задокументовано, а ви можете пояснити шлях одного Sprite, Mesh і Ribbon point від spawn до death. Формальна оцінка: `≥80/100` із мінімумами за категоріями в `BLOCK_ASSESSMENT.md`.

## 25. Підсумок

Foundations завершується одним придатним до перевірки System: спільний art direction, окремі stacks для кожного renderer, явні шляхи даних, виміряні bounds/counts і обґрунтована CPU simulation. Якісна інтеграція зберігає прозорість, а не приховує поведінку в advanced mechanisms.

## 26. Зв’язок із наступними уроками

Після `G07` у 08.01 тестуються CPU/GPU simulation і вибір collision; у 08.02 — Events/Data Interfaces; у 08.03 — повний шлях User/Blueprint data; у 08.04 — Scratch Pad/Simulation Stages; у 08.05 — поглиблена робота зі scalability/bounds. Не розв’язуйте завдання цих уроків наперед.

## 27. Офіційні джерела

- [Creating Visual Effects in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-visual-effects-in-niagara-for-unreal-engine)
- [System and Emitter Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-and-emitter-module-reference-for-niagara-effects-in-unreal-engine)
- [Emitter Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/emitter-update-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Spawn Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-spawn-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-update-group-reference-for-niagara-effects-in-unreal-engine)
- [Render Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine)
- [System Settings Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine)
- [Niagara Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-debugger-for-unreal-engine)
- [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. System Overview з усіма трьома повними stacks.
2. Types/defaults User Parameters і три instance variants.
3. Повні панелі bindings Sprite/Mesh/Ribbon.
4. Схема потоку даних User→Particles→Renderer→Material.
5. Capture peak count/debugger.
6. Зображення bounds для default і variants Scale=2/direction.
7. Чотири пари fault до/після виправлення.
