# 07.04 — Curl noise, attraction, vortex, facing і alignment

## 1. Назва

**Три motion fields і читабельний напрям: Curl Noise Force, Point Attraction Force, Vortex Force, Sprite Facing та Alignment.**

## 2. Результат уроку

Ви створите `NS_L07_04_MotionFields` з emitters `Curl`, `Attraction`, `Vortex`; ізолюєте кожне поле, поставите forces перед solver і налаштуєте elongated sprites так, щоб velocity direction було видно. Deliverable містить three full stacks, settings tables, direction captures і comparison notes.

## 3. Орієнтовний час

**8 годин: 2 години теорії / 6 годин практики.**

- 45 хв — Curl/attraction/vortex mental models;
- 30 хв — field parameters і solver;
- 45 хв — facing/alignment/bindings;
- 90 хв — controlled studies;
- 180 хв — guided system;
- 90 хв — exercises A/B.

## 4. Передумови

- урок 07.03 завершено;
- правильний force/solver order;
- розуміння local/world space;
- sprite material, який помітно показує non-uniform size.

## 5. Нові терміни

- **Curl noise field** — просторове бездивергентне-like поле для swirling motion; Niagara module додає force з noise sample.
- **Noise Strength** — magnitude впливу.
- **Noise Frequency** — spatial frequency/scale noise pattern у module.
- **Attractor Position** — точка, до якої спрямовано attraction.
- **Attraction Radius** — область впливу.
- **Falloff Exponent** — shape ослаблення з distance.
- **Vortex Axis** — вісь обертання.
- **Vortex Force Amount** — сила tangential motion.
- **Facing** — куди спрямована площина sprite.
- **Alignment** — як осі sprite орієнтуються в цій площині.
- **Velocity Aligned** — alignment mode, у якому sprite довга вісь слідує velocity.

## 6. Навіщо ця тема потрібна VFX artist

Curl дає organic turbulence, attraction збирає silhouette, vortex створює читабельне обертання. Але однаково важливо показати motion: square sprite приховує direction, elongated velocity-aligned card робить trajectory зрозумілою. Production artist має відрізнити motion simulation від renderer orientation і не «лікувати» одне іншим.

## 7. Теорія простими словами

- Curl штовхає particles різними, але просторово пов’язаними напрямами.
- Attraction тягне до point.
- Vortex штовхає навколо axis.
- Drag не створює field; він стримує швидкість.
- Solver перетворює accumulated force на motion.
- Facing повертає card до camera; Alignment обертає card у площині, наприклад уздовж velocity.

Тому particle може рухатися правильно, але виглядати «боком», якщо renderer alignment wrong.

## 8. Детальні технічні пояснення

### Ізоляція fields

Перший прохід кожного study має лише один field + Drag + Solver. Не змішуйте три поля, доки не можете пояснити кожне. Equal seed не робить різні field equations comparable; однаковими мають бути count, lifetime, birth shape, size, material, camera й capture time.

### Curl

Epic GPU Sprite tutorial дає перевірені start values `Noise Strength=72`, `Noise Frequency=.02`. Curl sampling може бути дорожчим, особливо perlin-derived option; залиште default baked tiling mode для foundation.

### Attraction

Epic tutorial values: `Attraction Strength=5.5`, `Attraction Radius=300`, `Falloff Exponent=.6`, optional `Kill Radius=4`. Kill Radius змінює lifecycle, тому baseline вимикає його; окремий experiment може ввімкнути.

### Vortex

Epic Niagara reference описує velocity around axis та optional pull toward origin; Epic UEFN example використовує `Vortex Force Amount=100`, `Vortex Axis=(1,0,0)`. У нашій top-view лабораторії axis `(0,0,1)` для swirl у XY. Visible input labels можуть відрізнятися. **Потребує ручної перевірки в Unreal Engine 5.8.**

### Facing проти alignment

