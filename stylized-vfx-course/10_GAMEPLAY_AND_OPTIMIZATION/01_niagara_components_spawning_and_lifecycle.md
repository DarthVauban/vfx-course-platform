# 1. Назва

## Урок 10.01 — Niagara Component, spawning і керований lifecycle

# 2. Результат уроку

Після уроку ти зможеш:

- пояснити різницю між `Niagara System` asset і runtime `NiagaraComponent`;
- обрати world-space spawn, attachment або persistent component;
- назвати призначення та очікувані pins `Spawn System at Location`;
- назвати призначення та очікувані pins `Spawn System Attached`;
- використати returned `NiagaraComponent` замість «fire-and-forget» там, де потрібен control;
- розрізняти `Auto Activate`, `Activate`, `Deactivate`, completion та `Auto Destroy`;
- прогнозувати behavior one-shot і infinite loop;
- обрати re-entry policy: ignore, restart, refresh або stack;
- пояснити pooling як reuse components, а не автоматичне прискорення будь-якого effect;
- скидати transform і runtime parameters перед повторною активацією;
- знайти leaked, prematurely destroyed або stale reused effect;
- побудувати `BP_VFX_LifecycleLab` із world, attached і persistent cases.

Ключовий deliverable — lifecycle demo з журналом станів та 20-кратним re-entry test.

# 3. Орієнтовний час

**8 годин: 2 години теорії та 6 годин практики.**

| Частина | T | P | Час |
|---|---:|---:|---:|
| Component/spawn/lifecycle mental model | 1 год 15 хв | — | 1 год 15 хв |
| Pooling, re-entry та ownership theory | 45 хв | — | 45 хв |
| Controlled lifecycle experiments | — | 1 год | 1 год |
| Guided `BP_VFX_LifecycleLab` | — | 2 год 15 хв | 2 год 15 хв |
| Exercises A/B | — | 2 год | 2 год |
| Stress test, evidence і self-check | — | 45 хв | 45 хв |
| **Разом** | **2 год** | **6 год** | **8 год** |

# 4. Prerequisites

- Пройдено G09.
- Є щонайменше один finite one-shot effect і один looping aura/trail.
- Зрозумілі Niagara System, Emitter, User Parameters і Blueprint Event Graph.
- Є test level із рухомим actor/component.
- Версію Unreal Engine 5.8 build записано.
- Core workflow не залежить від Beta/Experimental Niagara features.

# 5. Нові терміни

| Термін | Пояснення |
|---|---|
| **NiagaraComponent** | Scene component, який створює runtime instance Niagara System і має transform/lifecycle/parameters |
| **System Template** | Niagara System asset, з якого створюється instance |
| **World-space spawn** | Effect отримує world transform і не зобов’язаний слідувати за parent |
| **Attached spawn** | Effect component входить у transform hierarchy іншого `SceneComponent` |
| **Persistent component** | NiagaraComponent уже існує в actor і повторно активується |
| **Activation** | Перехід component/system до active simulation state |
| **Completion** | System завершив lifecycle всіх emitters/particles за своїми rules |
| **Auto Destroy** | Cleanup spawned component після completion |
| **Re-entry** | Нова gameplay request надходить, поки попередня instance ще active |
| **Pooling** | Reuse allocated NiagaraComponents замість нового allocation/GC cycle |
| **Stale state** | Transform/parameter/age/attachment, що лишився від попереднього use |
| **Ownership policy** | Хто зберігає reference, оновлює, завершує й чистить component |
| **Pre-cull check** | Spawn-time visibility/scalability check, якщо підтримується обраним path |

# 6. Навіщо ця тема потрібна VFX artist

Niagara effect у preview може бути правильним, але gameplay integration ламається, якщо:

- world impact випадково attached і їде разом із персонажем;
- weapon glow spawned at location і лишається у повітрі;
- infinite loop ніколи не завершується, тому `Auto Destroy` не спрацьовує;
- repeated attack stacks десятки instances;
- pooled component повертає колір попередньої команди;
- `Deactivate` викликається раніше, ніж secondary particles встигають завершитися;
- gameplay code губить `Return Value` і не може оновити target або stop effect.

Lifecycle — частина візуального дизайну. Anticipation, active, impact і residue мають не лише timing у Niagara, а й конкретний runtime owner та exit rule.

# 7. Теорія простими словами

`Niagara System` — рецепт. `NiagaraComponent` — конкретна порція effect у світі.

Один asset `NS_Impact` може мати 30 runtime components. Кожна instance має:

- власний transform;
- стан active/inactive;
- поточний simulation age;
- значення runtime parameters;
- attachment і owner;
- шлях completion та cleanup.

Три базові способи:

1. **At Location:** «зіграй тут і залиш у world».
2. **Attached:** «зіграй на цьому component/socket і слідуй за ним».
3. **Persistent component:** «цей actor володіє effect; activate/deactivate за gameplay state».

`Auto Destroy` не означає «видали через N секунд». Він залежить від completion. Infinite system без stop policy не complete.

`Deactivate` слід мислити як request завершити/припинити подальший spawn за lifecycle rules, а не як гарантований миттєвий delete. Точний результат залежить від system setup.

# 8. Детальні технічні пояснення

## 8.1 `Spawn System at Location`

Офіційне призначення: створити Niagara System у заданих **world** location і rotation.

Очікувані pins UE 5.8 Blueprint API:

| Pin | Type | Призначення |
|---|---|---|
| `In` | exec | виклик |
| `System Template` | Niagara System | вихідний asset |
| `Location` | Vector | позиція у world space |
| `Rotation` | Rotator | обертання у world space |
| `Scale` | Vector | масштаб instance |
| `Auto Destroy` | Boolean | cleanup після completion |
| `Auto Activate` | Boolean | негайно активувати instance |
| `Pooling Method` | Enum | policy для component pooling |
| `Pre Cull Check` | Boolean | необов’язкова перевірка pre-cull під час spawn |
| `Out` | exec | продовження execution flow |
| `Return Value` | NiagaraComponent | reference на створений component |

Exact node display, defaults, enum values та pin ordering: **Потребує ручної перевірки в Unreal Engine 5.8.**

Використання:

- impact у точці hit;
- residue від ground crack;
- explosion projectile;
- telegraph, що має лишитися у world після caster movement.

## 8.2 `Spawn System Attached`

Офіційне призначення: створити Niagara System, attached до component.

Очікувані pins:

| Pin | Type | Призначення |
|---|---|---|
| `System Template` | Niagara System | вихідний asset |
| `Attach to Component` | SceneComponent | батьківський component |
| `Attach Point Name` | Name | bone, socket або attach point |
| `Location` | Vector | offset, який інтерпретує `Location Type` |
| `Rotation` | Rotator | rotation offset або вхідне значення правила |
| `Location Type` | Enum | інтерпретація attachment як relative, world або snap-style |
| `Auto Destroy` | Boolean | cleanup після completion |
| `Auto Activate` | Boolean | негайна activation |
| `Pooling Method` | Enum | policy для pooling |
| `Pre Cull Check` | Boolean | кандидат на pre-cull під час spawn |
| `Return Value` | NiagaraComponent | створений component |

Exact enum labels та transform semantics: **Потребує ручної перевірки в Unreal Engine 5.8.**

Використання:

- aura на персонажі;
- muzzle effect на socket зброї;
- charge effect на руці;
- controller для trail, що слідує за weapon component.

## 8.3 Placed/persistent `NiagaraComponent`

Додай Niagara component до панелі Blueprint Components, признач `Niagara System Asset` і зазвичай вимкни auto activation для effect, яким керує gameplay.

Переваги:

- owner і reference відомі;
- параметри можна встановити до activation;
- re-entry policy легше контролювати;
- підходить для looping aura, charge, stateful weapon glow.

