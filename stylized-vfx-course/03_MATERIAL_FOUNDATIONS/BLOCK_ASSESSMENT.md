# Assessment блока 03 — Material Foundations

## Призначення

Це mastery gate `G03`. Він перевіряє не пам’ять screenshot, а здатність із чистого Material Graph:

- пояснити shader data flow і value ranges;
- побудувати procedural mask;
- побудувати texture-driven animated material;
- побудувати depth-aware VFX material;
- ізолювати помилку через intermediate outputs;
- надати connection contracts і докази продуктивності.

Орієнтир — 6–8 годин. Щоб не подвоювати заявлені 70 годин блока, assessment є формальною контрольною фазою/повторним незалежним проходом навичок 03.09, а не додатковими M/S hours.

## Правила

- Заборонено відкривати `B03_BLOCK_ASSESSMENT_KEY.md`, lesson answer files, покрокові tutorials або копіювати guided material.
- Дозволено офіційну документацію Epic, власний glossary, чистий notebook і `SOURCES.md`.
- Дозволено повторно використати **лише source texture asset** `T_L03_06_Packed_Data` або власний правомірний packed texture; lesson material/graph копіювати не можна.
- Усі assessment materials створюються з blank graph і мають prefix `A03_`.
- Немає orphan nodes.
- Кожен version-sensitive факт позначається: **«Потребує ручної перевірки в Unreal Engine 5.8.»**
- Фіксуються UE 5.8.x build, platform/feature level, quality, resolution і test camera.
- Умови performance capture не приховуються.

## Здача

```text
/Game/SVFX/Tests/Assessment03/
├── Materials/
│   ├── M_A03_ProceduralCrescent
│   ├── M_A03_TextureMotion
│   └── M_A03_DepthAware
├── Instances/
│   ├── MI_A03_ProceduralCrescent_Var
│   ├── MI_A03_TextureMotion_Var
│   └── MI_A03_DepthAware_Var
└── Maps/
    └── L_A03_MaterialAssessment
```

Evidence:

- відповіді на 20 test prompts;
- screenshot properties для кожного material;
- screenshot повного graph для кожного material;
- inventory nodes, таблиця parameters і список connections;
- щонайменше чотири intermediate outputs на кожен material;
- captures normal, complexity і overlap із fixed camera;
- запис troubleshooting;
- самооцінювання і список sources.

## Оцінка зі 100

| Категорія | Бали | Minimum 60% |
|---|---:|---:|
| Теоретичний тест | 20 | 12 |
| Практична контрольна | 60 | 36 |
| Troubleshooting/performance | 10 | 6 |
| Self-review/documentation | 10 | 6 |
| **Разом** | **100** | **80 overall** |

Прохід: `≥80/100` **і** minimum у кожній категорії.

## Частина 1 — теоретичний тест, 20 балів

Кожне питання — 1 бал. Пишіть 2–5 речень або formula/range там, де це доречно.

1. Чим Material asset відрізняється від shader calculation, яке виконує GPU?
2. Чим vertex calculation відрізняється від pixel/fragment calculation для VFX plane?
3. Дайте component count і приклад semantic use для Scalar, Vector2, Vector3, Vector4.
4. Поясніть `0`, `.5`, `1`, `-1`, `4` як mask/HDR/intermediate values.
5. Чим linear data відрізняється від sRGB-encoded color; що робить output HDR?
6. Запишіть formula remap `[InMin,InMax] → [0,1]` і invalid case.
7. Запишіть formula `LinearInterpolate` й результати Alpha `0`, `.5`, `1`, `1.5`.
8. Чим `Clamp` відрізняється від `Saturate`; коли не слід saturate intermediate?
9. Як `Power` із exponent `.5`, `1`, `4` формує normalized mask; який Base небезпечний?
10. Як `Floor`, `Ceil`, `Frac` поводяться для `2.75` і чому `Frac(U*Repeats)` створює cells?
11. Чим `Step` відрізняється від `SmoothStep`; який range contract останнього?
12. Як пов’язані `Distance(A,B)` і `Length(A-B)`?
13. Навіщо Normalize перед Dot; range Dot для normalized vectors?
14. Чому `UV*Tiling+Offset` не дорівнює `(UV+Offset)*Tiling`; що таке pivot?
15. Порівняйте UV, world, object-related і screen coordinates при русі object/camera.
16. Як із centered UV отримати radius і normalized polar angle; де seam/singularity?
17. Які trade-offs пакування каналів, compression, mips і atlas padding?
18. Порівняйте Opaque, Masked, Translucent, Additive для VFX.
19. Що роблять `PixelDepth`, `SceneDepth`, `DepthFade`; чого DepthFade не виправляє?
20. Розрізніть Material Instance, Dynamic Material Instance, Material Function, Static Switch; скільки theoretical variants дають 4 independent Boolean switches?

## Частина 2 — практична контрольна, 60 балів

### Загальний test map

`L_A03_MaterialAssessment`:

- чорна, сіра і біла background panels;
- labeled stations A/B/C;
- planes однакового size 100×100 cm;
- opaque cube, що проходить через station C;
- fixed camera і exposure;
- stack zones для 1, 8 і 32 cards.

### Material A — `M_A03_ProceduralCrescent`

Побудуйте crescent без texture або function.

**Обов’язкові properties**

- Surface / Masked / Unlit;
- Two Sided True;
- Opacity Mask Clip Value `.5`.

**Behavior**

- outer soft circle у `OuterCenter=(.5,.5)`, radius `.34`, feather `.02`;
- inner soft circle у `InnerCenter=(.59,.5)`, radius `.28`, feather `.02`;
- crescent = saturated outer мінус inner;
- parameter `AspectXY` до distance;
- Color `(1.5,.04,.01)`, Intensity `2`;
- crescent подається у shaping Emissive і Opacity Mask.

