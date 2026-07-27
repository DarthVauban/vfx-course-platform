# 07.03 — Shape locations, velocity, acceleration, drag і gravity

## 1. Назва

**Motion laboratory: spawn shape, initial velocity, accumulated forces, solver order і local/world space.**

## 2. Результат уроку

Ви створите `NS_L07_03_MotionLab`, у якому:

- `Shape Location` задає birth distribution;
- `Add Velocity` задає initial motion;
- `Acceleration Force`, `Gravity Force` і `Drag` змінюють motion у Update;
- `Solve Forces and Velocity` стоїть після forces;
- два однакові emitters демонструють `Local Space=False/True`;
- один particle простежено як `Position → Velocity → Force/Drag → solved Position`.

## 3. Орієнтовний час

**8 годин: 2 години теорії / 6 годин практики.**

- 30 хв — position distribution і Shape Location;
- 45 хв — velocity/acceleration/drag/gravity;
- 30 хв — solver ordering;
- 15 хв — coordinate spaces;
- 90 хв — controlled experiments;
- 180 хв — guided lab;
- 90 хв — exercises A/B.

## 4. Передумови

- урок 07.02 завершено;
- розуміння Particle Spawn/Update і normalized timing;
- перевірений sprite material;
- рухомий Niagara actor у test level; Blueprint не потрібен.

## 5. Нові терміни

- **Spawn distribution** — правило вибору initial positions.
- **Velocity** — напрям і швидкість, `cm/s`.
- **Acceleration** — зміна velocity за секунду, conceptual `cm/s²`.
- **Force accumulator** — intermediate Niagara physics data, куди force modules додають вплив до solver.
- **Drag** — опір, що зменшує velocity; не negative gravity.
- **Solver** — module, що застосовує accumulated forces/drag до velocity/position.
- **Simulation space** — coordinate system, у якому particle attributes інтерпретуються.
- **World Space** — coordinates відносно world origin.
- **Local Space** — coordinates відносно owning Niagara Component.

## 6. Навіщо ця тема потрібна VFX artist

Shape без velocity — лише хмара initial points. Velocity без shape — пучок з одного origin. Forces без правильного solver order не рухають particles як очікується. Space визначає, чи вже народжений effect «прилипає» до меча/персонажа, чи залишається у світі. Ці чотири decisions лежать під sparks, dust, debris, magic wisps і trails.

## 7. Теорія простими словами

На birth:

1. `Initialize Particle` створює базові attributes.
2. `Shape Location` обирає точку.
3. `Add Velocity` задає перший поштовх.

На кожному Update:

1. `Particle State` оновлює age.
2. force modules додають вплив.
3. `Drag` додає опір.
4. `Solve Forces and Velocity` обчислює нові velocity та position.
5. appearance modules можуть змінити color/size.

Якщо gravity стоїть нижче solver, її input не потрапляє в уже виконаний solve цього stack pass.

## 8. Детальні технічні пояснення

### Position і velocity

Для простого constant velocity без force:

```text
Position(t) = Position0 + Velocity0 × t
```

При acceleration:

```text
Velocity(t+dt) ≈ Velocity(t) + Acceleration × dt
Position(t+dt) ≈ Position(t) + Velocity(updated) × dt
```

Niagara solver implementation і drag integration не слід підміняти власною exact physics формулою; ці рівняння — mental model.

### Залежності modules

Epic particle reference вказує:

- `Initialize Particle` — на початку Particle Spawn;
- point-based velocity/force має читати вже initialized position, тому location стоїть вище;
- forces пишуть accumulator;
- `Drag` розв’язується в `Solve Forces and Velocity`;
- solver має бути після forces.

### Local/World

`Emitter.LocalSpace=False`: particle position є world-space; після birth рух component не переносить уже існуючий particle як локальну точку.

`Emitter.LocalSpace=True`: particle position відносна до component; transform component впливає на весь cloud. Не змішуйте world vector із local interpretation без conversion. Foundation lab змінює лише `Local Space` і component transform.

### Вибір CPU

CPU дає просту low-count inspection і не потребує GPU fixed bounds. Collision навмисно відсутній: CPU/GPU collision choices — 08.01.

## 9. Візуальні або математичні приклади

Без drag: `V0=(200,0,200)`, `G=(0,0,-400)`.

| t | приблизний Vz | приблизний offset Z |
|---:|---:|---:|
| `0` | `200` | `0` |
| `.5` | `0` | `≈50` |
| `1` | `-200` | `≈0` |

З drag trajectory коротша й terminal behavior м’якший. `Shape Location: Sphere Radius=25` змінює лише `Position0`, не автоматично velocity.

## 10. Контрольовані експерименти

