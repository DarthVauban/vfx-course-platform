# 1. Назва

## Урок 10.03 — Blueprint parameters, target data, spaces та reusable VFX API

# 2. Результат уроку

Після уроку ти зможеш:

- перетворити hard-coded spawn graphs на reusable gameplay interface;
- передати position, direction, color, scale і target data;
- розрізняти Niagara `Position` та direction-like `Vector3`;
- нормалізувати direction і обробити zero-length vector;
- конвертувати world/local/actor/component spaces;
- обрати fixed target position, live Actor target або SceneComponent target;
- визначити update ownership і frequency для moving target;
- створити `F_VFXSpawnRequest`-подібний Blueprint struct;
- валідовувати asset, component, socket, target і parameter type;
- задавати всі runtime inputs до activation;
- повторно використовувати одну effect family через gameplay request;
- підтримати High/Medium/Low semantic profile без трьох divergent Blueprints;
- запобігати stale target/color/scale при pooling або persistent reuse.

Ключовий deliverable — `BPC_VFXGameplayBridge` із двома spawn modes, typed request contract та moving-target demo.

# 3. Орієнтовний час

**8 годин: 2 години теорії та 6 годин практики.**

| Частина | T | P | Час |
|---|---:|---:|---:|
| Parameter/type/space theory | 1 год | — | 1 год |
| Target/reuse/update ownership theory | 1 год | — | 1 год |
| Controlled type/space experiments | — | 1 год | 1 год |
| Guided reusable bridge | — | 2 год 30 хв | 2 год 30 хв |
| Exercises A/B | — | 1 год 45 хв | 1 год 45 хв |
| Stress, H/M/L reuse та evidence | — | 45 хв | 45 хв |
| **Разом** | **2 год** | **6 год** | **8 год** |

# 4. Prerequisites

- Завершено 10.02.
- User Parameters і Blueprint-to-Niagara communication з 08.03 зрозумілі.
- Є world impact, attached trail/charge та projectile/beam/target effect.
- Lifecycle, socket і ActionID contracts існують.
- Є moving target actor та moving source component.
- Core solution не залежить від Beta/Experimental feature.

# 5. Нові терміни

| Термін | Пояснення |
|---|---|
| **Request contract** | Повний typed набір inputs для одного VFX request |
| **Position** | точка у space, на яку впливає translation |
| **Direction** | orientation vector, який translation не повинна змінювати |
| **Normalized direction** | vector із length 1 |
| **Source position** | world або local point, звідки effect починається |
| **Target position** | точка, до якої effect спрямовано |
| **Fixed target** | snapshot position у момент request |
| **Live target** | Actor, component або object, transform якого може оновлюватися |
| **Target loss** | target стає invalid, destroyed або unavailable |
| **Space** | coordinate frame world, actor local, component local або system local |
| **Transform Position** | конвертує point з урахуванням translation |
| **Transform Direction** | конвертує direction або normal-like vector без translation |
| **Parameter schema** | names, types, units, spaces і defaults |
| **Quality profile input** | semantic вибір H/M/L, переданий через reusable API |

# 6. Навіщо ця тема потрібна VFX artist

Hard-coded Blueprint працює для одного screenshot, але production потребує:

- запуску projectile з будь-якого muzzle;
- наведення beam на fixed point або moving actor;
- використання тим самим slash різних team color і scale;
- безпечної обробки зникнення target;
- вибору H/M/L policy тим самим gameplay call;
- гарантії, що pooled component не успадковує попередній target.

Reusable interface запобігає появі 20 copy-pasted graphs із різними bugs. Artist може визначити required data, а programmer або gameplay Blueprint — послідовно їх передавати.

# 7. Теорія простими словами

Point і arrow — не те саме.

```text
SourcePosition = де починаємо
TargetPosition = куди йдемо
Direction = TargetPosition - SourcePosition
NormalizedDirection = Direction / length(Direction)
```

Translation переміщує points, але не обертає arrow. Тому:

- point використовує position transform;
- direction використовує direction або vector transform;
- scale є parameter для magnitude або presentation, а не length direction.

