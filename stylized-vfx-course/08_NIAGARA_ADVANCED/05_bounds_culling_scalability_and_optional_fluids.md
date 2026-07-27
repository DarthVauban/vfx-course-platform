# 1. L08-05 — Bounds, culling, scalability та optional Niagara Fluids

| Поле | Значення |
|---|---|
| Блок | 08 — Niagara Advanced |
| Lesson ID | L08-05 |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | Bounds/scalability-controlled advanced System, culling matrix і optional Fluids-to-flipbook dossier |
| Mastery gate | Ефект не зникає в intended range, коректно cull-иться поза ним і зберігає ігрову підказку на нижчих tiers |

## 2. Результат уроку

Ви навчитеся:

- розуміти, як bounds беруть участь у visibility/culling;
- порівнювати fixed і dynamic bounds trade-offs;
- включати velocity, lifetime, component motion, mesh size та WPO у bounds envelope;
- будувати camera-edge, off-screen, re-entry і fast-motion tests;
- створювати High/Medium/Low Niagara renderer/emitter policy;
- відокремлювати ігрову підказку від cosmetic layers;
- підготувати Effect Type/scalability integration notes;
- коректно трактувати Niagara Fluids як Beta й факультативну feature;
- оцінити fluids-to-flipbook як можливий спосіб подання для фінальної збірки без обіцянки універсального workflow.

Доказ: bounds proof, tier comparison, culling/re-entry capture і Block 08 assessment.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Bounds/culling/scalability theory | 1.0 | 0 |
| Guided bounds/tier build | 1.5 | 1.5 |
| Controlled validation | 0.5 | 0.5 |
| Block assessment | 2.0 | 2.0 |
| **Разом** | **5.0** | **4.0 (80%)** |

Optional Fluids study замінює частину guided extension або виконується понад 28 годин блока; воно не додає обов’язкових годин і не входить у mastery gate.

## 4. Prerequisites

| Навичка | Де | Перевірка |
|---|---|---|
| Bounds baseline | L01-04, G07 | System не pop-иться у test level |
| Рішення CPU/GPU | L08-01 | Запис Sim Target |
| DI/Events | L08-02 | Target limits documented |
| Runtime contract | L08-03 | Safe defaults/reset |
| Custom module/stage | L08-04 | Докази підтримки й вартості Stage |
| Material WPO/coverage | L04-04, G04 | Ураховано максимальний WPO |

## 5. Нові терміни

| Термін | Пояснення |
|---|---|
| Bounds envelope | Мінімальний об’єм, що охоплює intended rendered motion |
| Fixed Bounds | Manually defined stable bounds |
| Dynamic bounds | Bounds обчислюються або оновлюються з поточних simulation/render data |
| Frustum culling | Skip, коли bounds поза camera frustum |
| Distance culling | Пропуск або спрощення за межами правила distance |
| Visibility culling | Правило на основі стану rendered/visibility |
| Significance | Relative importance instance для scalability decisions |
| Effect Type | Спільний asset політики scalability/budget Niagara |
| Scalability override | Відхилення конкретного System/emitter від спільної політики |
| Spawn Count Scale | Tier multiplier для spawn amount |
| Cue parity | Lower tier зберігає gameplay meaning/timing/area |
| Niagara Fluids | Beta plugin/templates для grid-based simulations рідин |
| Bake/flipbook | Перетворення simulation frames на подання в атласі текстур |

## 6. Навіщо ця тема потрібна VFX-фахівцю

Неправильні bounds дають дві протилежні проблеми:

- надто малі — effect рано зникає/pops;
- надто великі — renderer пізно cull-ить effect і виконує зайву роботу.

Scalability не повинна просто «зробити все вдвічі меншим». Для gameplay VFX треба зберегти:

- момент telegraph/hit;
- область впливу;
- team/element color cue;
- primary silhouette/direction;
- readable duration.

Прибираються cosmetic trails, small sparks, extra distortion, high-frequency smoke, dynamic light—після validation.

Niagara Fluids може створити складний motion, але Beta status, grid cost, memory і platform support роблять його факультативним. Для stylized gameplay часто корисніше bake-нути controlled simulation у flipbook і відтворити дешевшим Sprite material.

## 7. Теорія простими словами

Bounds оцінює не «де emitter origin», а де може бути rendered effect:

```text
Maximum displacement
≈ initial spread
 + speed × lifetime
 + acceleration contribution
 + component/attachment motion
 + renderer half-size
 + WPO maximum
```

Для constant acceleration rough upper envelope:

```text
Distance ≈ v0 × t + 0.5 × a × t²
```

Це conservative estimate, не заміна visual validation.

