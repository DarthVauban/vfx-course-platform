# 1. L04-04 — Fresnel, WPO і Vertex Color

| Поле | Значення |
|---|---|
| Блок | 04 — Stylized VFX Materials |
| Lesson ID | L04-04 |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | `MF_VFX_FresnelBand`, `M_VFX_MeshVertexAnim` і vertex-painted mesh test |
| Mastery gate | Побудувати керовану mesh-анімацію, де silhouette, edge light і маски мають окремі канали керування |

## 2. Результат уроку

Ви навчитеся:

- читати Fresnel як view-dependent edge mask, а не як готовий «магічний glow»;
- створювати вузьку Fresnel band із контрольованими exponent і width;
- деформувати VFX mesh через `World Position Offset`;
- розподіляти чотири незалежні controls у `Vertex Color RGBA`;
- відрізняти vertex-stage deformation від pixel-stage color/opacity;
- виявляти culling, bounds, silhouette і vertex-density проблеми;
- перетворювати graph на reusable Material Function та instance-friendly parent.

Доказ засвоєння: один animated mesh material, три debug views, дві vertex-color paint schemes і записаний bounds test.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Fresnel/WPO mental model | 1.0 | 0 |
| Controlled experiments | 0.5 | 0.5 |
| Guided practice | 3.0 | 3.0 |
| Самостійні вправи | 2.0 | 2.0 |
| Debug, performance і self-check | 1.5 | 1.0 |
| **Разом** | **8.0** | **6.5 (81.25%)** |

## 4. Prerequisites

| Навичка | Де | Швидка перевірка |
|---|---|---|
| Scalar/vector math, Dot, Power | [L03-02](../03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) | Поясніть, як exponent змінює 0–1 mask |
| Coordinate spaces і normals | [L03-04](../03_MATERIAL_FOUNDATIONS/04_uv_coordinates_and_coordinate_spaces.md) | Відрізніть object, local і світовий простір |
| Blend/depth/overdraw | [L03-07](../03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) | Перевірте translucent material на трьох backgrounds |
| HDR color hierarchy | [L04-03](03_gradient_mapping_hdr_and_stylized_color.md) | Відокремте color від intensity |
| Mesh із коректними UV/normals | Власний asset або Engine primitive | Normals спрямовані очікувано, scale застосований |

## 5. Нові терміни

| Англійський термін | Пояснення | Практичний приклад |
|---|---|---|
| Fresnel | Маска, залежна від кута між surface normal і напрямком до камери | Rim на сфері або energy shell |
| World Position Offset, WPO | Vertex-stage зміщення render vertices перед rasterization | Пульсація cone або ring mesh |
| Vertex Color | RGBA values, збережені на вершинах mesh | R=deform, G=erosion bias, B=color blend, A=opacity |
| Vertex density | Кількість і розподіл vertices, доступних для deformation | Subdivided ring згинається плавніше за 8-vertex ring |
| Bounds | Об’єм, за яким renderer вирішує, чи об’єкт видимий | WPO виходить за static bounds і mesh рано зникає |
| View-dependent | Результат змінюється з позицією/напрямком camera | Fresnel rim «переїжджає» під час orbit |

## 6. Навіщо ця тема потрібна VFX-фахівцю

Sprite добре працює для camera-facing shape, але mesh потрібен, коли ефект має об’єм, точну дугу, кільце, cone, shockwave shell або readable silhouette з кількох ракурсів. Без shader deformation та vertex data кожна варіація вимагатиме нової geometry або анімації.

Fresnel корисний як secondary cue:

- підкреслити outer shell;
- відокремити об’єм від фону;
- створити тонкий accent rim;
- змішати два color regions за viewing angle.

Він не повинен автоматично займати весь ефект. Сильний суцільний Fresnel часто створює generic «пластикову кулю». У stylized VFX edge light має підтримувати головну shape/value hierarchy.

WPO дозволяє дешево змінювати silhouette на vertex stage. Але він не:

- додає нові vertices;
- змінює collision;
- автоматично розширює bounds;
- виправляє погані normals;
- замінює timing у Niagara.

## 7. Теорія простими словами

