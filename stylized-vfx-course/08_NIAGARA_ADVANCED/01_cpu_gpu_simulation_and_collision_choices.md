# 1. L08-01 — CPU/GPU simulation, collisions і distance fields

| Поле | Значення |
|---|---|
| Блок | 08 — Niagara Advanced |
| ID уроку | L08-01 |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | Paired CPU/GPU collision prototype, limitation captures і simulation журнал рішень |
| Mastery gate | Вибрати simulation target та collision source з вимог ефекту, а не з правила «GPU завжди швидше» |

## 2. Результат уроку

Ви навчитеся:

- пояснювати, де виконується CPU та GPU Niagara simulation;
- обирати Sim Target за data dependencies, collision, count і platform;
- будувати однаковий motion brief у CPU/GPU emitters;
- порівнювати CPU collision із GPU scene-depth/distance-field approaches;
- розрізняти visual collision і gameplay collision;
- виявляти off-screen, thin-geometry, distance-field і bounds випадки відмови;
- створювати журнал рішень з evidence та fallback.

Доказ: одна scene з paired emitters, controlled collision matrix і письмове рішення для чотирьох briefs.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Ментальна модель CPU/GPU | 1.25 | 0 |
| Теорія джерел collision | 0.75 | 0 |
| Керований paired prototype | 2.0 | 2.0 |
| Контрольовані тести відмов | 1.0 | 1.0 |
| Вправи, profiling і журнал рішень | 1.0 | 1.0 |
| **Разом** | **6.0** | **4.0 (66.7%)** |

## 4. Передумови

| Навичка | Де | Перевірка |
|---|---|---|
| Niagara stack, namespaces, Parameter Map | G07 | Простежте одну particle від Spawn до Render |
| Velocity/forces/space | L07-03–L07-04 | Відрізніть velocity від force |
| Bounds і basic performance baseline | L01-04, L07-08 | Збережіть reproducible test camera/count |
| Material renderer cost | G04 | Розділіть simulation та overdraw problem |

## 5. Нові терміни

| Термін | Пояснення |
|---|---|
| Sim Target | Emitter execution target: CPU або GPU Compute Sim |
| GPU Compute Sim | Particle simulation, виконана compute work на GPU |
| CPU Sim | Particle simulation на CPU з доступом до CPU-side workflows |
| Scene Depth collision | GPU collision із depth information, доступною з rendered view |
| Global/mesh distance field | Просторове наближення distance до scene geometry |
| Restitution | Частка normal velocity, збережена як bounce |
| Friction | Опір tangential руху після contact |
| Collision radius | Наближений розмір particle для collision |
| Visual collision | Cosmetic response particles, не authoritative gameplay |
| Authoritative collision | Gameplay hit/collision, яку визначає gameplay/physics logic |

## 6. Навіщо ця тема потрібна VFX-фахівцю

Simulation target впливає не лише на performance:

- CPU Events мають обмеження, яких GPU emitter не підтримує;
- деякі Data Interfaces або operations доступні лише певному target;
- GPU collision sources мають обмеження камери й способу подання;
- high particle count може перевантажити CPU;
- GPU simulation може бути невигідною, якщо bottleneck уже GPU/overdraw;
- target platform може мати інший баланс.

VFX collision зазвичай косметична. Якщо spark відскочив від floor на 3 cm інакше, gameplay не змінюється. Hit detection projectile/ability не слід делегувати випадковій visual particle.

## 7. Теорія простими словами

CPU emitter:

```text
Gameplay/CPU world → CPU particle update → renderer data → GPU draws
```

GPU emitter:

```text
CPU dispatch/setup → GPU particle update → GPU renderer data/draw
```

GPU може паралельно оновлювати багато particles, але це не «безкоштовно». Compute, memory bandwidth, collision sampling і translucent rendering все одно мають cost.

Порядок ухвалення рішення:

```text
1. Які data/feature requirements?
2. Який collision source реально достатній?
3. Який representative count?
4. Де bottleneck на target hardware?
5. Який fallback?
```

## 8. Детальні технічні пояснення

### CPU simulation

Переваги:

- workflow CPU Events;
- простіший access до деяких CPU-side data;
- зручна діагностика невеликої кількості particles;
- може бути доречним для exact per-particle logic із невеликим count.

Ризики:

- per-particle update cost на game/concurrent Niagara CPU work;
- events/collision/data access можуть збільшувати cost;
- великі counts швидко стають невигідними.

### GPU simulation

Переваги:

- краще масштабується для багатьох cosmetic particles у відповідному GPU budget;
- доступ до GPU-oriented collision/data/simulation features;
- не переносить весь particle update на CPU.