1. **Shape only:** velocity/forces zero; particles залишаються у sphere.
2. **Лише Velocity:** `Add Velocity From Point=200`; хмара розширюється радіально.
3. **Acceleration:** додайте `(0,0,100)` перед solver; trajectory згинається вгору.
4. **Gravity:** замініть на `(0,0,-300)`; trajectory вниз.
5. **Drag:** `0→2`; порівняйте travel distance.
6. **Wrong order:** тимчасово перенесіть Gravity нижче solver; capture dependency warning/result, потім виправте.
7. **Space:** pause після spawn, move actor `+200 X`; порівняйте local/world emitters.

## 11. Покрокова guided practice

Створіть `NS_L07_03_MotionLab` з emitters `NE_Motion_World` і `NE_Motion_Local`. Другий duplicate першого; змінюються seed, initial X та `Local Space`.

### Повний stack кожного emitter

```text
System Properties
System Spawn: no added modules
System Update: System State
Emitter Properties
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
  Acceleration Force
  Gravity Force
  Drag
  Solve Forces and Velocity
  Scale Color
  Scale Sprite Size
Render
  Sprite Renderer
```

### Налаштування

- World: `CPUSim`, `Local Space=False`, determinism true, seed `303`, початковий Position offset `(-70,0,0)`.
- Local: `CPUSim`, `Local Space=True`, determinism true, seed `304`, offset `(70,0,0)`.
- `Emitter State`: Self, Complete, Once, Fixed `2.5 s`.
- `Spawn Burst Instantaneous`: Count `16`, Time `0`.
- `Initialize Particle`: Lifetime `2.0`; Color world `(1,.35,.03,1)`, local `(.05,.65,1,1)`; Sprite Size `(14,14)`; Mass `1` if exposed.
- `Shape Location`: `Shape Primitive=Sphere`; `Sphere Radius=25`.
- `Add Velocity`: `Velocity Mode=From Point`; origin `(0,0,0)`; `Velocity Speed=200 cm/s`.
- `Acceleration Force`: `Acceleration=(0,0,100)`.
- `Gravity Force`: vector `(0,0,-300)`.
- `Drag`: `Drag=0.8`.
- `Solve Forces and Velocity`: default settings.
- Крива Alpha `(0,1),(.75,1),(1,0)`; крива size `(0,.7),(.2,1),(1,.2)`.

`Shape Location` є current consolidated label у Quick Start, але installed content може також показати primitive-specific `Sphere Location`. Використовуйте один, не обидва, і record label. **Потребує ручної перевірки в Unreal Engine 5.8.**

### Bindings renderer

Material `MI_VFX_FoundationSprite`; Face Camera; Unaligned; Position/Color/Velocity/Rotation/Size/NormalizedAge bindings до відповідних `Particles.*`.

### Перевірка простору

1. Reset і дочекайтеся `0.4 s`.
2. Призупиніть.
3. Move Niagara actor з X `0` до `200`.
4. Продовжте.
5. Local cloud зміститься з component; world cloud зберігає world-space history. Запишіть transform до/після.

## 12. Точні назви UE nodes, modules і settings

`Initialize Particle`; `Shape Location`; `Add Velocity`; `Acceleration Force`; `Gravity Force`; `Drag`; `Solve Forces and Velocity`; `Particle State`; `Scale Color`; `Scale Sprite Size`; `Shape Primitive`; `Sphere Radius`; `Velocity Mode`; `From Point`; `Velocity Speed`; `Acceleration`; `Local Space`; `Sim Target`.

Epic також документує `Sphere Location`, `Box Location`, `Cone Location`, `Add Velocity from Point`, `Add Velocity in Cone`. Не дублюйте consolidated й specialized module в одному baseline. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Parameter | Значення |
|---|---:|
| burst | `16 @ 0 s` |
| lifetime | `2.0 s` |
| sphere radius | `25 cm` |
| velocity mode/speed | `From Point / 200 cm/s` |
| acceleration | `(0,0,100)` |
| gravity | `(0,0,-300)` |
| drag | `.8` |
| sprite size | `(14,14)` |
| seeds | `303`, `304` |
| local flags | `False`, `True` |

## 14. Очікуваний результат кожного етапу

- Shape: компактний сферичний об’єм народження.
- Velocity: радіальне розширення.
- Acceleration + gravity: результуюче викривлення вниз після початкового розширення.
- Drag: обмежена дальність.
- Порядок Solver: dependency warning відсутній.
- Перевірка простору: local set слідує за transform component; world set не перебазовується.
- Curves: читабельне народження й чисті fade/death.

## 15. Самостійна вправа

### `EX-L07-03-A` — Фонтан із Box

Створіть `NS_EX_L07_03_BoxFountain`: `Shape Location=Box`, box size `(80,20,10)`, burst `24`, upward velocity `(0,0,260)` with X/Y spread, gravity `-500 Z`, drag `.4`, lifetime `1.2`, seed `1303`. Подайте full stack, trajectory table і capture без Collision.

