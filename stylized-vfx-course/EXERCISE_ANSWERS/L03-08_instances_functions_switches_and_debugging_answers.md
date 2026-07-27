# Рішення вправ — 03.08 Reusable architecture

## EX-L03-08-A

### Обґрунтування

Soft threshold виконує одну відповідальність. Outputs normal та inverted не вимагають непевного workflow зі static bool FunctionInput; caller може зробити явний вибір. Це зберігає прозорий контракт функції та уникає прихованої permutation.

### Контракт функції

`MF_EX_L03_08_SoftThreshold`

Inputs: Value Scalar `.5`; Threshold Scalar `.5`; Feather Scalar `.05`, має бути `>0`. Outputs: `Normal01`, `Inverted01`.

### Перелік вузлів / з'єднання

Вузли: три FunctionInputs; Subtract MinEdge; Add MaxEdge; SmoothStep Normal; OneMinus Inverted; два FunctionOutputs.

```text
Threshold.Output → MinEdge.A
Feather.Output → MinEdge.B
Threshold.Output → MaxEdge.A
Feather.Output → MaxEdge.B
MinEdge.Output → Normal.Min
MaxEdge.Output → Normal.Max
Value.Output → Normal.Value
Normal.Output → Inverted.Input
Normal.Output → Normal01.A
Inverted.Output → Inverted01.A
```

### Тести

Threshold `.5`, Feather `.1`:

| Value | Очікуваний Normal |
|---:|---:|
| `.3` | 0 |
| `.4` | початок transition ≈0 |
| `.5` | midpoint близько .5 |
| `.6` | кінець transition ≈1 |
| `.8` | 1 |

Точну рівність на межі та precision спостерігайте в UE, а не визначайте зі screenshot.

### Матеріал-викликач

Тестовий material Surface/Opaque/Unlit: ScalarParameter TestValue → function Value; вибраний output → Emissive. Parameters Threshold/Feather передаються напряму.

### Альтернативи

Перевірений input Static Bool у функції може вибирати output, але залежно від використання створює structural variant. Runtime `Lerp(Normal,Inverted,InvertScalar)` є коректним для дешевих гілок.

### Типові помилки

Feather 0; Min/Max переплутані; OneMinus стоїть до SmoothStep; threshold приховано як constant.

### Продуктивність

Функція легка. Повторне використання усуває дублювання під час maintenance, але не гарантує зменшення кількості instructions.

## EX-L03-08-B

### Контракт parent material

`M_EX_L03_08_MasterFamily`, Surface/Translucent/Unlit/Two Sided True.

Sources:

- texture R через UV/Tiling;
- procedural circle через Distance/SmoothStep/OneMinus.

Switches:

- `UseTexture` True вибирає texture R;
- `InvertMask` True вибирає OneMinus.

Runtime parameters:

- `Color`, `Intensity`, `OpacityScale`, `TilingXY`, `Radius`, `Feather`.

### Основні з'єднання

```text
TextureMask.R → UseTexture.A
CircleMask.Output → UseTexture.B
UseTexture.Output → Inverted.Input
Inverted.Output → InvertMask.A
UseTexture.Output → InvertMask.B
Color.RGB → HDR.A
Intensity.Output → HDR.B
InvertMask.Output → ShapeColor.A
HDR.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
InvertMask.Output → FinalOpacity.A
OpacityScale.Output → FinalOpacity.B
FinalOpacity.Output → MaterialOutput.Opacity
```

З'єднання source branches точно відповідають урокам 03.04–03.06 і мають бути наведені в submission; готова функція не потрібна, крім перевірених helpers, створених студентом.

### Чотири instances

| Instance | UseTexture | InvertMask | Обґрунтування збереження |
|---|---:|---:|---|
| `MI_..._Texture` | T | F | імовірно core |
| `MI_..._TextureInv` | T | T | залишити лише за фактичного використання |
| `MI_..._Circle` | F | F | імовірно debug/procedural |
| `MI_..._CircleInv` | F | T | вилучити, якщо не використовується в проєкті |

Теоретична кількість комбінацій — `2²=4`. Не називайте це точною загальною кількістю скомпільованих shaders.

### Альтернатива з Lerp

Runtime scalar selectors уникають множення static variants, але обидві source branches можуть впливати на результат або обчислюватися. Обирайте на основі вартості гілок, runtime-потреби, compile pressure і вимірювань.

### Перевірка

Виконайте compile/apply/save для parent. Відкрийте кожен MIC і перевірте checkboxes. Зробіть capture для raw source, selected, inverted, opacity і final. Порівняйте Shader Complexity за однакових card/camera та запишіть platform/quality.

### Типові помилки

Третій debug switch; назви instances не кодують комбінацію; parent редагується між порівняннями; static parameter описано як безперервно анімований.

### Продуктивність

Вилучіть невикористані variants/controls із production family. Тримайте debug material окремо, якщо він роздуває parent. Профілюйте фактичний instance variant і overdraw.
