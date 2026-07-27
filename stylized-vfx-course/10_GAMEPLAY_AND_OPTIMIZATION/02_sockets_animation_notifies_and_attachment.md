# 1. Назва

## Урок 10.02 — Sockets, Animation Notifies та attachment до character/weapon

# 2. Результат уроку

Після уроку ти зможеш:

- пояснити bone, Skeleton Socket і Mesh Socket;
- створити й перевірити socket relative transform;
- побудувати character→hand socket→weapon→weapon socket hierarchy;
- обрати parent component, на якому реально існує attach point;
- розрізняти `Keep Relative`, `Keep World` і `Snap to Target` transform intent;
- синхронізувати one-shot Niagara effect через Animation Notify;
- керувати looping trail/charge через Notify State begin/end;
- використати `Play Niagara Particle Effect`, `Timed Niagara Effect` або custom notify path за призначенням;
- перевірити notify timing у blends, montage re-entry, interruption і low frame rate;
- уникати double spawn під час re-entry;
- побудувати weapon/character action з charge, trail та impact;
- довести correctness gameplay-camera capture, а не лише animation preview.

Ключовий deliverable — `AM_L10_Attack` + `BP_L10_NotifyBridge` з socket-validated VFX timeline.

# 3. Орієнтовний час

**8 годин: 1.5 години теорії та 6.5 години практики.**

| Частина | T | P | Час |
|---|---:|---:|---:|
| Socket hierarchy і attachment theory | 45 хв | — | 45 хв |
| Notify/Notify State/re-entry theory | 45 хв | — | 45 хв |
| Socket and transform experiments | — | 1 год | 1 год |
| Guided character/weapon integration | — | 2 год 30 хв | 2 год 30 хв |
| Exercises A/B | — | 2 год 15 хв | 2 год 15 хв |
| Gameplay-camera, interrupt, evidence pass | — | 45 хв | 45 хв |
| **Разом** | **1 год 30 хв** | **6 год 30 хв** | **8 год** |

# 4. Prerequisites

- Завершено 10.01.
- Є Skeletal Mesh, Animation Sequence або Montage та weapon/static/skeletal mesh component.
- Є finite impact, short charge та looping trail system.
- Lifecycle/re-entry policy кожного effect записано.
- Є доступ до Animation Editor, Skeleton Tree і Blueprint.
- Core workflow не використовує Beta/Experimental features.

# 5. Нові терміни

| Термін | Пояснення |
|---|---|
| **Bone** | анімований transform у skeletal hierarchy |
| **Socket** | іменований attachment point з offset, який є child для bone |
| **Skeleton Socket** | socket, що зберігається в Skeleton asset і спільно використовується сумісними meshes |
| **Mesh Socket** | socket, що зберігається для конкретного Skeletal Mesh |
| **Attach hierarchy** | ланцюг transform між parent і child |
| **Relative transform** | transform у координатах parent або socket |
| **World transform** | transform у координатах level |
| **Snap to Target** | child переміщується точно на transform parent або socket |
| **Keep World** | child зберігає поточний видимий world transform під час attachment |
| **Keep Relative** | child зберігає числовий relative offset |
| **Animation Notify** | event у конкретний час або frame animation |
| **Notify State** | event window із семантикою begin, update та end |
| **Trigger Weight** | blend-weight threshold для виконання notify |
| **Re-entry** | animation або action запускається знову до завершення попереднього VFX path |
| **Interruption** | animation виходить до очікуваного notify або end |

# 6. Навіщо ця тема потрібна VFX artist

Socket визначає, **де** має бути effect; notify визначає, **коли** він змінюється.

Без дисциплінованого setup:

- muzzle flash з’являється біля руки персонажа замість muzzle зброї;
- width або orientation sword trail змінюється через неузгоджені axes sockets;
- charge loop лишається після скасування montage;
- той самий notify спрацьовує двічі під час blend або re-entry;
- impact attached до рухомої зброї та залишає gameplay contact point;
- preview виглядає правильно, але runtime weapon є іншим component без потрібного socket.

