# 1. L01-04 — Цикл ітерації, діагностика й baseline продуктивності

| Поле | Значення |
|---|---|
| Блок | `01_UE_FOUNDATIONS` |
| Lesson ID | `L01-04` |
| Цільова версія | Unreal Engine 5.8 |
| Артефакт уроку | `L_VFX_Baseline`, три завершені troubleshooting records і повторюваний `stat unit` baseline |
| Mastery gate | Студент відтворює проблему, звужує scope, змінює одну змінну, підтверджує fix і повторює performance capture за тим самим protocol |

## 2. Результат уроку

Після уроку студент:

- використовує iteration loop `hypothesis → one change → test → evidence → decision`;
- перетворює нечіткий symptom на reproducible case;
- відрізняє project, level, asset, actor-instance та source-file problem;
- створює minimal reproduction без руйнування working map;
- проводить базове вимірювання frame time через `stat unit`;
- порівнює A/B scenes за однакових camera, resolution, warm-up і capture conditions;
- не видає Editor fluctuation за універсальний PC/console budget.

Доказ: три problem records мають before/fix/after evidence; baseline table містить щонайменше три samples для A і B, median, test conditions і обмежений висновок.

## 3. Орієнтовний час

| Частина | Години | Практика |
|---|---:|---:|
| Ментальна модель iteration/debugging | 0.5 | 0 |
| Performance baseline terminology | 0.5 | 0 |
| Controlled experiments | 0.5 | 0.5 |
| Guided troubleshooting | 0.75 | 0.75 |
| Baseline capture | 0.5 | 0.5 |
| Самостійна transfer-вправа й самооцінювання | 0.25 | 0.25 |
| `BLOCK_ASSESSMENT.md` | 3.0 | 3.0 |
| **Разом** | **6.0** | **5.0 (83.3%)** |

Час `BLOCK_ASSESSMENT.md` включено в практичний бюджет цього уроку, як визначено в `01_COURSE_MAP.md`. Перед assessment виконай одну з двох transfer-вправ; другу використовуй для remediation або spaced repetition.

## 4. Prerequisites

| Потрібна навичка або asset | Де отримано | Як перевірити |
|---|---|---|
| Safety copy й журнал | [L01-01](01_course_setup_and_ue58_workflow.md) | Working copy відрізняється від backup |
| Canonical paths і naming | [L01-02](02_editor_navigation_and_asset_workflow.md) | Diagnostic assets знаходяться за ≤90 секунд |
| Test level і camera station | [L01-03](03_vfx_test_level_and_import_pipeline.md) | `L_VFX_Test` відтворює baseline frame |
| Imported texture/mesh records | [L01-03](03_vfx_test_level_and_import_pipeline.md) | Є source/importer/verdict |

## 5. Нові терміни

