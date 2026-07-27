# Рішення вправ L04-03

## EX-L04-03-A — Four-band anime palette

### Scalar quantization

Для 4 states з indices 0,1,2,3:

```text
Clamped = Saturate(Value)
Index = Floor(Clamped * 3.999)
Quantized = Index / 3
```

`3.999` не дає Value=1 перейти в index 4 через exact multiplication by 4. Альтернатива — Min(Floor(Value×4),3).

Node connections:

```text
Value.Output → ValueSat.Input
ValueSat.Output → IndexMul.A
BandScale3_999.Output → IndexMul.B
IndexMul.Output → IndexFloor.Input
IndexFloor.Output → QuantizedDivide.A
Three.Output → QuantizedDivide.B
```

### Four colors

Найоднозначніший beginner graph використовує three threshold selections або nested Lerps із `Step`:

```text
T1 = Step(1/3, Quantized)
T2 = Step(2/3, Quantized)
T3 = Step(1.0, Quantized)
C01 = Lerp(Color0, Color1, T1)
C012 = Lerp(C01, Color2, T2)
Final = Lerp(C012, Color3, T3)
```

Exact `Step` input order звірте з UE 5.8 node tooltip/reference; якщо UI pins відображаються інакше, перевірте controlled scalar values 0, .34, .67, 1.

### Чому працює

Quantized має лише 0, 1/3, 2/3, 1. Thresholds активують наступний color stop послідовно. Opacity бере original ShapeMask, тому silhouette не стає stepped.

### Перевірка

- Value sweep 0→1 показує рівно 4 colors.
- Histogram/preview не має fifth band.
- Highlight Color3 займає лише highest-value pixels.
- Grayscale hierarchy зростає.

### Performance

Branchless math/Lerps можуть бути дешевими або ні залежно від compiled shader; перевірте Material Stats. Texture ramp іноді простіша graph-wise, але додає sample.

## EX-L04-03-B — Body/edge dual palette

### Рішення

Використайте outputs `MF_VFX_DissolveEdge`:

```text
BodyMapped = MF_VFX_ThreeColorRamp(Energy, BodyShadow, BodyMid, BodyHigh, BodyMidPoint)
BodyEmission = BodyMapped * BodyMask * BodyIntensity
EdgeEmission = EdgeColor * EdgeMask * EdgeIntensity
FinalEmission = (BodyEmission + EdgeEmission) * CombinedMask
FinalOpacity = CombinedMask * OpacityScale
```

Key connections:

```text
EnergyTex.R → BodyRamp.Value
BodyRamp.MappedColor → BodyColorMask.A
DissolveFn.BodyMask → BodyColorMask.B
BodyColorMask.Output → BodyHDR.A
BodyIntensity.Output → BodyHDR.B
EdgeColor.RGB → EdgeColorMask.A
DissolveFn.EdgeMask → EdgeColorMask.B
EdgeColorMask.Output → EdgeHDR.A
EdgeIntensity.Output → EdgeHDR.B
BodyHDR.Output → EmissiveAdd.A
EdgeHDR.Output → EmissiveAdd.B
EmissiveAdd.Output → MaterialOutput.Emissive Color
DissolveFn.CombinedMask → OpacityMul.A
OpacityScale.Output → OpacityMul.B
OpacityMul.Output → MaterialOutput.Opacity
```

### Area constraint

Зробіть representative still, preview EdgeMask і оцініть visible screen pixels/shape area. Для навчального acceptance edge не має домінувати приблизно понад 20% visible area. Це art constraint уроку, не universal production budget.

### Чому працює

Body energy отримує повну value palette; Edge — окремий accent, spatially limited EdgeMask. Combined opacity не обрізає edge. Independent intensity дозволяє white-background support без перефарбування body.

### Альтернативи

- Edge також може мати 2-color ramp за edge-local value.
- Для Additive variant premultiply convention не потрібен так само, але A/B має бути separate parent.

### Помилки

- EdgeIntensity компенсує надто широку EdgeMask: bloom приховує проблему, area лишається завеликою.
- EdgeColor і BodyHighlight однакові за hue/value, accent губиться.
- Opacity = BodyMask обрізає edge.

### Перевірка

Body-only, Edge-only, Combined debug; dark/mid/white backgrounds; no bloom capture для чесної shape evaluation; final bloom capture окремо.

### Performance

Two mapping branches додають ALU/function logic. Найбільший risk лишається translucent coverage. Medium може лишити single body ramp + constant edge color; Low — two-color body й narrower/removed cosmetic edge, якщо ігрову підказку збережено.

