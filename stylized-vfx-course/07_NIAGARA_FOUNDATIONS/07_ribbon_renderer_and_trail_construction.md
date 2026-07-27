# 07.07 — Ribbon Renderer і побудова trail

## 1. Назва

**Стабільний ribbon trail: упорядковані particles, Initialize Ribbon, width/twist, UV tiling, tessellation і повний набір bindings.**

## 2. Результат уроку

Ви створите `NS_L07_07_RibbonTrail`, у якому безперервний потік particles утворює одну стабільну балістичну ribbon. Ви поясните, чому ribbon — це смуга між багатьма particles, налаштуєте width/color за normalized age, UV0 tiling, Screen facing, Automatic tessellation, RibbonID/LinkOrder bindings і контракт material.

## 3. Орієнтовний час

**7 годин: 1.5 години теорії / 5.5 години практики.**

- 45 хв — топологія, порядок і атрибути ribbon;
- 45 хв — UV, facing і tessellation у renderer;
- 60 хв — практика M/S: ribbon material, UV і Particle Color;
- 75 хв — контрольовані експерименти;
- 135 хв — покрокова побудова ribbon;
- 60 хв — вправи A/B.

Практика M/S блока: **остання 1 година; сукупно 4/4**.

## 4. Передумови

- 07.06;
- 04.05 `M_VFX_Ribbon_Template` і `MI_VFX_Ribbon_Production`;
- перевірені ribbon texture і напрямок UV;
- розуміння Rate, Lifetime, forces, normalized age та bindings.

## 5. Нові терміни

- **Ribbon** — відрендерена смуга, вершини якої побудовано з упорядкованих particle points.
- **Ribbon point** — particle, позиція якого стає контрольною точкою смуги.
- **Ribbon ID** — групує particles в окрему ribbon.
- **Ribbon Link Order** — явно визначає порядок зв’язків у межах ID.
- **Ribbon Width** — атрибут ширини в Unreal units.
- **Ribbon Twist** — скручування в кожній точці.
- **UV0 Tiling Distance** — інтервал світової відстані, через який повторюється U.
- **Age Offset Mode** — вікове зміщення UV; згідно з довідкою renderer, не використовується разом із Tiling Distance/LinkOrder у відповідних конфігураціях.
- **Tessellation** — додаткові вершини між particle points для згладження кривої.
- **Curve Tension** — керує гостротою та поведінкою дотичних кривої ribbon.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Ribbon лежить в основі projectile trails, weapon slashes, magic streams і energy arcs. Типова помилка — очікувати trail від одного sprite particle. Інша — збільшувати tessellation, коли проблема насправді в низькому spawn rate або нестабільному link order. VFX artist має окремо контролювати дискретизацію points, linking, width, UV і згладжування.

## 7. Теорія простими словами

Кожний новий particle залишає point. Renderer з’єднує points з однаковим Ribbon ID у визначеному порядку:

```text
P0 — P1 — P2 — P3 — ... → strip
```

`Spawn Rate` визначає часову щільність points. `Velocity/forces` розводять старі й нові points у просторі. `Lifetime` визначає видиму довжину trail. Renderer створює поверхню між ними.

## 8. Детальні технічні пояснення

### Стабільне генерування points

Для швидкості `300 cm/s` і rate `30/s` відстань між points без force становить приблизно `300/30=10 cm`. Lifetime `1.2 s` дає довжину path близько `360 cm`. Якщо rate падає до `5/s`, відстань зростає приблизно до 60 cm, а смуга має гострі сегменти; tessellation може згладити інтерполяцію, але не відновить втрачений зразок руху.

### Ініціалізація

У довідці Epic зазначено: `Initialize Ribbon` має бути на початку Particle Spawn і містить атрибути point, а також Ribbon Width/Twist. У базовому варіанті не ставте перед ним `Initialize Particle` із конфліктними записами.

### ID/order

Базова конфігурація з одним emitter і однією ribbon використовує спільний default Ribbon ID та `Ribbon ID Binding=Particles.RibbonID` у renderer. `Ribbon Link Order Binding=Particles.RibbonLinkOrder` читає явно заданий порядок, якщо атрибут існує; встановлений template/module може його надавати. Не вигадуйте float-порядок через normalized age під час spawn: усі particles починають майже з нуля. Для кількох незалежних ribbons у foundation-рішенні використовуйте окремі emitters; розширені event/data patterns належать до блока 08.

### UV і tessellation

