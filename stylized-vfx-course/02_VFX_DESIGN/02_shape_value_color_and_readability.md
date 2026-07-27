# 1. Назва

## Урок 02.02 — Shape, value, color, negative space і gameplay readability

# 2. Результат уроку

Після уроку ти зможеш:

- перетворити layer breakdown на цілісну screen-space композицію;
- обрати shape family відповідно до gameplay intent;
- побудувати primary, secondary та accent hierarchy;
- використовувати negative space як активну частину silhouette;
- створити three-value plan до вибору кольору;
- призначити dominant, supporting і accent colors за функцією;
- оцінити screen-space footprint у gameplay camera;
- перевірити design на різних backgrounds, scale і camera angles;
- створити три композиційні boards, які передають різний характер однієї дії.

Ключовий результат — `Readability Board`: silhouette, value, color і gameplay-camera tests для оригінального effect concept.

# 3. Орієнтовний час

**6 годин: 2 години теорії та 4 години практики.**

| Частина | Час |
|---|---:|
| Shape hierarchy і negative space | 45 хв |
| Value/color hierarchy | 45 хв |
| Screen-space і camera tests | 30 хв |
| Controlled experiments | 45 хв |
| Guided practice | 1 год 45 хв |
| Самостійні вправи, self-check і журнал | 1 год 30 хв |

# 4. Prerequisites

- Завершено урок `02.01`.
- Є власний `Reference Breakdown Sheet`.
- Студент уміє створювати primitive shapes і Adjustment Layers у Photoshop або Krita.
- Зафіксовано gameplay camera у UE 5.8 test level.

# 5. Нові терміни

| Термін | Пояснення | Практичний тест |
|---|---|---|
| **Silhouette** | Зовнішній контур сукупної форми | Чи впізнається action як суцільна біла пляма? |
| **Shape family** | Споріднена група форм: wedge, arc, radial, column, cluster, ribbon тощо | Чи підтримують secondary shapes характер primary? |
| **Negative space** | Порожня область усередині або навколо композиції | Чи є місце для target, weapon і наступної action? |
| **Value** | Відносна світлість, незалежна від hue | Чи зберігається hierarchy у grayscale? |
| **Value group** | Діапазон близьких values, що читається як один рівень | Чи є 2–4 чіткі групи замість шуму? |
| **Dominant color** | Колір із найбільшою площею або тривалістю | Чи задає він identity, не забираючи peak? |
| **Accent color** | Малий, контрастний color role для focal moment | Чи збігається він із gameplay-important event? |
| **Visual mass** | Сприйнята вага форми через площу, value, edge density і position | Чи primary справді домінує? |
| **Tangency** | Небажане торкання контурів, що зливає два об’єкти | Чи відокремлені weapon, target і effect edges? |
| **Screen coverage** | Частка viewport, яку займає effect | Чи не перекриває effect інформацію? |
| **Macro-read** | Сприйняття великих форм за короткий час або на малому scale | Чи читається board на 25% zoom? |
| **Camera envelope** | Набір ракурсів і дистанцій, де effect має працювати | Чи design стабільний поза hero angle? |

# 6. Навіщо ця тема потрібна VFX artist

Навіть технічно складний effect провалюється, якщо гравець не розуміє:

- звідки прийшла атака;
- де стався contact;
- яка зона небезпечна;
- чи effect належить персонажу, target або environment;
- коли дія закінчилася.

Shape, value і color — не косметичний polish. Це канали передачі gameplay information. Сильна hierarchy також допомагає performance: коли primary message чіткий, не потрібно додавати десятки декоративних layers для компенсації слабкої композиції.

# 7. Теорія простими словами

Будуй effect у такому порядку:

1. **Одна велика форма:** що гравець повинен побачити першим?
2. **Порожнє місце:** що не можна перекрити?
3. **Три рівні світлості:** де quiet, support і peak?
4. **Color roles:** який колір несе identity, а який — подію?
5. **Дрібні деталі:** лише якщо вони підсилюють direction, scale або material.

