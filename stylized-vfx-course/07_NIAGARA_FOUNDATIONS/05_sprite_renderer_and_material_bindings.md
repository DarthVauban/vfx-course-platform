# 07.05 — Sprite Renderer і material bindings

## 1. Назва

**Production-ready Sprite Emitter: renderer settings, complete bindings, Particle Color, Dynamic Material Parameters, sorting, pivot і SubUV.**

## 2. Результат уроку

Ви побудуєте `NS_L07_05_SpriteSparks` / `NE_L07_05_Sparks`, перевірите material usage flag, повний renderer binding contract і data path до material. Effect має deterministic burst, velocity-aligned cards, clean lifetime curves, documented sorting decision, dynamic four-channel material data та bounds/count evidence.

## 3. Орієнтовний час

**8 годин: 1.5 години теорії / 6.5 години практики.**

- 45 хв — Sprite Renderer geometry/facing/alignment;
- 45 хв — bindings, material/data contract;
- 120 хв — M/S practice: material compatibility, Particle Color, Dynamic Parameter, SubUV;
- 60 хв — controlled renderer experiments;
- 120 хв — guided emitter;
- 90 хв — exercises A/B.

M/S practice блока: **2 години з обов’язкових 4**.

## 4. Передумови

- 07.04;
- контракт даних Niagara з 04.06;
- `M_VFX_Sprite_Template` та production instance `MI_VFX_Sprite_Production`;
- `T_Flipbook_EnergyRing_4x4_1024` із 05.05 для SubUV experiment;
- уміння читати `Particles.Color`, `Velocity`, `SpriteSize`, `NormalizedAge`.

## 5. Нові терміни

- **Sprite** — camera-oriented quad/card, який renderer створює для particle.
- **Usage flag** — позначка сумісності material `Use with Niagara Sprites`.
- **Pivot in UVSpace** — pivot `(0,0)` у верхньому лівому куті, `(1,1)` у нижньому правому, `(.5,.5)` у центрі.
- **Sort Mode** — порядок translucent particles перед drawing.
- **Sub Image Size** — columns/rows atlas для SubUV.
- **SubImageIndex** — координата або індекс кадру для окремого particle.
- **Dynamic Material Parameter** — Vector4 particle data, що renderer передає compatible material expression.
- **Material Random** — per-particle scalar для material random path.
- **Cutout** — tighter sprite geometry from opacity source для зниження empty overdraw.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Simulation може бути правильною, але sprite лишиться білим, квадратним, sideways або невидимим, якщо renderer/material contract зламано. Production-ready emitter документує source кожного visible property, material compatibility, sorting rationale і performance risk. Це дозволяє shader artist та Niagara artist змінювати свої частини без прихованої домовленості.

## 7. Теорія простими словами

Sprite Renderer не «знає», який color або size ви мали на увазі. Він читає fields через bindings:

```text
Initialize/Update writes Particles.Color
→ Sprite Renderer Color Binding reads Particles.Color
→ material Particle Color expression uses RGB/A
→ final pixels
```

Кожен hop треба перевірити. Якщо material не множить Particle Color, Niagara color може змінюватися в debugger, але pixels — ні.

## 8. Детальні технічні пояснення

### Орієнтація геометрії

- `Facing Mode=Face Camera` орієнтує plane до camera.
- `Alignment=Velocity Aligned` повертає axes вздовж `Particles.Velocity`.
- `SpriteRotation` додає screen-plane roll відповідно до mode.
- Pivot `(.5,.5)` — centered; pivot `(0.5,1)` закріплює нижній центр card.

### Контракт material

`MI_VFX_Sprite_Production`:

- parent `M_VFX_Sprite_Template`;
- Surface, AlphaComposite, Unlit;
- використовує RGB `Particle Color` для tint, а A — для opacity;
- використовує channels `Dynamic Parameter` index 0: `Erode`, `Distortion`, `Core`, `Variant`;
- `Use with Niagara Sprites` перевірено й скомпільовано;
- alpha/shape texture не вважається непрозоро-білою.

Epic renderer reference прямо вимагає usage flag. Auto usage detection may compile it after assignment, але evidence має показати working material, не припущення.

### Повний аудит bindings

| Binding renderer | Foundation source |
|---|---|
| Position | `Particles.Position` |
| Color | `Particles.Color` |
| Velocity | `Particles.Velocity` |
| Sprite Rotation | `Particles.SpriteRotation` |
| Sprite Size | `Particles.SpriteSize` |
| Sprite Facing | `Particles.SpriteFacing` |
| Sprite Alignment | `Particles.SpriteAlignment` |
| Sub Image Index | `Particles.SubImageIndex` |
| Dynamic Material | `Particles.DynamicMaterialParameter` |
| Dynamic Material 1–3 | відповідні `Particles.DynamicMaterialParameter1–3` |
| Camera Offset | `Particles.CameraOffset` |
| UVScale | `Particles.UVScale` |
| Material Random | `Particles.MaterialRandom` |
| Custom Sorting | `Particles.NormalizedAge` для діагностики |
| Normalized Age | `Particles.NormalizedAge` |

