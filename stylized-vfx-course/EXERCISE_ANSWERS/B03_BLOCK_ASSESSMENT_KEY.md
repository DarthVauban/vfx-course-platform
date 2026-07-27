# Ключ — Block Assessment 03 Material Foundations

Цей файл відкривають лише після зафіксованого submission. Він містить критерії оцінювання, а не альтернативний tutorial.

## Частина 1 — ключ до теоретичного тесту, 20

1. Material — це Unreal asset із properties і graph; Unreal компілює його у shader programs/обчислення, які виконує GPU.
2. Vertex stage працює з vertices/attributes/deformation; pixel/fragment stage — з covered surface samples і color. Площина із чотирма vertices не підтримує high-frequency vertex deformation так, як pixel texture detail.
3. Scalar має 1 component; Vector2 — 2 (UV); Vector3 — 3 (RGB/XYZ); Vector4 — 4 (RGBA/довільні дані).
4. `0` — відсутність внеску/чорний; `.5` — половинний числовий вплив; `1` — повне нормалізоване значення; `-1` — коректний signed intermediate; `4` — HDR/intensity поза нормалізованим діапазоном.
5. Linear data пропорційні для математичних операцій; sRGB — нелінійне кодування кольору, яке декодується для використання в shader. HDR має складову color/intensity за межами стандартного `1`.
6. `(x-InMin)/(InMax-InMin)`, далі за потреби Saturate. Випадок `InMax=InMin` недійсний.
7. `A*(1-Alpha)+B*Alpha`; результат проходить через A, midpoint, B, а далі extrapolation за межі B.
8. Clamp використовує довільні Min/Max; Saturate обмежує значення до 0–1. Залишайте signed/HDR intermediates без обмеження, якщо вони потрібні подальшій математиці.
9. `.5` піднімає midvalues, `1` не змінює їх, `4` стискає midvalues у бік 0. Від'ємний Base із дробовим exponent є проблемним.
10. Floor дає 2, Ceil — 3, Frac — .75. Масштабування перетинає цілі інтервали Repeats; Frac скидає кожен із них до локального діапазону 0–1.
11. Step створює binary discontinuity; SmoothStep — плавний transition із Min<Max та Value.
12. `Distance(A,B)=Length(A-B)` для сумісних евклідових vectors.
13. Normalize усуває magnitude, тому Dot відображає alignment; нормалізований діапазон — `-1…1`.
14. Друга форма також масштабує Offset. Pivot — це точка, відносно якої відбувається transform.
15. UV прив'язані до mesh UV; world pattern семплує world positions; object-related варіант слідує логіці frame/origin об'єкта; screen залежить від projection/camera. Точні expressions потрібно називати однозначно.
16. radius=`Length(UV-Center)`; angle=`Frac(atan2(y,x)/(2π)+offset)`. На wrap виникає seam, а в центрі напрямок є singular.
17. Packing зменшує кількість samples або дає змогу використовувати їх спільно, але канали мають спільні format/resolution/mips/sRGB. Compression може створювати artifacts. Mips стабілізують minification; padding запобігає bleeding із сусідніх комірок.
18. Opaque дає повне coverage/depth; Masked — binary clip; Translucent — partial blend/sorting/overdraw; Additive додає колір і не може затемнювати, як дим.
19. PixelDepth — глибина поточного pixel; SceneDepth — глибина sampled scene; DepthFade пом'якшує перетини translucent/opaque. Він не розв'язує загальні проблеми sorting/overdraw.
20. Instance перевизначає parameters parent material; DMI — runtime instance; Function — повторно використовуваний явний graph contract; Static Switch — compile-time branch/permutation. Чотири booleans → `2⁴=16` теоретичних комбінацій.

Нарахуйте `.5` за правильну основу з одним важливим пропуском; `0` — за переплутані причину й наслідок.

## Частина 2 — еталонні практичні рішення

Еквівалентні графи є коректними, якщо збігаються properties, formulas, ranges і acceptance-критерії.

## Material A — `M_A03_ProceduralCrescent`

### Properties

- Material Domain Surface
- Blend Mode Masked
- Shading Model Unlit
- Two Sided True
- Opacity Mask Clip Value `.5`

### Parameters

| Name | Type | Default |
|---|---|---|
| `OuterCenter` | Vector | `(.5,.5,0,0)` |
| `InnerCenter` | Vector | `(.59,.5,0,0)` |
| `AspectXY` | Vector | `(1,1,0,0)` |
| `OuterRadius` | Scalar | `.34` |
| `InnerRadius` | Scalar | `.28` |
| `Feather` | Scalar | `.02` |
| `Color` | Vector | `(1.5,.04,.01,1)` |
| `Intensity` | Scalar | `2` |