Target також має lifetime:

- snapshot point не стає invalid;
- Actor може рухатися або бути знищеним;
- component може виконати detach або змінити socket;
- target mode None потребує fallback.

# 8. Детальні технічні пояснення

## 8.1 Parameter schema

Приклад schema:

| Niagara parameter | Type | Space | Значення | Default |
|---|---|---|---|---|
| `User.SourcePosition` | Position | World | snapshot source | location із request transform |
| `User.Direction` | Vector3 | World normalized | direction source→target | forward owner |
| `User.Color` | LinearColor | linear | intent для tint або HDR effect | білий |
| `User.Scale` | Float | scalar | semantic multiplier розміру | 1 |
| `User.TargetPosition` | Position | World | snapshot або current target | source + direction×distance |
| `User.TargetActor` | Actor/object-compatible | object | необов’язковий live target | none |
| `User.QualityScalar` | Float | unitless | content scale profile | H=1, значення визначає проєкт |
| `User.ActionID` | Int | identity | ownership request | generated |

Exact supported typed setter names and parameter types: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.2 Position vs Vector3

У Niagara workflows, що враховують large world, `Position` семантично відрізняється від `Vector3`. Не використовуй direction parameter для зберігання довільної world position лише через те, що обидва типи показують три числа.

Правила:

- world point → Position;
- offset, direction або velocity → Vector3;
- color → LinearColor;
- uniform scale → Float;
- target object → відповідний User object або data interface.

## 8.3 Direction construction

```text
Delta = Target - Source
Length = |Delta|
if Length > epsilon:
    Direction = Delta / Length
else:
    Direction = fallback forward
```

Ніколи не діли на zero. Зберігай distance окремо, якщо effect потребує length beam.

## 8.4 Spaces

| Input | Правильна conversion |
|---|---|
| Local source point → world | Transform Position |
| Local direction → world | Transform Direction |
| World target point → component local | Inverse Transform Position |
| World direction → component local | Inverse Transform Direction |

Якщо Niagara System використовує local space, явно конвертуй inputs або відкрий очікувані local inputs. Не виправляй space mismatch довільним rotation.

## 8.5 Target types

### Fixed world position

Використовуй для:

- hit location;
- ground telegraph;
- endpoint, який не повинен слідувати за moving actor.

### Actor target

Використовуй, коли:

- identity actor має значення;
- gameplay потребує validity, team або state target;
- effect може знайти root або selected component.

### SceneComponent target

Використовуй, коли:

- важлива точна moving point;
- потрібен transform target socket або component;
- actor root недостатньо точний.

### No target

Використай forward source і default distance або відхили request згідно з contract.

## 8.6 Snapshot vs continuous update

Для Snapshot:

- target встановлюється один раз перед `Activate`;
- implementation проста й дешева;
- підходить для ballistic або non-homing visual.

Для Continuous:

- owner оновлює target position або reference;
- потрібен для beam, homing або lock-on;
- update frequency і lifecycle потребують вимірювання.

Не встановлюй бездумно кожен parameter на кожному Blueprint Tick для кожного effect. Оновлюй лише data, що змінюються, із rate та ownership, обґрунтованими візуальною потребою і profiling.

## 8.7 Target loss policy

| Policy | Результат |
|---|---|
| Freeze | зберегти останню valid position |
| Redirect | обрати новий valid target |
| Fade/complete | виконати graceful stop |
| Snap to fallback | перемістити до forward point owner |
| Kill immediately | лише якщо цього потребують gameplay або readability |

Запиши policy для кожного effect.

## 8.8 Reusable Blueprint request

`ST_VFXSpawnRequest` fields:

```text
System
SpatialMode (AtLocation / Attached / Persistent)
WorldTransform
AttachComponent
AttachPoint
RelativeTransform
Color
Scale
SourcePosition
Direction
TargetMode (None / FixedPosition / Actor / Component)
TargetPosition
TargetActor
TargetComponent
QualityProfile (High / Medium / Low)
ActionID
ReentryPolicy
AutoDestroyIntent
PoolingIntent
```

