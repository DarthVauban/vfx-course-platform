# 03.04 — UV, pivot, рух і системи координат

## 1. Назва

**UV, pivot, рух і системи координат: де саме живуть shader values.**

## 2. Результат уроку

Після уроку ви:

- пояснюєте UV як 2D coordinates, а не як texture;
- керуєте tiling, offset і pivot;
- використовуєте `Panner` та `Rotator`;
- відрізняєте local, world, object, camera й screen space;
- не додаєте position до direction без semantic reason;
- створюєте `M_L03_04_UVDiagnostic` і coordinate-space comparison board.

## 3. Орієнтовний час

**8 годин: 2 години теорії / 6 годин практики.**

- 45 хв — UV/tiling/offset;
- 35 хв — pivot/Panner/Rotator;
- 40 хв — системи координат;
- 90 хв — experiments;
- 180 хв — керована практика;
- 90 хв — exercises/review.

## 4. Prerequisites

- 03.01–03.03;
- Multiply/Add/remap/Frac;
- Vector2 composition і debug через Emissive.

## 5. Нові терміни

- **UV coordinates** — 2D coordinates, зазвичай U/V у `0–1` на mesh UV island.
- **Tiling** — scale coordinate, що змінює repetition density.
- **Offset** — translation координати.
- **Pivot** — point, відносно якого виконується transform.
- **Panning** — UV translation, керована time.
- **Rotation center** — UV pivot для rotation.
- **Local space** — coordinate frame конкретного object/mesh.
- **World space** — спільна coordinate system level.
- **Object position** — representative object origin/bounds-related position, залежно від expression.
- **Camera space/view relation** — values відносно camera або view.
- **Screen space** — coordinates projected на viewport/screen.
- **Position** — point; translation впливає.
- **Direction/vector** — offset/direction; translation не повинна впливати.

## 6. Навіщо ця тема потрібна VFX-фахівцю

UV transforms рухають noise, slash texture, beam flow та dissolve. Coordinate spaces визначають, чи pattern:

- приклеєний до mesh;
- стоїть у world, поки object рухається;
- повертається/змінюється від camera;
- має screen-space scale.

Неправильний space створює swimming, sliding, stretching або camera-dependent artifacts.

## 7. Теорія простими словами

UV — адреса на 2D texture plane. `U=0,V=0` — один corner; `1,1` — протилежний у межах island. Direction V на screen залежить від mesh/asset conventions, тому її перевіряють diagnostic texture/gradient.

```text
scaledUV = UV × Tiling
offsetUV = scaledUV + Offset
animatedUV = offsetUV + Time × Speed
```

Поворот навколо pivot:

```text
centered = UV - Pivot
rotated = Rotate2D(centered, angle)
result = rotated + Pivot
```

`Rotator` encapsulates цю ідею. Головне — знати center і units/time contract.

## 8. Детальні технічні пояснення

### UV channel і component order

`TextureCoordinate` повертає Vector2. `R` відповідає U, `G` — V у component viewing convention. Mesh може мати кілька UV channels; `Coordinate Index` обирає channel.

### Порядок transform

`UV*Tiling + Offset` не те саме, що `(UV+Offset)*Tiling`. У другому case tiling також масштабує offset. Виберіть order свідомо й запишіть формулу.

### Tiling і Frac

Coordinates можуть виходити за `0–1`. Texture Address mode `Wrap/Clamp/Mirror` визначає sampling. Для procedural preview `Frac` явно повертає each repeated cell у `0–1`.

### Pivot

Scaling/rotation навколо `(0,0)` тягне content до corner. Для center rotation typical pivot `(0.5,0.5)`. Pivot має бути в тому самому coordinate space, що UV на момент operation.

### Time

Material `Time` — engine-provided time value. Під час pause, editor preview або game settings behavior може відрізнятися. **Потребує ручної перевірки в Unreal Engine 5.8.** Перевірте `Time` node properties і preview behavior у конкретному build.

### Spaces

