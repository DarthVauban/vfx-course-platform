# Ключ до Block Assessment — 02_VFX_DESIGN

Відкривай тільки після завершення й фіксації власної здачі. Ключ містить:

- точні відповіді на theory;
- повний model solution практичної роботи;
- правила самостійного scoring;
- приклади acceptable alternatives;
- критерії remediation.

Model solution використовує синтетичний description замість конкретного proprietary footage. Твій reference breakdown оцінюється за evidence і структурою, а не за збігом із model shapes.

# 1. Теоретичний тест — відповіді

## Питання 1

`Observation` — те, що безпосередньо видно: «bright accent з’являється в contact frame». `Inference` — припущення про причину або implementation: «accent, імовірно, є camera-facing sprite». Observation не потребує знання graph; inference треба позначити confidence.

**2 бали:** правильна різниця й два релевантні приклади.  
**1 бал:** різниця правильна, але приклад один або нечіткий.

## Питання 2

«Sprite layer» описує можливий renderer, а не роль. «Короткий contact accent» описує функцію, timing і gameplay message; його можна реалізувати Sprite, Mesh або іншим способом.

## Питання 3

```text
1.25 × 0.40 = 0.50 с
```

Contact відбувається на 0.50 секунди.

## Питання 4

Будь-які дві:

- захищає target/character/UI від occlusion;
- відокремлює primary і secondary groups;
- створює directional lane;
- запобігає tangency;
- дає internal opening для readable silhouette;
- зменшує clutter без додавання layers.

## Питання 5

Hue може втратитися у grayscale, змінити contrast на іншому background або бути недостатнім для різного сприйняття. Gameplay-critical states повинні також відрізнятися shape, value, timing, edge, motion чи space.

## Питання 6

Tangency — небажане довге або точкове торкання contours, яке зливає shapes. Виправлення: offset, angle, scale, negative-space gap, value separation або зміна silhouette.

## Питання 7

Secondary response має наслідувати cause, щоб motion був causal. Наприклад radial impact ring починається після contact, debris — після fracture, ribbon — слідом за weapon. Якщо secondary стартує раніше без anticipation reason, event здається випадковим.

## Питання 8

Overshoot — коротке перевищення final target, наприклад scale 1.12. Settle — корекція після overshoot до stable value, наприклад 1.12→0.97→1.00.

## Питання 9

Мінімум п’ять із:

- primary shape;
- edge rhythm;
- motion path/acceleration;
- timing signature;
- spatial behavior;
- residue;
- value distribution.

Color сам по собі structural category не замінює.

## Питання 10

**Wind / Nature:**

- Wind — open crescents/lanes, suction→sweep→trail.
- Nature — branching growth, unfold/bloom→seed drift.

**Ice / Earth:**

- Ice — ordered facets, grow→hold→fracture.
- Earth — low wide blocks, compress→blunt impulse→gravity settle/dust.

По 1 балу за правильну пару distinctions для Wind/Nature та Ice/Earth.

# 2. Model solution — Reference breakdown, 12 балів

## 2.1. Synthetic reference description

Тридцятикадровий target-centered impact:

- narrow directional shape наближається зліва;
- contact frame має compact accent;
- open crescent response рухається вперед і вгору;
- two delayed wisps повторюють path;
- sparse particles лишаються після primary.

## 2.2. Observation/inference

```text
OBS: primary path іде left→right.
OBS: contact accent є найкоротшим bright layer.
OBS: response має open center.
OBS: two wisps lag behind primary.
OBS: target torso стає видимим до late residue.
INF-M: primary може бути ribbon або animated mesh.
INF-L: wisps можуть бути separate emitters.
UNK: simulation type, materials, exact particle count.
```

## 2.3. Functional layers

| ID | Function | Start/Peak/End |
|---|---|---|
| P1 | Directional travel/contact path | 0.16/0.39/0.53 |
| A1 | Contact confirmation | 0.37/0.41/0.45 |
| S1 | Open outward response | 0.40/0.52/0.70 |
| S2 | Delayed follow-through wisps | 0.44/0.61/0.86 |
| R1 | Low-value proof/cleanup | 0.62/0.78/1.00 |

