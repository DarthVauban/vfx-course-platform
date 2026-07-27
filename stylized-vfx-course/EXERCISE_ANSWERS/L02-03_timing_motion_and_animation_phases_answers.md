# Рішення до уроку 02.03

Відкривай після власного animatic, трьох hints і письмового diagnosis. Model answers використовують primitive shapes і не відтворюють конкретні proprietary effects.

## EX-L02-03-A

### 1. Intent

Односекундний diagonal energy impact має передати:

```text
quiet gather → fast cut → precise contact → outward response → sparse residue
```

### 2. Phase strip

| Phase | Start | End | Duration |
|---|---:|---:|---:|
| Anticipation | 0.00 | 0.16 | 0.16 с |
| Activation | 0.10 | 0.24 | 0.14 с |
| Main action | 0.16 | 0.43 | 0.27 с |
| Contact | 0.38 | 0.43 | 0.05 с |
| Impact/accent | 0.39 | 0.56 | 0.17 с |
| Dissipation | 0.50 | 0.84 | 0.34 с |
| Residue | 0.62 | 1.00 | 0.38 с |

Contact point: `0.40 с`, normalized `t=0.40`.

### 3. Layer chart

| Layer | Start | Peak | End | Cause |
|---|---:|---:|---:|---|
| L1 anticipation motes | 0.00 | 0.13 | 0.25 | Attack charge begins |
| L2 primary smear | 0.15 | 0.38 | 0.53 | Stored motion releases toward target |
| L3 contact accent | 0.37 | 0.40 | 0.45 | Primary reaches target |
| L4 broken response arcs | 0.40 | 0.50 | 0.71 | Contact releases energy outward |
| L5 fragments | 0.43 | 0.59 | 0.87 | Surface/material responds after contact |
| L6 residue | 0.60 | 0.77 | 1.00 | Remaining low-energy material settles |

### 4. Motion channels

#### L1 anticipation motes

- position: short inward spiral;
- scale: 0.3→0.7;
- value: 0→0.45→0;
- reason: prepares direction without stealing contact.

#### L2 primary smear

- position: backward offset → fast diagonal target;
- length: 0.2→1.0 by `t=0.36`;
- width: 0.25→0.65 at contact;
- value: 0.3→0.75→0.2;
- curve: ease-in for gathering, fast ease-out for travel.

#### L3 accent

- scale: 0→1.0→0.4→0;
- value: 0→1.0→0;
- no visible travel;
- shortest lifecycle.

#### L4 response arcs

- scale: 0→1.12 at `0.50`→0.97 at `0.58`→1.0 at `0.64`;
- rotation: opposing ±12°;
- value: 0.65 peak, lower than accent;
- opacity/value falls before end.

#### L5 fragments

- position: fan outward/upward;
- speed diversity represented by three end groups `0.72/0.80/0.87`;
- rotation changes after contact;
- value steadily decreases.

#### L6 residue

- position: slight downward/backward drift;
- scale: 0.6→1.0;
- value: 0.35→0.18→0;
- soft edges.

### 5. Curve samples

#### Primary position

| Local t | Position |
|---:|---:|
| 0.00 | 0.00 |
| 0.20 | -0.08 |
| 0.35 | 0.10 |
| 0.60 | 0.78 |
| 0.82 | 1.00 |
| 1.00 | 1.00 |

Невеликий від’ємний offset створює anticipation, після чого починається швидкий рух уперед.

#### Response scale

| Local t | Scale |
|---:|---:|
| 0.00 | 0.00 |
| 0.30 | 0.82 |
| 0.50 | 1.12 |
| 0.68 | 0.97 |
| 0.82 | 1.00 |
| 1.00 | 1.08 під час dissolving |

Фінальне розширення під час dissolving не дає руху завершитися застиглим settle.

#### Accent value

| Local t | Value |
|---:|---:|
| 0.00 | 0.00 |
| 0.35 | 0.25 |
| 0.50 | 1.00 |
| 0.70 | 0.35 |
| 1.00 | 0.00 |

### 6. Key silhouettes

| Time | Silhouette |
|---:|---|
| 0.00 | Neutral |
| 0.08 | Three tiny motes gather behind weapon |
| 0.16 | Narrow compressed wedge points away from target |
| 0.26 | Wedge reverses and extends diagonally |
| 0.40 | Long tapered smear meets compact diamond accent |
| 0.50 | Smear shortens; two broken arcs open outward |
| 0.66 | Arcs thin; fragments form asymmetrical fan |
| 0.82 | Only fragments and low soft residue |
| 1.00 | Neutral, no bright layer |