Уявіть normal як стрілку, що стирчить із поверхні. Коли стрілка дивиться в camera, surface center має малий Fresnel. Коли normal майже боком до camera, значення зростає.

Спрощена формула:

```text
Facing = saturate(dot(NormalWS, ViewDirectionWS))
FresnelBase = 1 - Facing
Fresnel = pow(FresnelBase, Exponent)
```

`Exponent` стискає або розширює rim. Щоб отримати не суцільний gradient, а band:

```text
Outer = smoothstep(OuterStart, OuterEnd, Fresnel)
Inner = smoothstep(InnerStart, InnerEnd, Fresnel)
Band = saturate(Outer - Inner)
```

WPO — це вектор зміщення:

```text
OffsetWS = DirectionWS × SignedAmount × VertexMask
NewPosition = OriginalPosition + OffsetWS
```

До `World Position Offset` подається саме offset, не абсолютна позиція.

## 8. Детальні технічні пояснення

### Fresnel control

В UE Material node `Fresnel` надає `ExponentIn` і `BaseReflectFractionIn`. Для навчального function ми використовуємо output як 0–1 mask і після нього додаємо окремі remap controls. Це дає зрозумілий debug path.

`BaseReflectFraction` змінює значення в center і може зробити всю поверхню світлою. Для VFX-mask workflow почніть із 0, а artist-facing controls будують через exponent та band thresholds.

### Signed vertex wave

Для stable mesh-space pattern:

```text
PhaseCycles = Time × Speed + PositionAlongAxis × Frequency
Wave = MaterialSine(PhaseCycles, Period=1)
Offset = VertexNormalWS × Wave × Amplitude × VertexColor.R
```

`Time` і `Position` мають узгоджені units лише через artistic frequency constants. Material `Sine` читає 0–1 як один cycle при `Period=1`; це не raw HLSL `sin(radians)` і не фізична симуляція.

Якщо використати `Absolute World Position`, pattern залишиться прив’язаним до світу; mesh, що рухається, «проїжджатиме» крізь нього. Для локально прив’язаного effect перетворіть position у local/object space або використайте UV. Точні labels трансформаційних node/pin у встановленому UE 5.8.x:

`Потребує ручної перевірки в Unreal Engine 5.8.`

У guided build нижче використано UV V як стабільну локальну координату.

### Vertex Color contract

Для цього курсу:

| Канал | Значення |
|---|---|
| R | WPO influence |
| G | Dissolve/erosion bias |
| B | `ColorLow` ↔ `ColorHigh` blend |
| A | Base opacity/shape weight |

Запишіть contract у asset description. Інакше mesh author, material author і Niagara artist можуть інтерпретувати той самий канал по-різному.

### Vertex stage проти pixel stage

- WPO обчислюється на vertices. Величезна texture detail не створить дрібної геометричної хвилі, якщо vertices мало.
- Emissive/Opacity обчислюються для fragments/pixels. Там можна мати тонку texture detail.
- Vertex Color інтерполюється між vertices; різкий painted border потребує достатньої topology або duplicated vertices.

### Bounds і collision

Material deformation змінює render position, але не collision shape. Static/skeletal mesh bounds теж можуть не охопити максимальний WPO. Результат — раннє зникнення під час camera movement. Спочатку обмежте amplitude; потім налаштуйте bounds на asset/component/system рівні й перевірте з усіх потрібних ракурсів.

Exact bounds property і взаємодія Niagara Mesh Renderer з fixed bounds:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 9. Візуальні й математичні приклади

### Fresnel

```text
Facing = 0.2
Base = 1 - 0.2 = 0.8

Exponent 1: 0.8
Exponent 3: 0.512
Exponent 6: 0.262
```

Вищий exponent залишає сильними тільки values ближче до silhouette edge.

### WPO

```text
Amplitude = 6 cm
Wave = -0.5
VertexColor.R = 0.75
NormalWS = (0, 0, 1)

OffsetWS = (0,0,1) × -0.5 × 6 × 0.75
         = (0,0,-2.25 cm)
```

### Розклад channel contract

