# 1. Назва

## Урок 02.03 — Timing, motion і фази stylized anime effect

# 2. Результат уроку

Після уроку ти зможеш:

- описати повний lifecycle effect від anticipation до residue;
- перетворити static composition board на normalized timing chart;
- планувати Start/Peak/End для primary, secondary, accent і residue layers;
- використовувати staggered timing та відкладений другорядний рух;
- відрізняти position, scale, rotation, opacity і shape change;
- застосовувати ease-in, ease-out, overshoot, settle і directional reversal;
- створювати smear shapes і stepped animation без втрати gameplay clarity;
- спроєктувати 2D/3D hybrid motion із урахуванням camera;
- створити односекундний abstract animatic і three-hit combo timing sheet.

Ключовий результат — `Timing and Motion Sheet`: phase chart, layer bars, curve sketches, key silhouettes та real-time preview.

# 3. Орієнтовний час

**6 годин: 1.5 години теорії та 4.5 години практики.**

| Частина | Час |
|---|---:|
| Phase model і normalized time | 30 хв |
| Криві руху й другорядний рух | 35 хв |
| Smear, stepped і hybrid motion | 25 хв |
| Controlled experiments | 45 хв |
| Guided practice | 2 години |
| Самостійні вправи, self-check і журнал | 1 год 45 хв |

# 4. Prerequisites

- Завершено `02.01` і `02.02`.
- Є layer breakdown із normalized Start/Peak/End.
- Є три-value composition board із primary, secondary, accent і residue.
- Студент уміє працювати з `Timeline` у Photoshop або `Animation Timeline` у Krita на базовому рівні.

# 5. Нові терміни

| Термін | Пояснення | Ознака в animatic |
|---|---|---|
| **Anticipation** | Підготовка, що спрямовує увагу до майбутньої дії | Стиснення, збір, коротка pause або reverse motion |
| **Activation** | Момент запуску ability/effect | Перший виразний change зі стану neutral |
| **Main action** | Основний перенос енергії або форми | Найбільший directional motion |
| **Contact** | Просторовий/часовий момент зустрічі з target | Primary досягає target point |
| **Impact** | Візуальна відповідь на contact | Radial, directional або material response |
| **Accent frame** | Дуже короткий focal peak | Локальний highest value/contrast |
| **Dissipation** | Втрата енергії та розпад | Shrink, fade, fragment, slow або drift |
| **Residue** | Залишковий proof події | Low-energy smoke, mark, motes, afterimage |
| **Staggered timing** | Шари мають різні starts/peaks/ends | Peaks не зливаються в один flash |
| **Delayed secondary motion** | Secondary реагує після primary | Follow-through, trailing arc, delayed fragments |
| **Overshoot** | Значення коротко перевищує final target | Scale 1.12 перед settle до 1.00 |
| **Settle** | Повернення з overshoot до stable state | Малий reverse correction |
| **Smear shape** | Тимчасова витягнута форма, що передає швидкий рух | Більше direction, менше literal detail |
| **Stepped animation** | Shape/value утримуються кілька frames перед стрибком | Intentional held poses |
| **2D/3D hybrid** | Поєднання camera-oriented shapes і world-space volume | Macro shape читається, а parallax дає depth |
| **Motion path** | Геометричний шлях position/orientation | Line, arc, spiral, radial, orbit |

# 6. Навіщо ця тема потрібна VFX-фахівцю

VFX існує в часі. Static screenshot може виглядати красиво, але gameplay effect провалюється, якщо:

- anticipation надто довга для швидкої атаки;
- contact не збігається з animation;
- усі layers peak одночасно;
- residue перекриває наступний combo hit;
- другорядний рух починається раніше за cause;
- effect читається лише в slow motion;
- швидка shape зникає між frames або з певної camera.

Timing є частиною читабельності під час гри і відчуття weight. Один і той самий shape може здаватися light, heavy, electric або watery лише через різні acceleration, pauses, overshoot і dissipation.

# 7. Теорія простими словами

Побудуй effect як фразу з наголосом:

```text
prepare → launch → travel → CONTACT! → response → fade → proof
```

