# 1. L01-01 — Старт у UE 5.8: проєкт і безпечний перехід з UE 5.5

| Поле | Значення |
|---|---|
| Блок | `01_UE_FOUNDATIONS` |
| Lesson ID | `L01-01` |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | Чистий навчальний проєкт `StylizedVFXCourse58`, окрема резервна копія UE 5.5 та migration journal |
| Mastery gate | Студент може відрізнити робочу копію від резервної, підтвердити версію Editor і повторити безпечний запуск без ризику для оригіналу |

## 2. Результат уроку

Після уроку студент без покрокової підказки:

- створює окремий UE 5.8 sandbox для курсу;
- не відкриває єдиний екземпляр старого проєкту новішим Editor;
- фіксує версію, шлях, plugins, warnings і результат першого запуску;
- проводить migration rehearsal лише на копії;
- повертає проєкт у відомий робочий стан після невдалої перевірки.

Доказ результату: скриншот Project Browser або відкритого UE 5.8 Editor, журнал `L01-01_Migration_Journal.md` чи еквівалентний запис у навчальному журналі та дві фізично різні папки — untouched backup і working copy.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Ментальна модель версій, проєкту й резервної копії | 1.0 | 0 |
| Офіційні release notes і правила перевірки фактів | 1.0 | 0 |
| Controlled experiments | 0.5 | 0.5 |
| Guided practice | 1.5 | 1.5 |
| Самостійні вправи | 0.75 | 0.75 |
| Self-check, журнал і відновлення | 0.25 | 0.25 |
| **Разом** | **5.0** | **3.0 (60%)** |

Практична частка цього вступного safety-уроку нижча за 70%, але баланс усього блока становить 15.5 практичних годин із 22. Теорія тут безпосередньо запобігає незворотній втраті навчального проєкту.

## 4. Prerequisites

| Потрібно | Як перевірити |
|---|---|
| Доступ до диска з достатнім місцем для двох копій проєкту | Після копіювання вільного місця вистачає ще щонайменше на Derived Data і нові assets |
| Встановлений UE 5.5 або наявний UE 5.5 проєкт | Оригінал відкривається саме у звичному 5.5 Editor |
| Можливість установити UE 5.8 | Epic Games Launcher показує доступний UE 5.8 build |

Якщо старого проєкту немає, migration rehearsal виконується з маленьким disposable UE 5.5 test project, а не пропускається.

## 5. Нові терміни

