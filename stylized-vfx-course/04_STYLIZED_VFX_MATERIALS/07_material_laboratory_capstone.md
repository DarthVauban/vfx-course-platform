# 1. L04-07 — Material Laboratory

| Поле | Значення |
|---|---|
| Блок | 04 — Stylized VFX Materials |
| Lesson ID | L04-07 |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | Production-ready `VFX_Material_Lab` family, three original looks і shader-cost report |
| Mastery gate | Із письмової specification зібрати reusable material family без duplicate core graph і довести runtime/performance readiness |

## 2. Результат уроку

Ви:

- спроєктуєте material toolkit як систему contracts, а не один mega-graph;
- відділите functions, parent materials, instances, textures і debug assets;
- зберете Sprite, Mesh, Ribbon і Decal family;
- створите три оригінальні look variants з одних parents;
- проведете data-path, bounds, depth, sorting та overdraw validation;
- підготуєте High/Medium/Low feature policy;
- пройдете block assessment;
- сформуєте shader breakdown, який можна включити в опис проєкту для портфоліо.

Доказ: повний package, dependency diagram, connection specifications, 12-shot validation sheet і до/після performance report.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Architecture brief і planning | 0.5 | 0 |
| Guided laboratory build | 3.0 | 3.0 |
| Original variants і validation | 2.0 | 2.0 |
| Block assessment | 2.0 | 2.0 |
| Self-review і report | 0.5 | 0 |
| **Разом** | **8.0** | **7.0 (87.5%)** |

Assessment hours включені в цей урок і не додаються до 56 годин блока.

## 4. Prerequisites

Перед стартом мають бути пройдені:

- G03 Material Foundations;
- [L04-01](01_dissolve_erosion_and_edge_control.md) — erosion/edge;
- [L04-02](02_distortion_flow_and_fake_refraction.md) — flow/distortion;
- [L04-03](03_gradient_mapping_hdr_and_stylized_color.md) — palette/HDR;
- [L04-04](04_fresnel_wpo_and_vertex_animation.md) — Fresnel/WPO/Vertex Color;
- [L04-05](05_sprite_mesh_ribbon_and_decal_materials.md) — renderer templates;
- [L04-06](06_niagara_material_data_and_runtime_parameters.md) — data scopes/bindings.

Підготуйте чисту тестову сцену, [Material Graph Review](../CHECKLISTS/MATERIAL_GRAPH_REVIEW.md) і [Performance Pass](../CHECKLISTS/PERFORMANCE_PASS.md).

## 5. Нові терміни

| Термін | Пояснення |
|---|---|
| Material family | Узгоджений набір functions, parents та instances |
| Feature policy | Правила, які features дозволені кожному parent/tier |
| Dependency direction | Хто від кого залежить: instance → parent → function/texture |
| Parameter namespace | Naming pattern, що відображає meaning/range/scope |
| Validation matrix | Повторюваний набір scenes/cameras/debug tests |
| Cost report | Порівняння visual goal, shader stats, overdraw і runtime evidence |
| Golden instance | Мінімальна reference instance з безпечними початковими значеннями |
| Feature creep | Додавання controls без підтвердженого use case |

## 6. Навіщо ця тема потрібна VFX-фахівцю

У production матеріал оцінюють не лише за beauty frame. Він має:

- передбачувано поводитися в різних effects;
- мати зрозумілі parameter names/defaults;
- приймати runtime data;
- не ламатися на bright background, intersection або camera orbit;
- мати fallback на слабшій platform;
- дозволяти іншому artist розібрати graph;
- не дублювати виправлення в десяти copies.

Mega-material із десятками runtime branches здається гнучким, але часто створює складні permutations, debugging і hidden cost. З іншого боку, повністю окремий material для кожного effect дублює math. Material Laboratory використовує shared pure functions і невеликі renderer parents із чіткою feature policy.

## 7. Теорія простими словами

Правильний dependency graph спрямований вниз:

```text
Effect instance
  → Renderer parent
      → Shared Material Functions
      → Textures
```

Function не повинна знати, який конкретний boss використовує effect. Parent не повинен містити palette конкретної стихії. Instance не повинен змінювати compile-time domain.