### 7. Camera-risk notes

- За yaw 70° плоский primary може втратити ширину. Майбутня implementation потребує camera-facing macro shape або фізичної товщини.
- Broken arcs можуть перекрити target за близької камери; змістіть їхній центр трохи нижче contact.
- Residue не має кріпитися до камери; важливий world-space зв’язок із contact.
- Accent має лишатися локалізованим; збільшення billboard може перекрити обличчя target.

### 8. Peak overlap frame

Maximum overlap occurs around `0.42–0.45 с`:

- L2 still visible;
- L3 accent near peak;
- L4 starts;
- L5 starts.

Майбутній profiler capture має охоплювати цей інтервал, а не лише середній lifecycle.

### 9. Чому рішення працює

Contact закладено до motion. Primary повідомляє direction раніше, accent фіксує event, а response layers стартують causal order. Peaks розведені: accent `0.40`, arcs `0.50`, fragments `0.59`, residue `0.77`. Effect не злипається в один flash і очищає bright layers до кінця.

### 10. Допустимі альтернативи

- Reactive impact може не мати internal anticipation; її бере на себе character animation.
- Overshoot можна замінити stepped broken-arc poses.
- Residue можна скоротити до `0.85`, якщо effect використовується rapid fire.
- Primary path може бути curved, якщо direction до contact лишається ясним.

### 11. Типові неправильні рішення

- Contact не має timestamp.
- Accent, primary і arcs peak `0.40`.
- Fragments починаються `0.20`, тобто до cause.
- Overshoot 1.5× і довгий settle роблять impact gelatinous.
- Residue value 0.8 конкурує з наступною action.

### 12. Verification

1. Переглянути в real time тричі без pause.
2. Назвати contact із похибкою не більше приблизно 0.1 с.
3. Прибрати color — sequence лишається.
4. Приховати accent — direction зберігається, contact слабшає.
5. Приховати primary — contact лишається, direction слабшає.
6. Зменшити до 25% — primary/contact/response читаються.
7. Перевірити final frame — немає bright ghost.

### 13. Performance

- L1 має завершитися до impact overlap.
- L2 завершується до late dissipation.
- L4/L5/L6 overlap, але поступово знижують value/area.
- Rapid-fire variant має скорочувати L6.
- Майбутнє вимірювання: peak overlap `0.42–0.45`, total active duration і residue accumulation.

---

## EX-L02-03-B

### 1. Combo intent

```text
Hit 1: establish horizontal direction
Hit 2: quick rising reversal
Hit 3: short pause, heavy descending finisher
```

Total duration: `2.20 с`.

### 2. Master beat chart

| Event | Seconds | Normalized |
|---|---:|---:|
| Combo start | 0.00 | 0.00 |
| Hit 1 contact | 0.58 | 0.264 |
| Hit 2 contact | 1.04 | 0.473 |
| Finisher anticipation peak/pause | 1.48 | 0.673 |
| Hit 3 contact | 1.74 | 0.791 |
| Major response peak | 1.84 | 0.836 |
| Bright cleanup complete | 2.05 | 0.932 |
| Residue end | 2.20 | 1.00 |

Intervals між contacts: `0.46 с` і `0.70 с`. Rhythm не metronomic.

### 3. Local phase strips

#### Hit 1

| Phase | Time |
|---|---|
| Anticipation | 0.24–0.40 |
| Main action | 0.38–0.60 |
| Contact | 0.56–0.61 |
| Response | 0.58–0.80 |
| Residue | 0.66–0.94 |

#### Hit 2

| Phase | Time |
|---|---|
| Anticipation | 0.82–0.91 |
| Main action | 0.90–1.06 |
| Contact | 1.02–1.07 |
| Response | 1.04–1.23 |
| Residue | 1.12–1.38 |

#### Hit 3

| Phase | Time |
|---|---|
| Anticipation | 1.22–1.58 |
| Held pause | 1.44–1.52 |
| Main action | 1.53–1.76 |
| Contact | 1.72–1.78 |
| Response | 1.74–2.06 |
| Residue | 1.88–2.20 |