Gameplay VFX має пройти hierarchy, animation state та interruption test. Perfect single preview frame не є production proof.

# 7. Теорія простими словами

Socket — «іменований гачок» на bone. Він має relative position, rotation і scale.

Приклад hierarchy:

```text
CharacterActor
└─ CharacterMesh
   └─ hand_r_socket
      └─ WeaponActor/WeaponComponent
         ├─ fx_weapon_root
         ├─ fx_weapon_tip
         └─ fx_muzzle
```

Щоб spawn at `fx_weapon_tip`, `Attach to Component` має бути weapon component, де існує цей socket, а не character mesh.

Notify — точка: «на frame 18 запусти impact».

Notify State — діапазон: «від frame 10 до frame 24 trail active». Begin запускає effect, а End зупиняє його. Але interruption може обійти очікуваний end path, тому owner має failsafe cleanup.

# 8. Детальні технічні пояснення

## 8.1 Skeleton Socket проти Mesh Socket

Skeleton Socket:

- спільний для сумісних meshes;
- зручний для стандартизованих attach points руки або muzzle;
- зміна впливає на всіх users цього Skeleton.

Mesh Socket:

- дає override або attachment для конкретного mesh;
- корисний, коли proportions чи geometry потребують унікального offset;
- має бути збережений у mesh.

Вибір визначає ownership цих data.

## 8.2 Socket transform

Socket transform задається відносно parent bone:

```text
SocketWorld = BoneWorld × SocketRelative
```

Якщо child attached:

```text
ChildWorld = SocketWorld × ChildRelative
```

Rotation axes важливі для direction beam або trail. Додай тимчасовий axis mesh або debug arrows; не визначай orientation «на око» лише за particle cloud.

## 8.3 Attachment rules

| Намір | Rule family |
|---|---|
| Effect має точно збігтися із socket | Snap to Target-style |
| Зберегти authored local offset | Keep Relative |
| Виконати attachment без видимого стрибка | Keep World |

`Spawn System Attached` використовує enum `Location Type` замість трьох окремих загальних pins для attachment rules. Визнач відповідність потрібному rule експериментально.

Exact enum labels/semantics: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.4 One-shot Animation Notify

Epic документує `Play Niagara Particle Effect` для non-looping systems. Очікувані релевантні properties:

- Niagara System;
- Location/Rotation/Scale Offset;
- `Attached`;
- `Socket Name`.

Якщо `Attached=false`, effect може з’явитися на transform socket, але лишитися у world space. Якщо значення true, effect слідує за socket протягом своєї duration.

Exact Notify names/properties: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.5 Notify State

Timed Niagara notify states доречні для looping window:

- active window для trail;
- window для charge glow;
- window для intensity material або VFX sword.

Epic документує `Timed Niagara Effect` та `Advanced Timed Niagara Effect`; advanced path може передавати normalized progress notify або animation curves у Niagara User Parameters.

Exact available notify-state menu entries and property names: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.6 Built-in vs custom notify

| Path | Перевага | Обмеження |
|---|---|---|
| Built-in Play Niagara | швидка синхронізація one-shot | обмежені custom gameplay data та ownership |
| Timed Niagara | start і end за duration | interruption і re-entry усе одно потребують validation |
| Skeleton Notify event | reusable named event для Anim BP | логіку розділено між assets |
| Custom AnimNotify/State | reusable complex contract | більше engineering і maintenance |
| Montage notify callback | керований response montage | play path прив’язаний до montage |

Основний workflow уроку використовує built-in notify для one-shot і custom event bridge для trail із багатьма parameters.

## 8.7 Notify timing and blend

Перевір:

- точний frame і time notify;
- animation blend weight;
- перехід між sections montage;
- межу loop;
- playback rate 0.5×, 1× і 1.5×;
- скасування action до завершення state;
- repeated input під час active state.

