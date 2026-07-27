# Block 11 Assessment — Portfolio Projects

## Статус, час і результат

Це фінальна атестація блоку `11_PORTFOLIO_PROJECTS`. Вона виконується **всередині 6 годин L11.05** і не додає годин до програми:

- block total лишається **46 годин: 6 theory / 40 practice**;
- M/S practice лишається **6 годин**;
- assessment evidence — фінальні versions, captures, case studies і delivery package, які створюються у L11.05;
- threshold assessment: **`≥80/100`** плюс усі category і project gates.

Результат: чотири оригінальні production-friendly PC/console gameplay VFX pieces, чотири повні case studies, reel і доказовий delivery package. Завершення assessment або курсу **не гарантує працевлаштування, interview чи offer**.

## Умови допуску

До assessment допускаються:

- `Resonant Edge`, `Triune Relay`, `Glassbloom Ward`, `Rift Crown`;
- final High/Medium/Low versions;
- target gameplay і neutral capture setup;
- source/license/authorship logs;
- profiling evidence;
- власні VFX textures, meshes, materials, Niagara й Blueprint integration;
- lawful third-party character/animation/environment/audio assets із точним disclosure.

Якщо piece має відомий critical gameplay error, proprietary/uncredited asset або не запускається у target build, спочатку виправте це й лише потім починайте assessment.

## Дозволені й заборонені ресурси

### Дозволено

- офіційна Unreal Engine documentation;
- власні notes, source/license records і попередні profiler logs;
- final project assets, створені протягом L11.01–L11.04;
- ваш власний brief, rubric, bug log і capture checklist;
- UE editor/debug/profiling tools;
- lawful non-tutorial references на принципи timing, form, material і presentation.

### Заборонено під час першої спроби й remediation

- будь-які **покрокові text/video tutorials**, за якими повторюється готовий effect, breakdown, reel або case study;
- готові покрокові solutions, answer walkthroughs чи project files інших авторів;
- усі `EXERCISE_ANSWERS/L11-01...L11-05...` під час assessment;
- `EXERCISE_ANSWERS/B11_BLOCK_ASSESSMENT_KEY.md` до офіційного завершення/оцінювання спроби;
- ripped, extracted, confidential або proprietary game/client assets;
- копіювання recognizable branded ability, exact graph/system або palette+shape+timing bundle;
- приховування проблем іншим camera, exposure, playback speed чи edited profiler condition;
- unverifiable claims: `AAA quality`, `zero cost`, `console optimized`, `production ready`, `solo/original` без точного scope/evidence;
- Beta/Experimental dependency.

Перед відкриттям ключа студент самостійно записує `AttemptID`, локальний час і file timestamp в assessment log та додає capture цього запису. Якщо key/tutorial використано до зафіксованого завершення self-review спроби, спроба не зараховується; виконується нова variation/capture після remediation. Optional peer може пізніше перевірити log, але не є умовою проходження.

## Submission manifest

```text
B11_Assessment_Submission/
├─ 00_README_and_Manifest
├─ 01_Reel
├─ 02_Resonant_Edge
│  ├─ Gameplay_Neutral
│  ├─ Layers_Assets_Materials_Niagara_BP
│  ├─ Performance_HML
│  └─ Case_Study_Authorship_Limitations
├─ 03_Triune_Relay/
├─ 04_Glassbloom_Ward/
├─ 05_Rift_Crown/
├─ 06_Cross_Project_Performance
├─ 07_Credits_Licenses
└─ 08_Assessment_Forms
```

Кожна piece обов’язково має:

1. real-time gameplay capture;
2. neutral technical capture;
3. ethical reference-principles board;
4. layer/timing/state map;
5. own textures/meshes;
6. material graphs/functions/instances;
7. full Niagara stacks;
8. Blueprint/gameplay integration;
9. identical-condition performance before/after;
10. High/Medium/Low evidence;
11. authorship/source/license table;
12. honest limitation і next iteration.

## Assessment protocol

1. Заморозьте version/build і скопіюйте manifest.
2. Заповніть target condition sheet: hardware, build, resolution, profile, intended frame target, route, duration, spawn schedule.
3. Виконайте 20-question test без key.
4. Перевірте всі чотири pieces у gameplay і neutral views.
5. Для кожної задокументуйте одну реальну weakness, root cause, correction і regression evidence.
6. Повторіть final H/M/L та profiling за fixed conditions.
7. Зберіть чотири case studies, reel, credits і delivery package.
8. Проведіть 3–5-хвилинний walkthrough випадково обраної piece.
9. Застосуйте rubric і gates. Не округлюйте score вгору, щоб пройти threshold.
10. Відкрийте key лише після зафіксованої оцінки.

