# 11.05 — Portfolio breakdowns, reel and case studies

## 1. Назва

**Evidence-first portfolio delivery: чотири описи проєктів, короткий reel, downloadable package та interview walkthrough.**

## 2. Результат уроку

Ви перетворите чотири завершені portfolio pieces на перевірюваний presentation package:

- `Resonant Edge`, `Triune Relay`, `Glassbloom Ward`, `Rift Crown` мають окремі описи проєктів;
- кожна piece показана у gameplay й neutral view;
- selection і reel не приховують слабку роботу монтажем;
- captions фіксують role, authorship, engine/build, target і playback;
- кожен опис проєкту містить reference principles, layer/timing, textures, materials, Niagara, Blueprint і докази продуктивності;
- до й після та H/M/L показані за однакових умов;
- downloadable package має зрозумілі filenames, manifest і credits;
- ви можете чесно пройти 3–5-хвилинний interview walkthrough кожної роботи;
- block assessment завершено в межах часу цього уроку.

Результати: `P11_Reel_v01`, чотири `P11_CaseStudy_*`, `P11_Credits_And_Authorship`, `P11_Performance_Evidence`, `P11_Delivery_README`, `P11_Interview_Notes`.

## 3. Орієнтовний час

**6 годин: 2 години теорії / 4 години практики.**

- 60 хв теорії — selection, authorship, case-study narrative і evidence;
- 40 хв теорії — capture, reel, captions, performance proof і delivery;
- 20 хв теорії — block assessment test;
- 30 хв практики — cross-project evidence inventory і shot list;
- 60 хв практики — gameplay/neutral capture та edit;
- 60 хв практики — M/S practice: фінальний polish material/Niagara breakdown views;
- 45 хв практики — чотири compact описи проєктів;
- 45 хв практики — reel, downloadable package, assessment review і interview rehearsal.

M/S ledger: **1 година; cumulative 6/6 годин блоку**.

[Block assessment](BLOCK_ASSESSMENT.md) виконується всередині цих 6 годин; **додаткові години не додаються**. Практичні captures/описи проєктів цього уроку є assessment evidence, а не другою окремою роботою.

## 4. Prerequisites

- завершені lessons 11.01–11.04;
- кожна piece має preliminary score `≥80/100` і всі category floors;
- gameplay build/scene, neutral capture setup і final H/M/L assets;
- performance captures, source/license/authorship logs;
- право демонструвати всі third-party character/animation/environment/audio assets;
- core Unreal Engine 5.8 tools; **без Beta або Experimental dependency**.

## 5. Нові терміни

- **Evidence-first presentation** — висновок підкріплено gameplay capture, graph, profiler або artifact.
- **Selection matrix** — таблиця, яка порівнює роботи за quality, relevance, completeness і overlap.
- **Hero shot** — найсильніший короткий фрагмент, але не заміна повного gameplay proof.
- **Case study** — структурований опис intent, constraints, process, technical architecture, iteration, result і limitations.
- **Role disclosure** — точне формулювання, що зробили ви, команда й third-party creators.
- **Playback disclosure** — позначення `real time`, `slowed`, `looped` або `cinematic`.
- **Performance proof** — capture target build і profiler data, а не лише smooth encoded video.
- **Delivery manifest** — список files, versions, formats, credits і способу навігації.
- **Interview walkthrough** — коротке усне пояснення decision → implementation → evidence → limitation.
- **Unverifiable claim** — твердження на кшталт «AAA-ready» або «console optimized» без визначеного target й доказу.

## 6. Навіщо ця тема потрібна VFX-фахівцю

Навіть сильний effect важко оцінити, якщо reel не показує gameplay context, роль незрозуміла, graph обрізаний, а optimization існує лише як слово. Presentation — це технічна комунікація: під час самооцінювання вона допомагає швидко відокремити вашу роботу від чужих assets, побачити problem solving і перевірити claims; optional reviewer може повторити той самий аудит.

