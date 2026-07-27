# Розв’язки L08-03 — User Parameters, bindings і Blueprint data

## EX08-03-A — Стіна ability з 12 напрямками

### Матриця

| Рядок | Tint | Стовпець 1 | Стовпець 2 | Стовпець 3 | Стовпець 4 |
|---|---|---|---|---|---|
| Fire | orange-red | +X/.2/.75 | +Y/.5/1 | diagonal/.8/1.5 | zero/1/1 |
| Ice | cyan-blue | +X/.2/.75 | +Y/.5/1 | diagonal/.8/1.5 | zero/1/1 |
| Void | violet-cyan | +X/.2/.75 | +Y/.5/1 | diagonal/.8/1.5 | zero/1/1 |

Позначення в клітинці: direction / Charge01 / EffectScale.

### Setup з одним asset

12 розміщених instances `BP_AbilityVFXProbe` посилаються на:

```text
NS_AbilityDataContract
M_VFX_DataBridge family
```

System і parent Material не дублюються. Змінюються instances/parameters.

### Функція ініціалізації

```text
InitializeAndActivateVFX:
  Direction = ActorForwardVector
  Target = TargetMarker.WorldLocation
  Tint = exposed EffectTint or white
  Scale = clamp(exposed EffectScale,.01,10)
  Charge = saturate(exposed Charge01)

  Set User.DirectionWS
  Set User.TargetPositionWS
  Set User.EffectTint
  Set User.EffectScale
  Set User.Charge01
  Set User.DebugMode=0
  Activate with documented reset behavior
```

Точні display names для setter:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Fallback для нульового вектора

```text
if length(User.DirectionWS) <= .001:
  SafeDirectionWS = (1,0,0)
  DebugValidity = magenta
else:
  SafeDirectionWS = normalize(User.DirectionWS)
  DebugValidity = green
```

Фінальна production-версія може приховати magenta-marker, але має зберегти безпечний fallback.

### Рухома ціль

Лише один instance оновлює `User.TargetPositionWS`. Оновлюй:

- після перевищення порога руху target;
- через контрольований interval/timer;
- або за gameplay target event.

Emitter, що слідує за target, читає target у Particle Update. Snapshot emitter демонструє незмінність уже створених частинок.

### Підписи та докази

Кожен підпис містить:

```text
Instance ID
Tint RGB/name
Direction vector
Target location/distance
Scale
Charge
Snapshot or Live
```

Скриншоти: reference camera, debug-напрямок, фінальний вигляд і один невалідний випадок.

### Примітка про performance

Виміряй 1, 12 і репрезентативну конкурентність. Статичні instances задають значення один раз. Оновлюється лише instance з рухомою ціллю. Потрібно зазначити screen coverage для великого scale.

### Рубрика

| Критерій | Бали |
|---|---:|
| Архітектура з одним System/material | 15 |
| 12 коректних незалежних контрактів | 25 |
| Fallback для нульового вектора | 10 |
| Контрольоване оновлення рухомої цілі | 15 |
| Renderer/material binding | 15 |
| Підписи / таблиця даних | 10 |
| Примітка про performance | 10 |

## EX08-03-B — Повторно використовуваний cast, керований target

### Похідна логіка

```text
SafeDirection = safeNormalize(User.DirectionWS, +X)
Delta = User.TargetPositionWS - SourcePositionWS
Distance = length(Delta)
HasTargetDistance = Distance > 1.0 cm
TargetDirection = HasTargetDistance
  ? Delta / Distance
  : SafeDirection

Mode:
  No/invalid target → directional cast
  Valid static target → snapshot target
  Live target enabled → update target
  Distance <= 1 cm → compact burst
```

### Режим без target

- Directional particles використовують SafeDirection.
- Beam layer вимкнений або використовує коротку авторську довжину.
- Target marker прихований.
- Немає normalize для нульового вектора.

### Статичний target

- Скопіюй напрямок і відстань target під час activation/System Spawn.
- Mesh/beam вирівнюється за авторською віссю.
- Endpoints Ribbon зафіксовані.
- Уже створені частинки не переслідують подальший рух.

### Live target

- Оновлюй User target лише з обґрунтованою частотою.
- Niagara Update перераховує напрямок target.
- Endpoints/orientation Beam оновлюються.
- Trails можуть відставати за задумом; задокументуй це.

### Target на майже нульовій відстані

- Вимкни розтягнутий beam.
- Створи компактний radial burst.
- Directional slash може використовувати SafeDirection.
- Не допускай величезного scale через ділення на distance.

### Reset перед повторним використанням

Перед кожною activation:

```text
Direction = +X if missing
Target = Source + Direction×100
Tint = white if missing
Scale = 1 if missing
Charge = 0 if missing
Debug = 0
LiveTarget = false if missing
```

Після цього застосуй надані значення.

### High/Low

```text
High:
  core mesh/beam
  ribbon accent
  secondary sprite particles
  optional distortion

Low:
  core mesh/beam or readable sprite
  no ribbon/distortion
  same source-target direction, timing, tint, charge cue
```

### Хибні рішення

- Використовувати target `(0,0,0)` як універсальний sentinel «no target» без явного validity flag, коли world origin може бути валідним.
- Повторно нормалізувати вже невалідний вектор без epsilon.
- Одночасно застосовувати Component scaling, distance scale і API scale на одній осі.
- Викликати setters у Tick для 12 статичних instances.
- Залишати live-target flag/value від попереднього використання pooled-instance.
- Дозволяти tier Low прибрати target telegraph.

### Performance

- оновлюй target лише за потреби;
- де можливо, обчислюй значення System один раз;
- уникай target-математики для кожної частинки, якщо достатньо endpoints renderer;
- спочатку зменшуй secondary layers;
- профілюй рухомий target і конкурентність;
- документуй поведінку типів Position/LWC.

### Рубрика

| Критерій | Бали |
|---|---:|
| Чотири безпечні й коректні режими | 30 |
| Spaces/types/API | 15 |
| Семантика snapshot/live | 15 |
| Повний reset для повторного використання | 15 |
| Паритет сигналів High/Low | 15 |
| Performance-докази | 10 |

Поріг опанування: ≥80; безпечна обробка нульового або близького target і повний reset є обов’язковими.