`UV0 Tiling Distance=50` повторює texture приблизно через кожні 50 cm уздовж path. За використання tiling distance age offset працює інакше; документація renderer вказує, що в цій конфігурації age offset вимкнено або не використовується. `Tessellation Mode=Automatic` є безпечним базовим режимом. Custom max factor `1–16` — рішення щодо співвідношення вартості та якості, а не повзунок якості, який слід ставити на максимум.

### Facing

`Facing Mode=Screen` повертає ribbon до камери. `Custom` читає `Particles.RibbonFacing`; `Custom Side Vector` трактує його як бічний вектор і не підтримує Ribbon Twist так само. Базовий режим — Screen.

## 9. Візуальні або математичні приклади

```text
speed = 300 cm/s
rate = 30 points/s
spacing ≈ 10 cm
lifetime = 1.2 s
living points ≈ 36
unforced length ≈ 360 cm
UV0 Tiling Distance = 50 cm → about 7.2 repeats
```

Gravity сильніше викривляє старі points, ніж щойно створені, утворюючи балістичну дугу.

## 10. Контрольовані експерименти

1. Rate `5/15/30/60`, решту налаштувань зафіксовано; порівняйте відстань між points.
2. Lifetime `.4/1.2/2`, rate зафіксовано; порівняйте довжину та кількість.
3. Ribbon Width `4/12/30`.
4. Увімкнена/вимкнена крива Scale Ribbon Width.
5. UV0 Tiling Distance `0/50/100`; перевірте розтягування та повтори.
6. Tessellation Disabled/Automatic; порівняйте силует і вартість.
7. Facing Screen/Custom лише після запису RibbonFacing; відновіть Screen.
8. Навмисно зламайте Ribbon ID Binding; зафіксуйте фрагментацію та відновіть binding.

## 11. Покрокова практика

### Повний stack

```text
NS_L07_07_RibbonTrail
├─ System Properties
├─ System Spawn: no added modules
├─ System Update
│  └─ System State
└─ NE_L07_07_BallisticRibbon
   ├─ Emitter Properties
   ├─ Emitter Spawn: no added modules
   ├─ Emitter Update
   │  ├─ Emitter State
   │  └─ Spawn Rate
   ├─ Particle Spawn
   │  ├─ Initialize Ribbon
   │  ├─ Add Velocity
   │  └─ Dynamic Material Parameters
   ├─ Particle Update
   │  ├─ Particle State
   │  ├─ Gravity Force
   │  ├─ Drag
   │  ├─ Solve Forces and Velocity
   │  ├─ Scale Ribbon Width
   │  └─ Scale Color
   └─ Render
      └─ Ribbon Renderer
```

### Налаштування симуляції

- `CPUSim`, Local Space false, Determinism true, seed `707`.
- Emitter State: Self, Complete, Once, Fixed `2.5 s`.
- Spawn Rate `30/s`.
- Initialize Ribbon: Lifetime `1.2 s`; Position `(0,0,0)`; Color `(.1,.55,1,1)`; Ribbon Width `12`; Ribbon Twist `0`; Velocity initial zero.
- Direct Add Velocity `(300,0,120) cm/s` у Simulation space.
- Dynamic0 `(Erode=0, Distortion=.1, Core=1, Variant=0)`.
- Gravity `(0,0,-240)`; Drag `.2`; default-налаштування solver.
- Крива multiplier Scale Ribbon Width: `(0,0)`, `(.08,1)`, `(.75,1)`, `(1,0)`.
- Scale Color: RGB зафіксовано; крива alpha `(0,0),(.05,1),(.8,1),(1,0)`.

### Ribbon Renderer

```text
Material = MI_VFX_Ribbon_Production
Facing Mode = Screen
UV0 Tiling Distance = 50
UV0 Scale = (1,1)
UV0 Offset = (0,0)
Draw Direction = Back to Front
Tessellation Mode = Automatic
Curve Tension = 0.25
Sort Order Hint = 0
Position Binding = Particles.Position
Color Binding = Particles.Color
Velocity Binding = Particles.Velocity
Normalized Age Binding = Particles.NormalizedAge
Ribbon Twist Binding = Particles.RibbonTwist
Ribbon Width Binding = Particles.RibbonWidth
Ribbon Facing Binding = Particles.RibbonFacing
Ribbon ID Binding = Particles.RibbonID
Ribbon Link Order Binding = Particles.RibbonLinkOrder
Material Random Binding = Particles.MaterialRandom
Dynamic Material Binding = Particles.DynamicMaterialParameter
```