Exact UE 5.8 UI, profiler availability і typed Niagara/Blueprint labels **Потребує ручної перевірки в Unreal Engine 5.8.**

---

# Частина A — Knowledge test: 20 points

По `1 point` за кожну відповідь. Відповідайте коротко, але конкретно.

1. Чому production milestone має exit criterion, а не лише дату?
2. Які дані мають бути зафіксовані в ethical reference record?
3. Яка комбінація копіювання робить reference use неоригінальним, навіть якщо texture створена заново?
4. Чому gameplay contact/telegraph має пріоритет над decorative layer?
5. Що означає category floor у 100-point piece rubric?
6. Назвіть critical cue `Resonant Edge`, який Low не може вилучити.
7. Чому три projectile variants не можуть відрізнятися лише hue?
8. Хто має володіти projectile movement і hit truth?
9. Чому `Glassbloom Ward` використовує per-character MID замість global MPC для color/state?
10. Для чого потрібен generation token у stateful effect?
11. Як перевірити `Rift Crown` hazard boundary parity?
12. Чому residue після завершення damage не повинно виглядати як active hazard?
13. Які умови мають бути однаковими у performance before/after?
14. Чому MRQ/beauty capture не є gameplay performance proof?
15. Що обов’язково зберігають H/M/L variants?
16. Які дані має містити first reel caption?
17. Що має показати authorship table?
18. Що робити з claim, для якого немає вимірювання/artifact?
19. Які чотири technical groups обов’язково пояснює кожен case study?
20. Чому overall score не може компенсувати critical error або category нижче floor?

**Floor частини A: `12/20`.**

---

# Частина B — Practical cross-project polish and presentation: 60 points

## B1. Чотири pieces — 40 points

Кожна piece оцінюється окремо по `10 points`:

| Criterion per piece | Points |
|---|---:|
| Final real-time gameplay і neutral view показують повний timing/state | 2 |
| Critical gameplay cues, silhouette, contact/radius/end-state правильні | 2 |
| Own textures/materials/Niagara і reusable Blueprint/data architecture читабельні | 2 |
| H/M/L та target performance evidence завершені | 2 |
| Case-study evidence, authorship і limitation повні | 2 |

`4 × 10 = 40`.

У practical subtotal piece з `≤5/10` вважається слабкою незалежно від інших pieces і потребує targeted remediation.

## B2. Cross-project consistency — 8 points

- `2` — naming, captions, build/profile і playback labels послідовні;
- `2` — чотири pieces візуально/функціонально різні, немає hue-only repetition;
- `2` — однаковий evidence standard для gameplay/neutral/H/M/L/performance;
- `2` — source/license/authorship records узгоджуються з captions/files.

## B3. Reel and downloadable delivery — 6 points

- `2` — strongest relevant work first, усі чотири pieces показані без timing deception;
- `2` — readable role/playback captions, lawful audio/font, mute-safe;
- `2` — README/manifest/files/links відкриваються й не містять private/unlicensed source data.

## B4. Technical breakdown coverage — 6 points

- `2` — reference principles + layer/timing/state maps;
- `2` — textures/material graphs + full Niagara stacks;
- `2` — Blueprint integration + performance before/after + H/M/L.

**Floor частини B: `36/60`.**

---

# Частина C — Troubleshooting and performance: 10 points

## C1. По одній documented weakness на piece — 8 points

Для кожної з чотирьох pieces, `2 points`:

- `1` — weakness відтворена й root cause доведений evidence;
- `1` — correction перевірено regression capture/test без втрати critical cue.

Weakness повинна бути реальною й конкретною, наприклад:

- melee contact timing або stale pooled parameter;
- projectile variant parity/hit radius;
- aura cancel/MID isolation/occupancy;
- ultimate boundary/contact/overlap.

## C2. Final H/M/L and profiling pass — 2 points

- `1` — fixed target sheet і identical final profile capture для всіх pieces;
- `1` — H/M/L cue checklist, named bottleneck/change і чесна remaining limitation.

**Floor частини C: `6/10`.**

---

# Частина D — Self-review and interview walkthrough: 10 points

## D1. Four case studies — 8 points

Кожна case study, `2 points`, стисло й конкретно містить:

- design/gameplay intent і constraints;
- layer/timing breakdown;
- material + Niagara architecture та Blueprint contract;
- iteration history від weakness/evidence до change;
- honest limitation/next iteration;
- authorship.

`2 points` — усі елементи ясні й підкріплені artifacts; `1` — один істотний gap; `0` — рекламний опис без технічного evidence.

## D2. Cross-project reflection and walkthrough — 2 points