Це schema рівня курсу; точні names struct і enum визначає проєкт.

## 8.9 H/M/L reuse

Reuse означає:

- один gameplay call;
- один semantic parameter contract;
- вибір profile змінює content і scalability, але не spawn logic;
- H/M/L зберігають timing і readability.

Не створюй три незалежні Blueprints. `QualityProfile` може обирати:

- інший System asset лише за необхідності;
- `User.QualityScalar`;
- emitter/render visibility parameters;
- Niagara Effect Type і scalability, які буде налаштовано у 10.05.

Числові values profile походять із measurement, а не з довільних універсальних percentages.

## 8.10 Pool/reuse reset

Перед `Activate`:

1. очисти старий target actor або component;
2. встанови target mode;
3. встанови position, direction і distance;
4. встанови color, scale і profile;
5. встанови ActionID;
6. встанови transform і attachment;
7. прив’яжи completion owner;
8. виклич `Activate`.

Якщо target mode змінюється на None, явно очисти попередній target object.

# 9. Візуальні або математичні приклади

## Direction

```text
Source = (10, 20, 0)
Target = (13, 24, 0)
Delta  = (3, 4, 0)
Length = 5
Direction = (0.6, 0.8, 0)
```

## Point vs direction under translation

Transform додає translation `(100,0,0)`:

```text
Point (3,4,0) → (103,4,0)
Direction (0.6,0.8,0) → translation не повинна перетворити його на (100.6,0.8,0)
```

## Target state

```text
Визначити target
├─ valid Actor або Component → обчислити current position і direction
├─ fixed position → використати snapshot
└─ invalid або None → Freeze / Fade / Fallback / Reject
```

# 10. Controlled experiments

## Experiment A — raw Delta vs normalized

Передай одному effect direction до targets на відстані 100 і 1000 units:

- raw Delta;
- normalized direction та окремий distance.

Спостерігай errors orientation, force або velocity, коли magnitude потрапляє у direction.

## Experiment B — Transform Position vs Direction

Обертай і переміщуй source actor. Конвертуй той самий local arrow обома nodes. Неправильна position conversion для direction додає translation.

## Experiment C — fixed vs live target

Target рухається після activation:

- snapshot endpoint лишається на місці;
- live target слідує;
- freeze-on-loss зберігає останню valid point.

## Experiment D — stale target

Повторно використай один component:

1. Actor target A;
2. request B із target mode None.

Якщо B усе ще слідує за A, clear/reset contract не спрацював.

## Experiment E — H/M/L same request

Передай однакові transform, color, target і timing з profile H/M/L. Readability і timing мають зберігатися, а content density — змінюватися лише за визначеною policy.

# 11. Покрокова guided practice

## A. Створи спільні enums і struct

Enums у Blueprint:

```text
E_VFXSpatialMode: AtLocation, Attached, Persistent
E_VFXTargetMode: None, FixedPosition, Actor, Component
E_VFXQualityProfile: High, Medium, Low
E_VFXReentryPolicy: Ignore, Restart, Refresh, Stack
```

Створи `ST_VFXSpawnRequest` із fields із section 8.8.

## B. Створи `BPC_VFXGameplayBridge`

Додай actor component до test actors персонажа та projectile.

Створи functions:

```text
ValidateRequest
ResolveSource
ResolveTarget
ComputeDirectionAndDistance
ApplyNiagaraParameters
SpawnAtLocation
SpawnAttached
StartOrUpdatePersistent
StopByActionID
HandleTargetLost
```

## C. Виконай validation request

Відхиляй request і записуй причину за таких умов:

- System відсутній;
- attached mode має invalid component;
- socket відсутній, коли його вимагає contract;
- scale ≤0, якщо це invalid для effect;
- Actor mode має invalid Actor;
- Component mode має invalid SceneComponent;
- direction нульовий і fallback відсутній;
- quality profile невідомий.

Не вигадуй мовчки data, які змінюють gameplay meaning.

