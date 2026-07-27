# Block Assessment 01 — Unreal Engine Foundations

## Призначення

Ця контрольна перевіряє gate `G01`: без покрокового туторіалу створити безпечний UE 5.8 sandbox, організувати assets, побудувати відтворюваний test level, імпортувати diagnostic Texture/Static Mesh, локалізувати три faults і записати performance baseline.

Рекомендований час першої спроби — 3 години. Час уже входить у практичний бюджет `L01-04`; remediation або повторна спроба додають окремий навчальний час.

## Умови допуску

- завершені `L01-01`–`L01-04`;
- untouched backup існує;
- student journal доступний;
- student уміє відкрити correct UE 5.8 build;
- answer files закриті.

## Правила самостійності

Під час practical assessment заборонено:

- відкривати lesson guided practice;
- відкривати `EXERCISE_ANSWERS`;
- використовувати покрокові video/text tutorials;
- копіювати готовий assessment project;
- переносити готову folder tree разом з assets;
- приховувати warnings або вигадувати measurements.

Дозволено:

- офіційну документацію Epic;
- `02_GLOSSARY.md`;
- власну коротку шпаргалку до 20 рядків, створену до assessment;
- власні source texture/mesh;
- calculator для median й percentages.

Якщо відкрито step-by-step tutorial або solution, practical attempt анулюється. Повторна спроба виконується з Variant B.

## Deliverable manifest

```text
G01_Assessment_58/
  G01_Assessment_58.uproject
  Content/G01/Maps/
  Content/G01/VFX/Materials/
  Content/G01/VFX/Textures/Diagnostics/
  Content/G01/VFX/Meshes/Diagnostics/
  Content/G01/VFX/Blueprints/
  Content/G01/TestAssets/
Evidence/
  G01_Theory_Answers.md
  G01_Project_Record.md
  G01_Import_Texture.md
  G01_Import_Mesh.md
  G01_DBG_01.md
  G01_DBG_02.md
  G01_DBG_03.md
  G01_Baseline.csv або Markdown table
  G01_Naming_Audit.md
  G01_Self_Review.md
  Screenshots/
```

Evidence може зберігатися в окремій навчальній папці, а не всередині UE project. Персональні absolute paths на screenshots можна приховати, але text records мають лишитися однозначними.

# Частина 1 — Теоретичний тест, 20 балів

Відповідай без конспекту. Кожне питання — 2 бали: 1 бал за правильний висновок, 1 бал за причинне пояснення.

1. Назви різні ролі `backup`, `migration probe` і clean course sandbox.
2. Поясни різницю між asset у Content і actor у Level на прикладі одного Static Mesh.
3. Які три частини інформативної назви asset і коли variant suffix є виправданим?
4. Чому повідомлення “Import completed” не доводить правильність Texture або Static Mesh?
5. Які параметри test-stage context не можна довільно змінювати між A/B comparisons?
6. Imported mesh виглядає в 100 разів меншим, а actor Scale дорівнює `0.01`. Який перший isolated test і чому?
7. Symptom зникає в minimal map, але є в робочій карті. Який scope це підказує?
8. Чому одночасна зміна source scale, exporter option та actor Scale є слабким debugging test?
9. Frame time дорівнює 20 ms. Обчисли приблизний FPS і поясни, чому це ще не target-platform VFX budget.
10. Назви щонайменше шість conditions, які мають бути однаковими або записаними для repeatable baseline.

# Частина 2 — Практична контрольна робота, 60 балів

## Creative/technical brief

Створи окремий Blueprint game project `G01_Assessment_58` у UE 5.8. Він має бути незалежним від course working project і не містити скопійованих lesson assets.

### Required Content structure

У `/Game/G01` мають бути canonical locations для:

- Maps;
- VFX Materials;
- diagnostic Textures;
- diagnostic Meshes;
- VFX Blueprints;
- TestAssets/temporary probes.

Точну вкладеність спроєктуй сам, але package path має дозволяти знайти будь-який required asset за type, purpose і path.

### Naming requirements

Створи й послідовно застосуй conventions для:

- Level;
- Material;
- Texture;
- Static Mesh;
- Blueprint Class.

Prefixes можуть збігатися з курсом. У report напиши, що це project convention, а не обов’язковий Engine rule.

Заборонені names: `NewMaterial`, `Test`, `Thing`, `Final`, випадкові `_2`, `_3`.

### Test level

Створи `L_G01_ReviewStage`, який містить:

- floor;
- scale reference;
- curved silhouette reference;
- imported mesh station;
- CameraActor, що одночасно бачить усі references;
- записаний lighting/exposure state;
- записаний Camera Transform і visible test resolution.

Після restart camera framing має відтворитися.

### Diagnostic Texture

Створи source:

```text
Filename: T_G01_ChannelCard_512x256.png
Dimensions: 512×256
Format: RGBA, 8 bit/channel
Pattern: чотири однакові vertical bands — red, green, blue, white
Alpha: centered transparent square 64×64
```

Імпортуй у canonical diagnostic-texture path. Record має містити:

- source path/version;
- actual importer workflow;
- imported dimensions;
- RGB/alpha validation;
- `sRGB`;
- `Compression Settings`;
- `Mip Gen Settings`;
- resource information, якщо доступне;
- verdict.

Не потрібно створювати Material Graph для texture.

### Diagnostic Mesh

Створи у Blender один Cylinder:

```text
Height: 1 m
Diameter: 0.5 m
One object
One UV channel
No bevel/subdivision
Pivot/origin contract: обрати й записати
Export: selected object only
```

Імпортуй як `SM_G01_Cylinder100` або еквівалентну semantic name. Record:

- Blender version;
- source Dimensions і Object Scale;
- exporter format/version/options;
- фактичний UE importer;
- actor Scale `(1,1,1)` під час validation;
- size ratio до reference;
- pivot rotation test;
- normals/faces;
- UV channel;
- geometry information;
- verdict.

Exact FBX/Interchange defaults: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Persistence

Закрий Editor, відкрий assessment project ще раз, відкрий Level і всі imported assets. Збережи reopen evidence.

## Practical scoring, 60

| Критерій | Бали |
|---|---:|
| Project/version safety й independent working copy | 8 |
| Content structure, names і asset retrieval | 10 |
| Test level, references, CameraActor і repeatable framing | 12 |
| Texture source/import/validation record | 10 |
| Mesh source/import/validation record | 10 |
| Persistence, source linkage й reproducibility evidence | 10 |
| **Разом** | **60** |

# Частина 3 — Troubleshooting і performance evidence, 10 балів

## Fault injection

Після збереження clean assessment state створи duplicate map/assets. Не пошкоджуй canonical deliverables.

Якщо день виконання непарний — Variant A; якщо парний — Variant B.

### Variant A

1. Actor fault: imported mesh actor Scale `0.01`.
2. Import fault: texture probe reimported із source без alpha.
3. Organization fault: duplicate Material має weak name і лежить у Maps folder.

### Variant B

1. Actor/level fault: CameraActor зміщений так, що imported station обрізана.
2. Import fault: mesh probe exported з undocumented transform state і дає scale mismatch.
3. Organization fault: assessment Level перейменований із випадковим numeric suffix.

Для кожного створи problem record:

- Expected;
- Observed;
- reproducible steps;
- scope proof;
- hypothesis;
- one change;
- after evidence;
- regression check.

## Baseline

У clean `L_G01_ReviewStage`:

- запиши UE build, mode, resolution, scalability, camera й warm-up;
- виконай 30 s warm-up;
- збери 3 × 10 s `stat unit` samples;
- обчисли median Frame time;
- не перетворюй result на universal budget.

## Scoring, 10

| Критерій | Бали |
|---|---:|
| Три complete troubleshooting records | 6 |
| Repeatable baseline conditions, raw samples, median і limited conclusion | 4 |
| **Разом** | **10** |

# Частина 4 — Self-review, naming і документація, 10 балів

Надай:

1. Migration/safety note: чому assessment project не ризикує course/UE 5.5 originals.
2. Naming audit щонайменше 12 assets/actors.
3. Folder-tree screenshot.
4. Test-stage screenshot із camera framing.
5. Texture й mesh validation screenshots.
6. Короткий self-review:
   - що вдалося без нотаток;
   - де була потрібна офіційна документація;
   - яка одна навичка потребує remediation;
   - що зміниться в повторній спробі.

| Критерій | Бали |
|---|---:|
| Safety/migration note | 2 |
| Naming/path audit | 3 |
| Evidence complete й підписане | 3 |
| Чесний actionable self-review | 2 |
| **Разом** | **10** |

# Rubric зі 100 балів

| Категорія | Максимум | Мінімум 60% |
|---|---:|---:|
| Теоретичний тест | 20 | 12 |
| Практична робота | 60 | 36 |
| Troubleshooting/performance | 10 | 6 |
| Self-review/documentation | 10 | 6 |
| **Разом** | **100** | **80 overall** |

## Performance bands

| Рівень | Опис |
|---|---|
| 90–100 | Незалежний, відтворюваний workflow; evidence повне; причинні пояснення точні |
| 80–89 | Gate пройдено; є дрібні неcritical gaps, але всі category minimums виконані |
| 60–79 | Gate не пройдено; потрібна targeted remediation |
| <60 | Фундамент не відтворюється; блок повторюється з новими source assets |

## Critical fails

Незалежно від total score attempt не зараховується, якщо:

- перетворено/перезаписано єдину UE 5.5 або course backup copy;
- assessment project не відкривається;
- відсутні source files або imported assets неможливо перевірити;
- використано answer file чи покроковий tutorial;
- evidence сфабриковано або warnings навмисно приховано;
- camera/import records не дозволяють повторити результат.

## Remediation і повторна спроба

1. Категорія нижче 60% визначає weak skill.
2. Виконай одну transfer-вправу без повторення того самого source:
   - safety: новий disposable recovery rehearsal;
   - organization: нова set із 12 mixed assets;
   - import: 1024×256 texture + pyramid mesh;
   - debugging: три faults іншого variant;
   - baseline: інша одна workload variable.
3. Повторна спроба використовує інший Variant і нові source assets.
4. Старий score не усереднюється з новим; gate визначає остання complete attempt.

## Критерії завершення `G01`

- total ≥80/100;
- кожна category ≥60%;
- critical fails відсутні;
- Level/assets відкриваються після restart;
- student за 90 секунд знаходить required asset;
- import і baseline можна повторити за records;
- remediation закрита.

Після завершення assessment звір результат із [ключем оцінювання](../EXERCISE_ANSWERS/B01_BLOCK_ASSESSMENT_KEY.md). Ключ не є покроковим tutorial і відкривається тільки після submission snapshot.
