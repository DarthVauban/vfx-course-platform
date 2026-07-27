# B10 Block Assessment Key — ключ оцінювання

Це model solution для self-grading після timer. Key не містить вигаданих performance numbers: кожна submission повинна перенести фактичні values із власних target-hardware captures.

# 1. Теорія — model 20/20

## 1. Niagara System і NiagaraComponent

Niagara System — asset/template з emitters, modules, renderers і parameters. NiagaraComponent — runtime scene instance із transform, activation state, parameter store, attachment і completion. Lifecycle owner — gameplay actor/component/manager або spawned-component policy, а не сам asset.

## 2. At Location і Attached

`Spawn System at Location` створює component у заданому world transform; impact/residue може лишитися після movement owner. `Spawn System Attached` додає component до parent hierarchy/socket і використовує attach-point/transform interpretation, тому effect слідує. Pins/defaults: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 3. Infinite loop і Auto Destroy

`Auto Destroy` залежить від system completion. Infinite loop сам не завершується, тому component потребує gameplay-driven Deactivate/stop, owner cleanup або іншого явного exit.

## 4. Socket, transform rule, Notify

Socket визначає named spatial point relative to bone. Attach rule/location type визначає, як child transform інтерпретується при attachment. Notify визначає timing; разом вони задають де, як і коли effect з’являється.

## 5. ActionID/re-entry

Repeated/re-entered action може мати overlapping notify windows. ActionID пов’язує component із конкретним action, а re-entry policy визначає Ignore/Restart/Refresh/Stack. Старий End не повинен зупиняти component нового action.

## 6. Direction і Position

```text
Delta = TargetPosition - SourcePosition
Distance = Length(Delta)
Direction = Delta / Distance, якщо Distance > epsilon
```

Position — point, на яку впливає translation; Vector3 direction — arrow, який translation не змінює. Zero-length case потребує fallback або reject.

## 7. Pooling і reset

Pooling повторно використовує components, зменшуючи allocation і garbage collection pressure; воно не прибирає cost active simulation або rendering. Перед `Activate` треба встановити transform, attachment, target mode, reference і position, direction, color, scale, profile, ActionID, visibility та completion ownership.

## 8. Profiling tools

Niagara Debugger показує active systems, emitters, particles, memory, bounds і cull state. Unreal Insights показує CPU timing, включно з Niagara work GT та CNC. GPU Visualizer або ProfileGPU і Shader Complexity або Quad Overdraw дають diagnostics GPU passes, material і coverage; color view mode не є прямим виміром ms.

## 9. Effect Type/significance

Effect Type поширює rules scalability, culling і budget на system family. Significance ранжує relative importance для culling. Thresholds залежать від hardware, build, resolution, scene, concurrency і gameplay, тому не переносяться як універсальні.

## 10. Low і Sequencer

Low зберігає telegraph, core direction і silhouette, contact та найдешевшу recognizable signature; optional і secondary layers зменшуються першими. Sequencer дозволений для presentation approved result, але не доводить gameplay re-entry, targets, culling або performance.

# 2. Зразок gameplay integration — 35/35

## 2.1 Architecture зразка

```text
BP_A10_Character
├─ CharacterMesh
│  └─ hand_r_socket
│     └─ WeaponMesh
│        ├─ fx_weapon_root
│        ├─ fx_weapon_tip
│        └─ fx_weapon_contact
└─ BPC_VFXGameplayBridge

AM_A10_Action
├─ Notify: VFX_Contact
└─ Notify State: VFX_ActiveWindow

NS_A10_HeroAbility
NET_HeroAbility
```

## 2.2 Request schema

```text
System
SpatialMode
WorldTransform / AttachComponent / AttachPoint / RelativeTransform
SourcePosition
Direction
Color
Scale
TargetMode
TargetPosition / TargetActor / TargetComponent
QualityProfile
ActionID
ReentryPolicy
TargetLossPolicy
```

Types і spaces:

| Data | Type | Space |
|---|---|---|
| Source/Target | Position | World |
| Direction | Vector3 | World normalized |
| Color | LinearColor | linear |
| Scale | Float | unitless |
| Target object | Actor/Component-compatible | reference на object |

## 2.3 World one-shot

У момент видимого contact:

```text
Визначити world transform fx_weapon_contact
→ Spawn System at Location, Auto Activate=false
→ перевірити Return Value
→ встановити SourcePosition, Direction, Color, Scale, TargetPosition і ActionID
→ Activate
```

Impact лишається у world space, коли персонаж продовжує рух. Він завершується natural, а cleanup path зафіксовано.

## 2.4 Attached/persistent window

Під час Notify State Begin:

```text
Створити ActionID
→ визначити WeaponMesh і sockets root та tip
→ запустити або повторно використати один owned component
→ очистити старий target state
→ застосувати повний request
→ Activate
```

Під час Notify State End, cancel, unequip або завершення owner:

```text
якщо ActionID active component збігається:
    graceful Deactivate або complete
```

П’ять швидких requests дотримуються задокументованої policy Restart або Refresh. Stack не виникає, якщо його явно не включено до gameplay contract.

## 2.5 Direction/target

Для target у вигляді live component:

```text
Delta = TargetComponent.WorldPosition - SourcePosition
якщо Length > epsilon:
    Direction = SafeNormal(Delta)
інакше:
    використати задокументований owner-forward fallback
```

У model solution target loss policy — Fade або complete:

- перевірити validity до access;
- очистити object reference;
- зупинити live update;
- виконати graceful completion;
- видалити mapping ActionID після finish.

## 2.6 Parameter order

```text
Перевірити request
→ визначити source, target і space
→ створити inactive component
→ очистити старі object і target fields
→ записати кожне обов’язкове User.* value
→ прив’язати ownership і completion
→ Activate
```

Typed setter display names: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 2.7 Test matrix

| Case | Model result |
|---|---|
| normal action | notify і attachment правильні |
| cancel mid-state | orphan effect відсутній |
| п’ять швидких re-entry | policy дає deterministic result |
| owner destroyed | cleanup виконується |
| fixed target | зайвий update відсутній |
| live target | слідує за selected component |
| target destroyed | policy Fade, немає access до invalid object |
| червоний або синій, scale .5 чи 2 | перший frame правильний |
| cooldown | active count повертається до expected baseline |

## 2.8 Чому solution повний

Він перевіряє spatial ownership, animation timing, types і spaces data, parameter order на першому frame, re-entry, interruption, target loss і final cleanup. Screenshot одного успішного spawn не отримує full credit.

# 3. Зразок H/M/L і Effect Type — 20/20

## 3.1 Layer classification

| Layer | Role |
|---|---|
| ground або area telegraph | essential gameplay |
| core directional silhouette | essential gameplay |
| contact flash | essential timing |
| signature ring або color motion | identity |
| secondary sparks або smoke | richness |
| broad distortion або light | optional cost за measurement |

## 3.2 Profile matrix

| Role | High | Medium | Low |
|---|---|---|---|
| telegraph | approved full | зберегти | зберегти |
| core/contact | повні | зберегти | зберегти або використати дешевшу implementation |
| signature | повна | дешевший variant за measurement | найдешевша recognizable form |
| secondary | повні | зменшені за ledger | мінімальні або off |
| distortion/light | лише якщо evidence High проходить | дешевші або off | off |
| collision/sorting | лише для обов’язкових particles | зменшені | off, якщо semantics збережено |

Фінальні numerical counts, distances і curves мають бути values, видимими у власному evidence кандидата. Key навмисно не вигадує їх.

## 3.3 Effect Type

`NET_HeroAbility` призначено лише relevant family. Submission записує фактичні:

- `Significance Handler`;
- `Update Frequency`;
- `Cull Reaction`;
- applicability distance, instance і budget;
- treatment local player;
- sets platform і quality.

Exact labels and handler choices: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 3.4 Significance test

Створи відомі labeled instances:

1. active telegraph local player;
2. near active ability ворога;
3. distant enemy ability;
4. decorative residue.

Коли measured candidate limit перевищено, evidence Debugger має показати culling запланованого item із нижчим significance. Якщо цього немає, policy не проходить незалежно від visual screenshot.

## 3.5 Bounds/culling/re-entry

Bounds охоплюють повний motion і WPO, але не містять великого необґрунтованого empty space. Camera sweep фіксує:

- near і relevant;
- threshold region;
- far і culled;
- return і re-entry.

Finite bursts не виконують неочікуваний refire; looping state не зберігає stale parameters.

## 3.6 Two named profiles

Кожен row profile містить actual hardware і platform, build, resolution, concurrency та captured evidence. «PC High» або «console» без конкретики не отримує credit за profile evidence.

# 4. Зразок presentation boundary — 5/5

Primary captures H/M/L походять із gameplay action. Optional `LS_A10_Presentation` лише:

- рухає camera;
- перемикає approved views;
- додає labels H/M/L;
- показує breakdown.

Він не містить replacement logic spawn, target, notify, lifecycle або profile. Точні tracks і UI Sequencer: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 5. Зразок performance і troubleshooting — 10/10

## 5.1 Protocol

Model submission записує всі metadata protocol і повторює ідентичні camera та spawn script до і після. Diagnostics перелічено окремо від clean capture.

## 5.2 Workload evidence

Niagara Debugger містить:

- count active Systems;
- active emitters;
- particle count;
- memory overview;
- bounds;
- cull reason і reaction;
- count після cooldown.

## 5.3 CPU evidence

Insights містить observations GT і CNC:

- `Niagara Manager Tick [GT]`;
- `System Simulation Tick [GT]`;
- `System Simulation Tick [CNC]`;
- contributors emitter spawn, simulate і event;
- window activation і re-entry.

Capture із named events використовують лише для discovery; clean capture прибирає його overhead.

## 5.4 RT/GPU evidence

Capture GPU і RT розрізняє:

- dispatch GPU simulation, де він застосовується;
- preparation renderer;
- translucent і render passes;
- lights або інші contributors.

Effect проходить toggle і isolation test без зміни camera.

## 5.5 Material evidence

І `Shader Complexity`, і `Quad Overdraw` подано з тим самим view до і після. Вони визначають relative hotspot і coverage, а GPU capture надає evidence time і pass.

## 5.6 Texture memory

Таблиця містить dimensions, intent format і compression, mips і streaming, resource-memory evidence та використані channels. Disk file size не використовується як заміна.

## 5.7 Feature matrix

| Feature | State | Observation або action |
|---|---|---|
| Mesh | actual used або not used | vertices, batches, shadow і asset baggage перевірено |
| Ribbon | actual | segments, tessellation і coverage перевірено |
| Collision | actual | path CPU або GPU і subset particles перевірено |
| Light | actual | count, radius, shadow і overlap перевірено |
| Sorting | actual | visual need і task cost перевірено |
| Bounds/culling | actual | tightness, reason і re-entry перевірено |

Студент має заповнити actual state; відповідь «not applicable» valid лише тоді, коли evidence доводить відсутність feature.

## 5.8 Приклад root cause

```text
Симптом:
  GPU capture і overdraw погіршуються за чотирьох overlapping instances.

Гіпотези:
  full-screen secondary sprite; expensive distortion; overlap lights.

Перевірки:
  ізолювати по одному renderer, material або light.

Висновок:
  secondary translucent core дублює primary coverage.

Одна зміна:
  вимкнути цей renderer лише у Medium candidate.

Результат:
  повторне evidence GPU і overdraw змінюється у передбаченому domain;
  GT і CNC лишаються в межах variance run.

Якість:
  telegraph, core і contact збережено; brightness збалансовано через наявний дешевший layer.
```

Це повна causal form, а не універсальний numeric result.

# 6. Зразок self-review — 10/10

## 6.1 Metadata

Усі actual IDs version, build, hardware, resolution і profile присутні та відповідають captures.

## 6.2 Lifecycle contract

```text
World impact: natural completion
Attached window: graceful stop, owned через ActionID
Re-entry: задокументований Restart або Refresh
Target loss: Fade
Завершення owner: cleanup
Pool або reuse: повний reset до activation
```

## 6.3 Trade-off table

Кожна change H/M/L зазначає:

- role layer;
- measured contributor;
- change implementation;
- gameplay constraint;
- evidence до і після;
- accept або reject.

## 6.4 Gameplay notes

Views front, side і back, distances near і far, cases normal, cancel і re-entry та representative concurrency перевірено. Readability Low оцінюють із gameplay camera, а не beauty camera.