```text
Vertex R: 0 at base → 1 at tip
Vertex G: alternate 0/1 islands
Vertex B: 0 outer → 1 inner
Vertex A: 0 at trimmed edge → 1 in body
```

## 10. Controlled experiments

### CE04-04-A — Fresnel exponent

1. Створіть unlit sphere material.
2. Preview `Fresnel` напряму в Emissive.
3. Порівняйте exponent `0.5`, `1`, `3`, `8`.
4. Orbit camera, не обертаючи sphere.
5. Збережіть contact sheet і підпишіть, де rim підтримує silhouette, а де з’їдає body.

Очікування: mask змінюється з camera angle; exponent 8 дає вужчу visible область.

### CE04-04-B — Vertex density

1. Застосуйте однаковий WPO material до low-poly і subdivided ring.
2. Встановіть `Amplitude=8`, `Frequency=3`, `Speed=1`.
3. Порівняйте silhouette у paused frame.
4. Увімкніть wireframe view.

Очікування: material math однакова, але low-poly silhouette ламається великими segments.

### CE04-04-C — World-locked проти UV-locked

1. Variant A: phase від `Absolute World Position.Z`.
2. Variant B: phase від `TexCoord.V`.
3. Перемістіть mesh на 300 units.

Очікування: A змінює phase через translation, B зберігає pattern відносно mesh UV.

## 11. Покрокова керована практика

### Крок 1 — Підготуйте mesh test

Використайте subdivided cone, ring або sphere з:

- UV0 без випадкових overlaps;
- normals, спрямованими назовні;
- vertex colors;
- R-gradient від 0 біля base до 1 біля tip;
- G зі смугами або islands;
- B-gradient поперек thickness;
- A=1 у body та 0 біля одного test edge.

Якщо DCC ще не освоєно, використайте test mesh із Engine/Starter Content для Fresnel, а vertex-painted mesh підготуйте після блока 06. Не пропускайте channel-contract table.

### Крок 2 — Створіть `MF_VFX_FresnelBand`

Inputs:

- `NormalVector` — Vector3, optional;
- `Exponent` — Scalar, default 3;
- `OuterStart` — Scalar, default 0.15;
- `OuterEnd` — Scalar, default 0.45;
- `InnerStart` — Scalar, default 0.55;
- `InnerEnd` — Scalar, default 0.85.

Побудуйте:

```text
FresnelMask = Fresnel(Exponent)
Outer = SmoothStep(OuterStart, OuterEnd, FresnelMask)
Inner = SmoothStep(InnerStart, InnerEnd, FresnelMask)
Band = Saturate(Outer - Inner)
```

Outputs:

- `FullFresnel`;
- `Band`.

Перевірте окремо обидва outputs на sphere.

### Крок 3 — Створіть parent material

Назва: `M_VFX_MeshVertexAnim`.

Properties:

| Property | Value |
|---|---|
| Material Domain | Surface |
| Blend Mode | Additive для навчальної версії |
| Shading Model | Unlit |
| Two Sided | true для thin VFX meshes |
| Use Material Attributes | false |

Створіть parameters:

```text
T_BodyMask (Texture2D)
ColorLow = (0.03, 0.10, 0.80)
ColorHigh = (0.15, 1.00, 2.50)
RimColor = (0.50, 1.50, 6.00)
BodyIntensity = 2
RimIntensity = 4
OpacityScale = 1
WPOAmplitude = 4
WPOSpeed = 1
WPOFrequency = 2
FresnelExponent = 3
BandOuterStart = 0.15
BandOuterEnd = 0.45
BandInnerStart = 0.55
BandInnerEnd = 0.85
DebugMode = 0
```

### Крок 4 — Побудуйте body masks

1. `TextureCoordinate` → `TextureSampleParameter2D.T_BodyMask.UVs`.
2. `T_BodyMask.R × VertexColor.A` → `BodyMask`.
3. `VertexColor.G` збережіть як `ErosionBias` для наступного test.
4. Preview `BodyMask` у Emissive.

### Крок 5 — Побудуйте color hierarchy

