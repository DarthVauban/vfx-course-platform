# Block Assessment — 02_VFX_DESIGN

## Мета

Контрольна перевіряє, чи можеш ти без покрокового туторіалу:

- етично проаналізувати reference;
- розкласти effect на functional layers;
- побудувати silhouette, value, color і negative-space hierarchy;
- спроєктувати causal timing та motion;
- виконати elemental translation, а не recolor;
- знайти readability/ризики продуктивності і виправити design.

## Час

**2 години 30 хвилин**, уже включені в 5 практичних годин уроку 02.04. Цей assessment не додає годин до 24-годинного бюджету блока.

Рекомендований розподіл:

| Частина | Час |
|---|---:|
| Теоретичний тест | 25 хв |
| Reference breakdown | 30 хв |
| Wind design | 35 хв |
| Timing animatic | 30 хв |
| Ice translation | 20 хв |
| Failure correction, performance notes, самооцінювання | 10 хв |

Якщо потрібна accessibility pause, зупини timer між частинами й зафіксуй фактичний active time.

## Правила

1. Заборонено використовувати покрокові tutorials, lesson solution files або готові design templates.
2. Дозволено користуватися:
   - офіційною документацією;
   - власним glossary;
   - одним аркушем власних коротких нотаток без готових compositions;
   - власними primitive-shape assets.
3. Заборонено:
   - extracted proprietary assets;
   - tracing reference contours;
   - копіювання exact symbols, palettes або timing;
   - отримання готової composition від іншої людини або LLM.
4. LLM можна використати **після** завершення для critique за шаблоном із `03_STUDY_AND_SELF_REVIEW.md`, але response додається до appendix і не замінює власне самооцінювання.
5. Запиши start/end time, використані дозволені матеріали та будь-які interruption.

## Пакет здачі

```text
B02_ASSESSMENT/
├── 01_theory_answers.md
├── 02_source_card.md
├── 03_reference_breakdown.png
├── 04_layer_timeline.png
├── 05_wind_silhouette_value_color.png
├── 06_wind_timing_animatic.mp4_or_gif
├── 07_ice_translation.png
├── 08_readability_tests.png
├── 09_performance_risk_notes.md
└── 10_self_review.md
```

Формат video може бути іншим, якщо real-time playback доступний для перевірки.

# Частина 1 — Теоретичний тест, 20 балів

Кожне питання — 2 бали. Відповідай 1–4 реченнями; де потрібно, покажи calculation.

1. Чим `observation` відрізняється від `inference`? Наведи по одному прикладу для VFX footage.
2. Чому назва «sprite layer» слабша за «короткий contact accent» у layer breakdown?
3. Effect триває 1.25 с, а contact розташований у normalized time `t=0.40`. На якій секунді відбувається contact?
4. Назви дві функції негативного простору у combat effect.
5. Чому різниця лише в hue недостатня для gameplay-critical states?
6. Що таке tangency і як її виправити?
7. Чому відкладений другорядний рух має починатися після cause? Наведи приклад.
8. Чим `overshoot` відрізняється від `settle`?
9. Назви мінімум п’ять structural categories, які треба змінити, щоб elemental translation не була recolor.
10. Назви по дві non-color ознаки, що розрізняють:
    - Wind та Nature;
    - Ice та Earth.

# Частина 2 — Практична контрольна робота, 60 балів

## Creative brief

Third-person anime-style action game для PC/console. Projectile влучає в target на середній gameplay distance. Потрібно створити **оригінальний Wind Impact**, а потім перекласти його в **Ice Impact** без зміни ігрової функції.

Constraints:

- total effect duration: 0.9–1.1 с;
- contact: 0.38–0.48 с;
- target torso має бути видимим після peak;
- maximum 1 primary, 3 secondary groups, 2 accents і 1 residue group;
- спільні camera frame, target point і bounding envelope для Wind/Ice;
- спочатку grayscale, color — останнім;
- жодних proprietary symbols або copied contours;
- implementation у UE/Niagara не потрібна: оцінюється design system.

## Завдання A — Reference breakdown, 12 балів

Вибери короткий impact із офіційного developer/publisher gameplay footage.

Створи:

1. source card з URL, timestamp і usage rule;
2. 8 key observations;
3. 5–8 functional layers;
4. normalized Start/Peak/End;
5. три transferable principles;
6. observation/inference separation;
7. коротку ethics statement.

Не переносити exact shape, timing, palette або symbol у власний design.

## Завдання B — Wind composition, 16 балів

Створи:

1. gameplay sentence;
2. solid-white primary silhouette;
3. negative-space plan;
4. secondary/accent hierarchy;
5. three-value board;
6. color-role board;
7. edge-language notes;
8. `3 invariants / 2 avoid` для Wind.

Wind має читатися через open shape, suction/sweep і delayed air evidence, а не через cyan/green.

## Завдання C — Timing і motion, 16 балів

Створи:

1. normalized phase strip;
2. layer timing chart;
3. position/scale/value curve sketches;
4. minimum 8 key silhouettes;
5. real-time abstract animatic;
6. peak-overlap marker;
7. camera-risk note.

Обов’язково:

- direction до contact;
- staggered peaks;
- щонайменше два delayed secondary responses;
- residue cleanup;
- один justified smear, overshoot або stepped motif.

## Завдання D — Ice translation, 16 балів

Збережи ігрову функцію, camera, target point і bounding envelope. Перебудуй Wind design у Ice, змінивши щонайменше:

- primary shape;
- edge rhythm;
- motion path;
- timing signature;
- spatial behavior;
- residue.

