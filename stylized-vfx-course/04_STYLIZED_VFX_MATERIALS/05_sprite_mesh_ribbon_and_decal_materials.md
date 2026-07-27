# 1. L04-05 — Матеріали для Sprite, Mesh, Ribbon і Decal

| Поле | Значення |
|---|---|
| Блок | 04 — Stylized VFX Materials |
| Lesson ID | L04-05 |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | Чотири renderer-ready parent materials, shared function і renderer validation matrix |
| Mastery gate | Обґрунтовано вибрати renderer/material pair і довести його поведінку на depth, sorting, camera та projection tests |

## 2. Результат уроку

Ви навчитеся:

- розділяти shared look logic та renderer-specific material properties;
- створювати parent templates для Sprite, Mesh, Ribbon і Decal;
- розуміти, які controls належать material, а які Niagara Renderer;
- перевіряти translucent intersections, sorting і overdraw;
- готувати UV contract для trail/ribbon;
- тестувати decal projection на floor, wall, corner і moving receiver;
- відмовлятися від renderer, якщо він не відповідає silhouette або gameplay cue.

Доказ: одна validation scene з чотирма renderer families, не менше восьми failure-case screenshots і журнал рішень.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Renderer/material mental model | 1.0 | 0 |
| Controlled experiments | 0.5 | 0.5 |
| Guided template build | 3.0 | 3.0 |
| Самостійні вправи | 2.0 | 2.0 |
| Validation, performance, self-check | 1.5 | 1.0 |
| **Разом** | **8.0** | **6.5 (81.25%)** |

## 4. Prerequisites

| Навичка | Де | Перевірка |
|---|---|---|
| Domain, Blend Mode, Unlit, depth | [L03-07](../03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) | Назвіть compile-time properties |
| Material Instances/Functions | [L03-08](../03_MATERIAL_FOUNDATIONS/08_instances_functions_switches_and_debugging.md) | Змініть look без duplicate graph |
| HDR/AlphaComposite comparison | [L04-03](03_gradient_mapping_hdr_and_stylized_color.md) | A/B на white background |
| Vertex Color/WPO | [L04-04](04_fresnel_wpo_and_vertex_animation.md) | Відтворіть mesh WPO chain |
| Basic Niagara renderer concept | Можна пройти preview зараз; повна практика в блоці 07 | Відрізніть emitter від renderer |

## 5. Нові терміни

| Термін | Пояснення | Приклад |
|---|---|---|
| Renderer contract | Узгоджені data, UV, orientation, material і bindings для renderer | Ribbon U=distance/life, V=width |
| Soft intersection | Згасання translucent shape біля opaque geometry | `DepthFade` біля floor |
| Translucent sorting | Порядок змішування transparent primitives/particles | Дві overlapping smoke cards |
| Projection volume | Об’єм, у межах якого decal проектується на receivers | Ground crack box |
| Receiver | Surface, яка приймає decal | Floor, wall, character mesh |
| Trail UV | Coordinates уздовж length і width ribbon | U від head до tail, V через width |
| Renderer binding | Зв’язок renderer property із Niagara attribute | Color ← Particles.Color |

## 6. Навіщо ця тема потрібна VFX-фахівцю

Один material graph не робить effect універсальним. Renderer визначає geometry і спосіб, яким shape потрапляє на екран:

- Sprite — дешева camera-facing card, добра для bursts, smoke puffs, sparks;
- Mesh — об’ємна або контрольована geometry для arcs, cones, rings, shards;
- Ribbon — зв’язна смуга вздовж particle history/links для trails, beams і slashes;
- Decal — projection на environment для cracks, scorch, telegraph і lingering area.

Якщо використовувати неправильний renderer:

- sprite видає себе як плоска card при camera pitch;
- mesh витрачає geometry там, де достатньо sprite;
- ribbon twisting руйнує readable width;
- decal розтягується на vertical surfaces або сторонні receivers.

