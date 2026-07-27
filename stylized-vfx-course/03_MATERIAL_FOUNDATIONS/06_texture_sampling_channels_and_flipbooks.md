# 03.06 — Texture sampling, channels, compression і flipbooks

## 1. Назва

**Texture sampling, channels, compression і flipbooks: data від source pixels до shader.**

## 2. Результат уроку

Ви:

- пояснюєте texture sample як filtered data lookup за UV;
- окремо використовуєте RGB і A channels;
- відрізняєте grayscale mask, color texture та packed data;
- налаштовуєте sRGB/compression/mips за semantic content;
- виявляєте mip bleeding і edge padding problems;
- розрізняєте noise та directional noise;
- обчислюєте UV одного frame у flipbook atlas;
- пояснюєте роль `ParticleSubUV`/SubUV для particle renderer;
- створюєте `M_L03_06_PackedTextureLab` і `M_L03_06_AtlasPreview`.

## 3. Орієнтовний час

**8 годин: 2 години теорії / 6 годин практики.**

- 50 хв — sampling/channels/color space;
- 35 хв — compression/mips/bleed;
- 35 хв — noise/flipbook/SubUV;
- 80 хв — source texture та import experiments;
- 190 хв — guided graphs;
- 90 хв — exercises/review.

## 4. Prerequisites

- 03.01–03.05;
- UV transform, Frac/Floor, parameters;
- доступ до простого image editor для створення diagnostic PNG/TGA; художні навички не потрібні.

## 5. Нові терміни

- **Texel** — element texture image.
- **Texture sample** — filtered lookup texture data за coordinates.
- **Sampler** — state sampling behavior, filter і addressing.
- **Grayscale mask** — один channel, що представляє control value.
- **Channel packing** — кілька незалежних masks у R/G/B/A одного texture.
- **Compression** — storage/format transform із quality/memory trade-off.
- **Mipmaps** — prefiltered smaller levels для minification.
- **Bleeding** — unwanted сусідні colors/frames потрапляють у filtered sample.
- **Padding** — border texels навколо island/frame.
- **Flipbook/atlas** — grid із animation frames.
- **SubUV** — sampling sub-region atlas, керований particle або renderer.
- **Noise** — irregular pattern values.
- **Directional noise** — pattern із dominant orientation/flow.

## 6. Навіщо ця тема потрібна VFX artist

Textures несуть hand-painted shapes, noise, flipbooks і multiple masks. Неправильний sRGB псує mask math, compression додає blocks, mips змішують сусідні frames, а atlas UV error показує неправильний кадр. Це production correctness, не cosmetic setup.

## 7. Теорія простими словами

Texture не «накладається» сама. Shader подає UV у sample і отримує channels:

```text
sample = Texture(UV)
sample.rgb → color або packed data
sample.r/g/b/a → окремі masks
```

Filtering може змішувати сусідні texels. Mips допомагають далекому/малому object, але atlas frames потребують padding, щоб сусіди не bleeding.

Channel packing економить sample count/storage opportunities, але всі packed channels поділяють resolution, mips, compression і sRGB setting.

## 8. Детальні технічні пояснення

### Texture asset проти sample node

Texture asset зберігає source/build settings. `TextureSampleParameter2D` дає material instance змінювати texture asset, не rewiring graph. UV input визначає lookup.

### Color проти data

- painted emissive color: зазвичай має color semantic, часто `sRGB=On`;
- grayscale або packed masks: numeric data, зазвичай `sRGB=Off`;
- normal map: special encoding/compression, не звичайний RGB color.

**Потребує ручної перевірки в Unreal Engine 5.8.** Exact Texture Asset Editor labels/presets, включно з `Compression Settings`, `Mip Gen Settings`, `Texture Group` і `sRGB`.

### Alpha

Alpha може бути imported, generated або absent залежно від source/format. A channel sample не впливає на opacity, доки graph не використовує його.

### Compression

Compression зменшує memory/bandwidth/storage, але може створювати artifacts. Packed masks потребують profile/format, що не виконує color decode каналів і зберігає потрібну precision. Не існує одного preset для всіх VFX textures.

