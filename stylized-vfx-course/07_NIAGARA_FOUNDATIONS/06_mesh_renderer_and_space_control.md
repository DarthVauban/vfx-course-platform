# 07.06 — Mesh Renderer, orientation і space control

## 1. Назва

**Mesh particles: Static Mesh/material contract, orientation, angular motion, scale bindings і local/world control.**

## 2. Результат уроку

Ви створите `NS_L07_06_MeshBurst` з `SM_VFX_Debris_A`, перевірите Mesh Renderer material compatibility, initial/update orientation, motion у світовому просторі, full bindings і bounded deterministic burst. Ви також порівняєте `Facing Mode=Default` із `Velocity` та поясните, коли renderer facing замінює або доповнює `Particles.MeshOrientation`.

## 3. Орієнтовний час

**8 годин: 1.5 години теорії / 6.5 години практики.**

- 45 хв — Mesh Renderer instancing/material;
- 45 хв — orientation, scale, facing і spaces;
- 60 хв — M/S practice: mesh material compatibility/Particle Color;
- 90 хв — контрольовані експерименти;
- 210 хв — guided mesh burst;
- 90 хв — exercises A/B.

M/S practice блока: **ще 1 година; cumulative 3/4**.

## 4. Передумови

- 07.05;
- imported/validated `SM_VFX_Debris_A/B/C` із 06.03;
- 04.05 `M_VFX_Mesh_Template` і `MI_VFX_Mesh_Production`;
- verified pivot, forward axis, scale, normals, UV0 і material slot.

## 5. Нові терміни

- **Mesh particle** — один екземпляр Static Mesh для кожного відрендереного particle.
- **Particle Mesh** — asset mesh, вибраний у Mesh Renderer.
- **Override Materials** — масив materials у renderer, який замінює slots mesh.
- **Mesh Orientation** — атрибут орієнтації particle на основі quaternion/axis-angle.
- **Initial Mesh Orientation** — module Spawn, який ініціалізує orientation.
- **Add Rotational Velocity** — додає angular velocity.
- **Update Mesh Orientation** — оновлює orientation з часом.
- **Scale Binding** — source у renderer для XYZ scale окремого particle.
- **Facing Mode Default** — використовує orientation/transform particle та ігнорує camera.
- **Facing Mode Velocity** — вирівнює local X-axis mesh уздовж velocity particle.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Mesh particles дають real silhouette, volume, normals і faceted rotation для debris, shards, projectiles та magical fragments. Вони також швидко викривають поганий pivot/axis/import scale. Niagara artist має відокремити mesh asset defect від renderer binding чи simulation-space defect.

## 7. Теорія простими словами

Sprite Renderer створює card. Mesh Renderer бере готовий Static Mesh і багато разів instantiates його. Niagara надає кожній instance:

```text
Position + MeshOrientation + Scale + Color + material data
```

`Facing Mode=Default` дозволяє `Particles.MeshOrientation` визначати orientation. `Velocity` примусово вирівнює local X mesh уздовж motion. Якщо mesh «дивиться» local Z, velocity facing виглядатиме sideways, доки asset axis не виправлено або не додано documented corrective orientation.

## 8. Детальні технічні пояснення

### Контракт Mesh/material

Epic reference: `Particle Mesh` визначає Static Mesh; material має `Niagara Mesh Particles` usage flag. `Override Materials` entries також повинні бути compatible. One missing slot може fallback до mesh material.

### Pipeline orientation

```text
Initial Mesh Orientation writes Particles.MeshOrientation at spawn
Add Rotational Velocity writes angular velocity
Update Mesh Orientation advances MeshOrientation per update
Mesh Renderer Mesh Orientation Binding reads Particles.MeshOrientation
```

`Facing Mode=Velocity` aligns local X to `Particles.Velocity`; тому цей mode оцінюється окремо від random tumbling baseline.

### Scale

`Initialize Particle > Mesh Attributes > Mesh Scale` або `Particles.Scale` задає base scale. `Scale Mesh Size` множить її over life. Uniform scale зберігає proportions; non-uniform може викрити normals/silhouette issues.

### Простір

