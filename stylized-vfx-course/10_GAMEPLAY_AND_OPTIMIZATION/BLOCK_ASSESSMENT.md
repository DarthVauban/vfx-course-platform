# Assessment блока 10 — Gameplay Integration and Scalable Delivery

## Мета

Довести, що великий effect:

- запускається з character gameplay action;
- має правильний world/attached lifecycle;
- синхронізований через sockets/Animation Notifies;
- отримує runtime position/direction/color/scale/target;
- не створює stale/leaked instances;
- має evidence-derived High/Medium/Low variants;
- перевірений на named target hardware/build/scenario;
- презентується без підміни gameplay logic Sequencer-ом.

## Час

**2 години 45 хв.**

Час уже включено до 6.5 годин практики уроку 10.05 і не додається до 40 годин блока.

| Частина | Час |
|---|---:|
| Теорія | 20 хв |
| Gameplay integration audit | 45 хв |
| H/M/L/profile audit | 35 хв |
| Fresh profiling/troubleshooting evidence | 45 хв |
| Self-review, package, submit | 20 хв |
| **Разом** | **165 хв** |

## Правила

- Використай **власний** Big/Hero effect із блока 09–10; готовий third-party effect заборонений.
- Створи assessment copy або version, але не перебудовуй effect із нуля.
- Fresh gameplay і profile captures обов’язкові; старий ledger 10.04 можна використати лише як source hypothesis.
- Під час timer **заборонено використовувати покрокові текстові або відео tutorials**, lesson walkthroughs, exercise solutions і B10 assessment key.
- Дозволені офіційні Epic docs та власний one-page non-step-by-step checklist.
- Не використовуй Beta/Experimental feature як core solution.
- Не вигадуй universal performance budgets або числа, яких немає в capture.
- Порівнюй лише однакові hardware/build/resolution/scenario/camera conditions.
- Sequencer дозволений лише для optional presentation shot після gameplay evidence.
- Після 165 хв зупинися та подай фактичний стан.

## Package

```text
A10_<name>_<date>/
├─ THEORY.md
├─ INTEGRATION/
│  ├─ BP_or_BPC_VFXBridge
│  ├─ CharacterAction_or_Montage
│  ├─ NiagaraSystem_AssessmentCopy
│  └─ NiagaraEffectType
├─ PROFILE_MATRIX.md
├─ PERFORMANCE_EVIDENCE/
│  ├─ 01_protocol.md
│  ├─ 02_niagara_debugger.png
│  ├─ 03_insights_gt_cnc.png
│  ├─ 04_gpu_capture.png
│  ├─ 05_shader_complexity.png
│  ├─ 06_quad_overdraw.png
│  ├─ 07_texture_memory.png
│  ├─ 08_bounds_culling.png
│  └─ 09_before_after.png
├─ TROUBLESHOOTING.md
├─ SELF_REVIEW.md
└─ optional_presentation_capture
```

# Частина 1 — Теорія, 20 балів

Кожна відповідь — 2 бали, 2–4 речення або коротка схема.

1. Чим Niagara System asset відрізняється від NiagaraComponent, і хто володіє runtime lifecycle?
2. Назви призначення та ключову різницю `Spawn System at Location` і `Spawn System Attached`.
3. Чому infinite loop із `Auto Destroy=true` може ніколи не cleanup?
4. Як socket, attach transform rule і Animation Notify разом визначають effect?
5. Навіщо ActionID/re-entry policy для Notify State або повторної ability?
6. Як правильно отримати direction із source/target і чим Position відрізняється від Vector3 direction?
7. Що pooling оптимізує і який stale reset contract потрібен?
8. Які дані дають Niagara Debugger, Unreal Insights та GPU/overdraw tools?
9. Що таке Effect Type/significance і чому thresholds не універсальні?
10. Які layers Low profile повинен зберегти, і чому Sequencer не є gameplay proof?