Якщо почати з particles, noise і glow, ти швидко отримаєш складну картинку без чіткого повідомлення. Якщо почати із silhouette, effect уже працює до implementation.

# 8. Детальні технічні пояснення

## 8.1. Shape family як дієслово

Типові associations треба використовувати як starting hypotheses, а не абсолютні правила:

| Shape family | Часто передає | Ризик |
|---|---|---|
| Wedge / chevron | Напрямок, прорізання, прискорення | Надто тонкий shape зникає на distance |
| Arc / crescent | Swing, orbit, sweep | Може зливатися з weapon trail |
| Radial ring / burst | Impact, area, release | Великий screen coverage |
| Column / vertical spike | Ascension, summon, authority | Перекриває character silhouette |
| Cluster / cloud | Volume, smoke, corruption | Слабкий direction |
| Ribbon / S-curve | Flow, grace, continuity | Camera-dependent overlap |
| Block / shard | Weight, fracture, solidity | Висока edge density |

Обери primary family за gameplay verb. Secondary shapes можуть контрастувати, але не повинні скасовувати напрямок primary.

## 8.2. Primary, secondary, accents

Training starting ratio:

- primary: приблизно 55–70% perceived visual mass;
- secondary: разом 20–35%;
- accents: 5–15%.

Це не production law. Visual mass залежить не лише від pixel area: маленька white shape може переважити велику dark shape. Використовуй ratio як діагностичний старт, потім перевіряй thumbnail.

Primary має відповідати на одне питання. Якщо два primary shapes однаково сильні, гравець не знає, куди дивитися.

## 8.3. Negative space

Negative space потрібен:

- навколо target silhouette;
- між primary і secondary groups;
- усередині ring або magic shape;
- попереду direction vector;
- у зоні UI або reticle, яку effect не повинен закривати.

Корисний тест: зафарбуй effect білим, character/target — сірим. Якщо boundaries торкаються по довгій ділянці, виникає tangency. Зміни offset, scale або angle.

## 8.4. Three-value hierarchy

Початкові групи:

- `V1 Quiet`: 15–30%;
- `V2 Support`: 45–65%;
- `V3 Peak`: 85–100%.

Не використовуй 100% у всіх layers. Peak повинен бути локальним і коротким. Якщо весь effect white, value перестає показувати hierarchy.

Порядок:

1. створити grayscale;
2. перевірити на 25% scale;
3. застосувати slight blur або squint test;
4. лише потім призначити hue.

## 8.5. Color roles

Color plan відповідає на три питання:

1. Який color family задає identity?
2. Який color або neutral value позначає peak?
3. Який low-energy color залишається в residue?

Training distribution за видимою площею:

- dominant: 60–80%;
- supporting: 15–30%;
- accent: 5–10%.

Це starting range. Невеликий accent може домінувати через value/chroma contrast. Перевіряй не RGB numbers, а роль у context.

Не покладайся лише на hue. Friendly/enemy, safe/dangerous або weak/ultimate повинні відрізнятися також shape, timing, direction, edge language чи scale.

## 8.6. Edge hierarchy

Hard edges привертають увагу. Soft edges створюють atmosphere та dissipation.

Корисна структура:

- primary direction edge — hard або medium;
- peak accent — найчіткіший edge;
- secondary volume — mixed;
- residue — soft і fragmented.

Якщо кожний particle має crisp edge, effect стає noisy. Якщо все soft, зникає contact.

## 8.7. Screen-space footprint

Оціни effect на трьох distances:

- `Near`: найбільший допустимий gameplay size;
- `Nominal`: основна дистанція;
- `Far`: effect ще має повідомляти gameplay event.

Стартовий test set для власного level:

- nominal camera;
- camera на 50% ближче;
- camera на 50% далі;
- yaw ±35°;
- pitch ±20°.

Це training envelope, а не універсальна game specification. Якщо реальний game camera має інші межі, заміни numbers і зафіксуй їх.