World debris (`Local Space=False`) залишається у world trajectory після руху source. Local magical orbit (`True`) follows component. Для фізичного debris зазвичай world є яснішим baseline; attached decorative mesh може потребувати local. Це art/behavior decision.

### CPU/GPU

18 mesh particles, orientation і no collision — CPU baseline. Mesh rendering уже виконується graphics pipeline; `CPUSim` описує simulation target. Collision/large-count comparison — 08.01.

## 9. Візуальні або математичні приклади

Діагностика forward axis:

```text
mesh local +X = intended forward
Particles.Velocity = (300,0,0)
Facing Mode Velocity → +X mesh follows +X motion
```

Rotation rate example `180°/s`: за `.5 s` expected conceptual rotation `90°` around selected axis, subject to реалізації та інтеграції модуля.

## 10. Контрольовані експерименти

1. Render `SM_VFX_Debris_A` за scale `(1,1,1)` і без rotation; перевірте import.
2. `Facing Mode Default`, identity orientation проти random.
3. `Default` + Update Mesh Orientation проти вимкненого update.
4. `Facing Mode Velocity`; rotational velocity дорівнює нулю; перевірте +X mesh.
5. Scale `(1,1,1)↔(.5,.5,.5)`; перевірте binding.
6. Particle Color magenta; зламайте й відновіть Particle Color у material.
7. Duplicate World/local; перемістіть component після birth.
8. Перемикайте Override Material on/off; запишіть результат slot.

## 11. Покрокова керована практика

### Повний stack

```text
NS_L07_06_MeshBurst
├─ System Properties
├─ System Spawn: no added modules
├─ System Update
│  └─ System State
└─ NE_L07_06_Debris
   ├─ Emitter Properties
   ├─ Emitter Spawn: no added modules
   ├─ Emitter Update
   │  ├─ Emitter State
   │  └─ Spawn Burst Instantaneous
   ├─ Particle Spawn
   │  ├─ Initialize Particle
   │  ├─ Shape Location
   │  ├─ Add Velocity in Cone
   │  ├─ Initial Mesh Orientation
   │  ├─ Add Rotational Velocity
   │  └─ Dynamic Material Parameters
   ├─ Particle Update
   │  ├─ Particle State
   │  ├─ Gravity Force
   │  ├─ Drag
   │  ├─ Solve Forces and Velocity
   │  ├─ Update Mesh Orientation
   │  ├─ Scale Mesh Size
   │  └─ Scale Color
   └─ Render
      └─ Mesh Renderer
```

### Налаштування simulation

- Emitter: `CPUSim`, Local Space false, determinism true, seed `606`.
- State: Self, Complete, Once, Fixed `2.2 s`.
- Burst `18 @ 0`.
- Initialize: Lifetime Random `1.2–1.8`; Position zero; Color `(.9,.35,.08,1)`; Mesh Scale Random Uniform `.40–.80`; Mass `1`.
- Shape Sphere radius `15`.
- Cone axis Z, angle `50°`, speed `300–600`.
- Initial Mesh Orientation: random rotation за всіма осями, range `-180°..180°` або рівнозначний Random Ranged Vector.
- Add Rotational Velocity: Simulation space; random `(-180,-180,-180)..(180,180,180) °/s`.
- Dynamic0 `(.1,0,1,0)`.
- Gravity `(0,0,-980)`; Drag `.4`; default settings solver.
- Update Mesh Orientation увімкнено.
- Рівномірна крива Scale Mesh Size `(0,.4),(.1,1),(.8,1),(1,.2)`.
- Alpha Scale Color `(0,1),(.8,1),(1,0)`.

Спосіб подання й одиниці Rotation, які показує встановлений модуль, **потребують ручної перевірки в Unreal Engine 5.8.** Запишіть, чи UI очікує degrees, normalized turns or vector dynamic input.

### Налаштування Mesh Renderer

```text
Particle Mesh = SM_VFX_Debris_A
Override Materials = enabled, slot 0 = MI_VFX_Mesh_Production
Facing Mode = Default
Sort Mode = None
Sort Only When Translucent = True
Position Binding = Particles.Position
Color Binding = Particles.Color
Velocity Binding = Particles.Velocity
Mesh Orientation Binding = Particles.MeshOrientation
Scale Binding = Particles.Scale
Dynamic Material Binding = Particles.DynamicMaterialParameter
Material Random Binding = Particles.MaterialRandom
Custom Sorting Binding = Particles.NormalizedAge
Normalized Age Binding = Particles.NormalizedAge
```

