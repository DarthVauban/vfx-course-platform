# Рішення до уроку 10.01

## EX-L10-01-A

### 1. Архітектура

```text
BP_L10_LifecycleDemo
├─ DefaultSceneRoot
├─ MovingAnchor
└─ NC_PersistentAura

Functions:
PlayWorldImpact
PlayAttachedCharge
StartAura
StopAura
ApplyFullParameterContract
LogLifecycle
```

У `NC_PersistentAura` вимкнено `Auto Activate`. World/attached functions також spawn із вимкненим `Auto Activate`, зберігають `Return Value`, застосовують parameters і лише тоді активують effect.

### 2. Три contracts

| Archetype | Spatial path | Re-entry | Exit | Cleanup |
|---|---|---|---|---|
| Impact | At Location | Stack, обмежений gameplay request policy | natural completion | AutoDestroy/non-pooled candidate |
| Charge | Attached | Restart | natural completion або cancel | finish callback |
| Aura | Persistent component | Refresh | кінець gameplay state/owner | inactive actor-owned component |

### 3. `PlayWorldImpact`

```text
Inputs: Transform, Color, Scale
Spawn System at Location
  System Template = NS_L10_LifecycleBurst
  Location/Rotation/Scale = input world transform
  Auto Destroy = true
  Auto Activate = false
  Pooling Method = initial non-pooled baseline
→ Is Valid(Return Value)
→ Set User.Color
→ Set User.Scale
→ Activate
```

Exact pins/defaults: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 4. `PlayAttachedCharge`

```text
Inputs: AttachComponent, SocketName, RelativeTransform, Color, Scale
Spawn System Attached
  Attach to Component = input
  Attach Point Name = input
  Location/Rotation = relative offset
  Location Type = relative/snap contract verified in project
  Auto Destroy = true
  Auto Activate = false
→ Set full parameters
→ Activate
```

Рух parent після spawn доводить правильне attachment.

### 5. Persistent aura

```text
StartAura:
  if inactive:
    ResetSystem/Reinitialize candidate verified
    Apply full parameters
    Activate
  if active:
    Apply full parameters
    refresh external duration; do not stack

StopAura:
  if valid and active:
    Deactivate
```

Owner `EndPlay` також викликає stop. Looping system не покладається на AutoDestroy.

### 6. Parameter/reset contract

Кожна activation задає:

```text
Relative/world transform
Attachment
User.Color
User.Scale
User.Direction
User.TargetPosition
Variant/seed when required
Visibility/rendering state
Expected completion owner
```

### 7. Результат перевірки

| Test | Result |
|---|---|
| Owner рухається після world impact | impact лишається |
| Owner рухається після attached charge | charge слідує |
| Aura повторена 20 разів | один component, без stack |
| Чергування red/2 → blue/.5 | немає stale values |
| Owner destroyed під час active aura | active aura не лишається |
| Invalid attach component | request безпечно відхилено |
| Cooldown audit | baseline active count відновлено |

### 8. Чому це працює

Spatial ownership, re-entry та exit задані явно. Parameters застосовуються до activation, а кожний reusable path записує повний contract. Cleanup прив’язано до natural completion для finite effects і до gameplay state для loop.

### 9. Допустимі альтернативи

- World impact може використовувати manually managed component, якщо потрібні подальші target updates.
- Charge може використовувати placed child component замість spawned attached instance.
- Impact policy може бути Restart, а не Stack, якщо feedback має бути exclusive.
- Project-specific VFX manager може володіти references, якщо lifecycle лишається явним.

### 10. Поширені неправильні рішення

- `Auto Destroy=true` як єдиний aura exit.
- Parameters записуються після auto-activated first frame.
- Invalid `Return Value` ігнорується.
- Impact, що має лишатися на ground, attached до owner.
- Aura re-entry створює новий loop на кожне натискання.

### 11. Продуктивність

20-run test записує active systems до та після cooldown. Він не встановлює universal limit. Pooling відкладається, доки representative capture не покаже allocation/GC pressure.

### 12. Перевірка acceptance criteria

Усі 7 acceptance criteria виконано.

---

## EX-L10-01-B

### 1. Підготовка faults

Продублюй working path як `BP_L10_LifecycleFaultLab`. Справний Blueprint збережи як control.

Інжектовані failures:

1. `User.Color` пропущено в alternating requests.
2. `Return Value` не збережено.
3. Looping effect spawned на кожний input без stop.

### 2. Діагностика stale color

```text
Symptom: blue request sometimes appears red.
Hypothesis: reused component retained prior User.Color.
Test: log request color and component color immediately before Activate.
Finding: second request set Scale only.
Fix: ApplyFullParameterContract writes Color, Scale, Direction and target every time.
```

### 3. Діагностика втраченої reference

```text
Symptom: cancel input cannot stop the charge.
Hypothesis: spawned component reference was discarded.
Test: inspect request ID → component mapping.
Finding: no valid stored reference.
Fix: retain Return Value under owner/request ID, validate before update/stop, clear on finish.
```

Exact completion binding: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 4. Діагностика infinite leak

При п’яти requests за секунду active count лінійно зростав навіть після припинення input. Niagara Debugger filter показав багато instances того самого looping asset.

Виправлення:

- змінити re-entry на Refresh для actor-owned aura;
- використовувати один persistent component;
- stop на state end і owner end;
- виконати cooldown audit після завершення living particles.

### 5. Non-pooled baseline

Запусти 50 alternating impacts у representative gameplay scene. Запиши:

```text
build/configuration
hardware
scene/camera
request interval
peak active systems
particles
frame-time evidence
post-cooldown count
```

### 6. Pooling candidate

Увімкни verified pooling method лише для short frequent impact. Повтори той самий scenario. Pooling приймається лише якщо:

- output відповідає baseline;
- stale parameters відсутні;
- premature reuse відсутній;
- capture показує relevant allocation/GC або activation improvement;
- active simulation/render cost не видається помилково за pooling gain.

Exact pooling enum/return behavior: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 7. Рішення

Model-рішення:

- persistent reuse для aura;
- ordinary spawn для rare charge;
- pooled candidate для frequent impact лише після evidence.

### 8. Чому це працює

Кожний failure має окрему вісь: data reset, reference ownership або lifecycle exit. Single-variable tests не дозволяють downstream workaround приховати root cause.

### 9. Альтернативи

- Centralized pool/manager допустимий, якщо гарантує full reset та ownership.
- Ignore або Restart можуть замінити Refresh для іншої gameplay semantics.
- System-as-service patterns можуть зменшити instances, але виходять за межі цього beginner control і потребують власного evidence.

### 10. Поширені неправильні рішення

- Додати arbitrary Delay перед Destroy.
- Змінити color у Niagara, щоб приховати missing Blueprint data.
- Увімкнути pooling і назвати задачу optimized.
- Вимкнути debugger до встановлення leaking asset, а потім вгадувати.
- Використати Stack policy для persistent buff.

### 11. Фінальна перевірка

П’ятдесят alternating requests:

- stale values відсутні;
- visual count відповідає expected;
- owner destruction безпечний;
- invalid target оброблено безпечно;
- після cooldown active count дорівнює baseline;
- clean capture повторено без verbose diagnostics.

### 12. Висновок щодо продуктивності

Universal component budget не заявляється. Recommendation стосується лише записаних target hardware, build і scenario; інша platform має повторити comparison.