Лише фактично записані attributes мають змінювати поведінку. Сумісні bindings без записаного значення використовують fallbacks renderer.

### Sorting

`Sort Mode=None` є baseline для малих additive/AlphaComposite spark cards, якщо не продемонстровано artifact перекриття. `View Depth`/`View Distance` можуть покращити translucent ordering, але додають роботу sorting і не розв’язують усі випадки cross-component translucency. `Sort Only When Translucent=True` уникає непотрібного sorting для non-translucent material.

### SubUV

`Sub Image Size=(4,4)` повідомляє renderer про grid atlas. `Sub UV Animation` записує progression frame/`Particles.SubImageIndex`. `Sub UV Blending Enabled` змішує сусідні frames через fractional index. Порядок atlas і контракт sampling material мають збігатися.

## 9. Візуальні або математичні приклади

Dynamic Vector4:

```text
Particles.DynamicMaterialParameter =
  (Erode=.05, Distortion=.15, Core=1.0, Variant=0.0)
```

Pivot Sprite:

```text
(0,0) top-left      (1,0) top-right
       (.5,.5) center
(0,1) bottom-left   (1,1) bottom-right
```

Оцінка peak area sprite для 24 cards `(5×32 cm)` не є вартістю пікселів; overdraw визначають покриття екрана, overlap і blend.

## 10. Контрольовані експерименти

1. Задайте `Particles.Color` magenta; від’єднайте Particle Color у копії material; визначте зламаний hop.
2. Перемикайте `Velocity Aligned↔Unaligned`, не змінюючи simulation.
3. Pivot `(.5,.5)↔(.5,1)`; спостерігайте anchoring.
4. Sort `None↔View Depth` на checker background; вмикайте лише якщо artifact покращується.
5. Змініть Dynamic Parameter Core `1→.2`; material має видимо відреагувати.
6. SubUV: `(1,1)↔(4,4)` з atlas energy ring; хибний grid має бути очевидним.
7. Перемкніть `Sub UV Blending Enabled` off/on на половині frame.
8. Використовуйте Material Cutout лише після перевірки atlas/opacity; порівняйте Shader Complexity/coverage.

## 11. Покрокова керована практика

### Повний stack

```text
NS_L07_05_SpriteSparks
├─ System Properties
├─ System Spawn: no added modules
├─ System Update
│  └─ System State
└─ NE_L07_05_Sparks
   ├─ Emitter Properties
   ├─ Emitter Spawn: no added modules
   ├─ Emitter Update
   │  ├─ Emitter State
   │  └─ Spawn Burst Instantaneous
   ├─ Particle Spawn
   │  ├─ Initialize Particle
   │  ├─ Shape Location
   │  ├─ Add Velocity in Cone
   │  └─ Dynamic Material Parameters
   ├─ Particle Update
   │  ├─ Particle State
   │  ├─ Gravity Force
   │  ├─ Drag
   │  ├─ Solve Forces and Velocity
   │  ├─ Scale Color
   │  └─ Scale Sprite Size
   └─ Render
      └─ Sprite Renderer
```

### Значення simulation

- Emitter: `CPUSim`, Local Space false, determinism true, seed `505`.
- State: Self, Complete, Once, Fixed `1.2 s`.
- Burst: `24 @ 0`.
- Initialize: Lifetime Random `0.45–0.80 s`; Color `(1,.28,.03,1)`; Sprite Size `(5,32)`; Rotation `0`; Mass `1`.
- Shape: radius Sphere `10`.
- `Add Velocity in Cone`: axis `(0,0,1)`; cone angle `25°`; speed Random Range Float `400–700 cm/s`.
- Dynamic Material Parameters index 0: `(Erode=.05, Distortion=.15, Core=1, Variant=0)`.
- Gravity `(0,0,-700)`; Drag `1.2`; default settings solver.
- Scale Color: множник RGB `(1,1,1)`; крива alpha `(0,0),(.04,1),(.65,1),(1,0)`.
- Scale Sprite Size: крива non-uniform multiplier: X `(0,.5),(.1,1),(1,.2)`; Y `(0,.7),(.1,1),(1,.1)`.

Exact `Add Velocity in Cone` field label for speed distribution **потребує ручної перевірки в Unreal Engine 5.8.**

### Значення renderer і bindings

