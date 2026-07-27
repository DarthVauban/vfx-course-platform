# 1. Назва

## Урок 10.04 — Evidence-driven CPU/GPU profiling та cost ledger

# 2. Результат уроку

Після уроку ти зможеш:

- сформулювати performance question до відкриття profiler;
- записати target hardware, build, resolution, scenario і camera path;
- отримати baseline та повторити той самий test після однієї зміни;
- використати Niagara Debugger для active systems, emitters, particles, memory і bounds;
- розрізняти Niagara Game Thread (`GT`) та Concurrent/worker (`CNC`) timers;
- знаходити Niagara work у Unreal Insights;
- пояснити `GPU Emitter Dispatch [RT]` і renderer preparation costs;
- відкрити `ProfileGPU`/GPU Visualizer і відрізнити simulation від rendering;
- застосувати `Shader Complexity` та `Quad Overdraw` як diagnostic views, а не millisecond budget;
- перевірити texture memory/resource evidence;
- окремо оцінити sprite, mesh, ribbon, collision, light, sorting, bounds і culling costs;
- врахувати overhead profiling tools;
- створити optimization ledger «baseline → hypothesis → one change → result → quality»;
- виконати performance pass для кожного великого effect;
- зафіксувати 4 години M/S shader/overdraw optimization practice.

Ключовий deliverable — `L10_BIG_EFFECT_PERFORMANCE_LEDGER.md` з Niagara Debugger, Insights, GPU, view-mode та texture evidence.

# 3. Орієнтовний час

**8 годин: 2 години теорії та 6 годин практики.**

| Частина | T | P | M/S | Час |
|---|---:|---:|---:|---:|
| Bottleneck, baseline та measurement theory | 1 год | — | — | 1 год |
| Niagara/render/material cost theory | 1 год | — | — | 1 год |
| Baseline scenario + Niagara Debugger | — | 45 хв | — | 45 хв |
| Unreal Insights CPU capture | — | 45 хв | — | 45 хв |
| GPU Visualizer + Shader Complexity/Quad Overdraw | — | 1 год 30 хв | 1 год 30 хв | 1 год 30 хв |
| Material, texture й overdraw optimization ledger | — | 2 год 30 хв | 2 год 30 хв | 2 год 30 хв |
| Exercises/evidence reconciliation | — | 30 хв | — | 30 хв |
| **Разом** | **2 год** | **6 год** | **4 год** | **8 год** |

**M/S ledger блока 10: 4 години виконуються саме в цьому уроці.**

# 4. Prerequisites

- Завершено 10.03.
- Є reusable gameplay scenario з repeatable spawn request.
- Є щонайменше один великий multi-layer effect із блока 09.
- Є gameplay level, а не лише Niagara preview.
- Відомі target platform/hardware candidates і target resolution.
- Можна запустити representative Development або project-approved profiling build.
- Core workflow не використовує Beta/Experimental feature.

# 5. Нові терміни

| Термін | Пояснення |
|---|---|
| **Baseline** | Повторюваний вимір до зміни |
| **Representative scenario** | Scene/camera/count/timing, подібні до реального gameplay |
| **Bottleneck** | resource або path, що обмежує frame у конкретному scenario |
| **GT** | робота Game Thread |
| **CNC** | concurrent або worker work Niagara |
| **RT** | робота Render Thread для preparation і dispatch |
| **GPU simulation** | Particle Spawn, Update і Simulation Stages, виконані на GPU |
| **GPU rendering** | pixel, vertex, raster і blend work для visible renderers |
| **Inclusive time** | timer разом із його children |
| **Exclusive time** | timer без child time |
| **Overdraw** | один screen pixel проходить shading або blending кілька разів |
| **Quad overdraw** | зайва робота від sprite quads і coverage, особливо transparent empty regions |
| **Resource size** | runtime-oriented indicator texture memory, залежний від platform і format |
| **Optimization ledger** | ланцюг evidence до і після зміни |
| **Diagnostic overhead** | cost самих HUD, trace, named events, GPU readback і capture |

# 6. Навіщо ця тема потрібна VFX artist

Optimization без measurement часто погіршує art і не змінює bottleneck.

Приклади:

- зменшили particles, але дорогий full-screen translucent material лишився;
- перенесли CPU emitter на GPU, хоча GPU уже є bottleneck;
- зменшили texture до 512, але кількість system instances спричиняє GT spikes;
- вимкнули collision, хоча light renderer/shadows домінують;
- збільшені bounds припинили popping, але effect майже ніколи не проходить culling.

Senior VFX artist доводить:

```text
де cost → чому це hypothesis → що саме змінено → що вимір змінив → що сталося з readability
```

# 7. Теорія простими словами

Frame — конвеєр. CPU готує gameplay/simulation/render commands; GPU simulates some particles and draws pixels. Якщо GPU зайнята, зменшення GT work може не підняти framerate в цьому scenario. Якщо GT bottleneck, cheaper shader alone може не усунути spike.

Порядок:

1. зафіксувати test;
2. знайти bottleneck;
3. знайти effect contribution;
4. змінити одну річ;
5. повторити test;
6. порівняти performance і visual quality;
7. прийняти або відхилити change;
8. повторити на іншому target profile.

Жодний `ms`, particle count, instance count або texture size не є універсальним budget. Budget належить конкретним hardware/build/scenario/frame targets.

# 8. Детальні технічні пояснення

## 8.1 Metadata test

Кожний capture має:

```text
Date/commit/content version
Hardware: CPU/GPU/RAM
Platform/OS
Build target/configuration
Editor/PIE/standalone/packaged
Resolution/screen percentage
Scalability/profile
Map/scene
Camera path
Effect asset/version
Spawn count/rate
Warm-up/capture duration
Diagnostics enabled
Background load
```

Без metadata числовий результат неможливо відтворити.

## 8.2 Baseline scenarios

Для великого effect мінімум:

1. **Single hero:** одна instance біля camera.
2. **Gameplay typical:** реальна очікувана concurrency.
3. **Stress:** задокументований upper scenario, а не фантазійний infinity.
4. **Off-screen/culling:** effect поза view/range.
5. **Re-entry burst:** кілька spawn у короткий час.

Camera path і timing test мають бути repeatable.

## 8.3 Niagara Debugger

Epic документує:

- `Tools > Debug > Niagara Debugger`;
- Debug HUD;
- FX Outliner;
- Performance tools;
- overview для total systems, scalability, active emitters, particles і memory;
- per-system active state, Effect Type, bounds і cull reason;
- counts emitters і particles.

Рекомендований перший capture:

```text
System Filter = target asset family
System Debug Verbosity = Basic/Verbose лише за потреби
System Emitter Verbosity = Basic/Verbose
System Show Bounds = on for bounds pass
```

Exact location/options: **Потребує ручної перевірки в Unreal Engine 5.8.**

Debugger дає evidence того, **що є active**, але не фінальний clean timing. GPU particle readback і display per-particle attributes додають latency, memory і work; вимкни їх для clean capture.

## 8.4 Game Thread Niagara timers

Офіційний guide із measurement наводить:

- `Niagara Manager Tick [GT]`;
- `System Simulation Tick [GT]`;
- `System Instance Tick [GT]` для solo cases;
- `System Instance WaitForAsyncTick [GT]`;
- `Niagara Manager Update Scalability Managers [GT]`;
- `Activate (GT)`;
- `System Activate [GT]`.

Інтерпретація:

- багато systems або activation bursts можуть впливати на GT;
- waiting timer може означати completion dependency або worker, а не лише чисту simulation;
- evaluation scalability також потребує роботи.

## 8.5 Concurrent Niagara timers

Офіційний guide наводить:

- `FNiagaraSystemSimulationTickConcurrentTask`;
- `System Simulation Tick [CNC]`;
- `System Instance Tick [CNC]`;
- `Emitter Tick [CNC]`;
- `Emitter Simulate [CNC]`;
- `Emitter Spawn [CNC]`;
- `Emitter Event Handling [CNC]`.

Не додавай overlapping inclusive timers parent і child так, ніби вони незалежні.

## 8.6 Render Thread and GPU simulation

Релевантні офіційні categories:

- `Compute Dispatch (GPU Emitter Dispatch [RT])`;
- `Get Dynamic Mesh Elements`;
- transfer data CPU→GPU для CPU emitters;
- tasks sorting і culling для renderer visibility або mesh index;
- додаткові mesh batches для per-particle mesh LODs.

