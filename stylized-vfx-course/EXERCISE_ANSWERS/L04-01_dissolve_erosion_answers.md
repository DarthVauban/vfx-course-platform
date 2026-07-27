# Рішення вправ L04-01

Відкривайте після власної спроби й hints. Відтворіть logic із пам’яті на новому asset.

## EX-L04-01-A — Радіальний reveal без dissolve texture

### Повна побудова

Material properties:

| Property | Value |
|---|---|
| Material Domain | `Surface` |
| Blend Mode | `Translucent` |
| Shading Model | `Unlit` |
| Two Sided | On |

Node inventory:

| Alias | Node | Value / Parameter |
|---|---|---|
| `UV0` | `TextureCoordinate` | Coordinate Index 0 |
| `Center` | `Constant2Vector` | `(0.5,0.5)` |
| `CenteredUV` | `Subtract` | — |
| `Radius` | `Length` | — |
| `RadiusScale` | `Scalar Parameter` | `RadiusScale=2.0` |
| `ScaledRadius` | `Multiply` | — |
| `InvertRadius` | `OneMinus` | — |
| `RadialSat` | `Saturate` | — |
| `DissolveP` | `Scalar Parameter` | `Dissolve=0.5` |
| `WidthP` | `Scalar Parameter` | `EdgeWidth=0.08` |
| `SoftP` | `Scalar Parameter` | `Softness=0.015` |
| `Fn` | `Material Function Call` | `MF_VFX_DissolveEdge` |

```text
UV0.Output → CenteredUV.A
Center.Output → CenteredUV.B
CenteredUV.Output → Radius.Input
Radius.Output → ScaledRadius.A
RadiusScale.Output → ScaledRadius.B
ScaledRadius.Output → InvertRadius.Input
InvertRadius.Output → RadialSat.Input
RadialSat.Output → Fn.Mask
DissolveP.Output → Fn.Dissolve
WidthP.Output → Fn.EdgeWidth
SoftP.Output → Fn.Softness
```

Далі використайте Body/Edge color branches і CombinedMask → Opacity як у guided material.

### Чому працює

`UV−0.5` переносить center у origin. `Length` дає 0 у center й приблизно 0.707 у corners. Multiply 2 масштабує radius; `OneMinus` робить center white. Function еродує цю висотоподібну mask за threshold.

### Допустимі альтернативи

- `Distance(UV, Center)` замість centered `Length`.
- Інший `RadiusScale`, якщо end state задокументовано.
- Ellipse через non-uniform multiply centered UV до Length.

### Типові неправильні рішення

- `Length(UV)` без centering — reveal іде з corner.
- Не `OneMinus` — direction reveal інвертується.
- EdgeMask не входить в Opacity — glow обрізаний.

### Перевірка

При Dissolve 0.25/0.5/0.75 boundary має зберігати center і змінювати radius монотонно. Preview `RadialSat` має бути white center → black edge.

### Performance

Немає Texture Sample, але є per-pixel math. На великому Translucent overlap cost усе одно визначається screen coverage і повторним shading.

## EX-L04-01-B — Vertex-biased mesh erosion

### Повна побудова

До базового material додайте:

| Alias | Node | Value / Parameter |
|---|---|---|
| `VertexData` | `Vertex Color` | — |
| `BiasStrength` | `Scalar Parameter` | `VertexBiasStrength=0.2` |
| `BiasMul` | `Multiply` | — |
| `EffectiveDissolve` | `Add` | — |

```text
VertexData.R → BiasMul.A
BiasStrength.Output → BiasMul.B
DissolveP.Output → EffectiveDissolve.A
BiasMul.Output → EffectiveDissolve.B
EffectiveDissolve.Output → DissolveFn.Dissolve
```

Інші function connections лишаються такими самими.

### Чому працює

Для vertices/pixels із R=1 effective threshold стає `Dissolve+Strength`; вищий threshold швидше приховує region. R=0 отримує базовий threshold. Interpolated Vertex Color створює плавний spatial bias між vertices.

### Як вибрати sign

- Якщо white tip має зникати раніше: `Dissolve + R×Strength`.
- Якщо white tip має зникати пізніше: `Dissolve − R×Strength` або `OneMinus(R)` із повторним аналізом.

Не міняйте sign навмання: preview `EffectiveDissolve` в grayscale.

### Допустимі альтернативи

- `Lerp(Dissolve, Dissolve+Strength, VertexColor.R)`.
- Bias через UV gradient, якщо mesh не має Vertex Color; але це вже інше technical requirement.

### Типові неправильні рішення

- Vertex Color не імпортований/усе white — bias однаковий скрізь.
- Strength надто великий — частина mesh ніколи не visible у звичному threshold range.
- Bias додається до sampled mask, але пояснюється як threshold bias; visual може бути схожим, mental model — інша.

### Перевірка

1. Тимчасово `Vertex Color.R → Emissive Color`.
2. `Strength=0` має точно збігатися з unbiased material.
3. `Strength=0.2` має змінити timing лише відповідно до R gradient.
4. Capture із однаковою camera й Dissolve curve.

### Performance

Vertex Color lookup/interpolation і кілька ALU operations додають мало порівняно з великим Translucent overdraw, але точний cost перевіряється на цільовому mesh/platform.