Dynamic Material 1–3 зберігають відповідні defaults без запису.

### Перевірка space/facing

Створіть duplicate actor System. Для copy B задайте emitter Local Space true. Виконайте Reset обох і перемістіть actors після `.3 s`. Потім поверніть production asset у world. Окремо створіть duplicate emitter і задайте Facing Mode Velocity з вимкненим rotational velocity; перевірте local X axis mesh.

## 12. Точні назви вузлів, модулів і налаштувань UE

`Mesh Renderer`; `Particle Mesh`; `Override Materials`; `Facing Mode`; `Default`; `Velocity`; `Initial Mesh Orientation`; `Add Rotational Velocity`; `Update Mesh Orientation`; `Scale Mesh Size`; `Mesh Orientation Binding`; `Scale Binding`; `Dynamic Material Binding`; material flag `Niagara Mesh Particles`.

Installed module category paths/rotation units **потребують ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Налаштування | Старт |
|---|---|
| seed/burst | `606` / `18` |
| lifetime | `1.2–1.8 s` |
| shape/speed | sphere `15`; cone `300–600`, `50°` |
| mesh scale | `.4–.8` uniform |
| rotation | initial `±180°`; rate `±180°/s` |
| gravity/drag | `-980 Z` / `.4` |
| renderer mesh | `SM_VFX_Debris_A` |
| material | `MI_VFX_Mesh_Production` |
| facing/space | Default / World |

## 14. Очікуваний результат кожного етапу

- Static Mesh з’являється в правильному imported scale.
- 18 chunks вилітають у cone.
- Chunks обертаються незалежно.
- Gravity створює arc, схожу на debris.
- Scale і alpha прибирають hard pop.
- Material отримує Particle Color/Dynamic0.
- World-space particles не слідують за source після birth.
- Діагностика velocity-facing спрямовує +X mesh уздовж руху.

## 15. Самостійна вправа

### `EX-L07-06-A` — Debris burst із трьома силуетами

Побудуйте `NS_EX_L07_06_DebrisKit` із трьома emitters, що використовують `SM_VFX_Debris_A/B/C`, counts `8/6/4`, seeds `1606–1608`, спільний world-space motion, різні scale ranges і один material. Подайте повні stacks, аудит material slot і примітку про peak triangle-instance.