### Mipmaps та bleed

На менших mips сусідні texels усереднюються. Для atlas:

- залишайте padding між frames;
- не ставте важливу white shape впритул до cell border;
- тестуйте at distance/scale;
- перевіряйте Address mode і UV clamping.

Universal padding number не підтверджено: він залежить від resolution, filter, mip count, atlas layout і platform.

### Noise

Omnidirectional noise має приблизно рівномірну structure; directional noise витягнута вздовж axis. Panning directional noise вздовж/поперек streaks дає різний perceived flow. Flow map як vector field системно вивчається у 04.02; тут texture лише діагностується.

### Math flipbook

Для `Columns × Rows`, zero-based `Frame`:

```text
column = fmod(floor(Frame), Columns)
row = floor(floor(Frame) / Columns)
cellSize = (1/Columns, 1/Rows)
atlasUV = UV*cellSize + (column/Columns, row/Rows)
```

Frame order і vertical origin залежать від atlas convention; перевіряйте frame labels.

### ParticleSubUV

`ParticleSubUV` дає particle renderer-driven SubUV sampling у compatible particle material. Exact Niagara renderer binding/workflow буде у block 07. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 9. Візуальні або математичні приклади

Contract packed texture:

| Channel | Значення | Очікуваний range |
|---|---|---|
| R | soft circle | `0–1` |
| G | slash streak | `0–1` |
| B | noise breakup | `0–1` |
| A | hard core | `0–1` |

Для atlas 4×4 і Frame 6:

```text
column = 6 mod 4 = 2
row = floor(6/4) = 1
cellSize = (0.25,0.25)
offset = (0.5,0.25)
```

## 10. Controlled experiments

### Diagnostic source

Створіть `T_L03_06_PackedDiagnostic` 256×256 RGBA:

- R: горизонтальний gradient;
- G: centered soft circle;
- B: diagonal repeated stripes;
- A: hard square із щонайменше visible border.

Збережіть lossless format із alpha. Import дві copies:

- `T_L03_06_Packed_Data`;
- `T_L03_06_Packed_sRGB_Test`.

У Data copy вимкніть `sRGB`; у test copy порівняйте On. Exact settings mark manual.

### Experiments

1. Preview R/G/B/A окремо.
2. Виконайте zoom і distance test mips.
3. Змініть compression лише на duplicate; порівняйте edge і block artifacts.
4. Створіть дві adjacent high-contrast cells atlas без padding, потім padded copy; порівняйте distant sample.
5. Виконайте pan regular noise і directional noise вздовж X та Y.

## 11. Покрокова guided practice

### Graph A — `M_L03_06_PackedTextureLab`

#### Properties

Surface / Opaque / Unlit, Two Sided False.

#### Inventory

| Alias | Node | Default |
|---|---|---|
| `UV0` | `TextureCoordinate` | 0 |
| `TilingXY` | `VectorParameter` | `(1,1,0,0)` |
| `TilingRG` | `ComponentMask` | RG |
| `ScaledUV` | `Multiply` | — |
| `PackedMasks` | `TextureSampleParameter2D` | `T_L03_06_Packed_Data` |
| `SelectG` | `ScalarParameter` | `0` |
| `SelectB` | `ScalarParameter` | `0` |
| `SelectA` | `ScalarParameter` | `0` |
| `RorG` | `LinearInterpolate` | — |
| `RGorB` | `LinearInterpolate` | — |
| `RGBorA` | `LinearInterpolate` | — |
| `InvertMask` | `ScalarParameter` | `0` |
| `Inverted` | `OneMinus` | — |
| `SelectInvert` | `LinearInterpolate` | — |
| `MaskColor` | `VectorParameter` | `(1,.05,.01,1)` |
| `Colorize` | `Multiply` | — |
| `Intensity` | `ScalarParameter` | `1` |
| `Final` | `Multiply` | — |
| `MaterialOutput` | Main Material Node | — |

#### Connections