Notify settings such as trigger threshold, filtering and montage tick type can affect execution/cost. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.8 Cosmetic event vs gameplay authority

VFX notify має візуалізувати gameplay timing, а не непомітно ставати єдиним authoritative рішенням про damage, якщо project design не обрав це явно. Дизайн networked gameplay та authority залежить від проєкту й потребує співпраці з programming.

Щонайменше записуй:

```text
Gameplay Event ID
Animation instance/action ID
Notify timestamp
VFX request ID
```

Так можна виявити duplicate або missing VFX, не плутаючи їх із damage.

## 8.9 Re-entry and interruption

Під час begin trail:

```text
якщо component не active → start
якщо component active → refresh або restart згідно з policy
```

Під час end trail:

```text
зупинити лише component, яким володіє цей ActionID
```

Failsafe для interruption:

- вихід із action або state;
- callback interruption для montage;
- unequip зброї;
- завершення play для owner;
- максимальний timeout window.

# 9. Візуальні або математичні приклади

## Transform chain

```text
Character root
  × bone руки
  × socket руки
  × component зброї
  × socket tip зброї
  × relative offset Niagara
  = world transform Niagara
```

Один неправильний parent або offset змінює фінальний transform.

## Timeline

```text
0.00       0.18         0.35            0.48       0.80
| charge | begin trail | contact/world impact | end trail | residue
         [======= Notify State =======]
```

## Width from two sockets

Для sampling ribbon або trail:

```text
width_reference = distance(SocketBase, SocketTip)
```

Це content data, а не універсальна width ribbon.

# 10. Controlled experiments

## Experiment A — wrong parent

Виконай attachment request до `fx_weapon_tip` спочатку на CharacterMesh, а потім на WeaponMesh. Запиши, який component знаходить socket і яку world position отримано.

## Experiment B — transform rule

Створи той самий debug axis із кожним доступним `Location Type`. Після spawn переміщуй і обертай parent. Зафіксуй початковий pop і behavior слідування.

## Experiment C — Attached boolean

Використай `Play Niagara Particle Effect` на тому самому socket із Attached off та on. Перемісти weapon одразу після notify.

## Experiment D — Notify vs State

Запусти one-shot у момент contact, а looping trail — у state window. Перерви montage посередині й перевір active Niagara components після cooldown.

## Experiment E — playback rate/re-entry

Виконай run на 0.5×, 1× і 1.5× та натисни attack двічі до завершення першого action. Підтвердь кількості start/end і значення ActionID.

# 11. Покрокова guided practice

## A. Socket audit

1. Відкрий Skeleton Tree персонажа.
2. Покажи sockets у viewport.
3. Перевір або створи `hand_r_socket`.
4. Відкрий mesh або skeleton зброї.
5. Перевір або створи:
   - `fx_weapon_root`;
   - `fx_weapon_tip`;
   - `fx_weapon_contact`.
6. Вирівняй forward і up axes відповідно до задокументованої project convention.
7. Збережи правильний owning asset.

Expected menu path `Skeleton Tree → right-click Bone → Add Socket`: **Потребує ручної перевірки в Unreal Engine 5.8.**

## B. Character/weapon hierarchy

1. У Blueprint персонажа attach weapon component або actor до `hand_r_socket`.
2. Обери intent snap-to-socket.
3. Обнули очікуваний relative transform, а потім додай обґрунтований asset-specific offset.
4. Відтвори animation або зроби scrub у крайніх poses.
5. Підтвердь, що weapon sockets рухаються правильно.

## C. Animation timeline

Використай `AM_L10_Attack` або Animation Sequence:

```text
Track VFX_OneShot: notify контакту
Track VFX_Window: notify state для trail
Track VFX_Debug: необов’язкові named markers
```

Contact frame обирають за видимим контактом weapon із environment, а не за довільним відсотком.

