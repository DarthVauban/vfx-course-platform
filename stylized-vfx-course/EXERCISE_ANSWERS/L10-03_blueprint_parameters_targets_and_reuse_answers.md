# Рішення до уроку 10.03

## EX-L10-03-A

### 1. Shared request

`ST_VFXSpawnRequest` містить:

```text
System
SpatialMode
WorldTransform / AttachComponent / AttachPoint / RelativeTransform
Color / Scale
SourcePosition / Direction
TargetMode / TargetPosition / TargetActor / TargetComponent
QualityProfile
ActionID / ReentryPolicy / AutoDestroyIntent / PoolingIntent
```

Enums є shared; per-effect duplicate spawn graphs відсутні.

### 2. Parameter schema

| Parameter | Type | Space |
|---|---|---|
| `User.SourcePosition` | Position | World |
| `User.Direction` | Vector3 | World normalized |
| `User.Distance` | Float | world units |
| `User.TargetPosition` | Position | World |
| `User.Color` | LinearColor | linear |
| `User.Scale` | Float | unitless |
| `User.QualityScalar` | Float | project semantic |
| `User.ActionID` | Int | identity |

### 3. Validation

`ValidateRequest` відхиляє missing System, invalid attached parent, required missing socket, invalid target reference та unsupported scale. Він повертає readable reason замість silent origin fallback.

### 4. Source/target resolution

```text
Fixed: Request.TargetPosition
Actor: valid Actor location/selected component
Component: exact SceneComponent/socket world location
None: Source + fallback forward × default lab distance
```

Direction:

```text
Delta = Target - Source
Distance = Length(Delta)
if Distance > epsilon:
    Direction = Delta / Distance
else:
    reject or owner-forward fallback according to request
```

### 5. Spawn order

```text
Validate
→ Resolve
→ Spawn with Auto Activate false
→ Is Valid
→ Clear target object fields
→ Set Position/Vector3/Color/Float/Object values
→ Set ActionID/profile
→ Activate
```

Typed Blueprint display names: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 6. Три gameplay calls

| Call | Spatial | Target | Update |
|---|---|---|---|
| Projectile launch | Attached/world transition | Actor snapshot | один раз |
| Beam | Attached | live SceneComponent | while active |
| Impact | At Location | FixedPosition | немає після spawn |

### 7. H/M/L

Той самий request обирає `QualityProfile`. Model bridge maps його до semantic `QualityScalar` і пізнішого Effect Type/scalability path. Timing, target та lifecycle не змінюються. До profiling не дається жодної numeric performance promise.

### 8. Перевірка

Тридцять requests чергують target mode, red/blue, scales .5/1/2 та H/M/L. Усі first frames відповідають request; None після Actor не track prior target; cooldown count повертається до baseline.

### 9. Чому це працює

Struct є source of truth. Spatial і typed conversion виконується один раз, а activation не може статися до запису full schema.

### 10. Альтернативи

- C++ struct/subsystem може реалізувати той самий contract.
- Окремий target resolver service допустимий.
- Різні Niagara Systems per profile допустимі лише коли один asset не може виразити measured trade-off.

### 11. Поширені неправильні рішення

- raw target delta зберігається як direction;
- Actor root використовується, коли потрібен component endpoint;
- zero vector трактується як «no target»;
- late parameter setting;
- три divergent H/M/L Blueprints.

### 12. Продуктивність

Fixed requests вилучаються з live update map. Bridge записує active live targets та update count, але final frequencies/budgets потребують target-hardware evidence.

---

## EX-L10-03-B

### 1. Active request map

```text
ActionID → {
  NiagaraComponent,
  TargetMode,
  Weak/validated TargetComponent,
  LastValidPosition,
  LossPolicy,
  UpdatePolicy,
  QualityProfile
}
```

До цієї map входять лише active Actor/Component targets.

### 2. Moving target

Кожний justified update:

1. validate component;
2. читає поточну позицію у світовому просторі;
3. обчислює safe direction/distance;
4. set `User.TargetPosition`, `User.Direction`, `User.Distance`;
5. cache `LastValidPosition`.

### 3. Target loss: Freeze

Для invalid target:

- clear object reference;
- зберегти last valid position;
- set mode internally to Fixed;
- вилучити request із live update map;
- дозволити effect complete.

### 4. Target loss: Fade

Для invalid target:

- clear reference;
- set `User.TargetValid=false` або invoke documented stop parameter;
- graceful deactivate/complete;
- clear ActionID mapping on finish.

Exact typed setter and completion callback: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 5. Порівняння update frequency

Запусти той самий movement path із:

- every-frame update;
- lower fixed update interval;
- event-driven transform samples, якщо project supports;
- frozen endpoint.

Запиши visual error, Game Thread/Blueprint/Niagara timing та request count на цільовому обладнанні/build. Universal interval не обирається.

### 6. Reuse reset

П’ятдесят cycles чергують:

```text
Actor red H
None blue L
Component green M
Fixed white H
```

Перед кожною activation bridge clears target object/component, а потім записує current target mode/data та всі presentation parameters.

### 7. Результат

- live component слідує;
- Freeze утримує last point;
- Fade завершується;
- inactive/fixed entries не створюють target updates;
- destroyed target ніколи не dereference;
- stale state відсутній у 50 cycles.

### 8. Чому це працює

Target mode, reference lifetime та update ownership є окремими fields. Loss переводить request у новий explicit state замість dangling object.

### 9. Альтернативи

- Redirect до іншого target допустимий за gameplay authority.
- Niagara-side data interface tracking може замінити Blueprint position updates після profiling.
- Homing projectile component може володіти target і передавати data у Niagara.

### 10. Поширені неправильні рішення

- access target до validity check;
- update fixed targets forever;
- origin як invalid-target fallback;
- clear Actor, але залишити TargetPosition stale без documented Freeze;
- порівнювати frequencies із diagnostics, увімкненими лише в одному run.

### 11. Перевірка

Evidence містить target destruction frame, state transition, update-count graph, clean gameplay capture і post-cooldown map/component counts.

### 12. Продуктивність

Обраний update method стосується recorded hardware, build і representative moving-target count. Зміна platform/profile потребує нового measurement.