# Частина 2 — Практична робота, 60 балів

## A. Gameplay integration audit — 35 балів

Інтегруй assessment copy effect у один character action із:

- world one-shot contact або impact;
- attached чи persistent charge, trail або aura;
- correct socket owner і transform intent;
- one-shot Notify та duration/explicit lifecycle window;
- interruption та 5 rapid re-entry requests;
- runtime:
  - position source;
  - normalized direction;
  - color;
  - scale;
  - fixed або live target;
- повний набір parameters до `Activate`;
- policy target loss;
- cleanup owner;
- audit active systems після cooldown.

Exact node/pin/UI behavior: **Потребує ручної перевірки в Unreal Engine 5.8.**

Потрібні такі evidence:

- Blueprint і request schema;
- timeline socket і notifies;
- normal, cancel і re-entry з ігрової камери;
- variants parameters;
- target loss;
- count у Debugger після cooldown.

## B. H/M/L and platform audit — 20 балів

Створи/перевір:

- Effect Type призначено;
- matrix layers signature, core, secondary і optional;
- implementations High, Medium і Low;
- policy significance і culling;
- bounds;
- два named target profiles із metadata hardware, build і resolution;
- representative concurrency;
- readable telegraph, direction і contact у кожному profile.

Відмінності profiles мають посилатися на evidence 10.04 або fresh evidence. Довільне percentage reduction заборонено.

## C. Presentation boundary — 5 балів

Подай:

- gameplay take для H/M/L;
- optional comparison у Sequencer лише після gameplay proof;
- note, що підтверджує відсутність substitute logic spawn, target або lifecycle у Sequencer.

# Частина 3 — Troubleshooting/performance, 10 балів

## Fresh scenario

Виконай один fixed scenario для baseline і comparison після однієї change. Запиши:

- цільове обладнання й платформа;
- build і configuration;
- resolution і profile;
- map і camera;
- instances і spawn rate;
- warm-up і capture window;
- overhead diagnostics.

## Обов’язкові evidence

| Domain | Evidence |
|---|---|
| Workload | count active Systems, active emitters, particle count і memory overview |
| CPU | observations Game Thread і Concurrent Niagara |
| RT/GPU | contribution render thread, GPU simulation і rendering |
| Materials | translucency, `Shader Complexity`, `Quad Overdraw` |
| Textures | dimensions, format, mips і resource-memory evidence |
| Features | observation status і cost mesh, ribbon, collision, light та sorting |
| Visibility | bounds, reason і reaction culling та re-entry |

## Diagnosis fault

Обери один observed або injected fault:

- orphan loop або stale pooled value;
- неправильний socket чи attachment;
- error target space або target loss;
- hotspot overdraw або material;
- дорогий layer collision, light або sorting;
- unsafe bounds або cull reaction.

Запиши:

```text
symptom → hypotheses → ordered tests → root cause → one change → fresh result → visual trade-off
```

`ProfileGPU`, GPU Visualizer, Niagara Debugger та Insights exact UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

# Частина 4 — Self-review, 10 балів

`SELF_REVIEW.md` має містити:

1. Таблицю version, build і hardware.
2. Contract lifecycle, re-entry і target loss.
3. Таблицю trade-offs H/M/L.
4. Таблицю platform і profile.
5. Notes з ігрової камери.
6. Index performance evidence.
7. Найсильніше decision.
8. Найслабший remaining risk.
9. Наступну measured iteration.
10. Підтвердження, що всі Big/Hero effects мають row performance pass, а total у ledger B10 M/S становить 4 години.

# Rubric — 100 балів

## Theory — 20

- 2: mechanism і consequence правильні;
- 1: mechanism частковий або consequence відсутній;
- 0: відповідь неправильна або відсутня.

## Practical A — 35