- `TextureCoordinate`: UV space mesh.
- `Absolute World Position`: current shaded position у world units.
- `Object Position WS`: world position, пов’язана з object.
- `Camera Position WS`: world position camera.
- `ScreenPosition`: projected screen data; output components/viewport mapping залежать від selected mapping.
- `TransformPosition`: перетворює position між supported spaces.
- `TransformVector`: перетворює direction/vector; translation ignored.

Точні option lists для Transform nodes: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Position проти direction

Direction від camera до pixel:

```text
cameraToPixel = AbsoluteWorldPosition - CameraPositionWS
unitViewDir = Normalize(cameraToPixel)
```

Не Normalize-те position, якщо вам потрібна world location. Не використовуйте `TransformPosition` для normal/direction без розуміння translation.

## 9. Візуальні або математичні приклади

Для UV `(0.25,0.75)`:

```text
Tiling=(2,3) → (0.5,2.25)
Offset=(0.1,-0.2) → (0.6,2.05)
Frac → (0.6,0.05)
```

Порівняння order:

```text
UV*2 + 0.1 = 0.25*2 + 0.1 = 0.6
(UV+0.1)*2 = 0.35*2 = 0.7
```

Таблиця behavior spaces:

| Source | Object переміщується | Camera рухається | Типове застосування |
|---|---|---|---|
| UV | лишається attached до UV | без змін | texture або card |
| World Position | pattern sample береться в нових world positions | view geometry змінюється | world-locked noise |
| Object-relative | слідує за logic frame або origin object | без змін | local procedural pattern |
| ScreenPosition | screen projection змінюється | сильно змінюється | screen-space effects |

## 10. Controlled experiments

1. **U/V identity:** output `TextureCoordinate.R` і `.G` окремо; record orientation.
2. **Order:** порівняйте `UV*Tiling+Offset` із `(UV+Offset)*Tiling`.
3. **Pivot:** виконайте rotation навколо `(0,0)` і `(0.5,0.5)`.
4. **Panner sign:** перевірте speed `(0.2,0)`, `(-0.2,0)`, `(0,0.2)`.
5. **Spaces:** застосуйте material variants, що показують UV, fractional pattern world position, distance object-to-world і screen position; переміщуйте object і camera окремо.

World values мають великий діапазон. Для наочного debug застосовуйте scaling і `Frac`, а не подавайте необроблену позицію у світовому просторі безпосередньо як фінальний художній колір.

## 11. Покрокова керована практика

### Graph — `M_L03_04_UVDiagnostic`

#### Properties

- Surface / Opaque / Unlit
- Two Sided `False`

#### Inventory nodes

| Alias | Exact node | Default/property |
|---|---|---|
| `UV0` | `TextureCoordinate` | Index 0, tiling 1 |
| `TilingXY` | `VectorParameter` | `(2,2,0,0)` |
| `TilingRG` | `ComponentMask` | R,G |
| `ScaleUV` | `Multiply` | — |
| `OffsetXY` | `VectorParameter` | `(0.1,0,0,0)` |
| `OffsetRG` | `ComponentMask` | R,G |
| `OffsetUV` | `Add` | — |
| `PanSpeedXY` | `VectorParameter` | `(0.1,0.03,0,0)` |
| `PanSpeedRG` | `ComponentMask` | R,G |
| `PannedUV` | `Panner` | Coordinate/Speed inputs |
| `GameTime` | `Time` | default properties |
| `RotateSpeed` | `ScalarParameter` | `0.1` |
| `ScaledTime` | `Multiply` | — |
| `RotatedUV` | `Rotator` | Center X `.5`, Center Y `.5`, Speed `1` |
| `UseRotate` | `ScalarParameter` | `0` |
| `SelectUV` | `LinearInterpolate` | — |
| `RepeatUV` | `Frac` | — |
| `ZeroBlue` | `Constant` | `0` |
| `UVasRGB` | `AppendVector` | Vector2+Scalar |
| `MaterialOutput` | Main Material Node | — |

