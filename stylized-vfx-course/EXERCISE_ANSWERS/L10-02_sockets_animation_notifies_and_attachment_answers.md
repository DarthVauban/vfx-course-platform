# Рішення до уроку 10.02

## EX-L10-02-A

### 1. Ієрархія

```text
BP_L10_Character
└─ CharacterMesh
   └─ hand_r_socket
      └─ BP_L10_Weapon / WeaponMesh
         ├─ fx_weapon_root
         ├─ fx_weapon_tip
         └─ fx_weapon_contact
```

Weapon snapped до `hand_r_socket`. Trail/contact effects attach до `WeaponMesh`, а не до `CharacterMesh`.

### 2. Socket contract

| Socket | Parent | Призначення | Axis |
|---|---|---|---|
| `hand_r_socket` | hand bone | weapon attachment | project weapon-forward convention |
| `fx_weapon_root` | weapon mesh/root bone | trail base | longitudinal |
| `fx_weapon_tip` | weapon mesh/root bone | trail tip | той самий longitudinal axis |
| `fx_weapon_contact` | weapon mesh/root bone | impact sample | documented outward/contact normal |

Socket transforms перевірено debug axes у трьох animation poses.

### 3. Timeline

```text
0.00 charge start
0.14 trail begin
0.34 visible contact → world impact
0.46 trail end
0.70 recovery
```

Exact contact вирівняно за visible animation contact, а не скопійовано як довільний percentage.

### 4. Contact notify

`Play Niagara Particle Effect` використовує:

```text
Niagara System = NS_L10_ContactImpact
Socket Name = fx_weapon_contact
Attached = false
Offset = zero baseline
```

The effect samples the socket transform at the notify and remains world-space afterward. Exact labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 5. Trail state

Begin викликає:

```text
VFX_BeginWeaponTrail(ActionID, WeaponMesh, fx_weapon_root, fx_weapon_tip, Color, Scale)
```

End викликає:

```text
VFX_EndWeaponTrail(ActionID)
```

Bridge зберігає одну component reference та owning ActionID. Якщо re-entry policy = Restart, попередній path завершується/reset gracefully перед стартом нового.

### 6. Interruption

Cleanup викликається з:

- normal Notify State end;
- montage/action interruption;
- weapon unequip;
- owner `EndPlay`;
- failsafe window timeout.

End requests старого ActionID ігноруються, якщо component уже належить новішому action.

### 7. Test evidence

| Test | Expected | Observed |
|---|---|---|
| 0.5× | sync збережено | pass |
| 1× | contact у strike | pass |
| 1.5× | немає delayed trail | pass |
| cancel на 40% | trail cleanup | pass |
| rapid re-entry ×10 | один owned trail | pass |
| unequip | немає orphan | pass |
| movement після contact | impact лишається | pass |

### 8. Чому це працює

Socket owner правильний, contact і trail мають різні spatial contracts, а ActionID не дозволяє ранньому animation window керувати новішим component.

### 9. Альтернативи

- `Timed Niagara Effect` може володіти trail, якщо його parameter/interruption contract достатній.
- Custom `AnimNotifyState` class може централізувати begin/end.
- Placed weapon NiagaraComponent може замінити spawned attached trail.

### 10. Поширені неправильні рішення

- Attach world impact «для зручності».
- Resolve weapon socket на character mesh.
- Використати one-shot notify для indefinite trail.
- Stop будь-який trail на кожний End без ActionID.
- Тестувати лише Animation Editor preview.

### 11. Продуктивність

Rapid re-entry test записує active systems і trail particle count. Correct attachment не доводить cost; profiling потребує representative gameplay capture.

### 12. Перевірка критеріїв приймання

Усі сім criteria виконано.

---

## EX-L10-02-B

### 1. Матриця faults

| Fault | Injected change | Symptom |
|---|---|---|
| Wrong parent | CharacterMesh замість WeaponMesh | origin/root spawn |
| Wrong rule | retained old relative offset | pop/drift |
| Duplicate begin | built-in + bridge обидва start | два trails |
| Missing end | cancel обходить state end | orphan trail |

### 2. Діагностика wrong parent

Запиши `AttachComponent`, socket name та resolved world transform. `fx_weapon_tip` відсутній на CharacterMesh, але є на WeaponMesh. Виправ parent at source; не додавай compensating offset.

### 3. Діагностика wrong rule

Використай debug axis із zero offset, порівняй available `Location Type`/attachment rules і запиши initial/follow transform. Обери rule, що відповідає socket, та залиш лише intentional local offset.

Exact enum labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 4. Duplicate begin

Запиши `ActionID`, event source і begin count. Built-in timed notify та custom bridge spawned той самий system. Прибери один owner path; фінальний action має один begin.

### 5. Missing end

Normal State End не гарантується після interruption. Додай cancel/unequip/owner-end cleanup. Cleanup перевіряє ActionID перед stop.

### 6. Regression suite

Запусти:

- три camera angles;
- playback 0.75× і 1.25×;
- normal completion;
- cancel;
- re-entry;
- weapon unequip;
- owner destruction.

Після кожного test дочекайся cooldown і відфільтруй Niagara Debugger за trail asset.

### 7. Виправлений результат

```text
Begin count per accepted action = 1
Contact count per contact event = 1
End/cleanup owns same ActionID
Active trail after cooldown = 0
World impact follow parent = false
```

### 8. Чому це працює

Suite ізолює hierarchy, transform та event-lifecycle axes. Fix виконується там, де неправильне рішення входить у pipeline, а не маскується downstream.

### 9. Альтернативи

- Ignore re-entry може замінити Restart для exclusive attack states.
- Reusable custom Notify State може encapsulate ActionID callbacks.
- Mesh-specific sockets допустимі для weapons із різними proportions.

### 10. Поширені неправильні рішення

- Додати Delay, щоб приховати double begin.
- Offset effect для компенсації wrong parent.
- Destroy усі trail components globally на cancel.
- Збільшити notify trigger chance/threshold без evidence.
- Довіряти preview, коли runtime hierarchy відрізняється.

### 11. Перевірка

Capture містить socket axes, event log, clean gameplay view та after-cooldown debugger. Жодний старіший ActionID не може stop active trail.

### 12. Продуктивність

Diagnostics вимкнено для clean comparison. Universal notify/instance budget не заявляється; lesson доводить лише lifecycle і attachment integrity.