Не кожна фаза обов’язково має окремий layer, але кожна має функцію:

- anticipation каже «дивись сюди»;
- main action каже «ось що рухається»;
- contact/impact каже «подія сталася тут»;
- dissipation каже «енергія закінчується»;
- residue каже «ось наслідок».

Якщо все відбувається одночасно, effect не має rhythm. Якщо все відбувається послідовно без overlap, effect здається механічним. Stylized timing часто використовує короткий сильний overlap навколо contact і довший, слабший follow-through.

# 8. Детальні технічні пояснення

## 8.1. Normalized phase model

Плануй час у діапазоні `0–1`, а потім переводь у seconds.

Training starting ranges для короткого combat effect:

| Phase | Орієнтовний normalized interval |
|---|---:|
| Anticipation | 0.00–0.18 |
| Activation | 0.12–0.24 |
| Main action | 0.18–0.42 |
| Contact | 0.38–0.44 |
| Impact/accent | 0.40–0.52 |
| Dissipation | 0.48–0.82 |
| Residue | 0.65–1.00 |

Intervals overlap. Це не універсальний template: telegraph, aura, beam або transformation мають інші proportions.

Для duration `D`:

```text
time_seconds = normalized_time × D
```

Якщо `D = 0.9 с`, contact at `t = 0.42`:

```text
contact = 0.9 × 0.42 = 0.378 с
```

## 8.2. Channels motion

Не анімуй усе однією «кривою інтенсивності». Розділяй:

- position;
- scale;
- rotation/orientation;
- opacity/value;
- color;
- shape/texture frame;
- edge erosion;
- spawn density;
- width/length;
- attachment or space.

Наприклад primary slash:

- position рухається швидко вперед;
- length росте перед contact;
- width стискається після contact;
- value peak короткий;
- opacity зникає швидше, ніж residue;
- orientation follows attack path.

## 8.3. Curve vocabulary

### Linear

Однакова швидкість. Корисна для machine-like або beam travel, але часто здається без weight.

### Ease-in

Повільний початок, прискорення наприкінці. Підходить для charge або collapse.

### Ease-out

Швидкий старт, уповільнення. Підходить для impact expansion і debris settling.

### Ease-in-out

Плавний start/end. Корисний для aura orbit, але може бути надто «стерильним» для hit.

### Overshoot and settle

```text
0.0 → 1.12 → 0.96 → 1.00
```

Створює spring/weight cue. Для crisp impact settle має бути коротким; для gelatin/water — довшим.

## 8.4. Staggered timing

Приклад:

| Layer | Start | Peak | End |
|---|---:|---:|---:|
| Anticipation motes | 0.00 | 0.14 | 0.28 |
| Primary slash | 0.16 | 0.38 | 0.52 |
| Contact accent | 0.36 | 0.40 | 0.44 |
| Secondary ring | 0.40 | 0.50 | 0.68 |
| Fragments | 0.42 | 0.58 | 0.86 |
| Residue | 0.56 | 0.76 | 1.00 |

Contact layers overlap, але peaks розділені на 0.02–0.18 normalized time.

## 8.5. Delayed secondary motion

Secondary має реагувати на cause:

- weapon moves → ribbon follows;
- contact happens → ring expands;
- ground cracks → debris rises;
- energy core collapses → outer wisps pull inward.

Delay може бути дуже малим, але direction of causality має бути зрозумілим. Якщо debris стартує до contact без anticipation reason, motion здається випадковим.

## 8.6. Anticipation і contrast

Anticipation часто використовує протилежність main action:

- inward → outward;
- small → large;
- slow → fast;
- dark → bright;
- backward → forward;
- stillness → burst.

Не додавай anticipation автоматично. Для hit spark, який повинен реагувати миттєво, anticipation належить animation/attack, а не impact itself.

## 8.7. Smear shapes

Smear — не motion blur copy. Це designed transitional silhouette.

Правила:

- aligned із dominant motion vector;
- живе коротше за main readable shape;
- спрощує detail;
- може мати tapered ends;
- не закриває contact accent;
- має працювати в real-time, а не лише frame-by-frame.

