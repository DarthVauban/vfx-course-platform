# Почніть звідси

## Що це за курс

Це самостійний competency-based курс зі створення stylized anime real-time VFX у Unreal Engine 5.8 та Niagara. Він розрахований на одну людину без викладача, групи або ментора й веде від початкової орієнтації в Unreal Engine та майже нульового знання Material Editor до чотирьох завершених portfolio pieces.

Повний маршрут: **66 уроків, 456 годин**. Із них **355.5 години (77.96%)** — практика; **140 годин**, або **39.38% усієї практики**, безпосередньо розвивають material/shader skills. Детальний ledger і правило, за яким assessment не додає повторних годин, наведені в `01_COURSE_MAP.md`.

Курс не гарантує працевлаштування. Його мета — сформувати технічну базу, художнє мислення, звичку перевіряти продуктивність і портфоліо, достатньо сильне для подання на Junior Real-Time VFX Artist / Stylized VFX Artist.

Основна мова пояснень — українська. Назви елементів інтерфейсу, Material nodes, Niagara modules, параметрів, assets і команд залишені англійською, щоб їх можна було безпомилково знайти в Unreal Engine.

## Для кого створено курс

Стартовий профіль студента:

- Unreal Engine — низький рівень;
- Niagara — базова орієнтація;
- Material Editor і shader math — практично з нуля;
- Photoshop/Krita — без досвіду створення VFX textures;
- Blender — primitives і найпростіші meshes;
- Substance 3D Designer — орієнтація в інтерфейсі;
- доступний час — 7–12 годин на тиждень;
- ціль — PC/console real-time gameplay.

Якщо окрема тема вже знайома, не пропускайте її автоматично. Виконайте controlled experiment, самостійну вправу й mastery criteria без підглядання. Лише такий результат зараховується як засвоєння.

## Версія Unreal Engine

Обов’язкові технічні кроки курсу написані для Unreal Engine 5.8. Офіційний реліз UE 5.8 доступний із 23 червня 2026 року. Якщо зараз установлено UE 5.5:

1. Установіть UE 5.8 паралельно через Epic Games Launcher.
2. Не відкривайте єдину копію важливого `.uproject` у новішій версії.
3. Створіть окремий навчальний проєкт у UE 5.8.
4. Для перенесення власних assets використовуйте копію проєкту або команду `Migrate`, перевіряючи dependencies.
5. Після відкриття assets у новішій версії не розраховуйте на зворотне відкриття в UE 5.5.

Уроки не спираються на Experimental features. Niagara Fluids позначено як optional/Beta і не входить до обов’язкового mastery gate.

## Що буде вивчено

Ви навчитеся:

- аналізувати reference і розкладати ефект на primary shape, secondary shapes, accents, supporting particles та residue;
- планувати silhouette, value hierarchy, color, timing, motion і gameplay readability;
- будувати VFX materials із чистого Material Graph та пояснювати математику кожної гілки;
- створювати procedural masks, dissolve, distortion, flow, gradient mapping, Fresnel, WPO та flipbook materials;
- створювати VFX textures у Photoshop або Krita й процедурні textures у Substance 3D Designer;
- робити прості VFX meshes у Blender та перевіряти їх у Unreal Engine;
- будувати Niagara Systems зі Sprite, Mesh і Ribbon Renderers;
- передавати дані між Blueprint, Niagara та Materials;
- створювати impacts, slashes, projectiles, trails, beams, shockwaves, auras, telegraphs, elemental abilities й character ultimate;
- інтегрувати effects у gameplay через components, sockets і animation notifies;
- вимірювати overdraw, shader complexity, particle/system cost, bounds, culling і scalability;
- готувати High/Medium/Low variants та production-friendly breakdown.

## Як організовані файли

Проходьте матеріал у порядку з `01_COURSE_MAP.md`. Кожна тематична папка містить:

- послідовно пронумеровані повні уроки;
- `BLOCK_ASSESSMENT.md` із теоретичним тестом, практичною контрольною роботою та рубрикою зі 100 балів.

Додаткові папки:

- `EXERCISE_ANSWERS/` — повні рішення самостійних вправ;
- `CHECKLISTS/` — reusable checklists для materials, Niagara, optimization, self-review та portfolio;
- `11_PORTFOLIO_PROJECTS/` — чотири фінальні production briefs;
- `SOURCES.md` — перевірений каталог джерел.

### Робочий Unreal-проєкт

Створіть один проєкт `SVFX_Course_58` на шаблоні Games → Third Person, Blueprint, без Starter Content. Усередині `/Game/` використовуйте таку базову структуру:

```text
/Game/SVFX/
├── Core/
│   ├── Materials/
│   ├── MaterialFunctions/
│   ├── Textures/
│   └── Meshes/
├── Studies/
├── Projects/
│   ├── Impact/
│   ├── MeleeCombo/
│   ├── ProjectileKit/
│   ├── Aura/
│   └── Ultimate/
├── Niagara/
├── Blueprints/
├── Maps/
└── Tests/
```

