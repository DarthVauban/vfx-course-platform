# Розв’язки L04-06 — Niagara, Material і runtime parameters

## EX04-06-A — 12-instance parameter wall

### Asset architecture

Один `NS_VFX_DataBridge`, один `M_VFX_DataBridge`, один `BP_VFX_DataBridgeController`. У level — 12 instances Blueprint.

```text
Columns: Charge01 = .15, .40, .70, 1.00
Rows:
  Team A = (0.05, 0.25, 1.0)
  Team B = (1.0, 0.08, 0.03)
  Neutral = (0.45, 0.05, 1.0)
```

Кожен Blueprint instance у `BeginPlay`:

```text
NiagaraComponent.SetVariableLinearColor(
  "User.EffectTint", EffectTint
)
NiagaraComponent.SetVariableFloat(
  "User.Charge01", Charge01
)
NiagaraComponent.SetVariableFloat(
  "User.Erode01", 1 - Charge01
)
NiagaraComponent.SetVariableFloat(
  "User.LocalIntensity", 1
)
```

Exact function display names:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Niagara data path

```text
Particle Spawn:
  Particles.Color = User.EffectTint
  Particles.Charge01 = User.Charge01
  Particles.Erode01 = User.Erode01
  Particles.LocalIntensity = User.LocalIntensity

Renderer:
  Color ← Particles.Color
  M_Charge01 ← Particles.Charge01
  M_Erode01 ← Particles.Erode01
  M_LocalIntensity ← Particles.LocalIntensity
```

Для animated instance перенесіть relevant User→Particle copies у Particle Update або використайте system/emitter renderer binding path, якщо він verified у 5.8. Не переміщуйте static tint без потреби.

### Material receiver

```text
ChargeColor = lerp(ColorLow, ColorHigh, saturate(M_Charge01))
Visible = step(M_Erode01, Shape)
Emissive = ChargeColor
         × ParticleColor.RGB
         × M_LocalIntensity
         × lerp(1,8,M_Charge01)
         × Visible
Opacity = Visible × ParticleColor.A
```

### Runtime animated instance

Timeline duration 1.5 s, float track 0→1:

```text
Timeline Update
  → Set Niagara Variable Float "User.Charge01"
```

Particles мають реагувати в Update, інакше тільки newly spawned particles отримають нове charge. Це має бути recorded у data log.

### Validation

- Content Browser показує один System/Material.
- 12 labels відповідають actual values.
- Sampling одного pixel/visual ordering показує чотири increasing charge states у кожному row.
- Team rows змінюють hue, не timing/shape.
- `Charge=1` не clip-ить усе до безформного white rectangle.
- Static 11 instances не мають Tick setter.

### Типові неправильні рішення

- 12 duplicated Niagara Systems.
- MPC для team/charge grid: last writer робить всі instances однаковими.
- Material Instances по одному на projectile, коли data already exists in Niagara.
- Blueprint змінює local variable, але не NiagaraComponent.
- Writer працює, але renderer material binding має інше parameter name.

### Rubric

| Критерій | Бали |
|---|---:|
| Один System/Material | 15 |
| 12 independent instance values | 25 |
| Correct User→Particle→Renderer→Material path | 25 |
| Animated Spawn/Update behavior | 15 |
| No unnecessary Tick | 10 |
| Data log/screenshots | 10 |

## EX04-06-B — Scope architecture challenge

### Рішення за scope

| Value | Path | Чому |
|---|---|---|
| Projectile tint | `User.TeamTint → Particles.Color → ParticleColor` | Один Niagara component має власний tint |
| Projectile charge | `User.Charge01 → Particles.Charge01 → M_Charge01` | Per projectile/system instance; може стати per-particle |
| Shield local damage | DMI scalar/vector на shield component | Один mesh component, local persistent material state |
| Storm intensity | `MPC_VFX_Global.GlobalStorm01` | Навмисно однаковий global value для всіх electric readers |
| Particle age fade | `Particles.NormalizedAge`/curve → `Particles.Color.A` | Кожна particle має власний age |
| High/Low feature | Niagara scalability/emitter choice + material static instance/renderer selection | Tier configuration, не individual visual signal |

### Чому інші scopes гірші

**Projectile charge через MPC:** усі projectiles бачать останнє value.  
**Storm через User:** доведеться оновлювати кожен component і синхронізувати.  
**Shield damage через particle attribute:** shield — component material, не particle stream.  
**Age через Blueprint Tick:** CPU керує тим, що simulation уже знає per particle.  
**Team tint через duplicated material:** asset explosion і слабкий runtime reuse.

### High/Low contract

```text
Both tiers preserve:
  team tint
  charge timing/value
  primary silhouette
  hit/telegraph moment

High adds:
  cosmetic distortion
  secondary ribbon
  Fresnel rim

Low removes:
  cosmetic layers and optional expensive shader paths
```

### Update policy

| Data | Коли оновлювати |
|---|---|
| TeamTint | Spawn/change event |
| Charge | Ability timeline/event; Niagara Update only if living particles must respond |
| Shield damage | Damage event |
| Storm | Global weather event/timeline at justified rate |
| Age | Niagara Particle Update |
| Tier | Scalability/system activation/configuration |

### Verification sequence

1. Spawn 6 projectiles with visible unique label/value.
2. Change charge одного — інші не змінюються.
3. Damage one shield — second shield unchanged.
4. Change storm — all electric readers change.
5. Pause simulation — particles show different age alpha.
6. Switch High→Low — gameplay color/charge/timing unchanged.

### Performance

- Не дублюйте attributes з однаковим meaning.
- Копіюйте stable User values у Spawn.
- DMI створюйте один раз на shield component.
- MPC пишіть лише при global change.
- Tier changes не мають викликати rebuild щокадру.
- Profile representative 6 projectiles + 2 shields + environment readers.

### Rubric

| Критерій | Бали |
|---|---:|
| Correct scope for 6 values | 30 |
| Isolation/global propagation tests | 20 |
| Update-rate policy | 15 |
| High/Low cue parity | 15 |
| Failure-safe defaults | 10 |
| Performance evidence | 10 |

Mastery: ≥80; projectile isolation, storm global behavior і age per-particle behavior обов’язкові.
