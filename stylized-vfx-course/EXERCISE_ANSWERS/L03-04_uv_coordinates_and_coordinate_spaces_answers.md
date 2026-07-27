# Рішення вправ — 03.04 UV і coordinate spaces

## EX-L03-04-A

### Контракт

- Asset `M_EX_L03_04_PivotMotion`
- Surface/Opaque/Unlit
- Parameters: `TilingXY=(3,1,0,0)`, `OffsetXY=(0,0,0,0)`, `PanSpeedXY=(0.15,0,0,0)`, `RotateRate=0.1`, `UseRotate=0`

### Перелік вузлів

`TextureCoordinate UV0`; Vector Parameters `TilingXY`, `OffsetXY`, `PanSpeedXY`; three `ComponentMask` RG nodes; `Multiply ScaleUV`; `Add OffsetUV`; `Panner PanUV`; `Time GameTime`; `ScalarParameter RotateRate`; `Multiply RotateTime`; `Rotator RotateUV`; `ScalarParameter UseRotate`; `LinearInterpolate SelectUV`; `Frac CellUV`; `Constant ZeroB=0`; `AppendVector RGB`; Main Material Node.

### З'єднання

```text
TilingXY.RGBA → TilingRG.Input
UV0.Output → ScaleUV.A
TilingRG.RG → ScaleUV.B
OffsetXY.RGBA → OffsetRG.Input
ScaleUV.Output → OffsetUV.A
OffsetRG.RG → OffsetUV.B
OffsetUV.Output → PanUV.Coordinate
PanSpeedXY.RGBA → PanSpeedRG.Input
PanSpeedRG.RG → PanUV.Speed
GameTime.Output → RotateTime.A
RotateRate.Output → RotateTime.B
OffsetUV.Output → RotateUV.Coordinate
RotateTime.Output → RotateUV.Time
PanUV.Output → SelectUV.A
RotateUV.Output → SelectUV.B
UseRotate.Output → SelectUV.Alpha
SelectUV.Output → CellUV.Input
CellUV.Output → RGB.A
ZeroB.Output → RGB.B
RGB.Output → MaterialOutput.Emissive Color
```

У `Rotator` задайте Center X/Y `.5`, Speed `1`. Для порівняння обертання навколо кута задайте Center `0,0`, зробіть capture, а потім відновіть значення.

Фактичний pin `Panner.Speed` і назви полів у Rotator Details: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Чому це працює / перевірка

Масштабування відбувається до offset. Обидві гілки анімації отримують однаково перетворені базові UV. UseRotate слугує лабораторним перемикачем. `Frac` показує три комірки вздовж U. Центральний pivot обертає візерунок на місці; pivot у куті рухає вміст по орбіті навколо початку UV.

### Альтернативи

`CustomRotator` із явно заданими center/angle є коректною альтернативою, якщо офіційний вузол доступний у встановленій версії 5.8 і задокументований, але вправа вимагає `Rotator`. Ручне обертання через sine/cosine — коректна поглиблена математика, проте воно відволікає від поточної мети.

### Типові помилки

- Offset під'єднано до Scale.
- Швидкість RGBA подано без RG mask.
- Time помножено двічі або одночасно застосовано вбудовану швидкість Panner і власний offset.
- Frac перед анімацією приховує очікувану неперервність координат під час debug.

### Продуктивність

У фінальному production-графі не слід залишати одночасно Panner і Rotator, якщо використовується лише один із них. Цей dynamic selector має навчальну мету; у 03.08 порівнюються static variants.

## EX-L03-04-B

### Чотири контракти графів

Усі матеріали: Surface/Opaque/Unlit.

#### UV

```text
TextureCoordinate_UV0.Output → FracUV.Input
FracUV.Output → AppendRGB.A
Constant0.Output → AppendRGB.B
AppendRGB.Output → MaterialOutput.Emissive Color
```

#### World

```text
AbsoluteWorldPosition.Output → WorldScale.A
Constant_0_01.Output → WorldScale.B
WorldScale.Output → WorldFrac.Input
WorldFrac.Output → MaterialOutput.Emissive Color
```

#### Object distance

```text
AbsoluteWorldPosition.Output → ObjectDistance.A
ObjectPositionWS.Output → ObjectDistance.B
ObjectDistance.Output → DistanceScale.A
Constant_0_01.Output → DistanceScale.B
DistanceScale.Output → DistanceFrac.Input
DistanceFrac.Output → MaterialOutput.Emissive Color
```

#### Screen

Використайте режим `ScreenPosition`, який у встановленій збірці повертає сумісні з viewport координати XY, а далі:

```text
ScreenPosition.Output → ScreenRG.Input
ScreenRG.RG → AppendScreen.A
Constant0.Output → AppendScreen.B
AppendScreen.Output → MaterialOutput.Emissive Color
```

Режим output і pins вузла `ScreenPosition`: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Матриця очікуваної поведінки

| Граф | Переміщення об'єкта | Переміщення камери |
|---|---|---|
| UV | візерунок залишається на UV | залишається на surface |
| World | візерунок ковзає по переміщеному об'єкту та лишається world-locked | вигляд змінюється, world anchoring зберігається |
| Object distance | радіальний, відносний до об'єкта зв'язок слідує за origin об'єкта | лишається пов'язаним з об'єктом |
| Screen | проєкція змінюється разом із положенням на екрані/камерою | змінюється безпосередньо |

### Перевірка

Використайте дві площини однакового розміру, однаковий material scale і фіксовану exposure. Для кожного capture змінюйте лише один transform і фіксуйте стан до/після. Запишіть фактичну поведінку; таблиця не замінює доказів.

### Альтернативи

`TransformPosition` може забезпечити явне порівняння local/world. Це коректний варіант, якщо options source/destination задокументовано за UI UE 5.8. У цьому рішенні використано прямі офіційні position expressions, щоб мінімізувати приховані припущення.

### Типові помилки

- Одночасне переміщення об'єкта й камери.
- Різні mesh UV.
- Raw world position без scale/Frac.
- Помилкова назва object distance як «local coordinates».

### Продуктивність

Вартість coordinate math невелика, але залежності від screen/world можуть ускладнити batching і візуальну стабільність. Production-рішення спирається на художню мету та profiling, а не на універсальне правило «найдешевшого простору».