## D. Resolve source

Порядок пріоритету:

```text
Transform attached socket або component
інакше WorldTransform із request
інакше transform owner, якщо це дозволяє contract
```

Зберігай `SourcePosition` як Position.

## E. Resolve target

```text
None:
  Target = Source + OwnerForward × DefaultDistance
Fixed:
  Target = Request.TargetPosition
Actor:
  Target = transform valid Actor або selected component
Component:
  Target = transform valid component або socket
```

Обчисли normalized direction і distance із epsilon guard.

## F. Spawn and parameter order

```text
Validate
→ визначити source і target
→ виконати Spawn із Auto Activate false
→ перевірити Return Value
→ очистити всі попередні target references
→ встановити SourcePosition
→ встановити Direction
→ встановити Color
→ встановити Scale
→ встановити TargetPosition
→ встановити target Actor або Component, якщо це підтримується
→ встановити QualityScalar або Profile
→ встановити ActionID
→ Activate
```

Typed setters expected include `Set Niagara Variable (Position)`, `(Vector3)`, `(LinearColor)`, `(Float)`, `(Actor/Object)`. **Потребує ручної перевірки в Unreal Engine 5.8.**

## G. Live target update

Підтримуй map:

```text
ActionID → NiagaraComponent + TargetMode + Target reference + LossPolicy
```

Оновлюй лише requests із live target. Коли target стає invalid, один раз застосуй policy, очисти reference і зупини непотрібні updates.

## H. H/M/L

Function `ResolveQualityProfile` повертає project-specific semantic settings:

```text
High: повний набір signature layers
Medium: зберегти timing і silhouette, зменшити secondary density
Low: зберегти telegraph, core і contact, прибрати дорогі неосновні layers
```

Не призначай фінальні counts до уроків profiling.

## I. Stress test

Виконай 30 requests із чергуванням:

- fixed point;
- Actor;
- Component;
- None;
- червоний або синій color;
- scales .5/1/2;
- H/M/L;
- знищення target посеред effect.

Запиши stale state і active components після cooldown.

# 12. Точні назви nodes, modules і settings

- `Set Niagara Variable (Position)`
- `Set Niagara Variable (Vector3)`
- `Set Niagara Variable (LinearColor)`
- `Set Niagara Variable (Float)`
- `Set Niagara Variable (Actor)`
- `Set Niagara Variable (Object)`
- `Is Valid`
- `Get Actor Location`
- `Get World Location`
- `Get Socket Transform`
- `Transform Location` / `Transform Position`
- `Transform Direction`
- `Inverse Transform Location`
- `Inverse Transform Direction`
- `Get Safe Normal`
- `Vector Length`
- `Select`
- `Switch on E_VFXTargetMode`
- `Map`, де key = ActionID

Exact typed node display names: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 13. Стартові значення параметрів

| Parameter | Стартове значення |
|---|---|
| Direction epsilon | малий project-safe tolerance |
| Default distance | 500 units лише для lab |
| Color | білий |
| Scale | 1 |
| Target mode | None |
| Loss policy projectile | обери Freeze або Fade |
| Loss policy beam | Fade/complete |
| Quality profile | High для baseline capture |
| Live update | rate відповідно до visual need; почни з every frame лише для proof |
| Stress requests | 30 |

Жодне з цих values не є універсальним budget.

# 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат |
|---|---|
| Validate | invalid request відхилено із зазначенням причини |
| Source | правильний socket або world point |
| Direction | normalized, без NaN |
| Fixed target | не слідує за об’єктом |
| Live target | слідує за потрібним actor або component |
| Target loss | застосовано явну policy |
| Color/scale | правильні на першому frame |
| H/M/L | той самий contract timing і readability |
| Reuse | немає stale target або data |
| Cooldown | active count повертається до baseline |

# 15. Самостійна вправа

## EX-L10-03-A — Reusable projectile/beam request API

**Завдання:** одним `BPC_VFXGameplayBridge` запусти projectile launch, beam і impact з position/direction/color/scale/target inputs.

