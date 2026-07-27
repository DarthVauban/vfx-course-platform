# 03.05 — Gradients, polar coordinates і SDF-подібні форми

## 1. Назва

**Gradients, polar coordinates і SDF-подібні форми: circle, ring, line, arc, sector та repetition.**

## 2. Результат уроку

Після уроку ви:

- будуєте horizontal, vertical, radial і directional gradients;
- створюєте circle, ring і line з distance-like values;
- переводите centered Cartesian UV у normalized polar angle;
- формуєте arc і sector masks;
- повторюєте pattern навколо center через `Frac`;
- коригуєте aspect ratio;
- розрізняєте true signed distance field і «SDF-подібну» mask math;
- створюєте `M_L03_05_ShapeLab`.

## 3. Орієнтовний час

**8 годин: 2 години теорії / 6 годин практики.**

- 40 хв — gradients і centered UV;
- 40 хв — distance-like shapes;
- 40 хв — polar angle/repetition;
- 90 хв — experiments;
- 180 хв — guided graph;
- 110 хв — exercises/review.

## 4. Prerequisites

- 03.01–03.04;
- Distance/Length/Dot/Normalize;
- SmoothStep, Frac, UV transform.

## 5. Нові терміни

- **Cartesian coordinates** — X/Y або centered U/V.
- **Polar coordinates** — radius і angle.
- **Radial gradient** — value змінюється з distance до center.
- **SDF** — signed distance to boundary; negative/positive sign distinguishes sides за convention.
- **SDF-like mask** — distance-inspired graph, який може втратити true distance properties після non-uniform transforms/shaping.
- **Ring** — band навколо target radius.
- **Line distance** — perpendicular distance до infinite line.
- **Arc** — частина ring у angular interval.
- **Sector** — angular wedge, зазвичай із radial extent.
- **Aspect correction** — compensation, щоб normalized UV shape не розтягувалась.
- **Tau** — `2π`, full turn у radians.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Procedural shapes дають art-directable telegraphs, rings, shockwaves, beams і magic-circle elements без окремої texture для кожної width/angle. Навіть коли фінальний effect texture-driven, procedural masks керують erosion, edge, timing і variation.

## 7. Теорія простими словами

Початок більшості 2D shapes:

```text
p = UV - Center
```

Distance-like value для circle:

```text
d = length(p)
circle = 1 - smoothstep(Radius-Feather, Radius, d)
```

Для ring:

```text
ringDistance = abs(length(p) - Radius)
ring = 1 - smoothstep(HalfWidth-Feather, HalfWidth, ringDistance)
```

Для line:

```text
lineDistance = abs(dot(p, NormalizedLineNormal))
line = 1 - smoothstep(HalfWidth-Feather, HalfWidth, lineDistance)
```

Polar angle:

```text
angleRadians = atan2(p.y, p.x)
angle01 = frac(angleRadians / (2π) + 0.5)
```

## 8. Детальні технічні пояснення

### Gradients

- `U` — горизонтальний gradient.
- `V` — вертикальний gradient.
- `Length(centeredUV)` — radial gradient.
- normalized Dot — directional або angular gradient.

Gradient — control signal. Він не обов’язково visible color.

### Correction aspect

Normalized UV assumes square domain. Для rectangular plane/screen radial shape stretches. Multiply one centered axis by aspect:

```text
aspectP = centeredUV * float2(AspectX, AspectY)
```

Вибір factor залежить від domain/mesh dimensions. Не hardcode-іть screen aspect у reusable mesh material без contract.

### Circle і ring як distance-inspired masks

`Length(p)-Radius` є signed circle distance в ideal 2D domain; `Abs` робить distance до ring centerline. Після arbitrary non-uniform scaling це може перестати бути exact Euclidean SDF, тому курс називає результати SDF-подібними, якщо guarantees не доведені.

### Line

Dot centered point із unit normal дає signed perpendicular projection. `Abs` прибирає side. Якщо normal не normalized, width масштабується.

### Polar angle

