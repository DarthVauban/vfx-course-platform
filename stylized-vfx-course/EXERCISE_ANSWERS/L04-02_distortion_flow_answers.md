# Рішення вправ L04-02

## EX-L04-02-A — Directional heat haze

### Рішення

Використайте Translucent/Unlit material із compatible `2D Offset` refraction configuration, перевіреною в UE 5.8.x.

| Alias | Node | Value |
|---|---|---|
| `UV0` | `TextureCoordinate` | Index 0 |
| `PlumeTex` | `Texture Sample Parameter 2D` | grayscale plume/noise |
| `UpFlow` | `Constant2Vector` | `(0.5,1.0)` packed convention |
| `FlowFn` | `Material Function Call` | DualPhaseFlow |
| `ScreenStrength` | `Scalar Parameter` | 0.01 |
| `OffsetMulStrength` | `Multiply` | — |
| `OffsetMulMask` | `Multiply` | — |
| `MaterialOutput` | Main Material Node | Refraction |

```text
UV0.Output → PlumeTex.UVs
UV0.Output → FlowFn.BaseUV
UpFlow.Output → FlowFn.FlowRG
Time.Output → FlowFn.TimeValue
FlowSpeed.Output → FlowFn.Speed
FlowStrength.Output → FlowFn.Strength
FlowFn.SignedFlow → OffsetMulStrength.A
ScreenStrength.Output → OffsetMulStrength.B
OffsetMulStrength.Output → OffsetMulMask.A
PlumeTex.R → OffsetMulMask.B
OffsetMulMask.Output → MaterialOutput.Refraction
```

За потреби animated noise sample через UV_A/B модулює mask, але final offset обов’язково множиться на plume/edge-faded mask.

### Чому працює

Packed `(0.5,1.0)` unpack-иться в `(0,1)`: up direction. Plume mask робить strength zero на transparent edges. Small ScreenStrength створює haze, а не mirror-like tearing.

### Альтернативи

- Flow texture для curved rising field.
- Internal UV distortion як Medium/Low fallback.
- Pixel Normal Offset лише після окремого verified setup.

### Помилки

- `UpFlow=(0,1)` у packed convention unpack-иться в `(-1,1)`, тобто diagonal.
- Opacity zero не завжди означає zero distortion; маскуйте offset прямо.
- Велика strength приховує direction quality за artifacts.

### Перевірка

Grid lines поза plume не рухаються. Center зміщується вгору/вздовж field. Camera pan не створює hard rectangular boundary.

### Performance

Порівняйте screen refraction із internal distortion; Low profile вимикає scene distortion.

## EX-L04-02-B — Packed water flow

### Channel contract

| Channel | Data | Range |
|---|---|---|
| R | Flow U packed | 0–1, neutral 0.5 |
| G | Flow V packed | 0–1, neutral 0.5 |
| B | Foam mask | 0–1 |
| A | Body opacity | 0–1 |

### Рішення

1. Sample packed texture at BaseUV для flow/masks.
2. Packed.RG → `MF_VFX_DualPhaseFlow.FlowRG`.
3. Sample tileable water pattern at UV_A і UV_B.
4. Lerp by Blend.
5. Body = FlowResult × Packed.A.
6. Foam = Packed.B × FoamIntensity.
7. Emissive = Body×WaterColor×BodyIntensity + Foam×FoamColor×FoamIntensity.
8. Opacity = Saturate(Body×BodyOpacity + Packed.B×FoamOpacity).

Key connections:

```text
PackedTex.RG → FlowFn.FlowRG
FlowFn.UV_A → PatternA.UVs
FlowFn.UV_B → PatternB.UVs
PatternA.R → FlowLerp.A
PatternB.R → FlowLerp.B
FlowFn.Blend → FlowLerp.Alpha
FlowLerp.Output → BodyMul.A
PackedTex.A → BodyMul.B
PackedTex.B → FoamMul.A
FoamIntensity.Output → FoamMul.B
BodyMul.Output → OpacityAdd.A
FoamMul.Output → OpacityAdd.B
OpacityAdd.Output → OpacitySat.Input
OpacitySat.Output → MaterialOutput.Opacity
```

### Чому працює

RG не змішується зі scalar masks випадково. Foam лишається структурним mask channel, тоді як water pattern рухається за field. Якщо foam також має flow-нути, sample B повторно за UV_A/B або author a separate packed behavior — це додаткові samples й інший art choice.

### Допустимі альтернативи

- Foam B може modulate flow result замість static position.
- A може бути erosion mask, якщо opacity contract змінено й задокументовано.

### Типові неправильні рішення

- Texture asset має sRGB On, neutral RG зміщується.
- B/A переплутані після re-export.
- Pattern Sample Parameter names різні, і instance не змінює обидві samples разом.

### Перевірка

Preview RG remapped, B, A окремо. Replace FlowRG із `(0.5,0.5)` — directed motion має зникнути. Replace B=0 — foam branch зникає, body лишається.

### Performance

Packing може зменшити кількість source textures, але two pattern samples лишаються. Перевірте compression artifacts кожного channel і memory format на target platform.

