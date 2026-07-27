# 07.02 — Spawn, lifetime, normalized age і curves

## 1. Назва

**Керований час Niagara: Burst, Rate, lifetime, age, normalized age, curves і deterministic reset protocol.**

## 2. Результат уроку

Ви побудуєте `NS_L07_02_TimingStudy` з двома CPU emitters і зможете:

- відрізнити `Spawn Burst Instantaneous` від `Spawn Rate`;
- пояснити `Particles.Age`, `Particles.Lifetime`, `Particles.NormalizedAge` і `Emitter.Age`;
- розрахувати `NormalizedAge = Age / Lifetime`;
- анімувати alpha та sprite size по однаковій normalized осі;
- зробити повторюваний test через deterministic seed, fixed inputs і однаковий reset protocol;
- перевірити theoretical spawn count проти observed living count.

## 3. Орієнтовний час

**7 годин: 2 години теорії / 5 годин практики.**

- 45 хв — Burst/Rate і emitter window;
- 45 хв — Age/Lifetime/NormalizedAge;
- 30 хв — curves і interpolation;
- 60 хв — контрольовані експерименти;
- 150 хв — guided study;
- 90 хв — exercises A/B та evidence.

## 4. Передумови

- завершений 07.01;
- уміння читати execution groups, namespaces і Parameter Map;
- `MI_VFX_FoundationSprite`;
- чистий test map із зафіксованим viewport exposure.

## 5. Нові терміни

- **Spawn Count** — кількість particles у конкретному burst.
- **Spawn Time** — час burst усередині emitter loop.
- **Spawn Rate** — очікувана кількість particles за секунду active spawning.
- **Age** — скільки секунд particle уже живе.
- **Lifetime** — скільки секунд particle має жити.
- **Normalized Age** — безрозмірна фаза `Age/Lifetime`, зазвичай від `0` до `1`.
- **Curve key** — пара input/output на curve.
- **Interpolation** — правило між keys.
- **Deterministic random stream** — random sequence, повторювана для того самого seed і compatible execution path.
- **Reset protocol** — однакова процедура restart, capture time і test state.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Stylized impact читається через timing: швидкий onset, короткий hold, контрольований decay. Якщо curve прив’язана до секунд, зміна lifetime ламає форму. Якщо вона прив’язана до normalized age, короткий і довгий particle проходять ті самі фази у різному темпі. Spawn method окремо керує кількістю та ритмом, а lifetime — одночасною насиченістю.

## 7. Теорія простими словами

Burst відповідає на питання «скільки народити в цей момент?». Rate — «скільки народжувати щосекунди, поки emitter active?». Lifetime не породжує particles; він задає їхній death horizon.

Для particle з lifetime `2 s`:

```text
Age 0.0 → NormalizedAge 0.00
Age 0.5 → NormalizedAge 0.25
Age 1.0 → NormalizedAge 0.50
Age 2.0 → NormalizedAge 1.00 → death
```

Curve читає X=`NormalizedAge` і повертає multiplier. Тому X-axis означає частку життя, не секунди.

## 8. Детальні технічні пояснення

### Чотири часові величини

- `Emitter.Age` — час emitter instance.
- `Emitter.LoopedAge` — час у поточному loop.
- `Particles.Age` — час конкретного particle від spawn.
- `Particles.NormalizedAge` — `Particles.Age / Particles.Lifetime`.

Particle, народжений у `Emitter.Age=1.2`, починає зі свого `Particles.Age≈0`, а не `1.2`.

### Rate і кількість

Для constant rate `R`, active duration `D`:

```text
theoretical total ≈ R × D
steady living count ≈ R × Lifetime
```

При `R=10/s`, `D=2 s`, `Lifetime=1 s`: total близько `20`, а steady living count близько `10`. Frame sampling, interpolation, editor pause/reset і boundary tick можуть змінити конкретний observed count на межі. Не називайте один screenshot математичним доказом.

### Контракт curve

`Scale Color` множить initial RGB/alpha, а `Scale Sprite Size` множить initial size. Guided curve:

| X = `Particles.NormalizedAge` | Alpha | Множник size |
|---:|---:|---:|
| `0.00` | `0.00` | `0.25` |
| `0.10` | `1.00` | `1.00` |
| `0.70` | `1.00` | `1.00` |
| `1.00` | `0.00` | `0.00` |

Використовуйте linear interpolation для відтворюваного читання. Пізніше можна художньо формувати tangents.

### Determinism без перебільшень

Set `Determinism = True`, fixed `Random Seed`, fixed ranges and identical reset/capture. This stabilizes random choices within the recorded engine build and execution path. It does not guarantee bit-identical results across engine versions, platforms, changed module order or variable frame schedules. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 9. Візуальні або математичні приклади

Emitter Burst: `12 @ t=0`, lifetime `1 s`.

```text
t=0.00: 12 born
t=0.50: 12 alive, normalized age ≈ .5
t=1.00: death boundary
```

Emitter Rate: `10/s`, active `2 s`, lifetime `1 s`.

| Час | Приблизно створено загалом | Приблизно живих |
|---:|---:|---:|
| `.5 s` | `5` | `5` |
| `1.0 s` | `10` | `10` |
| `1.5 s` | `15` | `10` |
| `2.0 s` | `20` | `10`, потім decay |
| `3.0 s` | `20` | `0` |

## 10. Контрольовані експерименти

1. **Lifetime:** змініть тільки Burst lifetime `1→2 s`; onset той самий, curve проходиться вдвічі довше.
2. **Rate:** змініть `10→20/s`; приблизна living density подвоюється, particle lifetime ні.
3. **Normalized curve:** поставте size key `(0.5,2)`; обидві lifetime variants досягають піку посередині власного життя.
4. **Seconds trap:** підмініть curve input на `Particles.Age`; particle з lifetime `0.5` не дістанеться keys після `.5`.
5. **Reset:** тричі виконайте Reset Simulation і capture на `t=.50`; random-free guided setup має збігтися в межах frame/capture protocol.

## 11. Покрокова керована практика

Створіть `NS_L07_02_TimingStudy` з emitters `NE_Timing_Burst` і `NE_Timing_Rate`.

### Повний stack — Burst

```text
System Properties
System Spawn: no added modules
System Update: System State
NE_Timing_Burst
  Emitter Properties
  Emitter Spawn: no added modules
  Emitter Update
    Emitter State
    Spawn Burst Instantaneous
  Particle Spawn
    Initialize Particle
  Particle Update
    Particle State
    Scale Color
    Scale Sprite Size
  Render
    Sprite Renderer
```

Налаштування: `CPUSim`, `Local Space=False`, determinism `True`, seed `202`; lifecycle `Self/Complete/Once/Fixed 2.0 s`; burst `Count=12`, `Spawn Time=0`; lifetime `1.0`; position `(-80,0,0)`; velocity zero; color `(1,.2,.03,1)`; size `(28,28)`.

### Повний stack — Rate

Stack ідентичний, окрім того, що `Spawn Rate` замінює burst. Налаштування: seed `203`; lifecycle `Once/2.0 s`; `Spawn Rate=10.0 particles/s`; lifetime `1.0`; position `(80,0,0)`; color `(.02,.5,1,1)`; size `(28,28)`.

### Modules curve

Для обох emitters:

- `Scale Color`: `Scale RGB=False`; `Scale Alpha=True`; input `Particles.NormalizedAge`; Float-from-Curve keys `(0,0)`, `(.1,1)`, `(.7,1)`, `(1,0)`, Linear.
- `Scale Sprite Size`: `Scale Sprite = Uniform` or equivalent; Float-from-Curve input `Particles.NormalizedAge`; keys `(0,.25)`, `(.1,1)`, `(.7,1)`, `(1,0)`, Linear.

### Bindings renderer

`Position→Particles.Position`; `Color→Particles.Color`; `Velocity→Particles.Velocity`; `Sprite Rotation→Particles.SpriteRotation`; `Sprite Size→Particles.SpriteSize`; `Normalized Age→Particles.NormalizedAge`. Material `MI_VFX_FoundationSprite`, `Face Camera`, `Unaligned`, pivot `(.5,.5)`.

### Докази таймінгу