Portfolio може підвищити ясність вашої заявки, але курс, reel або score **не гарантують працевлаштування, interview чи offer**. Не вигадуйте командні credits, platform results, client names або production claims.

## 7. Теорія простими словами

Для кожної piece заповніть картку самооцінювання із чотирма відповідями; optional reviewer може прочитати ту саму card, але не є умовою проходження:

1. **Що мав прочитати гравець?**
2. **Що саме створили ви?**
3. **Як це побудовано та інтегровано?**
4. **Який доказ, що це працює й масштабується?**

Reel відповідає «чи хочу я дивитися далі?». Case study відповідає «чи розуміє автор свою роботу?». Performance page відповідає «чи вимірювали це чесно?». Credits відповідають «кому належить кожна частина?».

## 8. Детальні технічні пояснення

### Selection criteria

У цьому блоці чотири pieces обов’язкові, тому selection визначає порядок і довжину, а не приховує невдалу piece. Оцініть кожну за:

- gameplay readability;
- visual/technical quality;
- відмінність від інших pieces;
- completeness of integration, H/M/L і докази продуктивності;
- authorship clarity;
- relevance до бажаного real-time VFX напряму.

Найсильніша й найрелевантніша робота відкриває reel. Якщо одна piece слабша за `80/100` або має critical gameplay/performance error, спочатку remediation, потім presentation.

### Capture plan

Для кожної piece обов’язкові:

- real-time gameplay clip із normal camera/control;
- neutral front/side/top або еквівалентні technical views;
- layer-isolation/timing view;
- H/M/L parity;
- до й після optimization за identical conditions;
- material graph, Niagara stack і Blueprint/data diagram;
- recorded resolution, frame rate, build/profile і playback label.

`Shot`/`HighResShot` корисні для stills; Sequencer/Movie Render Queue — для контрольованих beauty/neutral shots. Вони **не є performance proof**: performance показуйте з target gameplay build і profiling overlay/capture.

### Reel structure

Робочий діапазон, а не універсальне правило: **60–90 s**.

```text
00–04  title: name/contact/role focus
04–20  strongest piece: gameplay → neutral → one breakdown flash
20–36  second piece
36–52  third piece
52–68  fourth piece
68–78  concise technical/performance montage
78–82  contact/end card
```

Якщо матеріал сильніше працює за 55 або 95 s, змініть duration і поясніть selection. Не прискорюйте footage так, щоб timing стало неправдивим. Audio має бути lawful, credited і не перекривати effect timing; reel повинен працювати muted.

### Caption standard

Перший on-screen caption кожної piece:

```text
RIFT CROWN — Ultimate / Boss Ability
Role: VFX design, textures, materials, Niagara, Blueprint integration
UE build: [actual] | Target: [actual hardware/profile]
Third-party: character/animation/environment — [source/license]
Playback: real time
```

Подальші captions короткі: `Gameplay`, `Neutral view`, `Layer isolation`, `H/M/L`, `Before/After — identical test`. Не використовуйте дрібний текст, який неможливо прочитати за час кадру.

### Authorship and ethical presentation

Для кожного asset family запишіть:

| Item | Author/role | Source/license | Modification | Shown where |
|---|---|---|---|---|
| VFX textures/meshes | you | original | authored | breakdown |
| materials/Niagara/BP | you | original | authored | graphs |
| character/animation | actual source | actual license | actual edit | gameplay |
| environment/audio/font | actual source | actual license | actual edit | reel/case study |

Не називайте solo project командною production роботою, а tutorial-derived study — original design без disclosure. Не показуйте confidential/proprietary client assets.

### Four case-study template

Кожен case study має однакову навігацію:

1. title, результат одним реченням і role/authorship;
2. gameplay intent, target, constraints і Definition of Done;
3. ethical reference principles і original design response;
4. gameplay + neutral final;
5. layer/timing/state map;
6. own textures/meshes;
7. material graphs/functions/instances;
8. full Niagara stacks і User Parameter contract;
9. Blueprint/gameplay integration;
10. історія iteration: problem → evidence → change;
11. performance target, зіставні матеріали до й після і H/M/L;
12. honest limitations і next iteration.