Tier logic:

```text
Core cue: always
Secondary support: High + Medium
Cosmetic polish: High
```

## 8. Детальні технічні пояснення

### Fixed vs dynamic bounds

Fixed:

- stable/predictable;
- у деяких workflows уникає безперервного обчислення bounds;
- must cover full intended motion;
- too large hurts culling.

Dynamic:

- adapts to current particles;
- може мати компроміси update/readback/cost/latency;
- може поводитися по-різному залежно від CPU, GPU і settings System;
- усе одно потребує перевірки для швидкого motion/WPO.

Точні режими bounds Niagara й поведінка GPU:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Bounds space

Bounds можуть бути authored відносно System/component і transformed у world. `Local Space` emitters та attached moving components змінюють interpretation. Перевірте rotation/scale/attachment.

### Material WPO

Renderer geometry може рухатися поза particle position/size:

```text
Particle bounds contribution
 + Mesh/Sprite extent
 + Material WPO maximum
```

Niagara не може надійно infer arbitrary Material WPO. Задокументуйте його у bounds sheet.

### Culling and simulation state

Коли відбувається cull/deactivate:

- simulation may stop, pause, reset, complete або continue depending policy;
- re-entry може перезапустити, відновити або показати застарілий стан.

Точні properties реакції в Effect Type/System scalability:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Перевіряйте re-entry, а не лише disappearance.

### Scalability layers

Можливі controls:

- distance;
- visibility;
- instance count;
- significance;
- quality level;
- spawn count scale;
- emitter/renderer enable;
- update frequency;
- system cull/deactivation response.

Не поєднуйте contradictory System і Effect Type overrides без ownership table.

### Effect Type

Effect Type групує shared policies/budgets між Systems. У блоці 10 actual project budgets буде профільовано й налаштовано. Тут підготуйте:

- category;
- significance goal;
- culling behavior;
- variants platform/quality;
- critical/non-critical layers.

### Niagara Fluids status

Офіційна документація UE 5.8 позначає Niagara Fluids як **Beta**. Отже:

- optional only;
- no core portfolio dependency;
- no production-ready guarantee;
- точну підтримку plugin/templates/platform перевірено вручну;
- memory/GPU cost profiled;
- fallback representation required.

Вартість 2D/3D grid simulation суттєво відрізняється. 3D volume не є автоматичним вибором для gameplay fire/smoke.

## 9. Візуальні й математичні приклади

### Bounds estimate

```text
Initial sphere radius = 50 cm
Max speed = 600 cm/s
Lifetime = 1.5 s
Gravity magnitude = 980 cm/s²
Sprite half-size = 32 cm
WPO = 8 cm

Horizontal rough = 50 + 600×1.5 + 32 + 8 = 990 cm
Vertical acceleration term = .5×980×1.5² ≈ 1102.5 cm
```

Actual direction/spawn/kill можуть зменшити потрібний volume, але test envelope має охоплювати intended extremes.

### Tier example

| Layer | Gameplay role | High | Medium | Low |
|---|---|---:|---:|---:|
| Core telegraph ring | area | ✓ | ✓ | ✓ |
| Hit flash | timing | ✓ | ✓ | ✓ |
| Direction ribbon | direction support | ✓ | ✓ | simplified |
| 100 sparks | cosmetic | 100% | 50% | 15%/off |
| Distortion | cosmetic | ✓ | off | off |
| Light | cosmetic | optional | off | off |

### Fluid grid intuition

Подвоєння resolution у кожному dimension:

```text
2D cells: ~4×
3D cells: ~8×
```

Actual cost також залежить від stages/iterations/features.

## 10. Controlled experiments

### CE08-05-A — Too-small bounds

1. Установіть навмисно малі фіксовані межі.
2. Перемістіть camera так, щоб origin вийшов із frustum, поки particles лишаються у visible region.
3. Зафіксуйте pop.
4. Відновіть calculated/validated bounds.

### CE08-05-B — Too-large bounds

1. Установіть enormous bounds.
2. Використайте debug bounds visualization.
3. Перемістіть effect далеко за межі view.
4. Зафіксуйте culling/profile difference, якщо вона вимірюється.
5. Зменште bounds до envelope.

### CE08-05-C — Re-entry

Перемістіть camera/effect `in→out→in` для:

- looping ambience;
- one-shot burst;
- attached aura.

Запишіть restart/resume/complete behavior.

### CE08-05-D — Tier cue parity

Зробіть captures High/Medium/Low з reference і far camera, приховайте labels та застосуйте детермінований циклічний порядок за номером спроби `A`; запишіть `A` і порядок. Після перерви пройдіть самооцінювання без підказок і до розкриття labels запишіть відповіді:

- де danger area;
- коли відбувається hit;
- яка team/element;
- який direction.

Optional peer/reviewer може повторити той самий checklist, але не є умовою проходження.

## 11. Покрокова керована практика

### Крок 1 — Побудуйте `NS_AdvancedControl`

Emitters:

```text
E_CoreCue
  Sprite/Mesh ring
  Always enabled

E_DirectionalSupport
  Ribbon or mesh arc
  High/Medium

E_CosmeticParticles
  Sprite sparks/smoke
  Scaled/disabled by tier

E_OptionalPolish
  Distortion/light-like layer if allowed
  High only
```

User API з L08-03 зберігається.

### Крок 2 — Compute envelope

Для кожного emitter запишіть:

| Emitter | Початковий spread | Максимальна speed | Lifetime | force/WPO/size | local/world | envelope |
|---|---:|---:|---:|---|---|---|
| Core | | | | | | |
| Direction | | | | | | |
| Cosmetic | | | | | | |

Об’єднайте extrema; не додавайте механічно unrelated opposite directions, якщо можливий tighter validated box.

### Крок 3 — Enable bounds visualization

Використайте доступний в UE 5.8 viewport/Niagara debug display bounds:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Зробіть captures у такі моменти:

- spawn;
- max expansion;
- max WPO;
- component moving;
- just before death.

### Крок 4 — Choose bounds mode

Створіть A/B:

- fixed validated;
- dynamic/default behavior.

Запишіть correctness і profile. Обирайте per System, а не за універсальною doctrine.

### Крок 5 — Culling test lane

Markers:

- 5 m;
- 15 m;
- 30 m;
- far/target gameplay distance;
- camera edge;
- behind-camera return.

Distances — це study markers, а не prescribed cull thresholds.

### Крок 6 — Tier variants

High:

```text
Core 100%
Directional 100%
Cosmetic 100%
Optional polish on
```

Medium:

```text
Core 100%
Directional 70% or simpler
Cosmetic 40–60%
Polish off
```

Low:

```text
Core 100%
Directional minimal readable
Cosmetic 0–20%
Polish off
Simpler material/renderers
```

Exact Niagara scalability controls/quality bindings:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 7 — Re-entry policy

Для one-shot:

- якщо cull відбувся до activation, визначте pre-cull behavior;
- якщо cull відбувся посеред effect, визначте continue/complete/restart;
- reset state pooled component.

Для looping aura:

- уникайте burst replay під час кожного visibility return, якщо це не задум;
- re-entry visual не має означати gameplay reactivation.

### Крок 8 — Effect Type preparation

Створіть або задокументуйте planned `NET_GameplayCritical`:

```text
Category: gameplay-critical cue
Significance: distance/visibility policy
Core cue protected
Cosmetic emitters scalable
Budgets: pending target measurements
Cull reaction: pending lifecycle test
```

Actual numeric budgets визначаються після target profiling у блоці 10.

### Крок 9 — Виконайте Block Assessment

Виконайте [BLOCK_ASSESSMENT.md](BLOCK_ASSESSMENT.md). Мінімум — 80/100, без critical fail.

### Крок 10 — Optional study Niagara Fluids

Лише якщо ви обрали цю опцію:

1. увімкніть Niagara Fluids plugin через UE 5.8 plugin workflow;
2. перезапустіть editor, якщо потрібно;
3. створіть найменший доступний 2D/3D template для smoke/fire study;
4. запишіть template/status/RHI;
5. змінюйте лише один parameter/iteration/resolution за раз;
6. виконайте profile і capture;
7. перевірте Niagara Baker/flipbook output workflow;
8. export/bake короткий atlas, якщо підтримується;
9. відтворіть atlas у стандартному Sprite material;
10. порівняйте live fluid і flipbook.

Точні plugin/template/Baker UI, layout atlas, padding і output:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Якщо workflow недоступний, подайте manual-verification dossier, а не вигадані steps/results.

## 12. Точні properties, stack і policy

### System/Emitter bounds checklist

```text
System Properties / Emitter Properties
  Bounds mode/value
  Local Space
  Sim Target
  Scalability
  Effect Type

Renderer
  Sprite/Mesh/Ribbon size
  Material WPO maximum

Motion
  initial position
  velocity
  forces
  target/attraction
  component movement
```

Exact property labels:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Tier ownership

| Control | Owner |
|---|---|
| Shared global category/budget | Effect Type |
| System-specific exception | System scalability override |
| Увімкнення / count layer emitter | Логіка scalability/quality emitter |
| Material feature | Material instance/static policy |
| Gameplay cue | Design contract, protected |