Controls поділяються:

```text
Architecture: Domain, Blend, renderer contract, functions
Look: colors, intensities, thresholds, speeds, textures
Runtime: tint, charge, erode, age, global event
Quality: optional distortion, rim, second noise, WPO
```

## 8. Детальні технічні пояснення

### Reference architecture

```text
VFX_Material_Lab/
  Functions/
    MF_VFX_Remap01
    MF_VFX_ErodeEdge
    MF_VFX_FlowUV
    MF_VFX_ThreeColorRamp
    MF_VFX_FresnelBand
    MF_VFX_ColorShapeCore
  Parents/
    M_VFX_Sprite_AlphaComposite
    M_VFX_Sprite_Additive
    M_VFX_Mesh_AlphaComposite
    M_VFX_Ribbon_AlphaComposite
    M_VFX_Decal
  Instances/
    MI_VFX_Golden_*
    MI_VFX_FireSlash_*
    MI_VFX_IceRing_*
    MI_VFX_VoidProjectile_*
  Textures/
  Debug/
```

### Function boundary rules

Function доречна, якщо:

- math повторюється у двох або більше parents;
- inputs/outputs можна описати без renderer-specific state;
- intermediate output можна preview/debug;
- зміна формули має поширюватися на family.

Не ховайте в function:

- compile-time Material Domain/Blend;
- effect-specific random constants;
- undocumented texture assumptions;
- side effects або ambiguous пакування каналів.

### Static switch policy

Static switch підходить для features, що не змінюються під час одного effect instance:

- `UseSecondNoise`;
- `UseFresnel`;
- `UseWPO`;
- `UseDepthFade`;
- `UseDistortion`.

Але кожна комбінація може збільшити shader permutations. Якщо blend/domain або architecture істотно відрізняється, створіть окремий parent. Якщо feature використовується лише одним effect і дорого ускладнює всі parents, розгляньте specialized child/parent.

### Parameter policy

```text
T_*        Texture object/sample
C_*        Artist color, якщо team convention це використовує
M_*        Material-facing runtime parameter
Use*       Static Bool
*01        Guaranteed normalized scalar
*Cm        World-space centimeters
```

У course assets допускаються readable names без type prefix, але один project має обрати одну convention.

### Safe defaults

Golden instance повинна бути видимою без external writer:

- tint white;
- opacity 1;
- intensity 1–2;
- erosion не видаляє все;
- UV scale 1;
- speed 0 або помірний;
- WPO amplitude 0;
- distortion 0;
- optional features off.

### Performance evidence

Material stats — лише частина cost. Потрібні:

1. compiled instruction/sampler data;
2. Shader Complexity/overdraw view;
3. screen coverage;
4. representative effect count;
5. GPU timing на цільовому обладнанні;
6. visual comparison High/Low;
7. notes про bounds/culling.

Numeric thresholds не переносіть між hardware/platform без вимірювання.

## 9. Візуальні й математичні приклади

### Duplicate-core debt

```text
5 copied parents × 1 erosion bug fix = 5 edits + 5 regression tests
1 MF_VFX_ErodeEdge × 5 parents = 1 edit + 5 validation checks
```

Function зменшує edit duplication, але validation parents усе одно потрібна.

### Normalized runtime parameter

```text
M_Charge01 = saturate(UserCharge)
Intensity = lerp(1, 8, M_Charge01)
EdgeWidth = lerp(.02, .10, M_Charge01)
Speed = lerp(.2, 1.5, M_Charge01)
```

Один normalized input має multiple authored remaps; не використовуйте raw charge як centimeters або HDR intensity напряму.

### Quality simplification

```text
High:   body + edge + distortion + second noise + rim
Medium: body + edge + one noise
Low:    body + stable opacity/color cue
```

Low лишає timing, hue family, основний силует і gameplay area.

## 10. Controlled experiments

### CE04-07-A — Shared function propagation

1. Створіть три instances на різних renderer parents.
2. У `MF_VFX_ErodeEdge` тимчасово змініть edge debug output.
3. Переконайтеся, що всі intended parents оновилися.
4. Переконайтеся, що Decal не зламав compile через unsupported parent assumption.
5. Поверніть production logic.