### Before/after standard

Пара має однакові hardware, build, resolution, quality profile, camera, route, spawn schedule, duration, warmed state й profiler method. Візуальна різниця не повинна походити з іншого exposure/camera. Підписуйте саме зміну, наприклад: `removed redundant translucent layer; preserved contact/boundary`.

### Downloadable delivery

```text
Portfolio_Delivery/
├─ 00_README_and_Manifest.pdf
├─ 01_Reel/
│  ├─ P11_Reel_1080p.mp4
│  └─ P11_Reel_Captions.txt
├─ 02_Case_Studies/
│  ├─ 01_Resonant_Edge/
│  ├─ 02_Triune_Relay/
│  ├─ 03_Glassbloom_Ward/
│  └─ 04_Rift_Crown/
├─ 03_Performance_Evidence/
├─ 04_Credits_Authorship_Licenses/
└─ 05_Contact/
```

README містить version/date, navigation, playback requirements, file sizes/formats, role summary, actual links/contact supplied by learner і known limitations. Не додавайте credentials, private source files, confidential data або assets, які license не дозволяє redistribute.

### Interview walkthrough

Для кожної piece підготуйте 3–5 хв:

```text
20 s — gameplay problem і intent
30 s — constraints/reference ethics
60 s — layer/material/Niagara architecture
45 s — Blueprint/data integration
45 s — найбільша weakness, profiling і before/after
20 s — limitation/next iteration
```

Відповідайте від decision до evidence. Якщо не знаєте точне число, відкрийте зафіксований report або скажіть, що воно не вимірювалося; не вигадуйте.

### Presentation acceptance / Definition of Done

Package завершений, коли всі чотири pieces окремо мають `≥80/100` і floors, gameplay/neutral capture, complete breakdown, H/M/L, докази продуктивності, credits і limitations; reel captions точні; links/files відкриваються; download structure зрозуміла; assessment `≥80/100`; жодного proprietary asset або unverifiable claim.

## 9. Візуальні або математичні приклади

Selection matrix:

| Piece | Gameplay clarity /5 | Technical depth /5 | Visual distinction /5 | Evidence /5 | Reel order |
|---|---:|---:|---:|---:|---:|
| Resonant Edge | measured | measured | measured | measured | choose |
| Triune Relay | measured | measured | measured | measured | choose |
| Glassbloom Ward | measured | measured | measured | measured | choose |
| Rift Crown | measured | measured | measured | measured | choose |

Caption readability check:

```text
minimum on-screen duration = readable characters / tested reading rate
```

Не використовуйте вигаданий universal reading rate: протестуйте captions на двох людях або у двох окремих viewing passes і скоротіть текст.

Evidence chain:

```text
claim → target/condition → capture or graph → measured result → limitation
```

## 10. Controlled experiments

1. Подивіться reel muted: intent і captions мають лишатися зрозумілими.
2. Подивіться тільки gameplay shots: чи не приховує монтаж timing/readability?
3. Відкрийте package на іншому device/account без editor context; перевірте files/links.
4. Приберіть назву piece: чи розрізняються всі чотири за form/motion/timing?
5. Порівняйте gameplay й neutral capture однієї build/version.
6. Перевірте кожне слово `optimized`, `real time`, `original`, `solo`, `console/PC` доказом.
7. Відкладіть case study до наступного review pass, відкрийте exported version без author notes, запустіть таймер на 90 s і до відкриття notes письмово дайте дві відповіді: що ви створили та яку проблему вирішили. Використайте той самий deterministic checklist; optional reviewer може повторити тест.
8. Проведіть interview walkthrough із двома follow-up: «чому?» і «який доказ?».

## 11. Покрокова керована практика

### Крок 1 — Заморозьте assessment versions

Для кожної piece запишіть asset/build version, rubric score, floors, limitations і critical-fail status. Не монтуйте failed piece: виконайте weak-topic remediation за [assessment](BLOCK_ASSESSMENT.md).