GPU simulation може виконуватися на різних stages залежно від depth або distance-field dependencies. Дешева simulation усе одно може render дорогі translucent pixels.

## 8.7 Unreal Insights

Використовуй representative gameplay capture, бажано в approved packaged або standalone build.

Робочий процес:

1. запиши metadata;
2. зроби capture window scenario;
3. знайди frame spikes і steady region;
4. перевір Niagara timers GT, CNC і RT;
5. фільтруй за asset name, коли доступні named events;
6. порівнюй average, percentile або window, а не один зручний frame;
7. повтори clean capture.

Epic попереджає, що `-StatNamedEvents` додає overhead. Використай named capture, щоб знайти assets, а потім зроби capture без нього для representative timing.

Exact trace launch/channels/Timing Insights UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.8 GPU Visualizer / `ProfileGPU`

Використовуй для перевірки GPU passes і contributions. Записуй:

- resolution і profile;
- scene;
- effect on/off або A/B;
- passes, пов’язані з translucency, lights, post effects та Niagara compute або render;
- variability frame або window.

`ProfileGPU`, GPU Visualizer labels and available events depend on RHI/build/platform. **Потребує ручної перевірки в Unreal Engine 5.8.**

Не віднімай два unrelated frames. Використовуй controlled toggle, ідентичну camera і кілька samples.

## 8.9 Shader Complexity

`Shader Complexity` візуалізує relative pixel shader cost і overdraw як diagnostic. Це не універсальна шкала milliseconds.

Використовуй:

- однакові view і camera;
- спочатку isolated effect, потім full scene;
- material до і після зміни;
- screenshots разом із GPU capture.

Color legend/threshold configuration: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.10 Quad Overdraw

Великі soft sprite cards виконують shading transparent або low-opacity regions у overlapping quads.

Приблизний pressure:

```text
робота pixel ∝ coverage screen × overlap layers × робота shader × кількість views
```

Зменшуй через:

- щільнішу silhouette texture або mesh;
- меншу кількість sprites і менше overlap;
- меншу coverage screen;
- видалення redundant layers;
- дешевшу material branch;
- profile-aware scaling для spawn.

## 8.11 Texture memory

Для кожної використаної texture запиши:

- dimensions;
- intent format і compression;
- mip chain;
- LOD group і streaming behavior;
- indicator resource size;
- кількість unique textures у effect;
- чи всі packed channels використовуються;
- evidence residency, якщо доступне.

File size на disk не дорівнює runtime texture memory. Fields і tools Texture Asset Editor: **Потребує ручної перевірки в Unreal Engine 5.8.**

## 8.12 Checklist cost за feature

### Sprite

- count;
- screen area;
- transparent padding;
- material instructions і texture samples;
- sorting;
- кілька renderers.

### Mesh

- vertices і triangles mesh;
- кількість mesh batches і renderers;
- per-particle LOD;
- shadows;
- зайві asset data collision, distance field або UV;
- material і overdraw.

### Ribbon

- particles і segments;
- tessellation;
- width і screen coverage;
- material;
- update source і sorting.

### Collision

- CPU scene queries або GPU path depth чи distance field;
- кількість colliding particles;
- update frequency;
- complexity response.

### Light

- count і radius;
- overlap;
- shadowing;
- interaction із translucency;
- impact на screen і scene.

### Sorting

- вимкнено, якщо немає visual need;
- memory cost для task та index;
- path CPU або GPU залежить від configuration.

### Bounds/culling

- надто малі: popping або disappearance;
- надто великі: effect довше лишається relevant або visible;
- dynamic bounds: cost update;
- fixed bounds: часто дешевші, але можуть бути надмірно широкими.

Кожен вибір потребує visual і profiling evidence.

## 8.13 Big-effect ledger

Переліч усі effects проєкту, класифіковані як `Big/Hero`:

```text
Effect ID
Gameplay role
Scenario
H/M/L status
Active systems/particles
GT/CNC/RT observations
GPU observations
Shader Complexity/Quad Overdraw
Texture memory
Mesh/ribbon/collision/light/sorting
Bounds/culling
Change tested
Result
Readability impact
Next action
```

Жоден big effect не можна позначити complete без performance pass.

# 9. Візуальні або математичні приклади

## Приклад evidence row

