# Рішення вправ — 03.05 Procedural shapes

## EX-L03-05-A

### Контракт

Surface/Opaque/Unlit. Parameters: `Center=(.5,.5)`, `Aspect=(1,1)`, `NormalXY=(1,0)`, `HalfWidth=.025`, `Feather=.01`, `ShowCross=1`.

### Повний перелік вузлів

UV0 `TextureCoordinate`; Center/Aspect/Normal `VectorParameter`; three RG `ComponentMask`; `Subtract Centered`; `Multiply AspectP`; `Normalize UnitNormal`; `DotProduct LineSigned`; `Abs LineDistance`; `Subtract SoftStart`; `SmoothStep LineTransition`; `OneMinus LineMask`; Normal components `ComponentMask NX/NY`; `Constant NegOne=-1`; `Multiply NegY`; `AppendVector PerpNormal`; `Normalize UnitPerp`; duplicate Dot/Abs/SmoothStep/OneMinus for PerpLine; `Max Cross`; `ScalarParameter ShowCross`; `LinearInterpolate Select`; Main Material Node.

### З'єднання

```text
UV0.Output → Centered.A
Center.RG → Centered.B
Centered.Output → AspectP.A
Aspect.RG → AspectP.B
NormalXY.RG → UnitNormal.Input
AspectP.Output → LineSigned.A
UnitNormal.Output → LineSigned.B
LineSigned.Output → LineDistance.Input
HalfWidth.Output → SoftStart.A
Feather.Output → SoftStart.B
SoftStart.Output → LineTransition.Min
HalfWidth.Output → LineTransition.Max
LineDistance.Output → LineTransition.Value
LineTransition.Output → LineMask.Input
NormalXY.G → NegY.A
NegOne.Output → NegY.B
NegY.Output → PerpNormal.A
NormalXY.R → PerpNormal.B
PerpNormal.Output → UnitPerp.Input
AspectP.Output → PerpSigned.A
UnitPerp.Output → PerpSigned.B
PerpSigned.Output → PerpDistance.Input
SoftStart.Output → PerpTransition.Min
HalfWidth.Output → PerpTransition.Max
PerpDistance.Output → PerpTransition.Value
PerpTransition.Output → PerpMask.Input
LineMask.Output → CrossMask.A
PerpMask.Output → CrossMask.B
LineMask.Output → SelectShape.A
CrossMask.Output → SelectShape.B
ShowCross.Output → SelectShape.Alpha
SelectShape.Output → MaterialOutput.Emissive Color
```

Component outputs вузла VectorParameter можуть вимагати явних вузлів ComponentMask; у фактичному графі всі aliases мають бути унікальними.

### Чому це працює / перевірка

Dot з одиничною нормаллю вимірює перпендикулярну signed distance. Перпендикуляр `(-y,x)` повертає normal на 90°. Max утворює union. Перевірте normals `(1,0)`, `(0,1)`, `(1,1)`; ширина зберігається завдяки Normalize.

### Альтернативи / помилки

Distance до скінченного segment є коректною поглибленою альтернативою, але не відповідає цьому контракту нескінченної лінії. Дві задані вручну normals простіші, проте не виконують мету побудови перпендикуляра. Відсутність Normalize змінює ширину.

### Продуктивність

Повторно використовуйте SoftStart і centered/aspect P. Не дублюйте еквівалентний Normalize, якщо parameter не може відрізнятися між гілками.

## EX-L03-05-B

### Повний контракт графа

Properties: Surface/Opaque/Unlit. Вузли:

- UV0, Center RG, Aspect RG, Centered, AspectP;
- PX/PY ComponentMasks;
- `Arctangent2Fast AngleRad` Y=PY, X=PX;
- `InvTau=.15915494`, Multiply Turns, Add `.5`, Frac Angle01;
- `Repeats=12`, Multiply ScaleAngle, Frac CellAngle;
- `CellStart=.15`, `CellEnd=.65`, `AngularFeather=.03`;
- Add StartMax, SmoothStep StartGate; Subtract EndMin, SmoothStep EndTransition, OneMinus EndGate; Multiply AngularWindow;
- Length RadiusDistance;
- `InnerRadius=.18`, `OuterRadius=.45`, `RadialFeather=.02`;
- SmoothStep InnerGate using InnerRadius-Feather → InnerRadius;
- SmoothStep OuterTransition using OuterRadius-Feather → OuterRadius; OneMinus OuterGate;
- Multiply RadialBand, Multiply FinalWheel; output Emissive.

### Ключові з'єднання

```text
PY.G → AngleRad.Y
PX.R → AngleRad.X
AngleRad.Output → Turns.A
InvTau.Output → Turns.B
Turns.Output → AngleOffset.A
Constant_0_5.Output → AngleOffset.B
AngleOffset.Output → Angle01.Input
Angle01.Output → ScaleAngle.A
Repeats.Output → ScaleAngle.B
ScaleAngle.Output → CellAngle.Input
CellStart.Output → StartGate.Min
StartMax.Output → StartGate.Max
CellAngle.Output → StartGate.Value
EndMin.Output → EndTransition.Min
CellEnd.Output → EndTransition.Max
CellAngle.Output → EndTransition.Value
EndTransition.Output → EndGate.Input
StartGate.Output → AngularWindow.A
EndGate.Output → AngularWindow.B
AspectP.Output → RadiusDistance.Input
InnerMin.Output → InnerGate.Min
InnerRadius.Output → InnerGate.Max
RadiusDistance.Output → InnerGate.Value
OuterMin.Output → OuterTransition.Min
OuterRadius.Output → OuterTransition.Max
RadiusDistance.Output → OuterTransition.Value
OuterTransition.Output → OuterGate.Input
InnerGate.Output → RadialBand.A
OuterGate.Output → RadialBand.B
AngularWindow.Output → FinalWheel.A
RadialBand.Output → FinalWheel.B
FinalWheel.Output → MaterialOutput.Emissive Color
```

Усі допоміжні з'єднання Add/Subtract відповідають названим формулам: StartMax=`CellStart+AngularFeather`; EndMin=`CellEnd-AngularFeather`; InnerMin=`InnerRadius-RadialFeather`; OuterMin=`OuterRadius-RadialFeather`.

### Перевірка

- Angle01: один angular ramp/seam.
- CellAngle: 12 повторюваних ramps.
- AngularWindow: 12 секторів.
- InnerGate: прибирає центр.
- OuterGate: прибирає зовнішню область.
- Final: 12 секторних segments у кільці.

### Альтернативи

Поверніть `Angle01` перед repetition, щоб художньо контролювати seam. Texture atlas підходить для деталізованого колеса, але має менше параметричного контролю. Якщо local Start > End, потрібен gate з урахуванням wrap.

### Типові помилки

Pins Atan2 переплутано; після множення repeats немає Frac; inner gate інвертовано; сектори надмірно тонкі; результат після aspect scaling помилково названо точним SDF.

### Продуктивність

Atan2 разом із кількома SmoothStep має відчутну вартість. Спільно використовуйте angle/radius. Для великої кількості великих particles порівняйте з texture mask на цільовому GPU; не приймайте рішення лише за кількістю вузлів.