### Крок 2 — Побудуйте evidence inventory

```text
Piece
├─ final gameplay
├─ neutral/front/side/top
├─ reference principles
├─ layer/timing
├─ textures/meshes
├─ materials
├─ Niagara stacks
├─ Blueprint/data
├─ performance before/after
├─ H/M/L
└─ authorship/limitations
```

Позначте missing evidence до нового capture.

### Крок 3 — Зафіксуйте capture standard

- однакова resolution/frame-rate policy;
- fixed exposure для neutral comparisons;
- real-time playback за замовчуванням;
- slowed/looped/cinematic — завжди labeled;
- safe text area й читабельний font;
- lossless/high-quality masters перед compressed delivery;
- performance capture окремо від beauty render.

### Крок 4 — Виконайте 1 годину M/S polish

Не перебудовуйте art direction. Виправте лише presentation-critical material/Niagara issues:

- texture/channel labels;
- material graph grouping/commenting і instance table;
- Niagara stack screenshots із visible emitter/module names;
- один inconsistent emissive/edge/opacity response;
- одна readability issue у neutral view;
- version-lock після regression capture.

### Крок 5 — Зберіть чотири описи проєктів

Використайте однакові 12 sections, але не однакову історію. Для кожної назвіть конкретний gameplay problem, biggest iteration і limitation. Graph screenshots мають бути достатньо великими або розбитими на labeled panels.

### Крок 6 — Змонтуйте reel

- strongest relevant clip first;
- 2–4 s shots, якщо зміст читається; довше для повного timing;
- gameplay перед beauty;
- одна коротка technical montage, не миготіння unreadable graphs;
- role/playback captions;
- consistent audio level або mute-safe design;
- end card тільки з actual contact/link.

### Крок 7 — Побудуйте delivery й manifest

Створіть directory tree, перевірте filenames, sizes, formats, credits/license limits і всі links. Не redistribute third-party source assets, якщо license цього не дозволяє.

### Крок 8 — Пройдіть assessment

Виконайте test, practical cross-project review, troubleshooting/performance і самооцінювання із [BLOCK_ASSESSMENT.md](BLOCK_ASSESSMENT.md). Це частина lesson schedule; **жодного додаткового часу**.

### Крок 9 — Репетиція interview

Запишіть один take на 3–5 хв для кожної piece. Вилучіть unverifiable superlatives, скоротіть chronology, додайте evidence/limitation. Не заучуйте рекламний текст; вмійте відкрити потрібний graph/capture.

## 12. Точні назви вузлів, модулів і налаштувань UE

- still capture: console commands `Shot`, `HighResShot`;
- Sequencer: `Level Sequence`, `Cine Camera Actor`, `Camera Cuts`;
- Movie Render Pipeline: `Movie Render Queue`/Movie Render Pipeline залежно від installed core workflow;
- gameplay/performance: `stat unit`, `stat gpu`, `ProfileGPU`, `Niagara Debugger`, `Unreal Insights`, Shader Complexity/Quad Overdraw;
- graphs/stacks: Material Editor, Niagara System Editor, Blueprint Editor display labels;
- capture/export codec/container і editor UI залежать від workstation/delivery target.

Exact UE 5.8 UI labels, screenshot paths, MRQ settings, codec availability і resolution behavior: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| Item | Starting choice |
|---|---|
| reel duration | `60–90 s` working range |
| gameplay clip/piece | `8–15 s` master before edit |
| neutral views | front/side/top or equivalent |
| case study | 12 required sections |
| interview walkthrough | `3–5 min` per piece |
| delivery reel | `1920×1080`, actual frame rate disclosed |
| stills | enough resolution for readable graphs/captions |
| filenames | `Project_Content_View_Version.ext` |
| assessment threshold | `≥80/100` plus piece/category gates |

Це starting choices, не універсальні hiring/platform вимоги. Перевірте actual hosting, codec, file-size й accessibility requirements обраного destination.

## 14. Очікуваний результат кожного етапу