#### Connections

```text
TilingXY.RGBA → TilingRG.Input
UV0.Output → ScaleUV.A
TilingRG.RG → ScaleUV.B
OffsetXY.RGBA → OffsetRG.Input
ScaleUV.Output → OffsetUV.A
OffsetRG.RG → OffsetUV.B
OffsetUV.Output → PannedUV.Coordinate
PanSpeedXY.RGBA → PanSpeedRG.Input
PanSpeedRG.RG → PannedUV.Speed
OffsetUV.Output → RotatedUV.Coordinate
GameTime.Output → ScaledTime.A
RotateSpeed.Output → ScaledTime.B
ScaledTime.Output → RotatedUV.Time
PannedUV.Output → SelectUV.A
RotatedUV.Output → SelectUV.B
UseRotate.Output → SelectUV.Alpha
SelectUV.Output → RepeatUV.Input
RepeatUV.Output → UVasRGB.A
ZeroBlue.Output → UVasRGB.B
UVasRGB.Output → MaterialOutput.Emissive Color
```

**Потребує ручної перевірки в Unreal Engine 5.8.** Звірте наявність/label `Panner.Speed`, `Rotator.Time`, `Center X/Y`, `Speed` у Details. Якщо Panner Speed задається properties замість input у вашому build, встановіть Speed X/Y зі значень contract і задокументуйте actual UI; не вигадуйте pin.

#### Branches

- Base transform: спочатку scale, потім offset.
- Panner: переміщує transformed UV із часом.
- Rotator: обертає ті самі transformed UV навколо center.
- Selector: порівнює motion modes.
- Debug display: Frac лишає repeated coordinates видимими; Append перетворює RG на RGB.

#### Проміжні перевірки

| Output | Очікуваний результат |
|---|---|
| `UV0` | червоний U і зелений V gradient |
| `ScaleUV` | values перевищують 1 |
| `OffsetUV` | shifted coordinates |
| `PannedUV` | стабільний diagonal drift |
| `RotatedUV` | rotation навколо center |
| `RepeatUV` | values візуально повторюються 0–1 |

### Assets для порівняння coordinates

Створіть чотири copies, кожна Surface/Opaque/Unlit:

1. `M_L03_04_Space_UV`: `TextureCoordinate → Frac → AppendVector(+0) → Emissive`.
2. `M_L03_04_Space_World`: `AbsoluteWorldPosition → Multiply(0.01) → Frac → Emissive`.
3. `M_L03_04_Space_ObjectDistance`: `Distance(AbsoluteWorldPosition,ObjectPositionWS) → Multiply(0.01) → Frac → Emissive`.
4. `M_L03_04_Space_Screen`: `ScreenPosition` viewport-compatible XY → ComponentMask RG → AppendVector(+0) → Emissive.

Точний mapping і вибір output для `ScreenPosition`: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 12. Точні назви вузлів, модулів і налаштувань UE

- `TextureCoordinate`, `Panner`, `Rotator`, `Time`
- `Absolute World Position`
- `Object Position WS`
- `Camera Position WS`
- `ScreenPosition`
- `TransformPosition`, `TransformVector`
- `ComponentMask`, `AppendVector`, `Frac`
- material properties Surface/Opaque/Unlit

Search labels, pin labels та Transform source/destination options: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Parameter | Type | Default |
|---|---|---|
| `TilingXY` | Vector | `(2,2,0,0)` |
| `OffsetXY` | Vector | `(0.1,0,0,0)` |
| `PanSpeedXY` | Vector | `(0.1,0.03,0,0)` |
| `RotateSpeed` | Scalar | `0.1` |
| `UseRotate` | Scalar | `0` |

Coordinate debug scale for centimeters-to-pattern: start `0.01`; це art/debug factor, не unit conversion rule.

## 14. Очікуваний результат кожного етапу