Не змінюйте назви assets хаотично. Базові prefixes:

| Тип | Prefix | Приклад |
|---|---:|---|
| Material | `M_` | `M_VFX_Sprite_Master` |
| Material Instance | `MI_` | `MI_VFX_Fire_Spark` |
| Material Function | `MF_` | `MF_Remap01` |
| Texture | `T_` | `T_VFX_Slash_A` |
| Static Mesh | `SM_` | `SM_VFX_SlashArc_A` |
| Niagara System | `NS_` | `NS_Impact_Fire_A` |
| Niagara Emitter | `NE_` | `NE_Sparks_Burst` |
| Niagara Module Script | `NMS_` | `NMS_SetAxisVelocity` |
| Blueprint | `BP_` | `BP_VFX_TestRig` |
| Material Parameter Collection | `MPC_` | `MPC_VFX_Global` |

## Як проходити один урок

Один повний цикл:

1. **Ментальна модель.** Сформулюйте своїми словами, що контролює система.
2. **Теорія.** Прочитайте пояснення й відтворіть математичний або візуальний приклад.
3. **Controlled experiment.** Змініть лише одну змінну; зафіксуйте вхід, вихід і спостереження.
4. **Guided practice.** Побудуйте asset за точними кроками, але вводьте nodes, modules і values самостійно.
5. **Самостійна варіація.** Закрийте guided practice і розв’яжіть нову задачу.
6. **Performance check.** Перевірте зазначені метрики в реальній test scene.
7. **Self-check.** Дайте відповіді без відкритого уроку.
8. **Mastery criteria.** Переходьте далі лише після виконання всіх обов’язкових критеріїв.

Читання без створеного й перевіреного asset не зараховується. Для курсу діє правило: щонайменше 70% фактичного часу — робота руками.

## Як виконувати вправи

### Guided practice

Guided practice містить однозначні дії, стартові values та очікуваний проміжний результат. Після кожного суттєвого кроку:

1. Зупиніться.
2. Порівняйте viewport із описом очікуваного результату.
3. Якщо результат інший, не продовжуйте нарощувати graph або stack.
4. Перевірте connections, execution order, data type, asset assignment і compile messages.
5. Запишіть причину помилки в журнал.

### Самостійна вправа

Самостійна вправа має відрізнятися від guided practice хоча б двома обмеженнями: shape, timing, motion, renderer, material logic або performance budget. Перед початком:

- запишіть бажаний результат одним реченням;
- намалюйте 3–5 thumbnail frames;
- перелічіть потрібні layers;
- установіть measurable limits: duration, particle count, texture size або screen coverage.

Після завершення збережіть:

- фінальний asset;
- screenshot або короткий capture;
- один debug screenshot;
- performance measurements;
- короткий breakdown «що контролює кожен layer».

## Як користуватися підказками

Кожна самостійна вправа має три рівні:

- **Hint 1** — напрямок мислення;
- **Hint 2** — потрібні nodes/modules;
- **Hint 3** — майже повна структура рішення.

Правило використання:

1. Працюйте самостійно щонайменше 20 хвилин.
2. Сформулюйте конкретну проблему: «mask не досягає 0», а не «не працює».
3. Відкрийте лише Hint 1.
4. Після нової спроби зачекайте щонайменше 10 хвилин перед Hint 2.
5. Hint 3 використовуйте лише після власної схеми або stack proposal.
6. Позначте в журналі найвищий використаний рівень.

Підказка не скасовує виконання. Якщо використано Hint 3, повторіть вправу через 2–7 днів із новими assets.

## Коли дивитися рішення

Відкривайте відповідний файл у `EXERCISE_ANSWERS/`, якщо виконано одну з умов:

- результат працює, і ви хочете порівняти архітектуру;
- після Hint 3 та двох діагностичних циклів лишився конкретний blocker;
- минуло 60–90 хвилин без прогресу, а журнал містить перевірені гіпотези.

Не копіюйте рішення node-by-node. Спочатку прочитайте пояснення причин, закрийте файл і відтворіть logic з пам’яті. Наступного дня зробіть міні-варіацію з іншими values.

## Навчальний журнал

Ведіть один Markdown-файл або notebook. Для кожної сесії використовуйте шаблон:

```text
Дата:
Урок / asset:
План на сесію:
Фактичний час: theory __ / practice __
Що побудовано:
Controlled variable:
Очікування:
Спостереження:
Помилка → причина → виправлення:
Performance before / after:
Використані hints:
Що можу відтворити без уроку:
Наступний найменший крок:
```

Записуйте не лише успіхи. Виявлена причина black material, missing renderer binding або incorrect bounds — цінний виробничий результат.

## Як оцінювати прогрес

Є чотири рівні:

1. **Розпізнаю** — можу пояснити термін після підказки.
2. **Відтворюю** — повторюю guided setup.
3. **Застосовую** — будую самостійну варіацію без solution.
4. **Діагностую і оптимізую** — знаходжу помилку, пояснюю trade-off та готую production variant.