### CE04-07-B — Switch/permutation audit

1. Запишіть усі Static Bool у parents.
2. Перерахуйте фактично потрібні combinations.
3. Видаліть feature, яка не має deliverable/use case.
4. Порівняйте material stats і asset count.

### CE04-07-C — Golden fallback

1. Від’єднайте Niagara writer/use plain mesh preview.
2. Встановіть default instance.
3. Перевірте black/mid/white backgrounds.
4. Material не має бути invisible, NaN або full-screen white.

### CE04-07-D — Cost ladder

На одному effect:

```text
Baseline
+ edge
+ second noise
+ distortion
+ Fresnel/WPO
+ extra translucent layer
```

Capture кожен крок з однакової camera. Визначте, який feature дає найменший visual gain на найбільшу cost.

## 11. Покрокова керована практика

### Крок 1 — Напишіть architecture brief

До graph work заповніть:

```text
Supported renderers:
Required shared functions:
Runtime inputs:
Texture channel contracts:
High/Medium/Low features:
Blend parents:
Known limitations:
Validation cameras/backgrounds:
```

### Крок 2 — Проведіть function audit

Для кожної function:

| Function | Inputs | Outputs | Used by | Debug output | Version-sensitive |
|---|---|---|---|---|---|
| ErodeEdge | mask, threshold, width | body, edge | Sprite/Mesh/Ribbon/Decal | body/edge | no |
| FlowUV | UV, flow, time, speed | UV | Sprite/Ribbon | UV color | sampler UI |
| ThreeColorRamp | value, colors, midpoint | color | all | value/ramp | color settings |
| FresnelBand | exponent/thresholds | full/band | Mesh | masks | normal behavior |

Видаліть unused inputs та ambiguous names.

### Крок 3 — Побудуйте golden parents

Виконайте exact renderer properties з L04-05. Для кожного parent:

- одна гілка вибірки текстури;
- shared color/shape function;
- Particle Color для Surface particle parents;
- named runtime scalar path;
- only supported features;
- debug output policy;
- safe defaults.

### Крок 4 — Створіть feature matrix

| Feature | Sprite AC | Sprite Add | Mesh | Ribbon | Decal |
|---|---:|---:|---:|---:|---:|
| ErodeEdge | ✓ | ✓ | ✓ | ✓ | ✓ |
| ThreeColorRamp | ✓ | ✓ | ✓ | ✓ | ✓ |
| FlowUV | ✓ | ✓ | optional | ✓ | optional |
| DepthFade | optional | optional | optional | optional | — |
| Fresnel | — | — | optional | — | — |
| WPO | — | — | optional | — | — |
| Distortion | specialized | specialized | optional | optional | — |
| Particle Color | ✓ | ✓ | ✓ | ✓ | runtime path differs |

Не додавайте checkmark без working validation.

### Крок 5 — Створіть three original variants

#### Fire Slash

- Mesh primary + Sprite sparks preview;
- broken tapered silhouette;
- orange-red body, yellow-white small core;
- fast directional flow;
- no heavy Fresnel;
- WPO only if silhouette gain visible.

#### Ice Ring

- Mesh або Decal+Mesh;
- stepped cyan/blue/white palette;
- low distortion;
- sharp erosion islands;
- restrained temporal motion.

#### Void Projectile

- Sprite/Mesh shell;
- violet body, cyan or magenta accent;
- inward/outward flow contrast;
- visible on white background;
- dynamic `M_Charge01`.

Це оригінальні variants: не копіюйте конкретний proprietary effect/reference frame.

### Крок 6 — Runtime bridge

Для Surface particle parents:

```text
Particles.Color → ParticleColor
Particles.Charge01 → M_Charge01
Particles.Erode01 → M_Erode01
```

Для non-Niagara component/decal:

- DMI або component parameter path;
- MPC лише global input;
- documented safe default.

### Крок 7 — Validation matrix

Кожен variant:

1. black/mid/white background;
2. bloom off/on;
3. near/reference/far camera;
4. camera orbit/pitch;
5. opaque intersection;
6. two-layer overlap;
7. maximum runtime values;
8. missing writer/fallback;
9. High/Low;
10. Shader Complexity/overdraw.