[Повне рішення A](../EXERCISE_ANSWERS/L07-06_mesh_renderer_and_space_control_answers.md#ex-l07-06-a)

## 16. Додаткова складніша вправа

### `EX-L07-06-B` — Local needles projectile

Використайте `SM_VFX_Beam_01` або перевірений needle mesh. Безперервний Rate `6/s`, lifetime `.8`, fixed velocity local +X `450`, `Facing Mode=Velocity`, Local Space true. Обертайте й переміщуйте source та доведіть, що нові й живі particles дотримуються задуманої local behavior. Без Blueprint або collision.

[Повне рішення B](../EXERCISE_ANSWERS/L07-06_mesh_renderer_and_space_control_answers.md#ex-l07-06-b)

## 17. Три рівні підказок

### Для `EX-L07-06-A`

- **Hint 1:** один mesh на emitter — найзрозуміліша foundation architecture.
- **Hint 2:** створіть duplicate точного stack, потім змінюйте лише mesh/count/scale/seed.
- **Hint 3:** загалом 18; перевірте triangle count кожного mesh × peak instances, але не виводьте фінальний GPU time з арифметики.

### Для `EX-L07-06-B`

- **Hint 1:** перевірте local +X mesh до Niagara.
- **Hint 2:** `Particles.Velocity` має бути ненульовим, а Velocity Binding — правильним.
- **Hint 3:** Local Space true робить наявні coordinates відносними до component; порівняйте з world duplicate під час руху/обертання actor.

## 18. Типові помилки

- хибні import axis/pivot помилково приписано Niagara;
- Velocity facing за forward axis mesh, що не є X;
- orientation binding відсутній;
- Update Mesh Orientation без angular velocity;
- невідповідність material flag/slot;
- `Particles.SpriteSize` використано для scale mesh;
- Local Space перемкнено без контрольованого transform;
- collision додано до дослідження CPU/GPU.

## 19. Пошук несправностей

| Симптом | Перевірка | Виправлення |
|---|---|---|
| mesh невидимий | Particle Mesh/material slot/scale/bounds | призначте відомий mesh, scale 1, сумісний material |
| боком | asset +X/Facing Mode | виправте orientation asset або задокументуйте correction |
| немає tumble | rotational velocity/update module | додайте обидва, перевірте units |
| color ігнорується | material Particle Color/Color Binding | magenta hop test |
| хибний size | Scale Binding | `Particles.Scale` |
| несподівано слідує за source | Local Space | world false для debris |
| ранній cull | bounds/WPO | перевірте повну траєкторію й displacement material |

## 20. Міркування про продуктивність

- Вартість Mesh містить instance count × mesh complexity, material, shadow і overdraw/opaque fill.
- Вимикайте непотрібні shadows на VFX meshes лише після перевірки візуальних вимог.
- Три mesh emitters додають overhead; використовуйте їх для контролю силуету, потім профілюйте.
- `Override Materials` не прибирає count/complexity slots mesh.
- CPU за малої кількості раціональний; порівняння з GPU потребує фактичних target count/features.
- Bounds мають охоплювати траєкторію й WPO material.

## 21. Запитання для самоперевірки

1. Що вибирає Particle Mesh?
2. Який attribute читає Scale Binding?
3. Який attribute читає orientation?
4. Чим різняться Default і Velocity facing?
5. Чому +X asset має значення?
6. Які два modules створюють tumble?
7. Чому Local Space зазвичай хибний для фізичного debris?
8. Чи означає CPUSim, що pixels mesh рендеряться на CPU?
9. Навіщо потрібний material usage flag?
10. Що мають охоплювати bounds?

## 22. Відповіді

1. Static Mesh, instanced для кожної particle.
2. `Particles.Scale`.
3. `Particles.MeshOrientation`.
4. Default використовує orientation; Velocity вирівнює local X за velocity.
5. Velocity facing вважає local X напрямком forward.
6. `Add Rotational Velocity` and `Update Mesh Orientation`.
7. Наявні chunks слідували б за рухомим source замість того, щоб лишатися у world.
8. No.
9. Для правильного permutation/path Niagara mesh rendering.
10. Повний simulated motion і extent WPO material.

## 23. Чекліст самоперевірки

- [ ] Контракт import Mesh перевірено.
- [ ] Повний stack точний.
- [ ] Orientation + angular update працюють.
- [ ] Таблиця bindings повна.
- [ ] Material slot/usage перевірено.
- [ ] Перевірки World/local і Default/Velocity захоплено.
- [ ] Є докази count/bounds.
- [ ] 1 годину M/S записано; накопичено 3/4.
- [ ] A/B завершено.

## 24. Критерії опанування

Ви створюєте mesh burst без template, діагностуєте asset vs Niagara orientation, налаштовуєте MeshOrientation/Scale/material bindings, пояснюєте space/facing choice і оцінюєте count×mesh complexity без fabricated performance claim.

## 25. Підсумок

Mesh Renderer instantiates validated geometry and reads position, orientation, scale, color та material data. Good result залежить від asset axes/pivot не менше, ніж від Niagara stack.

## 26. Зв’язок із наступними уроками

У [07.07](07_ribbon_renderer_and_trail_construction.md) renderer більше не малює isolated instances: він зв’язує particles в ordered strip через RibbonID/LinkOrder і width attributes.

## 27. Офіційні джерела

- [Render Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine)
- [Quick Start for Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine)
- [Particle Spawn Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-spawn-group-reference-for-niagara-effects-in-unreal-engine)
- [Particle Update Group Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-update-group-reference-for-niagara-effects-in-unreal-engine)
- [Scalability and Best Practices](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Перевірка axis/pivot/import Static Mesh.
2. Повний stack mesh.
3. Повна panel bindings Mesh Renderer.
4. Default tumbling проти Velocity facing.
5. Порівняння руху actor World/local.
6. Захоплення Material slot/usage і bounds.