## 8.8. Readability tests

Проведи:

- `Silhouette test`: весь effect білий;
- `Grayscale test`: hue прибрано;
- `25% thumbnail test`;
- `100 ms glance test`: швидко показати frame й записати перше прочитання;
- `Background test`: dark, mid-gray, light, warm busy, cool busy;
- `Target visibility test`;
- `Camera envelope test`;
- `Layer mute test`: прибирати layers по одному.

# 9. Візуальні або математичні приклади

## 9.1. Visual mass approximation

Для порівняння двох flat shapes можна використати грубу модель:

```text
mass_score = normalized_area × value_weight × edge_weight
```

Приклад:

- Primary area `0.60`, value weight `0.70`, edge weight `1.0`: score `0.42`.
- Accent area `0.08`, value weight `1.0`, edge weight `1.4`: score `0.112`.

Accent значно менший, але все одно помітний. Це не perceptual truth і не engine metric; лише спосіб помітити, чому маленький bright hard-edged element може конкурувати з primary.

## 9.2. Screen coverage

Для axis-aligned bounding rectangle:

```text
coverage ≈ effect_bbox_area / viewport_area
```

Порівнюй не «допустимо/недопустимо», а variants A/B/C у тому самому viewport. Якщо variant B займає вдвічі більшу площу без додаткової gameplay information, це причина спростити його.

## 9.3. Three-value board

```text
Background: 20%
Residue:    28%
Primary:    58%
Secondary:  48%
Accent:     95%
Target:     40%
```

Primary відокремлений від background і target, accent має запас для peak, residue не конкурує.

## 9.4. Negative-space diagram

```text
attack direction →

[weapon]  >>> PRIMARY >>>   (empty lane)   [target]
                 \ secondary

```

Empty lane попереду primary допомагає читати direction. Якщо заповнити її particles, vector слабшає.

# 10. Controlled experiments

## Experiment 1 — Одна дія, три shape families

Створи white-on-black thumbnails одного impact:

- A: wedge;
- B: radial burst;
- C: vertical column.

Покажи кожний на 0.5 секунди. Запиши перше дієслово: «ріже», «вибухає», «піднімає» тощо.

**Контрольована змінна:** shape family.  
**Очікування:** silhouette змінює сприйняття навіть без кольору.

## Experiment 2 — Accent area

Зроби три versions:

- accent 25% visual mass;
- accent 10%;
- accent 3%.

Перевір на 100% і 25% scale.

**Очікування:** великий accent захоплює весь effect, надто малий зникає; middle version частіше зберігає hierarchy.

## Experiment 3 — Hue without value

Створи дві однаково світлі shapes із різними hues. Потім зроби grayscale.

**Очікування:** hue contrast може зникнути у grayscale; важлива gameplay difference не повинна залежати лише від hue.

## Experiment 4 — Busy background

Перевір один board на п’яти backgrounds. Не змінюй effect.

**Очікування:** слабкі edges або близькі values зникнуть лише в частині contexts; це показує, де потрібні outline, value shift, scale або cleanup.

# 11. Покрокова guided practice

## Етап 1 — Сформулюй gameplay sentence

Наприклад:

> «Швидкий diagonal slash проходить зліва направо, contact відбувається праворуч від персонажа, target має залишатися видимою».

Речення визначає direction і protected negative space.

## Етап 2 — Створи camera frame

1. Візьми власний screenshot test level.
2. Зменш saturation або зроби grayscale copy.
3. Познач character, weapon, target, reticle/UI-safe area.
4. Намалюй effect bounding box.

## Етап 3 — Побудуй primary silhouette

1. Обери одну shape family.
2. Використай одну solid white shape.
3. Перевір 25% thumbnail.
4. Переверни canvas horizontally: direction має лишитися очевидним.
5. Якщо shape нагадує blob, збільш directional taper або asymmetry.

## Етап 4 — Виріж negative space

