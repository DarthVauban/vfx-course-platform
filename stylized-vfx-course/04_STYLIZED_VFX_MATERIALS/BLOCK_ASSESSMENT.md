# Block 04 Assessment — Stylized VFX Materials

## Правила

- Час: 2 години в межах L04-07.
- Максимум: 100 балів.
- Mastery: ≥80.
- Не відкривайте [ключ](../EXERCISE_ANSWERS/B04_BLOCK_ASSESSMENT_KEY.md) до завершення.
- Дозволено офіційну документацію та власні notes.
- Під час практичної контрольної заборонено користуватися покроковим text/video tutorial або lesson solution.
- Заборонено копіювати готовий graph без connection explanation.

Critical fail незалежно від суми:

- немає working Body/Edge masks;
- runtime input не має fallback і робить effect невидимим;
- Decal/Surface domain підмінено без пояснення;
- Low tier змінює gameplay area/timing;
- performance «покращення» отримано зміною camera/count/exposure без disclosure.

## Частина A — Тест, 20 балів

По 1 балу.

1. Чим erosion body mask відрізняється від edge band?
2. Навіщо clamp/saturate threshold ranges?
3. Чому distortion vector часто remap-лять з 0–1 у −1..1?
4. Чим flow map відрізняється від grayscale noise?
5. Як побудувати three-color ramp із двох Lerp?
6. Чому HDR intensity має бути окремо від palette color?
7. Від чого залежить Fresnel?
8. Що очікує `World Position Offset` input?
9. Чому WPO не змінює collision?
10. Яка роль Vertex Color R у contract L04-04?
11. Чому Sprite і Decal потребують окремих parents?
12. Де генерується Ribbon UV?
13. Коли `DepthFade` може погіршити effect?
14. Назвіть Particle Color data path.
15. Чим User Parameter відрізняється від Particle Attribute?
16. Коли DMI кращий за MPC?
17. Коли MPC правильний?
18. Чому static switches не слід множити без policy?
19. Який dependency direction має material family?
20. Чому material instruction count не є повним performance verdict?

## Частина B — Практична робота, 60 балів

Розширте Material Laboratory:

1. `MF_Assessment_ErodeEdge` із Body/Edge outputs — 10.
2. `MF_Assessment_ThreeColor` або reuse canonical function з connection list — 8.
3. Sprite parent із Particle Color, named `M_Charge01`, hard/soft intersection variants — 10.
4. Mesh parent із Vertex R WPO та optional Fresnel band — 10.
5. Ribbon parent із UV debug і width mask — 8.
6. Decal parent із documented project-compatible mode/receiver test — 8.
7. Три instances, що відрізняються не лише hue — 6.

Deliverables:

- graph screenshots із readable nodes;
- connection list;
- material properties table;
- instance values;
- black/mid/white validation;
- runtime `.0/.5/1` capture.

## Частина C — Troubleshooting і performance, 10 балів

Виправте один seeded issue:

- inverted erosion;
- missing Particle Color;
- Ribbon UV flip/stretch;
- decal wall spill;
- WPO bounds pop;
- translucent overlap/readability.

Надайте:

- symptom;
- isolated debug outputs;
- root cause;
- fix;
- regression test;
- Shader Complexity/overdraw comparison до/після.

## Частина D — Self-review, 10 балів

- dependency diagram — 2;
- parameter/source/scope/default table — 2;
- High/Medium/Low policy — 2;
- known limitations — 2;
- checklist із чесними pass/fail — 2.

## Completion criteria

- ≥80/100;
- no critical fail;
- усі чотири renderer parents validated;
- runtime path працює;
- cost report reproducible;
- слабкі criteria перероблено до mastery, а не компенсовано unrelated polish.

## Повторне проходження слабких тем

Якщо результат нижчий за 80/100 або є critical fail:

1. Позначте criteria з найнижчим score і поверніться лише до пов’язаних уроків L04-01…L04-07.
2. Із чистого graph перебудуйте failed function, renderer parent, runtime path або performance test без lesson solution.
3. Виконайте новий visual variant, щоб не пройти gate механічним запам’ятовуванням попередньої відповіді.
4. Повторіть relevant background/depth/binding/overdraw regression tests.
5. Перездайте failed practical categories; сильні categories не компенсують непрацюючий core graph, runtime binding або gameplay-cue performance pass.