```text
Material = MI_VFX_Sprite_Production
Alignment = Velocity Aligned
Facing Mode = Face Camera
Pivot in UVSpace = (0.5,0.5)
Sort Mode = None
Sort Only When Translucent = True
Sub Image Size = (1,1)
Sub UV Blending Enabled = False
Position Binding = Particles.Position
Color Binding = Particles.Color
Velocity Binding = Particles.Velocity
Sprite Rotation Binding = Particles.SpriteRotation
Sprite Size Binding = Particles.SpriteSize
Sprite Facing Binding = Particles.SpriteFacing
Sprite Alignment Binding = Particles.SpriteAlignment
Sub Image Index Binding = Particles.SubImageIndex
Dynamic Material Binding = Particles.DynamicMaterialParameter
Camera Offset Binding = Particles.CameraOffset
UVScale Binding = Particles.UVScale
Material Random Binding = Particles.MaterialRandom
Custom Sorting Binding = Particles.NormalizedAge
Normalized Age Binding = Particles.NormalizedAge
```

Лишіть Dynamic Material 1–3 прив’язаними до відповідних default attributes, але не записуйте їх.

### Захоплення для приймання

Spark cards вилітають у межах cone, згинаються вниз, спрямовуються вздовж velocity й згасають до death. Core material реагує на зміну dynamic channel B. Particle count досягає peak 24. Bounds охоплюють видиму arc; Collision не додано.

## 12. Точні назви вузлів, модулів і налаштувань UE

`Sprite Renderer`; `Dynamic Material Parameters`; `Add Velocity in Cone`; `Alignment`; `Velocity Aligned`; `Facing Mode`; `Face Camera`; `Pivot in UVSpace`; `Sort Mode`; `Sort Only When Translucent`; `Sub Image Size`; `Sub UV Blending Enabled`; all bindings listed in section 11; material flag `Use with Niagara Sprites`; material expressions `Particle Color`, `Dynamic Parameter`.

Epic prose contains singular `Particle.Velocity`/`Particle.SpriteSize` in two rows while attribute reference uses plural. Select actual `Particles.Velocity`/`Particles.SpriteSize` variables. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Категорія | Значення |
|---|---|
| seed/count/lifetime | `505`; `24`; `.45–.80 s` |
| shape | Sphere `10` |
| cone | axis Z, `25°`, speed `400–700` |
| gravity/drag | `-700 Z`; `1.2` |
| sprite | `(5,32)`, velocity aligned, face camera |
| pivot/sort | `(.5,.5)`; None |
| Dynamic0 | `(.05,.15,1,0)` |
| SubUV | `(1,1)`, blend off |

## 14. Очікуваний результат кожного етапу

- Призначення material: видимий tint Particle Color.
- Cone velocity: сфокусований upward spray.
- Gravity/drag: коротка читабельна arc.
- Alignment: довга вісь слідує за поточним velocity, включно зі спуском.
- Curves: швидкий onset і чистий decay.
- Dynamic binding: channel `Core` видимо модулює material.
- Аудит bindings: немає випадкового custom/fallback source.
- Count/bounds: peak 24 і відсутність передчасного cull у test camera.

## 15. Самостійна вправа

### `EX-L07-05-A` — Sparks удару

Створіть original impact burst з `36` particles, hemisphere/cone launch, lifetime `.25–.65`, speed `500–900`, gravity `-900`, drag `1.6`, seed `1505`. Material tint і Core мають працювати; pivot, alignment, sorting і complete binding table документовані.