Capture Reset at `t≈0`, `.5`, `1`, `1.5`, `2`, `3 s`. Додайте theoretical table, observed count і tolerance explanation. Не редагуйте settings між captures.

## 12. Точні назви вузлів, модулів і налаштувань UE

- `Emitter State`, `Spawn Burst Instantaneous`, `Spawn Rate`;
- `Initialize Particle`, `Particle State`;
- `Scale Color`, `Scale Sprite Size`;
- `Float from Curve`;
- `Life Cycle Mode`, `Inactive Response`, `Loop Behavior`, `Loop Duration Mode`, `Loop Duration`;
- `Spawn Count`, `Spawn Time`, `Spawn Rate`;
- `Lifetime`, `Scale RGB`, `Scale Alpha`, `Scale Factor`;
- `Particles.Age`, `Particles.Lifetime`, `Particles.NormalizedAge`, `Emitter.Age`, `Emitter.LoopedAge`.

Dynamic-input menu path і curve template names можуть різнитися. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Налаштування | Burst | Rate |
|---|---:|---:|
| seed | `202` | `203` |
| loop duration | `2.0 s` | `2.0 s` |
| spawn | `12 @ 0 s` | `10/s` |
| lifetime | `1.0 s` | `1.0 s` |
| position | `(-80,0,0)` | `(80,0,0)` |
| sprite size | `(28,28)` | `(28,28)` |
| velocity | `(0,0,0)` | `(0,0,0)` |
| alpha curve | `0,.1,.7,1 → 0,1,1,0` | те саме |
| size curve | `0,.1,.7,1 → .25,1,1,0` | те саме |

## 14. Очікуваний результат кожного етапу

- Burst: 12 particles народжуються разом.
- Rate: particles з’являються послідовно протягом 2 s.
- На `.5 normalized age` обидва типи мають повний alpha/size.
- На death boundary alpha/size прямують до zero, `Particle State` видаляє particle.
- Три resets відтворюють той самий порядок і fixed appearance.
- Rate total і living count не плутаються у звіті.

## 15. Самостійна вправа

### `EX-L07-02-A` — Трифазний burst

Створіть один emitter з burst phases `4 @ 0.0 s`, `6 @ 0.25 s`, `2 @ 0.5 s`; fixed lifetime `1.0 s`; seed `1202`; one-second emitter loop. Дайте phase colors через три окремі emitter instances або documented spawn-group method; базовий прийнятний варіант — три emitters у одному System. Доведіть timeline і death times.

