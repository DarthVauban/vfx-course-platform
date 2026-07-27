# 1. Назва

## Урок 10.05 — Effect Types, H/M/L platform profiles, culling та presentation

# 2. Результат уроку

Після уроку ти зможеш:

- створити Niagara Effect Type для класу gameplay effects;
- пояснити significance як relative priority, а не visual quality score;
- налаштувати evidence-derived distance/instance/budget culling candidates;
- вибрати cull reaction і перевірити reactivation/reset behavior;
- створити High/Medium/Low variants, що зберігають gameplay semantics;
- розвести signature, core, secondary та optional layers;
- застосувати System/Emitter/Renderer scalability overrides за виміром;
- перевірити fixed/dynamic bounds і culling;
- сформувати окремі PC/console test profiles без стереотипних assumptions;
- перевірити local-player essential feedback;
- запустити gameplay-camera tests на representative concurrency;
- використовувати Sequencer лише для presentation після gameplay approval;
- пройти Block 10 assessment і mastery gate G10.

Ключовий результат — один gameplay-tested Big effect із Effect Type, H/M/L profile matrix, PC/console evidence та коротким presentation capture.

# 3. Орієнтовний час

**8 годин: 1.5 години теорії та 6.5 години практики.**

| Частина | T | P | Час |
|---|---:|---:|---:|
| Effect Type, significance, culling theory | 1 год | — | 1 год |
| H/M/L, platform та presentation theory | 30 хв | — | 30 хв |
| Effect Type guided setup | — | 1 год | 1 год |
| H/M/L + PC/console profiles | — | 1 год | 1 год |
| Bounds/culling/gameplay tests | — | 45 хв | 45 хв |
| Sequencer presentation-only pass | — | 30 хв | 30 хв |
| EX-L10-05-A evidence polish | — | 30 хв | 30 хв |
| [Block 10 assessment](BLOCK_ASSESSMENT.md) | — | 2 год 45 хв | 2 год 45 хв |
| **Разом** | **1 год 30 хв** | **6 год 30 хв** | **8 год** |

`EX-L10-05-B` — remediation/extension. Вона замінює 30-хвилинний evidence polish або виконується після weak assessment result; не додає часу до 40-годинного блока.

# 4. Prerequisites

- Завершено 10.04.
- Є `L10_BIG_EFFECT_PERFORMANCE_LEDGER.md`.
- Кожний Big/Hero effect має baseline pass.
- Є target hardware/build/scenario evidence щонайменше для двох delivery profiles.
- Є reusable Blueprint gameplay integration.
- Effect працює без Sequencer.
- Core path не використовує Beta/Experimental feature.

# 5. Нові терміни

| Термін | Пояснення |
|---|---|
| **Niagara Effect Type** | shared asset scalability, budget і validation для класу systems |
| **Significance** | relative ordering важливості, яке використовують scalability decisions |
| **Cull check** | перевірка eligibility за distance, visibility, instances або budget |
| **Cull reaction** | behavior system під час culling і після повернення до relevance |
| **Max instance policy** | derived у проєкті limit або candidate для shared чи per-system concurrency |
| **Scalability override** | adjustment System, Emitter або Renderer за profile чи platform |
| **Platform Set** | вибір applicability для platforms і quality configurations |
| **H/M/L profile** | delivery variants курсу High, Medium і Low, mapped на project settings |
| **Signature layer** | element, завдяки якому identity effect лишається впізнаваною |
| **Core gameplay layer** | telegraph, contact або shape, потрібні для читабельності під час гри |
| **Secondary layer** | додає richness, але може бути зменшений |
| **Optional layer** | видаляється першим у constrained profile |
| **Device Profile** | джерело configuration, specific для platform або hardware |
| **Presentation capture** | polished camera і edit після підтвердження gameplay correctness |

# 6. Навіщо ця тема потрібна VFX-фахівцю

Optimization однієї instance недостатньо. Реальні scenes відрізняються:

- великою кількістю impacts;
- nearby ultimate, яким володіє player;
- distant enemy abilities;
- кількома auras;
- split або extra views;
- діапазоном PC hardware;
- fixed console profile;
- змінним global FX load.

Scalability визначає, яка робота лишається і який visual contract зберігається. Поганий Low profile може прибрати telegraph, але зберегти decorative smoke: performance покращиться, а gameplay стане несправедливим.

# 7. Теорія простими словами

Effect Type — спільний rulebook для family, наприклад:

```text
NET_HeroAbility
NET_GameplayImpact
NET_AmbientLoop
```

Significance відповідає на питання: «яка active instance важливіша відносно інших?» Воно може враховувати distance або project-specific logic. Це не означає «High виглядає красивіше».

H/M/L мають зменшувати cost у такому порядку:

```text
optional decoration
→ secondary richness
→ заміна або зменшення expensive implementation
→ ніколи не прибирати essential telegraph, core або contact без gameplay approval
```

Numbers походять з evidence уроку 10.04 на цільовому обладнанні.

# 8. Детальні технічні пояснення

## 8.1 Effect Type assignment

Створи asset Niagara Effect Type і признач його в settings Niagara System.

Epic документує Effect Types як shared settings для collections на кшталт impacts або environmental FX і як спосіб одноразово налаштувати scalability та culling.

Очікувані locations і labels:

- `FX > Niagara Effect Type`;
- System `Effect Type`;
- `System Scalability Settings`;
- `Emitter Scalability Settings`;
- `Update Frequency`;
- `Cull Reaction`;
- `Significance Handler`.

**Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.2 Significance

Significance ранжує active effects, коли не всі з них можуть лишитися.

Питання для policy:

- effect local player проти distant NPC;
- gameplay telegraph проти decorative residue;
- close проти far;
- новий critical impact проти старого fading residue;
- on-screen проти off-screen.

Не роби висновок про точний behavior handler лише з його display name. Запусти controlled instances із відомими positions і ownership та перевір cull result.

## 8.3 Culling dimensions

Розглянь такі candidates:

- distance;
- total instances, що використовують Effect Type;
- instances того самого System;
- visibility;
- використання global FX budget;
- applicability для quality і platform.

Epic документує budget scaling Effect Type, зокрема maximum global usage і scaling curves для distance та instance count. Будь-який threshold або curve має походити з representative captures.

## 8.4 Cull reaction and re-entry

Коли system проходить culling, він може:

- перейти у pause або sleep;
- виконати deactivate або complete;
- виконати kill;
- використати proxy або alternative, де це підтримується.

Коли system знову стає relevant, він може:

- продовжити зі старого age;
- виконати reset або restart;
- лишитися відсутнім;
- виконати respawn через gameplay.

Перевір bursts: reset може повторно виконати fire. Перевір loops: sleep і resume можуть зберегти state або виявити stale state.

Exact `Cull Reaction`, reset-on-awaken-like options and behaviors: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.5 Bounds

Fixed bounds:

- часто мають менший update cost;
- дають predictable behavior;
- надто великі послаблюють visibility culling;
- moving або traveling effect може потребувати величезного range.

Dynamic bounds:

- слідують за particles;
- потребують update work;
- усе одно потребують validation за fast motion або WPO.

Використовуй bounds overlay Niagara Debugger і camera path.

## 8.6 H/M/L layer contract

Для одного Big effect:

| Layer | Role | High | Medium | Low |
|---|---|---|---|---|
| Telegraph | gameplay | зберегти | зберегти | зберегти |
| Core silhouette | gameplay/design | повний | зберегти | спростити, але лишити readable |
| Contact/impact | gameplay | повний | зберегти | зберегти key beat |
| Secondary sparks | richness | повні | зменшені | мінімальні або off, якщо безпечно |
| Smoke/residue | richness | повні | зменшити lifetime і count | скоротити або вимкнути |
| Ribbon/mesh decoration | signature/secondary | рішення за evidence | дешевший path | лише core |
| Light | optional/feedback | за measurement | зменшити або вимкнути | off, якщо не essential |
| Collision | behavior | лише необхідні particles | дешевше або менше | прибрати, якщо semantics збережено |
| Material distortion | signature/optional | за measurement | дешевша branch | off або дешевий substitute |

Ця matrix є semantic. Точні spawn counts і distances заповнюються на основі profiling.

## 8.7 System/Emitter/Renderer overrides

Можливі actions profile:

- scale spawn count;
- вимкнений emitter;
- вимкнений renderer;
- alternative renderer або mesh;
- зменшений detail ribbon;
- path material quality або static switch;
- вимкнені collision, light або sorting;
- коротші lifetime або coverage;
- інша policy texture або mip;
- culling за distance або visibility.

За можливості надавай перевагу shared scalability system перед вручну branched gameplay Blueprint.

## 8.8 PC profiles

PC — це range, а не один target. Визнач:

- приклади minimum, recommended і high hardware;
- targets resolution;
- mapping user scalability;
- constraints memory;
- expected concurrency.