### Optional Fluids declaration

```text
Status = Beta
Required for G08 = No
Fallback = Sprite flipbook/mesh/ribbon
Target support = manual
Live performance = measured only
Bake pipeline = manual verification
```

## 13. Стартові значення

| Setting | Study start |
|---|---:|
| Core cue scale | 1 |
| Cosmetic spawn scale High | 1 |
| Medium | .5 |
| Low | .15 |
| Bounds padding | derived, потім minimal safety margin |
| WPO envelope | actual maximum із material |
| Distance markers | 5/15/30 m + target range |
| Optional fluid resolution | smallest template default |
| Опційні iterations | Default template, потім A/B з однією змінною |

Universal numeric cull/budget threshold не задається.

## 14. Очікуваний результат

| Stage | Evidence |
|---|---|
| Envelope | Math sheet + debug capture |
| Fixed/dynamic | Вибір із trade-off |
| Edge/off-screen | Без unintended pop у intended range |
| Re-entry | One-shot/loop behavior задокументовано |
| Tiers | Core cue parity |
| Effect Type | Ownership/budget values явно очікують measurement |
| Assessment | ≥80, без critical fail |
| Optional Fluids | Beta status/fallback/perf або verification dossier |

## 15. Самостійна вправа

### EX08-05-A — Bounds/scalability rescue

Дано broken advanced effect:

- pop на camera edge;
- enormous fixed bounds після quick fix;
- Low tier вилучає telegraph;
- looping aura знову burst-иться після re-entry;
- cosmetic particles домінують у cost.

Виконайте diagnosis і подайте:

- envelope;
- tight validated bounds;
- culling/re-entry policy;
- High/Medium/Low;
- cue parity review;
- locked before/after profile.

## 16. Додаткова складніша вправа

### EX08-05-B — Optional Fluids-to-flipbook dossier

Ця вправа optional і не оцінюється для G08.

Подайте:

- підтверджені UE build/plugin і Beta status;
- template/type/resolution/stages/iterations;
- live simulation profile;
- скриншоти workflow Baker або точний список ручних перевірок;
- flipbook atlas metadata;
- Sprite playback material/System;
- live vs baked visual/cost/limitations;
- production recommendation із fallback.

## 17. Три рівні підказок

### EX08-05-A

1. **Напрям:** вимірюйте maximum rendered extents, а не emitter origin.
2. **Структура:** spread + motion + size/WPO + component motion; потім camera/re-entry tests.
3. **Майже відповідь:** захистіть core ring/hit; зменште cosmetic count/layers; оберіть tight validated fixed або proven dynamic bounds; налаштуйте lifecycle так, щоб visibility return не повторював ігрову підказку.

### EX08-05-B

1. **Напрям:** почніть із найменшого template і змінюйте одну variable.
2. **Структура:** live grid → capture/bake → atlas validation → standard Sprite playback.
3. **Майже відповідь:** якщо Baker/template workflow не перевірено, зупиніться й позначте exact manual checks; не робіть Beta live fluid обов’язковим.

Повні розв’язки: [L08-05 answers](../EXERCISE_ANSWERS/L08-05_bounds_scalability_fluids_answers.md).

## 18. Типові помилки

| Помилка | Симптом | Виправлення |
|---|---|---|
| Bounds лише навколо origin | Pop | Full rendered envelope |
| Huge bounds | Ніколи не cull-яться | Tight validated value |
| WPO ігнорується | Mesh edge clips | Додати max WPO |
| Test лише static component | Attached fast effect pop-иться | Motion/rotation/scale tests |
| Low вилучає core | Gameplay unreadable | Cue parity gate |
| Conflicting overrides | Unpredictable tier | Ownership table |
| Re-entry не перевірено | Burst replay/stale loop | Lifecycle matrix |
| Вигадані budgets | False confidence | Target measurements |
| Fluids вважається production-ready | Platform/cost risk | Beta optional/fallback |
| 3D fluid за замовчуванням | Excess grid cost | Goal-driven 2D/flipbook alternative |

## 19. Troubleshooting

### Pop

```text
Debug bounds
→ renderer size/WPO
→ max motion/lifetime
→ local/component transform
→ cull distance/visibility
→ scalability response
```

### Never culls

```text
Bounds size
→ Effect Type/System overrides
→ attached owner visibility
→ loop state
→ debug mode/profile
```

### Wrong tier

```text
Active quality/platform
→ Effect Type
→ System override
→ emitter quality/scalability
→ renderer/material instance
```

### Fluid unavailable/blank

```text
Plugin enabled/restart
→ template compatibility
→ RHI/platform
→ bounds/grid domain
→ renderer/material
→ official Beta docs
```