```text
BodyColor = Lerp(ColorLow, ColorHigh, VertexColor.B)
BodyEmissive = BodyColor × BodyIntensity × BodyMask
RimEmissive = RimColor × RimIntensity × FresnelBand × BodyMask
FinalEmissive = BodyEmissive + RimEmissive
```

Не використовуйте Rim як opacity source: edge accent і silhouette mask мають незалежні ролі.

### Крок 6 — Побудуйте WPO

```text
PhaseCycles = Time × WPOSpeed + TexCoord.V × WPOFrequency
Wave = Sine(PhaseCycles)
SignedAmount = Wave × WPOAmplitude × VertexColor.R
WPO = VertexNormalWS × SignedAmount
```

Підключіть `WPO` до `World Position Offset`.

Material expression `Sine` з default `Period=1` читає input у cycles: діапазон 0–1 є одним повним повтором. Множник `2π` потрібен для HLSL `sin()` із radians, але не для цього Material node contract. Якщо `Period` змінено в Details, зафіксуйте його в connection specification.

### Крок 7 — Додайте opacity

```text
Opacity = saturate(BodyMask × OpacityScale)
```

Підключіть до `Opacity`. На Additive material перевірте, що чорний background не маскує silhouette problem.

### Крок 8 — Додайте debug views

Один `DebugMode` scalar:

- 0 — final;
- 1 — Vertex R;
- 2 — Vertex G;
- 3 — Vertex B;
- 4 — Vertex A;
- 5 — Fresnel full;
- 6 — Fresnel band;
- 7 — Body mask.

Для production краще `Static Switch Parameters` або окремий debug material, щоб runtime branches не лишалися в final shader. У навчальній версії допустимий scalar chain лише для перевірки.

### Крок 9 — Створіть instances

- `MI_VFX_MeshVertexAnim_Calm`: amplitude 2, speed .6, rim intensity 2.
- `MI_VFX_MeshVertexAnim_Burst`: amplitude 8, speed 2.5, rim intensity 6.
- `MI_VFX_MeshVertexAnim_NoRim`: rim intensity 0.

### Крок 10 — Виконайте bounds test

1. Розташуйте camera так, щоб mesh був біля краю viewport.
2. Порівняйте amplitude 0 і максимальний production amplitude.
3. Рухайте camera та actor.
4. Зафіксуйте момент раннього culling, якщо він є.
5. Зменште amplitude або скоригуйте bounds.
6. Повторіть test у Niagara Mesh Renderer після L07-06.

## 12. Точні назви nodes, properties і connections

### Node inventory

```text
TextureCoordinate
TextureSampleParameter2D "T_BodyMask"
VertexColor
ParticleColor
Time
Multiply × 13
Add × 3
Sine
VertexNormalWS
Fresnel
SmoothStep × 2
Subtract
Saturate × 2
Lerp
ScalarParameter × 13
VectorParameter × 3
StaticSwitchParameter або debug If-chain
```

### Fresnel function connections

```text
FresnelExponent → Fresnel.ExponentIn
Fresnel.Result → SmoothStep_Outer.Value
BandOuterStart → SmoothStep_Outer.Min
BandOuterEnd → SmoothStep_Outer.Max
Fresnel.Result → SmoothStep_Inner.Value
BandInnerStart → SmoothStep_Inner.Min
BandInnerEnd → SmoothStep_Inner.Max
SmoothStep_Outer.Result → Subtract_Band.A
SmoothStep_Inner.Result → Subtract_Band.B
Subtract_Band.Result → Saturate_Band.Input
Fresnel.Result → FunctionOutput.FullFresnel
Saturate_Band.Result → FunctionOutput.Band
```

Exact `SmoothStep` input labels may display as `Min`, `Max`, `Value` or a version-specific ordering:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Body/color connections