`Facing Mode=Face Camera` тримає plane видимою камері. `Alignment=Velocity Aligned` обертає sprite вздовж `Particles.Velocity`. Renderer `Velocity Binding` має читати цей attribute. При velocity близькій до zero direction нестабільний/невизначений; не оцінюйте alignment у нерухомій фазі.

## 9. Візуальні або математичні приклади

Вісь vortex Z:

```text
top view
          +Y
          ↑
     ↙    |    ↗
 -X ←---- O ----→ +X
     ↘         ↖
 tangential arrows circulate around O; axis = +Z out of screen
```

Напрямок attraction:

```text
direction = normalize(AttractorPosition - Particles.Position)
```

Це лише direction mental model; module strength/falloff визначають magnitude.

## 10. Контрольовані експерименти

1. Curl Strength `0/72/144`, frequency зафіксовано `.02`.
2. Curl Frequency `.01/.02/.08`, strength `72`.
3. Attraction Radius `100/300`; спостерігайте particles поза field.
4. Attraction Kill Radius вимкнено/увімкнено зі значенням `4`; окремо зафіксуйте наслідок для lifecycle.
5. Vortex Amount `0/100/200`, axis Z.
6. Sprite `Unaligned` проти `Velocity Aligned`, simulation однакова.
7. `Face Camera` проти встановленого custom facing mode; відновіть Face Camera.
8. Перемістіть solver вище field, запишіть warning і відновіть порядок.

## 11. Покрокова guided practice

Групи System: `System Properties`; порожній `System Spawn`; `System Update > System State`.

### Спільна оболонка emitter

```text
Emitter Properties: CPUSim; Local Space False; Determinism True
Emitter Spawn: no added modules
Emitter Update
  Emitter State
  Spawn Burst Instantaneous
Particle Spawn
  Initialize Particle
  Shape Location
  Add Velocity
Particle Update
  Particle State
  [one field module]
  Drag
  Solve Forces and Velocity
  Scale Color
  Scale Sprite Size
Render
  Sprite Renderer
```

Спільні значення: lifecycle `Self/Complete/Once/Fixed 3.0 s`; burst `48 @ 0`; lifetime `2.5`; Shape Sphere radius `80`; початковий `Add Velocity` From Point `30 cm/s`; sprite `(6,28)`; alpha `(0,0),(.1,1),(.8,1),(1,0)`; множник size `(0,.5),(.15,1),(1,.3)`.

### `NE_Field_Curl`

- seed `404`; position offset `(-220,0,0)`;
- color `(1,.2,.8,1)`;
- `Curl Noise Force`: `Noise Strength=72`; `Noise Frequency=.02`; default baked field mode;
- `Drag=.7`.

### `NE_Field_Attraction`

- seed `405`; offset `(0,0,0)`;
- color `(.2,1,.4,1)`;
- increase Shape Sphere radius to `140`;
- `Point Attraction Force`: `Attractor Position=(0,0,0)` in Simulation space; `Attraction Strength=5.5`; `Attraction Radius=300`; `Falloff Exponent=.6`; Kill Radius disabled;
- `Drag=1.0`.

### `NE_Field_Vortex`

- seed `406`; offset `(220,0,0)`;
- color `(.1,.55,1,1)`;
- `Vortex Force`: `Vortex Force Amount=100`; `Vortex Axis=(0,0,1)`; origin `(0,0,0)` if exposed; optional pull-to-origin disabled;
- `Drag=1.0`.

### Контракт renderer для всіх

```text
Material = MI_VFX_FoundationSprite
Alignment = Velocity Aligned
Facing Mode = Face Camera
Pivot in UVSpace = (0.5,0.5)
Sort Mode = None
Position Binding = Particles.Position
Color Binding = Particles.Color
Velocity Binding = Particles.Velocity
Sprite Rotation Binding = Particles.SpriteRotation
Sprite Size Binding = Particles.SpriteSize
Normalized Age Binding = Particles.NormalizedAge
```

Захопіть top/front views у `.5`, `1.5`, `2.4 s`.

## 12. Точні назви UE nodes, modules і settings