1. Залиши clear pocket навколо target.
2. Відокрем primary від weapon silhouette.
3. Прибери tangencies.
4. Створи одну internal gap, якщо shape надто масивна.

## Етап 5 — Додай secondary shapes

Додай максимум три groups:

- один для volume;
- один для delayed motion;
- один для scale/material cue.

Кожний secondary повинен бути слабшим при blur/thumbnail test.

## Етап 6 — Побудуй values

1. Background 20%.
2. Primary 55–65%.
3. Secondary 40–55%.
4. Accent 90–100%.
5. Residue 25–40%.
6. Перевір grayscale histogram візуально: не потрібно точного рівного розподілу.

## Етап 7 — Признач color roles

1. Обери dominant family.
2. Залиш supporting color близьким або нейтральним.
3. Accent відрізни value і, за потреби, hue/chroma.
4. Перевір dark/light/warm/cool backgrounds.
5. Зроби grayscale copy.

## Етап 8 — Додай edge hierarchy

- contact accent — crisp;
- primary leading edge — crisp/medium;
- trailing edge — broken;
- residue — soft;
- decorative particles — не гостріші за accent.

## Етап 9 — Створи три composition boards

Для тієї самої gameplay sentence:

- `Board A — Speed`: вузький wedge, forward spacing, короткий residue.
- `Board B — Weight`: compact primary, ширший contact response, vertical debris.
- `Board C — Arcane precision`: controlled geometric negative spaces, малий sharp accent.

Не змінюй лише color.

## Етап 10 — Camera/readability matrix

Для кожного board постав `Pass/Revise`:

| Test | Near | Nominal | Far |
|---|---|---|---|
| Primary direction |  |  |  |
| Target visible |  |  |  |
| Accent readable |  |  |  |
| Background separation |  |  |  |
| Screen coverage justified |  |  |  |

# 12. Точні назви nodes, modules і settings

Material nodes і Niagara modules у цьому design lesson не використовуються.

### Photoshop

- `Rectangle Tool`
- `Ellipse Tool`
- `Polygon Tool`
- `Pen Tool`
- `Brush Tool`
- `Layer Mask`
- `Layer > New Adjustment Layer > Black & White`
- `Layer > New Adjustment Layer > Hue/Saturation`
- `Layer > New Adjustment Layer > Levels`
- `Filter > Blur > Gaussian Blur` лише як temporary macro-read test
- `View > New Guide Layout` за потреби для thirds/center guides

### Krita equivalents

- `Rectangle Tool`, `Ellipse Tool`, `Polygon Tool`, `Bezier Curve Tool`
- `Transparency Mask`
- `Filter Mask`
- `Filter > Adjust > HSV Adjustment`
- `Filter > Adjust > Levels`
- `Filter > Blur > Gaussian Blur`

### Unreal Engine 5.8

- `Level Editor Viewport`
- `CameraActor` або gameplay camera, уже створена в test level
- `Field Of View` — не змінювати між variants усередині одного comparison
- `High Resolution Screenshot` — тільки для власного test level

Точне розташування UI commands потребує ручної перевірки у встановлених версіях програм.

# 13. Стартові значення параметрів

| Параметр | Старт | Що зміниться |
|---|---:|---|
| Board | 1920×1080 | Інший aspect ratio змінює composition |
| Background | 20% gray | На light background потрібен окремий contrast test |
| Primary visual mass | 55–70% | Більше — сильніше dominance, але більший occlusion |
| Secondary total | 20–35% | Більше — більше context, але більше clutter |
| Accent | 5–15% | Більше — accent може стати primary |
| Value groups | 3 | 2 простіші; 4+ потребують сильнішої discipline |
| Quiet value | 15–30% | Вище — residue починає конкурувати |
| Support value | 45–65% | Нижче — губиться на dark background |
| Peak value | 85–100% | Якщо peak довгий, hierarchy flatten |
| Dominant color area | 60–80% | Менше — identity може розпастися |
| Accent color area | 5–10% | Більше — color accent перестає бути accent |
| Camera yaw tests | 0°, ±35° | Більший angle може потребувати 3D redesign |
| Camera distance | 0.5×, 1×, 1.5× nominal | Показує near/far failure |