```text
Scenario: 4 одночасні ultimates, gameplay camera, target console dev build
Baseline observation: GPU-bound; великі overlapping core sprites домінують у view
Hypothesis: redundant full-screen translucent layer
Change: вимкнути лише secondary core renderer
Result: GPU capture покращується у повтореному window; GT без змін
Quality: silhouette і telegraph збережено, brightness скориговано у дешевшому layer
Decision: прийняти для Medium; зберегти High лише якщо його profile проходить перевірку
```

Це приклад format, а не універсальні numbers.

## Particle/system distinction

```text
1000 particles in 1 system ≠ 1000 particles across 100 systems
```

Робота per-system, per-emitter, activation і scalability відрізняється.

## A/B rule

```text
Δ = measured_after - measured_before
```

`Δ` має сенс лише тоді, коли metadata і scenario збігаються, а tool overhead є порівнюваним.

# 10. Controlled experiments

## Experiment A — system count

За приблизно однакової total кількості particles порівняй:

- менше system instances;
- більше system instances.

Порівняй trade-off для GT, scalability і culling.

## Experiment B — render-only toggle

Вимкни один renderer, не змінюючи simulation. Порівняй Shader Complexity, Quad Overdraw і GPU capture.

## Experiment C — simulation-only change

Зменш або вимкни одну дорогу feature collision чи update, зберігаючи renderer і material. Порівняй CNC, GPU simulation і visual behavior.

## Experiment D — sorting

Перемикай sorting у case, де різниця в image є видимою або неважливою. Зроби capture cost і artifacts.

## Experiment E — bounds

Перевір надто малі, tight valid і надмірно великі bounds під час руху camera. Запиши popping і behavior active або relevance.

## Experiment F — diagnostic overhead

Зроби capture:

- verbose HUD із particle attributes і GPU readback;
- clean run.

Задокументуй, чому diagnostic capture потрібен для inspection, але не для final timing.

# 11. Покрокова guided practice

## A. Створи protocol test

Заповни `L10_PROFILE_PROTOCOL.md`:

```text
Question
Hardware/platform
Build
Resolution
Scalability
Map
Camera path
Spawn script
Warm-up
Capture window
Tools
Diagnostics overhead
Acceptance/readability constraint
```

Приклад питання: «Який layer домінує у GPU cost, коли чотири instances перекриваються?»

## B. Baseline gameplay scene

Використай `BPC_VFXGameplayBridge`, щоб детерміновано запустити:

- одну hero instance;
- expected concurrency;
- stress concurrency;
- off-screen або cull path.

Не використовуй лише Niagara preview.

## C. Niagara Debugger evidence

Зафіксуй:

- total і filtered systems;
- active emitters;
- particle counts;
- memory overview;
- bounds;
- culled state і reason;
- active count після cooldown.

Вимкни verbose і per-particle GPU readback для timing pass.

## D. Unreal Insights

1. Зроби capture representative scenario.
2. Знайди Niagara Manager GT.
3. Перевір System Simulation GT і CNC.
4. Знайди роботу Emitter Spawn, Simulate та Event.
5. Перевір activation spike.
6. Запиши роботу RT і GPU, пов’язану з dispatch, де вона видима.
7. За потреби повтори named і clean capture.

Exact workflow: **Потребує ручної перевірки в Unreal Engine 5.8.**

## E. GPU/render evidence

1. Запусти approved path `ProfileGPU` або GPU Visualizer.
2. Зроби capture effect on/off або toggles одного layer.
3. Збережи `Shader Complexity`.
4. Збережи `Quad Overdraw`.
5. Знайди overlap у screen space.
6. Не виводь точні GPU ms із color view mode.

## F. Texture ledger

Для кожної texture у big effect запиши:

```text
Asset
Semantic
Dimensions
Format/compression
Mips/streaming
Resource evidence
Channels used
Duplicate/reuse opportunity
Visual risk of reduction
```

## G. Feature isolation

Перемикай по одній feature за раз:

- sprite layer;
- mesh renderer;
- ribbon;
- collision;
- light;
- sorting;
- material expensive branch;
- WPO/distortion;
- bounds/culling setting.

Запиши, який domain profiler змінився.

## H. Four-hour M/S optimization pass

### 1.5 год — view modes і GPU material baseline

- Shader Complexity;
- Quad Overdraw;
- GPU capture;
- ізолюй translucent layers.