**Обмеження:**

- один request struct;
- fixed і live target;
- target modes Actor і Component;
- відмінність Position від Vector3 задокументовано;
- normalized direction та окремий distance;
- parameter-before-activate;
- H/M/L enum проходить через той самий API.

**Deliverables:**

- struct і enums;
- Blueprint bridge;
- parameter schema;
- схема space conversion;
- три gameplay calls;
- stale-state log для 30 requests.

**Acceptance criteria:**

- немає copied spawn graph для кожного effect;
- types і spaces правильні;
- zero-length case оброблено безпечно;
- target loss оброблено безпечно;
- parameters правильні на першому frame;
- H/M/L зберігають semantic timing;
- немає stale target, color або scale.

# 16. Додаткова складніша вправа

## EX-L10-03-B — Moving target, target loss та pooled reuse

**Завдання:** створи live beam, що слідує за target SceneComponent, потім обробляє його destroy або replacement, тоді як reuse component чергує profiles і colors.

**Обмеження:**

- update ownership задано явно;
- виміряй candidates для update frequency;
- порівняй policies Freeze і Fade;
- не виконуй world Tick update для inactive або fixed requests;
- повний reset перед reuse;
- test із 50 cycles.

**Deliverables:**

- map ActionID;
- target-state machine;
- capture порівняння frequency;
- proof відсутності stale state;
- фінальне рішення щодо policy.

**Acceptance criteria:**

- moving target працює правильно;
- target loss ніколи не звертається до invalid object;
- старий target очищено;
- fixed request не оновлюється;
- у 50 cycles немає stale data;
- рішення щодо update спирається на evidence.

# 17. Три рівні підказок

## EX-L10-03-A

- **Hint 1:** визнач schema до побудови spawn nodes.
- **Hint 2:** point, direction, color, scalar і object потребують різних types.
- **Hint 3:** Validate→ResolveSource/Target→Normalize→Spawn inactive→встановити повну schema→Activate.

