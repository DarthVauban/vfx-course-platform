# Рішення вправ — 03.02 Material math і remapping

## EX-L03-02-A

### Обґрунтування

Graph реалізує canonical remap. Parameters зберігають input contract, а `Saturate` робить Alpha safe для endpoint color ramp.

### Contract material

- Asset `M_EX_L03_02_RemapStrip`
- Surface / Opaque / Unlit
- Two Sided `False`

### Повний inventory nodes

| Alias | Node | Default |
|---|---|---|
| `UV0` | `TextureCoordinate` | index 0 |
| `U` | `ComponentMask` | R |
| `InMin` | `ScalarParameter` | `0.25` |
| `InMax` | `ScalarParameter` | `0.75` |
| `Numerator` | `Subtract` | — |
| `Range` | `Subtract` | — |
| `Normalize` | `Divide` | — |
| `Clamp01` | `Saturate` | — |
| `Color_A` | `VectorParameter` | `(0,0.1,1,1)` |
| `Color_B` | `VectorParameter` | `(2,0,0.5,1)` |
| `Ramp` | `LinearInterpolate` | — |
| `Intensity` | `ScalarParameter` | `2` |
| `FinalHDR` | `Multiply` | — |
| `MaterialOutput` | Main Material Node | — |

### Точні connections

```text
UV0.Output → U.Input
U.R → Numerator.A
InMin.Output → Numerator.B
InMax.Output → Range.A
InMin.Output → Range.B
Numerator.Output → Normalize.A
Range.Output → Normalize.B
Normalize.Output → Clamp01.Input
Color_A.RGB → Ramp.A
Color_B.RGB → Ramp.B
Clamp01.Output → Ramp.Alpha
Ramp.Output → FinalHDR.A
Intensity.Output → FinalHDR.B
FinalHDR.Output → MaterialOutput.Emissive Color
```

### Чому це працює і як перевірити

- За U=`0.25`: numerator `0`, normalized `0`, color A.
- За U=`0.5`: normalized `(0.5-0.25)/0.5=0.5`, midpoint.
- За U=`0.75`: normalized `1`, color B.
- Поза range: Saturate виконує clamp Alpha до endpoints.

Створіть `MI_EX_L03_02_Narrow` з `InMin=0.4`, `InMax=0.6`; transition звужується без change graph.

### Альтернативи

General `Clamp(Input,0,1)` функціонально valid замість Saturate, але тут менш прямий. Prebuilt remap function не приймається, бо exercise перевіряє explicit formula.

### Типові неправильні рішення

- `Range = InMin-InMax`: reversed або negative range.
- Numerator `InMin-U`: reversed ramp.
- Hardcoded denominator `0.5`: instance ламається, коли endpoints змінюються.
- Alpha не saturated: colors extrapolated.

### Performance

Arithmetic cost малий. Не додавайте duplicated correction nodes для компенсації неправильного range; виправте formula. Пізніше об’єднайте verified remap у Material Function.

## EX-L03-02-B

### Contract material

- Asset `M_EX_L03_02_SymmetricPulse`
- Surface / Opaque / Unlit
- Two Sided `False`

### Повний inventory nodes

| Alias | Node | Default |
|---|---|---|
| `UV0` | `TextureCoordinate` | 0 |
| `U` | `ComponentMask` | R |
| `Center` | `ScalarParameter` | `0.5` |
| `CenterDelta` | `Subtract` | — |
| `Distance1D` | `Abs` | — |
| `HalfWidth` | `ScalarParameter` | `0.25` |
| `NormalizeDistance` | `Divide` | — |
| `InvertDistance` | `OneMinus` | — |
| `ClampPulse` | `Saturate` | — |
| `PulsePower` | `ScalarParameter` | `3` |
| `ShapePulse` | `Power` | — |
| `ComparisonMask` | `Constant` | `0.35` |
| `PulseMin` | `Min` | — |
| `PulseMax` | `Max` | — |
| `UseMax` | `ScalarParameter` | `0` |
| `SelectResult` | `LinearInterpolate` | — |
| `MaterialOutput` | Main Material Node | — |

### Точні connections

```text
UV0.Output → U.Input
U.R → CenterDelta.A
Center.Output → CenterDelta.B
CenterDelta.Output → Distance1D.Input
Distance1D.Output → NormalizeDistance.A
HalfWidth.Output → NormalizeDistance.B
NormalizeDistance.Output → InvertDistance.Input
InvertDistance.Output → ClampPulse.Input
ClampPulse.Output → ShapePulse.Base
PulsePower.Output → ShapePulse.Exp
ShapePulse.Output → PulseMin.A
ComparisonMask.Output → PulseMin.B
ShapePulse.Output → PulseMax.A
ComparisonMask.Output → PulseMax.B
PulseMin.Output → SelectResult.A
PulseMax.Output → SelectResult.B
UseMax.Output → SelectResult.Alpha
SelectResult.Output → MaterialOutput.Emissive Color
```

### Чому це працює

`Abs(U-Center)` дає symmetric distance. Division на HalfWidth maps boundary до `1`; `OneMinus` робить center рівним `1`; Saturate прибирає negative values поза shape; Power формує falloff. Min обмежує pulse зверху на `0.35`; Max створює floor `0.35`. Lerp виконує selection без permutation.

### Перевірка

1. Debug `CenterDelta`: signed values ліворуч і праворуч.
2. Debug `Distance1D`: symmetric V shape.
3. Debug `ClampPulse`: білий center, чорне поза width.
4. Debug `ShapePulse`: вужчий bright core.
5. `UseMax=0`: result capped; `UseMax=1`: gray floor.
6. Встановіть `Center=0.3`: pulse рухається, але лишається symmetric.
7. Ніколи не встановлюйте `HalfWidth=0`.

### Альтернативні valid approaches

`Distance(U,Center)` може замінити Subtract+Abs для scalar-like inputs, але ця exercise явно практикує `Abs`. `Sign` може класифікувати sides для two-color split; його навмисно пропущено, бо smooth symmetric pulse не потребує discontinuity.

### Неправильні рішення

- `Abs` після OneMinus: shape більше не представляє distance правильно.
- Power до Saturate, коли Base negative.
- `UseMax` поза `0–1`: Lerp виконує extrapolation.
- `StaticSwitchParameter`: створює permutations і порушує constraint.

### Performance

Dynamic Lerp обчислює обидві branches Min і Max, але обидві trivial. Static Switch міг би прибрати одну branch під час compile ціною permutations; цей trade-off належить до 03.08. Correctness і intent architecture мають пріоритет.