Матеріал повинен приймати дані, які renderer реально постачає. Renderer, зі свого боку, має bindings, orientation, UV і sorting, узгоджені з material.

## 7. Теорія простими словами

Shared look logic:

```text
UV → ShapeTexture → ShapeMask
ShapeMask + ColorControls → Emissive
ShapeMask + OpacityControls → Opacity
```

Renderer-specific shell:

```text
Sprite:  camera-facing geometry + Particle Color + optional SubUV
Mesh:    authored geometry + Vertex Color + WPO
Ribbon:  trail geometry + ribbon UV + per-particle color/width
Decal:   projected volume + receiver response + decal domain
```

Material Function може повторно використати color/mask math, але не може перетворити `Surface` material на `Deferred Decal`: domain і blend settings належать parent material.

## 8. Детальні технічні пояснення

### Sprite material

Sprite має бути читабельним у projected screen size. Типові потреби:

- alpha/shape texture;
- color/intensity;
- Particle Color;
- SubUV/flipbook support;
- optional `DepthFade`;
- no accidental lighting, якщо effect unlit;
- honest test на bright background.

`DepthFade` пом’якшує intersection з opaque geometry, але може розмити навмисний hard contact. Для impact ring або ground-aligned sprite іноді краще geometry/decal.

### Mesh material

Mesh template успадковує:

- UV і Texture mask;
- Vertex Color;
- optional Fresnel;
- optional WPO;
- Particle Color для Niagara Mesh Renderer;
- Two Sided лише коли geometry цього потребує.

Mesh не гарантує правильного sort із translucent layers. Geometry intersection і concave transparent objects можуть лишатися проблемними.

### Ribbon material

Material бачить UV, але те, як Niagara генерує ribbon UV, налаштовується в Ribbon Renderer. Для texture, що тягнеться від head до tail, потрібно домовитися:

```text
U = distance або normalized length уздовж ribbon
V = 0..1 через width
```

Якщо texture має scroll-итися:

```text
RibbonUV = float2(U × TileU + Time × ScrollU, V)
```

Не робіть припущення, що `TexCoord.U` завжди 0 у head і 1 у tail. Перевірте renderer UV settings і actual debug texture.

Exact Ribbon UV Distribution/tiling UI у UE 5.8.x:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Decal material

Decal — окремий domain. Він проектує material outputs у volume на receiver surfaces. Важливі обмеження:

- projection може потрапити на floor і wall одночасно;
- гострий кут розтягує shape;
- receiver settings можуть забороняти decals;
- translucent decal cost залежить від покриття екрана і receivers;
- Decal material не є Niagara Sprite material.

У UE 5.8 доступні DBuffer/decal workflows, але exact `Decal Blend Mode`, доступні inputs і Substrate interaction залежать від project renderer/settings. Для core course використовуйте non-Substrate path і перевірте конкретний 5.8.x build:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Sorting responsibility

Material визначає blend/depth behavior. Niagara Renderer визначає particle sort mode, renderer order та деякі visibility/culling settings. Actor/component translucency sort priority може впливати між components. Один slider не виправляє всі випадки; потрібна test matrix.

## 9. Візуальні й математичні приклади

### AlphaComposite intuition

Для premultiplied source:

```text
Out = SourceColor + DestinationColor × (1 - SourceAlpha)
```

Якщо `SourceColor` не узгоджено з alpha, edge може бути надто яскравим або мати halo. Порівнюйте parent materials із тотожною shape texture.

### DepthFade

```text
SoftOpacity = BaseOpacity × DepthFade(FadeDistance)
```

Початковий `FadeDistance=20 cm` означає artistic transition scale, не physical law.

### Ribbon UV debug

```text
DebugColor = float3(frac(U × 4), V, 0)
```

Чотири red cycles уздовж trail і green gradient через width одразу показують orientation, tiling і flipping.

### Decal angle

