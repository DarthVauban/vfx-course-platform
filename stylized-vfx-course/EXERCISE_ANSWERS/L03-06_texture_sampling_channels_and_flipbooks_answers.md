# Рішення вправ — 03.06 Texture sampling і flipbooks

## EX-L03-06-A

### Контракт матеріалу

`M_EX_L03_06_PackedValidation`, Surface/Opaque/Unlit. Texture asset — діагностичний RGBA; для числових masks задано `sRGB=Off`. Точний compression preset обирають лише після візуального тесту на цільовій платформі та позначають як ручне рішення.

### Перелік вузлів

`TextureCoordinate UV0`; `TextureSampleParameter2D Packed`; three `Constant3Vector` UnitRed `(1,0,0)`, UnitGreen `(0,1,0)`, UnitBlue `(0,0,1)`; three `Multiply` RColor/GColor/BColor; two `Add` AddRG/AddRGB; `Multiply MasterA`; Main Material Node.

### З'єднання

```text
UV0.Output → Packed.UVs
Packed.R → RColor.A
UnitRed.Output → RColor.B
Packed.G → GColor.A
UnitGreen.Output → GColor.B
Packed.B → BColor.A
UnitBlue.Output → BColor.B
RColor.Output → AddRG.A
GColor.Output → AddRG.B
AddRG.Output → AddRGB.A
BColor.Output → AddRGB.B
AddRGB.Output → MasterA.A
Packed.A → MasterA.B
MasterA.Output → MaterialOutput.Emissive Color
```

### Чому це працює

Unit colors візуалізують призначення каналів; A явно керує composite як gate. Один sample надає всі канали. Тимчасово вимикайте A лише для capture проміжного composite, а потім відновлюйте.

### Перевірка

- Перегляньте R/G/B окремо через відповідний Multiply.
- AddRGB відповідає дизайну каналів source texture.
- A прибирає зовнішню область hard-square.
- Перемістіть камеру або змініть scale площини, щоб побачити mips.
- Порівнюйте compression лише на дублікаті texture.

### Альтернативи

`AppendVector` може безпосередньо відновити RGB із R/G/B, створюючи те саме кольорове представлення. Гілки з unit colors очевидніші для початківця й дають змогу масштабувати кожен канал окремо.

### Типові помилки

Чотири вузли TextureSample; sRGB On для числових даних; alpha автоматично вважається transparency; source і settings змінено одночасно.

### Продуктивність

Один sample є ефективним, але packed texture може змусити всі канали використовувати найвищі resolution/precision. Перевірте розмір platform resource.

## EX-L03-06-B

### Properties і parameters матеріалу

- `M_EX_L03_06_Atlas32Validator`
- Surface/Opaque/Unlit
- `Columns=8`, `Rows=4`, `Frame=0`

### Перелік вузлів

UV0; Scalar Parameters Frame/Columns/Rows; `Multiply TotalFrames`; `Constant One=1`; `Subtract MaxFrame`; `Constant Zero=0`; `Clamp SafeFrame`; `Floor FrameInt`; `Fmod Column`; `Divide RowFloat`; `Floor Row`; two Divide cell sizes; Append CellSize; Multiply LocalUV; two Divide offsets; Append Offset; Add AtlasUV; TextureSampleParameter2D Atlas; MaterialOutput.

### Точні з'єднання

```text
Columns.Output → TotalFrames.A
Rows.Output → TotalFrames.B
TotalFrames.Output → MaxFrame.A
One.Output → MaxFrame.B
Frame.Output → SafeFrame.Input
Zero.Output → SafeFrame.Min
MaxFrame.Output → SafeFrame.Max
SafeFrame.Output → FrameInt.Input
FrameInt.Output → Column.A
Columns.Output → Column.B
FrameInt.Output → RowFloat.A
Columns.Output → RowFloat.B
RowFloat.Output → Row.Input
One.Output → CellX.A
Columns.Output → CellX.B
One.Output → CellY.A
Rows.Output → CellY.B
CellX.Output → CellSize.A
CellY.Output → CellSize.B
UV0.Output → LocalUV.A
CellSize.Output → LocalUV.B
Column.Output → OffsetX.A
Columns.Output → OffsetX.B
Row.Output → OffsetY.A
Rows.Output → OffsetY.B
OffsetX.Output → Offset.A
OffsetY.Output → Offset.B
LocalUV.Output → AtlasUV.A
Offset.Output → AtlasUV.B
AtlasUV.Output → Atlas.UVs
Atlas.RGB → MaterialOutput.Emissive Color
```

### Очікувані індекси

| Frame | Column | Row |
|---:|---:|---:|
| 0 | 0 | 0 |
| 7 | 7 | 0 |
| 8 | 0 | 1 |
| 15 | 7 | 1 |
| 24 | 0 | 3 |
| 31 | 7 | 3 |
| -2 | обмежено до 0 | 0 |
| 40 | обмежено до 31 | 3 |

Якщо source labels показують вертикальну інверсію, додайте явну задокументовану інверсію row:

```text
InvertedRow = (Rows - 1) - Row
```

Робіть це лише тоді, коли цього вимагає atlas convention.

### Альтернативи

Надалі для анімації, якою керує renderer, перевага надається ParticleSubUV. Ручна математика лишається корисною для material-controlled preview і розуміння принципу.

### Типові помилки

MaxFrame=`Columns*Rows`, тому дозволено недійсний індекс 32. Row ділиться на Rows. Немає Floor. UV offset застосовано до масштабування комірки.

### Продуктивність

Atlas використовує один sample і помірний обсяг ALU. Основний ризик — bleeding, якість mip і змарнований порожній простір atlas. Профілюйте фінальний particle material, а не validator.
