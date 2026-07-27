# Підсумкове оцінювання блоку 07 — Niagara Foundations

## Призначення і час

Це контрольна точка опанування `G07`. Оцінювання перевіряє, чи можете ви з **Empty System** побудувати й пояснити multi-renderer Niagara effect без готового stack.

Час: **7 годин у межах контрольної фази L07-08**. Це формальне самостійне проходження або повторне оцінювання, а не додаткове навчальне навантаження. Воно **не збільшує 60 годин блока**.

## Правила академічної самостійності

- Під час практичної частини **заборонено використовувати покроковий текстовий або відеоурок**, screen-by-screen guide, готовий Niagara stack чи copied emitter.
- **Заборонено відкривати файли розв’язків уроків**, `EXERCISE_ANSWERS/L07-*_answers.md` і [ключ оцінювання](../EXERCISE_ANSWERS/B07_BLOCK_ASSESSMENT_KEY.md) до завершення та фіксації власної здачі.
- Дозволено офіційну документацію Epic, `SOURCES.md`, `02_GLOSSARY.md` і власні нотатки, створені до початку оцінювання, якщо вони не містять copied step-by-step solution.
- Починайте з `Empty System`; не створюйте duplicate guided/control System або emitter.
- Дозволено повторно використати лише перевірені source assets: `MI_VFX_Sprite_Production`, `MI_VFX_Mesh_Production`, `MI_VFX_Ribbon_Production`, `SM_VFX_Debris_B`.
- Заборонені Collision, Events, Data Interfaces, Scratch Pad, Simulation Stages і Blueprint runtime control: вони не потрібні brief і належать наступному блоку.
- Запишіть build UE `5.8.x`, platform, quality, resolution, test camera/exposure і протокол Reset.
- Version-sensitive UI позначайте: **«Потребує ручної перевірки в Unreal Engine 5.8.»**
- Не вигадуйте мілісекунди performance. Подайте відтворювані умови й спостережувані counts/captures.

## Здача

```text
/Game/SVFX/Tests/Assessment07/
├─ Systems/
│  ├─ NS_A07_TriadImpact
│  └─ NS_A07_TriadImpact_Fault
└─ Maps/
   └─ L_A07_NiagaraAssessment
```

Пакет доказів:

- відповіді на 20 запитань;
- повні screenshots System Overview з усіма розгорнутими groups;
- таблиці module/settings для кожного emitter;
- повні таблиці bindings Sprite/Mesh/Ribbon;
- таблиця type/default/range/source параметрів User;
- три User variants;
- три захоплення Reset одного default variant;
- peak alive counts для кожного emitter і загалом;
- вигляди bounds;
- один запис пошуку несправності;
- карта stack, trace spawn→death й обґрунтування CPU/GPU.

## Оцінка зі 100

| Категорія | Бали | Мінімум |
|---|---:|---:|
| Теоретичний тест | 20 | 12 |
| Практична робота | 60 | 36 |
| Пошук несправностей/performance | 10 | 6 |
| Самоперевірка/documentation | 10 | 6 |
| **Разом** | **100** | **80 загалом** |

Прохід: `≥80/100`, мінімум у кожній категорії й відсутність критичного блокера.

Критичний блокер:

- відсутній або не працює один із Sprite/Mesh/Ribbon Renderers;
- User controls існують лише за назвою й не мають робочого data path;
- forces стоять після solver у поданому production stack;
- renderer bindings зламані;
- немає доказів deterministic seeds/reset;
- copied tutorial або розв’язок уроку використано замість самостійної побудови;
- студент не може пояснити spawn→death хоча б однієї particle/point;
- brief оцінювання замінено advanced mechanism без обґрунтування.

## Частина 1 — теоретичний тест, 20 балів

Кожне питання — 1 бал. Відповідь: 2–5 речень або formula/table.