Projection direction майже паралельний surface → footprint розтягується. Якщо effect має бути круглим на будь-якій arbitrary surface, потрібне orientation logic або інший спосіб подання.

## 10. Controlled experiments

### CE04-05-A — Sprite blend/depth grid

Створіть grid:

- rows: Additive, Translucent, AlphaComposite;
- columns: black, mid-gray, white background;
- second pass: intersect each sprite with opaque cube;
- capture with bloom off and on.

Запишіть dominant failure кожного blend mode.

### CE04-05-B — Mesh проти Sprite

Покажіть однакову ring texture:

1. на camera-facing sprite;
2. на horizontal ring mesh;
3. camera pitch: 0°, 35°, 70°;
4. actor rotation: 0°, 90°.

Запишіть, який спосіб подання зберігає запланований силует на площині землі.

### CE04-05-C — Ribbon UV checker

Виведіть U/V debug gradient на short і long trail. Змініть trail length удвічі. Визначте, чи texture stretch-иться, tile-иться або зберігає world-unit density.

### CE04-05-D — Decal receiver matrix

Project decal на:

- floor;
- wall;
- 90° corner;
- static prop;
- skeletal/moving receiver, якщо scope effect цього вимагає.

Відмітьте unintended receivers і angle stretching.

## 11. Покрокова керована практика

### Крок 1 — Створіть shared function

Назва: `MF_VFX_ColorShapeCore`.

Inputs:

```text
ShapeMask (Scalar)
ColorCoordinate (Scalar)
ColorA (Vector3)
ColorB (Vector3)
Tint (Vector3)
Intensity (Scalar)
OpacityScale (Scalar)
```

Logic:

```text
ClampedShape = saturate(ShapeMask)
MappedColor = lerp(ColorA, ColorB, saturate(ColorCoordinate))
Emissive = MappedColor × Tint × Intensity × ClampedShape
Opacity = saturate(ClampedShape × OpacityScale)
```

Outputs: `Emissive`, `Opacity`, `DebugShape`.

Function не sample-ить texture: UV/source sampling лишається renderer parent, тому shared logic не прив’язана до Sprite/Ribbon/Mesh.

### Крок 2 — `M_VFX_Sprite_Template`

Properties:

| Property | Value |
|---|---|
| Material Domain | Surface |
| Blend Mode | AlphaComposite для основного test; окремий Additive parent для A/B |
| Shading Model | Unlit |
| Two Sided | true, якщо sprite backface може бути видимим |

Parameters:

```text
T_Shape
ColorA
ColorB
Intensity
OpacityScale
FadeDistance
UseDepthFade (Static Bool)
```

Logic:

```text
Shape = T_Shape.R
Core = MF_VFX_ColorShapeCore(
  Shape,
  T_Shape.G,
  ColorA,
  ColorB,
  ParticleColor.RGB,
  Intensity,
  OpacityScale × ParticleColor.A
)
FinalOpacity = UseDepthFade
  ? Core.Opacity × DepthFade(FadeDistance)
  : Core.Opacity
```

Підключіть `Core.Emissive` до `Emissive Color`, `FinalOpacity` до `Opacity`.

### Крок 3 — `M_VFX_Mesh_Template`

Duplicate architecture, не parent asset properties:

- `Surface`, `AlphaComposite` або Additive variant, `Unlit`;
- `Two Sided` за geometry;
- `T_Shape.R × VertexColor.A`;
- `ColorCoordinate=VertexColor.B`;
- `Tint=ParticleColor.RGB`;
- opacity множиться на `ParticleColor.A`;
- optional static features `UseFresnel`, `UseWPO`.

Вставте verified WPO/Fresnel functions із L04-04. Не копіюйте всередину великий graph, якщо function уже існує.

### Крок 4 — `M_VFX_Ribbon_Template`

Properties: `Surface`, `AlphaComposite` test parent, `Unlit`, `Two Sided=true`.

Parameters:

```text
T_Ribbon
TileU = 1
ScrollU = 0
EdgePower = 1
FadeDistance = 10
UseDepthFade = true
```