[Повне рішення A](../EXERCISE_ANSWERS/L07-03_shape_location_velocity_and_forces_answers.md#ex-l07-03-a)

## 16. Додаткова складніша вправа

### `EX-L07-03-B` — Обернені парні local/world варіанти

Два otherwise identical emitters мають initial velocity along simulation X `(250,0,0)`. Rotate System actor `90°` around Z. Один emitter Local, інший World. Перед запуском спрогнозуйте direction, потім перевірте й поясніть space of vector.

[Повне рішення B](../EXERCISE_ANSWERS/L07-03_shape_location_velocity_and_forces_answers.md#ex-l07-03-b)

## 17. Три рівні підказок

### Для `EX-L07-03-A`

- **Hint 1:** location має стояти до initial velocity.
- **Hint 2:** використайте `Add Velocity` direct vector або Random Range Vector з symmetric X/Y і positive Z.
- **Hint 3:** порядок update: State → Gravity → Drag → Solve → appearance.

### Для `EX-L07-03-B`

- **Hint 1:** спершу підпишіть simulation X arrow у двох spaces.
- **Hint 2:** local vector трансформується component rotation; world vector має бути заданий/інтерпретований у world.
- **Hint 3:** якщо module має explicit coordinate-space input, зафіксуйте його; не покладайтеся лише на emitter flag.

## 18. Типові помилки

- solver вище forces;
- point velocity до location;
- gravity у Particle Spawn замість Update;
- змішувати velocity і acceleration units;
- тестувати space, одночасно змінюючи seed/shape;
- додавати Collision завчасно;
- вважати Drag constant negative acceleration;
- забути `Particle State`.

## 19. Пошук несправностей

| Симптом | Перевірка | Виправлення |
|---|---|---|
| particles нерухомі | velocity/solver | початковий velocity; solver після forces |
| gravity ігнорується | order/enabled | перемістіть вище solver |
| випадковий вибуховий напрямок | position збігається з point origin | спочатку location; ненульовий radius |
| local/world однакові | actor не рухався й не обертався | виконайте контрольований transform після birth |
| shape подвоєно | modules Shape + Sphere | залиште один location module |
| dependency warning | порядок module | `Fix Issue`, потім порівняйте stack |

## 20. Міркування про performance

- Force modules виконуються для кожної живої частинки за кожний update; Rate×Lifetime оцінює workload.
- Curl/noise ще немає; аналітичні gravity/drag є простішим baseline.
- Великі sprites можуть коштувати більше через overdraw, ніж їхня проста motion simulation.
- CPU-лабораторія з малою кількістю доречна; не екстраполюйте результат на тисячі частинок.
- Відсутність Collision уникає прихованої вартості queries і зберігає ізоляцію foundation variables.

## 21. Запитання для самоперевірки

1. Що writes Shape Location?
2. У яких units velocity?
3. Чому location вище From Point velocity?
4. Де мають стояти forces відносно solver?
5. Чим Drag відрізняється від Gravity?
6. Що змінює `Local Space=True`?
7. Чи renderer виконує integration?
8. Чому Collision відсутній?
9. Що станеться без Particle State?
10. Яка одна variable має змінитися у clean space comparison?

## 22. Відповіді

1. Початковий distribution `Particles.Position`.
2. `cm/s`.
3. Direction від point потребує вже initialized particle position.
4. Перед `Solve Forces and Velocity`.
5. Gravity додає directional acceleration/force; drag гасить motion залежно від solver model.
6. Particle coordinates стають relative до owning component.
7. Ні.
8. Це окрема CPU/GPU collision тема 08.01 і confounder.
9. Age/death lifecycle не працюватиме коректно.
10. Space setting/coordinate interpretation; інші inputs повинні збігатися.

## 23. Чекліст самоперевірки

- [ ] Повний порядок stack правильний.
- [ ] Shape перед point velocity.
- [ ] Forces перед solver.
- [ ] Units записані.
- [ ] Local/world test має transform evidence.
- [ ] Seeds зафіксовано.
- [ ] Немає Collision/Event/Scratch Pad.
- [ ] A/B завершено.
- [ ] 8/10 Q&A.

## 24. Критерії опанування

За 30 хвилин ви створюєте clean shape-motion emitter, прогнозуєте trajectory sign, діагностуєте solver order, пояснюєте local/world на рухомому component і подаєте inspectable full stack.

## 25. Підсумок

Location задає birth point, velocity — initial motion, forces/drag — per-frame change, solver — integration, space — frame of reference. Correct order робить motion передбачуваним.

## 26. Зв’язок із наступними уроками

У [07.04](04_curl_noise_attraction_vortex_and_orientation.md) analytic motion доповнять Curl Noise, Point Attraction і Vortex; facing/alignment зроблять direction видимим.

## 27. Офіційні джерела

- [Quick Start for Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine)
- [Particle Spawn Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-spawn-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-update-group-reference-for-niagara-effects-in-unreal-engine)
- [Emitter Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/emitter-update-group-reference-for-niagara-effects-in-unreal-engine)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Повний stack force/solver.
2. Триптих лише Shape, лише velocity, gravity+drag.
3. Transform actor local/world до й після.
4. Vector diagram `P0`, `V0`, gravity, solved path.
5. Dependency-warning capture і corrected order.