1. Чим Niagara System відрізняється від Emitter, Module і Parameter?
2. Коли виконуються System/Emitter/Particle Spawn та Update groups?
3. Чому порядок modules зверху вниз впливає на результат?
4. Поясніть Parameter Map без фрази «глобальна змінна».
5. Розрізніть `System.`, `Emitter.`, `Particles.`, `User.`, `Engine.`, `Module.`.
6. Порівняйте `Spawn Burst Instantaneous` і `Spawn Rate`.
7. Обчисліть NormalizedAge для Age `.45 s`, Lifetime `1.5 s`; навіщо ця величина потрібна curves?
8. Що гарантує й чого не гарантує determinism/Random Seed?
9. Чому Shape Location має стояти до point-based velocity/force?
10. Запишіть правильний відносний порядок: `Particle State`, `Gravity Force`, `Drag`, `Solve Forces and Velocity`, appearance curve.
11. Порівняйте Local Space і World Space для вже створених particles під час руху component.
12. Чим Curl Noise, Point Attraction і Vortex відрізняються за структурою напрямку?
13. Чим Sprite Facing відрізняється від Alignment; який attribute потрібен Velocity Aligned?
14. Назвіть Sprite `Particles.Color` data path до material pixels.
15. Які attributes читають Mesh Orientation Binding і Scale Binding; що робить Velocity facing?
16. Яка роль `Particles.RibbonID`, `Particles.RibbonLinkOrder`, `Particles.RibbonWidth`?
17. За Rate `36/s`, Lifetime `.7 s` оцініть живі ribbon points і поясніть допуск.
18. Назвіть по одному головному performance risk для Sprite, Mesh і Ribbon.
19. Дайте обґрунтування CPU/GPU на основі features/count для System оцінювання.
20. Чому bounds потрібно перевіряти для variants User.Scale/Direction?

## Частина 2 — практична робота, 60 балів

### Бриф: `NS_A07_TriadImpact`

Побудуйте один System із трьома emitters із чистого шаблону:

#### Спільні User controls

| Parameter | Type | Default | Допустимо |
|---|---|---|---|
| `User.EffectColor` | Linear Color | `(1,.2,.03,1)` | дві додаткові читабельні палітри |
| `User.Intensity` | Float | `1` | `.25–3` |
| `User.Scale` | Float | `1` | `.5–2` |
| `User.Direction` | Vector | `(1,0,0)` | ненульовий, нормалізується під час використання |

Усі три emitters: `CPUSim`, `Local Space=False`, deterministic, без advanced modules.

#### Бриф Sprite

- name `A07_Sprite`;
- seed `7011`;
- burst `28 @ 0`;
- lifetime `.35–.70 s`;
- radius народження sphere `10×Scale`;
- cone уздовж normalized Direction, angle `35°`, speed `450–750 cm/s`;
- gravity `-700 Z`, drag `1.3`, forces до solver;
- non-uniform velocity-aligned size приблизно `(6,36)×Scale`;
- Particle Color і Dynamic0 Core=`User.Intensity`;
- production sprite material; повні bindings; обґрунтований sorting.

#### Бриф Mesh

- name `A07_Mesh`;
- seed `7012`;
- burst `10 @ 0`;
- lifetime `1.0–1.5 s`;
- `SM_VFX_Debris_B`, `MI_VFX_Mesh_Production`;
- scale `.35–.70×User.Scale`;
- cone Direction, angle `45°`, speed `250–450`;
- random initial orientation і angular velocity;
- gravity `-800 Z`, drag `.5`, правильні solver/update orientation;
- повні Mesh bindings, Facing Default.

#### Бриф Ribbon

- name `A07_Ribbon`;
- seed `7013`;
- Rate `36/s` для одного emitter loop тривалістю `1.0 s`;
- lifetime `.7 s`;
- width `9×Scale`, twist `0`;
- velocity `normalize(Direction)×300 + (0,0,70)`;
- drag `.15`, solver;
- tapered width/alpha;
- production ribbon material; Screen facing; UV0 Tiling Distance `40`; Automatic tessellation;
- повні Ribbon bindings і одна стабільна strip.