Ризики:

- GPU може вже бути bottleneck;
- readback/CPU interaction обмежена або дорога;
- collision approximations мають випадки відмови;
- debugging/profile workflow відрізняється;
- feature/platform support треба перевіряти.

### CPU collision

CPU collision query може бути придатна для невеликого set important cosmetic particles. У Niagara `Collision` module behavior залежить від selected collision type, sim target і project data. Collision після force integration має оновити position/velocity response.

Типовий порядок `Particle Update`:

```text
Particle State
Forces (Gravity/Drag/etc.)
Solve Forces and Velocity
Collision
Post-collision color/kill logic
```

Module dependency warnings можуть запропонувати інший placement у конкретній версії:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### GPU Scene Depth

Scene depth описує surfaces з perspective поточної view. Типові limitations:

- geometry поза camera/frustum не має корисних актуальних даних глибини;
- objects можуть бути occluded або не представлені як очікується;
- thin/off-screen surfaces можуть пропускати particles;
- result залежить від view.

Це добре для cosmetic screen-relevant sparks, якщо occasional miss прийнятний.

### GPU Distance Fields

Distance fields дають volumetric approximation scene geometry. Потрібні project/mesh settings та generated fields. Risks:

- thin geometry/holes/details представлені грубо;
- non-uniform scale, unsupported/moving geometry cases треба перевірити;
- global field resolution/coverage не дорівнює triangle-accurate collision;
- існують витрати памʼяті та продуктивності.

Exact requirements для Mesh/Global Distance Fields у project і Niagara collision mode:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### GPU Ray Tracing collision

Якщо exact GPU ray tracing collision option присутня, її hardware/RHI support і Experimental status не можна робити core dependency:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Core mastery не вимагає цієї feature.

### Persistent IDs та Events

Niagara Events не працюють для GPU simulations; CPU event workflow вимагає Persistent IDs. Ця limitation буде відпрацьована в L08-02.

### Реакція на collision

Розкладіть velocity:

```text
V = Vnormal + Vtangent
Vnormal = dot(V,N) × N
```

Спрощений bounce:

```text
Vafter = Vtangent × (1 - Friction)
       - Vnormal × Restitution
```

Niagara module реалізує власну response logic; формула формує mental model.

## 9. Візуальні й математичні приклади

### Відскок

```text
Incoming V = (100, 0, -300) cm/s
Floor N = (0,0,1)
Restitution = .4
Friction = .2

Vnormal = (0,0,-300)
Vtangent = (100,0,0)
Vafter ≈ (80,0,120)
```

### Відмова, залежна від камери

```text
Camera sees front face of cube:
  SceneDepth collision can respond near visible face.

Particle travels behind camera-side coverage/off-screen:
  required surface may not exist in view depth.
```

### Приклади рішень

| Brief | Імовірний старт | Причина |
|---|---|---|
| 20 важливих debris chunks із CPU event | CPU | Потрібні Events/data, count малий |
| 20k cosmetic rain streaks | GPU candidate | Великий count; approximate collision прийнятна |
| Hit gameplay projectile | Gameplay collision + visual Niagara | Authority перебуває поза particles |
| Persistent dust volume поза екраном | GPU без view-depth-only dependency | SceneDepth не працює off-screen |

## 10. Контрольовані експерименти

### CE08-01-A — Однакова шкала count

CPU/GPU emitters з однаковими:

- spawn count;
- lifetime;
- розмір sprite / material;
- початкова velocity;
- без collision.

Counts: `100`, `1,000`, `10,000` або lower safe levels для вашого hardware. Не оголошуйте universal threshold. Capture CPU/GPU profiling categories і note bottleneck.

### CE08-01-B — Scene Depth поза екраном

1. GPU emitter кидає particles у visible wall.
2. Orbit camera, щоб wall/contact region вийшла за view.
3. Поверніть camera.
4. Зафіксуйте miss/teleport/penetration behavior, якщо виникає.

### CE08-01-C — Тонка геометрія в distance field

1. Товста cube.
2. Тонка plane/rail.
3. Малий деталізований prop.
4. Перевірте distance-field visualization і collision.

### CE08-01-D — Візуальна реакція проти gameplay

Spawn VFX projectile поруч із Blueprint collision sphere. Навмисно змініть particle path noise. Gameplay collision sphere має лишатися authoritative; VFX only follows/represents it.

## 11. Покрокова керована практика

### Крок 1 — Створіть test level

Зони:

