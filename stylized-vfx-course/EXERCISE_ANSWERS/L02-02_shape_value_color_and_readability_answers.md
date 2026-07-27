# Рішення до уроку 02.02

Цей файл відкривають після власної спроби та трьох рівнів підказок. Рішення є повними model answers, але не є єдиними допустимими композиціями.

## EX-L02-02-A

### 1. Gameplay sentence

> «Одноразовий melee contact проходить зліва направо; target стоїть праворуч від character; contact має читатися за nominal third-person camera, але не приховувати target після peak».

Camera frame, character position, target position і contact point однакові для всіх трьох boards.

### 2. Board A — Speed

#### Shape plan

| Role | Shape | Position/function |
|---|---|---|
| Primary | Вузький tapered wedge, 28° вгору | Веде eye від weapon до target |
| Secondary 1 | Два короткі parallel streaks | Підтверджують speed, не виходять попереду primary |
| Secondary 2 | Малий broken crescent за contact | Показує швидке розсікання |
| Accent | Compact diamond у contact | Фіксує точку |
| Residue | Один thin backward wisp | Очищає frame швидко |

#### Negative space

- 12–18% довжини primary перед target лишено порожнім до contact frame.
- Навколо face/torso target — clear pocket.
- Streaks не торкаються нижнього contour primary.

#### Value plan

```text
Background 20%
Primary 62%
Streaks 48%
Contact crescent 72%
Accent 98%
Residue 30%
```

#### Color roles

- dominant: moderately saturated warm orange;
- support: darker red-orange;
- accent: near-white pale yellow;
- residue: desaturated warm gray.

Color не є основною причиною speed; її передають taper, spacing і narrow footprint.

#### Edge language

- leading tip і contact accent — crisp;
- trailing edge wedge — broken;
- streaks — crisp at front, fading behind;
- residue — soft.

### 3. Board B — Weight

#### Shape plan

| Role | Shape | Position/function |
|---|---|---|
| Primary | Compact blunt trapezoid біля contact | Передає масу, а не довгий travel |
| Secondary 1 | Wide low ground crescent | Розподіляє force по землі |
| Secondary 2 | Три vertical shard blocks | Показують impulse вгору |
| Accent | Малий bright core усередині primary | Не роздуває screen coverage |
| Residue | Низька asymmetric dust mass | Підтверджує ground contact |

#### Negative space

- Center of trapezoid зміщено нижче torso target.
- Ground crescent має розрив під feet target, щоб silhouette ніг не зникла.
- Між shards різна ширина gaps; немає solid wall.

#### Value plan

```text
Background 20%
Primary 58%
Ground crescent 46%
Shards 52%
Accent 94%
Residue 27%
```

#### Color roles

- dominant: muted amber/earth;
- support: darker brown-orange;
- accent: pale warm neutral;
- residue: low-chroma brown-gray.

#### Edge language

- primary front face — hard;
- ground crescent — hard near contact, broken outward;
- shards — irregular hard;
- dust residue — soft.

### 4. Board C — Arcane Precision

#### Shape plan

| Role | Shape | Position/function |
|---|---|---|
| Primary | Thin offset arc із internal gap | Контрольований swing і intentional negative space |
| Secondary 1 | Два small diamonds на tangent, але з clear gaps | Показують measured alignment |
| Secondary 2 | Short inward ticks навколо contact | Збирають увагу до точки |
| Accent | Small vertical slit | Focal event |
| Residue | Two fading geometric segments | Clean finish |

#### Negative space

- Internal gap займає приблизно третину envelope arc.
- Target torso видно через gap.
- Diamonds не торкаються arc; clear separation зберігає precision.

#### Value plan

```text
Background 20%
Primary 54%
Diamonds 46%
Ticks 38%
Accent 100%
Residue 26%
```

#### Color roles

- dominant: cool violet-blue;
- support: desaturated blue;
- accent: near-white neutral із малим warm contrast;
- residue: dark cool gray.

#### Edge language

- всі geometric shapes clean, але accent найчіткіший;
- residue segments fragmented і lower value;
- немає soft glow у silhouette test.

### 5. Порівняння macro-read

