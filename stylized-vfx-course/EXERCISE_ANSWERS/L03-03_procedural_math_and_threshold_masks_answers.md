# Рішення вправ — 03.03 Procedural math і threshold masks

## EX-L03-03-A

### Contract

- `M_EX_L03_03_Stripes`
- Surface/Opaque/Unlit, Two Sided False

### Inventory

| Alias | Node | Default |
|---|---|---|
| `UV0` | `TextureCoordinate` | 0 |
| `U` | `ComponentMask` | R |
| `Repeats` | `ScalarParameter` | `8` |
| `ScaleU` | `Multiply` | — |
| `CellU` | `Frac` | — |
| `Threshold` | `ScalarParameter` | `0.5` |
| `HardMask` | `Step` | — |
| `Feather` | `ScalarParameter` | `0.04` |
| `SoftMin` | `Subtract` | — |
| `SoftMax` | `Add` | — |
| `SoftMask` | `SmoothStep` | — |
| `UseSoft` | `ScalarParameter` | `1` |
| `SelectMask` | `LinearInterpolate` | — |
| `MaterialOutput` | Main Material Node | — |

### Connections

Оскільки display pins `Step` у UE може відрізнятися, перевірте tooltip node. Semantic contract: `Step(edge=Threshold, x=CellU)`.

```text
UV0.Output → U.Input
U.R → ScaleU.A
Repeats.Output → ScaleU.B
ScaleU.Output → CellU.Input
Threshold.Output → HardMask.Y
CellU.Output → HardMask.X
Threshold.Output → SoftMin.A
Feather.Output → SoftMin.B
Threshold.Output → SoftMax.A
Feather.Output → SoftMax.B
SoftMin.Output → SoftMask.Min
SoftMax.Output → SoftMask.Max
CellU.Output → SoftMask.Value
HardMask.Output → SelectMask.A
SoftMask.Output → SelectMask.B
UseSoft.Output → SelectMask.Alpha
SelectMask.Output → MaterialOutput.Emissive Color
```

**Потребує ручної перевірки в Unreal Engine 5.8.** Якщо `Step` pins не названі `Y/X`, connect Threshold як edge, CellU як tested value та зафіксуйте actual labels.

### Чому це працює і як перевірити

Scaled U проходить `0…8`; Frac виконує reset вісім разів. Hard branch розділяє кожну cell на `.5`. Soft branch виконує transition `.46…54`. Рухайте camera: hard boundary може почати shimmer раніше.

### Альтернативи

`Floor(CellU*2)` може створити hard half-cell split, але не практикує Step. `SmoothStep(Threshold,Threshold+Feather,CellU)` дає one-sided feather і є valid, якщо це задокументовано; solution використовує symmetric feather.

### Неправильні рішення

- `Frac(U)*Repeats`: створює ramp `0…8`, а не вісім local cells.
- `Repeats=0`: repetitions відсутні.
- `Feather` настільки великий, що soft ranges перетинають boundaries cells.

### Performance

Обидві branches Lerp обчислюються, але math невелика. Головний test тут — visual aliasing, а не instruction count.

## EX-L03-03-B

### Contract і inventory

Surface/Opaque/Unlit. Nodes:

`TextureCoordinate UV0`, `Constant2Vector Center=(0.5,0.5)`, `Subtract Centered`, `Normalize RadialDir`, `VectorParameter DirectionXY=(0,1,0,0)`, `ComponentMask DirectionRG`, `Normalize UnitDir`, `DotProduct Alignment`, `Constant Half=0.5`, `Multiply DotHalf`, `Add Dot01`, `ScalarParameter ConeMin=0.75`, `ConeMax=0.85`, `SmoothStep Cone`, `Distance RadiusDistance`, `ScalarParameter Radius=0.45`, `Feather=0.04`, `Subtract InnerRadius`, `SmoothStep RadiusTransition`, `OneMinus Circle`, `Multiply FiniteCone`, Main Material Node.

### Точні connections

```text
UV0.Output → Centered.A
Center.Output → Centered.B
Centered.Output → RadialDir.Input
DirectionXY.RGBA → DirectionRG.Input
DirectionRG.RG → UnitDir.Input
RadialDir.Output → Alignment.A
UnitDir.Output → Alignment.B
Alignment.Output → DotHalf.A
Half.Output → DotHalf.B
DotHalf.Output → Dot01.A
Half.Output → Dot01.B
ConeMin.Output → Cone.Min
ConeMax.Output → Cone.Max
Dot01.Output → Cone.Value
UV0.Output → RadiusDistance.A
Center.Output → RadiusDistance.B
Radius.Output → InnerRadius.A
Feather.Output → InnerRadius.B
InnerRadius.Output → RadiusTransition.Min
Radius.Output → RadiusTransition.Max
RadiusDistance.Output → RadiusTransition.Value
RadiusTransition.Output → Circle.Input
Cone.Output → FiniteCone.A
Circle.Output → FiniteCone.B
FiniteCone.Output → MaterialOutput.Emissive Color
```

### Чому це працює

Dot класифікує angle; circle обмежує distance. Multiplication є intersection. Direction `(0,1)` спрямовано в бік збільшення V за поточної UV convention; observed visual orientation треба записати, бо convention texture V або orientation preview можуть дати неочікуваний результат.

### Перевірка

- Signed Dot: negative позаду, zero з боків, positive попереду.
- Dot01: directional field від чорного до білого.
- Cone: soft narrow lobe.
- Circle: finite disc.
- Final: finite sector-like cone.
- Directions `(1,0)`, `(0,1)`, `(-1,0)`, `(0,-1)` обертають lobe.

### Альтернативи

Precomputed angle або polar solution valid пізніше, але ця exercise явно перевіряє Dot. `Min(Cone,Circle)` може приблизно відтворити intersection normalized masks; Multiply дає м’якші combined edges.

### Неправильні рішення

- Direction RG `(0,0)` normalized.
- Swapped inputs Dot чисельно не мають значення, але missing Normalize має.
- Result circle не inverted.
- Dot подано прямо в thresholds SmoothStep, обрані для `0…1`.

### Performance

Повторно використовуйте centered UV і normalized direction. Уникайте duplicate Normalize. Для багатьох particles порівнюйте procedural cost із sampled mask лише після representative profiling.