## 8.8. Stepped animation

Stepped look створюється intentional pose changes:

```text
Pose A hold 2 frames → Pose B hold 1 → Pose C hold 3 → dissolve
```

Це design plan, не вимога знизити engine tick rate. У real-time implementation stepped shape можна створити через flipbook frames, quantized parameter або held states, але конкретний method вивчається пізніше.

Ризик: held frame може flicker або виглядати laggy на різних frame rates. Перевіряй duration у seconds і real-time playback.

## 8.9. 2D/3D hybrid і camera

Camera-oriented primary може забезпечити macro-read, а world-space meshes/particles — parallax і volume.

Плануй:

- який layer повинен завжди дивитися в camera;
- який має бути world-aligned;
- який attached to weapon/character;
- де 3D layer може перетнути 2D silhouette;
- чи зникає thin plane під гострим angle;
- чи camera motion змінює perceived speed.

## 8.10. Rhythm у combo

Для трьох hits не копіюй один timing:

- Hit 1: setup і direction;
- Hit 2: shorter anticipation, altered direction;
- Hit 3: longest anticipation або pause, strongest contact, longer cleanup.

Гравець повинен відчути phrase, а не три однакові metronome pulses.

# 9. Візуальні або математичні приклади

## 9.1. Velocity як зміна position

Для design chart достатньо:

```text
average_speed = distance / time
```

Variant A проходить 600 px за 0.20 с:

```text
600 / 0.20 = 3000 px/s
```

Variant B проходить ті самі 600 px за 0.35 с:

```text
600 / 0.35 ≈ 1714 px/s
```

Це screen-space comparison, не world-unit simulation data.

## 9.2. Ease-out samples

Для normalized time points можна намалювати:

| t | Linear position | Ease-out-like position |
|---:|---:|---:|
| 0.00 | 0.00 | 0.00 |
| 0.25 | 0.25 | 0.44 |
| 0.50 | 0.50 | 0.75 |
| 0.75 | 0.75 | 0.94 |
| 1.00 | 1.00 | 1.00 |

Ease-out проходить більшу частину distance раніше, потім settle.

## 9.3. Overshoot

Scale samples:

| t | Scale |
|---:|---:|
| 0.00 | 0.00 |
| 0.35 | 0.70 |
| 0.55 | 1.12 |
| 0.72 | 0.96 |
| 1.00 | 1.00 |

Peak 1.12 має сенс тільки якщо final stable state існує. Для disappearing impact overshoot може закінчитися dissolve замість settle.

## 9.4. Phase density

```text
Anticipation:  low density
Main action:   narrow directional density
Contact:       highest local density
Dissipation:   spreading lower density
Residue:       sparse low-value density
```

Density має spatial і temporal аспекти. Багато layers не повинні лишатися high-density до кінця.

# 10. Controlled experiments

## Experiment 1 — Linear, ease-out, overshoot

Анімуй один circle від scale 0 до 1 за 12 frames:

- A: linear;
- B: fast ease-out;
- C: overshoot 1.15, settle 1.0.

Переглянь у real time й запиши perceived material/weight.

## Experiment 2 — Synchronous проти staggered

П’ять shapes:

- Version A: усі peak на frame 10.
- Version B: peaks на frames 7, 10, 12, 15, 19.

Не змінюй shapes або colors.

**Очікування:** B має readable sequence; A — один dense pulse.

## Experiment 3 — Continuous проти stepped

Створи eight-position arc:

- A: кожний frame нова position;
- B: positions утримуються 2/1/3/2 frames.

Переглянь на 24 fps і після export у реальному часі.

**Очікування:** stepped version stylized, але може стати jerky, якщо holds не підтримують accent rhythm.

## Experiment 4 — 2D plane під camera angle

Намалюй плоский slash board і три схематичні camera views: front, 35° yaw, 70° yaw.

**Очікування:** thin plane втрачає area на гострому angle; потрібен camera-facing layer, thickness або complementary world-space volume.

# 11. Покрокова керована практика

## Етап 1 — Визнач duration і contact