Ризики:

- component лишається в actor навіть inactive;
- stale values лишаються, якщо їх не reset;
- attached bounds і visibility потребують перевірки.

## 8.4 Activation order

Безпечна послідовність для controlled component:

```text
Визнач transform і attachment
→ Reset обов’язкового state
→ Встановлення кожного обов’язкового User.* parameter
→ Activate
→ Спостереження за active state і completion
→ Deactivate або completion
→ Очищення owner reference або повернення до pool
```

Якщо `Auto Activate=true`, system може почати з default parameters до того, як Blueprint їх змінить.

## 8.5 Completion

Для finite one-shot:

```text
activate → emitters виконують spawn → particles помирають → system переходить у complete → finish callback і cleanup
```

Для looping effect:

```text
activate → безкінечне повторення до явного exit
```

Looping effect потребує явного exit:

- завершення gameplay state;
- завершення notify state;
- знищення owner;
- timeout або failsafe;
- невалідний target.

Очікуваний Blueprint completion event/delegate (`On System Finished` або актуальний equivalent): **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.6 Deactivation modes

Тестуй окремо:

- graceful deactivation: spawn припиняється, а живі particles завершують lifecycle;
- immediate reset/stop path: visual завершується негайно;
- deactivate + reactivate: чи reset відбувається для age і spawn burst;
- natural completion: без ручного stop.

Не вважай ці paths equivalent. Вибір залежить від art/gameplay contract.

## 8.7 Re-entry policies

| Policy | Behavior | Найкраще застосування | Ризик |
|---|---|---|---|
| Ignore | active request відхиляє новий request | exclusive charge | втрачений feedback |
| Restart | reset поточного effect і запуск від початку | combo hit marker | помітний visual popping |
| Refresh | збереження instance з оновленням duration/data | aura або buff | stale age за помилки в логіці |
| Stack | нова instance паралельно з активною | impacts або projectiles | неконтрольоване зростання instances |

Policy записується для кожного archetype.

## 8.8 Pooling

Pooling має такі властивості:

- зберігає allocated components для повторного використання;
- може зменшити витрати allocation і garbage collection;
- не зменшує витрати simulation і rendering для active particles;
- має власні витрати на reactivation;
- працює лише тоді, коли попередня instance завершилася або повернулася до pool;
- потребує reset contract.

Добрий pool candidate — часті короткі one-shot impacts одного asset.

Слабкий candidate — рідкісний cinematic ultimate або stateful attached aura з унікальними external bindings.

Exact `Pooling Method` enum behavior, pool return та priming settings: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.9 Stale reset contract

Перед reuse встанови:

- world/relative transform;
- attachment/socket;
- `User.Color`;
- `User.Scale`;
- `User.Direction`;
- `User.TargetPosition`;
- reference на target actor, component або object;
- random seed або variant, якщо цього вимагає contract;
- шлях age/reset;
- flags для visibility і rendering;
- ownership для completion binding.

Не встановлюй лише «змінені» values: reused component може походити від іншого request.

# 9. Візуальні або математичні приклади

## Lifecycle state machine

```text
Inactive
  │ request
  ▼
Preparing ──invalid input──> Rejected
  │ set transform/params
  ▼
Active ──re-entry──> Ignore / Restart / Refresh / Stack
  │ natural completion or stop request
  ▼
Completing
  │ finished
  ▼
Destroyed / Returned to Pool / Inactive Persistent
```

## Leak estimate

Якщо looping effect spawned 5 разів/сек і жоден не завершується:

```text
active instances через t секунд = 5 × t
```

Через 60 секунд: 300 active instances. Це не performance budget, а логічний доказ leak.

## Stale value

```text
Request A: Color = червоний, Scale = 2
Повернення до pool
Request B встановлює лише Scale = 1
Result B: Color може лишитися червоним
```

Reset contract повинен set і Color, і Scale.

# 10. Controlled experiments