| Criterion | Speed | Weight | Precision |
|---|---|---|---|
| Перше дієслово | Прорізає | Вдаряє/тисне | Фіксує/розсікає контрольовано |
| Main direction | Forward diagonal | Down/outward | Curved inward |
| Footprint | Long/narrow | Short/wide | Medium/open |
| Negative space | Forward lane | Gaps in ground/shards | Internal geometric gap |
| Peak | Tip/contact | Compact core | Vertical slit |
| Residue | Short wisp | Low dust | Segments |

### 6. Camera/readability matrix

| Test | Speed | Weight | Precision | Revision |
|---|---|---|---|---|
| Near direction | Pass | Pass | Pass | — |
| Nominal target visible | Pass | Revise | Pass | Розірвати ground crescent під target |
| Far primary readable | Revise | Pass | Revise | Speed: widen wedge 12%; Precision: thicken arc 15% |
| Light background | Revise | Pass | Revise | Додати localized dark support, не global outline |
| Warm busy background | Pass | Revise | Pass | Weight: знизити dominant saturation і підняти value separation |
| Screen coverage justified | Pass | Revise | Pass | Скоротити Weight ground radius 18% |

### 7. Чому рішення працює

Усі variants виконують ту саму дію й мають один contact point, але character змінюється чотирма системами одночасно:

- shape family;
- distribution of mass;
- negative space;
- edge/residue behavior.

Color лише уточнює identity. Якщо зробити boards white-on-black, Speed, Weight і Precision все одно відрізняються.

### 8. Допустимі альтернативи

- Speed може використовувати arc замість wedge, якщо arc вузький, tapered і directionally offset.
- Weight може бути radial block burst без ground crescent, якщо target visibility збережено.
- Precision може використовувати triangles/hexagons без конкретних proprietary symbols.
- Accent color може бути відсутній: локальний value/edge contrast достатній.

### 9. Типові неправильні рішення

- Три однакові silhouettes різного hue.
- Weight = просто збільшений Speed.
- Precision = чужий magic symbol, перемальований вручну.
- Glow використано замість negative-space correction.
- Far-camera failure не записано, бо hero board виглядає добре.

### 10. Verification

1. Перетвори всі boards на solid white: verbs мають лишитися різними.
2. Застосуй grayscale: focal order primary → accent → secondary зберігається.
3. Зменш до 25%: primary читається після revisions.
4. Збережи кожний варіант як окремий 0.5-second clip із neutral filename, приховай labels, зроби паузу й проведи самостійне blind naming: кожний має читатися як інший character. Optional peer check не є умовою.
5. Наклади target silhouette: після revisions не більше коротких локальних overlaps.

### 11. Performance

- Speed має найменший expected screen coverage, але thin shape потребує anti-alias/readability check.
- Weight має найбільший risk `S/O/D`; ground crescent і dust треба скорочувати першими.
- Precision може вимагати кількох geometric layers, але їх слід звести до мінімальної кількості materials/draw structures на implementation stage.
- Жоден board не отримує довільного millisecond budget; він отримує список майбутніх tests.

---

## EX-L02-02-B

### 1. Functional separation

| Effect | Gameplay verb | Attachment | Protected information |
|---|---|---|---|
| Friendly Buff | Огортає й піднімає ally | Character-centered | Pose, face, weapon |
| Enemy Telegraph | Обмежує ground area й попереджає | World/ground-centered | Boundary, center, escape direction |

### 2. Shape grammar

#### Friendly Buff

- primary: дві upward open S-curves по боках character;
- secondary: three small upward leaf/diamond shapes;
- accent: короткий halo segment над shoulders на activation;
- negative space: open center на torso;
- edges: medium/soft, open, upward;
- residue/loop: sparse rising points, не solid cloud.

#### Enemy Telegraph

- primary: closed flat segmented ring;
- secondary: inward ticks, що показують danger center;
- accent: чотири boundary nodes, які стають crisp ближче до trigger;
- negative space: interior переважно чистий, щоб видно ground/characters;
- edges: hard, low, horizontal, repetitive;
- residue: відсутній до trigger; після trigger переходить в окремий impact effect.

### 3. Grayscale plan