### Крок 8 — Naming/dependency audit

- no redirector confusion;
- no duplicate function copies;
- all assets in intended folders;
- instances point to current parents;
- textures have documented channels;
- parameters grouped: Shape, Color, Motion, Runtime, Quality, Debug;
- tooltips/descriptions written where supported.

### Крок 9 — Performance pass

For each renderer variant record:

```text
Material/instance:
Blend/domain:
Static features:
Texture samples:
Material stats:
Projected coverage:
Representative count:
Shader Complexity observation:
GPU measurement:
Optimization applied:
Visual/gameplay consequence:
```

Exact stats UI/profiling command:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 10 — Block assessment

Виконайте [BLOCK_ASSESSMENT.md](BLOCK_ASSESSMENT.md) без solutions. Мінімум 80/100 і без критичних помилок.

## 12. Точні nodes, properties і connection specification

### Minimum parent contract

```text
Shape sampling:
  TextureCoordinate/renderer UV → T_Shape.UVs
  T_Shape.R → MF_ErodeEdge.Mask
  M_Erode01 → MF_ErodeEdge.Threshold
  EdgeWidth01 → MF_ErodeEdge.Width

Color:
  MF_ErodeEdge.Body → MF_ThreeColorRamp.Value або Shape coordinate
  ColorLow/Mid/High → MF_ThreeColorRamp
  MF_ThreeColorRamp.Color × ParticleColor.RGB × Intensity
    → BodyEmissive
  EdgeMask × EdgeColor × EdgeIntensity
    → EdgeEmissive
  BodyEmissive + EdgeEmissive
    → Emissive Color

Opacity:
  BodyMask × ParticleColor.A × OpacityScale
    → optional DepthFade
    → Opacity

Runtime:
  M_Charge01 → Saturate
  Saturate → authored Lerp ranges
```

Decal parent замінює Particle Color на local/DMI/component parameter contract.

### Required debug outputs

```text
UV
RawShape
BodyMask
EdgeMask
ColorCoordinate
ParticleColor/Dynamic value
FinalOpacity
FinalEmissive without HDR multiplier
```

Final shipping configuration не повинна мати expensive dynamic debug chain без justification.

### Required Material properties

| Parent | Domain | Blend | Shading |
|---|---|---|---|
| Sprite AC | Surface | AlphaComposite | Unlit |
| Sprite Add | Surface | Additive | Unlit |
| Mesh | Surface | chosen AC/Additive variant | Unlit |
| Ribbon | Surface | AlphaComposite baseline | Unlit |
| Decal | Deferred Decal | project-compatible decal path | project-compatible |

Exact decal property/input availability:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 13. Стартові значення параметрів

Golden defaults:

| Group | Parameter | Value |
|---|---|---:|
| Shape | UVScale | 1 |
| Shape | Erode01 | 0 |
| Shape | EdgeWidth01 | .05 |
| Color | ColorLow | dark saturated |
| Color | ColorMid | dominant hue |
| Color | ColorHigh | near-white accent |
| Color | BodyIntensity | 1.5 |
| Color | EdgeIntensity | 2 |
| Motion | Speed | 0 |
| Runtime | Charge01 | 0 |
| Runtime | Particle Tint | white |
| Quality | UseSecondNoise | false |
| Quality | UseDistortion | false |
| Quality | UseFresnel/WPO | false |
| Debug | DebugMode | final/off |

## 14. Очікуваний результат кожного етапу

| Етап | Доказ |
|---|---|
| Architecture | Dependency diagram без cycles |
| Functions | Inputs/outputs/contracts documented |
| Parents | Five golden instances visible with no writer |
| Variants | Fire/Ice/Void відрізняються shape, timing intent і palette |
| Runtime | Tint/charge/erode isolated tests pass |
| Renderer | Sprite/Mesh/Ribbon/Decal matrix complete |
| Quality | High/Medium/Low feature policy |
| Performance | Before/after report with equal camera |
| Assessment | ≥80/100, no critical fail |

## 15. Самостійна вправа

### EX04-07-A — Blank-spec rebuild