Створи abstract impact тривалістю `1.0 с`. Для planning timeline використовуй 24 fps, але всі важливі timestamps записуй також у seconds.

Початково:

- contact `0.40 с`;
- accent peak `0.42 с`;
- end main action `0.55 с`;
- residue end `1.00 с`.

## Етап 2 — Створи phase strip

```text
0.00–0.16 anticipation
0.12–0.24 activation
0.18–0.42 main action
0.38–0.44 contact
0.40–0.54 impact/accent
0.50–0.82 dissipation
0.64–1.00 residue
```

## Етап 3 — Признач layer bars

Використай шість layers:

1. anticipation motes;
2. primary smear;
3. contact accent;
4. secondary response;
5. supporting fragments;
6. residue.

Запиши Start/Peak/End.

## Етап 4 — Намалюй 8 key silhouettes

Frames/times:

- 0 / 0.00;
- 3 / 0.125;
- 6 / 0.25;
- 9–10 / 0.375–0.417;
- 12 / 0.50;
- 16 / 0.667;
- 20 / 0.833;
- 24 / 1.00.

Не додавай detail; тільки macro shapes.

## Етап 5 — Анімуй primary motion

1. Anticipation стискає energy назад від target.
2. Primary smear стартує швидко.
3. Length peak трохи раніше contact.
4. Width peak у contact.
5. Primary зникає до середини dissipation.

## Етап 6 — Додай accent

Accent:

- стартує 1–2 planning frames до contact;
- має peak близько contact;
- триває 1–3 frames у 24 fps animatic;
- не закриває primary direction.

У final UE effect duration буде задано seconds, а не припущенням про стабільні 24 fps.

## Етап 7 — Додай delayed secondary

- secondary response start після contact;
- fragments start разом або на 1 planning frame пізніше;
- secondary scale використовує fast ease-out;
- fragments мають різні end times;
- residue починається до повного зникнення fragments.

## Етап 8 — Додай overshoot або stepped motif

Обери одне:

- secondary ring scale `0 → 1.12 → 1.00 → dissolve`;
- або primary shape `Pose A hold 2 → smear 1 → contact pose 2`.

Не використовуй обидва, якщо rhythm стає надто busy.

## Етап 9 — Camera tests

Перевір animatic:

- у real time;
- на 50% speed лише для diagnosis;
- на 25% visual scale;
- front/35°/70° schematic views;
- з muted color;
- з primary або accent layer hidden.

## Етап 10 — Motion rationale

Для кожного layer напиши:

```text
Starts because:
Peaks when:
Ends because:
Motion path:
Curve character:
Camera risk:
```

# 12. Точні назви вузлів, модулів і налаштувань

Niagara modules у цьому design lesson не створюються. Точні implementation modules з’являться в блоках 07–09.

### Photoshop

- `Window > Timeline`
- `Create Frame Animation` або `Create Video Timeline`
- `Duplicate Selected Frames`
- frame delay control у `Timeline`
- `Onion Skins` доступність залежить від timeline mode/version
- `Layer > New > Layer`
- `Edit > Free Transform`
- `Layer Mask`

### Krita

- `Settings > Dockers > Animation Timeline`
- `Settings > Dockers > Onion Skins`
- `Create Duplicate Frame`
- `Create Blank Frame`
- `Animation Curves` docker, якщо доступний у встановленій версії
- `Transform Tool`

### Unreal Engine 5.8 vocabulary для майбутнього перенесення

- `Normalized Age`
- `Curve`
- `Lifetime`
- `System`, `Emitter`, `Module`
- `Particle Spawn`, `Particle Update`

Точні Niagara modules і curve UI будуть перевірені в UE 5.8 у відповідних уроках. Цей lesson не вимагає вигадувати implementation.

# 13. Стартові значення параметрів