`Curl Noise Force`; `Noise Strength`; `Noise Frequency`; `Point Attraction Force`; `Attractor Position`; `Attraction Strength`; `Attraction Radius`; `Falloff Exponent`; `Kill Radius`; `Vortex Force`; `Vortex Force Amount`; `Vortex Axis`; `Drag`; `Solve Forces and Velocity`; `Alignment`; `Velocity Aligned`; `Facing Mode`; `Face Camera`; `Velocity Binding`.

Exact optional Vortex origin/pull fields і curl sampling dropdown **потребують ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Дослідження | Seed | Field | Значення field | Drag |
|---|---:|---|---|---:|
| Curl | `404` | Curl Noise | Strength `72`, Frequency `.02` | `.7` |
| Attraction | `405` | Point Attraction | Strength `5.5`, Radius `300`, Falloff `.6` | `1.0` |
| Vortex | `406` | Vortex | Amount `100`, Axis `(0,0,1)` | `1.0` |

Спільні значення: `48` particles, lifetime `2.5`, початковий speed `30`, non-uniform size `(6,28)`, CPU/world.

## 14. Очікуваний результат кожного етапу

- Curl: локально змінні curved trajectories, а не чисті radial lines.
- Attraction: зовнішні particles повертають усередину в межах radius.
- Vortex: цілісна circulation навколо Z.
- Drag: рух лишається в межах кожної laboratory bay 300–400 cm.
- Velocity alignment: cards спрямовані вздовж поточного руху.
- Face Camera: cards лишаються читабельними з test camera.
- Обнулення field наближає кожне дослідження до спільного radial baseline.

## 15. Самостійна вправа

### `EX-L07-04-A` — Стабільна спіраль

Поєднайте `Vortex Force` і `Point Attraction Force` в одному emitter: 64 particles у sphere radius `120`, vortex amount `120`, axis Z, attraction strength `4`, radius `300`, falloff `.8`, drag `1.4`, lifetime `3`, seed `1404`. Налаштовуйте лише в межах ±25%, щоб отримати bounded spiral; задокументуйте фінальні значення й порядок forces.

