# Рішення до L01-04 — Debugging, iteration і baseline

## EX-L01-04-A — Три симптоми, три scopes

### Case 1 — Actor-level Transform

```text
ID: DBG-ACTOR-01
Map: L_VFX_DebugProbe
Expected: SM_Import_Cube100 збігається за scale station із reference
Observed: imported cube майже не видно
```

Reproduction:

1. Відкрити map.
2. Перейти до recorded CameraActor view.
3. Знайти `Test_SM_Import_Cube100` в Outliner.
4. Symptom повторюється після restart.

Scope proof:

- source asset відкривається у Static Mesh Editor;
- другий actor instance з Scale `(1,1,1)` має expected size;
- affected actor має Scale `(0.01,0.01,0.01)`.

Hypothesis: це instance Transform, не source mesh.

One change:

```text
Test_SM_Import_Cube100.Transform.Scale
(0.01,0.01,0.01) → (1,1,1)
```

After:

- actor visible;
- scale ratio повернувся до L01-03 observation;
- після restart результат збережено;
- source asset, pivot і normals не змінені.

Verdict: `FIXED — actor scope`.

### Case 2 — Level-level camera drift

```text
ID: DBG-LEVEL-01
Expected: framing збігається з L01-03 baseline
Observed: imported station обрізана справа
```

Reproduction: повернення до CameraActor view після restart знову дає неправильний frame.

Scope proof:

- mesh stations мають correct Transforms;
- baseline map із своїм CameraActor показує correct frame;
- CameraActor Transform у debug map не збігається з записом.

Hypothesis: Level instance CameraActor було зміщено.

One change: відновити recorded Transform:

```text
Location: X=-800, Y=0, Z=220
Rotation: Pitch=-12, Yaw=0, Roll=0
```

Якщо в L01-03 було зафіксовано інший approved preset, використовуй його exact values, а не numbers вище.

After:

- screenshot framing збігається;
- asset actor Transforms не змінені;
- restart test pass.

Verdict: `FIXED — level/camera scope`.

### Case 3 — Source/import-level texture mismatch

```text
ID: DBG-IMPORT-01
Asset: T_Import_RGBA_Probe
Expected: 256×256 RGBA quadrants + transparent center circle
Observed: 128×128, alpha fully opaque
```

Scope proof:

- canonical `T_Import_RGBA_256` лишається correct;
- duplicate UE asset посилається на modified probe source;
- Texture Asset Editor показує mismatch dimensions/alpha;
- map/camera не можуть змінити source dimensions.

Hypothesis: reimport взяв source file, що не відповідає contract.

One change: замінити probe source на correct 256×256 RGBA file з тим самим filename/path і виконати `Reimport`.

Не змінювати одночасно `sRGB`, compression або mips.

After:

- dimensions 256×256;
- alpha circle присутній;
- RGB quadrants correct;
- source association записана;
- restart test pass.

Verdict: `FIXED — source/import scope`.

### Чому ця diagnosis правильна

Кожен case має independent known-good comparison:

- другий actor для instance;
- baseline map/camera для level;
- canonical texture для source/import.

Тому one-change fix підтверджує hypothesis, а не просто корелює з випадковим результатом.

### Неправильні рішення

- Re-export mesh для actor Scale issue.
- Перемістити всі stage actors, щоб компенсувати camera drift.
- Змінити texture compression, dimensions і alpha одночасно.
- Не перевірити restart.
- Видалити probe до before evidence.

### Final regression checklist

- canonical `L_VFX_Test` не змінено;
- CameraActor baseline відтворюється;
- canonical texture contract intact;
- imported mesh scale/pivot record intact;
- усі three records мають exact one change;
- warnings не приховані.

### Performance note

Debug maps і probes не використовуються для final benchmark. Asset editors, reimport і compile activity мають завершитися до capture.

## EX-L01-04-B — Repeatable baseline report

### Protocol