| Параметр | Старт | Примітка |
|---|---:|---|
| Total duration | 1.0 с | Зручно для normalized planning |
| Planning frame rate | 24 fps | Лише animatic convention |
| Contact | 0.40 с | Перенеси на animation contact у gameplay |
| Accent duration | 0.04–0.12 с | Перевір real-time; не прив’язуй до fixed game fps |
| Anticipation | 12–18% duration | Для reactive hit може бути 0 |
| Main action | 18–42% | Напрямок має читатися до contact |
| Dissipation | 48–82% | Не всі layers мають жити до end |
| Residue start | 60–70% | Overlap із late fragments |
| Secondary delay | 0.02–0.10 с | Залежить від scale/weight |
| Overshoot | 1.08–1.15× | Більше може виглядати gelatinous |
| Settle undershoot | 0.94–0.98× | Не обов’язковий для disappearing shape |
| Stepped holds | 1–3 planning frames | Перевір у seconds і real-time |
| Key silhouettes | 8 | Додай лише при зміні motion logic |

# 14. Очікуваний результат кожного етапу

| Етап | Результат |
|---|---|
| Duration/contact | Є seconds і normalized time |
| Phase strip | Усі phases мають function й overlap |
| Layer bars | Start/Peak/End не синхронні |
| Key silhouettes | Видно preparation, direction, contact, response, cleanup |
| Primary | Direction читається до contact |
| Accent | Короткий focal peak |
| Secondary | Реагує після cause |
| Overshoot/stepped | Додає character, не руйнує clarity |
| Camera tests | Задокументовано front/oblique failures |
| Motion rationale | Кожний layer має causal explanation |

# 15. Самостійна вправа

## EX-L02-03-A — Односекундний impact animatic

**Завдання:** створи оригінальний 1.0-second abstract animatic із anticipation, main action, contact, impact, dissipation і residue.

**Обмеження:**

- 5–7 functional layers;
- normalized timeline і seconds;
- minimum 8 key silhouettes;
- contact між `t=0.32` і `t=0.48`;
- accent shorter than primary;
- щонайменше два delayed secondary layers;
- один overshoot або stepped motif;
- без proprietary contours/textures.

**Deliverables:**

1. Phase strip.
2. Layer timing chart.
3. Curve sketches для position, scale й value.
4. 8+ key silhouettes.
5. Real-time preview.
6. Camera-risk notes.
7. Motion rationale.

**Acceptance criteria:**

- direction читається до contact;
- contact очевидний у real time;
- peaks staggered;
- secondary motion causal;
- cleanup лишає кадр готовим до наступної action;
- effect читається у grayscale і 25% scale.

# 16. Додаткова складніша вправа

## EX-L02-03-B — Three-hit combo rhythm

**Завдання:** спроєктуй timing sheet для трьох melee hits як однієї phrase: setup, acceleration, finisher.

**Обмеження:**

- total duration 1.8–2.6 с;
- hits не можуть бути рівномірним metronome;
- Hit 1 встановлює direction;
- Hit 2 змінює direction або elevation;
- Hit 3 має distinct anticipation/pause і найбільший response;
- residue попереднього hit не може приховувати наступний contact;
- загальне покриття екрана перевіряється в overlap frames;
- не копіювати конкретну combo animation з reference.

**Deliverables:**

1. Combo beat chart.
2. Three local phase strips.
3. Shared layer-overlap chart.
4. 12-frame minimum storyboard.
5. Real-time animatic.
6. Cleanup/performance-risk analysis.

**Acceptance criteria:**

- три hits легко порахувати в real time;
- rhythm має setup → acceleration → finisher;
- кожний contact spatially readable;
- фінальний impact сильніший через hierarchy, а не просто більше всього;
- active residue контролюється.

# 17. Три рівні підказок

## EX-L02-03-A

- **Hint 1 — напрямок мислення:** спочатку постав contact, потім побудуй cause до нього та response після нього.
- **Hint 2 — потрібні інструменти:** phase strip, six layer bars, position/scale/value curves, 8 silhouettes, Timeline й grayscale playback.
- **Hint 3 — майже повна структура:** anticipation 0–0.16; primary 0.15–0.52 peak 0.39; accent 0.37–0.45; secondary 0.40–0.70; fragments 0.42–0.86; residue 0.60–1.00; ring overshoot 1.12→0.97→1.00.