Перевір actual machines і configurations. Не називай profile Epic в Editor «PC High proof».

## 8.9 Console profiles

Console є fixed лише після того, як названо конкретні platform, model, mode, resolution і build. Виконуй profiling на actual target або approved representative kit. Не повторно використовуй numbers PC.

Врахуй:

- fixed resolution і performance mode;
- balance CPU і GPU;
- memory і streaming;
- format platform;
- stable concurrency scenario.

## 8.10 Device Profiles and scalability

Device Profiles надають configuration для конкретних devices і platforms; scalability groups визначають quality settings. Priority configuration проєкту може перекрити очікування.

Точний mapping config, UI і profile належить project tech ownership. VFX artist записує selected profile і observed settings, а не змінює global config без узгодження.

## 8.11 Local-player essential effects

Effect Types можуть розрізняти culling behavior local player у поточних API і settings. Essential self-feedback може потребувати сильнішого retention, ніж remote decorative versions.

Ніколи не вводь local/remote difference без gameplay і readability review. Точні options: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.12 Sequencer boundary

Sequencer дозволено лише після того, як:

- gameplay Blueprint integration працює;
- notifies, sockets і parameters працюють;
- H/M/L проходять gameplay test;
- profiler evidence зафіксовано;
- culling і re-entry перевірено.

Sequencer може:

- розташувати presentation camera;
- організувати approved gameplay playback або capture;
- додати shot cuts;
- створити breakdown або beauty presentation.

Sequencer не може:

- замінювати gameplay spawn logic;
- приховувати відсутній re-entry або target behavior;
- слугувати profiling scenario, якщо actual product use не є цією sequence;
- бути єдиним evidence.

# 9. Візуальні або математичні приклади

## Приклад order significance

```text
1. Telegraph local player
2. Nearby active attack ворога
3. Distant active attack
4. Decorative residue
```

Це приклад design; project policy може відрізнятися.

## Profile reduction tree

```text
Чи потрібен layer для gameplay?
├─ Так → зберегти timing і readability; оптимізувати implementation
└─ Ні
   ├─ Signature? → зберегти дешевшу впізнавану form
   └─ Secondary або optional? → зменшити або прибрати за evidence
```

## Culling validation

```text
Distance near → threshold region → far
         записати visible state, cull reason, reaction і re-entry
```

# 10. Controlled experiments

## Experiment A — distance sweep

Переміщуй camera або actor через відомі distances. Зроби capture active і cull state, а не лише visibility. Повтори для H/M/L і local або remote ownership.

## Experiment B — instance significance

Створи ordered instances на різних distances і з різними roles. Перевищ виміряну candidate concurrency і запиши, які instances проходять culling.

## Experiment C — cull reaction

Для burst і loop:

1. стань irrelevant;
2. лишайся irrelevant;
3. повернися до relevance.

Перевір age, повторний fire burst, stale parameters і visual pop.

## Experiment D — fixed vs dynamic bounds

Використовуй той самий повний movement path. Порівняй popping, relevance і profiler evidence.

## Experiment E — H/M/L blind self-review readability

Створи randomized captures profiles без labels і детерміновано перемішай їх із `Seed=A`, де `A` — номер спроби; запиши seed і порядок. Після перерви самостійно заповни checklist для telegraph, direction, contact і element, а потім розкрий labels. Low проходить лише тоді, коли gameplay answers лишаються правильними. Optional peer/reviewer може повторити той самий checklist, але не є умовою проходження.

## Experiment F — gameplay vs Sequencer

Порівняй approved take з ігрової камери і presentation take. Будь-який behavior, видимий лише в Sequencer, є failure.

# 11. Покрокова керована практика

## A. Обери Big effect

Обери один effect із завершеним ledger 10.04. Запиши:

- gameplay role;
- signature, core, secondary і optional layers;
- bottleneck і contributors;
- target profiles;
- essential feedback local player.

## B. Створи Effect Type

Створи `NET_L10_HeroAbility`.

Признач його selected Niagara System. Не застосовуй global defaults до unrelated systems.

Встанови candidate policies significance і culling на основі ledger. Точні settings: **Потребує ручної перевірки в Unreal Engine 5.8.**

## C. Побудуй profile matrix

Для кожного layer заповни:

```text
role
High implementation
Medium implementation
Low implementation
причина за measurement
visual acceptance
applicability platform
```

Не вводь довільні spawn percentages як final values.

## D. Implement H/M/L