Ice має містити `grow → hold → fracture → settle`. Просто recolor, додавання snowflake icon або заміна particles на shards без зміни timing не зараховується.

Додай `structural-distance audit` і side-by-side grayscale comparison.

# Частина 3 — Усунення проблем і докази продуктивності, 10 балів

Проведи:

1. solid-white silhouette test;
2. grayscale test;
3. 25% thumbnail test;
4. dark/light/warm-busy/cool-busy background tests;
5. nominal і 35° oblique camera schematic;
6. target visibility test;
7. самостійне blind Wind/Ice naming: приховай labels/color, використай neutral filenames, зроби паузу щонайменше на одну навчальну сесію, перемішай порядок і звір результат із прихованим ключем. Optional peer check дозволений лише як додатковий evidence.

Знайди щонайменше два failures, виправ їх і покажи `before/after`.

Для кожного design познач:

- `must keep`;
- `can simplify`;
- `optional`;
- peak-overlap frame;
- potential screen-space, overlap, particle/mesh або residue-duration risks;
- конкретну майбутню profiling action без вигаданих budgets.

# Частина 4 — Self-review і документація, 10 балів

Напиши 250–450 слів:

1. Що має читатися першим під час самостійної blind-перевірки?
2. Який layer можна прибрати без втрати function?
3. Де твоя strongest value/edge hierarchy?
4. Які два failures було виправлено?
5. Чому Ice є translation, а не recolor?
6. Який design має вищий expected cost risk і чому?
7. Що ти зміниш перед implementation?
8. Підтверди, що не використовував extracted/traced proprietary assets.

# Rubric — 100 балів

## Теоретичний тест — 20

| Критерій | Бали |
|---|---:|
| 10 відповідей × 2 | 20 |

За питання:

- 2 — точна відповідь із коректним поясненням;
- 1 — частково правильна, але неповна;
- 0 — неправильна, відсутня або суперечить принципу.

## Практична робота — 60

### A. Reference breakdown — 12

| Критерій | Бали |
|---|---:|
| Source attribution і ethics | 2 |
| Observation/inference separation | 2 |
| Functional layer decomposition | 3 |
| Normalized timing | 2 |
| Transferable principles | 2 |
| Читабельна документація | 1 |

### B. Wind composition — 16

| Критерій | Бали |
|---|---:|
| Primary silhouette і gameplay direction | 4 |
| Negative space і target visibility | 3 |
| Value hierarchy | 3 |
| Color/edge roles | 2 |
| Wind non-color identity | 3 |
| Invariants/avoid | 1 |

### C. Timing і motion — 16

| Критерій | Бали |
|---|---:|
| Phase/layer timing | 4 |
| Direction і contact clarity | 3 |
| Staggered causal secondary motion | 3 |
| Curves/smear/overshoot/stepped rationale | 2 |
| Real-time animatic | 3 |
| Peak/camera notes | 1 |

### D. Ice translation — 16

| Критерій | Бали |
|---|---:|
| 5+ structural categories змінено | 4 |
| Ice grow/hold/fracture/settle | 4 |
| Non-color distinction від Wind | 3 |
| Gameplay function і envelope збережено | 2 |
| Residue/value hierarchy | 2 |
| Structural audit | 1 |

## Troubleshooting і performance — 10

| Критерій | Бали |
|---|---:|
| Повний readability test set | 2 |
| Два реальні failures | 2 |
| Before/after corrections | 2 |
| Must keep/can simplify/optional | 1 |
| Peak-overlap і risk notes | 2 |
| Конкретна майбутня profiling action | 1 |

## Self-review і документація — 10

| Критерій | Бали |
|---|---:|
| Відповіді на всі 8 prompts | 4 |
| Конкретність і evidence | 2 |
| Чесний analysis weakness | 1 |
| Файли/naming/readability | 1 |
| Reference ethics statement | 2 |

# Умови проходження

- Загальний результат: **не менше 80/100**.
- Теорія: не менше 12/20.
- Практика: не менше 36/60.
- Troubleshooting/performance: не менше 6/10.
- Self-review: не менше 6/10.
- Будь-який traced/extracted proprietary asset анулює practical score до повторної здачі.
- Wind та Ice, які відрізняються лише palette/texture/particle count, не можуть отримати понад 8/16 за translation.

# Remediation і повторна спроба

| Слабка категорія | Обов’язкова transfer-вправа |
|---|---|
| Теорія | Переписати неправильні відповіді й навести власний приклад |
| Reference breakdown | Проаналізувати інший 0.5–2.0 с clip і звести layers до 5–8 functions |
| Shape/value/color | Створити три white silhouettes і пройти самостійний blind 25% test після паузи, приховування labels та shuffle |
| Timing/motion | Перебудувати один animatic із contact-first planning і staggered peaks |
| Elemental translation | Перекласти той самий brief у `Earth`, змінивши 5+ categories |
| Troubleshooting | Провести background/camera tests і показати two до й після fixes |
| Self-review | Переписати review з посиланнями на конкретні frames/boards |

Повторна практична спроба використовує інший official reference і `Earth` замість `Ice`, щоб перевірити transfer, а не memorization.

# Mastery gate G02

`G02` пройдено, якщо виконано threshold кожної категорії, пакет повний, Wind/Ice розрізняються без color, а student може усно або письмово пояснити:

```text
reference principle → original composition → causal timing → elemental translation
```

Після цього можна переходити до `03_MATERIAL_FOUNDATIONS`.

[Відкрити ключ лише після зафіксованої здачі](../EXERCISE_ANSWERS/B02_BLOCK_ASSESSMENT_KEY.md)
