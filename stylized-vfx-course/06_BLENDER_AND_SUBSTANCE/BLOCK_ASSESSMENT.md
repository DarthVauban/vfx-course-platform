# Assessment блока 06 — Production handoff Blender і Substance

## Мета

За обмежений час довести, що ти можеш самостійно підготувати stylized VFX geometry та procedural texture data до використання в Unreal Engine.

Assessment перевіряє не швидкість натискання buttons, а здатність:

- підтримувати asset contract;
- знаходити помилки на межі Blender → FBX → UE;
- створювати Designer graph, який можна повторно згенерувати;
- надавати стандартні bitmap-файли без стороннього plugin;
- перевіряти числові channels в UE;
- документувати рішення для іншого artist.

## Час і місце в курсі

**2 години.**

Ці 2 години вже включені до 3.5 годин практики уроку `05_procedural_texture_library_and_ue_validation.md`. Assessment **не додає** часу до блоку.

Рекомендований таймбокс:

| Частина | Час |
|---|---:|
| Теорія | 15 хв |
| Delivery geometry/FBX | 35 хв |
| Delivery procedural texture | 30 хв |
| Перевірка в UE | 20 хв |
| Troubleshooting/performance | 10 хв |
| Фінальна самоперевірка й submit | 10 хв |
| **Разом** | **120 хв** |

## Правила

- Виконуй assessment у новій папці `A06_<name>_<date>`.
- Почни з нової порожньої scene Blender та нового порожнього package Designer.
- **Готові source assets заборонені:** не копіюй meshes, UVs, graphs, node groups або textures з попередніх уроків, libraries чи зовнішніх packs.
- Дозволено використати лише default cube Blender як примітив, procedural nodes із node library Designer і власні нотатки без готової structure geometry/graph.
- Під час таймера **заборонено використовувати будь-які покрокові текстові або відеоуроки**, walkthroughs уроків, розв’язки вправ чи ключ assessment.
- Дозволено офіційну документацію Blender, Adobe та Epic.
- Не встановлюй і не використовуй сторонній Substance plugin для Unreal.
- Delivery texture — лише стандартні файли `.png`/`.tga`.
- Якщо точний label UI відрізняється, запиши фактичний label/version; не витрачай час на вгадування.
- Зупини роботу після 120 хв і надай поточний стан. Чесні докази незавершеності цінніші за приховану помилку.

## Пакет здачі

```text
A06_<name>_<date>/
├─ THEORY.md
├─ BLENDER/
│  ├─ A06_VFX_Geometry.blend
│  └─ A06_VFX_Geometry.fbx
├─ DESIGNER/
│  ├─ A06_VFX_Utility.sbs
│  └─ EXPORTS/
│     ├─ T_A06_Breakup_R_1024.png
│     ├─ T_A06_Sparks_G_1024.png
│     ├─ T_A06_Streak_B_1024.png
│     ├─ T_A06_SoftFade_A_1024.png
│     └─ T_A06_Utility_RGBA_1024.tga
├─ EVIDENCE/
│  ├─ 01_blender_geometry.png
│  ├─ 02_uv_and_vertex_color.png
│  ├─ 03_designer_graph.png
│  ├─ 04_exported_channels.png
│  ├─ 05_ue_mesh_validation.png
│  ├─ 06_ue_rgba_validation.png
│  └─ 07_ue_near_far.png
├─ TROUBLESHOOTING_AND_PERF.md
└─ SELF_REVIEW.md
```

Якщо utility для screenshots створює інші extensions, це допустимо. Назви та зміст evidence мають залишатися однозначними.

# Частина 1 — Теорія, 20 балів

Відповідай коротко: 2–4 речення або маленька схема на питання. Кожне питання — **2 бали**.

1. Чому Object transforms слід перевірити й зазвичай застосувати до export, і який ризик виникає при negative scale?
2. Коли overlapping UVs допустимі для VFX mesh, а коли вони ламають effect?
3. Як face orientation і normals впливають на односторонній translucent/additive card або slash?
4. Як закодувати root→tip mask у vertex color R, і чому endpoints мають бути перевірені чисельно/візуально?
5. Чому origin/pivot є частиною VFX asset contract для Niagara rotation, scale та placement?
6. Навіщо triangulate до export або принаймні зафіксувати triangulation, навіть якщо viewport показує quads/ngons?
7. Чим `Directional Warp` відрізняється від `Multiply` noise×gradient?
8. Що створює Designer `Distance`, і чому це не Unreal Mesh Distance Fields?
9. Назви дві умови, за яких RGBA packing корисний, і дві, за яких окремі textures кращі.
10. Чому VFX masks зазвичай імпортуються як data, а також що треба перевірити для tiny sparks у mips?

# Частина 2 — Практична робота, 60 балів

