# Розв’язки L04-05 — Sprite, Mesh, Ribbon і Decal materials

Спочатку завершіть власний renderer matrix. Розв’язок показує production reasoning, а не єдиний допустимий look.

## EX04-05-A — Renderer translation study

### Контрольовані умови

```text
Motif: 120° crescent
Projected diameter: приблизно 240 px у reference camera
Palette: deep blue body + cyan core + white accent
Backgrounds: linear dark, mid-gray, near-white
Camera pitch: 0°, 35°, 70°
Overlap: two identical layers, 8 cm separation
```

### Sprite implementation

```text
Representation: one camera-facing quad
Shape: T_Crescent.R
Blend: AlphaComposite comparison parent
Tint: ParticleColor.RGB
Opacity: Shape × ParticleColor.A
```

**Спостереження:** projected crescent стабільний як screen-space graphic, але не лежить переконливо в world plane під camera orbit. Добрий для impact flash, поганий як точна sword geometry.

### Mesh implementation

```text
Representation: authored curved strip
UV U: arc length
UV V: strip width
Vertex R: 0 handle side → 1 tip
Material: M_VFX_Mesh_Template
WPO: disabled for baseline
```

**Спостереження:** silhouette й orientation стабільні, можна прив’язати до weapon transform. Cost включає geometry, але projected shape не залежить від billboard facing.

### Ribbon implementation

```text
Representation: trail through sampled weapon tip positions
U: normalized/distance trail length
V: width
Material: M_VFX_Ribbon_Template
```

**Спостереження:** найкраще повторює actual motion path і temporal continuity; може twist-итися, мати uneven segments і UV stretch.

### Обґрунтований вибір

Primary для melee slash: **Mesh**, якщо attack arc authored і має бути однаковим незалежно від frame sampling.

П’ять доказів:

1. тримає задану 120° curvature;
2. не повертається до camera;
3. має контрольовану width і tip taper через geometry/Vertex Color;
4. не залежить від sampling rate weapon trail;
5. легше відтворити однаково в deterministic showcase.

Ribbon стає primary, якщо slash повинен точно повторювати procedural/player-driven weapon path. Sprite лишається secondary flash.

### Неправильні висновки

- «Mesh завжди дорожчий, бо має більше triangles»: screen coverage/overdraw можуть домінувати.
- «Sprite завжди стабільніший»: стабільний screen-space, але не world-plane.
- «Ribbon автоматично знає weapon path»: потрібні particles/links, IDs, width/orientation і sampling.

### Rubric

| Критерій | Бали |
|---|---:|
| Однакові controlled conditions | 20 |
| 3 angles × 3 representations | 20 |
| Background/intersection/overlap | 20 |
| П’ять evidence-based observations | 25 |
| Cost note і limitations | 15 |

## EX04-05-B — Ground telegraph + impact family

### Recommended architecture

```text
Layer 1: Decal telegraph
  Purpose: persistent ground area and countdown
  Shape: ring + sector mask
  Domain: Deferred Decal
  Runtime controls: color, opacity/countdown, radius via component scale

Layer 2: Mesh impact ring
  Purpose: short expanding silhouette above ground
  Geometry: horizontal ring strip
  Material: M_VFX_Mesh_Template
  Controls: scale/lifetime, Vertex B palette, optional low WPO

Layer 3: Ribbon directional accent
  Purpose: one rotating/leading arc, not full area fill
  Material: M_VFX_Ribbon_Template
```

### Shared palette contract

```text
Gameplay warning: orange-red, moderate intensity, stable opacity
Impact: yellow-white core + red body, short HDR burst
Accent: same hue family, lower projected area
```

Не обов’язково використовувати один Material Parameter Collection. Shared naming й одна palette specification достатні; runtime path обирається в L04-06.

### Decal containment

1. Projection direction спрямований у floor.
2. Volume depth лише достатній для uneven floor.
3. Wall поза volume або excluded receiver policy.
4. Corner test проходить без вертикальної «смуги».
5. Якщо arena geometry не дозволяє containment, telegraph переходить на horizontal mesh.

### High/Low variants

```text
High:
  Decal + mesh ring + ribbon accent
  Mesh Fresnel on
  Ribbon soft intersection on

Low:
  Decal + one mesh ring
  Ribbon removed
  Mesh Fresnel/WPO off
  Same radius, timing, warning color
```

### Failure capture

**Failure:** decal volume торкається wall і створює vertical red strip.  
**Diagnosis:** texture alpha коректна; receiver лежить усередині projection volume.  
**Fix:** зменшено volume depth/extent і змінено orientation/placement.  
**Fallback:** ground mesh, якщо level topology непередбачувана.

### Performance proof

- одна production camera;
- 1, 4 і representative concurrent telegraphs;
- Shader Complexity/overdraw screenshots;
- GPU timing capture на target hardware;
- High/Low visual comparison;
- gameplay radius і countdown однакові.

### Неправильні рішення

- Розмивати wall spill у texture.
- Робити весь warning Additive: він губиться на bright floor.
- Залишати Ribbon у Low tier, але прибрати stable decal.
- Змінювати radius між tiers заради cost.
- Оцінювати overlap лише в isolated preview.

### Rubric

| Критерій | Бали |
|---|---:|
| Чітка роль трьох layers | 15 |
| Shared palette/readability | 15 |
| Decal containment | 20 |
| Contact і timing | 15 |
| High/Low cue parity | 15 |
| Failure/fix evidence | 10 |
| Performance evidence | 10 |

Mastery: ≥80; decal containment, gameplay readability і tier parity не можуть мати 0.