```text
TilingXY.RGBA → TilingRG.Input
UV0.Output → ScaledUV.A
TilingRG.RG → ScaledUV.B
ScaledUV.Output → PackedMasks.UVs
PackedMasks.R → RorG.A
PackedMasks.G → RorG.B
SelectG.Output → RorG.Alpha
RorG.Output → RGorB.A
PackedMasks.B → RGorB.B
SelectB.Output → RGorB.Alpha
RGorB.Output → RGBorA.A
PackedMasks.A → RGBorA.B
SelectA.Output → RGBorA.Alpha
RGBorA.Output → Inverted.Input
RGBorA.Output → SelectInvert.A
Inverted.Output → SelectInvert.B
InvertMask.Output → SelectInvert.Alpha
SelectInvert.Output → Colorize.A
MaskColor.RGB → Colorize.B
Colorize.Output → Final.A
Intensity.Output → Final.B
Final.Output → MaterialOutput.Emissive Color
```

Contract selector має one-hot priority: спочатку всі `0` = R; `SelectG=1` = G лише якщо пізніші selectors мають `0`; `SelectB=1` перекриває попереднє; `SelectA=1` перекриває все. Не вважайте довільні blends channel identity.

### Graph B — `M_L03_06_AtlasPreview`

#### Properties

Surface/Opaque/Unlit.

#### Inventory

| Alias | Node | Default |
|---|---|---|
| `UV0` | `TextureCoordinate` | 0 |
| `Frame` | `ScalarParameter` | `0` |
| `FrameInt` | `Floor` | — |
| `Columns` | `ScalarParameter` | `4` |
| `Rows` | `ScalarParameter` | `4` |
| `ColumnIndex` | `Fmod` | — |
| `RowFloat` | `Divide` | — |
| `RowIndex` | `Floor` | — |
| `One` | `Constant` | `1` |
| `CellSizeX` | `Divide` | — |
| `CellSizeY` | `Divide` | — |
| `CellSize` | `AppendVector` | — |
| `LocalUV` | `Multiply` | — |
| `ColumnOffset` | `Divide` | — |
| `RowOffset` | `Divide` | — |
| `CellOffset` | `AppendVector` | — |
| `AtlasUV` | `Add` | — |
| `AtlasTexture` | `TextureSampleParameter2D` | diagnostic labeled atlas |
| `MaterialOutput` | Main Material Node | — |

#### Connections

```text
Frame.Output → FrameInt.Input
FrameInt.Output → ColumnIndex.A
Columns.Output → ColumnIndex.B
FrameInt.Output → RowFloat.A
Columns.Output → RowFloat.B
RowFloat.Output → RowIndex.Input
One.Output → CellSizeX.A
Columns.Output → CellSizeX.B
One.Output → CellSizeY.A
Rows.Output → CellSizeY.B
CellSizeX.Output → CellSize.A
CellSizeY.Output → CellSize.B
UV0.Output → LocalUV.A
CellSize.Output → LocalUV.B
ColumnIndex.Output → ColumnOffset.A
Columns.Output → ColumnOffset.B
RowIndex.Output → RowOffset.A
Rows.Output → RowOffset.B
ColumnOffset.Output → CellOffset.A
RowOffset.Output → CellOffset.B
LocalUV.Output → AtlasUV.A
CellOffset.Output → AtlasUV.B
AtlasUV.Output → AtlasTexture.UVs
AtlasTexture.RGB → MaterialOutput.Emissive Color
```

Перевірте Frame `0,1,3,4,6,15`. Якщо rows виглядають vertically inverted відносно labels, не виконуйте мовчазний flip source: задокументуйте convention atlas і додайте explicit inversion row лише за потреби.

## 12. Точні назви UE nodes, modules і settings

- `TextureSampleParameter2D`, `TextureCoordinate`
- outputs `RGB`, `R`, `G`, `B`, `A`
- `Fmod`, `Floor`, `AppendVector`
- `ParticleSubUV`
- Texture Asset Editor: `sRGB`, `Compression Settings`, `Mip Gen Settings`, addressing/filtering/LOD-related properties

