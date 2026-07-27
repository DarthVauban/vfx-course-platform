# Розв’язки L04-07 — Material Laboratory

## EX04-07-A — Blank-spec rebuild

### Reference dependency diagram

```text
MI_FireSlash_Mesh ─────┐
MI_IceRing_Mesh ───────┼→ M_VFX_Mesh_AC
MI_VoidProjectile_Mesh ┘      ├→ MF_VFX_ErodeEdge
                              ├→ MF_VFX_ThreeColorRamp
                              ├→ MF_VFX_FresnelBand
                              └→ T_* inputs

MI_FireSpark_Sprite → M_VFX_Sprite_AC
                              ├→ MF_VFX_ErodeEdge
                              └→ MF_VFX_ThreeColorRamp

MI_VoidTrail_Ribbon → M_VFX_Ribbon_AC
                              ├→ MF_VFX_FlowUV
                              ├→ MF_VFX_ErodeEdge
                              └→ MF_VFX_ThreeColorRamp

MI_IceTelegraph_Decal → M_VFX_Decal
                              ├→ MF_VFX_ErodeEdge
                              └→ MF_VFX_ThreeColorRamp
```

Жодний instance не посилається на інший instance як на architecture dependency. Жодна function не посилається на effect-specific instance.

### Minimum shared functions

`MF_VFX_ErodeEdge`:

```text
Inputs: Mask, Threshold01, EdgeWidth01
Body = step(Threshold01, Mask)
Expanded = step(Threshold01 - EdgeWidth01, Mask)
Edge = saturate(Expanded - Body)
Outputs: Body, Edge
```

`MF_VFX_ColorShapeCore`:

```text
Inputs: Shape, ColorCoordinate, ColorA, ColorB, Tint, Intensity, OpacityScale
Emissive = lerp(ColorA,ColorB,saturate(ColorCoordinate))
         × Tint × Intensity × saturate(Shape)
Opacity = saturate(Shape × OpacityScale)
```

Step polarity треба підтвердити preview:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Parent split

```text
Sprite AC:
  Surface / AlphaComposite / Unlit
  ParticleColor, optional DepthFade

Mesh:
  Surface / AlphaComposite / Unlit
  VertexColor, ParticleColor, optional Fresnel/WPO

Ribbon:
  Surface / AlphaComposite / Unlit / Two Sided
  Ribbon UV tiling/scroll, ParticleColor

Decal:
  Deferred Decal / project-compatible mode
  local/component runtime params, no ParticleColor assumption
```

### Named runtime path

```text
User.Charge01
→ Particles.Charge01
→ Renderer Material Parameter Binding "M_Charge01"
→ saturate
→ Lerp(IntensityMin, IntensityMax)
```

Fallback `M_Charge01=0` лишає базовий body visible.

### Three variants

| Variant | Shape | Motion/timing intent | Palette/value | Renderer |
|---|---|---|---|---|
| Fire Slash | broken tapered arc | fast directional sweep | red body, yellow-white narrow core | Mesh |
| Ice Ring | faceted segmented ring | restrained expand/hold/shatter | blue/cyan stepped bands | Mesh+Decal |
| Void Projectile | asymmetrical shell/core | inward flow + charged burst | violet body, cyan accent | Sprite/Mesh+Ribbon |

### Required validation

- raw shape/body/edge screenshots;
- no-writer golden screenshot;
- runtime charge `.0/.5/1`;
- black/mid/white, bloom off/on;
- renderer-specific failure case;
- High/Low;
- performance capture.

### Common invalid rebuilds

- Вставити screenshots guided graph замість власного connection list.
- Зробити Decal як Surface material.
- Сховати renderer-specific UV sampling усередині ambiguous core function.
- Три variants відрізняються лише `ColorA`.
- Default Particle Color black.

### Rubric

| Criterion | Points |
|---|---:|
| Dependency/function architecture | 20 |
| Four parent contracts | 20 |
| Runtime path/fallback | 15 |
| Three original languages | 20 |
| Validation matrix | 15 |
| Documentation/performance | 10 |

## EX04-07-B — Optimization rescue

### Locked baseline

```text
Camera transform: saved CineCamera/Level Bookmark
Resolution/screen percentage: recorded
Exposure/bloom: locked
Effect count: representative N
Duration/frame window: identical
Hardware/RHI/build/date: recorded
```

### Cost ladder decision

1. Disable extra translucent layers.
2. Reduce projected size/overlap only if silhouette remains readable.
3. Reduce Ribbon segments or mesh topology where silhouette unchanged.
4. Disable distortion.
5. Disable second scrolling noise/sample.
6. Disable Fresnel/WPO.
7. Simplify remaining math.

Порядок може змінитися після вимірювань; головне — одна контрольована variable за раз.

### Reference tiers

```text
High:
  body + erode edge
  two noises
  distortion
  Fresnel/WPO
  two cosmetic layers

Medium:
  body + erode edge
  one noise
  no distortion
  no WPO; restrained rim only if measured/valuable
  one cosmetic layer

Low:
  body + stable edge or threshold
  one texture sample
  no distortion/Fresnel/WPO
  no cosmetic layers
  same gameplay timing/area/color family
```

### Report table

| Tier | Visual layers | Shader features | Coverage/segments | GPU evidence | Cue parity |
|---|---|---|---|---|---|
| High | record | record | record | measured | reference |
| Medium | record | record | record | measured | pass/fail |
| Low | record | record | record | measured | pass/fail |

Не вигадуйте milliseconds. Якщо target hardware недоступне:

`Потребує ручної перевірки в Unreal Engine 5.8.`

І надайте proxy evidence: material stats, Shader Complexity, coverage/overdraw, segment/layer counts.

### Wrong optimizations

- Lower tier має менший gameplay radius.
- Змінена camera віддаляє effect.
- Exposure прибирає bloom і видається за shader gain.
- Effect count reduced without disclosure.
- ALU скорочено, але wide overlapping translucent layers лишилися.
- Static switch permutations не враховані.

### Rubric

| Criterion | Points |
|---|---:|
| Locked benchmark | 15 |
| One-feature cost ladder | 20 |
| Meaningful High/Medium/Low | 20 |
| Gameplay cue parity | 20 |
| Valid evidence | 15 |
| Decision record/limitations | 10 |

Mastery: ≥80; locked comparison і cue parity є critical.