### Material B — `M_A03_TextureMotion`

**Обов’язкові properties**

- Surface / Additive / Unlit;
- Two Sided True.

**Behavior**

- один `TextureSampleParameter2D`;
- packed numeric texture, sample R;
- UV `TilingXY=(1,3)`;
- Panner `PanSpeedXY=(.18,0)`;
- mask сформована через `Power=3`;
- Color `(.02,.2,2)`, Intensity `3`;
- правильне decision data або sRGB задокументовано;
- test на трьох backgrounds і в motion.

### Material C — `M_A03_DepthAware`

**Обов’язкові properties**

- Surface / Translucent / Unlit;
- Two Sided True.

**Behavior**

- та сама packed texture, sample G;
- Color `(2,.12,.01)`, Intensity `2`;
- `OpacityScale=.75`;
- `DepthFade` with `FadeDistance=40`;
- mask×opacity scale подається в opacity DepthFade;
- output DepthFade подається в Material Opacity;
- окрема branch Emissive;
- tests FadeDistance `10`, `40`, `100`.

### Scoring practical, 60

| Критерій | 0–5 | 6–10 | 11–15 |
|---|---|---|---|
| Brief/function | incomplete або mismatch | переважно працює, є omissions | усі три відповідають measurable brief |
| Visual/readability | unreadable або unstable | acceptable, але tests слабкі | clear на prescribed cameras і backgrounds |
| Technical correctness | errors compile, range або property | minor issues | правильні properties, ranges і graph contracts |
| Independent transfer | copied або opaque | є часткове independent reasoning | чисті нові shapes і decisions з explanations |

## Частина 3 — troubleshooting і performance, 10 балів

### Запис першопричини — 4

Створіть duplicate B як `M_A03_TextureMotion_Fault`. Навмисно:

1. змініть interpretation packed data на невідповідну color behavior sRGB **або**, якщо UI/pipeline не дає змоги відтворювано внести таку зміну, під'єднайте неправильний channel B замість R;
2. зафіксуйте symptom;
3. ізолюйте UV → raw channel → output Power;
4. визначте перший failing stage;
5. відновіть correct graph або setting;
6. повторіть acceptance.

Бали:

- 1 — точні expected і actual;
- 1 — repeatable reproduction;
- 1 — перший failing intermediate або root cause;
- 1 — minimal fix і regression.

### Measurements — 4

Зробіть capture з тією самою fixed camera для B і C:

- 1 card;
- 8 overlapping cards;
- 32 overlapping cards;
- normal view;
- Shader Complexity та/або Quad Overdraw, якщо вони доступні;
- ті самі resolution, quality і platform.

Надайте таблицю evidence, а не вигадані milliseconds.

### Decision optimization — 2

Внесіть одну обґрунтовану change:

- зменшити coverage або count cards;
- обрати Masked там, де soft edge не потрібен;
- зменшити resolution texture після quality test;
- прибрати unused Two Sided;
- спростити duplicated branch;
- зберегти дорогий choice, бо його виправдовує visual requirement.

Evidence до і після та trade-off обов’язкові.

## Частина 4 — самооцінювання, naming, documentation, 10 балів

### Self-review — 4

- найсильніше technical decision і evidence;
- найбільша weakness visual або readability;
- один performance risk;
- пріоритетна next change;
- що було засвоєно без answer або tutorial.

### Hygiene naming і folders — 3

- required names і folders;
- aliases і comments readable;
- parameters згруповано й описано;
- у delivery folder немає orphan або temporary assets.

### Breakdown і sources — 3

- повні graph contracts;
- exact connections;
- використані entries manual-check registry;
- official source IDs і URLs;
- actual build UE 5.8.x.

## Critical fail

Незалежно від total:

- будь-який required material не компілюється або його неможливо продемонструвати;
- practical graph скопійовано з guided material, answer або tutorial;
- performance conditions сфальсифіковано або вибірково приховано;
- source rights або provenance texture відсутні;
- reproducible список connections відсутній;
- assessment key відкрито до submission.

## Mastery gate G03

Assessment пройдено лише якщо:

- total ≥80;
- кожна category ≥60%;
- усі три graphs працюють;
- кожну operation пояснено;
- intermediate outputs перевірено independently;
- opaque ready function відсутня;
- списки connections відтворюють graphs.

## Повторне проходження

1. Позначте failed categories.
2. Повторіть точні prerequisite lessons.
3. Дочекайтеся щонайменше однієї study session.
4. Використайте новий variant:
   - procedural droplet замість crescent;
   - texture B замість R;
   - Masked depth-independent card і окремий translucent comparison.
5. Не перезаписуйте attempt 1.
6. Порівняйте causes і decisions.

## Офіційні джерела

- [Unreal Engine Materials](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-materials)
- [Material Editor User Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-editor-user-guide)
- [Material Inputs](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-inputs-in-unreal-engine)
- [Material Expressions Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-expressions-reference)
- [Math Material Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/math-material-expressions-in-unreal-engine)
- [Coordinates Material Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/coordinates-material-expressions-in-unreal-engine)
- [Depth Material Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/depth-material-expressions-in-unreal-engine)
- [Material Parameter Expressions](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-parameter-expressions-in-unreal-engine)
- [Texture Asset Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-asset-editor-in-unreal-engine)
- [Guidelines for Optimizing Rendering for Real Time](https://dev.epicgames.com/documentation/en-us/unreal-engine/guidelines-for-optimizing-rendering-for-real-time-in-unreal-engine)

Дата перевірки: 2026-07-27. Exact nodes/pins/settings/view modes: **Потребує ручної перевірки в Unreal Engine 5.8.**