| Англійський термін | Українське пояснення | Практичний приклад | Glossary |
|---|---|---|---|
| Symptom | Спостережуваний прояв, а не пояснення причини | “Imported cube у 100 разів менший за reference” | [Symptom](../02_GLOSSARY.md#symptom) |
| Hypothesis | Перевірюване припущення про причину | “Actor Scale приховує source mismatch” | [Hypothesis](../02_GLOSSARY.md#hypothesis) |
| Reproduction | Послідовність, що стабільно викликає symptom | Open map → camera view → select actor | [Reproduction](../02_GLOSSARY.md#reproduction) |
| Minimal reproduction | Найменший case, де проблема лишається | Окрема карта з одним mesh | [Minimal reproduction](../02_GLOSSARY.md#minimal-reproduction) |
| Regression | Повернення проблеми або поява нової після fix | Pivot fixed, але scale зламаний | [Regression](../02_GLOSSARY.md#regression) |
| Baseline | Контрольне вимірювання за записаних умов | Median `stat unit` у `L_VFX_Baseline` | [Baseline](../02_GLOSSARY.md#baseline) |
| Frame time | Час одного frame у milliseconds | 16.67 ms відповідає приблизно 60 fps | [Frame time](../02_GLOSSARY.md#frame-time) |
| Bottleneck | Частина frame, яка найбільше обмежує результат | Game, Draw або GPU time | [Bottleneck](../02_GLOSSARY.md#bottleneck) |
| Median | Середнє за порядком значення, стійкіше до одного spike | Median із 8.2, 8.6, 10.1 = 8.6 | [Median](../02_GLOSSARY.md#median) |

## 6. Навіщо ця тема потрібна VFX-фахівцю

VFX artist постійно працює у системі з багатьма причинами одного symptom. “Ефект зник” може означати:

- system не spawned;
- emitter не spawns particles;
- material invisible;
- actor або component має неправильний scale;
- bounds culled;
- camera не дивиться на effect;
- asset не той;
- quality/scalability state інший.

Без disciplined loop artist змінює п’ять settings і випадково отримує картинку, але не знає, що саме спрацювало. Такий fix не переноситься на інший effect. Debugging record перетворює випадкове везіння на reusable knowledge.

Performance baseline потрібен з тієї самої причини: без контрольних умов два числа не можна порівняти.

## 7. Теорія простими словами

### Debugging — це звуження області

Почни не з “який setting покрутити?”, а з питань:

1. Чи відтворюється symptom після restart?
2. Чи є він в іншій карті?
3. Чи є він в іншому actor instance того самого asset?
4. Чи є він у duplicate asset?
5. Чи пов’язаний він із source file/reimport?

Кожна відповідь відкидає частину причин.

### Один test — одна змінна

Якщо одночасно змінити mesh source scale, FBX option та actor Scale, successful result не пояснює причину. Натомість:

```text
Baseline → змінити actor Scale → test
Baseline → змінити source transform → reimport → test
Baseline → змінити importer option → reimport → test
```

### Frame time важливіший за голий FPS

```text
FPS ≈ 1000 / frame_time_ms
```

- 16.67 ms ≈ 60 fps;
- 33.33 ms ≈ 30 fps.

Це математична конверсія, не VFX budget. Frame time у Editor містить не лише effect cost. `stat unit` допомагає побачити broad CPU/render/GPU timing, але не замінює Unreal Insights, GPU profiling і console target tests у блоці 10.

## 8. Детальні технічні пояснення

### Problem record contract

```text
ID:
Build / project / map:
Expected:
Observed:
Reproduction:
Scope:
Evidence before:
Hypothesis:
One change:
Result:
Evidence after:
Regression check:
Decision / next action:
```

Не записуй “не працює”. Записуй visible state: “`Test_SM_Import_Cube100` не видно з CameraActor; Outliner actor enabled; Transform Scale=(0.01,0.01,0.01)”.

### Scope ladder

| Scope | Test | Якщо symptom лишився |
|---|---|---|
| Session | Restart Editor | Це не transient viewport state |
| Map | Відкрити minimal test map | Причина не лише в production map |
| Actor instance | Створити другий instance | Можливо, asset-level issue |
| Asset | Duplicate або known-good asset | Можливо, source/import issue |
| Source | Re-export/reimport controlled file | Можливо, source contract |
| Project | Clean sandbox comparison | Можливо, project setting/plugin |

### Baseline protocol

1. Одна й та сама UE build і project.
2. Одна й та сама map.
3. CameraActor view.
4. Однаковий Play/viewport mode.
5. Однаковий visible resolution і scalability state.
6. 30 seconds warm-up після відкриття/play.
7. Не capture під час compile/import/background activity.
8. Три samples по 10 seconds.
9. Запис median, не тільки найкращого числа.
10. A/B відрізняються однією variable.

Exact console access, `stat unit` overlay layout, `stat gpu` availability і profiler UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Як читати broad timings

`stat unit` традиційно показує frame та broad Game/Draw/GPU timings. Назви, composition і availability можуть залежати від build/configuration. Не роби висновок “VFX GPU-bound” лише тому, що GPU number найбільший у порожній сцені. У цьому уроці числа описують test environment.

## 9. Візуальні або математичні приклади

### Debug decision flow

```text
Symptom
  ↓
Reproduce after restart?
  ├─ No → transient/session state; record and retest
  └─ Yes
      ↓
Minimal map?
  ├─ No → level/context dependency
  └─ Yes
      ↓
Known-good instance?
  ├─ Works → instance setting
  └─ Fails → asset/source/project scope
```

### Median example

| Sample | Frame ms |
|---:|---:|
| 1 | 8.2 |
| 2 | 10.1 |
| 3 | 8.6 |

Sorted values: `8.2, 8.6, 10.1`; median = `8.6 ms`.

Approximate conversion:

```text
1000 / 8.6 ≈ 116.3 fps
```

Не звітуй `116.3 fps` як target-platform promise: це лише arithmetic для конкретного capture.

### Relative difference

```text
Relative change (%) = (B_ms - A_ms) / A_ms × 100
```

Якщо A=8.0 ms, B=8.8 ms:

```text
(8.8 - 8.0) / 8.0 × 100 = 10%
```

Це 10% зміна total observed frame time в test conditions, не “цей mesh коштує 0.8 ms” без глибшого profiling.

## 10. Controlled experiments

### CE-L01-04-01 — One-change proof

1. У copy `L_VFX_DebugProbe` встанови `Test_SM_Import_Cube100` Scale `(0.01,0.01,0.01)`.
2. З CameraActor запиши symptom.
3. Перевір Outliner visibility й asset existence.
4. Сформулюй hypothesis: instance Transform.
5. Зміни тільки Scale на `(1,1,1)`.
6. Зроби after screenshot і restart test.
7. **Очікувано:** fix пояснюється однією зміною.

### CE-L01-04-02 — Baseline A/B

- A: `L_VFX_Baseline` із базовим stage.
- B: duplicate map із 25 додатковими instances reference Cube, однаковий mesh/material, без руху lights/camera.
- Зроби по три samples за protocol.
- **Очікування:** результат hardware-dependent; допустимо, якщо difference мала або в межах noise.
- **Мета:** не довести, що “25 cubes дорогі”, а довести, що protocol дозволяє повторити comparison.

### CE-L01-04-03 — False correlation

- Під час active import або shader compilation подивись `stat unit`.
- Не використовуй ці числа як sample.
- Дочекайся завершення background work і повтори.
- **Висновок:** timestamp/context важливіші за один screenshot числа.

## 11. Покрокова керована практика

### GP-L01-04 — Від symptom до baseline

1. **Дублюй `L_VFX_Test` як `L_VFX_DebugProbe` і `L_VFX_Baseline`.**  
   Production-like source map не використовується для fault injection.

2. **Створи record `DBG-01` для wrong actor Scale.**  
   Внеси fault `(0.01,0.01,0.01)` тільки в `L_VFX_DebugProbe`; закрий і відкрий map; запиши symptom.

3. **Звузь scope.**  
   Перевір actor visibility, correct mesh asset, Transform і second known-good instance. Не змінюй source mesh.

4. **Виправ одну змінну.**  
   Поверни Scale `(1,1,1)`, зроби after screenshot, restart map і запиши regression check.

5. **Створи `DBG-02` для camera drift.**  
   Зміни CameraActor Transform у debug map, але не дивись у записаний preset під час первинної diagnosis. Symptom: framing не збігається з baseline screenshot.

6. **Порівняй Transform із L01-03 record і віднови exact preset.**  
   **Перевірка:** overlay/screenshot framing знову збігається.

7. **Створи `DBG-03` для texture source mismatch.**  
   У копії source texture зміни dimensions або alpha contract; reimport only diagnostic duplicate `T_Import_RGBA_Probe`, не canonical source.

8. **Перевір source filename, dimensions і alpha.**  
   Виправ source duplicate, reimport і запиши after state. Не змінюй `sRGB`, compression і mips одночасно.

9. **Підготуй `L_VFX_Baseline`.**  
   Поверни camera, stage й imported assets у verified state. Закрий зайві asset editors.

10. **Запиши test conditions.**

| Condition | Value |
|---|---|
| UE build | фактичний build |
| Map | `L_VFX_Baseline` |
| Mode | Editor viewport / PIE — один конкретний |
| Resolution | фактична видима resolution |
| Scalability | фактичний preset |
| Camera | recorded CameraActor |
| Warm-up | 30 s |
| Sample | 3 × 10 s |

11. **Увімкни `stat unit`.**  
    Точний спосіб відкриття console та overlay position: **Потребує ручної перевірки в Unreal Engine 5.8.**

12. **Збери A samples.**  
    Не пересувай camera й не взаємодій зі сценою. Запиши Frame/Game/Draw/GPU fields, які фактично показує build.

13. **Створи B map із 25 додатковими cube actors.**  
    Використай той самий source asset і material; рівномірно розмісти поза overlap; не додавай lights.

14. **Повтори warm-up і три samples.**

15. **Обчисли median та relative difference.**  
    Якщо values сильно коливаються, verdict — `INCONCLUSIVE`, а не вибір найзручнішого sample.

16. **Вимкни stats overlay і збережи results.**  
    Не лишай diagnostic changes у `L_VFX_Test`.

17. **Склади block readiness note.**  
    Познач, які skills готові до independent assessment, а які потребують repeat.

## 12. Точні назви вузлів, модулів і налаштувань UE

Material Graph і Niagara stack не створюються.

| ID | Точна назва | Тип | Роль |
|---|---|---|---|
| PERF01 | `stat unit` | Console stat command | Broad frame/Game/Draw/GPU timing |
| PERF02 | `stat gpu` | Console stat command | Broad GPU stats, якщо доступні |
| UI01 | `Play In Editor (PIE)` | Editor play mode | Gameplay-like Editor test context |
| UI02 | `Output Log` | Editor panel | Повідомлення й command entry у деяких workflows |
| UI03 | `Message Log` | Editor panel | Import/asset/editor diagnostics |
| UI04 | `Transform` | Actor property group | Instance Location/Rotation/Scale |
| UI05 | `Reimport` | Asset action | Controlled source update |

Exact menu paths, output fields, keyboard shortcuts і counters у build 5.8.x: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 13. Стартові значення параметрів

| ID | Parameter | Start | Low/high test | Ефект |
|---|---|---|---|---|
| P01 | Warm-up | 30 s | 0 / 60 s | 0 s сильніше залежить від startup activity |
| P02 | Sample count | 3 | 1 / 5 | 1 не показує variation; 5 дає кращий distribution, але довше |
| P03 | Sample duration | 10 s | 2 / 30 s | Короткий sample чутливий до spikes |
| P04 | A extra actors | 0 | — | Baseline scene |
| P05 | B extra actors | 25 | 10 / 50 | Змінює scene workload; результат вимірюється |
| P06 | Debug actor Scale | 0.01 fault → 1.0 fix | 0 / 100 | 0 робить degenerate transform; 100 маскує unit issue |
| P07 | Camera Transform | L01-03 preset | будь-яка зміна | Змінює screen coverage/framing |
| P08 | Pass threshold | Repeatable protocol | — | Немає універсального ms threshold у foundation block |

## 14. Очікуваний результат кожного етапу

| Етап | Очікувано | Перевірка |
|---|---|---|
| Reproduction | Symptom повторюється після restart | Recorded steps |
| Scope | Причина звужена до instance/camera/source | Known-good comparison |
| One-change fix | Symptom зникає після однієї зміни | Before/after |
| Regression | Інші verified properties не зламані | Reopen й checklist |
| Baseline A | 3 valid samples | No background work |
| Baseline B | 3 samples у same conditions | Only actor count differs |
| Decision | `MEASURABLE`, `NO CLEAR DIFFERENCE` або `INCONCLUSIVE` | Median + variation |

## 15. Самостійна вправа

### EX-L01-04-A — Три симптоми, три scopes

У duplicate maps/assets створи й потім діагностуй:

1. Actor-level: imported mesh має неправильний Transform.
2. Level-level: CameraActor не відповідає recorded station.
3. Source/import-level: diagnostic texture duplicate не відповідає dimensions/alpha contract.

Для кожного заповни full problem record і зроби regression check.

**Обмеження:** одна зміна за test; canonical source assets не пошкоджувати; не використовувати повне рішення до власної diagnosis.

**Acceptance criteria:** кожен record містить reproducible symptom, scope proof, one-change fix та after evidence.

## 16. Додаткова складніша вправа

### EX-L01-04-B — Repeatable baseline report

Порівняй:

- A: clean `L_VFX_Baseline`;
- B: та сама map із 50 additional static mesh actors або іншою однією чітко визначеною variable.

Збери два незалежні runs у різний час session, кожен по 3 samples. Порівняй medians і variation.

**Acceptance criteria:** усі conditions записані; два runs можна зіставити; висновок не приписує всю різницю VFX без доказу; невизначений result чесно позначений.

## 17. Три рівні підказок

### EX-L01-04-A

<details>
<summary>Підказка 1 — напрямок мислення</summary>

Для кожного symptom спочатку доведи scope: instance, map чи source. Не починай із fix.
</details>

<details>
<summary>Підказка 2 — потрібні інструменти</summary>

Дублікат map/asset, перезапуск, Outliner, Details/Transform, запис CameraActor, Texture Asset Editor, source filename, Reimport і screenshots до/після.
</details>

<details>
<summary>Підказка 3 — майже повна структура</summary>

Expected → Observed → reproduction after restart → known-good comparison → scope → hypothesis → one change → after evidence → reopen → regression checklist.
</details>

**Повне рішення:** [EX-L01-04-A](../EXERCISE_ANSWERS/L01-04_debugging_iteration_and_performance_baseline_answers.md#ex-l01-04-a)

### EX-L01-04-B

<details>
<summary>Підказка 1 — напрямок мислення</summary>

Головний deliverable — не “краще число”, а protocol, який дає зіставні numbers.
</details>

<details>
<summary>Підказка 2 — потрібні інструменти</summary>

CameraActor, fixed mode/resolution/scalability, warm-up, `stat unit`, 3 samples, median, relative-change formula, session notes.
</details>

<details>
<summary>Підказка 3 — майже повна структура</summary>

Record conditions → warm A → capture A1–A3 → change one variable → warm B → capture B1–B3 → sort and median → repeat second run → compare variation → limited conclusion.
</details>

**Повне рішення:** [EX-L01-04-B](../EXERCISE_ANSWERS/L01-04_debugging_iteration_and_performance_baseline_answers.md#ex-l01-04-b)

## 18. Типові помилки

| Помилка | Прояв | Причина | Попередження |
|---|---|---|---|
| Fix до reproduction | “Здається, вже працює” | Симптом не зафіксовано | Restart і steps first |
| П’ять changes разом | Немає known cause | Panic tweaking | One-change log |
| Найкращий sample обрано вручну | Report надто оптимістичний | Confirmation bias | Median й усі raw samples |
| A/B мають різні cameras | Screen workload різний | Free viewport navigation | CameraActor |
| Capture під час compile/import | Spikes приписано scene | Background work | Warm-up й activity check |
| FPS порівнюють лінійно | 30→60 трактують як ті самі ms, що 60→90 | Нелінійність FPS | Порівнювати milliseconds |
| Editor baseline називають console budget | Хибна production гарантія | Context не записаний | Build/mode/platform label |

## 19. Troubleshooting

| Симптом | Діагностичний тест | Причина | Виправлення | Перевірка |
|---|---|---|---|---|
| `stat unit` не видно | Перевір command entry й build mode | Console/overlay disabled або command не виконано | Звірити official Stat Commands і current build | Overlay fields visible |
| GPU field zero/absent | Перевір renderer/build/config | Counter unavailable або not representative | Не вигадувати value; записати unavailable, використати later GPU tools | Report чесно позначає gap |
| Samples стрибають | Повторити після idle/warm-up | Background work, editor interaction | Закрити asset editors, стабілізувати conditions | Variation зменшилась або verdict inconclusive |
| B швидша за A | Повторити order B→A | Cache/noise/order effect | Другий independent run, median | Conclusion враховує order |
| Problem зникає в minimal map | Порівняти level actors/settings | Context dependency | Додавати dependencies по одній | Знайдено мінімальний trigger |
| Fix ламає інший asset | Reopen known-good case | Regression/shared source | Відкотити й локалізувати change | Обидва cases pass |
| Texture fault не змінюється після reimport | Перевір source path/time | Reimport не того file/asset | Correct source association | Dimensions/alpha відповідають contract |

## 20. Performance considerations

- Baseline має сенс лише разом із build, mode, resolution, scalability, camera, warm-up і scene.
- `stat unit` є broad orientation, не повний VFX profiler.
- Editor overhead, Slate, background compilation і asset editors можуть впливати на numbers.
- GPU/CPU times можуть overlap; їх не слід механічно додавати як незалежні costs.
- 25 або 50 actors — workload probe, не recommended budget.
- Для PC/console рішення потрібні representative build, target hardware, Niagara Debugger, GPU profiling та Unreal Insights у блоці 10.
- Якщо різниця менша за run-to-run variation, verdict — `NO CLEAR DIFFERENCE` або `INCONCLUSIVE`.
- Збережи raw data; screenshots без таблиці не дають перевірити median.

## 21. Запитання для самоперевірки

1. Чим symptom відрізняється від hypothesis?
2. Навіщо problem має відтворюватися після restart?
3. Що доводить minimal reproduction?
4. Чому змінюють лише одну variable?
5. Як обчислити приблизний FPS із frame time?
6. Чому median трьох samples краща за вибір найкращого?
7. Які умови обов’язково записати для baseline?
8. Що означає result `INCONCLUSIVE`?
9. Чому найбільше число в `stat unit` ще не доводить VFX bottleneck?
10. Що таке regression check?

## 22. Відповіді на запитання

1. Symptom — спостереження; hypothesis — перевірюване пояснення причини.
2. Щоб відкинути transient selection, viewport або session state.
3. Найменший context, у якому trigger лишається; він звужує dependencies.
4. Інакше неможливо встановити причинний зв’язок між change і result.
5. `FPS ≈ 1000 / frame_time_ms`.
6. Median менше залежить від одного spike або випадково доброго sample.
7. Build, map, mode, resolution, scalability, camera, warm-up, sample duration/count і background state.
8. Variation/noise не дозволяє зробити надійний висновок; це валідний результат, а не провал.
9. Scene й Editor мають багато systems; broad field не ізолює конкретний effect.
10. Перевірка, що fix не повернув symptom після restart і не зламав previously working behavior.

## 23. Self-check checklist

- [ ] Кожен із трьох symptoms має reproduction steps.
- [ ] Scope доведений known-good comparison.
- [ ] Кожен fix змінює одну variable.
- [ ] Є before й after evidence.
- [ ] Regression check виконаний після restart.
- [ ] Baseline conditions повні.
- [ ] Для A і B є щонайменше 3 raw samples.
- [ ] Median обчислена правильно.
- [ ] Висновок не виходить за межі test conditions.
- [ ] Canonical `L_VFX_Test` не містить fault injections.

## 24. Mastery criteria

Урок і gate `G01` готові до assessment, якщо:

- студент без tutorial локалізує instance, level і source/import faults;
- усі three problem records мають causal one-change fix;
- baseline повторено у двох runs або variation чесно класифіковано;
- formula frame time/FPS і median пояснені;
- правильні щонайменше 9 із 10 відповідей;
- `L_VFX_Test`, assets, journal і backup лишаються у verified state.

## 25. Підсумок

- Debugging починається з observation і reproduction.
- Scope звужується від session до source/project.
- Один test змінює одну variable.
- Fix завершується regression check.
- Performance number без conditions не є baseline.
- Median і raw samples важливіші за найкращий screenshot.

## 26. Зв’язок із наступними уроками

| Наступний етап | Що буде повторно використано | Що зберегти |
|---|---|---|
| [Block Assessment](BLOCK_ASSESSMENT.md) | Safety, navigation, import, troubleshooting, baseline | Усі records і canonical maps |
| Блок 02 | Fixed camera і screen coverage observations | `L_VFX_Test` |
| Блок 03 | One-change preview/debug loop | Diagnostic texture |
| Блок 07–10 | Baseline protocol, але з Niagara-specific tools | Raw A/B table й conditions |

## 27. Офіційні джерела

- `PERF-07` — [Introduction to Performance Profiling and Configuration](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine), Epic Games, UE 5.8.
- `PERF-08` — [Stat Commands](https://dev.epicgames.com/documentation/en-us/unreal-engine/stat-commands-in-unreal-engine), Epic Games, UE 5.8.
- `PERF-06` — [Unreal Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine), Epic Games, UE 5.8 — orientation only; full workflow у блоці 10.
- `ASSET-02` — [Texture Asset Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-asset-editor-in-unreal-engine), Epic Games, UE 5.8.
- `MC-16`, `MC-17`, `MC-18` — manual-check registry у [SOURCES.md](../SOURCES.md), доступ 2026-07-27.

## 28. Перелік рекомендованих скриншотів або схем

**Рекомендований скриншот 1 — problem before/fix/after**  
Що відкрити: `L_VFX_DebugProbe`.  
Що повинно бути видно: tiny mesh before і Scale 1 after.  
Яку область виділити: actor у viewport та Transform.

**Рекомендований скриншот 2 — minimal reproduction**  
Що відкрити: debug map з одним affected actor і reference.  
Що повинно бути видно: відсутність unrelated actors.  
Яку область виділити: Outliner і symptom.

**Рекомендований скриншот 3 — `stat unit` baseline**  
Що відкрити: `L_VFX_Baseline` з CameraActor.  
Що повинно бути видно: overlay fields і fixed scene.  
Яку область виділити: overlay та назвна тестовій мапі; не обрізати context повністю.

**Рекомендований скриншот 4 — A/B report**  
Що відкрити: raw samples table.  
Що повинно бути видно: conditions, three samples, median, verdict.  
Яку область виділити: raw values і conclusion.

**Рекомендована схема**  
Що показати: `Symptom → Reproduce → Scope → Hypothesis → One change → Verify → Regression`.  
Що повинно бути видно: loop повертається до hypothesis, якщо result не підтверджено.