[Повне рішення A](../EXERCISE_ANSWERS/L07-05_sprite_renderer_and_material_bindings_answers.md#ex-l07-05-a)

## 16. Додаткова складніша вправа

### `EX-L07-05-B` — Energy puff SubUV 4×4

Використайте `T_Flipbook_EnergyRing_4x4_1024` у compatible sprite material. Burst `8`, lifetime `1.0`, SubUV frames `0→15` by NormalizedAge, grid `4×4`, blending on. Доведіть row-major order, no neighbor bleed на target distance і working Particle Color.

[Повне рішення B](../EXERCISE_ANSWERS/L07-05_sprite_renderer_and_material_bindings_answers.md#ex-l07-05-b)

## 17. Три рівні підказок

### Для `EX-L07-05-A`

- **Hint 1:** спочатку побудуйте simulation з білим перевіреним material, потім перевірте color/dynamic hops.
- **Hint 2:** порядок forces: State → Gravity → Drag → Solve → appearance.
- **Hint 3:** якщо cards лежать боком, перевірте окремо вісь size, Alignment і Velocity Binding.

### Для `EX-L07-05-B`

- **Hint 1:** у grid renderer і manifest atlas мають бути вказані 4 columns × 4 rows.
- **Hint 2:** `Sub UV Animation` належить particle simulation, а renderer читає `Particles.SubImageIndex`.
- **Hint 3:** відобразіть NormalizedAge `0→1` на frame `0→15`; перевірте frames 0, 5, 10, 15 до autoplay.

## 18. Типові помилки

- у material немає Niagara Sprites usage;
- material ігнорує Particle Color;
- Color Binding вказує на хибну variable;
- порядок channels Dynamic Parameter відрізняється від labels material;
- Velocity Aligned із нульовим або хибним velocity binding;
- хибний Sub Image Size;
- View Depth sorting увімкнено за звичкою;
- завеликі cards і overdraw;
- position renderer у stack трактують як гарантований cross-emitter draw order.

## 19. Пошук несправностей

| Симптом | Перевірка | Виправлення |
|---|---|---|
| білі sprites | Color writer/binding/material Particle Color | перевірте magenta на кожному hop |
| невидимі | material blend/opacity/usage | перевірений instance, alpha=1 |
| боком | вісь size/alignment/velocity | `(5,32)`, Velocity Aligned, правильний binding |
| dynamic channel ігнорується | module/binding/index material | index0 Vector4 end-to-end |
| хибні tiles atlas | grid/order | `(4,4)`, перевірка row-major |
| погане translucent overlap | sort/material/coverage | порівняйте None проти View Depth, зменште overlap |
| ранній cull | bounds | захопіть крайні точки arc і відповідально розширте |

## 20. Міркування про продуктивність

- Вартість Sprite значною мірою залежить від screen area, overlap і blend.
- Sorting не безкоштовний; обґрунтовуйте його видимим покращенням.
- Cutout обмінює додаткові vertices/setup на менший порожній overdraw; перевірте representative atlas.
- Dynamic parameters додають payload/interpolation; записуйте лише використані channels.
- CPU burst із 36 частинок доречний; сам high particle count не є обґрунтуванням GPU без profiling і feature constraints.
- Запишіть peak alive count і bounds; глибша scalability розглядається у 08.05/10.

## 21. Запитання для самоперевірки

1. Які три hops проходить Particles.Color?
2. Що робить Pivot in UVSpace?
3. Який binding потрібен velocity alignment?
4. Коли View Depth sort виправданий?
5. Що означає Sub Image Size `(4,4)`?
6. Який attribute передає Dynamic0?
7. Чи renderer order у stack гарантує draw order?
8. Чому usage flag важливий?
9. Що дорожче для overdraw: tiny чи overlapping full-screen sprites?
10. Чому fallback white корисний?

## 22. Відповіді

1. Niagara writer → renderer Color Binding → material Particle Color.
2. Визначає anchor card у normalized UV-space.
3. `Particles.Velocity`.
4. Коли translucent self-overlap artifact реально покращується і cost прийнятний.
5. Atlas має 4 columns і 4 rows.
6. `Particles.DynamicMaterialParameter`.
7. Ні; use Sort Order Hint/material/translucency context.
8. Compiled material permutation має підтримувати Niagara sprite vertex factory/path.
9. Перекриття на весь екран.
10. Відсутній writer не робить material випадково black і полегшує diagnosis.

## 23. Чекліст самоперевірки

- [ ] Повний stack точний.
- [ ] Material usage/Particle Color перевірено.
- [ ] Усі bindings перевірено.
- [ ] Значення Dynamic0 і labels material збігаються.
- [ ] Обґрунтування Sort записано.
- [ ] Pivot і alignment перевірено.
- [ ] Докази count/bounds захоплено.
- [ ] 2 години практики M/S записано.
- [ ] A/B завершено.

## 24. Критерії опанування

За 45 хв ви створюєте production-ready sprite burst, знаходите broken data hop, налаштовуєте alignment/pivot/SubUV, документуєте complete binding table і аргументуєте sorting/performance decisions.

## 25. Підсумок

Sprite Renderer — explicit contract між particle attributes і material. Production readiness означає verified usage, bindings, orientation, pivot, sorting, atlas і payload, а не лише гарний preview.

## 26. Зв’язок із наступними уроками

У [07.06](06_mesh_renderer_and_space_control.md) той самий binding mindset переходить до instanced mesh, `Particles.MeshOrientation`, `Particles.Scale`, velocity facing і geometry/material compatibility.

## 27. Офіційні джерела

- [Render Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine)
- [Create a Sparks Effect in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- [Particle Spawn Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-spawn-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-update-group-reference-for-niagara-effects-in-unreal-engine)
- [Smoke Using Sprite Particles](https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-smoke-effect-using-sprite-particles-in-niagara-for-unreal-engine)
- [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Повний stack sparks.
2. Повна panel bindings Sprite Renderer.
3. Path material graph Particle Color + Dynamic Parameter.
4. A/B Unaligned/Velocity Aligned і pivot.
5. Contact sheet frames SubUV 4×4 плюс settings renderer.
6. Знімок меж і пікової кількості частинок.