[Повне рішення A](../EXERCISE_ANSWERS/L07-02_spawn_lifetime_normalized_age_and_curves_answers.md#ex-l07-02-a)

## 16. Додаткова складніша вправа

### `EX-L07-02-B` — Дослідження еквівалентності Rate/Burst

Порівняйте `20-particle burst` із `Rate=20/s` протягом `1 s`, lifetime `.5 s`. Побудуйте table total/alive на `.25`, `.5`, `.75`, `1`, `1.5 s`; поясніть, чому однаковий total не означає однаковий visual rhythm.

[Повне рішення B](../EXERCISE_ANSWERS/L07-02_spawn_lifetime_normalized_age_and_curves_answers.md#ex-l07-02-b)

## 17. Три рівні підказок

### Для `EX-L07-02-A`

- **Hint 1:** кожна phase має власний spawn time, але lifetime відраховується від birth кожного particle.
- **Hint 2:** найпрозоріше foundation-рішення — три emitters з однаковим stack і різними burst time/color.
- **Hint 3:** death boundaries: приблизно `1.0`, `1.25`, `1.5 s`.

### Для `EX-L07-02-B`

- **Hint 1:** окремо рахуйте cumulative spawned і currently alive.
- **Hint 2:** для Rate steady estimate використайте `R×Lifetime = 10`.
- **Hint 3:** burst має 20 alive одразу; rate накопичує до ~10, поки старі вже помирають.

## 18. Типові помилки

- трактувати normalized age як секунди;
- анімувати curve від `Emitter.Age` для per-particle fade;
- плутати total spawned і alive;
- залишати random lifetime у timing baseline;
- ставити `Scale Color` у Particle Spawn і чекати animation;
- вимикати `Particle State`;
- порівнювати captures із різним editor time dilation;
- називати deterministic seed fixed timestep.

## 19. Пошук несправностей

| Симптом | Причина | Дія |
|---|---|---|
| Rate не зупиняється | Infinite loop | `Self`, `Once`, duration `2` |
| fade не працює | material не використовує Particle Color alpha | перевірте material contract 04.06 |
| size jump | duplicate size write нижче | ізолюйте `Scale Sprite Size` |
| particle живе вічно | нема `Particle State` | поверніть module |
| count різниться на boundary | frame/capture sampling | записуйте tolerance і час, не один screenshot |
| curve читає не ту вісь | Age замість NormalizedAge | bind `Particles.NormalizedAge` |

## 20. Міркування про продуктивність

- Approx alive count `Rate×Lifetime` — перша budget estimate.
- Збільшення lifetime може збільшити одночасний particle count без зміни Rate.
- Curve evaluation має cost; один shared artistic curve кращий за дубльовані суперечливі modules, але спершу профілюйте.
- Translucent overdraw залежить від розміру та overlap, не лише count.
- CPU baseline тут потрібен для inspectable count; high-count GPU decision — 08.01.

## 21. Запитання для самоперевірки

1. Чим Spawn Rate відрізняється від Burst?
2. Що є X-axis normalized curve?
3. Яка normalized age при Age `.3`, Lifetime `1.2`?
4. Чи два particles з різним lifetime можуть мати однакову normalized age?
5. Чому lifetime впливає на living count Rate emitter?
6. Чи deterministic seed фіксує frame rate?
7. Навіщо `Particle State`?
8. Чому alpha curve не обов’язково змінює opacity?
9. Що означає `20/s`?
10. Чому однаковий total Burst і Rate виглядає інакше?

## 22. Відповіді

1. Burst створює count у момент; Rate інтегрує particles за active seconds.
2. `Particles.NormalizedAge`, зазвичай `0–1`.
3. `.3/1.2=.25`.
4. Так, якщо вони перебувають на однаковій частці власного життя.
5. Старі particles залишаються alive довше, тому накопичуються.
6. Ні.
7. Оновлює age/normalized age і lifecycle/death.
8. Material має читати `Particles.Color` alpha через renderer/material binding.
9. Очікувано 20 spawn events за одну active секунду.
10. Burst синхронний; Rate розподіляє birth і normalized phases у часі.

## 23. Чекліст самоперевірки

- [ ] Two-emitter full stacks задокументовані.
- [ ] Timestamps і reset protocol записані.
- [ ] Fixed lifetime baseline використано.
- [ ] Curves мають exact keys.
- [ ] `Particles.NormalizedAge` є input.
- [ ] Theoretical total/alive розділені.
- [ ] Seed і build записані.
- [ ] Exercises A/B виконані.
- [ ] 8/10 Q&A правильні.

## 24. Критерії опанування

Ви без tutorial створюєте Burst і Rate study, прогнозуєте timeline, будуєте normalized fade/size curves, пояснюєте boundary tolerance, діагностуєте wrong age input і відтворюєте test після Reset.

## 25. Підсумок

Spawn визначає birth rhythm; lifetime — death horizon; normalized age — універсальну фазу життя; curve — shape у цій фазі. Deterministic test потребує seed, fixed inputs, build і repeatable reset, а не лише checkbox.

## 26. Зв’язок із наступними уроками

У [07.03](03_shape_location_velocity_and_forces.md) particles отримають position distribution, initial velocity та forces. Timing curves залишаться контрольним шаром appearance.

## 27. Офіційні джерела

- [Emitter Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/emitter-update-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Spawn Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-spawn-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-update-group-reference-for-niagara-effects-in-unreal-engine)
- [GPU Sprite Effect in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-gpu-sprite-effect-in-niagara-for-unreal-engine)
- [Quick Start for Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Two-emitter stack із Burst і Rate modules.
2. Alpha й size curve editors з exact keys.
3. Timing strip із шести кадрів `0→3 s`.
4. Plot cumulative spawned vs alive для Rate.
5. Trace параметра `Lifetime→Age→NormalizedAge→curve→renderer`.