Exact settings/presets та ParticleSubUV workflow: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Graph | Parameter | Default |
|---|---|---:|
| Packed | `TilingXY` | `(1,1)` |
| Packed | `SelectG/B/A` | `0/0/0` |
| Packed | `InvertMask` | `0` |
| Packed | `Intensity` | `1` |
| Atlas | `Frame` | `0` |
| Atlas | `Columns` | `4` |
| Atlas | `Rows` | `4` |

Columns і Rows мають бути додатними; очікуваний Frame — `0…Columns*Rows-1`.

## 14. Очікуваний результат кожного етапу

- channels відповідають source contract;
- test sRGB показує, чому masks потребують data interpretation;
- captures compression і mip документують artifacts;
- selector ізолює R/G/B/A;
- frames atlas правильно mapped за labeled index;
- comparison bleed демонструє потребу в padding;
- orientation noise впливає на perceived motion.

## 15. Самостійна вправа

### EX-L03-06-A — Packed mask validation material

Імпортуйте діагностичну texture з чотирма channels. Побудуйте channel viewer і final composite: внесок R=red, G=green, B=blue; A множить усе як master mask.

**Обмеження:** decision sRGB задокументовано; один texture sample; точні channel connections; Surface/Opaque/Unlit.

**Матеріали до здачі:** source channel contract, settings Texture Editor, graph, RGB composite, composite з A-mask і mip-distance captures.

**Критерії приймання:** один sample; немає плутанини channel gamma; role A задано явно.

## 16. Додаткова складніша вправа

### EX-L03-06-B — 8×4 flipbook frame validator

Побудуйте manual atlas UV для 32 labeled frames. Parameters `Columns=8`, `Rows=4`, `Frame=0`. Додайте clamp Frame: `Clamp(Frame,0,Columns*Rows-1)` до Floor.

**Обмеження:** без ready flipbook function; labels мають правильно показувати 0, 7, 8, 15, 24 і 31; задокументуйте vertical order і padding.

**Матеріали до здачі:** повний graph, шість captures frames, out-of-range tests `-2` і `40`, observation bleed.

**Критерії приймання:** clamp працює; math row і column пояснено; convention atlas задано явно.

## 17. Три рівні підказок

### EX-L03-06-A

- **Hint 1:** RGB color composite можна побудувати, помноживши кожен scalar channel на unit color.
- **Hint 2:** три `Multiply` + два `Add`; потім помножте result через `Multiply` на sample A.
- **Hint 3:** `R*(1,0,0) + G*(0,1,0) + B*(0,0,1)` → multiply A → Emissive.