## 6.5 Найсильніше decision

Model answer: захистити telegraph, core і contact, а потім видалити measured redundant translucent layer у Medium та Low. Це покращує actual contributor, не змінюючи timing action або semantics target.

## 6.6 Найслабший risk

Coverage platform profile лишається обмеженим двома named targets; formats memory і render на іншій platform потребують нового capture.

## 6.7 Наступна iteration

Виконай той самий scenario на наступному approved hardware profile і повторно оціни candidates distance та instance, format texture resource і balance GPU та CPU.

## 6.8 Підтвердження completion

Кожен Big/Hero effect проєкту має row у ledger (`Pass`, `Conditional` або `Fail` з action), а optimization ledger B10 M/S фіксує чотири фактичні години.

# 7. Приклад scoring

| Category | Score | Note на основі evidence |
|---|---:|---|
| Theory | 18/20 | одна відповідь не пояснила consequence target loss |
| Practical integration | 32/35 | evidence attached transform задокументовано надто стисло |
| H/M/L | 18/20 | memory capture другого profile слабший |
| Presentation | 5/5 | спочатку gameplay, Sequencer лише для presentation |
| Troubleshooting/performance | 9/10 | status sorting задокументовано, але isolation capture відсутній |
| Self-review | 9/10 | наступна iteration actionable |
| **Total** | **91/100** | **Strong pass** |

Category floors:

```text
Theory 18 ≥ 12
Practical 32+18+5 = 55 ≥ 36
Troubleshooting 9 ≥ 6
Self-review 9 ≥ 6
Немає critical failure
```

# 8. Audit слабкої remediation

## Відхилений приклад

```text
Проблема: effect дорогий.
Виправлення: particle count зменшено удвічі.
Доказ: FPS виглядав кращим.
```

Чому відхилено:

- metadata target відсутні;
- root contributor не визначено;
- GT, CNC, RT і GPU не розрізнено;
- exact scenario відсутній;
- gameplay quality check відсутній;
- repeatable evidence відсутнє.

## Прийнятий приклад

```text
Failed item: evidence Quad Overdraw і material.
Відтворення: той самий target scenario із чотирма instances.
Root cause: secondary full-screen translucent renderer.
Одна зміна: видалити renderer у Medium.
Повторний запуск: ті самі camera, build і hardware; clean capture GPU та overdraw.
Gameplay: telegraph, core і contact розпізнаються; signature збережено.
Рішення: прийняти Medium, залишити High conditional.
```

# 9. Checks critical failure

- Gameplay spawn працює без Sequencer.
- Після cancel або завершення owner немає loop чи orphan.
- Types і spaces position, direction та target valid.
- Low зберігає essential gameplay.
- Fresh evidence існує.
- Вигаданих budgets немає.
- Effect Type і H/M/L є реальними assets та settings, а не лише prose.
- Core effect оригінальний і не залежить від Beta.

# 10. Фінальний checklist assessor

- [ ] Timer зупинено на 165 хвилинах.
- [ ] 10 theory answers оцінено.
- [ ] Ownership NiagaraComponent і spawn правильний.
- [ ] Sockets, notifies і attachment правильні.
- [ ] Re-entry, interruption і cleanup правильні.
- [ ] Position, direction, color, scale і target перевірено.
- [ ] Stale reset перевірено.
- [ ] Count після cooldown перевірено.
- [ ] Effect Type призначено.
- [ ] Matrix H/M/L реалізовано.
- [ ] Significance, culling і re-entry перевірено.
- [ ] Bounds перевірено.
- [ ] Два named target profiles перевірено.
- [ ] Evidence Niagara Debugger надано.
- [ ] Evidence GT і CNC надано.
- [ ] Evidence RT і GPU надано.
- [ ] Shader Complexity і Quad Overdraw надано.
- [ ] Texture memory перевірено.
- [ ] Mesh, ribbon, collision, light і sorting перевірено.
- [ ] Rerun із one-change, спрямованою на root cause, виконано.
- [ ] Gameplay capture передує Sequencer.
- [ ] Усі Big effects мають rows performance pass.
- [ ] Ledger 4 годин M/S присутній.
- [ ] Total і category floors пройдено.
- [ ] Critical failure відсутній.