Закрийте guided graph і з чистих assets побудуйте family за specification:

- two shared functions minimum;
- Sprite AC, Mesh, Ribbon, Decal parents;
- one Particle Color path;
- one named runtime scalar binding;
- three original instances;
- renderer validation matrix;
- no copied screenshots як substitute;
- connection list і dependency diagram.

Timebox: 4 години. Запишіть, де specification була недостатньою, але не змінюйте requirements заднім числом.

## 16. Додаткова складніша вправа

### EX04-07-B — Optimization rescue

Візьміть навмисно дорогий High variant:

- second scrolling noise;
- distortion;
- wide translucent coverage;
- Fresnel/WPO;
- two extra layers.

Створіть Medium і Low:

- Low зберігає gameplay silhouette, color family, timing і area;
- зменште measured cost;
- зафіксуйте відкинуті features;
- не підробляйте gain зміною camera/exposure/count;
- надайте знімки до й після і report.

## 17. Три рівні підказок

### EX04-07-A

1. **Напрям:** почніть із dependency diagram і golden defaults.
2. **Структура:** functions → parents → golden instances → original instances → validation.
3. **Майже відповідь:** shared ErodeEdge + ColorShapeCore достатні як minimum; renderer-specific sampling і properties лишаються в parents.

### EX04-07-B

1. **Напрям:** вимірюйте cost ladder по одному feature.
2. **Структура:** спершу coverage/layers, потім renderer segments/topology, потім optional shader math/samples.
3. **Майже відповідь:** Low = primary body/opacity/color; прибрати distortion, second noise, rim/WPO й cosmetic layers, якщо cue не змінюється.

Повні розв’язки: [L04-07 answers](../EXERCISE_ANSWERS/L04-07_material_lab_answers.md).

## 18. Типові помилки

| Помилка | Наслідок | Виправлення |
|---|---|---|
| Mega-parent для всіх domains | Compile/property confusion | Renderer parents + functions |
| Duplicate functions | Fixes diverge | One canonical dependency |
| Default erode=1 | Invisible fallback | Golden safe defaults |
| Забагато static switches | Permutation growth | Feature-use audit |
| Runtime branch для fixed feature | ALU/complexity | Static switch або specialized parent |
| Palette — єдина різниця variants | Weak elemental language | Shape/motion/timing intent теж |
| Performance screenshot з іншою camera | Invalid comparison | Locked test scene |
| Shader stats без overdraw | Missing major translucent cost | Coverage/overdraw/GPU evidence |
| Low змінює gameplay radius | Functional regression | Cue parity gate |
| Undocumented texture channels | Wrong sampling/sRGB | Channel contract |

## 19. Troubleshooting

### Dependency failure

```text
Broken instance
→ parent assignment
→ static parameters
→ canonical function reference
→ texture asset/channels
→ runtime writer/binding
```

### Visual failure

```text
Final black
→ Emissive debug
→ BodyMask
→ RawShape
→ UV
→ texture/sample settings

Final white blob
→ HDR off
→ EdgeMask off
→ layer isolation
→ blend/background
```

### Runtime failure

```text
Material receiver hard-code
→ renderer binding constant
→ particle attribute
→ User override
→ Blueprint writer
```

### Performance failure

```text
Lock camera/count
→ coverage/layers
→ blend/two-sided
→ renderer segments/topology
→ samples/features
→ simulation source
```

Version-specific UI:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 20. Performance considerations

- Optimization починається з мети й репрезентативного сценарію.
- Translucent coverage/layers зазвичай важливіші за невеликі скорочення ALU.
- Окремі parents Additive/AlphaComposite запобігають оманливим порівнянням в одному graph.
- Видалення static features може зменшити shader work, але без контролю збільшує кількість permutations.
- Shared functions не гарантують зменшення спільної compiled cost; вони гарантують повторне використання architecture.
- Decal, Ribbon, Mesh і Sprite мають різні bottlenecks.
- Великий WPO потребує bounds policy.
- Оновлення runtime parameters створює CPU/data costs поза material shader.
- Зберігайте стабільну benchmark map і записуйте для результату date/hardware/build.
- Budgets залежать від цільової платформи й потребують ручної перевірки.