[Рішення A](../EXERCISE_ANSWERS/L03-06_texture_sampling_channels_and_flipbooks_answers.md#ex-l03-06-a)

### EX-L03-06-B

- **Hint 1:** виконайте clamp frame до Floor і math index.
- **Hint 2:** total=`Columns*Rows`; max=`total-1`; `Clamp` Frame; Fmod для column; Floor(frame/Columns) для row.
- **Hint 3:** cell size `(1/Columns,1/Rows)`; UV*cell size + offsets index/cell-count.

[Рішення B](../EXERCISE_ANSWERS/L03-06_texture_sampling_channels_and_flipbooks_answers.md#ex-l03-06-b)

## 18. Типові помилки

- Packed masks імпортовано як sRGB.
- Alpha помилково вважається автоматичним opacity.
- Та сама texture sampled чотири рази для чотирьох channels.
- Parameters selector не one-hot.
- Numbering Frame one-based замість zero-based.
- Row обчислено через Rows замість Columns.
- Floor не застосовано до Frame.
- Padding відсутній, а bleeding помилково пояснено shader.
- Усі mips вимкнено як default «fix».
- Vertical convention atlas проігноровано.

## 19. Troubleshooting

| Симптом | Перевірка | Виправлення |
|---|---|---|
| Midtones mask неправильні | semantic sRGB | вимкни для data; повторно оціни source |
| Block artifacts | duplicate compression | обери перевірене setting, відповідне data |
| Неправильна cell atlas | debug frame, column, row і offset | перевір zero-based formulas |
| Neighbor frame видно на distance | padding, mips і filter | додай padding, перевір settings, уникай content на border |
| Alpha чорний | source не має alpha або проблема import | перевір source channels і Texture Editor |
| Shimmering noise | frequency і mips | зменш tiling, забезпеч mips, перевір temporal view |

## 20. Performance considerations

- Один packed sample може замінити кілька samples, але channels спільно використовують format, resolution і settings.
- Texture memory включає mip chain і platform format, а не лише source file size.
- Надто великі textures марнують memory; надто малі втрачають edge fidelity.
- Manual math atlas додає ALU; path ParticleSubUV або renderer може бути кращим для particle animation.
- High-frequency directional noise може створювати aliasing і збільшувати visual instability.
- Вимірюйте фактичні resource size і shader stats в UE, а не disk size PNG.

## 21. Запитання для самоперевірки

1. Що потрібно texture sample, крім texture?
2. Чому для masks зазвичай sRGB Off?
3. Який trade-off channel packing?
4. Навіщо існують mips?
5. Що спричиняє bleeding atlas?
6. Для Frame 9 в atlas із 8 columns які column і row?
7. Навіщо Floor для Frame?
8. Що представляє ParticleSubUV?
9. Чому alpha не є автоматичним opacity?
10. Чому universal disabling mips неправильне?

## 22. Відповіді на запитання

1. Sampling coordinates або UV і behavior sampler.
2. Це linear numeric data, а не display color encoding.
3. Менше shared samples і assets, але спільні resolution, format, mips та sRGB.
4. Prefiltered minification, stability і efficient distant sampling.
5. Filtering і mips змішують texels adjacent cells за недостатнього padding.
6. Column 1, row 1 за zero-based numbering.
7. Index Frame має бути discrete.
8. Sampling subregion atlas, керований particle або renderer.
9. Це data, доки alpha не під’єднано до compatible opacity input.
10. Це може погіршити minification, aliasing і behavior performance або memory.

## 23. Self-check checklist

- [ ] Source channel contract існує.
- [ ] Decision sRGB спирається на semantic.
- [ ] Для packed channels використано один sample.
- [ ] Compression і mips перевірено на duplicate.
- [ ] Padding перевірено.
- [ ] Indices atlas zero-based.
- [ ] Out-of-range frame оброблено.
- [ ] ParticleSubUV позначено для later або manual check.
- [ ] A/B завершено.

## 24. Mastery criteria

- Діагностуйте чотири channels і settings.
- Побудуйте packed viewer і manual atlas з нуля.
- Виправте неправильну math row і column.
- Поясніть compression, mips і bleed без universal preset claim.
- Завершіть exercises і дайте правильні відповіді на 8/10 запитань.

## 25. Підсумок

Texture sampling — це lookup data за UV, filtering і asset settings. Channels мають semantics, призначені pipeline. Mips, compression і padding є частиною effect. UV math flipbook — це remapping index-to-cell; перевіряйте convention через labeled frames.

## 26. Зв’язок із наступними уроками

[03.07](07_material_domains_blending_depth_and_overdraw.md) використає sampled masks у Opaque, Masked, Translucent й Additive materials та покаже depth/overdraw consequences.

## 27. Офіційні джерела

- [Textures in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/textures-in-unreal-engine)
- [Texture Asset Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-asset-editor-in-unreal-engine)
- [Material Expressions Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-expressions-reference)
- [Material Parameter Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-parameter-expressions-in-unreal-engine)
- [Math Material Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/math-material-expressions-in-unreal-engine)
- [Material Inputs](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-inputs-in-unreal-engine)

Дата 2026-07-27. Texture presets, ParticleSubUV, atlas orientation: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

```text
Рекомендований скриншот 1:
Що відкрити: Texture Asset Editor для T_L03_06_Packed_Data.
Що повинно бути видно: RGBA channels, sRGB, compression, mips, resource information.
Яку область виділити: actual settings used; build number in caption.
```

```text
Рекомендований скриншот 2:
Що відкрити: M_L03_06_AtlasPreview.
Що повинно бути видно: Frame→column/row→cell UV graph.
Яку область виділити: Fmod, Floor, CellSize, CellOffset.
```