`Arctangent2Fast`/`Arctangent2` повертає angle з X/Y quadrant information. Fast variant може мати precision trade-off. Точна доступність вузла й pins: **Потребує ручної перевірки в Unreal Engine 5.8.**

Normalize radians у turn fraction через `1/(2π) ≈ 0.15915494`. `Frac` прибирає negative wrap.

### Arc і wrap seam

Simple `Start < Angle < End` працює, якщо interval не перетинає seam 0/1. Arc від `.85` до `.15` потребує wrap-aware union двох intervals або rotated angle. У guided graph interval `.1–.35`, щоб спочатку ізолювати logic.

### Repeating polar pattern

```text
cellAngle = frac(angle01 * Repeats)
```

Це repeats angular cell, але center singularity і thin wedges можуть alias-итися.

## 9. Візуальні або математичні приклади

У centered point `p=(0.3,0.4)`:

```text
length(p)=sqrt(0.3²+0.4²)=0.5
```

Для ring із Radius `.4` distance до centerline:

```text
abs(0.5-0.4)=0.1
```

Line з unit normal `(1,0)`:

```text
abs(dot((0.3,0.4),(1,0)))=0.3
```

Composition shapes для normalized masks:

- soft composition на кшталт intersection: `Multiply` або `Min`;
- composition на кшталт union: `Max`;
- composition на кшталт subtraction: `Saturate(A-B)`.

Це mask operations, а не автоматично exact boolean operations SDF.

## 10. Controlled experiments

1. **Gradient board:** U, V, radial Length і directional Dot.
2. **Circle/ring:** змінюйте Radius, Width і Feather незалежно.
3. **Line normal:** перевірте `(1,0)`, `(0,1)` і normalized `(1,1)`.
4. **Aspect:** на plane scale 2:1 порівняйте Aspect `(1,1)` і corrected factor, виміряний для setup.
5. **Polar:** preview angle до і після normalization або Frac; знайдіть seam.
6. **Repetition:** `Repeats=1,4,8,32`; рухайте camera і занотуйте aliasing.

## 11. Покрокова керована практика

### Graph — `M_L03_05_ShapeLab`

#### Material properties

- Surface / Opaque / Unlit
- Two Sided `False`

#### Повний inventory nodes

| Alias | Node | Default |
|---|---|---|
| `UV0` | `TextureCoordinate` | 0 |
| `Center` | `VectorParameter` | `(.5,.5,0,0)` |
| `CenterRG` | `ComponentMask` | RG |
| `CenteredUV` | `Subtract` | — |
| `AspectXY` | `VectorParameter` | `(1,1,0,0)` |
| `AspectRG` | `ComponentMask` | RG |
| `ShapeP` | `Multiply` | — |
| `RadiusDistance` | `Length` | — |
| `Radius` | `ScalarParameter` | `.32` |
| `RingDistanceSigned` | `Subtract` | — |
| `RingDistance` | `Abs` | — |
| `HalfWidth` | `ScalarParameter` | `.045` |
| `Feather` | `ScalarParameter` | `.012` |
| `RingSoftStart` | `Subtract` | — |
| `RingTransition` | `SmoothStep` | — |
| `RingMask` | `OneMinus` | — |
| `PX` | `ComponentMask` | R |
| `PY` | `ComponentMask` | G |
| `PolarAngleRad` | `Arctangent2Fast` | — |
| `InvTau` | `Constant` | `.15915494` |
| `AngleTurns` | `Multiply` | — |
| `AngleOffset` | `Add` | B constant `.5` |
| `Angle01` | `Frac` | — |
| `ArcStart` | `ScalarParameter` | `.10` |
| `ArcEnd` | `ScalarParameter` | `.35` |
| `AngularFeather` | `ScalarParameter` | `.015` |
| `ArcStartMax` | `Add` | — |
| `StartGate` | `SmoothStep` | — |
| `ArcEndMin` | `Subtract` | — |
| `EndTransition` | `SmoothStep` | — |
| `EndGate` | `OneMinus` | — |
| `AngularWindow` | `Multiply` | — |
| `ArcRing` | `Multiply` | — |
| `ShowArc` | `ScalarParameter` | `0` |
| `SelectShape` | `LinearInterpolate` | — |
| `Color` | `VectorParameter` | `(2,.05,.01,1)` |
| `Colorize` | `Multiply` | — |
| `MaterialOutput` | Main Material Node | — |

