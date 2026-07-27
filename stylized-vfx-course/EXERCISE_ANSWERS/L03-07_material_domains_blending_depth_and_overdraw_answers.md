# Рішення вправ — 03.07 Domains, depth і overdraw

## EX-L03-07-A

### Спільний контракт source

Використайте одну texture/sample або procedural ring. Обидва матеріали: Surface/Unlit/Two Sided True. Спільні aliases: UV0, MaskSource, Color, Intensity, HDRColor, ShapeColor.

### Граф Masked

Properties: Blend Mode Masked, Opacity Mask Clip Value `.5`.

```text
UV0.Output → MaskSource.UVs
Color.RGB → HDRColor.A
Intensity.Output → HDRColor.B
MaskSource.G → ShapeColor.A
HDRColor.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
MaskSource.G → MaterialOutput.Opacity Mask
```

### Граф Translucent

Properties: Blend Mode Translucent.

```text
UV0.Output → MaskSource.UVs
Color.RGB → HDRColor.A
Intensity.Output → HDRColor.B
MaskSource.G → ShapeColor.A
HDRColor.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
MaskSource.G → MaterialOutput.Opacity
```

### Обґрунтування рішення

- Чіткий slash із контрольованим silhouette і малою кількістю overlapping soft layers: Masked може бути кращим, якщо пройдено motion test.
- Дим/м'яка хмара, для яких безперервний falloff є критичним: Translucent зі строгим контролем coverage/count/overdraw.
- Жодне рішення не є універсальним; надайте докази для 3 розмірів × 3 фонів.

### Перевірка

Зберігайте однаковими plane/camera/exposure. Зробіть captures normal view і Shader Complexity. Перемістіть або зменште до subpixel. Додайте другу overlapping plane. Зафіксуйте стабільність краю та sort.

### Альтернативи

Additive для світної енергії є коректним третім варіантом порівняння, але не може передати дим, що затемнює. Можуть існувати режими на кшталт AlphaComposite; їхня точна поведінка: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Типові помилки

Різні source masks; різна intensity; зміна камери; твердження, що Masked не має вартості; sorting priority як єдиний спосіб виправлення.

### Продуктивність

Masked часто інакше відкидає pixels/depth; overdraw у Translucent накопичується. Вимірюйте screen coverage і shader complexity, а не лише кількість вузлів матеріалу.

## EX-L03-07-B

### Контракт

`M_EX_L03_07_DepthAware`: Surface/Translucent/Unlit/Two Sided True.

### Перелік вузлів

UV0; TextureSampleParameter2D Mask; VectorParameter Color `(1,.05,.01,1)`; Scalar Intensity `3`; Multiply HDR/ShapeColor; Scalar FadeDistance `25`; DepthFade Fade; Scalar ShowFadeDebug `1`; LinearInterpolate DebugOpacity; MaterialOutput.

### З'єднання

```text
UV0.Output → Mask.UVs
Color.RGB → HDR.A
Intensity.Output → HDR.B
Mask.G → ShapeColor.A
HDR.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
Mask.G → Fade.Opacity
FadeDistance.Output → Fade.FadeDistance
Mask.G → DebugOpacity.A
Fade.Output → DebugOpacity.B
ShowFadeDebug.Output → DebugOpacity.Alpha
DebugOpacity.Output → MaterialOutput.Opacity
```

### Чому це працює / перевірка

За `ShowFadeDebug=0` базова mask підтверджує source. За `1` fade наближається до нуля біля opaque intersection. Перевірте distance `5/25/100` за однакового scale cube/card. Далеко від перетину faded output має наближатися до base opacity.

### Діагностична альтернатива SceneDepth/PixelDepth

Окремий діагностичний material може виводити remapped `SceneDepth-PixelDepth`, але точні SceneDepth UV/units/support: **Потребує ручної перевірки в Unreal Engine 5.8.** Не замінюйте перевірений DepthFade припущеною формулою.

### Типові помилки

DepthFade → Emissive; source mask вилучено з opacity; перевірка лише на іншій translucent surface; одночасна зміна scale і FadeDistance.

### Продуктивність

DepthFade додає обчислення й усе одно використовує translucency. Дві cards усе ще можуть неправильно сортуватися та створювати overdraw. Зробіть capture однакового ракурсу з ефектом і без нього; рішення приймайте за візуальною потребою та результатом profile.
