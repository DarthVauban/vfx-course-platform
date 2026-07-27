# Ключ оцінювання B01 — Unreal Engine Foundations

Відкривати лише після збереження submission snapshot. Ключ допомагає оцінити evidence; він не замінює виконаний assessment project.

# 1. Теоретичний тест — 20 балів

Кожна відповідь: 1 бал за правильний висновок, 1 бал за причинне пояснення.

## Q1

- **Backup:** недоторкана точка відновлення, не daily working folder.
- **Migration probe:** disposable copy для перевірки старого проєкту в новішому Engine.
- **Clean sandbox:** незалежний UE 5.8 project для курсу без успадкованих dependencies.

Повні 2 бали — ролі не змішані й пояснено, чому probe не замінює backup.

## Q2

Static Mesh asset зберігається в Content і може мати багато references. `StaticMeshActor` — instance цього asset у конкретному Level із власним Transform. Видалення одного actor не видаляє source asset; видалення asset може порушити всі references.

## Q3

Інформативна назва має:

1. type prefix;
2. semantic purpose;
3. variant лише коли реально існують variants.

Suffix `High`, `Low`, `Fire`, `Alt` виправданий, якщо описує production distinction. `Final`, `_2` або дата не замінюють version control.

## Q4

`Import completed` означає, що UE asset створено. Це не перевіряє dimensions, color/alpha semantics, mips/compression, mesh scale/pivot, normals, UV або correct source association.

## Q5

Між A/B мають бути незмінними або точно записаними:

- map/stage;
- CameraActor Transform і lens/framing;
- visible resolution;
- lighting/exposure state;
- placement;
- Engine build;
- Play/viewport mode;
- scalability;
- warm-up/background state.

Повні 2 бали — щонайменше п’ять умов і пояснення, що інакше comparison confounded.

## Q6

Перший isolated test — встановити тільки actor Scale `(1,1,1)` або створити second instance з Scale 1, не re-exporting source. Якщо symptom зникає, scope instance-level; source/import не змінено.

## Q7

Це підказує level/context dependency: actor, camera, lighting, post process, project/level setting або інший dependency робочої карти. Asset сам по собі не доведений як source cause.

## Q8

Три changes confounded: successful result не показує, яка variable була причинною. Наступний effect не можна виправити на основі такого test. Потрібні три окремі comparisons від одного baseline.

## Q9

```text
FPS ≈ 1000 / 20 = 50
```

Це arithmetic для observed total frame time. Без target hardware, representative build/scene й VFX-specific isolation число не є production budget.

## Q10

Зараховуються будь-які шість із:

- UE build;
- project/map;
- mode;
- resolution;
- scalability;
- camera;
- lighting/exposure;
- warm-up;
- sample count/duration;
- background compile/import state;
- scene workload;
- command/counters.

# 2. Практична робота — 60 балів

## 2.1 Project/version safety — 8

| Evidence | Бали |
|---|---:|
| Окремий `G01_Assessment_58`, correct UE 5.8 build recorded | 3 |
| Course/UE 5.5 backup untouched | 3 |
| Working/source/evidence paths однозначні | 2 |

0 у цій категорії та critical fail — якщо єдиний backup було converted/resaved.

## 2.2 Content structure й naming — 10

| Evidence | Бали |
|---|---:|
| Один project root `/Game/G01` | 1 |
| Maps/Materials/Textures/Meshes/Blueprints/TestAssets розділені | 3 |
| Type prefixes послідовні | 2 |
| Semantic purposes читаються | 2 |
| Немає `Final`, `New`, random suffixes; retrieval test pass | 2 |

Повний бал не вимагає ідентичної вкладеності до course folders, якщо canonical locations однозначні.

## 2.3 Test level і camera — 12

| Evidence | Бали |
|---|---:|
| Floor, scale reference, curved reference, import station | 4 |
| CameraActor охоплює required objects | 2 |
| Camera Transform/lens/framing recorded | 2 |
| Lighting/exposure state recorded | 2 |
| Reopen screenshot збігається | 2 |

Мінус 2–4 бали, якщо framing існує лише у free viewport camera й не відтворюється.

## 2.4 Texture import — 10

| Evidence | Бали |
|---|---:|
| Source 512×256 RGBA й pattern contract | 2 |
| Canonical name/path і source association | 1 |
| Dimensions/RGB/alpha validation | 3 |
| sRGB/compression/mips записані | 2 |
| Resource info/verdict/reopen | 2 |