```text
TextureCoordinate.Result → T_BodyMask.UVs
T_BodyMask.R → Multiply_BodyMask.A
VertexColor.A → Multiply_BodyMask.B
Multiply_BodyMask.Result → BodyMask

ColorLow → Lerp_BodyColor.A
ColorHigh → Lerp_BodyColor.B
VertexColor.B → Lerp_BodyColor.Alpha
Lerp_BodyColor.Result → Multiply_BodyIntensity.A
BodyIntensity → Multiply_BodyIntensity.B
Multiply_BodyIntensity.Result → Multiply_BodyMaskColor.A
BodyMask → Multiply_BodyMaskColor.B

RimColor → Multiply_RimIntensity.A
RimIntensity → Multiply_RimIntensity.B
Multiply_RimIntensity.Result → Multiply_RimBand.A
FresnelBand → Multiply_RimBand.B
Multiply_RimBand.Result → Multiply_RimBody.A
BodyMask → Multiply_RimBody.B
Multiply_BodyMaskColor.Result → Add_FinalEmissive.A
Multiply_RimBody.Result → Add_FinalEmissive.B
Add_FinalEmissive.Result → Material.Emissive Color

BodyMask → Multiply_Opacity.A
OpacityScale → Multiply_Opacity.B
Multiply_Opacity.Result → Saturate_Opacity.Input
Saturate_Opacity.Result → Material.Opacity
```

### WPO connections

```text
Time.Result → Multiply_TimeSpeed.A
WPOSpeed → Multiply_TimeSpeed.B
TextureCoordinate.V → Multiply_UVFrequency.A
WPOFrequency → Multiply_UVFrequency.B
Multiply_TimeSpeed.Result → Add_Phase.A
Multiply_UVFrequency.Result → Add_Phase.B
Add_Phase.Result → Sine.Input
Sine.Period = 1
Sine.Result → Multiply_WaveAmplitude.A
WPOAmplitude → Multiply_WaveAmplitude.B
Multiply_WaveAmplitude.Result → Multiply_VertexInfluence.A
VertexColor.R → Multiply_VertexInfluence.B
VertexNormalWS.Result → Multiply_WPO.A
Multiply_VertexInfluence.Result → Multiply_WPO.B
Multiply_WPO.Result → Material.World Position Offset
```

`ParticleColor` буде додано в L07-05. Якщо підключаєте зараз, множте його RGB у final color, A — у opacity, і встановіть predictable renderer defaults.

## 13. Стартові значення параметрів

| Parameter | Default | Safe study range |
|---|---:|---:|
| FresnelExponent | 3 | 0.5–8 |
| BandOuterStart/End | .15/.45 | 0–1, Start < End |
| BandInnerStart/End | .55/.85 | 0–1, Start < End |
| WPOAmplitude | 4 cm | 0–10 cm |
| WPOSpeed | 1 | −3–3 |
| WPOFrequency | 2 | .25–8 |
| BodyIntensity | 2 | 0–8 |
| RimIntensity | 4 | 0–12 |
| OpacityScale | 1 | 0–2 |

Це навчальні values, не universal budgets.

## 14. Очікуваний результат кожного етапу

| Етап | Видимий доказ |
|---|---|
| Function | Full Fresnel і band preview відрізняються |
| Vertex debug | Кожен RGBA channel показує власний painted pattern |
| Body | Texture mask × Vertex A формує silhouette |
| Color | Vertex B змішує два colors без зміни opacity |
| WPO | Vertex R визначає, де geometry рухається |
| Bounds | Maximum amplitude не спричиняє раннього culling у production view |
| Instances | Calm/Burst/NoRim відрізняються без duplicate parent graph |

## 15. Самостійна вправа

### EX04-04-A — Vertex-driven energy cone

Створіть energy cone/ring, де:

- R блокує deformation біля attachment base;
- B переносить color із dark saturated body до light core;
- A прибирає один outer edge;
- Fresnel band займає менше 25% projected area;
- WPO не виходить за documented safe amplitude;
- є screenshots debug R/B/A, final і bounds test.

Не копіюйте guided parameter values дослівно. Змініть frequency, palette і band placement.

## 16. Додаткова складніша вправа

### EX04-04-B — Два deformation modes

Додайте `StaticSwitchParameter UseRadialPulse`:

- false — normal-wave mode з уроку;
- true — radial expansion від object pivot або mesh-local direction.

Вимоги:

1. обидва modes використовують Vertex R;
2. collision limitation задокументована;
3. один instance працює як restrained aura shell;
4. другий — як short burst;
5. є instruction-count і bounds comparison;
6. runtime effect не використовує scalar `If` для mode, якщо mode не змінюється під час гри.