### 2.5 год — iterations material, texture і overdraw

Для щонайменше двох iterations:

1. сформулюй hypothesis;
2. внеси одну change material, texture або coverage;
3. виконай compile і save;
4. повтори run із тією самою camera;
5. збережи view-mode і GPU evidence;
6. виконай readability check;
7. прийми або відхили change.

Запиши фактичні start/end і total 4 години у `MS_OPTIMIZATION_LEDGER_B10.md`.

## I. Every big effect pass

Для кожного Big/Hero effect із блока 09:

- виконай щонайменше single run і run з representative concurrency;
- заповни всі categories ledger;
- внеси одну change, підкріплену evidence, або задокументуй, чому change не виправдана;
- познач результат як `Pass`, `Conditional` або `Fail`;
- перенеси actions зі статусами failed або conditional у 10.05.

# 12. Точні назви nodes, modules і settings

- `Niagara Debugger`
- `Debug HUD`
- `FX Outliner`
- `Performance`
- `System Show Bounds`
- `System Debug Verbosity`
- `System Emitter Verbosity`
- `Enable GPU Readback`
- `Niagara Manager Tick [GT]`
- `System Simulation Tick [GT]`
- `System Simulation Tick [CNC]`
- `Emitter Tick [CNC]`
- `Emitter Simulate [CNC]`
- `Emitter Spawn [CNC]`
- `Emitter Event Handling [CNC]`
- `GPU Emitter Dispatch [RT]`
- `Get Dynamic Mesh Elements`
- `Unreal Insights`
- `Timing Insights`
- `-StatNamedEvents`
- `ProfileGPU`
- `GPU Visualizer`
- `Shader Complexity`
- `Quad Overdraw`
- `Texture Asset Editor`
- `Resource Size` як очікуваний concept
- `stat unit`
- `stat gpu`

Availability/labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

# 13. Стартові значення параметрів

Універсальних budgets немає. Нижче стартовий **protocol**, а не performance target:

| Item protocol | Стартове значення |
|---|---|
| Warm-up | послідовний задокументований interval |
| Capture | повторюваний representative window |
| Samples | щонайменше кілька comparable runs |
| Scenario A | 1 hero instance |
| Scenario B | expected concurrency |
| Scenario C | задокументована stress concurrency |
| Resolution | resolution target profile |
| Diagnostics | named або verbose discovery і clean timing |
| Change count | одна variable на кожне comparison |
| M/S practice | 4 години, записані у ledger |

# 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат |
|---|---|
| Protocol | repeatable metadata |
| Debugger | правильна картина active systems, particles і bounds |
| Insights | contribution GT і CNC знайдено |
| GPU | evidence render і simulation passes |
| Complexity | regions із високим screen cost видимі |
| Texture ledger | memory candidates відомі |
| Feature isolation | dominant layer або feature визначено |
| Change | response domain profiler відповідає hypothesis |
| Quality | gameplay readability збережено й задокументовано |
| Big-effect ledger | немає hero effect без profiling |

# 15. Самостійна вправа

## EX-L10-04-A — Baseline-to-proof optimization

**Завдання:** обери один великий effect, знайди bottleneck/contributor і доведи одну accepted optimization.

**Обмеження:**

- gameplay scene;
- metadata заповнено;
- evidence з Niagara Debugger, Insights, GPU і view modes;
- одна variable на кожне A/B;
- ledger texture, renderer і feature;
- clean capture після diagnostics;
- немає заяви про universal budget.

**Deliverables:**

- protocol;
- captures baseline;
- hypothesis;
- capture після однієї change;
- visual comparison;
- рішення accepted або rejected;
- row у ledger.

**Acceptance criteria:**

- scenario repeatable;
- GT, CNC, RT і GPU розрізнено;
- active systems і particles записано;
- evidence shader і overdraw присутнє;
- texture memory перевірено;
- change впливає на передбачений domain;
- judgement readability сформульовано явно.

# 16. Додаткова складніша вправа

## EX-L10-04-B — CPU-bound vs GPU-bound differential

**Завдання:** створи два controlled variants — simulation/instance-heavy і render/overdraw-heavy — та визнач кожен за evidence, без здогадок.

**Обмеження:**