| Етап | Результат |
|---|---|
| U/V identity | orientation задокументовано |
| Tiling | two repeats each axis після Frac |
| Offset | pattern зміщується predictably |
| Panner | continuous drift |
| Rotator | rotation навколо `.5,.5` |
| Space board | рух object і camera виявляє attachment behavior |
| Докази | шість intermediate captures і notes щодо movement |

## 15. Самостійна вправа

### EX-L03-04-A — Pivoted UV motion card

Створіть `M_EX_L03_04_PivotMotion` із tiling `(3,1)`, offset, Panner і Rotator comparison. `UseRotate` selects. Rotation center `.5,.5`; panner speed `(0.15,0)`.

**Обмеження:** transform order `UV*Tiling+Offset`; debug output через `Frac`; усі controls параметризовано там, де дозволяє node; фактичні pins UE 5.8 задокументовано.

**Матеріали до здачі:** повний graph contract; captures center проти corner pivot; video або frame sequence Panner/Rotator; пояснення direction motion.

**Критерії приймання:** effect зміни pivot пояснено; offset випадково не масштабовано; selector працює.

## 16. Додаткова складніша вправа

### EX-L03-04-B — Coordinate-space behavior matrix

Побудуйте чотири diagnostic materials для UV, world, object-distance і screen. Розмістіть їх на двох identical planes. Перемістіть спочатку один object, потім camera.

**Обмеження:** та сама geometry; fixed exposure; без artistic textures; кожен material має explicit scale до Frac, де це потрібно.

**Матеріали до здачі:** behavior matrix 4×2 (рух object і рух camera), graph contracts, screenshots, висновок про те, коли кожен space корисний або небезпечний для VFX.

**Критерії приймання:** observations розрізняють attached, world-locked і screen-dependent behavior; raw world values не прочитано помилково як colors.

## 17. Три рівні підказок

### EX-L03-04-A

- **Hint 1:** зафіксуйте operation order на папері.
- **Hint 2:** `TextureCoordinate → Multiply(Tiling) → Add(Offset)` подається одночасно в `Panner` і `Rotator`.
- **Hint 3:** outputs Panner/Rotator подаються в Lerp A/B; `UseRotate` — Alpha; Frac стоїть перед debug RGB.