## 2.4. Transferable principles

1. Direction читається до contact.
2. Open center захищає target.
3. Accent коротший за response.
4. Delayed wisps підсилюють follow-through, але не визначають primary.

## 2.5. Ethics

```text
Власний design не переносить exact contour, palette, timing або symbol.
Assets не витягувалися й не trace-илися.
Reference використано тільки для functional/temporal principles.
```

### Scoring notes

- Якщо actual source card повний, але layer table називає лише renderer types: максимум 1/3 за decomposition.
- Якщо inference не позначено: максимум 1/2 за observation/inference.
- Якщо principles є «використати blue glow»: 0/2.
- Інший layer count допустимий у межах 5–8 за чітких functions.

# 3. Model solution — Wind composition, 16 балів

## 3.1. Gameplay sentence

> «Projectile contact створює open forward-upward air sweep; target point чіткий, а torso знову видимий одразу після peak».

## 3.2. Silhouette

Primary:

- один tapered open crescent;
- wide leading third, narrow trailing end;
- central gap займає приблизно 35% envelope;
- axis нахилений 20° вгору;
- crescent проходить позаду/навколо target marker, а не закриває його solid mass.

Secondary:

- two narrow S-wisps;
- one small contact pressure arc;
- sparse dust/mote group як residue.

Accent:

- small thin edge at contact, не full radial flash.

## 3.3. Negative-space plan

- Open center навколо target torso.
- Clear lane попереду crescent показує direction.
- S-wisps не торкаються leading edge.
- Contact accent не перекриває face/center mass.

## 3.4. Three-value plan

```text
Background: 20%
Primary crescent: 56%
Leading pressure edge: 84%
Secondary wisps: 42%
Contact accent: 94%
Residue motes: 26%
Target silhouette: 38%
```

## 3.5. Color roles

Model:

- dominant — low-chroma cool neutral/cyan;
- supporting — darker desaturated cool;
- accent — near-white pale neutral;
- environmental dust — context color, lower value.

Wind identity зберігається, якщо hues поміняти.

## 3.6. Edge language

- leading edge crisp;
- inner crescent medium;
- trailing edge broken/soft;
- wisps soft at end;
- accent локально найчіткіший.

## 3.7. Invariants / avoid

```text
Invariants:
1. Open directional shape.
2. Suction or counter-motion before sweep.
3. Delayed trailing air evidence.

Avoid:
1. Closed heavy filled mass.
2. Rigid hold→fracture rhythm.
```

### Scoring notes

- Хороший alternate wind може бути spiral/orbit, якщо open lanes і suction/sweep зберігаються.
- Cyan color без open/motion grammar: максимум 1/3 за Wind identity.
- Target перекритий на nominal camera: максимум 1/3 за negative space до revision.

# 4. Model solution — Timing і motion, 16 балів

## 4.1. Duration

`1.0 с`, contact `0.43 с`.

## 4.2. Phase strip

| Phase | Start | End |
|---|---:|---:|
| Suction anticipation | 0.04 | 0.20 |
| Activation | 0.15 | 0.28 |
| Main sweep | 0.19 | 0.46 |
| Contact | 0.40 | 0.46 |
| Curl/response | 0.43 | 0.68 |
| Dissipation | 0.60 | 0.88 |
| Residue | 0.66 | 1.00 |

## 4.3. Layer chart

| Layer | Start | Peak | End |
|---|---:|---:|---:|
| Inward prep wisps | 0.04 | 0.16 | 0.28 |
| Primary crescent | 0.18 | 0.42 | 0.58 |
| Contact edge | 0.39 | 0.43 | 0.47 |
| Secondary curl | 0.43 | 0.55 | 0.73 |
| Trailing wisps | 0.46 | 0.64 | 0.90 |
| Dust/motes | 0.62 | 0.78 | 1.00 |

## 4.4. Curves

Primary position:

```text
0.00→0.00
0.20→-0.06  anticipation counter-motion
0.45→0.30
0.70→0.88
1.00→1.00
```

Primary scale/width:

```text
0.00→0.25
0.45→0.70
0.70→1.08 overshoot
0.85→0.96
1.00→1.00 while dissolving
```

Value:

```text
primary peak 0.42 = 0.75
contact edge peak 0.43 = 1.00
secondary peak 0.55 = 0.58
residue peak 0.78 = 0.30
```

## 4.5. Eight key silhouettes

1. Neutral.
2. Wisps рухаються всередину проти фінального напрямку.
3. З’являється малий open crescent.
4. Crescent прискорюється до target.
5. Contact: чіткий leading edge, target усе ще всередині gap.
6. Crescent закручується за target; починається secondary.
7. Wisps відстають і розкриваються.
8. Лишаються тільки рідкі motes.

## 4.6. Peak overlap

`0.43–0.47 с`: primary + contact edge + start secondary + start trailing wisps. Це future profiling interval.

## 4.7. Camera risk

За oblique-кута 35° crescent може візуально стиснутися. Design revision: потовстити передню третину primary й додати одну зміщену depth arc; open center не заповнювати.

### Scoring notes

- Contact clear but no delayed layers: максимум 1/3 за causal secondary.
- Animatic exists but only slow-motion readable: максимум 1/3 за real-time.
- Overshoot без rationale або on every layer: максимум 1/2 за curve motif.

# 5. Model solution — Ice translation, 16 балів

## 5.1. Preserved function

- той самий target point;
- той самий envelope тривалістю 1.0 секунди;
- contact `0.43 с`;
- той самий maximum bounding box;
- torso target лишається видимим після peak;
- те саме повідомлення: projectile досяг target.

## 5.2. Structural translation

| Category | Wind | Ice |
|---|---|---|
| Primary shape | Open tapered crescent | Five faceted radial plates with polygon gaps |
| Edge | Crisp leading, soft trailing | Straight crisp segments and corners |
| Motion | Suction→sweep→curl | Grow→lock→fracture |
| Timing | Continuous acceleration and follow-through | Ordered growth, short hold, sudden break |
| Space | Directional open lane | Target-centered faceted volume |
| Residue | Wisps/motes | Ballistic shards and frost trace |

Distance = 6.

## 5.3. Ice silhouette/value

- three major facets, two smaller;
- open polygon gaps preserve target;
- no literal snowflake symbol;
- inner facets 46%;
- bright edges 84%;
- fracture accent 96%;
- shards 50%→28%;
- frost residue 24%.

## 5.4. Ice timing

| Layer | Start | Peak | End |
|---|---:|---:|---:|
| Facet traces | 0.06 | 0.22 | 0.32 |
| Main plates grow | 0.14 | 0.31 | 0.47 |
| Hold | 0.31 | 0.41 | — |
| Contact/fracture accent | 0.40 | 0.43 | 0.48 |
| Major shards | 0.43 | 0.58 | 0.84 |
| Fine frost | 0.67 | 0.82 | 1.00 |

## 5.5. Чому це не recolor

Ice змінює 6 structural categories, має інший causal sequence й residue. Якщо color вимкнути, Wind лишається open directional sweep, Ice — ordered faceted hold/fracture.

### Scoring notes

- Wind shape з blue color і snow particles: максимум 4/16.
- Shards додані, але primary/timing лишилися wind: максимум 8/16.
- Ice без visible hold може отримати до 2/4 за temporal identity, якщо fracture все ще чітка.

# 6. Model troubleshooting і performance, 10 балів

## Несправність 1 — Wind за oblique camera

**До:** тонкий crescent втрачає площу за кута 35°.  
**Першопричина:** design залежить від однієї плоскої plane.  
**Після:** ширина передньої третини +15%, одна зміщена secondary depth arc, open center збережено.

## Несправність 2 — Ice перекриває target

**До:** п’ять facets створюють суцільну стіну поверх torso target.  
**Першопричина:** немає polygon gaps у negative space.  
**Після:** центральну facet опущено, дві facets повернуто назовні, central gap збільшено на 20%.

## Несправність 3 — плутанина Ice/Earth

**До:** shards виглядають як випадкові rocks.  
**Після:** упорядковані growth axes, короткий hold і яскраві edges facets перед fracture.

## Performance-risk notes