- непрозора підлога;
- товста стіна;
- тонка plane;
- рухома перешкода;
- смуга поза екраном;
- маркери відстані;
- зафіксована камера;
- panels із black/mid/white backgrounds.

Запишіть project RHI/platform/build і distance-field setting status.

### Крок 2 — Створіть CPU baseline emitter

`NE_Collision_CPU`:

```text
Emitter Properties
  Sim Target = CPU Sim
  Requires Persistent IDs = false для baseline

Emitter Update
  Spawn Burst Instantaneous
    Spawn Count = 100

Particle Spawn
  Initialize Particle
    Lifetime = 3
    Sprite Size = (8,8)
    Mass = 1
    Color = warm white
  Shape Location: Box
  Add Velocity
    Velocity = cone/downward range

Particle Update
  Particle State
  Gravity Force
    Gravity = (0,0,-980)
  Drag
    Drag = .2
  Solve Forces and Velocity
  Collision
    Restitution = .35
    Friction = .25
    Radius/size mode = documented

Render
  Sprite Renderer
```

Точні module names, inputs і порядок:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 3 — Duplicate as GPU baseline

`NE_Collision_GPU`:

```text
Emitter Properties
  Sim Target = GPU Compute Sim
```

Усуньте stack warnings. Виберіть collision source із GPU support, починаючи зі `Scene Depth`, якщо вона доступна. Збережіть однакові visual parameters.

Не припускайте, що кожен CPU module або DI компілюється для GPU.

### Крок 4 — Expose controls

User Parameters System:

```text
User.SpawnCount
User.Restitution01
User.Friction01
User.CollisionRadiusCm
User.TestTint
```

Скопіюйте або map values на відповідних stages. Використовуйте safe ranges:

```text
Restitution01 0–1
Friction01 0–1
CollisionRadiusCm > 0
```

### Крок 5 — Add collision debug

Контракт кольорів:

```text
Before first collision = yellow
After collision = cyan
Invalid/penetrating test marker = magenta
```

Якщо built-in outputs collision validity/normal відрізняються, expose/store лише values, підтверджені у module output/Parameter Map:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Крок 6 — GPU Scene Depth pass

Виконайте:

- еталонний ракурс камери;
- обліт на 90°;
- стіна зблизька;
- emission поза екраном;
- opaque і translucent receiver.

Запишіть, які surfaces представлені потрібним depth path.

### Крок 7 — GPU Distance Field pass

Увімкніть або використайте підтримуваний проєктом distance-field workflow, якщо він доступний:

- перевірте візуалізацію;
- товста стіна;
- тонка plane;
- рухома перешкода;
- варіації scale;
- ті самі settings частинок.

Запишіть misses; не налаштовуйте restitution так, щоб приховати missing geometry.

### Крок 8 — Count/profile ladder

Для кожної configuration:

| Sim/collision | Count | CPU category | GPU category | Visual misses | Нотатки |
|---|---:|---|---|---:|---|
| CPU/no collision | | | | | |
| CPU/collision | | | | | |
| GPU/no collision | | | | | |
| GPU/SceneDepth | | | | | |
| GPU/DistanceField | | | | | |

Використовуйте representative duration і перезапускайте systems між runs.

### Крок 9 — Запишіть журнал рішень

```text
Effect brief:
Target platform/hardware:
Representative count:
Required data interaction:
Collision accuracy:
Off-screen behavior:
Chosen Sim Target:
Chosen collision source:
Known failure:
Fallback:
Evidence:
```

## 12. Точні modules, properties і bindings

### Специфікація CPU stack

```text
Emitter Properties
  Sim Target = CPUSim

Emitter Update
  Spawn Burst Instantaneous
    Spawn Count ← User.SpawnCount

Particle Spawn
  Initialize Particle
    Lifetime = 3
    Sprite Size = (8,8)
  Shape Location
  Add Velocity

Particle Update
  Particle State
  Gravity Force
  Drag
  Solve Forces and Velocity
  Collision
    Restitution ← User.Restitution01
    Friction ← User.Friction01
    Collision Radius ← User.CollisionRadiusCm

Render
  Sprite Renderer
    Color Binding ← Particles.Color
```

### Відмінності GPU variant

```text
Emitter Properties
  Sim Target = GPUComputeSim

Collision
  Collision Type = GPU-supported Scene Depth or Distance Field
  Response parameters match CPU baseline where meanings align

Bounds
  Validate system/emitter bounds over full trajectory
```

Точні enum display names/defaults і перелік settings для кожного `Sim Target`:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 13. Стартові значення