### Повний перелік вузлів

UV0 `TextureCoordinate`; три Vector Parameters і RG ComponentMasks; два Subtract для centered vectors; два Multiply для aspect; два Length для distances; Outer/Inner Radius і Feather Scalars; два Subtract для soft starts; два SmoothStep для transitions; два OneMinus для circles; Subtract CrescentRaw; Saturate Crescent; Color/Intensity; два Multiply HDR/ShapeColor; MaterialOutput.

### Точні з'єднання

```text
OuterCenter.RGBA → OuterCenterRG.Input
InnerCenter.RGBA → InnerCenterRG.Input
AspectXY.RGBA → AspectRG.Input
UV0.Output → OuterP0.A
OuterCenterRG.RG → OuterP0.B
OuterP0.Output → OuterP.A
AspectRG.RG → OuterP.B
UV0.Output → InnerP0.A
InnerCenterRG.RG → InnerP0.B
InnerP0.Output → InnerP.A
AspectRG.RG → InnerP.B
OuterP.Output → OuterDistance.Input
InnerP.Output → InnerDistance.Input
OuterRadius.Output → OuterMin.A
Feather.Output → OuterMin.B
OuterMin.Output → OuterTransition.Min
OuterRadius.Output → OuterTransition.Max
OuterDistance.Output → OuterTransition.Value
OuterTransition.Output → OuterCircle.Input
InnerRadius.Output → InnerMin.A
Feather.Output → InnerMin.B
InnerMin.Output → InnerTransition.Min
InnerRadius.Output → InnerTransition.Max
InnerDistance.Output → InnerTransition.Value
InnerTransition.Output → InnerCircle.Input
OuterCircle.Output → CrescentRaw.A
InnerCircle.Output → CrescentRaw.B
CrescentRaw.Output → Crescent.Input
Color.RGB → HDRColor.A
Intensity.Output → HDRColor.B
Crescent.Output → ShapeColor.A
HDRColor.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
Crescent.Output → MaterialOutput.Opacity Mask
```

### Пояснення гілок / перевірки

Два soft circles використовують спільний aspect domain. `Saturate(Outer-Inner)` залишає область усередині outer, але поза зміщеним inner. Перевірте outer/inner distances, circles, raw difference і crescent. Root матеріалу Masked виконує clip на `.5`.

### Поширена коректна альтернатива

Використайте `Max(OuterCircle-InnerCircle,0)` замість Saturate, якщо верхня межа діапазону вже ≤1. Студент має довести діапазон.

### Продуктивність

Два Length і thresholds, без texture. Потрібно протестувати coverage/aliasing для Masked і необхідність Two Sided. Procedural-рішення не є автоматично дешевшим.

## Material B — `M_A03_TextureMotion`

### Properties

Surface / Additive / Unlit / Two Sided True.

### Parameters

`TilingXY` Vector `(1,3,0,0)`; `PanSpeedXY` Vector `(.18,0,0,0)`; `MaskPower` Scalar `3`; `Color` Vector `(.02,.2,2,1)`; `Intensity` Scalar `3`; `MaskTexture` Texture.

### Перелік вузлів / з'єднання

UV0; Tiling/PanSpeed Vector Parameters with RG masks; Multiply ScaledUV; Panner AnimatedUV; TextureSampleParameter2D Packed; Power ShapeMask; Color/Intensity; Multiply HDR/Shape; MaterialOutput.

```text
TilingXY.RGBA → TilingRG.Input
UV0.Output → ScaledUV.A
TilingRG.RG → ScaledUV.B
PanSpeedXY.RGBA → PanSpeedRG.Input
ScaledUV.Output → AnimatedUV.Coordinate
PanSpeedRG.RG → AnimatedUV.Speed
AnimatedUV.Output → Packed.UVs
Packed.R → ShapeMask.Base
MaskPower.Output → ShapeMask.Exp
Color.RGB → HDRColor.A
Intensity.Output → HDRColor.B
ShapeMask.Output → ShapeColor.A
HDRColor.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
ShapeMask.Output → MaterialOutput.Opacity
```

Packed texture містить числові masks: sRGB Off. Точний UI для Panner/Opacity: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Перевірки

ScaledUV → AnimatedUV → R → Power → ShapeColor. Три фони, фіксована exposure. Напрямок Panner зафіксовано. Data source/mips/compression записано.

### Продуктивність