[Повне рішення EX-L02-03-A](../EXERCISE_ANSWERS/L02-03_timing_motion_and_animation_phases_answers.md#ex-l02-03-a)

## EX-L02-03-B

- **Hint 1 — напрямок мислення:** думай музично: короткий setup, швидша відповідь, pause, сильний finisher.
- **Hint 2 — потрібні інструменти:** master timeline 0–1, три contact markers, per-hit layer bars, residue overlap row і screen-coverage snapshots.
- **Hint 3 — майже повна структура:** contacts приблизно 0.28/0.48/0.78 normalized; Hit 2 коротший; перед Hit 3 зроби negative pause; скороти residue H1 до contact H2, H2 — до anticipation H3.

[Повне рішення EX-L02-03-B](../EXERCISE_ANSWERS/L02-03_timing_motion_and_animation_phases_answers.md#ex-l02-03-b)

# 18. Типові помилки

1. Усі layers мають однакові Start/Peak/End.
2. Contact визначено після створення animation, а не до.
3. Accent довший за main action.
4. Secondary motion стартує до cause.
5. Overshoot застосовано до кожного channel.
6. Stepped animation виглядає як frame drop.
7. Smear є просто розтягнутою final shape без taper/direction.
8. Effect оцінюється лише в slow motion.
9. Frames використовуються як fixed gameplay time.
10. Combo складається з трьох однакових pulses.
11. Residue не очищається до наступної action.
12. Camera angle не враховано для 2D plane.

# 19. Troubleshooting

| Симптом | Причина | Виправлення |
|---|---|---|
| Contact «м’який» | Accent peak розтягнутий | Скороти accent, локалізуй value/edge peak |
| Effect відчувається одним flash | Усі peaks синхронні | Розведи primary, secondary, fragments і residue |
| Motion mechanical | Лінійні curves без phase contrast | Додай ease, pause, overshoot або directional change |
| Motion random | Немає causality | Для кожного layer запиши «starts because» |
| Stepped version laggy | Holds однакові й довгі | Зміни rhythm 2/1/3, скороти holds біля contact |
| Smear губить target | Надто wide/opaque | Звузь, offset або скороти duration |
| Oblique camera робить slash invisible | Thin plane edge-on | Додай thickness, camera-facing macro layer або complementary volume |
| Residue перекриває combo | Duration/area не зменшуються | Скороти lifecycle, lower value, reduce coverage |
| 24 fps animatic працює, game preview — ні | Timing задано frames, не seconds | Переведи всі events у seconds/normalized time |
| Finisher просто noisy | Сила додана кількістю layers | Підсилюй anticipation, pause, scale/value hierarchy |

# 20. Performance considerations

- Тривалість layer впливає на кількість одночасно active particles/Systems.
- Staggered timing не означає, що всі layers повинні overlap до кінця.
- Residue є частим джерелом накопичення під час combo або rapid fire.
- Smear shape може замінити багато motion-indicating particles.
- Stepped flipbook/shape зміни можуть потребувати texture frames; memory і sampling перевіряються пізніше.
- Overshoot, що збільшує screen area, може коротко підвищити overdraw у peak.
- Camera-facing solution покращує readability, але не скасовує depth/culling tests.
- Найдорожчий момент часто збігається з maximum layer overlap, а не з найбільшою кількістю frames.
- Зафіксуй `peak overlap frame` для майбутнього profiling у блоках 09–10.
- Не встановлюй числові target budgets без representative hardware.

# 21. Запитання для самоперевірки

1. Чим contact відрізняється від impact?
2. Навіщо використовувати normalized time?
3. Назви п’ять окремих motion channels.
4. Що робить ease-out?
5. Коли другорядний рух є causal?
6. Чим smear shape відрізняється від випадково розтягнутої shape?
7. Чому stepped animation не означає обов’язкове зниження engine tick rate?
8. Який ризик має residue у combo?
9. Як зробити finisher сильнішим без простого збільшення particle count?
10. Що таке peak overlap frame?

# 22. Відповіді

1. Contact — момент зустрічі з target; impact — візуальна реакція на цю зустріч.
2. Щоб переносити proportions на effects різної duration і порівнювати rhythm.
3. Position, scale, rotation, opacity/value, color, shape frame, width/length — будь-які п’ять.
4. Дає швидкий початок і поступове уповільнення до target.
5. Коли його start і direction логічно випливають із primary event.
6. Він intentional, aligned із motion vector, короткий, tapered і спрощує details.
7. Stepped look — це held visual states у часі; engine може продовжувати оновлюватися кожний frame.
8. Накопичення active layers, покриття екрана і occlusion наступного contact.
9. Через довший/чіткіший anticipation, pause, scale/value contrast, distinct direction і response.
10. Момент, коли найбільше дорогих або великих layers одночасно видимі; його треба профілювати.

# 23. Self-check checklist

- [ ] Total duration записано в seconds і normalized time.
- [ ] Contact визначено до animation.
- [ ] Є всі потрібні phases.
- [ ] Layer bars мають різні peaks.
- [ ] Primary direction читається до contact.
- [ ] Accent коротший за primary.
- [ ] Secondary реагує після cause.
- [ ] Використано один justified overshoot або stepped motif.
- [ ] Smear aligned із motion.
- [ ] Real-time playback перевірено.
- [ ] Grayscale і 25% scale перевірено.
- [ ] Camera-angle risks записано.
- [ ] Residue очищає frame.
- [ ] Peak overlap frame позначено для profiling.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. односекундний animatic має чіткі anticipation, contact, response і cleanup;
2. Start/Peak/End усіх layers пояснені;
3. щонайменше два secondary layers мають causal delay;
4. effect читається у real time, а не лише покадрово;
5. stepped/overshoot motif підсилює character;
6. 2D/3D camera risk визначено;
7. combo rhythm не є рівномірним;
8. виконано щонайменше 12 із 14 checklist пунктів.

# 25. Підсумок

Timing визначає причинність і weight. Сильний stylized effect має підготовку, напрямок, точний contact, staggered response і контрольований cleanup. Curves, smear, stepped poses й overshoot — це не прикраси, а способи зробити gameplay event зрозумілим у реальному часі.

# 26. Зв’язок із наступними уроками

У `04_elemental_style_language_workbook.md` shape, value і timing об’єднаються в system для fire, water, ice, electricity, wind, earth, nature, light і darkness/void. Пізніше кожна language буде повторена в окремому archetype lesson блока 09.

# 27. Офіційні джерела

- Epic Games. [Creating Visual Effects in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-visual-effects-in-niagara-for-unreal-engine). UE 5.8. Загальний контекст Systems/Emitters для майбутнього перенесення timing plan.
- Epic Games. [System and Emitter Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-and-emitter-module-reference-for-niagara-effects-in-unreal-engine). UE 5.8. Офіційний reference для Spawn/Update concepts; exact module setup з’явиться в блоці 07.
- Epic Games. [System Settings Reference for Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine). UE 5.8. Lifecycle/system context.
- Epic Games. [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara). UE 5.8. Підстава профілювати peak overlap у representative scene.
- Epic Games. [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara). UE 5.8. Контекст active effects, complexity і scalability.

# 28. Рекомендовані скриншоти або схеми

```text
Рекомендована схема 1:
Що показати: normalized phase strip 0–1.
Що повинно бути видно: overlapping anticipation, main action, contact, impact, dissipation, residue.
Яку область виділити: contact line та accent window.
```

```text
Рекомендована схема 2:
Що показати: position/scale/value curves одного primary layer.
Що повинно бути видно: різні curve shapes і різні peak times.
Яку область виділити: overshoot/settle або fast ease-out.
```

```text
Рекомендований скриншот 3:
Що відкрити: Photoshop Timeline або Krita Animation Timeline.
Що повинно бути видно: 8 key silhouettes, held frames і staggered layers.
Яку область виділити: short accent та delayed secondary.
```

```text
Рекомендована схема 4:
Що показати: three-hit combo master timeline.
Що повинно бути видно: три нерівномірні contact markers, pause before finisher, residue rows.
Яку область виділити: peak overlap frames.
```