## 17. Три рівні підказок

### EX04-04-A

1. **Напрям:** спочатку preview-те `VertexColor.R`, не WPO.
2. **Структура:** `Sine(Time×Speed + UV.V×Frequency) × Amplitude × R`, потім множення на `VertexNormalWS`; Material `Sine` працює в cycles при `Period=1`.
3. **Майже відповідь:** якщо base рухається, R біля base не дорівнює 0 або імпортований Vertex Color втрачено.

### EX04-04-B

1. **Напрям:** switch має вибирати готовий offset vector.
2. **Структура:** обидва branches закінчуються `Direction × SignedAmount × VertexR`.
3. **Майже відповідь:** normal mode бере `VertexNormalWS`; radial mode — normalized vector від local pivot до vertex, перетворений у world direction.

Повний розв’язок: [L04-04 answers](../EXERCISE_ANSWERS/L04-04_fresnel_wpo_answers.md).

## 18. Типові помилки

| Помилка | Симптом | Причина | Виправлення |
|---|---|---|---|
| Absolute position подано в WPO | Mesh стрибає далеко | Потрібен offset, не position | Подавайте direction × amount |
| Усі vertices рухаються однаково | Solid translation | Однаковий phase/mask | Додайте UV/position phase та Vertex R |
| WPO виглядає ламано | Великі polygons | Низька vertex density | Subdivide тільки де потрібен silhouette |
| Fresnel заливає center | Низький exponent/base reflect | Немає band remap | Preview і звузьте mask |
| Mesh рано зникає | Culling | WPO за bounds | Обмежте amplitude/налаштуйте bounds |
| Vertex channels чорні | Import/paint issue | Colors не збережені | Перевірте DCC export/import і mesh viewer |
| Pattern пливе у світі | World-space coordinate | Невірний space | Використайте UV/local coordinate |
| Backface темний/дивний | Thin two-sided mesh | Normals і two-sided behavior | Перевірте Two Sided та normals |

## 19. Troubleshooting

| Симптом | Діагностичний порядок |
|---|---|
| Немає WPO | `Amplitude` → Vertex R debug → Sine output → VertexNormalWS → material property |
| WPO тільки в preview | Перевірте instance override, renderer material, bounds і component mobility |
| Fresnel не змінюється | Orbit camera; перевірте normals і чи mask не saturate-иться раніше |
| Black mesh | Emissive branch → BodyMask → texture import → blend/shading properties |
| Incorrect color regions | Preview Vertex B; перевірте color import і Lerp Alpha |
| Effect disappears edge-on | Two Sided, mesh thickness, bounds, opacity і Fresnel/body relationship |
| Niagara ignores material | Renderer material slot, override, Mesh Renderer binding; поверніться після L07-06 |

Якщо назва property, import option або renderer binding відрізняється:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 20. Performance considerations

- WPO додає vertex shader math; cost масштабується з кількістю vertices та instances.
- Translucent/Additive pixel cost і overdraw часто дорожчі за саме WPO.
- `Two Sided` може збільшити rasterized fragments.
- Fresnel, два SmoothStep і кілька color branches додають ALU; вимикайте непотрібні features static switches.
- Не збільшуйте topology лише заради detail, який не змінює silhouette.
- Large bounds зменшують culling efficiency; надто малі bounds дають popping.
- Debug branches не мають залишатися у shipping parent без причини.
- Порівнюйте `Shader Complexity`, material stats, overdraw view і GPU capture на цільовому обладнанні.

Числовий budget для vertices, instructions або milliseconds:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 21. Запитання для самоперевірки

1. Від чого залежить базове Fresnel value?
2. Чому Fresnel не є silhouette/opacity mask за замовчуванням?
3. Що саме очікує input `World Position Offset`?
4. Чому low-poly mesh не дає плавної дрібної WPO-хвилі?
5. Чим відрізняється UV-locked phase від world-position phase?
6. Який channel contract використано в уроці?
7. Чому WPO не можна вважати collision animation?
8. Які дві протилежні bounds problems можливі?
9. Коли static switch кращий за runtime scalar branch?
10. Які debug outputs треба перевірити до final look?