## D. One-shot contact

Додай `Play Niagara Particle Effect`:

- System = finite impact;
- Socket Name = `fx_weapon_contact`;
- Attached = false для world impact;
- offsets = zero baseline.

Після contact перемісти персонажа. Impact має лишитися у world space.

## E. Trail window

Використай timed або custom Notify State:

Під час Begin:

```text
знайти WeaponMesh
→ знайти fx_weapon_root і fx_weapon_tip
→ запустити або повторно використати owned trail component
→ встановити ActionID і parameters
```

Під час End:

```text
якщо component належить тому самому ActionID
→ graceful deactivate
```

## F. Parameterized bridge

Створи `BP_L10_NotifyBridge` або functions у character:

```text
VFX_BeginWeaponTrail(ActionID, Color, Scale)
VFX_EndWeaponTrail(ActionID)
VFX_PlayContact(WorldTransform, Direction)
VFX_CancelAction(ActionID)
```

Не дозволяй generic notify шукати actor references у всьому world.

## G. Interruption

Додай cancel на 40% trail window:

- зупини animation або montage;
- виклич cleanup action;
- перевір, що trail деактивується;
- перевір, що пізніший stale End не зупиняє новий action.

## H. Gameplay-camera pass

Виконай:

- gameplay camera спереду, збоку та ззаду;
- camera на близькій і далекій відстані;
- рух персонажа;
- кілька playback rates;
- 10 швидких спроб re-entry;
- unequip weapon посередині window.

Запиши один take із видимими axes sockets і один clean take.

# 12. Точні назви nodes, modules і settings

- `Skeleton Tree`
- `Add Socket`
- `Create Mesh Socket`
- `Socket Name`
- `Bone Name`
- `Relative Location`
- `Relative Rotation`
- `Relative Scale`
- `Parent Socket`
- `Attach Actor To Component`
- `Attach Component To Component`
- `Keep Relative`
- `Keep World`
- `Snap to Target`
- `Animation Notify`
- `Notify State`
- `Play Niagara Particle Effect`
- `Timed Niagara Effect`
- `Advanced Timed Niagara Effect`
- `Attached`
- `Location / Rotation / Scale Offset`
- `Trigger Weight Threshold`
- `Montage Notify`
- `On Notify Begin`
- `On Notify End`

Exact labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 13. Стартові значення параметрів

| Item | Стартове значення |
|---|---|
| Socket scale | 1,1,1 |
| Niagara relative offset | zero |
| Contact Attached | false |
| Trail Attached | true |
| Trail window | лише видима swing arc |
| Re-entry | Restart або Refresh, вибір задокументовано |
| Playback tests | 0.5× / 1× / 1.5× |
| Rapid re-entry | 10 requests |
| Interrupt point | 40% state window |

# 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат |
|---|---|
| Socket audit | named point розташований на правильній geometry і має правильні axes |
| Weapon hierarchy | weapon слідує за рукою без drift offset |
| Contact notify | один world impact у видимій точці contact |
| Trail begin | запускається один раз згідно з action policy |
| Trail end | graceful cleanup |
| Interruption | orphan trail відсутній |
| Re-entry | старий End не може зупинити новий action |
| Playback rate | effect візуально синхронізований |
| Gameplay camera | effect читабельний і правильно attached |

# 15. Самостійна вправа

## EX-L10-02-A — Synchronized weapon VFX action

**Завдання:** інтегруй charge, weapon trail і world contact impact в одну attack animation.

**Обмеження:**

- щонайменше три sockets або attach points;
- один one-shot Notify і один Notify State;
- contact impact лишається у world space;
- trail слідує за weapon;
- явний ownership через ActionID;
- tests на 0.5×, 1× і 1.5×;
- жоден step core workflow не спирається на Beta feature.

**Deliverables:**

