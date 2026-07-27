# Рішення до уроку 02.01

Не відкривай цей файл до завершення власної спроби, трьох рівнів підказок і короткого запису про те, де саме ти застряг.

Оскільки студент сам обирає офіційний reference, нижче наведено повне **model solution** на синтетичному footage description `Training Impact A`. Воно не відтворює конкретний proprietary effect і показує структуру правильної відповіді. Твоя форма й timing можуть відрізнятися, якщо observations підтверджені.

## EX-L02-01-A

### 1. Умова model solution

Синтетичний clip триває 30 кадрів: персонаж робить diagonal melee contact з target. До contact видно вузький directional shape, у момент contact — короткий white accent, після нього — broken radial response, кілька fragments і слабкий smoke residue.

### 2. Source card

```text
Title: Training Impact A — synthetic course description
Author: course exercise
URL: not applicable; no external asset
Access date: not applicable
Interval: frames 0–29
Camera type: medium-distance third-person gameplay camera
Study question: як effect передає напрямок contact і не приховує target?
Usage rule: primitive-shape analysis only; no copied asset.
```

Для реальної вправи `Title`, `Official publisher/developer`, `URL`, `Access date` і `Timestamp` мають бути заповнені фактичними даними.

### 3. Key-frame strip

| Frame | Normalized t | Observation |
|---:|---:|---|
| 0 | 0.00 | Neutral; effect відсутній |
| 5 | 0.17 | Починається вузький diagonal primary |
| 9 | 0.31 | Primary розтягується до target |
| 12 | 0.41 | Contact; найяскравіший accent |
| 14 | 0.48 | Broken radial secondary досягає найбільшої площі |
| 17 | 0.59 | Primary зникає, fragments продовжують рух |
| 22 | 0.76 | Залишається low-value residue |
| 29 | 1.00 | Повернення до neutral |

### 4. Observation / inference ledger

```text
OBS: primary shape витягнутий по diagonal attack direction.
OBS: brightest accent збігається з contact.
OBS: radial response починається після contact.
OBS: fragments рухаються переважно вперед і вгору.
OBS: residue має нижчий value, ніж action layers.
INF-M: primary може бути mesh або sprite sequence.
INF-L: fragments можуть використовувати Mesh Renderer.
UNK: Blend Mode, simulation type, exact particle count, material graph.
```

### 5. Layer table

| ID | Function | Shape | Value/color role | Start/Peak/End | Motion/space | Cost risk |
|---|---|---|---|---|---|---|
| P1 | Показати attack direction | Tapered diagonal wedge | High mid-value, dominant warm | 0.17/0.34/0.53 | Weapon→target, world-aligned | S, O |
| A1 | Зафіксувати contact | Compact four-point flash | 100% white accent | 0.38/0.41/0.45 | Target point | S |
| S1 | Показати release energy | Broken crescent ring | Mid-high accent | 0.40/0.49/0.68 | Radial from target | S, O |
| SP1 | Пояснити scale/material | 6–12 tapered fragments як один group | Mid-value | 0.41/0.58/0.85 | Forward/upward ballistic fan | N |
| R1 | Підтвердити наслідок | Small soft asymmetric cloud | Low-value neutral | 0.56/0.74/1.00 | World-space settling | S, D |

Чому це п’ять layers, а не двадцять: fragments мають одну функцію, один motion family і близький lifecycle, тому це один `SP1`.

### 6. Normalized timeline

```text
t:   0.0      0.2      0.4      0.6      0.8      1.0
P1:       [----^--------]
A1:                 [-^-]
S1:                  [---^-------]
SP1:                 [------^-----------]
R1:                           [-----^----------]
CONTACT:              |
```

`^` позначає peak. Accent не ділить тривалість порівну: його вузьке вікно створює crisp contact.

### 7. Abstract reconstruction

Повна структура:

1. На dark-gray background розташувати target marker праворуч від центру.
2. P1 створити як трикутний wedge, нахилений приблизно на 25° вгору.
3. A1 — маленький diamond/plus, не повторювати star contour reference.
4. S1 — два broken crescents різного radius замість суцільного ring.
5. SP1 — сім різних tapered rectangles, розведених у fan 50°.
6. R1 — дві low-value ellipses, зміщені вниз-вліво.
7. Використати values 55%, 80% і 100%; hue не потрібен для першої перевірки.

Змінені design axes:

- curved blade замінено wedge;
- circular ring замінено broken crescents;
- horizontal direction замінено diagonal;
- debris fan асиметричний;
- residue зміщено проти напрямку primary.

### 8. Design principles

1. Directional information з’являється до contact.
2. Brightest accent коротший за primary та secondary response.
3. Post-contact motion ширший за pre-contact motion.
4. Residue нижчий за value й compact, тому target лишається видимою.

### 9. Cost-risk plan

| Risk | Чому позначено | Майбутня перевірка |
|---|---|---|
| S | P1, A1, S1 і R1 можуть бути translucent | Shader Complexity/overdraw в ігровій камері |
| O | P1 і S1 overlap біля contact | Перевірити, чи можна скоротити P1 після frame 12 |
| N | Fragment group | Перевірити мінімальну кількість, що зберігає scale cue |
| D | Residue триває до кінця | Перевірити active System overlap під час combo |

### 10. Ethics statement

```text
Я використав reference лише для аналізу sequence of functions.
Я не витягував textures, meshes або animation data.
Я не trace-ив contour.
Abstract reconstruction змінює silhouette, proportions, motion fan,
secondary-shape logic і residue behavior.
```

### Чому рішення працює

Воно відокремлює gameplay message від implementation. Direction читається до contact, contact має один focal accent, а після нього layers розходяться в часі. Layer table достатньо конкретна для подальшого production brief, але не стверджує неперевірені renderer або material details.