- однакові camera, build і hardware;
- у кожному variant змінено лише одну dominant axis;
- overhead diagnostics задокументовано;
- перевір mesh, ribbon, collision, light, sorting і bounds;
- не роби висновок лише за FPS.

**Deliverables:**

- два variants;
- captures Insights, GPU і view modes;
- feature-cost matrix;
- correction для кожного;
- пояснення, чому протилежна correction була б слабкою.

**Acceptance criteria:**

- CPU variant підтверджено evidence GT і CNC;
- GPU variant підтверджено evidence GPU і overdraw;
- tools узгоджуються або discrepancy пояснено;
- corrections спрямовано на root contributor;
- clean rerun підтверджує результат.

# 17. Три рівні підказок

## EX-L10-04-A

- **Hint 1:** постав одне конкретне питання замість «чи це optimized?».
- **Hint 2:** Debugger показує, що є active; Insights і GPU tools показують, де виникають time та work; view modes показують coverage і complexity.
- **Hint 3:** зафіксуй scenario → baseline → ізолюй один layer → зміни одну variable → повтори всі релевантні captures → оціни visuals.

[Повне рішення EX-L10-04-A](../EXERCISE_ANSWERS/L10-04_cpu_gpu_profiling_and_cost_budgets_answers.md#ex-l10-04-a)

## EX-L10-04-B

- **Hint 1:** сам particle count не розрізняє CPU, GPU і render bottleneck.
- **Hint 2:** збільш instances, collision або update для CPU candidate; збільш translucent coverage або material layers для GPU candidate.
- **Hint 3:** використай GT/CNC timers для першого case, ProfileGPU разом із Shader Complexity і Quad Overdraw — для другого; потім застосуй controls на протилежній axis, щоб довести causality.

[Повне рішення EX-L10-04-B](../EXERCISE_ANSWERS/L10-04_cpu_gpu_profiling_and_cost_budgets_answers.md#ex-l10-04-b)

# 18. Типові помилки

| Помилка | Чому неправильно |
|---|---|
| Profiling виконано лише у Niagara preview | gameplay scenario не є representative |
| Порівняно різні cameras | screen coverage змінюється |
| Використано лише FPS | contributor thread або pass приховано |
| Використано лише один frame | capture може містити noise або spike |
| Inclusive timers підсумовано | виникає double count |
| Timing named events прийнято за clean truth | instrumentation має overhead |
| Color Shader Complexity прирівняно до ms | diagnostic не є прямим timing |
| Particles зменшено до пошуку cost | проблему material або instances можна пропустити |
| Universal budget table | ігнорує hardware, build і scenario |
| Немає quality check | optimization може зламати gameplay readability |

# 19. Troubleshooting

## Captures не узгоджуються

Перевір metadata, camera, warm-up, background load, diagnostics і sample window. Визнач, чи tools вимірюють різні domains.

## Asset name відсутнє в Insights

Використай discovery capture з відповідними named events і trace configuration, врахуй overhead, а потім зроби clean capture. **Потребує ручної перевірки в Unreal Engine 5.8.**

## Count у Debugger здається надмірним

Перевір filters, active-only і culling display, pooling та inactive states, а також різницю між counts system, emitter і particle.

## GPU capture сильно коливається

Зафіксуй camera, resolution, profile і scene; повтори samples; уникай transitions editor UI, compilation і streaming.

## Complexity покращується, але GPU — ні

Можливо, bottleneck міститься в simulation, іншому pass, bandwidth, lights або frame variance. Complexity view є diagnostic; перевір GPU capture.

## Виправлення bounds погіршує relevance

Звузь bounds до повного motion range, порівняй fixed і dynamic та перевір culling уздовж camera path.

# 20. Performance considerations

Увесь цей урок присвячено виміряному performance:

- count active systems важливий разом із particles;
- count emitters має fixed overhead;
- GPU simulation усе одно містить CPU work system і emitter;
- mesh, ribbon, light, collision або sorting можуть домінувати;
- translucent screen coverage може домінувати навіть за малої кількості particles;
- texture memory і streaming можуть бути окремим constraint;
- великі bounds послаблюють culling, а малі спричиняють popping;
- pooling працює лише з allocation і GC;
- overhead profiler та debugger треба прибрати з clean capture;
- усі висновки обмежені конкретними target hardware, build і scenario.

# 21. Запитання для самоперевірки

1. Які metadata потрібні capture?
2. Чим Niagara Debugger відрізняється від Unreal Insights?
3. Що означають GT і CNC Niagara timers?
4. Чому inclusive timers не можна просто сумувати?
5. Що показує `ProfileGPU`?
6. Чому Shader Complexity не є ms budget?
7. Від чого зростає translucent pixel work?
8. Який overhead має `-StatNamedEvents`/GPU readback?
9. Чому particle count недостатній?
10. Що має містити optimization ledger?

# 22. Відповіді

1. Потрібні hardware і platform, build, resolution, profile, scene і camera, counts, timing, tools та їхній overhead.
2. Debugger показує active Niagara state, counts і bounds; Insights показує CPU timing у межах frame.
3. GT означає роботу Game Thread, а CNC — concurrent worker work.
4. Inclusive time parent уже містить time його children.
5. Це evidence GPU passes і contributions у конкретних frame та scenario.
6. Це qualitative і relative diagnostic, а не прямий universal time.
7. Її визначають screen coverage × overlap × shader work × кількість views.
8. Named events додають trace overhead; GPU readback додає latency, memory і work.
9. Cost змінюють systems, emitters, simulation target, renderer, material, coverage і features.
10. Ledger містить baseline, hypothesis, одну change, result, visual quality, decision і metadata.

# 23. Self-check checklist

- [ ] Protocol завершено.
- [ ] Target hardware, build і scenario записано.
- [ ] Cases single, typical, stress і cull виконано.
- [ ] Debugger показує systems, particles, memory і bounds.
- [ ] Evidence Insights для GT і CNC збережено.
- [ ] Evidence RT і GPU збережено.
- [ ] ProfileGPU або GPU Visualizer використано.
- [ ] Shader Complexity збережено.
- [ ] Quad Overdraw збережено.
- [ ] Texture ledger заповнено.
- [ ] Checks mesh, ribbon, collision, light і sorting виконано.
- [ ] Checks bounds і culling виконано.
- [ ] A/B змінює одну variable.
- [ ] Clean capture після diagnostics виконано.
- [ ] Visual readability перевірено.
- [ ] Кожен big effect має performance pass.
- [ ] 4 години M/S записано.
- [ ] Універсальний budget не вигадано.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. measurement є repeatable;
2. domains CPU, GPU і render розрізнено;
3. contributor ізольовано;
4. change має відповідне evidence;
5. quality trade-off сформульовано явно;
6. усі Big/Hero effects мають rows у ledger;
7. evidence 4 годин M/S повне;
8. EX-L10-04-A проходить щонайменше 6 із 7 критеріїв.

# 25. Підсумок

Optimization — не список магічних limits. Це controlled experiment на target hardware/build/scenario. Niagara Debugger описує активний workload, Insights — CPU path, GPU tools — render/compute, view modes — material/coverage symptoms, а ledger пов’язує change з доказом і gameplay quality.

# 26. Зв’язок із наступними уроками

У 10.05 evidence перетвориться на Effect Type, significance/culling та H/M/L platform profiles. Thresholds і profile differences походять із цього ledger, не з довільних presets.

# 27. Офіційні джерела

- Epic Games. [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara).
- Epic Games. [Niagara Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-debugger-for-unreal-engine).
- Epic Games. [Unreal Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine).
- Epic Games. [Trace Quick Start Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/trace-quick-start-guide-in-unreal-engine).
- Epic Games. [Stat Commands](https://dev.epicgames.com/documentation/en-us/unreal-engine/stat-commands-in-unreal-engine).
- Epic Games. [Introduction to Performance Profiling and Configuration](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine).
- Epic Games. [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara).
- Epic Games. [Texture Asset Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-asset-editor-in-unreal-engine).

# 28. Рекомендовані скриншоти або схеми

```text
1. Card metadata profiling protocol.
2. Filtered overview Niagara Debugger із systems, emitters, particles і memory.
3. Порівняння bounds і cull reason.
4. Tree timers GT і CNC в Unreal Insights.
5. Effect on/off у GPU Visualizer.
6. Shader Complexity до і після.
7. Quad Overdraw до і після.
8. Ledger texture resources.
9. Matrix isolation features.
10. Ledger Baseline→hypothesis→change→result→quality.
```