- animation або montage;
- схема socket hierarchy;
- timeline notify;
- Blueprint bridge;
- capture з gameplay camera;
- evidence interruption і re-entry.

**Acceptance criteria:**

- sockets знаходяться на правильному component;
- transforms і axes задокументовано;
- contact спрацьовує один раз;
- trail правильно запускається й завершується;
- interruption виконує cleanup;
- re-entry має deterministic результат;
- після cooldown немає orphan effect.

# 16. Додаткова складніша вправа

## EX-L10-02-B — Notify fault and attachment regression suite

**Завдання:** інжектуй wrong parent, wrong transform rule, duplicate begin і missing end, а потім діагностуй і виправ кожну проблему.

**Обмеження:**

- у кожному test активний лише один fault;
- перевір три camera angles і два playback rates;
- включи unequip weapon;
- збережи gameplay event IDs;
- не використовуй довільний Delay як основне виправлення.

**Deliverables:**

- чотири captures із failures;
- таблиця root causes;
- виправлені hierarchy і timeline;
- карта cleanup для action state;
- regression checklist.

**Acceptance criteria:**

- кожен failure відтворюється;
- root problem у parent, rule або event знайдено;
- фінальні counts begin/end відповідають action policy;
- жоден старий action не зупиняє новий trail;
- після unequip або cancel не лишається active trail.

# 17. Три рівні підказок

## EX-L10-02-A

- **Hint 1:** обирай parent component, який фактично володіє потрібним socket.
- **Hint 2:** one-shot contact не повинен слідувати, а trail у window має слідувати.
- **Hint 3:** contact = built-in notify із Attached off; trail = begin/end state через bridge з ActionID.