## Experiment A — world проти attached

Створи той самий `NS_TestBurst` двома способами:

- у world location actor;
- attached до рухомого `SceneComponent`.

Після spawn перемісти parent. World instance має лишитися на місці, а attached instance — слідувати.

## Experiment B — Auto Activate

1. Spawn із `Auto Activate=false`.
2. Збережи `Return Value`.
3. Встанови `User.Color`.
4. Виклич `Activate`.
5. Порівняй з auto-activated path, де parameter встановлено після spawn.

## Experiment C — one-shot проти loop

Запусти finite та infinite systems з `Auto Destroy=true`. Записуй component validity через 1, 3 і 10 секунд. Infinite system не можна вважати auto-cleaned без exit path.

## Experiment D — re-entry

Натисни input 10 разів за 1 секунду для Ignore, Restart, Refresh і Stack. Запиши видимий response та peak кількість active components.

## Experiment E — stale reuse simulation

Повторно використай persistent component:

1. червоний color і scale 2;
2. deactivate і reset;
3. синій color і scale .5;
4. повтори 20 разів.

Якщо будь-який run має попереднє значення, reset contract не спрацював.

# 11. Покрокова guided practice

## A. Підготуй test assets

1. Створи duplicate одного finite impact як `NS_L10_LifecycleBurst`.
2. Створи duplicate aura як `NS_L10_LifecycleLoop`.
3. Відкрий як User Parameters:
   - `User.Color` (`Linear Color`);
   - `User.Scale` (`Float`);
   - `User.Direction` (`Vector3` або відповідний position/vector type).
4. Для burst перевір natural completion.
5. Для loop запиши його exit rule.

## B. Створи `BP_VFX_LifecycleLab`

Склад Components:

```text
DefaultSceneRoot
MovingAnchor (SceneComponent)
PersistentLoop (NiagaraComponent)
```

`PersistentLoop`:

- asset = `NS_L10_LifecycleLoop`;
- auto activation вимкнено;
- relative transform обнулено.

Exact Components/Details labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

## C. World spawn function

Створи function `PlayWorldBurst`.

Вхідні значення:

```text
WorldTransform : Transform
Color          : LinearColor
Scale          : Float
```

Послідовність:

```text
Break Transform
→ Spawn System at Location
→ збереження Return Value як Local SpawnedComponent
→ Is Valid
→ встановлення User.Color
→ встановлення User.Scale
```

Щоб parameters гарантовано діяли на first frame, controlled variant використовує `Auto Activate=false`, встановлює values, а потім викликає `Activate`.

## D. Attached spawn function

Створи `PlayAttachedBurst`.

Вхідні значення:

```text
AttachComponent : SceneComponent
AttachPoint     : Name
RelativeOffset  : Transform
Color           : LinearColor
```

Послідовність:

```text
Spawn System Attached
Attach to Component = вхідне значення
Attach Point Name = вхідне значення
Location/Rotation = relative offset
Auto Activate = false
→ встановлення обов’язкових parameters
→ Activate
```

Перевір variants `Location Type` за допомогою кольорових axes або reference. Точні enum values: **Потребує ручної перевірки в Unreal Engine 5.8.**

## E. Persistent loop

Створи functions:

### `StartPersistentLoop`

```text
якщо component уже active:
    застосувати обрану re-entry policy = Refresh
інакше:
    reset transform + усіх User.* values
    Activate
```

### `StopPersistentLoop`

```text
якщо component valid і active:
    Deactivate
інакше:
    no-op із необов’язковим debug log
```

Додай failsafe stop, коли owner завершує play або знищується.

## F. Lifecycle logging

Записуй такі поля log:

```text
Timestamp
RequestID
SpawnPath
ComponentName
WasValid
WasActive
Policy
ExpectedExit
ObservedFinish
```

Прив’яжи очікуваний system-finished event до створених finite components, якщо він доступний. Точний event binding: **Потребує ручної перевірки в Unreal Engine 5.8.**