Не знімай бал лише за конкретне значення `sRGB` без context; оцінюється correct observation і semantic reasoning.

## 2.5 Mesh import — 10

| Evidence | Бали |
|---|---:|
| Blender/source/export record | 2 |
| Один Cylinder, dimensions й UV contract | 2 |
| Actual UE importer записаний | 1 |
| Scale-1 comparison і ratio | 2 |
| Pivot/normals/UV/geometry validation | 2 |
| Verdict/reopen | 1 |

Якщо ratio не 1, але mismatch точно виміряний і не замаскований actor Scale, можна отримати до 9/10. Повний бал потребує resolved або аргументовано accepted contract.

## 2.6 Persistence/reproducibility — 10

| Evidence | Бали |
|---|---:|
| Project і Level відкрилися після restart | 3 |
| Imported assets відкрилися | 2 |
| Source files доступні й однозначні | 2 |
| Після паузи import повторено в disposable project лише за record; optional — те саме повторює інша людина | 3 |

# 3. Troubleshooting і performance — 10 балів

## Variant A expected scope

| Fault | Correct scope | Мінімальний доказ |
|---|---|---|
| Mesh actor Scale `0.01` | Actor instance | Known-good second instance або Scale comparison; one change to 1 |
| Texture source без alpha | Source/import | Canonical texture correct, probe alpha absent, reimport corrected source |
| Weak Material name/path | Organization/asset metadata | Type/purpose audit, Editor rename/move, retrieval/reopen test |

## Variant B expected scope

| Fault | Correct scope | Мінімальний доказ |
|---|---|---|
| CameraActor drift | Level actor | Baseline CameraActor record і restored Transform |
| Undocumented mesh transform | Source/export/import | Source Scale/Dimensions, actor Scale 1, ratio, corrected pair |
| Level numeric suffix | Organization | Canonical name, path, reopen/reference check |

### Scoring troubleshooting — 6

Кожен case — 2 бали:

- 0.5 — observed symptom і reproducible steps;
- 0.5 — scope proof;
- 0.5 — one-change fix;
- 0.5 — after evidence й regression check.

Якщо “fix” змінює кілька variables, максимум 1 бал за case.

### Scoring baseline — 4

| Evidence | Бали |
|---|---:|
| Build/mode/resolution/scalability/camera/warm-up recorded | 1 |
| Три raw `stat unit` samples | 1 |
| Median правильна | 1 |
| Conclusion обмежений test context | 1 |

`INCONCLUSIVE` отримує повний бал, якщо raw data й variation це підтримують.

# 4. Self-review/documentation — 10 балів

| Evidence | Бали |
|---|---:|
| Safety/migration note пояснює roles копій | 2 |
| Audit має ≥12 entries і concrete actions | 3 |
| Screenshots підписані й пов’язані з records | 3 |
| Self-review називає weak skill і конкретну remediation | 2 |

Фрази “все добре” або “треба більше практики” без actionable next task не отримують self-review points.

# 5. Підсумкове рішення

```text
Theory:          __ / 20
Practical:       __ / 60
Troubleshooting: __ / 10
Self-review:     __ / 10
Total:           __ / 100
Critical fail:   Yes / No
```

Gate `G01` пройдено лише коли:

- total ≥80;
- Theory ≥12;
- Practical ≥36;
- Troubleshooting ≥6;
- Self-review ≥6;
- critical fail = No.

# 6. Remediation map

| Weak evidence | Remediation без tutorial | Recheck |
|---|---|---|
| Backup/roles | Новий recovery rehearsal з іншим disposable project | Reopen контрольної карти |
| Asset vs actor | Один mesh asset, 3 actors, delete/duplicate/move audit | Пояснити lifecycle |
| Naming/path | 12 mixed diagnostic assets | Blind retrieval ≥10/12 |
| Texture import | 1024×256 grayscale+alpha card | Full validation record |
| Mesh import | 1 m pyramid з base pivot | Scale/pivot/UV record |
| Camera/test stage | Новий asymmetrical stage | Matching A/B framing |
| Debugging | Три faults іншого Variant | Three complete records |
| Baseline | A/B з іншою single variable | Two repeatable runs |

# 7. Ознаки справжнього mastery

- Student може пояснити, чому зробив setting, а не лише назвати його.
- Warning не зникає з report без diagnosis.
- Imported mismatch не приховується actor Scale.
- Folder convention допомагає blind retrieval.
- Baseline містить raw data й limitations.
- Після restart усе required лишається відтворюваним.