[Рішення A](../EXERCISE_ANSWERS/L03-04_uv_coordinates_and_coordinate_spaces_answers.md#ex-l03-04-a)

### EX-L03-04-B

- **Hint 1:** змінюйте по одному transform за раз: спочатку object, потім camera.
- **Hint 2:** точні sources: `TextureCoordinate`, `Absolute World Position`, `Object Position WS`, `ScreenPosition`.
- **Hint 3:** масштабуйте world або object distance на `.01`, застосуйте Frac, потім debug; запишіть фактичний mapping ScreenPosition, обраний у UE 5.8.

[Рішення B](../EXERCISE_ANSWERS/L03-04_uv_coordinates_and_coordinate_spaces_answers.md#ex-l03-04-b)

## 18. Типові помилки

- UV помилково вважаються pixels.
- Offset ненавмисно застосовано до scale.
- Rotation виконується навколо `(0,0)`, хоча очікується center.
- VectorParameter RGBA під’єднано туди, де очікується float2, без masking.
- Sign speed Panner неправильно прочитано через orientation V.
- необроблену позицію у світовому просторі подано у color, через що preview нестабільний або saturated.
- Direction трансформовано як position.
- World-space pattern названо «object local».
- Graph залежить від незадокументованого component ScreenPosition.

## 19. Troubleshooting

| Симптом | Діагностика | Виправлення |
|---|---|---|
| Pattern рухається надто швидко | перевір Time×Speed | зменш speed; уникай double multiplication |
| Offset змінюється разом із tiling | перевір operation order | спочатку scale, потім offset |
| Rotation навколо corner | перевір center Rotator | встанови `.5,.5` |
| Pin speed Panner відсутній | перевір Details і tooltips node | використовуй задокументовані properties; познач manual check |
| World pattern повністю білий | перевір raw magnitude | застосуй scale і Frac |
| Screen pattern має неправильний aspect | перевір viewport mapping і aspect | задокументуй mapping; застосовуй aspect correction лише за відомих viewport data |

## 20. Performance considerations

- UV arithmetic зазвичай недорога, але кілька незалежних branches Panner або Rotator накопичують cost.
- Panner і Rotator не переміщують texture data; вони змінюють sampling coordinates.
- Calculations у world або screen space можуть завадити reuse простих assumptions mesh UV і збільшити complexity.
- Selector Lerp обчислює обидві motion branches; використовуй його лише як lab. Trade-offs static permutations розглянуто у 03.08.
- High tiling збільшує visual frequency і aliasing, а не лише «detail».

## 21. Запитання для самоперевірки

1. Що повертає TextureCoordinate?
2. Чому `UV*Tiling+Offset` відрізняється від `(UV+Offset)*Tiling`?
3. Навіщо Frac у diagnostic graph?
4. Що таке pivot?
5. Як формується Panner motion?
6. Чим position відрізняється від direction при transform?
7. Що станеться з world-locked pattern, коли object рухається?
8. Чому необроблена позиція у світовому просторі незручна як color?
9. Коли screen space корисний?
10. Які UE 5.8 facts треба manual-check?

## 22. Відповіді на запитання

1. Vector2 UV із selected channel.
2. Другий order масштабує offset.
3. Він показує repeated local `0–1` cells.
4. Point, відносно якого scale/rotation.
5. Coordinate plus time-dependent speed offset.
6. Position includes location/translation; direction represents displacement/orientation.
7. Mesh samples інші world positions, тому pattern здається нерухомим у world і ковзає по object.
8. Values великі, signed і не normalized.
9. Для viewport-aligned masks/scale, але він camera/resolution dependent.
10. Pin labels Panner/Rotator, Time behavior, ScreenPosition mapping, Transform options.

## 23. Self-check checklist

- [ ] Orientation U/V записано.
- [ ] Operation order задано явно.
- [ ] RG виділено з VectorParameter через mask.
- [ ] Pivot center і corner порівняно.
- [ ] Time і speed не подвоєно.
- [ ] Spaces перевірено окремо рухом object і camera.
- [ ] Semantics position і direction правильні.
- [ ] Facts для manual check позначено.

## 24. Mastery criteria

- Побудуйте graph tiling, offset, pan і rotate з нуля за 35 хвилин.
- Передбачте result transform order.
- Діагностуйте неправильний pivot і sign panner.
- Правильно класифікуйте чотири spaces.
- Завершіть A/B і дайте правильні відповіді на 8/10 запитань.

## 25. Підсумок

UV transforms — це coordinate math. Order і pivot визначають behavior. Coordinate space — це contract про те, що рухається разом із mesh, world або camera. Перевіряйте coordinates у debug до sampling textures.

## 26. Зв’язок із наступними уроками

[03.05](05_procedural_shapes_polar_and_sdf_masks.md) використає centered UV, Distance, Dot, Frac і angle для circle, ring, line, arc, sector та repeating polar patterns.

## 27. Офіційні джерела

- [Material Expressions Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-expressions-reference)
- [Coordinates Material Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/coordinates-material-expressions-in-unreal-engine)
- [Animating UV Coordinates](https://dev.epicgames.com/documentation/en-us/unreal-engine/animating-uv-coordinates-in-unreal-engine)
- [Material Editor User Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-editor-user-guide)
- [Material Inputs](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-inputs-in-unreal-engine)

Дата 2026-07-27. Version-sensitive UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

```text
Рекомендований скриншот:
Що відкрити: M_L03_04_UVDiagnostic.
Що повинно бути видно: transform branch, Panner, Rotator, selector, Frac.
Яку область виділити: order UV×Tiling+Offset і pivot properties.
```

```text
Рекомендована схема:
Що показати: таблицю UV/local/world/camera/screen і реакцію на object/camera movement.
Навіщо: просторове відношення важливіше за UI screenshot.
```