[Повне рішення EX-L10-03-A](../EXERCISE_ANSWERS/L10-03_blueprint_parameters_targets_and_reuse_answers.md#ex-l10-03-a)

## EX-L10-03-B

- **Hint 1:** live target потребує ownership і loss policy; fixed point цього не потребує.
- **Hint 2:** map ActionID має містити лише active requests із live target.
- **Hint 3:** під час loss закешуй останню point, очисти object, обери Freeze або Fade; перед reuse очисти всі target fields, а потім застосуй current request.

[Повне рішення EX-L10-03-B](../EXERCISE_ANSWERS/L10-03_blueprint_parameters_targets_and_reuse_answers.md#ex-l10-03-b)

# 18. Типові помилки

| Помилка | Наслідок |
|---|---|
| World position збережено у Vector3 direction | semantic bug для LWC або space |
| Raw Delta використано як direction | distance змінює orientation або force |
| Transform Position використано для direction | translation забруднює vector |
| Використано лише root Target Actor | неправильний endpoint |
| Tick для всіх requests | зайва робота CPU та update |
| Invalid target проігноровано | access error або snap до origin |
| None target лишає старий object | stale tracking |
| Окремі Blueprints для H/M/L | divergent lifecycle bugs |
| Numbers profile вигадано | немає platform evidence |

# 19. Troubleshooting

## Beam спрямовано неправильно

Запиши source, target, delta, length, normalized direction і coordinate space. Намалюй debug line або arrow.

## Target стрибає до origin

Перевір validity до читання; ніколи не використовуй zero vector як мовчазний marker missing target. Застосуй явну loss policy.

## Color запізнюється на один frame

Створи component inactive, встанови parameter із точними name і type, а потім виклич `Activate`. Перевір binding material або renderer.

## Component слідує за попереднім target

Очисти reference Actor або Component і target mode до застосування нового request.

## Неправильний local offset effect

Порівняй system setting local-space та conversion transform у Blueprint. Не додавай випадкові rotation або translation.

# 20. Performance considerations

- Per-frame updates target у Blueprint для багатьох systems можуть стати роботою Game Thread.
- Parameters live object або data interface можуть додавати per-component memory і work; вимірюй.
- Reuse H/M/L API зменшує maintenance, але не runtime cost автоматично.
- Pooling потребує повного reset і безпечного completion.
- Fixed targets не мають лишатися в map live updates.
- Debug draws і logs створюють overhead.
- Жодні update frequency або count не є універсальними; перевіряй target hardware, build і scenario.

# 21. Запитання для самоперевірки

1. Чим Position відрізняється від direction Vector3?
2. Як отримати normalized source→target direction?
3. Що робити при zero length?
4. Чим fixed target відрізняється від live?
5. Коли target component кращий за actor?
6. Які four target-loss policies?
7. Навіщо request struct?
8. Чому fixed requests не треба Tick-update?
9. Як H/M/L reuse уникaє divergence?
10. Що reset при None target після Actor target?

# 22. Відповіді

1. Position є point, на яку впливає translation; direction є arrow або vector, який translation не переміщує.
2. `(Target-Source)/Length`, guarded by epsilon/safe normal.
3. Використай задокументований fallback або відхили request.
4. Fixed є snapshot; live знаходить і оновлює moving reference.
5. Коли потрібен exact socket/component transform, не actor root.
6. Freeze, Redirect, Fade/Complete, Fallback або Kill — залежно від contract.
7. Один typed contract замість copied graphs.
8. Target data не змінюються, тому updates є зайвою роботою.
9. Один gameplay call і schema обирають profile; timing та lifecycle лишаються спільними.
10. Очисти reference Actor або Component, встанови mode None і запиши нові defaults target та direction.

# 23. Self-check checklist

- [ ] Struct і enums створено.
- [ ] Таблицю types і spaces завершено.
- [ ] Position і direction розділено.
- [ ] Safe normalize використано.
- [ ] Fixed, Actor, Component і None перевірено.
- [ ] Target loss перевірено.
- [ ] Parameter-before-activate виконано.
- [ ] Mapping ActionID працює.
- [ ] Fixed request не оновлюється.
- [ ] Full reset contract реалізовано.
- [ ] H/M/L використовують той самий API.
- [ ] Log для 30 requests чистий.
- [ ] Debug overhead прибрано з clean run.
- [ ] Універсальний budget не вигадано.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. parameter schema має правильні types і spaces;
2. один bridge обробляє три effects;
3. target modes і loss дають deterministic результат;
4. zero direction оброблено безпечно;
5. reuse H/M/L не розділяє gameplay logic;
6. stale state відсутній;
7. EX-L10-03-A проходить щонайменше 6 із 7 критеріїв.

# 25. Підсумок

Reusable VFX integration починається не з universal spawn function, а з ясного typed request. Position, direction, color, scale, target, space, quality і lifecycle ownership мають пройти validation до activation.

# 26. Зв’язок із наступними уроками

У 10.04 цей reusable bridge створить repeatable profiling scenario. Ти виміряєш cost одного великого effect і many-instance burst, а не порівнюватимеш випадкові preview states.

# 27. Офіційні джерела

- Epic Games. [Niagara System Settings Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine).
- Epic Games. [Set Niagara Variable Vector3](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SetNiagaraVariable_Vector3).
- Epic Games. [Set Niagara Variable LinearColor](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SetNiagaraVariable_LinearColor).
- Epic Games. [UNiagaraComponent API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraComponent).
- Epic Games. [Spawn System at Location](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystematLocation).
- Epic Games. [Spawn System Attached](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystemAttached).

# 28. Рекомендовані скриншоти або схеми

```text
1. Parameter schema: name, type, space і default.
2. Схема transform для point порівняно з direction.
3. Target tree None, Fixed, Actor і Component.
4. Розгорнутий request struct у Blueprint.
5. Flow Validate→Resolve→Spawn inactive→Set→Activate.
6. Moving target і target-loss state machine.
7. H/M/L через один API.
8. Stale-state matrix для 30 requests.
```