Dynamic Material 1–3 використовують відповідні defaults без записаних значень.

Вплив label/value `Draw Direction` найпомітніший на складеній translucent ribbon. Default для `Curve Tension` може відрізнятися. **Потребує ручної перевірки в Unreal Engine 5.8.**

### Перевірка material

`MI_VFX_Ribbon_Production` використовує Particle Color, ribbon TexCoord, маску ширини й Dynamic0; material підтримує Niagara Ribbons і має Two Sided там, де це потрібно. Вмикайте прокручування texture лише після проходження статичної перевірки UV tiling.

## 12. Точні назви UE nodes, modules і налаштувань

`Initialize Ribbon`; `Scale Ribbon Width`; `Ribbon Renderer`; `Facing Mode`; `Screen`; `Custom`; `Custom Side Vector`; `UV0 Tiling Distance`; `UV0 Scale`; `UV0 Offset`; `UV0 Age Offset Mode`; `Draw Direction`; `Tessellation`; `Mode`; `Automatic`; `Custom`; `Disabled`; `Curve Tension`; bindings renderer із розділу 11.

Точні назви категорій меню й текст material usage **потребують ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Налаштування | Значення |
|---|---:|
| rate/lifetime | `30/s`, `1.2 s` |
| приблизно живих points | `≈36` |
| velocity | `(300,0,120)` |
| gravity/drag | `-240 Z`, `.2` |
| width/twist | `12`, `0` |
| UV0 tiling | `50 cm` |
| facing/tessellation | Screen/Automatic |
| seed/space | `707`/World |

## 14. Очікуваний результат кожного етапу

- Перші points створюють коротку смугу, а не ізольовані sprites.
- Rate 30 дає достатньо плавну дискретизацію points.
- Старі points утворюють path, викривлену gravity.
- Width/alpha звужують початок і кінець без різкого обриву.
- Texture повторюється вздовж відстані, а не розтягується один раз.
- Screen facing зберігає ribbon видимим.
- Automatic tessellation згладжує криву без довільного max factor.
- Ribbon лишається однією зв’язаною смугою для одного emitter.

## 15. Самостійна вправа

### `EX-L07-07-A` — Звужений балістичний trail

Створіть один ribbon: Rate `40/s`, lifetime `.8`, velocity `(450,0,180)`, gravity `-500 Z`, drag `.1`, width `9`, tiling `40`, seed `1707`. Він має мати плавний taper head/tail, не мати видимого order flip і містити задокументовані point spacing/count.