#### Точний список connections

```text
Center.RGBA → CenterRG.Input
UV0.Output → CenteredUV.A
CenterRG.RG → CenteredUV.B
AspectXY.RGBA → AspectRG.Input
CenteredUV.Output → ShapeP.A
AspectRG.RG → ShapeP.B
ShapeP.Output → RadiusDistance.Input
RadiusDistance.Output → RingDistanceSigned.A
Radius.Output → RingDistanceSigned.B
RingDistanceSigned.Output → RingDistance.Input
HalfWidth.Output → RingSoftStart.A
Feather.Output → RingSoftStart.B
RingSoftStart.Output → RingTransition.Min
HalfWidth.Output → RingTransition.Max
RingDistance.Output → RingTransition.Value
RingTransition.Output → RingMask.Input
ShapeP.Output → PX.Input
ShapeP.Output → PY.Input
PY.G → PolarAngleRad.Y
PX.R → PolarAngleRad.X
PolarAngleRad.Output → AngleTurns.A
InvTau.Output → AngleTurns.B
AngleTurns.Output → AngleOffset.A
Constant_0_5.Output → AngleOffset.B
AngleOffset.Output → Angle01.Input
ArcStart.Output → ArcStartMax.A
AngularFeather.Output → ArcStartMax.B
ArcStart.Output → StartGate.Min
ArcStartMax.Output → StartGate.Max
Angle01.Output → StartGate.Value
ArcEnd.Output → ArcEndMin.A
AngularFeather.Output → ArcEndMin.B
ArcEndMin.Output → EndTransition.Min
ArcEnd.Output → EndTransition.Max
Angle01.Output → EndTransition.Value
EndTransition.Output → EndGate.Input
StartGate.Output → AngularWindow.A
EndGate.Output → AngularWindow.B
RingMask.Output → ArcRing.A
AngularWindow.Output → ArcRing.B
RingMask.Output → SelectShape.A
ArcRing.Output → SelectShape.B
ShowArc.Output → SelectShape.Alpha
SelectShape.Output → Colorize.A
Color.RGB → Colorize.B
Colorize.Output → MaterialOutput.Emissive Color
```

`Constant_0_5` — це node `Constant` зі value `.5`; він має бути у graph та inventory, навіть якщо вище його наведено inline.

**Manual check:** точні node name `Arctangent2Fast`, pins `Y/X`, input label `Length` і pins `SmoothStep` у UE 5.8.

#### Пояснення branches

1. Center і aspect створюють stable domain shape.
2. Length → Abs(distance-radius) створює distance до centerline ring.
3. SmoothStep + OneMinus створюють feathered band.
4. Atan2 перетворює XY на angle; InvTau + offset + Frac виконують normalization.
5. StartGate і inverted EndGate form non-wrapping angular window.
6. Ring × angular window = arc.
7. ShowArc порівнює full ring і arc.

#### Проміжні перевірки

`CenteredUV`, `ShapeP`, `RadiusDistance`, `RingDistance`, `RingMask`, `PolarAngleRad`, `Angle01`, `StartGate`, `EndGate`, `AngularWindow`, `ArcRing`.

## 12. Точні назви вузлів, модулів і налаштувань UE

- `Length`, `Distance`, `DotProduct`, `Normalize`
- `Arctangent2Fast` (or current documented equivalent)
- `Abs`, `SmoothStep`, `OneMinus`, `Frac`
- `Min`, `Max`, `Multiply`, `Subtract`
- `TextureCoordinate`, `ComponentMask`