## 22. Відповіді

1. Від dot product між surface normal і view direction, інвертованого та сформованого exponent.
2. Він view-dependent і зазвичай описує edge response, а не стабільну shape coverage.
3. Вектор зміщення vertex від початкової position.
4. Vertex shader рухає наявні vertices й не створює нові.
5. UV phase рухається разом із mesh; world phase лишається відносно world coordinates.
6. R=WPO influence, G=erosion bias, B=color blend, A=opacity/shape weight.
7. Material змінює rendered vertices, а collision geometry лишається окремою.
8. Малі bounds спричиняють popping; надмірні — погіршують culling efficiency.
9. Коли feature configuration не повинна змінюватися в runtime.
10. RGBA vertex channels, body mask, full Fresnel, band і signed wave/WPO magnitude.

## 23. Self-check checklist

- [ ] `MF_VFX_FresnelBand` має окремі Full і Band outputs.
- [ ] Я можу пояснити Fresnel без фрази «це glow node».
- [ ] WPO branch подає offset, не absolute position.
- [ ] Channel contract записано поруч із asset.
- [ ] Кожен RGBA channel перевірено окремо.
- [ ] Maximum WPO перевірено біля viewport edge.
- [ ] Collision limitation записано.
- [ ] Calm/Burst/NoRim — instances одного parent.
- [ ] Debug feature видаляється або компілюється static для final.
- [ ] Є докази продуктивності, а не лише суб’єктивний вигляд.

## 24. Mastery criteria

Урок зараховано, якщо:

1. Fresnel band керується незалежно від body mask;
2. WPO має signed temporal variation і spatial phase;
3. Vertex R/B/A виконують різні задокументовані ролі;
4. base attachment може лишатися нерухомим;
5. material переживає camera orbit без неочікуваного silhouette collapse;
6. bounds test виконано на максимальній amplitude;
7. студент із чистого graph відтворює WPO connection chain без копіювання;
8. EX04-04-A набирає ≥80% за lesson checklist.

## 25. Підсумок

- Fresnel — view-angle mask, яку треба art-direct.
- WPO — vertex offset, обмежений topology, bounds і відсутністю collision changes.
- Vertex Color перетворює один mesh на керований data carrier.
- Space, channel contract і debug views важливіші за випадкове ускладнення graph.
- Reusable function та Material Instances відокремлюють architecture від look variants.

## 26. Зв’язок із наступними уроками

У [L04-05](05_sprite_mesh_ribbon_and_decal_materials.md) ці principles розділяються на renderer-specific templates. Mesh variant успадкує WPO/Vertex Color, Sprite — camera-facing UV/Particle Color, Ribbon — trail coordinates, Decal — projection/deferred-decal restrictions.

## 27. Офіційні джерела

- [Using Fresnel in Unreal Engine Materials](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-fresnel-in-your-unreal-engine-materials) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Math Material Expressions — Sine](https://dev.epicgames.com/documentation/en-us/unreal-engine/math-material-expressions-in-unreal-engine) — Epic Games, UE 5.8; input 0–1 is one repeating cycle when `Period=1`, доступ 2026-07-27.
- [World Position Offset Material Functions](https://dev.epicgames.com/documentation/en-us/unreal-engine/world-position-offset-material-functions-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Coordinates Material Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/coordinates-material-expressions-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Material Inputs](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-inputs-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Material Properties](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-properties) — Epic Games, UE 5.8, доступ 2026-07-27.

## 28. Рекомендовані скриншоти або схеми

```text
Скриншот 1
Відкрити: MF_VFX_FresnelBand.
Показати: два SmoothStep, Subtract, Saturate, два outputs.
Виділити: ordered thresholds і preview Band.
```

```text
Скриншот 2
Відкрити: M_VFX_MeshVertexAnim.
Показати: WPO branch повністю.
Виділити: Time/UV phase, Vertex R і VertexNormalWS.
```

```text
Скриншот 3
Відкрити: test level.
Показати: Calm/Burst instances біля edge viewport.
Виділити: bounds test і wireframe density comparison.
```