Використай доречну combination:

- Niagara scalability overrides;
- spawn count scaling;
- disable emitter або renderer;
- material quality/static switches;
- H/M/L User Parameter лише там, де shared scalability не може виразити потребу.

Зберігай Blueprint request, ActionID і lifecycle однаковими.

## E. Evidence PC і console

Створи test rows:

```text
Profile ID
Actual hardware/platform
Build
Resolution
Concurrency
H/M/L mapping
Debugger counts
CPU/GPU evidence
Memory evidence
Readability result
```

Кожен profile може обрати інший mapping H/M/L лише за наявності evidence.

## F. Bounds/culling

1. Покажи bounds.
2. Запусти повний motion effect.
3. Звузь bounds без clipping.
4. Виконай sweep distance і visibility.
5. Перевір re-entry.
6. Перевір local і remote.
7. Запиши cull reason і reaction.

## G. Gameplay camera

Перевір:

- один effect;
- representative concurrency;
- stress scenario;
- views спереду, збоку й ззаду;
- near і far distances;
- re-entry;
- target loss;
- animation interruption;
- owner destruction;
- switching profile і reload path, якщо це дозволяє проєкт.

## H. Sequencer лише для presentation

Створи `LS_L10_HeroPresentation` після gameplay pass.

- виконай bind camera і approved actors;
- зроби capture порівняння High, Medium і Low;
- додай labels і breakdown;
- не перебудовуй spawn або target logic в Event Track.

Exact Sequencer UI/tracks: **Потребує ручної перевірки в Unreal Engine 5.8.**

## I. Assessment

Виконай [BLOCK_ASSESSMENT.md](BLOCK_ASSESSMENT.md) за **2 год 45 хв**. Цей час уже включено у practice уроку.

# 12. Точні назви вузлів, модулів і налаштувань

- `Niagara Effect Type`
- `Effect Type`
- `System Scalability Settings`
- `Emitter Scalability Settings`
- `Scalability Overrides`
- `Platform Set`
- `Significance Handler`
- `Update Frequency`
- `Cull Reaction`
- `Cull By Distance`
- `Cull By Effect Type Instance Count`
- `Cull By System Instance Count`
- `Budget Scaling`
- `Max Global Budget Usage`
- `Max Distance Scale by Global Budget Use`
- `Max Instance Count Scale by Global Budget Use`
- `Fixed Bounds`
- `System Show Bounds`
- `Device Profiles`
- `Engine Scalability Settings`
- `Level Sequence`
- `Cine Camera Actor`
- `Camera Cuts`

Exact display names/options: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 13. Стартові значення параметрів

Універсальних numerical thresholds немає. Початкова content policy:

| Profile | Semantic старт |
|---|---|
| High | усі approved signature і core; optional layers за measurement |
| Medium | core і signature; зменшити дорогі secondary contributors |
| Low | telegraph, core і contact; найдешевша readable signature |
| Distance culling | вимкнено, доки measured sweep не визначить safe candidate |
| Instance culling | вимкнено до representative concurrency test |
| Global budget scaling | налаштовувати лише за project budget evidence |
| Bounds | достатньо tight для повного measured motion |
| Sequencer | лише presentation |

# 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат |
|---|---|
| Effect Type | призначено потрібній family |
| Significance | збережено правильні relative instances |
| H/M/L | той самий gameplay message |
| Medium | contributor зменшено з evidence |
| Low | telegraph, core і contact лишаються readable |
| Bounds | немає pop або надмірного box |
| Culling | reason і reaction predictable |
| Re-entry | немає неочікуваного stale state або повторного fire |
| PC/console | виміряно окремо |
| Sequencer | показує вже approved gameplay result |

# 15. Самостійна вправа

## EX-L10-05-A — Production H/M/L delivery

**Завдання:** перетвори один Big effect на H/M/L family, керовану Effect Type, для двох named target profiles.

**Обмеження:**

- thresholds походять з evidence 10.04;
- matrix signature, core, secondary і optional;
- bounds, culling і re-entry перевірено;
- essential check local player;
- PC/console або два explicit profiles platform і hardware;
- gameplay перевірено до presentation;
- Sequencer використано лише для final comparison.

**Deliverables:**

- asset Effect Type;
- matrix H/M/L;
- таблиця platform;
- captures Debugger, CPU, GPU і memory;
- H/M/L з ігрової камери;
- presentation sequence або capture.

**Acceptance criteria:**

