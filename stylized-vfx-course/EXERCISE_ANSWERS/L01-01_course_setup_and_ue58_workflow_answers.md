# Рішення до L01-01 — Старт у UE 5.8

Відкривай цей файл лише після власної спроби та послідовного використання Hint 1–3. Paths нижче є завершеним прикладом структури; у власному журналі потрібно записати фактичні paths.

## EX-L01-01-A — Disaster-recovery rehearsal

### Правильна побудова

Початковий стан:

```text
D:\UEProjects\StylizedVFXCourse58_Working\
E:\UEBackups\StylizedVFXCourse58_Clean_2026-07-27\
```

1. Закрий Unreal Editor.
2. Перевір, що `StylizedVFXCourse58_Clean_2026-07-27` відкривався й містить `L_Startup_Check` на момент створення backup.
3. Створи окрему копію:

```text
D:\UEProjects\Recovery_Rehearsal\
```

4. Відкрий лише `Recovery_Rehearsal` у UE 5.8.
5. Дублюй `L_Startup_Check` як `L_Startup_Check_Copy`, збережи й закрий Editor.
6. У журналі запиши:

| Поле | Значення |
|---|---|
| Source | `E:\UEBackups\StylizedVFXCourse58_Clean_2026-07-27` |
| Disposable copy | `D:\UEProjects\Recovery_Rehearsal` |
| Injected change | Додано `L_Startup_Check_Copy` |
| Backup changed | Ні |
| Recovery target | `D:\UEProjects\StylizedVFXCourse58_Restored` |

7. Не перетворюй змінену папку назад у “чисту” ручним видаленням одного asset: це не доводить повноту відновлення.
8. Створи `StylizedVFXCourse58_Restored` як нову копію untouched backup.
9. Відкрий `.uproject` restored copy в тому самому UE 5.8 build.
10. Відкрий `L_Startup_Check`, закрий Editor і відкрий карту ще раз.
11. Переконайся, що `L_Startup_Check_Copy` відсутня, а original map працює.
12. Познач rehearsal `PASS`; disposable copy можна архівувати як evidence або видалити після завершення self-review.

### Чому це працює

Відновлення відбувається з контрольного стану, а не через спробу вгадати всі внесені зміни. Повторне відкриття Level перевіряє не лише існування folder, а й те, що Editor читає project descriptor та asset package.

### Допустима альтернатива

Якщо проєкт уже під version control, можна створити окремий clean checkout/branch і відновити його з known commit. Для цього уроку все одно потрібен reopen test; наявність commit сама по собі не доводить, що local project запускається.

### Неправильні рішення

- Відкрити backup, видалити `L_Startup_Check_Copy` і назвати це recovery.
- Використовувати Windows shortcut або synchronized mirror як “другу копію”, не виконавши marker test.
- Відкрити restored project іншим Engine build і не записати це.
- Перевірити тільки `.uproject`, але не карту.

### Фінальна перевірка

- source/backup timestamp не змінився;
- restored folder фізично окремий;
- correct UE 5.8 build записаний;
- `L_Startup_Check` відкривається двічі;
- injected change відсутня;
- journal однозначно розрізняє всі folders.

### Performance/storage note

Ця вправа перевіряє reliability, не runtime performance. Перше відкриття restored copy може бути довшим через cache або shader preparation; це не доказ regression.

## EX-L01-01-B — Migration decision record

### Правильна побудова

Приклад source state:

| Поле | Запис |
|---|---|
| Source project | `D:\UE55\VFXMigrationProbe55\VFXMigrationProbe55.uproject` |
| Source Engine | UE 5.5 |
| Control map | `/Game/Maps/L_Migration_Control` |
| Control Material | `/Game/VFX/M_Migration_Control` |
| Control Texture | `/Game/VFX/T_Migration_Control` |
| Control Blueprint | `/Game/VFX/BP_Migration_Control` |
| Backup | `E:\UEBackups\VFXMigrationProbe55_Original` |
| Probe | `D:\UE58Tests\VFXMigrationProbe58` |

1. У UE 5.5 відкрий source, control map і три assets.
2. Збережи screenshots та запиши всі warnings, які вже існують у 5.5. Старий warning не можна приписати migration.
3. Закрий Editor.
4. Створи untouched backup і окремий probe.
5. Запусти UE 5.8 та відкрий probe через copy-based workflow; backup не обирай як target.
6. Точний dialog у current build: **Потребує ручної перевірки в Unreal Engine 5.8.**
7. До будь-якого mass save запиши startup/compile/plugin warnings.
8. Відкрий рівно той самий control set: map, Material, Texture, Blueprint.
9. Для кожного заповни:

| Asset | 5.5 baseline | 5.8 observation | Verdict |
|---|---|---|---|
| `L_Migration_Control` | 3 actors, fixed camera | 3 actors, camera збігається | Pass |
| `M_Migration_Control` | Compiles без warning | Compiles без warning | Pass |
| `T_Migration_Control` | 256×256 RGBA | 256×256 RGBA | Pass |
| `BP_Migration_Control` | Compiles без warning | Missing optional plugin class | Warning |

10. Загальний verdict — `PASS WITH WARNINGS`, бо один control asset не підтверджено.
11. Next action має змінювати одну variable:

```text
У новій copy probe увімкнути лише missing optional plugin,
перезапустити Editor і повторно compile BP_Migration_Control.
```

12. Не переносити це рішення на course sandbox. У clean course project plugin вмикають лише за реальною потребою курсу.

### Чому це працює

Baseline відокремлює pre-existing problem від migration regression. Контрольний набір охоплює різні asset paths, але лишається малим. Verdict не маскує warning словом “проєкт відкрився”.

### Допустимі verdicts

- `PASS`: усі контрольні результати збігаються, нових warnings немає.
- `PASS WITH WARNINGS`: основний case працює, але хоча б один warning ще потребує isolated test.
- `FAIL`: control map/asset не відкривається, data втрачено або crash відтворюється.

### Неправильні рішення

- Порівнювати різні maps у 5.5 і 5.8.
- Увімкнути всі plugins і натиснути всі automatic fixes одночасно.
- Назвати warning “нешкідливим”, не вказавши affected asset.
- Використати clean course sandbox як migration target і змішати старі dependencies з курсом.
- Зберегти новою версією єдину source copy.

### Фінальна перевірка

- source baseline створений до migration;
- backup не відкривався у 5.8;
- test set той самий;
- кожен warning має asset/context;
- verdict відповідає найслабшому control result;
- next action ізолює одну причину;
- course sandbox лишився clean.

### Performance note

Startup time, compile time й перший thumbnail render можуть змінитися через cache. Їх записують як observations, але не використовують як performance verdict без окремого repeatable protocol.