Один texture sample і проста ALU; великий overlap Additive є основним імовірним ризиком. Two Sided використовується лише тоді, коли цього вимагає station.

## Material C — `M_A03_DepthAware`

### Properties

Surface / Translucent / Unlit / Two Sided True.

### Parameters

Texture; `Color=(2,.12,.01,1)`; `Intensity=2`; `OpacityScale=.75`; `FadeDistance=40`.

### Перелік вузлів / з'єднання

UV0; TextureSampleParameter2D Packed; Color/Intensity; Multiply HDR/ShapeColor; OpacityScale; Multiply BaseOpacity; DepthFade IntersectionFade; MaterialOutput.

```text
UV0.Output → Packed.UVs
Packed.G → ShapeColor.A
Color.RGB → HDRColor.A
Intensity.Output → HDRColor.B
HDRColor.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
Packed.G → BaseOpacity.A
OpacityScale.Output → BaseOpacity.B
BaseOpacity.Output → IntersectionFade.Opacity
FadeDistance.Output → IntersectionFade.FadeDistance
IntersectionFade.Output → MaterialOutput.Opacity
```

### Перевірки

Перевірте Raw G, BaseOpacity, DepthFade і final. Використайте ті самі card/cube за distances 10/40/100. Далеко від intersection opacity наближається до base. Дві translucent cards усе ще можуть сортуватися неправильно.

### Продуктивність

Один sample + depth-aware opacity в умовах Translucent overdraw. Fade покращує intersection, але не загальну вартість або order.

## Критерії оцінювання практичної частини

### Відповідність brief / функціональність, 15

- 15: усі properties/defaults/behaviors вимірювані та правильні.
- 12: один незначний пропуск default або доказу.
- 9: усі три матеріали наявні, але один має functional mismatch.
- 6: працюють два матеріали або повторюється серйозна невідповідність.
- 0–5: робота неповна або нефункціональна.

### Візуальна якість / читабельність, 15

- 15: silhouettes/motion/intersection чіткі в усіх заданих тестах.
- 12: результат чіткий, але один edge/background слабкий.
- 9: читається лише у сприятливому ракурсі.
- 6: нестабільний або неоднозначний результат.
- 0–5: результат непридатний.

### Технічна коректність, 15

- 15: точні контракти, коректні ranges/settings, немає orphan-вузлів.
- 12: незначна проблема з naming або manual check.
- 9: виправна проблема з math/property.
- 6: повторювані помилки range/root.
- 0–5: помилка compile або logic.

### Самостійне перенесення знань, 15

- 15: чиста оригінальна реалізація, alternatives/trade-offs пояснено.
- 12: самостійна робота з обмеженим розглядом альтернатив.
- 9: значна залежність від hints, але принцип зрозумілий.
- 6: механічно відтворена або схожа на копіювання робота.
- 0–5: заборонене копіювання.

## Частина 3 — ключ до troubleshooting/performance

### Root cause, 4

Для повного бала потрібні:

- точні expected/actual;
- відтворення зі зміною однієї variable;
- intermediate captures для source/UV/channel/Power;
- перший failing stage;
- мінімальна корекція setting/channel;
- regression-перевірка.

Якщо використано дефект sRGB: неправильне нелінійне decoding змінює midtones числової mask. Якщо використано неправильний channel: першим failing stage є raw sampled channel, а не Panner чи Power.

### Вимірювання, 4

У таблиці потрібно зафіксувати:

| Поле | Обов'язково |
|---|---|
| build/platform/feature level | точні значення |
| resolution/quality/camera | фіксовані |
| 1/8/32 cards | усі варіанти |
| normal + diagnostic view | обидва |
| screen coverage | порівнюваний |
| observation | без вигаданих значень часу |

### Оптимізація, 2

Повний бал нараховується лише за before/after і опис trade-off. Приклад: зменшити geometry card або particle size до зайнятої mask області, знижуючи overlap зі збереженням silhouette; або вилучити Two Sided після доказу, що backface не використовується.

## Частина 4 — ключ до self-review/documentation

- 4: пріоритети підкріплені доказами, а не загальною похвалою.
- 3: точні naming/folders і parameter hygiene.
- 3: відтворювані контракти, офіційні sources, manual verification/build.

## Підсумкове рішення

```text
Тест: __ /20   мінімум 12
Практика: __ /60   мінімум 36
Troubleshooting/performance: __ /10   мінімум 6
Self-review/docs: __ /10   мінімум 6
Усього: __ /100   мінімум 80
Критичний провал: Так / Ні
G03: PASS / RETAKE
```