```text
Background: variable
Buff primary: 55%
Buff activation accent: 90%
Buff loop particles: 42%

Telegraph boundary: 72%
Telegraph inward ticks: 58%
Telegraph imminent accent: 95%
Telegraph interior fill: 0–20% opacity-equivalent design value
```

У static combined frame telegraph boundary сильніша за buff loop, але buff activation може коротко мати higher peak. Їхні peaks не повинні постійно конкурувати.

### 4. Color plan

Model colors:

- Buff dominant: cool cyan-green;
- Buff accent: near-white warm-neutral;
- Telegraph dominant: orange-red;
- Telegraph accent: pale yellow-white.

Але separation працює без hue:

- buff open/vertical/attached;
- telegraph closed/horizontal/world-space;
- buff edges soft/flowing;
- telegraph edges crisp/repetitive.

### 5. Combined-frame background tests

| Background | Failure | Revision |
|---|---|---|
| Dark | Buff loop particles надто bright | Знизити loop value; зберегти peak лише activation |
| Light | Buff S-curves губляться | Додати localized darker outer support, збільшити width 10% |
| Warm busy | Telegraph boundary зливається | Зсунути boundary value вище й спростити texture/detail |
| Cool busy | Buff identity губиться | Посилити shape gap і upward direction, не лише saturation |

### 6. Near/nominal/far matrix

| Test | Near | Nominal | Far |
|---|---|---|---|
| Buff attached to ally | Pass | Pass | Revise |
| Telegraph closed boundary | Pass | Pass | Pass |
| Ally pose visible | Revise | Pass | Pass |
| Escape direction visible | Pass | Pass | Pass |
| Effects distinguishable grayscale | Pass | Pass | Revise |

Revisions:

- Near: розвести S-curves далі від torso на 8% frame height.
- Far: замінити дрібні buff particles двома більшими upward accents.
- Far: зберегти segmented rhythm telegraph, але зменшити кількість segments.

### 7. Failure analysis

Початкова версія buff мала closed ring навколо feet, а telegraph — інший closed ring. Навіть із різними colors вони плуталися у grayscale й на warm/cool backgrounds. Root cause — однакова shape/attachment grammar.

Виправлення:

1. Buff перенесено у vertical character-attached space.
2. Center залишено open.
3. Telegraph лишено flat і closed.
4. Edge rhythm розведено: flowing проти segmented.
5. Timing implication розведено: continuous upward loop проти inward countdown.

### 8. Чому рішення працює

Два effects відрізняються п’ятьма незалежними channels: attachment, orientation, closure, edge language і timing behavior. Навіть якщо display переводиться в grayscale або environment змінює hue contrast, functional roles лишаються різними.

### 9. Допустимі альтернативи

- Buff може бути orbiting arcs, якщо вони явно character-attached і не створюють ground boundary.
- Telegraph може бути polygon, broken rectangle або wedge area, якщо boundary читається.
- Friendly color не обов’язково cyan; enemy не обов’язково red. Shape/timing мають нести базове повідомлення.
- Buff accent може з’являтися на shoulders, weapon або above head залежно від protected pose.

### 10. Типові неправильні рішення

- Два rings різного color.
- Solid filled telegraph, що закриває ground і персонажів.
- Buff cloud, що приховує combat pose.
- Background test вирішено global glow для всього.
- Far version зберігає всі дрібні particles й перетворюється на noise.

### 11. Verification

1. Зроби solid-white silhouettes: open vertical buff і closed flat telegraph не плутаються.
2. Зроби grayscale: roles лишаються різними.
3. Випадково поміняй hues місцями: functions усе ще читаються.
4. Перевір four backgrounds.
5. Наклади character pose й target silhouettes.
6. Зменш до 25%: telegraph boundary замкнена, buff direction upward.
7. Приховай labels, перемішай neutral filenames після паузи й проведи самостійне blind naming: attached effect і area warning мають визначатися правильно. Optional peer check може бути лише додатковим.

### 12. Performance

- Telegraph interior не потребує щільного translucent fill; boundary може нести message з меншим coverage.
- Buff loop не потребує постійного peak glow.
- Far variants повинні скорочувати particles/segments, зберігаючи macro shape.
- Overlap buff + telegraph є окремим representative test case для блока 10.