### Допустимі альтернативи

- `S1` може бути outward cone замість crescents, якщо функція лишається radial response.
- `SP1` може бути streaks, droplets або shards залежно від material identity.
- Residue можна прибрати, якщо action дуже швидка й наступний combo hit потребує чистого кадру.
- Primary може мати lower value, якщо silhouette сильна й accent чітко фіксує contact.

### Типові неправильні рішення

- Перелік «sprite, ribbon, mesh» без функцій.
- 20 layers, де кожний fragment рахується окремо.
- Exact traced arc і exact color palette.
- Усі Start/Peak/End однакові.
- Твердження «GPU simulation, Additive material» без evidence.

### Verification

- Приховай color: P1 і A1 все ще читаються.
- Приховай SP1 та R1: основна дія залишається зрозумілою.
- Приховай P1: напрямок до contact стає слабшим — отже P1 справді primary.
- Зменш board до 25%: target marker не перекритий.
- Приховай власні labels і пояснення, збережи sequence shapes з neutral filename, зроби паузу щонайменше на одну навчальну сесію та самостійно запиши перше прочитання; воно має містити «direction → contact → expansion → residue». Optional peer або LLM check може лише доповнити це самооцінювання.

### Performance

Рішення не присвоює вигаданих budgets. Воно створює конкретний measurement plan: translucent coverage, overlap at contact, minimum fragment count і residue duration.

---

## EX-L02-01-B

### 1. Синтетичні references

`Reference A` — швидкий projectile impact із вузьким forward spike, single-frame accent і коротким backward residue.

`Reference B` — важкий projectile impact із compact contact core, широким ground ring, vertical debris і довгим dust residue.

Ці descriptions створено для course solution; вони не відтворюють конкретні proprietary effects.

### 2. Comparative matrix

| Критерій | Reference A | Reference B | Observation-level conclusion |
|---|---|---|---|
| Primary | Narrow forward spike | Compact circular core | A підкреслює direction, B — mass/contact |
| Secondary | Thin backward streaks | Wide ground ring | Різний просторовий response |
| Accent | Very brief white point | Larger warm core | A crisp, B sustained |
| Supporting | Few fast streaks | Vertical chunks | A speed cue, B weight cue |
| Residue | Short backward wisp | Broad lingering dust | B довше займає screen area |
| Peak | t≈0.38 | t≈0.48 | B має повільніший build |
| Camera risk | Thin shape може зникнути | Ring може стати ellipse/occlude | Обидва camera-dependent по-різному |
| Cost risk | N, small S | S, O, D, possible N | B потребує більше overlap checks |

### 3. Similarities

- обидва мають contact accent;
- primary і residue мають різні value;
- supporting motion походить із contact point;
- peak відбувається до середини повного lifecycle.

### 4. Differences

- A читається через direction і speed; B — через area і weight;
- A має вузький screen footprint; B — широкий;
- A швидко очищає frame; B залишає persistence;
- A secondary рухається назад; B — radial/vertical.

### 5. Оригінальний direction C

**Intent:** projectile, що «розщеплює простір» без копіювання A або B.

| Layer | Нова design logic |
|---|---|
| P1 | Two offset diamond planes, які сходяться в contact |
| A1 | Thin vertical slit, а не point/core |
| S1 | Два opposing semicircular waves, що рухаються вліво/вправо |
| SP1 | Short fragments, які спершу притягуються до slit, потім відскакують |
| R1 | Narrow vertical afterimage, що стискається, а не smoke/dust |

Змінені axes:

- silhouette — diamonds/slit;
- motion path — convergence then lateral split;
- rhythm — коротка pause перед split;
- residue — contraction замість drift;
- value distribution — dark core із bright edge, а не bright filled core.

### 6. Six-frame animatic

| Frame | t | Композиція |
|---:|---:|---|
| 1 | 0.00 | Neutral target marker |
| 2 | 0.18 | Two small offset diamonds наближаються |
| 3 | 0.35 | Diamonds сходяться; negative gap звужується |
| 4 | 0.42 | Vertical slit accent; найвищий value |
| 5 | 0.58 | Opposing semicircles розходяться; fragments відскакують |
| 6 | 0.85 | Slit стискається до тонкої low-value line |

### 7. Чому рішення працює

Новий direction використовує узагальнені functions — anticipation, contact, response, residue — але змінює contour, spatial logic, rhythm і aftermath. Він не бере spike з A та ring/dust із B як collage.

### Допустимі альтернативи

- Converging shapes можуть бути chevrons або soft lobes.
- Lateral split можна замінити vertical split, якщо gameplay camera не перекриває персонажа.
- Dark core можна прибрати для readability на темному environment.
- Pause може становити 5–10% lifecycle; її треба перевіряти в real-time preview.

### Типові неправильні рішення

- Взяти spike A, ring B і лише змінити color.
- Порівнювати «A красивіший» без gameplay criterion.
- Використати різні taxonomy rows, через що references не можна зіставити.
- Не позначити camera/cost risks.

### Verification

1. Порівняй silhouettes A, B, C у solid white: C не повторює жодну.
2. Прибери color із C: convergence/contact/split читаються.
3. Перевір normalized timeline: pause існує, але не руйнує contact.
4. Зменш animatic до 25%: slit accent не зникає.
5. Перевір ethics statement: жодного exact contour, texture або unique symbol.

### Performance

Основний ризик C — overlap двох semicircular waves і bright slit. Measurement plan:

- перевірити translucent overlap біля `t=0.42–0.58`;
- порівняти один combined material із двома окремими layers;
- скоротити fragments до мінімальної кількості;
- обмежити afterimage duration під час rapid fire.