| Критерій | Бали |
|---|---:|
| Правильний ownership NiagaraComponent і spawn | 4 |
| Правильні sockets і attachment transforms | 4 |
| Timing Notify і lifecycle duration | 4 |
| Interruption, re-entry і cleanup | 5 |
| Correctness position, direction і space | 4 |
| Typed parameters color, scale і target | 4 |
| Target loss і stale reset | 4 |
| Evidence з ігрової камери | 3 |
| Active count після cooldown | 3 |

## Practical B — 20

| Критерій | Бали |
|---|---:|
| Effect Type призначено, policy зрозуміла | 3 |
| Semantic matrix H/M/L | 4 |
| Implementation H/M/L зберігають gameplay | 5 |
| Significance, culling і re-entry | 3 |
| Bounds | 2 |
| Evidence для двох named profiles | 3 |

## Practical C — 5

| Критерій | Бали |
|---|---:|
| Gameplay capture H/M/L | 3 |
| Boundary Sequencer дотримано й задокументовано | 2 |

## Troubleshooting/performance — 10

| Критерій | Бали |
|---|---:|
| Protocol і workload counts | 1.5 |
| Evidence GT і CNC | 1.5 |
| Evidence RT і GPU | 1.5 |
| Translucency, complexity і overdraw | 1.5 |
| Texture memory | 1 |
| Mesh/ribbon/collision/light/sorting | 1 |
| Bounds/culling | 1 |
| Rerun після однієї change, спрямованої на першопричину | 1 |

## Self-review — 10

| Критерій | Бали |
|---|---:|
| Versions, build і hardware | 1 |
| Contract lifecycle і target | 1.5 |
| Trade-offs H/M/L і platform | 2 |
| Gameplay notes | 1 |
| Index evidence | 1 |
| Найсильніше decision | 1 |
| Remaining risk | 1 |
| Наступна measured iteration | 1 |
| Підтвердження big-effect і 4 годин M/S | 0.5 |

# Умови проходження

Одночасно:

- total ≥80/100;
- Theory ≥12/20;
- Practical ≥36/60;
- Troubleshooting/performance ≥6/10;
- Self-review ≥6/10;
- немає critical failure.

Critical failures:

- effect не запускається з gameplay;
- looping або attached effect має leak після owner або cancel;
- contract target або direction invalid;
- Low видаляє essential gameplay telegraph або contact;
- fresh profiling evidence відсутнє;
- claims H/M/L використовують вигадані budgets;
- Sequencer є єдиною integration;
- використання third-party core effect або Beta core dependency не розкрито.

# Слабка remediation не приймається

Не зараховуються як remediation:

- «зменшив particles» без root-cause;
- вимкнув effect або profile повністю;
- збільшив bounds, доки pop не зник;
- додав довільний Delay або Destroy;
- переніс simulation CPU↔GPU без bottleneck evidence;
- зробив Low unreadable;
- навів лише FPS або один screenshot;
- скопіював threshold із tutorial або іншого проєкту.

Valid remediation має:

1. назвати failed item rubric;
2. відтворити fault;
3. визначити першопричину відповідним tool;
4. змінити одну controlled variable або policy;
5. повторити той самий scenario;
6. показати performance і gameplay result.

# Рівні результату й retake

| Score | Результат |
|---|---|
| 95–100 | Production-ready |
| 88–94 | Strong pass |
| 80–87 | Pass із обов’язковим targeted polish до блока 11 |
| 70–79 | Near pass; remediation і retake |
| <70 | Потрібно перебудувати fundamentals integration і profiling |

Якщо будь-який category floor не пройдено, total score не перекриває цю умову.

Для retake:

- виконай focused drill для найслабшої category;
- дочекайся окремої session;
- використай інший action або target path чи variant effect;
- надай fresh captures;
- не використовуй assessment key під час timer.

# Після завершення

Лише після timer відкрий [B10 Block Assessment Key](../EXERCISE_ANSWERS/B10_BLOCK_ASSESSMENT_KEY.md).