- `1` — порівняно, які skills/risks різні у melee, projectile, aura й ultimate;
- `1` — 3–5-хвилинний walkthrough випадкової piece відповідає на `чому`, `як`, `як виміряно`, `що зробив/ла я`, `що лишилося`.

**Floor частини D: `6/10`.**

---

# Підсумковий rubric

| Part | Max | Floor |
|---|---:|---:|
| A. Knowledge test | 20 | 12 |
| B. Practical | 60 | 36 |
| C. Troubleshooting/performance | 10 | 6 |
| D. Self-review/walkthrough | 10 | 6 |
| **Total** | **100** | **80** |

## Gate G11

Assessment пройдено лише коли **всі** умови виконані:

1. assessment total `≥80/100`;
2. кожна assessment part досягла floor;
3. кожна з чотирьох portfolio pieces **окремо** має `≥80/100` за lesson rubric;
4. кожна rubric category кожної piece досягла свого floor;
5. немає critical gameplay або unresolved target-performance error;
6. VFX textures, meshes, materials, Niagara logic і integration є власними та explainable;
7. third-party assets lawful і credited; немає proprietary/confidential assets;
8. кожна piece має gameplay і neutral capture;
9. кожна piece має reference/layer/material/Niagara/Blueprint/performance/HML breakdown;
10. завершені чотири case studies, reel і organized delivery;
11. M/S ledger дорівнює `6/6 h`;
12. жодного unverifiable claim або прихованого playback/performance condition.

Critical fail не компенсується арифметикою: неправильний contact/hazard/state cue, відсутній Low/required tier, proprietary asset, falsified performance/authorship або project, який не працює з gameplay input/data.

---

# Weak-topic remediation

## Принцип

Remediation повторює **слабку тему**, а не весь block і не декоративний polish сильної piece. Вищий score іншої роботи не компенсує failed topic.

## Процес

1. Збережіть failed submission, rubric і raw evidence без перезапису.
2. Назвіть weak topic, criterion, symptom, reproduction і root-cause hypothesis.
3. Перегляньте лише official documentation і власні notes; tutorial/solution/key лишаються забороненими до завершення retake.
4. Створіть correction у новій version; не змінюйте camera/gameplay data для маскування.
5. Додайте новий test/variant, якого не було у першій спробі.
6. Повторіть identical target capture й regression check critical cues.
7. Перездайте тільки affected assessment part **і** пов’язаний project/category gate.
8. Старий і новий evidence зберігаються поруч; студент самостійно заповнює той самий deterministic before/after checklist і фіксує різницю. Optional peer може повторити перевірку, але не є умовою перездачі.

## Remediation matrix

| Weak topic | Мінімальна нова робота | New evidence | Retake scope |
|---|---|---|---|
| planning/reference ethics | revised brief/source-principle map і originality delta | before/revised board + authorship audit | A questions + affected piece category |
| gameplay readability/timing | root-cause timing/radius/state correction | fixed gameplay+neutral+debug comparison | B affected piece + gate |
| integration/lifecycle | reproduce stale/cancel/hit/data bug і fix | event/state log + ten-cycle regression | B/C affected piece |
| material/Niagara architecture | isolate opaque coupling/coverage/stack issue і refactor | graph/stack before-after + visual parity | B affected piece/category |
| performance/HML | profile bottleneck, change responsible layer, preserve cues | identical profiler before-after + HML grid | C + affected piece gate |
| breakdown/authorship | rebuild missing evidence/credits без нового beauty-only montage | corrected case study/manifest/link audit | B4/D + presentation category |
| knowledge test | explain each missed concept на новому project scenario | new answers without key/tutorial | only missed topic set, max recorded separately |

## Retake acceptance

- weak criterion досягає floor на новому evidence;
- related critical cues не regress;
- new variation доводить understanding, а не memorized solution;
- failed artifact лишається в audit trail;
- overall і всі project/category gates перераховані;
- якщо та сама topic знову нижче floor, збережіть evidence, зробіть паузу щонайменше 24 години, повторіть self-review за rubric і виконайте новий controlled experiment; optional peer feedback дозволений, але викладач/ментор не є обов’язковим.

## Офіційні джерела

- [Overview of Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-niagara-effects-for-unreal-engine)
- [Measuring Performance in Niagara](https://dev.epicgames.com/documentation/en-us/unreal-engine/measuring-performance-in-niagara)
- [Niagara Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-debugger-for-unreal-engine)
- [Performance Budgeting Using Effect Types](https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-budgeting-using-effect-types-in-niagara-for-unreal-engine)
- [Taking Screenshots](https://dev.epicgames.com/documentation/en-us/unreal-engine/taking-screenshots-in-unreal-engine)

URL перевірено 2026-07-27. **Потребує ручної перевірки в Unreal Engine 5.8.**