## 21. Запитання для самоперевірки

1. Який правильний dependency direction?
2. Що належить function, а що parent?
3. Чому безпечні початкові значення важливі?
4. Коли static switch виправданий?
5. Чому shared function не гарантує дешевший shader?
6. Які чотири cue properties Low tier не має змінювати?
7. Які debug outputs обов’язкові?
8. Чому material stats недостатньо для translucent VFX?
9. Як довести, що три variants справді різні?
10. Який minimum evidence має optimization report?

## 22. Відповіді

1. Instance → parent → function/texture.
2. Function — reusable math; parent — domain/blend/renderer contract.
3. Effect лишається visible/debuggable без external writer.
4. Fixed per-instance feature з реальними variants і прийнятною permutation policy.
5. Function source inlined/compiled; reuse покращує authoring, не автоматично runtime cost.
6. Primary silhouette, timing, color/team cue, gameplay area/readability.
7. UV, raw shape, body, edge, color coordinate, runtime input, opacity, pre-HDR emissive.
8. Screen coverage, layers, blending, renderer geometry і runtime count визначають actual GPU cost.
9. Показати відмінності в shape, motion/timing intent, value/color hierarchy і renderer use, не лише palette.
10. Locked conditions, зображення до й після, stats/overdraw/GPU measure, removed feature і cue consequence.

## 23. Self-check checklist

- [ ] Dependency diagram збігається з actual assets.
- [ ] Canonical functions не duplicated.
- [ ] Five golden parents/instances мають безпечні початкові значення.
- [ ] Parameter groups/names/ranges documented.
- [ ] Fire/Ice/Void мають різну language, не тільки hue.
- [ ] Runtime paths мають fallback.
- [ ] Validation matrix містить backgrounds/depth/sorting/camera.
- [ ] High/Medium/Low зберігають ігрову підказку.
- [ ] Performance comparison locked і reproducible.
- [ ] Assessment ≥80 без critical fail.

## 24. Mastery criteria

Gate G04 пройдено, якщо:

1. toolkit створює щонайменше три візуально різні effects;
2. core graph не duplicated;
3. Sprite, Mesh, Ribbon, Decal parents мають explicit contracts;
4. Particle Color і named runtime scalar працюють;
5. golden fallback visible;
6. renderer випадки відмови задокументовані;
7. High/Low cue parity пройдена;
8. shader-cost report містить actual evidence;
9. EX04-07-A і Block Assessment ≥80/100;
10. critical safety/performance criteria не провалені.

## 25. Підсумок

- Material Laboratory — system of contracts, не mega-graph.
- Functions повторно використовують math; parents визначають renderer/domain.
- Instances визначають look, runtime paths — live data, tier policy — optional cost.
- Safe defaults і debug outputs роблять toolkit ремонтопридатним.
- Performance оцінюється в representative scene, не за красою graph.

## 26. Зв’язок із наступними уроками

У блоці 05 ви створите власні textures, які замінять placeholder inputs Laboratory. Блок 06 додасть meshes і procedural texture sources. У блоці 07 parents отримають повні Niagara Sprite/Mesh/Ribbon systems. Не змінюйте contracts без запису migration note.

## 27. Офіційні джерела

- [Material Functions](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-functions-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Instanced Materials](https://dev.epicgames.com/documentation/en-us/unreal-engine/instanced-materials-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Material Parameter Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-parameter-expressions-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Material Properties](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-properties) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Testing and Optimizing Your Content](https://dev.epicgames.com/documentation/en-us/unreal-engine/testing-and-optimizing-your-content) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Introduction to Performance Profiling and Configuration](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.

## 28. Рекомендовані скриншоти або схеми

```text
Схема 1: dependency tree
Instances → renderer parents → canonical functions/textures.
Показати prohibited duplicate/cycle червоним.
```

```text
Скриншот 2: three original variants
Fire/Ice/Void на black/mid/white backgrounds із однаковою exposure.
Підписати renderer, parent, key instance values.
```

```text
Скриншот 3: optimization sheet
High/Medium/Low, Shader Complexity, overdraw, locked camera/count.
Підписати removed features та cue parity.
```