Logic:

```text
RibbonUV = float2(TexCoord.U × TileU + Time × ScrollU, TexCoord.V)
Sample = T_Ribbon(RibbonUV)
WidthMask = pow(saturate(1 - abs(TexCoord.V × 2 - 1)), EdgePower)
Shape = Sample.R × WidthMask
ColorCoordinate = Sample.G
Core = shared function
```

Застосуйте `ParticleColor`; у L07-07 узгодьте UV/bindings з Niagara Ribbon Renderer.

### Крок 5 — `M_VFX_Decal_Template`

Створюйте з чистого material, не duplicate Surface parent.

Baseline:

| Property | Value |
|---|---|
| Material Domain | Deferred Decal |
| Blend Mode / Decal Blend Mode | Project-compatible translucent/DBuffer color path |
| Shading path | Мінімальний набір outputs для color/emissive/opacity goal |

Parameters:

```text
T_DecalShape
ColorA
ColorB
Intensity
OpacityScale
AngleTrim
```

Logic:

```text
Shape = T_DecalShape.R
ColorCoordinate = T_DecalShape.G
Core = shared function
```

Підключіть тільки outputs, потрібні конкретному decal mode. Exact available pins/settings:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Не підключайте WPO або `DepthFade` за інерцією: projection має іншу модель.

### Крок 6 — Зберіть validation level

Zones:

1. three-background panels;
2. opaque intersection stairs;
3. camera orbit mesh station;
4. short/long ribbon lane;
5. floor-wall-corner decal bay;
6. overdraw stack;
7. distance/readability markers.

Для кожного template поставте `MI_*_Debug`, `MI_*_Production` і one intentionally broken instance.

### Крок 7 — Заповніть renderer validation matrix

| Test | Sprite | Mesh | Ribbon | Decal |
|---|---|---|---|---|
| Camera orbit | Pass/fail | Pass/fail | Pass/fail | n/a projection |
| Bright background |  |  |  |  |
| Opaque intersection |  |  |  | receiver test |
| Sorting overlap |  |  |  | volume overlap |
| UV orientation |  |  |  | projection orientation |
| Screen coverage |  |  |  |  |
| Unintended receivers | n/a | n/a | n/a |  |

`n/a` тут означає, що конкретний test не відповідає цьому способу подання; це не дозволено як заміна невиконаного relevant test.

## 12. Точні назви nodes, properties і connections

### Shared core

```text
ShapeMask → Saturate_Shape.Input
ColorCoordinate → Saturate_ColorCoordinate.Input
ColorA → Lerp_Color.A
ColorB → Lerp_Color.B
Saturate_ColorCoordinate.Result → Lerp_Color.Alpha
Lerp_Color.Result → Multiply_Tint.A
Tint → Multiply_Tint.B
Multiply_Tint.Result → Multiply_Intensity.A
Intensity → Multiply_Intensity.B
Multiply_Intensity.Result → Multiply_EmissiveShape.A
Saturate_Shape.Result → Multiply_EmissiveShape.B
Saturate_Shape.Result → Multiply_Opacity.A
OpacityScale → Multiply_Opacity.B
Multiply_Opacity.Result → Saturate_Opacity.Input
```

### Sprite parent

```text
TextureCoordinate.Result → T_Shape.UVs
T_Shape.R → MF_Core.ShapeMask
T_Shape.G → MF_Core.ColorCoordinate
ColorA → MF_Core.ColorA
ColorB → MF_Core.ColorB
ParticleColor.RGB → MF_Core.Tint
Intensity → MF_Core.Intensity
OpacityScale × ParticleColor.A → MF_Core.OpacityScale
MF_Core.Emissive → Material.Emissive Color
MF_Core.Opacity × DepthFade.Result → Material.Opacity
```

`DepthFade`:

```text
MF_Core.Opacity → DepthFade.Opacity
FadeDistance → DepthFade.FadeDistance
```