Exact atan2 variant/pins: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Parameter | Default | Contract |
|---|---:|---|
| `Center` | `(.5,.5,0,0)` | RG only |
| `AspectXY` | `(1,1,0,0)` | positive |
| `Radius` | `.32` | `>0` |
| `HalfWidth` | `.045` | `>Feather` |
| `Feather` | `.012` | `>0` |
| `ArcStart` | `.10` | no seam crossing in guided graph |
| `ArcEnd` | `.35` | `>ArcStart` |
| `AngularFeather` | `.015` | smaller than arc span |
| `ShowArc` | `0` | `0/1` |

## 14. Очікуваний результат кожного етапу

- centered/aspect domain перевірено у debug;
- full ring має stable width;
- polar gradient завершує один turn з одним seam;
- angular window видимий лише в `.10–.35`;
- arc є ring, обмеженим window;
- parameters не потребують rewiring;
- список connections не має orphan nodes.

## 15. Самостійна вправа

### EX-L03-05-A — Parameterized line and cross

Створіть `M_EX_L03_05_LineCross`: centered/aspect UV, line distance через `Abs(Dot(p,normalized normal))`, feathered line. Побудуйте другу perpendicular line і об’єднайте через `Max`. Parameters: NormalXY `(1,0)`, HalfWidth `.025`, Feather `.01`, ShowCross `1`.

**Обмеження:** виконайте normalize normal; perpendicular normal зберіть як `(-Y,X)` через Multiply `-1` і AppendVector; надайте повний inventory і connections.

**Матеріали до здачі:** debug line, perpendicular line і cross; test aspect; пояснення unit normal.

**Критерії приймання:** width стабільна під час зміни normal direction; cross centered; texture відсутня.

## 16. Додаткова складніша вправа

### EX-L03-05-B — Repeating polar sector wheel

Створіть 12 angular cells: centered/aspect UV → atan2 → normalized angle → `*12 → Frac`. Усередині кожної cell створіть soft wedge для local angle `.15–.65`. Помножте на radial band `.18–.45`.

**Обмеження:** без prebuilt polar function; задокументуйте seam; parameters `Repeats`, `CellStart`, `CellEnd`, `InnerRadius`, `OuterRadius` і feathers.

**Матеріали до здачі:** angle01, cellAngle, angular gate, radial gate і final; check aliasing у static та moving cases.

**Критерії приймання:** 12 readable wedges, finite radial band, soft edges і manual verification atan2.

## 17. Три рівні підказок

### EX-L03-05-A

- **Hint 1:** line distance — це projection на її normal, а не direction уздовж line.
- **Hint 2:** `Normalize(NormalRG) → Dot(CenteredP,UnitNormal) → Abs → SmoothStep → OneMinus`.
- **Hint 3:** perpendicular normal `(-N.y,N.x)`; побудуйте другу identical branch; об’єднайте line masks через Max; виконайте Lerp першої line і cross за ShowCross.