## G. Input map

```text
1 = world burst
2 = attached burst
3 = запуск persistent loop
4 = graceful stop
5 = policy Restart
6 = stress для Stack
```

Безперервно рухай `MovingAnchor`, щоб виявити attachment errors.

## H. Re-entry and cleanup matrix

Виконай:

- 20 world bursts з інтервалом 0.1 s;
- 20 attached bursts;
- 20 cycles start/stop для persistent component;
- знищення owner під час loop;
- case з невалідним attach component;
- case, який pre-culled або off-camera.

Запиши peak кількість active instances і фінальну кількість instances, що лишилися після визначеного cooldown. Ці числа є спостереженнями, а не універсальними budgets.

# 12. Точні назви nodes, modules і settings

- `NiagaraComponent`
- `Spawn System at Location`
- `Spawn System Attached`
- `System Template`
- `Location`
- `Rotation`
- `Scale`
- `Attach to Component`
- `Attach Point Name`
- `Location Type`
- `Auto Destroy`
- `Auto Activate`
- `Pooling Method`
- `Pre Cull Check`
- `Return Value`
- `Activate`
- `Deactivate`
- `Is Valid`
- `Set Niagara Variable (LinearColor)`
- `Set Niagara Variable (Float)`
- `Set Niagara Variable (Vector3)` або актуальний typed equivalent
- `On System Finished` як очікуваний completion event

Blueprint display names/defaults: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 13. Стартові значення параметрів

| Setting | Стартове значення |
|---|---|
| Burst duration | 0.6–1.0 s як content target |
| Persistent loop Auto Activate | вимкнено |
| Spawn functions Auto Activate | вимкнено для parameter-before-activate test |
| Finite burst Auto Destroy | увімкнено для non-pooled case |
| Re-entry policy loop | Refresh |
| Re-entry policy impact | Stack із test cap |
| Stress interval | 0.1 s |
| Stress requests | 20 |
| Color A/B | червоний / синій |
| Scale A/B | 2 / 0.5 |

Це test values, а не production budgets.

# 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат |
|---|---|
| World spawn | лишається на заданому world transform |
| Attached spawn | слідує за parent або socket |
| Auto Activate off | effect невидимий до виклику `Activate` |
| Parameter-before-activate | перший видимий frame використовує передані data |
| Finite completion | component завершується, а cleanup path виконується |
| Loop stop | infinite leak відсутній |
| Re-entry | відповідає задокументованій policy |
| Persistent reuse | stale color або scale відсутні |
| Invalid parent | безпечне відхилення без crash |
| Cooldown audit | немає ненавмисних active components |

# 15. Самостійна вправа

## EX-L10-01-A — Lifecycle contract for three archetypes

**Завдання:** реалізуй world impact, attached charge та persistent aura в одному Blueprint lab.

**Обмеження:**

- використай обидва spawn nodes і один placed NiagaraComponent;
- явна owner, exit і re-entry policy для кожного;
- parameters встановлено до activation;
- test із 20 requests;
- відсутня залежність core workflow від Experimental features;
- version-sensitive pins задокументовано.

**Deliverables:**

- Blueprint;
- схема lifecycle state;
- таблиця pins;
- re-entry matrix;
- screenshots до і після cooldown;
- log для completion і cleanup.

**Acceptance criteria:**

- world impact не рухається разом з owner;
- attached charge слідує за ним;
- aura зупиняється наприкінці state;
- stale values відсутні;
- немає випадкових infinite instances;
- кожне використання `Return Value` проходить validity check;
- спостережуваний behavior відповідає записаній policy.

# 16. Додаткова складніша вправа

## EX-L10-01-B — Pool/re-entry fault injection

**Завдання:** побудуй reusable impact path, інжектуй stale color, lost reference і infinite-loop leak, потім виправ кожний root cause.

**Обмеження:**