Exact `DepthFade` pin labels:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Ribbon UV

```text
TextureCoordinate.U → Multiply_TileU.A
TileU → Multiply_TileU.B
Time.Result → Multiply_ScrollU.A
ScrollU → Multiply_ScrollU.B
Multiply_TileU.Result → Add_RibbonU.A
Multiply_ScrollU.Result → Add_RibbonU.B
Add_RibbonU.Result → AppendVector.A
TextureCoordinate.V → AppendVector.B
AppendVector.Result → T_Ribbon.UVs
```

Width:

```text
TextureCoordinate.V × 2 → Subtract_WidthSigned.A
Constant 1 → Subtract_WidthSigned.B
Abs → OneMinus → Saturate → Power(EdgePower) → WidthMask
T_Ribbon.R × WidthMask → ShapeMask
```

### Renderer-side items to verify later

```text
Niagara Sprite Renderer:
  Material
  Alignment/Facing Mode
  Sort Mode
  Renderer Visibility
  Bindings: Color, Position, SpriteSize, SpriteRotation, SubImageIndex

Niagara Mesh Renderer:
  Meshes
  Material Overrides
  Sort Mode
  Bindings: Color, Scale, Orientation

Niagara Ribbon Renderer:
  Material
  Ribbon Shape/Width
  UV settings
  Bindings: RibbonID, RibbonWidth, Color
```

Exact labels/defaults у UE 5.8.x:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 13. Стартові значення параметрів

| Template | Parameter | Start |
|---|---|---:|
| Shared | Intensity | 2 |
| Shared | OpacityScale | 1 |
| Sprite | FadeDistance | 20 cm |
| Mesh | WPOAmplitude | 0–4 cm |
| Mesh | FresnelExponent | 3 |
| Ribbon | TileU | 1 |
| Ribbon | ScrollU | −0.25 |
| Ribbon | EdgePower | 1.5 |
| Ribbon | FadeDistance | 10 cm |
| Decal | OpacityScale | .8 |
| Decal | Intensity | 1 |

Ці values — safe study start, не production budget.

## 14. Очікуваний результат кожного етапу

| Етап | Доказ |
|---|---|
| Shared function | Той самий palette mapping видно в трьох Surface parents і Decal-compatible branch |
| Sprite | Particle Color-ready, soft/hard intersection variants |
| Mesh | Vertex Color/WPO/Fresnel features вмикаються незалежно |
| Ribbon | U/V debug не перевернутий, width edge контрольований |
| Decal | Ground footprint readable, unintended wall projection зафіксовано/обмежено |
| Matrix | Кожен relevant test має pass/fail і remediation |
| Performance | Overdraw/Shader Complexity capture до та після одного optimization decision |

## 15. Самостійна вправа

### EX04-05-A — Renderer translation study

Один stylized crescent motif реалізуйте трьома способами:

1. Sprite;
2. Mesh;
3. Ribbon.

Для кожного:

- одна palette і близька screen size;
- 3 camera angles;
- bright/dark background;
- opaque intersection;
- 2-layer overlap;
- cost/readability note.

Виберіть основний спосіб подання для melee slash і захистіть рішення п’ятьма конкретними спостереженнями.

## 16. Додаткова складніша вправа

### EX04-05-B — Ground telegraph + impact family

Створіть family:

- Decal telegraph на ground;
- Mesh або Sprite impact ring;
- Ribbon accent, що обходить частину circumference або веде до center.

Вимоги:

1. shared palette controls;
2. no unintended wall decal у заданій arena;
3. contact edges читаються без надмірного DepthFade;
4. renderer choices пояснені;
5. High/Low material instances;
6. one failure capture і виправлення;
7. performance capture з production camera.

## 17. Три рівні підказок

### EX04-05-A