[Рішення A](../EXERCISE_ANSWERS/L03-05_procedural_shapes_polar_and_sdf_masks_answers.md#ex-l03-05-a)

### EX-L03-05-B

- **Hint 1:** angular repetition — це `Frac(angle01*Repeats)`.
- **Hint 2:** два SmoothSteps створюють start gate і inverted end gate; radial band використовує два radial gates.
- **Hint 3:** `AngularWindow × InnerGate × OuterGate`; перевірте pins Y/X atan2 і відсутність wrap усередині local cell.

[Рішення B](../EXERCISE_ANSWERS/L03-05_procedural_shapes_polar_and_sdf_masks_answers.md#ex-l03-05-b)

## 18. Типові помилки

- UV centering відсутній.
- Aspect correction виконано після Length.
- Line normal не normalized.
- Використано line direction замість line normal.
- Ring distance не пропущено через Abs.
- SmoothStep не inverted.
- X/Y atan2 переплутано.
- Забуто factor radians-to-turn.
- Arc перетинає seam, але використовує simple interval.
- Shaped mask названо exact SDF без доказу.
- Надмірні repeats спричиняють aliasing.

## 19. Troubleshooting

| Симптом | Причина | Виправлення |
|---|---|---|
| Circle став ellipse | mismatch aspect або domain | виправ centered coordinates до Length |
| Width ring змінюється | non-uniform scale domain | задокументуй approximate SDF; виправ aspect |
| Arc у неправильному quadrant | pins або order atan2 | перевір angle у debug; виконай manual check pins |
| Gap на seam | wrap angle | поверни angle або об’єднай wrap intervals |
| Width line змінюється з NormalXY | normal не unit | виконай Normalize один раз |
| Wheel flickers | wedges менші за pixel | зменш repeats або збільш feather відповідно до profile |

## 20. Performance considerations

- Procedural atan2 може бути дорожчим за simple arithmetic; Fast variant обмінює precision на speed.
- Avoid recomputing centered UV, Length або angle for every branch.
- Тонкі rings або sectors створюють problems aliasing і overdraw незалежно від ALU count.
- Невелика texture може бути кращою для complex art; procedural math виграє, коли це виправдовують parameterization і reuse.
- Вимірюйте у representative material і scene, а не лише за node count.

## 21. Запитання для самоперевірки

1. Яка formula circle mask?
2. Навіщо Abs для ring?
3. Навіщо normalize line normal?
4. У чому різниця між arc і sector?
5. Як конвертувати radians у turns?
6. Навіщо Frac після angle offset?
7. Що відбувається у polar center?
8. Чому simple arc не працює через seam?
9. Через що mask є лише SDF-like?
10. Як повторювати angular cells?

## 22. Відповіді на запитання

1. OneMinus від SmoothStep навколо Length(centeredUV) і radius.
2. Ring — це distance до radius з обох боків.
3. Інакше magnitude Dot масштабує distance і width.
4. Arc — це segment ring; sector — angular wedge із radial extent.
5. Помножити на `1/(2π)`.
6. Обгорнути signed або offset turns у repeating range `0–1`.
7. Direction або angle є singular чи implementation-handled; не покладайтеся на них.
8. Ordering interval ламається на boundary 0/1.
9. Non-uniform transforms або shaping можуть зруйнувати exact signed-distance property.
10. `Frac(angle01*Repeats)`.

## 23. Self-check checklist

- [ ] Center і aspect застосовано до distance.
- [ ] Radius, width і feather розділено.
- [ ] Normal normalized.
- [ ] Pins atan2 перевірено вручну.
- [ ] Angle normalized, seam визначено.
- [ ] Repeats перевірено у motion.
- [ ] Немає неправдивої заяви про exact SDF.
- [ ] A/B прийнято.

## 24. Mastery criteria

- Побудуйте circle, ring і line без texture.
- Побудуйте non-wrapping arc і repeating sector.
- Поясніть кожен intermediate range.
- Виправте errors aspect, seam і normal length.
- Дайте правильні відповіді на 8/10 запитань і надайте повне evidence.

## 25. Підсумок

Centered coordinates, distance, dot і polar angle утворюють компактну мову shapes. Feathered thresholds перетворюють distance-like values на стабільні masks. Повторно використовуйте спільні branches і чітко розрізняйте приблизну та точну поведінку SDF.

## 26. Зв’язок із наступними уроками

[03.06](06_texture_sampling_channels_and_flipbooks.md) переносить ті ж masks у sampled textures, упаковані канали, mips і flipbook atlases.

## 27. Офіційні джерела

- [Material Expressions Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-expressions-reference)
- [Math Material Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/math-material-expressions-in-unreal-engine)
- [Utility Material Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/utility-material-expressions-in-unreal-engine)
- [Material Editor User Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-editor-user-guide)

Дата 2026-07-27. Atan2/Length/SmoothStep UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

```text
Рекомендований скриншот:
Що відкрити: M_L03_05_ShapeLab.
Що повинно бути видно: shared centered UV, ring branch, polar branch, arc composition.
Яку область виділити: InvTau normalization і angular gates.
```

```text
Рекомендована схема:
Що показати: Cartesian p=(x,y) → radius Length(p), angle atan2(y,x).
Навіщо: пояснити polar conversion незалежно від UE UI.
```