- Effect Type призначено;
- culling і significance predictable;
- H/M/L readable;
- measured contributor зменшується між profiles там, де це заплановано;
- немає failure bounds або re-entry;
- claims platform мають metadata;
- Sequencer не замінює gameplay logic.

# 16. Додаткова складніша вправа

## EX-L10-05-B — Scalability failure/remediation lab

**Завдання:** інжектуй overly large bounds, unsafe Low profile, wrong significance ordering і повторний fire burst під час re-entry, а потім виконай remediation.

**Обмеження:**

- один fault на кожен capture;
- зберігай той самий scenario;
- слабке виправлення «просто зменш counts» не приймається;
- remediation спрямована на root policy;
- повтори на обох named profiles.

**Deliverables:**

- чотири failures;
- logs cull і state;
- виправлені matrix і settings;
- result відкладеного самооцінювання без підказок readability;
- докази продуктивності до і після;
- limitation, що лишилася.

**Acceptance criteria:**

- кожну першопричину визначено;
- bounds tight і охоплюють повний motion;
- Low зберігає gameplay;
- significance зберігає правильну instance;
- re-entry не створює duplicate і не виконує неочікуваний refire;
- evidence повторюється на обох profiles.

# 17. Три рівні підказок

## EX-L10-05-A

- **Hint 1:** збережи gameplay role до зменшення cost.
- **Hint 2:** класифікуй layers як signature, core, secondary і optional, потім пов’яжи кожне reduction із contributor 10.04.
- **Hint 3:** створи Effect Type, признач system, реалізуй measured overrides H/M/L, перевір bounds, culling і re-entry на двох profiles, і лише тоді створи comparison у Sequencer.