Усі ratios є навчальними стартовими значеннями, а не універсальними production budgets.

# 14. Очікуваний результат кожного етапу

| Етап | Очікуваний результат |
|---|---|
| Gameplay sentence | Одна дія, direction і protected information |
| Camera frame | Видно character/target/UI-safe zones |
| Primary | Читається white silhouette на 25% |
| Negative space | Немає tangency, target не перекритий |
| Secondary | Уточнюють, але не змінюють focal order |
| Values | Three-value hierarchy survives grayscale |
| Colors | Identity та accent мають різні ролі |
| Edges | Найчіткіша область збігається з gameplay peak |
| Three boards | Speed, weight і arcane precision відрізняються shape logic |
| Matrix | Виявлено конкретні Pass/Revise для camera envelope |

# 15. Самостійна вправа

## EX-L02-02-A — Три composition boards однієї дії

**Завдання:** для однієї gameplay sentence створи три оригінальні boards: `Speed`, `Weight`, `Precision`. Кожний повинен відрізнятися shape, negative space, value distribution і edge language.

**Обмеження:**

- одна й та сама camera frame та target position;
- лише primitive/vector shapes і simple brushes;
- максимум 1 primary, 3 secondary groups і 2 accents;
- спочатку grayscale, потім color;
- кожний board перевірити на 25% scale та п’яти backgrounds;
- не використовувати traced proprietary symbols або contours.

**Deliverables:**

1. Gameplay sentence.
2. Три silhouette thumbnails.
3. Три three-value boards.
4. Три color boards.
5. Camera/readability matrix.
6. Коротке пояснення design choices.

**Acceptance criteria:**

- action однакова, характер трьох boards різний;
- кожний board працює без color;
- target visible у nominal camera;
- accent не конкурує з primary;
- revisions обґрунтовані тестами.

# 16. Додаткова складніша вправа

## EX-L02-02-B — Friendly buff і enemy telegraph в одному кадрі

**Завдання:** спроєктуй одночасно видимі `Friendly Buff` і `Enemy Telegraph`, які не плутаються на dark, light, warm та cool backgrounds.

**Обмеження:**

- не можна розрізняти effects лише hue;
- обидва effects мають окремі shape family, edge language і timing implication;
- character і target silhouettes повинні лишатися видимими;
- telegraph має чітко показувати area boundary;
- buff має читатися як attached/supportive, а не ground danger;
- перевірити grayscale і 25% scale.

**Deliverables:**

1. Shape grammar table для двох effects.
2. Grayscale combined frame.
3. Color combined frame.
4. Чотири background tests.
5. Near/nominal/far matrix.
6. Failure analysis і revised version.

**Acceptance criteria:**

- effects відрізняються без hue;
- telegraph boundary не губиться;
- buff не перекриває combat pose;
- revised version виправляє documented failure;
- жоден design не копіює конкретний game symbol.

# 17. Три рівні підказок

## EX-L02-02-A

- **Hint 1 — напрямок мислення:** не змінюй gameplay verb; змінюй відчуття через proportion, direction, edge density та distribution of mass.
- **Hint 2 — потрібні інструменти:** primitive shapes, masks, three-value palette, Black & White check, Gaussian Blur macro test і camera matrix.
- **Hint 3 — майже повна структура:** Speed = narrow forward wedge + long gap + short residue; Weight = compact block + broad ground response + vertical fragments; Precision = geometric arc + internal negative space + small sharp accent.