| Setting | Старт | Діапазон дослідження |
|---|---:|---:|
| Count | 100 | ladder, залежний від hardware |
| Lifetime | 3 s | 1–5 s |
| Initial speed | 400 cm/s | 100–1000 |
| Gravity Z | −980 cm/s² | 0 to −980 |
| Restitution | .35 | 0–1 |
| Friction | .25 | 0–1 |
| Collision radius | 4 cm | 1–12 |
| Drag | .2 | 0–2 |
| Sprite size | 8 cm | 4–20 |

## 14. Очікуваний результат

| Етап | Доказ |
|---|---|
| CPU baseline | 100 particles передбачувано bounce/slide |
| GPU baseline | Той самий visual intent компілюється й працює |
| SceneDepth | Camera-dependent limitation зафіксовано |
| DistanceField | Різницю thick/thin geometry задокументовано |
| Count ladder | Зміни bottleneck виміряно, а не вгадано |
| Authority demo | Gameplay collision не залежить від particle collision |
| Decision record | Вимоги → вибір → обмеження → fallback |

## 15. Самостійна вправа

### EX08-01-A — Decision dossier для чотирьох briefs

Для кожного brief виберіть Sim Target/collision/data approach:

1. sword-hit sparks, 80 particles і optional secondary collision burst;
2. persistent rain із тисячами cosmetic streaks;
3. homing gameplay projectile зі складним trail;
4. ambient dust поза екраном у великій кімнаті.

Потрібні:

- таблиця рішень;
- одна rejected alternative;
- випадок відмови;
- fallback;
- evidence plan для конкретного target.

## 16. Додаткова складніша вправа

### EX08-01-B — Family collision із bounce/slide

З одного System створіть:

- metal sparks: вищий restitution і нижчий friction;
- dust motes: низький restitution, вищий drag, потім kill або settle;
- magic shards: помірний bounce, потім color fade.

CPU і GPU variants мають близький art intent, але limitations documented. Додайте High/Low collision policy та locked performance comparison.

## 17. Три рівні підказок

### EX08-01-A

1. **Напрям:** починайте з required data/authority, не count.
2. **Структура:** Events/gameplay interaction → CPU або external gameplay; великий cosmetic count → GPU candidate.
3. **Майже відповідь:** hit sparks використовують CPU лише коли event справді потрібен; rain — GPU; projectile — gameplay actor/component + visual Niagara; ambient dust — GPU без view-depth-only dependency.

### EX08-01-B

1. **Напрям:** restitution змінює normal bounce, friction/drag — tangential/ongoing motion.
2. **Структура:** expose нормалізовані User controls і map їх у collision module.
3. **Майже відповідь:** Low tier може вилучити cosmetic collision/secondary response, але має зберегти primary hit cue й не впливати на gameplay.

Повні розв’язки: [L08-01 answers](../EXERCISE_ANSWERS/L08-01_cpu_gpu_collision_answers.md).

## 18. Типові помилки

| Помилка | Симптом | Виправлення |
|---|---|---|
| «GPU завжди швидше» | GPU bottleneck/overdraw | Профілювати весь effect |
| Events на GPU | Handler не працює | CPU + Persistent IDs або інший data path |
| SceneDepth для off-screen | Penetration/misses | DF, інший спосіб подання або fallback |
| Thin mesh + DF | Collision misses | Перевірити field, thicker proxy або alternate source |
| Visual particle = gameplay hit | Desync/false hits | Gameplay authority поза VFX |
| Різні materials/counts у A/B | Invalid comparison | Зафіксувати non-sim variables |
| Collision до velocity solve без validation | Odd response | Дотриматися dependencies/stack order |
| Huge bounds як універсальне виправлення | Poor culling | Tight validated maximum |
| Universal numeric threshold | Хибний висновок про platform | Target profiling |

## 19. Усунення несправностей

| Симптом | Послідовність діагностики |
|---|---|
| Помилка компіляції GPU | Sim Target → непідтримувані modules/DI → stack warnings |
| Particles провалюються | Collision enabled/type → source data → radius → module order → receiver |
| Працює лише один camera angle | SceneDepth limitation → DF/alternate |
| Bounce вибухає | Radius/initial penetration → restitution → dt/velocity → normals/source |
| CPU hitch | count/lifetime → частота collision → events/data → profiler |
| Високий GPU cost | count → collision source → overdraw/material → bounds/draw |
| Раннє зникнення | bounds на всій trajectory/WPO |
| Moving object ігнорується | підтримка джерела/спосіб подання; задокументувати limitation |

Точний UI Niagara Debugger/profiling:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## 20. Міркування щодо performance