## A. Geometry та FBX delivery, 30 балів

У assessment `.blend` підготуй:

1. `SM_A06_Slash` — curved strip мінімум із 5 longitudinal sections, звуженням tip та чистою silhouette.
2. `SM_A06_Ring` **або** `SM_A06_Beam` — один radial або directional effect mesh з обґрунтованою low-poly density.
3. `SM_A06_Debris` — один простий, але виразний low-poly fragment.

Для всіх assets:

- читабельні names objects;
- transforms перевірено;
- origin/pivot задано навмисно;
- normals/face orientation перевірено;
- детермінована triangulation;
- UV0 зі зрозумілим контрактом direction;
- `VFXMask` color attribute.

Мінімальний `VFXMask` contract:

- slash: R = 0 на root і R = 1 на tip;
- ring/beam: R = 0 біля emission origin/base, R = 1 на outer edge/tip;
- debris: R кодує одну documented axis або radial falloff.

Експортуй вибрані meshes в один `A06_VFX_Geometry.fbx`. Додай до `SELF_REVIEW.md`:

```text
Forward assumption:
Up assumption:
Unit/scale assumption:
Transform status:
Triangulation method:
FBX exporter/version note:
```

Точні labels FBX exporter залежать від установленої версії Blender. Фактичні labels і values мають бути записані.

### Докази приймання

- Screenshot Blender з усіма meshes та names.
- Screenshot UV для slash і radial mesh.
- Докази face orientation/normals.
- Візуалізація `VFXMask`.
- Screenshot UE із правильними scale/orientation/pivots.

## B. Procedural texture delivery, 20 балів

Створи graph `G_A06_UtilityVariant` у `A06_VFX_Utility.sbs`.

Обов’язковий contract:

| Channel | Вміст |
|---|---|
| R | seamless breakup |
| G | sparse sparks/shards |
| B | directional streak |
| A | monotonic soft fade |

Обов’язкові nodes:

- `Gradient Linear 1`;
- `Perlin Noise` або інший задокументований seamless grayscale noise;
- `Levels`;
- `Blend`;
- `Tile Generator`;
- `Distance`;
- `Directional Warp`;
- `RGBA Merge`;
- п’ять nodes `Output`: чотири окремі й один packed.

Вимоги:

- фінальний розмір 1024×1024;
- новий variant: щонайменше два content parameters відрізняються від default уроку й записані;
- стабільні identifiers;
- окремі diagnostic outputs;
- packed output RGBA;
- стандартний export PNG/TGA;
- alpha перевірено поза Designer;
- `.sbsar` і Unreal plugin не використовуються.

## C. UE validation, 10 балів

Імпортуй assessment FBX та packed bitmap у course project.

Перевір:

1. Geometry scale/orientation.
2. Pivot/origin behavior.
3. UV direction на `SM_A06_Slash`.
4. `VFXMask` R через debug material.
5. Packed texture R/G/B/A окремо через `ComponentMask`.
6. Near/far behavior, особливо sparks.

Намір data texture і settings texture мають бути задокументовані. Точні settings, що залежать від версії: **Потребує ручної перевірки в Unreal Engine 5.8.**

У `SELF_REVIEW.md` додай таблицю:

| Перевірка | Очікувано | Спостережено | Pass/Fail | Дія |
|---|---|---|---|---|
| Slash UV direction | root→tip |  |  |  |
| VFXMask R | 0→1 |  |  |  |
| Packed R | breakup |  |  |  |
| Packed G | sparks |  |  |  |
| Packed B | streak |  |  |  |
| Packed A | fade |  |  |  |
| Far mip | key shape survives |  |  |  |

# Частина 3 — Troubleshooting і performance, 10 балів

У `TROUBLESHOOTING_AND_PERF.md` дай відповіді на два сценарії.

## Сценарій 1 — Першопричина, 6 балів

В UE `ComponentMask G` показує breakup замість sparks, а mid-gray виглядає світліше за Designer.

Опиши:

- щонайменше три правдоподібні hypotheses;
- порядок single-variable tests;
- як відрізнити channel swap від проблеми color-space;
- де виправляти root cause;
- які докази зберегти.

## Сценарій 2 — Рішення щодо budget, 4 бали

Slash material читає breakup, streak і fade разом. Spark emitter читає лише sparks, причому вони зникають у lower mips.

Запропонуй:

- залишити RGBA pack або redesign;
- resolution strategy;
- mip/content strategy;
- що виміряти в Unreal перед фінальним рішенням.

# Частина 4 — Self-review і документація, 10 балів

`SELF_REVIEW.md` має містити:

1. Таблицю версій: Blender, Designer, Unreal.
2. Контракт geometry asset.
3. Припущення export FBX.
4. Контракт channels texture.
5. Таблицю перевірки в UE.
6. Список files/evidence.
7. Одне найсильніше рішення й пояснення, чому воно працює.
8. Одне відоме обмеження.
9. Одну наступну iteration.
10. Чесний список незавершених checks, якщо такі є.

# Рубрика — 100 балів

## 1. Теорія — 20

| Критерій | Бали |
|---|---:|
| 10 відповідей × 2 | 20 |

Для кожного питання:

- 2: коректний mechanism + наслідок для VFX;
- 1: частково правильно, без наслідку або з малою неточністю;
- 0: неправильно, відсутнє або суперечить безпечному pipeline.

## 2A. Geometry/FBX — 30

| Критерій | Бали |
|---|---:|
| Topology/silhouette slash і ≥5 sections | 4 |
| Silhouette ring/beam і обґрунтована density | 3 |
| Простий debris, чиста low-poly topology | 3 |
| Контракти UV0 і придатний layout | 5 |
| Normals/face orientation | 3 |
| `VFXMask` semantics/endpoints | 4 |
| Pivots/origins/transforms | 3 |
| Deterministic triangulation | 2 |
| Export FBX вибраних objects, names і scale/orientation в UE | 3 |
| **Разом** | **30** |

## 2B. Procedural textures — 20

| Критерій | Бали |
|---|---:|
| Чотири читабельні semantic branches | 4 |
| Коректний ланцюг sparks Tile Generator → Distance | 3 |
| Контрольований streak Directional Warp | 3 |
| Стабільні Outputs і точний контракт RGBA | 3 |
| Output 1024 + дві задокументовані зміни parameters | 2 |
| Стандартні exports PNG/TGA і повторний reopen/channel inspection alpha | 3 |
| Організований і читабельний graph без залежності від plugin | 2 |
| **Разом** | **20** |

## 2C. UE validation — 10

| Критерій | Бали |
|---|---:|
| Scale/orientation/pivots mesh перевірено | 2 |
| Debug-перевірки UV і `VFXMask` | 2 |
| R/G/B/A відповідають source outputs | 3 |
| Data intent задокументовано | 1 |
| Докази mip near/far | 2 |
| **Разом** | **10** |

## 3. Troubleshooting/performance — 10

| Критерій | Бали |
|---|---:|
| Правдоподібні hypotheses | 2 |
| Упорядковані single-variable tests | 2 |
| Коректне розрізнення та виправлення root cause | 2 |
| Рішення щодо packing/resolution/mip | 2 |
| План вимірювань в UE | 2 |
| **Разом** | **10** |

## 4. Self-review/documentation — 10

| Критерій | Бали |
|---|---:|
| Versions/contracts/припущення export | 3 |
| Повні докази + таблиця перевірки | 3 |
| Найсильніше рішення пояснено | 1 |
| Відоме обмеження | 1 |
| Практична наступна iteration | 1 |
| Чесний статус завершення | 1 |
| **Разом** | **10** |

# Умови проходження

Assessment пройдено, якщо одночасно:

- загальний бал **≥80/100**;
- Theory **≥12/20**;
- Practical **≥36/60**;
- Troubleshooting/performance **≥6/10**;
- Self-review/documentation **≥6/10**;
- немає критичної помилки delivery.

Критичні помилки delivery:

- FBX не імпортується або geometry непридатна до перевірки;
- відсутні UV0 на key mesh;
- packed file не містить заявлених channels/alpha;
- texture delivery залежить від невказаного plugin;
- немає UE evidence;
- submit містить чужий або готовий asset без явного зазначення.

# Рівні результату

| Бал | Рівень |
|---|---|
| 95–100 | Production-ready handoff |
| 88–94 | Сильний результат, потрібне незначне очищення |
| 80–87 | Пройдено, є цільові прогалини |
| 70–79 | Майже пройдено, потрібне доопрацювання |
| <70 | Повторна побудова основ |

# Remediation та повторна спроба

1. За rubric познач найнижчу category.
2. Виконай лише відповідні drills:
   - прогалина geometry/FBX → повтори EX-L06-03-B;
   - прогалина graph/packing → EX-L06-05-A;
   - прогалина diagnosis/performance → EX-L06-05-B;
   - прогалина documentation → перезбери evidence sheet.
3. Зроби односторінковий журнал виправлень.
4. Через 24+ години повтори assessment з іншим seed/warp direction та іншим вибором radial mesh.
5. Для проходження знову потрібні total ≥80 і мінімальні бали в categories.

# Після завершення

Звір результат із [ключем assessment блока B06](../EXERCISE_ANSWERS/B06_BLOCK_ASSESSMENT_KEY.md) лише після зупинки таймера. Ключ містить еталонне рішення, але не є єдиним візуально правильним варіантом: оцінюються доведений контракт і коректність pipeline.