| Design | Must keep | Can simplify | Optional | Future check |
|---|---|---|---|---|
| Wind | Open primary + sweep + delayed trail | Secondary wisp count | Dust motes | Peak translucent overlap at 0.43–0.47 |
| Ice | Major facets + hold/fracture | Minor shard count | Fine frost | Mesh/transparent facet cost and shard overlap at 0.43–0.60 |

Універсальний budget particles або milliseconds не призначається.

# 7. Зразок самооцінювання, 10 балів

> Під час самостійної blind-перевірки без labels і color я спершу маю прочитати direction Wind crescent та локальний contact edge; Ice має спершу показати ordered faceted lock, після якого contact викликає fracture. У Wind можна прибрати одну trailing wisp без втрати function; в Ice — fine frost. Найсильніша hierarchy Wind — crisp leading edge проти open dark center; Ice — bright facet edges і compact fracture accent проти darker inner plates. Після tests я виправив Wind plane collapse at 35° і Ice occlusion of target. Ice не є recolor, бо змінено silhouette, edge, motion, timing, space і residue. Ice має potential mesh/shard count risk; Wind — broad translucent/ribbon overlap risk. Перед implementation я перевірю, чи open Wind shape потребує camera-facing macro layer, а Ice — скільки major shards достатньо. Вилучені або traced proprietary assets не використовувалися. Optional peer review може доповнити, але не замінює цю самооцінювання процедуру.

Повний score вимагає власних конкретних failures, а не копіювання цього тексту.

# 8. Підрахунок і рішення

## Мінімальні category thresholds

| Категорія | Максимум | Мінімум |
|---|---:|---:|
| Theory | 20 | 12 |
| Practical | 60 | 36 |
| Troubleshooting/performance | 10 | 6 |
| Self-review | 10 | 6 |
| **Total** | **100** | **80** |

Приклад:

```text
Theory 17
Practical 49
Troubleshooting 8
Self-review 8
Total 82 → PASS
```

```text
Theory 11
Practical 55
Troubleshooting 9
Self-review 9
Total 84 → NOT YET
```

Друга здача не проходить через theory threshold.

# 9. Automatic remediation triggers

| Ознака | Рішення |
|---|---|
| Extracted/traced proprietary asset | Practical анулюється; повна нова спроба |
| Wind/Ice лише recolor | D не більше 8/16; elemental remediation |
| Немає real-time preview | C не більше 10/16 |
| Немає reference attribution | A source/ethics 0/2; виправити до gate |
| Немає failures до й після | Troubleshooting не більше 4/10 |
| Вигадані numerical budgets | Performance evidence переглянути; замінити measurement plan |
| Target прихований і failure не визнано | Negative-space та troubleshooting remediation |

# 10. Remediation key

## Якщо слабка theory

Для кожної неправильної відповіді:

1. напиши correct principle;
2. наведи власний counterexample;
3. покажи, який практичний artifact його перевіряє.

## Якщо слабкий breakdown

Новий clip, 5–8 functions, `OBS/INF/UNK`, normalized timeline й ethics statement.

## Якщо слабка composition

Створи три solid-white variants без color, приховай labels, зафіксуй neutral filenames, зроби паузу щонайменше на одну навчальну сесію та перемішай порядок. Під час самостійного blind naming визнач direction/weight/precision, звір результат із прихованим ключем і потім rebuild one board. Optional peer check дозволений лише як додаткова перевірка.

## Якщо слабкий timing

Постав contact first. Створи six layer bars, розведи peaks і зроби one-second real-time primitive animatic.

## Якщо слабка translation

Повторний brief:

```text
Preserve target point, duration and contact.
Translate Wind Impact into Earth:
low-wide primary, compression, blunt impulse, gravity settle, dust/cracks.
Change 5+ structural categories.
```

## Якщо слабкий troubleshooting

Обов’язково знайди один camera failure і один background/scale failure. Покажи root cause, one-variable correction і повторний test.

# 11. Фінальне рішення G02

Познач `G02 = PASS` лише якщо:

- total ≥80;
- усі category thresholds виконано;
- немає automatic remediation trigger;
- Wind та Ice читаються без color;
- assessment package повний;
- самооцінювання підписано датою.

Після `G02 = PASS` переходь до `03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md`.