- Вибір CPU/GPU переміщує work, але не усуває її.
- Collision queries можуть домінувати у simulation cost.
- GPU collision разом із великими translucent sprites може бути важкою і для compute, і для pixels.
- `Count = spawn rate × average lifetime` — лише first-order estimate.
- Events часто додають CPU work/data й недоступні на GPU.
- Distance fields мають trade-offs generation/memory/runtime.
- SceneDepth залежить від view, але може бути достатньою для visible cosmetic particles.
- Fixed/dynamic bounds впливають на culling work і correctness.
- Профілюйте target platform із representative concurrency.
- Не інтерпретуйте final timing з `-StatNamedEvents` або іншими heavy diagnostic modes без зазначення їхнього overhead.

## 21. Запитання для самоперевірки

1. Що визначає Sim Target?
2. Назвіть дві причини вибрати CPU.
3. Чому GPU не гарантує кращий frame time?
4. Яка основна limitation SceneDepth collision?
5. Чому distance field не triangle-accurate?
6. Чи можуть Niagara Events працювати на GPU?
7. Що таке visual collision?
8. Як restitution відрізняється від friction?
9. Чому A/B CPU/GPU має однаковий material/count?
10. Що має містити журнал рішень?

## 22. Відповіді

1. Де виконується emitter particle simulation.
2. CPU Events/CPU data dependency або невеликий count із потрібною CPU logic.
3. Compute, memory, collision й rendering можуть перевантажити GPU.
4. Вона залежить від geometry/depth, представленої поточною view.
5. Це discretized volumetric approximation із resolution/coverage limits.
6. Ні; official limitation — Events CPU only.
7. Cosmetic particle response, яка не визначає gameplay truth.
8. Restitution керує normal bounce; friction зменшує tangential рух.
9. Щоб ізолювати effect Sim Target/collision source.
10. Requirements, platform/count, choice, rejected option, limitations, fallback і evidence.

## 23. Checklist самоперевірки

- [ ] CPU/GPU baseline має однаковий visual brief.
- [ ] SceneDepth off-screen test виконано.
- [ ] Distance field visualization/limitations записано.
- [ ] Gameplay authority відокремлена від VFX.
- [ ] Stack order пояснений.
- [ ] Bounds перевірено на full trajectory.
- [ ] Count ladder зафіксований і reproducible.
- [ ] Universal threshold не заявлено.
- [ ] Decision record має rejected alternative/fallback.
- [ ] Experimental feature не є core dependency.

## 24. Критерії опанування

Урок зараховано, якщо:

1. paired CPU/GPU emitters відтворюють один brief;
2. collision choice відповідає off-screen/geometry requirements;
3. Events limitation пояснена правильно;
4. visual/gameplay collision розділені;
5. мінімум два collision випадки відмови captured;
6. докази продуктивності з locked conditions;
7. EX08-01-A ≥80/100;
8. choice має fallback і target verification plan.

## 25. Підсумок

- Sim Target — рішення щодо data/performance architecture.
- GPU підходить багатьом high-count cosmetic tasks, але не автоматично.
- CPU потрібен для CPU-only workflows, зокрема Niagara Events.
- SceneDepth і distance fields мають різні approximations/випадки відмови.
- Gameplay collision лишається authoritative gameplay system.
- Висновок робиться з requirements і target profile.

## 26. Зв’язок із наступними уроками

У [L08-02](02_events_data_interfaces_and_skeletal_sampling.md) ви побудуєте CPU Event Handler з Persistent IDs, порівняєте його з direct/data-reader approaches та sample-итимете skeletal/data sources через Data Interfaces.

## 27. Офіційні джерела

- [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Events and Event Handlers](https://dev.epicgames.com/documentation/en-us/unreal-engine/events-and-event-handlers-in-niagara-effects-for-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Niagara System and Emitter Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-and-emitter-module-reference-for-niagara-effects-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Mesh Distance Fields](https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-distance-fields-in-unreal-engine) — Epic Games, UE 5.8, доступ 2026-07-27.
- [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara) — Epic Games, UE 5.8, доступ 2026-07-27.

## 28. Рекомендовані скриншоти або схеми

```text
Схема 1
CPU vs GPU data paths.
Виділити: Events CPU-only; render work лишається GPU.
```

```text
Скриншот 2
Collision matrix: thick wall, thin plane, off-screen lane.
Показати: SceneDepth/DistanceField pass/fail markers.
```

```text
Скриншот 3
Locked count ladder.
Показати: same material/count/camera, profiler labels і decision record.
```