[Повне рішення EX-L10-05-A](../EXERCISE_ANSWERS/L10-05_scalability_platform_profiles_and_presentation_answers.md#ex-l10-05-a)

## EX-L10-05-B

- **Hint 1:** неправильний visual після culling може бути наслідком reaction або re-entry, а не лише distance.
- **Hint 2:** спостерігай cull reason, ActionID, system age, bounds і significance збереженої instance.
- **Hint 3:** виправ bounds відповідно до motion, перероби Low за roles, скоригуй significance policy, обери перевірені cull reaction і reset behavior; повтори той самий scenario.

[Повне рішення EX-L10-05-B](../EXERCISE_ANSWERS/L10-05_scalability_platform_profiles_and_presentation_answers.md#ex-l10-05-b)

# 18. Типові помилки

| Помилка | Наслідок |
|---|---|
| Випадковий distance limit | важливий effect має pop |
| Low спочатку видаляє telegraph | gameplay стає unreadable і unfair |
| High, Medium і Low мають окрему logic | lifecycle divergence |
| Усі effects використовують один Effect Type | неправильна shared policy |
| Significance не перевірено | зберігається неправильна instance |
| Bounds надто великі | culling неефективний |
| Bounds надто малі | visual clipping |
| Cull reaction не перевірено | bursts виконують refire або loops мають stale state |
| PC і console існують лише як labels | немає hardware evidence |
| Є лише proof із Sequencer | gameplay integration не перевірено |

# 19. Troubleshooting

## Culling прибирає неправильну instance

Перевір assignment Effect Type, inputs significance, ownership local player, distance та ordering instances. Зроби capture cull reason.

## Low profile нечитабельний

Віднови telegraph, core і contact; зменш optional чи secondary layers або implementation cost. Повтори відкладений самооцінювання ігрової читабельності без підказок з `Seed=A`, прихованими labels і тим самим deterministic checklist.

## Effect повторно виконує fire після повернення

Перевір cull reaction, reset і age behavior, lifecycle burst та gameplay re-entry. **Потребує ручної перевірки в Unreal Engine 5.8.**

## Effect ніколи не проходить culling

Перевір oversized bounds, assignment Effect Type, applicability culling і profile, exemptions owner або local player та visibility.

## Console profile гірший за припущення для PC

Відкинь припущення; перевір actual platform, build і resolution, memory та bottleneck CPU або GPU. Перебудуй profile за capture.

## Presentation відрізняється від gameplay

Прибери Sequencer-only overrides і events та зроби capture approved gameplay-driven action.

# 20. Performance considerations

- Culling зменшує aggregate work, але transition і re-entry також мають бути correct.
- Часті scalability updates мають cost; update frequency є trade-off.
- Computation significance і management instances не безкоштовні.
- H/M/L мають зменшувати measured contributor, а не лише cosmetic count.
- Bounds визначають relevance visibility.
- Platform profiles потребують evidence CPU, GPU, memory і quality.
- Зміни Global Project Settings впливають на unrelated systems; використовуй scoped ownership.
- Presentation capture із Sequencer не є доказом продуктивності в ігрових умовах.
- Універсальних budget для distance, instances, ms, particles або memory тут немає.

# 21. Запитання для самоперевірки

1. Що зберігає Niagara Effect Type?
2. Що означає significance?
3. Які culling dimensions треба розглянути?
4. Чому cull reaction треба тестувати на re-entry?
5. Чим fixed bounds можуть бути гірші?
6. Які layers Low profile має захищати?
7. Чому PC і console не можна профілювати одним label?
8. Навіщо local-player check?
9. Коли Sequencer дозволений?
10. Звідки беруться thresholds?

# 22. Відповіді

1. Він зберігає shared rules scalability, budget, culling і validation для system family.
2. Це relative importance, яку використовують scalability decisions.
3. Треба розглянути distance, visibility, instances Effect Type і System, global budget, platform та quality.
4. Sleep, kill, reset або resume можуть повторно запустити bursts чи створити stale state.
5. Великий fixed box лишає effect relevant ще довго після того, як visuals виходять із view.
6. Low захищає telegraph, core silhouette і direction та contact beat; signature лишається у найдешевшій readable form.
7. Hardware, build, resolution, bottleneck і memory відрізняються; сам label не є evidence.
8. Essential self-feedback може потребувати іншого retention, ніж remote decoration.
9. Після approval gameplay integration, profiling, H/M/L і culling; лише для presentation.
10. Із evidence 10.04 на цільовому обладнанні, build і scenario та з gameplay review.

# 23. Self-check checklist

- [ ] Ledger big effect завершено.
- [ ] Effect Type створено й призначено.
- [ ] Significance перевірено.
- [ ] Candidates distance, instance і budget походять з evidence.
- [ ] Cull reaction і re-entry перевірено.
- [ ] Fixed і dynamic bounds перевірено.
- [ ] Matrix layers H/M/L заповнено.
- [ ] Core gameplay збережено.
- [ ] Check local player виконано.
- [ ] Два named target profiles перевірено.
- [ ] Evidence CPU, GPU і memory збережено.
- [ ] Gameplay camera перевірено першою.
- [ ] Sequencer використано лише для presentation.
- [ ] Ledger 4 годин M/S із 10.04 присутній.
- [ ] Assessment завершено.
- [ ] Універсальний budget не вигадано.

# 24. Mastery criteria

Урок і G10 засвоєно, якщо:

1. gameplay integration працює без Sequencer;
2. runtime parameters, sockets, notifies і lifecycle лишаються correct;
3. Effect Type і culling дають predictable behavior;
4. H/M/L зберігають gameplay semantics;
5. два named profiles мають evidence;
6. кожен Big effect пройшов перевірку продуктивності;
7. ledger 4 годин M/S завершено;
8. assessment має результат ≥80/100 і проходить category floors.

# 25. Підсумок

Scalability — це кероване збереження gameplay message під різними constraints. Effect Type, significance, culling, bounds, H/M/L і platform profiles мають спиратися на profiler ledger. Sequencer лише показує вже завершену production роботу.

# 26. Зв’язок із наступними уроками

Block 11 використовує G10 для portfolio pieces. Кожний piece успадкує gameplay integration, H/M/L, profiling, big-effect ledger та presentation boundary.

# 27. Офіційні джерела

- Epic Games. [Performance Budgeting Using Effect Types](https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-budgeting-using-effect-types-in-niagara-for-unreal-engine).
- Epic Games. [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara).
- Epic Games. [UNiagaraEffectType API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraEffectType).
- Epic Games. [Niagara System Settings Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine).
- Epic Games. [Scalability Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-reference-for-unreal-engine).
- Epic Games. [Setting Device Profiles](https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-device-profiles-in-unreal-engine).
- Epic Games. [Sequencer Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-sequencer-movie-tool-overview).

# 28. Рекомендовані скриншоти або схеми

```text
1. Схема assignment Effect Type і family.
2. Scene ordering significance.
3. Timeline cull reason, reaction і re-entry.
4. Порівняння tight та oversized bounds.
5. H/M/L matrix signature, core, secondary і optional.
6. Таблиця evidence profiles PC і console.
7. Порівняння H/M/L із gameplay camera.
8. Схема boundary presentation для Sequencer.
9. Overview delivery package G10.
```