Кожен exact UI/bug workaround:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 20. Performance considerations

- Tight correct bounds покращують correctness/efficiency culling.
- Dynamic bounds можуть мати update/readback trade-offs; fixed bounds можуть over-cover.
- Великий WPO, long lifetime і velocity розширюють envelope.
- Scalability має зменшувати particle count, layers, update frequency, renderer complexity і material features відповідно до measured bottleneck.
- Core cue має лишатися.
- Culling response може заощадити cost, але зламати lifecycle/re-entry.
- Effect Type budgets є target-specific.
- Cost fluid grid сильно масштабується з dimensional resolution та iterations.
- Live Fluids додає simulation/render cost; flipbook переносить cost у texture memory/overdraw.
- Профілюйте editor/packaged target і representative concurrency.

## 21. Запитання для самоперевірки

1. Що має охоплювати bounds?
2. Які два risks fixed bounds?
3. Чому WPO входить у envelope?
4. Що треба тестувати після culling?
5. Назвіть чотири protected cue properties.
6. Хто може own shared scalability policy?
7. Чому budgets не задаються універсально?
8. Який official status Niagara Fluids у UE 5.8?
9. Чому 3D resolution росте особливо дорого?
10. Який fallback для live fluid?

## 22. Відповіді

1. Усі rendered positions/extents у intended motion, включно з size/WPO/component.
2. Малий pop-иться; великий погіршує culling.
3. Shader рухає vertices поза particle/mesh static extent.
4. Re-entry/reset/resume/complete behavior.
5. Timing, gameplay area, основні silhouette/direction, color/readability команди або елемента.
6. Niagara Effect Type; System overrides лише documented exceptions.
7. Hardware/platform/content/concurrency/bottleneck різні.
8. Beta.
9. Подвоєння кожної axis дає приблизно 8× cells до врахування stage/feature costs.
10. Sprite flipbook/mesh/ribbon або простіший authored effect.

## 23. Self-check checklist

- [ ] Envelope включає size/WPO/motion.
- [ ] Bounds visualization зафіксовано.
- [ ] Fixed/dynamic choice обґрунтовано.
- [ ] Camera-edge/off-screen/re-entry tests пройдено.
- [ ] Tier ownership чіткий.
- [ ] High/Medium/Low зберігають core cue.
- [ ] Немає invented budgets.
- [ ] Block assessment ≥80.
- [ ] Fluids optional/Beta clearly labeled.
- [ ] Fallback representation documented.

## 24. Mastery criteria

Gate G08:

1. advanced System має correct bounds у intended range;
2. немає enormous catch-all bounds без evidence;
3. culling/re-entry behavior задокументовано;
4. High/Medium/Low проходять cue parity;
5. ownership Effect Type/system зрозумілий;
6. CPU/GPU/DI/module/runtime contracts лишаються valid;
7. assessment ≥80/100;
8. no critical fail;
9. Fluids is not required.

## 25. Підсумок

- Bounds є correctness і performance contract.
- Перевіряйте disappearance і return.
- Scalability вилучає cosmetic cost, зберігаючи ігрову підказку.
- Effect Type поширює policy; System override — explicit exception.
- Niagara Fluids у UE 5.8 має status Beta й є optional.
- Flipbook can be fallback, але його pipeline/memory/overdraw теж треба validate.

## 26. Зв’язок із наступними уроками

У блоці 09 ці contracts застосовуються до elemental archetypes. У блоці 10 Effect Types, platform profiles, profiling і actual budgets проходять production validation. Optional Fluids не стає prerequisite.

## 27. Офіційні джерела

- [System Settings Reference for Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Performance Budgeting Using Effect Types](https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-budgeting-using-effect-types-in-niagara-for-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Niagara Fluids](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-fluids-in-unreal-engine) — Epic Games, UE 5.8, **Beta**, доступ 2026-07-27.
- [Fluid Simulation Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/fluid-simulation-in-unreal-engine---overview) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Niagara Fluids Quick Start](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-fluids-quick-start-guide-for-unreal-engine) — Epic Games, UE 5.8 Beta, доступ 2026-07-27.

## 28. Рекомендовані скриншоти або схеми

```text
Скриншот 1
Debug bounds at spawn/max expansion/max WPO/camera edge.
Підписати calculated envelope.
```

```text
Скриншот 2
High/Medium/Low з однаковою camera/exposure.
Виділити protected core cue й removed cosmetic layers.
```

```text
Схема 3
Effect Type → System override → Emitter/Renderer/Material.
Поряд optional Beta Fluids → flipbook fallback.
```