[Повне рішення EX-L02-02-A](../EXERCISE_ANSWERS/L02-02_shape_value_color_and_readability_answers.md#ex-l02-02-a)

## EX-L02-02-B

- **Hint 1 — напрямок мислення:** признач різні «дієслова»: buff огортає/піднімає, telegraph обмежує/попереджає.
- **Hint 2 — потрібні інструменти:** attached vertical/open shapes для buff, closed ground boundary для telegraph, distinct edge rhythm, grayscale/background/camera tests.
- **Hint 3 — майже повна структура:** buff = upward broken S-curves з open center; telegraph = low flat segmented ring із inward ticks; accent buff на activation, telegraph accent на imminent trigger.

[Повне рішення EX-L02-02-B](../EXERCISE_ANSWERS/L02-02_shape_value_color_and_readability_answers.md#ex-l02-02-b)

# 18. Типові помилки

1. Починати з color і noise до silhouette.
2. Робити primary та secondary однаково яскравими й великими.
3. Заповнювати negative space decorative particles.
4. Використовувати hue як єдину відмінність gameplay states.
5. Перевіряти лише hero screenshot.
6. Залишати long tangency між effect і weapon/target.
7. Робити всі edges однаково crisp.
8. Вважати training ratios універсальними правилами.
9. Додавати glow, щоб приховати слабкий value plan.
10. Зберігати exact proprietary symbol, змінивши лише колір.

# 19. Troubleshooting

| Симптом | Причина | Виправлення |
|---|---|---|
| Primary губиться на 25% | Надто thin, low value або fragmented | Збільш macro shape, taper і value separation |
| Accent стає головною формою | Завелика area/value/edge contrast | Зменш area або duration; поверни dominant mass primary |
| Target зливається з effect | Tangency та близькі values | Створи negative-space pocket або зміни offset |
| Color version працює, grayscale — ні | Відмінність лише hue | Розведи values, edges або shapes |
| На light background усе зникає | Немає dark support/outline | Додай localized dark support або змінюй value range |
| Near camera effect перекриває екран | Bounding envelope не врахований | Скороти scale, depth layers або create camera-aware variant |
| Far camera effect перетворюється на noise | Деталі дрібніші за macro-read | Залиш primary/peak, прибери дрібні secondary |
| Three boards виглядають однаково | Змінено лише color/particles | Зміни shape family, proportions, negative space та edges |
| Busy background робить clutter | Забагато equally crisp details | Зменш edge density та локалізуй peak |

# 20. Performance considerations

- Велика visual mass часто означає більший translucent screen coverage, але фактичну вартість треба виміряти.
- Soft glow, smoke й broad gradients можуть створювати overdraw навіть при малій кількості particles.
- Вузький crisp shape інколи передає direction дешевше, ніж багато streak particles.
- Декоративний color noise не виправляє value hierarchy, зате може вимагати додаткових layers/textures.
- Negative space є безкоштовним design tool: воно покращує readability без додавання particles.
- Far-camera version часто може мати менше layers і сильніший macro shape.
- Не призначай числовий particle або millisecond budget у design board; записуй, що треба перевірити в representative scene.
- Якщо два layers мають однакову shape/timing/function, спробуй об’єднати їх до implementation.

# 21. Запитання для самоперевірки

1. Чому shape family варто обирати за gameplay verb?
2. Що таке visual mass і чому вона не дорівнює лише pixel area?
3. Яку функцію виконує negative space?
4. Чому весь effect не повинен постійно мати value 100%?
5. Чому friendly/enemy не можна розрізняти лише hue?
6. Назви щонайменше п’ять readability tests.
7. Що таке tangency?
8. Як відрізняються edge roles primary, accent і residue?
9. Чому training ratios не є production budgets?

# 22. Відповіді

1. Shape family вже передає характер дії: direction, expansion, weight, flow або enclosure.
2. Visual mass залежить від area, value, edge contrast, position і context; маленький bright accent може бути дуже важким.
3. Воно відділяє groups, захищає target/UI, показує direction і зменшує clutter.
4. Тоді зникає запас для peak і всі layers конкурують.
5. Hue може втратитися у grayscale, на іншому background або для різного сприйняття; потрібні shape/timing/edge differences.
6. Silhouette, grayscale, 25% thumbnail, 100 ms glance, background, target visibility, camera envelope, layer mute.
7. Небажане торкання contours, через яке shapes зливаються або створюють випадковий joint.
8. Primary має стабільний macro edge, accent — найчіткіший локальний edge, residue — soft/broken edge.
9. Це навчальні starting points; фактичні constraints залежать від camera, game, platform і profiler measurements.

# 23. Self-check checklist

- [ ] Gameplay sentence визначає direction і protected information.
- [ ] Primary читається у white silhouette.
- [ ] Є intentional negative space.
- [ ] Немає довгих tangencies з character/target.
- [ ] Secondary shapes підтримують primary.
- [ ] Grayscale має 2–4 чіткі value groups.
- [ ] Peak value локальний.
- [ ] Color roles задокументовані.
- [ ] Gameplay differences не залежать лише від hue.
- [ ] Проведено 25% thumbnail test.
- [ ] Проведено п’ять background tests.
- [ ] Проведено near/nominal/far camera test.
- [ ] Screen coverage порівняно між variants.
- [ ] Proprietary shapes або symbols не trace-илися.

# 24. Mastery criteria

Урок засвоєно, якщо:

1. ти створив три distinct boards для однієї gameplay action;
2. кожний board читається у silhouette та grayscale;
3. primary, secondary й accent hierarchy пояснені;
4. negative space захищає target і direction;
5. color roles не замінюють value design;
6. camera/readability matrix містить реальні failures і revisions;
7. щонайменше 12 із 14 self-check пунктів виконано;
8. рішення створено без tracing і без покрокового туторіалу.

# 25. Підсумок

Gameplay-readable effect починається не з glow і particles, а з дієслова, silhouette та порожнього місця. Value визначає focal order, color уточнює identity, edges керують увагою, а camera tests показують, чи працює design поза hero frame.

# 26. Зв’язок із наступними уроками

У `03_timing_motion_and_animation_phases.md` статичні boards отримають temporal structure. Ти спроєктуєш anticipation, activation, main action, contact, impact, accent frame, dissipation і residue; навчишся staggered timing, overshoot, smear shapes і stepped animation.

# 27. Офіційні джерела

- Epic Games. [Guidelines for Optimizing Rendering for Real Time](https://dev.epicgames.com/documentation/en-us/unreal-engine/guidelines-for-optimizing-rendering-for-real-time-in-unreal-engine). UE 5.8. Rendering trade-offs і необхідність перевіряти content у real-time context.
- Epic Games. [Introduction to Performance Profiling and Configuration](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine). UE 5.8. Контекст representative scene та bottleneck-oriented review.
- Epic Games. [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara). UE 5.8. Підстава не замінювати profiler design-stage оцінками coverage.
- Epic Games. [Scalability and Best Practices for Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara). UE 5.8. Загальна production орієнтація для простіших і масштабованих effects.

# 28. Рекомендовані скриншоти або схеми

```text
Рекомендована схема 1:
Що показати: одна gameplay sentence та три white silhouettes Speed/Weight/Precision.
Що повинно бути видно: різні shape families при однаковій target position.
Яку область виділити: primary direction і protected negative space.
```

```text
Рекомендований скриншот 2:
Що відкрити: Photoshop/Krita document з grayscale та color board поруч.
Що повинно бути видно: three-value hierarchy, dominant/support/accent roles.
Яку область виділити: локальний peak.
```

```text
Рекомендована схема 3:
Що показати: tangency failure і виправлений negative-space pocket.
Що повинно бути видно: contour target до/після revision.
Яку область виділити: місце небажаного злиття.
```

```text
Рекомендований скриншот 4:
Що відкрити: один board на dark, light, warm busy і cool busy backgrounds.
Що повинно бути видно: де primary/telegraph boundary зникає.
Яку область виділити: конкретну revision — value, scale, offset або edge.
```