1. **Напрям:** спочатку зафіксуйте intended plane motif.
2. **Структура:** Sprite залежить від facing; Mesh — від authored plane; Ribbon — від generated trail frame.
3. **Майже відповідь:** для sword arc з контрольованою кривизною Mesh часто дає найстабільніший silhouette; Ribbon кращий, коли arc має слідувати рухомій точці.

### EX04-05-B

1. **Напрям:** telegraph і impact не зобов’язані використовувати однаковий renderer.
2. **Структура:** Decal = stable projected area; Mesh/Sprite = timed rising burst; Ribbon = directional accent.
3. **Майже відповідь:** обмежте decal projection volume по depth/extent і receiver policy; не намагайтеся замаскувати wall spill тільки texture alpha.

Повні розв’язки: [L04-05 answers](../EXERCISE_ANSWERS/L04-05_renderer_materials_answers.md).

## 18. Типові помилки

| Помилка | Симптом | Виправлення |
|---|---|---|
| Один parent для Surface і Decal | Decal outputs/domain не працюють | Окремі parents, shared functions |
| Sprite motif для ground plane | Shape повертається до camera | Ground mesh або decal |
| DepthFade всюди | Contact cue розмитий | Feature switch і purpose test |
| Ribbon UV припущено | Texture stretch/flip | UV debug material + renderer settings |
| AlphaComposite без premultiplied logic | Bright halo/edge | Узгодьте source color/alpha і A/B |
| Particle Color не підключено | Niagara color changes ignored | RGB/A connections і renderer binding |
| Two Sided на всіх materials | Зайва cost/дивні backfaces | Лише thin geometry, що потребує |
| Decal volume надто глибокий | Wall/props отримують telegraph | Обмежте volume/receiver scope |
| Sort priority як універсальний fix | Інші views ламаються | Зменшіть overlap, розділіть спосіб подання, test matrix |

## 19. Troubleshooting

| Симптом | Послідовність |
|---|---|
| Sprite чорний | Material domain/blend/shading → texture → emissive → Particle Color defaults |
| Sprite різко врізається у floor | DepthFade branch → fade distance → opaque depth availability |
| Mesh видимий лише з одного боку | Normals → Two Sided → culling/orientation |
| Ribbon texture стоїть/перевернута | TexCoord debug → Ribbon Renderer UV → Scroll sign → bindings |
| Ribbon width mask чорна | V range → `V×2−1` → Abs → OneMinus |
| Decal не видно | Domain/mode → receiver setting → projection orientation/volume → material outputs |
| Decal на сторонніх props | Volume extent → receiver policy → layer/channel strategy |
| Overlap flickers/pops | Sort mode/priority → geometry order → overlap reduction → blend choice |

Якщо exact renderer property не збігається з назвою в курсі:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 20. Performance considerations

- Translucent покриття екрана і layer count — головні risks для Sprite/Ribbon/Mesh VFX.
- Large soft sprites можуть бути дорожчі за маленький mesh, навіть якщо мають лише два triangles.
- Mesh vertex cost зростає з topology та WPO, pixel cost — з coverage/two-sided layers.
- Ribbon cost зростає з segment count, width, overlapping turns і material complexity.
- Decal cost залежить від projection volume, покриття екрана, receivers і chosen decal path.
- Shared functions покращують architecture, але не роблять graph безкоштовним.
- Static features створюють permutations; не множте switches без policy.
- Low tier має зменшувати layers/coverage/segments та вимикати cosmetic branches, зберігаючи ігрову підказку.
- Capture робіть з production camera, однаковою exposure і representative effect count.

Numeric target budgets:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 21. Запитання для самоперевірки

1. Чому Material Function не замінює окремий Decal parent?
2. Яка ключова різниця між поданням через Sprite і через Mesh?
3. Де налаштовується Ribbon UV generation?
4. Чому DepthFade може шкодити ground contact cue?
5. Які дані material очікує від Particle Color?
6. Чому sort priority не є універсальним fix?
7. Як виявити Ribbon UV orientation без готової art texture?
8. Які чотири Decal projection tests обов’язкові?
9. Що може бути дорожчим: великий Sprite чи малий Mesh?
10. Які features слід першими спрощувати на Low tier?