- на кожному diagnostic step змінюй лише одну variable;
- порівняй non-pooled path і pooling candidate;
- не заявляй performance benefit без capture;
- виконай 50 requests із чергуванням значень;
- включи cases зі знищенням owner і невалідним target.

**Deliverables:**

- відео або screenshots із failures;
- symptom→hypothesis→test→finding→fix log;
- reset checklist;
- timeline кількості components;
- висновок: pool, persistent reuse або звичайний spawn.

**Acceptance criteria:**

- усі три failures відтворено;
- root causes розрізнено;
- фінальний run із 50 cycles не має stale values;
- active count повертається до очікуваного baseline;
- висновок щодо pooling спирається на evidence.

# 17. Три рівні підказок

## EX-L10-01-A

- **Hint 1:** спочатку класифікуй spatial ownership: world, attached або persistent із actor-owner.
- **Hint 2:** запиши `prepare → set all parameters → activate → finish/stop → cleanup`.
- **Hint 3:** impact = `Spawn System at Location`; charge = `Spawn System Attached`; aura = component із вимкненим Auto Activate та явними Start/Stop.

[Повне рішення EX-L10-01-A](../EXERCISE_ANSWERS/L10-01_niagara_components_spawning_and_lifecycle_answers.md#ex-l10-01-a)

## EX-L10-01-B

- **Hint 1:** stale visual value і leak active count — різні failures.
- **Hint 2:** порівняй упаковані external request data зі значеннями component безпосередньо перед `Activate`.
- **Hint 3:** завжди встановлюй повний reset contract; зберігай і перевіряй reference; додай для infinite loop owner-driven stop та cooldown audit.

[Повне рішення EX-L10-01-B](../EXERCISE_ANSWERS/L10-01_niagara_components_spawning_and_lifecycle_answers.md#ex-l10-01-b)

# 18. Типові помилки

| Помилка | Наслідок |
|---|---|
| Attached використано для impact | impact рухається разом із персонажем |
| At Location використано для aura | aura лишається позаду |
| `Auto Activate=true`, а parameters передано пізніше | неправильний перший frame |
| Лише Loop + Auto Destroy | component ніколи не завершується |
| `Return Value` втрачено | effect неможливо зупинити, оновити або діагностувати |
| Stack на кожен повторний input | різкий spike кількості instances |
| Restart для residue | помітний popping |
| Частковий parameter reset | stale data після reuse |
| Pooling помилково вважається безкоштовним | немає виміряної користі, з’являються нові bugs |
| Immediate stop для graceful trail | різкий hard cut |

# 19. Troubleshooting

## Effect невидимий

Перевір asset, validity component, activation, transform, scale, pre-cull, bounds і material. Змінюй лише одну умову за раз.

## Effect слідує за parent, хоча не повинен

Перевір spawn path і attachment hierarchy. World impact має використовувати world path або detach із навмисно заданими transform rules.

## AutoDestroy ніколи не спрацьовує

Перевір, що кожен emitter і system можуть завершитися. Infinite loop потребує stop або deactivation. Підтвердь, що finish event справді спрацьовує.

## Другий запуск має неправильний color

Запиши request values безпосередньо перед `Activate`. Встановлюй повний parameter contract, а не лише змінені fields. Підтвердь точні name і type кожного User Parameter.

## Effect обривається раптово

Розділи graceful deactivate та reset/immediate stop. Перевір particle lifetime і behavior під час completion.

## Кількість instances зростає після cooldown

Відфільтруй Niagara Debugger за asset, зроби capture active systems, перевір paths для owner destroy і stop, а також re-entry stack.

Exact debugger/lifecycle UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 20. Performance considerations

- Рахуй active **systems**, а не лише particles.
- Багато малих system instances усе одно мають per-instance і per-emitter overhead.
- Pooling розв’язує проблему allocation і GC, але не витрати active simulation або rendering.
- Auto activation може запускати зайву роботу до встановлення parameters.
- Infinite loops потребують culling і коректного owner lifecycle.
- Pre-cull може уникнути частини spawn work, але не має прибирати критично важливий feedback для local player.
- Debug logs, HUD overlays і verbose events створюють overhead; вимикай їх під час чистих measurements.
- Універсального числа «max instances» тут немає. Вимірюй target hardware, build configuration і representative scenario.

# 21. Запитання для самоперевірки

1. Чим Niagara System asset відрізняється від NiagaraComponent?
2. Коли використовувати `Spawn System at Location`?
3. Які unique inputs має attached spawn?
4. Чому `Auto Destroy` не рятує infinite loop?
5. Навіщо set parameters до Activate?
6. Назви чотири re-entry policies.
7. Що pooling оптимізує, а що ні?
8. Які values треба reset перед reuse?

# 22. Відповіді

1. Asset є template; component є runtime scene instance із власними state, transform і parameters.
2. Для effect, що має лишитися на world transform і не слідувати за owner.
3. Це attach component, attach point або socket, offset transform і location/attach rule.
4. AutoDestroy чекає completion, а infinite loop самостійно не переходить у complete.
5. Щоб перший видимий simulation frame отримав правильні inputs.
6. Це Ignore, Restart, Refresh і Stack.
7. Він повторно використовує allocation і зменшує GC pressure, але не прибирає витрати active simulation, rendering або overdraw.
8. Потрібно reset transform, attachment, усі обов’язкові User Parameters, age/reset path, visibility та completion ownership.

# 23. Self-check checklist

- [ ] Pins вузла At Location задокументовано.
- [ ] Pins вузла Attached задокументовано.
- [ ] Обов’язкова фраза про UE 5.8 присутня.
- [ ] Cases world, attached і persistent побудовано.
- [ ] Behavior `Auto Activate` перевірено.
- [ ] Behavior finite і loop перевірено.
- [ ] Re-entry policy записано.
- [ ] `Return Value` збережено й перевірено на validity.
- [ ] Completion зафіксовано.
- [ ] Path зі знищенням owner перевірено.
- [ ] Checklist для stale reset завершено.
- [ ] Run із 20 cycles завершено.
- [ ] Debug overhead прибрано з чистого test.
- [ ] Універсальний budget не вигадано.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. ти правильно обираєш один із трьох ownership paths;
2. можеш пояснити призначення кожного spawn pin;
3. loop має явний exit;
4. re-entry дає deterministic результат;
5. у test із 20 cycles немає stale data;
6. після cooldown немає ненавмисних active instances;
7. EX-L10-01-A проходить щонайменше 6 із 7 acceptance checks.

# 25. Підсумок

Runtime VFX — це template плюс component state. Надійний artist задає spatial ownership, parameter order, re-entry та exit до того, як effect потрапляє у gameplay. `Auto Destroy` і pooling допомагають лише всередині правильного lifecycle contract.

# 26. Зв’язок із наступними уроками

У 10.02 той самий lifecycle буде прив’язаний до weapon/character sockets та Animation Notifies. Notify визначить **коли**, socket — **де**, а цей урок уже визначив **хто володіє component і як він завершується**.

# 27. Офіційні джерела

- Epic Games. [Spawn System at Location](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystematLocation).
- Epic Games. [Spawn System Attached](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystemAttached).
- Epic Games. [UNiagaraComponent API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraComponent).
- Epic Games. [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara).
- Epic Games. [Niagara System Settings Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine).

# 28. Рекомендовані скриншоти або схеми

```text
1. At Location node з підписаними pins і world-space axis.
2. Attached node з parent, socket та transform-rule callouts.
3. Lifecycle state machine: Inactive→Preparing→Active→Completing→Cleanup.
4. Timeline для one-shot та infinite loop.
5. Чотири re-entry policies поруч для порівняння.
6. Stale reset contract перед `Activate`.
7. Timeline active components для 20 requests.
8. Niagara Debugger до і після cooldown.
```