### 4. Shape/motion distinction

| Hit | Primary | Contact response | Character |
|---|---|---|---|
| H1 | Horizontal tapered arc left→right | Small forward crescent | Setup, clear direction |
| H2 | Rising narrow reverse arc right→left | Two upward fragments | Faster, lighter |
| H3 | Descending broad wedge | Broken ground ring + vertical shards | Heavy finisher |

### 5. Shared layer-overlap chart

```text
Time: 0.0      0.5      1.0      1.5      2.0  2.2
H1 P:      [----^--]
H1 R:           [------]
H2 P:               [--^-]
H2 R:                   [----]
H3 A:                      [------pause--]
H3 P:                               [--^--]
H3 R:                                  [------^------]
```

H1 residue знижено до low value до H2 contact. H2 residue завершується перед H3 main action. Finisher response має простір.

### 6. Twelve-frame storyboard

| Board | Time | Ключова інформація |
|---:|---:|---|
| 1 | 0.00 | Neutral |
| 2 | 0.30 | H1 anticipation |
| 3 | 0.50 | H1 primary |
| 4 | 0.58 | H1 contact |
| 5 | 0.80 | H1 cleanup / H2 preparation |
| 6 | 0.96 | H2 reverse primary |
| 7 | 1.04 | H2 contact |
| 8 | 1.26 | H2 cleanup, energy gathers high |
| 9 | 1.48 | Finisher held anticipation |
| 10 | 1.68 | Descending smear |
| 11 | 1.74 | H3 contact |
| 12 | 1.90 | Major response |
| 13 | 2.20 | Low residue only |

### 7. Finisher hierarchy

Finisher сильніший не через «утричі більше particles», а через:

- anticipation `0.36 с`, довшу за H1/H2;
- intentional pause;
- broader primary silhouette;
- strongest local accent;
- ground response замість повтору arc;
- response duration `0.32 с`;
- попереднє очищення H2.

### 8. Cleanup/performance-risk analysis

| Risk | Diagnosis | Revision |
|---|---|---|
| H1 residue overlap H2 | До 0.94, але H2 contact 1.04 | Value нижче 30% після 0.84 |
| H2 residue overlap finisher anticipation | До 1.38 | Допустимо як low-value lead-in; end before H3 main |
| Peak at H3 | P3 + accent + ring + shards | Профілювати 1.74–1.90 |
| Broad ground ring | High screen coverage | Broken ring, open center, shorter opacity |
| Combo reuse | Active Systems accumulate | У майбутньому перевірити shared System/lifecycle strategy |

### 9. Чому рішення працює

Contacts мають різні spacing, direction і scale. H2 прискорює phrase, pause перед H3 створює contrast, а cleanup rows гарантують, що finisher має visual room. Finisher отримує strength від timing/value/shape hierarchy, а не лише від quantity.

### 10. Допустимі альтернативи

- Contacts можуть бути, наприклад, 0.50/0.88/1.65 с, якщо phrase читається.
- H2 може бути downward або thrust, головне — distinct spatial path.
- Finisher може бути radial aerial burst без ground ring.
- У дуже швидкій combat system total duration може бути коротша; proportions треба перепланувати, а не просто speed-up.

### 11. Типові неправильні рішення

- Contacts кожні 0.5 с.
- Однаковий arc повертається туди-назад із різним color.
- H1/H2 residue лишаються high-value під H3.
- Finisher «сильніший» лише через 4× fragments.
- Animatic читається тільки на 50% speed.

### 12. Verification

1. Переглянути real-time й порахувати три hits.
2. Вимкнути color: direction/rhythm лишаються.
3. Freeze за 0.1 с до кожного contact: anticipation відрізняється.
4. Freeze peak overlaps: target visible.
5. Прибрати small particles: phrase все ще працює.
6. Перевірити 25% scale: H1/H2/H3 silhouettes distinct.
7. Приховати labels, дати frames нейтральні filenames, зробити паузу й провести самостійне blind naming: third hit має визначатися як finisher; optional peer check може лише доповнити результат.

### 13. Performance

Найважливіші future captures:

- H1/H2 transition, щоб перевірити residue accumulation;
- finisher peak `1.74–1.90`;
- repeat combo twice, щоб виявити active-system overlap;
- High/Medium/Low plan має скорочувати secondary/residue раніше, ніж primary/contact.