[Повне рішення A](../EXERCISE_ANSWERS/L07-04_curl_noise_attraction_vortex_and_orientation_answers.md#ex-l07-04-a)

## 16. Додаткова складніша вправа

### `EX-L07-04-B` — Доказ orientation

Створіть два duplicate Curl emitters із точно однаковою simulation. Renderer A `Unaligned`, Renderer B `Velocity Aligned`; для обох `Face Camera`. Використайте size `(5,35)`. Подайте freeze-frame з десятьма позначеними particles і порівняйте вісь card із `Particles.Velocity`.

[Повне рішення B](../EXERCISE_ANSWERS/L07-04_curl_noise_attraction_vortex_and_orientation_answers.md#ex-l07-04-b)

## 17. Три рівні підказок

### Для `EX-L07-04-A`

- **Hint 1:** vortex дає tangential component, attraction — inward component.
- **Hint 2:** обидва forces стоять до Drag і Solver; Drag стримує runaway speed.
- **Hint 3:** якщо cloud collapses, зменште attraction; якщо розлітається, збільште drag або inward pull, не міняючи все разом.

### Для `EX-L07-04-B`

- **Hint 1:** use identical seeds and fixed inputs; змініть лише Alignment.
- **Hint 2:** elongated X/Y choice залежить від material/renderer convention; перевірте long axis у static card.
- **Hint 3:** `Velocity Binding` має бути `Particles.Velocity`; оцінюйте particles із nonzero speed.

## 18. Типові помилки

- три fields одразу без baseline;
- noise frequency називати spawn randomness;
- attraction origin у wrong space;
- force після solver;
- renderer alignment намагатися виправити motion;
- square size для orientation test;
- custom facing без `Particles.SpriteFacing`;
- Kill Radius в baseline, що маскує lifetime.

## 19. Пошук несправностей

| Симптом | Check | Fix |
|---|---|---|
| Curl прямий | strength, solver, baked field | 72/.02, field до solver |
| Attraction не впливає | radius/origin/space | radius 300, origin zero у Simulation |
| миттєвий collapse | strength/kill radius | вимкніть Kill Radius, зменште pull |
| Vortex відлітає | origin/pull/drag | axis/origin, drag 1, bounded shape |
| cards боком | Alignment/binding/вісь size | Velocity Aligned, `Particles.Velocity` |
| cards мерехтять у центрі | velocity≈0 | не оцінюйте points із нульовою speed |

## 20. Міркування про performance

- Sampling Curl field коштує більше за просту аналітичну gravity; default baked mode є baseline.
- Кожний додатковий field виконується для кожної живої частинки за кожний tick.
- Три окремі emitters є навчальним порівнянням, а не автоматичною production architecture.
- Довгі non-uniform translucent sprites можуть збільшувати overdraw.
- Sorting лишається None у лабораторії; вмикайте його лише для продемонстрованого translucent artifact.
- Кількість CPU 48×3 можна інспектувати; switch на GPU не виправданий лише доступністю module.

## 21. Запитання для самоперевірки

1. Що spatially відрізняє curl від random per-particle direction?
2. Які Point Attraction parameters керують domain і falloff?
3. Що задає Vortex Axis?
4. Де стоїть Drag?
5. Де стоїть Solver?
6. Чим Facing відрізняється від Alignment?
7. Який binding потрібен Velocity Aligned?
8. Чому zero velocity проблемна?
9. Навіщо field isolation?
10. Чому CPU лишається baseline?

## 22. Відповіді

1. Curl samples coherent spatial field; сусідні positions мають пов’язані directions.
2. Attraction Radius і Falloff Exponent; Strength керує magnitude.
3. Вісь, навколо якої створюється tangential circulation.
4. Після fields, перед solver.
5. Після всіх forces/drag.
6. Facing орієнтує plane до viewer/vector; alignment орієнтує axes у plane.
7. `Particles.Velocity`.
8. Напрям vector невизначений/нестабільний біля zero.
9. Щоб приписати behavior конкретному field.
10. Counts малі, inspectability важлива, GPU-only need відсутня.

## 23. Чекліст самоперевірки

- [ ] Три named emitters і повні stacks.
- [ ] Один field на кожний baseline.
- [ ] Точні стартові значення Epic записано.
- [ ] Усі fields стоять до Drag/Solver.
- [ ] Доказ Velocity Aligned захоплено.
- [ ] Kill Radius baseline вимкнено.
- [ ] Обґрунтування CPU наведено.
- [ ] Вправи A/B завершено.

## 24. Критерії опанування

Ви з memory відтворюєте три field studies, прогнозуєте direction, виправляєте origin/axis/order, відрізняєте simulation від renderer orientation і пояснюєте cost difference без необґрунтованого GPU switch.

## 25. Підсумок

Curl створює organic field, attraction — inward structure, vortex — circulation. Drag і solver завершують motion pipeline; facing/alignment лише роблять velocity читабельною.

## 26. Зв’язок із наступними уроками

У [07.05](05_sprite_renderer_and_material_bindings.md) Sprite Renderer стане production contract: material compatibility, full bindings, sorting, pivot, SubUV і dynamic material data.

## 27. Офіційні джерела

- [Particle Spawn Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-spawn-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-update-group-reference-for-niagara-effects-in-unreal-engine)
- [GPU Sprite Effect in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-gpu-sprite-effect-in-niagara-for-unreal-engine)
- [Render Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine)
- [Create a Sparks Effect in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- [Mystic Portal — Vortex Force](https://dev.epicgames.com/documentation/en-us/fortnite/mystic-portal-1-create-spark-particles-in-unreal-editor-for-fortnite)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Повний System Overview із трьома emitters.
2. Порівняння fields зверху за однакового timestamp.
3. Vector diagrams Curl/attraction/vortex.
4. Freeze-frame Unaligned проти Velocity Aligned.
5. Panel bindings renderer із Velocity Binding.