#### Умови приймання System

- fixed bounds System перевірено для Scale `.5/1/2` і Direction ±X/±Y;
- три default resets візуально й структурно відтворюються в записаному build;
- відкриті controls впливають на всі три emitters;
- подано estimated і observed peak counts;
- кожен emitter працює в Solo, і всі працюють разом;
- немає compile/dependency warning.

### Оцінювання практики

| Критерій | Бали |
|---|---:|
| Архітектура System, ясність group/stage/order | 10 |
| Sprite simulation/renderer/material/bindings | 12 |
| Mesh simulation/orientation/renderer/bindings | 12 |
| Ribbon sampling/linking/UV/renderer/bindings | 12 |
| Чотири User controls працюють у всіх emitters | 8 |
| Determinism, count і перевірені bounds | 6 |
| **Разом** | **60** |

## Частина 3 — Пошук несправностей/performance, 10 балів

Створіть дублікат `NS_A07_TriadImpact_Fault`. Вибір повністю детермінований і самостійний: задайте номер спроби `A`, починаючи з 1, і обчисліть `FaultSeed=((A-1) mod 4)+1`. Запишіть `A` та `FaultSeed`, а потім внесіть рівно одну відповідну несправність:

1. помістіть Mesh `Gravity Force` нижче `Solve Forces and Velocity`;
2. задайте Mesh `Local Space=True`;
3. прив’яжіть Sprite Color до unrelated/missing attribute;
4. прив’яжіть Ribbon Link Order до невідповідного сумісного attribute/default.

Не вносьте більше однієї несправності одночасно.

Запис першопричини — 6:

- expected проти actual — 1;
- відтворюване повторення — 1;
- ізоляція до першої несправної group/module/binding — 2;
- мінімальне виправлення — 1;
- regression на default плюс один User variant — 1.

Запис performance/bounds — 4:

- peak alive count для кожного emitter і загалом — 1;
- захоплення coverage default проти Scale 2 з фіксованої camera — 1;
- доказ відсутності cull через bounds для напрямків — 1;
- одна обґрунтована optimization з розкритим trade-off — 1.

Допустимі приклади optimization: зменшити Sprite size/overlap; знизити Ribbon Rate лише якщо shape лишається достатньо sampled; використати простіший mesh silhouette або вимкнути непотрібну material feature; звузити перевірені bounds. Не змінюйте непомітно camera/quality/count.

## Частина 4 — Самоперевірка/documentation, 10 балів

- повна hierarchy/stack map — 2;
- таблиця source для User/Particles/renderer/material — 2;
- по одному trace spawn→death для Sprite, Mesh і Ribbon point — 2;
- обґрунтування CPU/GPU з умовою майбутнього switch — 2;
- найсильніше рішення, найслабший ризик і один наступний експеримент — 2.

## Контрольна точка опанування G07

Проходження означає:

- multi-renderer System відповідає письмовому brief;
- усі modules розміщено в логічних stages і dependency order;
- bindings і User controls працюють;
- seeds, counts і bounds можна перевірити;
- студент пояснює одну particle від spawn через update/render до death;
- загальний бал і мінімуми категорій виконано без критичного блокера.

## Повторне оцінювання

Якщо не виконано загальний або категорійний мінімум:

1. збережіть невдалу submission і rubric;
2. визначте не більше трьох кореневих прогалин;
3. повторіть лише невдалі категорії з нового `Empty System`, де повторно перевіряється самостійність;
4. використайте нові seeds `7111–7113`, нову palette й наступний номер спроби `A`;
5. не відкривайте key або розв’язки уроків до фіксації доказів повторного оцінювання;
6. виконайте ті самі пороги. Час повторного оцінювання замінює інше контрольне проходження L07-08 і не додається до заявлених годин блока.

## Офіційні джерела

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