Урок пройдено лише на рівні 3 для всіх core skills. Block Assessment пройдено, якщо:

- загальний бал не нижче 80/100;
- жодна критична категорія не нижче 60%;
- practical task працює без покрокового tutorial;
- performance evidence додано;
- source assets є власними або правомірно використаними.

Якщо результат 65–79, переробіть слабкі категорії та повторіть practical task з іншою варіацією. Нижче 65 — поверніться до вказаних prerequisite lessons.

## Стандартний тиждень на 7–12 годин

Приклад для 9 годин:

| Сесія | Час | Робота |
|---|---:|---|
| 1 | 1.5 год | theory + controlled experiment |
| 2 | 2 год | guided practice |
| 3 | 2 год | завершення guided practice + debug |
| 4 | 2 год | independent variation |
| 5 | 1 год | performance pass |
| 6 | 0.5 год | retrieval quiz + weekly review |

Не намагайтеся обов’язково закрити один урок за тиждень. Деякі material і portfolio lessons тривають кілька тижнів.

## Як уникати tutorial dependency

Tutorial dependency виникає, коли ви можете рухатися лише за чужою послідовністю кліків. Протидія:

- перед відкриттям lesson solution прогнозуйте graph або stack;
- після guided practice видаліть копію asset і відтворіть ключову гілку з пам’яті;
- пояснюйте кожне connection як «input → operation → output»;
- міняйте не лише color, а structure, timing і constraints;
- щотижня робіть один 30-хвилинний blind build;
- використовуйте reference як задачу для аналізу, а не як інструкцію для копіювання;
- зберігайте власну бібліотеку перевірених Material Functions, Niagara modules і checklists.

Ознака залежності: без відео або тексту ви не знаєте, який attribute потрібен. Ознака навички: ви спочатку формулюєте потрібні дані, а вже потім знаходите node/module.

## Що робити після тривалої перерви

Після перерви 2–8 тижнів:

1. Не продовжуйте з середини складного project.
2. Прочитайте останні три записи журналу.
3. Без підглядання відтворіть:
   - один procedural 0–1 mask;
   - один panning/dissolve material;
   - один Niagara sprite burst із size/color over life.
4. Виконайте останній self-check.
5. Якщо виконано менше 80%, повторіть останні 1–2 lessons.
6. Створіть новий «return asset», а не ремонтуйте старий, поки не відновиться mental model.

Після перерви понад 8 тижнів повторіть останній Block Assessment. Це швидше за хаотичне перечитування всього блока.

## Коли не переходити далі

Зупиніться, якщо:

- не можете пояснити, який data type рухається між nodes;
- graph працює, але ви не знаєте, чому;
- самостійна вправа є лише recolor guided result;
- compile warning або Niagara issue просто приховано;
- effect не перевірено в gameplay camera;
- bounds вручну зроблено «дуже великими» без вимірювання;
- performance verdict ґрунтується лише на FPS;
- рішення відкривалося до власної спроби;
- source або ліцензія reference asset незрозумілі.

Повернення до фундаменту — не відставання, а нормальний production workflow.

## Правила роботи з референсами

Genshin Impact, Neverness to Everness, Dragon Sword, Wuthering Waves та інші stylized anime action games використовуються лише для аналізу:

- silhouette;
- value hierarchy;
- dominant/accent color;
- layer timing;
- direction of motion;
- screen coverage;
- gameplay readability.

Не вилучайте proprietary assets, textures, meshes або flipbooks. Не намагайтеся відтворити effect кадр у кадр для portfolio. Робіть власні source textures, meshes, timing і shape language.

## Перші дії

1. Установіть Unreal Engine 5.8.
2. Створіть `SVFX_Course_58`.
3. Створіть структуру `/Game/SVFX/`.
4. Створіть навчальний журнал.
5. Прочитайте `01_COURSE_MAP.md`.
6. Виконайте baseline self-assessment із `03_STUDY_AND_SELF_REVIEW.md`.
7. Почніть із `01_UE_FOUNDATIONS/01_course_setup_and_ue58_workflow.md`.

## Джерела

- [Unreal Engine 5.8 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine)
- [Unreal Engine 5.8 Release Notes](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes)
- [Unreal Engine 5.8 is now available](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available)
- [Migrating Assets](https://dev.epicgames.com/documentation/en-us/unreal-engine/migrating-assets-in-unreal-engine)

## Рекомендовані скриншоти або схеми

```text
Рекомендований скриншот:
Що відкрити: Epic Games Launcher → Unreal Engine → Library.
Що повинно бути видно: установлені UE 5.5 і UE 5.8 як окремі engine slots.
Яку область виділити: номери версій; не показувати ім’я облікового запису.
```

```text
Рекомендована схема:
Що показати: дерево /Game/SVFX/ із Core, Studies, Projects, Niagara, Blueprints, Maps і Tests.
Навіщо: студент має порівняти власну структуру до створення першого asset.
```