| English term | Українське пояснення | Практичний приклад | Glossary |
|---|---|---|---|
| Engine version | Версія Unreal Engine, якою створено або відкривається проєкт | UE 5.5 і UE 5.8 не вважаються одним середовищем | [Engine version](../02_GLOSSARY.md#engine-version) |
| Project | Папка з `.uproject`, `Content`, configuration та залежностями | `StylizedVFXCourse58.uproject` | [Project](../02_GLOSSARY.md#project) |
| Working copy | Копія, у якій дозволено змінювати й зберігати assets | `StylizedVFXCourse58_Working` | [Working copy](../02_GLOSSARY.md#working-copy) |
| Backup | Недоторкана резервна копія, яку не відкривають для щоденної роботи | `Backup_UE55_2026-07-27` | [Backup](../02_GLOSSARY.md#backup) |
| Migration | Перехід проєкту або assets на новішу версію Engine | Тест відкриття копії 5.5 у 5.8 | [Migration](../02_GLOSSARY.md#migration) |
| Plugin | Додатковий модуль, від якого можуть залежати assets або Editor workflow | Niagara увімкнений у навчальному проєкті | [Plugin](../02_GLOSSARY.md#plugin) |
| Build | Конкретна збірка в межах версії Engine | У журналі записано видимий номер 5.8.x | [Build](../02_GLOSSARY.md#build) |

## 6. Навіщо ця тема потрібна VFX artist

VFX assets мають багато зв’язків: Material посилається на Texture, Niagara Renderer — на Material, Blueprint — на Niagara System. Якщо оновлення версії змінює asset або залежність, наслідок може проявитися не одразу. VFX artist повинен уміти відокремити:

1. **Оригінал**, який доводить, що попередній стан був робочим.
2. **Migration copy**, на якій дозволено отримати warnings і виправляти assets.
3. **Чистий course sandbox**, де уроки не змішані зі старими plugins, settings та випадковими dependencies.

Це production-звичка: спочатку створити відтворювану контрольну точку, потім змінювати одну систему.

## 7. Теорія простими словами

Уяви проєкт як складну сцену з підписаними контейнерами. Engine version — це набір правил, за якими контейнери читаються. Новіший Editor може зрозуміти старий формат і переписати частину даних, але старіший Editor не зобов’язаний розуміти новий запис. Тому кнопка **Save** у новішій версії є межею ризику.

Backup — не папка з назвою “backup”, яку потім продовжують редагувати. Це закритий контрольний стан. Working copy — витратний екземпляр: якщо rehearsal не вдався, її можна видалити й створити ще раз із backup.

Чистий sandbox потрібен не тому, що migration завжди ламається, а тому, що він прибирає зайві змінні. Якщо проблема виникла в чистому UE 5.8 project, причина майже напевно в поточному кроці. Якщо вона виникла лише у migrated project, потрібно досліджувати dependencies, plugins, redirects або settings.

## 8. Детальні технічні пояснення

### Що входить у проєкт

Критичний ідентифікатор — файл із розширенням `.uproject`. Папка `Content` містить authored assets. Папки кешів і згенерованих даних можуть бути великими, але не замінюють authored content. На цьому етапі не видаляй жодні папки зі старого проєкту: спочатку створи повну копію й перевір, що вона відкривається.

### Три стани

| Стан | Дозволено відкривати у 5.8 | Дозволено зберігати | Призначення |
|---|---|---|---|
| `UE55_BACKUP_READ_ONLY` | Ні | Ні | Відновлення |
| `UE55_MIGRATION_PROBE` | Так | Так | Пошук несумісностей |
| `StylizedVFXCourse58` | Так | Так | Навчання |

### Що фіксувати до migration

- назву й видиму Engine version;
- абсолютний шлях до `.uproject`;
- розмір папки та дату копії;
- список увімкнених plugins, якщо він відомий;
- карту або asset, яким перевіряється успішний запуск;
- усі warnings після першого відкриття копії;
- рішення: `PASS`, `PASS WITH WARNINGS` або `FAIL`.

### Що означає результат

- `PASS`: копія відкривається, контрольна карта й assets виглядають як у 5.5.
- `PASS WITH WARNINGS`: роботу не продовжують, поки кожен warning не класифіковано.
- `FAIL`: оригінал не виправляють навмання; working copy архівують для аналізу або відкидають, а backup лишається недоторканим.

Epic рекомендує оновлювати копію, а не єдиний оригінал. Точний вигляд conversion dialog у встановленому build: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 9. Візуальні або математичні приклади

```text
UE55_ORIGINAL
    │
    ├── повна копія ──> UE55_BACKUP_READ_ONLY
    │
    └── повна копія ──> UE55_MIGRATION_PROBE ──> відкрити в UE 5.8
                                                   │
                                                   ├── PASS: тестувати assets
                                                   ├── WARN: записати й ізолювати
                                                   └── FAIL: не торкатися backup

Окремо: New UE 5.8 Project ──> StylizedVFXCourse58
```

Приклад журналу:

| Поле | Значення |
|---|---|
| Source | `D:\UE55\OldVFX.uproject` |
| Backup | `E:\Backups\OldVFX_UE55_2026-07-27` |
| Probe | `D:\UE58Tests\OldVFX_Probe` |
| Target build | Запис із відкритого UE 5.8 Editor |
| Control asset | `L_OldVFX_Test` |
| Result | `PASS WITH WARNINGS` |
| Next action | Перевірити missing plugin до збереження інших assets |

## 10. Controlled experiments

### CE-L01-01-01 — Чи справді backup незалежний

- **Гіпотеза:** зміна файлу в working copy не змінює backup.
- **Незмінні умови:** Editor закритий; дві папки вже створені.
- **Змінювана величина:** назва звичайного текстового marker-файлу в working copy.
- **Дії:** створи marker тільки у working copy; перевір обидві папки; видали marker із working copy.
- **Очікування:** у backup marker ніколи не з’являється.
- **Висновок:** якщо зміна відбилася в обох місцях, це не дві незалежні копії; зупини migration.

### CE-L01-01-02 — Чистий запуск проти migration copy

- **Гіпотеза:** чистий 5.8 sandbox має менше невідомих залежностей, ніж migration copy.
- **Дії:** відкрий чистий sandbox, запиши warnings; закрий його; відкрий migration probe, запиши warnings.
- **Контроль:** одна й та сама Engine version, без зміни plugins між запусками.
- **Очікування:** результат не зобов’язаний відрізнятися; важлива здатність назвати, який warning належить якому проєкту.

## 11. Покрокова guided practice

### GP-L01-01 — Безпечний UE 5.8 sandbox

1. **Закрий UE 5.5 Editor.**  
   **Навіщо:** копіювання відкритого проєкту може захопити стан, який ще не збережено.  
   **Перевірка:** процес Editor не тримає `.uproject` відкритим.

2. **Знайди source `.uproject` і запиши абсолютний шлях.**  
   **Очікувано:** у журналі немає неоднозначного “мій старий проєкт”.

3. **Створи `UE55_BACKUP_READ_ONLY` як повну незалежну копію.**  
   **Навіщо:** це точка повернення.  
   **Перевірка:** backup містить власний `.uproject`; зміни working folder на нього не впливають.

4. **Створи другу копію `UE55_MIGRATION_PROBE`.**  
   **Навіщо:** migration не виконується на backup.

5. **Установи або запусти UE 5.8 через Epic Games Launcher.**  
   Точні labels Launcher і Project Browser: **Потребує ручної перевірки в Unreal Engine 5.8.**

6. **Створи чистий Blueprint project `StylizedVFXCourse58`.**  
   Обери blank game project для desktop/console без додаткового sample content, якщо такі options доступні.  
   **Перевірка:** проєкт відкрився без missing-content warnings. Точні template labels і defaults: **Потребує ручної перевірки в Unreal Engine 5.8.**

7. **Підтвердь build.**  
   Відкрий доступне в Editor вікно з інформацією про версію та запиши повний видимий номер. Точний menu path: **Потребує ручної перевірки в Unreal Engine 5.8.**

8. **Збережи стартову карту як `L_Startup_Check`.**  
   **Вхід:** будь-яка проста карта нового проєкту.  
   **Очікувано:** після закриття й повторного запуску карта відкривається.

9. **Перевір Niagara plugin, не змінюючи решту Project Settings.**  
   Якщо Niagara доступний у стандартній конфігурації, запиши `enabled`. Якщо Editor пропонує restart, спочатку збережи проєкт. Точний plugins UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

10. **Закрий sandbox і відкрий `UE55_MIGRATION_PROBE` у UE 5.8.**  
    Якщо Editor пропонує створити копію, не спрямовуй її в backup і не використовуй in-place conversion.  
    **Очікувано:** усі dialogs і warnings записані до натискання destructive options.

11. **Відкрий лише контрольну карту й 2–3 контрольні assets.**  
    Не починай масове resave. Порівняй із нотатками або скриншотами з 5.5.

12. **Присвой результат `PASS`, `PASS WITH WARNINGS` або `FAIL`.**  
    Для `WARN`/`FAIL` запиши symptom, exact asset і наступний безпечний test. Не “виправляй усе” в одному кроці.

13. **Повернися до `StylizedVFXCourse58`.**  
    Саме він є робочим проєктом курсу. Migration probe зберігається лише як доказ перевірки.

## 12. Точні назви UE nodes, modules і settings

У цьому уроці Material Graph і Niagara stack не створюються. Нормативні технічні елементи:

| ID | Назва | Тип | Роль |
|---|---|---|---|
| UI01 | `.uproject` | Project descriptor | Визначає корінь проєкту |
| UI02 | `Content` | Project folder | Містить authored assets |
| UI03 | `Plugins` | Editor configuration area | Перевірка Niagara та project dependencies |
| UI04 | `Save Current Level As` | Editor command | Створення `L_Startup_Check` |
| UI05 | `Niagara` | Plugin / built-in VFX system | Потрібний у наступних блоках |

Точні menu paths, положення panels і template labels у build 5.8.x: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| ID | Параметр | Стартове значення | Що зміниться |
|---|---|---|---|
| S01 | Course project name | `StylizedVFXCourse58` | Інша назва допустима, але всі журнали й screenshots мають її використовувати послідовно |
| S02 | Course Engine | UE 5.8 | UE 5.5 не використовується для authored course assets |
| S03 | Source backup count | 1 untouched copy | Нуль копій робить migration неприйнятно ризикованим |
| S04 | Migration working copies | 1 disposable copy | Додаткові копії потрібні лише для окремих test branches |
| S05 | Starter/sample content | Off, якщо option доступний | On додає зайві assets і залежності, але не впливає на mastery |
| S06 | Target intent | PC/console real-time | Визначає подальше профілювання; не є гарантією однакових settings на всіх платформах |

## 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат | Перевірка |
|---|---|---|
| Backup | Незалежна папка з `.uproject` | Marker test не змінює backup |
| Clean project | UE 5.8 відкриває `StylizedVFXCourse58` | Повторний запуск і відкриття `L_Startup_Check` |
| Version record | Повний видимий build записаний | Запис і screenshot збігаються |
| Migration probe | Є класифікований результат | Жоден warning не залишено як “щось червоне” |
| Return to sandbox | Курс продовжується в clean project | Шлях у журналі веде до correct `.uproject` |

## 15. Самостійна вправа

### EX-L01-01-A — Disaster-recovery rehearsal

Створи disposable copy `Recovery_Rehearsal`, внеси в неї безпечну видиму зміну — іншу назву копії карти `L_Startup_Check_Copy` — закрий Editor і віднови clean working state з untouched backup або fresh course copy.

**Обмеження:**

- не змінювати backup;
- не видаляти оригінал;
- не вважати відновлення завершеним без повторного відкриття карти.

**Deliverables:** до/після paths, два screenshots, 5–8 рядків журналу.

**Acceptance criteria:** відновлений project відкривається, карта доступна, студент може вказати, яка папка була disposable.

## 16. Додаткова складніша вправа

### EX-L01-01-B — Migration decision record

На копії невеликого UE 5.5 проєкту виконай migration probe й склади decision record:

- source і target versions;
- контрольна карта;
- три контрольні assets;
- plugin state;
- warnings;
- `PASS`, `PASS WITH WARNINGS` або `FAIL`;
- одна наступна дія, що змінює лише одну змінну.

**Обмеження:** не використовувати production/portfolio original як probe; не масово resave assets.

**Acceptance criteria:** після паузи виконавець повторює саме перевірку в disposable copy лише за записом, не здогадуючись, що було зроблено; інша людина може optional повторити той самий record.

## 17. Три рівні підказок

### EX-L01-01-A

<details>
<summary>Hint 1 — напрямок мислення</summary>

Відновлення перевіряється не наявністю папки, а успішним відкриттям конкретного контрольного asset.
</details>

<details>
<summary>Hint 2 — потрібні елементи</summary>

Потрібні untouched source, disposable working copy, контрольна карта, журнал paths і фінальний reopen test.
</details>

<details>
<summary>Hint 3 — майже повна структура</summary>

Зафіксуй source → створи copy → зміни тільки copy → закрий Editor → відклади пошкоджену/змінену copy → створи нову working copy зі source → відкрий контрольну карту → запиши результат.
</details>

**Повне рішення після спроби:** [EX-L01-01-A](../EXERCISE_ANSWERS/L01-01_course_setup_and_ue58_workflow_answers.md#ex-l01-01-a)

### EX-L01-01-B

<details>
<summary>Hint 1 — напрямок мислення</summary>

Migration decision має відповідати на “чи можна продовжувати?” і “який один ризик перевіряємо далі?”.
</details>

<details>
<summary>Hint 2 — потрібні елементи</summary>

Версії, paths, контрольна карта, 3 assets різних типів, plugins, warnings, classification і next action.
</details>

<details>
<summary>Hint 3 — майже повна структура</summary>

Спочатку baseline у 5.5, потім копія, потім відкриття в 5.8, потім той самий набір контрольних assets, порівняння й один із трьох verdicts. Для warning наведи exact asset і isolated next test.
</details>

**Повне рішення після спроби:** [EX-L01-01-B](../EXERCISE_ANSWERS/L01-01_course_setup_and_ue58_workflow_answers.md#ex-l01-01-b)

## 18. Типові помилки

| Помилка | Як виглядає | Чому виникає | Як попередити |
|---|---|---|---|
| Backup відкривають для щоденної роботи | Дата зміни backup постійно оновлюється | Папки не мають чітких ролей | Додати `READ_ONLY` у назву й працювати лише з copy |
| Плутають Engine installations | Проєкт відкривається не тим Editor | Подвійний клік без перевірки version | Записати build у кожну test session |
| Зберігають warning без контексту | Screenshot не показує asset або дію | Журнал почали після помилки | Записувати action → expected → observed |
| Змінюють plugins і Engine version одночасно | Неможливо визначити причину | Бажання “налаштувати все одразу” | Одна змінна на test |
| Вважають clean launch доказом успішної migration | Проєкт відкрився, але assets не перевірені | Перевірено лише shell | Відкрити контрольну карту й assets |

## 19. Troubleshooting

| Симптом | Діагностичний тест | Імовірна причина | Виправлення | Перевірка |
|---|---|---|---|---|
| Проєкт не видно в Project Browser | Відкрити `.uproject` через file picker | Browser не індексував шлях | Вказати correct `.uproject`; не переносити backup | Project відкривається з очікуваного path |
| Повідомлення про missing plugin | Зіставити plugin зі списком 5.5 | Dependency не встановлена або вимкнена | На probe увімкнути/встановити лише перевірений plugin або зафіксувати blocker | Warning зник або класифікований |
| Карта відкривається порожньою | Перевірити, яка map фактично відкрита | Відкрито startup map, не control map | Відкрити записаний control asset | Кількість і положення контрольних objects збігаються |
| Backup і copy змінюються разом | Marker test | Це shortcut/sync/mirror, а не незалежна копія | Створити фізично незалежний snapshot | Marker присутній лише в working copy |
| 5.8 Editor пропонує conversion незрозумілого типу | Не натискати; записати dialog | UI/build відрізняється від опису | Звірити офіційну документацію та використовувати copy workflow | Backup не змінено |

## 20. Performance considerations

Цей урок не встановлює runtime budget. Він створює умови для чесного profiling:

- чистий sandbox не успадковує невідомі plugins і settings;
- перший запуск або shader compilation не можна порівнювати зі “прогрітим” повторним запуском;
- Editor startup time не дорівнює gameplay frame time;
- розмір backup — storage concern, не runtime VFX cost;
- зміна Project Settings може впливати на весь проєкт, тому її потрібно журналювати.

Запиши приблизний час першого та другого відкриття clean project. Не роби висновку “5.8 швидший/повільніший” з одного запуску: hardware, cache і background tasks не контрольовані.

## 21. Запитання для самоперевірки

1. Чим backup відрізняється від working copy?
2. Чому недостатньо побачити, що migrated project просто відкрився?
3. Які три контрольні стани використовуються в цьому уроці?
4. Що потрібно записати до відкриття копії в UE 5.8?
5. Чому небезпечно одночасно змінювати Engine version і набір plugins?
6. Який verdict слід поставити, якщо карта працює, але один Material має warning?
7. Що є доказом успішного disaster-recovery rehearsal?
8. Чому clean course sandbox і migration probe не слід об’єднувати?

## 22. Відповіді на запитання

1. Backup є недоторканою точкою відновлення; working copy призначена для змін і може бути відкинута.
2. Відкриття project shell не перевіряє карти, Material, Niagara, Blueprint та їхні dependencies.
3. `UE55_BACKUP_READ_ONLY`, `UE55_MIGRATION_PROBE`, `StylizedVFXCourse58`.
4. Source path, version, backup path, control map/assets, plugin state й очікуваний результат.
5. Після помилки не можна встановити, яка саме зміна її спричинила.
6. `PASS WITH WARNINGS`, доки warning не пояснений і не перевірений.
7. Нова working copy з backup відкриває контрольну карту, а журнал однозначно описує шлях відновлення.
8. Clean sandbox є контрольованим навчальним середовищем; probe навмисно містить старі settings і dependencies.

## 23. Self-check checklist

- [ ] Я записав exact paths source, backup, probe і course project.
- [ ] Backup фізично незалежний і не відкривався в UE 5.8.
- [ ] `StylizedVFXCourse58` двічі успішно відкрив `L_Startup_Check`.
- [ ] Видимий UE 5.8 build записаний.
- [ ] Niagara availability перевірена без випадкових Project Settings changes.
- [ ] Migration probe має verdict і список warnings.
- [ ] Я виконав recovery rehearsal.
- [ ] У журналі немає неоднозначних записів “десь”, “щось” або “начебто працює”.

## 24. Mastery criteria

Урок пройдено, якщо:

- студент із закритого Editor правильно називає й знаходить усі три стани;
- backup не змінений;
- clean UE 5.8 project і контрольна карта повторно відкриваються;
- migration verdict підкріплений перевіркою карти та assets;
- recovery rehearsal завершений без використання backup як working folder;
- щонайменше 7 із 8 контрольних відповідей правильні.

Якщо backup був випадково перетворений або змінений, mastery не зараховується: потрібно заново створити контрольну точку з робочого UE 5.5 source.

## 25. Підсумок

- Version upgrade — це керований experiment, а не натискання “оновити”.
- Backup, migration probe і clean sandbox мають різні ролі.
- Проєкт перевіряється контрольними assets, а не лише фактом запуску.
- Warnings класифікуються до наступних змін.
- Відтворюваний журнал є частиною технічного результату.

## 26. Зв’язок із наступними уроками

| Наступний урок | Що повторно використовується | Що зберегти |
|---|---|---|
| [L01-02 — Editor та дисципліна VFX-асетів](02_editor_navigation_and_asset_workflow.md) | Clean `StylizedVFXCourse58` і safety journal | `.uproject`, `L_Startup_Check`, paths і build record |
| L01-03 | Окремий test sandbox | Не переносити випадкові assets із migration probe |
| L01-04 | Принцип “одна змінна — один test” | Журнал expected/observed/result |

## 27. Офіційні джерела

- `UE58-01` — [Unreal Engine 5.8 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine), Epic Games, UE 5.8, доступ 2026-07-27.
- `UE58-02` — [Unreal Engine 5.8 Release Notes](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes), Epic Games, доступ 2026-07-27.
- `UE58-04` — [Unreal Engine 5.8 is now available](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available), Epic Games, June 2026.
- [Updating Projects to Newer Versions of Unreal Engine](https://dev.epicgames.com/documentation/unreal-engine/updating-projects-to-newer-versions-of-unreal-engine), Epic Games, UE 5.8, доступ 2026-07-27 — copy-based conversion і ризик роботи з оригіналом.
- Повний каталог і version-sensitive застереження: [SOURCES.md](../SOURCES.md).

## 28. Перелік рекомендованих скриншотів або схем

**Рекомендований скриншот 1 — версія Editor**  
Що відкрити: доступне в UE 5.8 вікно з version/build information.  
Що повинно бути видно: повний номер build і назва Engine.  
Яку область виділити: тільки version information без персональних paths.

**Рекомендований скриншот 2 — три стани папок**  
Що відкрити: file browser на рівні parent directory.  
Що повинно бути видно: backup, migration probe і course project як окремі папки.  
Яку область виділити: назви й дати; приховати приватні частини абсолютного path.

**Рекомендований скриншот 3 — migration verdict**  
Що відкрити: migration journal.  
Що повинно бути видно: source, target build, control assets, warnings, verdict.  
Яку область виділити: рядки `Result` і `Next action`.

**Рекомендована схема**  
Що показати: розгалуження `original → backup / probe` та окремий clean sandbox.  
Що повинно бути видно: жодна стрілка не веде з UE 5.8 назад у backup.