## 22. Відповіді

1. Domain і renderer-facing properties компілюються на parent material рівні.
2. Sprite зазвичай camera-facing generated quad; Mesh має authored geometry/orientation.
3. У Niagara Ribbon Renderer; material лише читає отримані coordinates.
4. Він розмиває shape саме там, де telegraph/impact має торкатися поверхні.
5. RGB tint і A opacity/lifetime weight за documented contract.
6. Transparent ordering залежить від primitives, components, view та overlaps.
7. Вивести `frac(U×N)` у red і V у green.
8. Floor, wall, corner і relevant moving/static receivers.
9. Великий translucent Sprite через screen coverage/overdraw.
10. Cosmetic layers, wide coverage, ribbon segments, Two Sided, optional WPO/Fresnel/distortion.

## 23. Self-check checklist

- [ ] Чотири parent materials мають documented domain/blend purpose.
- [ ] Shared function не містить renderer-specific припущень.
- [ ] Sprite має hard/soft intersection variants.
- [ ] Mesh features можна вимикати незалежно.
- [ ] Ribbon U/V перевірено debug texture.
- [ ] Decal перевірено на floor/wall/corner/receiver.
- [ ] Particle Color contract однаковий у Surface templates.
- [ ] Є three-background blend test.
- [ ] Є intentional failure і remediation.
- [ ] Low tier зберігає ігрову підказку.

## 24. Mastery criteria

Урок зараховано, якщо:

1. усі чотири templates компілюються у своїх intended domains;
2. shared color/shape logic reused без duplicate core;
3. Sprite, Mesh і Ribbon отримують Particle Color-compatible data path;
4. Ribbon UV debug однозначно пояснений;
5. Decal не проєктується на заборонені receivers у target test;
6. sorting/depth failure не приховано лише одним camera angle;
7. EX04-05-A містить доказ renderer choice;
8. optimization comparison містить visual і cost evidence;
9. оцінка ≥80/100.

## 25. Підсумок

- Renderer створює geometry/projection; material визначає її shading, mask і blend.
- Shared functions повторно використовують math, але compile-time domain лишається в parent.
- Sprite, Mesh, Ribbon і Decal мають різні failure modes.
- UV, Particle Color, sorting, depth і receiver contracts треба перевіряти, а не припускати.
- Найкращий renderer — той, що стабільно передає intended cue з production camera за прийнятною cost.

## 26. Зв’язок із наступними уроками

У [L04-06](06_niagara_material_data_and_runtime_parameters.md) templates отримають runtime data: `Particle Color`, Dynamic Material Parameters, User Parameters, renderer bindings, Blueprint-driven DMI та MPC. У блоках 07–08 кожен renderer буде зібраний у повному Niagara stack.

## 27. Офіційні джерела

- [Render Module Reference for Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine) — Epic Games, UE 5.8; Sprite, Mesh і Ribbon renderer properties, доступ 2026-07-27.
- [How to Create a Ribbon Effect in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-ribbon-effect-in-niagara-for-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Decal Materials](https://dev.epicgames.com/documentation/en-us/unreal-engine/decal-materials-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Material Blend Modes](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-blend-modes-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Depth Material Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/depth-material-expressions-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.

## 28. Рекомендовані скриншоти або схеми

```text
Схема 1
Показати: MF_VFX_ColorShapeCore в центрі; чотири окремі parent materials навколо.
Виділити: shared runtime math проти parent Domain/Blend.
```

```text
Скриншот 2
Відкрити: validation level.
Показати: Sprite/Mesh/Ribbon на black-gray-white panels.
Виділити: intersections і overlap failure.
```

```text
Скриншот 3
Відкрити: decal bay.
Показати: floor, wall, corner, prop.
Виділити: projection volume і unintended receiver.
```