[Повне рішення A](../EXERCISE_ANSWERS/L07-07_ribbon_renderer_and_trail_construction_answers.md#ex-l07-07-a)

## 16. Додаткова складніша вправа

### `EX-L07-07-B` — Подвійні стабільні ribbons

Використайте два emitters без events: протилежні зміщення Y `±20`, кольори orange/cyan, velocities `(320,40,100)` і `(320,-40,100)`, однакові rate/lifetime та окремі seeds. Обидві ribbons мають лишатися незалежно зв’язаними; для кожної виконайте повний аудит bindings.

[Повне рішення B](../EXERCISE_ANSWERS/L07-07_ribbon_renderer_and_trail_construction_answers.md#ex-l07-07-b)

## 17. Три рівні підказок

### Для `EX-L07-07-A`

- **Hint 1:** відстань між points ≈ speed/rate; кількість живих points ≈ rate×lifetime.
- **Hint 2:** спочатку `Initialize Ribbon`, потім forces перед solver, а `Scale Ribbon Width` — в Update.
- **Hint 3:** прив’яжіть default ID і LinkOrder, потім порівняйте Disabled та Automatic tessellation; не компенсуйте низький rate максимальною tessellation.

### Для `EX-L07-07-B`

- **Hint 1:** окремі emitters мають окремі набори particle data й не потребують custom-побудови RibbonID.
- **Hint 2:** продублюйте точний stack, а потім змініть лише seed/color/position/velocity Y.
- **Hint 3:** кожний renderer прив’язує власні `Particles.RibbonID` і `Particles.RibbonLinkOrder`; перевіряйте emitters по одному в solo.

## 18. Типові помилки

- `Initialize Particle` використано замість `Initialize Ribbon` або розміщено над ним;
- причиною надто низького rate помилково вважають tessellation;
- width задано лише в renderer, а binding атрибута неправильний;
- усі points мають ту саму position, а velocity дорівнює нулю;
- неправильний Ribbon ID/LinkOrder binding;
- змішано припущення про UV Tiling Distance і age offset;
- max tessellation 16 задано без обґрунтування;
- custom facing використано без RibbonFacing.

## 19. Усунення несправностей

| Симптом | Що перевірити | Як виправити |
|---|---|---|
| ribbon відсутня | renderer/material/rate/рух | перевірений material, Rate і velocity |
| ізольовані або розірвані сегменти | ID/order/lifetime/rate | відновіть bindings і збільште щільність points |
| ribbon стискається в origin | немає руху | додайте Add Velocity і, де потрібно, solver |
| texture розтягнута | UV tiling/material UV | задайте distance 50 і перевірте TexCoord |
| скручування або перевороти | facing/order/нульова дотична | Screen, стабільний порядок і ненульова відстань |
| ламаний силует | rate проти tessellation | спочатку збільште sampling, потім увімкніть Automatic |
| передчасний cull | bounds | охопіть повні length/width |

## 20. Міркування щодо продуктивності

- Кількість живих points ≈ Rate×Lifetime; обидва параметри безпосередньо впливають на симуляцію та геометрію ribbon.
- Tessellation додає render vertices; Automatic є базовим режимом, а Custom потребує вимірювання.
- Широка translucent ribbon може створювати великий overdraw.
- Прокручування UV зазвичай витрачає material ALU, але не замінює правильного генерування UV у Niagara.
- Два emitters подвоюють обсяг simulation/render setup; це прийнятно для чіткого розділення двох ribbons.
- CPU доречний приблизно для 36 points; остаточне рішення залежить від платформи та профілювання.

## 21. Запитання для самоперевірки

1. Скільки particles утворюють ribbon?
2. Що групує points?
3. Що задає їхній порядок?
4. Чому `Initialize Ribbon` має бути першим?
5. Як оцінити відстань між points?
6. Як оцінити кількість живих points?
7. Чим UV Tiling Distance відрізняється від розтягування?
8. Чи відновлює tessellation відсутні зразки руху?
9. Що читає width binding?
10. Чому Screen facing є базовим режимом?

## 22. Відповіді

1. Багато впорядкованих particles.
2. `Particles.RibbonID`.
3. `Particles.RibbonLinkOrder` або linking order у renderer.
4. Він ініціалізує point і специфічні атрибути ribbon.
5. speed/rate.
6. rate×lifetime.
7. Він повторює U вздовж пройденої відстані.
8. Ні, лише інтерполює геометрію.
9. `Particles.RibbonWidth`.
10. Він добре читається з камери й не потребує custom facing vector.

## 23. Контрольний список самоперевірки

- [ ] `Initialize Ribbon` розміщено першим.
- [ ] Повний stack відтворено точно.
- [ ] Додано розрахунки відстані через rate/lifetime.
- [ ] Усі Ribbon bindings налаштовано.
- [ ] Рішення щодо UV/tessellation обґрунтовано.
- [ ] Particle Color/UV у material перевірено.
- [ ] Додано докази bounds/count.
- [ ] Сукупну практику M/S 4/4 виконано.
- [ ] Вправи A/B завершено.

## 24. Критерії опанування

Ви будуєте стабільну ribbon з чистого system, прогнозуєте щільність і довжину points, виправляєте дефекти ID/order/UV/facing, аргументуєте tessellation і демонструєте material binding без Events або Scratch Pad.

## 25. Підсумок

Ribbon — смуга з упорядкованих particles. Spawn rate/lifetime керують дискретизацією та довжиною; симуляція переміщує points; атрибути Ribbon керують width/twist; renderer керує linking, facing, UV і tessellation.

## 26. Зв’язок із наступними уроками

У [07.08](08_niagara_foundations_control_project.md) Sprite, Mesh і Ribbon stacks об’єднаються в один authored System з мінімальними exposed User controls і Gate G07.

## 27. Офіційні джерела

- [Particle Spawn Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-spawn-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-update-group-reference-for-niagara-effects-in-unreal-engine)
- [Render Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine)
- [Scalability and Best Practices](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Повний Ribbon stack.
2. Повна панель bindings у Ribbon Renderer.
3. Схема відстані між points залежно від rate.
4. UV0 tiling до і після налаштування.
5. Порівняння силуету з Tessellation Disabled/Automatic.
6. Порівняння зламаних і відновлених ID/order.