- Inventory: усі missing/failed artifacts явно позначені.
- Capture: gameplay і neutral views походять із final version.
- M/S polish: graphs/stacks/material response читабельні без зміни scope.
- Case studies: відкладене самооцінювання за deterministic checklist підтверджує intent, role, architecture, evidence і limitation.
- Reel: strongest work first, timing/playback правдиві, captions readable.
- Delivery: package відкривається й не містить confidential/unlicensed files.
- Interview: кожен claim має evidence або чесне обмеження.
- Assessment: `≥80/100`, усі gate conditions виконані.

## 15. Самостійна вправа

### `EX-L11-05-A` — 75-second evidence-first reel

Створіть 75-секундний reel із усіма чотирма pieces. Для кожної обов’язкові gameplay shot, короткий neutral/technical proof і точний role/playback caption. Додайте shot list із причиною selection, lawful audio/font credits і mute-view check.

[Повне рішення A](../EXERCISE_ANSWERS/L11-05_portfolio_breakdowns_reel_and_case_studies_answers.md#ex-l11-05-a)

## 16. Додаткова складніша вправа

### `EX-L11-05-B` — Interview and delivery audit

Проведіть 5-хвилинний mock interview walkthrough для однієї випадково обраної piece, дайте відповіді на `чому`, `як виміряно`, `що зробили ви`, `що зламалося`, а потім перевірте downloadable package з fresh-user perspective. Виправте всі unverifiable claims, broken links, unclear credits і missing evidence.

[Повне рішення B](../EXERCISE_ANSWERS/L11-05_portfolio_breakdowns_reel_and_case_studies_answers.md#ex-l11-05-b)

## 17. Три рівні підказок

### Для `EX-L11-05-A`

- **Hint 1:** поставте strongest gameplay contact/state moment у перші 5 s.
- **Hint 2:** одна piece = context → result → proof; не показуйте чотири beauty shots без gameplay.
- **Hint 3:** shot list `0–4 title, 4–20 strongest, 20–36 second, 36–52 third, 52–68 fourth, 68–72 evidence, 72–75 contact`.

### Для `EX-L11-05-B`

- **Hint 1:** кожне речення позначте як decision, implementation, evidence або limitation.
- **Hint 2:** якщо claim не має artifact/condition, конкретизуйте або вилучіть.
- **Hint 3:** передайте package іншій людині/чистому середовищу з одним README; записуйте кожну точку, де потрібне пояснення.

## 18. Типові помилки

- reel починається довгим logo/title замість роботи;
- тільки cinematic views, немає gameplay timing/context;
- graphs миготять і нечитабельні;
- slow motion не labeled;
- «solo/original/optimized/console-ready» без evidence;
- role приховує third-party character/animation/environment;
- до й після має іншу camera/exposure/settings;
- performance доводиться encoded video або MRQ shot;
- описи проєктів повторюють process diary без decisions;
- package містить broken links, unlicensed source assets або private data.

## 19. Troubleshooting

| Симптом | Перша перевірка | Мінімальне виправлення |
|---|---|---|
| reel здається довгим | дублікати/weak shots | залишити один найкращий доказ кожної тези |
| незрозуміла роль | first caption/credits | вказати exact authored і third-party items |
| effect виглядає повільним | playback/export fps | відновити real time або label slowed |
| graphs нечитабельні | size/duration/crop | розбити на 2–3 labeled panels |
| до й після нечесний | condition manifest | повторити з однаковою camera/build/profile |
| smooth video без proof | target profiler evidence | додати gameplay capture/counters окремо |
| package не відкривається | relative links/formats | fix links, common formats, README navigation |

## 20. Performance considerations

- Capture/encoding frame rate не дорівнює runtime performance.
- MRQ/Sequencer корисні для presentation, але не підтверджують gameplay cost.
- Performance clip має показувати target conditions і actual profiling method.
- Graph/still resolution має бути достатньою для читання без надмірного package size.
- Long alpha video або uncompressed masters не обов’язково redistributable; delivery copies оптимізуйте окремо, masters збережіть.
- Перед upload перевірте audio/font/asset licenses і metadata/private paths.
- Не робіть platform claim без тесту на цій platform/configuration.

## 21. Запитання для самоперевірки

1. Чим відрізняються reel і опис проєкту?
2. Які два final views обов’язкові для кожної piece?
3. Що має містити first caption?
4. Чому MRQ shot не є performance proof?
5. Які умови має зберігати до й після?
6. Які 12 частин має опис проєкту?
7. Що записують у authorship table?
8. Як поводитися з unverifiable claim?
9. Що перевіряє interview walkthrough?
10. Чи гарантує сильний portfolio працевлаштування?

## 22. Відповіді

1. Reel швидко відбирає увагу; опис проєкту доводить intent, architecture, evidence й authorship.
2. Real-time gameplay і neutral technical view.
3. Piece, role, actual build/target, third-party disclosure і playback.
4. Offline/controlled rendering не вимірює target gameplay runtime.
5. Hardware, build, resolution, profile, camera, route, schedule, duration і warmed state.
6. Outcome/role, intent/constraints, references, finals, layers, assets, materials, Niagara, Blueprint, iteration, performance/HML і limitations.
7. Item, actual author/role, source/license, modification і де показано.
8. Додати конкретний target/evidence або вилучити/переформулювати.
9. Чи можете ви стисло пояснити decisions, implementation, measurements, failure й limitation.
10. Ні.

## 23. Self-check checklist

- [ ] Усі чотири pieces пройшли individual `≥80` і floors.
- [ ] Кожна має gameplay, neutral, H/M/L і до й після.
- [ ] Чотири 12-section описи проєктів завершені.
- [ ] Reel показує всі pieces і точні role/playback captions.
- [ ] Authorship/license table повний.
- [ ] Performance claims мають target evidence.
- [ ] Download package/README/links перевірені.
- [ ] Interview notes містять decisions, evidence і limitations.
- [ ] M/S ledger дорівнює 6/6 годин.
- [ ] Block assessment `≥80` і всі gates пройдені.

## 24. Mastery criteria

Ви можете відібрати й подати real-time VFX без перебільшень: швидко показати gameplay value, точно розкрити свою роль, пояснити material/Niagara/Blueprint architecture, продемонструвати identical докази продуктивності, визнати limitations і передати чотири описи проєктів у зрозумілому downloadable package.

## 25. Підсумок

Фінальний portfolio — це не набір beauty shots, а доказовий ланцюг від ігрового задуму до implementation, profiling і чесного authorship. Чотири різні pieces разом показують timing, reuse, persistent state, large-scale orchestration і production communication.

## 26. Зв’язок із наступними уроками

Це фінальний урок основної програми. Після [block assessment](BLOCK_ASSESSMENT.md) виконуйте targeted remediation лише слабких тем, оновлюйте versioned captures/описи проєктів і зберігайте source/license/performance records разом із package.

## 27. Офіційні джерела

- [Taking Screenshots](https://dev.epicgames.com/documentation/en-us/unreal-engine/taking-screenshots-in-unreal-engine)
- [How to Make Movies / Sequencer Basics](https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-make-movies-in-unreal-engine)
- [Movie Render Pipeline](https://dev.epicgames.com/documentation/en-us/unreal-engine/movie-render-pipeline-in-unreal-engine)
- [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara)
- [Niagara Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-debugger-for-unreal-engine)
- [Introduction to Performance Profiling and Configuration](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**

## 28. Перелік рекомендованих скриншотів або схем

1. Selection/order matrix для чотирьох pieces.
2. Master shot list із playback/build labels.
3. Reel timeline/storyboard.
4. Один повний 12-section case-study wireframe.
5. Чотири authorship/source/license tables.
6. Gameplay/neutral/HML grids для всіх pieces.
7. Чотири зіставні матеріали до й після performance panels.
8. Downloadable directory/manifest screenshot.
9. Interview evidence map: claim → artifact → limitation.