```text
UE build: фактичний UE 5.8 build
Map A: L_VFX_Baseline
Map B: L_VFX_Baseline_50Actors
Mode: один і той самий Editor viewport або PIE mode
Resolution: одна й та сама visible resolution
Scalability: один і той самий preset
Camera: recorded CameraActor
Warm-up: 30 seconds
Samples: 3 per map
Duration: 10 seconds per sample
Command: stat unit
Background import/compile: none observed
```

Map B відрізняється лише 50 additional static mesh actors, що використовують той самий reference mesh/material. Lights, camera й stage не змінюються.

### Приклад завершеного звіту

Числа нижче демонструють calculation format. Вони не є очікуваним результатом і не замінюють власні measurements.

#### Run 1

| Scene | Sample 1 Frame ms | Sample 2 | Sample 3 | Sorted | Median |
|---|---:|---:|---:|---|---:|
| A | 8.2 | 10.1 | 8.6 | 8.2, 8.6, 10.1 | 8.6 |
| B | 9.0 | 9.2 | 9.1 | 9.0, 9.1, 9.2 | 9.1 |

```text
Relative change = (9.1 - 8.6) / 8.6 × 100
                ≈ 5.81%
```

#### Run 2

| Scene | Sample 1 Frame ms | Sample 2 | Sample 3 | Sorted | Median |
|---|---:|---:|---:|---|---:|
| A | 8.4 | 8.6 | 8.5 | 8.4, 8.5, 8.6 | 8.5 |
| B | 9.3 | 9.0 | 9.1 | 9.0, 9.1, 9.3 | 9.1 |

```text
Relative change = (9.1 - 8.5) / 8.5 × 100
                ≈ 7.06%
```

### Обмежений правильний висновок

```text
У двох runs Scene B мала median total observed Frame time 9.1 ms,
тоді як Scene A — 8.6 та 8.5 ms.
У записаних Editor conditions workload variant B корелює з вищим
total frame time. Цей test не ізолює cost одного actor, не визначає
PC/console budget і не доводить, що різниця належить конкретно GPU.
```

Якщо власні medians змінюють порядок між runs або difference менша за run-to-run variation, правильний verdict:

```text
INCONCLUSIVE — потрібні довший capture, representative build
і більш спеціалізований profiler.
```

### Чому це працює

- raw samples збережені;
- median не приховує один spike;
- A/B мають одну variable;
- другий run перевіряє session/order noise;
- висновок не виходить за context.

### Допустимі альтернативи

- B може відрізнятися viewport resolution, якщо actor count незмінний і exact resolution записана.
- Можна використати 25 actors, якщо 50 створюють незручний scene layout.
- П’ять samples краще показують variation, якщо час дозволяє.

Не змішуй дві alternatives: actor count і resolution не змінюються одночасно.

### Неправильні рішення

- Показати лише найкращий A і найгірший B screenshot.
- Пересунути CameraActor між scenes.
- Не повторити warm-up після відкриття B.
- Додати 50 actors з різними Materials/Lights.
- Сказати “кожен cube коштує 0.01 ms” шляхом простого ділення total difference.
- Назвати Editor capture console-бюджет продуктивності.

### Verification

- conditions table complete;
- A/B differ by one documented variable;
- кожна scene має raw samples;
- median calculation checked;
- run 2 виконаний;
- order/cache caveat зазначений;
- verdict `MEASURABLE`, `NO CLEAR DIFFERENCE` або `INCONCLUSIVE`;
- stats overlay вимкнений після test;
- fault-injection maps не змішані з baseline.

### Performance note

`stat unit` дає orientation. Для VFX-specific diagnosis надалі потрібні Niagara Debugger, `ProfileGPU`/GPU tools, Shader Complexity, Quad Overdraw та Unreal Insights у representative build. Exact UE 5.8 UI для цих інструментів: **Потребує ручної перевірки в Unreal Engine 5.8.**
