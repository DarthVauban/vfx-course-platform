# Рішення — 03.09 Material Foundations Control Project

Відкривайте після першої самостійної спроби. Точні pins/settings із позначкою manual слід перевірити в UE 5.8.x.

## EX-L03-09-A

### A — `M_CP03_ProceduralRing`

#### Properties

Surface / Masked / Unlit / Two Sided True / Opacity Mask Clip Value `.5`.

#### Перелік вузлів

UV0; Center VectorParameter + RG mask; Aspect VectorParameter + RG mask; Subtract Centered; Multiply ShapeP; Length RadiusDistance; Scalar Radius; Subtract SignedRing; Abs RingDistance; Scalar HalfWidth/Feather; Subtract SoftStart; SmoothStep Transition; OneMinus RingMask; Vector Color; Scalar Intensity; Multiply HDR/ShapeColor; MaterialOutput.

#### З'єднання

```text
Center.RGBA → CenterRG.Input
UV0.Output → Centered.A
CenterRG.RG → Centered.B
Aspect.RGBA → AspectRG.Input
Centered.Output → ShapeP.A
AspectRG.RG → ShapeP.B
ShapeP.Output → RadiusDistance.Input
RadiusDistance.Output → SignedRing.A
Radius.Output → SignedRing.B
SignedRing.Output → RingDistance.Input
HalfWidth.Output → SoftStart.A
Feather.Output → SoftStart.B
SoftStart.Output → Transition.Min
HalfWidth.Output → Transition.Max
RingDistance.Output → Transition.Value
Transition.Output → RingMask.Input
Color.RGB → HDR.A
Intensity.Output → HDR.B
RingMask.Output → ShapeColor.A
HDR.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
RingMask.Output → MaterialOutput.Opacity Mask
```

#### Перевірка

Center у RingDistance чорний лише на точному radius? Насправді в центрі RingDistance=`Radius`; центральна лінія кільця стає білою після mask. Перевірте кожен проміжний output. Протестуйте aspect `(1,1)` і виміряну корекцію. Mask clip робить фінальний край binary попри soft source.

### B — `M_CP03_AnimatedTexture`

#### Properties

Surface / Additive / Unlit / Two Sided True.

#### Перелік вузлів

UV0; Tiling VectorParameter/RG; Multiply ScaledUV; PanSpeed VectorParameter/RG; Panner PannedUV; TextureSampleParameter2D Packed; Scalar Power; Power ShapedMask; Vector Color; Scalar Intensity; Multiply HDR/ShapeColor; MaterialOutput.

#### З'єднання

```text
Tiling.RGBA → TilingRG.Input
UV0.Output → ScaledUV.A
TilingRG.RG → ScaledUV.B
PanSpeed.RGBA → PanSpeedRG.Input
ScaledUV.Output → PannedUV.Coordinate
PanSpeedRG.RG → PannedUV.Speed
PannedUV.Output → Packed.UVs
Packed.B → ShapedMask.Base
PowerValue.Output → ShapedMask.Exp
Color.RGB → HDR.A
Intensity.Output → HDR.B
ShapedMask.Output → ShapeColor.A
HDR.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
ShapedMask.Output → MaterialOutput.Opacity
```

Pin `Panner.Speed` і вплив Additive Opacity: **Потребує ручної перевірки в Unreal Engine 5.8.** Source texture містить числові дані: sRGB Off.

#### Перевірка

Перевірте ланцюжок UV→Panned→B→Power. Протестуйте на чорному/сірому/білому фонах. Зафіксуйте напрямок додатної speed. Power Base — нормалізована невід'ємна mask.

### C — `M_CP03_DepthCard`

#### Properties

Surface / Translucent / Unlit / Two Sided True.

#### Перелік вузлів / з'єднання

UV0; TextureSampleParameter2D Packed; Vector Color; Scalar Intensity; Multiply HDR/ShapeColor; Scalar FadeDistance; DepthFade IntersectionFade; Scalar OpacityScale; Multiply BaseOpacity; MaterialOutput.

```text
UV0.Output → Packed.UVs
Color.RGB → HDR.A
Intensity.Output → HDR.B
Packed.G → ShapeColor.A
HDR.Output → ShapeColor.B
ShapeColor.Output → MaterialOutput.Emissive Color
Packed.G → BaseOpacity.A
OpacityScale.Output → BaseOpacity.B
BaseOpacity.Output → IntersectionFade.Opacity
FadeDistance.Output → IntersectionFade.FadeDistance
IntersectionFade.Output → MaterialOutput.Opacity
```

#### Перевірка

Далеко від opaque cube opacity ≈ base. Біля intersection з'являється fade. Зробіть captures для FadeDistance 5/25/100 за однакового scale. Overlapping translucent card і далі демонструє обмеження sorting/overdraw.

### Альтернативні коректні підходи

- A: `Distance(UV,Center)` замість Subtract+Length є коректним, але для correction потрібен явний centered/aspect path.
- B: ручний UV offset `UV + Time*Speed` є коректним; за specification потрібен Panner.
- C: еквівалентне задокументоване налаштування DepthFade є коректним; припущена формула SceneDepth без ручної перевірки не приймається.

### Типові помилки

- A: немає OneMinus; використано неправильний root Opacity.
- B: sRGB On, channel G/R замість B, Power застосовано до HDR color.
- C: output DepthFade подано в Emissive, base mask пропущено.

### Продуктивність

A: можливі ALU + Masked alias. B/C: імовірно домінує translucent/additive overdraw; B має один sample, C — один sample + depth fade. Вимірюйте за фіксованого screen coverage.

## EX-L03-09-B

### Дефект A

**Симптом:** ellipse або інвертований фон.  
**Ізоляція:** Centered → ShapeP → RadiusDistance → RingDistance → RingMask.  
**Виправлення:** aspect перед Length; Transition, потім OneMinus; RingMask у Opacity Mask.

### Дефект B

**Симптом:** неправильні midtones/pattern.  
**Ізоляція:** Texture Editor sRGB/channel → sample B → Power.  
**Виправлення:** для data semantic задати sRGB Off; під'єднати B; зберігати Base нормалізованим.

### Дефект C

**Симптом:** hard intersection або fade кольору замість opacity.  
**Ізоляція:** base G → DepthFade output → root.  
**Виправлення:** base opacity подати в DepthFade Opacity; результат — у Material Opacity; emissive branch лишається окремою.

### Коректні варіації без switches

- A instance: Radius `.4`, HalfWidth `.025`, Color — синій HDR, та сама architecture.
- B instance: Tiling `(1,4)`, Speed `(.2,0)`, Power `4`, менший screen coverage.
- C instance: FadeDistance `60`, OpacityScale `.6`, теплий колір диму.

### Перевірка

Для кожного duplicate заповніть:

| Поле | Обов'язковий запис |
|---|---|
| Expected | visual/data contract |
| Actual | точний симптом |
| First failing intermediate | alias |
| Root cause | connection/property/data |
| Minimal fix | одна контрольована зміна |
| Regression | повторний запуск початкової acceptance-перевірки |

### Альтернативні підходи

Інший навмисно внесений дефект є коректним, якщо відповідає одній вивченій концепції, а діагностика використовує intermediate outputs. Кілька випадкових одночасних дефектів не підходять, бо ізоляція причини стає неоднозначною.

### Обґрунтування продуктивності й читабельності

Variation — це не лише recolor, якщо вона змінює radius/width/motion/fade behavior. Водночас architecture лишається стабільною. Запишіть, чи збільшує ширше coverage або м'якша opacity overdraw і чи створюють тонші краї aliasing.
