# Розв’язки L04-04 — Fresnel, WPO і Vertex Color

Не відкривайте цей файл до завершення власної спроби, трьох hints і короткого запису причини, через яку результат не відповідав criteria.

## EX04-04-A — Vertex-driven energy cone

### Мінімальна повна реалізація

Channel contract:

```text
R = 0 at attachment base, gradient to 1 at free tip
G = alternating erosion islands
B = 0 outer shell, 1 inner/core side
A = 0 at deliberately trimmed edge, 1 in body
```

Graph:

```text
BodyMask = T_BodyMask.R × VertexColor.A
BodyColor = Lerp(ColorLow, ColorHigh, VertexColor.B)
FresnelBand = saturate(
    smoothstep(.15, .42, Fresnel(Exponent=3.5))
  - smoothstep(.56, .82, Fresnel(Exponent=3.5))
)
Emissive =
    BodyColor × 2.5 × BodyMask
  + RimColor × 4.0 × FresnelBand × BodyMask

PhaseCycles = Time × 1.4 + TexCoord.V × 3.0
WPO = VertexNormalWS × Sine(PhaseCycles) × 5.0 × VertexColor.R
Opacity = saturate(BodyMask)
```

У graph `Sine(PhaseCycles)` означає Material expression `Sine` з `Period=1`, де input заданий у cycles, не HLSL radians.

### Чому це працює

- R=0 на base математично зануляє offset незалежно від wave.
- B змінює palette, не shape.
- A обрізає silhouette до додавання rim, тому rim не повертає видалений edge.
- Fresnel band множиться на body mask і не світиться поза shape.
- UV phase прив’язаний до mesh, тому actor translation не переставляє хвилю.

### Перевірка

1. `DebugMode=1`: base чорний, tip білий.
2. `DebugMode=3`: core side біла, shell side чорна.
3. `DebugMode=4`: trimmed edge чорний.
4. `DebugMode=6`: band вузький, не заливає center.
5. `WPOAmplitude=0`: silhouette статичний, решта look не змінюється.
6. Maximum production amplitude: немає раннього culling під час orbit/pan.

### Допустимі альтернативи

- Phase від object/local position замість UV, якщо space transform перевірено.
- `Power`-based band замість двох SmoothStep, якщо є окремі width/threshold controls.
- Direction від custom vertex normal або tangent, якщо channel contract це документує.

### Неправильні рішення

- `AbsoluteWorldPosition × Amplitude → WPO`: це position, а не bounded offset.
- `Fresnel → Opacity` без body mask: silhouette стає view-dependent.
- Додавати subdivisions до всього mesh, не порівнюючи silhouette.
- Використати Vertex A для opacity, а потім випадково перезаписати A під WPO.

### Performance

Залиште один texture sample і одну WPO wave. Якщо rim не потрібен на Low tier, вимикайте Fresnel branch static switch, а не множником після повного обчислення. Найперше зменшуйте translucent screen coverage, потім topology й optional ALU.

## EX04-04-B — Два deformation modes

### Architecture

```text
SharedPhaseCycles = Time × Speed + TexCoord.V × Frequency
SignedAmount = Sine(SharedPhaseCycles) × Amplitude × VertexColor.R

NormalOffsetWS = VertexNormalWS × SignedAmount

LocalRadial = LocalPosition - LocalPivot
LocalRadialDirection = normalize(LocalRadial)
WorldRadialDirection = TransformVector(Local → World, LocalRadialDirection)
RadialOffsetWS = WorldRadialDirection × SignedAmount

FinalWPO = StaticSwitch(
  UseRadialPulse,
  True = RadialOffsetWS,
  False = NormalOffsetWS
)
```

Обидва `sin(...)` вище — Material `Sine` expressions із `Period=1`; для raw HLSL `sin` довелося б конвертувати cycles у radians через `2π`.

Назви transform node/pins і доступний local-position source:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Чому static switch

Mode задається в Material Instance і не змінюється щокадру. Static switch компілює distinct permutations та не залишає обидва modes як runtime choice. Ціна — додаткові shader permutations, тому switch має бути виправданим і документованим.

### Calm aura instance

```text
UseRadialPulse = true
Amplitude = 1.5
Speed = .45
Frequency = 1.0
RimIntensity = 1.5
```

### Short burst instance

```text
UseRadialPulse = true
Amplitude = 8
Speed = 2.5
Frequency = .5
RimIntensity = 5
```

Short burst timing повинен надалі керуватися Niagara scale/lifetime або runtime parameter; без цього sine буде нескінченно oscillate-итися.

### Bounds і collision statement

```text
Render vertices можуть відхилитися максимум на 8 cm від authored surface.
Bounds перевірені для цього maximum.
Collision не слідує за WPO; gameplay hit area задається окремо.
```

### Verification

- При R=0 обидва modes лишають base нерухомим.
- Normal mode слідує за authored normals.
- Radial mode розширює від pivot без world-axis bias.
- Обертання actor не змінює local radial behavior.
- Material stats зняті окремо для обох compiled instances.
- Screenshots Shader Complexity зроблені з однаковою camera/exposure.

### Поширені помилки

- `normalize(AbsoluteWorldPosition)`: radial direction рахується від world origin.
- Position трансформовано як direction або навпаки: translation потрапляє у vector.
- Switch після `FinalWPO × 0`: обидві дорогі branches можуть лишитися обчисленими.
- Bounds збільшені безмежно: popping зникає, але culling efficiency руйнується.

### Performance

Порівнюйте compiled material stats, а не кількість видимих boxes у graph. Radial branch додає subtract, normalize та transform. Якщо silhouette difference непомітна в production camera, залиште normal mode. Numeric budget затверджується лише на target platform/hardware.

## Підсумкова rubric, 100 балів

| Критерій | Бали |
|---|---:|
| Channel contract і correct debug views | 20 |
| Fresnel band незалежний від body | 15 |
| Signed spatial-temporal WPO | 20 |
| Stable attachment base | 10 |
| Bounds/collision documentation | 15 |
| Instance reuse й naming | 10 |
| Performance evidence | 10 |

Mastery: ≥80, без нуля в channel contract, WPO correctness або bounds/collision documentation.