[Повне рішення EX-L10-02-A](../EXERCISE_ANSWERS/L10-02_sockets_animation_notifies_and_attachment_answers.md#ex-l10-02-a)

## EX-L10-02-B

- **Hint 1:** відокрем spatial hierarchy faults від timing і lifecycle faults.
- **Hint 2:** записуй parent component, resolved transform socket, ActionID і counts begin/end.
- **Hint 3:** виправ parent і rule під час spawn; захисти begin через action policy; під час cancel/end зупиняй лише owned component; додай failsafe для owner та unequip.

[Повне рішення EX-L10-02-B](../EXERCISE_ANSWERS/L10-02_sockets_animation_notifies_and_attachment_answers.md#ex-l10-02-b)

# 18. Типові помилки

| Помилка | Симптом |
|---|---|
| Socket існує на weapon, але parent — character mesh | spawn відбувається в origin або root |
| Неправильна axis socket | beam або trail повернуто на 90° |
| Keep Relative зі старим ненульовим offset | неочікуваний pop |
| Contact має Attached true | impact рухається разом із sword |
| Trail запускає one-shot notify | window неможливо контролювати |
| Cleanup лише через State end | orphan effect після interruption |
| Немає ActionID | старий End зупиняє новий trail |
| Перевірено лише preview | runtime hierarchy не збігається |
| Notify є єдиною gameplay authority | cosmetic timing стає крихким |

# 19. Troubleshooting

## Spawn відбувається у root

Перевір написання socket name, owning component, вибір Skeleton Socket або Mesh Socket і runtime mesh. Запиши resolved transform socket.

## Rotation на 90°

Покажи axes socket, обнули Niagara offset, перевір project convention для forward і up, а потім додай одну навмисну correction.

## Подвійний trail

Запиши begin count і ActionID. Перевір blend, re-entry та чи не виконують spawn одночасно built-in і custom paths.

## Trail не зупиняється

Перевір paths state end, animation interruption, cancel, unequip і завершення owner. Не покладайся лише на очікуваний notify end.

## Notify не спрацьовує

Перевір placement track, фактичне відтворення animation, blend trigger threshold і filter, play path montage та gameplay log.

Exact UI/options: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 20. Performance considerations

- Attached looping effects можуть лишатися active off-screen; owner lifecycle і culling усе одно діють.
- Socket options на кшталт force-always-animated можуть впливати на bone evaluation; вмикай їх лише з обґрунтуванням.
- Надмірний notify-driven spawn може створювати bursts кількості instances.
- Trails і ribbons мають власні витрати particles, segments і rendering; правильний timing не гарантує performance.
- Debug axes sockets, logs і slow motion змінюють умови спостереження; повтори clean run.
- Performance targets потребують конкретних target hardware, build і scenario.

# 21. Запитання для самоперевірки

1. Чим Skeleton Socket відрізняється від Mesh Socket?
2. На який component треба attach до weapon-tip socket?
3. Коли використовувати Snap, Keep Relative, Keep World?
4. Що робить Attached у particle notify?
5. Чим Notify State відрізняється від Notify?
6. Чому End notify недостатній для cleanup?
7. Навіщо ActionID?
8. Які tests доводять animation sync?

# 22. Відповіді

1. Перший зберігається у Skeleton і спільний для сумісних meshes; другий належить конкретному mesh.
2. На weapon scene/skeletal/static mesh component, що володіє socket.
3. Snap точно суміщає effect із socket, Keep Relative зберігає числові offsets, а Keep World запобігає видимому стрибку.
4. Визначає, чи effect продовжує слідувати socket.
5. Notify — point event; State — duration із begin, update та end.
6. Interruption, unequip або знищення owner можуть обійти normal end.
7. Щоб старий action не керував component нового action.
8. Потрібні кілька playback rates, blends, re-entry, interruption, gameplay camera та cooldown audit.

# 23. Self-check checklist

- [ ] Правильний owning component визначено.
- [ ] Три sockets задокументовано.
- [ ] Axes показано й перевірено.
- [ ] Attachment rule перевірено.
- [ ] Contact лишається у world space.
- [ ] Trail attached.
- [ ] One-shot notify побудовано.
- [ ] Notify State побудовано.
- [ ] ActionID використано.
- [ ] Re-entry перевірено.
- [ ] Interruption перевірено.
- [ ] Unequip перевірено.
- [ ] 0.5×, 1× і 1.5× перевірено.
- [ ] Capture з gameplay camera записано.
- [ ] Після cooldown немає orphan effect.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. hierarchy і transform intent пояснено;
2. effect attached до фактичного owner socket;
3. notify timing відповідає видимому action;
4. state має failsafe cleanup;
5. re-entry дає deterministic результат;
6. gameplay-camera pass успішний;
7. EX-L10-02-A проходить щонайменше 6 із 7 критеріїв.

# 25. Підсумок

Socket — spatial contract, Notify — timing contract, lifecycle owner — cleanup contract. Production integration виникає лише коли всі три узгоджені й перевірені під movement, blend, re-entry та interruption.

# 26. Зв’язок із наступними уроками

У 10.03 notify bridge стане reusable gameplay API. Замість hard-coded color/scale/target ти передаватимеш typed position, direction, color, scale й target data одному effect family.

# 27. Офіційні джерела

- Epic Games. [Skeletal Mesh Sockets](https://dev.epicgames.com/documentation/en-us/unreal-engine/skeletal-mesh-sockets-in-unreal-engine).
- Epic Games. [Animation Notifies](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-notifies-in-unreal-engine).
- Epic Games. [Spawn System Attached](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Niagara/SpawnSystemAttached).
- Epic Games. [UNiagaraComponent API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraComponent).

# 28. Рекомендовані скриншоти або схеми

```text
1. Hierarchy Character→hand socket→weapon→weapon sockets.
2. Local axes sockets у weapon root, tip і contact.
3. Порівняння Snap, Keep Relative і Keep World.
4. Timeline animation з one-shot і state window.
5. Порівняння contact із Attached off та on.
6. Схема ownership begin/end через ActionID.
7. Cleanup path для interruption.
8. Clean result із gameplay camera.
```
